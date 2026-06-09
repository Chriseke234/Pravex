-- Migration Script: Add Wallet, Support Chat, Sessions, Notifications, and Audit Logs

-- 1. Helper Functions for Role Authorization
CREATE OR REPLACE FUNCTION public.is_admin_or_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin', 'superuser', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('superuser', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Alter Profiles role check constraint and add suspended column
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin', 'superuser', 'super_admin'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS suspended BOOLEAN DEFAULT FALSE;

-- 3. Wallet Tables
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    balance NUMERIC(20, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC(20, 2) NOT NULL CHECK (amount > 0),
    type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'credit', 'debit')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    reference TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC(20, 2) NOT NULL CHECK (amount > 0),
    bank_name TEXT NOT NULL,
    account_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.deposits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC(20, 2) NOT NULL CHECK (amount > 0),
    provider TEXT NOT NULL,
    reference TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Support Messaging (Chat) Tables
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'escalated')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    message TEXT,
    attachment_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. User Session & Monitoring Table
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    login_time TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_activity TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    status TEXT NOT NULL DEFAULT 'online' CHECK (status IN ('online', 'offline')),
    device TEXT,
    ip_address TEXT
);

-- 6. Notification Center Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- Null means broadcast to everyone
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. Audit Logging Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    metadata JSONB DEFAULT '{}' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. Row Level Security (RLS) Configuration

-- Enable RLS
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Wallets RLS Policies
CREATE POLICY "Users can view own wallet" ON public.wallets
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_superadmin());

-- Wallet Transactions RLS Policies
CREATE POLICY "Users can view own wallet transactions" ON public.wallet_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.wallets 
            WHERE wallets.id = wallet_transactions.wallet_id AND wallets.user_id = auth.uid()
        ) OR public.is_admin_or_superadmin()
    );

CREATE POLICY "Admins/Superadmins can manage transactions" ON public.wallet_transactions
    FOR ALL USING (public.is_admin_or_superadmin());

-- Withdrawals RLS Policies
CREATE POLICY "Users can view own withdrawals" ON public.withdrawals
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_superadmin());

CREATE POLICY "Users can create withdrawals" ON public.withdrawals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins/Superadmins can update withdrawals" ON public.withdrawals
    FOR UPDATE USING (public.is_admin_or_superadmin());

-- Deposits RLS Policies
CREATE POLICY "Users can view own deposits" ON public.deposits
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_superadmin());

CREATE POLICY "Users can create deposits" ON public.deposits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins/Superadmins can update deposits" ON public.deposits
    FOR UPDATE USING (public.is_admin_or_superadmin());

-- Conversations RLS Policies
CREATE POLICY "Users can view own conversations" ON public.conversations
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_superadmin());

CREATE POLICY "Users can create conversations" ON public.conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins/Superadmins can update conversations" ON public.conversations
    FOR UPDATE USING (public.is_admin_or_superadmin());

-- Messages RLS Policies
CREATE POLICY "Users can view own conversation messages" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE conversations.id = messages.conversation_id AND conversations.user_id = auth.uid()
        ) OR public.is_admin_or_superadmin()
    );

CREATE POLICY "Users can send messages to own conversations" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND (
            EXISTS (
                SELECT 1 FROM public.conversations 
                WHERE conversations.id = conversation_id AND conversations.user_id = auth.uid()
            ) OR public.is_admin_or_superadmin()
        )
    );

-- User Sessions RLS Policies
CREATE POLICY "Users can manage own sessions" ON public.user_sessions
    FOR ALL USING (auth.uid() = user_id OR public.is_admin_or_superadmin());

-- Notifications RLS Policies
CREATE POLICY "Users can view own or broadcast notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = recipient_id OR recipient_id IS NULL OR public.is_admin_or_superadmin());

CREATE POLICY "Users can mark own notifications as read" ON public.notifications
    FOR UPDATE USING (auth.uid() = recipient_id);

CREATE POLICY "Admins/Superadmins can create notifications" ON public.notifications
    FOR INSERT WITH CHECK (public.is_admin_or_superadmin());

-- Audit Logs RLS Policies
CREATE POLICY "Superadmins can view audit logs" ON public.audit_logs
    FOR SELECT USING (public.is_superadmin());

-- 9. Trigger Functions

-- Trigger: Update updated_at on wallet
CREATE OR REPLACE FUNCTION public.handle_wallet_updated_at()
BEFORE UPDATE ON public.wallets
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Trigger: Auto-create wallet for new profile
CREATE OR REPLACE FUNCTION public.handle_new_profile_wallet()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.wallets (user_id, balance)
    VALUES (NEW.id, 0.00)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_wallet_on_profile_signup
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile_wallet();

-- Create wallets for any existing profiles
INSERT INTO public.wallets (user_id, balance)
SELECT id, 0.00 FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;

-- Trigger: Update wallet balance on completed wallet transaction
CREATE OR REPLACE FUNCTION public.handle_new_wallet_transaction()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' THEN
        IF NEW.type IN ('deposit', 'credit') THEN
            UPDATE public.wallets
            SET balance = balance + NEW.amount
            WHERE id = NEW.wallet_id;
        ELSIF NEW.type IN ('withdrawal', 'debit') THEN
            UPDATE public.wallets
            SET balance = balance - NEW.amount
            WHERE id = NEW.wallet_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_wallet_transaction_insert
AFTER INSERT ON public.wallet_transactions
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_wallet_transaction();

-- Trigger: When deposit status becomes completed, insert a wallet transaction
CREATE OR REPLACE FUNCTION public.handle_deposit_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status <> 'completed') THEN
        INSERT INTO public.wallet_transactions (wallet_id, amount, type, status, reference, description)
        SELECT id, NEW.amount, 'deposit', 'completed', NEW.reference, 'Deposit via ' || NEW.provider
        FROM public.wallets WHERE user_id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_deposit_status_update
AFTER UPDATE OF status ON public.deposits
FOR EACH ROW
EXECUTE FUNCTION public.handle_deposit_status_change();

-- Trigger: When withdrawal status becomes approved, insert a wallet transaction
CREATE OR REPLACE FUNCTION public.handle_withdrawal_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status <> 'approved') THEN
        INSERT INTO public.wallet_transactions (wallet_id, amount, type, status, reference, description)
        SELECT id, NEW.amount, 'withdrawal', 'completed', NEW.id::text, 'Withdrawal to bank account'
        FROM public.wallets WHERE user_id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_withdrawal_status_update
AFTER UPDATE OF status ON public.withdrawals
FOR EACH ROW
EXECUTE FUNCTION public.handle_withdrawal_status_change();
