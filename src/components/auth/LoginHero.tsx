import React from "react";

export function TLogoMark({ size = 38 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-sm"
      aria-label="THANDAL Logo"
    >
      {/* Top bar of the T */}
      <rect x="4" y="5" width="30" height="9" rx="3" fill="#1F6BFF" />
      {/* Vertical stem of the T */}
      <rect x="14" y="14" width="10" height="19" rx="3" fill="#38BDF8" />
      {/* Subtle isometric corner highlight */}
      <path
        d="M4 8C4 6.34315 5.34315 5 7 5H19L14 14H4V8Z"
        fill="#60A5FA"
        fillOpacity="0.4"
      />
    </svg>
  );
}

export function LoginHero() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between w-1/2 min-h-screen bg-gradient-to-br from-[#0B1B3F] to-[#12307A] p-12 lg:p-16 overflow-hidden select-none">
      {/* Top Brand Logo */}
      <div className="relative z-10 flex items-center gap-3.5">
        <TLogoMark size={40} />
        <span className="text-2xl font-black tracking-widest text-white">THANDAL</span>
      </div>

      {/* Center Copy Block */}
      <div className="relative z-10 max-w-lg my-auto py-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.15]">
          <span className="block text-white">Manage loans.</span>
          <span className="block text-[#1F6BFF] mt-1">Simplify collections.</span>
        </h1>

        {/* Short Blue Divider */}
        <div className="w-16 h-[3px] bg-[#1F6BFF] my-6 rounded-full" />

        <p className="text-base text-[#C7D2E8] font-normal leading-relaxed max-w-md">
          A smarter way to manage your loan portfolio and collection activities.
        </p>
      </div>

      {/* Bottom Decorative Isometric/Geometric Shapes (Partly Cropped) */}
      <div
        className="absolute -bottom-16 -left-12 w-[520px] h-[380px] pointer-events-none z-0 opacity-80"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 520 380"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Main Large Hexagon/Pill */}
          <path
            d="M-20 220L180 100L320 180V340L120 460L-20 380V220Z"
            fill="#1F6BFF"
            fillOpacity="0.85"
          />
          {/* Layered Second Shape */}
          <path
            d="M120 150L260 70L380 140V280L240 360L120 290V150Z"
            fill="#12307A"
            fillOpacity="0.6"
          />
          {/* Front Light Blue Accent */}
          <path
            d="M40 260L160 190L250 240V340L130 410L40 360V260Z"
            fill="#38BDF8"
            fillOpacity="0.45"
          />
          {/* Outlined Thin Geometric Element */}
          <rect
            x="160"
            y="90"
            width="220"
            height="180"
            rx="24"
            transform="rotate(30 160 90)"
            stroke="#1F6BFF"
            strokeWidth="1.5"
            strokeOpacity="0.3"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}
