"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/services/supabase";

export type PortfolioAsset = {
  user_id: string;
  asset_id: string;
  asset_symbol: string;
  quantity: number;
  average_buy_price: number;
};

export function usePortfolio() {
  const supabase = createClient();

  return useQuery<PortfolioAsset[]>({
    queryKey: ["portfolio"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      
      const { data, error } = await supabase
        .from("portfolio")
        .select("*")
        .eq("user_id", session.user.id);
      
      if (error) throw error;
      return data;
    },
  });
}
