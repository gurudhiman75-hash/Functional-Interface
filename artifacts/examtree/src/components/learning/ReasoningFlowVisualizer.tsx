import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type LogicStep = {
  step: number;
  clue: string;
  placements: Record<string, string>;
  highlightSlots?: string[];
};

type Seat = {
  id: string;
  x: number;
  y: number;
};

const defaultSeats: Seat[] = Array.from(
  { length: 8 },
  (_, index) => {
    const angle =
      (Math.PI * 2 * index) / 8 -
      Math.PI / 2;
    return {
      id: `S${index + 1}`,
      x: 150 + Math.cos(angle) * 105,
      y: 150 + Math.sin(angle) * 105,
    };
  },
);

const defaultSteps: LogicStep[] = [
  {
    step: 1,
    clue:
      "B is fixed opposite the reference seat.",
    placements: { S1: "B" },
    highlightSlots: ["S1"],
  },
  {
    step: 2,
    clue:
      "A sits second to the left of B.",
    placements: { S1: "B", S7: "A" },
    highlightSlots: ["S7", "S1"],
  },
  {
    step: 3,
    clue:
      "The Doctor sits immediately right of A.",
    placements: {
      S1: "B",
      S7: "A",
      S8: "Doctor",
    },
    highlightSlots: ["S7", "S8"],
  },
  {
    step: 4,
    clue:
      "C cannot sit adjacent to B, so only S4 remains.",
    placements: {
      S1: "B",
      S7: "A",
      S8: "Doctor",
      S4: "C",
    },
    highlightSlots: ["S4"],
  },
];

export function ReasoningFlowVisualizer({
  steps = defaultSteps,
  seats = defaultSeats,
  className,
}: {
  steps?: LogicStep[];
  seats?: Seat[];
  className?: string;
}) {
  const [activeIndex, setActiveIndex] =
    useState(0);
  const activeStep =
    steps[activeIndex] ?? steps[0];
  const placements =
    activeStep?.placements ?? {};
  const highlighted = new Set(
    activeStep?.highlightSlots ?? [],
  );
  const seatById = useMemo(
    () =>
      new Map(
        seats.map((seat) => [
          seat.id,
          seat,
        ]),
      ),
    [seats],
  );

  return (
    <section
      className={cn(
        "rounded-md border border-zinc-200 bg-white p-4 text-zinc-950 dark:border-zinc-800 dark:bg-black dark:text-zinc-100",
        className,
      )}
    >
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
          Step-by-Step Logic Breakdown
        </p>
        <h2 className="mt-1 text-lg font-semibold">
          Seating Arrangement Blueprint
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <svg
            viewBox="0 0 300 300"
            className="h-[320px] w-full"
            role="img"
            aria-label="Seating arrangement solution state"
          >
            <circle
              cx="150"
              cy="150"
              r="84"
              fill="none"
              stroke="currentColor"
              strokeDasharray="4 7"
              className="text-zinc-300 dark:text-zinc-700"
            />
            {seats.map((seat) => {
              const label =
                placements[seat.id];
              const isHighlighted =
                highlighted.has(seat.id);
              return (
                <g key={seat.id}>
                  <rect
                    x={seat.x - 18}
                    y={seat.y - 18}
                    width="36"
                    height="36"
                    rx="4"
                    fill={
                      label
                        ? "#ffffff"
                        : "transparent"
                    }
                    stroke={
                      isHighlighted
                        ? "#4f46e5"
                        : "#a1a1aa"
                    }
                    strokeWidth={
                      isHighlighted ? 1.5 : 1
                    }
                    strokeDasharray={
                      label ? "0" : "3 3"
                    }
                    className="dark:fill-black"
                  />
                  {isHighlighted ? (
                    <motion.rect
                      x={seat.x - 22}
                      y={seat.y - 22}
                      width="44"
                      height="44"
                      rx="5"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="1"
                      initial={{ opacity: 0.8 }}
                      animate={{
                        opacity: [0.2, 0.9, 0.2],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                      }}
                    />
                  ) : null}
                  <text
                    x={seat.x}
                    y={seat.y - 2}
                    textAnchor="middle"
                    className="fill-zinc-950 text-[10px] font-semibold dark:fill-zinc-100"
                  >
                    {label ?? seat.id}
                  </text>
                </g>
              );
            })}
            {Object.entries(placements).map(
              ([slotId, label]) => {
                const seat =
                  seatById.get(slotId);
                if (!seat) return null;
                return (
                  <motion.circle
                    key={`${slotId}-${label}`}
                    cx={seat.x}
                    cy={seat.y}
                    r="3"
                    fill="#10b981"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                );
              },
            )}
          </svg>

          <div className="mt-3">
            <input
              type="range"
              min={0}
              max={Math.max(steps.length - 1, 0)}
              value={activeIndex}
              onChange={(event) =>
                setActiveIndex(
                  Number(event.target.value),
                )
              }
              className="w-full accent-indigo-600"
            />
            <div className="mt-2 flex justify-between text-xs text-zinc-500">
              <span>Step 1</span>
              <span>
                Step {steps.length}
              </span>
            </div>
          </div>
        </div>

        <ol className="space-y-2">
          {steps.map((step, index) => (
            <li
              key={step.step}
              className={cn(
                "rounded-md border p-3 text-sm transition",
                index === activeIndex
                  ? "border-indigo-300 bg-indigo-50 text-indigo-950 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100"
                  : "border-zinc-200 bg-white text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400",
              )}
            >
              <button
                type="button"
                onClick={() =>
                  setActiveIndex(index)
                }
                className="w-full text-left"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-600">
                  Step {step.step}
                </span>
                <p className="mt-1 leading-relaxed">
                  {step.clue}
                </p>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

