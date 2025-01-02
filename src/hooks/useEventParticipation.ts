import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { DateOption } from '../types';
import { sendEventParticipationEmail } from '../utils/email';

interface UseEventParticipationProps {
  eventId: string;
  dateOptions: DateOption[];
  onParticipationUpdate: () => void;
}

export function useEventParticipation({
  eventId,
  dateOptions,
  onParticipationUpdate,
}: UseEventParticipationProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitParticipation = async (
    email: string,
    name: string | undefined,
    responses: Record<string, 'yes' | 'no' | 'maybe'>,
    venueOptionId?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      // イベント作成者のメールアドレスを取得
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('creator_id')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;

      const { data: creator, error: creatorError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', event.creator_id)
        .single();

      if (creatorError) throw creatorError;

      // 既存の回答を削除
      await supabase
        .from('participants')
        .delete()
        .match({ event_id: eventId, email });

      // 新しい回答を作成
      const participantData = dateOptions.map((option) => ({
        event_id: eventId,
        date_option_id: option.id,
        email,
        name,
        response: responses[option.id] || 'no',
        venue_option_id: venueOptionId,
      }));

      const { error: insertError } = await supabase
        .from('participants')
        .insert(participantData);

      if (insertError) {
        console.error('Error inserting participants:', insertError);
        throw new Error('回答の登録中にエラーが発生しました');
      }

      // イベント作成者にメール通知
      await sendEventParticipationEmail({
        to: creator.email,
        eventId,
        responses,
        participantEmail: email,
        participantName: name,
      });

      onParticipationUpdate();
    } catch (error) {
      console.error('Error submitting participation:', error);
      setError('回答の送信中にエラーが発生しました。もう一度お試しください。');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitParticipation,
    loading,
    error,
  };
}