import Link from "next/link";
import { BirthInfoForm } from "@/components/forms/birth-info-form";
import { BaguaMark } from "@/components/ui/bagua-mark";
import { TaijiMark } from "@/components/ui/taiji-mark";

export default function Home() {
  return (
    <main className="relative overflow-hidden min-h-screen bg-pattern">
      {/* 背景光效 */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(195,171,122,0.15),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.08),transparent_25%),radial-gradient(circle_at_40%_80%,rgba(199,177,136,0.1),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-24 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TaijiMark className="w-8 h-8" />
              <span className="text-xl font-semibold text-white">福星 AI 命理</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="nav-link text-sm text-[#d3cdc3]">隐私说明</Link>
              <Link href="/disclaimer" className="nav-link text-sm text-[#d3cdc3]">免责声明</Link>
              <Link href="/terms" className="nav-link text-sm text-[#d3cdc3]">服务条款</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-12 md:px-6 md:pb-28 md:pt-20">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* 左侧介绍 */}
          <div className="relative overflow-hidden rounded-[40px] border border-white/8 bg-[linear-gradient(145deg,rgba(18,18,18,0.96),rgba(9,9,9,0.88))] p-8 shadow-[0_28px_90px_rgba(0,0,0,0.34)] md:p-12 card-hover">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(199,177,136,0.2),transparent_60%)]" />
            <div className="pointer-events-none absolute inset-0 bg-glow rounded-[40px]" />

            <div className="relative space-y-8">
              {/* 品牌标识 */}
              <div className="fade-in-text">
                <div className="inline-flex w-fit rounded-full border border-[#c7b188]/20 bg-[#c7b188]/10 px-4 py-2 text-[11px] font-semibold tracking-[0.34em] text-[#d7c29d] uppercase">
                  Fuxing · Personal Reading
                </div>
              </div>

              {/* 主标题 */}
              <div className="flex items-start gap-6 fade-in-text delay-100">
                <TaijiMark className="hidden md:block" />
                <div className="space-y-4">
                  <h1 className="quiet-lux-display text-5xl leading-[0.98] text-white md:text-7xl text-glow">
                    福星 <span className="mystic-gold" data-text="AI 命理">AI 命理</span>
                  </h1>
                  <BaguaMark className="mt-2 opacity-70 hover:opacity-100 transition-opacity duration-300" />
                  <p className="mt-4 max-w-xl text-base leading-8 text-[#d3cdc3] md:text-lg">
                    专属命盘解读，沉稳呈现一生运势脉络与关键命理信息。结合传统易学与现代 AI 技术，为您提供专业、准确的命理分析。
                  </p>
                </div>
              </div>

              {/* 核心功能 */}
              <div className="mt-8 grid gap-4 md:grid-cols-3 fade-in-text delay-200">
                {
                  [
                    { title: "命盘排布", desc: "精准排盘，展现八字格局" },
                    { title: "综合详批", desc: "全面分析，解读人生运势" },
                    { title: "章节呈现", desc: "结构化展示，易于阅读" },
                  ].map((item, index) => (
                    <div
                      key={item.title}
                      className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-5 py-6 backdrop-blur hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] transition-all duration-300"
                    >
                      <div className="text-[11px] font-semibold tracking-[0.28em] text-[#c7b188] uppercase mb-2">
                        {item.title}
                      </div>
                      <div className="text-sm text-[#d0cabf]">
                        {item.desc}
                      </div>
                    </div>
                  ))
                }
              </div>

              {/* 特点说明 */}
              <div className="mt-8 space-y-3 fade-in-text delay-300">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#c7b188]"></div>
                  <span className="text-sm text-[#d3cdc3]">数据安全：临时缓存，自动清理</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#c7b188]"></div>
                  <span className="text-sm text-[#d3cdc3]">专业分析：传统易学结合 AI 技术</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#c7b188]"></div>
                  <span className="text-sm text-[#d3cdc3]">用户友好：直观界面，易于操作</span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧表单 */}
          <div className="relative flex items-stretch">
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-[42px] bg-[radial-gradient(circle_at_top,rgba(199,177,136,0.15),transparent_40%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.1),transparent_45%)] blur-3xl" />
            <div className="w-full rounded-[40px] border border-white/8 bg-[linear-gradient(145deg,rgba(18,18,18,0.96),rgba(9,9,9,0.88))] shadow-[0_28px_90px_rgba(0,0,0,0.34)] overflow-hidden card-hover">
              <BirthInfoForm />
            </div>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="mt-12 grid gap-4 lg:grid-cols-[minmax(0,1fr)_160px_160px_160px]">
          <div className="mystic-panel mystic-border rounded-[30px] px-6 py-6 text-sm leading-7 text-[#d0cabf]">
            <p>
              测算内容仅用于当前会话展示，不写入云端长期数据库；关闭当前页面后，系统会自动释放本次临时缓存，尽量减少信息停留时间。
            </p>
          </div>
          <Link
            href="/privacy"
            className="flex items-center justify-center rounded-[30px] border border-white/8 bg-white/4 px-5 py-6 text-sm text-[#d3cdc3] transition hover:bg-white/8 hover:text-white btn-glass"
          >
            隐私说明
          </Link>
          <Link
            href="/disclaimer"
            className="flex items-center justify-center rounded-[30px] border border-white/8 bg-white/4 px-5 py-6 text-sm text-[#d3cdc3] transition hover:bg-white/8 hover:text-white btn-glass"
          >
            免责声明
          </Link>
          <Link
            href="/terms"
            className="flex items-center justify-center rounded-[30px] border border-white/8 bg-white/4 px-5 py-6 text-sm text-[#d3cdc3] transition hover:bg-white/8 hover:text-white btn-glass"
          >
            服务条款
          </Link>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="border-t border-white/10 backdrop-blur-xl bg-black/30">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <TaijiMark className="w-6 h-6" />
              <span className="text-sm text-[#d3cdc3]">© 2026 福星 AI 命理</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-xs text-[#d3cdc3] hover:text-[#c7b188] transition-colors">隐私政策</Link>
              <Link href="/disclaimer" className="text-xs text-[#d3cdc3] hover:text-[#c7b188] transition-colors">免责声明</Link>
              <Link href="/terms" className="text-xs text-[#d3cdc3] hover:text-[#c7b188] transition-colors">服务条款</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
