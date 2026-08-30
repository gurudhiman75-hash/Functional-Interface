import { GEOMETRY_THEOREM_IDS } from "../../../../../shared/geometry";
import type { Phase1PrototypeQuestion } from "../GEO-001/discovery/phase1-types";

export function assertPhase1(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function assertDiscoveryQuestion(question: Phase1PrototypeQuestion): void {
  assertPhase1(question.permanentQlId === null, `${question.temporaryPrototypeId}: permanent QL allocated during discovery`);
  assertPhase1(question.sourceStatus === "AUTHORITY_SEEDED__EXTERNAL_SOURCE_AUDIT_OPEN", `${question.temporaryPrototypeId}: source audit was incorrectly closed`);
  assertPhase1(question.validation.ok, `${question.temporaryPrototypeId}: validation failed: ${question.validation.errors.join(",")}`);
  assertPhase1(question.options.length === 4 && new Set(question.options).size === 4, `${question.temporaryPrototypeId}: options are not four unique choices`);
  assertPhase1(question.answer === question.options[question.correctIndex], `${question.temporaryPrototypeId}: answer/index mismatch`);
  assertPhase1(question.optionAnalysis.filter((option) => option.correct).length === 1, `${question.temporaryPrototypeId}: correct-option analysis is not unique`);
  assertPhase1(question.optionAnalysis.filter((option) => !option.correct).every((option) => Boolean(option.misconceptionId)), `${question.temporaryPrototypeId}: a distractor lacks misconception ancestry`);
  assertPhase1(question.minimalityProof.passed, `${question.temporaryPrototypeId}: clue minimality failed`);
  assertPhase1(question.minimalityProof.attempts.every((attempt) => attempt.changedSolutionPolicy), `${question.temporaryPrototypeId}: removable displayed clue survived minimality proof`);
  assertPhase1(question.independentVerifierResult.passed, `${question.temporaryPrototypeId}: independent verifier failed`);
  assertPhase1(!question.lifecycle.questionStudioDiscoverable, `${question.temporaryPrototypeId}: Question Studio gate opened`);
  assertPhase1(!question.lifecycle.questionBankWritable, `${question.temporaryPrototypeId}: Question Bank gate opened`);
  assertPhase1(!question.lifecycle.testEligible, `${question.temporaryPrototypeId}: test gate opened`);
  assertPhase1(!question.lifecycle.publiclyPublishable, `${question.temporaryPrototypeId}: publication gate opened`);

  const learnerSurface = [
    question.stem,
    ...question.options,
    ...question.explanation.lines,
    ...question.explanation.theoremNames,
  ].join("\n");
  for (const theoremId of GEOMETRY_THEOREM_IDS) {
    assertPhase1(!learnerSurface.includes(theoremId), `${question.temporaryPrototypeId}: internal theorem ID leaked to learner text: ${theoremId}`);
  }
}

export function assertDeterministicAndShuffled(
  generate: (seed: string) => Phase1PrototypeQuestion,
  prototypeId: string,
): void {
  const first = generate(`${prototypeId}:determinism`);
  const second = generate(`${prototypeId}:determinism`);
  assertPhase1(first.canonicalGeometryFingerprint === second.canonicalGeometryFingerprint, `${prototypeId}: same seed changed canonical fingerprint`);
  assertPhase1(first.options.join("|") === second.options.join("|"), `${prototypeId}: same seed changed option order`);
  const positions = new Set<number>();
  for (let index = 0; index < 16; index += 1) positions.add(generate(`${prototypeId}:shuffle:${index}`).correctIndex);
  assertPhase1(positions.size >= 2, `${prototypeId}: answer position is fixed across discovery seeds`);
}

export function passPhase1(name: string): void {
  console.log(JSON.stringify({ suite: "GEO_PHASE_1", test: name, status: "PASS" }));
}
