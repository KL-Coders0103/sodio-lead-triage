import { NextResponse } from 'next/server';
import { prisma } from '@/db';
import { extractEnquiryData } from '@/services/llm/extractor';
import { calculatePriority } from '@/services/scoring/priorityScorer';
import { ExtractedData } from '@/lib/schemas';

type JsonPrimitive = string | number | boolean | null;

type ManagedFieldData<T = JsonPrimitive> = {
  extracted: T;
  value: T;
  isOverridden: boolean;
};

function mergeField<T extends JsonPrimitive>(existingField: unknown, newExtractedValue: T) {
  const field = existingField as ManagedFieldData<T> | null;
  return {
    extracted: newExtractedValue,
    value: field?.isOverridden ? field.value : newExtractedValue,
    isOverridden: field?.isOverridden || false,
  };
}

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  try {
    const { field, value } = await req.json();
    
    const existing = await prisma.enquiry.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const existingData = existing as unknown as Record<string, ManagedFieldData>;

    const updatedField = {
      extracted: existingData[field]?.extracted ?? null,
      value: value as JsonPrimitive, 
      isOverridden: true,
    };

    const currentDataForScoring: ExtractedData = {
      company: field === 'company' ? (value as string) : (existingData.company?.value as string | null),
      contactName: field === 'contactName' ? (value as string) : (existingData.contactName?.value as string | null),
      contactEmail: field === 'contactEmail' ? (value as string) : (existingData.contactEmail?.value as string | null),
      serviceLine: field === 'serviceLine' ? (value as "ai" | "blockchain" | "web" | "mobile" | "game" | "other") : (existingData.serviceLine?.value as "ai" | "blockchain" | "web" | "mobile" | "game" | "other"),
      budgetRawText: field === 'budgetRawText' ? (value as string) : (existingData.budgetRawText?.value as string | null),
      budgetAmountNormalizedUSD: field === 'budgetAmountNormalizedUSD' ? (value as number) : (existingData.budgetNormalizedUSD?.value as number | null),
      timeline: field === 'timeline' ? (value as string) : (existingData.timeline?.value as string | null),
      summary: field === 'summary' ? (value as string) : (existingData.summary?.value as string),
      isGenuine: field === 'isGenuine' ? (value as boolean) : (existingData.isGenuine?.value as boolean),
    };

    const newPriority = calculatePriority(currentDataForScoring);

    const updated = await prisma.enquiry.update({
      where: { id: params.id },
      data: {
        [field]: updatedField,
        priority: newPriority,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const existing = await prisma.enquiry.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const newExtraction = await extractEnquiryData(existing.rawText);

    const mergedData = {
      company: mergeField(existing.company, newExtraction.company),
      contactName: mergeField(existing.contactName, newExtraction.contactName),
      contactEmail: mergeField(existing.contactEmail, newExtraction.contactEmail),
      serviceLine: mergeField(existing.serviceLine, newExtraction.serviceLine),
      budgetRawText: mergeField(existing.budgetRawText, newExtraction.budgetRawText),
      budgetNormalizedUSD: mergeField(existing.budgetNormalizedUSD, newExtraction.budgetAmountNormalizedUSD),
      timeline: mergeField(existing.timeline, newExtraction.timeline),
      summary: mergeField(existing.summary, newExtraction.summary),
      isGenuine: mergeField(existing.isGenuine, newExtraction.isGenuine),
    };

    const currentDataForScoring: ExtractedData = {
      company: mergedData.company.value as string | null,
      contactName: mergedData.contactName.value as string | null,
      contactEmail: mergedData.contactEmail.value as string | null,
      serviceLine: mergedData.serviceLine.value as "ai" | "blockchain" | "web" | "mobile" | "game" | "other",
      budgetRawText: mergedData.budgetRawText.value as string | null,
      budgetAmountNormalizedUSD: mergedData.budgetNormalizedUSD.value as number | null,
      timeline: mergedData.timeline.value as string | null,
      summary: mergedData.summary.value as string,
      isGenuine: mergedData.isGenuine.value as boolean,
    };

    const newPriority = calculatePriority(currentDataForScoring);

    const updated = await prisma.enquiry.update({
      where: { id: params.id },
      data: {
        ...mergedData,
        priority: newPriority,
        extractionVersion: { increment: 1 },
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to re-extract' }, { status: 500 });
  }
}