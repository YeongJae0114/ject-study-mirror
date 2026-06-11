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
      {errorMessage && (
        <p role="alert" className="text-caption text-error-default mx-auto mb-2 max-w-107.5">
          {errorMessage}
        </p>
      )}

      <div className="mobile:w-97.5 mx-auto px-5 pt-3 pb-9">
        <button
          onClick={onClick}
          disabled={disabled || isPending}
          className="bg-object-primary text-body-1 text-text-invert flex h-12.5 w-full items-center justify-center rounded-lg font-medium disabled:opacity-50"
        >
          {isPending ? loadingText : text}
        </button>
      </div>
    </div>
  );
}
