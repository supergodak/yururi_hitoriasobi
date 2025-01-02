import type { Participant } from '../types';

interface UniqueParticipant {
  email: string;
  name: string;
}

export function useParticipants(participants: Participant[]) {
  // 特定の日時オプションと回答に対する回答者数を取得
  const getResponseCount = (dateOptionId: string, response: 'yes' | 'no' | 'maybe') => {
    return participants.filter(
      (p) => p.date_option_id === dateOptionId && p.response === response
    ).length;
  };

  // 回答済みの参加者のリストを取得（nullの回答は除外）
  const uniqueParticipants = Array.from(
    new Set(
      participants
        .filter(p => p.response !== null)
        .map(p => p.email)
    )
  ).map((email) => {
    const participant = participants.find((p) => p.email === email);
    return {
      email,
      name: participant?.name || '',
    };
  });

  return {
    uniqueParticipants,
    getResponseCount,
  };
}