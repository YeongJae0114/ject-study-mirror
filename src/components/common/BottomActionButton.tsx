interface BottomActionButtonProps {
  text: string;
  loadingText?: string;
  isPending?: boolean;
  disabled?: boolean;
  errorMessage?: string | null;
  onClick: () => void;
}

export default function BottomActionButton({
  text,
  loadingText = "처리 중...",
  isPending = false,
  disabled = false,
  errorMessage,
  onClick,
}: BottomActionButtonProps) {
  return (
    <div className="border-border-primary bg-bg-primary fixed right-0 bottom-0 left-0 z-50 border-t">
      <div className="mobile:w-97.5 mx-auto px-5 pt-3 pb-9">
        {errorMessage && (
          <p role="alert" className="text-caption text-error-default mx-auto mb-2">
            {errorMessage}
          </p>
        )}
        <button
          onClick={onClick}
          disabled={disabled || isPending}
          className={`text-body-1 h-12.5 w-full rounded-lg font-medium transition-colors ${
            disabled || isPending
              ? "bg-object-disabled text-text-disabled cursor-not-allowed"
              : "bg-object-primary text-text-invert cursor-pointer"
          }`}
        >
          {isPending ? loadingText : text}
        </button>
      </div>
    </div>
  );
}
