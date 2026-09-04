-- Enable if your project does not already have it
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists public.prototypes (
  id uuid primary key default gen_random_uuid(),
  url text unique not null,
  title text,
  owner_id uuid not null references public.profiles(id),
  owner_email text,
  owner_name text,
  created_at timestamptz default now()
);

create table if not exists public.prototype_members (
  prototype_id uuid references public.prototypes(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  role text default 'reviewer',
  primary key (prototype_id, user_id)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  prototype_id uuid not null references public.prototypes(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  author_email text,
  author_name text,
  parent_id uuid references public.comments(id) on delete cascade,
  body text not null,
  mentions jsonb default '[]'::jsonb,
  anchor jsonb not null,
  resolved boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.annotations (
  id uuid primary key default gen_random_uuid(),
  prototype_id uuid not null references public.prototypes(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  author_email text,
  author_name text,
  body text not null,
  kind text not null default 'implement',
  anchor jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.content_suggestions (
  id uuid primary key default gen_random_uuid(),
  prototype_id uuid not null references public.prototypes(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  author_email text,
  author_name text,
  original_text text,
  suggested_text text not null,
  rationale text,
  status text not null default 'pending',
  anchor jsonb not null,
  reviewer_id uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.prototypes enable row level security;
alter table public.prototype_members enable row level security;
alter table public.comments enable row level security;
alter table public.annotations enable row level security;
alter table public.content_suggestions enable row level security;
alter table public.notifications enable row level security;

-- Internal tool: any signed-in org user can read. Domain restriction happens in Auth.
create policy "profiles read" on public.profiles for select to authenticated using (true);
create policy "profiles write self" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles update self" on public.profiles for update to authenticated using (auth.uid() = id);

create policy "prototypes read" on public.prototypes for select to authenticated using (true);
create policy "prototypes insert" on public.prototypes for insert to authenticated with check (auth.uid() = owner_id);
create policy "prototypes owner update" on public.prototypes for update to authenticated using (auth.uid() = owner_id);

create policy "members read" on public.prototype_members for select to authenticated using (true);
create policy "members insert" on public.prototype_members for insert to authenticated with check (auth.uid() = user_id);

create policy "comments read" on public.comments for select to authenticated using (true);
create policy "comments insert" on public.comments for insert to authenticated with check (auth.uid() = author_id);
create policy "comments update" on public.comments for update to authenticated
  using (auth.uid() = author_id or exists (
    select 1 from public.prototypes p where p.id = prototype_id and p.owner_id = auth.uid()
  ));

create policy "annotations read" on public.annotations for select to authenticated using (true);
create policy "annotations insert" on public.annotations for insert to authenticated with check (auth.uid() = author_id);
create policy "annotations delete" on public.annotations for delete to authenticated using (auth.uid() = author_id);

create policy "suggestions read" on public.content_suggestions for select to authenticated using (true);
create policy "suggestions insert" on public.content_suggestions for insert to authenticated with check (auth.uid() = author_id);
create policy "suggestions review" on public.content_suggestions for update to authenticated
  using (auth.uid() = author_id or exists (
    select 1 from public.prototypes p where p.id = prototype_id and p.owner_id = auth.uid()
  ));

create policy "notifications read own" on public.notifications for select to authenticated using (auth.uid() = user_id);
create policy "notifications insert" on public.notifications for insert to authenticated with check (true);
create policy "notifications update own" on public.notifications for update to authenticated using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.email),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  )
  on conflict (id) do update set
    email = excluded.email,
    display_name = excluded.display_name,
    avatar_url = excluded.avatar_url;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
