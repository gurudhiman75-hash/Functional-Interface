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
  type SerCp007EditorialQuestion,
} from "./adaptive-review";

type MatrixEntry = {
  readonly authorityId: string;
  readonly taskKind: string;
  readonly proofModel: string;
  readonly templateId: string;
};

const entries: MatrixEntry[] = [];

function add(question: SerCp007EditorialQuestion): void {
  const candidate = buildAdaptiveSerCp007Review(question);
  entries.push({
    authorityId: question.canonicalAuthorityId,
    taskKind: candidate.editorialTaskKind,
    proofModel: candidate.proofModel,
    templateId: question.temporaryTemplateId,
  });
}

for (const template of SER_CP007_TEMPORARY_TEMPLATES) {
  add(
    generateSerCp007Question(
      template.temporaryTemplateId,
      1,
    ) as unknown as SerCp007EditorialQuestion,
  );
}
for (const template of SER_CP007_WAVE_B_TEMPORARY_TEMPLATES) {
  add(
    generateSerCp007WaveBQuestion(
      template.temporaryTemplateId,
      1,
    ) as unknown as SerCp007EditorialQuestion,
  );
}
for (const template of SER_CP007_WAVE_C_TEMPORARY_TEMPLATES) {
  add(
    generateSerCp007WaveCQuestion(
      template.temporaryTemplateId,
      1,
    ) as unknown as SerCp007EditorialQuestion,
  );
}
for (const template of SER_CP007_WAVE_D_TEMPORARY_TEMPLATES) {
  add(
    generateSerCp007WaveDQuestion(
      template.temporaryTemplateId,
      1,
    ) as unknown as SerCp007EditorialQuestion,
  );
}
for (const template of SER_CP007_WAVE_E_TEMPORARY_TEMPLATES) {
  add(
    generateSerCp007WaveEQuestion(
      template.temporaryTemplateId,
      1,
    ) as unknown as SerCp007EditorialQuestion,
  );
}

const grouped = new Map<string, MatrixEntry[]>();
for (const entry of entries) {
  const group = grouped.get(entry.authorityId) ?? [];
  group.push(entry);
  grouped.set(entry.authorityId, group);
}

const lines = [
  "# SER-CP-007 adaptive English V2 — authority matrix",
  "",
  "| Authority | Proof model | Templates | Editorial tasks | Template IDs | Decision |",
  "|---|---|---:|---|---|---|",
];

for (const [authorityId, authorityEntries] of [...grouped.entries()].sort(
  ([left], [right]) => left.localeCompare(right),
)) {
  const proofModels = [...new Set(authorityEntries.map((entry) => entry.proofModel))];
  const taskCounts = new Map<string, number>();
  for (const entry of authorityEntries) {
    taskCounts.set(entry.taskKind, (taskCounts.get(entry.taskKind) ?? 0) + 1);
  }
  const tasks = [...taskCounts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([task, count]) => `${task} (${count})`)
    .join("<br>");
  const templateIds = authorityEntries
    .map((entry) => `\`${entry.templateId}\``)
    .join("<br>");
  lines.push(
    `| \`${authorityId}\` | ${proofModels.join("<br>")} | ${authorityEntries.length} | ${tasks} | ${templateIds} | [ ] Retain [ ] Merge [ ] Split |`,
  );
}

lines.push(
  "",
  "## Chapter totals",
  "",
  "```text",
  `Authorities: ${grouped.size}`,
  `Templates:   ${entries.length}`,
  "Permanent QLs: 0",
  "```",
  "",
  "## Freeze checklist",
  "",
  "- [ ] All authority rows have a retain/merge/split decision",
  "- [ ] All template samples have a learner-facing approval or revision note",
  "- [ ] Final task-semantic inventory is approved",
  "- [ ] Final distractor review is approved",
  "- [ ] English freeze may begin",
);

console.log(lines.join("\n"));
