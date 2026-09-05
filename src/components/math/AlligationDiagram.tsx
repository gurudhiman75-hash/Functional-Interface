import { useId } from "react";
import { cn } from "@/lib/utils";

export type AlligationCrossDiagram = {
  version: 1;
  kind: "cross";
  title: string;
  lower: { label: string; value: string; quantity?: string };
  higher: { label: string; value: string; quantity?: string };
  mean: { label: string; value: string };
  lowerPart: { label: string; value: string; expression: string };
  higherPart: { label: string; value: string; expression: string };
  rangePartition?: {
    quantityRatio: string;
    totalParts: string;
    priceGap: string;
    valuePerPart: string;
    meanDistanceFromLowerParts: string;
  };
};

export type AlligationDeviationDiagram = {
  version: 1;
  kind: "deviation";
  title: string;
  target: { label: string; value: string };
  below: Array<{
    label: string;
    value: string;
    quantity: string;
    deviation: string;
  }>;
  above: Array<{
    label: string;
    value: string;
    quantity: string;
    deviation: string;
  }>;
};

export type AlligationSequenceDiagram = {
  version: 1;
  kind: "sequence";
  title: string;
  stages: Array<{ label: string; diagram: AlligationCrossDiagram }>;
};

export type AlligationDiagramData =
  | AlligationCrossDiagram
  | AlligationDeviationDiagram
  | AlligationSequenceDiagram;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isLabelValue(value: unknown): value is { label: string; value: string } {
  return (
    isRecord(value) &&
    typeof value.label === "string" &&
    typeof value.value === "string"
  );
}

function isPart(value: unknown): value is AlligationCrossDiagram["lowerPart"] {
  return (
    isLabelValue(value) &&
    typeof (value as Record<string, unknown>).expression === "string"
  );
}

function isCross(value: unknown): value is AlligationCrossDiagram {
  if (!isRecord(value) || value.version !== 1 || value.kind !== "cross") {
    return false;
  }
  return (
    typeof value.title === "string" &&
    isLabelValue(value.lower) &&
    isLabelValue(value.higher) &&
    isLabelValue(value.mean) &&
    isPart(value.lowerPart) &&
    isPart(value.higherPart)
  );
}

function isDeviationRow(value: unknown): value is AlligationDeviationDiagram["below"][number] {
  return (
    isLabelValue(value) &&
    typeof (value as Record<string, unknown>).quantity === "string" &&
    typeof (value as Record<string, unknown>).deviation === "string"
  );
}

export function isAlligationDiagramData(
  value: unknown,
): value is AlligationDiagramData {
  if (!isRecord(value) || value.version !== 1 || typeof value.title !== "string") {
    return false;
  }
  if (value.kind === "cross") return isCross(value);
  if (value.kind === "deviation") {
    return (
      isLabelValue(value.target) &&
      Array.isArray(value.below) &&
      value.below.every(isDeviationRow) &&
      Array.isArray(value.above) &&
      value.above.every(isDeviationRow)
    );
  }
  if (value.kind === "sequence") {
    return (
      Array.isArray(value.stages) &&
      value.stages.length > 0 &&
      value.stages.every(
        (stage) =>
          isRecord(stage) &&
          typeof stage.label === "string" &&
          isCross(stage.diagram),
      )
    );
  }
  return false;
}

