
-- 
-- DR. EDGAR SARMENTO - MEN'S HEALTH HUB
-- SUPABASE DATABASE SCHEMA (VERSÃO ATUALIZADA - FULL HUB)
-- 

-- 1. LIMPEZA (DROP) - Cuidado: Apaga dados existentes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP TABLE IF EXISTS public.diet_logs; -- Nova
DROP TABLE IF EXISTS public.mentorship_goals;
DROP TABLE IF EXISTS public.workout_exercises;
DROP TABLE IF EXISTS public.workout_routines;
DROP TABLE IF EXISTS public.diet_meals;
DROP TABLE IF EXISTS public.diet_plans;
DROP TABLE IF EXISTS public.messages;
DROP TABLE IF EXISTS public.faq_items;
DROP TABLE IF EXISTS public.exams;
DROP TABLE IF EXISTS public.medical_records;
DROP TABLE IF EXISTS public.habit_logs;
DROP TABLE IF EXISTS public.health_metrics;
DROP TABLE IF EXISTS public.appointments;
DROP TABLE IF EXISTS public.profiles CASCADE; 

-- Habilitar extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CRIAÇÃO DAS TABELAS

-- Tabela de Perfis de Usuário
-- Atualizado: check constraint agora inclui 'nutritionist' e 'trainer'
create table public.profiles (
  id uuid not null primary key, 
  email text,
  name text,
  role text default 'patient' check (role in ('patient', 'admin', 'nutritionist', 'trainer')),
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

-- Políticas de segurança básicas
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Admins/Staff can view all profiles" on public.profiles for select using (
  auth.uid() in (select id from public.profiles where role in ('admin', 'nutritionist', 'trainer'))
);

-- Tabela de Agendamentos
create table public.appointments (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.profiles(id),
  doctor_id uuid references public.profiles(id),
  date_time timestamp with time zone not null,
  type text,
  status text default 'pendente',
  notes text,
  created_at timestamp with time zone default now()
);
alter table public.appointments enable row level security;

-- Tabela de Métricas de Saúde
create table public.health_metrics (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.profiles(id),
  metric_type text not null,
  value numeric not null,
  unit text,
  recorded_at timestamp with time zone default now()
);
alter table public.health_metrics enable row level security;

-- Tabela de Diário de Hábitos (6 Ps)
create table public.habit_logs (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.profiles(id),
  log_date date default current_date,
  water_intake int default 0,
  water_target int default 3000,
  workout_completed boolean default false,
  sleep_hours numeric,
  mood text,
  family_time boolean default false,
  hobby_time boolean default false,
  created_at timestamp with time zone default now()
);
alter table public.habit_logs enable row level security;

-- Tabela de Prontuário Médico
create table public.medical_records (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.profiles(id),
  doctor_id uuid references public.profiles(id),
  record_date timestamp with time zone default now(),
  title text not null,
  content text,
  record_type text -- 'anamnese', 'evolucao', 'prescricao'
);
alter table public.medical_records enable row level security;

-- Tabela de Exames
create table public.exams (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.profiles(id),
  exam_date timestamp with time zone default now(),
  title text not null,
  file_url text,
  exam_type text -- 'laboratorial', 'imagem', 'laudo'
);
alter table public.exams enable row level security;

-- Tabela de FAQ
create table public.faq_items (
  id uuid default uuid_generate_v4() primary key,
  question text not null,
  answer text not null,
  category text,
  created_at timestamp with time zone default now()
);
alter table public.faq_items enable row level security;

-- Tabela de Mensagens (Chat)
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.profiles(id),
  receiver_id uuid references public.profiles(id),
  content text not null,
  msg_type text default 'text',
  is_read boolean default false,
  created_at timestamp with time zone default now()
);
alter table public.messages enable row level security;

-- ==========================================
-- NOVAS TABELAS PARA O HUB MULTIDISCIPLINAR
-- ==========================================

-- 1. NUTRIÇÃO
create table public.diet_plans (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.profiles(id),
  nutritionist_name text, -- Pode ser FK para profiles se o nutri usar o sistema
  goal text, -- Ex: 'Hipertrofia', 'Emagrecimento'
  daily_calories int,
  protein_pct int,
  carbs_pct int,
  fat_pct int,
  created_at timestamp with time zone default now()
);
alter table public.diet_plans enable row level security;

create table public.diet_meals (
  id uuid default uuid_generate_v4() primary key,
  diet_plan_id uuid references public.diet_plans(id) on delete cascade,
  name text, -- Ex: 'Café da Manhã'
  time_schedule text, -- Ex: '07:00'
  calories int,
  protein int,
  items text[] -- Array de strings com os alimentos
);
alter table public.diet_meals enable row level security;

-- TRACKING DE REFEIÇÕES (NOVO)
create table public.diet_logs (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.profiles(id),
  meal_id uuid references public.diet_meals(id),
  log_date date default current_date,
  is_completed boolean default false,
  notes text, -- Observações do paciente ("Comi fora", "Troquei frango por peixe")
  created_at timestamp with time zone default now()
);
alter table public.diet_logs enable row level security;


-- 2. TREINO (EDUCAÇÃO FÍSICA)
create table public.workout_routines (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.profiles(id),
  trainer_name text,
  name text, -- Ex: 'Treino A - Peito e Tríceps'
  created_at timestamp with time zone default now()
);
alter table public.workout_routines enable row level security;

create table public.workout_exercises (
  id uuid default uuid_generate_v4() primary key,
  routine_id uuid references public.workout_routines(id) on delete cascade,
  name text,
  sets int,
  reps text, -- Texto para permitir "12-15" ou "Falha"
  rest text, -- Ex: "60s"
  notes text,
  video_url text
);
alter table public.workout_exercises enable row level security;

-- 3. MENTORIA (PERFORMANCE)
create table public.mentorship_goals (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.profiles(id),
  title text not null,
  status text check (status in ('pending', 'in_progress', 'achieved')),
  deadline date,
  category text, -- 'career', 'health', 'mindset'
  created_at timestamp with time zone default now()
);
alter table public.mentorship_goals enable row level security;


-- 3. GATILHOS E FUNÇÕES AUTOMÁTICAS

-- Trigger para criar perfil automaticamente ao cadastrar usuário no Auth do Supabase
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'name', 'patient');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
