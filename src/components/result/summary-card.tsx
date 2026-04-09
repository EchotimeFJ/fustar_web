import type { ReadingPreview } from "@/types/reading";

export function SummaryCard({ preview }: { preview: ReadingPreview }) {
  return (
    <section className="rounded-[28px] border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-6 shadow-lg shadow-violet-100/70">
      <div className="mb-4 inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
        简版摘要
      </div>
      <h2 className="text-2xl font-semibold text-slate-900">{preview.headline}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-700">{preview.summary}</p>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {preview.bullets.map((bullet) => (
          <div key={bullet} className="rounded-2xl border border-white/80 bg-white/80 p-4 text-sm leading-6 text-slate-600">
            {bullet}
          </div>
        ))}
      </div>
    </section>
  );
}
