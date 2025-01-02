import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
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
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    currentEvent,
    dateOptions,
    venueOptions,
    participants,
    loading,
    error,
    deleteEvent,
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

  const isCreator = user?.id === currentEvent.creator_id;

  const handleDelete = async () => {
    if (!isCreator) return;

    if (window.confirm('このイベントを削除してもよろしいですか？\n削除すると元に戻せません。')) {
      try {
        await deleteEvent(eventId);
        navigate('/');
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('イベントの削除中にエラーが発生しました');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
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
          {isCreator && (
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
              title="イベントを削除"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <VenueOptions
        eventId={eventId}
        venueOptions={venueOptions}
        participants={participants}
        invitedEmail={invitedEmail}
      />

      <ResponseForm
        eventId={eventId}
        dateOptions={dateOptions}
        venueOptions={venueOptions}
        invitedEmail={invitedEmail}
      />

      <ParticipantList
        dateOptions={dateOptions}
        participants={participants}
      />
    </div>
  );
}