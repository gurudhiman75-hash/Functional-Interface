import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { RESOLVED_COMPOSITION_PROTOTYPE_CONTRACTS } from "./resolved-composition-contracts";
import { generateResolvedCompositionPrototypeQuestion } from "./resolved-composition-generator";

const outputDirectory = resolve(process.argv[2] ?? "cod-cp009-resolved-composition-review-output");
mkdirSync(outputDirectory, { recursive: true });

const questions = RESOLVED_COMPOSITION_PROTOTYPE_CONTRACTS.flatMap((contract, contractIndex) =>
  Array.from({ length: 10 }, (_, seedOffset) => generateResolvedCompositionPrototypeQuestion(
    contract.prototypeId,
    1 + seedOffset + contractIndex * 1_000,
  )),
);

writeFileSync(
  resolve(outputDirectory, "cod-cp009-resolved-composition-review.jsonl"),
  `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`,
  "utf8",
);

const markdown: string[] = [
  "# COD-CP-009 — Resolved Component Composition Prototype Review",
  "",
  "Status: prototype review only; no permanent QLs and not publicly publishable.",
  "",
  `Questions: ${questions.length}`,
  "",
];

for (const contract of RESOLVED_COMPOSITION_PROTOTYPE_CONTRACTS) {
  markdown.push(`## ${contract.prototypeId}`, "");
  const matching = questions.filter((question) => question.prototypeId === contract.prototypeId);
  for (const question of matching) {
    markdown.push(
      `### Seed ${question.seed} — ${question.metadata.scenarioId}`,
      "",
      `- Direction: ${question.structuredPrompt.queryDirection}`,
      `- Difficulty: ${question.difficulty}`,
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
      "**Branch proofs:**",
      ...question.explanation.branchProofs.map((line) => `- ${line}`),
      "",
      `**Composition:** ${question.explanation.composition}`,
      `**Conclusion:** ${question.explanation.conclusion}`,
      `**Common Trap Alert:** ${question.explanation.commonTrapAlert}`,
      "",
    );
  }
}

writeFileSync(
  resolve(outputDirectory, "cod-cp009-resolved-composition-review.md"),
  `${markdown.join("\n")}\n`,
  "utf8",
);

const summary = {
  checkpoint: "COD-CP-009",
  maturity: "RESOLVED_COMPOSITION_QUESTION_PROTOTYPE",
  permanentQlsCreated: 0,
  questionCount: questions.length,
  contracts: Object.fromEntries(
    RESOLVED_COMPOSITION_PROTOTYPE_CONTRACTS.map((contract) => [
      contract.prototypeId,
      questions.filter((question) => question.prototypeId === contract.prototypeId).length,
    ]),
  ),
};
writeFileSync(resolve(outputDirectory, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ outputDirectory, ...summary }, null, 2));
