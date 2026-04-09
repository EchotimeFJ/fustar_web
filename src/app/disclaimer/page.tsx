const items = [
  "本页面展示的所有命理内容均为程序化生成，仅供传统文化研究与娱乐参考。",
  "结果中涉及事业、财运、婚姻、健康等描述，不代表确定事实或承诺。",
  "若你需要医学、心理、法律、投资等专业支持，请咨询对应领域专业人士。",
];

export default function DisclaimerPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-slate-950">免责声明</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </main>
  );
}
