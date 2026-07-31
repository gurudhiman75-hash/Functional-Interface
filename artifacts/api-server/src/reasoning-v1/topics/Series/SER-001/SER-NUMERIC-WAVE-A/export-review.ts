import {
  SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATE_IDS,
  generateSerNumericWaveAQuestion,
  renderSerNumericWaveAReview,
} from "./foundation";

const samplesPerTemplate = 2;
const sections: string[] = [
  "# SER-001 — Numeric Wave A Edge-Domain Review",
  "",
  "This pack contains exact deterministic runtime output for constant, signed-descending, fractional, decimal and division-series domain probes.",
  "",
  "- Permanent QLs: 0",
  "- Temporary templates: 24",
  "- Source-shaped families: 6",
  "- Existing canonical authorities extended: 3",
  "- Maturity: OPEN_EXECUTABLE_DISCOVERY",
  "- Product exposure: disabled",
  "",
];

for (const temporaryTemplateId of SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATE_IDS) {
  for (let seed = 1; seed <= samplesPerTemplate; seed += 1) {
    sections.push(
      renderSerNumericWaveAReview(
        generateSerNumericWaveAQuestion(temporaryTemplateId, seed),
      ),
      "",
      "---",
      "",
    );
  }
}

console.log(sections.join("\n"));
