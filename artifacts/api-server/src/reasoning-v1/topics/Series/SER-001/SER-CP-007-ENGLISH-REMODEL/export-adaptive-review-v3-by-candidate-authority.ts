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

const entries: ReviewEntry[] = SER_CP007_TEMPLATE_PROBES.map((probe) => {
  const question = probe.generate(1) as unknown as SerCp007EditorialQuestion;
  return {
    candidateAuthorityId:
      SER_CP007_CANDIDATE_13_MAP[probe.originalAuthorityId],
    originalAuthorityId: probe.originalAuthorityId,
    waveId: probe.waveId,
    sourceRuleId: probe.sourceRuleId,
    question,
    review: buildAdaptiveSerCp007ReviewV3(question),
  };
});

if (entries.length !== 140) throw new Error("Expected 140 V3 review entries.");

entries.sort((left, right) =>
  [
    left.candidateAuthorityId,
    left.review.editorialTaskKind,
    left.question.temporaryTemplateId,
  ]
    .join("|")
    .localeCompare(
      [
        right.candidateAuthorityId,
        right.review.editorialTaskKind,
        right.question.temporaryTemplateId,
      ].join("|"),
    ),
);

const groups = new Map<string, ReviewEntry[]>();
for (const entry of entries) {
  const group = groups.get(entry.candidateAuthorityId) ?? [];
  group.push(entry);
  groups.set(entry.candidateAuthorityId, group);
}

if (groups.size !== 13) throw new Error("Expected 13 candidate authority groups.");

const sections: string[] = [
  "# SER-CP-007 V3 manual review — 13 candidate authorities",
  "",
  "This pack combines adaptive explanations, misconception-driven options and the contract-first authority proposal.",
  "All 17 discovery authorities and 140 temporary templates remain traceable.",
  "Permanent QLs remain unallocated.",
  "",
  "## Review standard",
  "",
  "For every sample, approve only when:",
  "",
  "```text",
  "stem resembles a real target-exam question",
  "worked proof reaches the exact answer without hidden jumps",
  "all three distractors are plausible and distinct misconceptions",
  "visible Check refers to an option actually shown",
  "option length, case and punctuation do not reveal the answer",
  "difficulty is appropriate",
  "```",
  "",
];

let sectionNumber = 0;
for (const [candidateAuthorityId, group] of groups) {
  sectionNumber += 1;
  const sourceAuthorities = [
    ...new Set(group.map((entry) => entry.originalAuthorityId)),
  ].sort();
  const sourceRules = [...new Set(group.map((entry) => entry.sourceRuleId))].sort();
  const taskCounts = new Map<string, number>();
  const roleCounts = new Map<string, number>();
  for (const entry of group) {
    taskCounts.set(
      entry.review.editorialTaskKind,
      (taskCounts.get(entry.review.editorialTaskKind) ?? 0) + 1,
    );
    for (const distractor of entry.review.distractors) {
      roleCounts.set(
        distractor.role,
        (roleCounts.get(distractor.role) ?? 0) + 1,
      );
    }
  }

  sections.push(
    `# ${sectionNumber}. ${candidateAuthorityId}`,
    "",
    `Templates: **${group.length}**`,
    `Discovery authorities: ${sourceAuthorities.map((authority) => `\`${authority}\``).join(", ")}`,
    "",
    "Task coverage:",
    "",
    "```text",
    ...[...taskCounts.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([task, count]) => `${task}: ${count}`),
    "```",
    "",
    "Source rules/subtypes:",
    "",
    ...sourceRules.map((sourceRule) => `- \`${sourceRule}\``),
    "",
    "Distractor-role coverage:",
    "",
    "```text",
    ...[...roleCounts.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([role, count]) => `${role}: ${count}`),
    "```",
    "",
  );

  let currentTask = "";
  for (const entry of group) {
    if (entry.review.editorialTaskKind !== currentTask) {
      currentTask = entry.review.editorialTaskKind;
      sections.push(`## ${currentTask}`, "");
    }

    sections.push(
      `### ${entry.question.temporaryTemplateId} · ${entry.waveId}`,
      "",
      `Discovery authority: \`${entry.originalAuthorityId}\`  `,
      `Source rule: \`${entry.sourceRuleId}\``,
      "",
      `<!-- candidateAuthority=${candidateAuthorityId}; discoveryAuthority=${entry.originalAuthorityId}; sourceRule=${entry.sourceRuleId}; task=${entry.review.editorialTaskKind}; proofModel=${entry.review.proofModel}; roles=${entry.review.distractors.map((distractor) => distractor.role).join(",")}; visibleCheck=${entry.review.visibleCheckRole ?? "none"} -->`,
      entry.review.review,
      "",
      "Sample decision:",
      "",
      "- [ ] Stem approved",
      "- [ ] Proof approved",
      "- [ ] Three distractors approved",
      "- [ ] Check alignment approved",
      "- [ ] Difficulty approved",
      "- [ ] No sample-specific revision needed",
      "",
      "---",
      "",
    );
  }

  sections.push(
    `## Authority decision — ${candidateAuthorityId}`,
    "",
    "- [ ] One mathematical solve contract",
    "- [ ] Discovery subtypes remain distinguishable",
    "- [ ] Learner renderer remains subtype-appropriate",
    "- [ ] Distractor roles remain misconception-specific",
    "- [ ] Source provenance and weighting remain intact",
    "- [ ] Recoverability remains template-specific",
    "- [ ] Retain candidate authority",
    "- [ ] Reject merge / retain discovery split",
    "- [ ] Split candidate further",
    "",
    "Authority notes:",
    "",
    "> ",
    "",
    "---",
    "",
  );
}

sections.push(
  "# Chapter decision",
  "",
  "```text",
  `Candidate authorities: ${groups.size}`,
  `Discovery authorities: ${SER_CP007_DISCOVERY_AUTHORITY_IDS.length}`,
  `Templates reviewed:    ${entries.length}`,
  `Distractors reviewed:  ${entries.length * 3}`,
  "Permanent QLs:         0",
  "```",
  "",
  "- [ ] All 140 V3 samples approved",
  "- [ ] All 420 distractors approved",
  "- [ ] All 13 authority decisions recorded",
  "- [ ] 13-authority policy approved",
  "- [ ] 14-authority fallback not required",
  "- [ ] Real metadata preservation approved",
  "- [ ] English freeze may begin",
  "",
  "Final notes:",
  "",
  "> ",
);

console.log(sections.join("\n"));
