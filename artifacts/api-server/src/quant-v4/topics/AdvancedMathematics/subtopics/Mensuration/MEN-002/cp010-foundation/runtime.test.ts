import { auditMenCp010Registry, MEN_CP_010_PROTOTYPES } from "./registry";
import { generateMenCp010Question } from "./runtime";
import { buildMenCp010ReviewBatch } from "./review";
import { exactKey } from "../foundation/exact";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const registry = auditMenCp010Registry();
assert(registry.prototypeCount === 16, `Expected 16 prototypes, got ${registry.prototypeCount}.`);
assert(registry.uniquePrototypeCount === 16, "Prototype IDs must be unique.");
assert(registry.uniqueSolveModeCount === 16, "Solve modes must be unique in Wave 01.");
assert(registry.permanentQlCount === 0, "Wave 01 must not allocate permanent QLs.");
assert(registry.lifecycleLocked, "All Wave 01 prototypes must stay product-locked.");

let deterministicPackageCount = 0;
for (const definition of MEN_CP_010_PROTOTYPES) {
  const positions = new Set<number>();
  for (let index = 0; index < 64; index += 1) {
    const seed = `proof:${String(index).padStart(3, "0")}`;
    const first = generateMenCp010Question(definition.prototypeId, seed);
    const second = generateMenCp010Question(definition.prototypeId, seed);
    assert(first.validation.valid, `${definition.prototypeId}/${seed}: validation failed.`);
    assert(first.verification.valid, `${definition.prototypeId}/${seed}: verification failed.`);
    assert(first.stem === second.stem, `${definition.prototypeId}/${seed}: stem replay drift.`);
    assert(first.correctIndex === second.correctIndex, `${definition.prototypeId}/${seed}: answer-position replay drift.`);
    assert(exactKey(first.exactAnswer) === exactKey(second.exactAnswer), `${definition.prototypeId}/${seed}: exact-answer replay drift.`);
    assert(JSON.stringify(first.options.map((o) => o.display)) === JSON.stringify(second.options.map((o) => o.display)), `${definition.prototypeId}/${seed}: option replay drift.`);
    assert(first.permanentQlId === null, `${definition.prototypeId}/${seed}: permanent QL allocated during discovery.`);
    assert(!first.questionStudioDiscoverable && !first.publiclyPublishable, `${definition.prototypeId}/${seed}: product lifecycle leak.`);
    positions.add(first.correctIndex);
    deterministicPackageCount += 1;
  }
  assert(positions.size === 4, `${definition.prototypeId}: all four correct positions were not reached.`);
}

const review = buildMenCp010ReviewBatch();
assert(review.length === 64, `Expected 64 review records, got ${review.length}.`);
assert(new Set(review.map((question) => question.stem)).size === 64, "Review stems must be unique across Wave 01.");
const correctPositions = [0, 1, 2, 3].map((position) => review.filter((question) => question.correctIndex === position).length);
assert(correctPositions.every((count) => count === 16), `Review position balance must be 16/16/16/16; got ${correctPositions.join("/")}.`);
assert(review.every((question) => question.explanation.steps.length === 4), "Every review explanation must contain four connected teaching steps.");
assert(review.every((question) => question.diagram.responsive && question.diagram.minWidthPx === 0), "Every review diagram must be responsive.");

console.log(JSON.stringify({
  authority: "MEN-CP010-FOUNDATION-WAVE-01-V1",
  prototypes: registry.prototypeCount,
  deterministicPackages: deterministicPackageCount,
  reviewRecords: review.length,
  correctPositions: { A: correctPositions[0], B: correctPositions[1], C: correctPositions[2], D: correctPositions[3] },
  permanentQlCount: registry.permanentQlCount,
  lifecycleLocked: registry.lifecycleLocked,
}, null, 2));
