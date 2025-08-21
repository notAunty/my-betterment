'use client';

import BottomNavigation from '@/components/BottomNavigation';
import { Settings, LogOut, User, Award } from 'lucide-react';
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
      // Even if there's an error, redirect to login
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-surface px-4 py-6 pt-12">
        <h1 className="text-2xl font-semibold text-text-primary">
          Profile
        </h1>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* User Info */}
        <div className="bg-surface rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Anonymous User
              </h2>
              <p className="text-text-secondary">
                Level 1 Contributor
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-divider">
            <div className="text-center">
              <div className="text-xl font-bold text-accent">0</div>
              <div className="text-xs text-text-secondary">Reports</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-accent">0</div>
              <div className="text-xs text-text-secondary">Points</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-accent">0</div>
              <div className="text-xs text-text-secondary">Rank</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-surface rounded-xl shadow-sm">
          <button className="w-full flex items-center justify-between p-4 border-b border-divider">
            <div className="flex items-center space-x-3">
              <Award className="w-5 h-5 text-text-secondary" />
              <span className="text-text-primary">Achievements</span>
            </div>
            <span className="text-text-tertiary">→</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 border-b border-divider">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-text-secondary" />
              <span className="text-text-primary">Settings</span>
            </div>
            <span className="text-text-tertiary">→</span>
          </button>
          
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