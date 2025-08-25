import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { LeaderboardData, LeaderboardEntry, LocationViolation } from '@/types/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({
        error: 'Database not configured'
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all';

    // Calculate date ranges
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date('2000-01-01'); // All time
    }

    // Get license plate leaderboard
    const { data: licensePlateData, error: licensePlateError } = await supabase
      .from('reports')
      .select('license_plate')
      .not('license_plate', 'is', null)
      .neq('license_plate', '')
      .eq('status', 'approved')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (licensePlateError) {
      console.error('License plate query error:', licensePlateError);
      return NextResponse.json({
        error: 'Failed to fetch license plate data'
      }, { status: 500 });
    }

    // Process license plate data
    const licensePlateCount = licensePlateData.reduce((acc, report) => {
      const plate = report.license_plate;
      if (plate) {
        acc[plate] = (acc[plate] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const licensePlateLeaderboard: LeaderboardEntry[] = Object.entries(licensePlateCount)
      .map(([license_plate, violation_count]) => ({
        license_plate,
        violation_count,
        rank: 0 // Will be set below
      }))
      .sort((a, b) => b.violation_count - a.violation_count)
      .slice(0, 10)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));

    // Get location-based violations (only for 30-day period for top locations)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const { data: locationData, error: locationError } = await supabase
      .from('reports')
      .select('location')
      .not('location', 'is', null)
      .neq('location', '')
      .eq('status', 'approved')
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (locationError) {
      console.error('Location query error:', locationError);
      return NextResponse.json({
        error: 'Failed to fetch location data'
      }, { status: 500 });
    }

    // Process location data
    const locationCount = locationData.reduce((acc, report) => {
      const location = report.location;
      if (location) {
        acc[location] = (acc[location] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topLocations: LocationViolation[] = Object.entries(locationCount)
      .map(([location, violation_count]) => ({
        location,
        violation_count,
        rank: 0
      }))
      .sort((a, b) => b.violation_count - a.violation_count)
      .slice(0, 10)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));

    if (period === 'all') {
      // For the main dashboard, return data for all periods
      const periods = ['7days', '30days', '90days'];
      const allData: Record<string, LeaderboardEntry[]> = {};

      for (const p of periods) {
        const periodStartDate = new Date(now.getTime() - parseInt(p) * 24 * 60 * 60 * 1000);
        
        const { data: periodData } = await supabase
          .from('reports')
          .select('license_plate')
          .not('license_plate', 'is', null)
          .neq('license_plate', '')
          .eq('status', 'approved')
          .gte('created_at', periodStartDate.toISOString());

        if (periodData) {
          const periodCount = periodData.reduce((acc, report) => {
            const plate = report.license_plate;
            if (plate) {
              acc[plate] = (acc[plate] || 0) + 1;
            }
            return acc;
          }, {} as Record<string, number>);

          allData[p] = Object.entries(periodCount)
            .map(([license_plate, violation_count]) => ({
              license_plate,
              violation_count,
              rank: 0
            }))
            .sort((a, b) => b.violation_count - a.violation_count)
            .slice(0, 10)
            .map((entry, index) => ({
              ...entry,
              rank: index + 1
            }));
        } else {
          allData[p] = [];
        }
      }

      const leaderboardData: LeaderboardData = {
        past7Days: allData['7days'] || [],
        past30Days: allData['30days'] || [],
        past90Days: allData['90days'] || [],
        topLocations
      };

      return NextResponse.json({
        success: true,
        data: leaderboardData,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        leaderboard: licensePlateLeaderboard,
        topLocations: period === '30days' ? topLocations : []
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({
      error: 'Failed to fetch leaderboard data'
    }, { status: 500 });
  }
}