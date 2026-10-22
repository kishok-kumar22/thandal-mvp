"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

type ToastState = {
  message: string;
  type: "success" | "error" | "info";
  isOpen: boolean;
};

type ToastListener = (state: ToastState) => void;
const listeners = new Set<ToastListener>();

export function showToast(message: string, type: "success" | "error" | "info" = "success") {
  listeners.forEach((l) => l({ message, type, isOpen: true }));
}

export function useToast() {
  const [toastState, setToastState] = useState<ToastState>({
    message: "",
    type: "success",
    isOpen: false,
  });

  useEffect(() => {
    listeners.add(setToastState);
    return () => {
      listeners.delete(setToastState);
    };
  }, []);

  return {
    toast: toastState,
    showToast: (msg: string, type: "success" | "error" | "info" = "success") => showToast(msg, type),
    hideToast: () => setToastState((prev) => ({ ...prev, isOpen: false })),
  };
}

export function Toast({
  message,
  type = "success",
  isOpen,
  onClose,
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border bg-white animate-in slide-in-from-bottom duration-300 max-w-md border-[#E6ECF5]"
    >
      {type === "success" && <CheckCircle2 className="w-5 h-5 text-[#1F6BFF] shrink-0" />}
      {type === "error" && <AlertCircle className="w-5 h-5 text-[#E5252A] shrink-0" />}
      <span className="text-sm font-medium text-[#0B1B3F]">{message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss notification"
        className="ml-auto p-1 text-[#94A3B8] hover:text-[#0B1B3F] rounded-md cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function GlobalToastContainer() {
  const { toast, hideToast } = useToast();
  return <Toast isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={hideToast} />;
}
