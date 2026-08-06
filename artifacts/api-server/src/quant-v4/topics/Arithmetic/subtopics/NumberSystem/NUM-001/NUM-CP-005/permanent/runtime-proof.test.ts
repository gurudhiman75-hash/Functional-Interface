import {
  NUM_CP005_PERMANENT_ALLOCATION,
  NUM_CP005_PERMANENT_QL_IDS,
} from "./allocation";
import { runNumCp005PermanentPipeline } from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerQl = 120;
const answerPositions = new Map<string, Set<number>>();
const difficulties = new Map<string, Set<string>>();
const fingerprints = new Map<string, Set<string>>();
const reachedPrototypes = new Map<string, Set<string>>();
let generatedQuestions = 0;
let deterministicReplayChecks = 0;
let verifierChecks = 0;

for (const allocation of NUM_CP005_PERMANENT_ALLOCATION) {
  const qlId = allocation.qlId;
  answerPositions.set(qlId, new Set());
  difficulties.set(qlId, new Set());
  fingerprints.set(qlId, new Set());
  reachedPrototypes.set(qlId, new Set());

  for (let seed = 1; seed <= seedsPerQl; seed += 1) {
    const first = runNumCp005PermanentPipeline({ questionLanguageId: qlId, seed });
    const replay = runNumCp005PermanentPipeline({ questionLanguageId: qlId, seed });
    generatedQuestions += 1;
    deterministicReplayChecks += 1;
    assert(JSON.stringify(first) === JSON.stringify(replay), `${qlId}/${seed}: non-deterministic replay`);
    assert(first.permanentQlId === qlId, `${qlId}/${seed}: permanent ID mismatch`);
    assert(first.questionLanguageId === qlId, `${qlId}/${seed}: QL trace mismatch`);
    assert(first.authorityId === allocation.authorityId, `${qlId}/${seed}: authority mismatch`);
    assert(first.solveModeId === allocation.solveModeId, `${qlId}/${seed}: solve-mode mismatch`);
    assert(allocation.prototypeIds.includes(first.temporaryPrototypeId as never), `${qlId}/${seed}: prototype outside authority`);
    assert(first.options.length === 4, `${qlId}/${seed}: option count`);
    assert(new Set(first.options.map((option) => option.value)).size === 4, `${qlId}/${seed}: option collision`);
    assert(first.options.filter((option) => option.isCorrect).length === 1, `${qlId}/${seed}: correct option count`);
    assert(first.options[first.correctIndex]?.value === first.canonicalAnswer, `${qlId}/${seed}: answer/index mismatch`);
    assert(first.explanation.commonTraps.length === 3, `${qlId}/${seed}: trap count`);
    verifierChecks += 1;
    assert(first.verifierAnswer === first.canonicalAnswer, `${qlId}/${seed}: independent verifier mismatch`);
    assert(first.permanentIdentityFrozen, `${qlId}/${seed}: identity not frozen`);
    assert(first.reviewStatus === "PRODUCT_OWNER_COMPLETION_AUTHORISED", `${qlId}/${seed}: review status`);
    assert(first.maturity === "ENGLISH_IMPLEMENTATION_FROZEN", `${qlId}/${seed}: maturity`);
    assert(!first.lifecycle.active, `${qlId}/${seed}: active leak`);
    assert(!first.lifecycle.questionStudioDiscoverable, `${qlId}/${seed}: Question Studio leak`);
    assert(!first.lifecycle.questionBankWritable, `${qlId}/${seed}: Question Bank leak`);
    assert(!first.lifecycle.testEligible, `${qlId}/${seed}: test leak`);
    assert(!first.lifecycle.publiclyPublishable, `${qlId}/${seed}: public leak`);
    answerPositions.get(qlId)!.add(first.correctIndex);
    difficulties.get(qlId)!.add(first.difficulty);
    fingerprints.get(qlId)!.add(first.mathematicalFingerprint);
    reachedPrototypes.get(qlId)!.add(first.temporaryPrototypeId);
  }

  assert(JSON.stringify([...answerPositions.get(qlId)!].sort()) === JSON.stringify([0, 1, 2, 3]), `${qlId}: answer-position reachability`);
  assert(JSON.stringify([...difficulties.get(qlId)!].sort()) === JSON.stringify(["EASY", "HARD", "MEDIUM"]), `${qlId}: difficulty reachability`);
  assert(fingerprints.get(qlId)!.size >= 8, `${qlId}: insufficient mathematical variation`);
  assert(
    JSON.stringify([...reachedPrototypes.get(qlId)!].sort()) === JSON.stringify([...allocation.prototypeIds].sort()),
    `${qlId}: merged-parameter prototype reachability`,
  );
}

let unsupportedLanguageRejected = false;
try {
  runNumCp005PermanentPipeline({ language: "hi" as never });
} catch {
  unsupportedLanguageRejected = true;
}
assert(unsupportedLanguageRejected, "unsupported language must be rejected");

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_PERMANENT_ENGLISH_RUNTIME",
  permanentQlCount: NUM_CP005_PERMANENT_QL_IDS.length,
  frozenSolveModeCount: new Set(NUM_CP005_PERMANENT_ALLOCATION.map((entry) => entry.solveModeId)).size,
  seedsPerQl,
  generatedQuestions,
  deterministicReplayChecks,
  verifierChecks,
  distinctFingerprintsByQl: Object.fromEntries(
    [...fingerprints.entries()].map(([qlId, values]) => [qlId, values.size]),
  ),
  reachedPrototypesByQl: Object.fromEntries(
    [...reachedPrototypes.entries()].map(([qlId, values]) => [qlId, [...values].sort()]),
  ),
  unsupportedLanguageRejected,
  questionStudioDiscoverableCount: 0,
  questionBankWritableCount: 0,
  testEligibleCount: 0,
  publiclyPublishableCount: 0,
}, null, 2));
