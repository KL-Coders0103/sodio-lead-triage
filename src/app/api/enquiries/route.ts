import { NextResponse } from 'next/server';
import { prisma } from '@/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json({ success: true, data: enquiries });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to fetch enquiries', details: errorMessage }, { status: 500 });
  }
}