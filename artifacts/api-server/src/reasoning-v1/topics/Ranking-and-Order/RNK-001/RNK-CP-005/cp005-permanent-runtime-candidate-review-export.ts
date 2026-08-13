import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  buildRnkCp005PinnedPermanentRuntimeCandidate,
  RNK_CP005_PINNED_PERMANENT_RUNTIME_CANDIDATE_PROJECTION_SHA256,
  type RnkCp005PinnedPermanentRuntimeCandidateQuestion,
} from "./cp005-permanent-runtime-candidate-pinned-v1";
import type {
  RnkCp005PermanentRuntimeCandidateAuthorityId,
  RnkCp005PermanentRuntimeCandidateMode,
} from "./cp005-permanent-runtime-candidate-v1";

const outputDirectory = join(import.meta.dirname, "generated");
mkdirSync(outputDirectory, { recursive: true });
const outputPath = join(
  outputDirectory,
  "RNK-CP-005-PERMANENT-RUNTIME-CANDIDATE-REVIEW-36Q.md",
);

const runtime = buildRnkCp005PinnedPermanentRuntimeCandidate();

type AnswerIndex = 0 | 1 | 2 | 3;

const REVIEW_SLOT_PLAN: Readonly<Record<
  RnkCp005PermanentRuntimeCandidateMode,
  readonly AnswerIndex[]
>> = {
  MUST: [0, 1],
  COULD: [2, 3],
  CANNOT: [0, 2],
  PAIR_FIRST_ABOVE: [1, 3],
  PAIR_SECOND_ABOVE: [0, 3],
  PAIR_INDETERMINATE: [1, 2],
  HIGHEST_POSSIBLE: [0, 1, 2, 3, 0, 2],
  LOWEST_POSSIBLE: [0, 1, 2, 3, 1, 3],
  EXACT_DEFINITE: [0, 2, 0, 2, 0, 2],
  EXACT_INDETERMINATE: [1, 3, 1, 3, 1, 3],
};

const AUTHORITY_MODE_ORDER: Readonly<Record<
  RnkCp005PermanentRuntimeCandidateAuthorityId,
  readonly RnkCp005PermanentRuntimeCandidateMode[]
>> = {
  RELATION_TRUTH_STATUS: [
    "MUST",
    "COULD",
    "CANNOT",
    "PAIR_FIRST_ABOVE",
    "PAIR_SECOND_ABOVE",
    "PAIR_INDETERMINATE",
  ],
  POSSIBLE_RANK_BOUND: ["HIGHEST_POSSIBLE", "LOWEST_POSSIBLE"],
  EXACT_RANK_DETERMINACY: ["EXACT_DEFINITE", "EXACT_INDETERMINATE"],
};

const selected: RnkCp005PinnedPermanentRuntimeCandidateQuestion[] = [];
const selectedFingerprints = new Set<string>();
const contextsByAuthority = new Map<string, Set<string>>();
const topologiesByAuthority = new Map<string, Set<string>>();
const contextsByMode = new Map<string, Set<string>>();
const topologiesByMode = new Map<string, Set<string>>();

function diversityScore(
  question: RnkCp005PinnedPermanentRuntimeCandidateQuestion,
  authority: RnkCp005PermanentRuntimeCandidateAuthorityId,
  mode: RnkCp005PermanentRuntimeCandidateMode,
): number {
  const authorityContexts = contextsByAuthority.get(authority) ?? new Set<string>();
  const authorityTopologies = topologiesByAuthority.get(authority) ?? new Set<string>();
  const modeContexts = contextsByMode.get(mode) ?? new Set<string>();
  const modeTopologies = topologiesByMode.get(mode) ?? new Set<string>();
  return (
    (authorityContexts.has(question.context) ? 0 : 12) +
    (authorityTopologies.has(question.v3Topology) ? 0 : 8) +
    (modeContexts.has(question.context) ? 0 : 4) +
    (modeTopologies.has(question.v3Topology) ? 0 : 2) +
    (question.difficulty === "HARD" ? 1 : 0)
  );
}

