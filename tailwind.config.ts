import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B1B3F",
          hover: "#13264F",
          muted: "#C7D2E8",
        },
        primary: {
          DEFAULT: "#1F6BFF",
          hover: "#1757D6",
          light: "#EFF6FF",
        },
        surface: {
          bg: "#F4F7FB",
          card: "#FFFFFF",
          border: "#E6ECF5",
        },
        content: {
          heading: "#0B1B3F",
          body: "#334155",
          muted: "#64748B",
        },
        danger: {
          DEFAULT: "#E5252A",
          subtle: "#FEE2E2",
          text: "#B91C1C",
        },
        status: {
          pending: {
            bg: "#FEF3C7",
            text: "#B45309",
            dot: "#F59E0B",
          },
          paid: {
            bg: "#DBEAFE",
            text: "#1D4ED8",
            dot: "#1F6BFF",
          },
          overdue: {
            bg: "#FEE2E2",
            text: "#B91C1C",
            dot: "#EF4444",
          },
        },
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        soft: "0 1px 3px 0 rgba(11, 27, 63, 0.04), 0 2px 6px -1px rgba(11, 27, 63, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
