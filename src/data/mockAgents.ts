export type AgentStatus = "active" | "inactive";

export interface Agent {
  id: string; // e.g. "A-001"
  name: string; // e.g. "Selvam"
  mobile: string; // 10 digits, e.g. "9876544120"
  email: string;
  employeeId: string; // e.g. "AGT0001"
  branchId: string; // "BR-001"
  routeId: string; // "RT-001"
  route: string; // "Anna Nagar"
  joiningDate: string; // "2024-07-01" or "2025-01-12"
  status: AgentStatus;
  role: "collection_agent";
  assignedCustomers: number; // e.g. 24
}

export const mockAgentsList: Agent[] = [
  {
    id: "A-001",
    name: "Selvam",
    mobile: "9876544120",
    email: "selvam@thandal.in",
    employeeId: "AGT0001",
    branchId: "BR-001",
    routeId: "RT-001",
    route: "Anna Nagar",
    joiningDate: "2024-07-01",
    status: "active",
    role: "collection_agent",
    assignedCustomers: 24,
  },
  {
    id: "A-002",
    name: "Karthik",
    mobile: "9789066681",
    email: "karthik@thandal.in",
    employeeId: "AGT0002",
    branchId: "BR-001",
    routeId: "RT-002",
    route: "T Nagar",
    joiningDate: "2025-04-05",
    status: "active",
    role: "collection_agent",
    assignedCustomers: 18,
  },
  {
    id: "A-003",
    name: "Meena",
    mobile: "9840011223",
    email: "meena@thandal.in",
    employeeId: "AGT0003",
    branchId: "BR-001",
    routeId: "RT-003",
    route: "Velachery",
    joiningDate: "2025-06-20",
    status: "inactive",
    role: "collection_agent",
    assignedCustomers: 12,
  },
];

export function getMockAgents(): Agent[] {
  return [...mockAgentsList];
}

export function getAgentById(id: string): Agent | undefined {
  const norm = id.trim().toUpperCase();
  return mockAgentsList.find((a) => a.id.toUpperCase() === norm);
}

export const mockRoutes = ["Anna Nagar", "T Nagar", "Velachery", "North Zone - Route 1"];
