import { GEOMETRY_THEOREM_IDS } from "../../../../../shared/geometry";
import type { Phase2PrototypeQuestion } from "../GEO-001/discovery/phase2-types";

export function assertPhase2(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function assertPhase2DiscoveryQuestion(question: Phase2PrototypeQuestion): void {
  assertPhase2(question.permanentQlId === null, `${question.temporaryPrototypeId}: permanent QL allocated during discovery`);
  assertPhase2(question.sourceStatus === "AUTHORITY_SEEDED__EXTERNAL_SOURCE_AUDIT_OPEN", `${question.temporaryPrototypeId}: source audit was incorrectly closed`);
  assertPhase2(question.validation.ok, `${question.temporaryPrototypeId}: validation failed: ${question.validation.errors.join(",")}`);
  assertPhase2(question.options.length === 4 && new Set(question.options).size === 4, `${question.temporaryPrototypeId}: options are not four unique choices`);
  assertPhase2(question.answer === question.options[question.correctIndex], `${question.temporaryPrototypeId}: answer/index mismatch`);
  assertPhase2(question.optionAnalysis.filter((option) => option.correct).length === 1, `${question.temporaryPrototypeId}: correct-option analysis is not unique`);
  assertPhase2(question.optionAnalysis.filter((option) => !option.correct).every((option) => Boolean(option.misconceptionId)), `${question.temporaryPrototypeId}: distractor lacks misconception ancestry`);
  assertPhase2(question.minimalityProof.passed, `${question.temporaryPrototypeId}: clue minimality failed`);
  assertPhase2(question.minimalityProof.attempts.every((attempt) => attempt.changedSolutionPolicy), `${question.temporaryPrototypeId}: a displayed clue remained removable`);
  assertPhase2(question.independentVerifierResult.passed, `${question.temporaryPrototypeId}: independent verifier failed`);
  assertPhase2(question.independentVerifierResult.oracle === "COORDINATE_ORACLE", `${question.temporaryPrototypeId}: Phase-2 theorem state is not independently coordinate-verified`);
  assertPhase2(!question.lifecycle.questionStudioDiscoverable, `${question.temporaryPrototypeId}: Question Studio gate opened`);
  assertPhase2(!question.lifecycle.questionBankWritable, `${question.temporaryPrototypeId}: Question Bank gate opened`);
  assertPhase2(!question.lifecycle.testEligible, `${question.temporaryPrototypeId}: test gate opened`);
  assertPhase2(!question.lifecycle.publiclyPublishable, `${question.temporaryPrototypeId}: publication gate opened`);

  const learnerSurface = [
    question.stem,
    ...question.options,
    ...question.explanation.lines,
    ...question.explanation.theoremNames,
  ].join("\n");
  for (const theoremId of GEOMETRY_THEOREM_IDS) {
    assertPhase2(!learnerSurface.includes(theoremId), `${question.temporaryPrototypeId}: internal theorem ID leaked into learner text: ${theoremId}`);
  }
}

export function assertPhase2DeterministicAndShuffled(
  generate: (seed: string) => Phase2PrototypeQuestion,
  prototypeId: string,
): void {
  const first = generate(`${prototypeId}:determinism`);
  const second = generate(`${prototypeId}:determinism`);
  assertPhase2(first.canonicalGeometryFingerprint === second.canonicalGeometryFingerprint, `${prototypeId}: same seed changed canonical fingerprint`);
  assertPhase2(first.options.join("|") === second.options.join("|"), `${prototypeId}: same seed changed option order`);
  const positions = new Set<number>();
  for (let index = 0; index < 16; index += 1) positions.add(generate(`${prototypeId}:shuffle:${index}`).correctIndex);
  assertPhase2(positions.size >= 2, `${prototypeId}: answer position is fixed across discovery seeds`);
}

export function passPhase2(name: string): void {
  console.log(JSON.stringify({ suite: "GEO_PHASE_2", test: name, status: "PASS" }));
}
