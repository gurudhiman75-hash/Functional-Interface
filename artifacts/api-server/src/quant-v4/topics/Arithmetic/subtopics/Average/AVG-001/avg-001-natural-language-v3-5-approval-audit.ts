import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { runAvg001EditorialV2Pipeline } from "./foundation/editorial-v2-release";
import { getAvg001QuestionEntries } from "./foundation/library";
import {
  applyAvg001NaturalLanguageV35Approved,
  AVG_001_NATURAL_LANGUAGE_V3_5_APPROVED,
  AVG_001_NATURAL_LANGUAGE_V3_5_APPROVED_AT,
} from "./foundation/natural-language-v3-5-approved";
import { applyAvg001NaturalLanguageV35HeaderAlignment } from "./foundation/natural-language-v3-5-header-alignment";
import { runAvg001LocalizedRelease } from "./foundation/localized-release";
import type { Avg001Language, Avg001QuestionPackage } from "./foundation/types";

const outputDirectory = resolve(
  process.cwd(),
  "dist/quant-v4/avg-001-natural-language-v3-5-approved",
);
mkdirSync(outputDirectory, { recursive: true });

const languages: Avg001Language[] = ["en", "hi", "pa"];
const entries = getAvg001QuestionEntries();
assert.equal(entries.length, 425);

function sourceFor(
  qlId: string,
  language: Avg001Language,
  seed: string,
): Avg001QuestionPackage {
  return language === "en"
    ? runAvg001EditorialV2Pipeline({ questionLanguageId: qlId, seed, language })
    : runAvg001LocalizedRelease({ questionLanguageId: qlId, seed, language });
}

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

const records: Record<string, unknown>[] = [];

for (const entry of entries) {
  const seed = `avg-001-natural-language-v3-4:${entry.qlId}`;

  for (const language of languages) {
    const source = sourceFor(entry.qlId, language, seed);
    const reviewed = applyAvg001NaturalLanguageV35HeaderAlignment(source);
    const approved = applyAvg001NaturalLanguageV35Approved(source);

    assert.equal(approved.validation.valid, true, `${entry.qlId}:${language} approval validation failed`);
    assert.equal(approved.seed, seed);
    assert.equal(approved.maturity, "FROZEN");
    assert.equal(approved.publiclyPublishable, true);
    assert.equal(approved.traceability.editorialStatus, "APPROVED");
    assert.equal(approved.traceability.reviewStatus, "APPROVED");
    assert.equal(approved.traceability.publicationState, "PUBLISHED");
    assert.equal(approved.traceability.publiclyPublishable, true);
    assert.equal(approved.traceability.approvalAuthority, "EXPLICIT_USER_PRODUCT_SIGN_OFF");
    assert.equal(approved.traceability.approvedAt, AVG_001_NATURAL_LANGUAGE_V3_5_APPROVED_AT);

    // Approval is metadata-only: the reviewed learner and mathematical corpus is immutable.
    assert.equal(approved.stem, reviewed.stem, `${entry.qlId}:${language} stem changed at approval`);
    assert.deepEqual(approved.options, reviewed.options, `${entry.qlId}:${language} options changed at approval`);
    assert.equal(approved.correctIndex, reviewed.correctIndex);
    assert.equal(approved.answer, reviewed.answer);
    assert.deepEqual(approved.explanation, reviewed.explanation, `${entry.qlId}:${language} explanation changed at approval`);
    assert.deepEqual(approved.parameters.values, reviewed.parameters.values);
    assert.deepEqual(approved.parameters.renderVariables, reviewed.parameters.renderVariables);
    assert.deepEqual(approved.solver.exactAnswer, reviewed.solver.exactAnswer);
    assert.equal(approved.solver.answer, reviewed.solver.answer);
    assert.deepEqual(approved.independentVerification.exactAnswer, reviewed.independentVerification.exactAnswer);
    assert.equal(approved.independentVerification.displayAnswer, reviewed.independentVerification.displayAnswer);
    assert.equal(approved.mathematicalFingerprint, reviewed.mathematicalFingerprint);

    records.push({
      packageId: approved.packageId,
      cpId: approved.canonicalProblemId,
      qlId: approved.questionLanguageId,
      language: approved.language,
      solveMode: approved.solveMode,
      difficulty: approved.difficultyBand,
      answerType: approved.parameters.answerType,
      sharedSeed: seed,
      stem: approved.stem,
      options: approved.options.join("\n"),
      correctIndex: approved.correctIndex,
      correctAnswer: approved.answer,
      keyRule: approved.explanation.lines[0],
      calculation: approved.explanation.lines[1],
      shortcut: approved.explanation.lines[2],
      distractorReasons: approved.explanation.lines[3],
      mathematicalFingerprint: approved.mathematicalFingerprint,
      approvedRelease: AVG_001_NATURAL_LANGUAGE_V3_5_APPROVED,
      maturity: approved.maturity,
      editorialStatus: approved.traceability.editorialStatus,
      reviewStatus: approved.traceability.reviewStatus,
      publicationState: approved.traceability.publicationState,
      publiclyPublishable: approved.publiclyPublishable,
      approvedAt: approved.traceability.approvedAt,
      approvalAuthority: approved.traceability.approvalAuthority,
      validation: approved.validation.valid ? "PASS" : "FAIL",
    });
  }
}

assert.equal(records.length, 1275);
assert.equal(new Set(records.map((record) => record.qlId)).size, 425);
assert.equal(new Set(records.map((record) => record.solveMode)).size, 45);
for (const language of languages) {
  assert.equal(records.filter((record) => record.language === language).length, 425);
}
assert.ok(records.every((record) => record.reviewStatus === "APPROVED"));
assert.ok(records.every((record) => record.publicationState === "PUBLISHED"));
assert.ok(records.every((record) => record.publiclyPublishable === true));
assert.ok(records.every((record) => record.maturity === "FROZEN"));

writeFileSync(
  resolve(outputDirectory, "avg-001-natural-language-v3-5-approved.json"),
  JSON.stringify(records, null, 2),
  "utf8",
);

const headers = Object.keys(records[0]!);
writeFileSync(
  resolve(outputDirectory, "avg-001-natural-language-v3-5-approved.csv"),
  [
    headers.map(csvCell).join(","),
    ...records.map((record) => headers.map((header) => csvCell(record[header]!)).join(",")),
  ].join("\n"),
  "utf8",
);

writeFileSync(
  resolve(outputDirectory, "avg-001-natural-language-v3-5-approved-summary.json"),
  JSON.stringify({
    packageId: "AVG-001",
    approvedRelease: AVG_001_NATURAL_LANGUAGE_V3_5_APPROVED,
    status: "PASS",
    qlCountPerLanguage: 425,
    languageCount: 3,
    totalApprovedRows: records.length,
    solveModeCount: 45,
    sourceSharedSeedsRetained: true,
    learnerAndMathematicalCorpusUnchangedAtApproval: true,
    maturity: "FROZEN",
    editorialStatus: "APPROVED",
    reviewStatus: "APPROVED",
    publicationState: "PUBLISHED",
    publiclyPublishable: true,
    approvedAt: AVG_001_NATURAL_LANGUAGE_V3_5_APPROVED_AT,
    approvalAuthority: "EXPLICIT_USER_PRODUCT_SIGN_OFF",
  }, null, 2),
  "utf8",
);

console.log(
  `PASS AVG-001 V3.5 approval: ${records.length} frozen, approved and published packages preserve the complete reviewed learner and mathematical corpus.`,
);
