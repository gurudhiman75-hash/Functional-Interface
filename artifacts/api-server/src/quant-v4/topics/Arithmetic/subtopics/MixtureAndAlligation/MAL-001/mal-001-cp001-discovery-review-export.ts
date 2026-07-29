import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { MAL_CP001_DISCOVERY_PROTOTYPE_IDS } from "./foundation/cp001-gap-registry";
import { generateMalCp001DiscoveryPrototype } from "./foundation/cp001-discovery-pipeline";

function jsonReplacer(_key: string, value: unknown): unknown {
  return typeof value === "bigint" ? value.toString() : value;
}

const questions = MAL_CP001_DISCOVERY_PROTOTYPE_IDS.flatMap((prototypeId) =>
  ["review-a", "review-b", "review-c", "review-d"].map((seed) =>
    generateMalCp001DiscoveryPrototype(prototypeId, seed),
  ),
);

const outputDirectory = path.resolve("dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });

const jsonPath = path.join(
  outputDirectory,
  "mal-001-cp001-discovery-review.json",
);
writeFileSync(jsonPath, JSON.stringify({
  status: "DISCOVERY_REVIEW_ONLY",
  permanentQlCount: 0,
  questionStudioDiscoverable: false,
  publiclyPublishable: false,
  prototypeCount: MAL_CP001_DISCOVERY_PROTOTYPE_IDS.length,
  questionCount: questions.length,
  questions,
}, jsonReplacer, 2));

const markdown: string[] = [
  "# MAL-CP-001 English Discovery Review",
  "",
  "> Executable discovery material only. No permanent QL IDs, Question Studio exposure, test eligibility or publication.",
  "",
  `**Prototype identities:** ${MAL_CP001_DISCOVERY_PROTOTYPE_IDS.length}`,
  "",
  `**Review questions:** ${questions.length}`,
  "",
];

for (const question of questions) {
  markdown.push(`## ${question.prototypeId} — ${question.seed}`);
  markdown.push("");
  markdown.push(`**Difficulty:** ${question.difficulty}`);
  markdown.push("");
  markdown.push(`**Answer semantic:** ${question.answerSemantic}`);
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
  question.explanation.steps.forEach((step, index) => {
    markdown.push(`${index + 1}. ${step}`);
  });
  markdown.push("");
  markdown.push(`**Verification:** ${question.explanation.verification}`);
  markdown.push("");
  markdown.push(`**Conclusion:** ${question.explanation.conclusion}`);
  markdown.push("");
  markdown.push(`**${question.explanation.commonTrap}**`);
  markdown.push("");
  if ("diagram" in question && question.diagram) {
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

const markdownPath = path.join(
  outputDirectory,
  "mal-001-cp001-discovery-review.md",
);
writeFileSync(markdownPath, markdown.join("\n"));

console.log(JSON.stringify({
  status: "PASS",
  prototypeCount: MAL_CP001_DISCOVERY_PROTOTYPE_IDS.length,
  questionCount: questions.length,
  jsonPath,
  markdownPath,
}, null, 2));
