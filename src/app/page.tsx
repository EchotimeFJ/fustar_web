import Link from "next/link";
import { BirthInfoForm } from "@/components/forms/birth-info-form";

export default function Home() {
  return (
    <main className="bg-[radial-gradient(circle_at_top,#efe4ff,white_42%)]">
      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl gap-10 px-4 py-8 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:py-12">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-violet-700 uppercase">
            Web 端首版 · 四柱命理
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-slate-950 md:text-6xl">
            福星AI算命
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            输入出生时间、出生地、性别与关心的问题，系统会先进行四柱排盘，再返回按模块卡片呈现的完整分析结果。
            当前版本默认不做长期数据库保存，更适合先在本地跑通与验证输出质量。
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "先排盘再分析",
                desc: "后端先做出生信息标准化与四柱计算，再交给模型做中文展开。",
              },
              {
                title: "结果模块化",
                desc: "摘要、整体、事业、财运、感情、健康等内容拆成独立卡片。",
              },
              {
                title: "支持本地验证",
                desc: "没有 OpenRouter Key 也能用规则引擎先跑通，之后再接入真实模型。",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[28px] border border-white/70 bg-white/75 p-5 shadow-lg shadow-violet-100/60 backdrop-blur">
                <h2 className="text-base font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-500">
            <Link href="/privacy" className="rounded-full bg-white px-4 py-2 shadow-sm transition hover:text-slate-900">
              查看隐私说明
            </Link>
            <Link href="/disclaimer" className="rounded-full bg-white px-4 py-2 shadow-sm transition hover:text-slate-900">
              查看免责声明
            </Link>
          </div>
        </div>

        <BirthInfoForm />
      </section>
    </main>
  );
}
