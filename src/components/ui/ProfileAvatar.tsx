import React from "react";
import { initials } from "@/lib/format";

interface ProfileAvatarProps {
  name: string;
  size?: number; // Size in px, default 130
  className?: string;
}

export function ProfileAvatar({ name, size = 130, className = "" }: ProfileAvatarProps) {
  const letters = initials(name);

  // Dynamic font sizing based on avatar diameter
  const fontSize = size >= 100 ? "text-4xl sm:text-5xl" : size >= 60 ? "text-xl font-bold" : "text-sm font-bold";

  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full bg-[#DCE8FB] text-[#0B1B3F] font-extrabold flex items-center justify-center shrink-0 select-none shadow-xs ${fontSize} ${className}`}
      aria-hidden="true"
    >
      {letters}
    </div>
  );
}
