import type { CircularDiagramScene, CircularTopologySnapshot, PersonId } from "./types.ts";

function escapeXml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function buildCircularDiagram(
  clockwiseOrder: readonly PersonId[],
  topology: CircularTopologySnapshot,
): CircularDiagramScene {
  const centre = { x: 210, y: 210 } as const;
  const radius = 138;
  const seats = clockwiseOrder.map((personId, seatIndex) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * seatIndex) / clockwiseOrder.length;
    return {
      seatIndex,
      personId,
      x: Math.round(centre.x + radius * Math.cos(angle)),
      y: Math.round(centre.y + radius * Math.sin(angle)),
    };
  });

  const landmark = topology.landmark
    ? { id: topology.landmark.id, x: 210, y: 24 } as const
    : undefined;

  const seatSvg = seats.map((seat) => [
    `<circle cx="${seat.x}" cy="${seat.y}" r="25" fill="white" stroke="currentColor" stroke-width="2"/>`,
    `<text x="${seat.x}" y="${seat.y + 5}" text-anchor="middle" font-size="15" font-family="sans-serif">${escapeXml(seat.personId)}</text>`,
    `<line x1="${seat.x}" y1="${seat.y}" x2="${Math.round(centre.x + (radius - 48) * (seat.x - centre.x) / radius)}" y2="${Math.round(centre.y + (radius - 48) * (seat.y - centre.y) / radius)}" stroke="currentColor" stroke-width="1"/>`,
  ].join("")).join("");

  const landmarkSvg = landmark
    ? `<rect x="165" y="5" width="90" height="28" rx="5" fill="white" stroke="currentColor"/><text x="210" y="24" text-anchor="middle" font-size="13" font-family="sans-serif">${escapeXml(landmark.id)}</text><line x1="210" y1="33" x2="210" y2="47" stroke="currentColor" stroke-width="2"/>`
    : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="420" viewBox="0 0 420 420" role="img" aria-label="Solved centre-facing circular seating arrangement">${landmarkSvg}<circle cx="210" cy="210" r="82" fill="none" stroke="currentColor" stroke-width="2"/><text x="210" y="204" text-anchor="middle" font-size="20" font-family="sans-serif">↻</text><text x="210" y="228" text-anchor="middle" font-size="13" font-family="sans-serif">clockwise index</text><text x="210" y="246" text-anchor="middle" font-size="13" font-family="sans-serif">all face centre</text>${seatSvg}</svg>`;

  const prefix = topology.landmark
    ? `Clockwise from the seat nearest the ${topology.landmark.id.toLowerCase()}`
    : `Clockwise from ${clockwiseOrder[0]} (chosen only as a rotation reference)`;

  return {
    width: 420,
    height: 420,
    centre,
    seats,
    landmark,
    svg,
    text: `${prefix}: ${clockwiseOrder.join(" → ")} → ${clockwiseOrder[0]}`,
  };
}
