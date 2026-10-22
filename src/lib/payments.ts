import { ALLOW_ADVANCE_PAYMENT } from "@/config/payments";

export interface AllocationInput {
  amount: number;
  penaltyDue: number;
  arrearsDue: number;
  scheduledDue: number;
}

export interface AllocationResult {
  toPenalty: number;
  toArrears: number;
  toScheduled: number;
  applied: number;
  remainingBalance: number;
  status: "paid" | "partial";
}

/**
 * Pure allocation calculator.
 * Applies payments in priority order: Penalty -> Arrears -> Scheduled.
 * All figures use integer rupees.
 */
export function allocatePayment(input: AllocationInput): AllocationResult {
  const penaltyDue = Math.max(0, Math.round(input.penaltyDue || 0));
  const arrearsDue = Math.max(0, Math.round(input.arrearsDue || 0));
  const scheduledDue = Math.max(0, Math.round(input.scheduledDue || 0));
  const totalDue = penaltyDue + arrearsDue + scheduledDue;

  const rawAmount = Math.round(input.amount || 0);

  if (rawAmount <= 0) {
    throw new Error("Payment amount must be greater than zero");
  }

  if (!ALLOW_ADVANCE_PAYMENT && rawAmount > totalDue) {
    throw new Error(`Amount cannot exceed the total due of ₹${totalDue}`);
  }

  let remainingToAllocate = rawAmount;

  // 1. Penalty
  const toPenalty = Math.min(penaltyDue, remainingToAllocate);
  remainingToAllocate -= toPenalty;

  // 2. Arrears
  const toArrears = Math.min(arrearsDue, remainingToAllocate);
  remainingToAllocate -= toArrears;

  // 3. Scheduled
  const toScheduled = Math.min(scheduledDue, remainingToAllocate);
  remainingToAllocate -= toScheduled;

  const applied = toPenalty + toArrears + toScheduled;
  const remainingBalance = Math.max(0, totalDue - applied);
  const status: "paid" | "partial" = remainingBalance === 0 ? "paid" : "partial";

  return {
    toPenalty,
    toArrears,
    toScheduled,
    applied,
    remainingBalance,
    status,
  };
}

// ==========================================
// Unit Assertions (Executed in Development)
// ==========================================
if (process.env.NODE_ENV !== "production") {
  // Test Case 1: Partial payment of 50 against 105 scheduled
  const t1 = allocatePayment({ amount: 50, penaltyDue: 0, arrearsDue: 0, scheduledDue: 105 });
  if (t1.toScheduled !== 50 || t1.remainingBalance !== 55 || t1.status !== "partial") {
    console.error("Assertion failed: Case 1 allocatePayment (50, 0, 0, 105)", t1);
  }

  // Test Case 2: Full payment of 105 against 105 scheduled
  const t2 = allocatePayment({ amount: 105, penaltyDue: 0, arrearsDue: 0, scheduledDue: 105 });
  if (t2.toScheduled !== 105 || t2.remainingBalance !== 0 || t2.status !== "paid") {
    console.error("Assertion failed: Case 2 allocatePayment (105, 0, 0, 105)", t2);
  }

  // Test Case 3: 100 against penalty 10, arrears 200, scheduled 0
  const t3 = allocatePayment({ amount: 100, penaltyDue: 10, arrearsDue: 200, scheduledDue: 0 });
  if (t3.toPenalty !== 10 || t3.toArrears !== 90 || t3.remainingBalance !== 110 || t3.status !== "partial") {
    console.error("Assertion failed: Case 3 allocatePayment (100 against 10, 200, 0)", t3);
  }
}
