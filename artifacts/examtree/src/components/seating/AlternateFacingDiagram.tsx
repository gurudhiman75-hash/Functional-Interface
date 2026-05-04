import {
  DiagramLegend,
  type DiagramProps,
  EXAM_MUTED,
  EXAM_STROKE,
  getVerticalArrowAnchor,
  getSvgLabel,
  renderArrow,
  SeatLabel,
} from "./diagram-utils";

export function AlternateFacingDiagram({
  diagram,
  className,
  title = "Alternate-facing seating arrangement",
}: DiagramProps) {
  const seats = diagram.seats;
  const gap = seats.length > 6 ? 40 : 44;
  const width = Math.max(
    250,
    seats.length * gap + 36,
  );
  const height = 96;
  const startX =
    (width - (seats.length - 1) * gap) /
    2;
  const axisY = 47;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={getSvgLabel(
        diagram,
        title,
      )}
    >
      <line
        x1={16}
        y1={axisY}
        x2={width - 16}
        y2={axisY}
        stroke={EXAM_STROKE}
        strokeWidth={1}
      />
      <text
        x={18}
        y={axisY - 8}
        fontSize={8}
        fill={EXAM_MUTED}
      >
        L
      </text>
      <text
        x={width - 18}
        y={axisY - 8}
        textAnchor="end"
        fontSize={8}
        fill={EXAM_MUTED}
      >
        R
      </text>

      {seats.map((seat, index) => {
        const x = startX + index * gap;
        const y =
          seat.facing === "north"
            ? axisY - 17
            : axisY + 17;

        return (
          <g key={`${seat.label}-${seat.position}`}>
            <SeatLabel
              seat={seat}
              x={x}
              y={y}
            />
            {renderArrow(
              x,
              getVerticalArrowAnchor(
                y,
                seat,
                seat.facing as
                  | "north"
                  | "south",
              ),
              seat.facing,
              5,
            )}
          </g>
        );
      })}

      <DiagramLegend
        diagram={diagram}
        compact
      />
    </svg>
  );
}

export default AlternateFacingDiagram;
