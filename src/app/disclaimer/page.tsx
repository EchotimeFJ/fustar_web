import Link from "next/link";
import { TaijiMark } from "@/components/ui/taiji-mark";

const items = [
  {
    title: "内容性质说明",
    content: "页面中展示的命理解读内容属于程序生成结果，仅供传统文化与娱乐参考，不构成任何专业建议。"
  },
  {
    title: "结果保证免责",
    content: "解读中涉及事业、财运、婚姻、健康等描述，不构成对现实结果的保证或承诺，实际结果可能因个人努力、环境变化等因素而有所不同。"
  },
  {
    title: "专业问题咨询",
    content: "如涉及医疗、法律、心理、投资等专业领域问题，请咨询对应行业的专业人士，本服务不提供此类专业建议。"
  },
  {
    title: "用户责任说明",
    content: "用户应理性对待命理分析结果，不应过度依赖或迷信，应保持科学的思维方式和积极的生活态度。"
  },
  {
    title: "内容变更告知",
    content: "本服务可能会根据需要调整解读算法和内容呈现方式，相关变更将在网站上及时更新。"
  },
];

export default function DisclaimerPage() {
  return (
    <div className="relative overflow-hidden min-h-screen bg-pattern">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <TaijiMark className="w-8 h-8" />
                <span className="text-xl font-semibold text-white">福星 AI 命理</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="hidden md:flex nav-link text-sm text-[#d3cdc3]">首页</Link>
              <Link href="/privacy" className="hidden md:flex nav-link text-sm text-[#d3cdc3]">隐私说明</Link>
              <Link href="/terms" className="hidden md:flex nav-link text-sm text-[#d3cdc3]">服务条款</Link>
              <Link href="/" className="md:hidden flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#d3cdc3] transition hover:bg-white/8 hover:text-white">
                ← 返回
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto min-h-screen max-w-4xl px-4 py-12 md:px-6 md:py-16">
        <section className="mystic-panel mystic-border rounded-[36px] p-8 md:p-12 card-hover">
          <div className="relative">
            <div className="fade-in-text">
              <div className="text-xs font-semibold tracking-[0.28em] text-[#c7b188] uppercase">
                Disclaimer
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#f4efe7] md:text-4xl text-glow">
                免责声明
              </h1>
              <p className="mt-6 max-w-3xl text-sm leading-7 text-[#b9b0a4] md:text-[15px]">
                请在使用本服务前了解以下边界说明，并结合个人判断理性参考。本服务旨在提供传统文化参考，不替代专业建议。
              </p>
            </div>

            <div className="mt-10 space-y-6">
              {items.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-6 py-6 backdrop-blur hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] transition-all duration-300 fade-in-text delay-100"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center border border-[#c7b188] text-[11px] font-semibold tracking-[0.22em] text-[#c7b188] uppercase">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  </div>
                  <p className="mt-4 pl-12 text-[15px] leading-8 text-[#d9d1c5]">{item.content}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-[24px] border border-[#c7b188]/20 bg-[#c7b188]/5 fade-in-text delay-300">
              <p className="text-sm leading-7 text-[#d9d1c5]">
                使用本服务即表示你已了解并接受本免责声明的所有内容。如果你不同意本免责声明的任何部分，请停止使用本服务。
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="border-t border-white/10 backdrop-blur-xl bg-black/30">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <TaijiMark className="w-6 h-6" />
              <span className="text-sm text-[#d3cdc3]">© 2026 福星 AI 命理</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xs text-[#d3cdc3] hover:text-[#c7b188] transition-colors">首页</Link>
              <Link href="/privacy" className="text-xs text-[#d3cdc3] hover:text-[#c7b188] transition-colors">隐私政策</Link>
              <Link href="/disclaimer" className="text-xs text-[#c7b188] font-semibold">免责声明</Link>
              <Link href="/terms" className="text-xs text-[#d3cdc3] hover:text-[#c7b188] transition-colors">服务条款</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
