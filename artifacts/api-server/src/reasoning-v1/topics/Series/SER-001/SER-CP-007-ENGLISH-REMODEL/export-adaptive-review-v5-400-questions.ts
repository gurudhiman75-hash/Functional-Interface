import {
  SER_CP007_CANDIDATE_13_MAP,
  SER_CP007_DISCOVERY_AUTHORITY_IDS,
  SER_CP007_TEMPLATE_PROBES_V5,
} from "../SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-compression-contract-v5";
import type { SerCp007EditorialQuestion } from "./adaptive-review";
import { buildAdaptiveSerCp007ReviewV4 } from "./adaptive-review-v4";
import {
  analyzeSerCp007StructuralDepth,
  type SerCp007StructuralDepthProfile,
} from "./structural-depth";

type FullEditorialQuestion = SerCp007EditorialQuestion & {
  readonly sequence?: readonly (string | null)[];
};

type ReviewEntry = {
  readonly candidateAuthorityId: string;
  readonly originalAuthorityId: string;
  readonly waveId: string;
  readonly sourceRuleId: string;
  readonly question: FullEditorialQuestion;
  readonly review: ReturnType<typeof buildAdaptiveSerCp007ReviewV4>;
  readonly structural: SerCp007StructuralDepthProfile;
};

const sortedProbes = [...SER_CP007_TEMPLATE_PROBES_V5].sort((left, right) =>
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
    const question = probe.generate(seed) as unknown as FullEditorialQuestion;
    const structural = analyzeSerCp007StructuralDepth(question);
    if (!structural.passesStructuralDepth) {
      throw new Error(
        `${question.temporaryTemplateId}:${seed} is structurally trivial: ${structural.blockers.join(", ")}`,
      );
    }
    entries.push({
      candidateAuthorityId:
        SER_CP007_CANDIDATE_13_MAP[probe.originalAuthorityId],
      originalAuthorityId: probe.originalAuthorityId,
      waveId: probe.waveId,
      sourceRuleId: probe.sourceRuleId,
      question,
      review: buildAdaptiveSerCp007ReviewV4(question),
      structural,
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
let remodelledWaveDQuestions = 0;
for (const entry of entries) {
  increment(authorityCounts, entry.candidateAuthorityId);
  increment(taskCounts, entry.review.editorialTaskKind);
  increment(difficultyCounts, entry.review.difficulty);
  increment(releaseCounts, entry.review.releaseTier);
  if (
    entry.waveId === "WAVE_D" &&
    entry.question.explanation.trapCode ===
      "ANSWER_LEAKAGE_PERIODIC_LAYOUT_REMOVED"
  ) {
    remodelledWaveDQuestions += 1;
  }
}

const sections: string[] = [
  "# SER-CP-007 V5 — 400 Non-Trivial Questions and Explanations Review",
  "",
  "This pack fixes the deeper problem found during manual review: some series revealed the answer through repetition before the intended rule was applied.",
  "Pure A–B–A–B layouts from complement, reversal and pair-swap authorities have been replaced by paired-progressive constructions.",
  "Every whole-term question in this pack passes the structural-depth gate. Permanent QLs remain unallocated and manual approval is still required.",
  "",
  "## V5 structural remediation",
  "",
  "- rejects period-1, period-2 and period-3 layouts when the blank is forced by equality matching;",
  "- rejects questions where the required answer is already displayed multiple times;",
  "- rejects long-looking sequences with fewer than four meaningful states;",
  "- remodels pair swap, full reversal, odd/even reordering and alphabet-complement families;",
  "- makes each remodelled question require both within-pair transformation and between-pair progression;",
  "- preserves all 140 temporary templates and the existing lifecycle locks.",
  "",
  "## Pack summary",
  "",
  "```text",
  `Questions:                    ${entries.length}`,
  `Templates represented:        ${new Set(entries.map((entry) => entry.question.temporaryTemplateId)).size}`,
  `Candidate authorities:        ${new Set(entries.map((entry) => entry.candidateAuthorityId)).size}`,
  `Discovery authorities:        ${SER_CP007_DISCOVERY_AUTHORITY_IDS.length}`,
  `Structural-depth passes:      ${entries.filter((entry) => entry.structural.passesStructuralDepth).length}`,
  `Structural-depth failures:    ${entries.filter((entry) => !entry.structural.passesStructuralDepth).length}`,
  `Remodelled Wave D questions:  ${remodelledWaveDQuestions}`,
  "Options per question:         4",
  "Distractors per question:     3",
  "Permanent QLs:                0",
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
  "## Mandatory reviewer question",
  "",
  "Before checking the explanation, ask: can the answer be obtained merely by matching a term already shown? If yes, reject the question even when its answer and explanation are technically correct.",
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
    `- **Difficulty:** **${entry.review.difficulty}**`,
    `- **Release tier:** **${entry.review.releaseTier}**`,
    `- **Structural depth:** **PASS**`,
    `- **Minimum exact period:** ${entry.structural.minimumExactPeriod ?? "None"}`,
    `- **Visible answer occurrences:** ${entry.structural.visibleAnswerOccurrences}`,
    `- **Unique canonical states:** ${entry.structural.uniqueCanonicalTermCount}/${entry.structural.canonicalTermCount}`,
    `- **Requires intended rule application:** **YES**`,
    "",
    entry.review.review,
    "",
    "### Reviewer checklist",
    "",
    "- [ ] Answer is not revealed by A–B–A–B or another short cycle",
    "- [ ] Required answer is not already displayed elsewhere",
    "- [ ] Student must apply the intended transformation",
    "- [ ] Between-pair progression is clear and non-ambiguous",
    "- [ ] Correct answer is independently verified",
    "- [ ] All three distractors are plausible",
    "- [ ] Explanation proves the exact required term",
    "- [ ] Difficulty and release tier are appropriate",
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
  "# Final V5 chapter-review decision",
  "",
  "- [ ] All 400 questions reviewed for structural depth",
  "- [ ] No answer is obtainable through equality matching alone",
  "- [ ] All remodelled pair rules are exam-realistic",
  "- [ ] All answers independently verified",
  "- [ ] All explanations and distractors approved",
  "- [ ] Ready for English freeze proposal",
  "",
  "**Final notes:**",
  "",
  "> ",
  "",
);

console.log(sections.join("\n"));
