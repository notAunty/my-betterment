-- My Betterment Database Schema
-- Run this in your Supabase SQL Editor to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS extension for location data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create custom types
CREATE TYPE problem_type AS ENUM ('parking', 'infrastructure');
CREATE TYPE report_status AS ENUM ('pending', 'approved', 'rejected');

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    avatar_url TEXT,
    provider TEXT,
    total_submissions INTEGER DEFAULT 0,
    stars INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    problem_type problem_type NOT NULL,
    problem_subtype TEXT,
    license_plate TEXT,
    location TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    description TEXT,
    ai_analysis JSONB,
    confidence_score DECIMAL(3, 2),
    status report_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_problem_type ON public.reports(problem_type);
CREATE INDEX IF NOT EXISTS idx_reports_license_plate ON public.reports(license_plate);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_location ON public.reports(location);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON public.reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment user stats when a report is created
CREATE OR REPLACE FUNCTION increment_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.users 
    SET 
        total_submissions = total_submissions + 1,
        stars = stars + 1
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically increment user stats
CREATE TRIGGER increment_user_stats_on_report AFTER INSERT ON public.reports
    FOR EACH ROW EXECUTE FUNCTION increment_user_stats();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for reports table
CREATE POLICY "Users can view all approved reports" ON public.reports
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view their own reports" ON public.reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports" ON public.reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending reports" ON public.reports
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Create a view for leaderboard data (license plates)
CREATE OR REPLACE VIEW public.license_plate_leaderboard AS
SELECT 
    license_plate,
    COUNT(*) as violation_count,
    MAX(created_at) as latest_violation
FROM public.reports 
WHERE 
    license_plate IS NOT NULL 
    AND license_plate != '' 
    AND status = 'approved'
GROUP BY license_plate
ORDER BY violation_count DESC, latest_violation DESC;

-- Create a view for location-based violations
CREATE OR REPLACE VIEW public.location_violations AS
SELECT 
    location,
    COUNT(*) as violation_count,
    MAX(created_at) as latest_violation
FROM public.reports 
WHERE 
    location IS NOT NULL 
    AND location != '' 
    AND status = 'approved'
GROUP BY location
ORDER BY violation_count DESC, latest_violation DESC;

-- Grant necessary permissions
GRANT SELECT ON public.license_plate_leaderboard TO anon, authenticated;
GRANT SELECT ON public.location_violations TO anon, authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.reports TO authenticated;