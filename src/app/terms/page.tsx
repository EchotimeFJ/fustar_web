const items = [
  "本服务定位为传统文化与娱乐参考，不承诺准确率，不构成任何专业建议。",
  "用户需保证输入的信息真实、合法，并自行承担基于结果做现实决策的风险。",
  "未经授权，不得将本服务结果用于违法营销、引流、诈骗或伪造专业咨询。",
];

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-slate-950">服务条款</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </main>
  );
}
