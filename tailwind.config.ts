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
        ink: "var(--bg)",
        fog: "var(--surface)",
        "fog-light": "var(--surface-light)",
        bone: "var(--text-main)",
        "bone-muted": "var(--text-muted)",
        signal: "var(--accent)",
        "signal-hover": "var(--accent-hover)",
        "signal-text": "var(--accent-text)",
        delta: {
          green: "var(--d-green)",
          red: "var(--d-red)",
        },
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      animation: {
        ticker: "ticker 35s linear infinite",
        pulseSlow: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
