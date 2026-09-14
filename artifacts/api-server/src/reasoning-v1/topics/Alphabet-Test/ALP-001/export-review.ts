import { writeFileSync } from "node:fs";
import { ALP_001_QLS } from "./ql-registry";
import { toAlpReviewQuestion } from "./learner-explanation";
import { generateAlp001Question } from "./runtime";
import type { AlpLocale } from "./types";

const locale = (process.argv[2] ?? "en-IN") as AlpLocale;
const samplesPerQl = Number.parseInt(process.argv[3] ?? "3", 10);
const outputPath = process.argv[4] ?? `alp-001-cp001-cp010-${locale}-complete-review.md`;
const label = <T>(en: T, hi: T, pa: T): T => locale === "en-IN" ? en : locale === "hi-IN" ? hi : pa;
const lines: string[] = [`# ALP-001 CP-001–CP-010 Complete Chapter Review — ${locale}`, ""];

for (const ql of ALP_001_QLS) {
  lines.push(`## ${ql.qlId} — ${ql.solveMode}`, "");
  for (let seed = 0; seed < samplesPerQl; seed += 1) {
    const question = toAlpReviewQuestion(generateAlp001Question(ql.qlId, seed, locale));
    const explanation = question.explanation;
    lines.push(`### Seed ${seed} · ${question.difficulty} · ${question.renderer}`, "", question.stem, "");
    question.options.forEach((option, index) => lines.push(`${index + 1}. ${option.value}${index === question.correctIndex ? "  **✓**" : ""}`));

    lines.push(
      "",
      `#### ${label("📌 Core Concept", "📌 मुख्य अवधारणा", "📌 ਮੁੱਖ ਧਾਰਨਾ")}`,
      explanation.coreConcept,
      "",
      `#### ${label("📝 Step-by-Step Solution", "📝 चरण-दर-चरण समाधान", "📝 ਕਦਮ-ਦਰ-ਕਦਮ ਹੱਲ")}`,
    );
    explanation.steps.forEach((step, index) => lines.push(`${index + 1}. ${step}`));

    if (explanation.visualWorking.length > 0) {
      lines.push("", `#### ${label("Position Tracking", "स्थान-ट्रैकिंग", "ਥਾਂ-ਟ੍ਰੈਕਿੰਗ")}`, "", "```text", ...explanation.visualWorking, "```");
    }

    lines.push("", `**${explanation.conclusion}**`, "");
  }
}

writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${outputPath}`);
