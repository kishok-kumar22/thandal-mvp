/**
 * Pure, unit-testable calendar helper functions for repayment schedules.
 * Works strictly in the Asia/Kolkata timezone context without relying on system `new Date()` for "today".
 */

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

export type MonthEndRule = "last_valid_day" | "first_of_next_month";
export type HolidayRule = "next_collection_day" | "previous_collection_day" | "no_adjustment";
export type Frequency = "daily" | "weekly" | "monthly";

export interface HolidayItem {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
}

export interface CalendarSettings {
  weeklyDueDay: Weekday;
  monthlyDueDay: number; // 1-31
  monthEndRule: MonthEndRule;
  holidayRule: HolidayRule;
  collectionDays: Weekday[]; // e.g. [1, 2, 3, 4, 5, 6]
  holidays: HolidayItem[];
}

export const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/**
 * Returns true if a leap year in the Gregorian calendar.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Returns number of days in a given year and month (1-12).
 */
export function getDaysInMonth(year: number, month: number): number {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  if ([4, 6, 9, 11].includes(month)) {
    return 30;
  }
  return 31;
}

/**
 * Pads a number to 2 digits.
 */
function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/**
 * Parses YYYY-MM-DD into { year, month, day }
 */
export function parseDateParts(dateStr: string): { year: number; month: number; day: number } {
  const parts = dateStr.split("-").map(Number);
  return { year: parts[0], month: parts[1], day: parts[2] };
}

/**
 * Formats { year, month, day } into YYYY-MM-DD
 */
