/**
 * Global Clock Service
 * 
 * In mock / prototype mode, this returns fixed simulated timestamps
 * (22 Oct 2026 10:30 AM Asia/Kolkata) so that "today due", cashbook ledgers,
 * receipts, and default form values perfectly match design specifications.
 * 
 * In production:
 * Replace `now()` and `today()` with `new Date();`
 */

export function today(): Date {
  // Pinned date: 22 Oct 2026 00:00:00 (Asia/Kolkata is UTC+5:30)
  return new Date("2026-10-22T00:00:00+05:30");
}

export function now(): Date {
  // Pinned time: 22 Oct 2026 10:30:00 (Asia/Kolkata)
  return new Date("2026-10-22T10:30:00+05:30");
}

export function todayIso(): string {
  // Returns YYYY-MM-DD
  return "2026-10-22";
}

export function todayFormatted(): string {
  // Returns "22 Oct 2026"
  return "22 Oct 2026";
}

export function formatTime12h(dateOrIso?: string | Date): string {
  if (!dateOrIso) return "10:30 AM";
  const d = typeof dateOrIso === "string" ? new Date(dateOrIso) : dateOrIso;
  if (isNaN(d.getTime())) return "10:30 AM";
  
  return d.toLocaleTimeString("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function toPaidAtISO(dateStr: string, timeStr: string): string {
  // dateStr is YYYY-MM-DD, timeStr is HH:mm (24-hour) or like 10:30 AM
  let hours = 10;
  let minutes = 30;

  if (timeStr) {
    const match12 = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (match12) {
      let h = parseInt(match12[1], 10);
      const m = parseInt(match12[2], 10);
      const period = match12[3]?.toUpperCase();
      if (period === "PM" && h < 12) h += 12;
      if (period === "AM" && h === 12) h = 0;
      hours = h;
      minutes = m;
    }
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${dateStr}T${pad(hours)}:${pad(minutes)}:00+05:30`;
}
