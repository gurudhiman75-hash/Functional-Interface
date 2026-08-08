import { RNK_CP005_AUTHORITY_IDS } from "./cp005-foundation";
import {
  RNK_CP005_REASONING_REMODEL_VERSION,
  buildRnkCp005ReasoningPassage,
  generateRnkCp005ReasoningQuestion,
  solveRnkCp005ReasoningPassage,
  solveRnkCp005ReasoningQuestion,
} from "./cp005-reasoning-remodel-v2";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const evidenceCounts = new Map<string, number>();
const clueKindCounts = new Map<string, number>();
const fingerprints = new Set<string>();
let generatedQuestionsChecked = 0;

for (let seed = 0; seed < 192; seed += 1) {
  const passage = buildRnkCp005ReasoningPassage(seed);
  const solved = solveRnkCp005ReasoningPassage(passage);
  assert(passage.reasoningVersion === RNK_CP005_REASONING_REMODEL_VERSION, `set ${seed}: remodel version drift`);
  assert(passage.directRankExposure === false, `set ${seed}: direct-rank flag enabled`);
  assert(passage.rankRows.length < passage.entityCount, `set ${seed}: every rank is exposed`);
  assert(passage.rankRows.length <= 1, `set ${seed}: too many direct rank anchors`);
  assert(passage.reasoningClues.length >= passage.entityCount, `set ${seed}: insufficient visible clues`);
  assert(solved.solutionCount === 1, `set ${seed}: expected one solution, found ${solved.solutionCount}`);
  assert(solved.order.length === passage.entityCount, `set ${seed}: solved entity count mismatch`);
  assert(new Set(solved.order).size === solved.order.length, `set ${seed}: duplicate solved entity`);
  assert(!fingerprints.has(passage.sharedPassageFingerprint), `set ${seed}: duplicate reasoning fingerprint`);
  fingerprints.add(passage.sharedPassageFingerprint);

  const clueKinds = new Set(passage.reasoningClues.map((clue) => clue.kind));
  assert(clueKinds.size >= 2, `set ${seed}: clue set lacks variety`);
  assert(clueKinds.has("GAP"), `set ${seed}: rank-gap evidence missing`);
  assert(
    clueKinds.has("BEFORE") || clueKinds.has("IMMEDIATELY_BEFORE"),
    `set ${seed}: ordering relation missing`,
  );

  evidenceCounts.set(passage.evidenceMode, (evidenceCounts.get(passage.evidenceMode) ?? 0) + 1);
  for (const clue of passage.reasoningClues) {
    clueKindCounts.set(clue.kind, (clueKindCounts.get(clue.kind) ?? 0) + 1);
  }

  for (const authorityId of RNK_CP005_AUTHORITY_IDS) {
    const question = generateRnkCp005ReasoningQuestion(authorityId, seed, seed % 4);
    assert(
      question.sharedPassage.sharedPassageFingerprint === passage.sharedPassageFingerprint,
      `${authorityId}:${seed}: linked passage drift`,
    );
    assert(
      solveRnkCp005ReasoningQuestion(question.sharedPassage, question.query) === question.answerKey,
      `${authorityId}:${seed}: visible-evidence answer mismatch`,
    );
    generatedQuestionsChecked += 1;
  }
}

assert(evidenceCounts.size === 3, `Expected three evidence modes, found ${evidenceCounts.size}`);
assert((evidenceCounts.get("PARTIAL_RANK_TABLE") ?? 0) > 0, "Partial-rank-table mode missing");
assert((evidenceCounts.get("MIXED_CLUE_LEDGER") ?? 0) > 0, "Mixed-clue-ledger mode missing");
assert((evidenceCounts.get("COMPARISON_CLUES") ?? 0) > 0, "Comparison-clue mode missing");

console.log(JSON.stringify({
  status: "PASS",
  reasoningVersion: RNK_CP005_REASONING_REMODEL_VERSION,
  sharedSets: fingerprints.size,
  generatedQuestionsChecked,
  directRankExposureCount: 0,
  evidenceModes: Object.fromEntries(evidenceCounts),
  clueKinds: Object.fromEntries(clueKindCounts),
}, null, 2));
