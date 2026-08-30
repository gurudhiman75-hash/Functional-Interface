import type { GeoDiagramModel } from "../../../../../shared/geometry";

const polarPoint = (
  id: string,
  label: string,
  centerX: number,
  centerY: number,
  radius: number,
  degrees: number,
  labelPosition: GeoDiagramModel["points"][number]["labelPosition"],
): GeoDiagramModel["points"][number] => {
  const radians = degrees * Math.PI / 180;
  return {
    id,
    label,
    x: centerX + radius * Math.cos(radians),
    y: centerY + radius * Math.sin(radians),
    labelPosition,
  };
};

function circumcentreDiagram(model: GeoDiagramModel): GeoDiagramModel {
  const A = { id: "A", label: "A", x: 30, y: 150, labelPosition: "SW" as const };
  const B = { id: "B", label: "B", x: 190, y: 150, labelPosition: "SE" as const };
  const C = { id: "C", label: "C", x: 65, y: 30, labelPosition: "N" as const };
  const M = { id: "M", label: "M", x: 110, y: 150, labelPosition: "S" as const };
  const N = { id: "N", label: "N", x: 47.5, y: 90, labelPosition: "W" as const };

  // O is the exact visual intersection of the two displayed perpendicular bisectors.
  // AB is horizontal, so its perpendicular bisector is x = 110.
  // AC has vector (35,-120), so a perpendicular direction is (120,35).
  const t = (M.x - N.x) / 120;
  const O = {
    id: "O",
    label: "O",
    x: M.x,
    y: N.y + 35 * t,
    labelPosition: "NE" as const,
  };

  return {
    ...model,
    points: [A, B, C, M, N, O],
    segments: [
      { id: "AM", fromPointId: "A", toPointId: "M" },
      { id: "MB", fromPointId: "M", toPointId: "B" },
      { id: "AN", fromPointId: "A", toPointId: "N" },
      { id: "NC", fromPointId: "N", toPointId: "C" },
      { id: "BC", fromPointId: "B", toPointId: "C" },
      { id: "OM", fromPointId: "M", toPointId: "O", extent: "RAY", style: "CONSTRUCTION", extension: 34 },
      { id: "ON", fromPointId: "N", toPointId: "O", extent: "RAY", style: "CONSTRUCTION", extension: 34 },
    ],
  };
}

function semicircleDiagram(model: GeoDiagramModel): GeoDiagramModel {
  const centerX = 100;
  const centerY = 100;
  const radius = 70;
  return {
    ...model,
    points: [
      { id: "O", label: "O", x: centerX, y: centerY, labelPosition: "S" },
      { id: "A", label: "A", x: centerX - radius, y: centerY, labelPosition: "W" },
      { id: "B", label: "B", x: centerX + radius, y: centerY, labelPosition: "E" },
      polarPoint("P", "P", centerX, centerY, radius, -60, "NE"),
    ],
    angleMarks: [
      { id: "angle-apb", firstPointId: "A", vertexPointId: "P", secondPointId: "B", label: "x", radius: 20, labelRadius: 38 },
    ],
  };
}

function twoTangentsDiagram(model: GeoDiagramModel): GeoDiagramModel {
  const centerX = 100;
  const centerY = 100;
  const radius = 70;
  const thetaDegrees = 62;
  const theta = thetaDegrees * Math.PI / 180;
  const contactX = centerX + radius * Math.cos(theta);
  const offsetY = radius * Math.sin(theta);
  const tangentIntersectionX = centerX + radius / Math.cos(theta);

  return {
    ...model,
    points: [
      { id: "O", label: "O", x: centerX, y: centerY, labelPosition: "W" },
      { id: "A", label: "A", x: contactX, y: centerY - offsetY, labelPosition: "NW" },
      { id: "B", label: "B", x: contactX, y: centerY + offsetY, labelPosition: "SW" },
      { id: "P", label: "P", x: tangentIntersectionX, y: centerY, labelPosition: "E" },
    ],
    angleMarks: [
      { id: "central-aob", firstPointId: "A", vertexPointId: "O", secondPointId: "B", label: "124°", radius: 22, labelRadius: 47 },
      { id: "angle-apb", firstPointId: "A", vertexPointId: "P", secondPointId: "B", label: "x", radius: 22, labelRadius: 40 },
    ],
  };
}

function tangentChordDiagram(model: GeoDiagramModel): GeoDiagramModel {
  const centerX = 100;
  const centerY = 100;
  const radius = 70;
  const T = polarPoint("T", "T", centerX, centerY, radius, 0, "E");
  const A = polarPoint("A", "A", centerX, centerY, radius, -76, "N");
  const B = polarPoint("B", "B", centerX, centerY, radius, 165, "W");
  const P = { id: "P", label: "P", x: T.x, y: 18, labelPosition: "NE" as const };

  return {
    ...model,
    points: [
      { id: "O", label: "O", x: centerX, y: centerY, labelPosition: "SW" },
      T,
      A,
      B,
      P,
    ],
    segments: [
      { id: "PT", fromPointId: "T", toPointId: "P", extent: "RAY", extension: 18 },
      { id: "TA", fromPointId: "T", toPointId: "A" },
      { id: "BT", fromPointId: "B", toPointId: "T" },
      { id: "BA", fromPointId: "B", toPointId: "A" },
    ],
    angleMarks: [
      { id: "alternate-angle", firstPointId: "T", vertexPointId: "B", secondPointId: "A", label: "38°", radius: 19, labelRadius: 38 },
      { id: "tangent-chord-angle", firstPointId: "P", vertexPointId: "T", secondPointId: "A", label: "x", radius: 20, labelRadius: 39 },
    ],
  };
}

export function remediateWave1Diagram(
  temporaryPrototypeId: string,
  model: GeoDiagramModel,
): GeoDiagramModel {
  switch (temporaryPrototypeId) {
    case "GEO-TMP-GAP-CP006-CIRCUMCENTRE-IDENTIFY-V1":
      return circumcentreDiagram(model);
    case "GEO-TMP-GAP-CP011-SEMICIRCLE-ANGLE-V1":
      return semicircleDiagram(model);
    case "GEO-TMP-GAP-CP012-ANGLE-BETWEEN-TANGENTS-V1":
      return twoTangentsDiagram(model);
    case "GEO-TMP-GAP-CP012-TANGENT-CHORD-V1":
      return tangentChordDiagram(model);
    default:
      return model;
  }
}
