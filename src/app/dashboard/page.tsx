'use client';

import BottomNavigation from '@/components/BottomNavigation';
import { Bell, Search, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-surface px-4 py-6 pt-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              Good morning! 👋
            </h1>
            <p className="text-text-secondary">
              Let's make Malaysia better today
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="p-2 rounded-full bg-surface-variant">
              <Search className="w-5 h-5 text-text-secondary" />
            </button>
            <button className="p-2 rounded-full bg-surface-variant">
              <Bell className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="bg-surface rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Your Impact
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">0</div>
              <div className="text-sm text-text-secondary">Reports Submitted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">0</div>
              <div className="text-sm text-text-secondary">Points Earned</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-primary-light rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                See something wrong?
              </h3>
              <p className="text-text-secondary mb-4">
                Tap the camera button below to report issues and help improve your community.
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-accent opacity-60" />
          </div>
        </div>

        {/* Recent Activity - Empty State */}
        <div className="bg-surface rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Recent Activity
          </h2>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📸</div>
            <p className="text-text-secondary">
              Your submitted reports will appear here
            </p>
          </div>
        </div>

        {/* Community Leaderboard Preview */}
        <div className="bg-surface rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">
              Top Contributors
            </h2>
            <button className="text-accent text-sm font-medium">
              View All
            </button>
          </div>
          <div className="text-center py-4">
            <p className="text-text-secondary">
              Start reporting to see community rankings
            </p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}