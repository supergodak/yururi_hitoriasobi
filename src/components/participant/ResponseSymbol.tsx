import React from 'react';

type Response = 'yes' | 'no' | 'maybe' | null;

interface ResponseSymbolProps {
  response: Response;
}

export function ResponseSymbol({ response }: ResponseSymbolProps) {
  switch (response) {
    case 'yes':
      return <span>○</span>;
    case 'no':
      return <span>×</span>;
    case 'maybe':
      return <span>△</span>;
    default:
      return <span>-</span>;
  }
}