import { applyTrg002V4PedagogicDiagramLayer } from "./exam-readiness-v4-pedagogic-diagrams";

type AnyRecord = Record<string, any>;

function sentences(text: string) {
  return text.split(/(?<=[.!?])\s+/u).map((part) => part.trim()).filter(Boolean);
}

function explicitWorkedValue(text: string, keywords: string[]) {
  const matching = sentences(text).filter((sentence) => {
    const lower = sentence.toLowerCase();
    return keywords.some((keyword) => lower.includes(keyword.toLowerCase()));
  });

  for (const sentence of matching) {
    const lastEq = sentence.lastIndexOf("=");
    if (lastEq < 0) continue;
    const tail = sentence.slice(lastEq + 1).trim();
    const match = tail.match(/^([^.;]+?)\s*m\b/u);
    if (match) return `${match[1]!.trim()} m`;
  }

  for (const sentence of matching) {
    const matches = [...sentence.matchAll(/([0-9]+(?:\.\d+)?(?:\s*[+\-−]\s*[0-9]+(?:\.\d+)?)?(?:\s*[+\-−]\s*[0-9]*√[0-9]+)?|[0-9]*√[0-9]+)\s*m\b/gu)];
    if (matches.length) return `${matches[matches.length - 1]![1]!.trim()} m`;
  }
  return null;
}

function normalizeAnswer(value: unknown) {
  return String(value ?? "").replaceAll("−", "-").replace(/\s+/gu, "").replace(/m$/u, "").trim();
}

function orientation(arrow: AnyRecord, points: Map<string, AnyRecord>) {
  const from = points.get(String(arrow.fromPointId));
  const to = points.get(String(arrow.toPointId));
  if (!from || !to) return "OTHER";
  const dx = Math.abs(Number(to.x) - Number(from.x));
  const dy = Math.abs(Number(to.y) - Number(from.y));
  if (dx < 1e-6) return "VERTICAL";
  if (dy < 1e-6) return "HORIZONTAL";
  return "SLOPED";
}

function rangesOverlap(a: AnyRecord, b: AnyRecord, points: Map<string, AnyRecord>) {
  const a1 = points.get(String(a.fromPointId));
  const a2 = points.get(String(a.toPointId));
  const b1 = points.get(String(b.fromPointId));
  const b2 = points.get(String(b.toPointId));
  if (!a1 || !a2 || !b1 || !b2) return false;
  const ao = orientation(a, points);
  if (ao !== orientation(b, points)) return false;
  if (ao === "VERTICAL") {
    if (Math.abs(Number(a1.x) - Number(b1.x)) > 1e-5) return false;
    const amin = Math.min(Number(a1.y), Number(a2.y));
    const amax = Math.max(Number(a1.y), Number(a2.y));
    const bmin = Math.min(Number(b1.y), Number(b2.y));
    const bmax = Math.max(Number(b1.y), Number(b2.y));
    return amin < bmax && bmin < amax;
  }
  if (ao === "HORIZONTAL") {
    if (Math.abs(Number(a1.y) - Number(b1.y)) > 1e-5) return false;
    const amin = Math.min(Number(a1.x), Number(a2.x));
    const amax = Math.max(Number(a1.x), Number(a2.x));
    const bmin = Math.min(Number(b1.x), Number(b2.x));
    const bmax = Math.max(Number(b1.x), Number(b2.x));
    return amin < bmax && bmin < amax;
  }
  return false;
}

function rebalancePedagogicLanes(diagram: AnyRecord) {
  const points = new Map<string, AnyRecord>((diagram.points ?? []).map((point: AnyRecord) => [String(point.id), point]));
  const arrows: AnyRecord[] = diagram.measurementArrows ?? [];
  const pedagogic = arrows.filter((arrow) => String(arrow.kind ?? "").startsWith("PEDAGOGIC_"));
  const base = arrows.filter((arrow) => !String(arrow.kind ?? "").startsWith("PEDAGOGIC_"));
  const used = new Map<string, number>();

  for (const arrow of pedagogic) {
    const o = orientation(arrow, points);
    const overlapsBase = base.filter((candidate) => rangesOverlap(arrow, candidate, points));
    const occupiedSide = overlapsBase[0]?.side === "RIGHT" ? "RIGHT" : "LEFT";
    arrow.side = occupiedSide === "LEFT" ? "RIGHT" : "LEFT";
    const key = `${o}:${arrow.side}`;
    const lane = used.get(key) ?? 0;
    arrow.lane = lane;
    used.set(key, lane + 1);
    arrow.pedagogicIndependentLane = true;
  }
}

export function applyTrg002V4PedagogicDiagramLayerRefined(args: {
  qlId: string;
  diagram: AnyRecord;
  englishStem: string;
  englishExplanationText: string;
  englishAnswer: string;
  topology?: string;
}) {
  const result = applyTrg002V4PedagogicDiagramLayer(args);
  const arrows: AnyRecord[] = result.diagram.measurementArrows ?? [];
  const answer = normalizeAnswer(args.englishAnswer);

  for (const arrow of arrows) {
    const kind = String(arrow.kind ?? "");
    let value: string | null = null;
    let prefix = "";
    if (kind === "PEDAGOGIC_DERIVED_RISE") {
      value = explicitWorkedValue(args.englishExplanationText, ["rise", "height difference", "above eye", "above first roof"]);
      prefix = "rise = ";
    } else if (kind === "PEDAGOGIC_DERIVED_DROP") {
      value = explicitWorkedValue(args.englishExplanationText, ["drop", "vertical difference", "below", "depression"]);
      prefix = "drop = ";
    } else if (kind === "PEDAGOGIC_DERIVED_GROUND_RUN") {
      value = explicitWorkedValue(args.englishExplanationText, ["ground run"]);
      prefix = "run = ";
    }
    if (!value) continue;
    if (normalizeAnswer(value) === answer) continue;
    arrow.label = `${prefix}${value}`;
    arrow.pedagogicExplicitWorkedValue = true;
  }

  result.diagram.measurementArrows = arrows.filter((arrow) => {
    const kind = String(arrow.kind ?? "");
    if (!kind.startsWith("PEDAGOGIC_")) return true;
    const rhs = String(arrow.label ?? "").includes("=") ? String(arrow.label).split("=").pop() : arrow.label;
    return normalizeAnswer(rhs) !== answer;
  });

  rebalancePedagogicLanes(result.diagram);
  result.diagram.reviewDimensionAudit.totalDimensions = result.diagram.measurementArrows.length;
  result.diagram.pedagogicDiagramAudit.finalAnswerLeakCount = 0;
  result.diagram.pedagogicDiagramAudit.explicitWorkedValuePriority = true;
  result.diagram.pedagogicDiagramAudit.independentTeachingLanes = true;
  return result;
}
