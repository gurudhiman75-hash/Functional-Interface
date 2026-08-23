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

function explicitVariableValue(text: string, variable: string) {
  const escaped = variable.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (const sentence of sentences(text)) {
    const match = sentence.match(new RegExp(`\\b${escaped}\\s*=\\s*([0-9]+(?:\\.\\d+)?(?:\\s*[+\\-−]\\s*[0-9]+(?:\\.\\d+)?)?(?:\\s*[+\\-−]\\s*[0-9]*√[0-9]+)?|[0-9]*√[0-9]+)`, "u"));
    if (match) return match[1]!.trim();
  }
  return null;
}

function normalizeAnswer(value: unknown) {
  return String(value ?? "").replaceAll("−", "-").replace(/\s+/gu, "").replace(/m$/u, "").trim();
}

function endpointKey(a: string, b: string) {
  return [a, b].sort().join("::");
}

function pointMap(diagram: AnyRecord) {
  return new Map<string, AnyRecord>((diagram.points ?? []).map((point: AnyRecord) => [String(point.id), point]));
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

function addPedagogicArrow(result: AnyRecord, args: AnyRecord, fromPointId: string, toPointId: string, label: string, fact: string) {
  const diagram = result.diagram;
  const points = pointMap(diagram);
  if (!points.has(fromPointId) || !points.has(toPointId) || !label.trim()) return false;
  const answer = normalizeAnswer(args.englishAnswer);
  const rhs = label.includes("=") ? label.split("=").pop() : label;
  if (normalizeAnswer(rhs) === answer) return false;
  const exists = (diagram.measurementArrows ?? []).some((arrow: AnyRecord) =>
    endpointKey(String(arrow.fromPointId), String(arrow.toPointId)) === endpointKey(fromPointId, toPointId)
      && String(arrow.label) === label);
  if (exists) return false;
  diagram.measurementArrows.push({
    id: `pedagogic-refined-${args.qlId.replace(/[^A-Za-z0-9]/g, "-")}-${diagram.measurementArrows.length + 1}`,
    fromPointId,
    toPointId,
    label,
    side: "LEFT",
    lane: 0,
    kind: `PEDAGOGIC_${fact}`,
    pedagogic: true,
    pedagogicRefined: true,
  });
  result.audit.teachingDimensionsAdded += 1;
  result.audit.explanationFactsVisualized.push(fact);
  return true;
}

function canonicalLevelPoint(diagram: AnyRecord, level: AnyRecord) {
  return (diagram.points ?? []).find((point: AnyRecord) =>
    String(point.label ?? "").startsWith("H")
      && Math.abs(Number(point.x) - Number(level.x)) < 1e-5
      && Math.abs(Number(point.y) - Number(level.y)) < 1e-5) ?? level;
}

function addMatchedEyeLevelFacts(result: AnyRecord, args: AnyRecord) {
  const diagram = result.diagram;
  const points = pointMap(diagram);
  const segments: AnyRecord[] = diagram.segments ?? [];
  for (const eyeLevel of segments.filter((segment) => String(segment.kind) === "EYE_LEVEL")) {
    const from = points.get(String(eyeLevel.fromPointId));
    const to = points.get(String(eyeLevel.toPointId));
    if (!from || !to) continue;
    const eye = from.role === "OBSERVER_EYE" ? from : to.role === "OBSERVER_EYE" ? to : null;
    const rawLevel = eye === from ? to : eye === to ? from : null;
    if (!eye || !rawLevel) continue;
    const level = canonicalLevelPoint(diagram, rawLevel);
    const suffix = String(eyeLevel.id ?? "").replace(/^eye-level-segment-/u, "");
    const sight = segments.find((segment) => String(segment.id) === `sight-${suffix}`)
      ?? segments.find((segment) => String(segment.kind) === "SIGHT_LINE" && String(segment.id).includes(suffix));
    if (!sight) continue;
    const targetId = sight.fromPointId === eye.id ? sight.toPointId : sight.fromPointId;
    const target = points.get(String(targetId));
    if (!target || Math.abs(Number(target.x) - Number(level.x)) > 1e-5) continue;
    if (Number(target.y) < Number(eye.y)) {
      const rise = explicitWorkedValue(args.englishExplanationText, ["rise", "height difference", "above eye", "above first roof", "elevation"]);
      if (rise) addPedagogicArrow(result, args, level.id, target.id, `rise = ${rise}`, "MATCHED_DERIVED_RISE");
    } else if (Number(target.y) > Number(eye.y)) {
      const drop = explicitWorkedValue(args.englishExplanationText, ["drop", "vertical difference", "below", "depression"]);
      if (drop) addPedagogicArrow(result, args, level.id, target.id, `drop = ${drop}`, "MATCHED_DERIVED_DROP");
    }
  }
}

function addDerivedGroundDistance(result: AnyRecord, args: AnyRecord) {
  const diagram = result.diagram;
  const requested = (diagram.measurementArrows ?? []).find((arrow: AnyRecord) => String(arrow.kind ?? "").includes("REQUESTED"));
  const ground = (diagram.segments ?? []).find((segment: AnyRecord) => ["GROUND", "GROUND_UNSCALED"].includes(String(segment.kind)));
  if (!ground) return;
  const key = endpointKey(String(ground.fromPointId), String(ground.toPointId));
  if (requested && endpointKey(String(requested.fromPointId), String(requested.toPointId)) === key) return;
  if ((diagram.measurementArrows ?? []).some((arrow: AnyRecord) => endpointKey(String(arrow.fromPointId), String(arrow.toPointId)) === key)) return;
  const value = explicitWorkedValue(args.englishExplanationText, ["horizontal distance", "horizontal separation", "common horizontal", "depression"]);
  if (value) addPedagogicArrow(result, args, ground.fromPointId, ground.toPointId, `d = ${value}`, "DERIVED_HORIZONTAL_DISTANCE");
}

function upgradeSolvedVariables(result: AnyRecord, args: AnyRecord) {
  const x = explicitVariableValue(args.englishExplanationText, "x");
  const y = explicitVariableValue(args.englishExplanationText, "y");
  for (const arrow of result.diagram.measurementArrows ?? []) {
    const kind = String(arrow.kind ?? "");
    if (x && kind === "PEDAGOGIC_ASSUMED_DISTANCE_X" && normalizeAnswer(x) !== normalizeAnswer(args.englishAnswer)) {
      arrow.label = `x = ${x} m`;
      arrow.pedagogicSolvedHelper = true;
    }
    if (y && kind === "PEDAGOGIC_OPPOSITE_60_DISTANCE_Y" && normalizeAnswer(y) !== normalizeAnswer(args.englishAnswer)) {
      arrow.label = `y = ${y} m`;
      arrow.pedagogicSolvedHelper = true;
    }
  }
}

function observerBetweenTeaching(result: AnyRecord, args: AnyRecord) {
  if (args.qlId !== "TRG-002-QL-079") return;
  const diagram = result.diagram;
  const points = pointMap(diagram);
  const observer = points.get("observer");
  const leftBase = points.get("left-base");
  const rightBase = points.get("right-base");
  if (!observer || !leftBase || !rightBase) return;
  const angles = diagram.angles ?? [];
  const sixtySight = angles.find((angle: AnyRecord) => String(angle.label) === "60°");
  const thirtySight = angles.find((angle: AnyRecord) => String(angle.label) === "30°");
  const baseForAngle = (angle: AnyRecord) => {
    if (!angle) return null;
    const ray = String(angle.rayPointId ?? "");
    if (ray.startsWith("left-")) return leftBase.id;
    if (ray.startsWith("right-")) return rightBase.id;
    return null;
  };
  const sixtyBase = baseForAngle(sixtySight);
  const thirtyBase = baseForAngle(thirtySight);
  const solvedX = explicitVariableValue(args.englishExplanationText, "x");
  if (sixtyBase) addPedagogicArrow(result, args, observer.id, sixtyBase, solvedX ? `x = ${solvedX} m` : "x", "BETWEEN_TARGETS_60_DISTANCE_X");
  if (thirtyBase) addPedagogicArrow(result, args, observer.id, thirtyBase, "32 − x", "BETWEEN_TARGETS_OTHER_DISTANCE");
}

function oppositeGenericTeaching(result: AnyRecord, args: AnyRecord) {
  const diagram = result.diagram;
  const points = pointMap(diagram);
  const left = points.get("left-ground");
  const right = points.get("right-ground");
  const base = points.get("object-base");
  if (!left || !right || !base) return;
  const lower = String(args.englishExplanationText).toLowerCase();
  if (args.qlId === "TRG-002-QL-078") {
    addPedagogicArrow(result, args, base.id, left.id, "x", "OPPOSITE_LEFT_X");
    addPedagogicArrow(result, args, base.id, right.id, "y", "OPPOSITE_RIGHT_Y");
  } else if (args.qlId === "TRG-002-QL-080" && lower.includes("x=3y")) {
    const angles = diagram.angles ?? [];
    const leftAngle = String(angles.find((angle: AnyRecord) => angle.vertexPointId === left.id)?.label ?? "");
    const thirty = leftAngle.includes("30") ? left : right;
    const sixty = thirty === left ? right : left;
    addPedagogicArrow(result, args, base.id, thirty.id, "x = 3y", "OPPOSITE_30_DISTANCE_X");
    addPedagogicArrow(result, args, base.id, sixty.id, "y", "OPPOSITE_60_DISTANCE_Y");
  }
}

function rebalancePedagogicLanes(diagram: AnyRecord) {
  const points = pointMap(diagram);
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
    if (!value || normalizeAnswer(value) === answer) continue;
    arrow.label = `${prefix}${value}`;
    arrow.pedagogicExplicitWorkedValue = true;
  }

  result.diagram.measurementArrows = arrows.filter((arrow) => {
    const kind = String(arrow.kind ?? "");
    if (!kind.startsWith("PEDAGOGIC_")) return true;
    const rhs = String(arrow.label ?? "").includes("=") ? String(arrow.label).split("=").pop() : arrow.label;
    return normalizeAnswer(rhs) !== answer;
  });

  addMatchedEyeLevelFacts(result, args);
  addDerivedGroundDistance(result, args);
  observerBetweenTeaching(result, args);
  oppositeGenericTeaching(result, args);
  upgradeSolvedVariables(result, args);

  result.diagram.measurementArrows = (result.diagram.measurementArrows ?? []).filter((arrow: AnyRecord) => {
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
  result.diagram.pedagogicDiagramAudit.multiStateReasoningAligned = true;
  return result;
}
