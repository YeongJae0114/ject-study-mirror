interface ExhibitionIconProps {
  active?: boolean;
}

export default function ExhibitionIcon({ active = false }: ExhibitionIconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 2.5V8.5H19.6611L20 21.5H4L4.50488 2.5H14Z"
        fill={active ? "#7E57FF" : "#D1D1DB"}
      />
      <path
        d="M17 18H7V16.5H17V18ZM17 14.5H7V13H17V14.5ZM13 11H7V9.5H13V11Z"
        fill={active ? "#F87AF8" : "#A3A3B3"}
      />
      <path d="M14 8.5H19.6611L14 2.5V8.5Z" fill={active ? "#583DCC" : "#A3A3B3"} />
    </svg>
  );
}
