"use client";

import { toBlob } from "html-to-image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { BaguaMark } from "@/components/ui/bagua-mark";
import { TaijiMark } from "@/components/ui/taiji-mark";
import type { ReadingProfile, ReadingResult } from "@/types/reading";

type ExportMode = "full" | "private";
type ExportAction = "download-full" | "download-private" | "share-full" | "share-private" | null;

function renderInlineMarkdown(text: string) {
  const segments = text.split(/(\*\*[^*]+\*\*)/g);

  return segments.map((segment, index) => {
    if (segment.startsWith("**") && segment.endsWith("**") && segment.length > 4) {
      return (
        <strong key={`${segment}-${index}`} className="font-semibold text-white">
          {segment.slice(2, -2)}
        </strong>
      );
    }

    return <span key={`${segment}-${index}`}>{segment}</span>;
  });
}

function renderSectionContent(content: string) {
  return content.split("\n").map((line, index) => (
    <p key={`${line}-${index}`}>{renderInlineMarkdown(line)}</p>
  ));
}

function maskDateText(value: string) {
  return value.replace(/\d/g, "*");
}

function getExportProfile(profile: ReadingProfile, mode: ExportMode) {
  if (mode === "full") {
    return {
      title: profile.eightChar,
      name: profile.name,
      gender: profile.genderLabel,
      birthplace: profile.birthplace || "未填写",
      solarText: profile.solarText,
      lunarText: profile.lunarText,
      privacyNote: "完整信息版",
    };
  }

  return {
    title: "命理解读",
    name: "***",
    gender: profile.genderLabel,
    birthplace: profile.birthplace ? "***" : "未填写",
    solarText: maskDateText(profile.solarText),
    lunarText: maskDateText(profile.lunarText),
    privacyNote: "隐私处理版",
  };
}

function exportButtonLabel(action: ExportAction) {
  switch (action) {
    case "download-full":
      return "正在生成完整长图...";
    case "download-private":
      return "正在生成隐私长图...";
    case "share-full":
      return "正在准备完整分享...";
    case "share-private":
      return "正在准备隐私分享...";
    default:
      return null;
  }
}

