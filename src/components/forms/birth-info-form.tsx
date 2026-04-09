"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FOCUS_OPTIONS, REGION_OPTIONS } from "@/lib/form-options";

const initialState = {
  name: "",
  gender: "female",
  calendarType: "solar",
  birthDate: "2001-01-31",
  birthTime: "15:00",
  province: "广西",
  city: "桂林",
  customFocusInput: "",
};

export function BirthInfoForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFocuses, setSelectedFocuses] = useState<string[]>([
    "事业发展",
    "财运收入",
    "婚姻感情",
  ]);

  const cityOptions = useMemo(
    () => REGION_OPTIONS[form.province] ?? [],
    [form.province]
  );

  const focusCount = useMemo(
    () =>
      [
        ...selectedFocuses,
        ...form.customFocusInput
        .split(/[，,]/)
        .map((item) => item.trim())
        .filter(Boolean),
      ].filter(Boolean).length,
    [form.customFocusInput, selectedFocuses]
  );

  function toggleFocus(item: string) {
    setSelectedFocuses((prev) =>
      prev.includes(item) ? prev.filter((focus) => focus !== item) : [...prev, item]
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const focusAreas = [...selectedFocuses]
        .concat(
          form.customFocusInput
        .split(/[，,]/)
        .map((item) => item.trim())
        .filter(Boolean)
        )
        .filter((item, index, array) => array.indexOf(item) === index)
        .slice(0, 6);

      const response = await fetch("/api/reading/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name || undefined,
          gender: form.gender,
          calendarType: form.calendarType,
          birthDate: form.birthDate,
          birthTime: form.birthTime,
          birthplace: `${form.province}${form.city}`,
          focusAreas: focusAreas.length ? focusAreas : undefined,
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
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">姓名 / 称呼</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="可选，用于个性化展示"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">出生地</span>
          <div className="grid grid-cols-2 gap-3">
            <select
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400"
              value={form.province}
              onChange={(event) => {
                const province = event.target.value;
                const nextCity = REGION_OPTIONS[province]?.[0] ?? "";
                setForm((prev) => ({ ...prev, province, city: nextCity }));
              }}
            >
              {Object.keys(REGION_OPTIONS).map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400"
              value={form.city}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, city: event.target.value }))
              }
            >
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-slate-500">使用省市两级选择，移动端会显示原生滚动选择器。</p>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">出生日期</span>
          <input
            type="date"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400"
            value={form.birthDate}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, birthDate: event.target.value }))
            }
            required
          />
        </label>

        <label className="space-y-2">
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
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <span className="text-sm font-medium text-slate-700">性别</span>
          <div className="flex gap-3">
            {[
              { label: "女", value: "female" },
              { label: "男", value: "male" },
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

        <div className="space-y-2">
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
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">重点关注问题</span>
        <div className="flex flex-wrap gap-2">
          {FOCUS_OPTIONS.map((item) => {
            const active = selectedFocuses.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleFocus(item)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-violet-600 text-white shadow-sm"
                    : "bg-violet-50 text-violet-700 hover:bg-violet-100"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400"
          value={form.customFocusInput}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, customFocusInput: event.target.value }))
          }
          placeholder="也可以自己补充，用逗号分隔，例如：适合城市, 结婚时间"
        />
        <p className="text-xs text-slate-500">当前将传入 {focusCount} 个关注主题，最多 6 个。</p>
      </label>

      <div className="rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-600">
        系统只会在短时缓存中保留本次测算结果，页面刷新或过期后需要重新生成。
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
