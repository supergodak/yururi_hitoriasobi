import React from 'react';
import { ResponseSymbol } from './ResponseSymbol';

interface ResponseCellProps {
  response: 'yes' | 'no' | 'maybe' | null;
}

export function ResponseCell({ response }: ResponseCellProps) {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      <ResponseSymbol response={response} />
    </td>
  );
}