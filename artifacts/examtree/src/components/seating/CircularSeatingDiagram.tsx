import {
  DiagramLegend,
  type DiagramProps,
  EXAM_STROKE,
  EXAM_SOFT,
  getLabelWidth,
  getSvgLabel,
  renderRadialArrow,
  SeatLabel,
} from "./diagram-utils";

function getRectPerimeterPoint(
  index: number,
  total: number,
  width: number,
  height: number,
) {
  const perimeter =
    width * 2 + height * 2;
  const distance =
    (index / total) * perimeter;

  if (distance <= width) {
    return {
      x: distance - width / 2,
      y: -height / 2,
    };
  }

  if (distance <= width + height) {
    return {
      x: width / 2,
      y:
        distance -
        width -
        height / 2,
    };
  }

  if (
    distance <=
    width * 2 + height
  ) {
    return {
      x:
        width / 2 -
        (distance - width - height),
      y: height / 2,
    };
  }

  return {
    x: -width / 2,
    y:
      height / 2 -
      (distance -
        width * 2 -
        height),
  };
}

export function CircularSeatingDiagram({
  diagram,
  className,
  title = "Circular seating arrangement",
}: DiagramProps) {
  const seats = diagram.seats;
  const width = 220;
  const height = 180;
  const centerX = width / 2;
  const centerY = height / 2;
  const ringRadius =
    seats.length >= 8 ? 54 : 46;
  const tableWidth =
    diagram.arrangementType ===
    "rectangular"
      ? 58
      : 34;
  const tableHeight =
    diagram.arrangementType ===
    "rectangular"
      ? 34
      : 34;

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
      {diagram.arrangementType ===
      "circular" ? (
        <circle
          cx={centerX}
          cy={centerY}
          r={3}
          fill="none"
          stroke={EXAM_SOFT}
          strokeWidth={1}
        />
      ) : (
        <rect
          x={centerX - tableWidth / 2}
          y={centerY - tableHeight / 2}
          width={tableWidth}
          height={tableHeight}
          rx={2}
          fill="none"
          stroke={EXAM_SOFT}
          strokeWidth={1}
        />
      )}

      {seats.map((seat, index) => {
        const angle =
          (-Math.PI / 2) +
          (index / seats.length) *
            Math.PI *
            2;
        const point =
          diagram.arrangementType ===
          "circular"
            ? {
                x:
                  centerX +
                  Math.cos(angle) *
                    ringRadius,
                y:
                  centerY +
                  Math.sin(angle) *
                    ringRadius,
              }
            : (() => {
                const boxPoint =
                  getRectPerimeterPoint(
                    index,
                    seats.length,
                    tableWidth + 76,
                    tableHeight + 76,
                  );

                return {
                  x: centerX + boxPoint.x,
                  y: centerY + boxPoint.y,
                };
              })();
        const radialX =
          point.x - centerX;
        const radialY =
          point.y - centerY;
        const norm =
          Math.hypot(
            radialX,
            radialY,
          ) || 1;
        const ux = radialX / norm;
        const uy = radialY / norm;
        const labelWidth =
          getLabelWidth(seat.label);
        const outwardOffset =
          Math.max(
            12,
            labelWidth / 2 + 5,
          );
        const labelX =
          point.x + ux * outwardOffset;
        const labelY =
          point.y + uy * 12;
        const align =
          Math.abs(ux) < 0.25
            ? "middle"
            : ux > 0
              ? "start"
              : "end";
        const tickX = point.x;
        const tickY = point.y;

        return (
          <g key={`${seat.label}-${seat.position}`}>
            <line
              x1={tickX - ux * 3}
              y1={tickY - uy * 3}
              x2={tickX + ux * 3}
              y2={tickY + uy * 3}
              stroke={EXAM_STROKE}
              strokeWidth={1}
            />
            {renderRadialArrow(
              tickX,
              tickY,
              centerX,
              centerY,
              seat.facing as
                | "center"
                | "outward",
              8,
              4,
            )}
            <SeatLabel
              seat={seat}
              x={
                align === "middle"
                  ? labelX
                  : align === "start"
                    ? labelX + 2
                    : labelX - 2
              }
              y={labelY}
              align={align}
              showConnector={false}
            />
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

export default CircularSeatingDiagram;
