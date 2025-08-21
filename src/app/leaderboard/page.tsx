'use client';

import BottomNavigation from '@/components/BottomNavigation';
import { Trophy, Medal, Award } from 'lucide-react';

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-surface px-4 py-6 pt-12">
        <h1 className="text-2xl font-semibold text-text-primary">
          Leaderboard
        </h1>
        <p className="text-text-secondary">
          Top contributors in Malaysia
        </p>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Top 3 */}
        <div className="bg-surface rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-text-primary mb-4 text-center">
            🏆 Top Contributors
          </h2>
          
          <div className="text-center py-8">
            <Trophy className="w-16 h-16 text-warning mx-auto mb-4 opacity-50" />
            <p className="text-text-secondary">
              Be the first to start reporting!
            </p>
            <p className="text-text-tertiary text-sm mt-2">
              Submit your first report to see the community leaderboard
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-text-primary">
            Categories
          </h3>
          
          <div className="bg-surface rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Medal className="w-5 h-5 text-warning" />
                <span className="text-text-primary">Traffic Violations</span>
              </div>
              <span className="text-text-secondary">0 reports</span>
            </div>
          </div>
          
          <div className="bg-surface rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-info" />
                <span className="text-text-primary">Illegal Parking</span>
              </div>
              <span className="text-text-secondary">0 reports</span>
            </div>
          </div>
          
          <div className="bg-surface rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Trophy className="w-5 h-5 text-success" />
                <span className="text-text-primary">Public Issues</span>
              </div>
              <span className="text-text-secondary">0 reports</span>
            </div>
          </div>
        </div>

        {/* Your Rank */}
        <div className="bg-primary-light rounded-xl p-4">
          <h3 className="font-semibold text-text-primary mb-2">
            Your Current Rank
          </h3>
          <p className="text-text-secondary">
            Submit your first report to join the leaderboard and start earning points!
          </p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}