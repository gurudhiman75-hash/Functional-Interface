import fs from "node:fs";
import path from "node:path";
import { generatePgkCp003LocalizedReviewV1 } from "./pgk-cp003-localization-v1";
import type { PgkLocaleV1 } from "./pgk-localization-types-v1";

const locales: PgkLocaleV1[] = ["en", "hi", "pa"];
const labels: Record<PgkLocaleV1, string> = { en: "English", hi: "Hindi", pa: "Punjabi" };

function mdEscape(value: string) {
  return value.replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}

const corpora = Object.fromEntries(locales.map((locale) => [locale, generatePgkCp003LocalizedReviewV1(locale)])) as
  Record<PgkLocaleV1, ReturnType<typeof generatePgkCp003LocalizedReviewV1>>;

const lines: string[] = [
  "# PGK-001 CP003 — Multilingual Review V1",
  "",
  "Status: REVIEW-READY / AWAITING HUMAN APPROVAL",
  "English authority: PGK-001 CP003 HUMAN APPROVED / FROZEN V2",
  "Factual authority: PGK-001-FINAL-FACTUAL-CERTIFICATION-V1",
  "Scope: 42 questions × English/Hindi/Punjabi = 126 review surfaces",
  "Lifecycle: review-only; Question Studio Hindi/Punjabi activation is not authorized by this artifact.",
  "",
];

for (let i = 0; i < 42; i += 1) {
  const en = corpora.en[i]!;
  lines.push(`## ${en.questionId} · ${en.qlId} · ${en.difficulty}`, "");
  for (const locale of locales) {
    const q = corpora[locale][i]!;
    lines.push(`### ${labels[locale]}`);
    lines.push(`**Question:** ${mdEscape(q.stem)}`, "");
    q.options.forEach((option, optionIndex) => {
      const mark = optionIndex === q.correctIndex ? " ✅" : "";
      lines.push(`${optionIndex + 1}. ${mdEscape(option)}${mark}`);
    });
    lines.push("", `**Explanation:** ${mdEscape(q.explanation)}`, "");
  }
}

const outDir = path.resolve(process.cwd(), "dist/pgk-review/PGK-MULTILINGUAL-V1");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "PGK-MULTILINGUAL-V1-CP003-REVIEW.md");
fs.writeFileSync(outPath, lines.join("\n") + "\n", "utf8");
console.log(outPath);
