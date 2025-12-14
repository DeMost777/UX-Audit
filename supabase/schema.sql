-- Flow UX AI Database Schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/yrcschdxvruqpxcjqtnk/sql/new

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can view own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- 2. ANALYSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('png', 'jpg', 'jpeg')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own analyses
CREATE POLICY "Users can view own analyses"
  ON public.analyses
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own analyses
CREATE POLICY "Users can insert own analyses"
  ON public.analyses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own analyses
CREATE POLICY "Users can update own analyses"
  ON public.analyses
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own analyses
CREATE POLICY "Users can delete own analyses"
  ON public.analyses
  FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_status ON public.analyses(status);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON public.analyses(created_at DESC);

-- ============================================
-- 3. ANALYSIS RESULTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.analysis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
  issue_type TEXT NOT NULL CHECK (issue_type IN ('contrast', 'spacing', 'accessibility', 'layout')),
  severity TEXT NOT NULL CHECK (severity IN ('error', 'warning', 'info')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  rule_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view results of their own analyses
CREATE POLICY "Users can view own analysis results"
  ON public.analysis_results
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.analyses
      WHERE analyses.id = analysis_results.analysis_id
      AND analyses.user_id = auth.uid()
    )
  );

-- Policy: Service role can insert results (for backend processing)
CREATE POLICY "Service role can insert results"
  ON public.analysis_results
  FOR INSERT
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analysis_results_analysis_id ON public.analysis_results(analysis_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_issue_type ON public.analysis_results(issue_type);
CREATE INDEX IF NOT EXISTS idx_analysis_results_severity ON public.analysis_results(severity);

-- ============================================
-- 4. ANALYSIS METADATA TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.analysis_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID NOT NULL UNIQUE REFERENCES public.analyses(id) ON DELETE CASCADE,
  image_width INTEGER NOT NULL,
  image_height INTEGER NOT NULL,
  total_issues INTEGER NOT NULL DEFAULT 0,
  analysis_duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.analysis_metadata ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view metadata of their own analyses
CREATE POLICY "Users can view own analysis metadata"
  ON public.analysis_metadata
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.analyses
      WHERE analyses.id = analysis_metadata.analysis_id
      AND analyses.user_id = auth.uid()
    )
  );

-- Policy: Service role can insert/update metadata
CREATE POLICY "Service role can manage metadata"
  ON public.analysis_metadata
  FOR ALL
  WITH CHECK (true);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_analysis_metadata_analysis_id ON public.analysis_metadata(analysis_id);

-- ============================================
-- 5. FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for analyses table
CREATE TRIGGER update_analyses_updated_at
  BEFORE UPDATE ON public.analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile when auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 6. STORAGE BUCKET SETUP
-- ============================================

-- Create storage bucket for uploaded design files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'design-uploads',
  'design-uploads',
  false,
  52428800, -- 50MB in bytes
  ARRAY['image/png', 'image/jpeg', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for design-uploads bucket
-- Policy: Users can upload their own files
CREATE POLICY "Users can upload own files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'design-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can view their own files
CREATE POLICY "Users can view own files"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'design-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete own files"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'design-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

