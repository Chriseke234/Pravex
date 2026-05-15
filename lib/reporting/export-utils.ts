/**
 * Institutional Reporting Utilities
 * Handles the generation and formatting of audit-ready PDF/CSV reports.
 */

export type ExportFormat = "PDF" | "CSV" | "JSON";

export async function exportInstitutionalData(
  data: any[],
  filename: string,
  format: ExportFormat = "CSV"
) {
  console.log(`Starting institutional export: ${filename}.${format.toLowerCase()}`);
  
  if (format === "CSV") {
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(obj => Object.values(obj).join(",")).join("\n");
    const csvContent = `${headers}\n${rows}`;
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // PDF and JSON logic would go here
    console.warn(`${format} export logic is pending implementation in Phase 8.4`);
  }
}

export function calculateRiskMetrics(returns: number[]) {
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  
  // Risk Free Rate (Mock 0.02)
  const rf = 0.02;
  const sharpe = (avgReturn - rf) / stdDev;
  
  return {
    sharpe: sharpe.toFixed(2),
    volatility: (stdDev * 100).toFixed(2) + "%",
    alpha: (avgReturn * 1.5).toFixed(2), // Simplified Alpha mock
  };
}
