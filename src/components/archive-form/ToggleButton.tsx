"use client";

interface ToggleButtonProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function ToggleButton({ value, onChange }: ToggleButtonProps) {
  const handleToggle = () => {
    onChange(!value);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={handleToggle}
      className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full border-2 border-transparent transition-colors outline-none ${value ? "bg-object-primary" : "bg-gray-200"} `}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${value ? "translate-x-5" : "translate-x-0"} `}
      />
    </button>
  );
}
