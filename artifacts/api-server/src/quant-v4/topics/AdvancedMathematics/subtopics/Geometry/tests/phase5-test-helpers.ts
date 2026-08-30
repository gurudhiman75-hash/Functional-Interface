import { GEOMETRY_THEOREM_IDS } from "../../../../../shared/geometry";
import type { Phase5PrototypeQuestion } from "../GEO-002/discovery/phase5-types";

export function assertPhase5(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function assertPhase5DiscoveryQuestion(question: Phase5PrototypeQuestion): void {
  assertPhase5(question.packageId === "GEO-002" && question.cpId === "GEO-CP-014", `${question.temporaryPrototypeId}: wrong mixed-synthesis ownership`);
  assertPhase5(question.permanentQlId === null, `${question.temporaryPrototypeId}: permanent QL allocated during discovery`);
  assertPhase5(question.sourceStatus === "AUTHORITY_SEEDED__EXTERNAL_SOURCE_AUDIT_OPEN", `${question.temporaryPrototypeId}: source audit incorrectly closed`);
  assertPhase5(question.validation.ok, `${question.temporaryPrototypeId}: validation failed: ${question.validation.errors.join(",")}`);
  assertPhase5(question.options.length === 4 && new Set(question.options).size === 4, `${question.temporaryPrototypeId}: options are not four unique choices`);
  assertPhase5(question.answer === question.options[question.correctIndex], `${question.temporaryPrototypeId}: answer/index mismatch`);
  assertPhase5(question.optionAnalysis.filter((option) => option.correct).length === 1, `${question.temporaryPrototypeId}: correct option is not unique`);
  assertPhase5(question.optionAnalysis.filter((option) => !option.correct).every((option) => Boolean(option.misconceptionId)), `${question.temporaryPrototypeId}: distractor lacks misconception ancestry`);
  assertPhase5(question.minimalityProof.passed && question.minimalityProof.attempts.every((attempt) => attempt.changedSolutionPolicy), `${question.temporaryPrototypeId}: clue minimality failed`);
  assertPhase5(question.independentVerifierResult.passed, `${question.temporaryPrototypeId}: independent verifier failed`);
  assertPhase5(question.diagramModel !== undefined && question.stemSvg !== undefined, `${question.temporaryPrototypeId}: mixed prototype lacks required diagram`);
  assertPhase5(!question.lifecycle.questionStudioDiscoverable && !question.lifecycle.questionBankWritable && !question.lifecycle.testEligible && !question.lifecycle.publiclyPublishable, `${question.temporaryPrototypeId}: a product lifecycle gate opened`);
  const learnerSurface = [question.stem, ...question.options, ...question.explanation.lines, ...question.explanation.theoremNames].join("\n");
  for (const theoremId of GEOMETRY_THEOREM_IDS) {
    assertPhase5(!learnerSurface.includes(theoremId), `${question.temporaryPrototypeId}: internal theorem ID leaked to learner surface: ${theoremId}`);
  }
}

export function assertPhase5DeterministicAndShuffled(generate: (seed: string) => Phase5PrototypeQuestion, prototypeId: string): void {
  const first = generate(`${prototypeId}:determinism`);
  const second = generate(`${prototypeId}:determinism`);
  assertPhase5(first.canonicalGeometryFingerprint === second.canonicalGeometryFingerprint, `${prototypeId}: same seed changed canonical fingerprint`);
  assertPhase5(first.options.join("|") === second.options.join("|"), `${prototypeId}: same seed changed option order`);
  const positions = new Set<number>();
  for (let index = 0; index < 16; index += 1) positions.add(generate(`${prototypeId}:shuffle:${index}`).correctIndex);
  assertPhase5(positions.size >= 2, `${prototypeId}: answer position is fixed across discovery seeds`);
}

export function passPhase5(name: string): void {
  console.log(JSON.stringify({ suite: "GEO_PHASE_5", test: name, status: "PASS" }));
}
