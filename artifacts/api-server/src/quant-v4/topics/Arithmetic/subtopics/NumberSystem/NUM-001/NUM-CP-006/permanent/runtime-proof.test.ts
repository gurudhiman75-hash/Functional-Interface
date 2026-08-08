import { NUM_CP006_PERMANENT_ALLOCATION, NUM_CP006_PERMANENT_QL_IDS } from "./allocation";
import { runNumCp006PermanentPipeline } from "./runtime";
import { verifyNumCp006Answer } from "./verifier";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerQl = 120;
let generatedQuestions = 0;
let deterministicReplayChecks = 0;
let verifierChecks = 0;
let semanticOptionChecks = 0;
const answerPositionsByQl = new Map<string, Set<number>>();
const fingerprintsByQl = new Map<string, Set<string>>();
const difficultiesByQl = new Map<string, Set<string>>();
const prototypesReached = new Set<string>();

for (const allocation of NUM_CP006_PERMANENT_ALLOCATION) {
  const positions = new Set<number>();
  const fingerprints = new Set<string>();
  const difficulties = new Set<string>();
  answerPositionsByQl.set(allocation.qlId, positions);
  fingerprintsByQl.set(allocation.qlId, fingerprints);
  difficultiesByQl.set(allocation.qlId, difficulties);

  for (let seed = 1; seed <= seedsPerQl; seed += 1) {
    const question = runNumCp006PermanentPipeline({ questionLanguageId: allocation.qlId, seed });
    const replay = runNumCp006PermanentPipeline({ questionLanguageId: allocation.qlId, seed });
    generatedQuestions += 1;
    deterministicReplayChecks += 1;
    verifierChecks += 1;
    semanticOptionChecks += 1;

    assert(JSON.stringify(question) === JSON.stringify(replay), `${allocation.qlId}/${seed}: deterministic replay`);
    assert(question.verifierAnswer === verifyNumCp006Answer(allocation.qlId, question.hiddenState), `${allocation.qlId}/${seed}: verifier recomputation`);
    assert(question.canonicalAnswer === question.verifierAnswer, `${allocation.qlId}/${seed}: canonical/verifier mismatch`);
    assert(question.options.length === 4, `${allocation.qlId}/${seed}: option count`);
    assert(new Set(question.options.map((option) => option.value)).size === 4, `${allocation.qlId}/${seed}: literal option collision`);
    assert(question.options.filter((option) => option.isCorrect).length === 1, `${allocation.qlId}/${seed}: correct option count`);
    assert(question.options[question.correctIndex]?.value === question.canonicalAnswer, `${allocation.qlId}/${seed}: correct index`);
    assert(question.options.filter((option) => !option.isCorrect).every((option) => option.misconceptionId !== "CORRECT" && option.analysis.trim()), `${allocation.qlId}/${seed}: distractor ownership`);
    assert(question.explanation.stepByStep.length >= 2, `${allocation.qlId}/${seed}: explanation steps`);
    assert(question.explanation.commonTraps.length === 3, `${allocation.qlId}/${seed}: trap count`);
    assert(question.explanation.finalAnswer.includes(question.canonicalAnswer), `${allocation.qlId}/${seed}: final answer`);
    assert(question.permanentQlId === allocation.qlId, `${allocation.qlId}/${seed}: permanent identity`);
    assert(question.traceability.authorityId === allocation.authorityId, `${allocation.qlId}/${seed}: authority trace`);
    assert(question.authorityPrototypeIds.includes(question.temporaryPrototypeId), `${allocation.qlId}/${seed}: prototype trace`);
    assert(!question.lifecycle.active, `${allocation.qlId}/${seed}: active leak`);
    assert(!question.lifecycle.questionStudioDiscoverable, `${allocation.qlId}/${seed}: Question Studio leak`);
    assert(!question.lifecycle.questionBankWritable, `${allocation.qlId}/${seed}: Question Bank leak`);
    assert(!question.lifecycle.testEligible, `${allocation.qlId}/${seed}: test leak`);
    assert(!question.lifecycle.publiclyPublishable, `${allocation.qlId}/${seed}: public leak`);

    positions.add(question.correctIndex);
    fingerprints.add(question.mathematicalFingerprint);
    difficulties.add(question.difficulty);
    prototypesReached.add(question.temporaryPrototypeId);
  }

  assert(positions.size === 4, `${allocation.qlId}: answer-position reachability`);
  assert(fingerprints.size >= 20, `${allocation.qlId}: insufficient mathematical variation (${fingerprints.size})`);
}

assert(generatedQuestions === NUM_CP006_PERMANENT_QL_IDS.length * seedsPerQl, "generated corpus size");
assert(prototypesReached.size === 29, `prototype coverage ${prototypesReached.size}`);
assert(new Set([...difficultiesByQl.values()].flatMap((values) => [...values])).size === 3, "chapter difficulty coverage");

let unsupportedLanguageRejected = false;
try {
  runNumCp006PermanentPipeline({ language: "hi" as never });
} catch {
  unsupportedLanguageRejected = true;
}
assert(unsupportedLanguageRejected, "unsupported language rejection");

console.log(JSON.stringify({
  status: "PASS_NUM_CP006_PERMANENT_RUNTIME",
  permanentQlCount: NUM_CP006_PERMANENT_QL_IDS.length,
  solveModeCount: new Set(NUM_CP006_PERMANENT_ALLOCATION.map((entry) => entry.solveModeId)).size,
  seedsPerQl,
  generatedQuestions,
  deterministicReplayChecks,
  verifierChecks,
  semanticOptionChecks,
  prototypeCountReached: prototypesReached.size,
  answerPositionsByQl: Object.fromEntries([...answerPositionsByQl].map(([qlId, values]) => [qlId, [...values].sort()])),
  distinctFingerprintsByQl: Object.fromEntries([...fingerprintsByQl].map(([qlId, values]) => [qlId, values.size])),
  difficultyBandsByQl: Object.fromEntries([...difficultiesByQl].map(([qlId, values]) => [qlId, [...values].sort()])),
  unsupportedLanguageRejected,
  questionStudioDiscoverableCount: 0,
  questionBankWritableCount: 0,
  testEligibleCount: 0,
  publiclyPublishableCount: 0,
}, null, 2));
