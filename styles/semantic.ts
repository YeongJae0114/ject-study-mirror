import { colors } from "./color";

export const semantic = {
  text: {
    primary: colors.coolNeutral[900],
    secondary: colors.coolNeutral[600],
    disabled: colors.coolNeutral[300],
    invert: colors.neutral[0],
    error: colors.red[500],
    brand: colors.primary[500],
    input: colors.coolNeutral[500],
  },
  bg: {
    default: colors.neutral[0],
    paper: colors.coolNeutral[50],
    accent: colors.coolNeutral[800],
    brand: colors.primary[500],
    "brand-light": colors.primary[50],
    error: colors.red[500],
    "error-hover": colors.red[600],
    "error-light": colors.red[50],
    
  },
  btn: {
    "primary-bg": colors.primary[500],
    "primary-hover": colors.primary[600],
    "primary-pressed": colors.primary[700],
    disabled: colors.coolNeutral[100],
    "secondary-default": colors.coolNeutral[800],
  },
  border: {
    default: colors.coolNeutral[200],
    active: colors.primary[500],
    "active-light": colors.primary[300],
    error: colors.red[500],
  },
  shadow: {
    low: "0px 1px 4px 0px rgba(43, 43, 51, 0.08)",
    medium: "0px 4px 12px 0px rgba(43, 43, 51, 0.1)",
    high: "0px 8px 24px 0px rgba(43, 43, 51, 0.12)",
    "spread-low": "0px 0px 0px 4px rgba(43, 43, 51, 0.08)",
    "spread-medium": "0px 0px 0px 8px rgba(43, 43, 51, 0.1)",
  },
} as const;
