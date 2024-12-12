import React from 'react';
import { useEventStore } from '../store/eventStore';
import { useAuthStore } from '../store/authStore';
import { formatDate } from '../utils/date';
import ParticipantList from './participant/ParticipantList';
import ResponseForm from './ResponseForm';
import { VenueOptions } from './venue/VenueOptions';

interface EventDetailsProps {
  eventId: string;
  invitedEmail: string | null;
}

export default function EventDetails({ eventId, invitedEmail }: EventDetailsProps) {
  const { user } = useAuthStore();
  const {
    currentEvent,
    dateOptions,
    venueOptions,
    participants,
    loading,
    error,
  } = useEventStore();

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-3 rounded">
        {error}
      </div>
    );
  }

  if (!currentEvent) {
    return <div>イベントが見つかりません</div>;
  }

  // ログインユーザーまたは招待された参加者のみアクセス可能
  const canAccess = user || invitedEmail;

  if (!canAccess) {
    return (
      <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
        このURLは無効です。招待メールに記載されたURLからアクセスしてください。
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {currentEvent.title}
        </h1>
        <p className="text-gray-600 mb-4 whitespace-pre-wrap">
          {currentEvent.description}
        </p>
        <div className="text-sm text-gray-500">
          作成日: {formatDate(currentEvent.created_at)}
        </div>
      </div>

      {venueOptions.length > 0 && (
        <VenueOptions
          eventId={eventId}
          venueOptions={venueOptions}
          participants={participants}
          invitedEmail={invitedEmail}
        />
      )}

      <ResponseForm
        eventId={eventId}
        dateOptions={dateOptions}
        invitedEmail={invitedEmail}
      />

      <ParticipantList
        dateOptions={dateOptions}
        participants={participants}
      />
    </div>
  );
}