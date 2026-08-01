import {
  SER_CP004_TEMPORARY_TEMPLATE_IDS,
  generateSerCp004Question,
} from "./foundation";
import { renderSerV3NaturalReview } from "../SER-EDITORIAL-V3/ser-v3-natural";

const samplesPerTemplate = 2;
const sections: string[] = [
  "# SER-001 / SER-CP-004 — Natural English Review V3",
  "",
  "This pack contains exact deterministic runtime questions rendered through the chapter-wide SER-V3-NATURAL explanation standard.",
  "",
  "- Permanent QLs: 0",
  "- Temporary templates: 28",
  "- Candidate rule families: 7",
  "- Explanation standard: SER-V3-NATURAL",
  "- Product exposure: disabled",
  "",
];

for (const temporaryTemplateId of SER_CP004_TEMPORARY_TEMPLATE_IDS) {
  for (let seed = 1; seed <= samplesPerTemplate; seed += 1) {
    sections.push(
      renderSerV3NaturalReview(
        generateSerCp004Question(temporaryTemplateId, seed),
      ),
      "",
      "---",
      "",
    );
  }
}

console.log(sections.join("\n"));
