export type VerificationStatus = "pending" | "verified" | "uploaded" | "rejected";

export type DocumentCategory = "Identity proof" | "Address proof" | "Customer photo";

export type CustomerStatus = "pending_activation" | "active" | "inactive";

export interface CustomerDocument {
  id: string;
  category: DocumentCategory;
  type: string;
  fileName: string;
  sizeKb: number;
  status: VerificationStatus;
  versions: number;
  fileType: "pdf" | "image";
  documentNumber?: string;
  expiryDate?: string;
  notes?: string;
  uploadedAt: string;
}

export interface Loan {
  id: string;
  customerId: string;
  principal: number;
  interest: number;
  term: number; // 50 daily instalments
  instalment: number; // 105
  disbursedOn: string;
  nextPaymentOn: string;
  paid: number;
  status: "Active" | "Closed" | "Overdue";
}

export interface Activity {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "payment" | "disbursement" | "penalty";
  reference: string;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  currentAddress: string;
  permanentAddress: string;
  assignedAgent: string;
  branch: string;
  status: CustomerStatus;
  customerSince: string;
  portalAccess: boolean;
  consentGiven: boolean;
  documents: CustomerDocument[];
  activeLoan?: Loan;
  activities?: Activity[];
}

export const mockCustomersList: Customer[] = [
  {
    id: "C-001",
    name: "R. Kumar",
    mobile: "+91 98765 43210",
    currentAddress: "Anna Nagar, Chennai – 600040",
    permanentAddress: "Anna Nagar, Chennai – 600040",
    assignedAgent: "Selvam",
    branch: "Chennai Main",
    status: "active",
    customerSince: "21 Oct 2026",
    portalAccess: true,
    consentGiven: true,
    documents: [
      {
        id: "doc-1",
        category: "Identity proof",
        type: "Selected ID type",
        fileName: "identity-front.pdf",
        sizeKb: 245,
        status: "verified",
        versions: 2,
        fileType: "pdf",
        uploadedAt: "22 Oct 2026, 09:30 AM",
        notes: "",
      },
      {
        id: "doc-2",
        category: "Address proof",
        type: "Utility bill",
        fileName: "address-proof.pdf",
        sizeKb: 320,
        status: "verified",
        versions: 1,
        fileType: "pdf",
        uploadedAt: "21 Oct 2026, 04:15 PM",
        notes: "Electricity bill verified with TANGEDCO database.",
      },
      {
        id: "doc-3",
        category: "Customer photo",
        type: "Photograph",
        fileName: "customer-photo.jpg",
        sizeKb: 180,
        status: "uploaded",
        versions: 1,
        fileType: "image",
        uploadedAt: "21 Oct 2026, 04:10 PM",
        notes: "Front-facing portrait photograph.",
      },
    ],
    activeLoan: {
      id: "LN-1052",
      customerId: "C-001",
      principal: 5000,
      interest: 250,
      term: 50,
      instalment: 105,
      disbursedOn: "21 Oct 2026",
      nextPaymentOn: "22 Oct 2026",
      paid: 105,
      status: "Active",
    },
    activities: [
      {
        id: "act-1",
        date: "21 Oct 2026",
        description: "First instalment paid at disbursement",
        amount: 105,
        type: "payment",
        reference: "LN-1052",
      },
    ],
  },
  {
    id: "C-002",
    name: "S. Priya",
    mobile: "+91 98402 33445",
    currentAddress: "T Nagar, Chennai – 600017",
    permanentAddress: "T Nagar, Chennai – 600017",
    assignedAgent: "Karthik",
    branch: "Chennai Main",
    status: "active",
    customerSince: "15 Oct 2026",
    portalAccess: true,
    consentGiven: true,
    documents: [],
    activeLoan: {
      id: "LN-1053",
      customerId: "C-002",
      principal: 10000,
      interest: 500,
      term: 20,
      instalment: 525,
      disbursedOn: "15 Oct 2026",
      nextPaymentOn: "22 Oct 2026",
      paid: 2100,
      status: "Active",
    },
  },
  {
    id: "C-003",
    name: "M. Arjun",
    mobile: "+91 98403 44556",
    currentAddress: "Velachery, Chennai – 600042",
    permanentAddress: "Velachery, Chennai – 600042",
    assignedAgent: "Selvam",
    branch: "Chennai Main",
    status: "active",
    customerSince: "01 Sep 2026",
    portalAccess: true,
    consentGiven: true,
    documents: [],
    activeLoan: {
      id: "LN-1054",
      customerId: "C-003",
      principal: 6000,
      interest: 300,
      term: 6,
      instalment: 1050,
      disbursedOn: "01 Sep 2026",
      nextPaymentOn: "01 Nov 2026",
      paid: 2100,
      status: "Overdue",
    },
  },
  {
    id: "C-004",
    name: "Rajesh Kumar",
    mobile: "+91 98401 22334",
    currentAddress: "123, Lake View Road, Anna Nagar, Chennai – 600040",
    permanentAddress: "123, Lake View Road, Anna Nagar, Chennai – 600040",
    assignedAgent: "Selvam",
    branch: "Chennai Main",
    status: "pending_activation",
    customerSince: "22 Oct 2026",
    portalAccess: false,
    consentGiven: false,
    documents: [
      {
        id: "doc-401",
        category: "Identity proof",
        type: "Aadhaar Card",
        fileName: "aadhaar-card.pdf",
        sizeKb: 310,
        status: "pending",
        versions: 1,
        fileType: "pdf",
        uploadedAt: "22 Oct 2026, 10:00 AM",
      },
    ],
  },
];

export const initialMockCustomer: Customer = mockCustomersList[0];

export function getCustomerById(id: string): Customer {
  const normalizedId = id.toUpperCase().includes("C-") ? id.toUpperCase() : id === "C001" || id === "c001" ? "C-001" : id;
  const found = mockCustomersList.find((c) => c.id === normalizedId);
  return found || initialMockCustomer;
}
