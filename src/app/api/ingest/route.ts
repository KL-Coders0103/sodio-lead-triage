import { NextResponse } from 'next/server';
import { extractEnquiryData } from '@/services/llm/extractor';
import { calculatePriority } from '@/services/scoring/priorityScorer';
import { prisma } from '@/db';
import { createManagedField } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rawText } = body;

    if (!rawText || typeof rawText !== 'string') {
      return NextResponse.json(
        { error: 'rawText is required and must be a string' },
        { status: 400 }
      );
    }

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

    return NextResponse.json({ success: true, data: newEnquiry }, { status: 201 });
  } catch (error: unknown) {
    console.error('Ingest Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    return NextResponse.json(
      { error: 'Failed to process enquiry', details: errorMessage },
      { status: 500 }
    );
  }
}