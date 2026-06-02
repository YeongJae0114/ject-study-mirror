import Image from "next/image";

interface EmptyContentProps {
  message?: string;
}

export const EmptyContent = ({ message = "아직 등록된 내용이 없어요." }: EmptyContentProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image src="/empty-icon.svg" alt="정보 없음" width={80} height={80} />
      <div className="text-body-1 text-text-disabled mt-3 font-medium">{message}</div>
    </div>
  );
};
