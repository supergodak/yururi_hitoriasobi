import React from 'react';
import type { DateOption, Participant } from '../types';
import { formatDate } from '../utils/date';

interface ParticipantListProps {
  dateOptions: DateOption[];
  participants: Participant[];
}

export default function ParticipantList({
  dateOptions,
  participants,
}: ParticipantListProps) {
  // 特定の日時オプションに対する回答のカウント
  const getResponseCount = (dateOptionId: string, response: 'yes' | 'no' | 'maybe') => {
    return participants.filter(
      (p) => p.date_option_id === dateOptionId && p.response === response
    ).length;
  };

  const getParticipantResponse = (email: string, dateOptionId: string) => {
    const participant = participants.find(
      (p) => p.email === email && p.date_option_id === dateOptionId
    );
    return participant?.response || null;
  };

  const uniqueParticipants = Array.from(
    new Set(participants.map((p) => p.email))
  ).map((email) => {
    const participantResponses = participants.filter((p) => p.email === email);
    const participant = participantResponses[0];
    const responseCount = participantResponses.filter(p => p.response !== null).length;
    return {
      email,
      name: participant?.name || '',
      responseCount,
    };
  });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <h2 className="text-lg font-semibold text-gray-900 p-6 pb-4">
        参加者一覧
      </h2>
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
                  <div className="text-xs font-normal mt-1">
                    ○: {getResponseCount(option.id, 'yes')}
                    &nbsp;×: {getResponseCount(option.id, 'no')}
                    &nbsp;△: {getResponseCount(option.id, 'maybe')}
                  </div>
                </th>
              ))}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                回答回数
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {uniqueParticipants.map(({ email, name, responseCount }) => (
              <tr key={email}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {name || '名前未設定'}
                  </div>
                  <div className="text-sm text-gray-500">{email}</div>
                </td>
                {dateOptions.map((option) => {
                  const response = getParticipantResponse(email, option.id);
                  return (
                    <td
                      key={option.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {response === 'yes'
                        ? '○'
                        : response === 'no'
                        ? '×'
                        : response === 'maybe'
                        ? '△'
                        : '-'}
                    </td>
                  );
                })}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {responseCount}回
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}