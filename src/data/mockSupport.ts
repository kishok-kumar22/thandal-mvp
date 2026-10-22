export type SupportStatus = "open" | "in_progress" | "resolved";

export type SupportKind = "general" | "callback" | "profile_correction";

export interface SupportMeta {
  field?: "name" | "mobile" | "address" | "other";
  preferredTime?: "morning" | "afternoon" | "evening";
}

export interface SupportAttachmentMeta {
  name: string;
  size: number;
  type: string;
}

export interface SupportRequest {
  id: string; // e.g. "SR-001"
  customerId: string; // "C-001"
  customerName?: string;
  loanId?: string; // e.g. "LN-1052"
  kind: SupportKind;
  meta?: SupportMeta;
  subject: string;
  message: string;
  attachment?: SupportAttachmentMeta;
  status: SupportStatus;
  createdAt: string;
  updatedAt?: string;
}

export const mockSupportRequests: SupportRequest[] = [];

let supportCounter = 1;

export function getNextSupportRequestId(): string {
  const id = `SR-${String(supportCounter++).padStart(3, "0")}`;
  return id;
}
