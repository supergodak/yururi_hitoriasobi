import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { DateOption, VenueOption } from '../types';
import { useEventStore } from '../store/eventStore';
import { useAuthStore } from '../store/authStore';

export default function EventForm() {
  const navigate = useNavigate();
  const { createEvent, loading, error } = useEventStore();
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [venueOptions, setVenueOptions] = useState<
    Omit<VenueOption, 'id' | 'event_id' | 'created_at' | 'updated_at'>[]
  >([{ name: '', url: '' }]);
  const [dateOptions, setDateOptions] = useState<
    Omit<DateOption, 'id' | 'event_id' | 'created_at'>[]
  >([{ date: '', start_time: '', end_time: '' }]);
  const [participants, setParticipants] = useState<string[]>([
    user?.email || '', // イベント作成者のメールアドレス
    '', // 追加の参加者枠
    '', // 追加の参加者枠
    '', // 追加の参加者枠
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const eventId = await createEvent(
        title,
        description,
        venueOptions.filter((v) => v.name.trim()),
        dateOptions,
        participants.filter(Boolean)
      );
      navigate(`/events/${eventId}`);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const addVenueOption = () => {
    setVenueOptions([...venueOptions, { name: '', url: '' }]);
  };

  const removeVenueOption = (index: number) => {
    setVenueOptions(venueOptions.filter((_, i) => i !== index));
  };

  const addDateOption = () => {
    setDateOptions([...dateOptions, { date: '', start_time: '', end_time: '' }]);
  };

  const removeDateOption = (index: number) => {
    setDateOptions(dateOptions.filter((_, i) => i !== index));
  };

  const addParticipant = () => {
    setParticipants([...participants, '']);
  };

  const removeParticipant = (index: number) => {
    if (index === 0) return; // イベント作成者は削除不可
    setParticipants(participants.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div>作成中...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          イベント名
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          説明
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          会場候補
        </label>
        <div className="space-y-4">
          {venueOptions.map((option, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1 space-y-4">
                <input
                  type="text"
                  placeholder="会場名"
                  value={option.name}
                  onChange={(e) =>
                    setVenueOptions(
                      venueOptions.map((o, i) =>
                        i === index ? { ...o, name: e.target.value } : o
                      )
                    )
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <input
                  type="url"
                  placeholder="店舗URL（食べログなど）"
                  value={option.url || ''}
                  onChange={(e) =>
                    setVenueOptions(
                      venueOptions.map((o, i) =>
                        i === index ? { ...o, url: e.target.value } : o
                      )
                    )
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              {venueOptions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVenueOption(index)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addVenueOption}
          className="mt-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          会場候補を追加
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          候補日時
        </label>
        <div className="space-y-4">
          {dateOptions.map((option, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1 space-y-4">
                <input
                  type="date"
                  value={option.date}
                  onChange={(e) =>
                    setDateOptions(
                      dateOptions.map((o, i) =>
                        i === index ? { ...o, date: e.target.value } : o
                      )
                    )
                  }
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <div className="flex gap-4">
                  <input
                    type="time"
                    value={option.start_time}
                    onChange={(e) =>
                      setDateOptions(
                        dateOptions.map((o, i) =>
                          i === index ? { ...o, start_time: e.target.value } : o
                        )
                      )
                    }
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="text-gray-500">〜</span>
                  <input
                    type="time"
                    value={option.end_time}
                    onChange={(e) =>
                      setDateOptions(
                        dateOptions.map((o, i) =>
                          i === index ? { ...o, end_time: e.target.value } : o
                        )
                      )
                    }
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              {dateOptions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDateOption(index)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addDateOption}
          className="mt-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          候補日時を追加
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          参加者のメールアドレス
        </label>
        <div className="space-y-4">
          {participants.map((email, index) => (
            <div key={index} className="flex gap-4 items-center">
              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setParticipants(
                    participants.map((p, i) =>
                      i === index ? e.target.value : p
                    )
                  )
                }
                placeholder="example@example.com"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                readOnly={index === 0} // イベント作成者のメールアドレスは編集不可
              />
              {index > 0 && ( // イベント作成者以外の参加者は削除可能
                <button
                  type="button"
                  onClick={() => removeParticipant(index)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addParticipant}
          className="mt-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          参加者を追加
        </button>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          イベントを作成
        </button>
      </div>
    </form>
  );
}