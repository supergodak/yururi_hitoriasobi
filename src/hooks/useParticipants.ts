import type { Participant } from '../types';

interface UniqueParticipant {
  email: string;
  name: string;
}

export function useParticipants(participants: Participant[]) {
  const getResponseCount = (dateOptionId: string, response: 'yes' | 'no' | 'maybe') => {
    return participants.filter(
      (p) => p.date_option_id === dateOptionId && p.response === response
    ).length;
  };

  const uniqueParticipants = Array.from(
    new Set(participants.map((p) => p.email))
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