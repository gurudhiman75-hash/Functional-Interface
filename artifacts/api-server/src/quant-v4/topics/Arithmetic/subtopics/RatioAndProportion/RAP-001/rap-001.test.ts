import { strict as assert } from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateRap001CoverageAudit,
  renderRap001CoverageAuditMarkdown,
  renderRap001EntityRenderingAuditMarkdown,
  renderRap001FreezeRecordMarkdown,
  renderRap001HumanReviewCsv,
  renderRap001MaturityAuditMarkdown,
} from "./coverage-auditor";
import { getAnswerType, getQuestionEntry, getRequiredVariables, getTaskKind, renderTemplate, validateRap001Libraries } from "./library";
import { getRap001ActiveCanonicalProblemIds } from "./parameter-generator";
import { runRap001Pipeline } from "./pipeline";
import { solveRap001 } from "./solver";
import { RAP_001_ARCHETYPE_ID, type Rap001CanonicalProblemId, type Rap001Parameters, type Rap001Variables } from "./types";

const apiRoot = fs.existsSync(path.join(process.cwd(), "src/quant-v4"))
  ? process.cwd()
  : fs.existsSync(path.join(process.cwd(), "artifacts/api-server/src/quant-v4"))
    ? path.join(process.cwd(), "artifacts/api-server")
    : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const packageDir = path.join(apiRoot, "src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-001");
const cpIds = getRap001ActiveCanonicalProblemIds();
const seenCp = new Set<string>();
const seenDifficulty = new Set<string>();
const seenQuestions = new Map<string, number>();

const libraryValidation = validateRap001Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("; "));

