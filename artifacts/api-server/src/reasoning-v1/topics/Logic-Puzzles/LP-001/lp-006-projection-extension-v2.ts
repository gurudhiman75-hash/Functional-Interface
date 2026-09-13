import {
  generateLp006ProjectionBatchV1,
  type Lp006ProjectionCaselet,
  type Lp006ProjectionChild,
} from "./lp-006-projection-extension-v1.ts";

export const LP_006_PROJECTION_EXTENSION_V2 = Object.freeze({
  authorityId: "LP_006_PROJECTION_EXTENSION_V2" as const,
  parentAuthorityId: "LP_006_PROJECTION_EXTENSION_V1" as const,
  status: "PROVISIONAL_REVIEW_CANDIDATE" as const,
  provisionalQlIds: ["LP-QL-045", "LP-QL-046"] as const,
  changesHiddenState: false as const,
  changesExistingClues: false as const,
  changesQuestionSemantics: false as const,
  explanationSequenceNormalized: true as const,
  runtimeMode: "REVIEW_ONLY" as const,
});

function normalizeStepLead(line: string): string {
  const match = line.match(/^\*\*Step (\d+)\*\*\n\n/u);
  if (!match) return line;
  const step = Number(match[1]);
  const prefix = match[0];
  const body = line.slice(prefix.length);
  const leadPattern = /^(?:Start with|Next take|Now use|Then apply) this clue\s*(?:—|:|-)?\s*/u;
  if (!leadPattern.test(body)) return line;
  const normalizedLead = step === 1 ? "Start with this clue: " : "Now use this clue: ";
  return `${prefix}${body.replace(leadPattern, normalizedLead)}`;
}

function normalizeChild(child: Lp006ProjectionChild): Lp006ProjectionChild {
  return {
    ...child,
    explanation: {
      ...child.explanation,
      lines: child.explanation.lines.map(normalizeStepLead),
    },
  };
}

function normalizeCaselet(caselet: Lp006ProjectionCaselet): Lp006ProjectionCaselet {
  return {
    ...caselet,
    projectionChildren: caselet.projectionChildren.map(normalizeChild),
  };
}

export function generateLp006ProjectionBatchV2(seed = "lp-006-projection-v2", count = 8): Lp006ProjectionCaselet[] {
  return generateLp006ProjectionBatchV1(seed, count).map(normalizeCaselet);
}
