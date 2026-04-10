"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const initialState = {
  name: "",
  gender: "male",
  calendarType: "solar",
  birthDate: "2001-01-31",
  birthTime: "15:00",
  birthplace: "",
};

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
          birthDate: form.birthDate,
          birthTime: form.birthTime,
          birthplace: form.birthplace,
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
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[32px] border border-white/10 bg-white/80 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 md:col-span-1">
          <span className="text-sm font-medium text-slate-700">姓名 / 称呼</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="可选，用于个性化展示"
          />
        </label>

        <div className="space-y-2 md:col-span-1">
          <span className="text-sm font-medium text-slate-700">性别</span>
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
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">历法类型</span>
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
                    ? "bg-violet-600 text-white"
                    : "bg-violet-50 text-violet-700 hover:bg-violet-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <label className="space-y-2 md:col-span-1">
          <span className="text-sm font-medium text-slate-700">出生日期</span>
          <input
            type={form.calendarType === "solar" ? "date" : "text"}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400"
            value={form.birthDate}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, birthDate: event.target.value }))
            }
            placeholder={
              form.calendarType === "solar"
                ? undefined
                : "例如：2001-01-08（农历年月日）"
            }
            required
          />
          <p className="text-xs text-slate-500">
            {form.calendarType === "solar"
              ? "公历直接选择日期。"
              : "农历请按 YYYY-MM-DD 输入农历年月日，例如 2001-01-08。"}
          </p>
        </label>

        <label className="space-y-2 md:col-span-1">
          <span className="text-sm font-medium text-slate-700">出生时间</span>
          <input
            type="time"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400"
            value={form.birthTime}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, birthTime: event.target.value }))
            }
            required
          />
        </label>

        <label className="block space-y-2 md:col-span-2">
        <span className="text-sm font-medium text-slate-700">出生地</span>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400"
          value={form.birthplace}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, birthplace: event.target.value }))
          }
          placeholder="例如：湖南长沙"
          required
        />
        </label>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-600">
        系统只做输入标准化和一级标题切分展示；具体分析内容由大模型自由生成。当前结果只在短时缓存中保留。
      </div>

      {error ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {loading ? "正在排盘并生成结果..." : "开始测算"}
      </button>
    </form>
  );
}
