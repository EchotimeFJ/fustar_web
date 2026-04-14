"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { WheelPickerSheet, type WheelOption } from "@/components/forms/wheel-picker-sheet";
import { REGION_OPTIONS } from "@/lib/region-options";

type PickerType = "date" | "time" | "place" | null;
type CalendarType = "solar" | "lunar";
type DraftDate = {
  year: string;
  month: string;
  day: string;
};
type DraftTime = {
  hour: string;
  minute: string;
};
type DraftPlace = {
  province: string;
  city: string;
};
type FormState = {
  name: string;
  gender: "male" | "female";
  calendarType: CalendarType;
  birthDate: string;
  birthTime: string;
  birthplace: string;
};

const initialState: FormState = {
  name: "",
  gender: "male",
  calendarType: "solar",
  birthDate: "2000-01-01",
  birthTime: "00:00",
  birthplace: "",
};

const selectionTriggerClassName =
  "group w-full rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_40px_rgba(0,0,0,0.24)] transition hover:border-[#d7c29d]/18 hover:bg-white/[0.07]";
const genderOptions = [
  { label: "男", value: "male" },
  { label: "女", value: "female" },
] as const;
const calendarOptions = [
  { label: "公历", value: "solar" },
  { label: "农历", value: "lunar" },
] as const;

function pad(value: number | string) {
  return String(value).padStart(2, "0");
}

