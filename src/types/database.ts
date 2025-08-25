export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          provider: string | null;
          total_submissions: number;
          stars: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          provider?: string | null;
          total_submissions?: number;
          stars?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          provider?: string | null;
          total_submissions?: number;
          stars?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          user_id: string;
          image_url: string;
          problem_type: 'parking' | 'infrastructure';
          problem_subtype: string | null;
          license_plate: string | null;
          location: string | null;
          latitude: number | null;
          longitude: number | null;
          description: string | null;
          ai_analysis: string | null;
          confidence_score: number | null;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          image_url: string;
          problem_type: 'parking' | 'infrastructure';
          problem_subtype?: string | null;
          license_plate?: string | null;
          location?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          description?: string | null;
          ai_analysis?: string | null;
          confidence_score?: number | null;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          image_url?: string;
          problem_type?: 'parking' | 'infrastructure';
          problem_subtype?: string | null;
          license_plate?: string | null;
          location?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          description?: string | null;
          ai_analysis?: string | null;
          confidence_score?: number | null;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      problem_type: 'parking' | 'infrastructure';
      report_status: 'pending' | 'approved' | 'rejected';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Helper types
export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type Report = Database['public']['Tables']['reports']['Row'];
export type ReportInsert = Database['public']['Tables']['reports']['Insert'];
export type ReportUpdate = Database['public']['Tables']['reports']['Update'];

// AI Analysis result type
export interface AIAnalysisResult {
  problemType: 'parking' | 'infrastructure';
  problemSubtype: string;
  licensePlate?: string;
  confidence: number;
  description: string;
  location?: string;
  requiresRetake?: boolean;
}

// Leaderboard types
export interface LeaderboardEntry {
  license_plate: string;
  violation_count: number;
  rank: number;
}

export interface LocationViolation {
  location: string;
  violation_count: number;
  rank: number;
}

export interface LeaderboardData {
  past7Days: LeaderboardEntry[];
  past30Days: LeaderboardEntry[];
  past90Days: LeaderboardEntry[];
  topLocations: LocationViolation[];
}

// Problem types classification
export const PROBLEM_TYPES = {
  parking: {
    label: 'Parking Violation',
    subtypes: [
      'illegal_parking',
      'double_parking',
      'blocking_driveway',
      'disabled_spot_violation',
      'fire_lane_violation',
      'no_parking_zone'
    ]
  },
  infrastructure: {
    label: 'Infrastructure Issue',
    subtypes: [
      'pothole',
      'damaged_infrastructure',
      'broken_streetlight',
      'dangerous_walkway',
      'damaged_road_sign',
      'blocked_drain'
    ]
  }
} as const;