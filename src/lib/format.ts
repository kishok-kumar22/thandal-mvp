/**
 * Formats a number as Indian Rupee (INR) currency string with the ₹ symbol.
 * Example: 1845000 -> "₹18,45,000"
 */
export function formatINR(amount: number): string {
  const formatter = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  });
  return `₹${formatter.format(amount)}`;
}

/**
 * Formats a number using Indian grouping without the ₹ currency symbol.
 * Example: 5000 -> "5,000", 10000 -> "10,000"
 */
export function formatNumberIN(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a number as a compact representation with 'k' or 'L'.
 * Example: 32000 -> "₹32k", 50000 -> "₹50k"
 */
export function formatCompactINR(amount: number): string {
  if (amount === 0) return "₹0";
  if (amount >= 100000) {
    const l = amount / 100000;
    return `₹${l % 1 === 0 ? l : l.toFixed(1)}L`;
  }
  if (amount >= 1000) {
    const k = amount / 1000;
    return `₹${k % 1 === 0 ? k : k.toFixed(1)}k`;
  }
  return `₹${amount}`;
}

/**
 * Calculates percentage integer safely.
 */
export function calculatePercentage(current: number, target: number): number {
  if (!target || target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

/**
 * Formats a Date or date string to YYYY-MM-DD for HTML5 date inputs.
 */
export function formatDateInput(date: Date | string): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats a number to percentage string with two decimals.
 * Example: 71.428 -> "71.43%"
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * Splits an array of values into percentages using the Largest Remainder Method (Hare-Niemeyer).
 * Guarantees that the returned percentages sum to exactly 100.00.
 */
export function splitPercentages(values: number[]): number[] {
  const total = values.reduce((sum, v) => sum + Math.max(0, v), 0);
  if (total <= 0) {
    return values.map(() => 0);
  }

  // Multiply by 10,000 to work in hundredths of a percent (e.g. 100.00% = 10000 units)
  const TARGET_SUM = 10000;

  const components = values.map((val, index) => {
    const raw = (Math.max(0, val) / total) * TARGET_SUM;
    const floor = Math.floor(raw);
    const remainder = raw - floor;
    return { index, floor, remainder };
  });

  const allocatedSum = components.reduce((acc, c) => acc + c.floor, 0);
  let remainderToDistribute = TARGET_SUM - allocatedSum;

  // Sort descending by remainder to distribute remaining units
  components.sort((a, b) => b.remainder - a.remainder);

  for (let i = 0; i < remainderToDistribute; i++) {
    components[i % components.length].floor += 1;
  }

  // Restore original ordering
  components.sort((a, b) => a.index - b.index);

  return components.map((c) => Number((c.floor / 100).toFixed(2)));
}

