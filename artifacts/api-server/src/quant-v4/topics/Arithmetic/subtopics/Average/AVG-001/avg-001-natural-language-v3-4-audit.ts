import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  applyAvg001NaturalLanguageV34Final,
  AVG_001_NATURAL_LANGUAGE_V3_4_REVIEW,
} from "./foundation/natural-language-v3-4-final";
import { runAvg001EditorialV2Pipeline } from "./foundation/editorial-v2-release";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001LocalizedRelease } from "./foundation/localized-release";
import type { Avg001Language, Avg001QuestionPackage } from "./foundation/types";

const out = resolve(process.cwd(), "dist/quant-v4/avg-001-natural-language-v3-4-review");
mkdirSync(out, { recursive: true });
const languages: Avg001Language[] = ["en", "hi", "pa"];
const entries = getAvg001QuestionEntries();
assert.equal(entries.length, 425);

function sourceFor(qlId: string, language: Avg001Language, seed: string): Avg001QuestionPackage {
  return language === "en"
    ? runAvg001EditorialV2Pipeline({ questionLanguageId: qlId, seed, language })
    : runAvg001LocalizedRelease({ questionLanguageId: qlId, seed, language });
}

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function gcd(left: number, right: number) {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function numericalKey(value: string) {
  const cleaned = value.replaceAll(",", "").replaceAll("₹", "").trim();
  const ratio = cleaned.match(/(-?\d+)\s*:\s*(-?\d+)/);
  if (ratio) {
    const left = Number(ratio[1]);
    const right = Number(ratio[2]);
    const divisor = gcd(left, right);
    return `ratio:${left / divisor}:${right / divisor}`;
  }
  const number = cleaned.match(/-?\d+(?:\.\d+)?/);
  return number ? `number:${Number(number[0])}` : `text:${cleaned}`;
}

function visibleNumericCounts(stem: string) {
  const counts = new Map<number, number>();
  for (const match of stem.replaceAll(",", "").matchAll(/-?\d+(?:\.\d+)?/g)) {
    const value = Number(match[0]);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

function assertEnglishVisibleGivensPreserved(
  localizedStem: string,
  englishStem: string,
  label: string,
) {
  const englishCounts = visibleNumericCounts(englishStem);
  const localizedCounts = visibleNumericCounts(localizedStem);
  for (const [value, count] of englishCounts) {
    assert.ok(
      (localizedCounts.get(value) ?? 0) >= count,
      `${label} omits English visible given ${value}`,
    );
  }
}

function isAgeContext(question: Avg001QuestionPackage) {
  return /\b(?:age|ages|aged|year|years|old)\b/i.test(question.stem);
}

function isCurrencyContext(question: Avg001QuestionPackage) {
  return question.stem.includes("₹") || question.options.some((option) => option.includes("₹"));
}

const records: Record<string, unknown>[] = [];

for (const entry of entries) {
  const seed = `avg-001-natural-language-v3-4:${entry.qlId}`;
  const sources = Object.fromEntries(
    languages.map((language) => [language, sourceFor(entry.qlId, language, seed)]),
  ) as Record<Avg001Language, Avg001QuestionPackage>;
  const questions = Object.fromEntries(
    languages.map((language) => [language, applyAvg001NaturalLanguageV34Final(sources[language])]),
  ) as Record<Avg001Language, Avg001QuestionPackage>;

  const englishSource = sources.en;
  const english = questions.en;

  for (const language of languages) {
    const source = sources[language];
    const question = questions[language];
    const text = [question.stem, ...question.options, ...question.explanation.lines].join("\n");
    const worked = question.explanation.lines[1] ?? "";

    assert.equal(question.seed, seed, `${entry.qlId}:${language} did not use the shared seed`);
    assert.equal(question.questionLanguageId, entry.qlId);
    assert.equal(question.language, language);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.equal(question.explanation.lines.length, 4);
    assert.equal(question.maturity, "MANUAL_REVIEW");
    assert.equal(question.publiclyPublishable, false);
    assert.equal(
      question.validation.valid,
      true,
      `${entry.qlId}:${language} failed V3.4 validation: ${question.validation.checks
        .filter((check) => !check.passed)
        .map((check) => `${check.name}=${check.message}`)
        .join("; ")}`,
    );
    assert.ok(worked.includes("$$"), `${entry.qlId}:${language} lacks displayed working`);
    assert.ok((worked.match(/\d+(?:\.\d+)?/g)?.length ?? 0) >= 3, `${entry.qlId}:${language} under-demonstrates working`);
    assert.ok(question.explanation.lines[3]?.includes(question.answer));
    assert.doesNotMatch(text, /\[[A-Z][A-Z0-9_]+\]/);
    assert.doesNotMatch(text, /(?<!\\)(?:div|times)(?=[0-9\s({])/);

    if (language !== "en") {
      assert.doesNotMatch(text, /\b(?:units?|marks?|years?|runs?|operating days?)\b/i);
      if (isCurrencyContext(question)) {
        assert.ok(question.options.every((option) => /^-?₹/.test(option)), `${entry.qlId}:${language} currency options lack ₹`);
        assert.ok(/^-?₹/.test(question.answer), `${entry.qlId}:${language} currency answer lacks ₹`);
      }
    } else if (!isAgeContext(question)) {
      assert.doesNotMatch(
        `${question.options.join(" ")} ${question.answer} ${question.explanation.lines.join(" ")}`,
        /\byears?\b/i,
        `${entry.qlId}:en leaks an age suffix into a non-age context`,
      );
    }

    assert.equal(source.mathematicalFingerprint, englishSource.mathematicalFingerprint, `${entry.qlId}:${language} fingerprint desync`);
    assert.deepEqual(source.parameters.values, englishSource.parameters.values, `${entry.qlId}:${language} canonical parameter desync`);
    assert.deepEqual(source.solver.exactAnswer, englishSource.solver.exactAnswer, `${entry.qlId}:${language} exact-answer desync`);
    assert.equal(source.correctIndex, englishSource.correctIndex, `${entry.qlId}:${language} option-key desync`);
    assert.equal(question.correctIndex, english.correctIndex, `${entry.qlId}:${language} reviewed option-key desync`);
    assert.equal(numericalKey(question.answer), numericalKey(english.answer), `${entry.qlId}:${language} display-answer desync`);
    assertEnglishVisibleGivensPreserved(question.stem, english.stem, `${entry.qlId}:${language}`);
    assert.deepEqual(
      question.options.map(numericalKey),
      english.options.map(numericalKey),
      `${entry.qlId}:${language} option-value/order desync`,
    );

    records.push({
      packageId: question.packageId,
      cpId: question.canonicalProblemId,
      qlId: question.questionLanguageId,
      language: question.language,
      solveMode: question.solveMode,
      difficulty: question.difficultyBand,
      answerType: question.parameters.answerType,
      sharedSeed: seed,
      stem: question.stem,
      options: question.options.join("\n"),
      correctIndex: question.correctIndex,
      correctAnswer: question.answer,
      keyRule: question.explanation.lines[0],
      calculation: question.explanation.lines[1],
      shortcut: question.explanation.lines[2],
      distractorReasons: question.explanation.lines[3],
      mathematicalFingerprint: question.mathematicalFingerprint,
      reviewCandidate: AVG_001_NATURAL_LANGUAGE_V3_4_REVIEW,
      sourceReleaseId: String(source.traceability.releaseId ?? ""),
      validation: question.validation.valid ? "PASS" : "FAIL",
      reviewStatus: "PENDING",
    });
  }
}

assert.equal(records.length, 1275);
assert.equal(new Set(records.map((record) => record.qlId)).size, 425);
assert.equal(new Set(records.map((record) => record.solveMode)).size, 45);
for (const language of languages) {
  assert.equal(records.filter((record) => record.language === language).length, 425);
}

const genericPhrases = [
  "contains a small arithmetic error",
  "गणना में छोटी गलती करता है",
  "ਗਣਨਾ ਵਿੱਚ ਛੋਟੀ ਗਲਤੀ ਕਰਦਾ ਹੈ",
];
const genericReasonOccurrences = records.reduce(
  (total, record) => total + genericPhrases.reduce(
    (subtotal, phrase) => subtotal + String(record.distractorReasons).split(phrase).length - 1,
    0,
  ),
  0,
);
assert.equal(genericReasonOccurrences, 0, `Generic distractor reasons remain: ${genericReasonOccurrences}`);

const ql008 = records.find((record) => record.qlId === "AVG-QL-008" && record.language === "en")!;
assert.doesNotMatch(`${ql008.options} ${ql008.correctAnswer} ${ql008.calculation}`, /\byears?\b/i);
assert.match(`${ql008.options} ${ql008.correctAnswer}`, /\b(?:components?|units?)\b/i);
const ql011 = records.find((record) => record.qlId === "AVG-QL-011" && record.language === "en")!;
assert.doesNotMatch(`${ql011.options} ${ql011.correctAnswer} ${ql011.calculation}`, /\byears?\b/i);
assert.match(`${ql011.options} ${ql011.correctAnswer}`, /\bkm\b/i);

writeFileSync(
  resolve(out, "avg-001-natural-language-v3-4-review.json"),
  JSON.stringify(records, null, 2),
  "utf8",
);
const headers = Object.keys(records[0]!);
writeFileSync(
  resolve(out, "avg-001-natural-language-v3-4-review.csv"),
  [
    headers.map(csvCell).join(","),
    ...records.map((record) => headers.map((header) => csvCell(record[header]!)).join(",")),
  ].join("\n"),
  "utf8",
);
writeFileSync(
  resolve(out, "avg-001-natural-language-v3-4-summary.json"),
  JSON.stringify({
    packageId: "AVG-001",
    reviewCandidate: AVG_001_NATURAL_LANGUAGE_V3_4_REVIEW,
    status: "PASS",
    sourceReleases: ["AVG-001-EN-v2", "AVG-001-HI-v1", "AVG-001-PA-v1"],
    sourceReleasesUnchanged: true,
    qlCountPerLanguage: 425,
    languageCount: 3,
    totalReviewRows: records.length,
    solveModeCount: 45,
    reviewStatus: "PENDING_PRODUCT_REVIEW",
    genericReasonOccurrences,
    validation: {
      sharedSeedPerQlAcrossLanguages: true,
      canonicalParameterParity: true,
      exactAnswerParity: true,
      mathematicalFingerprintParity: true,
      englishVisibleGivensPreservedInLocalizedStems: true,
      englishOptionValueAndOrderAuthority: true,
      correctOptionIndexParity: true,
      nonAgeYearSuffixLeakageRejected: true,
      ql008FactoryUnitResolved: true,
      ql011DistanceUnitResolved: true,
      localizedCurrencySymbolsAndIndianGroupingRequired: true,
      signedCurrencyDisplaysAccepted: true,
      optionSpecificDistractorReasonsRequired: true,
      publiclyPublishable: false,
    },
  }, null, 2),
  "utf8",
);

console.log(
  `PASS AVG-001 natural-language V3.4 review: ${records.length} rows with shared numerical authority and unit/currency integrity. Manual product review remains pending.`,
);
