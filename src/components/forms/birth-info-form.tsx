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

        <label className="space-y-2 md:col-span-1">
          <span className="text-sm font-medium text-[#e5e5e5]">出生日期</span>
          <input
            type={form.calendarType === "solar" ? "date" : "text"}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#7b7b7b] focus:border-white/30 focus:bg-white/8"
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
        </label>

        <label className="space-y-2 md:col-span-1">
          <span className="text-sm font-medium text-[#e5e5e5]">出生时间</span>
          <input
            type="time"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30 focus:bg-white/8"
            value={form.birthTime}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, birthTime: event.target.value }))
            }
            required
          />
        </label>

        <label className="block space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-[#e5e5e5]">出生地</span>
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#7b7b7b] focus:border-white/30 focus:bg-white/8"
            value={form.birthplace}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, birthplace: event.target.value }))
            }
            placeholder="例如：湖南长沙"
            required
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
