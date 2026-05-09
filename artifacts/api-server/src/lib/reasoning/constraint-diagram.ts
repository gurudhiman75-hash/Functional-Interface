import type { SeatingDiagramData } from "@workspace/api-zod";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderRow(
  diagram: SeatingDiagramData,
) {
  const cellWidth = 120;
  const height = 70;

  return `<svg viewBox="0 0 ${diagram.seats.length * cellWidth} ${height}" role="img" aria-label="Horizontal constraint row">${diagram.seats
    .map(
      (seat, index) =>
        `<rect x="${index * cellWidth + 4}" y="8" width="${cellWidth - 8}" height="48" rx="8" fill="${seat.isAnswer ? "#dcfce7" : seat.highlighted ? "#fef3c7" : "#ffffff"}" stroke="#64748b"/><text x="${index * cellWidth + cellWidth / 2}" y="38" text-anchor="middle" font-size="13">${escapeXml(seat.label)}</text>`,
    )
    .join("")}</svg>`;
}

export function renderStack(
  diagram: SeatingDiagramData,
) {
  const cellHeight = 58;
  const width = 180;

  return `<svg viewBox="0 0 ${width} ${diagram.seats.length * cellHeight}" role="img" aria-label="Vertical constraint stack">${[...diagram.seats]
    .reverse()
    .map(
      (seat, index) =>
        `<rect x="8" y="${index * cellHeight + 5}" width="${width - 16}" height="46" rx="8" fill="${seat.isAnswer ? "#dcfce7" : seat.highlighted ? "#fef3c7" : "#ffffff"}" stroke="#64748b"/><text x="${width / 2}" y="${index * cellHeight + 34}" text-anchor="middle" font-size="13">${escapeXml(seat.seatLabel ?? "")}: ${escapeXml(seat.label)}</text>`,
    )
    .join("")}</svg>`;
}

export function renderCalendar(
  diagram: SeatingDiagramData,
) {
  return renderRow(diagram);
}

export function renderMatrix(
  rows: Array<{
    entity: string;
    attributes: Record<string, string>;
  }>,
) {
  const rowHeight = 34;
  const width = 360;

  return `<svg viewBox="0 0 ${width} ${(rows.length + 1) * rowHeight}" role="img" aria-label="Constraint matrix"><rect x="0" y="0" width="${width}" height="${(rows.length + 1) * rowHeight}" fill="white" stroke="#64748b"/><text x="20" y="22" font-weight="700">Entity</text><text x="150" y="22" font-weight="700">Attributes</text>${rows
    .map(
      (row, index) =>
        `<line x1="0" y1="${(index + 1) * rowHeight}" x2="${width}" y2="${(index + 1) * rowHeight}" stroke="#cbd5e1"/><text x="20" y="${(index + 2) * rowHeight - 12}">${escapeXml(row.entity)}</text><text x="150" y="${(index + 2) * rowHeight - 12}">${escapeXml(Object.entries(row.attributes).map(([key, value]) => `${key}: ${value}`).join(", "))}</text>`,
    )
    .join("")}</svg>`;
}
