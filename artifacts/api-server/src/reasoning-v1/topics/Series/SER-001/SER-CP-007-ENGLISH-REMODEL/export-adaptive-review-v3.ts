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
  type SerCp007EditorialQuestion,
} from "./adaptive-review";
import { buildAdaptiveSerCp007ReviewV3 } from "./adaptive-review-v3";

type Entry = {
  readonly wave: string;
  readonly question: SerCp007EditorialQuestion;
};

const entries: Entry[] = [];

function add(wave: string, question: SerCp007EditorialQuestion): void {
  entries.push({ wave, question });
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

const sections = [
  "# SER-CP-007 adaptive English and distractor candidate V3",
  "",
  "One deterministic seed from every temporary template.",
  "Explanations use the refined adaptive V2 proof. Options use explicit misconception roles.",
  "Permanent QLs remain unallocated.",
  "",
];

for (const entry of entries) {
  const candidate = buildAdaptiveSerCp007ReviewV3(entry.question);
  sections.push(
    `## ${entry.question.temporaryTemplateId} · ${entry.wave}`,
    "",
    `<!-- authority=${entry.question.canonicalAuthorityId}; task=${candidate.editorialTaskKind}; proofModel=${candidate.proofModel}; roles=${candidate.distractors.map((distractor) => distractor.role).join(",")}; visibleCheck=${candidate.visibleCheckRole ?? "none"} -->`,
    candidate.review,
    "",
    "Review:",
    "",
    "- [ ] Stem feels like a real exam question",
    "- [ ] Proof is sufficient for the exact answer",
    "- [ ] All three distractors are plausible misconceptions",
    "- [ ] No option is trivially removable by format alone",
    "- [ ] Visible Check matches an option if present",
    "- [ ] Final wording approved",
    "",
    "---",
    "",
  );
}

sections.push(
  "# Chapter decision",
  "",
  "```text",
  `Templates reviewed: ${entries.length}`,
  "Permanent QLs:      0",
  "```",
  "",
  "- [ ] All 140 stems and explanations approved",
  "- [ ] All 420 candidate distractor roles approved",
  "- [ ] Answer semantics approved",
  "- [ ] Difficulty impact approved",
  "- [ ] Authority merge/split policy approved",
  "- [ ] English freeze may begin",
);

console.log(sections.join("\n"));
