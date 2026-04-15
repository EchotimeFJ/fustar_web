"use client";

import { useEffect, useRef } from "react";

export type WheelOption = {
  label: string;
  value: string;
};

type WheelColumnConfig = {
  label: string;
  options: WheelOption[];
  value: string;
  onChange: (value: string) => void;
};

type WheelPickerSheetProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  columns: WheelColumnConfig[];
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
};

const ROW_HEIGHT = 60;
const EDGE_SPACER_HEIGHT = ROW_HEIGHT * 2;

function WheelColumn({ label, options, value, onChange }: WheelColumnConfig) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const targetTop = selectedIndex * ROW_HEIGHT;
    if (Math.abs(viewport.scrollTop - targetTop) > 1) {
      viewport.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  useEffect(() => {
    return () => {
      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current);
      }
    };
  }, []);

  function settleToNearest() {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const nextIndex = Math.max(
      0,
      Math.min(options.length - 1, Math.round(viewport.scrollTop / ROW_HEIGHT))
    );
    const nextOption = options[nextIndex];
    if (nextOption && nextOption.value !== value) {
      onChange(nextOption.value);
    }
  }

  function handleScroll() {
    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
    }

    settleTimerRef.current = window.setTimeout(() => {
      settleToNearest();
    }, 80);
  }

  return (
    <div className="min-w-0 flex-1">
      <div className="mb-3 text-center text-[11px] font-semibold tracking-[0.3em] text-[#b79d72] uppercase">
        {label}
      </div>
      <div className="relative overflow-hidden rounded-[26px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]">
        <div
          style={{ height: ROW_HEIGHT }}
          className="pointer-events-none absolute inset-x-3 top-1/2 z-10 -translate-y-1/2 rounded-2xl border border-[#d7c29d]/18 bg-[linear-gradient(135deg,rgba(241,237,229,0.14),rgba(216,202,178,0.06))] shadow-[0_18px_40px_rgba(0,0,0,0.2)]"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-[linear-gradient(180deg,rgba(8,8,8,0.88),rgba(8,8,8,0.08))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-[linear-gradient(0deg,rgba(8,8,8,0.88),rgba(8,8,8,0.08))]" />
        <div
          ref={viewportRef}
          onScroll={handleScroll}
          style={{ height: ROW_HEIGHT * 5 }}
          className="wheel-scrollbar overflow-y-auto overscroll-contain px-3 py-0"
        >
          <div style={{ height: EDGE_SPACER_HEIGHT }} />
          {options.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={`${label}-${option.value}`}
                type="button"
                onClick={() => onChange(option.value)}
                style={{ height: ROW_HEIGHT }}
                className={`flex w-full snap-center items-center justify-center rounded-2xl px-4 text-center transition ${
                  active ? "text-white" : "text-[#7d7569]"
                }`}
              >
                <span
                  className={`px-2 text-sm leading-5 whitespace-normal md:text-[15px] ${active ? "font-semibold" : "font-medium"}`}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
          <div style={{ height: EDGE_SPACER_HEIGHT }} />
        </div>
      </div>
    </div>
  );
}

export function WheelPickerSheet({
  open,
  title,
  subtitle,
  columns,
  onClose,
  onConfirm,
  confirmLabel = "确认选择",
}: WheelPickerSheetProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="关闭选择面板"
        onClick={onClose}
        className="absolute inset-0 bg-black/72 backdrop-blur-md"
      />

      <div className="absolute inset-x-0 bottom-0 rounded-t-[34px] border-t border-white/10 bg-[linear-gradient(180deg,#111111_0%,#090909_100%)] px-5 pb-6 pt-5 shadow-[0_-24px_80px_rgba(0,0,0,0.48)] md:left-1/2 md:max-w-5xl md:-translate-x-1/2 md:rounded-[36px] md:border md:pb-7 md:pt-6">
        <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-white/10 md:hidden" />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-[0.32em] text-[#c9b48a] uppercase">
              Wheel Selector
            </div>
            <h3 className="mt-3 text-2xl font-semibold text-white md:text-[30px]">
              {title}
            </h3>
            {subtitle ? (
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#a9a39a]">
                {subtitle}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#d3ccc2] transition hover:bg-white/8 hover:text-white"
          >
            取消
          </button>
        </div>

        <div className={`mt-6 grid gap-4 ${columns.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {columns.map((column) => (
            <WheelColumn key={column.label} {...column} />
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-2xl border border-[#d7c29d]/20 bg-[linear-gradient(135deg,#f1ede5_0%,#d8cab2_100%)] px-6 py-3 text-sm font-semibold text-[#191612] transition hover:brightness-105"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
