interface HomeIconProps {
  active?: boolean;
}

export default function HomeIcon({ active = false }: HomeIconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.8397 12.5095L20.3996 21.4998H3.59961L4.15845 12.5095L11.9996 6.47852L19.8397 12.5095Z"
        fill={active ? "#7E57FF" : "#D1D1DB"}
      />
      <path
        d="M22.5 10.5772L20.5507 13.055L12 6.47728L3.44931 13.055L1.5 10.5772L12 2.5L22.5 10.5772Z"
        fill={active ? "#583DCC" : "#A3A3B3"}
      />
      <path
        d="M15.1496 14.1113H8.84961V21.4998H15.1496V14.1113Z"
        fill={active ? "#F87AF8" : "#A3A3B3"}
      />
    </svg>
  );
}
