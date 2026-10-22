export interface Branch {
  id: string;
  name: string;
}

export interface Route {
  id: string;
  name: string;
  branchId: string;
}

export const mockBranches: Branch[] = [
  { id: "BR-001", name: "Chennai Main Branch" },
];

export const mockRoutesList: Route[] = [
  { id: "RT-001", name: "Anna Nagar", branchId: "BR-001" },
  { id: "RT-002", name: "T Nagar", branchId: "BR-001" },
  { id: "RT-003", name: "Velachery", branchId: "BR-001" },
  { id: "RT-004", name: "North Zone - Route 1", branchId: "BR-001" },
];

export function getRoutesByBranch(branchId: string): Route[] {
  return mockRoutesList.filter((r) => r.branchId === branchId);
}

export function getRouteById(id: string): Route | undefined {
  return mockRoutesList.find((r) => r.id === id);
}

export function getRouteByName(name: string): Route | undefined {
  return mockRoutesList.find((r) => r.name.toLowerCase() === name.toLowerCase());
}
