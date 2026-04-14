import { useId } from "react";

type TaijiMarkProps = {
  className?: string;
};

export function TaijiMark({ className = "" }: TaijiMarkProps) {
  const clipPathId = useId();

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      className={`h-[76px] w-[76px] shrink-0 drop-shadow-[0_18px_36px_rgba(0,0,0,0.35)]${className ? ` ${className}` : ""}`}
    >
      <defs>
        <clipPath id={clipPathId}>
          <circle cx="50" cy="50" r="49" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipPathId})`}>
        <rect x="0" y="0" width="100" height="50" fill="#0b0b0b" />
        <rect x="0" y="50" width="100" height="50" fill="#f2eee7" />
        <circle cx="50" cy="25" r="25" fill="#f2eee7" />
        <circle cx="50" cy="75" r="25" fill="#0b0b0b" />
        <circle cx="50" cy="25" r="6.5" fill="#0b0b0b" />
        <circle cx="50" cy="75" r="6.5" fill="#f2eee7" />
      </g>

      <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.6" />
    </svg>
  );
}
