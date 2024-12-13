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
  signUp: (email: string, password: string) => Promise<{ confirmationSent: boolean }>;
  initializeAuth: () => Promise<void>;
  createProfile: (userId: string, email: string, name?: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  createProfile: async (userId: string, email: string, name?: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert([{ id: userId, email, name }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },

  initializeAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // プロファイルの取得を試みる
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        // プロファイルが存在しない場合は作成
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
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
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
        // プロファイルの存在確認
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // プロファイルが存在しない場合は作成
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // メール確認が必要な場合（identities.length === 0）
      if (!data.user || data.user.identities?.length === 0) {
        return { confirmationSent: true };
      }

      // メール確認が不要な場合のみプロフィールを作成
      await get().createProfile(
        data.user.id,
        data.user.email!,
        data.user.user_metadata.name
      );

      set({
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata.name,
        },
      });

      return { confirmationSent: false };
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '新規登録エラーが発生しました' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));