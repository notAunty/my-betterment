'use client';

import BottomNavigation from '@/components/BottomNavigation';
import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Profile() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-surface px-4 py-6 pt-12">
        <h1 className="text-2xl font-semibold text-text-primary">
          Profile
        </h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className="bg-surface rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Anonymous User
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl shadow-sm">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center justify-between p-4 hover:bg-hover transition-colors"
          >
            <div className="flex items-center space-x-3">
              <LogOut className="w-5 h-5 text-error" />
              <span className="text-error">Sign Out</span>
            </div>
            <span className="text-text-tertiary">→</span>
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}