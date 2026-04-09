import type { ReadingModule } from "@/types/reading";

export function FullModuleCard({ module }: { module: ReadingModule }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {module.key}
          </div>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">{module.title}</h3>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          模块卡片
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-700">{module.summary}</p>

      <div className="mt-5 space-y-4">
        {module.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-7 text-slate-600">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {module.highlights.map((highlight) => (
          <span
            key={highlight}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
          >
            {highlight}
          </span>
        ))}
      </div>
    </section>
  );
}
