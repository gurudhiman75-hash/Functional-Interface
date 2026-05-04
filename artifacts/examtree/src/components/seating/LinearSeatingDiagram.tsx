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

export function LinearSeatingDiagram({
  diagram,
  className,
  title = "Linear seating arrangement",
}: DiagramProps) {
  const seats = diagram.seats;
  const gap = seats.length > 6 ? 42 : 46;
  const width = Math.max(
    240,
    seats.length * gap + 34,
  );
  const height = 76;
  const startX =
    (width - (seats.length - 1) * gap) /
    2;
  const baselineY = 36;

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
      <g
        fill="none"
        stroke={EXAM_STROKE}
        strokeWidth={1}
      >
        <line
          x1={startX - 12}
          y1={baselineY}
          x2={
            startX +
            (seats.length - 1) * gap +
            12
          }
          y2={baselineY}
        />
      </g>

      <text
        x={startX - 12}
        y={baselineY + 19}
        fontSize={8}
        fill={EXAM_MUTED}
      >
        L
      </text>
      <text
        x={
          startX +
          (seats.length - 1) * gap -
          2
        }
        y={baselineY + 19}
        fontSize={8}
        fill={EXAM_MUTED}
      >
        R
      </text>

      {seats.map((seat, index) => {
        const x = startX + index * gap;
        const labelY =
          baselineY - 10;
        return (
          <g key={`${seat.label}-${seat.position}`}>
            <SeatLabel
              seat={seat}
              x={x}
              y={labelY}
            />
            {renderArrow(
              x,
              getVerticalArrowAnchor(
                labelY,
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

export default LinearSeatingDiagram;
