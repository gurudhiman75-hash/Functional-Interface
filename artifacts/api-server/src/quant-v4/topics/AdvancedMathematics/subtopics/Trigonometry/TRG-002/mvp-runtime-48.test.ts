import { toDegrees } from "../foundation/angle";
import { exactKey } from "../foundation/exact";
import { TRG_002_RUNTIME_PROOF_IDS } from "./runtime-proof";
import { TRG_002_MVP_48_BY_CP, TRG_002_MVP_48_IDS } from "./mvp-48-registry";
import { generateAllTrg002Mvp48Questions, generateTrg002Mvp48Question } from "./mvp-runtime-48";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function answerValueKey(value: any) {
  if (value.kind === "NUMBER") return `N:${value.unit}:${exactKey(value.value)}`;
  const degrees = toDegrees(value.value);
  return `A:${degrees.numerator}/${degrees.denominator}`;
}

assert(TRG_002_MVP_48_IDS.length === 48, "TRG-002 MVP registry must contain exactly 48 permanent QLs.");
assert(new Set(TRG_002_MVP_48_IDS).size === 48, "TRG-002 MVP registry IDs must be unique.");
for (const [cpId, ids] of Object.entries(TRG_002_MVP_48_BY_CP)) {
  assert(ids.length === 12, `${cpId} must contain exactly 12 MVP QLs.`);
}
for (const proofId of TRG_002_RUNTIME_PROOF_IDS) {
  assert(TRG_002_MVP_48_IDS.some((id) => id === proofId), `${proofId} proof anchor is missing from the 48-QL MVP.`);
}

const canonicalSeeds = Array.from({ length: 12 }, (_, index) => `trg002-mvp48-${String(index + 1).padStart(2, "0")}`);
let canonicalCases = 0;
for (const qlId of TRG_002_MVP_48_IDS) {
  for (const seed of canonicalSeeds) {
    const question: any = generateTrg002Mvp48Question(qlId, seed);
    assert(question.qlId === qlId, `${qlId}: runtime returned a different permanent ID for ${seed}.`);
    assert(question.validation.valid, `${qlId}: active MVP validation failed for ${seed}.`);
    assert(question.verification.spatial.valid, `${qlId}: canonical spatial verification failed for ${seed}.`);
    assert(question.verification.answer.valid, `${qlId}: requested-target reconstruction failed for ${seed}.`);
    assert(question.solutionDiagram, `${qlId}: required solution diagram is missing for ${seed}.`);
    assert(question.solutionDiagram.strategy === question.canonicalSpatialState.diagramStrategy, `${qlId}: solution diagram strategy drifted for ${seed}.`);
    assert(question.diagramEvidence.policy.solutionDiagramPolicy === "REQUIRED", `${qlId}: solution diagram must remain REQUIRED.`);
    assert(question.diagramEvidence.policy.stemDiagramPolicy === "OPTIONAL", `${qlId}: stem diagram must remain OPTIONAL.`);
    assert(question.diagramEvidence.disclosure.solutionStage === "AFTER_ATTEMPT", `${qlId}: solution diagram must remain explanation-stage.`);
    assert(question.stemDiagram === undefined, `${qlId}: stem diagram must not be emitted automatically.`);
    assert(question.options.length === 4, `${qlId}: expected exactly four options.`);
    assert(new Set(question.options.map((option: any) => answerValueKey(option.value))).size === 4, `${qlId}: options are not mathematically unique for ${seed}.`);
    assert(question.options.filter((option: any) => option.isCorrect).length === 1, `${qlId}: expected exactly one correct option.`);
    assert(question.options[question.correctIndex]?.isCorrect === true, `${qlId}: correctIndex does not point to the correct option.`);
    const minimumSteps = question.difficulty === "Hard" ? 3 : question.difficulty === "Medium" ? 2 : 1;
    assert(question.explanation.steps.length >= minimumSteps, `${qlId}: explanation is too shallow for ${question.difficulty}.`);
    assert(question.questionBankStatus === "NOT_STORED", `${qlId}: question-bank activation changed.`);
    assert(question.testEligibility === "INELIGIBLE", `${qlId}: Test Builder activation changed.`);
    assert(question.publiclyPublishable === false, `${qlId}: public activation changed.`);
    assert(question.questionStudioDiscoverable === false, `${qlId}: Question Studio activation changed.`);
    canonicalCases += 1;
  }
}
assert(canonicalCases === 576, `Expected 576 canonical MVP cases, got ${canonicalCases}.`);

