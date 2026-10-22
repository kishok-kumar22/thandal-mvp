"use server";

import { getCurrentUser } from "@/lib/session";
import { getMyLoan } from "@/lib/customerPortal";
import { appendAudit } from "@/lib/mockStore";
import { buildCsvString } from "@/lib/csv";
import { normaliseRef } from "@/lib/format";

export async function downloadStatementAction(rawLoanId: string): Promise<{
  success: boolean;
  csvContent?: string;
  filename?: string;
  error?: string;
}> {
  const user = await getCurrentUser();
  if (!user || user.role !== "customer") {
    return { success: false, error: "Unauthorized access." };
  }

  const canonicalId = normaliseRef(rawLoanId);

  try {
    const { loan, scheduleRows, receipts } = await getMyLoan(user, canonicalId);

    // Build customer-safe statement CSV
    const rows: (string | number)[][] = [
      ["THANDAL LOAN ACCOUNT STATEMENT", ""],
      ["Loan Reference", loan.id],
      ["Customer Name", loan.customerName],
      ["Status", loan.status.toUpperCase()],
      ["Repayment Frequency", loan.frequency.toUpperCase()],
      ["Principal Amount (INR)", loan.overview.principal],
      ["Interest Amount (INR)", loan.overview.interest],
      ["Total Repayment (INR)", loan.overview.total],
      ["Total Paid (INR)", loan.overview.paid],
      ["Remaining Balance (INR)", loan.overview.remaining],
      ["Disbursement Date", loan.disbursedOn],
      ["Next Due Date", loan.overview.nextDue ? loan.overview.nextDue.dueOn : "N/A"],
      [],
      ["REPAYMENT SCHEDULE", "", "", "", "", "", ""],
      [
        "Instalment #",
        "Due Date",
        "Principal (INR)",
        "Interest (INR)",
        "Due Amount (INR)",
        "Paid Amount (INR)",
        "Status",
      ],
    ];

    for (const item of scheduleRows) {
      let statusLabel = item.status;
      if (item.status === "paid_at_disbursement") {
        statusLabel = "Paid at disbursement" as any;
      } else if (item.status === "partial") {
        statusLabel = "Part paid" as any;
      } else {
        statusLabel = (item.status.charAt(0).toUpperCase() + item.status.slice(1)) as any;
      }

      rows.push([
        item.instalmentNumber,
        item.dueDate,
        item.principal,
        item.interest,
        item.dueAmount,
        item.paidAmount,
        statusLabel,
      ]);
    }

    rows.push([]);
    rows.push(["PAYMENT HISTORY", "", "", "", ""]);
    rows.push(["Receipt No.", "Payment Date", "Amount (INR)", "Payment Type", "Remarks"]);

    for (const rc of receipts) {
      rows.push([rc.receiptNo, rc.paidDateFormatted, rc.amount, rc.paymentTypeLabel, rc.remark]);
    }

    const csvContent = buildCsvString(rows);
    const filename = `${loan.id}-statement.csv`;

    // Append statement_downloaded audit entry
    appendAudit({
      action: "statement_downloaded",
      entityType: "loan",
      entityId: loan.id,
      details: `Statement for ${loan.id} downloaded`,
      actorOverride: user,
    });

    return {
      success: true,
      csvContent,
      filename,
    };
  } catch (err) {
    return { success: false, error: "Failed to generate loan statement." };
  }
}
