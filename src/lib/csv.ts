/**
 * CSV Generation & Download Utilities with formula injection safeguards.
 */

const DANGEROUS_PREFIXES = ["=", "+", "-", "@", "\t", "\r"];

/**
 * Sanitizes a cell value to prevent CSV Formula Injection (CWE-1236).
 * Prepends a single quote if string begins with unsafe characters.
 */
export function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  let str = String(value);

  // CSV Injection guard
  if (DANGEROUS_PREFIXES.some((prefix) => str.startsWith(prefix))) {
    str = `'${str}`;
  }

  // If contains commas, double quotes, or newlines, quote the entire field
  if (str.includes('"') || str.includes(",") || str.includes("\n") || str.includes("\r")) {
    str = `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Converts 2D array of rows into CSV string.
 */
export function buildCsvString(rows: (string | number | undefined | null)[][]): string {
  return rows.map((row) => row.map(sanitizeCsvCell).join(",")).join("\r\n");
}

/**
 * Triggers client-side browser download for generated CSV content.
 */
export function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
