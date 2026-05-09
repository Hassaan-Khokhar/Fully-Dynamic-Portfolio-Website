-- ============================================
-- HASSAAN ALI PORTFOLIO - SUPABASE SCHEMA
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. PROJECTS TABLE
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  description text not null default '',
  long_description text not null default '',
  tags text[] default '{}',
  tag_colors text[] default '{}',
  hover_color text default 'group-hover:text-sky-400',
  features text[] default '{}',
  tech_stack text[] default '{}',
  images text[] default '{}',
  live_url text,
  github_url text,
  action text default '[VIEW PROJECT]',
  reverse boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 2. SKILLS TABLE
create table if not exists public.skills (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  icon text not null default 'code',
  skills text[] default '{}',
  class_name text default 'md:col-span-1 md:row-span-1',
  sort_order int default 0
);

-- 3. EDUCATION TABLE
create table if not exists public.education (
  id uuid default gen_random_uuid() primary key,
  year text not null,
  degree text not null,
  institution text not null,
  cgpa text default '',
  description text default '',
  active boolean default false,
  sort_order int default 0
);

-- 4. EXPERIENCE TABLE
create table if not exists public.experience (
  id uuid default gen_random_uuid() primary key,
  year text not null,
  role text not null,
  company text not null,
  bullets text[] default '{}',
  active boolean default false,
  sort_order int default 0
);

-- 5. CONTACT INFO TABLE (single row)
create table if not exists public.contact_info (
  id uuid default gen_random_uuid() primary key,
  location text default '',
  email text default '',
  phone text default '',
  linkedin text default '',
  github text default '',
  hero_taglines text default 'Full Stack Developer, Flutter Engineer',
  hero_bio text default 'Computer Science student at COMSATS University Islamabad. Specialized in architecting robust database-driven backends and developing fluid, cross-platform mobile ecosystems.',
  hero_image text default '',
  resume_url text default ''
);

-- 6. MESSAGES TABLE
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- Public can READ, only authenticated can WRITE
-- ============================================

alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.education enable row level security;
alter table public.experience enable row level security;
alter table public.contact_info enable row level security;
alter table public.messages enable row level security;

-- Public read policies
create policy "Public read projects" on public.projects for select using (true);
create policy "Public read skills" on public.skills for select using (true);
create policy "Public read education" on public.education for select using (true);
create policy "Public read experience" on public.experience for select using (true);
create policy "Public read contact_info" on public.contact_info for select using (true);

-- Public can INSERT messages (contact form)
create policy "Public insert messages" on public.messages for insert with check (true);

-- Authenticated (admin) full access
create policy "Admin all projects" on public.projects for all using (auth.role() = 'authenticated');
create policy "Admin all skills" on public.skills for all using (auth.role() = 'authenticated');
create policy "Admin all education" on public.education for all using (auth.role() = 'authenticated');
create policy "Admin all experience" on public.experience for all using (auth.role() = 'authenticated');
create policy "Admin all contact_info" on public.contact_info for all using (auth.role() = 'authenticated');
create policy "Admin all messages" on public.messages for all using (auth.role() = 'authenticated');

-- ============================================
-- SEED DATA
-- ============================================

-- Seed contact info
insert into public.contact_info (location, email, phone)
values ('Sargodha, Punjab, Pakistan', 'alihassaan435@gmail.com', '+92 300 000 0000');

-- Seed skills
insert into public.skills (title, icon, skills, class_name, sort_order) values
('Languages', 'code', '{"PHP","Dart","Python","C++","Java","Assembly Language"}', 'md:col-span-2 md:row-span-1', 0),
('Frameworks', 'layers', '{"Laravel","Flutter","Next.js","React","Tailwind CSS"}', 'md:col-span-1 md:row-span-2', 1),
('Databases', 'database', '{"MySQL","Firebase","Supabase","PostgreSQL"}', 'md:col-span-1 md:row-span-1', 2),
('Concepts', 'lightbulb', '{"RESTful APIs","Data Mining","SEO Optimization","System Architecture"}', 'md:col-span-2 md:row-span-1', 3);

