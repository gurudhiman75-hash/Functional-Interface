import {
  SER_CP001_TEMPORARY_TEMPLATE_IDS,
  generateSerCp001Question,
  renderSerCp001Review,
} from "./foundation";

const samplesPerTemplate = 8;
const sections: string[] = [
  "# SER-001 / SER-CP-001 — Open English Discovery Review",
  "",
  "This pack contains exact deterministic runtime output for the temporary additive-sequence templates.",
  "",
  "- Permanent QLs: 0",
  "- Temporary templates: 4",
  "- Candidate solve authorities: 1",
  "- Maturity: OPEN_EXECUTABLE_DISCOVERY",
  "- Product exposure: disabled",
  "",
];

for (const temporaryTemplateId of SER_CP001_TEMPORARY_TEMPLATE_IDS) {
  for (let seed = 1; seed <= samplesPerTemplate; seed += 1) {
    sections.push(
      renderSerCp001Review(
        generateSerCp001Question(temporaryTemplateId, seed),
      ),
      "",
      "---",
      "",
    );
  }
}

console.log(sections.join("\n"));
