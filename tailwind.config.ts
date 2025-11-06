import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        navy: {
          DEFAULT: "#0A2463",
          hover: "#082052",
          active: "#051840",
          disabled: "#6B7FA8",
        },
        gold: {
          DEFAULT: "#D4AF37",
          hover: "#C19F2E",
          active: "#B08F25",
          disabled: "#E8D89B",
        },
        coral: {
          DEFAULT: "#FF6B6B",
          hover: "#FF5252",
          active: "#E63946",
        },
        teal: {
          DEFAULT: "#06B6D4",
          hover: "#0891B2",
          active: "#0E7490",
        },
        // Semantic Colors
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)",
        lg: "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04)",
        gold: "0 0 20px rgba(212, 175, 55, 0.3), 0 4px 8px rgba(212, 175, 55, 0.2)",
        navy: "0 0 20px rgba(10, 36, 99, 0.3), 0 4px 8px rgba(10, 36, 99, 0.2)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
