import { strict as assert } from "node:assert";
import { runTmw001ChapterPipeline } from "./foundation/chapter-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const targetedQlIds = [
  "TMW-QL-021",
  "TMW-QL-023",
  "TMW-QL-024",
  "TMW-QL-025",
  "TMW-QL-026",
  "TMW-QL-030",
  "TMW-QL-031",
  "TMW-QL-032",
  "TMW-QL-034",
  "TMW-QL-035",
  "TMW-QL-036",
  "TMW-QL-037",
  "TMW-QL-038",
  "TMW-QL-039",
  "TMW-QL-040",
  "TMW-QL-041",
  "TMW-QL-042",
  "TMW-QL-043",
  "TMW-QL-044",
  "TMW-QL-045",
  "TMW-QL-046",
  "TMW-QL-049",
  "TMW-QL-050",
  "TMW-QL-051",
  "TMW-QL-052",
  "TMW-QL-054",
  "TMW-QL-056",
  "TMW-QL-057",
] as const;

function checkpointNumber(qlId: string): number {
  return Number(qlId.slice(-3)) <= 34 ? 2 : 3;
}

function reviewSeed(qlId: string): string {
  return `tmw-cp${String(checkpointNumber(qlId)).padStart(3, "0")}-localization:${qlId}:0`;
}

const blocked: Record<TmwLocalizedLanguage, RegExp[]> = {
  hi: [
    /दर संबंध सीधे लगाने पर उत्तर/,
    /संबंध को सही क्रम और आधार में लगाने पर उत्तर/,
  ],
  pa: [
    /ਦਰ ਦਾ ਸੰਬੰਧ ਸਿੱਧਾ ਲਗਾਉਣ ਉੱਤੇ ਉੱਤਰ/,
    /ਸੰਬੰਧ ਨੂੰ ਸਹੀ ਕ੍ਰਮ ਅਤੇ ਆਧਾਰ ਵਿੱਚ ਲਗਾਉਣ ਉੱਤੇ ਉੱਤਰ/,
  ],
};

const normalizedByLanguage: Record<TmwLocalizedLanguage, Set<string>> = {
  hi: new Set<string>(),
  pa: new Set<string>(),
};
let reviewedRows = 0;

for (const qlId of targetedQlIds) {
  for (const language of languages) {
    const question = runTmw001ChapterPipeline({
      questionLanguageId: qlId,
      seed: reviewSeed(qlId),
      language,
    });
    assert.equal(
      question.validation.valid,
      true,
      `${qlId}:${language}:${question.validation.errors.join(" | ")}`,
    );
    assert.equal(question.explanation.shortcut.steps.length, 1);
    const shortcut = question.explanation.shortcut.steps[0] as string;
    for (const pattern of blocked[language]) {
      assert.equal(
        pattern.test(shortcut),
        false,
        `${qlId}:${language}: generic shortcut remains: ${shortcut}`,
      );
    }
    assert.equal(
      shortcut.includes(question.solution.answerText),
      true,
      `${qlId}:${language}: shortcut does not use the generated answer: ${shortcut}`,
    );
    assert.equal(
      /\{answer\}/.test(shortcut),
      false,
      `${qlId}:${language}: unresolved shortcut placeholder`,
    );
    normalizedByLanguage[language].add(
      shortcut
        .replace(/\\\([\s\S]*?\\\)/g, "<MATH>")
        .replace(/\d+(?:\.\d+)?/g, "<N>"),
    );
    reviewedRows += 1;
  }
}

assert.equal(reviewedRows, targetedQlIds.length * languages.length);
assert.equal(normalizedByLanguage.hi.size, targetedQlIds.length);
assert.equal(normalizedByLanguage.pa.size, targetedQlIds.length);

console.log(JSON.stringify({
  chapter: "TMW-001",
  wave: "MULTILINGUAL_EXPLANATION_NATURALNESS",
  targetedQls: targetedQlIds.length,
  reviewedRows,
  hindiDistinctShortcutMethods: normalizedByLanguage.hi.size,
  punjabiDistinctShortcutMethods: normalizedByLanguage.pa.size,
  genericShortcutFindings: 0,
  status: "PASS",
}, null, 2));
