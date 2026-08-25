-- 1. Insert a global guest user so foreign key constraints still pass
INSERT INTO public.users (id, email) 
VALUES ('00000000-0000-0000-0000-000000000000', 'guest@flowspend.com')
ON CONFLICT (id) DO NOTHING;

-- 2. Disable Row Level Security so anyone can read/write
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies just to be clean
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON public.transactions;
