import fs from "node:fs";
import path from "node:path";
import {
  generatePhysicsLocalizedBalancedReviewV1,
  SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_CPS,
  SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_LOCALES,
} from "./sci-physics-localization-generator-v1";

const labels = { en: "English", hi: "Hindi", pa: "Punjabi" } as const;
const out: string[] = [
  "# SCI Physics Multilingual V1 — CP001–CP002 Review",
  "",
  "Review-only candidate. English is the semantic authority; Hindi and Punjabi must preserve the same answer index and facts.",
  "",
];
for (const cpId of SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_CPS) {
  out.push(`## ${cpId}`, "");
  for (const locale of SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_LOCALES) {
    out.push(`### ${labels[locale]}`, "");
    const questions = generatePhysicsLocalizedBalancedReviewV1(cpId, locale);
    questions.forEach((q, index) => {
      out.push(`**${index + 1}. ${q.stem}**`);
      q.options.forEach((option, optionIndex) => out.push(`${String.fromCharCode(65 + optionIndex)}. ${option}`));
      out.push(`**Answer:** ${String.fromCharCode(65 + q.correctIndex)} — ${q.canonicalAnswer}`);
      out.push(`**Explanation:** ${q.explanation}`, "");
    });
  }
}
const targetDir = path.resolve("dist/science-review/SCI-PHYSICS-MULTILINGUAL-V1");
fs.mkdirSync(targetDir, { recursive: true });
const target = path.join(targetDir, "SCI-PHYSICS-MULTILINGUAL-V1-CP001-CP002-REVIEW.md");
fs.writeFileSync(target, out.join("\n"));
console.log(target);
