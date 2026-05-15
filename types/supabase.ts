export type UserRole = 'user' | 'admin' | 'superuser';
export type UserTier = 'Starter' | 'Professional' | 'Enterprise';
export type RiskScore = 'Low' | 'Medium' | 'High';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  role: UserRole;
  tier: UserTier;
  risk_score: RiskScore;
  mfa_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Vault {
  id: string;
  name: string;
  type: 'Hot' | 'Cold' | 'Institutional';
  threshold_n: number;
  threshold_m: number;
  owner_id: string;
  balance_usd: number;
  created_at: string;
  vault_signers?: VaultSigner[];
}

export interface VaultSigner {
  vault_id: string;
  user_id: string;
  role: 'signer' | 'admin' | 'viewer';
}

export interface Transaction {
  id: string;
  user_id: string;
  vault_id: string | null;
  type: 'Deposit' | 'Withdrawal' | 'Trade' | 'Transfer' | 'Key Rotation';
  asset: string;
  amount: number;
  amount_usd: number | null;
  status: 'Pending' | 'Completed' | 'Failed' | 'Cancelled';
  hash: string | null;
  metadata: Record<string, any>;
  created_at: string;
}
