import {
  verifyNumCp004RetainedAnswer,
} from "../completion/runtime";
import {
  NUM_CP004_PERMANENT_QL_IDS,
} from "./allocation";
import {
  runNumCp004PermanentPipeline,
} from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerQl = 80;
const answerPositions = new Map<string, Set<number>>();
const difficulties = new Map<string, Set<string>>();
const fingerprints = new Map<string, Set<string>>();
let generatedQuestions = 0;
let deterministicReplayChecks = 0;
let verifierChecks = 0;

for (const qlId of NUM_CP004_PERMANENT_QL_IDS) {
  answerPositions.set(qlId, new Set());
  difficulties.set(qlId, new Set());
  fingerprints.set(qlId, new Set());
  for (let seed = 1; seed <= seedsPerQl; seed += 1) {
    const first = runNumCp004PermanentPipeline({ questionLanguageId: qlId, seed });
    const replay = runNumCp004PermanentPipeline({ questionLanguageId: qlId, seed });
    generatedQuestions += 1;
    deterministicReplayChecks += 1;
    assert(JSON.stringify(first) === JSON.stringify(replay), `${qlId}/${seed}: non-deterministic replay`);
    assert(first.permanentQlId === qlId, `${qlId}/${seed}: permanent ID mismatch`);
    assert(first.questionLanguageId === qlId, `${qlId}/${seed}: QL trace mismatch`);
    assert(first.options.length === 4, `${qlId}/${seed}: option count`);
    assert(new Set(first.options.map((option) => option.value)).size === 4, `${qlId}/${seed}: option collision`);
    assert(first.options.filter((option) => option.isCorrect).length === 1, `${qlId}/${seed}: correct option count`);
    assert(first.options[first.correctIndex]?.value === first.canonicalAnswer, `${qlId}/${seed}: answer/index mismatch`);
    assert(first.explanation.commonTraps.length === 3, `${qlId}/${seed}: trap count`);
    const verifier = verifyNumCp004RetainedAnswer(first.temporaryTemplateId, first.hiddenState);
    verifierChecks += 1;
    assert(verifier === first.canonicalAnswer, `${qlId}/${seed}: independent verifier mismatch`);
    assert(first.verifierAnswer === first.canonicalAnswer, `${qlId}/${seed}: stored verifier mismatch`);
    assert(first.permanentIdentityFrozen, `${qlId}/${seed}: identity not frozen`);
    assert(!first.lifecycle.active, `${qlId}/${seed}: active leak`);
    assert(!first.lifecycle.questionStudioDiscoverable, `${qlId}/${seed}: Question Studio leak`);
    assert(!first.lifecycle.questionBankWritable, `${qlId}/${seed}: Question Bank leak`);
    assert(!first.lifecycle.testEligible, `${qlId}/${seed}: test leak`);
    assert(!first.lifecycle.publiclyPublishable, `${qlId}/${seed}: public leak`);
    answerPositions.get(qlId)!.add(first.correctIndex);
    difficulties.get(qlId)!.add(first.difficulty);
    fingerprints.get(qlId)!.add(first.mathematicalFingerprint);
  }
  assert(JSON.stringify([...answerPositions.get(qlId)!].sort()) === JSON.stringify([0, 1, 2, 3]), `${qlId}: answer-position reachability`);
  assert(JSON.stringify([...difficulties.get(qlId)!].sort()) === JSON.stringify(["EASY", "HARD", "MEDIUM"]), `${qlId}: difficulty reachability`);
  assert(fingerprints.get(qlId)!.size >= 20, `${qlId}: insufficient mathematical variation`);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP004_PERMANENT_ENGLISH_RUNTIME",
  permanentQlCount: NUM_CP004_PERMANENT_QL_IDS.length,
  seedsPerQl,
  generatedQuestions,
  deterministicReplayChecks,
  verifierChecks,
  distinctFingerprintsByQl: Object.fromEntries(
    [...fingerprints.entries()].map(([qlId, values]) => [qlId, values.size]),
  ),
  questionStudioDiscoverableCount: 0,
  questionBankWritableCount: 0,
  testEligibleCount: 0,
  publiclyPublishableCount: 0,
}, null, 2));