function packageParams(cpId: Rap001CanonicalProblemId, qlId: string, variables: Rap001Variables): Rap001Parameters {
  return {
    archetypeId: RAP_001_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: `${cpId}:${qlId}:fixed`,
    questionLanguageId: qlId,
    explanationId: `RAP-ES-${cpId.slice(-3)}`,
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

function assertFixedCase(cpId: Rap001CanonicalProblemId, qlId: string, variables: Rap001Variables, expectedAnswer: string, expectedType: string) {
  const params = packageParams(cpId, qlId, variables);
  const solver = solveRap001(params);
  const question = renderTemplate(getQuestionEntry(cpId, qlId, "en").template, variables);
  assert.equal(solver.answer, expectedAnswer, `${qlId} answer mismatch for ${question}`);
  assert.equal(solver.answerType, expectedType);
  for (const variable of params.requiredVariables) {
    assert.equal(question.includes(`{${variable}}`), false, `${qlId} did not render ${variable}`);
  }
}

assertFixedCase("RAP-CP-001", "RAP-QL-001", { personA: "A", personB: "B", personC: "C", ratioA1: 2, ratioB1: 3, ratioB2: 6, ratioC2: 5 }, "$$4 : 6 : 5$$", "RATIO");
assertFixedCase("RAP-CP-001", "RAP-QL-004", { groupName: "class", personA: "boys", personB: "girls", ratioA: 2, ratioB: 3, valueA: 20 }, "$$30$$", "COUNT");
assertFixedCase("RAP-CP-002", "RAP-QL-011", { personA: "Aman", ratioExp: 3, ratioSav: 2, totalSalary: 5000 }, "$$2000$$", "ABSOLUTE");
assertFixedCase("RAP-CP-003", "RAP-QL-014", { ratioA: 2, ratioB: 3, transferredCount: 4, finalRatioA: 3, finalRatioB: 4 }, "$$12$$", "COUNT");
assertFixedCase("RAP-CP-004", "RAP-QL-017", { numA: 9, numB: 16 }, "$$12$$", "ABSOLUTE");
assertFixedCase("RAP-CP-005", "RAP-QL-022", { denom1: 1, denom2: 2, denom3: 5, ratio1: 2, ratio2: 3, ratio3: 1, totalValue: 52, targetDenom: 2 }, "$$12$$", "COUNT");
assertFixedCase("RAP-CP-006", "RAP-QL-032", { acidVolume: 5, waterVolume: 15 }, "$$25\\%$$", "PERCENT");

for (let index = 0; index < 1000; index += 1) {
  const cpId = cpIds[index % cpIds.length]!;
  const en = runRap001Pipeline(cpId, { language: "en", seed: `rap-001-test:${index}` });
  const hi = runRap001Pipeline(cpId, {
    language: "hi",
    seed: `rap-001-test:${index}`,
    questionLanguageId: en.questionLanguageId,
    difficultyBand: en.difficultyBand,
  });
  const pa = runRap001Pipeline(cpId, {
    language: "pa",
    seed: `rap-001-test:${index}`,
    questionLanguageId: en.questionLanguageId,
    difficultyBand: en.difficultyBand,
  });

  for (const pkg of [en, hi, pa]) {
    assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
    assert.ok(pkg.reasoningGraph.nodes.length >= 3);
    assert.ok(pkg.explanation.lines.length > 0);
    assert.ok(pkg.stem.length > 0);
    assert.ok(pkg.answer.length > 0);
  }

  assert.equal(en.answer, hi.answer);
  assert.equal(en.answer, pa.answer);
  assert.deepEqual(en.parameters.variables, hi.parameters.variables);
  assert.deepEqual(en.parameters.variables, pa.parameters.variables);
  assert.equal(runRap001Pipeline(cpId, { language: "en", seed: `rap-001-test:${index}`, questionLanguageId: en.questionLanguageId, difficultyBand: en.difficultyBand }).answer, en.answer);

  seenCp.add(en.canonicalProblemId);
  seenDifficulty.add(en.difficultyBand);
  seenQuestions.set(en.stem, (seenQuestions.get(en.stem) ?? 0) + 1);
}

for (const cpId of cpIds) assert.equal(seenCp.has(cpId), true, `${cpId} not covered`);
for (const difficulty of ["Easy", "Medium", "Hard"]) assert.equal(seenDifficulty.has(difficulty), true, `${difficulty} not covered`);

const duplicateCount = [...seenQuestions.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
const duplicateRate = duplicateCount / 1000;
assert.ok(duplicateRate < 0.8, `Duplicate rate too high: ${duplicateRate}`);

const preFreeze = generateRap001CoverageAudit(500, "en");
const maturity = generateRap001CoverageAudit(1000, "en");
assert.equal(preFreeze.audit.generationFailures, 0);
assert.equal(preFreeze.audit.validationFailures, 0);
assert.equal(preFreeze.audit.renderFailures, 0);
assert.equal(preFreeze.audit.solverFailures, 0);
assert.equal(preFreeze.audit.crossLanguageFailures, 0);
assert.equal(preFreeze.audit.placeholderFailures, 0);
assert.equal(preFreeze.audit.unusedQlIds.length, 0);
assert.equal(preFreeze.audit.unusedEsIds.length, 0);
assert.equal(preFreeze.audit.libraryValidationFailures.length, 0);
assert.equal(maturity.audit.generationFailures, 0);
assert.equal(maturity.audit.validationFailures, 0);
assert.equal(maturity.audit.renderFailures, 0);
assert.equal(maturity.audit.solverFailures, 0);
assert.equal(maturity.audit.crossLanguageFailures, 0);
assert.equal(maturity.audit.placeholderFailures, 0);
assert.equal(maturity.audit.unusedQlIds.length, 0);
assert.equal(maturity.audit.unusedEsIds.length, 0);
assert.equal(maturity.audit.libraryValidationFailures.length, 0);

const humanReviewEn = cpIds.flatMap((cpId) => Array.from({ length: 5 }, (_, index) =>
  runRap001Pipeline(cpId, { language: "en", seed: `rap-001-human-review:${cpId}:${index}` })));
const humanReviewHi = cpIds.flatMap((cpId) => Array.from({ length: 5 }, (_, index) =>
  runRap001Pipeline(cpId, { language: "hi", seed: `rap-001-human-review:${cpId}:${index}` })));
const humanReviewPa = cpIds.flatMap((cpId) => Array.from({ length: 5 }, (_, index) =>
  runRap001Pipeline(cpId, { language: "pa", seed: `rap-001-human-review:${cpId}:${index}` })));

fs.writeFileSync(path.join(packageDir, "rap-001-human-review-en.csv"), `${renderRap001HumanReviewCsv(humanReviewEn)}\n`, "utf8");
fs.writeFileSync(path.join(packageDir, "rap-001-human-review-hi.csv"), `${renderRap001HumanReviewCsv(humanReviewHi)}\n`, "utf8");
fs.writeFileSync(path.join(packageDir, "rap-001-human-review-pa.csv"), `${renderRap001HumanReviewCsv(humanReviewPa)}\n`, "utf8");
fs.writeFileSync(path.join(packageDir, "rap-001-pre-freeze-coverage-audit.md"), `${renderRap001CoverageAuditMarkdown(preFreeze.audit, "500 EN questions")}\n`, "utf8");
fs.writeFileSync(path.join(packageDir, "rap-001-maturity-audit.md"), `${renderRap001MaturityAuditMarkdown(maturity.audit, "1000 EN questions")}\n`, "utf8");
fs.writeFileSync(path.join(packageDir, "rap-001-freeze-record.md"), `${renderRap001FreezeRecordMarkdown(preFreeze.audit)}\n`, "utf8");
fs.writeFileSync(path.join(packageDir, "entity-rendering-audit.md"), `${renderRap001EntityRenderingAuditMarkdown(100)}\n`, "utf8");

console.log(`RAP-001 Phase C test passed. Duplicate rate: ${(duplicateRate * 100).toFixed(2)}%.`);
