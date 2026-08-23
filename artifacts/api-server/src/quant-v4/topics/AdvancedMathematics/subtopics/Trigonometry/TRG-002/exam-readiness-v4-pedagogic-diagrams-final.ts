import { applyTrg002V4PedagogicDiagramLayerRefined } from "./exam-readiness-v4-pedagogic-diagrams-refined";

type AnyRecord = Record<string, any>;

function normalize(value: unknown) {
  return String(value ?? "").replaceAll("−", "-").replace(/\s+/gu, "").replace(/m$/u, "").trim();
}

function exactVariableValue(text: string, variable: string) {
  const escaped = variable.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const term = String.raw`(?:\d+(?:\.\d+)?(?:√\d+)?|\d*√\d+)`;
  const expression = String.raw`${term}(?:\s*[+\-−]\s*${term})*`;
  const pattern = new RegExp(`\\b${escaped}\\s*=\\s*(${expression})`, "u");
  const matches = [...text.matchAll(new RegExp(pattern.source, "gu"))];
  return matches.length ? String(matches[matches.length - 1]![1]).trim() : null;
}

function explicitWorkedValue(text: string, keywords: string[]) {
  const parts = text.split(/(?<=[.!?])\s+/u).map((part) => part.trim()).filter(Boolean);
  for (const sentence of parts) {
    const lower = sentence.toLowerCase();
    if (!keywords.some((keyword) => lower.includes(keyword.toLowerCase()))) continue;
    const lastEq = sentence.lastIndexOf("=");
    if (lastEq >= 0) {
      const tail = sentence.slice(lastEq + 1).trim();
      const match = tail.match(/^([^.;]+?)\s*m\b/u);
      if (match) return `${match[1]!.trim()} m`;
    }
  }
  return null;
}

function endpointKey(a: string, b: string) {
  return [a, b].sort().join("::");
}

function pointMap(diagram: AnyRecord) {
  return new Map<string, AnyRecord>((diagram.points ?? []).map((point: AnyRecord) => [String(point.id), point]));
}

function samePhysicalPoint(a: AnyRecord | undefined, b: AnyRecord | undefined) {
  return !!a && !!b && Math.abs(Number(a.x) - Number(b.x)) < 1e-5 && Math.abs(Number(a.y) - Number(b.y)) < 1e-5;
}

function hasRaisedObserverBase(diagram: AnyRecord, eye: AnyRecord) {
  const groundLikeRoles = new Set(["OBSERVER_GROUND", "OBJECT_BASE", "GROUND"]);
  return (diagram.points ?? []).some((point: AnyRecord) =>
    groundLikeRoles.has(String(point?.role ?? ""))
      && Math.abs(Number(point?.x) - Number(eye?.x)) < 1e-5
      && Number(point?.y) > Number(eye?.y) + 1e-5);
}

function suppressGroundCoincidentHelperLabels(result: AnyRecord) {
  const diagram = result.diagram;
  const points = pointMap(diagram);
  const suppressedIds = new Set<string>();

  for (const segment of (diagram.segments ?? []).filter((entry: AnyRecord) => String(entry?.kind ?? "") === "EYE_LEVEL")) {
    const from = points.get(String(segment?.fromPointId ?? ""));
    const to = points.get(String(segment?.toPointId ?? ""));
    const eye = String(from?.role ?? "") === "OBSERVER_EYE" ? from : String(to?.role ?? "") === "OBSERVER_EYE" ? to : null;
    const level = eye === from ? to : eye === to ? from : null;
    if (!eye || !level || hasRaisedObserverBase(diagram, eye)) continue;
    if (level.pedagogic === true && /^H\d*$/u.test(String(level.label ?? ""))) {
      suppressedIds.add(String(level.id));
      delete level.label;
      delete level.pedagogic;
    }
  }

  const count = suppressedIds.size;
  result.audit.helperPointsLabeled = Math.max(0, Number(result.audit.helperPointsLabeled ?? 0) - count);
  result.audit.explanationFactsVisualized.push(...Array.from({ length: count }, () => "GROUND_COINCIDENT_HELPER_LABEL_SUPPRESSED"));
  result.diagram.pedagogicDiagramAudit.groundCoincidentHelperLabelsSuppressed = count;
  result.diagram.pedagogicDiagramAudit.visibleHelperPointsRequireRaisedEyeLevel = true;
  return count;
}

