"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

/**
 * Automatically triggers browser print dialog when '?print=1' query parameter is present.
 * Once invoked, smoothly cleans the URL query param using router.replace.
 *
 * PRODUCTION NOTE:
 * For automated server-side PDF generation (e.g. Puppeteer, Playwright, or @react-pdf/renderer),
 * a server route such as `/api/receipts/[id]/pdf` can be plugged in to return raw application/pdf streams.
 */
export function AutoPrint() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const isPrintMode = searchParams.get("print") === "1";

    if (isPrintMode && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;

      const timer = setTimeout(() => {
        window.print();

        // Remove print parameter without triggering full navigation reload
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete("print");
        const nextQuery = newParams.toString() ? `?${newParams.toString()}` : "";
        router.replace(`${pathname}${nextQuery}`, { scroll: false });
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [searchParams, pathname, router]);

  return null;
}