export function ResultView({ sessionId }: { sessionId: string }) {
  const [reading, setReading] = useState<ReadingResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [exportMode, setExportMode] = useState<ExportMode>("full");
  const [exporting, setExporting] = useState<ExportAction>(null);
  const sectionLinks = useMemo(
    () => reading?.sections.map((section) => ({ id: section.id, title: section.title })) ?? [],
    [reading]
  );
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const exportCardRef = useRef<HTMLDivElement | null>(null);
  const releasedRef = useRef(false);

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

  useEffect(() => {
    const releaseSession = () => {
      if (releasedRef.current) {
        return;
      }

      releasedRef.current = true;
      const url = `/api/reading/release/${sessionId}`;

      if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        navigator.sendBeacon(url, new Blob([], { type: "application/json" }));
        return;
      }

      void fetch(url, {
        method: "POST",
        keepalive: true,
      });
    };

    window.addEventListener("pagehide", releaseSession);
    window.addEventListener("beforeunload", releaseSession);

    return () => {
      window.removeEventListener("pagehide", releaseSession);
      window.removeEventListener("beforeunload", releaseSession);
    };
  }, [sessionId]);

  async function waitForExportLayout(mode: ExportMode) {
    setExportMode(mode);
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });

    if ("fonts" in document) {
      await document.fonts.ready;
    }
  }

  async function createExportBlob(mode: ExportMode) {
    await waitForExportLayout(mode);

    const node = exportCardRef.current;
    if (!node) {
      throw new Error("导出容器不可用，请刷新后重试。");
    }

    const blob = await toBlob(node, {
      cacheBust: true,
      pixelRatio: 1,
      backgroundColor: "#090909",
    });

    if (!blob) {
      throw new Error("图片生成失败，请稍后重试。");
    }

    return blob;
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function shareBlob(blob: Blob, filename: string) {
    if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
      return false;
    }

    const file = new File([blob], filename, { type: blob.type || "image/png" });
    if (typeof navigator.canShare === "function" && !navigator.canShare({ files: [file] })) {
      return false;
    }

    await navigator.share({
      title: "福星 AI 命理解读",
      text: "命理解读图片",
      files: [file],
    });
    return true;
  }

  async function handleExport(mode: ExportMode, share = false) {
    const action: ExportAction = share
      ? mode === "full"
        ? "share-full"
        : "share-private"
      : mode === "full"
        ? "download-full"
        : "download-private";

    try {
      setExporting(action);
      setError("");
      const blob = await createExportBlob(mode);
      const filename = mode === "full" ? "fustar-reading-full.png" : "fustar-reading-private.png";

      if (share) {
        const shared = await shareBlob(blob, filename);
        if (!shared) {
          downloadBlob(blob, filename);
          setError("当前设备不支持系统分享，已自动下载图片。");
        }
      } else {
        downloadBlob(blob, filename);
      }
    } catch (exportError) {
      if (exportError instanceof Error && exportError.name === "AbortError") {
        return;
      }

      setError(exportError instanceof Error ? exportError.message : "导出失败，请稍后重试。");
    } finally {
      setExporting(null);
    }
  }

  function toggleSection(sectionId: string) {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  }

  function openSection(sectionId: string) {
    setExpandedSections((prev) => (prev.includes(sectionId) ? prev : [...prev, sectionId]));

    requestAnimationFrame(() => {
      sectionRefs.current[sectionId]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function expandAllSections() {
    setExpandedSections(sectionLinks.map((section) => section.id));
  }

  function collapseAllSections() {
    setExpandedSections([]);
  }

  if (loading) {
    return (
      <div className="mystic-panel mystic-border rounded-[36px] p-12 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/15 border-t-[#e9cb87]" />
        <p className="mt-4 text-sm text-[#d2c7b0]">正在生成专属命理解读...</p>
      </div>
    );
  }

  if (error || !reading) {
    return (
      <div className="mystic-panel mystic-border rounded-[36px] p-10 text-center">
        <h2 className="text-xl font-semibold text-white">结果暂时不可用</h2>
        <p className="mt-3 text-sm leading-7 text-[#d2c7b0]">{error || "请稍后重新提交测算。"}</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-2xl bg-gradient-to-r from-[#f3d389] to-[#b67a26] px-5 py-3 text-sm font-medium text-[#23170b]"
        >
          返回首页重新测算
        </Link>
      </div>
    );
  }

  const exportProfile = getExportProfile(reading.profile, exportMode);

  return (
    <div className="space-y-8">
      <section className="mystic-panel mystic-border rounded-[36px] p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-medium tracking-[0.24em] text-[#d0d0d0] uppercase">Personal Reading</div>
            <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">{reading.profile.eightChar}</h1>
            <p className="mt-3 text-sm leading-7 text-[#d7d7d7]">
              {reading.profile.genderLabel}命 · {reading.profile.birthplace || "未填写"} · {reading.profile.solarText} · {reading.profile.lunarText}
            </p>
            <div className="mt-5 flex items-center gap-3 text-[#bbbbbb]">
              <TaijiMark className="h-12 w-12 scale-75 origin-left" />
              <BaguaMark compact className="opacity-55" />
            </div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-xs leading-6 text-[#bdbdbd]">
            解读已生成
            <br />
            有效期至：{new Date(reading.expiresAt).toLocaleString("zh-CN")}
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-[28px] border border-amber-300/20 bg-amber-500/10 px-5 py-4 text-sm leading-7 text-amber-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-24 xl:self-start">
          <div className="space-y-6">
            <div className="mystic-panel mystic-border rounded-[32px] p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-semibold tracking-[0.22em] text-[#d0d0d0] uppercase">章节导航</div>
                <button
                  type="button"
                  onClick={expandedSections.length ? collapseAllSections : expandAllSections}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-[#c7b188] transition hover:bg-white/8 hover:text-white"
                >
                  {expandedSections.length ? "全部收起" : "全部展开"}
                </button>
              </div>
            <div className="mt-5 space-y-2">
              {sectionLinks.map((section, index) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => openSection(section.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/6 bg-white/4 px-4 py-3 text-left text-sm text-[#ddd3c1] transition hover:bg-white/8 hover:text-white"
                >
                  <span className="min-w-0 flex-1">
                    <span className="mr-2 text-[#8f8f8f]">{String(index + 1).padStart(2, "0")}</span>
                    {section.title}
                  </span>
                  <span className="text-xs text-[#8f8f8f]">{expandedSections.includes(section.id) ? "展开中" : "打开"}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-2 text-sm text-[#bdbdbd]">
              <div className="rounded-2xl border border-white/6 bg-white/4 px-4 py-3">姓名：{reading.profile.name}</div>
              <div className="rounded-2xl border border-white/6 bg-white/4 px-4 py-3">性别：{reading.profile.genderLabel}</div>
              <div className="rounded-2xl border border-white/6 bg-white/4 px-4 py-3">历法：{reading.profile.calendarType === "solar" ? "公历" : "农历"}</div>
              <div className="rounded-2xl border border-white/6 bg-white/4 px-4 py-3">出生地：{reading.profile.birthplace || "未填写"}</div>
            </div>
            </div>

            <div className="mystic-panel mystic-border rounded-[32px] p-5">
              <div className="text-xs font-semibold tracking-[0.22em] text-[#d0d0d0] uppercase">导出与分享</div>
              <p className="mt-3 text-sm leading-7 text-[#bdbdbd]">
                支持导出完整长图，也支持将姓名、出生地与日期信息处理为隐私版后再分享。
              </p>
              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  onClick={() => handleExport("full")}
                  disabled={Boolean(exporting)}
                  className="rounded-2xl border border-[#d7c29d]/18 bg-[linear-gradient(135deg,rgba(241,237,229,0.18),rgba(216,202,178,0.08))] px-4 py-3 text-sm font-medium text-[#f3ece1] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {exporting === "download-full" ? "正在生成完整长图..." : "导出完整长图"}
                </button>
                <button
                  type="button"
                  onClick={() => handleExport("private")}
                  disabled={Boolean(exporting)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-[#ddd3c1] transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {exporting === "download-private" ? "正在生成隐私长图..." : "导出隐私长图"}
                </button>
                <button
                  type="button"
                  onClick={() => handleExport("full", true)}
                  disabled={Boolean(exporting)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-[#ddd3c1] transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {exporting === "share-full" ? "正在准备完整分享..." : "分享完整长图"}
                </button>
                <button
                  type="button"
                  onClick={() => handleExport("private", true)}
                  disabled={Boolean(exporting)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-[#ddd3c1] transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {exporting === "share-private" ? "正在准备隐私分享..." : "分享隐私长图"}
                </button>
              </div>
              <p className="mt-3 text-xs leading-6 text-[#8f8f8f]">
                {exportButtonLabel(exporting) || "若当前设备不支持系统分享，会自动改为下载图片。"}
              </p>
            </div>
          </div>
        </aside>

        <section className="grid gap-6">
          {reading.sections.map((section) => (
            <section
              id={section.id}
              key={section.id}
              ref={(node) => {
                sectionRefs.current[section.id] = node;
              }}
              className="mystic-panel mystic-border rounded-[32px] p-6 md:p-8"
            >
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <h2 className="text-2xl font-semibold text-white md:text-3xl">{section.title}</h2>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#c7b188]">
                  {expandedSections.includes(section.id) ? "收起" : "展开"}
                </span>
              </button>
              {expandedSections.includes(section.id) ? (
                <div className="mt-5 space-y-4 whitespace-pre-wrap text-[15px] leading-8 text-[#d7d7d7]">
                  {renderSectionContent(section.content)}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-7 text-[#8f8f8f]">
                  点击标题展开查看详细解读内容。
                </p>
              )}
            </section>
          ))}
        </section>
      </div>

      <section className="mystic-panel mystic-border rounded-[32px] p-6">
        <h2 className="text-xl font-semibold text-white">使用说明</h2>
        <div className="mt-4 space-y-3 text-sm leading-7 text-[#bdbdbd]">
          {reading.disclaimer.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>

      <div className="pointer-events-none fixed left-[-99999px] top-0 z-[-1] opacity-100">
        <div ref={exportCardRef} className="w-[1080px] bg-[#090909] p-10 text-white">
          <div className="rounded-[36px] border border-white/8 bg-[linear-gradient(180deg,rgba(19,19,19,0.96),rgba(10,10,10,0.99))] p-8 shadow-[0_28px_90px_rgba(0,0,0,0.35)]">
            <div className="flex items-start justify-between gap-8">
              <div className="flex items-start gap-5">
                <TaijiMark />
                <div>
                  <div className="text-xs font-semibold tracking-[0.34em] text-[#d7c29d] uppercase">Fuxing · Export Reading</div>
                  <h2 className="quiet-lux-display mt-4 text-5xl leading-[1.05] text-white">
                    福星 <span className="mystic-gold">AI 命理</span>
                  </h2>
                  <BaguaMark className="mt-5 opacity-60" />
                </div>
              </div>
              <div className="rounded-[24px] border border-white/8 bg-white/4 px-5 py-4 text-right text-sm leading-7 text-[#d1cbc0]">
                {exportProfile.privacyNote}
              </div>
            </div>

            <div className="mt-8 rounded-[28px] border border-white/8 bg-white/4 p-6">
              <div className="text-xs font-semibold tracking-[0.24em] text-[#c7b188] uppercase">Core Profile</div>
              <h3 className="mt-4 text-3xl font-semibold text-white">{exportProfile.title}</h3>
              <div className="mt-4 grid gap-3 text-sm text-[#d7d7d7] md:grid-cols-2">
                <div className="rounded-2xl border border-white/6 bg-black/20 px-4 py-3">姓名：{exportProfile.name}</div>
                <div className="rounded-2xl border border-white/6 bg-black/20 px-4 py-3">性别：{exportProfile.gender}</div>
                <div className="rounded-2xl border border-white/6 bg-black/20 px-4 py-3">出生地：{exportProfile.birthplace}</div>
                <div className="rounded-2xl border border-white/6 bg-black/20 px-4 py-3">公历：{exportProfile.solarText}</div>
                <div className="rounded-2xl border border-white/6 bg-black/20 px-4 py-3 md:col-span-2">农历：{exportProfile.lunarText}</div>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              {reading.sections.map((section) => (
                <section key={`export-${section.id}`} className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6">
                  <h3 className="text-2xl font-semibold text-white">{section.title}</h3>
                  <div className="mt-4 space-y-4 whitespace-pre-wrap text-[15px] leading-8 text-[#d7d7d7]">
                    {renderSectionContent(section.content)}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
