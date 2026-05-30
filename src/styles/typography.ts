export const typography = {
  // Font Size
  fontSize: {
    // Display
    "display-1": ["3.5rem", { lineHeight: "140%", letterSpacing: "-0.03em" }], // 56px
    "display-2": ["2.5rem", { lineHeight: "140%", letterSpacing: "-0.03em" }], // 40px
    "display-3": ["2.25rem", { lineHeight: "140%", letterSpacing: "-0.03em" }], // 36px

    // Title
    "title-1": ["2rem", { lineHeight: "140%", letterSpacing: "-0.03em" }], // 32px
    "title-2": ["1.75rem", { lineHeight: "140%", letterSpacing: "-0.03em" }], // 28px
    "title-3": ["1.5rem", { lineHeight: "145%", letterSpacing: "-0.03em" }], // 24px

    // Heading
    "heading-1": ["1.375rem", { lineHeight: "145%", letterSpacing: "-0.03em" }], // 22px
    "heading-2": ["1.25rem", { lineHeight: "145%", letterSpacing: "-0.03em" }], // 20px

    // Headline
    "headline-1": ["1.125rem", { lineHeight: "145%", letterSpacing: "-0.03em" }], // 18px
    "headline-2": ["1.0625rem", { lineHeight: "145%", letterSpacing: "-0.03em" }], // 17px

    // Body
    "body-1": ["1rem", { lineHeight: "145%", letterSpacing: "-0.03em" }], // 16px
    "body-2": ["0.9375rem", { lineHeight: "145%", letterSpacing: "-0.03em" }], // 15px

    // Label
    label: ["0.875rem", { lineHeight: "140%", letterSpacing: "-0.03em" }], // 14px

    // Caption
    caption: ["0.75rem", { lineHeight: "140%", letterSpacing: "-0.03em" }], // 12px
  },

  // Font Weight
  fontWeight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;
