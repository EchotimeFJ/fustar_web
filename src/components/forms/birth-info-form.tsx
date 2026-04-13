"use client";

import { useMemo, useState } from "react";
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

function padValue(value: number) {
  return String(value).padStart(2, "0");
}

function parseDateParts(date: string) {
  const [year = "2000", month = "01", day = "01"] = date.split("-");
  return {
    year: Number(year),
    month: Number(month),
    day: Number(day),
  };
}

function parseTimeParts(time: string) {
  const [hour = "00", minute = "00"] = time.split(":");
  return {
    hour: Number(hour),
    minute: Number(minute),
  };
}

function getDayCount(year: number, month: number, calendarType: "solar" | "lunar") {
  if (calendarType === "lunar") {
    return 30;
  }

  return new Date(year, month, 0).getDate();
}

const yearOptions = Array.from({ length: 91 }, (_, index) => 1940 + index);
const monthOptions = Array.from({ length: 12 }, (_, index) => index + 1);
const hourOptions = Array.from({ length: 24 }, (_, index) => index);
const minuteOptions = Array.from({ length: 60 }, (_, index) => index);
const quickTimes = ["00:00", "07:00", "12:00", "19:00", "23:00"];
const pickerPanelClassName =
  "mt-4 rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.28)]";
const pickerFieldClassName =
  "w-full appearance-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30 focus:bg-white/8";

export function BirthInfoForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activePicker, setActivePicker] = useState<"date" | "time" | null>(null);
  const dateParts = parseDateParts(form.birthDate);
  const timeParts = parseTimeParts(form.birthTime);
  const dayOptions = useMemo(
    () =>
      Array.from(
        { length: getDayCount(dateParts.year, dateParts.month, form.calendarType) },
        (_, index) => index + 1
      ),
    [dateParts.year, dateParts.month, form.calendarType]
  );

  function updateDatePart(part: "year" | "month" | "day", value: number) {
    const nextParts = {
      ...dateParts,
      [part]: value,
    };
    const maxDay = getDayCount(nextParts.year, nextParts.month, form.calendarType);
    nextParts.day = Math.min(nextParts.day, maxDay);
    setForm((prev) => ({
      ...prev,
      birthDate: `${nextParts.year}-${padValue(nextParts.month)}-${padValue(nextParts.day)}`,
    }));
  }

  function updateTimePart(part: "hour" | "minute", value: number) {
    const nextParts = {
      ...timeParts,
      [part]: value,
    };
    setForm((prev) => ({
      ...prev,
      birthTime: `${padValue(nextParts.hour)}:${padValue(nextParts.minute)}`,
    }));
  }

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
                onClick={() => {
                  setForm((prev) => ({ ...prev, calendarType: item.value }));
                  setActivePicker("date");
                }}
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
                onClick={() => setActivePicker((prev) => (prev === "date" ? null : "date"))}
                className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs text-[#d7d7d7] transition hover:bg-white/10"
              >
                {activePicker === "date" ? "收起日期盘" : "打开日期盘"}
              </button>
            </div>
            <div className="mt-4 text-xs leading-6 text-[#a9a9a9]">
              {form.calendarType === "solar"
                ? "使用自定义日期盘选择年月日，视觉和交互与时间选择器保持一致。"
                : "农历同样使用统一日期盘，当前不提供闰月快捷选择。"}
            </div>
            {activePicker === "date" ? (
              <div className={pickerPanelClassName}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold tracking-[0.24em] text-[#cbc0a7] uppercase">
                      {form.calendarType === "solar" ? "Date Picker" : "Lunar Picker"}
                    </div>
                    <div className="mt-2 text-sm text-[#dad1bf]">
                      {form.calendarType === "solar" ? "高精度年月日选择" : "统一风格农历年月日输入"}
                    </div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-[#d7d7d7]">
                    {formatSolarDate(form.birthDate)}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="space-y-2">
                    <span className="text-xs font-medium text-[#b7b7b7]">年份</span>
                    <select
                      className={pickerFieldClassName}
                      value={dateParts.year}
                      onChange={(event) => updateDatePart("year", Number(event.target.value))}
                    >
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year} 年
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs font-medium text-[#b7b7b7]">月份</span>
                    <select
                      className={pickerFieldClassName}
                      value={dateParts.month}
                      onChange={(event) => updateDatePart("month", Number(event.target.value))}
                    >
                      {monthOptions.map((month) => (
                        <option key={month} value={month}>
                          {padValue(month)} 月
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs font-medium text-[#b7b7b7]">日期</span>
                    <select
                      className={pickerFieldClassName}
                      value={dateParts.day}
                      onChange={(event) => updateDatePart("day", Number(event.target.value))}
                    >
                      {dayOptions.map((day) => (
                        <option key={day} value={day}>
                          {padValue(day)} 日
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {["2000-01-01", "1995-06-18", "1990-12-31"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, birthDate: preset }))}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-[#d8d8d8] transition hover:bg-white/10"
                    >
                      {formatSolarDate(preset)}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
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
                onClick={() => setActivePicker((prev) => (prev === "time" ? null : "time"))}
                className="rounded-full border border-[#f3d389]/20 bg-[#f3d389]/10 px-3 py-1 text-xs text-[#f5ddb1] transition hover:bg-[#f3d389]/16"
              >
                {activePicker === "time" ? "收起时刻盘" : "打开时刻盘"}
              </button>
            </div>
            <p className="mt-3 text-xs leading-6 text-[#c9b48b]">
              以北京时间为准，默认使用 24 小时制。
            </p>
            {activePicker === "time" ? (
              <div className={pickerPanelClassName}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold tracking-[0.24em] text-[#f1d9ac] uppercase">
                      Time Picker
                    </div>
                    <div className="mt-2 text-sm text-[#e6d0a6]">
                      北京时间，支持精确到分钟。
                    </div>
                  </div>
                  <div className="rounded-full border border-[#f3d389]/20 bg-[#f3d389]/10 px-3 py-1 text-xs text-[#f5ddb1]">
                    UTC+08:00
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-xs font-medium text-[#d7c49a]">小时</span>
                    <select
                      className={pickerFieldClassName}
                      value={timeParts.hour}
                      onChange={(event) => updateTimePart("hour", Number(event.target.value))}
                    >
                      {hourOptions.map((hour) => (
                        <option key={hour} value={hour}>
                          {padValue(hour)} 时
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs font-medium text-[#d7c49a]">分钟</span>
                    <select
                      className={pickerFieldClassName}
                      value={timeParts.minute}
                      onChange={(event) => updateTimePart("minute", Number(event.target.value))}
                    >
                      {minuteOptions.map((minute) => (
                        <option key={minute} value={minute}>
                          {padValue(minute)} 分
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {quickTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, birthTime: time }))}
                      className="rounded-full border border-[#f3d389]/16 bg-[#f3d389]/8 px-3 py-2 text-xs text-[#f3ddb6] transition hover:bg-[#f3d389]/14"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
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
