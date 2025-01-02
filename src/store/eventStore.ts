import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';
import type { Event, DateOption, VenueOption, Participant } from '../types';
import { sendEventCreationEmail } from '../utils/email';

interface EventState {
  events: Event[];
  currentEvent: Event | null;
  dateOptions: DateOption[];
  venueOptions: VenueOption[];
  participants: Participant[];
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  fetchEventDetails: (eventId: string) => Promise<void>;
  createEvent: (
    title: string,
    description: string,
    venueOptions: Omit<VenueOption, 'id' | 'event_id' | 'created_at' | 'updated_at'>[],
    dateOptions: Omit<DateOption, 'id' | 'event_id' | 'created_at'>[],
    participants: string[]
  ) => Promise<string>;
  updateEvent: (eventId: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  currentEvent: null,
  dateOptions: [],
  venueOptions: [],
  participants: [],
  loading: false,
  error: null,

  fetchEvents: async () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ events: [], error: null });
      return;
    }

    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ events: data || [] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '予期せぬエラーが発生しました' });
    } finally {
      set({ loading: false });
    }
  },

  fetchEventDetails: async (eventId: string) => {
    set({ loading: true, error: null });
    try {
      // イベント情報の取得
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;

      // 会場候補の取得
      const { data: venueOptionsData, error: venueOptionsError } = await supabase
        .from('venue_options')
        .select('*')
        .eq('event_id', eventId);

      if (venueOptionsError) throw venueOptionsError;

      // 候補日時の取得
      const { data: dateOptionsData, error: dateOptionsError } = await supabase
        .from('date_options')
        .select('*')
        .eq('event_id', eventId)
        .order('date', { ascending: true });

      if (dateOptionsError) throw dateOptionsError;

      // 参加者情報の取得
      const { data: participantsData, error: participantsError } = await supabase
        .from('participants')
        .select('*')
        .eq('event_id', eventId);

      if (participantsError) throw participantsError;

      set({
        currentEvent: eventData,
        venueOptions: venueOptionsData || [],
        dateOptions: dateOptionsData || [],
        participants: participantsData || [],
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '予期せぬエラーが発生しました' });
    } finally {
      set({ loading: false });
    }
  },

  // ... 他のメソッドは変更なし
}));