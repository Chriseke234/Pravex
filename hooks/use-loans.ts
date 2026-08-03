"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Loan, LoanType } from "@/types/supabase";

export function useLoans() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const loansQuery = useQuery<Loan[]>({
    queryKey: ["loans"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];

      const { data, error } = await supabase
        .from("loans")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as Loan[];
    },
  });

  const applyForLoan = useMutation({
    mutationFn: async (payload: {
      loan_type: LoanType;
      amount: number;
      purpose: string;
      duration_months: number;
    }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const rate = payload.loan_type === "mortgage" ? 4.5 : payload.loan_type === "property" ? 5.8 : 6.5;
      const r = rate / 100 / 12;
      const n = payload.duration_months;
      const monthly_payment = (payload.amount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
      const total_repayment = monthly_payment * n;

      const { data, error } = await supabase
        .from("loans")
        .insert([{
          user_id: session.user.id,
          loan_type: payload.loan_type,
          amount: payload.amount,
          purpose: payload.purpose,
          duration_months: payload.duration_months,
          interest_rate: rate,
          monthly_payment,
          total_repayment,
          amount_paid: 0,
          status: "pending",
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
    },
  });

  return {
    loans: loansQuery.data || [],
    isLoading: loansQuery.isLoading,
    error: loansQuery.error,
    applyForLoan,
  };
}
