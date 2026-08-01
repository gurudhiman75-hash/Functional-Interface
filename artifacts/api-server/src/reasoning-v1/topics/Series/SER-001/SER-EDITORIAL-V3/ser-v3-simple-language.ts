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
    [
      "Separate alternate positions before doing any arithmetic.",
      "Put the 1st, 3rd, 5th... terms in one row and the 2nd, 4th, 6th... terms in another.",
    ],
    [
      "Split the series into alternate positions.",
      "Put the 1st, 3rd, 5th... terms in one row and the 2nd, 4th, 6th... terms in another.",
    ],
    [
      "First separate the expected lanes.",
      "First write the odd-position and even-position rows.",
    ],
  ];

  let result = value;
  for (const [from, to] of sentenceReplacements) result = result.replaceAll(from, to);

  result = result
    .replace(/a letter jump that starts again after Z of \$\+(\d+)\$/g, (_match, amount: string) =>
      `a forward jump of $${amount}$ letters`)
    .replace(/a letter jump that starts again after Z of \$-(\d+)\$/g, (_match, amount: string) =>
      `a backward jump of $${amount}$ letters`)
    .replace(/\[\\text\{(?:vowel|consonant) \}\d+\]/g, "");

  const replacements: readonly [RegExp, string][] = [
    [/\bOption A\b/g, "Choice 1"],
    [/\bOption B\b/g, "Choice 2"],
    [/\bOption C\b/g, "Choice 3"],
    [/\bOption D\b/g, "Choice 4"],
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
    [/\bsubset indexes\b/gi, "place numbers"],
    [/\bsubset index\b/gi, "place number"],
    [/\bsubset jump\b/gi, "jump in this letter list"],
    [/\bsubset\b/gi, "letter list"],
    [/\bcyclic alphabet shift\b/gi, "letter jump"],
    [/\bcyclic wrap arithmetic\b/gi, "wrap calculation"],
    [/\bcyclic wrap\b/gi, "wrap"],
    [/\bcyclic\b/gi, "repeating"],
    [/\bnormalisation arithmetic\b/gi, "wrap calculation"],
    [/\bnormalization arithmetic\b/gi, "wrap calculation"],
    [/\bnormalisation\b/gi, "wrap"],
    [/\bnormalization\b/gi, "wrap"],
    [/\brecurrence\b/gi, "rule"],
    [/\binverse operation\b/gi, "move backward"],
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
    [/\brecover\b/gi, "find"],
    [/\brecovered term\b/gi, "found term"],
    [/\brecovered value\b/gi, "found value"],
    [/\bmental anchors?\b/gi, "quick checks"],
    [/\bmain anchors?\b/gi, "quick checks"],
    [/\btransitions\b/gi, "moves"],
    [/\btransition\b/gi, "move"],
    [/\bforward shift\b/gi, "forward jump"],
    [/\bconfirmed shift\b/gi, "letter jump"],
    [/\bwrapping shift\b/gi, "letter jump"],
    [/\btarget position\b/gi, "needed place"],
    [/\bthe target belongs to\b/gi, "the needed place is in"],
    [/\bthe target is in\b/gi, "the needed place is in"],
    [/\bat the target\b/gi, "at this place"],
    [/\btarget\b/gi, "needed place"],
    [/\badjacent terms\b/gi, "neighbouring terms"],
    [/\brequired term\b/gi, "answer"],
    [/\bplausible partial-pattern result, but it fails the complete rule\b/gi, "may look close, but it does not follow the full rule"],
    [/\bpartial-pattern result\b/gi, "close-looking answer"],
    [/\bcomplete rule\b/gi, "full rule"],
    [/\bthe reverse operation must be used\b/gi, "move backward instead"],
    [/\breverse operation must be used\b/gi, "move backward instead"],
    [/\bordered vowel set\b/gi, "vowel list"],
    [/\bordered consonant set\b/gi, "consonant list"],
    [/\bstandard alphabet positions are shown as quick checks\b/gi, "the letter numbers are only used to check the count"],
    [/\bstandard alphabet positions remain the quick checks\b/gi, "the letter numbers are only used to check the count"],
    [/\bpositions in this shorter list\b/gi, "place numbers"],
    [/\bposition in this list\b/gi, "place number"],
    [/\ballowed shorter list\b/gi, "allowed-letter list"],
    [/\b(vowel|consonant) shorter list\b/gi, "$1 list"],
    [/\braw alphabet gap\b/gi, "full-alphabet gap"],
    [/\bverify forward\b/gi, "check by moving forward"],
  ];

  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }

  result = result
    .replace(
      /apply the same letter jump each time/gi,
      "move by the same number of letters each time; start again from the other end after crossing A or Z",
    )
    .replace(
      /At this place, continue inside the (vowel|consonant) list:/gi,
      "For this place, keep counting in the $1 list:",
    );

  const backwardListResult = result.match(/^The first known term is .*which is (.+)\.$/);
  if (backwardListResult && result.includes("\\bmod")) {
    result = `Counting backward in the letter list gives ${backwardListResult[1]}.`;
  }

  const shortcutResult = result.match(/^Use the place numbers.*lands on (.+)\.$/);
  if (shortcutResult) {
    result = `Count backward in the vowel or consonant list. This gives ${shortcutResult[1]}.`;
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
