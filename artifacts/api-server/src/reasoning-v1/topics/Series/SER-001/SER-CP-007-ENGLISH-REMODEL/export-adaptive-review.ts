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

const sections = [
  "# SER-CP-007 adaptive English candidate V1",
  "",
  "One deterministic learner-facing sample from every temporary template.",
  "Internal template, authority and proof-model metadata is kept only in HTML comments for manual review navigation.",
  "Permanent QLs remain unallocated and English freeze remains blocked.",
  "",
];

function add(
  wave: string,
  question: SerCp007EditorialQuestion,
): void {
  const candidate = buildAdaptiveSerCp007Review(question);
  sections.push(
    `<!-- ${wave} | ${question.temporaryTemplateId} | ${question.canonicalAuthorityId} | ${candidate.editorialTaskKind} | ${candidate.proofModel} -->`,
    candidate.review,
    "",
    "---",
    "",
  );
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

console.log(sections.join("\n"));
