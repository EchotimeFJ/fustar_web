import Link from "next/link";
import { BirthInfoForm } from "@/components/forms/birth-info-form";
import { BaguaMark } from "@/components/ui/bagua-mark";
import { TaijiMark } from "@/components/ui/taiji-mark";

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
                Fuxing · Personal Reading
              </div>

              <div className="mt-10 flex items-start gap-5">
                <TaijiMark className="hidden md:block" />
                <div>
                  <h1 className="quiet-lux-display text-5xl leading-[0.98] text-white md:text-7xl">
                    福星 <span className="mystic-gold">AI 命理</span>
                  </h1>
                  <BaguaMark className="mt-5 opacity-65" />
                  <p className="mt-8 max-w-xl text-base leading-8 text-[#d3cdc3] md:text-lg">
                    专属命盘解读，沉稳呈现一生运势脉络与关键命理信息。
                  </p>
                </div>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {[
                  "命盘排布",
                  "综合详批",
                  "章节呈现",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-5 py-6 backdrop-blur"
                  >
                    <div className="text-[11px] font-semibold tracking-[0.28em] text-[#c7b188] uppercase">
                      {item}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex flex-wrap gap-3 text-sm text-[#c9c1b6]">
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
