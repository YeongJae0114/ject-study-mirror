import { colors } from "./color";

export const semantic = {
  text: {
    primary: colors.coolNeutral[900],
    secondary: colors.coolNeutral[600],
    input: colors.coolNeutral[500],
    disabled: colors.coolNeutral[300],
    invert: colors.neutral[0],
    "primary-brand": colors.purple[500],
  },
  bg: {
    primary: colors.white,
    "primary-darker": colors.coolNeutral[50],
    secondary: colors.coolNeutral[800],
    "secondary-brand": colors.purple[500],
  },
  object: {
    "primary-light": colors.purple[50],
    primary: colors.purple[500],
    "primary-hover": colors.purple[600],
    "primary-pressed": colors.purple[700],
    secondary: colors.coolNeutral[800],
    disabled: colors.coolNeutral[100],
  },
  border: {
    primary: colors.coolNeutral[200],
    "secondary-focus": colors.purple[500],
    "secondary-light": colors.purple[300],
    error: colors.red[500],
  },
  error: {
    default: colors.red[500],
    hover: colors.red[600],
    pressed: colors.red[700],
    light: colors.red[50],
  },
  blackAlpha: {
    50: 'rgba(26, 26, 30, 0.05)',
    200: 'rgba(26, 26, 30, 0.2)',
    500: 'rgba(26, 26, 30, 0.5)',
    700: 'rgba(26, 26, 30, 0.7)',
  },
  shadow: {
    low: "0px 1px 4px 0px rgba(43, 43, 51, 0.06)",
    medium: "0px 4px 12px 0px rgba(43, 43, 51, 0.07)",
    high: "0px 8px 24px 0px rgba(43, 43, 51, 0.08)",
    "spread-low": "0px 0px 0px 4px rgba(43, 43, 51, 0.10)",
    "spread-medium": "0px 0px 0px 8px rgba(43, 43, 51, 0.16)",
  },
} as const;
