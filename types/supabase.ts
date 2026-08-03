export type UserRole = 'user' | 'admin' | 'superuser' | 'super_admin';
export type UserTier = 'Starter' | 'Professional' | 'Enterprise';
export type RiskScore = 'Low' | 'Medium' | 'High';

// ─── Banking Types ───────────────────────────────────────────

export type AccountType = 'checking' | 'savings' | 'business' | 'notice_deposit' | 'fixed_deposit';
export type AccountStatus = 'active' | 'frozen' | 'closed' | 'pending';
export type TransferType = 'domestic' | 'international' | 'internal';
export type TransferStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type LoanType = 'personal' | 'mortgage' | 'property' | 'business' | 'auto' | 'portfolio_secured';
export type LoanStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'active' | 'paid_off' | 'defaulted';
export type KycDocumentType = 'passport' | 'national_id' | 'drivers_license' | 'utility_bill' | 'bank_statement' | 'proof_of_address';
export type KycStatus = 'pending' | 'approved' | 'rejected';
export type ReferralStatus = 'pending' | 'registered' | 'credited' | 'expired';
export type CardStatus = 'active' | 'frozen' | 'expired' | 'cancelled' | 'pending';
export type CardNetwork = 'Visa' | 'Mastercard';

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
  currency?: string;         // ISO 4217 code, defaults to 'USD'
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
  subject: string | null;
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

// ─── New Banking Interfaces ──────────────────────────────────

export interface BankAccount {
  id: string;
  user_id: string;
  account_name: string;
  account_number: string;
  account_type: AccountType;
  currency: string;
  balance: number;
  interest_rate: number;
  is_primary: boolean;
  status: AccountStatus;
  created_at: string;
  updated_at: string;
}

export interface Transfer {
  id: string;
  sender_id: string;
  recipient_name: string;
  recipient_account: string;
  bank_name: string | null;
  bank_code: string | null;
  amount: number;
  currency: string;
  type: TransferType;
  status: TransferStatus;
  reference: string | null;
  description: string | null;
  fee: number;
  exchange_rate: number | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface Loan {
  id: string;
  user_id: string;
  loan_type: LoanType;
  amount: number;
  purpose: string;
  duration_months: number;
  interest_rate: number;
  monthly_payment: number | null;
  total_repayment: number | null;
  amount_paid: number;
  next_due_date: string | null;
  status: LoanStatus;
  reviewed_by: string | null;
  rejection_reason: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface KycDocument {
  id: string;
  user_id: string;
  document_type: KycDocumentType;
  file_url: string;
  file_name: string | null;
  status: KycStatus;
  rejection_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string | null;
  referred_email: string | null;
  status: ReferralStatus;
  bonus_amount: number;
  bonus_currency: string;
  credited_at: string | null;
  created_at: string;
}

export interface Card {
  id: string;
  user_id: string;
  bank_account_id: string | null;
  card_type: 'virtual' | 'physical';
  card_network: CardNetwork;
  last_four: string;
  expiry_month: number;
  expiry_year: number;
  spending_limit: number;
  status: CardStatus;
  created_at: string;
}

export interface PlatformSetting {
  key: string;
  value: string;
  description: string | null;
  updated_by: string | null;
  updated_at: string;
}
