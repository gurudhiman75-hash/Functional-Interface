import {
  NUM_CP001_PERMANENT_ALLOCATION,
  NUM_CP001_PERMANENT_QL_IDS,
} from "./allocation";
import { runNumCp001PermanentPipeline } from "./runtime";

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
let optionChecks = 0;

for (const allocation of NUM_CP001_PERMANENT_ALLOCATION) {
  const qlId = allocation.qlId;
  answerPositions.set(qlId, new Set());
  difficulties.set(qlId, new Set());
  fingerprints.set(qlId, new Set());
  reachedPrototypes.set(qlId, new Set());

  for (let seed = 1; seed <= seedsPerQl; seed += 1) {
    const first = runNumCp001PermanentPipeline({ questionLanguageId: qlId, seed });
    const replay = runNumCp001PermanentPipeline({ questionLanguageId: qlId, seed });
    generatedQuestions += 1;
    deterministicReplayChecks += 1;

    assert(JSON.stringify(first) === JSON.stringify(replay), `${qlId}/${seed}: non-deterministic replay`);
    assert(first.permanentQlId === qlId, `${qlId}/${seed}: permanent ID mismatch`);
    assert(first.questionLanguageId === qlId, `${qlId}/${seed}: QL trace mismatch`);
    assert(first.proposalId === allocation.proposalId, `${qlId}/${seed}: authority mismatch`);
    assert(first.solveModeId === allocation.solveModeId, `${qlId}/${seed}: solve-mode mismatch`);
    assert(allocation.prototypeIds.includes(first.temporaryPrototypeId), `${qlId}/${seed}: prototype outside authority`);

    optionChecks += 1;
    assert(first.options.length === 4, `${qlId}/${seed}: option count`);
    assert(new Set(first.options.map((option) => option.value)).size === 4, `${qlId}/${seed}: literal option collision`);
    assert(first.options.filter((option) => option.isCorrect).length === 1, `${qlId}/${seed}: correct option count`);
    assert(first.options[first.correctIndex]?.value === first.canonicalAnswer, `${qlId}/${seed}: answer/index mismatch`);

    verifierChecks += 1;
    assert(first.verifierAnswer === first.canonicalAnswer, `${qlId}/${seed}: independent verifier mismatch`);
    assert(first.permanentIdentityFrozen, `${qlId}/${seed}: identity not frozen`);
    assert(first.solveModeFrozen, `${qlId}/${seed}: solve mode not frozen`);
    assert(first.englishImplementationFrozen, `${qlId}/${seed}: English implementation not frozen`);
    assert(first.allocationStatus === "PRODUCT_OWNER_APPROVED_INACTIVE_MULTILINGUAL_IMPLEMENTATION", `${qlId}/${seed}: allocation status`);
    assert(first.reviewStatus === "PRODUCT_OWNER_COMPLETION_AUTHORISED", `${qlId}/${seed}: review status`);
    assert(first.maturity === "MULTILINGUAL_IMPLEMENTATION_FROZEN", `${qlId}/${seed}: maturity`);
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
  assert(difficulties.get(qlId)!.size >= 2, `${qlId}: insufficient state-derived difficulty variation`);
  assert(fingerprints.get(qlId)!.size >= 4, `${qlId}: insufficient mathematical variation`);
  assert(
    JSON.stringify([...reachedPrototypes.get(qlId)!].sort()) === JSON.stringify([...allocation.prototypeIds].sort()),
    `${qlId}: merged-parameter prototype reachability`,
  );
}

let unsupportedLanguageRejected = false;
try {
  runNumCp001PermanentPipeline({ language: "hi" as never });
} catch {
  unsupportedLanguageRejected = true;
}
assert(unsupportedLanguageRejected, "canonical runtime must reject translated languages and route them through localization adapter");

console.log(JSON.stringify({
  status: "PASS_NUM_CP001_PERMANENT_MULTILINGUAL_FROZEN_RUNTIME",
  canonicalRuntimeLanguage: "en",
  translatedRuntimeLanguages: ["hi", "pa"],
  permanentQlCount: NUM_CP001_PERMANENT_QL_IDS.length,
  solveModeCount: new Set(NUM_CP001_PERMANENT_ALLOCATION.map((entry) => entry.solveModeId)).size,
  representedPrototypeCount: new Set(NUM_CP001_PERMANENT_ALLOCATION.flatMap((entry) => [...entry.prototypeIds])).size,
  seedsPerQl,
  generatedQuestions,
  deterministicReplayChecks,
  verifierChecks,
  optionChecks,
  distinctFingerprintsByQl: Object.fromEntries([...fingerprints.entries()].map(([qlId, values]) => [qlId, values.size])),
  reachedPrototypesByQl: Object.fromEntries([...reachedPrototypes.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
  difficultyBandsByQl: Object.fromEntries([...difficulties.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
  unsupportedLanguageRejected,
  reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED",
  maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN",
  questionStudioDiscoverableCount: 0,
  questionBankWritableCount: 0,
  testEligibleCount: 0,
  publiclyPublishableCount: 0,
}, null, 2));
