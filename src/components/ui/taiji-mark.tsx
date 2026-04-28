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
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c7b188" />
          <stop offset="50%" stopColor="#f4efe7" />
          <stop offset="100%" stopColor="#c7b188" />
        </linearGradient>
        <linearGradient id="darkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="50%" stopColor="#2d2d2d" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
      </defs>

      <circle cx="50" cy="50" r="48" fill="url(#darkGradient)" stroke="#c7b188" strokeWidth="1.5" />

      <g fill="none" stroke="#c7b188" strokeWidth="1.2" strokeLinecap="round">
        <line x1="50" y1="2" x2="50" y2="98" />
        <line x1="2" y1="50" x2="98" y2="50" />
        <line x1="15" y1="15" x2="85" y2="85" />
        <line x1="85" y1="15" x2="15" y2="85" />
      </g>

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

      <g fill="#c7b188" fontSize="7" fontFamily="serif" textAnchor="middle" dominantBaseline="middle">
        <text x="50" y="12">乾</text>
        <text x="88" y="50">兑</text>
        <text x="50" y="88">坤</text>
        <text x="12" y="50">艮</text>
        <text x="78" y="22">巽</text>
        <text x="78" y="78">离</text>
        <text x="22" y="78">坎</text>
        <text x="22" y="22">震</text>
      </g>

      <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(199,177,136,0.3)" strokeWidth="0.5" />
    </svg>
  );
}
