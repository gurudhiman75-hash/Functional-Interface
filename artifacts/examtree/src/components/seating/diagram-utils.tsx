import type {
  SeatingDiagramData,
  SeatingDiagramFacing,
  SeatingDiagramSeat,
} from "@workspace/api-zod";

export type DiagramProps = {
  diagram: SeatingDiagramData;
  className?: string;
  title?: string;
};

export const EXAM_STROKE = "#1f2937";
export const EXAM_MUTED = "#64748b";
export const EXAM_SOFT = "#cbd5e1";
export const EXAM_PAPER = "#ffffff";
export const EXAM_HIGHLIGHT = "#0f172a";
export const EXAM_ANSWER = "#475569";

export function getSvgLabel(
  diagram: SeatingDiagramData,
  fallback: string,
) {
  const target =
    diagram.questionTarget?.label;
  return target
    ? `${fallback}. Highlighted reference label: ${target}.`
    : fallback;
}

export function getLabelWidth(
  label: string,
) {
  return Math.max(
    16,
    label.length * 8.5 + 6,
  );
}

export function getLabelHeight(
  seat: SeatingDiagramSeat,
) {
  return seat.seatLabel ? 24 : 14;
}

export function isUnknownSeat(
  seat: SeatingDiagramSeat,
) {
  return seat.label.trim() === "?";
}

export function getVerticalArrowAnchor(
  labelY: number,
  seat: SeatingDiagramSeat,
  facing: "north" | "south",
) {
  const halfHeight =
    getLabelHeight(seat) / 2;
  const gap = isUnknownSeat(seat)
    ? 7
    : 6;

  return facing === "north"
    ? labelY - halfHeight - gap
    : labelY + halfHeight + gap;
}

export function renderArrow(
  x: number,
  y: number,
  facing: SeatingDiagramFacing,
  length = 8,
) {
  const dy =
    facing === "north"
      ? -length
      : length;
  const tipY = y + dy;
  const wing = 2.4;
  const stemInset =
    facing === "north" ? 2 : -2;

  return (
    <g
      aria-hidden="true"
      stroke={EXAM_MUTED}
      strokeWidth={1}
      strokeLinecap="round"
      fill="none"
    >
      <line
        x1={x}
        y1={y - stemInset}
        x2={x}
        y2={tipY}
      />
      <path
        d={`M ${x - wing} ${tipY + (facing === "north" ? wing : -wing)} L ${x} ${tipY} L ${x + wing} ${tipY + (facing === "north" ? wing : -wing)}`}
      />
    </g>
  );
}

export function renderRadialArrow(
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  facing: "center" | "outward",
  innerOffset = 12,
  length = 7,
) {
  const vx = centerX - x;
  const vy = centerY - y;
  const magnitude =
    Math.hypot(vx, vy) || 1;
  const ux = vx / magnitude;
  const uy = vy / magnitude;
  const direction =
    facing === "center" ? 1 : -1;
  const startX =
    x + ux * innerOffset * direction;
  const startY =
    y + uy * innerOffset * direction;
  const tipX =
    startX + ux * length * direction;
  const tipY =
    startY + uy * length * direction;
  const wingX = -uy * 2.2;
  const wingY = ux * 2.2;

  return (
    <g
      aria-hidden="true"
      stroke={EXAM_MUTED}
      strokeWidth={1}
      strokeLinecap="round"
      fill="none"
    >
      <line
        x1={startX}
        y1={startY}
        x2={tipX}
        y2={tipY}
      />
      <path
        d={`M ${tipX - ux * 2.2 + wingX} ${tipY - uy * 2.2 + wingY} L ${tipX} ${tipY} L ${tipX - ux * 2.2 - wingX} ${tipY - uy * 2.2 - wingY}`}
      />
    </g>
  );
}

export function SeatLabel({
  seat,
  x,
  y,
  align = "middle",
  emphasizeSeatLabel = false,
  showConnector = true,
}: {
  seat: SeatingDiagramSeat;
  x: number;
  y: number;
  align?: "start" | "middle" | "end";
  emphasizeSeatLabel?: boolean;
  showConnector?: boolean;
}) {
  const isTarget =
    seat.highlighted;
  const isAnswer = seat.isAnswer;
  const isUnknown =
    isUnknownSeat(seat);
  const labelWidth =
    getLabelWidth(seat.label);
  const left =
    align === "middle"
      ? x - labelWidth / 2
      : align === "start"
        ? x - 1
        : x - labelWidth + 1;

  return (
    <g>
      {showConnector ? (
        <line
          x1={x}
          y1={y - 6}
          x2={x}
          y2={y - 1}
          stroke={EXAM_SOFT}
          strokeWidth={1}
        />
      ) : null}
      {(isTarget || isAnswer || isUnknown) ? (
        <rect
          x={left}
          y={y - 14}
          width={labelWidth}
          height={18}
          rx={3}
          fill="none"
          stroke={
            isUnknown
              ? EXAM_SOFT
              : isTarget
              ? EXAM_HIGHLIGHT
              : EXAM_ANSWER
          }
          strokeWidth={1}
          strokeDasharray={
            isUnknown
              ? "1.5 2"
              : isTarget
              ? "2 2"
              : "3 2"
          }
        />
      ) : null}
      <text
        x={x}
        y={y}
        textAnchor={align}
        dominantBaseline="middle"
        fontSize={12}
        fontWeight={
          isTarget ||
          isAnswer ||
          isUnknown
            ? 700
            : 600
        }
        fill={EXAM_STROKE}
      >
        {seat.label}
      </text>
      {emphasizeSeatLabel &&
      seat.seatLabel ? (
        <text
          x={x}
          y={y + 14}
          textAnchor={align}
          fontSize={8}
          fill={EXAM_MUTED}
        >
          {seat.seatLabel}
        </text>
      ) : null}
    </g>
  );
}

export function DiagramLegend({
  diagram,
  compact = false,
  x = 8,
  y = 10,
}: {
  diagram: SeatingDiagramData;
  compact?: boolean;
  x?: number;
  y?: number;
}) {
  if (
    compact ||
    (!diagram.questionTarget?.label &&
      !diagram.seats.some(
        (seat) => seat.isAnswer,
      ))
  ) {
    return null;
  }

  return (
    <g
      transform={`translate(${x} ${y})`}
      fontSize={8}
      fill={EXAM_MUTED}
    >
      {diagram.questionTarget?.label ? (
        <g>
          <rect
            x={0}
            y={-8}
            width={14}
            height={12}
            rx={2}
            fill="none"
            stroke={EXAM_HIGHLIGHT}
            strokeWidth={1}
            strokeDasharray="2 2"
          />
          <text x={18} y={1}>
            asked
          </text>
        </g>
      ) : null}
      {diagram.seats.some(
        (seat) => seat.isAnswer,
      ) ? (
        <g
          transform={`translate(0 ${
            diagram.questionTarget?.label
              ? 14
              : 0
          })`}
        >
          <rect
            x={0}
            y={-8}
            width={14}
            height={12}
            rx={2}
            fill="none"
            stroke={EXAM_ANSWER}
            strokeWidth={1}
            strokeDasharray="3 2"
          />
          <text x={18} y={1}>
            answer
          </text>
        </g>
      ) : null}
    </g>
  );
}
