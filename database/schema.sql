-- Users are managed by Supabase Auth (auth.users), but we can create a public profile table if needed,
-- or just link directly to auth.users.id. We will create a public.users table that syncs with auth.
-- But based on the spec, we can just use a simple users table for application data.

CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    preferred_currency VARCHAR(10) DEFAULT 'USD',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) NOT NULL,
    raw_input TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10),
    category VARCHAR(50) NOT NULL,
    merchant VARCHAR(100),
    mood_tag VARCHAR(50) NOT NULL,
    reflection_status VARCHAR(20) DEFAULT 'None' CHECK (reflection_status IN ('WorthIt', 'Regret', 'None')),
    transaction_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row-Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

-- RLS Policies for transactions table
CREATE POLICY "Users can view own transactions" 
ON public.transactions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" 
ON public.transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" 
ON public.transactions FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" 
ON public.transactions FOR DELETE 
USING (auth.uid() = user_id);

-- Optional: Function to automatically create user profile when signing up via Supabase Auth
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Trigger to call the function after a user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
