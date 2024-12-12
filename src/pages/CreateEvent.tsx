import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useEventStore } from '../store/eventStore';
import EventForm from '../components/EventForm';

export default function CreateEvent() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createEvent } = useEventStore();

  if (!user) {
    return (
      <div className="text-center">
        <p className="text-gray-600">
          イベントを作成するにはログインが必要です。
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        新規イベント作成
      </h1>
      <EventForm />
    </div>
  );
}