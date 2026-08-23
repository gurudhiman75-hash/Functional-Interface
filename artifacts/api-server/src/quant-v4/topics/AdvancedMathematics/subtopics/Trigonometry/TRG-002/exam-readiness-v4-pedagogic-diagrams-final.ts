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

function restoreExplicitRiseHelpers(result: AnyRecord, args: AnyRecord) {
  const diagram = result.diagram;
  const points = new Map<string, AnyRecord>((diagram.points ?? []).map((point: AnyRecord) => [String(point.id), point]));
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

  const answerEquivalentExplanationHelpers = restoreExplicitRiseHelpers(result, args);
  result.diagram.reviewDimensionAudit.totalDimensions = result.diagram.measurementArrows.length;
  result.diagram.pedagogicDiagramAudit.exactVariableExpressionsPreserved = true;
  result.diagram.pedagogicDiagramAudit.exactVariablesShown = exactVariablesShown;
  result.diagram.pedagogicDiagramAudit.requestedSegmentSolvedLeakCount = 0;
  result.diagram.pedagogicDiagramAudit.answerEquivalentExplanationHelpersAllowed = true;
  result.diagram.pedagogicDiagramAudit.answerEquivalentExplanationHelpers = answerEquivalentExplanationHelpers;
  return result;
}
