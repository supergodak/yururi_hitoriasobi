import React from 'react';
import type { DateOption, Participant } from '../../types';
import { ResponseCell } from './ResponseCell';

interface ParticipantRowProps {
  participant: {
    email: string;
    name: string;
  };
  dateOptions: DateOption[];
  participants: Participant[];
}

export function ParticipantRow({
  participant,
  dateOptions,
  participants,
}: ParticipantRowProps) {
  const getParticipantResponse = (dateOptionId: string) => {
    const response = participants.find(
      (p) => p.email === participant.email && p.date_option_id === dateOptionId
    );
    return response?.response || null;
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {participant.name || '名前未設定'}
        </div>
        <div className="text-sm text-gray-500">
          {participant.email}
        </div>
      </td>
      {dateOptions.map((option) => (
        <ResponseCell
          key={option.id}
          response={getParticipantResponse(option.id)}
        />
      ))}
    </tr>
  );
}