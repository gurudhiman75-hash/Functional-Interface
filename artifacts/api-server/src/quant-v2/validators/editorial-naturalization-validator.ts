import type { ReasoningGraph } from "../reasoning/reasoning-graph-types";
import type { EditorialRealization } from "../editorial/editorial-types";
import type { ValidationResult } from "./problem-validator";

const SYNTHETIC_WORDING = [
  "initial value",
  "given percentage relation",
  "use the next relation",
  "for a product",
  "apply the percentage change",
  "work back to the base value",
  "find the percentage difference",
] as const;

const CONNECTOR_PATTERN = /^(So,|Now,|Hence,|Therefore,|Thus,)\b/gmu;

function sentenceOpening(stem: string) {
  return stem.split(/[,.]/u)[0]?.trim().toLowerCase() ?? "";
}

function largestShare(counts: Map<string, number>) {
  let total = 0;
  let largest = 0;
  for (const count of counts.values()) {
    total += count;
    largest = Math.max(largest, count);
  }

  return total === 0 ? 0 : largest / total;
}

export function validateEditorialNaturalization(
  realization: EditorialRealization,
  graph?: ReasoningGraph,
): ValidationResult {
  const issues: string[] = [];
  const text = `${realization.stem}\n${realization.explanation}`.toLowerCase();

  for (const phrase of SYNTHETIC_WORDING) {
    if (text.includes(phrase)) {
      issues.push(`Synthetic wording detected: ${phrase}.`);
    }
  }

  if (realization.naturalization.naturalizationScore < 80) {
    issues.push(
      `Naturalization score is too low: ${realization.naturalization.naturalizationScore}.`,
    );
  }
  if (realization.naturalization.phraseVariants.length === 0) {
    issues.push("No phrase variants were recorded.");
  }
  if (realization.naturalization.explanationPatternIds.length === 0) {
    issues.push("No explanation rhythm patterns were recorded.");
  }
  if (
    graph &&
    !graph.shortcutEquation &&
    realization.naturalization.shortcutSurfaced
  ) {
    issues.push("Shortcut was surfaced even though the graph has no shortcut.");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function validateEditorialNaturalizationBatch(
  realizations: readonly EditorialRealization[],
): ValidationResult {
  const issues: string[] = [];
  const rhythmCounts = new Map<string, number>();
  const phraseCounts = new Map<string, number>();
  const openingCounts = new Map<string, number>();
  const stemPatternCounts = new Map<string, number>();
  const connectorCounts = new Map<string, number>();
  const rhythmPatternCounts = new Map<string, number>();
  let repeatedRun = 1;
  let previousOpening = "";
  let maxRepeatedRun = 1;

  for (const realization of realizations) {
    const opening = sentenceOpening(realization.stem);
    openingCounts.set(opening, (openingCounts.get(opening) ?? 0) + 1);
    stemPatternCounts.set(
      realization.naturalization.stemPatternId,
      (stemPatternCounts.get(realization.naturalization.stemPatternId) ?? 0) + 1,
    );
    rhythmCounts.set(
      realization.naturalization.rhythmProfile,
      (rhythmCounts.get(realization.naturalization.rhythmProfile) ?? 0) + 1,
    );

    for (const phrase of realization.naturalization.phraseVariants) {
      phraseCounts.set(phrase, (phraseCounts.get(phrase) ?? 0) + 1);
    }
    for (const pattern of realization.naturalization.explanationPatternIds) {
      rhythmPatternCounts.set(
        pattern,
        (rhythmPatternCounts.get(pattern) ?? 0) + 1,
      );
    }
    for (const match of realization.explanation.matchAll(CONNECTOR_PATTERN)) {
      const connector = match[1] ?? "";
      connectorCounts.set(connector, (connectorCounts.get(connector) ?? 0) + 1);
    }

    if (opening === previousOpening) {
      repeatedRun += 1;
    } else {
      repeatedRun = 1;
      previousOpening = opening;
    }
    maxRepeatedRun = Math.max(maxRepeatedRun, repeatedRun);
  }

  if (rhythmCounts.size < Math.min(4, realizations.length)) {
    issues.push("Explanation rhythm diversity is too narrow.");
  }
  if (stemPatternCounts.size < Math.min(10, realizations.length)) {
    issues.push("Stem pattern diversity is too narrow.");
  }
  if (openingCounts.size < Math.min(10, realizations.length)) {
    issues.push("Opening structure diversity is too narrow.");
  }
  if (rhythmPatternCounts.size < Math.min(10, realizations.length)) {
    issues.push("Explanation pattern diversity is too narrow.");
  }
  if (largestShare(phraseCounts) > 0.35) {
    issues.push("One editorial action phrase is overused.");
  }
  if (largestShare(connectorCounts) > 0.5) {
    issues.push("One transition phrase is overused.");
  }
  if (maxRepeatedRun > 2) {
    issues.push(`Repeated opening run is too long: ${maxRepeatedRun}.`);
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
