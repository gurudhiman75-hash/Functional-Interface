import { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface AlligationDiagramProps {
  higherValue: string;
  lowerValue: string;
  meanValue: string;
  leftDifference: string;
  rightDifference: string;
  className?: string;
  compact?: boolean;
}

/**
 * Renders a coaching-book style alligation diagram with SVG lines and positioned labels.
 * 
 * Structure:
 *                higherValue    lowerValue
 *                    \         /
 *                     \       /
 *                      \     /
 *                       meanValue
 *                      /     \
 *                     /       \
 *                  leftDiff  rightDiff
 */
export function AlligationDiagram({
  higherValue,
  lowerValue,
  meanValue,
  leftDifference,
  rightDifference,
  className,
  compact = false,
}: AlligationDiagramProps) {
  const viewBox = useMemo(() => {
    return compact ? "0 0 180 200" : "0 0 280 300";
  }, [compact]);

  const [width, height] = useMemo(() => {
    return compact ? [180, 200] : [280, 300];
  }, [compact]);

  // Responsive measurements
  const [topY, midY, botY] = useMemo(() => {
    return compact
      ? [24, 100, 176]
      : [40, 150, 260];
  }, [compact]);

  const [leftX, centerX, rightX] = useMemo(() => {
    return compact
      ? [30, 90, 150]
      : [50, 140, 230];
  }, [compact]);

  const strokeWidth = compact ? 1.5 : 2;
  const fontSize = compact ? 11 : 14;
  const valueFontSize = compact ? 12 : 15;

  return (
    <svg
      viewBox={viewBox}
      className={cn(
        "w-full max-w-md rounded border border-slate-200 bg-white p-3 shadow-sm",
        className,
      )}
      role="img"
      aria-label="Alligation diagram showing mean value with upper and lower values and their differences"
    >
      {/* Top branch: Higher value */}
      <line
        x1={leftX}
        y1={topY}
        x2={centerX}
        y2={midY}
        stroke="#64748b"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top branch: Lower value */}
      <line
        x1={rightX}
        y1={topY}
        x2={centerX}
        y2={midY}
        stroke="#64748b"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom branch: Left difference */}
      <line
        x1={centerX}
        y1={midY}
        x2={leftX}
        y2={botY}
        stroke="#64748b"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom branch: Right difference */}
      <line
        x1={centerX}
        y1={midY}
        x2={rightX}
        y2={botY}
        stroke="#64748b"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top left label: Higher value */}
      <text
        x={leftX}
        y={topY - 6}
        textAnchor="middle"
        fontSize={valueFontSize}
        fontWeight={600}
        fill="#1e293b"
        className="font-sans"
      >
        {higherValue}
      </text>

      {/* Top right label: Lower value */}
      <text
        x={rightX}
        y={topY - 6}
        textAnchor="middle"
        fontSize={valueFontSize}
        fontWeight={600}
        fill="#1e293b"
        className="font-sans"
      >
        {lowerValue}
      </text>

      {/* Center label: Mean value */}
      <g>
        <rect
          x={centerX - (compact ? 20 : 30)}
          y={midY - (compact ? 10 : 14)}
          width={compact ? 40 : 60}
          height={compact ? 20 : 28}
          rx="3"
          fill="#f0f9ff"
          stroke="#0284c7"
          strokeWidth={1}
        />
        <text
          x={centerX}
          y={midY + (compact ? 2 : 3)}
          textAnchor="middle"
          fontSize={valueFontSize}
          fontWeight={700}
          fill="#0c4a6e"
          className="font-sans"
        >
          {meanValue}
        </text>
      </g>

      {/* Bottom left label: Left difference */}
      <text
        x={leftX}
        y={botY + (compact ? 14 : 20)}
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight={500}
        fill="#475569"
        className="font-sans"
      >
        <tspan fontWeight={600}>{leftDifference}</tspan>
      </text>
      <text
        x={leftX}
        y={botY + (compact ? 24 : 34)}
        textAnchor="middle"
        fontSize={fontSize - 1}
        fill="#64748b"
        className="font-sans"
      >
        (Mean - Lower)
      </text>

      {/* Bottom right label: Right difference */}
      <text
        x={rightX}
        y={botY + (compact ? 14 : 20)}
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight={500}
        fill="#475569"
        className="font-sans"
      >
        <tspan fontWeight={600}>{rightDifference}</tspan>
      </text>
      <text
        x={rightX}
        y={botY + (compact ? 24 : 34)}
        textAnchor="middle"
        fontSize={fontSize - 1}
        fill="#64748b"
        className="font-sans"
      >
        (Higher - Mean)
      </text>

      {/* Footer note */}
      <text
        x={width / 2}
        y={height - (compact ? 4 : 6)}
        textAnchor="middle"
        fontSize={compact ? 9 : 11}
        fill="#94a3b8"
        className="font-sans italic"
      >
        Ratio = {leftDifference} : {rightDifference}
      </text>
    </svg>
  );
}

export default AlligationDiagram;
