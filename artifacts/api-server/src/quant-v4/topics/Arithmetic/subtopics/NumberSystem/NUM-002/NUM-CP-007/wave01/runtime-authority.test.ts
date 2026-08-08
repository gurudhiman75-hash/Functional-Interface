import { generateNumCp007Wave01Package } from "./runtime.ts";
import { NUM_CP007_WAVE01_PROTOTYPE_IDS } from "./types.ts";
import { verifyNumCp007Wave01Package } from "./verifier.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerPrototype = 100;
let generatedPackages = 0;
let deterministicReplayChecks = 0;
let verifierChecks = 0;
let lifecycleViolations = 0;
const answerPositionsByPrototype: Record<string, number[]> = {};
const difficultyBandsByPrototype: Record<string, string[]> = {};
const distinctFingerprintsByPrototype: Record<string, number> = {};

for (const prototypeId of NUM_CP007_WAVE01_PROTOTYPE_IDS) {
  const positions = new Set<number>();
  const difficulties = new Set<string>();
  const fingerprints = new Set<string>();

  for (let seed = 1; seed <= seedsPerPrototype; seed++) {
    const pkg = generateNumCp007Wave01Package(prototypeId, seed);
    const replay = generateNumCp007Wave01Package(prototypeId, seed);
    generatedPackages++;

    assert(JSON.stringify(pkg) === JSON.stringify(replay), `${prototypeId} seed ${seed}: deterministic replay failed.`);
    deterministicReplayChecks++;

    const independentAnswer = verifyNumCp007Wave01Package(pkg);
    assert(pkg.canonicalAnswer === pkg.verifierAnswer, `${prototypeId} seed ${seed}: generator verifier mismatch.`);
    assert(pkg.canonicalAnswer === independentAnswer, `${prototypeId} seed ${seed}: independent verifier mismatch.`);
    verifierChecks++;

    assert(pkg.options.length === 4, `${prototypeId} seed ${seed}: expected four options.`);
    assert(new Set(pkg.options.map((option) => option.value)).size === 4, `${prototypeId} seed ${seed}: duplicate option values.`);
    assert(pkg.options.filter((option) => option.isCorrect).length === 1, `${prototypeId} seed ${seed}: expected one correct option.`);
    assert(pkg.correctIndex >= 0 && pkg.correctIndex < 4, `${prototypeId} seed ${seed}: invalid correct index.`);
    assert(pkg.options[pkg.correctIndex]?.isCorrect, `${prototypeId} seed ${seed}: correct index does not identify the correct option.`);
    assert(pkg.options[pkg.correctIndex]?.value === pkg.canonicalAnswer, `${prototypeId} seed ${seed}: canonical answer differs from correct option.`);
    assert(pkg.explanation.steps.length >= 2, `${prototypeId} seed ${seed}: explanation is too thin.`);
    assert(pkg.explanation.finalAnswer === pkg.canonicalAnswer, `${prototypeId} seed ${seed}: final answer is inconsistent.`);

    const lifecycle = pkg.lifecycle;
    const closed = pkg.permanentQlId === null && lifecycle.permanentQlId === null &&
      lifecycle.active === false && lifecycle.questionStudioDiscoverable === false &&
      lifecycle.questionBankWritable === false && lifecycle.testEligible === false &&
      lifecycle.publiclyPublishable === false;
    if (!closed) lifecycleViolations++;

    positions.add(pkg.correctIndex);
    difficulties.add(pkg.difficulty);
    fingerprints.add(pkg.mathematicalFingerprint);
  }

  assert(positions.size === 4, `${prototypeId}: all four answer positions were not reached.`);
  assert(difficulties.size >= 2, `${prototypeId}: fewer than two difficulty bands were reached.`);
  assert(fingerprints.size >= 40, `${prototypeId}: mathematical variation is too narrow.`);

  answerPositionsByPrototype[prototypeId] = [...positions].sort();
  difficultyBandsByPrototype[prototypeId] = [...difficulties].sort();
  distinctFingerprintsByPrototype[prototypeId] = fingerprints.size;
}

assert(lifecycleViolations === 0, `Lifecycle violations: ${lifecycleViolations}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP007_WAVE01_AUTHORITY",
  temporaryPrototypeCount: NUM_CP007_WAVE01_PROTOTYPE_IDS.length,
  seedsPerPrototype,
  generatedPackages,
  deterministicReplayChecks,
  verifierChecks,
  lifecycleViolations,
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-098",
  answerPositionsByPrototype,
  difficultyBandsByPrototype,
  distinctFingerprintsByPrototype,
  questionStudioDiscoverableCount: 0,
  questionBankWritableCount: 0,
  testEligibleCount: 0,
  publiclyPublishableCount: 0,
}, null, 2));
