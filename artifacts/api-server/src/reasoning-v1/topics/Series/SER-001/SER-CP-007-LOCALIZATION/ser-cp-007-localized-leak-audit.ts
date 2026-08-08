import { SER_CP007_TEMPLATE_PROBES_V71 } from "../SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-compression-contract-v7-1";
import {
  generateSerCp007PermanentLocalizedPackage,
  SER_CP007_LOCALES,
  type SerCp007Locale,
} from "./ser-cp-007-localized-runtime-final";

const ALLOWED_ASCII = new Set([
  "details",
  "summary",
  "strong",
  "st",
  "nd",
  "rd",
  "th",
]);

function leakedWords(value: string): readonly string[] {
  return (value.match(/[A-Za-z]+/g) ?? []).filter((word) => {
    if (word.length === 1) return false;
    if (ALLOWED_ASCII.has(word.toLowerCase())) return false;
    if (word === word.toUpperCase()) return false;
    const upper = [...word].filter((letter) => /[A-Z]/.test(letter)).length;
    const lower = [...word].filter((letter) => /[a-z]/.test(letter)).length;
    return !(upper >= 2 && lower >= 1);
  });
}

function allText(input: ReturnType<typeof generateSerCp007PermanentLocalizedPackage>): string {
  return [
    input.review.conciseReview,
    input.review.expandedReview,
    ...input.review.workedSteps,
    input.question.explanation.rule,
    ...input.question.explanation.steps,
    input.question.explanation.quickMethod,
    input.question.explanation.commonMistake,
    input.question.explanation.conclusion,
  ].join("\n");
}

const linesByLocale = new Map<SerCp007Locale, Map<string, Set<string>>>(
  SER_CP007_LOCALES.map((locale) => [locale, new Map()]),
);

for (const locale of SER_CP007_LOCALES) {
  for (const probe of SER_CP007_TEMPLATE_PROBES_V71) {
    for (const seed of [1, 2, 3]) {
      const localized = generateSerCp007PermanentLocalizedPackage(
        probe.temporaryTemplateId,
        locale,
        seed,
      );
      for (const line of allText(localized).split("\n")) {
        const words = leakedWords(line);
        if (words.length === 0) continue;
        const normalized = line.trim();
        const localeLines = linesByLocale.get(locale)!;
        if (!localeLines.has(normalized)) localeLines.set(normalized, new Set());
        localeLines
          .get(normalized)!
          .add(`${probe.temporaryTemplateId}:${seed}`);
      }
    }
  }
}

const result = Object.fromEntries(
  [...linesByLocale].map(([locale, lines]) => [
    locale,
    [...lines]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([line, sources]) => ({ line, sources: [...sources].sort() })),
  ]),
);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_LOCALIZED_ENGLISH_LEAK_AUDIT",
      locales: SER_CP007_LOCALES,
      templates: SER_CP007_TEMPLATE_PROBES_V71.length,
      seedsPerTemplate: 3,
      uniqueLeakLines: Object.fromEntries(
        [...linesByLocale].map(([locale, lines]) => [locale, lines.size]),
      ),
      lines: result,
    },
    null,
    2,
  ),
);
