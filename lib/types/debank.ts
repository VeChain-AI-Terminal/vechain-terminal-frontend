// transaction history
// lib/types/debank.ts
export interface TransactionHistory {
  cate_dict: Record<string, { id: string; name: string }>;
  cex_dict: Record<string, unknown>;
  history_list: HistoryItem[];
  project_dict: Record<string, ProjectInfo>;
  token_dict: Record<string, TokenInfo>;
}

export interface HistoryItem {
  cate_id: string | null;
  cex_id: string | null;
  chain: string;
  id: string;
  idx: number;
  is_scam: boolean;
  other_addr: string | null;
  project_id: string | null;
  receives: Transfer[];
  sends: Transfer[];
  time_at: number;
  token_approve: TokenApprove | null;
  tx: Transaction;
}

export interface Transfer {
  amount: number;
  token_id: string;
  from_addr?: string;
  to_addr?: string;
}

export interface TokenApprove {
  spender: string;
  token_id: string;
  value: number;
}

export interface Transaction {
  eth_gas_fee: number;
  from_addr: string;
  id: string;
  idx: number;
  message: string | null;
  name: string | null;
  params: unknown[];
  selector: string | null;
  status: number;
  to_addr: string;
  usd_gas_fee: number;
  value: number;
}

export interface ProjectInfo {
  chain: string;
  id: string;
  logo_url: string;
  name: string;
  site_url: string;
}

export interface TokenInfo {
  chain: string;
  credit_score: number;
  decimals: number;
  display_symbol: string | null;
  id: string;
  is_core: boolean | null;
  is_scam: boolean;
  is_suspicious: boolean | null;
  is_verified: boolean;
  is_wallet: boolean | null;
  logo_url: string | null;
  name: string;
  optimized_symbol: string;
  price: number;
  price_24h_change: number | null;
  protocol_id: string;
  symbol: string;
  time_at: number | null;
  total_supply: number;
}
