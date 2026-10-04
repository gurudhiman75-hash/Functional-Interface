import {
  Activity,
  AlertTriangle,
  Clock3,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TopicNode = {
  id: string;
  label: string;
  mastery: number;
  pattern: string;
};

type FocusMetric = {
  label: string;
  value: string;
  helper: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
};

const defaultTopics: TopicNode[] = [
  {
    id: "circular-seating",
    label: "Circular Seating",
    mastery: 82,
    pattern: "Facing In/Out",
  },
  {
    id: "linear-rows",
    label: "Linear Rows",
    mastery: 63,
    pattern: "Left/Right Mapping",
  },
  {
    id: "parallel-row",
    label: "Parallel Rows",
    mastery: 45,
    pattern: "Opposite Facing",
  },
  {
    id: "floor-puzzles",
    label: "Floor Puzzles",
    mastery: 28,
    pattern: "Vertical Slots",
  },
  {
    id: "coded-inequality",
    label: "Coded Inequality",
    mastery: 91,
    pattern: "Symbol Mapping",
  },
  {
    id: "blood-relations",
    label: "Blood Relations",
    mastery: 57,
    pattern: "Family Graph",
  },
  {
    id: "syllogism",
    label: "Syllogism",
    mastery: 36,
    pattern: "Set Inclusion",
  },
  {
    id: "direction-sense",
    label: "Direction Sense",
    mastery: 74,
    pattern: "Vector Path",
  },
  {
    id: "calendar",
    label: "Calendars",
    mastery: 18,
    pattern: "Odd Days",
  },
  {
    id: "clocks",
    label: "Clocks",
    mastery: 52,
    pattern: "Relative Angle",
  },
  {
    id: "series",
    label: "Series",
    mastery: 68,
    pattern: "State Shift",
  },
  {
    id: "analogy",
    label: "Analogy",
    mastery: 0,
    pattern: "Rule Transfer",
  },
];

function masteryClass(mastery: number) {
  if (mastery <= 0) {
    return "border-slate-800 bg-slate-900 text-slate-300";
  }
  if (mastery >= 80) {
    return "border-emerald-500 bg-emerald-500 text-white";
  }
  if (mastery >= 55) {
    return "border-indigo-500 bg-indigo-500 text-white";
  }
  if (mastery >= 30) {
    return "border-amber-400 bg-amber-100 text-amber-900";
  }
  return "border-zinc-300 bg-zinc-100 text-zinc-700";
}

const focusMetrics: FocusMetric[] = [
  {
    label: "Precision Rate",
    value: "78.4%",
    helper: "Last 120 reasoning attempts",
    icon: Target,
  },
  {
    label: "Average Solving Speed",
    value: "54s",
    helper: "Median time per logic item",
    icon: Clock3,
  },
  {
    label: "Logic Gaps",
    value: "3",
    helper:
      "Circular direction, floor parity, either-or cases",
    icon: AlertTriangle,
  },
];

export function ConceptMasteryDashboard({
  topics = defaultTopics,
  className,
}: {
  topics?: TopicNode[];
  className?: string;
}) {
  return (
    <section
      className={cn(
        "grid gap-4 font-sans text-zinc-950 lg:grid-cols-[1fr_280px]",
        className,
      )}
    >
      <div className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black dark:text-zinc-100">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
              Concept Mastery
            </p>
            <h2 className="mt-1 text-lg font-semibold">
              Reasoning Proficiency Grid
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Activity className="h-4 w-4" />
            Practice History
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8">
          {topics.map((topic) => (
            <div
              key={topic.id}
              title={`${topic.label}: ${topic.mastery}% mastery`}
              className={cn(
                "group flex aspect-square flex-col justify-between rounded-md border p-2 transition hover:-translate-y-0.5",
                masteryClass(topic.mastery),
              )}
            >
              <span className="line-clamp-2 text-[11px] font-semibold leading-tight">
                {topic.label}
              </span>
              <span className="text-[10px] opacity-80">
                {topic.mastery}%
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-zinc-500 sm:flex">
          <span className="inline-flex items-center gap-1">
            <i className="h-2.5 w-2.5 rounded-sm bg-slate-900" />
            Unstarted
          </span>
          <span className="inline-flex items-center gap-1">
            <i className="h-2.5 w-2.5 rounded-sm bg-indigo-500" />
            Developing
          </span>
          <span className="inline-flex items-center gap-1">
            <i className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
            Mastered
          </span>
        </div>
      </div>

      <aside className="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
          Logic Accuracy
        </p>
        <div className="mt-4 space-y-3">
          {focusMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-black"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500">
                    {metric.label}
                  </span>
                  <Icon className="h-4 w-4 text-indigo-600" />
                </div>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  {metric.value}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  {metric.helper}
                </p>
              </div>
            );
          })}
        </div>
      </aside>
    </section>
  );
}