function getSolarDayCount(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function getDayCount(year: number, month: number, calendarType: CalendarType) {
  return calendarType === "solar" ? getSolarDayCount(year, month) : 30;
}

function parseBirthDate(value: string): DraftDate {
  const [rawYear = "2000", rawMonth = "01", rawDay = "01"] = value.split("-");
  return {
    year: rawYear,
    month: pad(rawMonth),
    day: pad(rawDay),
  };
}

function parseBirthTime(value: string): DraftTime {
  const [rawHour = "00", rawMinute = "00"] = value.split(":");
  return {
    hour: pad(rawHour),
    minute: pad(rawMinute),
  };
}

function formatBirthDate(date: DraftDate) {
  return `${date.year}-${date.month}-${date.day}`;
}

function formatBirthDateDisplay(value: string) {
  return value.replaceAll("-", ".");
}

function formatBirthTime(time: DraftTime) {
  return `${time.hour}:${time.minute}`;
}

function formatBirthplace(province: string, city: string) {
  if (province === "暂不填写") {
    return "";
  }

  if (!city || city === "暂不填写" || province === city) {
    return province;
  }

  return `${province}${city}`;
}

function inferPlaceDraft(value: string): DraftPlace {
  if (!value) {
    return { province: "暂不填写", city: "暂不填写" };
  }

  for (const region of REGION_OPTIONS) {
    for (const city of region.cities) {
      if (formatBirthplace(region.province, city) === value) {
        return {
          province: region.province,
          city,
        };
      }
    }
  }

  return { province: "海外/其他", city: "其他地区" };
}

function clampDateDraft(date: DraftDate, calendarType: CalendarType): DraftDate {
  const year = Number(date.year);
  const month = Number(date.month);
  const maxDay = getDayCount(year, month, calendarType);
  const nextDay = Math.min(Number(date.day), maxDay);

  return {
    year: date.year,
    month: pad(month),
    day: pad(nextDay),
  };
}

export function BirthInfoForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activePicker, setActivePicker] = useState<PickerType>(null);
  const [dateDraft, setDateDraft] = useState<DraftDate>(() => parseBirthDate(initialState.birthDate));
  const [timeDraft, setTimeDraft] = useState<DraftTime>(() => parseBirthTime(initialState.birthTime));
  const [placeDraft, setPlaceDraft] = useState<DraftPlace>(() => inferPlaceDraft(initialState.birthplace));

  const yearOptions = useMemo<WheelOption[]>(
    () =>
      Array.from({ length: 131 }, (_, index) => {
        const year = 1930 + index;
        return { label: `${year}年`, value: String(year) };
      }),
    []
  );

  const monthOptions = useMemo<WheelOption[]>(
    () =>
      Array.from({ length: 12 }, (_, index) => {
        const month = index + 1;
        return { label: `${pad(month)}月`, value: pad(month) };
      }),
    []
  );

  const hourOptions = useMemo<WheelOption[]>(
    () =>
      Array.from({ length: 24 }, (_, index) => ({
        label: `${pad(index)}时`,
        value: pad(index),
      })),
    []
  );

  const minuteOptions = useMemo<WheelOption[]>(
    () =>
      Array.from({ length: 60 }, (_, index) => ({
        label: `${pad(index)}分`,
        value: pad(index),
      })),
    []
  );

  const provinceOptions = useMemo<WheelOption[]>(
    () => REGION_OPTIONS.map((region) => ({ label: region.province, value: region.province })),
    []
  );

  const cityOptions = useMemo<WheelOption[]>(
    () =>
      (REGION_OPTIONS.find((region) => region.province === placeDraft.province)?.cities ?? ["暂不填写"]).map(
        (city) => ({ label: city, value: city })
      ),
    [placeDraft.province]
  );

  const dayOptions = useMemo<WheelOption[]>(() => {
    const maxDay = getDayCount(Number(dateDraft.year), Number(dateDraft.month), form.calendarType);
    return Array.from({ length: maxDay }, (_, index) => {
      const day = index + 1;
      return { label: `${pad(day)}日`, value: pad(day) };
    });
  }, [dateDraft.month, dateDraft.year, form.calendarType]);

  useEffect(() => {
    setDateDraft((prev) => {
      const next = clampDateDraft(prev, form.calendarType);
      if (next.day === prev.day && next.month === prev.month && next.year === prev.year) {
        return prev;
      }
      return next;
    });

    setForm((prev) => {
      const nextDate = clampDateDraft(parseBirthDate(prev.birthDate), prev.calendarType);
      const nextBirthDate = formatBirthDate(nextDate);
      if (nextBirthDate === prev.birthDate) {
        return prev;
      }

      return {
        ...prev,
        birthDate: nextBirthDate,
      };
    });
  }, [form.calendarType]);

  useEffect(() => {
    if (!cityOptions.some((option) => option.value === placeDraft.city)) {
      setPlaceDraft((prev) => ({
        province: prev.province,
        city: cityOptions[0]?.value ?? "暂不填写",
      }));
    }
  }, [cityOptions, placeDraft.city]);

  function openDatePicker() {
    setDateDraft(clampDateDraft(parseBirthDate(form.birthDate), form.calendarType));
    setActivePicker("date");
  }

  function openTimePicker() {
    setTimeDraft(parseBirthTime(form.birthTime));
    setActivePicker("time");
  }

  function openPlacePicker() {
    setPlaceDraft(inferPlaceDraft(form.birthplace));
    setActivePicker("place");
  }

  function closePicker() {
    setActivePicker(null);
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
    <>
      <form
        onSubmit={handleSubmit}
        className="mystic-panel mystic-border relative overflow-hidden w-full rounded-[38px] p-6 md:p-8"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(208,183,136,0.16),transparent_62%)]" />

        <div className="relative">
          <div>
            <div className="text-xs font-semibold tracking-[0.32em] text-[#c9b48a] uppercase">
              Destiny Input
            </div>
            <h2 className="mt-3 text-[30px] font-semibold leading-tight text-white">
              输入出生信息
            </h2>
          </div>

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
                {genderOptions.map((item) => (
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
                {calendarOptions.map((item) => (
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

            <div className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-[#e5e0d7]">出生年月日</span>
              <button
                type="button"
                onClick={openDatePicker}
                className={selectionTriggerClassName}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-semibold tracking-[0.28em] text-[#b79d72] uppercase">
                      Wheel Date
                    </div>
                    <div className="mt-3 text-[26px] font-semibold text-white">
                      {formatBirthDateDisplay(form.birthDate)}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-xs leading-6 text-[#a9a39a]">
                    {form.calendarType === "solar" ? "公历滚轮选择" : "农历滚轮选择"}
                  </div>
                </div>
              </button>
            </div>

            <div className="space-y-2 md:col-span-1">
              <span className="text-sm font-medium text-[#e5e0d7]">出生时间</span>
              <button
                type="button"
                onClick={openTimePicker}
                className={selectionTriggerClassName}
              >
                <div className="text-[11px] font-semibold tracking-[0.28em] text-[#b79d72] uppercase">
                  Wheel Time
                </div>
                <div className="mt-3 text-[26px] font-semibold text-white">{form.birthTime}</div>
                <div className="mt-3 text-xs leading-6 text-[#a9a39a]">
                  北京时间，用于推算八字中的时柱。
                </div>
              </button>
            </div>

            <div className="space-y-2 md:col-span-1">
              <span className="text-sm font-medium text-[#e5e0d7]">出生地区</span>
              <button
                type="button"
                onClick={openPlacePicker}
                className={selectionTriggerClassName}
              >
                <div className="text-[11px] font-semibold tracking-[0.28em] text-[#b79d72] uppercase">
                  Wheel Region
                </div>
                <div className="mt-3 text-[26px] font-semibold text-white">
                  {form.birthplace || "暂不填写"}
                </div>
                <div className="mt-3 text-xs leading-6 text-[#a9a39a]">
                  省市联动滚轮选择，支持留空。
                </div>
              </button>
            </div>
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

      <WheelPickerSheet
        open={activePicker === "date"}
        title="选择出生年月日"
        subtitle="滚轮选择已和整体界面统一为深色金属质感；切换公历或农历后，日期范围会自动校正。"
        columns={[
          {
            label: "年份",
            options: yearOptions,
            value: dateDraft.year,
            onChange: (value) =>
              setDateDraft((prev) => clampDateDraft({ ...prev, year: value }, form.calendarType)),
          },
          {
            label: "月份",
            options: monthOptions,
            value: dateDraft.month,
            onChange: (value) =>
              setDateDraft((prev) => clampDateDraft({ ...prev, month: value }, form.calendarType)),
          },
          {
            label: "日期",
            options: dayOptions,
            value: dateDraft.day,
            onChange: (value) => setDateDraft((prev) => ({ ...prev, day: value })),
          },
        ]}
        onClose={closePicker}
        onConfirm={() => {
          const nextDate = clampDateDraft(dateDraft, form.calendarType);
          setForm((prev) => ({
            ...prev,
            birthDate: formatBirthDate(nextDate),
          }));
          closePicker();
        }}
      />

      <WheelPickerSheet
        open={activePicker === "time"}
        title="选择出生时间"
        subtitle="请以北京时间为准，滚轮选择更适合精确填写时柱对应时间。"
        columns={[
          {
            label: "小时",
            options: hourOptions,
            value: timeDraft.hour,
            onChange: (value) => setTimeDraft((prev) => ({ ...prev, hour: value })),
          },
          {
            label: "分钟",
            options: minuteOptions,
            value: timeDraft.minute,
            onChange: (value) => setTimeDraft((prev) => ({ ...prev, minute: value })),
          },
        ]}
        onClose={closePicker}
        onConfirm={() => {
          setForm((prev) => ({
            ...prev,
            birthTime: formatBirthTime(timeDraft),
          }));
          closePicker();
        }}
      />

      <WheelPickerSheet
        open={activePicker === "place"}
        title="选择出生地区"
        subtitle="支持省市联动滚轮选择；如果你不想填写，也可以直接保留“暂不填写”。"
        columns={[
          {
            label: "省份",
            options: provinceOptions,
            value: placeDraft.province,
            onChange: (value) =>
              setPlaceDraft(() => {
                const nextRegion = REGION_OPTIONS.find((region) => region.province === value);
                return {
                  province: value,
                  city: nextRegion?.cities[0] ?? "暂不填写",
                };
              }),
          },
          {
            label: "城市",
            options: cityOptions,
            value: placeDraft.city,
            onChange: (value) => setPlaceDraft((prev) => ({ ...prev, city: value })),
          },
        ]}
        onClose={closePicker}
        onConfirm={() => {
          setForm((prev) => ({
            ...prev,
            birthplace: formatBirthplace(placeDraft.province, placeDraft.city),
          }));
          closePicker();
        }}
      />
    </>
  );
}
