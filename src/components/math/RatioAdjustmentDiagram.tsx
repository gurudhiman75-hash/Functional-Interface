import { useId } from "react";
import { cn } from "@/lib/utils";

export type RatioAdjustmentDiagramData = {
  version: 1;
  kind: "TWO_COMPONENT" | "THREE_COMPONENT";
  title: string;
  quantityUnit: string;
  before: Array<{ label: string; quantity: string }>;
  operation: string;
  after: Array<{ label: string; quantity: string }>;
  beforeRatio: string;
  afterRatio: string;
  targetRatio?: string;
  note: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isRow(value: unknown): value is { label: string; quantity: string } {
  return (
    isRecord(value) &&
    typeof value.label === "string" &&
    typeof value.quantity === "string"
  );
}

export function isRatioAdjustmentDiagramData(
  value: unknown,
): value is RatioAdjustmentDiagramData {
  if (!isRecord(value)) return false;
  const expectedCount = value.kind === "THREE_COMPONENT" ? 3 : 2;
  return (
    value.version === 1 &&
    (value.kind === "TWO_COMPONENT" || value.kind === "THREE_COMPONENT") &&
    typeof value.title === "string" &&
    typeof value.quantityUnit === "string" &&
    Array.isArray(value.before) &&
    value.before.length === expectedCount &&
    value.before.every(isRow) &&
    typeof value.operation === "string" &&
    Array.isArray(value.after) &&
    value.after.length === expectedCount &&
    value.after.every(isRow) &&
    typeof value.beforeRatio === "string" &&
    typeof value.afterRatio === "string" &&
    (value.targetRatio === undefined || typeof value.targetRatio === "string") &&
    typeof value.note === "string"
  );
}

function shorten(value: string, max = 24) {
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`;
}

function wrapWords(value: string, max = 25, maxLines = 3): string[] {
  const words = value.trim().split(/\s+/u);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= max || current.length === 0) {
      current = next;
      continue;
    }
    lines.push(current);
    current = word;
    if (lines.length === maxLines - 1) break;
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    lines[maxLines - 1] = shorten(lines[maxLines - 1]!, max);
  }
  return lines;
}

function CompositionPanel({
  x,
  title,
  rows,
  ratio,
  unit,
}: {
  x: number;
  title: string;
  rows: RatioAdjustmentDiagramData["before"];
  ratio: string;
  unit: string;
}) {
  const rowHeight = rows.length === 3 ? 48 : 58;
  return (
    <g>
      <rect
        x={x}
        y="62"
        width="226"
        height="214"
        rx="16"
        className="fill-background stroke-border"
        strokeWidth="2"
      />
      <text
        x={x + 113}
        y="90"
        textAnchor="middle"
        className="fill-foreground text-[15px] font-semibold"
      >
        {title}
      </text>
      {rows.map((row, index) => {
        const y = 113 + index * rowHeight;
        return (
          <g key={`${title}-${row.label}-${index}`}>
            <rect
              x={x + 16}
              y={y}
              width="194"
              height={rowHeight - 10}
              rx="10"
              className="fill-muted/45 stroke-border"
            />
            <text
              x={x + 29}
              y={y + 18}
              className="fill-foreground text-[12px] font-semibold"
            >
              {shorten(row.label)}
            </text>
            <text
              x={x + 29}
              y={y + 36}
              className="fill-muted-foreground text-[11px]"
            >
              {row.quantity} {unit}
            </text>
          </g>
        );
      })}
      <text
        x={x + 113}
        y="258"
        textAnchor="middle"
        className="fill-primary text-[16px] font-bold"
      >
        Ratio {ratio}
      </text>
    </g>
  );
}

export function RatioAdjustmentDiagram({
  diagram,
  className,
}: {
  diagram: RatioAdjustmentDiagramData;
  className?: string;
}) {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const description = `${diagram.title}. Before ratio ${diagram.beforeRatio}. ${diagram.operation}. After ratio ${diagram.afterRatio}. ${diagram.note}`;
  const operationLines = wrapWords(diagram.operation);

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card p-2 shadow-sm sm:p-3",
        className,
      )}
    >
      <svg
        viewBox="0 0 760 360"
        width="100%"
        role="img"
        aria-labelledby={`${titleId} ${descriptionId}`}
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto block h-auto w-full max-w-[760px] text-foreground"
      >
        <title id={titleId}>{diagram.title}</title>
        <desc id={descriptionId}>{description}</desc>

        <text
          x="380"
          y="28"
          textAnchor="middle"
          className="fill-current text-[17px] font-semibold"
        >
          {diagram.title}
        </text>

        <CompositionPanel
          x={18}
          title="Before"
          rows={diagram.before}
          ratio={diagram.beforeRatio}
          unit={diagram.quantityUnit}
        />

        <CompositionPanel
          x={516}
          title="After"
          rows={diagram.after}
          ratio={diagram.afterRatio}
          unit={diagram.quantityUnit}
        />

        <g className="text-primary">
          <line
            x1="260"
            y1="165"
            x2="500"
            y2="165"
            className="stroke-current"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path d="M 500 165 l -18 -11 v 22 z" className="fill-current" />
        </g>

        <rect
          x="278"
          y="103"
          width="204"
          height="104"
          rx="14"
          className="fill-background stroke-primary"
          strokeWidth="2"
        />
        <text
          x="380"
          y="128"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px] font-semibold"
        >
          OPERATION
        </text>
        <text
          x="380"
          y="151"
          textAnchor="middle"
          className="fill-foreground text-[11px] font-semibold"
        >
          {operationLines.map((line, index) => (
            <tspan
              key={`${line}-${index}`}
              x="380"
              dy={index === 0 ? 0 : 17}
            >
              {line}
            </tspan>
          ))}
        </text>

        {diagram.targetRatio ? (
          <g>
            <rect
              x="285"
              y="225"
              width="190"
              height="42"
              rx="10"
              className="fill-muted/45 stroke-border"
            />
            <text
              x="380"
              y="251"
              textAnchor="middle"
              className="fill-foreground text-[13px] font-semibold"
            >
              Target ratio {diagram.targetRatio}
            </text>
          </g>
        ) : null}

        <rect
          x="60"
          y="298"
          width="640"
          height="42"
          rx="12"
          className="fill-muted/40 stroke-border"
        />
        <text
          x="380"
          y="324"
          textAnchor="middle"
          className="fill-muted-foreground text-[12px]"
        >
          {shorten(diagram.note, 92)}
        </text>
      </svg>
    </figure>
  );
}
