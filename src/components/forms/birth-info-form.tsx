"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const initialState = {
  name: "",
  gender: "male",
  calendarType: "solar",
  birthDate: "",
  birthTime: "",
  birthplace: "",
};

const fieldShellClassName =
  "rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_40px_rgba(0,0,0,0.24)]";
const inputClassName =
  "mt-4 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#666] focus:border-[#c7b188]/30 focus:bg-white/8";

function calendarHint(calendarType: "solar" | "lunar") {
  return calendarType === "solar"
    ? "请输入公历日期，格式示例：2000-01-01"
    : "请输入农历日期，格式示例：2000-01-01";
}

export function BirthInfoForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
          birthDate: form.birthDate.trim(),
          birthTime: form.birthTime.trim(),
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
    <form
      onSubmit={handleSubmit}
      className="mystic-panel mystic-border relative overflow-hidden w-full rounded-[38px] p-6 md:p-8"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(208,183,136,0.16),transparent_62%)]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-[0.32em] text-[#c9b48a] uppercase">
              Destiny Input
            </div>
            <h2 className="mt-3 text-[30px] font-semibold leading-tight text-white">
              直接输入出生信息
            </h2>
          </div>
          <div className="rounded-full border border-[#c7b188]/18 bg-[#c7b188]/8 px-3 py-1 text-[11px] tracking-[0.22em] text-[#ddc7a2] uppercase">
            Quiet Luxury
          </div>
        </div>

        <p className="mt-4 max-w-xl text-sm leading-7 text-[#beb8ae]">
          不再使用原生日期盘。出生日期与出生时间统一改为文本输入，按模板填写即可，风格和排版保持完全一致。
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <label className="space-y-2 md:col-span-1">
            <span className="text-sm font-medium text-[#e5e0d7]">姓名 / 称呼</span>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#686868] focus:border-[#c7b188]/30 focus:bg-white/8"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="可选，用于个性化展示"
            />
          </label>

          <div className="space-y-2 md:col-span-1">
            <span className="text-sm font-medium text-[#e5e0d7]">性别</span>
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
                      ? "bg-[#f1ede5] text-[#111]"
                      : "border border-white/10 bg-white/5 text-[#d3ccc2] hover:bg-white/8"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-[#e5e0d7]">历法类型</span>
            <div className="flex gap-3">
              {[
                { label: "公历", value: "solar" },
                { label: "农历", value: "lunar" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, calendarType: item.value }))}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    form.calendarType === item.value
                      ? "bg-[#f1ede5] text-[#111]"
                      : "border border-white/10 bg-white/5 text-[#d3ccc2] hover:bg-white/8"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <label className="space-y-2 md:col-span-1">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-[#e5e0d7]">出生日期</span>
              <span className="text-[11px] tracking-[0.24em] text-[#c8b28b] uppercase">
                YYYY-MM-DD
              </span>
            </div>
            <div className={fieldShellClassName}>
              <div className="flex items-center justify-between gap-3 text-[11px] tracking-[0.24em] text-[#a89f93] uppercase">
                <span>{form.calendarType === "solar" ? "Solar Template" : "Lunar Template"}</span>
                <span>2000-01-01</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={form.birthDate}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, birthDate: event.target.value }))
                }
                placeholder="示例：2000-01-01"
                className={inputClassName}
                required
              />
              <p className="mt-3 text-xs leading-6 text-[#a9a39a]">
                {calendarHint(form.calendarType)}
              </p>
            </div>
          </label>

          <label className="space-y-2 md:col-span-1">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-[#e5e0d7]">出生时间</span>
              <span className="text-[11px] tracking-[0.24em] text-[#c8b28b] uppercase">
                HH:mm
              </span>
            </div>
            <div className={fieldShellClassName}>
              <div className="flex items-center justify-between gap-3 text-[11px] tracking-[0.24em] text-[#a89f93] uppercase">
                <span>Beijing Time</span>
                <span>UTC+08:00</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={form.birthTime}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, birthTime: event.target.value }))
                }
                placeholder="示例：00:00"
                className={inputClassName}
                required
              />
              <p className="mt-3 text-xs leading-6 text-[#a9a39a]">
                以北京时间为准，按 24 小时制输入，例如 00:00、13:45。
              </p>
            </div>
          </label>

          <label className="block space-y-2 md:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-[#e5e0d7]">出生地</span>
              <span className="text-xs text-[#979088]">可留空</span>
            </div>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#686868] focus:border-[#c7b188]/30 focus:bg-white/8"
              value={form.birthplace}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, birthplace: event.target.value }))
              }
              placeholder="示例：湖南长沙，不填也可以"
            />
          </label>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full rounded-2xl border border-[#d7c29d]/20 bg-[linear-gradient(135deg,#f1ede5_0%,#d8cab2_100%)] px-5 py-4 text-sm font-semibold text-[#191612] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "正在排盘并生成结果..." : "开始测算"}
        </button>
      </div>
    </form>
  );
}
