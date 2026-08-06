import {
  SER_CP007_CANDIDATE_13_MAP,
  SER_CP007_DISCOVERY_AUTHORITY_IDS,
  SER_CP007_TEMPLATE_PROBES_V6,
} from "../SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-compression-contract-v6";
import type { SerCp007EditorialQuestion } from "./adaptive-review";
import {
  buildAdaptiveSerCp007ReviewV6,
  type SerCp007AdaptiveReviewV6,
} from "./adaptive-review-v6";

interface ReviewEntry {
  readonly candidateAuthorityId: string;
  readonly originalAuthorityId: string;
  readonly waveId: string;
  readonly sourceRuleId: string;
  readonly question: SerCp007EditorialQuestion;
  readonly review: SerCp007AdaptiveReviewV6;
}

const taskPriority: Readonly<Record<string, number>> = {
  NEXT_TERM: 0,
  MISSING_TERM: 1,
  WRONG_TERM: 2,
  REPLACE_WRONG_TERM: 2,
  PREVIOUS_TERM: 3,
  NEXT_TWO_TERMS: 4,
  MISSING_TWO_TERMS: 4,
  WRONG_AND_REPLACEMENT: 5,
  FILL_GAPS: 6,
  FILL_GAP_GROUPS: 6,
};

function increment(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

const sortedProbes = [...SER_CP007_TEMPLATE_PROBES_V6].sort((left, right) =>
  [
    SER_CP007_CANDIDATE_13_MAP[left.originalAuthorityId],
    left.taskKind,
    left.temporaryTemplateId,
  ]
    .join("|")
    .localeCompare(
      [
        SER_CP007_CANDIDATE_13_MAP[right.originalAuthorityId],
        right.taskKind,
        right.temporaryTemplateId,
      ].join("|"),
    ),
);

const entries: ReviewEntry[] = [];
for (const [probeIndex, probe] of sortedProbes.entries()) {
  const seeds = probeIndex % 7 === 6 ? [1, 2] : [1, 2, 3];
  for (const seed of seeds) {
    const question = probe.generate(seed) as unknown as SerCp007EditorialQuestion;
    const review = buildAdaptiveSerCp007ReviewV6(question);
    if (!review.structuralDepth.passesStructuralDepth) {
      throw new Error(
        `${question.temporaryTemplateId}:${seed} failed V6: ${review.structuralDepth.blockers.join(", ")}`,
      );
    }
    entries.push({
      candidateAuthorityId:
        SER_CP007_CANDIDATE_13_MAP[probe.originalAuthorityId],
      originalAuthorityId: probe.originalAuthorityId,
      waveId: probe.waveId,
      sourceRuleId: probe.sourceRuleId,
      question,
      review,
    });
  }
}

if (entries.length !== 400) {
  throw new Error(`Expected exactly 400 V6 entries, received ${entries.length}.`);
}
if (new Set(entries.map((entry) => entry.question.temporaryTemplateId)).size !== 140) {
  throw new Error("Expected all 140 temporary templates in V6 export.");
}
if (new Set(entries.map((entry) => entry.candidateAuthorityId)).size !== 13) {
  throw new Error("Expected all 13 candidate authorities in V6 export.");
}

entries.sort((left, right) =>
  [
    left.candidateAuthorityId,
    left.review.editorialTaskKind,
    left.question.temporaryTemplateId,
    String(left.question.seed).padStart(3, "0"),
  ]
    .join("|")
    .localeCompare(
      [
        right.candidateAuthorityId,
        right.review.editorialTaskKind,
        right.question.temporaryTemplateId,
        String(right.question.seed).padStart(3, "0"),
      ].join("|"),
    ),
);

const entriesByPool = new Map<string, ReviewEntry[]>();
for (const entry of entries) {
  const pool = entry.review.studentReleasePoolKey;
  entriesByPool.set(pool, [...(entriesByPool.get(pool) ?? []), entry]);
}

const primaryQuestionIds = new Set<string>();
for (const poolEntries of entriesByPool.values()) {
  const primary = [...poolEntries].sort((left, right) => {
    const leftRelease = left.review.releaseTier === "STANDARD_MOCK" ? 0 : 1;
    const rightRelease = right.review.releaseTier === "STANDARD_MOCK" ? 0 : 1;
    if (leftRelease !== rightRelease) return leftRelease - rightRelease;
    const leftTask = taskPriority[left.question.taskKind] ?? 99;
    const rightTask = taskPriority[right.question.taskKind] ?? 99;
    if (leftTask !== rightTask) return leftTask - rightTask;
    return left.question.temporaryTemplateId.localeCompare(
      right.question.temporaryTemplateId,
    );
  })[0]!;
  primaryQuestionIds.add(
    `${primary.question.temporaryTemplateId}:${primary.question.seed}`,
  );
}

const authorityCounts = new Map<string, number>();
const taskCounts = new Map<string, number>();
const difficultyCounts = new Map<string, number>();
const releaseCounts = new Map<string, number>();
let standardPrimaryQuestions = 0;
let visibleAnswerOccurrences = 0;
let determinateInsertionQuestions = 0;
let cycleSafeRotationQuestions = 0;
for (const entry of entries) {
  increment(authorityCounts, entry.candidateAuthorityId);
  increment(taskCounts, entry.review.editorialTaskKind);
  increment(difficultyCounts, entry.review.difficulty);
  increment(releaseCounts, entry.review.releaseTier);
  visibleAnswerOccurrences += entry.review.structuralDepth.visibleAnswerOccurrences;
  if (
    primaryQuestionIds.has(
      `${entry.question.temporaryTemplateId}:${entry.question.seed}`,
    ) && entry.review.releaseTier === "STANDARD_MOCK"
  ) {
    standardPrimaryQuestions += 1;
  }
  if (
    entry.question.sourceRuleId === "CENTER_INSERTION_GROWTH" ||
    entry.question.sourceRuleId === "ALTERNATING_INTERIOR_INSERTION_GROWTH"
  ) {
    determinateInsertionQuestions += 1;
  }
  if (
    entry.question.sourceRuleId === "CYCLIC_CLUSTER_ROTATION" ||
    entry.question.sourceRuleId === "NEXT_TWO_ROTATION"
  ) {
    cycleSafeRotationQuestions += 1;
  }
}

const sections: string[] = [
  "# SER-CP-007 V6 — 400 Validity-Remediated Questions and Explanations",
  "",
  "V6 implements the targeted remediation required by the full V5 audit.",
  "This remains a generation-validation corpus. Student release must use only one PRIMARY question from each mutually exclusive underlying-series pool.",
  "Permanent QLs remain unallocated and English freeze remains pending manual approval.",
  "",
  "## V6 corrections",
  "",
  "- rejects a question when any complete answer term is already visible;",
  "- detects partial cycles such as five unique rotation states repeated across eight terms;",
  "- rebuilds cyclic rotations as seven distinct states and stops before repetition;",
  "- gives centre/interior insertion a fixed inserted-letter progression, making next-term forms determinate;",
  "- states both left-edge and right-edge progressions in symmetric growth;",
  "- preserves conceptual progressive jumps beyond ±13 and labels alphabet wraparound separately;",
  "- follows the correct forward/backward alphabet direction in consecutive-block explanations;",
  "- explains rotations as position changes, not alphabet-value changes;",
  "- suppresses unverified generic distractor Check sentences;",
  "- recalibrates difficulty so repeated application and visual length alone do not automatically create a Hard item;",
  "- separates the 400-record validation corpus from mutually exclusive student-release pools.",
  "",
  "## Pack summary",
  "",
  "```text",
  `Validation records:                 ${entries.length}`,
  `Templates represented:              ${new Set(entries.map((entry) => entry.question.temporaryTemplateId)).size}`,
  `Candidate authorities:              ${new Set(entries.map((entry) => entry.candidateAuthorityId)).size}`,
  `Discovery authorities:              ${SER_CP007_DISCOVERY_AUTHORITY_IDS.length}`,
  `Structural failures:                ${entries.filter((entry) => !entry.review.structuralDepth.passesStructuralDepth).length}`,
  `Visible complete-answer occurrences:${visibleAnswerOccurrences}`,
  `Determinate insertion questions:    ${determinateInsertionQuestions}`,
  `Cycle-safe rotation questions:      ${cycleSafeRotationQuestions}`,
  `Independent release pools:          ${entriesByPool.size}`,
  `Mutually exclusive variants:        ${entries.length - entriesByPool.size}`,
  `Standard-mock PRIMARY candidates:   ${standardPrimaryQuestions}`,
  "Options per question:               4",
  "Permanent QLs:                      0",
  "```",
  "",
  "## Difficulty distribution",
  "",
  "| Difficulty | Questions |",
  "|---|---:|",
  ...[...difficultyCounts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([difficulty, count]) => `| ${difficulty} | ${count} |`),
  "",
  "## Release-tier distribution",
  "",
  "| Release tier | Questions |",
  "|---|---:|",
  ...[...releaseCounts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([tier, count]) => `| ${tier} | ${count} |`),
  "",
  "## Task distribution",
  "",
  "| Task | Questions |",
  "|---|---:|",
  ...[...taskCounts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([task, count]) => `| \`${task}\` | ${count} |`),
  "",
  "## Candidate-authority distribution",
  "",
  "| Candidate authority | Questions |",
  "|---|---:|",
  ...[...authorityCounts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([authority, count]) => `| \`${authority}\` | ${count} |`),
  "",
  "## Release-pool rule",
  "",
  "Only one question with the same `Student release pool` may appear in the learner-facing bank or test ecosystem. All other task variants are validation-only until a different underlying series state is generated.",
  "",
  "---",
  "",
];

for (const [index, entry] of entries.entries()) {
  const number = String(index + 1).padStart(3, "0");
  const identity = `${entry.question.temporaryTemplateId}:${entry.question.seed}`;
  const primary = primaryQuestionIds.has(identity);
  sections.push(
    `## Question ${number}`,
    "",
    `- **Candidate authority:** \`${entry.candidateAuthorityId}\``,
    `- **Discovery authority:** \`${entry.originalAuthorityId}\``,
    `- **Template:** \`${entry.question.temporaryTemplateId}\``,
    `- **Seed:** \`${entry.question.seed}\``,
    `- **Wave:** \`${entry.waveId}\``,
    `- **Source rule:** \`${entry.sourceRuleId}\``,
    `- **Task:** \`${entry.review.editorialTaskKind}\``,
    `- **Difficulty:** **${entry.review.difficulty}**`,
    `- **Release tier:** **${entry.review.releaseTier}**`,
    `- **Structural validity:** **PASS**`,
    `- **Visible answer occurrences:** ${entry.review.structuralDepth.visibleAnswerOccurrences}`,
    `- **Unique canonical states:** ${entry.review.structuralDepth.uniqueCanonicalTermCount}/${entry.review.structuralDepth.canonicalTermCount}`,
    `- **Determinate rule:** **${entry.review.structuralDepth.determinateRule ? "YES" : "NO"}**`,
    `- **Student release pool:** \`${entry.review.studentReleasePoolKey}\``,
    `- **Pool status:** **${primary ? "PRIMARY" : "MUTUALLY_EXCLUSIVE_VARIANT"}**`,
    "",
    entry.review.review,
    "",
    "### Reviewer checklist",
    "",
    "- [ ] No complete answer term is already visible",
    "- [ ] No short or partial cycle reveals the answer",
    "- [ ] Every next-term choice is mathematically determined",
    "- [ ] Wraparound preserves the conceptual jump sequence",
    "- [ ] Consecutive letters are followed in the correct direction",
    "- [ ] Growth explanations state how newly added letters are chosen",
    "- [ ] Rotation/permutation is explained positionally",
    "- [ ] All three distractors are plausible for this exact rule",
    "- [ ] Difficulty and release tier are appropriate",
    "- [ ] Pool status is appropriate for learner release",
    "- [ ] Approved without revision",
    "",
    "**Reviewer notes:**",
    "",
    "> ",
    "",
    "---",
    "",
  );
}

sections.push(
  "# Final V6 chapter-review decision",
  "",
  "- [ ] All 400 validation records reviewed",
  "- [ ] All PRIMARY release candidates reviewed",
  "- [ ] No visible-answer or partial-cycle leak remains",
  "- [ ] Insertion and symmetric-growth rules are complete",
  "- [ ] Progressive wraparound explanations are approved",
  "- [ ] Directional consecutive explanations are approved",
  "- [ ] Distractors are approved manually",
  "- [ ] Difficulty and release pools are approved",
  "- [ ] Ready for English freeze proposal",
  "",
  "**Final notes:**",
  "",
  "> ",
  "",
);

console.log(sections.join("\n"));