function chooseQuestion(
  authority: RnkCp005PermanentRuntimeCandidateAuthorityId,
  mode: RnkCp005PermanentRuntimeCandidateMode,
  desiredIndex: AnswerIndex,
): RnkCp005PinnedPermanentRuntimeCandidateQuestion {
  const candidates = runtime
    .filter(
      (question) =>
        question.candidateRuntimeProfile.authorityCandidateId === authority &&
        question.candidateRuntimeProfile.mode === mode &&
        question.correctIndex === desiredIndex &&
        !selectedFingerprints.has(question.candidateRuntimeFingerprint),
    )
    .sort((first, second) => {
      const scoreDelta =
        diversityScore(second, authority, mode) - diversityScore(first, authority, mode);
      if (scoreDelta !== 0) return scoreDelta;
      return (
        first.candidateRuntimeProfile.ordinalWithinMode -
        second.candidateRuntimeProfile.ordinalWithinMode
      );
    });
  const chosen = candidates[0];
  if (!chosen) {
    throw new Error(`${authority}/${mode}: no review candidate for answer index ${desiredIndex}`);
  }
  return chosen;
}

function recordSelection(
  question: RnkCp005PinnedPermanentRuntimeCandidateQuestion,
): void {
  const authority = question.candidateRuntimeProfile.authorityCandidateId;
  const mode = question.candidateRuntimeProfile.mode;
  selected.push(question);
  selectedFingerprints.add(question.candidateRuntimeFingerprint);

  const authorityContexts = contextsByAuthority.get(authority) ?? new Set<string>();
  authorityContexts.add(question.context);
  contextsByAuthority.set(authority, authorityContexts);
  const authorityTopologies = topologiesByAuthority.get(authority) ?? new Set<string>();
  authorityTopologies.add(question.v3Topology);
  topologiesByAuthority.set(authority, authorityTopologies);

  const modeContexts = contextsByMode.get(mode) ?? new Set<string>();
  modeContexts.add(question.context);
  contextsByMode.set(mode, modeContexts);
  const modeTopologies = topologiesByMode.get(mode) ?? new Set<string>();
  modeTopologies.add(question.v3Topology);
  topologiesByMode.set(mode, modeTopologies);
}

for (const authority of [
  "RELATION_TRUTH_STATUS",
  "POSSIBLE_RANK_BOUND",
  "EXACT_RANK_DETERMINACY",
] as const) {
  for (const mode of AUTHORITY_MODE_ORDER[authority]) {
    for (const desiredIndex of REVIEW_SLOT_PLAN[mode]) {
      recordSelection(chooseQuestion(authority, mode, desiredIndex));
    }
  }
}

assert.equal(selected.length, 36);
assert.equal(selectedFingerprints.size, 36);
const answerPositions = [0, 0, 0, 0];
const authorityCounts = {
  RELATION_TRUTH_STATUS: 0,
  POSSIBLE_RANK_BOUND: 0,
  EXACT_RANK_DETERMINACY: 0,
};
const modeCounts = Object.fromEntries(
  Object.keys(REVIEW_SLOT_PLAN).map((mode) => [mode, 0]),
) as Record<RnkCp005PermanentRuntimeCandidateMode, number>;
const allContexts = new Set<string>();
const allTopologies = new Set<string>();
for (const question of selected) {
  answerPositions[question.correctIndex] += 1;
  authorityCounts[question.candidateRuntimeProfile.authorityCandidateId] += 1;
  modeCounts[question.candidateRuntimeProfile.mode] += 1;
  allContexts.add(question.context);
  allTopologies.add(question.v3Topology);
  assert.equal(question.candidateRuntimeProfile.projectionDigestPinned, true);
  assert.equal(question.candidateRuntimeProfile.permanentQlId, null);
  assert.equal(question.candidateRuntimeProfile.englishFreezeApproved, false);
  assert.equal(question.lifecycle.permanentQlAllocated, false);
  assert.equal(question.lifecycle.questionStudio, "DISABLED");
  assert.equal(question.lifecycle.publiclyPublishable, false);
}
assert.deepEqual(answerPositions, [9, 9, 9, 9]);
assert.deepEqual(authorityCounts, {
  RELATION_TRUTH_STATUS: 12,
  POSSIBLE_RANK_BOUND: 12,
  EXACT_RANK_DETERMINACY: 12,
});
for (const [mode, slots] of Object.entries(REVIEW_SLOT_PLAN)) {
  assert.equal(modeCounts[mode as RnkCp005PermanentRuntimeCandidateMode], slots.length);
}
assert.equal(allContexts.size, 5);
assert.ok(allTopologies.size >= 7);
for (const authority of Object.keys(authorityCounts)) {
  assert.ok((contextsByAuthority.get(authority)?.size ?? 0) >= 4);
  assert.ok((topologiesByAuthority.get(authority)?.size ?? 0) >= 4);
}

