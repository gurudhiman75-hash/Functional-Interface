import {
  SER_CP006_CANONICAL_AUTHORITY_IDS,
  SER_CP006_SOURCE_RULE_IDS,
  SER_CP006_TEMPORARY_TEMPLATE_IDS,
  generateSerCp006Question,
  renderSerCp006Review,
} from "./foundation";

const samplesPerTemplate = 2;
const sections: string[] = [
  "# SER-001 / SER-CP-006 — Single-letter alphabetic review",
  "",
  "This pack contains exact deterministic runtime output for the completed CP-006 implementation.",
  "",
  "- Permanent QLs: 0",
  `- Temporary templates: ${SER_CP006_TEMPORARY_TEMPLATE_IDS.length}`,
  `- Source-shaped families: ${SER_CP006_SOURCE_RULE_IDS.length}`,
  `- Provisional canonical authorities: ${SER_CP006_CANONICAL_AUTHORITY_IDS.length}`,
  "- Review questions: 64",
  "- Product exposure: disabled",
  "- Next checkpoint: blocked until user approval",
  "",
];

for (const temporaryTemplateId of SER_CP006_TEMPORARY_TEMPLATE_IDS) {
  for (let seed = 1; seed <= samplesPerTemplate; seed += 1) {
    sections.push(renderSerCp006Review(generateSerCp006Question(temporaryTemplateId, seed)), "", "---", "");
  }
}

console.log(sections.join("\n"));
