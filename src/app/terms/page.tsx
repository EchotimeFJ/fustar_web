import Link from "next/link";
import { TaijiMark } from "@/components/ui/taiji-mark";

const items = [
  {
    title: "服务定位",
    content: "本服务定位为传统文化与个人阅读参考，不构成任何专业建议或现实承诺。用户应将解读结果视为参考信息，而非决定性指导。"
  },
  {
    title: "用户责任",
    content: "用户需确保提交的信息真实、合法，并自行承担基于解读内容作出判断的责任。如有虚假信息导致的后果，由用户自行承担。"
  },
  {
    title: "结果使用规范",
    content: "未经授权，不得将本服务结果用于虚假营销、误导宣传、诈骗或伪装专业建议。不得利用本服务从事任何违法或违反公序良俗的活动。"
  },
  {
    title: "知识产权",
    content: "本服务的所有内容、功能和技术均受知识产权法律保护。未经授权，不得复制、修改、分发或商业使用本服务的任何部分。"
  },
  {
    title: "服务变更",
    content: "我们保留随时修改、暂停或终止本服务的权利，无需事先通知。服务条款的变更将在网站上公布，继续使用服务即表示接受变更后的条款。"
  },
  {
    title: "违约责任",
    content: "如用户违反本服务条款，我们有权采取相应措施，包括但不限于暂停或终止用户访问权限，追究法律责任等。"
  },
];

export default function TermsPage() {
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
              <Link href="/disclaimer" className="hidden md:flex nav-link text-sm text-[#d3cdc3]">免责声明</Link>
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
                Terms of Service
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#f4efe7] md:text-4xl text-glow">
                服务条款
              </h1>
              <p className="mt-6 max-w-3xl text-sm leading-7 text-[#b9b0a4] md:text-[15px]">
                使用本服务即表示你理解并接受以下基本使用条款与内容边界。请在使用前仔细阅读本条款。
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
                本服务条款构成你与本服务之间的完整协议，取代之前的任何口头或书面约定。如本条款的任何部分被认定为无效或不可执行，其余部分仍然有效。
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
              <Link href="/disclaimer" className="text-xs text-[#d3cdc3] hover:text-[#c7b188] transition-colors">免责声明</Link>
              <Link href="/terms" className="text-xs text-[#c7b188] font-semibold">服务条款</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
