import React, { useState, useEffect } from 'react';
import type { DateOption, VenueOption } from '../types';
import { useEventParticipation } from '../hooks/useEventParticipation';

interface ResponseFormProps {
  eventId: string;
  dateOptions: DateOption[];
  venueOptions: VenueOption[];
  invitedEmail: string | null;
}

export default function ResponseForm({
  eventId,
  dateOptions,
  venueOptions,
  invitedEmail,
}: ResponseFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [responses, setResponses] = useState<Record<string, 'yes' | 'no' | 'maybe'>>({});
  const { submitParticipation, loading, error } = useEventParticipation({
    eventId,
    dateOptions,
    onParticipationUpdate: () => {
      // 回答後にフォームをリセット
      setEmail('');
      setName('');
      setResponses({});
    },
  });

  useEffect(() => {
    if (invitedEmail) {
      setEmail(invitedEmail);
    }
  }, [invitedEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invitedEmail) {
      alert('このURLは無効です。招待メールに記載されたURLからアクセスしてください。');
      return;
    }

    if (email !== invitedEmail) {
      alert('招待されたメールアドレスと異なるアドレスでは回答できません。');
      return;
    }

    try {
      await submitParticipation(email, name, responses);
      alert('回答を送信しました');
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('回答の送信中にエラーが発生しました');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        出欠を回答する
      </h2>
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="space-y-4 mb-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            名前
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* 日時の選択 */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">
          候補日時の回答
        </h3>
        {dateOptions.map((option) => (
          <div key={option.id} className="border rounded-md p-4">
            <p className="font-medium text-gray-900 mb-2">
              {option.date} {option.start_time}〜{option.end_time}
            </p>
            <div className="flex gap-4">
              {(['yes', 'no', 'maybe'] as const).map((value) => (
                <label key={value} className="inline-flex items-center">
                  <input
                    type="radio"
                    name={`response-${option.id}`}
                    value={value}
                    checked={responses[option.id] === value}
                    onChange={(e) =>
                      setResponses((prev) => ({
                        ...prev,
                        [option.id]: e.target.value as 'yes' | 'no' | 'maybe',
                      }))
                    }
                    required
                    className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {value === 'yes'
                      ? '○'
                      : value === 'no'
                      ? '×'
                      : '△'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? '送信中...' : '回答を送信'}
      </button>
    </form>
  );
}