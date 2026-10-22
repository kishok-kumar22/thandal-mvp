export type HandoverStatus = "pending_review" | "accepted" | "rejected";

export interface Handover {
  id: string; // e.g. "H-001", "H-002"
  agentId: string;
  agentName?: string;
  reportedAmount: number;
  actualAmount?: number;
  difference?: number; // actual - reported
  recipient?: string;
  status: HandoverStatus;
  submittedAt: string; // ISO string with offset
  decidedAt?: string;
  decidedBy?: string;
  notes?: string;
  rejectionReason?: string;
  version: number;
}

export const mockHandoversList: Handover[] = [
  {
    id: "H-001",
    agentId: "A-001",
    agentName: "Selvam",
    reportedAmount: 2000,
    actualAmount: 2000,
    difference: 0,
    recipient: "Main office",
    status: "accepted",
    submittedAt: "2026-10-22T09:40:00+05:30",
    decidedAt: "2026-10-22T09:45:00+05:30",
    decidedBy: "Admin",
    notes: "Verified and deposited in vault",
    version: 1,
  },
  {
    id: "H-002",
    agentId: "A-001",
    agentName: "Selvam",
    reportedAmount: 1000,
    recipient: "Main office",
    status: "pending_review",
    submittedAt: "2026-10-22T10:15:00+05:30",
    notes: "Awaiting review",
    version: 1,
  },
];