const answerLetters = ["A", "B", "C", "D"] as const;

function questionMarkdown(
  question: RnkCp005PinnedPermanentRuntimeCandidateQuestion,
  index: number,
): string {
  const profile = question.candidateRuntimeProfile;
  const optionLines = question.options.map(
    (option, optionIndex) => `${answerLetters[optionIndex]}. ${option.label}`,
  );
  const optionChecks = question.options.map(
    (option, optionIndex) => `- **${answerLetters[optionIndex]}:** ${option.explanation}`,
  );
  return [
    `## Q${index + 1} — ${profile.authorityCandidateId} / ${profile.mode}`,
    "",
    `**Review metadata:** source \`${profile.sourceForm}\` · context \`${question.context}\` · topology \`${question.v3Topology}\` · difficulty **${question.difficulty}** · authority ordinal **${profile.ordinalWithinAuthority}** · source ordinal **${profile.sourceOrdinal}**`,
    "",
    question.instruction,
    "",
    ...question.clues.map((clue) => `- ${clue}`),
    "",
    `**Question:** ${question.stem}`,
    "",
    ...optionLines,
    "",
    `**Correct answer:** ${answerLetters[question.correctIndex]}. ${question.answer}`,
    "",
    "**Explanation:**",
    ...question.explanation.map((step) => `- ${step}`),
    "",
    "**Option checks:**",
    ...optionChecks,
    "",
  ].join("\n");
}

const markdown = [
  "# RNK-CP-005 Permanent Runtime Candidate — Final Manual Freeze Review (36 Questions)",
  "",
  "> **Freeze gate only.** No permanent QL ID is allocated by this pack. English freeze is **not approved** until manual signoff. Question Studio, persistence, Question Bank, test eligibility and public publication remain disabled.",
  "",
  "## Candidate runtime under review",
  "",
  "```text",
  "authorities:                     3",
  "candidate questions:           576",
  "questions/authority:           192",
  "review questions:               36",
  "review questions/authority:     12",
  "review answer positions:   9/9/9/9",
  `projection sha256: ${RNK_CP005_PINNED_PERMANENT_RUNTIME_CANDIDATE_PROJECTION_SHA256}`,
  "permanent QLs allocated:         0",
  "next available QL:      RNK-QL-036",
  "English freeze:        NOT APPROVED",
  "```",
  "",
  "### Review composition",
  "",
  "- `RELATION_TRUTH_STATUS`: 2 each of MUST, COULD, CANNOT, PAIR_FIRST_ABOVE, PAIR_SECOND_ABOVE, PAIR_INDETERMINATE.",
  "- `POSSIBLE_RANK_BOUND`: 6 HIGHEST_POSSIBLE + 6 LOWEST_POSSIBLE.",
  "- `EXACT_RANK_DETERMINACY`: 6 EXACT_DEFINITE + 6 EXACT_INDETERMINATE.",
  "- The review pack is deliberately balanced across answer positions and selected for context/topology diversity.",
  "",
  ...selected.map(questionMarkdown),
  "# Review summary", 
  "",
  `Answer positions: **${answerPositions.join(" / ")}**`,
  "",
  `Contexts represented: **${[...allContexts].sort().join(", ")}**`,
  "",
  `Topologies represented: **${[...allTopologies].sort().join(", ")}**`,
  "",
  "This pack does **not** allocate `RNK-QL-036..038` and does **not** approve English freeze.",
  "",
].join("\n");

writeFileSync(outputPath, markdown, "utf8");

console.log(JSON.stringify({
  status: "PASS",
  outputPath,
  questions: selected.length,
  authorityCounts,
  modeCounts,
  answerPositions,
  contexts: [...allContexts].sort(),
  topologies: [...allTopologies].sort(),
  contextsPerAuthority: Object.fromEntries(
    [...contextsByAuthority].map(([authority, values]) => [authority, [...values].sort()]),
  ),
  topologiesPerAuthority: Object.fromEntries(
    [...topologiesByAuthority].map(([authority, values]) => [authority, [...values].sort()]),
  ),
  projectionSha256: RNK_CP005_PINNED_PERMANENT_RUNTIME_CANDIDATE_PROJECTION_SHA256,
  permanentQlAllocated: false,
  englishFreezeApproved: false,
}, null, 2));
