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
  updateEvent: (
    eventId: string,
    updates: Partial<Event>
  ) => Promise<void>;
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

      // 参加者情報の取得（最新の回答を取得）
      const { data: participantsData, error: participantsError } = await supabase
        .from('participants')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false }); // 作成日時の降順でソート

      if (participantsError) throw participantsError;

      // 同じメールアドレスと日時オプションの組み合わせに対して最新の回答のみを使用
      const latestParticipants = participantsData?.reduce((acc, current) => {
        const key = `${current.email}-${current.date_option_id}`;
        if (!acc[key]) {
          acc[key] = current;
        }
        return acc;
      }, {} as Record<string, typeof participantsData[0]>);

      set({
        currentEvent: eventData,
        venueOptions: venueOptionsData || [],
        dateOptions: dateOptionsData || [],
        participants: Object.values(latestParticipants || {}),
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '予期せぬエラーが発生しました' });
    } finally {
      set({ loading: false });
    }
  },

  createEvent: async (
    title: string,
    description: string,
    venueOptions: Omit<VenueOption, 'id' | 'event_id' | 'created_at' | 'updated_at'>[],
    dateOptions: Omit<DateOption, 'id' | 'event_id' | 'created_at'>[],
    participants: string[]
  ) => {
    const { user } = useAuthStore.getState();
    if (!user) {
      throw new Error('イベントを作成するにはログインが必要です');
    }

    set({ loading: true, error: null });
    try {
      // イベントの作成
      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert([{ title, description, creator_id: user.id }])
        .select()
        .single();

      if (eventError) throw eventError;

      // 会場候補の作成
      if (venueOptions.length > 0) {
        const venueOptionsWithEventId = venueOptions.map((option) => ({
          ...option,
          event_id: event.id,
        }));

        const { error: venueOptionsError } = await supabase
          .from('venue_options')
          .insert(venueOptionsWithEventId);

        if (venueOptionsError) throw venueOptionsError;
      }

      // 候補日時の作成
      const { data: dateOptionsData, error: dateOptionsError } = await supabase
        .from('date_options')
        .insert(dateOptions.map((option) => ({
          ...option,
          event_id: event.id,
        })))
        .select();

      if (dateOptionsError) throw dateOptionsError;

      // 参加者の登録
      if (participants.length > 0 && dateOptionsData) {
        const participantsData = dateOptionsData.flatMap((dateOption) =>
          participants.map((email) => ({
            event_id: event.id,
            date_option_id: dateOption.id,
            email,
            response: null,
          }))
        );

        const { error: participantsError } = await supabase
          .from('participants')
          .insert(participantsData);

        if (participantsError) throw participantsError;

        // メール送信
        await Promise.all(
          participants.map((email) =>
            sendEventCreationEmail({
              to: email,
              eventTitle: title,
              eventUrl: `${window.location.origin}/events/${event.id}`,
              description,
            })
          )
        );
      }

      await get().fetchEvents();
      return event.id;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '予期せぬエラーが発生しました' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateEvent: async (eventId: string, updates: Partial<Event>) => {
    const { user } = useAuthStore.getState();
    if (!user) {
      throw new Error('イベントを更新するにはログインが必要です');
    }

    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', eventId)
        .eq('creator_id', user.id);

      if (error) throw error;
      await get().fetchEventDetails(eventId);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '予期せぬエラーが発生しました' });
    } finally {
      set({ loading: false });
    }
  },

  deleteEvent: async (eventId: string) => {
    const { user } = useAuthStore.getState();
    if (!user) {
      throw new Error('イベントを削除するにはログインが必要です');
    }

    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .eq('creator_id', user.id);

      if (error) throw error;
      await get().fetchEvents();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '予期せぬエラーが発生しました' });
    } finally {
      set({ loading: false });
    }
  },
}));