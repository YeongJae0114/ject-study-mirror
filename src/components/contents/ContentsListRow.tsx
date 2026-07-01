import { ChevronRight } from "lucide-react";

interface InfoRowProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}

export default function ContentsListRow({ icon, title, onClick }: InfoRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-object-gray flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2"
    >
      <div className="flex items-center gap-1">
        <div>{icon}</div>
        <span className="text-body-1 text-text-primary font-semibold">{title}</span>
      </div>

      <ChevronRight className="text-text-secondary" size={20} />
    </button>
  );
}
