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
        primary: "#0066ff",
        "primary-hover": "#0052cc",
        success: "#00ff88",
        warning: "#ffaa00",
        danger: "#ff3366",
        background: "#0a0a0a",
        surface: "#0f0f0f",
        border: "#1a1a1a",
        "text-primary": "#ffffff",
        "text-secondary": "#cccccc",
        "text-muted": "#888888",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
