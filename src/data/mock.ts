export interface KpiData {
  activeLoans: number;
  outstandingPrincipal: number;
  collectedToday: number;
  overdueAmount: number;
}

export interface DayCollection {
  day: string;
  amount: number;
  displayAmount: string;
}

export interface CollectionTarget {
  collected: number;
  target: number;
}

export type QueueStatus = "Pending" | "Paid" | "Overdue";

export interface QueueItem {
  id: string;
  customer: string;
  loanId: string;
  dueAmount: number;
  status: QueueStatus;
}

export interface AgentPerformance {
  id: string;
  name: string;
  collected: number;
  pending: number;
}

export interface DashboardData {
  kpis: KpiData;
  weeklyCollections: DayCollection[];
  collectionTarget: CollectionTarget;
  collectionQueue: {
    items: QueueItem[];
    totalScheduled: number;
  };
  agentCollections: {
    agents: AgentPerformance[];
    cashAwaitingHandover: number;
  };
  pendingVerificationsCount: number;
}

export const mockDashboardData: DashboardData = {
  kpis: {
    activeLoans: 248,
    outstandingPrincipal: 1845000,
    collectedToday: 42500,
    overdueAmount: 18000,
  },
  weeklyCollections: [
    { day: "Mon", amount: 32000, displayAmount: "₹32k" },
    { day: "Tue", amount: 38000, displayAmount: "₹38k" },
    { day: "Wed", amount: 40000, displayAmount: "₹40k" },
    { day: "Thu", amount: 42500, displayAmount: "₹42.5k" },
  ],
  collectionTarget: {
    collected: 42500,
    target: 50000,
  },
  collectionQueue: {
    items: [
      {
        id: "1",
        customer: "R.Kumar",
        loanId: "LN-1052",
        dueAmount: 105,
        status: "Pending",
      },
      {
        id: "2",
        customer: "S.Priya",
        loanId: "LN-1053",
        dueAmount: 150,
        status: "Paid",
      },
      {
        id: "3",
        customer: "M.Arjun",
        loanId: "LN-1054",
        dueAmount: 210,
        status: "Overdue",
      },
    ],
    totalScheduled: 84,
  },
  agentCollections: {
    agents: [
      { id: "ag-1", name: "Selvam", collected: 18000, pending: 3000 },
      { id: "ag-2", name: "Karthik", collected: 14500, pending: 2500 },
      { id: "ag-3", name: "Meena", collected: 10000, pending: 2000 },
    ],
    cashAwaitingHandover: 12000,
  },
  pendingVerificationsCount: 6,
};
