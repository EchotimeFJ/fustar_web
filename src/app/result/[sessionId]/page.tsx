import Link from "next/link";
import { ResultView } from "@/components/result/result-view";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f5edff,white_45%)] px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-medium text-slate-500 transition hover:text-slate-900">
            ← 返回首页
          </Link>
          <div className="text-xs text-slate-400">session: {sessionId}</div>
        </div>
        <ResultView sessionId={sessionId} />
      </div>
    </main>
  );
}
