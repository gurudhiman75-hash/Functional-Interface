import {
  SER_CP004_TEMPORARY_TEMPLATE_IDS,
  generateSerCp004Question,
  renderSerCp004Review,
} from "./foundation";

const samplesPerTemplate = 2;
const sections: string[] = [
  "# SER-001 / SER-CP-004 — Open English Discovery Review",
  "",
  "This pack contains exact deterministic runtime output for special-number, recurrence and cross-checkpoint collision probes.",
  "",
  "- Permanent QLs: 0",
  "- Temporary templates: 28",
  "- Candidate rule families: 7",
  "- Provisional CP-004 retained families: 3",
  "- Provisional cross-checkpoint collision families: 4",
  "- Maturity: OPEN_EXECUTABLE_DISCOVERY",
  "- Product exposure: disabled",
  "",
];

for (const temporaryTemplateId of SER_CP004_TEMPORARY_TEMPLATE_IDS) {
  for (let seed = 1; seed <= samplesPerTemplate; seed += 1) {
    sections.push(
      renderSerCp004Review(
        generateSerCp004Question(temporaryTemplateId, seed),
      ),
      "",
      "---",
      "",
    );
  }
}

console.log(sections.join("\n"));
