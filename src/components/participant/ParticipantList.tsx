import React from 'react';
import type { DateOption, Participant } from '../../types';
import { formatDate } from '../../utils/date';
import { ResponseSummary } from './ResponseSummary';
import { ParticipantRow } from './ParticipantRow';
import { useParticipants } from '../../hooks/useParticipants';

interface ParticipantListProps {
  dateOptions: DateOption[];
  participants: Participant[];
}

export default function ParticipantList({
  dateOptions,
  participants,
}: ParticipantListProps) {
  const { uniqueParticipants, getResponseCount } = useParticipants(participants);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 pb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          回答した人
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          ※未回答の人は表示されません
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                参加者
              </th>
              {dateOptions.map((option) => (
                <th
                  key={option.id}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {formatDate(option.date)}
                  <br />
                  {option.start_time}〜{option.end_time}
                  <ResponseSummary
                    dateOptionId={option.id}
                    getResponseCount={getResponseCount}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {uniqueParticipants.map((participant) => (
              <ParticipantRow
                key={participant.email}
                participant={participant}
                dateOptions={dateOptions}
                participants={participants}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}