import { ChevronRight } from "lucide-react";

interface SettingMenuItemProps {
  title: string;
  hasDivider?: boolean;
  onClick: () => void;
}

export default function SettingMenuItem({
  title,
  hasDivider = false,
  onClick,
}: SettingMenuItemProps) {
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onClick}
        className="bg-bg-primary hover:bg-bg-primary-darker flex w-full items-center justify-between px-1 py-5 text-left transition-colors"
      >
        <span className="text-body-1 text-text-primary font-semibold">{title}</span>
        <ChevronRight size={24} className="text-text-secondary" />
      </button>

      {hasDivider && <div className="border-border-primary border-t" />}
    </div>
  );
}
