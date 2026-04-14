const items = [
  "你提交的出生信息仅用于本次排盘与解读生成，不作为长期画像用途。",
  "系统默认仅在短时缓存中保留结果，以便完成当前浏览与结果读取。",
  "若后续接入登录、会员或支付能力，将另行补充对应的数据处理与隐私条款。",
  "如需等待数据自然失效，可在缓存周期结束后再次访问确认状态。",
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-12 md:px-6 md:py-16">
      <section className="mystic-panel mystic-border rounded-[36px] p-6 md:p-10">
        <div className="text-xs font-semibold tracking-[0.28em] text-[#c7b188] uppercase">
          Privacy
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#f4efe7] md:text-4xl">
          隐私说明
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b9b0a4] md:text-[15px]">
          以下内容用于说明本服务在当前版本中对用户输入信息的处理方式与使用边界。
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