function shorten(value: string, max = 26) {
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`;
}

function CrossDiagram({
  diagram,
  className,
}: {
  diagram: AlligationCrossDiagram;
  className?: string;
}) {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const description = `${diagram.title}. ${diagram.lower.label} ${diagram.lower.value}, ${diagram.higher.label} ${diagram.higher.value}, ${diagram.mean.label} ${diagram.mean.value}. The opposite differences give ${diagram.lowerPart.label} ${diagram.lowerPart.value} and ${diagram.higherPart.label} ${diagram.higherPart.value}.`;

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card p-2 shadow-sm sm:p-3",
        className,
      )}
    >
      <svg
        viewBox="0 0 640 340"
        width="100%"
        role="img"
        aria-labelledby={`${titleId} ${descriptionId}`}
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto block h-auto w-full max-w-[640px] text-foreground"
      >
        <title id={titleId}>{diagram.title}</title>
        <desc id={descriptionId}>{description}</desc>

        <text x="320" y="28" textAnchor="middle" className="fill-current text-[17px] font-semibold">
          {diagram.title}
        </text>

        <g className="fill-current">
          <text x="130" y="62" textAnchor="middle" className="text-[14px] font-semibold">
            {shorten(diagram.lower.label)}
          </text>
          <text x="130" y="88" textAnchor="middle" className="text-[18px] font-bold">
            {diagram.lower.value}
          </text>
          {diagram.lower.quantity ? (
            <text x="130" y="110" textAnchor="middle" className="text-[12px] text-muted-foreground">
              {shorten(diagram.lower.quantity, 30)}
            </text>
          ) : null}

          <text x="510" y="62" textAnchor="middle" className="text-[14px] font-semibold">
            {shorten(diagram.higher.label)}
          </text>
          <text x="510" y="88" textAnchor="middle" className="text-[18px] font-bold">
            {diagram.higher.value}
          </text>
          {diagram.higher.quantity ? (
            <text x="510" y="110" textAnchor="middle" className="text-[12px] text-muted-foreground">
              {shorten(diagram.higher.quantity, 30)}
            </text>
          ) : null}
        </g>

        <g className="text-primary">
          <line x1="178" y1="122" x2="462" y2="244" className="stroke-current" strokeWidth="3" />
          <line x1="462" y1="122" x2="178" y2="244" className="stroke-current" strokeWidth="3" />
        </g>

        <rect
          x="242"
          y="152"
          width="156"
          height="64"
          rx="12"
          className="fill-background stroke-primary"
          strokeWidth="2"
        />
        <text x="320" y="176" textAnchor="middle" className="fill-muted-foreground text-[12px] font-medium">
          {diagram.mean.label}
        </text>
        <text x="320" y="202" textAnchor="middle" className="fill-foreground text-[18px] font-bold">
          {diagram.mean.value}
        </text>

        <g className="fill-current">
          <text x="130" y="278" textAnchor="middle" className="text-[13px] font-semibold">
            {shorten(diagram.lowerPart.label, 28)}
          </text>
          <text x="130" y="302" textAnchor="middle" className="text-[20px] font-bold">
            {diagram.lowerPart.value}
          </text>
          <text x="130" y="324" textAnchor="middle" className="text-[12px] text-muted-foreground">
            {shorten(diagram.lowerPart.expression, 30)}
          </text>

          <text x="510" y="278" textAnchor="middle" className="text-[13px] font-semibold">
            {shorten(diagram.higherPart.label, 28)}
          </text>
          <text x="510" y="302" textAnchor="middle" className="text-[20px] font-bold">
            {diagram.higherPart.value}
          </text>
          <text x="510" y="324" textAnchor="middle" className="text-[12px] text-muted-foreground">
            {shorten(diagram.higherPart.expression, 30)}
          </text>
        </g>
      </svg>

      {diagram.rangePartition ? (
        <figcaption className="grid gap-2 border-t border-border/70 pt-3 text-xs sm:grid-cols-2 sm:text-sm">
          <div className="rounded-lg bg-muted/50 px-3 py-2">
            <span className="text-muted-foreground">Quantity ratio</span>
            <strong className="ml-2">{diagram.rangePartition.quantityRatio}</strong>
          </div>
          <div className="rounded-lg bg-muted/50 px-3 py-2">
            <span className="text-muted-foreground">Total parts</span>
            <strong className="ml-2">{diagram.rangePartition.totalParts}</strong>
          </div>
          <div className="rounded-lg bg-muted/50 px-3 py-2">
            <span className="text-muted-foreground">Price gap</span>
            <strong className="ml-2">{diagram.rangePartition.priceGap}</strong>
          </div>
          <div className="rounded-lg bg-muted/50 px-3 py-2">
            <span className="text-muted-foreground">Value per part</span>
            <strong className="ml-2">{diagram.rangePartition.valuePerPart}</strong>
          </div>
        </figcaption>
      ) : null}
    </figure>
  );
}

function DeviationDiagram({ diagram }: { diagram: AlligationDeviationDiagram }) {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const rowCount = Math.max(diagram.below.length, diagram.above.length, 1);
  const height = 150 + rowCount * 58;

  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-card p-2 shadow-sm sm:p-3">
      <svg
        viewBox={`0 0 640 ${height}`}
        width="100%"
        role="img"
        aria-labelledby={`${titleId} ${descriptionId}`}
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto block h-auto w-full max-w-[640px] text-foreground"
      >
        <title id={titleId}>{diagram.title}</title>
        <desc id={descriptionId}>
          Items below the target create deficits and items above the target create surpluses. These totals must balance.
        </desc>
        <text x="320" y="28" textAnchor="middle" className="fill-current text-[17px] font-semibold">
          {diagram.title}
        </text>
        <rect x="225" y="46" width="190" height="54" rx="12" className="fill-background stroke-primary" strokeWidth="2" />
        <text x="320" y="67" textAnchor="middle" className="fill-muted-foreground text-[12px]">
          {diagram.target.label}
        </text>
        <text x="320" y="90" textAnchor="middle" className="fill-foreground text-[17px] font-bold">
          {diagram.target.value}
        </text>

        <line x1="320" y1="112" x2="320" y2={height - 20} className="stroke-border" strokeWidth="2" />
        <text x="150" y="132" textAnchor="middle" className="fill-foreground text-[13px] font-semibold">
          Below target — deficit
        </text>
        <text x="490" y="132" textAnchor="middle" className="fill-foreground text-[13px] font-semibold">
          Above target — surplus
        </text>

        {diagram.below.map((row, index) => {
          const y = 164 + index * 58;
          return (
            <g key={`below-${index}`}>
              <rect x="28" y={y - 22} width="250" height="46" rx="10" className="fill-muted/40 stroke-border" />
              <text x="43" y={y - 4} className="fill-foreground text-[12px] font-semibold">
                {shorten(row.label, 25)} — {row.value}
              </text>
              <text x="43" y={y + 15} className="fill-muted-foreground text-[11px]">
                {row.quantity}; deficit {row.deviation}
              </text>
              <line x1="278" y1={y} x2="307" y2={y} className="stroke-primary" strokeWidth="2" />
              <path d={`M 307 ${y} l -8 -5 v 10 z`} className="fill-primary" />
            </g>
          );
        })}

        {diagram.above.map((row, index) => {
          const y = 164 + index * 58;
          return (
            <g key={`above-${index}`}>
              <rect x="362" y={y - 22} width="250" height="46" rx="10" className="fill-muted/40 stroke-border" />
              <text x="377" y={y - 4} className="fill-foreground text-[12px] font-semibold">
                {shorten(row.label, 25)} — {row.value}
              </text>
              <text x="377" y={y + 15} className="fill-muted-foreground text-[11px]">
                {row.quantity}; surplus {row.deviation}
              </text>
              <line x1="362" y1={y} x2="333" y2={y} className="stroke-primary" strokeWidth="2" />
              <path d={`M 333 ${y} l 8 -5 v 10 z`} className="fill-primary" />
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

export function AlligationDiagram({
  diagram,
  className,
}: {
  diagram: AlligationDiagramData;
  className?: string;
}) {
  if (diagram.kind === "cross") {
    return <CrossDiagram diagram={diagram} className={className} />;
  }
  if (diagram.kind === "deviation") {
    return (
      <div className={className}>
        <DeviationDiagram diagram={diagram} />
      </div>
    );
  }
  return (
    <section className={cn("space-y-4", className)} aria-label={diagram.title}>
      {diagram.stages.map((stage, index) => (
        <div key={`${stage.label}-${index}`} className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">{stage.label}</h4>
          <CrossDiagram diagram={stage.diagram} />
        </div>
      ))}
    </section>
  );
}
