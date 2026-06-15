import { strict as assert } from "node:assert";
import fs from "node:fs";
import path from "node:path";
import {
  generatePct002CoverageAudit,
  generatePct002Batch,
  renderPct002CoverageAuditMarkdown,
  renderPct002FreezeRecordMarkdown,
  renderPct002HumanReviewCsv,
  renderPct002MaturityAuditMarkdown,
} from "./coverage-auditor";
import { getAnswerType, getQuestionEntry, getRequiredVariables, getTaskKind, renderTemplate, validatePct002Libraries } from "./library";
import { getPct002ActiveCanonicalProblemIds } from "./parameter-generator";
import { runPct002Pipeline } from "./pipeline";
import { solvePct002 } from "./solver";
import { PCT_002_ARCHETYPE_ID, type Pct002CanonicalProblemId, type Pct002Parameters, type Pct002Variables } from "./types";

const packageDir = path.join(process.cwd(), "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002");
const cpIds = getPct002ActiveCanonicalProblemIds();
const seenCp = new Set<string>();
const seenDifficulty = new Set<string>();
const seenQuestions = new Map<string, number>();

const libraryValidation = validatePct002Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("; "));

function packageParams(cpId: Pct002CanonicalProblemId, qlId: string, variables: Pct002Variables): Pct002Parameters {
  return {
    archetypeId: PCT_002_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: `${cpId}:${qlId}:fixed`,
    questionLanguageId: qlId,
    explanationId: `PCT-ES-${cpId.slice(-3)}`,
    language: "en",
    difficultyBand: getQuestionEntry(cpId, qlId, "en").difficulty,
    taskKind: getTaskKind(cpId, qlId),
    answerType: getAnswerType(cpId, qlId),
    requiredVariables: getRequiredVariables(cpId, qlId),
    variables,
    sourceTrace: {
      questionLanguageSource: "question-language.en.json",
      explanationSource: "explanation.en.json",
      variableRangeSource: "variable-ranges.library.json",
    },
  };
}

function assertFixedCase(cpId: Pct002CanonicalProblemId, qlId: string, variables: Pct002Variables, expectedAnswer: string, expectedType: string) {
  const params = packageParams(cpId, qlId, variables);
  const solver = solvePct002(params);
  const question = renderTemplate(getQuestionEntry(cpId, qlId, "en").template, variables);
  assert.equal(solver.answer, expectedAnswer, `${qlId} answer mismatch for ${question}`);
  assert.equal(solver.answerType, expectedType);
  assert.equal(params.answerType, expectedType);
  for (const variable of params.requiredVariables) {
    assert.equal(question.includes(`{${variable}}`), false, `${qlId} did not render ${variable}`);
  }
}

assertFixedCase("PCT-CP-001", "PCT-QL-001", { groupAPercentage: 60, groupBPercentage: 50, neitherPercentage: 20 }, "30%", "PERCENT");
assertFixedCase("PCT-CP-002", "PCT-QL-005", { correctNumerator: 200, correctDenominator: 1000, wrongNumerator: 500, wrongDenominator: 1000 }, "150%", "PERCENT");
assertFixedCase("PCT-CP-002", "PCT-QL-011", { correctDivisor: 500, wrongDivisor: 1000 }, "50%", "PERCENT");
assertFixedCase("PCT-CP-003", "PCT-QL-014", { salesAmount: 3000, thresholdAmount: 1000, baseCommissionRate: 10, bonusCommissionRate: 20 }, "500", "ABSOLUTE");
assertFixedCase("PCT-CP-004", "PCT-QL-023", { malePercentage: 40, maleTraitPercentage: 30, femaleTraitPercentage: 20 }, "24%", "PERCENT");
assertFixedCase("PCT-CP-005", "PCT-QL-032", { initialVolume: 100, replacementVolume: 20, numberOfOperations: 2 }, "64%", "PERCENT");
assertFixedCase("PCT-CP-006", "PCT-QL-038", { polledPercentage: 80, invalidPercentage: 10, winnerPercentage: 60, voteMargin: 144 }, "1000", "COUNT");
assertFixedCase("PCT-CP-006", "PCT-QL-044", { initialCount: 1000, firstPassPercentage: 50, secondPassPercentage: 40, thirdPassPercentage: 20 }, "40", "COUNT");

assertFixedCase("PCT-CP-001", "PCT-QL-047", { groupAPercentage: 50, groupBPercentage: 40, groupCPercentage: 30, groupABPercentage: 20, groupBCPercentage: 15, groupACPercentage: 10, groupABCPercentage: 5 }, "80%", "PERCENT");
assertFixedCase("PCT-CP-001", "PCT-QL-048", { groupAPercentage: 50, groupBPercentage: 40, groupCPercentage: 30, groupABPercentage: 20, groupBCPercentage: 15, groupACPercentage: 10, groupABCPercentage: 5 }, "20%", "PERCENT");
assertFixedCase("PCT-CP-003", "PCT-QL-050", { totalBase: 25000, tier1Limit: 10000, tier2Limit: 20000, tier1Rate: 5, tier2Rate: 10, tier3Rate: 15 }, "2250", "ABSOLUTE");
assertFixedCase("PCT-CP-003", "PCT-QL-053", { totalResult: 740, tier1Limit: 10000, tier1Rate: 5, tier2Rate: 8 }, "13000", "ABSOLUTE");
assertFixedCase("PCT-CP-005", "PCT-QL-056", { initialVolume: 100, replacementRate1: 20, replacementRate2: 10, replacementRate3: 25 }, "54%", "PERCENT");

