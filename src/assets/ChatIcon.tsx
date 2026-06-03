interface ChatIconProps {
  active?: boolean;
}

export default function ChatIcon({ active = false }: ChatIconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.03431 2.5L21.2908 3.61765L22 15.9118L7.61188 17.0294L2 21.5L4.03431 2.5Z"
        fill={active ? "#7E57FF" : "#D1D1DB"}
      />
      <path d="M7.5 9H9.5V11H7.5V9Z" fill={active ? "#F87AF8" : "#A3A3B3"} />
      <path d="M11.5 9H13.5V11H11.5V9Z" fill={active ? "#F87AF8" : "#A3A3B3"} />
      <path d="M15.5 9H17.5V11H15.5V9Z" fill={active ? "#F87AF8" : "#A3A3B3"} />
    </svg>
  );
}
