import React from "react";

interface AuthButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
}

export default function AuthButton({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  type = "button",
}: AuthButtonProps) {
  const baseClasses =
    "w-full h-10 rounded-[4px] font-semibold text-body-1 transition-all duration-200";

  const primaryClasses = disabled
    ? "bg-object-disabled text-text-disabled cursor-not-allowed"
    : "bg-gradient-to-r from-object-primary to-object-primary-hover hover:shadow-lg hover:shadow-object-primary/40 active:shadow-none active:scale-95 text-text-invert";

  const secondaryClasses = disabled
    ? "bg-bg-primary border border-border-primary text-text-disabled cursor-not-allowed"
    : "bg-bg-primary border border-object-primary text-object-primary hover:bg-object-primary-light active:bg-object-primary transition-all";

  const classes = `${baseClasses} ${variant === "primary" ? primaryClasses : secondaryClasses}`;

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