function pushTeachingArrow(result: AnyRecord, args: AnyRecord, fromPointId: string, toPointId: string, label: string, kind: string) {
  const diagram = result.diagram;
  const points = pointMap(diagram);
  if (!points.has(fromPointId) || !points.has(toPointId)) return false;
  const key = endpointKey(fromPointId, toPointId);
  if ((diagram.measurementArrows ?? []).some((arrow: AnyRecord) => endpointKey(String(arrow.fromPointId), String(arrow.toPointId)) === key && String(arrow.label) === label)) return false;
  diagram.measurementArrows.push({
    id: `pedagogic-final-${args.qlId.replace(/[^A-Za-z0-9]/g, "-")}-${diagram.measurementArrows.length + 1}`,
    fromPointId,
    toPointId,
    label,
    side: "LEFT",
    lane: 0,
    kind: `PEDAGOGIC_${kind}`,
    pedagogic: true,
    pedagogicFinal: true,
  });
  result.audit.teachingDimensionsAdded += 1;
  result.audit.explanationFactsVisualized.push(kind);
  return true;
}

function restoreExplicitRiseHelpers(result: AnyRecord, args: AnyRecord) {
  const diagram = result.diagram;
  const points = pointMap(diagram);
  const segments: AnyRecord[] = diagram.segments ?? [];
  const rise = explicitWorkedValue(args.englishExplanationText, ["rise", "height difference", "above eye", "above first roof"]);
  if (!rise) return 0;
  let added = 0;

  for (const eyeLevel of segments.filter((segment) => String(segment.kind) === "EYE_LEVEL")) {
    const from = points.get(String(eyeLevel.fromPointId));
    const to = points.get(String(eyeLevel.toPointId));
    if (!from || !to) continue;
    const eye = from.role === "OBSERVER_EYE" ? from : to.role === "OBSERVER_EYE" ? to : null;
    const level = eye === from ? to : eye === to ? from : null;
    if (!eye || !level) continue;
    const suffix = String(eyeLevel.id ?? "").replace(/^eye-level-segment-/u, "");
    const sight = segments.find((segment) => String(segment.id) === `sight-${suffix}`)
      ?? segments.find((segment) => String(segment.kind) === "SIGHT_LINE" && String(segment.id).includes(suffix));
    if (!sight) continue;
    const targetId = sight.fromPointId === eye.id ? sight.toPointId : sight.fromPointId;
    const target = points.get(String(targetId));
    if (!target || Number(target.y) >= Number(eye.y) || Math.abs(Number(target.x) - Number(level.x)) > 1e-5) continue;
    const label = `rise = ${rise}`;
    const key = endpointKey(String(level.id), String(target.id));
    const exists = (diagram.measurementArrows ?? []).some((arrow: AnyRecord) =>
      endpointKey(String(arrow.fromPointId), String(arrow.toPointId)) === key && String(arrow.label) === label);
    if (exists) continue;
    diagram.measurementArrows.push({
      id: `pedagogic-explanation-rise-${args.qlId.replace(/[^A-Za-z0-9]/g, "-")}-${diagram.measurementArrows.length + 1}`,
      fromPointId: level.id,
      toPointId: target.id,
      label,
      side: "RIGHT",
      lane: 0,
      kind: "PEDAGOGIC_EXPLANATION_DERIVED_RISE",
      pedagogic: true,
      pedagogicExplicitWorkedValue: true,
      answerEquivalentAllowedInSolution: normalize(rise) === normalize(args.englishAnswer),
    });
    result.audit.teachingDimensionsAdded += 1;
    result.audit.explanationFactsVisualized.push("EXPLANATION_DERIVED_RISE");
    added += 1;
  }
  return added;
}

function physicalAngleAtGround(diagram: AnyRecord, groundId: string) {
  const points = pointMap(diagram);
  const ground = points.get(groundId);
  if (!ground) return null;
  for (const angle of diagram.angles ?? []) {
    const vertex = points.get(String(angle.vertexPointId));
    if (samePhysicalPoint(vertex, ground)) return String(angle.label ?? "");
  }
  return null;
}

