import { applyAvg001Cp004EditorialV2ReviewedCandidate } from "./cp004-editorial-v2-distractor-polish";
import type { Avg001QuestionPackage } from "./types";

export const AVG_001_CP004_EDITORIAL_V2_FINAL =
  "AVG-CP-004 editorial v2 review candidate final context polish v1";

function scenarioKey(pkg: Avg001QuestionPackage) {
  return String(pkg.parameters.scenarioVariant)
    .replace(/^findCount_/, "")
    .replace(/^findAverage_/, "");
}

export function applyAvg001Cp004EditorialV2FinalCandidate(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const candidate = applyAvg001Cp004EditorialV2ReviewedCandidate(pkg);
  if (candidate.canonicalProblemId !== "AVG-CP-004" || candidate.language !== "en") {
    return candidate;
  }

  const lines = [...candidate.explanation.lines];
  if (
    candidate.solveMode === "findCombinedAverageOfTwoGroups" ||
    candidate.solveMode === "findCombinedAverageOfThreeOrFourGroups"
  ) {
    lines[0] = "📌 Key rule: Convert each subgroup average into its corresponding subtotal, add the subtotals and divide by the combined count.";
  }

  if (candidate.solveMode === "findAverageSpeedEqualTime") {
    const scenario = scenarioKey(candidate);
    if (/machine|worker|abstract/i.test(scenario)) {
      lines[0] = "📌 Key rule: Equal durations give the two rates equal weight.";
      lines[2] = "⚡ Exam speed shortcut: When two rates apply for equal durations, take their arithmetic mean.";
    }
  }

  return {
    ...candidate,
    explanation: { lines },
    traceability: {
      ...candidate.traceability,
      cp004EditorialV2Final: AVG_001_CP004_EDITORIAL_V2_FINAL,
    },
  };
}
