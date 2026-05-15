-- Pavex Institutional Fintech Platform - Core Schema

-- 1. Profiles (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'superuser')),
    tier TEXT DEFAULT 'Starter' CHECK (tier IN ('Starter', 'Professional', 'Enterprise')),
    risk_score TEXT DEFAULT 'Low' CHECK (risk_score IN ('Low', 'Medium', 'High')),
    mfa_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Vaults (Institutional Multi-Signature)
CREATE TABLE IF NOT EXISTS public.vaults (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'Institutional' CHECK (type IN ('Hot', 'Cold', 'Institutional')),
    threshold_n INTEGER NOT NULL DEFAULT 1,
    threshold_m INTEGER NOT NULL DEFAULT 1,
    owner_id UUID REFERENCES auth.users ON DELETE CASCADE,
    balance_usd DECIMAL(20, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Vault Signers
CREATE TABLE IF NOT EXISTS public.vault_signers (
    vault_id UUID REFERENCES public.vaults ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    role TEXT DEFAULT 'signer' CHECK (role IN ('signer', 'admin', 'viewer')),
    PRIMARY KEY (vault_id, user_id)
);

-- 4. Transactions (Audit Log)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    vault_id UUID REFERENCES public.vaults ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('Deposit', 'Withdrawal', 'Trade', 'Transfer', 'Key Rotation')),
    asset TEXT NOT NULL,
    amount DECIMAL(36, 18) NOT NULL,
    amount_usd DECIMAL(20, 2),
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Failed', 'Cancelled')),
    hash TEXT UNIQUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Portfolio Tracking
CREATE TABLE IF NOT EXISTS public.portfolio (
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    asset_id TEXT NOT NULL,
    asset_symbol TEXT NOT NULL,
    quantity DECIMAL(36, 18) DEFAULT 0,
    average_buy_price DECIMAL(20, 2),
    PRIMARY KEY (user_id, asset_id)
);

-- RLS (Row Level Security) - Basic Policy Examples
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_signers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see/edit their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Vaults: Only signers/owners can view
DROP POLICY IF EXISTS "Signers can view vaults" ON public.vaults;
CREATE POLICY "Signers can view vaults" ON public.vaults FOR SELECT 
USING (
    auth.uid() = owner_id OR 
    EXISTS (SELECT 1 FROM public.vault_signers WHERE vault_id = public.vaults.id AND user_id = auth.uid())
);

-- Transactions: Only involved users can view
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT 
USING (auth.uid() = user_id);

-- Functions & Triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- API KEYS TABLE (PHASE 9)
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_prefix TEXT NOT NULL, -- First 8 chars of the key
  key_hash TEXT NOT NULL,   -- Hashed key for verification
  scopes TEXT[] DEFAULT '{read}', -- e.g., {'read', 'write', 'vault_approve'}
  ip_whitelist TEXT[] DEFAULT '{}',
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WEBHOOKS TABLE (PHASE 9)
CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  events TEXT[] DEFAULT '{}', -- e.g., {'transaction.created', 'vault.approval_requested'}
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS FOR API KEYS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own API keys" ON api_keys;
CREATE POLICY "Users can manage their own API keys" ON api_keys
  FOR ALL USING (auth.uid() = user_id);

-- RLS FOR WEBHOOKS
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own webhooks" ON webhooks;
CREATE POLICY "Users can manage their own webhooks" ON webhooks
  FOR ALL USING (auth.uid() = user_id);