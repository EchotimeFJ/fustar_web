import type { PillarDetail } from "@/types/reading";

export function PillarCard({ pillar }: { pillar: PillarDetail }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-slate-500">{pillar.label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-wide text-slate-900">{pillar.ganzhi}</div>
      <div className="mt-2 text-sm text-slate-600">五行：{pillar.wuxing}</div>
      <div className="text-sm text-slate-600">纳音：{pillar.nayin}</div>
      <div className="mt-3 text-xs leading-6 text-slate-500">
        藏干：{pillar.hiddenStems.join(" / ") || "-"}
      </div>
      <div className="text-xs leading-6 text-slate-500">天干十神：{pillar.stemTenGod || "-"}</div>
      <div className="text-xs leading-6 text-slate-500">
        地支十神：{pillar.branchTenGods.join(" / ") || "-"}
      </div>
    </div>
  );
}
