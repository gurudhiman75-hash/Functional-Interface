import { GEOMETRY_THEOREM_IDS } from "../../../../../shared/geometry";
import type { Phase3PrototypeQuestion } from "../GEO-001/discovery/phase3-types";

export function assertPhase3(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function assertPhase3DiscoveryQuestion(question: Phase3PrototypeQuestion): void {
  assertPhase3(question.permanentQlId === null, `${question.temporaryPrototypeId}: permanent QL allocated`);
  assertPhase3(question.sourceStatus === "AUTHORITY_SEEDED__EXTERNAL_SOURCE_AUDIT_OPEN", `${question.temporaryPrototypeId}: source audit incorrectly closed`);
  assertPhase3(question.validation.ok, `${question.temporaryPrototypeId}: validation failed: ${question.validation.errors.join(",")}`);
  assertPhase3(question.options.length === 4 && new Set(question.options).size === 4, `${question.temporaryPrototypeId}: options are not four unique choices`);
  assertPhase3(question.answer === question.options[question.correctIndex], `${question.temporaryPrototypeId}: answer/index mismatch`);
  assertPhase3(question.optionAnalysis.filter((option) => option.correct).length === 1, `${question.temporaryPrototypeId}: correct option not unique`);
  assertPhase3(question.optionAnalysis.filter((option) => !option.correct).every((option) => Boolean(option.misconceptionId)), `${question.temporaryPrototypeId}: distractor lacks misconception ancestry`);
  assertPhase3(question.minimalityProof.passed && question.minimalityProof.attempts.every((attempt) => attempt.changedSolutionPolicy), `${question.temporaryPrototypeId}: clue minimality failed`);
  assertPhase3(question.independentVerifierResult.passed, `${question.temporaryPrototypeId}: independent verifier failed`);
  assertPhase3(!question.lifecycle.questionStudioDiscoverable && !question.lifecycle.questionBankWritable && !question.lifecycle.testEligible && !question.lifecycle.publiclyPublishable, `${question.temporaryPrototypeId}: product lifecycle gate opened`);
  const learnerSurface = [question.stem, ...question.options, ...question.explanation.lines, ...question.explanation.theoremNames].join("\n");
  for (const theoremId of GEOMETRY_THEOREM_IDS) assertPhase3(!learnerSurface.includes(theoremId), `${question.temporaryPrototypeId}: internal theorem ID leaked: ${theoremId}`);
}

export function assertPhase3DeterministicAndShuffled(generate: (seed: string) => Phase3PrototypeQuestion, prototypeId: string): void {
  const first = generate(`${prototypeId}:determinism`);
  const second = generate(`${prototypeId}:determinism`);
  assertPhase3(first.canonicalGeometryFingerprint === second.canonicalGeometryFingerprint, `${prototypeId}: same seed changed fingerprint`);
  assertPhase3(first.options.join("|") === second.options.join("|"), `${prototypeId}: same seed changed option order`);
  const positions = new Set<number>();
  for (let index = 0; index < 16; index += 1) positions.add(generate(`${prototypeId}:shuffle:${index}`).correctIndex);
  assertPhase3(positions.size >= 2, `${prototypeId}: fixed correct-answer position`);
}

export function passPhase3(name: string): void {
  console.log(JSON.stringify({ suite: "GEO_PHASE_3", test: name, status: "PASS" }));
}
