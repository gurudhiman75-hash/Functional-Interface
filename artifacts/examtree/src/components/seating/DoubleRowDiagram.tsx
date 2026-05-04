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

export function DoubleRowDiagram({
  diagram,
  className,
  title = "Double-row seating arrangement",
}: DiagramProps) {
  const colCount = Math.max(
    1,
    diagram.colCount ??
      Math.ceil(diagram.seats.length / 2),
  );
  const topRow = diagram.seats.filter(
    (seat) => (seat.row ?? 0) === 0,
  );
  const bottomRow = diagram.seats.filter(
    (seat) => (seat.row ?? 0) === 1,
  );
  const gap = colCount > 4 ? 40 : 44;
  const width = Math.max(
    250,
    colCount * gap + 62,
  );
  const height = 104;
  const startX =
    (width - (colCount - 1) * gap) /
    2;
  const topY = 31;
  const bottomY = 73;

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
      <text
        x={12}
        y={12}
        fontSize={8}
        fill={EXAM_MUTED}
      >
        {diagram.arrangementType ===
        "double-row"
          ? "Facing rows"
          : "Parallel rows"}
      </text>

      {[...Array(colCount)].map(
        (_, col) => {
          const x = startX + col * gap;
          return (
            <line
              key={`guide-${col}`}
              x1={x}
              y1={topY + 5}
              x2={x}
              y2={bottomY - 5}
              stroke={EXAM_MUTED}
              strokeDasharray="2 3"
            />
          );
        },
      )}

      <text
        x={12}
        y={topY}
        fontSize={8}
        fill={EXAM_MUTED}
      >
        R1
      </text>
      <text
        x={12}
        y={bottomY}
        fontSize={8}
        fill={EXAM_MUTED}
      >
        R2
      </text>

      {topRow.map((seat, index) => {
        const x = startX + index * gap;
        const labelY = topY + 6;
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

      {bottomRow.map(
        (seat, index) => {
          const x = startX + index * gap;
          const labelY =
            bottomY + 6;
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
        },
      )}

      <DiagramLegend
        diagram={diagram}
        compact
      />
    </svg>
  );
}

export default DoubleRowDiagram;
