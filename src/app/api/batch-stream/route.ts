import { NextRequest } from 'next/server';
import pLimit from 'p-limit';
import { extractEnquiryData } from '@/services/llm/extractor';
import { calculatePriority } from '@/services/scoring/priorityScorer';
import { prisma } from '@/db';
import { createManagedField } from '@/lib/utils';


export const maxDuration = 60; 
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { enquiries } = body; 

    if (!Array.isArray(enquiries) || enquiries.length === 0) {
      return new Response(JSON.stringify({ error: 'Array of enquiries is required' }), { status: 400 });
    }

    const limit = pLimit(3);
    const total = enquiries.length;
    let completed = 0;

    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, data: unknown) => {
          controller.enqueue(new TextEncoder().encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };

        sendEvent('start', { message: 'Batch processing started', total });

        const tasks = enquiries.map((rawText, index) =>
          limit(async () => {
            try {
              const extractedData = await extractEnquiryData(rawText);
              const priority = calculatePriority(extractedData);
              const newEnquiry = await prisma.enquiry.create({
                data: {
                  rawText,
                  company: createManagedField(extractedData.company),
                  contactName: createManagedField(extractedData.contactName),
                  contactEmail: createManagedField(extractedData.contactEmail),
                  serviceLine: createManagedField(extractedData.serviceLine),
                  budgetRawText: createManagedField(extractedData.budgetRawText),
                  budgetNormalizedUSD: createManagedField(extractedData.budgetAmountNormalizedUSD),
                  timeline: createManagedField(extractedData.timeline),
                  summary: createManagedField(extractedData.summary),
                  isGenuine: createManagedField(extractedData.isGenuine),
                  priority,
                  status: 'new',
                  extractionVersion: 1,
                },
              });

              completed++;
              sendEvent('progress', { 
                index, 
                status: 'success', 
                completed, 
                total, 
                data: newEnquiry 
              });

            } catch (error: unknown) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error';
              completed++;
              sendEvent('progress', { 
                index, 
                status: 'error', 
                completed, 
                total, 
                error: errorMessage,
                rawTextPreview: rawText.substring(0, 50) + '...'
              });
            }
          })
        );

        await Promise.allSettled(tasks);
        sendEvent('complete', { message: 'Batch processing finished' });
        controller.close();
      },
    });
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to initialize batch stream';
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}