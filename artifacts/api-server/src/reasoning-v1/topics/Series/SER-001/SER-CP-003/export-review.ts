import {
  SER_CP003_TEMPORARY_TEMPLATE_IDS,
  generateSerCp003Question,
  renderSerCp003Review,
} from "./foundation";

const samplesPerTemplate = 4;
const sections: string[] = [
  "# SER-001 / SER-CP-003 — Open English Discovery Review",
  "",
  "This pack contains exact deterministic runtime output for the temporary second- and third-difference templates.",
  "",
  "- Permanent QLs: 0",
  "- Temporary templates: 8",
  "- Candidate solve authorities: 2",
  "- Maturity: OPEN_EXECUTABLE_DISCOVERY",
  "- Product exposure: disabled",
  "",
];

for (const temporaryTemplateId of SER_CP003_TEMPORARY_TEMPLATE_IDS) {
  for (let seed = 1; seed <= samplesPerTemplate; seed += 1) {
    sections.push(
      renderSerCp003Review(
        generateSerCp003Question(temporaryTemplateId, seed),
      ),
      "",
      "---",
      "",
    );
  }
}

console.log(sections.join("\n"));
