import type { SylLocale } from "../foundation/types";
import type { SylExplanationTrace } from "./types";

function polishEnglishCompactRule(value: string): string {
  const noMatch = /^No (.+) is (.+)$/u.exec(value);
  if (noMatch) return `No ${noMatch[1]} are ${noMatch[2]}`;
  return value;
}

function polishEnglishNaturalRule(value: string): string {
  return value.replace(
    /^At least one (.+) stays outside (.+)\.$/u,
    "At least one member of $1 stays outside $2.",
  );
}

function polishEnglishShortcut(value: string): string {
  if (value.startsWith("Rewrite ‘Only")) return "Only A are B ⇒ All B are A";
  if (value.startsWith("Split ‘Only a few")) {
    return "Only a few A are B ⇒ Some A are B + Some A are not B";
  }
  return value;
}

export function polishLearnerExplanation(
  explanation: SylExplanationTrace,
  locale: SylLocale,
): SylExplanationTrace {
  if (locale !== "en-IN") return explanation;

  return {
    ...explanation,
    tier1Concept: {
      ...explanation.tier1Concept,
      premiseBreakdown: explanation.tier1Concept.premiseBreakdown.map((point) => ({
        ...point,
        naturalRule: polishEnglishNaturalRule(point.naturalRule),
        compactRule: polishEnglishCompactRule(point.compactRule),
      })),
    },
    tier3Shortcut: {
      ...explanation.tier3Shortcut,
      shortcut: polishEnglishShortcut(explanation.tier3Shortcut.shortcut),
    },
  };
}
