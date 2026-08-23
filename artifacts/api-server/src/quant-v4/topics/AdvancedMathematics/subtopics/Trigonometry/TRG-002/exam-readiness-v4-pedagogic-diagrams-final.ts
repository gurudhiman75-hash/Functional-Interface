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

  result.diagram.pedagogicDiagramAudit.exactVariableExpressionsPreserved = true;
  result.diagram.pedagogicDiagramAudit.exactVariablesShown = exactVariablesShown;
  return result;
}
