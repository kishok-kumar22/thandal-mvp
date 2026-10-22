import { mockCollectionTasks, type CollectionTask } from "@/data/mockCollections";
import { mockReceiptsList } from "@/data/mockReceipts";
import { todayIso } from "./clock";

export type TaskDisplayState = "overdue" | "due_today_unpaid" | "due_today_paid" | "due_today_partial";

export interface AgentTaskView extends CollectionTask {
  state: TaskDisplayState;
  totalPayable: number;
  amountToCollect: number;
  remainingAmount: number;
}

export interface CollectionRowView {
  id: string;
  customerId: string;
  customerName: string;
  loanId: string;
  agentId: string;
  agentName?: string;
  scheduled: number;
  arrears: number;
  penalty: number;
  amountToCollect: number;
  status: "pending" | "overdue" | "paid" | "partial";
  receiptNo?: string;
  paidAt?: string;
  dueOn: string;
}

export interface CollectionSummary {
  dueToday: number;
  receivedToday: number;
  remainingToday: number;
}

/**
 * Returns collection tasks for an agent with full partial-payment awareness.
 * amountToCollect = max(0, scheduled + arrears + penalty - paidAmount)
 */
export function getAgentTasks(
  agentId: string = "A-001",
  currentDateIso: string = todayIso()
): AgentTaskView[] {
  const agentTasks = mockCollectionTasks.filter((t) => t.agentId === agentId);

  const viewTasks: AgentTaskView[] = agentTasks.map((t) => {
    const totalDue = t.amountDue + t.arrears + t.penalty;
    const paidSoFar = t.paidAmount || (t.paid ? totalDue : 0);
    const amountToCollect = Math.max(0, totalDue - paidSoFar);

    let state: TaskDisplayState;
    if (amountToCollect === 0) {
      state = "due_today_paid";
    } else if (paidSoFar > 0) {
      state = "due_today_partial";
    } else if (t.dueOn < currentDateIso || t.arrears > 0) {
      state = "overdue";
    } else {
      state = "due_today_unpaid";
    }

    return {
      ...t,
      state,
      totalPayable: totalDue,
      amountToCollect,
      remainingAmount: amountToCollect,
    };
  });

  // Sort order: overdue (0) -> due_today_partial (1) -> due_today_unpaid (2) -> due_today_paid (3)
  const stateWeight: Record<TaskDisplayState, number> = {
    overdue: 0,
    due_today_partial: 1,
    due_today_unpaid: 2,
    due_today_paid: 3,
  };

  return viewTasks.sort((a, b) => stateWeight[a.state] - stateWeight[b.state]);
}

/**
 * Returns collection tasks across the admin workspace with filters.
 */
export function getCollectionTasks(filter?: {
  date?: string;
  agentId?: string;
  q?: string;
  tab?: "today" | "overdue" | "all";
}): CollectionRowView[] {
  const targetDate = filter?.date || todayIso();
  const agentId = filter?.agentId && filter.agentId !== "all" ? filter.agentId : undefined;
  const q = filter?.q ? filter.q.trim().toLowerCase() : undefined;
  const tab = filter?.tab || "today";

  let list = mockCollectionTasks.map((t) => {
    const totalDue = t.amountDue + t.arrears + t.penalty;
    const paidSoFar = t.paidAmount || (t.paid ? totalDue : 0);
    const amountToCollect = Math.max(0, totalDue - paidSoFar);

    let status: "pending" | "overdue" | "paid" | "partial";
    if (amountToCollect === 0) {
      status = "paid";
    } else if (paidSoFar > 0) {
      status = "partial";
    } else if (t.dueOn < targetDate || t.arrears > 0) {
      status = "overdue";
    } else {
      status = "pending";
    }

    return {
      id: t.id,
      customerId: t.customerId,
      customerName: t.customerName,
      loanId: t.loanId,
      agentId: t.agentId,
      agentName: t.agentName || "Selvam",
      scheduled: t.amountDue,
      arrears: t.arrears,
      penalty: t.penalty,
      amountToCollect,
      status,
      receiptNo: t.receiptNo,
      paidAt: t.paidAt,
      dueOn: t.dueOn,
    };
  });

  // Filter by Agent
  if (agentId) {
    list = list.filter((item) => item.agentId === agentId);
  }

  // Filter by Search Query
  if (q) {
    list = list.filter((item) => {
      return (
        item.customerName.toLowerCase().includes(q) ||
        item.loanId.toLowerCase().includes(q) ||
        item.customerId.toLowerCase().includes(q)
      );
    });
  }

  // Filter by Tab
  if (tab === "overdue") {
    list = list.filter((item) => item.status === "overdue");
  } else if (tab === "today") {
    // Show all for today's queue
  }

  // Sort order: overdue first, then partial/pending, then paid
  const sortWeights = {
    overdue: 0,
    partial: 1,
    pending: 2,
    paid: 3,
  };

  return list.sort((a, b) => sortWeights[a.status] - sortWeights[b.status]);
}

/**
 * Calculates collection summary KPIs.
 * dueToday = sum of (scheduled + arrears + penalty) over the tasks
 * receivedToday = sum of payments dated today
 * remainingToday = max(0, dueToday - receivedToday)
 */
export function getCollectionSummary(
  tasks?: CollectionRowView[],
  currentDateIso: string = todayIso()
): CollectionSummary {
  const currentTasks = tasks || getCollectionTasks({ date: currentDateIso });
  const taskLoanIds = new Set(currentTasks.map((t) => t.loanId));

  let dueToday = 0;
  currentTasks.forEach((t) => {
    dueToday += t.scheduled + t.arrears + t.penalty;
  });

  let receivedToday = 0;
  mockReceiptsList.forEach((r) => {
    if (r.paidAt.slice(0, 10) === currentDateIso && taskLoanIds.has(r.loanId)) {
      receivedToday += r.amount;
    }
  });

  const remainingToday = Math.max(0, dueToday - receivedToday);

  return {
    dueToday,
    receivedToday,
    remainingToday,
  };
}
