"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export function useUnsavedChangesGuard(isDirty: boolean) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Native browser beforeunload listener
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const confirmNavigation = useCallback(
    (action: () => void) => {
      if (!isDirty) {
        action();
        return;
      }
      setPendingAction(() => action);
      setShowPrompt(true);
    },
    [isDirty]
  );

  const handleDiscard = useCallback(() => {
    setShowPrompt(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

  const handleKeepEditing = useCallback(() => {
    setShowPrompt(false);
    setPendingAction(null);
  }, []);

  const guardModal = (
    <Modal
      isOpen={showPrompt}
      onClose={handleKeepEditing}
      title="Discard unsaved changes?"
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-sm text-[#64748B]">
          You have unsaved changes that will be lost if you leave this tab. Are you sure you want to discard them?
        </p>
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={handleKeepEditing}>
            Keep editing
          </Button>
          <Button variant="danger" onClick={handleDiscard}>
            Discard
          </Button>
        </div>
      </div>
    </Modal>
  );

  return {
    confirmNavigation,
    guardModal,
    isDirty,
  };
}
