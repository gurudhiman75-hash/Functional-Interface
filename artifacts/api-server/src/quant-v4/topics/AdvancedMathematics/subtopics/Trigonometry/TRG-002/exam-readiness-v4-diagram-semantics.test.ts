import { readFileSync } from "node:fs";
import { join } from "node:path";

type AnyRecord = Record<string, any>;

const outDir = join(process.cwd(), "artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/review-artifacts/exam-readiness-v4");
const jsonPath = join(outDir, "TRG-002-V4-EXAM-READINESS-REVIEW.json");
const pack = JSON.parse(readFileSync(jsonPath, "utf8"));

const falseObjectHeightQls = new Set(["TRG-002-QL-035", "TRG-002-QL-067", "TRG-002-QL-069", "TRG-002-QL-095"]);
const falseHorizontalQls = new Set(["TRG-002-QL-042", "TRG-002-QL-070", "TRG-002-QL-071", "TRG-002-QL-072"]);

function pointMap(diagram: AnyRecord) {
  return new Map<string, AnyRecord>((diagram.points ?? []).map((point: AnyRecord) => [point.id, point]));
}
function coordinateKey(point: AnyRecord | undefined) {
  if (!point) return "missing";
  return `${Number(point.x).toFixed(4)},${Number(point.y).toFixed(4)}`;
}
function geometricEndpointKey(fromPointId: string, toPointId: string, points: Map<string, AnyRecord>) {
  return [coordinateKey(points.get(fromPointId)), coordinateKey(points.get(toPointId))].sort().join("::");
}
function normalizedRadians(value: number) {
  while (value > Math.PI) value -= 2 * Math.PI;
  while (value < -Math.PI) value += 2 * Math.PI;
  return value;
}
function explicitSlopedLength(stem: string, label: string) {
  const number = label.replace(/\s*m\s*$/u, "").trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return [
    new RegExp(`line of sight[^.]{0,60}${number}\\s*m`, "iu"),
    new RegExp(`${number}\\s*m(?:\\s+long)?\\s+(?:ladder|guy\\s+wire|supporting\\s+wire|wire)`, "iu"),
    new RegExp(`(?:ladder|guy\\s+wire|supporting\\s+wire|wire)[^.]{0,45}${number}\\s*m`, "iu"),
  ].some((pattern) => pattern.test(stem));
}

if (pack.records.length !== 96) throw new Error(`Expected 96 records, got ${pack.records.length}.`);
let angleChecks = 0;
let semanticCorrections = 0;
let totalDimensions = 0;

for (const row of pack.records as AnyRecord[]) {
  const qlId = String(row.qlId);
  const diagram = row.solutionDiagram;
  if (diagram?.semanticDiagramAudit?.status !== "PASS") throw new Error(`${qlId}: semantic diagram audit missing.`);
  semanticCorrections += Number(diagram.semanticDiagramAudit.structuralCorrections?.length ?? 0);
  const points = pointMap(diagram);
  const arrows: AnyRecord[] = diagram.measurementArrows ?? [];
  totalDimensions += arrows.length;
  if (arrows.length < 2) throw new Error(`${qlId}: fewer than two meaningful dimensions after semantic repair.`);

  for (const arrow of arrows) {
    const kind = String(arrow.kind ?? "");
    if (kind === "REVIEW_GIVEN_SIGHT_LINE" && !explicitSlopedLength(row.english.stem, String(arrow.label ?? ""))) {
      throw new Error(`${qlId}: sight-line value ${arrow.label} is not explicitly a sloped length in the stem.`);
    }
    if (kind === "REVIEW_GIVEN_OBJECT_HEIGHT" && falseObjectHeightQls.has(qlId)) {
      throw new Error(`${qlId}: numeric coincidence still mislabels a derived vertical as a given.`);
    }
    if (kind === "REVIEW_GIVEN_HORIZONTAL_SEPARATION" && falseHorizontalQls.has(qlId)) {
      throw new Error(`${qlId}: numeric coincidence still mislabels a derived horizontal as a given.`);
    }
    if (qlId === "TRG-002-QL-079" && kind === "REVIEW_DERIVED_HELPER_OBJECT_HEIGHT") {
      throw new Error(`${qlId}: answer-equivalent equal-pillar helper still leaks the requested height.`);
    }
  }

  const dimensionKeys = new Set<string>();
  for (const arrow of arrows) {
    const key = `${geometricEndpointKey(arrow.fromPointId, arrow.toPointId, points)}::${String(arrow.label)}`;
    if (dimensionKeys.has(key)) throw new Error(`${qlId}: duplicate physical dimension ${arrow.label}.`);
    dimensionKeys.add(key);
  }

  const supportKeys = new Set<string>();
  for (const segment of diagram.segments ?? []) {
    if (String(segment.kind) !== "SIGHT_LINE") continue;
    const key = geometricEndpointKey(segment.fromPointId, segment.toPointId, points);
    if (supportKeys.has(key)) throw new Error(`${qlId}: duplicate sight/support line remains on the same physical segment.`);
    supportKeys.add(key);
    if (segment.semanticKind && !["LADDER", "WIRE"].includes(String(segment.semanticKind))) {
      throw new Error(`${qlId}: unexpected semantic support kind ${segment.semanticKind}.`);
    }
  }
  if ((diagram.segments ?? []).some((segment: AnyRecord) => ["LADDER", "WIRE"].includes(String(segment.kind)))) {
    throw new Error(`${qlId}: ladder/wire still renders through auxiliary dashed styling.`);
  }

  for (const angle of diagram.angles ?? []) {
    const label = String(angle.label ?? "");
    const match = label.match(/(\d+(?:\.\d+)?)°/);
    if (!match) continue;
    const vertex = points.get(angle.vertexPointId);
    const ray = points.get(angle.rayPointId);
    if (!vertex || !ray) throw new Error(`${qlId}: angle ${label} references a missing point.`);
    const target = Math.atan2(Number(ray.y) - Number(vertex.y), Number(ray.x) - Number(vertex.x));
    const start = angle.referenceDirection === "LEFT" ? Math.PI : 0;
    const actual = Math.abs(normalizedRadians(target - start)) * 180 / Math.PI;
    const expected = Number(match[1]);
    if (Math.abs(actual - expected) > 0.75) throw new Error(`${qlId}: angle label ${label} disagrees with rendered geometry (${actual.toFixed(2)}°).`);
    angleChecks += 1;
  }
}

