import assert from "node:assert/strict";
import {
  OPS_APPROVED_CANDIDATE_IDS,
  generateApprovedOpsQuestion,
  type ApprovedOpsQuestion,
} from "./approved-teaching-entry";

const SEEDS_PER_CONTRACT = 100;
const answerPositions = [0, 0, 0, 0];
let generated = 0;

function assertPrecedenceNarration(question: ApprovedOpsQuestion): void {
  const groups = new Map<string, { multiplication: number[]; addition: number[] }>();
  question.explanation.steps.forEach((step, index) => {
    const prefix = step.label.includes(":") ? step.label.split(":", 1)[0] : "ROOT";
    const group = groups.get(prefix) ?? { multiplication: [], addition: [] };
    if (/multiplication\/division/iu.test(step.label)) group.multiplication.push(index);
    if (/addition\/subtraction/iu.test(step.label)) group.addition.push(index);
    groups.set(prefix, group);
  });
  for (const [prefix, group] of groups) {
    if (group.multiplication.length > 0 && group.addition.length > 0) {
      assert.ok(Math.max(...group.multiplication) < Math.min(...group.addition), `${question.candidateId} narrates addition/subtraction before multiplication/division within ${prefix}.`);
    }
  }
}

function assertBasicQuestion(question: ApprovedOpsQuestion): void {
  assert.equal(question.options.length, 4, `${question.candidateId} must have four options.`);
  assert.equal(new Set(question.options.map((option) => option.value)).size, 4, `${question.candidateId} has duplicate option text.`);
  assert.equal(question.options.filter((option) => option.errorLabel === null).length, 1, `${question.candidateId} must have exactly one keyed option.`);
  assert.equal(question.options[question.correctIndex]?.value, question.answer, `${question.candidateId} correctIndex does not point to the answer.`);
  assert.equal(question.metadata.teachingExplanationVersion, "V3_APPROVED");
  assert.equal(question.metadata.teachingTraceVerified, true);
  assert.ok(question.explanation.ruleStatement.length >= 60, `${question.candidateId} rule statement is too shallow.`);
  assert.ok(question.explanation.steps.length >= 3, `${question.candidateId} has too few teaching steps.`);
  assert.ok(question.explanation.conclusion.includes(question.answer), `${question.candidateId} conclusion does not identify the answer.`);
  assert.ok(!question.options.some((option) => /Replace .+ only/iu.test(option.value)), `${question.candidateId} contains a one-way replacement option.`);

  for (const step of question.explanation.steps) {
    assert.ok(step.label.trim().length > 0, `${question.candidateId} has an empty step label.`);
    assert.ok(step.expression.trim().length > 0, `${question.candidateId} has an empty step expression.`);
    assert.ok(step.result.trim().length > 0, `${question.candidateId} has an empty step result.`);
    assert.notEqual(step.expression.trim(), step.result.trim(), `${question.candidateId} repeats the same trace on both sides.`);
  }

  assertPrecedenceNarration(question);

  if (/select|which/u.test(question.stem.toLowerCase())) {
    assert.ok(question.explanation.steps.some((step) => /check|select|compare|uniqueness|test|determine|convert|infer|establish/iu.test(step.label)), `${question.candidateId} does not justify the selected option.`);
  }
}

function assertCandidateSpecific(question: ApprovedOpsQuestion): void {
  const labels = question.explanation.steps.map((step) => step.label).join(" | ");
  const traceText = question.explanation.steps.map((step) => `${step.expression} ${step.result}`).join(" | ");

  if (["OPS-CAND-001", "OPS-CAND-003", "OPS-CAND-004", "OPS-CAND-005", "OPS-CAND-007", "OPS-CAND-008", "OPS-CAND-009"].includes(question.candidateId)) {
    assert.match(labels, /replacement|meaning key|complete meaning key/iu, `${question.candidateId} does not expose the supplied meanings.`);
  }

  if (["OPS-CAND-014", "OPS-CAND-015", "OPS-CAND-016", "OPS-CAND-017", "OPS-CAND-018", "OPS-CAND-019", "OPS-CAND-026", "OPS-CAND-027", "OPS-CAND-028", "OPS-CAND-029"].includes(question.candidateId)) {
    assert.match(traceText, /→/u, `${question.candidateId} does not show both replacement directions.`);
    assert.ok(question.explanation.steps.some((step) => /transform|rebuild|apply both changes/iu.test(step.label)), `${question.candidateId} does not display the transformed expression.`);
  }

  if (["OPS-CAND-020", "OPS-CAND-021", "OPS-CAND-022"].includes(question.candidateId)) {
    assert.match(question.explanation.ruleStatement, /complete number|complete-number/iu, `${question.candidateId} does not distinguish complete-number tokens.`);
  }

  if (["OPS-CAND-023", "OPS-CAND-024", "OPS-CAND-025", "OPS-CAND-027"].includes(question.candidateId)) {
    assert.match(question.explanation.ruleStatement, /digit/iu, `${question.candidateId} does not explain global digit identity.`);
  }

  if (["OPS-CAND-030", "OPS-CAND-032"].includes(question.candidateId)) {
    assert.match(question.stem, /each represent one of \+, −, × and ÷/u);
    assert.match(labels, /M/iu);
    assert.match(labels, /N/iu);
  }

  if (question.candidateId === "OPS-CAND-033") {
    assert.match(question.stem, /represents one of \+, −, × and ÷/u);
    assert.equal(question.explanation.steps.filter((step) => /^Test /u.test(step.label)).length, 4);
  }

  if (question.candidateId === "OPS-CAND-034") {
    assert.match(question.stem, /represent \+, = and > in some order/u);
    assert.equal(question.explanation.steps.filter((step) => /^Check option /u.test(step.label)).length, 4);
  }

  if (question.candidateId === "OPS-CAND-008") {
    assert.equal(question.explanation.steps.filter((step) => /^Check option /u.test(step.label)).length, 4);
  }

  if (question.candidateId === "OPS-CAND-016") {
    assert.ok(question.options.every((option) => /^[+−×÷] ↔ [+−×÷]$/u.test(option.value)), "OPS-CAND-016 options must all be operator pairs.");
    assert.equal(question.metadata.curatedAllFourOperatorsVisible, true);
  }
}

for (const candidateId of OPS_APPROVED_CANDIDATE_IDS) {
  for (let seed = 0; seed < SEEDS_PER_CONTRACT; seed += 1) {
    const question = generateApprovedOpsQuestion(candidateId, seed);
    assert.equal(question.candidateId, candidateId);
    assert.equal(question.seed, seed);
    assertBasicQuestion(question);
    assertCandidateSpecific(question);
    answerPositions[question.correctIndex] += 1;
    generated += 1;
  }
}

assert.equal(generated, OPS_APPROVED_CANDIDATE_IDS.length * SEEDS_PER_CONTRACT);
assert.ok(answerPositions.every((count) => count > 0), "Every option position must receive correct answers.");
const ratio = Math.max(...answerPositions) / Math.min(...answerPositions);
assert.ok(ratio < 1.25, `Approved answer-position balance is too uneven: ${answerPositions.join(", ")}.`);

console.log("OPS-001 approved teaching runtime passed.", {
  contracts: OPS_APPROVED_CANDIDATE_IDS.length,
  seedsPerContract: SEEDS_PER_CONTRACT,
  generated,
  answerPositions,
  maxMinRatio: ratio,
});
