import {
  SER_CP002_TEMPORARY_TEMPLATE_IDS,
  generateSerCp002Question,
  renderSerCp002Review,
} from "./foundation";

const samplesPerTemplate = 4;
const sections: string[] = [
  "# SER-001 / SER-CP-002 — Open English Discovery Review",
  "",
  "This pack contains exact deterministic runtime output for the temporary multiplicative and affine recurrence templates.",
  "",
  "- Permanent QLs: 0",
  "- Temporary templates: 8",
  "- Candidate solve authorities: 2",
  "- Maturity: OPEN_EXECUTABLE_DISCOVERY",
  "- Product exposure: disabled",
  "",
];

for (const temporaryTemplateId of SER_CP002_TEMPORARY_TEMPLATE_IDS) {
  for (let seed = 1; seed <= samplesPerTemplate; seed += 1) {
    sections.push(
      renderSerCp002Review(
        generateSerCp002Question(temporaryTemplateId, seed),
      ),
      "",
      "---",
      "",
    );
  }
}

console.log(sections.join("\n"));
