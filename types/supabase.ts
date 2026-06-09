export type UserRole = 'user' | 'admin' | 'superuser' | 'super_admin';
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

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'credit' | 'debit';
  status: 'pending' | 'completed' | 'failed';
  reference: string | null;
  description: string | null;
  created_at: string;
}

export interface Withdrawal {
  id: string;
  user_id: string;
  amount: number;
  bank_name: string;
  account_name: string;
  account_number: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  created_at: string;
}

export interface Deposit {
  id: string;
  user_id: string;
  amount: number;
  provider: string;
  reference: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  status: 'open' | 'closed' | 'escalated';
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string | null;
  attachment_url: string | null;
  created_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  login_time: string;
  last_activity: string;
  status: 'online' | 'offline';
  device: string | null;
  ip_address: string | null;
}

export interface Notification {
  id: string;
  recipient_id: string | null;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  actor_role: string;
  action: string;
  target: string;
  metadata: Record<string, any>;
  created_at: string;
}

