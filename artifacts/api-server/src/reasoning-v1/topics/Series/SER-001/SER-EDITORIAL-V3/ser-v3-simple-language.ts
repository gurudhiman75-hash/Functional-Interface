import type { SerV3NaturalExplanation } from "./ser-v3-natural-pedagogical";

export const SER_V3_OPTION_LABELS = ["1", "2", "3", "4"] as const;

export const SER_V3_SIMPLE_HEADINGS = {
  rule: "📌 **Rule**",
  solution: "📝 **Solution**",
  shortcut: "⚡ **Quick Method**",
  trap: "⚠️ **Common Mistake**",
} as const;

const UNNECESSARY_JARGON =
  /\b(?:anomaly|authority|canonical|cyclic|derivation|governing|inverse|lane|normalisation|normalization|phase|recurrence|subset)\b/i;

function simplifyLine(value: string): string {
  const sentenceReplacements: readonly [string, string][] = [
    [
      "Notice how the terms are connected rather than reading them as separate values.",
      "Look at how one term changes into the next.",
    ],
    [
      "The useful clue is the operation that repeats from one valid term to the next.",
      "Find the step that repeats from one correct term to the next.",
    ],
    [
      "Let us first identify the relationship that stays consistent across the known terms.",
      "First, find the rule that works for the known terms.",
    ],
    [
      "A quick comparison of the known terms reveals the governing pattern.",
      "Compare the known terms to spot the rule.",
    ],
  ];

  let result = value;
  for (const [from, to] of sentenceReplacements) result = result.replaceAll(from, to);

  const replacements: readonly [RegExp, string][] = [
    [/\bLane 1\b/g, "Odd-position row"],
    [/\bLane 2\b/g, "Even-position row"],
    [/\bsame-lane\b/gi, "same-row"],
    [/\bsame lane\b/gi, "same row"],
    [/\btarget lane\b/gi, "needed row"],
    [/\blane-step\b/gi, "row step"],
    [/\blanes\b/gi, "rows"],
    [/\blane\b/gi, "row"],
    [/\bcanonical sequence\b/gi, "correct series"],
    [/\bcanonical\b/gi, "correct"],
    [/\bexpected progression\b/gi, "correct series"],
    [/\bprogression\b/gi, "series"],
    [/\banomaly\b/gi, "wrong term"],
    [/\bsubset indexes\b/gi, "positions in this shorter list"],
    [/\bsubset index\b/gi, "position in this list"],
    [/\bsubset jump\b/gi, "jump in this shorter list"],
    [/\bsubset\b/gi, "shorter list"],
    [/\bcyclic alphabet shift\b/gi, "letter jump that starts again after Z"],
    [/\bcyclic wrap arithmetic\b/gi, "wrap calculation"],
    [/\bcyclic wrap\b/gi, "wrap after Z"],
    [/\bcyclic\b/gi, "wrapping"],
    [/\bnormalisation arithmetic\b/gi, "wrap calculation"],
    [/\bnormalization arithmetic\b/gi, "wrap calculation"],
    [/\bnormalisation\b/gi, "wrap"],
    [/\bnormalization\b/gi, "wrap"],
    [/\brecurrence\b/gi, "rule"],
    [/\binverse operation\b/gi, "reverse operation"],
    [/\binverse\b/gi, "reverse"],
    [/\bgoverning pattern\b/gi, "rule"],
    [/\bgoverning\b/gi, "main"],
    [/\boperation schedule\b/gi, "order of operations"],
    [/\bphase\b/gi, "order"],
    [/\bvalid term\b/gi, "correct term"],
    [/\bcommon difference\b/gi, "same gap"],
    [/\bfixed ratio\b/gi, "same multiplier"],
    [/\bderive\b/gi, "work out"],
    [/\bderivation\b/gi, "solution"],
    [/\bestablish\b/gi, "show"],
    [/\brecovered term\b/gi, "found term"],
    [/\brecovered value\b/gi, "found value"],
    [/\bmental anchors?\b/gi, "quick checks"],
    [/\bmain anchors?\b/gi, "quick checks"],
  ];

  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }

  return result.replace(/\s+/g, " ").trim();
}

export function simplifySerV3Explanation(
  explanation: SerV3NaturalExplanation,
): SerV3NaturalExplanation {
  return {
    ...explanation,
    corePattern: simplifyLine(explanation.corePattern),
    derivation: explanation.derivation.map(simplifyLine),
    examSpeedShortcut: simplifyLine(explanation.examSpeedShortcut),
    commonTrap: {
      ...explanation.commonTrap,
      warning: simplifyLine(explanation.commonTrap.warning),
      optionWarnings: explanation.commonTrap.optionWarnings.map(simplifyLine),
    },
  };
}

export function hasUnnecessarySerV3Jargon(
  explanation: SerV3NaturalExplanation,
): boolean {
  const text = [
    explanation.corePattern,
    ...explanation.derivation,
    explanation.examSpeedShortcut,
    explanation.commonTrap.warning,
    ...explanation.commonTrap.optionWarnings,
  ].join(" ");
  return UNNECESSARY_JARGON.test(text);
}
