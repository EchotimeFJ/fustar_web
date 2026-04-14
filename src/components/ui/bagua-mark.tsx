type BaguaMarkProps = {
  className?: string;
  compact?: boolean;
};

const trigrams = [
  [1, 1, 1],
  [1, 1, 0],
  [1, 0, 1],
  [1, 0, 0],
  [0, 1, 1],
  [0, 1, 0],
  [0, 0, 1],
  [0, 0, 0],
] as const;

export function BaguaMark({ className = "", compact = false }: BaguaMarkProps) {
  return (
    <div
      aria-hidden="true"
      className={`bagua-mark${compact ? " bagua-mark--compact" : ""}${className ? ` ${className}` : ""}`}
    >
      {trigrams.map((lines, trigramIndex) => (
        <div key={`trigram-${trigramIndex}`} className="bagua-trigram">
          {lines.map((line, lineIndex) => (
            <span
              key={`line-${trigramIndex}-${lineIndex}`}
              className={`bagua-line${line === 0 ? " bagua-line--broken" : ""}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
