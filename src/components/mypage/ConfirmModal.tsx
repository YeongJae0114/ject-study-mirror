import { AlertCircle } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  tone?: "default" | "danger";
  isConfirmLoading?: boolean;
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
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  if (!open) return null;

  const isDanger = tone === "danger";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-5">
      <div className="bg-bg-primary shadow-spread-low w-full max-w-85 rounded-xl px-5 py-6">
        <div className="flex flex-col items-center text-center">
          <div
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
              isDanger
                ? "bg-error-light text-error-default"
                : "bg-object-primary-light text-object-primary"
            }`}
          >
            <AlertCircle size={24} />
          </div>

          <h2 className="text-headline-1 text-text-primary font-semibold">{title}</h2>
          <p className="text-body-2 text-text-secondary mt-2 whitespace-pre-line">{description}</p>
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
            className={`text-body-1 text-text-invert h-12 rounded-lg font-medium disabled:cursor-not-allowed disabled:opacity-60 ${
              isDanger ? "bg-error-default" : "bg-object-primary"
            }`}
          >
            {isConfirmLoading ? "처리 중" : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
