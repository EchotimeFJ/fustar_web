import Link from "next/link";
import { TaijiMark } from "@/components/ui/taiji-mark";

const items = [
  {
    title: "信息收集与使用",
    content: "你提交的出生信息仅用于本次排盘与解读生成，不作为长期画像用途。我们不会将你的个人信息用于任何其他目的。"
  },
  {
    title: "数据存储与安全",
    content: "系统默认仅在短时缓存中保留结果，以便完成当前浏览与结果读取。数据存储在服务器内存中，服务重启后自动清除。"
  },
  {
    title: "未来功能规划",
    content: "若后续接入登录、会员或支付能力，将另行补充对应的数据处理与隐私条款，并在实施前通知用户。"
  },
  {
    title: "数据失效机制",
    content: "如需等待数据自然失效，可在缓存周期结束后再次访问确认状态。页面关闭后，系统会在短时间内自动清理相关缓存。"
  },
  {
    title: "隐私保护承诺",
    content: "我们承诺不会将你的个人信息出售、出租或分享给任何第三方，除非法律要求或获得你的明确授权。"
  },
];

export default function PrivacyPage() {
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
              <Link href="/disclaimer" className="hidden md:flex nav-link text-sm text-[#d3cdc3]">免责声明</Link>
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
                Privacy Policy
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#f4efe7] md:text-4xl text-glow">
                隐私说明
              </h1>
              <p className="mt-6 max-w-3xl text-sm leading-7 text-[#b9b0a4] md:text-[15px]">
                以下内容用于说明本服务在当前版本中对用户输入信息的处理方式与使用边界，我们致力于保护你的个人隐私。
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
                我们会定期审查和更新隐私政策，以确保其与我们的服务和法律法规保持一致。如果你对本隐私说明有任何疑问，请通过相关渠道与我们联系。
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
              <Link href="/privacy" className="text-xs text-[#c7b188] font-semibold">隐私政策</Link>
              <Link href="/disclaimer" className="text-xs text-[#d3cdc3] hover:text-[#c7b188] transition-colors">免责声明</Link>
              <Link href="/terms" className="text-xs text-[#d3cdc3] hover:text-[#c7b188] transition-colors">服务条款</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
