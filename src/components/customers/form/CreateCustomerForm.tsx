"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import { StickyActionBar } from "@/components/customers/StickyActionBar";
import { PersonalDetailsSection } from "./PersonalDetailsSection";
import { AddressSection } from "./AddressSection";
import { AssignmentSection } from "./AssignmentSection";
import { VerificationSection } from "./VerificationSection";
import { GuarantorSection, type GuarantorValues } from "./GuarantorSection";
import { saveCustomer, type CreateCustomerFormValues } from "@/lib/mockApi";
import {
  isValidMobile,
  isValidPostalCode,
  isAge18OrOlder,
} from "@/lib/validators";

interface CreateCustomerFormProps {
  mode?: "create" | "edit";
  initialValues?: Partial<CreateCustomerFormValues>;
}

export function CreateCustomerForm({
  mode = "create",
  initialValues,
}: CreateCustomerFormProps) {
  const router = useRouter();

  const [fullName, setFullName] = useState(initialValues?.fullName || "");
  const [mobile, setMobile] = useState(initialValues?.mobile || "");
  const [alternateMobile, setAlternateMobile] = useState(
    initialValues?.alternateMobile || ""
  );
  const [dob, setDob] = useState(initialValues?.dob || "");

  const [streetAddress, setStreetAddress] = useState(
    initialValues?.streetAddress || ""
  );
  const [area, setArea] = useState(initialValues?.area || "");
  const [city, setCity] = useState(initialValues?.city || "");
  const [postalCode, setPostalCode] = useState(initialValues?.postalCode || "");

  const [agent, setAgent] = useState(initialValues?.agent || "Selvam");
  const [status, setStatus] = useState<"Active" | "Inactive">(
    initialValues?.status || "Active"
  );

  const [documentType, setDocumentType] = useState(
    initialValues?.documentType || "Aadhaar Card"
  );
  const [documentFile, setDocumentFile] = useState<File | null>(
    initialValues?.documentFile || null
  );

  const [guarantor, setGuarantor] = useState<GuarantorValues>({
    name: initialValues?.guarantor?.name || "",
    mobile: initialValues?.guarantor?.mobile || "",
    relationship: initialValues?.guarantor?.relationship || "",
    address: initialValues?.guarantor?.address || "",
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  // Check if form is dirty for cancel confirmation
  const isDirty = Boolean(
    fullName || mobile || streetAddress || area || city || postalCode || documentFile
  );

  const validate = () => {
    const errs: Record<string, string | undefined> = {};

    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!mobile.trim()) {
      errs.mobile = "Mobile number is required";
    } else if (!isValidMobile(mobile)) {
      errs.mobile = "Enter a valid 10-digit mobile number";
    }

    if (alternateMobile && !isValidMobile(alternateMobile)) {
      errs.alternateMobile = "Enter a valid 10-digit alternate mobile number";
    }

    if (dob && !isAge18OrOlder(dob)) {
      errs.dob = "Customer must be 18 years or older";
    }

    if (!streetAddress.trim()) errs.streetAddress = "Street address is required";
    if (!area.trim()) errs.area = "Area is required";
    if (!city.trim()) errs.city = "City is required";
    if (!postalCode.trim()) {
      errs.postalCode = "Postal code is required";
    } else if (!isValidPostalCode(postalCode)) {
      errs.postalCode = "Enter a valid 6-digit postal code";
    }

    if (!agent) errs.agent = "Please assign a collection agent";

    if (mode === "create" && !documentFile) {
      errs.documentFile = "Please upload an identity or verification document";
    }

    // Guarantor fields rule: if any is filled, all are required
    const isAnyGuarantorFilled = Boolean(
      guarantor.name || guarantor.mobile || guarantor.relationship || guarantor.address
    );
    if (isAnyGuarantorFilled) {
      if (!guarantor.name.trim()) errs.guarantorName = "Guarantor name is required";
      if (!guarantor.mobile.trim()) {
        errs.guarantorMobile = "Guarantor mobile is required";
      } else if (!isValidMobile(guarantor.mobile)) {
        errs.guarantorMobile = "Enter a valid 10-digit mobile number";
      }
      if (!guarantor.relationship) errs.guarantorRelationship = "Select relationship";
      if (!guarantor.address.trim()) errs.guarantorAddress = "Guarantor address is required";
    }

    setErrors(errs);
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validate();
    const firstErrorKey = Object.keys(validationErrors)[0];
    if (firstErrorKey) {
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await saveCustomer({
        fullName,
        mobile,
        alternateMobile,
        dob,
        streetAddress,
        area,
        city,
        postalCode,
        agent,
        status,
        documentType,
        documentFile,
        guarantor,
      });

      if (res.success) {
        setToastMessage(`Customer ${res.customerId} created`);
        setToastOpen(true);
        setTimeout(() => {
          router.push(`/admin/customers/${res.customerId}/documents`);
        }, 1200);
      }
    } catch {
      alert("Failed to save customer. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelModal(true);
    } else {
      router.push("/admin/customers");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-32">
      {/* Page Header: Desktop vs Mobile */}
      <div>
        {/* Desktop Header (≥768px) */}
        <div className="hidden sm:block space-y-2">
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F6BFF] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to customers</span>
          </Link>
          <h1 className="text-3xl sm:text-[36px] font-bold text-[#0B1B3F] tracking-tight">
            {mode === "create" ? "Create customer" : "Edit customer"}
          </h1>
          <p className="text-sm text-[#64748B]">
            {mode === "create"
              ? "Add a new customer to the THANDAL system."
              : "Update customer personal and assignment details."}
          </p>
        </div>

        {/* Mobile Header (<768px) */}
        <div className="sm:hidden flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            aria-label="Back"
            className="p-1.5 rounded-lg text-[#0B1B3F] hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-[#0B1B3F] tracking-tight">
            {mode === "create" ? "Create customer" : "Edit customer"}
          </h1>
        </div>
      </div>

      {/* Main Stacked Sections Form */}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Section 1: Personal Details */}
        <PersonalDetailsSection
          fullName={fullName}
          mobile={mobile}
          alternateMobile={alternateMobile}
          dob={dob}
          onChange={(field, val) => {
            if (field === "fullName") setFullName(val);
            if (field === "mobile") setMobile(val);
            if (field === "alternateMobile") setAlternateMobile(val);
            if (field === "dob") setDob(val);
            if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
          }}
          errors={errors}
        />

        {/* Section 2: Address */}
        <AddressSection
          streetAddress={streetAddress}
          area={area}
          city={city}
          postalCode={postalCode}
          onChange={(field, val) => {
            if (field === "streetAddress") setStreetAddress(val);
            if (field === "area") setArea(val);
            if (field === "city") setCity(val);
            if (field === "postalCode") setPostalCode(val);
            if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
          }}
          errors={errors}
        />

        {/* Section 3: Assignment */}
        <AssignmentSection
          agent={agent}
          status={status}
          onChange={(field, val) => {
            if (field === "agent") setAgent(val);
            if (field === "status") setStatus(val as "Active" | "Inactive");
            if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
          }}
          errors={errors}
        />

        {/* Section 4: Verification */}
        <VerificationSection
          documentType={documentType}
          file={documentFile}
          documentRequired={mode === "create"}
          onChange={(field, val) => {
            if (field === "documentType") setDocumentType(val as string);
            if (field === "documentFile") setDocumentFile(val as File | null);
            if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
          }}
          errors={errors}
        />

        {/* Section 5: Guarantor (optional) */}
        <GuarantorSection
          values={guarantor}
          onChange={(field, val) => {
            setGuarantor((prev) => ({ ...prev, [field]: val }));
            if (errors[`guarantor${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
              setErrors((prev) => ({
                ...prev,
                [`guarantor${field.charAt(0).toUpperCase() + field.slice(1)}`]: undefined,
              }));
            }
          }}
          errors={errors}
        />

        {/* Sticky Action Bar */}
        <StickyActionBar
          left={null}
          right={
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleCancel}
                className="w-1/2 sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
                className="w-1/2 sm:w-auto flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>
                  {mode === "create" ? "Save customer" : "Save changes"}
                </span>
              </Button>
            </div>
          }
        />
      </form>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Discard changes?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#64748B] leading-relaxed">
            You have unsaved changes. Are you sure you want to discard them and return to the customer list?
          </p>
          <div className="flex justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCancelModal(false)}
            >
              Continue editing
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push("/admin/customers")}
            >
              Discard changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Success Toast */}
      <Toast
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        type="success"
      />
    </div>
  );
}
