-- =============================================================
-- Iron Bridge — Banking Platform Tables Migration
-- Version: 20260803000002
-- Additive only — no existing tables modified
-- =============================================================

-- 1. Bank Accounts
CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  account_name    TEXT NOT NULL,
  account_number  TEXT UNIQUE NOT NULL,
  account_type    TEXT DEFAULT 'checking' CHECK (account_type IN ('checking', 'savings', 'business', 'notice_deposit', 'fixed_deposit')),
  currency        TEXT DEFAULT 'USD',
  balance         DECIMAL(20, 2) DEFAULT 0,
  interest_rate   DECIMAL(5, 2) DEFAULT 0,
  is_primary      BOOLEAN DEFAULT FALSE,
  status          TEXT DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'closed', 'pending')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Transfers (domestic, international, internal)
CREATE TABLE IF NOT EXISTS public.transfers (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id           UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  recipient_name      TEXT NOT NULL,
  recipient_account   TEXT NOT NULL,
  bank_name           TEXT,
  bank_code           TEXT,
  amount              DECIMAL(20, 2) NOT NULL,
  currency            TEXT DEFAULT 'USD',
  type                TEXT DEFAULT 'domestic' CHECK (type IN ('domestic', 'international', 'internal')),
  status              TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  reference           TEXT,
  description         TEXT,
  fee                 DECIMAL(10, 2) DEFAULT 0,
  exchange_rate       DECIMAL(10, 6),
  metadata            JSONB DEFAULT '{}',
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Loans
CREATE TABLE IF NOT EXISTS public.loans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  loan_type       TEXT DEFAULT 'personal' CHECK (loan_type IN ('personal', 'mortgage', 'property', 'business', 'auto', 'portfolio_secured')),
  amount          DECIMAL(20, 2) NOT NULL,
  purpose         TEXT NOT NULL,
  duration_months INTEGER NOT NULL,
  interest_rate   DECIMAL(5, 2) NOT NULL DEFAULT 5.5,
  monthly_payment DECIMAL(20, 2),
  total_repayment DECIMAL(20, 2),
  amount_paid     DECIMAL(20, 2) DEFAULT 0,
  next_due_date   DATE,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'active', 'paid_off', 'defaulted')),
  reviewed_by     UUID REFERENCES auth.users,
  rejection_reason TEXT,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 4. KYC Documents
CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  document_type   TEXT NOT NULL CHECK (document_type IN ('passport', 'national_id', 'drivers_license', 'utility_bill', 'bank_statement', 'proof_of_address')),
  file_url        TEXT NOT NULL,
  file_name       TEXT,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  reviewed_by     UUID REFERENCES auth.users,
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Referrals
CREATE TABLE IF NOT EXISTS public.referrals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id     UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  referred_id     UUID REFERENCES auth.users ON DELETE SET NULL,
  referred_email  TEXT,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'registered', 'credited', 'expired')),
  bonus_amount    DECIMAL(20, 2) DEFAULT 10.00,
  bonus_currency  TEXT DEFAULT 'USD',
  credited_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Debit / Credit Cards
CREATE TABLE IF NOT EXISTS public.cards (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  bank_account_id   UUID REFERENCES public.bank_accounts ON DELETE SET NULL,
  card_type         TEXT DEFAULT 'virtual' CHECK (card_type IN ('virtual', 'physical')),
  card_network      TEXT DEFAULT 'Visa' CHECK (card_network IN ('Visa', 'Mastercard')),
  last_four         TEXT NOT NULL,
  expiry_month      INTEGER NOT NULL CHECK (expiry_month BETWEEN 1 AND 12),
  expiry_year       INTEGER NOT NULL,
  spending_limit    DECIMAL(20, 2) DEFAULT 5000,
  status            TEXT DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'expired', 'cancelled', 'pending')),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Platform Settings (admin key-value store)
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key           TEXT PRIMARY KEY,
  value         TEXT NOT NULL,
  description   TEXT,
  updated_by    UUID REFERENCES auth.users,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- Row Level Security
-- =============================================================

