import assert from "node:assert";
import { calculateLoan, buildSchedule, addMonthsClamped } from "./loan";

// Test 1: Example from user prompt with toggle ON
// 5000 / 5% flat / 50 daily / toggle on -> interest 250, total 5250, instalment 105, net cash 4895, remaining 5145, remaining instalments 49
const onCalc = calculateLoan({
  principal: 5000,
  ratePercent: 5,
  term: 50,
  frequency: "daily",
  collectFirstAtDisbursement: true,
});

assert.strictEqual(onCalc.totalInterest, 250, "Total interest should be 250");
assert.strictEqual(onCalc.totalRepayment, 5250, "Total repayment should be 5250");
assert.strictEqual(onCalc.instalment, 105, "Instalment should be 105");
assert.strictEqual(onCalc.firstInstalmentWithheld, 105, "Withheld should be 105");
assert.strictEqual(onCalc.netCash, 4895, "Net cash should be 4895");
assert.strictEqual(onCalc.remainingToCollect, 5145, "Remaining should be 5145");
assert.strictEqual(onCalc.remainingInstalments, 49, "Remaining instalments should be 49");

// Test 2: Example from user prompt with toggle OFF
// Toggle off -> net cash 5000, remaining 5250, remaining instalments 50
const offCalc = calculateLoan({
  principal: 5000,
  ratePercent: 5,
  term: 50,
  frequency: "daily",
  collectFirstAtDisbursement: false,
});

assert.strictEqual(offCalc.totalInterest, 250);
assert.strictEqual(offCalc.totalRepayment, 5250);
assert.strictEqual(offCalc.instalment, 105);
assert.strictEqual(offCalc.firstInstalmentWithheld, 0);
assert.strictEqual(offCalc.netCash, 5000);
assert.strictEqual(offCalc.remainingToCollect, 5250);
assert.strictEqual(offCalc.remainingInstalments, 50);

// Test 3: Schedule total must strictly equal total repayment
const scheduleOn = buildSchedule({
  principal: 5000,
  ratePercent: 5,
  term: 50,
  frequency: "daily",
  firstDueDate: "2026-10-21",
  collectFirstAtDisbursement: true,
});

assert.strictEqual(scheduleOn.length, 50);
assert.strictEqual(scheduleOn[0].status, "Paid at disbursement");
assert.strictEqual(scheduleOn[1].status, "Pending");
const sumOn = scheduleOn.reduce((acc, item) => acc + item.amount, 0);
assert.strictEqual(sumOn, 5250, "Sum of all schedule instalments must equal totalRepayment");

// Test 4: Schedule with toggle off
const scheduleOff = buildSchedule({
  principal: 5000,
  ratePercent: 5,
  term: 50,
  frequency: "daily",
  firstDueDate: "2026-10-21",
  collectFirstAtDisbursement: false,
});
assert.strictEqual(scheduleOff[0].status, "Pending");
const sumOff = scheduleOff.reduce((acc, item) => acc + item.amount, 0);
assert.strictEqual(sumOff, 5250);

// Test 5: Monthly clamping (31 Jan -> 28 Feb in non-leap year 2027)
const jan31 = new Date("2027-01-31T00:00:00Z");
const febClamped = addMonthsClamped(jan31, 1);
assert.strictEqual(febClamped.getMonth(), 1, "Should be February");
assert.strictEqual(febClamped.getDate(), 28, "Should be clamped to 28 Feb");

console.log("All loan calculations and schedule tests PASSED successfully!");
