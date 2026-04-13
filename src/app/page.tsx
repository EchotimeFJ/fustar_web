import Link from "next/link";
import { BirthInfoForm } from "@/components/forms/birth-info-form";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(195,171,122,0.12),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.06),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-6 md:pb-20 md:pt-14">
        <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="relative overflow-hidden rounded-[40px] border border-white/8 bg-[linear-gradient(145deg,rgba(18,18,18,0.96),rgba(9,9,9,0.88))] p-7 shadow-[0_28px_90px_rgba(0,0,0,0.34)] md:p-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(199,177,136,0.18),transparent_58%)]" />

            <div className="relative">
              <div className="inline-flex w-fit rounded-full border border-[#c7b188]/15 bg-[#c7b188]/7 px-4 py-2 text-[11px] font-semibold tracking-[0.34em] text-[#d7c29d] uppercase">
                Four Pillars · Bespoke Reading
              </div>

              <div className="mt-10 flex items-start gap-5">
                <div className="taiji-mark hidden md:block" />
                <div>
                  <div className="text-sm tracking-[0.32em] text-[#9f9586] uppercase">
                    东方命理 · 低调奢雅
                  </div>
                  <h1 className="quiet-lux-display mt-4 text-5xl leading-[0.98] text-white md:text-7xl">
                    福星 <span className="mystic-gold">AI 命理</span>
                  </h1>
                  <div className="bagua-strip mt-5 h-2 w-52 rounded-full opacity-60" />
                </div>
              </div>

              <p className="mt-8 max-w-2xl text-base leading-8 text-[#d3cdc3] md:text-lg">
                以克制的视觉语言承载更完整的命理体验。你只需按模板直接输入出生信息，
                系统会先完成基础信息标准化，再调用模型生成长文分析，最终按一级标题切分为适合阅读的章节。
              </p>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {[
                  {
                    kicker: "Direct Input",
                    title: "模板即格式",
                    desc: "出生日期与时间统一改为文本输入，减少旧式系统面板带来的割裂感。",
                  },
                  {
                    kicker: "Structured Output",
                    title: "长文切分",
                    desc: "保留完整命理叙述，同时用一级标题切分结果，阅读更沉稳清晰。",
                  },
                  {
                    kicker: "Practical Deploy",
                    title: "本地到上线",
                    desc: "本地即可验证模型效果，之后可以平滑迁移到服务器与正式域名。",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 backdrop-blur"
                  >
                    <div className="text-[11px] font-semibold tracking-[0.26em] text-[#c7b188] uppercase">
                      {item.kicker}
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-white">{item.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-[#bdb6aa]">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[30px] border border-white/8 bg-black/20 p-5">
                  <div className="text-[11px] font-semibold tracking-[0.26em] text-[#c7b188] uppercase">
                    Input Note
                  </div>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-[#cfc7bc]">
                    <p>出生日期按 `YYYY-MM-DD` 输入。</p>
                    <p>出生时间按北京时间 `HH:mm` 输入。</p>
                    <p>出生地支持留空，未填写时系统会按“未填写”处理。</p>
                  </div>
                </div>

                <div className="rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(199,177,136,0.08),rgba(255,255,255,0.02))] p-5">
                  <div className="text-[11px] font-semibold tracking-[0.26em] text-[#c7b188] uppercase">
                    Reading Style
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#cfc7bc]">
                    当前产品方向不是热闹的占卜玩具，而是更像一份经过编排的深色命理报告。
                    视觉保持压低饱和度，强调秩序、材质感与阅读质感。
                  </p>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-3 text-sm text-[#c9c1b6]">
                <Link
                  href="/privacy"
                  className="rounded-full border border-white/8 bg-white/4 px-4 py-2 transition hover:bg-white/8 hover:text-white"
                >
                  查看隐私说明
                </Link>
                <Link
                  href="/disclaimer"
                  className="rounded-full border border-white/8 bg-white/4 px-4 py-2 transition hover:bg-white/8 hover:text-white"
                >
                  查看免责声明
                </Link>
              </div>
            </div>
          </div>

          <div className="relative flex items-stretch">
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-[42px] bg-[radial-gradient(circle_at_top,rgba(199,177,136,0.12),transparent_38%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.08),transparent_40%)] blur-3xl" />
            <BirthInfoForm />
          </div>
        </div>
      </section>
    </main>
  );
}
