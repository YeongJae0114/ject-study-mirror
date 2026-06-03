interface MypageIconProps {
  active?: boolean;
}

export default function MypageIcon({ active = false }: MypageIconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.5 3H20.5L21 21H3L3.5 3Z" fill={active ? "#7E57FF" : "#D1D1DB"} />
      <path
        d="M18.5 18.5H5.5V16.5644L12 13L18.5 16.743V18.5Z"
        fill={active ? "#F87AF8" : "#A3A3B3"}
      />
      <path
        d="M11.9999 12C13.6568 12 14.9999 10.6569 14.9999 9C14.9999 7.34315 13.6568 6 11.9999 6C10.3431 6 8.99991 7.34315 8.99991 9C8.99991 10.6569 10.3431 12 11.9999 12Z"
        fill={active ? "#F87AF8" : "#A3A3B3"}
      />
    </svg>
  );
}
