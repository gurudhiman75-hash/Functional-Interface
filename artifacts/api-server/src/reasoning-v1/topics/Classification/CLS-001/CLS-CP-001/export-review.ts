import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateClsCp001Prototype, getClsCp001PrototypeDefinitions } from "./runtime";

const currentFile = fileURLToPath(import.meta.url);
const outputDir = path.resolve(path.dirname(currentFile), "../../../../../../../dist/reasoning-v1/cls-001/cp001-review");

const rows = getClsCp001PrototypeDefinitions().flatMap((prototype, prototypeIndex) =>
  Array.from({ length: 12 }, (_, sampleIndex) => {
    const seed = prototypeIndex * 1000 + sampleIndex * 17;
    return generateClsCp001Prototype(prototype.prototypeId, seed);
  }),
);

function section(title: string, lines: readonly string[]): string {
  return [`### ${title}`, ...lines.map((line) => `- ${line}`)].join("\n");
}

const markdown = [
  "# CLS-CP-001 Semantic Classification Prototype Review",
  "",
  `Dataset: ${rows[0]?.metadata.datasetVersion ?? "unknown"}`,
  `Questions: ${rows.length}`,
  "Permanent QLs: 0",
  "Question Studio: disabled",
  "Public publication: disabled",
  "",
  ...rows.flatMap((question, index) => [
    `## ${index + 1}. ${question.prototypeId} · seed ${question.seed} · ${question.difficulty}`,
    "",
    question.stem,
    question.givens.length > 0 ? `\nGiven group: ${question.givens.join(", ")}` : "",
    "",
    ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`),
    "",
    `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`,
    `**Intended class:** ${question.intendedClassLabel}`,
    `**Ambiguity audit:** ${question.ambiguityAudit.result}`,
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
await writeFile(path.join(outputDir, "cls-cp001-semantic-prototype-review.json"), `${JSON.stringify(rows, null, 2)}\n`, "utf8");
await writeFile(path.join(outputDir, "cls-cp001-semantic-prototype-review.md"), `${markdown}\n`, "utf8");

console.log("CLS-CP-001 review export written.", {
  outputDir,
  questions: rows.length,
  prototypes: getClsCp001PrototypeDefinitions().length,
});
