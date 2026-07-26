import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateExactAtomicPrototypeQuestion } from "./exact-atomic-generator";
import {
  EXACT_ATOMIC_PROTOTYPE_CONTRACTS,
  EXACT_ATOMIC_TOPOLOGIES,
} from "./prototype-contracts";

const outputDirectory = resolve(process.argv[2] ?? "cod-cp009-exact-atomic-review-output");
mkdirSync(outputDirectory, { recursive: true });

const questions = EXACT_ATOMIC_PROTOTYPE_CONTRACTS.flatMap((contract, contractIndex) =>
  EXACT_ATOMIC_TOPOLOGIES.flatMap((topologyKind, topologyIndex) =>
    Array.from({ length: 5 }, (_, seedOffset) => generateExactAtomicPrototypeQuestion(
      contract.prototypeId,
      1 + seedOffset + topologyIndex * 100 + contractIndex * 1_000,
      topologyKind,
    )),
  ),
);

writeFileSync(
  resolve(outputDirectory, "cod-cp009-exact-atomic-review.jsonl"),
  `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`,
  "utf8",
);

const markdown: string[] = [
  "# COD-CP-009 — Exact Atomic Question Prototype Review",
  "",
  "Status: prototype review only; no permanent QLs and not publicly publishable.",
  "",
  `Questions: ${questions.length}`,
  "",
];

for (const contract of EXACT_ATOMIC_PROTOTYPE_CONTRACTS) {
  markdown.push(`## ${contract.prototypeId}`, "");
  for (const topologyKind of EXACT_ATOMIC_TOPOLOGIES) {
    markdown.push(`### ${topologyKind}`, "");
    const matching = questions.filter((question) =>
      question.prototypeId === contract.prototypeId && question.topologyKind === topologyKind,
    );
    for (const question of matching) {
      markdown.push(
        `#### Seed ${question.seed} — ${question.metadata.scenarioId}`,
        "",
        `- Difficulty: ${question.difficulty}`,
        `- Answer type: ${question.answerType}`,
        `- Solution count: ${question.metadata.solutionCount}`,
        "",
        `**Stem:** ${question.stem}`,
        "",
        "| Statement | Message | Code words |",
        "|---|---|---|",
        ...[...question.structuredPrompt.rows]
          .sort((left, right) => left.rowId.localeCompare(right.rowId))
          .map((row) => `| ${row.rowId} | ${row.sentence} | ${row.displayedCode} |`),
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
}

writeFileSync(
  resolve(outputDirectory, "cod-cp009-exact-atomic-review.md"),
  `${markdown.join("\n")}\n`,
  "utf8",
);

const summary = {
  checkpoint: "COD-CP-009",
  maturity: "EXACT_ATOMIC_QUESTION_PROTOTYPE",
  permanentQlsCreated: 0,
  questionCount: questions.length,
  contracts: Object.fromEntries(
    EXACT_ATOMIC_PROTOTYPE_CONTRACTS.map((contract) => [
      contract.prototypeId,
      questions.filter((question) => question.prototypeId === contract.prototypeId).length,
    ]),
  ),
  topologies: Object.fromEntries(
    EXACT_ATOMIC_TOPOLOGIES.map((topology) => [
      topology,
      questions.filter((question) => question.topologyKind === topology).length,
    ]),
  ),
};
writeFileSync(resolve(outputDirectory, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ outputDirectory, ...summary }, null, 2));
