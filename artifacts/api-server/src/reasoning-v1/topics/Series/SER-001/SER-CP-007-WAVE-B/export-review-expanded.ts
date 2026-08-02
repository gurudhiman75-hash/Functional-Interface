import {
  SER_CP007_WAVE_B_TEMPORARY_TEMPLATE_IDS,
  generateSerCp007WaveBQuestion,
  renderSerCp007WaveBReview,
} from "./foundation-expanded";

const sections = [
  "# SER-CP-007 Wave B English discovery review",
  "",
  "Temporary discovery identities only. Permanent QLs remain unallocated.",
  "All choices use numeric labels 1–4.",
  "",
];

for (const temporaryTemplateId of SER_CP007_WAVE_B_TEMPORARY_TEMPLATE_IDS) {
  for (const seed of [1, 2]) {
    sections.push(
      renderSerCp007WaveBReview(
        generateSerCp007WaveBQuestion(temporaryTemplateId, seed),
      ),
      "",
      "---",
      "",
    );
  }
}

console.log(sections.join("\n"));
