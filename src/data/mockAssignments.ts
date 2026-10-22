export interface CustomerAssignment {
  id: string; // e.g. "ASG-001"
  customerId: string; // e.g. "C-001"
  agentId: string; // e.g. "A-001"
  routeId: string; // e.g. "RT-001"
  effectiveDate: string; // YYYY-MM-DD
  status: "active" | "scheduled";
}

export const mockAssignmentsList: CustomerAssignment[] = [
  {
    id: "ASG-001",
    customerId: "C-001",
    agentId: "A-001",
    routeId: "RT-001",
    effectiveDate: "2024-07-01",
    status: "active",
  },
  {
    id: "ASG-002",
    customerId: "C-002",
    agentId: "A-001",
    routeId: "RT-001",
    effectiveDate: "2024-07-15",
    status: "active",
  },
  {
    id: "ASG-003",
    customerId: "C-003",
    agentId: "A-002",
    routeId: "RT-002",
    effectiveDate: "2024-08-01",
    status: "active",
  },
];

export function getAssignmentsByAgent(agentId: string): CustomerAssignment[] {
  return mockAssignmentsList.filter((a) => a.agentId === agentId);
}

export function getAssignmentByCustomer(customerId: string): CustomerAssignment | undefined {
  return mockAssignmentsList.find((a) => a.customerId === customerId);
}
