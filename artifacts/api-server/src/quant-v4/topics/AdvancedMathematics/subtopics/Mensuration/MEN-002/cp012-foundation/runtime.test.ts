import { exactKey } from "../foundation/exact";
import { auditMenCp012Registry, MEN_CP_012_PROTOTYPES } from "./registry";
import { generateMenCp012Question } from "./runtime";
import { buildMenCp012ReviewBatch } from "./review";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const registry = auditMenCp012Registry();
assert(registry.prototypeCount === 16, `Expected 16 prototypes, got ${registry.prototypeCount}.`);
assert(registry.uniquePrototypeCount === 16, "Prototype IDs must be unique.");
assert(registry.uniqueSolveModeCount === 16, "Solve modes must be unique in Wave 01.");
assert(registry.reasoningClusterCount === 7, `Expected 7 provisional reasoning clusters, got ${registry.reasoningClusterCount}.`);
assert(registry.permanentQlCount === 0, "Wave 01 must not allocate permanent QLs.");
assert(registry.lifecycleLocked, "Wave 01 must remain product-locked.");

let deterministicPackageCount = 0;
let lossStateCount = 0;
for (const definition of MEN_CP_012_PROTOTYPES) {
  const positions = new Set<number>();
  for (let index = 0; index < 64; index += 1) {
    const seed = `proof:${definition.prototypeId}:${String(index).padStart(3, "0")}`;
    const first = generateMenCp012Question(definition.prototypeId, seed);
    const second = generateMenCp012Question(definition.prototypeId, seed);

    assert(first.validation.valid, `${definition.prototypeId}/${seed}: validation failed: ${JSON.stringify(first.validation.checks)}`);
    assert(first.verification.valid, `${definition.prototypeId}/${seed}: conservation verification failed.`);
    assert(first.stem === second.stem, `${definition.prototypeId}/${seed}: deterministic stem replay drift.`);
    assert(first.correctIndex === second.correctIndex, `${definition.prototypeId}/${seed}: correct-position replay drift.`);
    assert(exactKey(first.exactAnswer) === exactKey(second.exactAnswer), `${definition.prototypeId}/${seed}: exact answer replay drift.`);
    assert(JSON.stringify(first.options.map((option) => option.display)) === JSON.stringify(second.options.map((option) => option.display)), `${definition.prototypeId}/${seed}: option replay drift.`);
    assert(first.options.length === 4, `${definition.prototypeId}/${seed}: must have four options.`);
    assert(new Set(first.options.map((option) => option.display)).size === 4, `${definition.prototypeId}/${seed}: option displays must be unique.`);
    assert(first.options.filter((option) => option.isCorrect).length === 1, `${definition.prototypeId}/${seed}: must have exactly one correct option.`);
    assert(first.options[first.correctIndex]?.display === first.answer, `${definition.prototypeId}/${seed}: displayed answer parity failed.`);
    assert(first.explanation.steps.length === 4, `${definition.prototypeId}/${seed}: explanation must have four connected steps.`);
    assert(first.explanation.traps.length >= 2, `${definition.prototypeId}/${seed}: explanation needs at least two misconception traps.`);
    assert(first.permanentQlId === null, `${definition.prototypeId}/${seed}: permanent QL allocated during discovery.`);
    assert(!first.questionStudioDiscoverable && !first.publiclyPublishable, `${definition.prototypeId}/${seed}: product lifecycle leaked.`);
    assert(first.questionBankStatus === "NOT_STORED" && first.testEligibility === "INELIGIBLE", `${definition.prototypeId}/${seed}: downstream delivery gate leaked.`);
    assert(first.state.conservationStatement.length > 0, `${definition.prototypeId}/${seed}: conservation statement missing.`);
    if (first.state.lossPercent.numerator > 0n) lossStateCount += 1;

    positions.add(first.correctIndex);
    deterministicPackageCount += 1;
  }
  assert(positions.size === 4, `${definition.prototypeId}: all four answer positions were not reached.`);
}

const review = buildMenCp012ReviewBatch();
assert(review.length === 64, `Expected 64 review records, got ${review.length}.`);
assert(new Set(review.map((question) => question.stem)).size === 64, "Wave 01 review stems must be distinct.");
const correctPositions = [0,1,2,3].map((position) => review.filter((question) => question.correctIndex === position).length);
assert(correctPositions.every((count) => count === 16), `Review answer balance must be 16/16/16/16; got ${correctPositions.join("/")}.`);
assert(review.every((question) => question.verification.valid && question.validation.valid), "Every review record must verify and validate.");
assert(review.every((question) => !question.questionStudioDiscoverable && !question.publiclyPublishable), "Review evidence must remain product-locked.");

console.log(JSON.stringify({
  authority: "MEN-CP012-FOUNDATION-WAVE-01-V1",
  prototypeCount: registry.prototypeCount,
  reasoningClusterCount: registry.reasoningClusterCount,
  deterministicPackages: deterministicPackageCount,
  reviewRecords: review.length,
  correctPositions: { A: correctPositions[0], B: correctPositions[1], C: correctPositions[2], D: correctPositions[3] },
  lossAwarePackages: lossStateCount,
  permanentQlCount: registry.permanentQlCount,
  lifecycleLocked: registry.lifecycleLocked,
}, null, 2));
