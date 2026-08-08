import {
  SER_CP007_CANDIDATE_13_MAP,
  SER_CP007_DISCOVERY_AUTHORITY_IDS,
  SER_CP007_TEMPLATE_PROBES,
} from "../SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-compression-contract";
import type { SerCp007EditorialQuestion } from "./adaptive-review";
import { buildAdaptiveSerCp007ReviewV4 } from "./adaptive-review-v4";

type ReviewEntry = {
  readonly candidateAuthorityId: string;
  readonly originalAuthorityId: string;
  readonly waveId: string;
  readonly sourceRuleId: string;
  readonly question: SerCp007EditorialQuestion;
  readonly review: ReturnType<typeof buildAdaptiveSerCp007ReviewV4>;
};

const sortedProbes = [...SER_CP007_TEMPLATE_PROBES].sort((left, right) =>
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
    entries.push({
      candidateAuthorityId:
        SER_CP007_CANDIDATE_13_MAP[probe.originalAuthorityId],
      originalAuthorityId: probe.originalAuthorityId,
      waveId: probe.waveId,
      sourceRuleId: probe.sourceRuleId,
      question,
      review: buildAdaptiveSerCp007ReviewV4(question),
    });
  }
}

if (entries.length !== 400) {
  throw new Error(`Expected exactly 400 entries, received ${entries.length}.`);
}
if (new Set(entries.map((entry) => entry.question.temporaryTemplateId)).size !== 140) {
  throw new Error("Expected all 140 temporary templates to be represented.");
}
if (new Set(entries.map((entry) => entry.candidateAuthorityId)).size !== 13) {
  throw new Error("Expected all 13 candidate authorities to be represented.");
}
if (
  new Set(
    entries.map(
      (entry) => `${entry.question.temporaryTemplateId}:${entry.question.seed}`,
    ),
  ).size !== 400
) {
  throw new Error("Question identity collision detected.");
}

