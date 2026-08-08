import {
  SER_CP007_CANDIDATE_13_MAP,
  SER_CP007_DISCOVERY_AUTHORITY_IDS,
  SER_CP007_TEMPLATE_PROBES_V71,
} from "../SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-compression-contract-v7-1";
import type { SerCp007EditorialQuestion } from "./adaptive-review";
import type { SerCp007AdaptiveReviewV71 } from "./adaptive-review-v7-1";
import { buildAdaptiveSerCp007ReviewV71Final } from "./adaptive-review-v7-1-final";
import {
  selectSerCp007PrimaryReleaseV71,
  type SerCp007ReleaseEntryV71,
} from "./student-release-selection-v7-1";

interface ExportEntry extends SerCp007ReleaseEntryV71 {
  readonly candidateAuthorityId: string;
  readonly originalAuthorityId: string;
  readonly waveId: string;
  readonly sourceRuleId: string;
}

function identity(entry: { readonly question: SerCp007EditorialQuestion }): string {
  return `${entry.question.temporaryTemplateId}:${entry.question.seed}`;
}

function increment(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function explanationOnly(review: string): string {
  const marker = "### Explanation\n\n";
  const index = review.indexOf(marker);
  return index >= 0 ? review.slice(index + marker.length).trim() : review;
}

function seriesLine(stem: string): string | null {
  return [...stem.split("\n")]
    .reverse()
    .find((line) => line.includes(","))
    ?.trim() ?? null;
}

const sortedProbes = [...SER_CP007_TEMPLATE_PROBES_V71].sort((left, right) =>
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
    const review = buildAdaptiveSerCp007ReviewV71Final(question);
    if (!review.structuralDepth.passesStructuralDepth) {
      throw new Error(
        `${question.temporaryTemplateId}:${seed} failed V7.1 structural depth.`,
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
  throw new Error(`Expected exactly 400 V7.1 records, received ${entries.length}.`);
}
if (new Set(entries.map((entry) => entry.question.temporaryTemplateId)).size !== 140) {
  throw new Error("Expected all 140 temporary templates in V7.1 export.");
}
if (new Set(entries.map((entry) => entry.candidateAuthorityId)).size !== 13) {
  throw new Error("Expected all 13 candidate authorities in V7.1 export.");
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

const selection = selectSerCp007PrimaryReleaseV71(entries);
const primaryMap = new Map(selection.primary.map((entry) => [identity(entry), entry]));
const finalEntries = entries.map((entry) => primaryMap.get(identity(entry)) ?? entry);
const authorityCounts = new Map<string, number>();
const taskCounts = new Map<string, number>();
const difficultyCounts = new Map<string, number>();
const releaseCounts = new Map<string, number>();
const explanationModeCounts = new Map<string, number>();
const suitabilityCounts = new Map<string, number>();
let interleavedRecords = 0;
let interleavedFutureTerms = 0;
let markerContracts = 0;
let periodicGapContracts = 0;
let internalRecords = 0;

for (const entry of finalEntries) {
  increment(authorityCounts, entry.candidateAuthorityId);
  increment(taskCounts, entry.review.editorialTaskKind);
  increment(difficultyCounts, entry.review.difficulty);
  increment(releaseCounts, entry.review.releaseTier);
  increment(explanationModeCounts, entry.review.explanationMode);
  for (const suitability of entry.review.examSuitability) {
    increment(suitabilityCounts, suitability);
  }
  if (entry.review.releaseTier === "INTERNAL_REVIEW_ONLY") internalRecords += 1;
  if (entry.review.renderingContract?.kind === "CASE_MARKER") markerContracts += 1;
  if (entry.review.renderingContract?.kind === "PERIODIC_GAP_LINE") {
    periodicGapContracts += 1;
  }
  if (entry.review.interleavedEvidence) {
    interleavedRecords += 1;
    const count = seriesLine(entry.question.stem)?.split(",").length ?? 0;
    for (const term of (entry.question.hiddenState?.canonicalTerms ?? []).slice(count)) {
      if (term && entry.review.conciseReview.includes(term)) {
        interleavedFutureTerms += 1;
      }
    }
  }
}

if (interleavedFutureTerms !== 0) {
  throw new Error(
    `V7.1 export contains ${interleavedFutureTerms} unseen future interleaved terms.`,
  );
}

const sections: string[] = [
  "# SER-CP-007 V7.1 — 400 Release-Remediated Questions and Explanations",
  "",
  "V7.1 is a contained release-remediation pass over V7, not a chapter rebuild.",
  "The 400 records remain a validation corpus representing 135 independent learner release pools.",
  "Only the one PRIMARY record from a pool may enter ordinary learner delivery.",
  "Permanent QLs remain unallocated and English freeze remains pending manual approval.",
  "",
  "## V7.1 corrections",
  "",
  "- removes unseen future terms from all interleaved concise proofs;",
  "- verifies interior missing groups from both observed sides when available;",
  "- excludes the under-evidenced SER-CP-007-TMP-014 seed-2 variant from release;",
  "- replaces cumulative-prefix dead options with local append, insertion, omission or transposition mistakes;",
  "- balances correct-answer positions after PRIMARY selection;",
  "- reports the actual explanation mode used by every record;",
  "- moves the two identified long four-row records to advanced practice;",
  "- adds exam-suitability metadata;",
  "- adds enforceable case-marker and periodic-gap rendering contracts;",
  "- preserves one-question-per-release-pool architecture.",
  "",
  "## Pack summary",
  "",
  "```text",
  `Validation records:                    ${finalEntries.length}`,
  `Templates represented:                 ${new Set(finalEntries.map((entry) => entry.question.temporaryTemplateId)).size}`,
  `Candidate authorities:                 ${new Set(finalEntries.map((entry) => entry.candidateAuthorityId)).size}`,
  `Discovery authorities:                 ${SER_CP007_DISCOVERY_AUTHORITY_IDS.length}`,
  `Independent release pools:             ${selection.primary.length}`,
  `Standard PRIMARY candidates:           ${selection.standardPrimary.length}`,
  `Advanced PRIMARY candidates:           ${selection.advancedPrimary.length}`,
  `Mutually exclusive validation variants:${finalEntries.length - selection.primary.length}`,
  `Interleaved records remediated:         ${interleavedRecords}`,
  `Unseen future terms in concise proofs:  ${interleavedFutureTerms}`,
  `Case-marker rendering contracts:        ${markerContracts}`,
  `Periodic-gap rendering contracts:       ${periodicGapContracts}`,
  `Internal-review-only records:           ${internalRecords}`,
  `Standard PRIMARY answer positions:      ${selection.standardAnswerPositionCounts.join(" / ")}`,
  `Advanced PRIMARY answer positions:      ${selection.advancedAnswerPositionCounts.join(" / ")}`,
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
  "## Explanation-mode distribution",
  "",
  "| Explanation mode | Records |",
  "|---|---:|",
  ...[...explanationModeCounts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([mode, count]) => `| \`${mode}\` | ${count} |`),
  "",
  "## Exam-suitability distribution",
  "",
  "| Suitability | Records |",
  "|---|---:|",
  ...[...suitabilityCounts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([tag, count]) => `| \`${tag}\` | ${count} |`),
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

for (const [index, entry] of finalEntries.entries()) {
  const number = String(index + 1).padStart(3, "0");
  const primary = selection.primaryIds.has(identity(entry));
  const expanded = explanationOnly(entry.review.expandedReview);
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
    `- **Exam suitability:** ${entry.review.examSuitability.length ? entry.review.examSuitability.map((tag) => `\`${tag}\``).join(", ") : "NONE"}`,
    `- **Student release pool:** \`${entry.review.studentReleasePoolKey}\``,
    `- **Pool status:** **${primary ? "PRIMARY" : "MUTUALLY_EXCLUSIVE_VARIANT"}**`,
    `- **Explanation mode:** \`${entry.review.explanationMode}\``,
    `- **Rendering contract:** \`${entry.review.renderingContract?.kind ?? "DEFAULT"}\``,
    `- **Interleaved displayed-only proof:** **${entry.review.interleavedEvidence ? (entry.review.interleavedEvidence.usesOnlyDisplayedTermsAndAnswers ? "PASS" : "FAIL") : "NOT_APPLICABLE"}**`,
    "",
    entry.review.conciseReview,
  );
  if (entry.review.explanationMode === "CONCISE_WITH_EXPANDED_HELP") {
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
    "- [ ] Interleaved proof uses only displayed terms and the proposed answer",
    "- [ ] Interior missing term is verified from both sides where available",
    "- [ ] Distractors preserve the authority's visible structure",
    "- [ ] Correct-answer position is balanced in the PRIMARY subset",
    "- [ ] Explanation-mode label matches the rendered explanation",
    "- [ ] Exam-suitability tags are appropriate",
    "- [ ] Rendering contract is sufficient on mobile and assistive technology",
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
  "# Final V7.1 decision",
  "",
  "- [ ] All 135 PRIMARY candidates manually approved",
  "- [ ] Cumulative-prefix distractors approved",
  "- [ ] Mobile marker rendering approved at 360 px and 412 px",
  "- [ ] Periodic gap lines remain readable without internal wrapping",
  "- [ ] Release-pool enforcement proven in the real test assembler",
  "- [ ] Authority retain/merge/split decisions recorded",
  "- [ ] Ready for English freeze proposal",
  "",
  "**Final notes:**",
  "",
  "> ",
  "",
);

console.log(sections.join("\n"));
