import {
  RNK_CP005_AUTHORITY_IDS,
  RNK_CP005_CONTEXT_FAMILIES,
  RNK_CP005_PRESENTATION_MODES,
} from "./cp005-foundation";
import { buildRnkCp005EnglishReviewPack } from "./cp005-review-pack";

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
] as const;

const pack = buildRnkCp005EnglishReviewPack();
assert(pack.length === 144, `Expected 144 review questions, found ${pack.length}`);

const authorityCounts = new Map<string, number>();
const contexts = new Set<string>();
const modes = new Set<string>();
const stems = new Set<string>();
for (const question of pack) {
  authorityCounts.set(question.authorityId, (authorityCounts.get(question.authorityId) ?? 0) + 1);
  contexts.add(question.sharedPassage.contextFamily);
  modes.add(question.sharedPassage.presentationMode);
  assert(question.stem.length >= 70, `${question.authorityId}:${question.seed}: stem too short`);
  assert(!question.stem.includes("RNK-"), `${question.authorityId}:${question.seed}: internal ID leaked into stem`);
  assert(!question.visibleExplanation.conclusion.includes("RNK-"), `${question.authorityId}:${question.seed}: internal ID leaked into explanation`);
  assert(question.visibleExplanation.stepByStepSolution.length === 4, `${question.authorityId}:${question.seed}: explanation step count`);
  assert(question.visibleExplanation.examSpeedShortcut.length >= 40, `${question.authorityId}:${question.seed}: shortcut too weak`);
  assert(question.options.every((option) => option.explanation.length >= 20), `${question.authorityId}:${question.seed}: weak option analysis`);
  const learnerText = [
    question.sharedPassage.instruction,
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
assert(modes.size === RNK_CP005_PRESENTATION_MODES.length, "review pack misses a presentation mode");
assert(stems.size >= 60, `review pack has only ${stems.size} distinct question stems`);

console.log(JSON.stringify({
  status: "PASS",
  reviewCorpusSize: pack.length,
  authorities: Object.fromEntries(authorityCounts),
  contexts: [...contexts],
  presentationModes: [...modes],
  repeatedFullStems: pack.length - stems.size,
}, null, 2));
