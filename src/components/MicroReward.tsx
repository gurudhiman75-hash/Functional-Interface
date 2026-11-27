/**
 * MicroReward — small auto-dismissing celebration popup.
 * Appears from the top-right, stays for 3.5 s, then fades out.
 * Multiple rewards queue automatically.
 */
import { useEffect, useRef, useState } from "react";

export interface Reward {
  id: string;
  emoji: string;
  title: string;
  subtitle?: string;
}

interface MicroRewardProps {
  rewards: Reward[];
  onDismiss?: (id: string) => void;
}

export function MicroReward({ rewards, onDismiss }: MicroRewardProps) {
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    for (const r of rewards) {
      if (visible[r.id] !== undefined) continue; // already handled
      // Stagger each reward by 400 ms
      const delay = Object.keys(visible).length * 400;
      const showTimer = setTimeout(() => {
        setVisible((v) => ({ ...v, [r.id]: true }));
        timers.current[r.id] = setTimeout(() => {
          setVisible((v) => ({ ...v, [r.id]: false }));
          // remove after fade-out
          setTimeout(() => onDismiss?.(r.id), 400);
        }, 3500);
      }, delay);
      timers.current[`show-${r.id}`] = showTimer;
      setVisible((v) => ({ ...v, [r.id]: false })); // register as handled
    }
    return () => {
      // cleanup on unmount only
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rewards.map((r) => r.id).join(",")]);

  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
    >
      {rewards.map((r) => (
        <div
          key={r.id}
          className={`pointer-events-auto flex items-center gap-3 rounded-2xl border border-border bg-card shadow-lg px-4 py-3 min-w-[220px] max-w-xs transition-all duration-400 ${
            visible[r.id]
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2"
          }`}
        >
          <span className="text-2xl select-none">{r.emoji}</span>
          <span>
            <p className="text-sm font-semibold text-foreground leading-tight">{r.title}</p>
            {r.subtitle && (
              <p className="text-xs text-muted-foreground">{r.subtitle}</p>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
