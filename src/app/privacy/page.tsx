const items = [
  "你提交的出生信息仅用于本次排盘和报告生成。",
  "系统默认只在短时缓存中保留结果，不做长期数据库保存。",
  "如你后续接入真实登录、会员或支付，再单独补充对应隐私条款。",
  "如需彻底清空，请等待缓存过期或重启服务。",
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-slate-950">隐私说明</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </main>
  );
}
