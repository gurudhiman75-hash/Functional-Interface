import {
  SER_CP005_CANONICAL_AUTHORITY_IDS,
  SER_CP005_SOURCE_RULE_IDS,
  SER_CP005_TEMPORARY_TEMPLATE_IDS,
  generateSerCp005Question,
} from "./foundation";
import { renderSerV3NaturalReview } from "../SER-EDITORIAL-V3/ser-v3-natural-pedagogical";

const samplesPerTemplate = 2;
const sections: string[] = [
  "# SER-001 / SER-CP-005 — Natural English Review V3",
  "",
  "This pack contains exact deterministic runtime questions rendered through the chapter-wide SER-V3-NATURAL explanation standard.",
  "",
  "- Permanent QLs: 0",
  `- Temporary templates: ${SER_CP005_TEMPORARY_TEMPLATE_IDS.length}`,
  `- Source-shaped rule families: ${SER_CP005_SOURCE_RULE_IDS.length}`,
  `- Provisional canonical authorities: ${SER_CP005_CANONICAL_AUTHORITY_IDS.length}`,
  "- Explanation standard: SER-V3-NATURAL",
  "- Product exposure: disabled",
  "",
];

for (const temporaryTemplateId of SER_CP005_TEMPORARY_TEMPLATE_IDS) {
  for (let seed = 1; seed <= samplesPerTemplate; seed += 1) {
    sections.push(
      renderSerV3NaturalReview(
        generateSerCp005Question(temporaryTemplateId, seed),
      ),
      "",
      "---",
      "",
    );
  }
}

console.log(sections.join("\n"));
