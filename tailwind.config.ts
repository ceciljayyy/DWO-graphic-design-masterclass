import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-off-white)",
        foreground: "var(--color-deep-black)",
        surface: "var(--color-pure-white)",
        muted: "var(--color-muted-gray)",
        border: "var(--color-light-border-gray)",
        accent: "var(--color-electric-blue)",
        brand: {
          black: "var(--color-deep-black)",
          offWhite: "var(--color-off-white)",
          white: "var(--color-pure-white)",
          mutedGray: "var(--color-muted-gray)",
          borderGray: "var(--color-light-border-gray)",
          accentBlue: "var(--color-electric-blue)",
        },
      },
      boxShadow: {
        subtle: "0 12px 40px rgba(10, 10, 10, 0.04)",
      },
      letterSpacing: {
        editorial: "-0.04em",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;