import fs from "node:fs";
import path from "node:path";
import {
  generatePhysicsLocalizedBalancedReviewV1,
  SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_LOCALES,
} from "./sci-physics-localization-generator-v1";

const labels = { en: "English", hi: "Hindi", pa: "Punjabi" } as const;
const targetDir = path.resolve("dist/science-review/SCI-PHYSICS-MULTILINGUAL-V1");
fs.mkdirSync(targetDir, { recursive: true });

type ReviewCp = "SCI-CP-001" | "SCI-CP-002" | "SCI-CP-003" | "SCI-CP-004" | "SCI-CP-005" | "SCI-CP-006";

function materialize(cps: readonly ReviewCp[], title: string, filename: string) {
  const out: string[] = [
    `# SCI Physics Multilingual V1 — ${title} Review`,
    "",
    "Review-only candidate. English is the semantic authority; Hindi and Punjabi preserve the same semantic anchor, option order and answer index.",
    "",
  ];
  for (const cpId of cps) {
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
  const target = path.join(targetDir, filename);
  fs.writeFileSync(target, out.join("\n"));
  console.log(target);
}

materialize(["SCI-CP-001", "SCI-CP-002"], "CP001–CP002", "SCI-PHYSICS-MULTILINGUAL-V1-CP001-CP002-REVIEW.md");
materialize(["SCI-CP-003", "SCI-CP-004"], "CP003–CP004", "SCI-PHYSICS-MULTILINGUAL-V1-CP003-CP004-REVIEW.md");
materialize(["SCI-CP-005", "SCI-CP-006"], "CP005–CP006", "SCI-PHYSICS-MULTILINGUAL-V1-CP005-CP006-REVIEW.md");
