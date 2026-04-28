type TaijiMarkProps = {
  className?: string;
};

export function TaijiMark({ className = "" }: TaijiMarkProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      className={`h-[76px] w-[76px] shrink-0 drop-shadow-[0_18px_36px_rgba(0,0,0,0.35)]${className ? ` ${className}` : ""}`}
    >
      <defs>
        <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c7b188" />
          <stop offset="50%" stopColor="#f4efe7" />
          <stop offset="100%" stopColor="#c7b188" />
        </linearGradient>
      </defs>

      <circle cx="50" cy="50" r="48" fill="#1a1a1a" stroke="url(#goldBorder)" strokeWidth="2" />

      <path
        d="M50 2 A48 48 0 0 1 98 50 L50 50 Z"
        fill="#f4efe7"
      />
      <path
        d="M98 50 A48 48 0 0 1 50 98 L50 50 Z"
        fill="#1a1a1a"
      />
      <path
        d="M50 98 A48 48 0 0 1 2 50 L50 50 Z"
        fill="#1a1a1a"
      />
      <path
        d="M2 50 A48 48 0 0 1 50 2 L50 50 Z"
        fill="#f4efe7"
      />

      <circle cx="50" cy="26" r="12" fill="#1a1a1a" />
      <circle cx="50" cy="26" r="4" fill="#f4efe7" />

      <circle cx="50" cy="74" r="12" fill="#f4efe7" />
      <circle cx="50" cy="74" r="4" fill="#1a1a1a" />

      <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(199,177,136,0.4)" strokeWidth="0.5" />
    </svg>
  );
}
