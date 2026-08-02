import {
  SER_CP007_WAVE_D_TEMPORARY_TEMPLATE_IDS,
  generateSerCp007WaveDQuestion,
  renderSerCp007WaveDReview,
} from "./foundation";

const sections = [
  "# SER-CP-007 Wave D English discovery review",
  "",
  "Temporary discovery identities only. Permanent QLs remain unallocated.",
  "All choices use numeric labels 1–4.",
  "",
];

for (const temporaryTemplateId of SER_CP007_WAVE_D_TEMPORARY_TEMPLATE_IDS) {
  for (const seed of [1, 2]) {
    sections.push(
      renderSerCp007WaveDReview(
        generateSerCp007WaveDQuestion(temporaryTemplateId, seed),
      ),
      "",
      "---",
      "",
    );
  }
}

console.log(sections.join("\n"));