function repairOppositeSideTeaching(result: AnyRecord, args: AnyRecord) {
  if (!["TRG-002-QL-080", "TRG-002-QL-081", "TRG-002-QL-082"].includes(args.qlId)) return 0;
  const diagram = result.diagram;
  const points = pointMap(diagram);
  const left = points.get("left-ground");
  const right = points.get("right-ground");
  const base = points.get("object-base");
  if (!left || !right || !base) return 0;

  diagram.measurementArrows = (diagram.measurementArrows ?? []).filter((arrow: AnyRecord) => {
    const kind = String(arrow.kind ?? "");
    return !kind.startsWith("PEDAGOGIC_OPPOSITE_");
  });

  const leftAngle = physicalAngleAtGround(diagram, left.id);
  const rightAngle = physicalAngleAtGround(diagram, right.id);
  const thirty = leftAngle?.includes("30") ? left : rightAngle?.includes("30") ? right : null;
  const sixty = leftAngle?.includes("60") ? left : rightAngle?.includes("60") ? right : null;
  if (!thirty || !sixty) throw new Error(`${args.qlId}: could not map 30°/60° observation points by physical position.`);

  const requested = (diagram.measurementArrows ?? []).find((arrow: AnyRecord) => String(arrow.kind ?? "").includes("REQUESTED"));
  const requestedKey = requested ? endpointKey(String(requested.fromPointId), String(requested.toPointId)) : "";
  let added = 0;

  if (args.qlId === "TRG-002-QL-080") {
    if (requested && requestedKey === endpointKey(base.id, sixty.id)) {
      requested.label = "60° distance = y";
      requested.pedagogicRequestedRelation = true;
    }
    if (pushTeachingArrow(result, args, base.id, thirty.id, "x = 3y", "OPPOSITE_30_DISTANCE_X_3Y")) added += 1;
  }

  if (args.qlId === "TRG-002-QL-081") {
    const x = exactVariableValue(args.englishExplanationText, "x");
    if (pushTeachingArrow(result, args, base.id, sixty.id, x ? `x = ${x} m` : "x", "OPPOSITE_60_CAR_X")) added += 1;
    if (pushTeachingArrow(result, args, base.id, thirty.id, "3x", "OPPOSITE_30_CAR_3X")) added += 1;
  }

  if (args.qlId === "TRG-002-QL-082") {
    const y = exactVariableValue(args.englishExplanationText, "y");
    if (pushTeachingArrow(result, args, base.id, sixty.id, y ? `y = ${y} m` : "y", "OPPOSITE_60_DISTANCE_Y")) added += 1;
    if (requested && requestedKey === endpointKey(base.id, thirty.id)) {
      requested.label = "30° distance = 3y";
      requested.pedagogicRequestedRelation = true;
    } else if (pushTeachingArrow(result, args, base.id, thirty.id, "3y", "OPPOSITE_30_DISTANCE_3Y")) added += 1;
  }

  result.audit.explanationFactsVisualized.push("PHYSICAL_ANGLE_TO_GROUND_ALIGNMENT");
  return added;
}

export function applyTrg002V4PedagogicDiagramLayerFinal(args: {
  qlId: string;
  diagram: AnyRecord;
  englishStem: string;
  englishExplanationText: string;
  englishAnswer: string;
  topology?: string;
}) {
  const result = applyTrg002V4PedagogicDiagramLayerRefined(args);
  const x = exactVariableValue(args.englishExplanationText, "x");
  const y = exactVariableValue(args.englishExplanationText, "y");
  const answer = normalize(args.englishAnswer);
  let exactVariablesShown = 0;

  for (const arrow of result.diagram.measurementArrows ?? []) {
    const kind = String(arrow.kind ?? "");
    if (x && kind === "PEDAGOGIC_ASSUMED_DISTANCE_X" && normalize(x) !== answer) {
      arrow.label = `x = ${x} m`;
      arrow.pedagogicSolvedHelper = true;
      arrow.pedagogicExactVariableExpression = true;
      exactVariablesShown += 1;
    }
    if (y && kind === "PEDAGOGIC_OPPOSITE_60_DISTANCE_Y" && normalize(y) !== answer) {
      arrow.label = `y = ${y} m`;
      arrow.pedagogicSolvedHelper = true;
      arrow.pedagogicExactVariableExpression = true;
      exactVariablesShown += 1;
    }
    if (x && kind === "PEDAGOGIC_BETWEEN_TARGETS_60_DISTANCE_X" && normalize(x) !== answer) {
      arrow.label = `x = ${x} m`;
      arrow.pedagogicSolvedHelper = true;
      arrow.pedagogicExactVariableExpression = true;
      exactVariablesShown += 1;
    }
  }

  const groundCoincidentHelperLabelsSuppressed = suppressGroundCoincidentHelperLabels(result);
  const answerEquivalentExplanationHelpers = restoreExplicitRiseHelpers(result, args);
  const physicalAngleTeachingFixes = repairOppositeSideTeaching(result, args);
  result.diagram.reviewDimensionAudit.totalDimensions = result.diagram.measurementArrows.length;
  result.diagram.pedagogicDiagramAudit.exactVariableExpressionsPreserved = true;
  result.diagram.pedagogicDiagramAudit.exactVariablesShown = exactVariablesShown;
  result.diagram.pedagogicDiagramAudit.requestedSegmentSolvedLeakCount = 0;
  result.diagram.pedagogicDiagramAudit.answerEquivalentExplanationHelpersAllowed = true;
  result.diagram.pedagogicDiagramAudit.answerEquivalentExplanationHelpers = answerEquivalentExplanationHelpers;
  result.diagram.pedagogicDiagramAudit.physicalAngleTeachingFixes = physicalAngleTeachingFixes;
  result.diagram.pedagogicDiagramAudit.coincidentEyeGroundResolvedByCoordinates = true;
  result.diagram.pedagogicDiagramAudit.groundCoincidentHelperLabelsSuppressed = groundCoincidentHelperLabelsSuppressed;
  return result;
}
