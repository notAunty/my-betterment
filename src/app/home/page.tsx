'use client';

import { useState, useEffect } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import AuthGuard from '@/components/AuthGuard';
import { Trophy, MapPin, Calendar, TrendingUp, Star } from 'lucide-react';
import type { LeaderboardData, LeaderboardEntry, LocationViolation } from '@/types/database';

export default function HomePage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch('/api/leaderboard?period=all');
      const result = await response.json();
      
      if (result.success) {
        setLeaderboardData(result.data);
      } else {
        setError('Failed to load leaderboard data');
        // Mock data for development
        setLeaderboardData({
          past7Days: [
            { license_plate: 'ABC1234', violation_count: 5, rank: 1 },
            { license_plate: 'DEF5678', violation_count: 3, rank: 2 },
            { license_plate: 'GHI9012', violation_count: 2, rank: 3 },
          ],
          past30Days: [
            { license_plate: 'ABC1234', violation_count: 15, rank: 1 },
            { license_plate: 'JKL3456', violation_count: 12, rank: 2 },
            { license_plate: 'DEF5678', violation_count: 8, rank: 3 },
          ],
          past90Days: [
            { license_plate: 'ABC1234', violation_count: 25, rank: 1 },
            { license_plate: 'JKL3456', violation_count: 20, rank: 2 },
            { license_plate: 'MNO7890', violation_count: 15, rank: 3 },
          ],
          topLocations: [
            { location: 'KLCC', violation_count: 45, rank: 1 },
            { location: 'Bukit Bintang', violation_count: 32, rank: 2 },
            { location: 'Bangsar', violation_count: 28, rank: 3 },
          ]
        });
      }
    } catch (err) {
      setError('Network error');
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const LeaderboardSection = ({ 
    title, 
    data, 
    icon: Icon, 
    period 
  }: { 
    title: string; 
    data: LeaderboardEntry[]; 
    icon: any; 
    period: string;
  }) => (
    <div className="bg-surface rounded-xl p-4 shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <Icon className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-text-primary">{title}</h3>
        <span className="text-xs text-text-tertiary bg-secondary px-2 py-1 rounded-full">
          {period}
        </span>
      </div>
      
      {data.length === 0 ? (
        <p className="text-text-secondary text-sm text-center py-4">
          No violations reported yet
        </p>
      ) : (
        <div className="space-y-2">
          {data.slice(0, 3).map((entry, index) => (
            <div key={entry.license_plate} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  index === 0 ? 'bg-warning text-white' :
                  index === 1 ? 'bg-border text-text-primary' :
                  'bg-secondary text-text-secondary'
                }`}>
                  {entry.rank}
                </div>
                <span className="font-mono text-text-primary">
                  {entry.license_plate}
                </span>
              </div>
              <div className="text-text-secondary text-sm">
                {entry.violation_count} violations
              </div>
            </div>
          ))}
          
          {data.length > 3 && (
            <div className="text-center pt-2">
              <button className="text-accent text-sm hover:text-accent-light transition-colors">
                View all {data.length} entries
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const LocationSection = ({ data }: { data: LocationViolation[] }) => (
    <div className="bg-surface rounded-xl p-4 shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <MapPin className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-text-primary">Top Problem Areas</h3>
        <span className="text-xs text-text-tertiary bg-secondary px-2 py-1 rounded-full">
          Past 30 days
        </span>
      </div>
      
      {data.length === 0 ? (
        <p className="text-text-secondary text-sm text-center py-4">
          No location data available
        </p>
      ) : (
        <div className="space-y-2">
          {data.slice(0, 5).map((entry, index) => (
            <div key={entry.location} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-error text-white flex items-center justify-center text-xs font-semibold">
                  {entry.rank}
                </div>
                <span className="text-text-primary truncate flex-1">
                  {entry.location}
                </span>
              </div>
              <div className="text-text-secondary text-sm">
                {entry.violation_count}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <BottomNavigation />
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background pb-20">
      <div className="bg-surface px-4 py-6 pt-12 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              Community Dashboard
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Tracking violations to improve our community
            </p>
          </div>
          <div className="bg-primary-light p-3 rounded-full">
            <TrendingUp className="w-6 h-6 text-accent" />
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {error && (
          <div className="bg-error/10 border border-error/20 rounded-xl p-4 mb-6">
            <p className="text-error text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {leaderboardData && (
            <>
              <LeaderboardSection
                title="This Week's Offenders"
                data={leaderboardData.past7Days}
                icon={Calendar}
                period="7 days"
              />
              
              <LeaderboardSection
                title="This Month's Offenders"
                data={leaderboardData.past30Days}
                icon={Trophy}
                period="30 days"
              />
              
              <LeaderboardSection
                title="Quarter Champions"
                data={leaderboardData.past90Days}
                icon={Star}
                period="90 days"
              />
              
              <LocationSection data={leaderboardData.topLocations} />
            </>
          )}

          <div className="bg-surface rounded-xl p-4 shadow-sm">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-text-primary">
                Help Build a Better Community
              </h3>
              <p className="text-text-secondary text-sm">
                Report civic problems and parking violations to create awareness and drive positive change in Malaysia.
              </p>
            </div>
          </div>
        </div>
      </div>

        <BottomNavigation />
      </div>
    </AuthGuard>
  );
}