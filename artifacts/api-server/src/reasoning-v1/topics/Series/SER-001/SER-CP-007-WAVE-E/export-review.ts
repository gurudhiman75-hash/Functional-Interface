import {
  SER_CP007_WAVE_E_TEMPORARY_TEMPLATE_IDS,
  generateSerCp007WaveEQuestion,
  renderSerCp007WaveEReview,
} from "./foundation";

const sections = [
  "# SER-CP-007 Wave E English discovery review",
  "",
  "Temporary discovery identities only. Permanent QLs remain unallocated.",
  "All choices use numeric labels 1–4.",
  "The review includes moving-marker, positional-substitution and collision examples.",
  "",
];

for (const temporaryTemplateId of SER_CP007_WAVE_E_TEMPORARY_TEMPLATE_IDS) {
  for (const seed of [1, 2]) {
    sections.push(
      renderSerCp007WaveEReview(
        generateSerCp007WaveEQuestion(temporaryTemplateId, seed),
      ),
      "",
      "---",
      "",
    );
  }
}

console.log(sections.join("\n"));