for (const entry of entries) {
  if (entry.review.options.length !== 4) {
    throw new Error(`${entry.question.temporaryTemplateId}: expected four options.`);
  }
  if (entry.review.distractors.length !== 3) {
    throw new Error(`${entry.question.temporaryTemplateId}: expected three distractors.`);
  }
  if (!entry.review.review.includes("**Answer:**")) {
    throw new Error(`${entry.question.temporaryTemplateId}: answer missing.`);
  }
  if (!entry.review.review.includes("### Explanation")) {
    throw new Error(`${entry.question.temporaryTemplateId}: explanation missing.`);
  }
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

function increment(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

const authorityCounts = new Map<string, number>();
const taskCounts = new Map<string, number>();
const difficultyCounts = new Map<string, number>();
const releaseCounts = new Map<string, number>();
const roleCombinationCounts = new Map<string, number>();
for (const entry of entries) {
  increment(authorityCounts, entry.candidateAuthorityId);
  increment(taskCounts, entry.review.editorialTaskKind);
  increment(difficultyCounts, entry.review.difficulty);
  increment(releaseCounts, entry.review.releaseTier);
  increment(
    roleCombinationCounts,
    entry.review.distractors.map((distractor) => distractor.role).join(" + "),
  );
}

const sections: string[] = [
  "# SER-CP-007 V4 — 400 Questions and Explanations Exam-Readiness Review",
  "",
  "This pack applies the one-go remediation requested after the V3 exam-readiness review.",
  "It preserves all 140 temporary templates while correcting learner-facing proofs, options, stems, difficulty metadata and release controls.",
  "Permanent QLs remain unallocated. This is still a manual approval pack, not a public-release file.",
  "",
  "## V4 remediation applied",
  "",
  "- exact blank/answer transition is shown instead of an unrelated future step;",
  "- progressive column questions show complete position rows and changing jumps;",
  "- consecutive blocks show both length progression and starting-letter gaps;",
  "- cumulative and symmetric growth prove the missing or previous term directly;",
  "- unchanged wrong-term and wrong → same-wrong options are forbidden;",
  "- distractors use wider rule-specific misconception roles;",
  "- previous-term and wrong/replacement stems are polished;",
  "- visible Checks name the actual option and its misconception;",
  "- every question has Easy/Medium/Hard and release-tier metadata;",
  "- standard-mock eligibility enforces visual-length limits;",
  "- state fingerprints prevent different task forms of one base series appearing together.",
  "",
  "## Pack summary",
  "",
  "```text",
  `Questions:              ${entries.length}`,
  `Templates represented:  ${new Set(entries.map((entry) => entry.question.temporaryTemplateId)).size}`,
  `Candidate authorities:  ${new Set(entries.map((entry) => entry.candidateAuthorityId)).size}`,
  `Discovery authorities:  ${SER_CP007_DISCOVERY_AUTHORITY_IDS.length}`,
  `State fingerprints:     ${new Set(entries.map((entry) => entry.review.stateFingerprint)).size}`,
  `Distractor combinations:${roleCombinationCounts.size}`,
  "Options per question:   4",
  "Distractors per question: 3",
  "Permanent QLs:          0",
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
  "## Review standard",
  "",
  "Approve only when the question is exam-realistic, all three wrong options are serious misconceptions, and the worked proof constructs the exact required answer without a hidden jump.",
  "Questions marked ADVANCED_PRACTICE or INTERNAL_REVIEW_ONLY must not be placed in an ordinary mock even when their mathematics is correct.",
  "",
  "---",
  "",
];

for (const [index, entry] of entries.entries()) {
  const questionNumber = String(index + 1).padStart(3, "0");
  sections.push(
    `## Question ${questionNumber}`,
    "",
    `- **Candidate authority:** \`${entry.candidateAuthorityId}\``,
    `- **Discovery authority:** \`${entry.originalAuthorityId}\``,
    `- **Template:** \`${entry.question.temporaryTemplateId}\``,
    `- **Seed:** \`${entry.question.seed}\``,
    `- **Wave:** \`${entry.waveId}\``,
    `- **Source rule:** \`${entry.sourceRuleId}\``,
    `- **Task:** \`${entry.review.editorialTaskKind}\``,
    `- **Proof model:** \`${entry.review.proofModel}\``,
    `- **Difficulty:** **${entry.review.difficulty}**`,
    `- **Release tier:** **${entry.review.releaseTier}**`,
    `- **Standard-mock eligible:** **${entry.review.standardMockEligible ? "YES" : "NO"}**`,
    `- **Maximum term length:** ${entry.review.maximumTermLength}`,
    `- **Visible character load:** ${entry.review.visibleCharacterLoad}`,
    `- **State fingerprint:** \`${entry.review.stateFingerprint}\``,
    `- **Distractor roles:** ${entry.review.distractors
      .map((distractor) => `\`${distractor.role}\``)
      .join(", ")}`,
    "",
    entry.review.review,
    "",
    "### Reviewer checklist",
    "",
    "- [ ] Stem is natural and exam-realistic",
    "- [ ] Correct answer is independently verified",
    "- [ ] Exact target step is shown",
    "- [ ] No unrelated future transition is used as proof",
    "- [ ] All three distractors are plausible and rule-specific",
    "- [ ] No unchanged wrong-term option is present",
    "- [ ] Check names a displayed option and its mistake",
    "- [ ] Difficulty label is accurate",
    "- [ ] Release tier is appropriate for visual load",
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
  "# Final V4 chapter-review decision",
  "",
  "- [ ] All 400 questions reviewed",
  "- [ ] All exact-target proofs approved",
  "- [ ] All 1,200 distractors approved",
  "- [ ] Difficulty labels approved",
  "- [ ] Release-tier classifications approved",
  "- [ ] State-dedup policy approved",
  "- [ ] Standard-mock length policy approved",
  "- [ ] Ready for English freeze proposal",
  "",
  "**Final notes:**",
  "",
  "> ",
  "",
);

console.log(sections.join("\n"));
