# Supabase Connection Setup

The code has been updated to use Supabase, but it needs your unique project keys to work.

## 1. Get Your Credentials
1.  Log in to [supabase.com](https://supabase.com/dashboard).
2.  Select your project (or create a new one).
3.  Go to **Settings** (Gear icon) -> **API**.
4.  Find **Project URL** and **anon public** key.

## 2. Configure the App
Open the file `js/core/database.js` and replace the placeholders:

```javascript
// js/core/database.js

// ❌ REPLACE THIS:
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';

// ✅ WITH THIS (Example):
const SUPABASE_URL = 'https://xyzcompany.supabase.co';
const SUPABASE_KEY = 'eyJh...';
```

## 3. Create the Database Table
Go to the **SQL Editor** in your Supabase Dashboard and run this script:

```sql
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
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.cards enable row level security;

create policy "Users can insert their own card" on public.cards for insert with check (auth.uid() = user_id);
create policy "Users can update their own card" on public.cards for update using (auth.uid() = user_id);
create policy "Users can view their own card" on public.cards for select using (auth.uid() = user_id);
```
