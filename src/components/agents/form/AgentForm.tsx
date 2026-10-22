"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { AccessPermissionsSection } from "./AccessPermissionsSection";
import { InvitationSection } from "./InvitationSection";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import { Breadcrumbs } from "@/components/customers/Breadcrumbs";
import {
  createAgent,
  updateAgent,
  checkAgentUnique,
  type AgentFormValues,
} from "@/lib/mockApi";
import { todayIso } from "@/lib/clock";

interface AgentFormProps {
  mode?: "create" | "edit";
  agentId?: string;
  initialValues?: Partial<AgentFormValues>;
}

export function AgentForm({
  mode = "create",
  agentId,
  initialValues,
}: AgentFormProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [values, setValues] = useState<AgentFormValues>({
    fullName: initialValues?.fullName || "",
    mobile: initialValues?.mobile || "",
    email: initialValues?.email || "",
    employeeId: initialValues?.employeeId || "",
    branchId: initialValues?.branchId || "BR-001",
    routeId: initialValues?.routeId || "RT-004", // North Zone - Route 1 as in design
    joiningDate: initialValues?.joiningDate || todayIso(),
    status: initialValues?.status || "active",
    role: "collection_agent",
    invitationMethod: initialValues?.invitationMethod || "email",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AgentFormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const isDirty =
    Boolean(values.fullName) ||
    Boolean(values.mobile) ||
    Boolean(values.email) ||
    Boolean(values.employeeId);

  const handleChange = (field: keyof AgentFormValues, val: any) => {
    setValues((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = async (field: keyof AgentFormValues) => {
    let err: string | undefined;

    if (field === "fullName" && !values.fullName.trim()) {
      err = "Full name is required";
    }

    if (field === "mobile") {
      const cleanMobile = values.mobile.replace(/\D/g, "");
      if (!cleanMobile) {
        err = "Mobile number is required";
      } else if (cleanMobile.length < 10) {
        err = "Mobile number must be at least 10 digits";
      } else {
        const uniqueCheck = await checkAgentUnique("mobile", cleanMobile, agentId);
        if (!uniqueCheck.isUnique) err = uniqueCheck.message;
      }
    }

    if (field === "email") {
      if (!values.email.trim()) {
        err = "Email address is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        err = "Enter a valid email address";
      } else {
        const uniqueCheck = await checkAgentUnique("email", values.email, agentId);
        if (!uniqueCheck.isUnique) err = uniqueCheck.message;
      }
    }

    if (field === "employeeId") {
      const cleanId = values.employeeId.trim().toUpperCase();
      if (!cleanId) {
        err = "Employee ID is required";
      } else if (!/^AGT\d{4}$/.test(cleanId)) {
        err = "Format must be AGT followed by 4 digits (e.g. AGT0012)";
      } else {
        const uniqueCheck = await checkAgentUnique("employeeId", cleanId, agentId);
        if (!uniqueCheck.isUnique) err = uniqueCheck.message;
      }
    }

    if (field === "joiningDate") {
      if (!values.joiningDate) {
        err = "Joining date is required";
      } else {
        const chosen = new Date(values.joiningDate);
        const maxFuture = new Date();
        maxFuture.setDate(maxFuture.getDate() + 30);
        if (chosen > maxFuture) {
          err = "Joining date cannot be more than 30 days in the future";
        }
      }
    }

    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const validateAll = async (): Promise<boolean> => {
    const newErrors: Partial<Record<keyof AgentFormValues, string>> = {};

    if (!values.fullName.trim()) newErrors.fullName = "Full name is required";

    const cleanMobile = values.mobile.replace(/\D/g, "");
    if (!cleanMobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (cleanMobile.length < 10) {
      newErrors.mobile = "Mobile number must be at least 10 digits";
    } else {
      const u = await checkAgentUnique("mobile", cleanMobile, agentId);
      if (!u.isUnique) newErrors.mobile = u.message;
    }

    if (!values.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = "Enter a valid email address";
    } else {
      const u = await checkAgentUnique("email", values.email, agentId);
      if (!u.isUnique) newErrors.email = u.message;
    }

    const cleanId = values.employeeId.trim().toUpperCase();
    if (!cleanId) {
      newErrors.employeeId = "Employee ID is required";
    } else if (!/^AGT\d{4}$/.test(cleanId)) {
      newErrors.employeeId = "Format must be AGT followed by 4 digits (e.g. AGT0012)";
    } else {
      const u = await checkAgentUnique("employeeId", cleanId, agentId);
      if (!u.isUnique) newErrors.employeeId = u.message;
    }

    if (!values.routeId) newErrors.routeId = "Route is required";

    if (!values.joiningDate) newErrors.joiningDate = "Joining date is required";

    setErrors(newErrors);

    const firstInvalid = Object.keys(newErrors)[0];
    if (firstInvalid) {
      const el = document.getElementById(`agent-${firstInvalid}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const isValid = await validateAll();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      if (mode === "create") {
        const res = await createAgent(values);
        if (res.success) {
          setToastMessage(
            `Agent ${res.agentId} created. Invitation sent via ${res.invitationMethod} to ${res.maskedContact}`
          );
          setToastOpen(true);
          setTimeout(() => {
            startTransition(() => {
              router.push(`/admin/agents/${res.agentId}`);
            });
          }, 1400);
        }
      } else if (agentId) {
        const res = await updateAgent(agentId, values);
        if (res.success) {
          setToastMessage(`Agent ${agentId} updated successfully`);
          setToastOpen(true);
          setTimeout(() => {
            startTransition(() => {
              router.push(`/admin/agents/${agentId}`);
            });
          }, 1200);
        }
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setCancelModalOpen(true);
    } else {
      router.push("/admin/agents");
    }
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Agents & Routes", href: "/admin/agents" },
          { label: mode === "create" ? "Create collection agent" : "Edit agent" },
        ]}
      />

      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-[40px] font-bold text-[#0B1B3F] tracking-tight leading-tight">
          {mode === "create" ? "Create collection agent" : "Edit agent"}
        </h1>
        {mode === "create" && (
          <p className="text-sm text-[#64748B] mt-1">
            Add a new collection agent and send an invitation to set up their account.
          </p>
        )}
      </div>

      {/* Main Single White Card (p-6) */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-[#E6ECF5] p-6 shadow-xs space-y-6"
      >
        {/* Section 1: Personal information */}
        <PersonalInfoSection
          values={values}
          errors={errors}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <div className="border-t border-[#E6ECF5]" />

        {/* Section 2: Access and permissions */}
        <AccessPermissionsSection />

        {/* Section 3: Invitation method (Create mode only) */}
        {mode === "create" && (
          <>
            <div className="border-t border-[#E6ECF5]" />
            <InvitationSection
              method={values.invitationMethod || "email"}
              onChange={(m) => handleChange("invitationMethod", m)}
            />
          </>
        )}
      </form>

      {/* Sticky Action Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E6ECF5] py-3.5 px-4 sm:px-8 shadow-lg"
        style={{
          bottom: "var(--bottom-nav-h, 0px)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleCancelClick}
            className="w-full sm:w-auto px-6"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="w-full sm:w-auto px-6"
          >
            {isSubmitting
              ? "Saving..."
              : mode === "create"
              ? "Create agent"
              : "Save changes"}
          </Button>
        </div>
      </div>

      {/* Discard changes modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Discard changes?"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#64748B]">
            You have unsaved changes in this form. If you cancel now, your changes will be lost.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setCancelModalOpen(false)}
            >
              Continue editing
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => {
                setCancelModalOpen(false);
                router.push("/admin/agents");
              }}
            >
              Discard &amp; Leave
            </Button>
          </div>
        </div>
      </Modal>

      <Toast
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        type="success"
      />
    </div>
  );
}
