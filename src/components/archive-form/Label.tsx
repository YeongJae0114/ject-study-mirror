interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
}

export default function Label({ children, required = false }: LabelProps) {
  return (
    <label className="text-label text-coolNeutral-900 flex items-center gap-1 font-semibold">
      {children}

      {required && <span className="text-red-500">*</span>}
    </label>
  );
}
