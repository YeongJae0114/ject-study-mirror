import type { Config } from "tailwindcss";
import { typography } from "./styles/typography";
import { colors } from "./styles/color";
import { semantic } from "./styles/semantic";

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
        primary: colors.primary,
        neutral: colors.neutral,
        "cool-neutral": colors.coolNeutral,
        pink: colors.pink,
        lime: colors.lime,
        red: colors.red,

        // Alpha
        "black-alpha": colors.blackAlpha,

        // Semantic
        text: semantic.text,
        bg: semantic.bg,
        btn: semantic.btn,
        border: semantic.border,
      },
      // Shadow
      shadow: semantic.shadow,
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
