import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface PlaceholderPageProps {
  title: string;
  category?: string;
  description?: string;
  backHref?: string;
}

export function PlaceholderPage({
  title,
  category = "Module",
  description = "This module is part of the THANDAL collection workflows and is currently being connected.",
  backHref,
}: PlaceholderPageProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[#1F6BFF] uppercase tracking-wider">
            {category}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1B3F] tracking-tight mt-1">
            {title}
          </h1>
        </div>

        {backHref && (
          <Link href={backHref}>
            <Button variant="secondary" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              Back to Overview
            </Button>
          </Link>
        )}
      </div>

      {/* Coming Soon Card */}
      <Card className="p-10 flex flex-col items-center justify-center text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] text-[#1F6BFF] flex items-center justify-center mb-4 shadow-xs">
          <Clock className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-[#0B1B3F] mb-2">{title} &mdash; Coming Soon</h2>
        <p className="text-sm text-[#64748B] max-w-md mb-6 leading-relaxed">
          {description}
        </p>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-[#334155] text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
          Scheduled for Sprint 2 Deployment
        </div>
      </Card>
    </div>
  );
}
