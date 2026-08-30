import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { generateStcQuestion } from "./chapter-generator.ts";
import { generateStcFiveWayQuestion } from "./five-way-profile.ts";
import { STC_QL_IDS, type GeneratedStcQuestion, type StcLocale, type StcQlId } from "./types.ts";

const LOCALES: readonly StcLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const outDir = process.env.STC_REVIEW_OUT ?? "stc-001-review-pack";
await mkdir(outDir, { recursive: true });

function distinctFourWay(qlId: StcQlId, locale: StcLocale, target: number): readonly GeneratedStcQuestion[] {
  const chosen: GeneratedStcQuestion[] = [];
  const seen = new Set<string>();
  for (let seed = 101; seed < 20_000 && chosen.length < target; seed += 17) {
    const question = generateStcQuestion({ qlId, locale, seed });
    if (seen.has(question.scenarioId)) continue;
    seen.add(question.scenarioId);
    chosen.push(question);
  }
  if (chosen.length !== target) throw new Error(`${qlId}/${locale}: expected ${target} distinct review scenarios, got ${chosen.length}`);
  return chosen;
}

const rows: Array<Record<string, unknown>> = [];
const markdown: string[] = [
  "# STC-001 Six-QL Trilingual Human Review Pack",
  "",
  "This pack deliberately reaches eight distinct scenario authorities per semantic QL and all nine dedicated five-way either/or authorities.",
  "",
];

for (const qlId of STC_QL_IDS) {
  markdown.push(`## ${qlId} — Four-way profile`, "");
  for (const locale of LOCALES) {
    markdown.push(`### ${locale}`, "");
    const questions = distinctFourWay(qlId, locale, 8);
    questions.forEach((question, index) => {
      rows.push({ presentationProfile: "FOUR_WAY", ...question });
      markdown.push(
        `**Sample ${index + 1} — ${question.scenarioId} — seed ${question.seed} — ${question.difficulty}**`,
        "", question.stem, "",
        `I. ${question.conclusions[0]}`,
        `II. ${question.conclusions[1]}`,
        "",
        ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`),
        "",
        `**Answer:** ${String.fromCharCode(65 + question.correctIndex)} — ${question.answerClass}`,
        "",
        `**Explanation:** ${question.explanation}`,
        "",
      );
    });
  }
}

markdown.push("## QL002 — Five-way Either/Or banking profile", "");
for (const locale of LOCALES) {
  markdown.push(`### ${locale}`, "");
  for (let sample = 0; sample < 9; sample += 1) {
    const seed = sample * 4;
    const question = generateStcFiveWayQuestion({ qlId: "STC-QL-002", locale, seed });
    rows.push({ ...question });
    markdown.push(
      `**Five-way sample ${sample + 1} — ${question.scenarioId} — seed ${seed}**`,
      "", question.stem, "",
      `I. ${question.conclusions[0]}`,
      `II. ${question.conclusions[1]}`,
      "",
      ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`),
      "",
      `**Answer:** ${String.fromCharCode(65 + question.correctIndex)} — ${question.answerClass}`,
      "",
      `**Explanation:** ${question.explanation}`,
      "",
    );
  }
}

await writeFile(join(outDir, "stc-001-six-ql-trilingual-review.json"), `${JSON.stringify(rows, null, 2)}\n`, "utf8");
await writeFile(join(outDir, "stc-001-six-ql-trilingual-review.md"), `${markdown.join("\n")}\n`, "utf8");
console.log(`Exported ${rows.length} STC review surfaces: 144 four-way + 27 five-way either/or.`);
