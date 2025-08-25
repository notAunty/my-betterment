import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({
        error: 'Database not configured'
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        error: 'User ID is required'
      }, { status: 400 });
    }

    // Get user profile
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('User profile error:', userError);
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 });
    }

    // Get user's reports with detailed information
    const { data: reports, error: reportsError } = await supabase
      .from('reports')
      .select(`
        id,
        image_url,
        problem_type,
        problem_subtype,
        license_plate,
        location,
        description,
        confidence_score,
        status,
        created_at
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (reportsError) {
      console.error('Reports fetch error:', reportsError);
      return NextResponse.json({
        error: 'Failed to fetch reports'
      }, { status: 500 });
    }

    // Calculate statistics
    const totalSubmissions = reports.length;
    const approvedReports = reports.filter(r => r.status === 'approved').length;
    const pendingReports = reports.filter(r => r.status === 'pending').length;
    const rejectedReports = reports.filter(r => r.status === 'rejected').length;
    
    const parkingViolations = reports.filter(r => r.problem_type === 'parking').length;
    const infrastructureIssues = reports.filter(r => r.problem_type === 'infrastructure').length;
    
    // Calculate stars (1 star per submission as per requirements)
    const stars = totalSubmissions;

    // Group reports by month for activity chart
    const monthlyActivity = reports.reduce((acc, report) => {
      const month = new Date(report.created_at).toISOString().substring(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const profileData = {
      user: {
        ...user,
        stars // Override with calculated stars
      },
      statistics: {
        totalSubmissions,
        approvedReports,
        pendingReports,
        rejectedReports,
        parkingViolations,
        infrastructureIssues,
        stars,
        successRate: totalSubmissions > 0 ? Math.round((approvedReports / totalSubmissions) * 100) : 0
      },
      recentReports: reports.slice(0, 10), // Most recent 10 reports
      monthlyActivity
    };

    return NextResponse.json({
      success: true,
      data: profileData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({
      error: 'Failed to fetch profile data'
    }, { status: 500 });
  }
}