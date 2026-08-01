import {
  SER_CP006_CANONICAL_AUTHORITY_IDS,
  SER_CP006_SOURCE_RULE_IDS,
  SER_CP006_TEMPORARY_TEMPLATE_IDS,
  generateSerCp006Question,
} from "./foundation";
import { renderSerV3NaturalReview } from "../SER-EDITORIAL-V3/ser-v3-natural-pedagogical";

const samplesPerTemplate = 2;
const sections: string[] = [
  "# SER-001 / SER-CP-006 — Natural English Review V3",
  "",
  "This pack contains exact deterministic runtime questions rendered through the chapter-wide SER-V3-NATURAL explanation standard.",
  "",
  "- Permanent QLs: 0",
  `- Temporary templates: ${SER_CP006_TEMPORARY_TEMPLATE_IDS.length}`,
  `- Source-shaped families: ${SER_CP006_SOURCE_RULE_IDS.length}`,
  `- Provisional canonical authorities: ${SER_CP006_CANONICAL_AUTHORITY_IDS.length}`,
  "- Review questions: 64",
  "- Explanation standard: SER-V3-NATURAL",
  "- Product exposure: disabled",
  "- Next checkpoint: blocked until user approval",
  "",
];

for (const temporaryTemplateId of SER_CP006_TEMPORARY_TEMPLATE_IDS) {
  for (let seed = 1; seed <= samplesPerTemplate; seed += 1) {
    sections.push(
      renderSerV3NaturalReview(
        generateSerCp006Question(temporaryTemplateId, seed),
      ),
      "",
      "---",
      "",
    );
  }
}

console.log(sections.join("\n"));
