import {
  SER_CP007_CANDIDATE_13_MAP,
  SER_CP007_DISCOVERY_AUTHORITY_IDS,
  SER_CP007_TEMPLATE_PROBES,
} from "../SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-compression-contract";
import { type SerCp007EditorialQuestion } from "./adaptive-review";
import { buildAdaptiveSerCp007ReviewV3 } from "./adaptive-review-v3";

type ReviewEntry = {
  readonly candidateAuthorityId: string;
  readonly originalAuthorityId: string;
  readonly waveId: string;
  readonly sourceRuleId: string;
  readonly question: SerCp007EditorialQuestion;
  readonly review: ReturnType<typeof buildAdaptiveSerCp007ReviewV3>;
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
      review: buildAdaptiveSerCp007ReviewV3(question),
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
if (new Set(entries.map((entry) => `${entry.question.temporaryTemplateId}:${entry.question.seed}`)).size !== 400) {
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
    throw new Error(`${entry.question.temporaryTemplateId}: answer missing from review.`);
  }
  if (!entry.review.review.includes("### Explanation")) {
    throw new Error(`${entry.question.temporaryTemplateId}: explanation missing from review.`);
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
const waveCounts = new Map<string, number>();
for (const entry of entries) {
  increment(authorityCounts, entry.candidateAuthorityId);
  increment(taskCounts, entry.review.editorialTaskKind);
  increment(waveCounts, entry.waveId);
}

const sections: string[] = [
  "# SER-CP-007 — 400 Questions and Explanations Review Pack",
  "",
  "This file contains 400 deterministic English Series questions generated from the current SER-CP-007 V3 candidate system.",
  "It covers every temporary template and retains discovery-authority traceability.",
  "Permanent QLs remain unallocated and this pack is for manual review only.",
  "",
  "## Pack summary",
  "",
  "```text",
  `Questions:             ${entries.length}`,
  `Templates represented: ${new Set(entries.map((entry) => entry.question.temporaryTemplateId)).size}`,
  `Candidate authorities: ${new Set(entries.map((entry) => entry.candidateAuthorityId)).size}`,
  `Discovery authorities: ${SER_CP007_DISCOVERY_AUTHORITY_IDS.length}`,
  "Options per question:  4",
  "Distractors per question: 3",
  "Permanent QLs:         0",
  "```",
  "",
  "## Candidate-authority distribution",
  "",
  "| Candidate authority | Questions |",
  "|---|---:|",
  ...[...authorityCounts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([authority, count]) => `| \`${authority}\` | ${count} |`),
  "",
  "## Task distribution",
  "",
  "| Task | Questions |",
  "|---|---:|",
  ...[...taskCounts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([task, count]) => `| \`${task}\` | ${count} |`),
  "",
  "## Wave distribution",
  "",
  "| Discovery wave | Questions |",
  "|---|---:|",
  ...[...waveCounts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([wave, count]) => `| \`${wave}\` | ${count} |`),
  "",
  "## Review standard",
  "",
  "Approve a question only when the stem resembles a real exam question, the options are plausible, the marked answer is correct, and the explanation reaches the answer without a hidden jump.",
  "Also check that any visible Check corresponds to a misconception represented by an option actually shown.",
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
    `- **Distractor roles:** ${entry.review.distractors
      .map((distractor) => `\`${distractor.role}\``)
      .join(", ")}`,
    `- **Visible Check role:** ${entry.review.visibleCheckRole ? `\`${entry.review.visibleCheckRole}\`` : "None"}`,
    "",
    entry.review.review,
    "",
    "### Reviewer checklist",
    "",
    "- [ ] Stem is natural and exam-realistic",
    "- [ ] All four options are distinct and well formatted",
    "- [ ] Correct answer is mathematically verified",
    "- [ ] Explanation shows the decisive calculation or transformation",
    "- [ ] No hidden reasoning jump",
    "- [ ] Distractors represent plausible misconceptions",
    "- [ ] Check/shortcut is useful and correctly aligned",
    "- [ ] Difficulty is appropriate",
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
  "# Final chapter-review decision",
  "",
  "- [ ] All 400 questions reviewed",
  "- [ ] All answers independently verified",
  "- [ ] All explanations approved",
  "- [ ] All 1,200 distractors approved",
  "- [ ] Repetition level is acceptable",
  "- [ ] Exam realism is acceptable",
  "- [ ] Candidate authority coverage is acceptable",
  "- [ ] Ready for the next freeze gate",
  "",
  "**Final notes:**",
  "",
  "> ",
  "",
);

console.log(sections.join("\n"));
