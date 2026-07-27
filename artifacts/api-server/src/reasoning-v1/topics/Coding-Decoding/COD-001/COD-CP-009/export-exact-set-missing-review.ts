import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { EXACT_SET_MISSING_PROTOTYPE_CONTRACTS } from "./exact-set-missing-contracts";
import { generateExactSetMissingPrototypeQuestion } from "./exact-set-missing-generator";

const outputDirectory = resolve(process.argv[2] ?? "cod-cp009-exact-set-missing-review-output");
mkdirSync(outputDirectory, { recursive: true });

const questions = EXACT_SET_MISSING_PROTOTYPE_CONTRACTS.flatMap((contract, contractIndex) =>
  Array.from({ length: 10 }, (_, seedOffset) =>
    generateExactSetMissingPrototypeQuestion(contract.prototypeId, 1 + seedOffset + contractIndex * 1_000),
  ),
);

writeFileSync(
  resolve(outputDirectory, "cod-cp009-exact-set-missing-review.jsonl"),
  `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`,
  "utf8",
);

const markdown: string[] = [
  "# COD-CP-009 — Exact Set and Missing-Member Prototype Review",
  "",
  "Status: prototype review only; no permanent QLs and not publicly publishable.",
  "",
  `Questions: ${questions.length}`,
  "",
];

for (const contract of EXACT_SET_MISSING_PROTOTYPE_CONTRACTS) {
  markdown.push(`## ${contract.prototypeId}`, "");
  for (const question of questions.filter((candidate) => candidate.prototypeId === contract.prototypeId)) {
    markdown.push(
      `### Seed ${question.seed} — ${question.metadata.scenarioId}`,
      "",
      `- Topology: ${question.topologyKind}`,
      `- Difficulty: ${question.difficulty}`,
      `- Answer type: ${question.answerType}`,
      `- Complete solution count: ${question.metadata.solutionCount}`,
      `- Individual-pair ambiguity: ${question.metadata.individualPairAmbiguity}`,
      "",
      `**Stem:** ${question.stem}`,
      "",
      "| Statement | Message | Code words |",
      "|---|---|---|",
      ...question.structuredPrompt.rows.map((row, index) => `| ${index + 1} | ${row.sentence} | ${row.displayedCode} |`),
      "",
      "**Options:**",
      ...question.options.map((option, index) =>
        `${index + 1}. ${option.value}${option.isCorrect ? " ✓" : ""}${option.errorLabel ? ` — ${option.errorLabel}` : ""}`,
      ),
      "",
      "**Reference aid:**",
      ...question.explanation.referenceAid.map((line) => `- ${line}`),
      "",
      `**Quick method:** ${question.explanation.quickMethod}`,
      "",
      "**Evidence comparison:**",
      ...question.explanation.evidenceComparison.map((line) => `- ${line}`),
      "",
      `**Target result:** ${question.explanation.targetResult}`,
      `**Conclusion:** ${question.explanation.conclusion}`,
      `**Common Trap Alert:** ${question.explanation.commonTrapAlert}`,
      "",
    );
  }
}

writeFileSync(
  resolve(outputDirectory, "cod-cp009-exact-set-missing-review.md"),
  `${markdown.join("\n")}\n`,
  "utf8",
);

const summary = {
  checkpoint: "COD-CP-009",
  maturity: "EXACT_SET_MISSING_QUESTION_PROTOTYPE",
  permanentQlsCreated: 0,
  questionCount: questions.length,
  contracts: Object.fromEntries(
    EXACT_SET_MISSING_PROTOTYPE_CONTRACTS.map((contract) => [
      contract.prototypeId,
      questions.filter((question) => question.prototypeId === contract.prototypeId).length,
    ]),
  ),
};
writeFileSync(resolve(outputDirectory, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ outputDirectory, ...summary }, null, 2));
