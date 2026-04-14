const items = [
  "本服务定位为传统文化与个人阅读参考，不构成任何专业建议或现实承诺。",
  "用户需确保提交的信息真实、合法，并自行承担基于解读内容作出判断的责任。",
  "未经授权，不得将本服务结果用于虚假营销、误导宣传、诈骗或伪装专业建议。",
];

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-12 md:px-6 md:py-16">
      <section className="mystic-panel mystic-border rounded-[36px] p-6 md:p-10">
        <div className="text-xs font-semibold tracking-[0.28em] text-[#c7b188] uppercase">
          Terms
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#f4efe7] md:text-4xl">
          服务条款
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b9b0a4] md:text-[15px]">
          使用本服务即表示你理解并接受以下基本使用条款与内容边界。
        </p>

        <div className="mt-8 space-y-4">
          {items.map((item, index) => (
            <div
              key={item}
              className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-5 py-4"
            >
              <div className="text-[11px] font-semibold tracking-[0.22em] text-[#c7b188] uppercase">
                {String(index + 1).padStart(2, "0")}
              </div>
              <p className="mt-3 text-[15px] leading-8 text-[#d9d1c5]">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
