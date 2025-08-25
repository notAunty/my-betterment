'use client';

import { useState, useEffect } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import AuthGuard from '@/components/AuthGuard';
import { 
  LogOut, 
  User, 
  Star, 
  Camera, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Car,
  Construction,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { PROBLEM_TYPES } from '@/types/database';
import type { Report } from '@/types/database';

interface ProfileData {
  user: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
    stars: number;
  };
  statistics: {
    totalSubmissions: number;
    approvedReports: number;
    pendingReports: number;
    rejectedReports: number;
    parkingViolations: number;
    infrastructureIssues: number;
    stars: number;
    successRate: number;
  };
  recentReports: Report[];
  monthlyActivity: Record<string, number>;
}

export default function Profile() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/profile?userId=${user.id}`);
      const result = await response.json();
      
      if (result.success) {
        setProfileData(result.data);
      } else {
        setError('Failed to load profile data');
        // Mock data for development
        setProfileData({
          user: {
            id: user.id,
            name: user.user_metadata?.full_name || user.user_metadata?.name || 'Civic Hero',
            email: user.email || 'user@example.com',
            avatar_url: user.user_metadata?.avatar_url,
            stars: 12
          },
          statistics: {
            totalSubmissions: 12,
            approvedReports: 10,
            pendingReports: 2,
            rejectedReports: 0,
            parkingViolations: 8,
            infrastructureIssues: 4,
            stars: 12,
            successRate: 83
          },
          recentReports: [],
          monthlyActivity: {}
        });
      }
    } catch (err) {
      setError('Network error');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      router.push('/login');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-error" />;
      default:
        return <Clock className="w-4 h-4 text-text-tertiary" />;
    }
  };

  const getProblemIcon = (type: string) => {
    return type === 'parking' ? 
      <Car className="w-4 h-4 text-accent" /> : 
      <Construction className="w-4 h-4 text-accent" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <BottomNavigation />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center space-y-4">
          <p className="text-text-secondary">Please sign in to view your profile</p>
          <button 
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-accent text-surface rounded-xl font-semibold hover:bg-accent-light transition-colors"
          >
            Sign In
          </button>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background pb-20">
      <div className="bg-surface px-4 py-6 pt-12 shadow-sm">
        <h1 className="text-2xl font-semibold text-text-primary">
          My Profile
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Track your civic contributions
        </p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {error && (
          <div className="bg-error/10 border border-error/20 rounded-xl p-4">
            <p className="text-error text-sm">{error}</p>
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-surface rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center overflow-hidden">
              {profileData?.user.avatar_url ? (
                <img 
                  src={profileData.user.avatar_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-accent" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-text-primary">
                {profileData?.user.name || 'Civic Hero'}
              </h2>
              <p className="text-text-secondary text-sm">
                {profileData?.user.email}
              </p>
              <div className="flex items-center space-x-1 mt-2">
                <Star className="w-4 h-4 text-warning fill-warning" />
                <span className="text-text-primary font-semibold">
                  {profileData?.statistics.stars || 0} stars
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Camera className="w-5 h-5 text-accent" />
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {profileData?.statistics.totalSubmissions || 0}
              </p>
              <p className="text-text-secondary text-xs">Total Reports</p>
            </div>
            <div className="bg-background rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {profileData?.statistics.successRate || 0}%
              </p>
              <p className="text-text-secondary text-xs">Success Rate</p>
            </div>
          </div>
        </div>

        {/* Detailed Statistics */}
        <div className="bg-surface rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-text-primary mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-accent mr-2" />
            Contribution Statistics
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-text-primary">Approved Reports</span>
              </div>
              <span className="font-semibold text-text-primary">
                {profileData?.statistics.approvedReports || 0}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-warning" />
                <span className="text-text-primary">Pending Review</span>
              </div>
              <span className="font-semibold text-text-primary">
                {profileData?.statistics.pendingReports || 0}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <Car className="w-5 h-5 text-accent" />
                <span className="text-text-primary">Parking Violations</span>
              </div>
              <span className="font-semibold text-text-primary">
                {profileData?.statistics.parkingViolations || 0}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <Construction className="w-5 h-5 text-accent" />
                <span className="text-text-primary">Infrastructure Issues</span>
              </div>
              <span className="font-semibold text-text-primary">
                {profileData?.statistics.infrastructureIssues || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        {profileData?.recentReports && profileData.recentReports.length > 0 && (
          <div className="bg-surface rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-text-primary mb-4 flex items-center">
              <Calendar className="w-5 h-5 text-accent mr-2" />
              Recent Reports
            </h3>
            
            <div className="space-y-3">
              {profileData.recentReports.slice(0, 5).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getProblemIcon(report.problem_type)}
                    <div>
                      <p className="text-text-primary text-sm font-medium">
                        {PROBLEM_TYPES[report.problem_type]?.label || report.problem_type}
                      </p>
                      <p className="text-text-tertiary text-xs">
                        {formatDate(report.created_at)}
                        {report.location && ` • ${report.location}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(report.status)}
                    <span className="text-xs text-text-secondary capitalize">
                      {report.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sign Out */}
        <div className="bg-surface rounded-xl shadow-sm">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center justify-between p-4 hover:bg-hover transition-colors rounded-xl"
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
    </AuthGuard>
  );
}