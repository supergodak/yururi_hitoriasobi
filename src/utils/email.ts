import emailjs from '@emailjs/browser';
import { generateInvitationToken } from './invitation';
import { supabase } from '../lib/supabase';
import { formatDate } from './date';

interface SendEventCreationEmailParams {
  to: string;
  eventTitle: string;
  eventUrl: string;
  description?: string;
}

interface SendEventParticipationEmailParams {
  to: string;
  eventId: string;
  responses: Record<string, 'yes' | 'no' | 'maybe'>;
  participantEmail: string;
  participantName?: string;
}

export async function sendEventCreationEmail({
  to,
  eventTitle,
  eventUrl,
  description,
}: SendEventCreationEmailParams): Promise<void> {
  try {
    const token = generateInvitationToken(to, eventUrl.split('/').pop()!);
    const invitationUrl = `${eventUrl}?token=${token}`;

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_INVITATION_TEMPLATE_ID,
      {
        to_email: to,
        from_name: 'ゆるりスケジュール調整所',
        recipient: to,
        event_title: eventTitle,
        event_description: description || '',
        event_url: invitationUrl,
        message: '',
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
  } catch (error) {
    console.error('Error sending event creation email:', error);
    throw error;
  }
}

export async function sendEventParticipationEmail({
  to,
  eventId,
  responses,
  participantEmail,
  participantName,
}: SendEventParticipationEmailParams): Promise<void> {
  try {
    // 日時オプションの情報を取得
    const { data: dateOptions } = await supabase
      .from('date_options')
      .select('*')
      .eq('event_id', eventId)
      .order('date', { ascending: true });

    if (!dateOptions) throw new Error('日時オプションが見つかりません');

    // 人間が読める形式で回答を整形
    const responsesSummary = dateOptions
      .map((option) => {
        const response = responses[option.id];
        const symbol = response === 'yes' ? '○' : response === 'no' ? '×' : '△';
        return `${formatDate(option.date)} ${option.start_time}〜${option.end_time}: ${symbol}`;
      })
      .join('\n');

    const eventUrl = `${window.location.origin}/events/${eventId}`;

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_RESPONSE_TEMPLATE_ID,
      {
        to_email: to,
        event_id: eventId,
        participant_email: participantEmail,
        participant_name: participantName || '名前未設定',
        responses: responsesSummary,
        event_url: eventUrl,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
  } catch (error) {
    console.error('Error sending participation email:', error);
    throw error;
  }
}