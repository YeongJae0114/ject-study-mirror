interface StickyActionBarProps {
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryDisabled?: boolean;
  secondaryDisabled?: boolean;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export default function StickyActionBar({
  primaryLabel,
  secondaryLabel,
  primaryDisabled = false,
  secondaryDisabled = false,
  onPrimaryClick,
  onSecondaryClick,
}: StickyActionBarProps) {
  if (!primaryLabel && !secondaryLabel) return null;

  return (
    <footer className="border-border-primary bg-bg-primary fixed right-0 bottom-0 left-0 mx-auto w-full max-w-97.5 min-w-[320px] border-t px-4 py-4">
      <div className="grid grid-cols-2 gap-2">
        {secondaryLabel && (
          <button
            type="button"
            disabled={secondaryDisabled}
            onClick={onSecondaryClick}
            className={`border-border-primary text-body-1 text-text-primary h-12 rounded-lg border font-medium disabled:cursor-not-allowed disabled:opacity-60 ${
              primaryLabel ? "" : "col-span-2"
            }`}
          >
            {secondaryLabel}
          </button>
        )}
        {primaryLabel && (
          <button
            type="button"
            disabled={primaryDisabled}
            onClick={onPrimaryClick}
            className={`bg-object-primary hover:bg-object-primary-hover active:bg-object-primary-pressed text-body-1 text-text-invert h-12 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              secondaryLabel ? "" : "col-span-2"
            }`}
          >
            {primaryLabel}
          </button>
        )}
      </div>
    </footer>
  );
}
