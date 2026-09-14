-- =============================================================
-- Iron Bridge Banking — Fix Missing RLS Policies
-- Version: 20260914000001
-- Fixes:
--   1. Cards table was missing INSERT and UPDATE policies for users
--      (caused "Issue Virtual Card" to silently fail)
--   2. Ensures bank_accounts INSERT/UPDATE policies exist
--      (caused "Open Account" to silently fail)
-- =============================================================

-- ── Cards: Add missing INSERT + UPDATE for users ──────────────
DROP POLICY IF EXISTS "Users can insert own cards" ON public.cards;
CREATE POLICY "Users can insert own cards" ON public.cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own cards" ON public.cards;
CREATE POLICY "Users can update own cards" ON public.cards
  FOR UPDATE USING (auth.uid() = user_id);

-- ── Bank Accounts: Re-create to ensure they exist ─────────────
DROP POLICY IF EXISTS "Users can insert own bank accounts" ON public.bank_accounts;
CREATE POLICY "Users can insert own bank accounts" ON public.bank_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own bank accounts" ON public.bank_accounts;
CREATE POLICY "Users can update own bank accounts" ON public.bank_accounts
  FOR UPDATE USING (auth.uid() = user_id);

-- ── Wallet Transactions: Ensure users can insert their own ─────
-- (needed for transfer debit records)
DROP POLICY IF EXISTS "Users can insert own wallet transactions" ON public.wallet_transactions;
CREATE POLICY "Users can insert own wallet transactions" ON public.wallet_transactions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.wallets w WHERE w.id = wallet_id AND w.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update own wallet" ON public.wallets;
CREATE POLICY "Users can update own wallet" ON public.wallets
  FOR UPDATE USING (auth.uid() = user_id);
