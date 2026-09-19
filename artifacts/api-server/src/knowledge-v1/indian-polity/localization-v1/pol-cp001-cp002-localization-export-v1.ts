import fs from "node:fs";
import path from "node:path";
import { generatePolCp001Cp002LocalizedReviewV1 } from "./pol-cp001-cp002-localization-v1";
import type { PolLocaleV1 } from "./pol-localization-types-v1";

const localeNames: Record<PolLocaleV1, string> = {
  en: "English",
  hi: "Hindi",
  pa: "Punjabi",
};

const targetDir = path.resolve("dist/polity-review/POL-MULTILINGUAL-V1");
fs.mkdirSync(targetDir, { recursive: true });

for (const locale of ["en", "hi", "pa"] as const) {
  const questions = generatePolCp001Cp002LocalizedReviewV1(locale);
  const lines: string[] = [
    `# POL-001 CP001–CP002 — ${localeNames[locale]} Localization Review V1`,
    "",
    `Questions: ${questions.length}`,
    "",
  ];

  for (const q of questions) {
    lines.push(`## ${q.questionId} · ${q.cpId} · ${q.qlId} · ${q.difficulty}`);
    lines.push("");
    lines.push(q.stem);
    lines.push("");
    q.options.forEach((option, index) => {
      const marker = index === q.correctIndex ? " ✓" : "";
      lines.push(`${String.fromCharCode(65 + index)}. ${option}${marker}`);
    });
    lines.push("");
    lines.push(`**Explanation:** ${q.explanation}`);
    lines.push("");
  }

  fs.writeFileSync(
    path.join(targetDir, `POL-CP001-CP002-${locale.toUpperCase()}-REVIEW-V1.md`),
    lines.join("\n"),
  );
}

console.log("POL-001 CP001–CP002 multilingual review Markdown generated.");
