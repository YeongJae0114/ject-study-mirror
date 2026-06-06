import { AlertCircle } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  tone?: "default" | "danger";
  isConfirmLoading?: boolean;
  errorMessage?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText,
  tone = "default",
  isConfirmLoading = false,
  errorMessage = null,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  if (!open) return null;

  const isDanger = tone === "danger";
  const iconToneClass = isDanger
    ? "bg-object-tertiary-light text-object-tertiary"
    : "bg-object-primary-light text-object-primary";
  const confirmToneClass =
    "bg-object-primary hover:bg-object-primary-hover active:bg-object-primary-pressed";

  return (
    <div className="bg-black-alpha-500 fixed inset-0 z-50 flex items-center justify-center px-5">
      <div className="bg-bg-primary shadow-spread-low w-full max-w-85 rounded-xl px-5 py-6">
        <div className="flex flex-col items-center text-center">
          <div
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${iconToneClass}`}
          >
            <AlertCircle size={24} />
          </div>

          <h2 className="text-headline-1 text-text-primary font-semibold">{title}</h2>
          <p className="text-body-2 text-text-secondary mt-2 whitespace-pre-line">{description}</p>
          {errorMessage && (
            <p className="text-body-2 text-error-default mt-3 font-medium">{errorMessage}</p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="border-border-primary text-body-1 text-text-primary h-12 rounded-lg border font-medium"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirmLoading}
            className={`text-body-1 text-text-invert h-12 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${confirmToneClass}`}
          >
            {isConfirmLoading ? "처리 중" : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
