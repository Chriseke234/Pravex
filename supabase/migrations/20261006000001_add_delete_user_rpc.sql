-- Migration Script: Add RPC function delete_user_by_admin to allow Super Admins & Admins to permanently delete user accounts and cascade data.

CREATE OR REPLACE FUNCTION public.delete_user_by_admin(target_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    admin_id UUID;
    admin_role TEXT;
BEGIN
    -- Authorization check: caller must be admin or superadmin
    IF NOT public.is_admin_or_superadmin() THEN
        RAISE EXCEPTION 'Unauthorized: Only Super Admins and Admins can delete user accounts.';
    END IF;

    admin_id := auth.uid();
    SELECT role INTO admin_role FROM public.profiles WHERE id = admin_id;

    -- Log deletion in audit_logs before removing records
    INSERT INTO public.audit_logs (actor_id, actor_role, action, target, metadata)
    VALUES (
        admin_id,
        COALESCE(admin_role, 'super_admin'),
        'user_deletion',
        target_user_id::text,
        jsonb_build_object('deleted_at', NOW())
    );

    -- Delete from public.profiles (cascades to wallets, wallet_transactions, deposits, withdrawals, etc.)
    DELETE FROM public.profiles WHERE id = target_user_id;

    -- Delete from auth.users (cascades to bank_accounts, transfers, loans, cards, kyc_documents, etc.)
    DELETE FROM auth.users WHERE id = target_user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
