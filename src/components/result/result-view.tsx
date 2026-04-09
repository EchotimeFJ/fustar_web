"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ReadingResult } from "@/types/reading";
import { SummaryCard } from "./summary-card";
import { PillarCard } from "./pillar-card";
import { FullModuleCard } from "./full-module-card";

export function ResultView({ sessionId }: { sessionId: string }) {
  const [reading, setReading] = useState<ReadingResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-500" />
        <p className="mt-4 text-sm text-slate-600">正在读取命盘与模块化结果...</p>
      </div>
    );
  }

  if (error || !reading) {
    return (
      <div className="rounded-[32px] border border-rose-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">结果暂时不可用</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">{error || "请重新提交一次测算。"}</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
        >
          返回首页重新测算
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-medium text-violet-600">{reading.profile.name} 的完整测算</div>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">{reading.profile.eightChar}</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {reading.profile.genderLabel}命 · {reading.profile.birthplace} · {reading.profile.solarText} · {reading.profile.lunarText}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-500">
            本次结果来源：{reading.source === "hybrid-ai" ? "规则 + OpenRouter" : "规则引擎"}
            <br />
            结果有效期至：{new Date(reading.expiresAt).toLocaleString("zh-CN")}
          </div>
        </div>
      </section>

      <SummaryCard preview={reading.preview} />

      <section className="grid gap-4 md:grid-cols-4">
        {reading.profile.pillars.map((pillar) => (
          <PillarCard key={pillar.label} pillar={pillar} />
        ))}
      </section>

      <section className="grid gap-6">
        {reading.modules.map((module) => (
          <FullModuleCard key={module.key} module={module} />
        ))}
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">说明与边界</h2>
        <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
          {reading.disclaimer.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
