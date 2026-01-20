-- Copy and paste this entire file into the Supabase SQL Editor

-- 1. Create the 'cards' table to store digital visiting cards
create table public.cards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text,
  job text,
  company text,
  email text,
  phone text,
  website text,
  address text,
  theme text,
  custom_bg_color text,
  background_image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS) for privacy
alter table public.cards enable row level security;

-- 3. Create Policies (Who can do what?)

-- Allow users to insert their OWN cards
create policy "Users can insert their own card"
  on public.cards for insert
  with check (auth.uid() = user_id);

-- Allow users to update ONLY their OWN cards
create policy "Users can update their own card"
  on public.cards for update
  using (auth.uid() = user_id);

-- Allow users to see ONLY their OWN cards
create policy "Users can view their own card"
  on public.cards for select
  using (auth.uid() = user_id);

-- 4. Create the 'profiles' table for user metadata (Subscription Status)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  is_pro boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);
-- Allow service role or system to insert profiles (usually handled by trigger)
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);

-- 5. Trigger to handle new user signup and create a profile automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, is_pro)
  values (new.id, false);
  return new;
end;
$$ language plpgsql security modeller;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
