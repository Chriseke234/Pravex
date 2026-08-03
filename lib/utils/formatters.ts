/**
 * Utility functions for Iron Bridge Banking formatting
 */

export function formatCurrency(
  amount: number | string | null | undefined,
  currency: string = 'USD',
  maximumFractionDigits: number = 2
): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '$0.00'
  }
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits,
  }).format(numericAmount)
}

export function formatPercent(
  value: number | string | null | undefined,
  includeSign: boolean = true
): string {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '0.00%'
  }
  const num = typeof value === 'string' ? parseFloat(value) : value
  const prefix = includeSign && num > 0 ? '+' : ''
  return `${prefix}${num.toFixed(2)}%`
}

export function formatDate(
  dateInput: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!dateInput) return 'N/A'
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (isNaN(date.getTime())) return 'Invalid date'

  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }

  return new Intl.DateTimeFormat('en-US', options || defaultOptions).format(date)
}

export function truncateAddress(address: string, startLength: number = 6, endLength: number = 4): string {
  if (!address) return ''
  if (address.length <= startLength + endLength) return address
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

export function getStatusBadgeStyle(status: string): { bg: string; text: string; border: string } {
  const normalized = (status || '').toLowerCase()
  switch (normalized) {
    case 'completed':
    case 'approved':
    case 'active':
    case 'success':
      return {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-500/20 dark:border-emerald-500/30',
      }
    case 'pending':
    case 'processing':
    case 'awaiting_approval':
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-500/15',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-500/20 dark:border-amber-500/30',
      }
    case 'failed':
    case 'rejected':
    case 'cancelled':
    case 'inactive':
      return {
        bg: 'bg-rose-500/10 dark:bg-rose-500/15',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-500/20 dark:border-rose-500/30',
      }
    default:
      return {
        bg: 'bg-slate-500/10 dark:bg-slate-500/15',
        text: 'text-slate-600 dark:text-slate-400',
        border: 'border-slate-500/20 dark:border-slate-500/30',
      }
  }
}
