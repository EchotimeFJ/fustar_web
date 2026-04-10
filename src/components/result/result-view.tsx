"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ReadingResult } from "@/types/reading";

export function ResultView({ sessionId }: { sessionId: string }) {
  const [reading, setReading] = useState<ReadingResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const sectionLinks = useMemo(
    () => reading?.sections.map((section) => ({ id: section.id, title: section.title })) ?? [],
    [reading]
  );

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/reading/full/${sessionId}`, {
          cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "读取结果失败");
        }
        if (active) {
          setReading(data);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "读取结果失败");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [sessionId]);

  if (loading) {
    return (
      <div className="mystic-panel mystic-border rounded-[36px] p-12 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/15 border-t-[#e9cb87]" />
        <p className="mt-4 text-sm text-[#d2c7b0]">正在读取分析结果并按一级标题切分...</p>
      </div>
    );
  }

  if (error || !reading) {
    return (
      <div className="mystic-panel mystic-border rounded-[36px] p-10 text-center">
        <h2 className="text-xl font-semibold text-white">结果暂时不可用</h2>
        <p className="mt-3 text-sm leading-7 text-[#d2c7b0]">{error || "请重新提交一次测算。"}</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-2xl bg-gradient-to-r from-[#f3d389] to-[#b67a26] px-5 py-3 text-sm font-medium text-[#23170b]"
        >
          返回首页重新测算
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="mystic-panel mystic-border rounded-[36px] p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-medium tracking-[0.24em] text-[#d0d0d0] uppercase">Mystic Reading</div>
            <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">{reading.profile.eightChar}</h1>
            <p className="mt-3 text-sm leading-7 text-[#d7d7d7]">
              {reading.profile.genderLabel}命 · {reading.profile.birthplace} · {reading.profile.solarText} · {reading.profile.lunarText}
            </p>
            <div className="mt-5 flex items-center gap-3 text-[#bbbbbb]">
              <div className="taiji-mark h-12 w-12 scale-75 origin-left" />
              <div className="bagua-strip h-2 w-40 rounded-full opacity-60" />
            </div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-xs leading-6 text-[#bdbdbd]">
            本次结果来源：{reading.source === "llm" ? "OpenRouter 自由生成" : reading.source === "hybrid-ai" ? "规则 + OpenRouter" : "本地兜底结果"}
            <br />
            结果有效期至：{new Date(reading.expiresAt).toLocaleString("zh-CN")}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-24 xl:self-start">
          <div className="mystic-panel mystic-border rounded-[32px] p-5">
            <div className="text-xs font-semibold tracking-[0.22em] text-[#d0d0d0] uppercase">Reading Map</div>
            <div className="mt-5 space-y-2">
              {sectionLinks.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-2xl border border-white/6 bg-white/4 px-4 py-3 text-sm text-[#ddd3c1] transition hover:bg-white/8 hover:text-white"
                >
                  <span className="mr-2 text-[#8f8f8f]">{String(index + 1).padStart(2, "0")}</span>
                  {section.title}
                </a>
              ))}
            </div>

            <div className="mt-6 space-y-2 text-sm text-[#bdbdbd]">
              <div className="rounded-2xl border border-white/6 bg-white/4 px-4 py-3">姓名：{reading.profile.name}</div>
              <div className="rounded-2xl border border-white/6 bg-white/4 px-4 py-3">性别：{reading.profile.genderLabel}</div>
              <div className="rounded-2xl border border-white/6 bg-white/4 px-4 py-3">历法：{reading.profile.calendarType === "solar" ? "公历" : "农历"}</div>
              <div className="rounded-2xl border border-white/6 bg-white/4 px-4 py-3">出生地：{reading.profile.birthplace}</div>
            </div>
          </div>
        </aside>

        <section className="grid gap-6">
          {reading.sections.map((section) => (
            <section id={section.id} key={section.id} className="mystic-panel mystic-border rounded-[32px] p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-white md:text-3xl">{section.title}</h2>
              <div className="mt-5 space-y-4 whitespace-pre-wrap text-[15px] leading-8 text-[#d7d7d7]">
                {section.content}
              </div>
            </section>
          ))}
        </section>
      </div>

      <section className="mystic-panel mystic-border rounded-[32px] p-6">
        <h2 className="text-xl font-semibold text-white">说明与边界</h2>
        <div className="mt-4 space-y-3 text-sm leading-7 text-[#bdbdbd]">
          {reading.disclaimer.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
