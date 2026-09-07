-- VibeCheck Phase 6 schema
-- Paste into the Supabase SQL editor after creating the project.
-- Comments and annotations share one table (`type` = note | annotation).

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  name text,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists public.prototypes (
  id uuid primary key default gen_random_uuid(),
  url text not null unique,
  title text,
  owner_id uuid references public.profiles(id),
  created_at timestamptz default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  prototype_id uuid not null references public.prototypes(id) on delete cascade,
  author_id uuid references public.profiles(id),
  author_name text,
  body text not null default '',
  type text not null default 'note' check (type in ('note', 'annotation')),
  kind text,
  resolved boolean not null default false,
  parent_id uuid references public.comments(id) on delete cascade,
  anchor jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.content_suggestions (
  id uuid primary key default gen_random_uuid(),
  prototype_id uuid not null references public.prototypes(id) on delete cascade,
  author_id uuid references public.profiles(id),
  author_name text,
  original_text text,
  suggested_text text,
  rationale text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  anchor jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  prototype_id uuid references public.prototypes(id) on delete cascade,
  type text,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.prototypes enable row level security;
alter table public.comments enable row level security;
alter table public.content_suggestions enable row level security;
alter table public.notifications enable row level security;

create policy "org members read profiles" on public.profiles
  for select to authenticated using (true);
create policy "users update own profile" on public.profiles
  for update to authenticated using (id = auth.uid());

create policy "org members read prototypes" on public.prototypes
  for select to authenticated using (true);
create policy "org members write prototypes" on public.prototypes
  for insert to authenticated with check (true);
create policy "org members update prototypes" on public.prototypes
  for update to authenticated using (true);

create policy "org members read comments" on public.comments
  for select to authenticated using (true);
create policy "org members write comments" on public.comments
  for insert to authenticated with check (true);
create policy "authors update comments" on public.comments
  for update to authenticated using (author_id = auth.uid());
create policy "authors delete comments" on public.comments
  for delete to authenticated using (author_id = auth.uid());

create policy "org members read suggestions" on public.content_suggestions
  for select to authenticated using (true);
create policy "org members write suggestions" on public.content_suggestions
  for insert to authenticated with check (true);
create policy "org members update suggestions" on public.content_suggestions
  for update to authenticated using (true);

create policy "users read own notifications" on public.notifications
  for select to authenticated using (user_id = auth.uid());
create policy "org members write notifications" on public.notifications
  for insert to authenticated with check (true);
create policy "users update own notifications" on public.notifications
  for update to authenticated using (user_id = auth.uid());
