interface ExhibitionStatusProps {
  status: "전시 가능" | "전시 중" | "전시 예정" | "전시 완료" | "전시 취소" | "동의서 작성 중";
}

const statusStyles = {
  "전시 중": "bg-object-primary-light text-text-primary-brand",
  "전시 가능": "bg-object-primary text-text-invert",
  "전시 예정": "bg-object-tertiary-light text-text-tertiary",
  "전시 완료": "bg-object-secondary-light text-primary",
  "전시 취소": "bg-object-secondary-light text-primary",
  "동의서 작성 중": "bg-object-secondary text-invert",
};

export const ExhibitionStatus = ({ status }: ExhibitionStatusProps) => {
  return (
    <span
      className={`text-caption mb-1 inline-block w-fit rounded px-1.5 py-0.5 font-medium ${
        statusStyles[status]
      }`}
    >
      {status}
    </span>
  );
};
