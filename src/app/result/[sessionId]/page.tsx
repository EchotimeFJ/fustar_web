import Link from "next/link";
import { ResultView } from "@/components/result/result-view";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  return (
    <main className="min-h-screen px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-medium text-[#c6b18d] transition hover:text-white">
            ← 返回首页
          </Link>
          <div className="text-xs text-[#7f7461]">session: {sessionId}</div>
        </div>
        <ResultView sessionId={sessionId} />
      </div>
    </main>
  );
}
