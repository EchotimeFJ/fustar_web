"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const initialState = {
  name: "",
  gender: "male",
  calendarType: "solar",
  birthDate: "2000-01-01",
  birthTime: "00:00",
  birthplace: "",
};

function formatSolarDate(date: string) {
  if (!date) {
    return "请选择日期";
  }

  return date.replaceAll("-", ".");
}

function formatTimeLabel(time: string) {
  return time || "请选择时间";
}

export function BirthInfoForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/reading/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name || undefined,
          gender: form.gender,
          calendarType: form.calendarType,
          birthDate: form.birthDate,
          birthTime: form.birthTime,
          birthplace: form.birthplace.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "提交失败，请稍后重试");
      }

      router.push(`/result/${data.sessionId}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "提交失败，请稍后重试"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mystic-panel mystic-border w-full space-y-6 rounded-[36px] p-6 md:p-8">
      <div>
        <div className="text-xs font-semibold tracking-[0.28em] text-[#cbcbcb] uppercase">
          Destiny Input
        </div>
        <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">开始一轮完整测算</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 md:col-span-1">
          <span className="text-sm font-medium text-[#e5e5e5]">姓名 / 称呼</span>
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#7b7b7b] focus:border-white/30 focus:bg-white/8"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="可选，用于个性化展示"
          />
        </label>

        <div className="space-y-2 md:col-span-1">
          <span className="text-sm font-medium text-[#e5e5e5]">性别</span>
          <div className="flex gap-3">
            {[
              { label: "男", value: "male" },
              { label: "女", value: "female" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, gender: item.value }))}
                className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  form.gender === item.value
                    ? "bg-white text-black"
                    : "border border-white/10 bg-white/5 text-[#d8d8d8] hover:bg-white/8"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-[#e5e5e5]">历法类型</span>
          <div className="flex gap-3">
            {[
              { label: "公历", value: "solar" },
              { label: "农历", value: "lunar" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, calendarType: item.value }))
                }
                className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  form.calendarType === item.value
                    ? "bg-white text-black"
                    : "border border-white/10 bg-white/5 text-[#d8d8d8] hover:bg-white/8"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 md:col-span-1">
          <span className="text-sm font-medium text-[#e5e5e5]">出生日期</span>
          <div className="group w-full rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.28)] transition hover:border-white/20 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.05))]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.28em] text-[#a9a9a9] uppercase">
                  {form.calendarType === "solar" ? "Solar Date" : "Lunar Date"}
                </div>
                <div className="mt-3 text-2xl font-semibold tracking-[0.08em] text-white">
                  {form.calendarType === "solar"
                    ? formatSolarDate(form.birthDate)
                    : form.birthDate || "请输入农历日期"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (form.calendarType === "solar") {
                    dateInputRef.current?.showPicker?.();
                    dateInputRef.current?.focus();
                  }
                }}
                className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs text-[#d7d7d7] transition hover:bg-white/10"
              >
                {form.calendarType === "solar" ? "打开日期盘" : "手动输入"}
              </button>
            </div>
            <div className="mt-4">
              <input
                ref={dateInputRef}
                type={form.calendarType === "solar" ? "date" : "text"}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#7b7b7b] focus:border-white/30 focus:bg-white/8"
                value={form.birthDate}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, birthDate: event.target.value }))
                }
                placeholder={
                  form.calendarType === "solar"
                    ? undefined
                    : "例如：2000-01-01（农历年月日）"
                }
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2 md:col-span-1">
          <span className="text-sm font-medium text-[#e5e5e5]">出生时间</span>
          <div className="group w-full rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,220,150,0.12),rgba(255,255,255,0.03))] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition hover:border-[#f3d389]/30 hover:bg-[linear-gradient(180deg,rgba(255,220,150,0.18),rgba(255,255,255,0.05))]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.28em] text-[#d7c49a] uppercase">
                  Beijing Time
                </div>
                <div className="mt-3 text-3xl font-semibold tracking-[0.16em] text-white">
                  {formatTimeLabel(form.birthTime)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  timeInputRef.current?.showPicker?.();
                  timeInputRef.current?.focus();
                }}
                className="rounded-full border border-[#f3d389]/20 bg-[#f3d389]/10 px-3 py-1 text-xs text-[#f5ddb1] transition hover:bg-[#f3d389]/16"
              >
                UTC+08:00
              </button>
            </div>
            <p className="mt-3 text-xs leading-6 text-[#c9b48b]">
              以北京时间为准，默认使用 24 小时制。
            </p>
            <div className="mt-4">
              <input
                ref={timeInputRef}
                type="time"
                step="60"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30 focus:bg-white/8"
                value={form.birthTime}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, birthTime: event.target.value }))
                }
                required
              />
            </div>
          </div>
        </div>

        <label className="block space-y-2 md:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-[#e5e5e5]">出生地</span>
            <span className="text-xs text-[#9f9f9f]">可留空</span>
          </div>
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#7b7b7b] focus:border-white/30 focus:bg-white/8"
            value={form.birthplace}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, birthplace: event.target.value }))
            }
            placeholder="例如：湖南长沙，不填也可以"
          />
        </label>
      </div>

      {error ? <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl border border-white/12 bg-white px-5 py-4 text-sm font-semibold text-black transition hover:bg-[#ededed] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "正在排盘并生成结果..." : "开始测算"}
      </button>
    </form>
  );
}
