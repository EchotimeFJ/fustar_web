type TaijiMarkProps = {
  className?: string;
};

export function TaijiMark({ className = "" }: TaijiMarkProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={`h-[76px] w-[76px] shrink-0 drop-shadow-[0_18px_36px_rgba(0,0,0,0.35)]${className ? ` ${className}` : ""}`}
    >
      <circle cx="8" cy="8" r="7.25" fill="#f2eee7" />
      <path
        fill="#0b0b0b"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M1 8a7 7 0 0 1 7-7 3.5 3.5 0 1 1 0 7 3.5 3.5 0 1 0 0 7 7 7 0 0 1-7-7m7 4.667a1.167 1.167 0 1 1 0-2.334 1.167 1.167 0 0 1 0 2.334"
      />
      <path
        fill="#f2eee7"
        d="M9.167 4.5a1.167 1.167 0 1 1-2.334 0 1.167 1.167 0 0 1 2.334 0"
      />
      <circle cx="8" cy="8" r="7.25" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="0.28" />
    </svg>
  );
}
