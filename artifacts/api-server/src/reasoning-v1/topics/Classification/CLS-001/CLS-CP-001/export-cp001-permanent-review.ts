import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { CLS_CP001_PERMANENT_CONTRACTS } from "./cp001-permanent-contracts";
import { generateClsCp001Question } from "./cp001-multilingual-runtime";
import type { ClsCp001Locale } from "./localization/cp001-language-pack";

const outputDir = path.resolve(process.cwd(), "dist/reasoning-v1/cls-001/cp001-permanent-review");
const locales: readonly ClsCp001Locale[] = ["en-IN", "hi-IN", "pa-IN"];

const rows = CLS_CP001_PERMANENT_CONTRACTS.flatMap((contract, contractIndex) =>
  locales.flatMap((locale, localeIndex) =>
    Array.from({ length: 16 }, (_, sampleIndex) => {
      const seed = contractIndex * 10_000 + localeIndex * 1_000 + sampleIndex * 17;
      return generateClsCp001Question(contract.qlId, locale, seed);
    }),
  ),
);

function section(title: string, lines: readonly string[]): string {
  return [`### ${title}`, ...lines.map((line) => `- ${line}`)].join("\n");
}

const markdown = [
  "# CLS-CP-001 Permanent Multilingual Review",
  "",
  `Questions: ${rows.length}`,
  `Permanent QLs: ${CLS_CP001_PERMANENT_CONTRACTS.length}`,
  `Locales: ${locales.join(", ")}`,
  "Lifecycle: review-only frozen runtime proof",
  "Question Studio: disabled",
  "Question Bank: disabled",
  "Test/publication eligibility: disabled",
  "",
  ...rows.flatMap((question, index) => [
    `## ${index + 1}. ${question.qlId} · ${question.metadata.locale} · seed ${question.seed} · ${question.task} · ${question.difficulty}`,
    "",
    `Source control: ${question.metadata.sourcePrototypeId} / ${question.metadata.sourcePrototypeSeed}`,
    `Solve contract: ${question.metadata.solveContractId}`,
    `Option count: ${question.options.length}`,
    `Difficulty score: ${question.difficultyFeatures.score}`,
    `Difficulty features: ${JSON.stringify(question.difficultyFeatures)}`,
    "",
    question.stem,
    question.givens.length > 0 ? `\nGiven group: ${question.givens.join(", ")}` : "",
    "",
    ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`),
    "",
    `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`,
    `**Intended class:** ${question.intendedClassLabel}`,
    `**Ambiguity result:** ${question.ambiguityAudit.result}`,
    "",
    section("Core Rule", question.explanation.coreRule),
    "",
    section("Check the Options", question.explanation.optionChecks),
    "",
    section("Exam Speed Shortcut", question.explanation.examSpeedShortcut),
    "",
    section("Common Traps", question.explanation.commonTraps),
    "",
    "---",
    "",
  ]),
].filter((line) => line !== "").join("\n");

await mkdir(outputDir, { recursive: true });
await writeFile(
  path.join(outputDir, "cls-cp001-permanent-multilingual-review.json"),
  `${JSON.stringify(rows, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDir, "cls-cp001-permanent-multilingual-review.md"),
  `${markdown}\n`,
  "utf8",
);

console.log("CLS-CP-001 permanent multilingual review written.", {
  outputDir,
  questions: rows.length,
  qls: CLS_CP001_PERMANENT_CONTRACTS.length,
  locales,
  optionCounts: Object.fromEntries([4, 5].map((count) => [count, rows.filter((question) => question.options.length === count).length])),
  tasks: Object.fromEntries([...new Set(rows.map((question) => question.task))].map((task) => [task, rows.filter((question) => question.task === task).length])),
});
