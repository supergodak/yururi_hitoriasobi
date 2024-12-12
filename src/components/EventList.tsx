import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useEventStore } from '../store/eventStore';
import { formatDate } from '../utils/date';

export default function EventList() {
  const { user } = useAuthStore();
  const { events, loading, error, fetchEvents } = useEventStore();

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user, fetchEvents]);

  if (!user) {
    return (
      <div className="text-center text-gray-600">
        イベント一覧を表示するにはログインが必要です
      </div>
    );
  }

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

  if (events.length === 0) {
    return <div>イベントがありません</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Link
          key={event.id}
          to={`/events/${event.id}`}
          className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {event.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {event.description}
            </p>
            <div className="text-sm text-gray-500">
              作成日: {formatDate(event.created_at)}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}