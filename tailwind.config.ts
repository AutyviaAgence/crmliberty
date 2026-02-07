import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        "primary-hover": "#4f46e5",
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
        background: "#060608",
        surface: "#0c0c10",
        "surface-hover": "#12121a",
        border: "#1e1e2a",
        "border-hover": "#2a2a3a",
        "text-primary": "#f0f0f5",
        "text-secondary": "#b0b0c0",
        "text-muted": "#6b6b80",
        accent: "#8b5cf6",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        colored: "0 4px 14px rgba(99, 102, 241, 0.25)",
        "colored-lg": "0 8px 30px rgba(99, 102, 241, 0.3)",
        glow: "0 0 20px rgba(99, 102, 241, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
