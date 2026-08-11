import { ExtractedData } from '@/lib/schemas';

export type Priority = 'high' | 'medium' | 'low';

export function calculatePriority(data: ExtractedData): Priority {
  if (!data.isGenuine) return 'low';

  const budget = data.budgetAmountNormalizedUSD || 0;
  const isHighPriorityService = ['ai', 'blockchain', 'web'].includes(data.serviceLine);

  if (budget >= 20000 || (isHighPriorityService && budget >= 10000)) {
    return 'high';
  }

  if (budget >= 5000 || (data.serviceLine !== 'other' && budget > 0)) {
    return 'medium';
  }

  return 'low';
}