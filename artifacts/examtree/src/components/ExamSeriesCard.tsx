import { ArrowRight, Clock3, Hash, Lock, ShieldCheck } from "lucide-react";

import { CategoryIcon, isImageIcon } from "@/components/CategoryIcon";
import type { RuntimeExamGroup } from "@/lib/test-bank";

export type ExamSeriesMetrics = {
  freeCount: number;
  premiumCount: number;
  avgDuration: number | null;
  avgQuestions: number | null;
  attemptedCount: number;
  totalCount: number;
};

type ExamSeriesCardProps = {
  series: RuntimeExamGroup;
  icon?: string;
  metrics: ExamSeriesMetrics;
  onOpen: () => void;
  dataTestId?: string;
};

function formatKindCount(count: number, label: string) {
  if (count <= 0) return null;
  return `${count} ${label}`;
}

export function ExamSeriesCard({ series, icon, metrics, onOpen, dataTestId }: ExamSeriesCardProps) {
  const resolvedIcon = icon ?? series.icon ?? "Landmark";
  const kindLabels = [
    formatKindCount(series.fullLengthCount, "full length"),
    formatKindCount(series.sectionalCount, "sectional"),
    formatKindCount(series.topicWiseCount, "topic wise"),
  ].filter(Boolean) as string[];
  const progress = metrics.totalCount > 0
    ? Math.round((metrics.attemptedCount / metrics.totalCount) * 100)
    : 0;

  return (
    <button
      type="button"
      onClick={onOpen}
      data-testid={dataTestId}
      aria-label={`Open ${series.name} test series`}
      className="group flex h-full w-full flex-col rounded-xl border border-slate-200 bg-white p-5 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-[0_10px_30px_rgba(15,23,42,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
    >
      <div className="flex items-start gap-3.5">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
            isImageIcon(resolvedIcon)
              ? "border border-slate-200 bg-white text-slate-700"
              : "bg-indigo-50 text-indigo-700"
          }`}
          aria-hidden="true"
        >
          <CategoryIcon icon={resolvedIcon} className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-500">{series.categoryName}</p>
          <h3 className="mt-1 text-[19px] font-semibold leading-snug tracking-[-0.015em] text-slate-950">
            {series.name}
          </h3>
          {series.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{series.description}</p>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 divide-x divide-slate-100 border-y border-slate-100 py-3">
        <div className="pr-3">
          <p className="text-lg font-semibold tabular-nums text-slate-950">{series.totalTests}</p>
          <p className="mt-0.5 text-xs text-slate-500">Tests</p>
        </div>
        <div className="px-3">
          <p className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-slate-800">
            <Clock3 className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            {metrics.avgDuration ? `${metrics.avgDuration} min` : "—"}
          </p>
          <p className="mt-1 text-xs text-slate-500">Typical time</p>
        </div>
        <div className="pl-3">
          <p className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-slate-800">
            <Hash className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            {metrics.avgQuestions ?? "—"}
          </p>
          <p className="mt-1 text-xs text-slate-500">Typical Qs</p>
        </div>
      </div>

      {kindLabels.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-slate-500">
          {kindLabels.map((label) => <span key={label}>{label}</span>)}
        </div>
      )}

      {(metrics.freeCount > 0 || metrics.premiumCount > 0) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {metrics.freeCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {metrics.freeCount} free
            </span>
          )}
          {metrics.premiumCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              {metrics.premiumCount} premium
            </span>
          )}
        </div>
      )}

      {metrics.attemptedCount > 0 && metrics.totalCount > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="font-medium text-slate-500">Your progress</span>
            <span className="font-semibold tabular-nums text-slate-700">
              {metrics.attemptedCount}/{metrics.totalCount} attempted
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-indigo-600" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-sm font-semibold text-indigo-700">
        <span>View series</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
      </div>
    </button>
  );
}
