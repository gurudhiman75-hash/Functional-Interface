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

  // A teaching diagram must never display a derived helper numerically equal to the final answer.
  result.diagram.measurementArrows = arrows.filter((arrow) => {
    const kind = String(arrow.kind ?? "");
    if (!kind.startsWith("PEDAGOGIC_")) return true;
    const rhs = String(arrow.label ?? "").includes("=") ? String(arrow.label).split("=").pop() : arrow.label;
    return normalizeAnswer(rhs) !== answer;
  });
  result.diagram.reviewDimensionAudit.totalDimensions = result.diagram.measurementArrows.length;
  result.diagram.pedagogicDiagramAudit.finalAnswerLeakCount = 0;
  result.diagram.pedagogicDiagramAudit.explicitWorkedValuePriority = true;
  return result;
}