export function formatDateParts(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

/**
 * Returns Weekday (0-6) for a given YYYY-MM-DD string using UTC calculation to avoid local time skew.
 */
export function getWeekday(dateStr: string): Weekday {
  const { year, month, day } = parseDateParts(dateStr);
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCDay() as Weekday;
}

/**
 * Adds integer days to a YYYY-MM-DD string.
 */
export function addDays(dateStr: string, count: number): string {
  const { year, month, day } = parseDateParts(dateStr);
  const d = new Date(Date.UTC(year, month - 1, day));
  d.setUTCDate(d.getUTCDate() + count);
  return formatDateParts(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

/**
 * Returns the next date on or after `from` that falls on `targetWeekday`.
 * If `from` is already on `targetWeekday`, returns `from` if `inclusive` is true, otherwise the next week (+7 days).
 */
export function nextWeekday(from: string, targetWeekday: Weekday, inclusive = false): string {
  const currentWeekday = getWeekday(from);
  let diff = (targetWeekday - currentWeekday + 7) % 7;
  if (diff === 0 && !inclusive) {
    diff = 7;
  }
  return addDays(from, diff);
}

/**
 * Resolves a day-of-month target for a given year and month according to monthEndRule.
 * If the month has fewer days than `day`:
 * - "last_valid_day" -> last day of that month (e.g. 28 Feb 2027)
 * - "first_of_next_month" -> 1st day of the next month (e.g. 1 Mar)
 */
export function resolveMonthDay(
  year: number,
  month: number, // 1-12
  day: number, // 1-31
  monthEndRule: MonthEndRule
): string {
  const daysInMonth = getDaysInMonth(year, month);
  if (day <= daysInMonth) {
    return formatDateParts(year, month, day);
  }

  if (monthEndRule === "last_valid_day") {
    return formatDateParts(year, month, daysInMonth);
  }

  // first_of_next_month
  let nextYear = year;
  let nextMonth = month + 1;
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear++;
  }
  return formatDateParts(nextYear, nextMonth, 1);
}

/**
 * Finds the next monthly repayment date on or after `from` that targets `day`.
 */
export function nextMonthlyDate(from: string, day: number, monthEndRule: MonthEndRule): string {
  const { year, month } = parseDateParts(from);
  const candidateThisMonth = resolveMonthDay(year, month, day, monthEndRule);

  if (candidateThisMonth >= from) {
    return candidateThisMonth;
  }

  let nextYear = year;
  let nextMonth = month + 1;
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear++;
  }
  return resolveMonthDay(nextYear, nextMonth, day, monthEndRule);
}

/**
 * Determines whether a date is an active collection day:
 * Weekday must be in `calendar.collectionDays` AND date must NOT be a registered holiday.
 */
export function isCollectionDay(dateStr: string, calendar: CalendarSettings): boolean {
  const weekday = getWeekday(dateStr);
  if (!calendar.collectionDays.includes(weekday)) {
    return false;
  }
  const isHoliday = calendar.holidays.some((h) => h.date === dateStr);
  return !isHoliday;
}

/**
 * Adjusts a nominal date for holidays / non-collection days.
 * - "next_collection_day" moves forward to the next collection day.
 * - "previous_collection_day" moves backward.
 * - "no_adjustment" returns unchanged.
 * Caps search at 14 days to prevent runaway loops, returning original date if no collection day found.
 */
export function adjustForHoliday(dateStr: string, calendar: CalendarSettings): string {
  if (calendar.holidayRule === "no_adjustment") {
    return dateStr;
  }

  if (isCollectionDay(dateStr, calendar)) {
    return dateStr;
  }

  const step = calendar.holidayRule === "previous_collection_day" ? -1 : 1;
  let current = dateStr;

  for (let i = 1; i <= 14; i++) {
    current = addDays(current, step);
    if (isCollectionDay(current, calendar)) {
      return current;
    }
  }

  return dateStr;
}

/**
 * Computes repayment due dates.
 * 
 * RULE:
 * - Nominal dates are computed from `firstDue` (daily +n, weekly +7n, monthly n months later via resolveMonthDay).
 * - Each nominal date is adjusted INDEPENDENTLY via `adjustForHoliday` so adjustments never drift.
 * - Holiday/collection-day adjustments apply ONLY to WEEKLY and MONTHLY loans.
 *   Daily loans stay calendar-daily (business requirement: daily loans run every calendar day).
 * - After adjustment, dates must remain non-decreasing and total term length is preserved.
 */
export function buildDueDates(params: {
  firstDue: string;
  frequency: Frequency;
  term: number;
  calendar: CalendarSettings;
}): string[] {
  const { firstDue, frequency, term, calendar } = params;
  if (term <= 0) return [];

  const dates: string[] = [];
  const { year, month, day } = parseDateParts(firstDue);

  for (let i = 0; i < term; i++) {
    let nominal: string;

    if (frequency === "daily") {
      nominal = addDays(firstDue, i);
      // Daily loans stay calendar-daily with no holiday adjustment
      dates.push(nominal);
      continue;
    } else if (frequency === "weekly") {
      nominal = addDays(firstDue, i * 7);
    } else {
      // Monthly
      const targetMonthIndex = month + i;
      const y = year + Math.floor((targetMonthIndex - 1) / 12);
      const m = ((targetMonthIndex - 1) % 12) + 1;
      nominal = resolveMonthDay(y, m, day, calendar.monthEndRule);
    }

    const adjusted = i === 0 ? nominal : adjustForHoliday(nominal, calendar);

    // Ensure non-decreasing constraint
    if (dates.length > 0 && adjusted < dates[dates.length - 1]) {
      dates.push(dates[dates.length - 1]);
    } else {
      dates.push(adjusted);
    }
  }

  return dates;
}

// ----------------------------------------------------------------------------
// PLAIN TYPESCRIPT RUNTIME ASSERTIONS (Verifies requirement 4 constraints)
// ----------------------------------------------------------------------------
function runCalendarAssertions(): void {
  const baseCalendar: CalendarSettings = {
    weeklyDueDay: 1, // Monday
    monthlyDueDay: 5,
    monthEndRule: "last_valid_day",
    holidayRule: "next_collection_day",
    collectionDays: [1, 2, 3, 4, 5, 6], // Mon-Sat
    holidays: [{ id: "HOL-1", date: "2026-11-02", name: "Nov Holiday" }],
  };

  // Assertion (a): weekly from Mon 26 Oct 2026 with holiday on Mon 2 Nov 2026 and "next_collection_day"
  // Expected: 26 Oct, 3 Nov, 9 Nov
  const resultA = buildDueDates({
    firstDue: "2026-10-26",
    frequency: "weekly",
    term: 3,
    calendar: baseCalendar,
  });
  if (
    resultA[0] !== "2026-10-26" ||
    resultA[1] !== "2026-11-03" ||
    resultA[2] !== "2026-11-09"
  ) {
    throw new Error(`Calendar Assertion (a) failed: got ${JSON.stringify(resultA)}`);
  }

  // Assertion (b): same with "previous_collection_day"
  // Expected: 26 Oct, 31 Oct (Saturday, since 1 Nov is Sunday), 9 Nov
  const resultB = buildDueDates({
    firstDue: "2026-10-26",
    frequency: "weekly",
    term: 3,
    calendar: { ...baseCalendar, holidayRule: "previous_collection_day" },
  });
  if (
    resultB[0] !== "2026-10-26" ||
    resultB[1] !== "2026-10-31" ||
    resultB[2] !== "2026-11-09"
  ) {
    throw new Error(`Calendar Assertion (b) failed: got ${JSON.stringify(resultB)}`);
  }

  // Assertion (c): monthly from 31 Jan 2027, "last_valid_day"
  // 28 Feb 2027 is a Sunday -> with Mon-Sat collection days and "next_collection_day", becomes Mon 1 Mar 2027
  // Expected: 31 Jan, 1 Mar, 31 Mar
  const resultC = buildDueDates({
    firstDue: "2027-01-31",
    frequency: "monthly",
    term: 3,
    calendar: {
      ...baseCalendar,
      holidays: [],
      holidayRule: "next_collection_day",
      monthEndRule: "last_valid_day",
    },
  });
  if (
    resultC[0] !== "2027-01-31" ||
    resultC[1] !== "2027-03-01" ||
    resultC[2] !== "2027-03-31"
  ) {
    throw new Error(`Calendar Assertion (c) failed: got ${JSON.stringify(resultC)}`);
  }

  // Assertion (d): daily loans are unchanged
  const resultD = buildDueDates({
    firstDue: "2026-11-01",
    frequency: "daily",
    term: 3,
    calendar: baseCalendar, // Has holiday on 2026-11-02
  });
  if (
    resultD[0] !== "2026-11-01" ||
    resultD[1] !== "2026-11-02" ||
    resultD[2] !== "2026-11-03"
  ) {
    throw new Error(`Calendar Assertion (d) failed: got ${JSON.stringify(resultD)}`);
  }
}

// Execute assertions at module load time to guarantee correctness
runCalendarAssertions();
