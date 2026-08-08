import {
  RNK_CP005_AUTHORITY_IDS,
  RNK_CP005_CONTEXT_FAMILIES,
} from "./cp005-foundation";
import { buildRnkCp005EnglishReviewPack } from "./cp005-review-pack";
import { rnkCp005ReasoningClueText } from "./cp005-reasoning-remodel-v2";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const BANNED_AWKWARD_PHRASES = [
  "top end",
  "last end",
  "lowest end",
  "read from the first",
  "read from the highest",
  "towards the last of",
  "towards the lowest of",
  "top side",
  "last side",
  "highest side",
  "the table gives each person's position",
  "the ledger lists everyone from",
] as const;

const pack = buildRnkCp005EnglishReviewPack();
assert(pack.length === 144, `Expected 144 review questions, found ${pack.length}`);

const authorityCounts = new Map<string, number>();
const contexts = new Set<string>();
const evidenceModes = new Set<string>();
const stems = new Set<string>();
for (const question of pack) {
  authorityCounts.set(question.authorityId, (authorityCounts.get(question.authorityId) ?? 0) + 1);
  contexts.add(question.sharedPassage.contextFamily);
  evidenceModes.add(question.sharedPassage.evidenceMode);
  assert(question.sharedPassage.directRankExposure === false, `${question.authorityId}:${question.seed}: direct rank exposure`);
  assert(question.sharedPassage.rankRows.length < question.sharedPassage.entityCount, `${question.authorityId}:${question.seed}: complete rank table exposed`);
  assert(question.sharedPassage.reasoningClues.length >= question.sharedPassage.entityCount, `${question.authorityId}:${question.seed}: weak clue set`);
  assert(question.stem.length >= 100, `${question.authorityId}:${question.seed}: stem too short`);
  assert(question.stem.includes("Reconstruct the complete order"), `${question.authorityId}:${question.seed}: reconstruction instruction missing`);
  assert(!question.stem.includes("RNK-"), `${question.authorityId}:${question.seed}: internal ID leaked into stem`);
  assert(!question.visibleExplanation.conclusion.includes("RNK-"), `${question.authorityId}:${question.seed}: internal ID leaked into explanation`);
  assert(question.visibleExplanation.stepByStepSolution.length === 4, `${question.authorityId}:${question.seed}: explanation step count`);
  assert(question.visibleExplanation.examSpeedShortcut.length >= 80, `${question.authorityId}:${question.seed}: shortcut too weak`);
  assert(question.options.every((option) => option.explanation.length >= 20), `${question.authorityId}:${question.seed}: weak option analysis`);
  const clueText = question.sharedPassage.reasoningClues.map((clue) =>
    rnkCp005ReasoningClueText(clue, question.sharedPassage.contextFamily),
  );
  assert(clueText.every((clue) => clue.length >= 20), `${question.authorityId}:${question.seed}: underwritten clue`);
  const learnerText = [
    question.sharedPassage.instruction,
    ...clueText,
    question.stem,
    question.answer,
    ...question.options.map((option) => option.label),
    question.visibleExplanation.mentalPicture,
    ...question.visibleExplanation.stepByStepSolution,
  ].join(" ").toLowerCase();
  for (const phrase of BANNED_AWKWARD_PHRASES) {
    assert(!learnerText.includes(phrase), `${question.authorityId}:${question.seed}: awkward phrase '${phrase}'`);
  }
  stems.add(question.stem);
}
for (const authorityId of RNK_CP005_AUTHORITY_IDS) {
  assert(authorityCounts.get(authorityId) === 18, `${authorityId}: expected 18 review questions`);
}
assert(contexts.size === RNK_CP005_CONTEXT_FAMILIES.length, "review pack misses a context");
assert(evidenceModes.size === 3, "review pack misses an evidence mode");
assert(stems.size >= 60, `review pack has only ${stems.size} distinct question stems`);

console.log(JSON.stringify({
  status: "PASS",
  reviewCorpusSize: pack.length,
  authorities: Object.fromEntries(authorityCounts),
  contexts: [...contexts],
  evidenceModes: [...evidenceModes],
  directRankExposureCount: 0,
  repeatedFullStems: pack.length - stems.size,
}, null, 2));
