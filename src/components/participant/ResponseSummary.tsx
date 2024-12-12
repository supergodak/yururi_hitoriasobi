import React from 'react';
import { ResponseSymbol } from './ResponseSymbol';

interface ResponseSummaryProps {
  dateOptionId: string;
  getResponseCount: (dateOptionId: string, response: 'yes' | 'no' | 'maybe') => number;
}

export function ResponseSummary({
  dateOptionId,
  getResponseCount,
}: ResponseSummaryProps) {
  return (
    <div className="text-xs font-normal mt-1">
      <ResponseSymbol response="yes" />: {getResponseCount(dateOptionId, 'yes')}
      &nbsp;<ResponseSymbol response="no" />: {getResponseCount(dateOptionId, 'no')}
      &nbsp;<ResponseSymbol response="maybe" />: {getResponseCount(dateOptionId, 'maybe')}
    </div>
  );
}