for (const qlId of ["TRG-002-QL-041", "TRG-002-QL-043"] as const) {
  const question: any = generateTrg002Mvp48Question(qlId, "trg002-mvp48-broken-regression");
  assert(question.canonicalSpatialState.diagramStrategy === "BROKEN_TREE", `${qlId}: broken-object strategy must be BROKEN_TREE.`);
  assert(question.canonicalSpatialState.points.some((point: any) => point.role === "BREAK_POINT"), `${qlId}: canonical break point is missing.`);
  assert(question.canonicalSpatialState.points.some((point: any) => point.role === "TOUCH_POINT"), `${qlId}: canonical ground-touch point is missing.`);
  assert(question.canonicalSpatialState.observations.length >= 1, `${qlId}: fallen-part geometry must have an explicit canonical sloping relation.`);
}

const comparative: any = generateTrg002Mvp48Question("TRG-002-QL-071", "trg002-mvp48-comparative-regression");
assert(comparative.canonicalSpatialState.verticalObjects.length === 2, "QL-071 must contain two vertical objects.");
assert(comparative.canonicalSpatialState.observations.length === 2, "QL-071 must contain two controlled observations.");

for (const qlId of ["TRG-002-QL-095", "TRG-002-QL-096"] as const) {
  const question: any = generateTrg002Mvp48Question(qlId, "trg002-mvp48-composite-regression");
  assert(question.canonicalSpatialState.verticalObjects.length === 2, `${qlId}: composite state must contain the base object and upper object.`);
  assert(question.canonicalSpatialState.observations.length === 2, `${qlId}: composite state must use both sight angles.`);
  const [lower, upper] = question.canonicalSpatialState.verticalObjects;
  assert(lower.topPointId === upper.basePointId, `${qlId}: upper object must be stacked on the lower object's top point.`);
}

for (const qlId of ["TRG-002-QL-024", "TRG-002-QL-038", "TRG-002-QL-094"] as const) {
  const question: any = generateTrg002Mvp48Question(qlId, "trg002-mvp48-clean-authority-regression");
  assert(new Set(question.options.map((option: any) => answerValueKey(option.value))).size === 4, `${qlId}: clean active authority regressed to an option collision.`);
}
const ladder: any = generateTrg002Mvp48Question("TRG-002-QL-038", "trg002-mvp48-ladder-provenance");
assert(ladder.options.some((option: any) => option.misconceptionId === "RETURNED_VERTICAL_REACH"), "QL-038 must retain a genuine vertical-reach distractor provenance.");

const sweepSeeds = Array.from({ length: 50 }, (_, index) => `trg002-mvp48-sweep-${String(index + 1).padStart(2, "0")}`);
let sweepCases = 0;
for (const seed of sweepSeeds) {
  const questions: any[] = generateAllTrg002Mvp48Questions(seed) as any[];
  assert(questions.length === 48, `${seed}: active runtime did not generate all 48 MVP QLs.`);
  for (const question of questions) {
    assert(question.validation.valid, `${question.qlId}: sweep validation failed for ${seed}.`);
    assert(question.verification.spatial.valid && question.verification.answer.valid, `${question.qlId}: sweep verification failed for ${seed}.`);
    assert(question.solutionDiagram && question.stemDiagram === undefined, `${question.qlId}: solution/stem diagram policy drifted for ${seed}.`);
    assert(new Set(question.options.map((option: any) => answerValueKey(option.value))).size === 4, `${question.qlId}: sweep option collision for ${seed}.`);
    sweepCases += 1;
  }
}
assert(sweepCases === 2400, `Expected 2,400 MVP sweep cases, got ${sweepCases}.`);

console.log(`TRG-002 48-QL MVP gate target: ${canonicalCases} canonical cases and ${sweepCases} sweep cases.`);
