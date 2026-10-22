/**
 * Date and time formatting helpers strictly configured for Asia/Kolkata timezone.
 */

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Parses YYYY-MM-DD or ISO string into local day, month, year.
 */
function parseDateParts(dateStr: string): { day: number; month: number; year: number } {
  const clean = dateStr.slice(0, 10);
  const [y, m, d] = clean.split("-").map(Number);
  return { year: y, month: m, day: d };
}

/**
 * Formats date into "22 Oct 2026".
 */
export function formatDateKolkata(dateStr: string): string {
  if (!dateStr) return "";
  const { day, month, year } = parseDateParts(dateStr);
  return `${day} ${MONTHS_SHORT[month - 1]} ${year}`;
}

/**
 * Formats an ISO timestamp into "22 Oct 2026, 10:30" (24-hour time).
 */
export function formatDateTime24(iso: string): string {
  if (!iso) return "";
  const datePart = iso.slice(0, 10);
  const timePart = iso.length >= 16 ? iso.slice(11, 16) : "00:00";
  const { day, month, year } = parseDateParts(datePart);
  return `${day} ${MONTHS_SHORT[month - 1]} ${year}, ${timePart}`;
}

/**
 * Formats a date range with an en dash: "21 Oct 2026 – 22 Oct 2026".
 */
export function formatDateRange(from: string, to: string): string {
  if (!from && !to) return "";
  if (!from) return formatDateKolkata(to);
  if (!to) return formatDateKolkata(from);
  return `${formatDateKolkata(from)} – ${formatDateKolkata(to)}`;
}

/**
 * Checks if a date or ISO string is within an inclusive range [from, to].
 * from and to are "YYYY-MM-DD" strings.
 */
export function isWithinRange(isoOrDate: string, from: string, to: string): boolean {
  if (!isoOrDate) return false;
  const date = isoOrDate.slice(0, 10);
  return date >= from && date <= to;
}
