import { strict as assert } from "node:assert";
import { generatePct001CoverageAudit } from "./coverage-auditor";
import { getAnswerType, getQuestionEntry, getRequiredVariables, getTaskKind, renderTemplate, validatePct001Libraries } from "./library";
import { getPct001ActiveCanonicalProblemIds } from "./parameter-generator";
import { runPct001Pipeline } from "./pipeline";
import { solvePct001 } from "./solver";
import { PCT_001_ARCHETYPE_ID, type Pct001CanonicalProblemId, type Pct001Parameters, type Pct001Variables } from "./types";

const cpIds = getPct001ActiveCanonicalProblemIds();
const seenCp = new Set<string>();
const seenDifficulty = new Set<string>();
const seenQuestions = new Map<string, number>();

const libraryValidation = validatePct001Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("; "));

function packageParams(cpId: Pct001CanonicalProblemId, qlId: string, variables: Pct001Variables): Pct001Parameters {
  return {
    archetypeId: PCT_001_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: `${cpId}:${qlId}:fixed`,
    questionLanguageId: qlId,
    explanationId: `PCT-ES-${cpId.slice(-3)}`,
    language: "en",
    difficultyBand: "Easy",
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

function assertFixedCase(cpId: Pct001CanonicalProblemId, qlId: string, variables: Pct001Variables, expectedAnswer: string, expectedType: string) {
  const params = packageParams(cpId, qlId, variables);
  const solver = solvePct001(params);
  const question = renderTemplate(getQuestionEntry(cpId, qlId, "en").template, variables);
  assert.equal(solver.answer, expectedAnswer, `${qlId} answer mismatch for ${question}`);
  assert.equal(solver.answerType, expectedType);
  assert.equal(params.answerType, expectedType);
  for (const variable of params.requiredVariables) assert.notEqual(question.includes(`{${variable}}`), true, `${qlId} did not render ${variable}`);
}

assertFixedCase("PCT-CP-001", "PCT-QL-001", { percentageRate: 20, baseValue: 500 }, "100", "ABSOLUTE");
assertFixedCase("PCT-CP-001", "PCT-QL-009", { percentageRate: 20, value: 500 }, "2500", "ABSOLUTE");
assertFixedCase("PCT-CP-003", "PCT-QL-020", { rate1: 20, rate2: 10 }, "32%", "PERCENT");
assertFixedCase("PCT-CP-003", "PCT-QL-024", { initialValue: 1000, percentageRate: 10 }, "1210", "ABSOLUTE");
assertFixedCase("PCT-CP-004", "PCT-QL-028", { percentageRate: 25 }, "20%", "PERCENT");
assertFixedCase("PCT-CP-005", "PCT-QL-036", { rate1: 20, rate2: 25, rate3: 15, value: 2400 }, "6000", "ABSOLUTE");
assertFixedCase("PCT-CP-006", "PCT-QL-048", { totalMixture: 40, percentageRate: 20, newRate: 10 }, "40", "ABSOLUTE");

for (let index = 0; index < 1000; index += 1) {
  const cpId = cpIds[index % cpIds.length]!;
  const en = runPct001Pipeline(cpId, { language: "en", seed: `pct-001-test:${index}` });
  const hi = runPct001Pipeline(cpId, {
    language: "hi",
    seed: `pct-001-test:${index}`,
    questionLanguageId: en.questionLanguageId,
    difficultyBand: en.difficultyBand,
  });
  const pa = runPct001Pipeline(cpId, {
    language: "pa",
    seed: `pct-001-test:${index}`,
    questionLanguageId: en.questionLanguageId,
    difficultyBand: en.difficultyBand,
  });

  for (const pkg of [en, hi, pa]) {
    assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
    assert.ok(pkg.reasoningGraph.nodes.some((node) => node.id === "answer"));
    assert.ok(pkg.explanation.lines.length > 0);
    assert.ok(pkg.stem.length > 0);
    assert.ok(pkg.answer.length > 0);
  }

  assert.equal(en.answer, hi.answer);
  assert.equal(en.answer, pa.answer);
  assert.equal(en.solver.answer, en.answer);
  assert.equal(runPct001Pipeline(cpId, { language: "en", seed: `pct-001-test:${index}`, questionLanguageId: en.questionLanguageId }).answer, en.answer);

  seenCp.add(en.canonicalProblemId);
  seenDifficulty.add(en.difficultyBand);
  seenQuestions.set(en.stem, (seenQuestions.get(en.stem) ?? 0) + 1);
}

for (const cpId of cpIds) assert.equal(seenCp.has(cpId), true, `${cpId} not covered`);
for (const difficulty of ["Easy", "Medium", "Hard"]) assert.equal(seenDifficulty.has(difficulty), true, `${difficulty} not covered`);

const duplicateCount = [...seenQuestions.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
const duplicateRate = duplicateCount / 1000;
assert.ok(duplicateRate < 0.75, `Duplicate rate too high: ${duplicateRate}`);

const audit = generatePct001CoverageAudit(500, "en").audit;
assert.equal(audit.generationFailures, 0);
assert.equal(audit.validationFailures, 0);
assert.equal(audit.renderFailures, 0);
assert.equal(audit.solverFailures, 0);
assert.equal(audit.unusedEsIds.length, 0);

console.log(`PCT-001 Phase C test passed. Duplicate rate: ${(duplicateRate * 100).toFixed(2)}%.`);