const q27 = pack.records.find((row: AnyRecord) => row.qlId === "TRG-002-QL-027");
const q27Twenty = q27.solutionDiagram.measurementArrows.filter((arrow: AnyRecord) => arrow.label === "20 m");
if (q27Twenty.length !== 1 || new Set([q27Twenty[0].fromPointId, q27Twenty[0].toPointId]).size !== 2 || ![q27Twenty[0].fromPointId, q27Twenty[0].toPointId].includes("shadow-60") || ![q27Twenty[0].fromPointId, q27Twenty[0].toPointId].includes("shadow-30")) {
  throw new Error("QL027: 20 m must appear exactly once, between the two shadow endpoints.");
}

const q34 = pack.records.find((row: AnyRecord) => row.qlId === "TRG-002-QL-034");
const q34Labels = new Set(q34.solutionDiagram.points.map((point: AnyRecord) => point.label).filter(Boolean));
const q34Angles = new Set(q34.solutionDiagram.angles.map((angle: AnyRecord) => angle.label));
if (!q34Labels.has("S₆₀") || !q34Labels.has("S₃₀") || !q34Angles.has("60°") || !q34Angles.has("30°")) {
  throw new Error("QL034: changed-shadow diagram must show both 60° and 30° shadow states.");
}
if (!q34.solutionDiagram.measurementArrows.some((arrow: AnyRecord) => arrow.kind === "REVIEW_GIVEN_OLD_SHADOW" && arrow.label === "5 m" && arrow.fromPointId === "object-base" && arrow.toPointId === "shadow-tip-old")) {
  throw new Error("QL034: the stated 5 m old shadow is missing from the 60° state.");
}

for (const [qlId, expectedAngle] of [["TRG-002-QL-037", "60°"], ["TRG-002-QL-039", "45°"], ["TRG-002-QL-040", "30°"]] as const) {
  const row = pack.records.find((record: AnyRecord) => record.qlId === qlId);
  if (!row.solutionDiagram.angles.some((angle: AnyRecord) => angle.label === expectedAngle && angle.vertexPointId === "ladder-base")) {
    throw new Error(`${qlId}: required ladder ground angle ${expectedAngle} is missing.`);
  }
  if (!row.solutionDiagram.segments.some((segment: AnyRecord) => segment.kind === "SIGHT_LINE" && segment.semanticKind === "LADDER")) {
    throw new Error(`${qlId}: ladder must render as a solid primary support line.`);
  }
}

console.log(`TRG002_V4_DIAGRAM_SEMANTICS_PASS qls=96 angleGeometryChecks=${angleChecks} semanticCorrections=${semanticCorrections} dimensions=${totalDimensions} ql027ShadowDifference=correct ql034TwoStateShadow=complete ladderAngles=complete supportDuplicates=0 falseNumericAssignments=0 answerEquivalentHelperLeaks=0`);
