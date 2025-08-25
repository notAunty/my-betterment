import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: false,
      error: null,

      signIn: async () => {
        if (!supabase) {
          set({ error: 'Supabase not configured' });
          return;
        }
        
        set({ loading: true, error: null });
        
        try {
          // OAuth sign in will be handled by Supabase Auth UI
          // This method is mainly for initialization
        } catch (error) {
          set({ error: 'Sign in failed' });
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        if (!supabase) return;
        
        set({ loading: true, error: null });
        
        try {
          await supabase.auth.signOut();
          set({ user: null, session: null });
        } catch (error) {
          set({ error: 'Sign out failed' });
        } finally {
          set({ loading: false });
        }
      },

      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      initialize: async () => {
        if (!supabase) return;
        
        set({ loading: true });
        
        try {
          // Get initial session
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            set({ error: error.message });
            return;
          }

          if (session) {
            set({ session, user: session.user });
          }

          // Listen to auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            set({ session, user: session?.user ?? null });
            
            if (event === 'SIGNED_IN' && session?.user) {
              // Create or update user profile in database
              if (supabase) {
                try {
                  const { error: profileError } = await supabase
                    .from('users')
                    .upsert({
                      id: session.user.id,
                      email: session.user.email,
                      name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                      avatar_url: session.user.user_metadata?.avatar_url,
                      provider: session.user.app_metadata?.provider,
                      updated_at: new Date().toISOString(),
                    });

                  if (profileError) {
                    console.error('Error updating user profile:', profileError);
                  }
                } catch (profileError) {
                  console.error('Error updating user profile:', profileError);
                }
              }
            }
          });
        } catch (error) {
          set({ error: 'Failed to initialize auth' });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        session: state.session 
      }),
    }
  )
);