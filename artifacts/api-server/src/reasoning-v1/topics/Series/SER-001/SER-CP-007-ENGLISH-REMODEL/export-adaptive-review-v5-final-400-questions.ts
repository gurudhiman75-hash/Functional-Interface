import {
  SER_CP007_CANDIDATE_13_MAP,
  SER_CP007_DISCOVERY_AUTHORITY_IDS,
  SER_CP007_TEMPLATE_PROBES_V5,
} from "../SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-compression-contract-v5";
import type { SerCp007EditorialQuestion } from "./adaptive-review";
import { buildAdaptiveSerCp007ReviewV5 } from "./adaptive-review-v5";

type FullQuestion = SerCp007EditorialQuestion & {
  readonly sequence?: readonly (string | null)[];
};

type Entry = {
  readonly candidateAuthorityId: string;
  readonly discoveryAuthorityId: string;
  readonly waveId: string;
  readonly sourceRuleId: string;
  readonly question: FullQuestion;
  readonly review: ReturnType<typeof buildAdaptiveSerCp007ReviewV5>;
};

const probes = [...SER_CP007_TEMPLATE_PROBES_V5].sort((left, right) =>
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

const entries: Entry[] = [];
for (const [probeIndex, probe] of probes.entries()) {
  const seeds = probeIndex % 7 === 6 ? [1, 2] : [1, 2, 3];
  for (const seed of seeds) {
    const question = probe.generate(seed) as unknown as FullQuestion;
    const review = buildAdaptiveSerCp007ReviewV5(question);
    if (!review.structuralDepth.passesStructuralDepth) {
      throw new Error(
        `${question.temporaryTemplateId}:${seed} failed structural depth: ${review.structuralDepth.blockers.join(", ")}`,
      );
    }
    entries.push({
      candidateAuthorityId:
        SER_CP007_CANDIDATE_13_MAP[probe.originalAuthorityId],
      discoveryAuthorityId: probe.originalAuthorityId,
      waveId: probe.waveId,
      sourceRuleId: probe.sourceRuleId,
      question,
      review,
    });
  }
}

if (entries.length !== 400) {
  throw new Error(`Expected 400 questions, received ${entries.length}.`);
}
if (new Set(entries.map((entry) => entry.question.temporaryTemplateId)).size !== 140) {
  throw new Error("All 140 templates must be represented.");
}
if (new Set(entries.map((entry) => entry.candidateAuthorityId)).size !== 13) {
  throw new Error("All 13 candidate authorities must be represented.");
}

for (const entry of entries) {
  if (entry.review.options.length !== 4) throw new Error("Expected four options.");
  if (entry.review.distractors.length !== 3) throw new Error("Expected three distractors.");
  if (!entry.review.review.includes("### Explanation")) throw new Error("Explanation missing.");
  if (!entry.review.review.includes("**Answer:**")) throw new Error("Answer missing.");
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

const remodelled = entries.filter(
  (entry) =>
    entry.question.explanation.trapCode ===
    "ANSWER_LEAKAGE_PERIODIC_LAYOUT_REMOVED",
);
const pairedProofs = remodelled.filter((entry) =>
  entry.review.review.includes("**Use the two-part pair pattern:**"),
);
const difficultyCounts = new Map<string, number>();
const releaseCounts = new Map<string, number>();
for (const entry of entries) {
  difficultyCounts.set(
    entry.review.difficulty,
    (difficultyCounts.get(entry.review.difficulty) ?? 0) + 1,
  );
  releaseCounts.set(
    entry.review.releaseTier,
    (releaseCounts.get(entry.review.releaseTier) ?? 0) + 1,
  );
}

const output: string[] = [
  "# SER-CP-007 V5 Final — 400 Non-Trivial Questions and Explanations",
  "",
  "This pack removes answer-revealing short cycles and corrects the explanations of all paired-progressive questions.",
  "The old A–B–A–B constructions are rejected. Remodelled questions now require two distinct observations: progression between pairs and transformation within each pair.",
  "Permanent QLs remain unallocated. This file is for final manual review before any English-freeze proposal.",
  "",
  "## Verified summary",
  "",
  "```text",
  `Questions:                       ${entries.length}`,
  `Templates represented:           ${new Set(entries.map((entry) => entry.question.temporaryTemplateId)).size}`,
  `Candidate authorities:           ${new Set(entries.map((entry) => entry.candidateAuthorityId)).size}`,
  `Discovery authorities:           ${SER_CP007_DISCOVERY_AUTHORITY_IDS.length}`,
  `Structural-depth passes:         ${entries.filter((entry) => entry.review.structuralDepth.passesStructuralDepth).length}`,
  `Structural-depth failures:       ${entries.filter((entry) => !entry.review.structuralDepth.passesStructuralDepth).length}`,
  `Remodelled paired questions:     ${remodelled.length}`,
  `Paired-proof explanations:       ${pairedProofs.length}`,
  `Visible answer occurrences in remodelled questions: ${remodelled.reduce((sum, entry) => sum + entry.review.structuralDepth.visibleAnswerOccurrences, 0)}`,
  "Permanent QLs:                   0",
  "```",
  "",
  "## Difficulty distribution",
  "",
  "| Difficulty | Questions |",
  "|---|---:|",
  ...[...difficultyCounts.entries()].sort().map(([name, count]) => `| ${name} | ${count} |`),
  "",
  "## Release-tier distribution",
  "",
  "| Release tier | Questions |",
  "|---|---:|",
  ...[...releaseCounts.entries()].sort().map(([name, count]) => `| ${name} | ${count} |`),
  "",
  "## Mandatory rejection rule",
  "",
  "Reject a question when the blank can be filled by matching a term already shown, even if the underlying transformation and marked answer are mathematically correct.",
  "",
  "---",
  "",
];

for (const [index, entry] of entries.entries()) {
  output.push(
    `## Question ${String(index + 1).padStart(3, "0")}`,
    "",
    `- **Candidate authority:** \`${entry.candidateAuthorityId}\``,
    `- **Discovery authority:** \`${entry.discoveryAuthorityId}\``,
    `- **Template:** \`${entry.question.temporaryTemplateId}\``,
    `- **Seed:** \`${entry.question.seed}\``,
    `- **Wave:** \`${entry.waveId}\``,
    `- **Source rule:** \`${entry.sourceRuleId}\``,
    `- **Task:** \`${entry.review.editorialTaskKind}\``,
    `- **Difficulty:** **${entry.review.difficulty}**`,
    `- **Release tier:** **${entry.review.releaseTier}**`,
    `- **Structural depth:** **PASS**`,
    `- **Short exact period:** ${entry.review.structuralDepth.minimumExactPeriod ?? "None"}`,
    `- **Visible answer occurrences:** ${entry.review.structuralDepth.visibleAnswerOccurrences}`,
    `- **Unique canonical states:** ${entry.review.structuralDepth.uniqueCanonicalTermCount}/${entry.review.structuralDepth.canonicalTermCount}`,
    "",
    entry.review.review,
    "",
    "### Reviewer checklist",
    "",
    "- [ ] The answer is not exposed by repetition or equality matching",
    "- [ ] The intended rule must actually be applied",
    "- [ ] For paired questions, both parts of the rule are necessary",
    "- [ ] The explanation proves the correct pair and target position",
    "- [ ] All three distractors are credible",
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

output.push(
  "# Final decision",
  "",
  "- [ ] All 400 questions manually reviewed",
  "- [ ] All remodelled paired questions approved",
  "- [ ] No answer-leaking construction remains",
  "- [ ] Explanations and distractors approved",
  "- [ ] Ready for English-freeze proposal",
  "",
);

console.log(output.join("\n"));
