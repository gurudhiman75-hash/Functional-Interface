import {
  SER_CP007_WAVE_C_TEMPORARY_TEMPLATE_IDS,
  generateSerCp007WaveCQuestion,
  renderSerCp007WaveCReview,
} from "./foundation";

const sections = [
  "# SER-CP-007 Wave C English discovery review",
  "",
  "Temporary discovery identities only. Permanent QLs remain unallocated.",
  "All choices use numeric labels 1–4.",
  "",
];

for (const temporaryTemplateId of SER_CP007_WAVE_C_TEMPORARY_TEMPLATE_IDS) {
  for (const seed of [1, 2]) {
    sections.push(
      renderSerCp007WaveCReview(
        generateSerCp007WaveCQuestion(temporaryTemplateId, seed),
      ),
      "",
      "---",
      "",
    );
  }
}

console.log(sections.join("\n"));
