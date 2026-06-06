import { AlertCircle } from "lucide-react";

interface CancelExhibitionDialogProps {
  open: boolean;
  reason: string;
  errorMessage: string | null;
  isSubmitting: boolean;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CancelExhibitionDialog({
  open,
  reason,
  errorMessage,
  isSubmitting,
  onReasonChange,
  onClose,
  onConfirm,
}: CancelExhibitionDialogProps) {
  if (!open) return null;

  const canConfirm = reason.trim().length > 0 && !isSubmitting;

  return (
    <div className="bg-black-alpha-500 fixed inset-0 z-50 flex items-center justify-center px-5">
      <div className="bg-bg-primary shadow-spread-low w-full max-w-85 rounded-xl px-5 py-6">
        <div className="flex flex-col items-center text-center">
          <div className="bg-object-tertiary-light text-object-tertiary mb-4 flex size-12 items-center justify-center rounded-full">
            <AlertCircle size={24} />
          </div>

          <h2 className="text-headline-1 text-text-primary font-semibold">전시를 취소할까요?</h2>
          <p className="text-body-2 text-text-secondary mt-2">
            취소 사유는 전시 상세에 기록됩니다.
          </p>
        </div>

        <label className="mt-5 block">
          <span className="text-label text-text-primary font-medium">취소 사유</span>
          <textarea
            value={reason}
            onChange={event => onReasonChange(event.target.value)}
            maxLength={500}
            rows={4}
            className="border-border-primary focus:border-border-secondary text-body-1 text-text-primary mt-2 w-full resize-none rounded-lg border px-4 py-3 outline-none"
            placeholder="취소 사유를 입력해주세요."
          />
        </label>

        {errorMessage && (
          <p role="alert" className="text-label text-error-default mt-2">
            {errorMessage}
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="border-border-primary text-body-1 text-text-primary h-12 rounded-lg border font-medium disabled:cursor-not-allowed disabled:opacity-60"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canConfirm}
            className="bg-object-primary text-body-1 text-text-invert h-12 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "처리 중" : "취소하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
