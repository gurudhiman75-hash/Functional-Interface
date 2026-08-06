import {
  SER_CP007_CANDIDATE_13_MAP,
  SER_CP007_DISCOVERY_AUTHORITY_IDS,
  SER_CP007_TEMPLATE_PROBES_V7,
} from "../SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-compression-contract-v7";
import type { SerCp007EditorialQuestion } from "./adaptive-review";
import type { SerCp007AdaptiveReviewV7 } from "./adaptive-review-v7";
import { buildAdaptiveSerCp007ReviewV7Final } from "./adaptive-review-v7-final";
import { isUniformWholeAnswerShiftV7 } from "./distractor-remediation-v7";
import {
  selectSerCp007PrimaryReleaseV7,
  type SerCp007ReleaseEntryV7,
} from "./student-release-selection-v7";

interface ExportEntry extends SerCp007ReleaseEntryV7 {
  readonly candidateAuthorityId: string;
  readonly originalAuthorityId: string;
  readonly waveId: string;
  readonly sourceRuleId: string;
}

function increment(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function identity(entry: SerCp007ReleaseEntryV7): string {
  return `${entry.question.temporaryTemplateId}:${entry.question.seed}`;
}

function explanationOnly(review: string): string {
  const marker = "### Explanation\n\n";
  const index = review.indexOf(marker);
  return index >= 0 ? review.slice(index + marker.length).trim() : review;
}

const sortedProbes = [...SER_CP007_TEMPLATE_PROBES_V7].sort((left, right) =>
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

const entries: ExportEntry[] = [];
for (const [probeIndex, probe] of sortedProbes.entries()) {
  const seeds = probeIndex % 7 === 6 ? [1, 2] : [1, 2, 3];
  for (const seed of seeds) {
    const question = probe.generate(seed) as unknown as SerCp007EditorialQuestion;
    const review = buildAdaptiveSerCp007ReviewV7Final(question);
    if (!review.structuralDepth.passesStructuralDepth) {
      throw new Error(
        `${question.temporaryTemplateId}:${seed} failed V7 structural depth.`,
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
  throw new Error(`Expected exactly 400 V7 records, received ${entries.length}.`);
}
if (new Set(entries.map((entry) => entry.question.temporaryTemplateId)).size !== 140) {
  throw new Error("Expected all 140 temporary templates in V7 export.");
}
if (new Set(entries.map((entry) => entry.candidateAuthorityId)).size !== 13) {
  throw new Error("Expected all 13 candidate authorities in V7 export.");
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

const selection = selectSerCp007PrimaryReleaseV7(entries);
const authorityCounts = new Map<string, number>();
const taskCounts = new Map<string, number>();
const difficultyCounts = new Map<string, number>();
const releaseCounts = new Map<string, number>();
let interleavedRecords = 0;
let sameRowProofFailures = 0;
let markerPositionRecords = 0;
let uniformShiftDistractors = 0;
for (const entry of entries) {
  increment(authorityCounts, entry.candidateAuthorityId);
  increment(taskCounts, entry.review.editorialTaskKind);
  increment(difficultyCounts, entry.review.difficulty);
  increment(releaseCounts, entry.review.releaseTier);
  if (entry.review.interleavedProof) {
    interleavedRecords += 1;
    if (!entry.review.interleavedProof.passesSameRowProof) {
      sameRowProofFailures += 1;
    }
  }
  if (entry.sourceRuleId === "UNIFORM_FRAME_CASE_MARKER_ROTATION") {
    markerPositionRecords += 1;
  }
  for (const option of entry.review.options) {
    if (
      option !== entry.question.correctAnswer &&
      isUniformWholeAnswerShiftV7(option, entry.question.correctAnswer)
    ) {
      uniformShiftDistractors += 1;
    }
  }
}

if (sameRowProofFailures !== 0 || uniformShiftDistractors !== 0) {
  throw new Error(
    `V7 export blockers: same-row=${sameRowProofFailures}, uniform-shifts=${uniformShiftDistractors}`,
  );
}

const sections: string[] = [
  "# SER-CP-007 V7 — 400 Editorially Remediated Questions and Explanations",
  "",
  "V7 is the focused editorial remediation requested after the complete V6 exam-readiness review.",
  "The 400 records remain a validation corpus, not 400 independent learner questions.",
  "Only one PRIMARY record from each Student release pool may enter a learner-facing ecosystem.",
  "Permanent QLs remain unallocated and English freeze remains pending manual approval.",
  "",
  "## V7 corrections",
  "",
  "- rebuilds every interleaved explanation from transitions inside the target row;",
  "- provides executable same-row proof metadata for every interleaved record;",
  "- explains lowercase marker movement through marker positions, not false zero alphabet shifts;",
  "- replaces uniform whole-answer Caesar-shift distractors with rule-local or local-error alternatives;",
  "- moves progressive-column questions to advanced practice;",
  "- applies a standard-mock ceiling of 10 letters per term and about 50 visible letters;",
  "- treats long progressive substitution and symmetric growth as advanced visual work;",
  "- supplies concise explanations with a separate expanded-help mode;",
  "- selects PRIMARY tasks with a balanced deterministic policy instead of defaulting most pools to next-term questions;",
  "- exports an enforceable release-pool contract for current tests, recent practice and mock packages.",
  "",
  "## Pack summary",
  "",
  "```text",
  `Validation records:                    ${entries.length}`,
  `Templates represented:                 ${new Set(entries.map((entry) => entry.question.temporaryTemplateId)).size}`,
  `Candidate authorities:                 ${new Set(entries.map((entry) => entry.candidateAuthorityId)).size}`,
  `Discovery authorities:                 ${SER_CP007_DISCOVERY_AUTHORITY_IDS.length}`,
  `Independent release pools:             ${selection.primary.length}`,
  `Standard PRIMARY candidates:           ${selection.standardPrimary.length}`,
  `Advanced PRIMARY candidates:           ${selection.advancedPrimary.length}`,
  `Mutually exclusive validation variants:${entries.length - selection.primary.length}`,
  `Interleaved records remediated:         ${interleavedRecords}`,
  `Interleaved same-row proof failures:    ${sameRowProofFailures}`,
  `Marker-position records remediated:     ${markerPositionRecords}`,
  `Uniform whole-answer shift distractors: ${uniformShiftDistractors}`,
  "Permanent QLs:                         0",
  "```",
  "",
  "## Standard PRIMARY task distribution",
  "",
  "| Task | Questions |",
  "|---|---:|",
  ...Object.entries(selection.taskCounts).map(
    ([task, count]) => `| \`${task}\` | ${count} |`,
  ),
  "",
  "## Difficulty distribution",
  "",
  "| Difficulty | Validation records |",
  "|---|---:|",
  ...[...difficultyCounts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([difficulty, count]) => `| ${difficulty} | ${count} |`),
  "",
  "## Release-tier distribution",
  "",
  "| Release tier | Validation records |",
  "|---|---:|",
  ...[...releaseCounts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([tier, count]) => `| ${tier} | ${count} |`),
  "",
  "## Validation task distribution",
  "",
  "| Task | Records |",
  "|---|---:|",
  ...[...taskCounts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([task, count]) => `| \`${task}\` | ${count} |`),
  "",
  "## Candidate-authority distribution",
  "",
  "| Candidate authority | Records |",
  "|---|---:|",
  ...[...authorityCounts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([authority, count]) => `| \`${authority}\` | ${count} |`),
  "",
  "---",
  "",
];

for (const [index, entry] of entries.entries()) {
  const number = String(index + 1).padStart(3, "0");
  const primary = selection.primaryIds.has(identity(entry));
  const expanded = explanationOnly(entry.review.expandedReview);
  const concise = explanationOnly(entry.review.conciseReview);
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
    `- **Student release pool:** \`${entry.review.studentReleasePoolKey}\``,
    `- **Pool status:** **${primary ? "PRIMARY" : "MUTUALLY_EXCLUSIVE_VARIANT"}**`,
    `- **Explanation mode:** \`${entry.review.explanationMode}\``,
    `- **Interleaved same-row proof:** **${entry.review.interleavedProof ? (entry.review.interleavedProof.passesSameRowProof ? "PASS" : "FAIL") : "NOT_APPLICABLE"}**`,
    "",
    entry.review.conciseReview,
  );
  if (expanded !== concise) {
    sections.push(
      "",
      "<details>",
      "<summary><strong>Expanded help</strong></summary>",
      "",
      expanded,
      "",
      "</details>",
    );
  }
  sections.push(
    "",
    "### Reviewer checklist",
    "",
    "- [ ] Interleaved proof uses only the target row",
    "- [ ] Marker movement is described by position",
    "- [ ] Distractors represent plausible rule errors",
    "- [ ] Standard-mock visual load is realistic on mobile",
    "- [ ] Difficulty reflects reasoning depth",
    "- [ ] Concise explanation is sufficient",
    "- [ ] Expanded help is accurate",
    "- [ ] Pool status is appropriate",
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
  "# Final V7 decision",
  "",
  "- [ ] All 48 interleaved records manually approved",
  "- [ ] All 135 PRIMARY candidates manually approved",
  "- [ ] Distractor plausibility approved authority by authority",
  "- [ ] Mobile rendering approved at 360 px and 412 px",
  "- [ ] Release-pool enforcement integrated and proven in the real assembler",
  "- [ ] Authority retain/merge/split decisions recorded",
  "- [ ] Ready for English freeze proposal",
  "",
  "**Final notes:**",
  "",
  "> ",
  "",
);

console.log(sections.join("\n"));
