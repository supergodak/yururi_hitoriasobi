import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  initializeAuth: () => Promise<void>;
  createProfile: (userId: string, email: string, name?: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  error: null,

  createProfile: async (userId: string, email: string, name?: string) => {
    try {
      // プロフィールが存在するか確認
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!existingProfile) {
        // プロフィールが存在しない場合のみ作成
        const { error } = await supabase
          .from('profiles')
          .insert([{ id: userId, email, name }]);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },

  initializeAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // プロフィールの取得を試みる
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        // プロフィールが存在しない場合は作成
        if (!profile) {
          await get().createProfile(
            session.user.id,
            session.user.email!,
            session.user.user_metadata.name
          );
        }

        set({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata.name,
          },
          loading: false,
        });
      } else {
        set({ user: null, loading: false });
      }

      // 認証状態の変更を監視
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          set({
            user: {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata.name,
            },
          });
        } else {
          set({ user: null });
        }
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ user: null, loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (user) {
        // プロフィールの存在確認
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // プロフィールが存在しない場合は作成
        if (!profile) {
          await get().createProfile(
            user.id,
            user.email!,
            user.user_metadata.name
          );
        }

        set({
          user: {
            id: user.id,
            email: user.email!,
            name: user.user_metadata.name,
          },
        });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'ログインエラーが発生しました' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Googleログインエラーが発生しました' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'ログアウトエラーが発生しました' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (user) {
        await get().createProfile(
          user.id,
          user.email!,
          user.user_metadata.name
        );

        set({
          user: {
            id: user.id,
            email: user.email!,
            name: user.user_metadata.name,
          },
        });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '新規登録エラーが発生しました' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));