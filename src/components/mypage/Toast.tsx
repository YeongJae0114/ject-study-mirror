import { CheckCircle2 } from "lucide-react";

interface ToastProps {
  open: boolean;
  message: string;
}

export default function Toast({ open, message }: ToastProps) {
  if (!open) return null;

  return (
    <div className="bg-bg-secondary text-text-invert shadow-medium fixed right-5 bottom-8 left-5 z-50 mx-auto flex h-12 max-w-87.5 items-center gap-2 rounded-lg px-4">
      <CheckCircle2 size={20} className="shrink-0" />
      <p className="text-body-1 truncate font-medium">{message}</p>
    </div>
  );
}
