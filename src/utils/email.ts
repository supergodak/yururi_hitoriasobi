import emailjs from '@emailjs/browser';
import { generateInvitationToken } from './invitation';

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
        message: '', // 空の場合でも必要
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
}: SendEventParticipationEmailParams): Promise<void> {
  try {
    const responsesSummary = Object.entries(responses)
      .map(([dateId, response]) => {
        const symbol = response === 'yes' ? '○' : response === 'no' ? '×' : '△';
        return `${dateId}: ${symbol}`;
      })
      .join('\n');

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_RESPONSE_TEMPLATE_ID,
      {
        to_email: to,
        event_id: eventId,
        responses: responsesSummary,
        event_url: `${window.location.origin}/events/${eventId}`,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
  } catch (error) {
    console.error('Error sending participation email:', error);
    throw error;
  }
}