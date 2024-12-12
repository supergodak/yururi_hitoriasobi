import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { VenueOption, Participant } from '../../types';
import { useVenueVoting } from '../../hooks/useVenueVoting';

interface VenueOptionsProps {
  eventId: string;
  venueOptions: VenueOption[];
  participants: Participant[];
  invitedEmail: string | null;
}

export function VenueOptions({
  eventId,
  venueOptions,
  participants,
  invitedEmail,
}: VenueOptionsProps) {
  const { selectedVenue, setSelectedVenue, submitVenueVote } = useVenueVoting({
    eventId,
    invitedEmail,
  });

  if (venueOptions.length === 0) {
    return null;
  }

  const getVoteCount = (venueId: string) => {
    return participants.filter((p) => p.venue_option_id === venueId).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedVenue) {
      await submitVenueVote(selectedVenue);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        会場候補 {venueOptions.length > 1 && '（1つ選択してください）'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {venueOptions.map((venue) => (
          <div key={venue.id} className="flex items-start space-x-4">
            {venueOptions.length > 1 ? (
              <input
                type="radio"
                id={venue.id}
                name="venue"
                value={venue.id}
                checked={selectedVenue === venue.id}
                onChange={(e) => setSelectedVenue(e.target.value)}
                className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
            ) : null}
            <div className="flex-1">
              <label
                htmlFor={venue.id}
                className="block text-sm font-medium text-gray-900"
              >
                {venue.name}
                {venueOptions.length > 1 && (
                  <span className="ml-2 text-sm text-gray-500">
                    （{getVoteCount(venue.id)}票）
                  </span>
                )}
              </label>
              {venue.url && (
                <a
                  href={venue.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500 mt-1"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  店舗情報を見る
                </a>
              )}
            </div>
          </div>
        ))}
        {venueOptions.length > 1 && invitedEmail && (
          <button
            type="submit"
            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            投票する
          </button>
        )}
      </form>
    </div>
  );
}