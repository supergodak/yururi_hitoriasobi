import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface UseVenueVotingProps {
  eventId: string;
  invitedEmail: string | null;
}

export function useVenueVoting({ eventId, invitedEmail }: UseVenueVotingProps) {
  const [selectedVenue, setSelectedVenue] = useState<string>('');

  const submitVenueVote = async (venueId: string) => {
    if (!invitedEmail) {
      throw new Error('招待メールのURLからアクセスしてください');
    }

    try {
      // 既存の投票を削除
      await supabase
        .from('participants')
        .update({ venue_option_id: null })
        .match({ event_id: eventId, email: invitedEmail });

      // 新しい投票を登録
      const { error } = await supabase
        .from('participants')
        .update({ venue_option_id: venueId })
        .match({ event_id: eventId, email: invitedEmail });

      if (error) throw error;
    } catch (error) {
      console.error('Error submitting venue vote:', error);
      throw new Error('投票の送信中にエラーが発生しました');
    }
  };

  return {
    selectedVenue,
    setSelectedVenue,
    submitVenueVote,
  };
}