import Link from "next/link";
import { BirthInfoForm } from "@/components/forms/birth-info-form";

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl gap-10 px-4 py-8 md:grid-cols-[1.05fr_0.95fr] md:px-6 md:py-14">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit rounded-full border border-amber-200/15 bg-white/4 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-[#d7c49d] uppercase backdrop-blur">
            Four Pillars · Blind Reading
          </div>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-7xl">
            福星 <span className="mystic-gold">AI算命</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#d2c7b0] md:text-lg">
            输入姓名、性别、出生时间与出生地，系统会先标准化基础信息，再交给大模型自由生成完整分析，最后按一级标题为你切分成适合阅读的章节。
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "自由生成",
                desc: "不预设固定八字模板，让每一次分析都保持独立表达。",
              },
              {
                title: "章节切分",
                desc: "只根据一级标题切块展示，阅读体验更接近高端长文产品。",
              },
              {
                title: "本地可测",
                desc: "支持本地调试与真实模型接入，之后可直接上线到你的服务器。",
              },
            ].map((item) => (
              <div key={item.title} className="mystic-panel mystic-border rounded-[30px] p-5">
                <h2 className="text-base font-semibold text-[#f6e8bf]">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#c9bea6]">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3 text-sm text-[#b4a98f]">
            <Link href="/privacy" className="rounded-full border border-white/8 bg-white/4 px-4 py-2 backdrop-blur transition hover:text-white">
              查看隐私说明
            </Link>
            <Link href="/disclaimer" className="rounded-full border border-white/8 bg-white/4 px-4 py-2 backdrop-blur transition hover:text-white">
              查看免责声明
            </Link>
          </div>
        </div>

        <div className="relative flex items-center">
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-[40px] bg-[radial-gradient(circle_at_top,rgba(255,213,133,0.15),transparent_34%),radial-gradient(circle_at_bottom,rgba(125,74,170,0.2),transparent_35%)] blur-2xl" />
          <BirthInfoForm />
        </div>
      </section>
    </main>
  );
}
