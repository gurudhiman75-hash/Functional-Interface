import {
  SER_CP002_TEMPORARY_TEMPLATE_IDS,
  generateSerCp002Question,
} from "./foundation";
import { renderSerV3NaturalReview } from "../SER-EDITORIAL-V3/ser-v3-natural-authority";

const samplesPerTemplate = 4;
const sections: string[] = [
  "# SER-001 / SER-CP-002 — Natural English Review V3",
  "",
  "This pack contains exact deterministic runtime questions rendered through the chapter-wide SER-V3-NATURAL explanation standard.",
  "",
  "- Permanent QLs: 0",
  "- Temporary templates: 8",
  "- Candidate solve authorities: 2",
  "- Explanation standard: SER-V3-NATURAL",
  "- Product exposure: disabled",
  "",
];

for (const temporaryTemplateId of SER_CP002_TEMPORARY_TEMPLATE_IDS) {
  for (let seed = 1; seed <= samplesPerTemplate; seed += 1) {
    sections.push(
      renderSerV3NaturalReview(
        generateSerCp002Question(temporaryTemplateId, seed),
      ),
      "",
      "---",
      "",
    );
  }
}

console.log(sections.join("\n"));
