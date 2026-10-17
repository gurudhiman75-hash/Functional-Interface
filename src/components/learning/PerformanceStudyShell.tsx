import { useEffect, useState } from "react";
import { Moon, Keyboard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type HotkeyAction =
  | "next"
  | "previous"
  | "mark"
  | "hint";

type PerformanceStudyShellProps = {
  children: React.ReactNode;
  loading?: boolean;
  onHotkey?: (action: HotkeyAction) => void;
  className?: string;
};

export function DataPanelSkeleton({
  rows = 5,
}: {
  rows?: number;
}) {
  return (
    <div className="space-y-3 rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
      <Skeleton className="h-5 w-40 rounded-md" />
      <div className="grid gap-2">
        {Array.from({ length: rows }).map(
          (_, index) => (
            <Skeleton
              key={index}
              className="h-10 w-full rounded-md"
            />
          ),
        )}
      </div>
    </div>
  );
}

export function PerformanceStudyShell({
  children,
  loading = false,
  onHotkey,
  className,
}: PerformanceStudyShellProps) {
  const [showHotkeys, setShowHotkeys] =
    useState(false);
  const [midnight, setMidnight] =
    useState(false);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target =
        event.target as HTMLElement | null;
      if (
        target &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(
          target.tagName,
        )
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      if (key === "?") {
        setShowHotkeys((value) => !value);
        return;
      }
      if (key === "j") onHotkey?.("next");
      if (key === "k") onHotkey?.("previous");
      if (key === "m") onHotkey?.("mark");
      if (key === "h") onHotkey?.("hint");
    };
    window.addEventListener("keydown", handler);
    return () =>
      window.removeEventListener(
        "keydown",
        handler,
      );
  }, [onHotkey]);

  return (
    <div
      className={cn(
        "min-h-screen font-sans text-zinc-950 transition-colors",
        midnight
          ? "bg-black text-zinc-100"
          : "bg-zinc-50 dark:bg-black dark:text-zinc-100",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={() =>
              setMidnight((value) => !value)
            }
            className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
          >
            <Moon className="h-3.5 w-3.5" />
            Midnight
          </button>
        </div>

        {loading ? (
          <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
            <DataPanelSkeleton rows={8} />
            <DataPanelSkeleton rows={10} />
          </div>
        ) : (
          children
        )}
      </div>

      {showHotkeys ? (
        <div className="fixed bottom-4 right-4 z-50 w-72 rounded-md border border-zinc-800 bg-black/95 p-4 text-zinc-100 shadow-none">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Keyboard className="h-4 w-4 text-indigo-400" />
            Hotkey Hints
          </div>
          <dl className="mt-3 grid grid-cols-[40px_1fr] gap-y-2 text-xs text-zinc-400">
            <dt className="font-semibold text-zinc-100">
              J
            </dt>
            <dd>Next question</dd>
            <dt className="font-semibold text-zinc-100">
              K
            </dt>
            <dd>Previous question</dd>
            <dt className="font-semibold text-zinc-100">
              M
            </dt>
            <dd>Mark for review</dd>
            <dt className="font-semibold text-zinc-100">
              H
            </dt>
            <dd>Show logic hint</dd>
          </dl>
        </div>
      ) : null}
    </div>
  );
}

