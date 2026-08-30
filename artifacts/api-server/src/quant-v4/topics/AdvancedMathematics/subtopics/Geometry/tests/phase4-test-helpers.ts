import { GEOMETRY_THEOREM_IDS } from "../../../../../shared/geometry";
import type { Phase4PrototypeQuestion } from "../GEO-002/discovery/phase4-types";

export function assertPhase4(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function assertPhase4DiscoveryQuestion(question: Phase4PrototypeQuestion): void {
  assertPhase4(question.packageId === "GEO-002", `${question.temporaryPrototypeId}: wrong runtime package`);
  assertPhase4(question.permanentQlId === null, `${question.temporaryPrototypeId}: permanent QL allocated during discovery`);
  assertPhase4(question.sourceStatus === "AUTHORITY_SEEDED__EXTERNAL_SOURCE_AUDIT_OPEN", `${question.temporaryPrototypeId}: source audit incorrectly closed`);
  assertPhase4(question.validation.ok, `${question.temporaryPrototypeId}: validation failed: ${question.validation.errors.join(",")}`);
  assertPhase4(question.options.length === 4 && new Set(question.options).size === 4, `${question.temporaryPrototypeId}: options are not four unique choices`);
  assertPhase4(question.answer === question.options[question.correctIndex], `${question.temporaryPrototypeId}: answer/index mismatch`);
  assertPhase4(question.optionAnalysis.filter((option) => option.correct).length === 1, `${question.temporaryPrototypeId}: correct option is not unique`);
  assertPhase4(question.optionAnalysis.filter((option) => !option.correct).every((option) => Boolean(option.misconceptionId)), `${question.temporaryPrototypeId}: distractor lacks misconception ancestry`);
  assertPhase4(question.minimalityProof.passed, `${question.temporaryPrototypeId}: clue minimality failed`);
  assertPhase4(question.independentVerifierResult.passed, `${question.temporaryPrototypeId}: independent verifier failed`);
  assertPhase4(!question.lifecycle.questionStudioDiscoverable && !question.lifecycle.questionBankWritable && !question.lifecycle.testEligible && !question.lifecycle.publiclyPublishable, `${question.temporaryPrototypeId}: a product lifecycle gate opened`);
  assertPhase4(question.diagramModel !== undefined && question.stemSvg !== undefined, `${question.temporaryPrototypeId}: circle prototype lacks a stem diagram`);
  assertPhase4(question.diagramModel!.circles.length >= 1, `${question.temporaryPrototypeId}: circle prototype diagram lacks a circle`);

  const learnerSurface = [question.stem, ...question.options, ...question.explanation.lines, ...question.explanation.theoremNames].join("\n");
  for (const theoremId of GEOMETRY_THEOREM_IDS) {
    assertPhase4(!learnerSurface.includes(theoremId), `${question.temporaryPrototypeId}: internal theorem ID leaked to learner surface: ${theoremId}`);
  }
}

export function assertPhase4DeterministicAndShuffled(generate: (seed: string) => Phase4PrototypeQuestion, prototypeId: string): void {
  const first = generate(`${prototypeId}:determinism`);
  const second = generate(`${prototypeId}:determinism`);
  assertPhase4(first.canonicalGeometryFingerprint === second.canonicalGeometryFingerprint, `${prototypeId}: same seed changed canonical fingerprint`);
  assertPhase4(first.options.join("|") === second.options.join("|"), `${prototypeId}: same seed changed option order`);
  const positions = new Set<number>();
  for (let index = 0; index < 16; index += 1) positions.add(generate(`${prototypeId}:shuffle:${index}`).correctIndex);
  assertPhase4(positions.size >= 2, `${prototypeId}: answer position is fixed across discovery seeds`);
}

export function passPhase4(name: string): void {
  console.log(JSON.stringify({ suite: "GEO_PHASE_4", test: name, status: "PASS" }));
}
