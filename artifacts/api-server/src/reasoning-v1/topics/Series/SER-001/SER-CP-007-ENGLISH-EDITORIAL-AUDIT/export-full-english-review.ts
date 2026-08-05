import {
  SER_CP007_TEMPORARY_TEMPLATES,
  generateSerCp007Question,
  renderSerCp007Review,
} from "../SER-CP-007/foundation";
import {
  SER_CP007_WAVE_B_TEMPORARY_TEMPLATES,
  generateSerCp007WaveBQuestion,
  renderSerCp007WaveBReview,
} from "../SER-CP-007-WAVE-B/foundation-expanded";
import {
  SER_CP007_WAVE_C_TEMPORARY_TEMPLATES,
  generateSerCp007WaveCQuestion,
  renderSerCp007WaveCReview,
} from "../SER-CP-007-WAVE-C/foundation-refined";
import {
  SER_CP007_WAVE_D_TEMPORARY_TEMPLATES,
  generateSerCp007WaveDQuestion,
  renderSerCp007WaveDReview,
} from "../SER-CP-007-WAVE-D/foundation";
import {
  SER_CP007_WAVE_E_TEMPORARY_TEMPLATES,
  generateSerCp007WaveEQuestion,
  renderSerCp007WaveEReview,
} from "../SER-CP-007-WAVE-E/foundation";

const sections: string[] = [
  "# SER-CP-007 full English editorial review",
  "",
  "One deterministic sample from every temporary template across Waves A–E.",
  "",
  "This is a discovery review pack, not a permanent-QL freeze pack.",
  "The repeated four-heading shell and visible trap codes are known editorial blockers.",
  "",
];

function addReview(wave: string, templateId: string, review: string): void {
  sections.push(`<!-- ${wave} · ${templateId} -->`, review, "", "---", "");
}

for (const template of SER_CP007_TEMPORARY_TEMPLATES) {
  const question = generateSerCp007Question(template.temporaryTemplateId, 1);
  addReview("Wave A", template.temporaryTemplateId, renderSerCp007Review(question));
}
for (const template of SER_CP007_WAVE_B_TEMPORARY_TEMPLATES) {
  const question = generateSerCp007WaveBQuestion(template.temporaryTemplateId, 1);
  addReview("Wave B", template.temporaryTemplateId, renderSerCp007WaveBReview(question));
}
for (const template of SER_CP007_WAVE_C_TEMPORARY_TEMPLATES) {
  const question = generateSerCp007WaveCQuestion(template.temporaryTemplateId, 1);
  addReview("Wave C", template.temporaryTemplateId, renderSerCp007WaveCReview(question));
}
for (const template of SER_CP007_WAVE_D_TEMPORARY_TEMPLATES) {
  const question = generateSerCp007WaveDQuestion(template.temporaryTemplateId, 1);
  addReview("Wave D", template.temporaryTemplateId, renderSerCp007WaveDReview(question));
}
for (const template of SER_CP007_WAVE_E_TEMPORARY_TEMPLATES) {
  const question = generateSerCp007WaveEQuestion(template.temporaryTemplateId, 1);
  addReview("Wave E", template.temporaryTemplateId, renderSerCp007WaveEReview(question));
}

console.log(sections.join("\n"));