-- Seed education
insert into public.education (year, degree, institution, cgpa, description, active, sort_order) values
('2023 – 2027', 'BS Computer Science', 'COMSATS University Islamabad', '3.5', 'Currently in 6th Semester. Deepening knowledge in software engineering, system architecture, and advanced computer science concepts.', true, 0),
('2021 – 2023', 'Intermediate Pre-Engineering', 'Punjab College', '85%', 'Completed higher secondary education with a focus on mathematics, physics, and computer science.', false, 1);

-- Seed experience
insert into public.experience (year, role, company, bullets, active, sort_order) values
('Jan 2026 – Present', 'Freelance Developer', 'Fiverr Platform', '{"Providing professional Full Stack Web development services.","Building scalable cross-platform mobile ecosystems using Flutter.","Collaborating directly with international clients to deliver custom solutions."}', true, 0),
('2026 Focus', 'Startup Founder (FYP)', 'SSBC Wah Campus', '{"Currently in planning and architecture phase.","Developing a hyper-local service marketplace startup.","Applying system design principles for scalable backend architecture."}', false, 1);

-- Seed projects
insert into public.projects (slug, title, description, long_description, tags, tag_colors, hover_color, features, tech_stack, images, github_url, action, sort_order) values
('campus-portal', 'Campus Portal Suite', 'A highly integrated tripartite mobile application ecosystem. Synchronizes data seamlessly between students, faculty, and university administrators in real-time.', 'The Campus Portal Suite is a comprehensive, three-part mobile application ecosystem designed to revolutionize how universities manage academic operations. Built entirely in Flutter with Firebase as the backend, this system provides real-time synchronization between students, faculty members, and university administrators. The architecture follows a clean separation of concerns, with each app tailored to its user role while sharing a unified data layer.', '{"Flutter","Firebase"}', '{"bg-sky-500/20 text-sky-400","bg-yellow-500/20 text-yellow-400"}', 'group-hover:text-sky-400', '{"Real-time GPA and CGPA calculation using COMSATS University grading policy.","Live attendance tracking with faculty-side marking and student-side viewing.","Dynamic timetable management with conflict detection.","Push notification system for announcements and grade updates.","Role-based access control across all three applications.","Offline-first architecture with automatic sync when connectivity resumes."}', '{"Flutter","Dart","Firebase Auth","Cloud Firestore","Firebase Cloud Messaging","Provider State Management"}', '{}', 'https://github.com/Hassaan-Khokhar', '[INTERACTIVE PROTOTYPE]', 0);

insert into public.projects (slug, title, description, long_description, tags, tag_colors, hover_color, features, tech_stack, images, live_url, action, reverse, sort_order) values
('prime-tax', 'Prime Tax Web Platform', 'Engineered a dynamic web presence for a UK-based accounting firm, featuring secure data handling and a highly optimized relational database structure.', 'Prime Tax Accounting is a full-service web platform built for a UK-based accounting and tax advisory firm. The system features a comprehensive service catalog, secure client inquiry forms, and an optimized backend powered by Laravel and MySQL. Every page is hand-crafted for SEO performance, achieving top-tier Core Web Vitals scores.', '{"Laravel","PHP"}', '{"bg-red-500/20 text-red-400","bg-blue-500/20 text-blue-400"}', 'group-hover:text-red-400', '{"Custom-built CMS for managing service pages and blog content.","SEO-optimized with structured data, meta tags, and sitemap generation.","Secure contact forms with server-side validation and email notifications.","Responsive design optimized for all devices and screen sizes.","Image optimization pipeline converting assets to WebP format.","Netlify deployment with continuous integration from GitHub."}', '{"Laravel","PHP","MySQL","Blade Templates","Tailwind CSS","JavaScript","Netlify"}', '{}', 'https://primetaxaccounting.co.uk', '[DASHBOARD DATA]', true, 1);

-- ============================================
-- STORAGE BUCKET
-- Run this AFTER the tables are created
-- Go to Storage in Supabase Dashboard and create
-- a bucket called "project-images" with public access
-- and a bucket called "assets" with public access
-- ============================================