ALTER TABLE public.bank_accounts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Bank Accounts: users see only their own
DROP POLICY IF EXISTS "Users can view own bank accounts" ON public.bank_accounts;
CREATE POLICY "Users can view own bank accounts" ON public.bank_accounts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own bank accounts" ON public.bank_accounts;
CREATE POLICY "Users can insert own bank accounts" ON public.bank_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own bank accounts" ON public.bank_accounts;
CREATE POLICY "Users can update own bank accounts" ON public.bank_accounts
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all bank accounts" ON public.bank_accounts;
CREATE POLICY "Admins can view all bank accounts" ON public.bank_accounts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superuser', 'super_admin'))
  );

-- Transfers: users see only their own
DROP POLICY IF EXISTS "Users can view own transfers" ON public.transfers;
CREATE POLICY "Users can view own transfers" ON public.transfers
  FOR SELECT USING (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can create transfers" ON public.transfers;
CREATE POLICY "Users can create transfers" ON public.transfers
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Admins can view all transfers" ON public.transfers;
CREATE POLICY "Admins can view all transfers" ON public.transfers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superuser', 'super_admin'))
  );

-- Loans: users see only their own
DROP POLICY IF EXISTS "Users can view own loans" ON public.loans;
CREATE POLICY "Users can view own loans" ON public.loans
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can apply for loans" ON public.loans;
CREATE POLICY "Users can apply for loans" ON public.loans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all loans" ON public.loans;
CREATE POLICY "Admins can manage all loans" ON public.loans
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superuser', 'super_admin'))
  );

-- KYC Documents: users see only their own
DROP POLICY IF EXISTS "Users can view own KYC documents" ON public.kyc_documents;
CREATE POLICY "Users can view own KYC documents" ON public.kyc_documents
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can upload KYC documents" ON public.kyc_documents;
CREATE POLICY "Users can upload KYC documents" ON public.kyc_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all KYC documents" ON public.kyc_documents;
CREATE POLICY "Admins can manage all KYC documents" ON public.kyc_documents
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superuser', 'super_admin'))
  );

-- Referrals: referrer sees their own referrals
DROP POLICY IF EXISTS "Users can view own referrals" ON public.referrals;
CREATE POLICY "Users can view own referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id);

DROP POLICY IF EXISTS "Users can create referrals" ON public.referrals;
CREATE POLICY "Users can create referrals" ON public.referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_id);

DROP POLICY IF EXISTS "Admins can view all referrals" ON public.referrals;
CREATE POLICY "Admins can view all referrals" ON public.referrals
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superuser', 'super_admin'))
  );

-- Cards: users see only their own
DROP POLICY IF EXISTS "Users can view own cards" ON public.cards;
CREATE POLICY "Users can view own cards" ON public.cards
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own cards" ON public.cards;
CREATE POLICY "Users can insert own cards" ON public.cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own cards" ON public.cards;
CREATE POLICY "Users can update own cards" ON public.cards
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all cards" ON public.cards;
CREATE POLICY "Admins can manage all cards" ON public.cards
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superuser', 'super_admin'))
  );

-- Platform settings: admins only
DROP POLICY IF EXISTS "Admins can manage platform settings" ON public.platform_settings;
CREATE POLICY "Admins can manage platform settings" ON public.platform_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superuser', 'super_admin'))
  );

-- =============================================================
-- Triggers for updated_at
-- =============================================================

DROP TRIGGER IF EXISTS set_bank_accounts_updated_at ON public.bank_accounts;
CREATE TRIGGER set_bank_accounts_updated_at
  BEFORE UPDATE ON public.bank_accounts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_loans_updated_at ON public.loans;
CREATE TRIGGER set_loans_updated_at
  BEFORE UPDATE ON public.loans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================
-- Seed default platform settings
-- =============================================================
INSERT INTO public.platform_settings (key, value, description)
VALUES
  ('maintenance_mode',      'false',   'Enable maintenance mode (true/false)'),
  ('max_deposit_amount',    '100000',  'Maximum single deposit amount in USD'),
  ('max_withdrawal_amount', '50000',   'Maximum single withdrawal amount in USD'),
  ('referral_bonus',        '10',      'Referral bonus amount in USD'),
  ('min_loan_amount',       '1000',    'Minimum loan application amount in USD'),
  ('max_loan_amount',       '500000',  'Maximum loan application amount in USD')
ON CONFLICT (key) DO NOTHING;
