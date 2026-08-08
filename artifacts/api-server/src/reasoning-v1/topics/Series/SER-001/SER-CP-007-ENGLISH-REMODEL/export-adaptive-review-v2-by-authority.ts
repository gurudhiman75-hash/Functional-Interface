import {
  SER_CP007_TEMPORARY_TEMPLATES,
  generateSerCp007Question,
} from "../SER-CP-007/foundation";
import {
  SER_CP007_WAVE_B_TEMPORARY_TEMPLATES,
  generateSerCp007WaveBQuestion,
} from "../SER-CP-007-WAVE-B/foundation-expanded";
import {
  SER_CP007_WAVE_C_TEMPORARY_TEMPLATES,
  generateSerCp007WaveCQuestion,
} from "../SER-CP-007-WAVE-C/foundation-refined";
import {
  SER_CP007_WAVE_D_TEMPORARY_TEMPLATES,
  generateSerCp007WaveDQuestion,
} from "../SER-CP-007-WAVE-D/foundation";
import {
  SER_CP007_WAVE_E_TEMPORARY_TEMPLATES,
  generateSerCp007WaveEQuestion,
} from "../SER-CP-007-WAVE-E/foundation";
import {
  buildAdaptiveSerCp007Review,
  type SerCp007AdaptiveReview,
  type SerCp007EditorialQuestion,
} from "./adaptive-review";

type ReviewEntry = {
  readonly wave: string;
  readonly question: SerCp007EditorialQuestion;
  readonly candidate: SerCp007AdaptiveReview;
};

const entries: ReviewEntry[] = [];

function add(wave: string, question: SerCp007EditorialQuestion): void {
  entries.push({
    wave,
    question,
    candidate: buildAdaptiveSerCp007Review(question),
  });
}

for (const template of SER_CP007_TEMPORARY_TEMPLATES) {
  add(
    "Wave A",
    generateSerCp007Question(
      template.temporaryTemplateId,
      1,
    ) as unknown as SerCp007EditorialQuestion,
  );
}
for (const template of SER_CP007_WAVE_B_TEMPORARY_TEMPLATES) {
  add(
    "Wave B",
    generateSerCp007WaveBQuestion(
      template.temporaryTemplateId,
      1,
    ) as unknown as SerCp007EditorialQuestion,
  );
}
for (const template of SER_CP007_WAVE_C_TEMPORARY_TEMPLATES) {
  add(
    "Wave C",
    generateSerCp007WaveCQuestion(
      template.temporaryTemplateId,
      1,
    ) as unknown as SerCp007EditorialQuestion,
  );
}
for (const template of SER_CP007_WAVE_D_TEMPORARY_TEMPLATES) {
  add(
    "Wave D",
    generateSerCp007WaveDQuestion(
      template.temporaryTemplateId,
      1,
    ) as unknown as SerCp007EditorialQuestion,
  );
}
for (const template of SER_CP007_WAVE_E_TEMPORARY_TEMPLATES) {
  add(
    "Wave E",
    generateSerCp007WaveEQuestion(
      template.temporaryTemplateId,
      1,
    ) as unknown as SerCp007EditorialQuestion,
  );
}

entries.sort((left, right) =>
  [
    left.question.canonicalAuthorityId,
    left.candidate.editorialTaskKind,
    left.question.temporaryTemplateId,
  ]
    .join("|")
    .localeCompare(
      [
        right.question.canonicalAuthorityId,
        right.candidate.editorialTaskKind,
        right.question.temporaryTemplateId,
      ].join("|"),
    ),
);

const authorityGroups = new Map<string, ReviewEntry[]>();
for (const entry of entries) {
  const group = authorityGroups.get(entry.question.canonicalAuthorityId) ?? [];
  group.push(entry);
  authorityGroups.set(entry.question.canonicalAuthorityId, group);
}

const sections: string[] = [
  "# SER-CP-007 adaptive English V2 — authority/task manual review pack",
  "",
  "All 140 temporary templates are grouped by canonical authority and editorial task.",
  "Each sample uses seed 1. Approving a sample does not allocate a permanent QL.",
  "Use the authority-level decision at the end of each section to record retain/merge/split concerns.",
  "",
  "## Review symbols",
  "",
  "```text",
  "[ ] learner wording approved",
  "[ ] proof sufficient",
  "[ ] options realistic",
  "[ ] optional Shortcut/Check useful",
  "[ ] no merge/split concern",
  "```",
  "",
];

let authorityNumber = 0;
for (const [authorityId, authorityEntries] of authorityGroups) {
  authorityNumber += 1;
  const taskCounts = new Map<string, number>();
  const proofModels = new Set<string>();
  for (const entry of authorityEntries) {
    taskCounts.set(
      entry.candidate.editorialTaskKind,
      (taskCounts.get(entry.candidate.editorialTaskKind) ?? 0) + 1,
    );
    proofModels.add(entry.candidate.proofModel);
  }

  sections.push(
    `# ${authorityNumber}. ${authorityId}`,
    "",
    `Templates: **${authorityEntries.length}**`,
    `Proof model: **${[...proofModels].join(", ")}**`,
    "",
    "Task coverage:",
    "",
    "```text",
    ...[...taskCounts.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([task, count]) => `${task}: ${count}`),
    "```",
    "",
  );

  let currentTask = "";
  for (const entry of authorityEntries) {
    if (entry.candidate.editorialTaskKind !== currentTask) {
      currentTask = entry.candidate.editorialTaskKind;
      sections.push(`## ${currentTask}`, "");
    }

    sections.push(
      `### ${entry.question.temporaryTemplateId} · ${entry.wave}`,
      "",
      `<!-- authority=${authorityId}; task=${entry.candidate.editorialTaskKind}; proofModel=${entry.candidate.proofModel}; sourceRule=${entry.question.sourceRuleId}; seed=${entry.question.seed} -->`,
      entry.candidate.review,
      "",
      "Review:",
      "",
      "- [ ] Learner wording approved",
      "- [ ] Proof sufficient for this exact answer",
      "- [ ] Options and answer semantics realistic",
      "- [ ] Shortcut/Check useful if present",
      "- [ ] No template-specific revision needed",
      "",
      "---",
      "",
    );
  }

  sections.push(
    `## Authority decision — ${authorityId}`,
    "",
    "- [ ] Retain as a distinct authority",
    "- [ ] Merge candidate identified",
    "- [ ] Split candidate identified",
    "- [ ] Task directions should remain one authority",
    "- [ ] Explanation model approved for this authority",
    "",
    "Decision notes:",
    "",
    "> ",
    "",
    "---",
    "",
  );
}

sections.push(
  "# Chapter-level decision",
  "",
  "```text",
  `Authorities reviewed: ${authorityGroups.size}`,
  `Templates reviewed:   ${entries.length}`,
  "Permanent QLs:        0",
  "```",
  "",
  "- [ ] All 140 learner-facing samples approved",
  "- [ ] All 17 authority decisions recorded",
  "- [ ] Wrong-term task semantics approved",
  "- [ ] Previous-term production weighting reviewed",
  "- [ ] Cross-template repetition acceptable",
  "- [ ] Distractor quality acceptable",
  "- [ ] Final merge/split decision approved",
  "- [ ] English freeze may begin",
  "",
  "Final notes:",
  "",
  "> ",
);

console.log(sections.join("\n"));
