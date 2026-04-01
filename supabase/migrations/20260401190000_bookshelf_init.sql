-- Bookshelf initial schema
-- Date: 2026-04-01

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique not null,
  display_name text not null,
  avatar_url text,
  bio text default '',
  monthly_goal integer default 4,
  yearly_goal integer default 40,
  premium boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  cover_image text,
  description text not null,
  genres text[] default '{}',
  rating numeric(2,1) default 0,
  pages integer not null,
  published_year integer,
  affiliate_url text,
  created_at timestamptz default now()
);

create table if not exists public.shelves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  shelf_type text not null check (shelf_type in ('want_to_read', 'currently_reading', 'finished')),
  created_at timestamptz default now(),
  unique (user_id, shelf_type)
);

create table if not exists public.user_books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  shelf text not null check (shelf in ('want_to_read', 'currently_reading', 'finished')),
  progress integer default 0 check (progress >= 0 and progress <= 100),
  rating integer check (rating >= 1 and rating <= 5),
  liked boolean default false,
  last_opened_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, book_id)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  body text not null,
  tags text[] default '{}',
  helpful_votes integer default 0,
  created_at timestamptz default now(),
  unique (user_id, book_id)
);

create table if not exists public.follows (
  follower_id uuid not null references public.users(id) on delete cascade,
  followee_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (follower_id, followee_id),
  check (follower_id <> followee_id)
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.users(id) on delete cascade,
  book_id uuid references public.books(id) on delete set null,
  activity_type text not null check (activity_type in ('finished', 'rated', 'added')),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.book_clubs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  description text default '',
  visibility text not null check (visibility in ('public', 'private')),
  current_book_id uuid references public.books(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.club_members (
  club_id uuid not null references public.book_clubs(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'moderator', 'member')),
  joined_at timestamptz default now(),
  primary key (club_id, user_id)
);

create table if not exists public.club_threads (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.book_clubs(id) on delete cascade,
  book_id uuid references public.books(id) on delete set null,
  title text not null,
  body text,
  created_by uuid not null references public.users(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  quote text,
  note text not null,
  page_number integer,
  created_at timestamptz default now()
);

create index if not exists idx_books_genres on public.books using gin (genres);
create index if not exists idx_books_rating on public.books (rating desc);
create index if not exists idx_user_books_user_shelf on public.user_books (user_id, shelf);
create index if not exists idx_reviews_book on public.reviews (book_id, helpful_votes desc);
create index if not exists idx_activities_actor_created on public.activities (actor_id, created_at desc);
create index if not exists idx_activities_created on public.activities (created_at desc);
create index if not exists idx_club_members_user on public.club_members (user_id);
create index if not exists idx_notes_user_book on public.notes (user_id, book_id);

alter table public.users enable row level security;
alter table public.books enable row level security;
alter table public.shelves enable row level security;
alter table public.user_books enable row level security;
alter table public.reviews enable row level security;
alter table public.follows enable row level security;
alter table public.activities enable row level security;
alter table public.book_clubs enable row level security;
alter table public.club_members enable row level security;
alter table public.club_threads enable row level security;
alter table public.notes enable row level security;

create policy "Public books are readable" on public.books for select using (true);
create policy "Public clubs are readable" on public.book_clubs for select using (visibility = 'public' or owner_id = auth.uid());
create policy "Public reviews are readable" on public.reviews for select using (true);
create policy "Users manage own profile" on public.users for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users manage own shelves" on public.shelves for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own user_books" on public.user_books for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own reviews" on public.reviews for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own follows" on public.follows for all using (auth.uid() = follower_id) with check (auth.uid() = follower_id);
create policy "Activities readable by everyone" on public.activities for select using (true);
create policy "Users create own activities" on public.activities for insert with check (auth.uid() = actor_id);
create policy "Users read own notes" on public.notes for select using (auth.uid() = user_id);
create policy "Users write own notes" on public.notes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Members can read club members" on public.club_members for select using (true);
create policy "Members can join club" on public.club_members for insert with check (auth.uid() = user_id);
create policy "Public thread read" on public.club_threads for select using (true);
create policy "Members write threads" on public.club_threads for insert with check (auth.uid() = created_by);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row execute function public.handle_updated_at();

drop trigger if exists trg_user_books_updated_at on public.user_books;
create trigger trg_user_books_updated_at
before update on public.user_books
for each row execute function public.handle_updated_at();