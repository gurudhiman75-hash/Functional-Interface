import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { generateMalCp001Prototype } from "./foundation/pipeline";
import { MAL_CP001_PROTOTYPE_IDS } from "./foundation/types";

function jsonReplacer(_key: string, value: unknown): unknown {
  return typeof value === "bigint" ? value.toString() : value;
}

const questions = MAL_CP001_PROTOTYPE_IDS.flatMap((prototypeId) =>
  ["review-a", "review-b", "review-c", "review-d"].map((seed) =>
    generateMalCp001Prototype(prototypeId, seed),
  ),
);

const outputDirectory = path.resolve("dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });

const jsonPath = path.join(outputDirectory, "mal-001-cp001-prototype-review.json");
writeFileSync(jsonPath, JSON.stringify({
  status: "PROTOTYPE_REVIEW_ONLY",
  permanentQlCount: 0,
  questionStudioDiscoverable: false,
  publiclyPublishable: false,
  questionCount: questions.length,
  questions,
}, jsonReplacer, 2));

const markdown: string[] = [
  "# MAL-CP-001 English Prototype Review",
  "",
  "> Discovery material only. No permanent QL IDs, Question Studio exposure, test eligibility or publication.",
  "",
];

for (const question of questions) {
  markdown.push(`## ${question.prototypeId} — ${question.seed}`);
  markdown.push("");
  markdown.push(`**Difficulty:** ${question.difficulty}`);
  markdown.push("");
  markdown.push(question.stem);
  markdown.push("");
  question.options.forEach((option, index) => {
    const marker = index === question.correctIndex ? " **✓**" : "";
    markdown.push(`${String.fromCharCode(65 + index)}. ${option}${marker}`);
  });
  markdown.push("");
  markdown.push(`**Opening:** ${question.explanation.opening}`);
  markdown.push("");
  markdown.push(`**Formula:** ${question.explanation.formula}`);
  markdown.push("");
  question.explanation.steps.forEach((step, index) => markdown.push(`${index + 1}. ${step}`));
  markdown.push("");
  markdown.push(`**Verification:** ${question.explanation.verification}`);
  markdown.push("");
  markdown.push(`**Conclusion:** ${question.explanation.conclusion}`);
  markdown.push("");
  markdown.push(`**${question.explanation.commonTrap}**`);
  markdown.push("");
  if (question.diagram) {
    markdown.push("**Alligation cross data:**");
    markdown.push("");
    markdown.push("```json");
    markdown.push(JSON.stringify(question.diagram, null, 2));
    markdown.push("```");
    markdown.push("");
  }
  markdown.push("---");
  markdown.push("");
}

const markdownPath = path.join(outputDirectory, "mal-001-cp001-prototype-review.md");
writeFileSync(markdownPath, markdown.join("\n"));

console.log(JSON.stringify({
  status: "PASS",
  questionCount: questions.length,
  jsonPath,
  markdownPath,
}, null, 2));
