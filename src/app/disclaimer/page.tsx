const items = [
  "页面中展示的命理解读内容属于程序生成结果，仅供传统文化与娱乐参考。",
  "解读中涉及事业、财运、婚姻、健康等描述，不构成对现实结果的保证或承诺。",
  "如涉及医疗、法律、心理、投资等专业领域问题，请咨询对应行业的专业人士。",
];

export default function DisclaimerPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-12 md:px-6 md:py-16">
      <section className="mystic-panel mystic-border rounded-[36px] p-6 md:p-10">
        <div className="text-xs font-semibold tracking-[0.28em] text-[#c7b188] uppercase">
          Disclaimer
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#f4efe7] md:text-4xl">
          免责声明
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b9b0a4] md:text-[15px]">
          请在使用本服务前了解以下边界说明，并结合个人判断理性参考。
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
