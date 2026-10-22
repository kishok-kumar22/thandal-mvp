export interface CollectionTask {
  id: string; // e.g. "TASK-001"
  customerId: string; // "C-001"
  customerName: string; // "R.Kumar"
  loanId: string; // "LN-1052"
  agentId: string; // "A-001"
  agentName?: string; // "Selvam"
  routeId: string; // "RT-001"
  routeName: string; // "Anna Nagar"
  dueOn: string; // "2026-10-22"
  amountDue: number; // Scheduled due: 105
  arrears: number; // 0
  penalty: number; // 0
  paid: boolean;
  paidAmount?: number; // integer rupees paid towards this task so far
  receiptNo?: string; // e.g. "RC-0002"
  paidAt?: string;
}

export const mockCollectionTasks: CollectionTask[] = [
  {
    id: "TASK-001",
    customerId: "C-001",
    customerName: "R.Kumar",
    loanId: "LN-1052",
    agentId: "A-001",
    agentName: "Selvam",
    routeId: "RT-001",
    routeName: "Anna Nagar",
    dueOn: "2026-10-22",
    amountDue: 105,
    arrears: 0,
    penalty: 0,
    paid: false,
    paidAmount: 0,
  },
  {
    id: "TASK-002",
    customerId: "C-002",
    customerName: "S.Priya",
    loanId: "LN-1053",
    agentId: "A-001",
    agentName: "Selvam",
    routeId: "RT-001",
    routeName: "Anna Nagar",
    dueOn: "2026-10-22",
    amountDue: 150,
    arrears: 0,
    penalty: 0,
    paid: true,
    paidAmount: 150,
    receiptNo: "RC-0002",
    paidAt: "2026-10-22T09:30:00+05:30",
  },
  {
    id: "TASK-003",
    customerId: "C-003",
    customerName: "M.Arjun",
    loanId: "LN-1054",
    agentId: "A-001",
    agentName: "Selvam",
    routeId: "RT-001",
    routeName: "Anna Nagar",
    dueOn: "2026-10-20", // In the past -> Overdue
    amountDue: 0, // No new scheduled instalment today, but overdue arrears & penalty
    arrears: 200,
    penalty: 10,
    paid: false,
    paidAmount: 0,
  },
];
