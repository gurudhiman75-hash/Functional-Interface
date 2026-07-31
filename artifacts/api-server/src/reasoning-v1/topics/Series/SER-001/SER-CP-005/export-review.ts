import {
  SER_CP005_CANONICAL_AUTHORITY_IDS,
  SER_CP005_SOURCE_RULE_IDS,
  SER_CP005_TEMPORARY_TEMPLATE_IDS,
  generateSerCp005Question,
  renderSerCp005Review,
} from "./foundation";

const samplesPerTemplate = 2;
const sections: string[] = [
  "# SER-001 / SER-CP-005 — Open English Discovery Review",
  "",
  "This pack contains exact deterministic runtime output for alternating, interleaved and composite numeric-series candidates.",
  "",
  "- Permanent QLs: 0",
  `- Temporary templates: ${SER_CP005_TEMPORARY_TEMPLATE_IDS.length}`,
  `- Source-shaped rule families: ${SER_CP005_SOURCE_RULE_IDS.length}`,
  `- Provisional canonical authorities: ${SER_CP005_CANONICAL_AUTHORITY_IDS.length}`,
  "- Alternating/interleaved collision families: 2",
  "- Phase-variant merge families: 4",
  "- Maturity: OPEN_EXECUTABLE_DISCOVERY",
  "- Product exposure: disabled",
  "",
];

for (const temporaryTemplateId of SER_CP005_TEMPORARY_TEMPLATE_IDS) {
  for (let seed = 1; seed <= samplesPerTemplate; seed += 1) {
    sections.push(
      renderSerCp005Review(
        generateSerCp005Question(temporaryTemplateId, seed),
      ),
      "",
      "---",
      "",
    );
  }
}

console.log(sections.join("\n"));
