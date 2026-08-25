-- Add a "type" column to distinguish between income and expenses
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'expense' CHECK (type IN ('income', 'expense'));

-- You should run this in your Supabase SQL Editor.
