import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-near-black)",
        foreground: "var(--color-off-white)",
        surface: "var(--color-surface)",
        muted: "var(--color-muted-gray)",
        border: "var(--color-border)",
        accent: "var(--color-gold)",
        red: "var(--color-red)",
        brand: {
          black: "var(--color-deep-black)",
          nearBlack: "var(--color-near-black)",
          offWhite: "var(--color-off-white)",
          surface: "var(--color-surface)",
          mutedGray: "var(--color-muted-gray)",
          border: "var(--color-border)",
          red: "var(--color-red)",
          gold: "var(--color-gold)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: [
          "var(--font-display)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        subtle: "0 18px 60px rgba(0, 0, 0, 0.32)",
      },
      letterSpacing: {
        editorial: "0.02em",
        tightest: "-0.03em",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