for (let index = 0; index < 1000; index += 1) {
  const cpId = cpIds[index % cpIds.length]!;
  const en = runPct002Pipeline(cpId, { language: "en", seed: `pct-002-test:${index}` });
  const hi = runPct002Pipeline(cpId, {
    language: "hi",
    seed: `pct-002-test:${index}`,
    questionLanguageId: en.questionLanguageId,
    difficultyBand: en.difficultyBand,
  });
  const pa = runPct002Pipeline(cpId, {
    language: "pa",
    seed: `pct-002-test:${index}`,
    questionLanguageId: en.questionLanguageId,
    difficultyBand: en.difficultyBand,
  });

  for (const pkg of [en, hi, pa]) {
    assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
    assert.ok(pkg.reasoningGraph.nodes.some((node) => node.id === "answer"));
    assert.ok(pkg.reasoningGraph.nodes.some((node) => node.id === "answerType"));
    assert.ok(pkg.explanation.lines.length > 0);
    assert.ok(pkg.stem.length > 0);
    assert.ok(pkg.answer.length > 0);
  }

  assert.equal(en.answer, hi.answer);
  assert.equal(en.answer, pa.answer);
  assert.equal(en.solver.answer, en.answer);
  assert.equal(runPct002Pipeline(cpId, { language: "en", seed: `pct-002-test:${index}`, questionLanguageId: en.questionLanguageId, difficultyBand: en.difficultyBand }).answer, en.answer);

  seenCp.add(en.canonicalProblemId);
  seenDifficulty.add(en.difficultyBand);
  seenQuestions.set(en.stem, (seenQuestions.get(en.stem) ?? 0) + 1);
}

for (const cpId of cpIds) assert.equal(seenCp.has(cpId), true, `${cpId} not covered`);
for (const difficulty of ["Easy", "Medium", "Hard"]) assert.equal(seenDifficulty.has(difficulty), true, `${difficulty} not covered`);

const duplicateCount = [...seenQuestions.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
const duplicateRate = duplicateCount / 1000;
assert.ok(duplicateRate < 0.8, `Duplicate rate too high: ${duplicateRate}`);

const preFreeze = generatePct002CoverageAudit(500, "en");
const maturity = generatePct002CoverageAudit(1000, "en");
assert.equal(preFreeze.audit.generationFailures, 0);
assert.equal(preFreeze.audit.validationFailures, 0);
assert.equal(preFreeze.audit.renderFailures, 0);
assert.equal(preFreeze.audit.solverFailures, 0);
assert.equal(preFreeze.audit.unusedQlIds.length, 0);
assert.equal(preFreeze.audit.unusedEsIds.length, 0);
assert.equal(preFreeze.audit.crossLanguageConsistencyFailures, 0);
assert.equal(preFreeze.audit.libraryValidationFailures.length, 0);
assert.equal(maturity.audit.generationFailures, 0);
assert.equal(maturity.audit.validationFailures, 0);
assert.equal(maturity.audit.renderFailures, 0);
assert.equal(maturity.audit.solverFailures, 0);
assert.equal(maturity.audit.unusedQlIds.length, 0);
assert.equal(maturity.audit.unusedEsIds.length, 0);
assert.equal(maturity.audit.crossLanguageConsistencyFailures, 0);
assert.equal(maturity.audit.libraryValidationFailures.length, 0);

const humanReviewEn = generatePct002Batch(180, "en");
const humanReviewHi = generatePct002Batch(180, "hi");
const humanReviewPa = generatePct002Batch(180, "pa");

fs.writeFileSync(path.join(packageDir, "pct-002-human-review-en.csv"), `${renderPct002HumanReviewCsv(humanReviewEn)}\n`, "utf8");
fs.writeFileSync(path.join(packageDir, "pct-002-human-review-hi.csv"), `${renderPct002HumanReviewCsv(humanReviewHi)}\n`, "utf8");
fs.writeFileSync(path.join(packageDir, "pct-002-human-review-pa.csv"), `${renderPct002HumanReviewCsv(humanReviewPa)}\n`, "utf8");
fs.writeFileSync(path.join(packageDir, "pct-002-pre-freeze-coverage-audit.md"), `${renderPct002CoverageAuditMarkdown(preFreeze.audit, "500 EN questions")}\n`, "utf8");
fs.writeFileSync(path.join(packageDir, "pct-002-maturity-audit.md"), `${renderPct002MaturityAuditMarkdown(maturity.audit, "1000 EN questions")}\n`, "utf8");
fs.writeFileSync(path.join(packageDir, "pct-002-freeze-record.md"), `${renderPct002FreezeRecordMarkdown(preFreeze.audit)}\n`, "utf8");

console.log(`PCT-002 Phase C test passed. Duplicate rate: ${(duplicateRate * 100).toFixed(2)}%.`);
