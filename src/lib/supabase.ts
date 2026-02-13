import { createClient } from '@supabase/supabase-js';

// NOTA: Em um ambiente de produção real, use variáveis de ambiente seguras.
// Para evitar o erro "process is not defined" no navegador, usamos strings diretas aqui para o MVP.

// Configuração padrão para evitar crash se as chaves não estiverem presentes
const SUPABASE_URL = 'https://nemgqwiqreanmjclfgxz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_rMdX6SHOPznbGFURhFhpMw_TPaQG-mX';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * SQL SCHEMA REFERENCE
 * Run this in your Supabase SQL Editor to set up the database
 */
export const SQL_SCHEMA_INSTRUCTIONS = `
-- 1. Create Profiles Table (Public User Data linked to Auth)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  name text,
  role text default 'patient' check (role in ('patient', 'admin')),
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS
alter table public.profiles enable row level security;

-- 3. Create Appointments Table
create table public.appointments (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.profiles(id),
  doctor_id uuid references public.profiles(id),
  date_time timestamp with time zone not null,
  type text,
  status text,
  notes text
);

-- 4. Create Metrics Table
create table public.health_metrics (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.profiles(id),
  metric_type text, -- 'testosterone', 'psa', 'weight'
  value numeric,
  recorded_at timestamp with time zone default now()
);

-- 5. Create Habit Logs
create table public.habit_logs (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.profiles(id),
  log_date date default current_date,
  water_intake int,
  workout_completed boolean,
  sleep_hours numeric,
  mood text,
  family_time boolean,
  hobby_time boolean
);
`;