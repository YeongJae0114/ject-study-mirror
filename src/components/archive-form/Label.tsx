interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
}

export default function Label({ children, required = false }: LabelProps) {
  return (
    <label
      className="
        flex items-center gap-1
        text-label font-semibold
        text-coolNeutral-900
      "
    >
      {children}

      {required && <span className="text-red-500">*</span>}
    </label>
  );
}
