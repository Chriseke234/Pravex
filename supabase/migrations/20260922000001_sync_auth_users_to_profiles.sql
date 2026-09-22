-- Migration Script: Fix user profile creation on signup, backfill missing profiles, and grant Admin/SuperAdmin RLS access on profiles.

-- 1. Function to handle new user registration from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    derived_name TEXT;
    derived_role TEXT;
BEGIN
    -- Extract full name or fallback to first + last name, name, or email prefix
    derived_name := COALESCE(
        (NEW.raw_user_meta_data->>'full_name'),
        NULLIF(TRIM(CONCAT((NEW.raw_user_meta_data->>'first_name'), ' ', (NEW.raw_user_meta_data->>'last_name'))), ''),
        (NEW.raw_user_meta_data->>'name'),
        SPLIT_PART(NEW.email, '@', 1)
    );

    -- Extract role or default to 'user'
    derived_role := COALESCE((NEW.raw_user_meta_data->>'role'), 'user');
    IF derived_role NOT IN ('user', 'admin', 'superuser', 'super_admin') THEN
        derived_role := 'user';
    END IF;

    -- Insert into profiles table
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        avatar_url,
        role,
        tier,
        risk_score,
        mfa_enabled
    )
    VALUES (
        NEW.id,
        NEW.email,
        derived_name,
        (NEW.raw_user_meta_data->>'avatar_url'),
        derived_role,
        'Starter',
        'Low',
        FALSE
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Backfill any existing accounts in auth.users that are missing in public.profiles
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    role,
    tier,
    risk_score,
    mfa_enabled
)
SELECT
    u.id,
    u.email,
    COALESCE(
        (u.raw_user_meta_data->>'full_name'),
        NULLIF(TRIM(CONCAT((u.raw_user_meta_data->>'first_name'), ' ', (u.raw_user_meta_data->>'last_name'))), ''),
        (u.raw_user_meta_data->>'name'),
        SPLIT_PART(u.email, '@', 1)
    ) AS full_name,
    (u.raw_user_meta_data->>'avatar_url') AS avatar_url,
    CASE 
        WHEN (u.raw_user_meta_data->>'role') IN ('user', 'admin', 'superuser', 'super_admin') THEN (u.raw_user_meta_data->>'role')
        ELSE 'user'
    END AS role,
    'Starter' AS tier,
    'Low' AS risk_score,
    FALSE AS mfa_enabled
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 4. Backfill wallets for any profiles missing a wallet
INSERT INTO public.wallets (user_id, balance)
SELECT id, 0.00 FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;

-- 5. Row Level Security Policies on public.profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow Admins & Superadmins to view all profiles
DROP POLICY IF EXISTS "Admins/Superadmins can view all profiles" ON public.profiles;
CREATE POLICY "Admins/Superadmins can view all profiles" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_admin_or_superadmin());

-- Allow Admins & Superadmins to update profiles
DROP POLICY IF EXISTS "Admins/Superadmins can update profiles" ON public.profiles;
CREATE POLICY "Admins/Superadmins can update profiles" ON public.profiles
    FOR UPDATE USING (public.is_admin_or_superadmin());

-- Allow users to insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
