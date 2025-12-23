create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key,
  role text not null default 'candidate',
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.candidate_profiles (
  user_id uuid primary key,
  services text[] not null default '{}',
  min_rate numeric,
  opt_in_sms boolean not null default true,
  unsubscribed boolean not null default false,
  suspended_until timestamptz,
  reliability_score int not null default 50,
  last_offered_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  employer_user_id uuid not null,
  service_type text not null,
  location text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  hourly_rate numeric not null,
  tips_flag boolean not null default false,
  status text not null default 'open',
  confirmed_offer_id uuid,
  last_dispatch_at timestamptz,
  dispatch_count int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.shift_offers (
  id uuid primary key default gen_random_uuid(),
  shift_id uuid not null references public.shifts(id) on delete cascade,
  candidate_user_id uuid not null,
  offer_code text not null,
  status text not null default 'sent',
  sent_at timestamptz not null default now(),
  accepted_at timestamptz,
  confirmed_at timestamptz,
  declined_at timestamptz,
  candidate_cancelled_at timestamptz
);

create unique index if not exists ux_shift_offers_code on public.shift_offers(offer_code);
create index if not exists idx_shift_offers_shift on public.shift_offers(shift_id);
create index if not exists idx_shift_offers_candidate on public.shift_offers(candidate_user_id);

create table if not exists public.candidate_applications (
  token uuid primary key default gen_random_uuid(),
  email text not null,
  phone text not null,
  services text[] not null,
  min_rate numeric,
  opt_in_sms boolean not null default true,
  unsubscribed boolean not null default false,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  user_id uuid
);
