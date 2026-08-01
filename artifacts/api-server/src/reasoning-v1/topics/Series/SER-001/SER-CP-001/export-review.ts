import {
  SER_CP001_TEMPORARY_TEMPLATE_IDS,
  generateSerCp001Question,
} from "./foundation";
import { renderSerV3NaturalReview } from "../SER-EDITORIAL-V3/ser-v3-natural";

const samplesPerTemplate = 8;
const sections: string[] = [
  "# SER-001 / SER-CP-001 — Natural English Review V3",
  "",
  "This pack contains exact deterministic runtime questions rendered through the chapter-wide SER-V3-NATURAL explanation standard.",
  "",
  "- Permanent QLs: 0",
  "- Temporary templates: 4",
  "- Candidate solve authorities: 1",
  "- Explanation standard: SER-V3-NATURAL",
  "- Product exposure: disabled",
  "",
];

for (const temporaryTemplateId of SER_CP001_TEMPORARY_TEMPLATE_IDS) {
  for (let seed = 1; seed <= samplesPerTemplate; seed += 1) {
    sections.push(
      renderSerV3NaturalReview(
        generateSerCp001Question(temporaryTemplateId, seed),
      ),
      "",
      "---",
      "",
    );
  }
}

console.log(sections.join("\n"));
