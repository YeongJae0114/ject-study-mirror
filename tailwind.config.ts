import type { Config } from "tailwindcss";

import { colors } from "./src/styles/color";
import { semantic } from "./src/styles/semantic";
import { typography } from "./src/styles/typography";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colors
        white: colors.white,
        purple: colors.purple,
        neutral: colors.neutral,
        "cool-neutral": colors.coolNeutral,
        pink: colors.pink,
        lime: colors.lime,
        red: colors.red,

        // Semantic
        text: semantic.text,
        bg: semantic.bg,
        object: semantic.object,
        border: semantic.border,
        error: semantic.error,
        "black-alpha": semantic.blackAlpha,
        shadow: semantic.shadow,
      },
      // Typography
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,

      fontFamily: {
        pretendard: ["var(--font-pretendard)", "sans-serif"],
        alata: ["var(--font-alata)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
