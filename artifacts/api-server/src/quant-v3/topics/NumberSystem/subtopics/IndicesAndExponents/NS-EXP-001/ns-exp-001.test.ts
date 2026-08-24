import { strict as assert } from "node:assert";
import { getNsExp001ActiveCanonicalProblemIds, getQuestionLanguageEntries, validateNsExp001Libraries } from "./library";
import { generateNsExp001Parameters } from "./parameter-generator";
import { runNsExp001Pipeline } from "./pipeline";
import { solveNsExp001 } from "./solver";

const CP_IDS = getNsExp001ActiveCanonicalProblemIds();
const TOKEN_PATTERN = /\b(base|firstExponent|secondExponent|thirdExponent|targetExponent|visibleBase1|visibleBase2|visibleBase3|negativeExponent|rootDegree|fractionalExponentNumerator|fractionalExponentDenominator|knownValue|increment|decrement|multiplier|coefficient|constant|divisor|shift)\b/;

const libraryAudit = validateNsExp001Libraries();
assert.equal(libraryAudit.valid, true, `Library audit failed: ${libraryAudit.failures.join(" | ")}`);

let qlCount = 0;
for (const cpId of CP_IDS) {
  const qls = getQuestionLanguageEntries(cpId);
  assert.ok(qls.length > 0, `No QLs registered for ${cpId}`);

  for (const ql of qls) {
    qlCount += 1;
    for (let variant = 0; variant < 5; variant += 1) {
      const seed = `NS-EXP-001:P0:${cpId}:${ql.id}:${variant}`;
      const first = runNsExp001Pipeline(cpId, { seed, questionLanguageId: ql.id });
      const second = runNsExp001Pipeline(cpId, { seed, questionLanguageId: ql.id });

      assert.equal(first.validation.valid, true, `${cpId}:${ql.id}:${variant} validation failed: ${first.validation.checks.filter((check) => !check.passed).map((check) => check.message).join(" | ")}`);
      assert.equal(first.solver.verification.answerRecomputed, true, `${cpId}:${ql.id} solver did not recompute`);
      assert.equal(first.solver.verification.independentlyVerified, true, `${cpId}:${ql.id} independent verification failed`);
      assert.equal(first.answer, first.solver.verification.referenceAnswer, `${cpId}:${ql.id} answer/reference mismatch`);
      assert.equal(TOKEN_PATTERN.test(first.stem), false, `${cpId}:${ql.id} unresolved template token in stem: ${first.stem}`);
      assert.equal(first.stem.includes("undefined"), false, `${cpId}:${ql.id} rendered undefined`);
      assert.equal(first.stem.includes("NaN"), false, `${cpId}:${ql.id} rendered NaN`);
      assert.ok(first.answer.trim().length > 0, `${cpId}:${ql.id} blank answer`);

      assert.equal(first.stem, second.stem, `${cpId}:${ql.id} seeded stem nondeterminism`);
      assert.equal(first.answer, second.answer, `${cpId}:${ql.id} seeded answer nondeterminism`);
      assert.deepEqual(first.parameters.variables, second.parameters.variables, `${cpId}:${ql.id} seeded state nondeterminism`);
    }
  }
}

assert.equal(qlCount, 190, `Expected exhaustive coverage of 190 QLs; got ${qlCount}`);

// Regression guard for the original P0 defect: changing expectedAnswer must never change the solver result.
const parameters = generateNsExp001Parameters("CP01", { seed: "NS-EXP-001:P0:passthrough-regression", questionLanguageId: "QL-001" });
const genuine = solveNsExp001(parameters);
const tampered = solveNsExp001({ ...parameters, expectedAnswer: "DELIBERATELY_WRONG" });
assert.equal(tampered.answer, genuine.answer, "Solver is reading expectedAnswer instead of solving structured state");
assert.equal(tampered.verification.independentlyVerified, false, "Tampered reference answer should fail independent verification");

console.log(`NS-EXP-001 P0 tests passed: ${qlCount} QLs x 5 deterministic variants plus answer-passthrough regression.`);
