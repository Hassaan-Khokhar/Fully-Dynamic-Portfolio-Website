-- ============================================
-- CERTIFICATIONS TABLE MIGRATION
-- Run this in the Supabase SQL Editor
-- ============================================

-- Create the certifications table
create table if not exists public.certifications (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  issuer text not null,
  date text not null,
  credential_id text default '',
  verify_url text default '',
  file_url text default '',
  file_type text default 'image' check (file_type in ('image', 'pdf')),
  gradient text default 'from-blue-500 to-green-500',
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.certifications enable row level security;

-- Public can READ certifications (for the portfolio frontend)
create policy "Public read certifications" on public.certifications for select using (true);

-- Only authenticated admin can INSERT/UPDATE/DELETE
create policy "Admin all certifications" on public.certifications for all using (auth.role() = 'authenticated');

-- ============================================
-- STORAGE BUCKET
-- After running this SQL, go to Supabase Dashboard > Storage
-- and create a bucket called "certifications" with PUBLIC access
-- ============================================
