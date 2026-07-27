import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { POSSIBLE_IMPOSSIBLE_PROTOTYPE_CONTRACTS } from "./possible-impossible-contracts";
import { generatePossibleImpossiblePrototypeQuestion } from "./possible-impossible-generator";

const outputDirectory = resolve(process.argv[2] ?? "cod-cp009-possible-impossible-review-output");
mkdirSync(outputDirectory, { recursive: true });

const questions = POSSIBLE_IMPOSSIBLE_PROTOTYPE_CONTRACTS.flatMap((contract, contractIndex) =>
  contract.supportedTopologies.flatMap((topologyKind, topologyIndex) => {
    const count = contract.predicate === "POSSIBLE" ? 5 : 10;
    return Array.from({ length: count }, (_, seedOffset) => generatePossibleImpossiblePrototypeQuestion(
      contract.prototypeId,
      1 + seedOffset + topologyIndex * 100 + contractIndex * 1_000,
      topologyKind,
    ));
  }),
);

writeFileSync(
  resolve(outputDirectory, "cod-cp009-possible-impossible-review.jsonl"),
  `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`,
  "utf8",
);

const markdown: string[] = [
  "# COD-CP-009 — Possible and Impossible Question Prototype Review",
  "",
  "Status: prototype review only; no permanent QLs and not publicly publishable.",
  "",
  `Questions: ${questions.length}`,
  "",
];

for (const contract of POSSIBLE_IMPOSSIBLE_PROTOTYPE_CONTRACTS) {
  markdown.push(`## ${contract.prototypeId}`, "");
  for (const topologyKind of contract.supportedTopologies) {
    markdown.push(`### ${topologyKind}`, "");
    const matching = questions.filter((question) =>
      question.prototypeId === contract.prototypeId && question.topologyKind === topologyKind,
    );
    for (const question of matching) {
      markdown.push(
        `#### Seed ${question.seed} — ${question.metadata.scenarioId}`,
        "",
        `- Predicate: ${question.structuredPrompt.predicate}`,
        `- Direction: ${question.structuredPrompt.queryDirection}`,
        `- Difficulty: ${question.difficulty}`,
        `- Complete solutions: ${question.metadata.solutionCount}`,
        `- Target candidates: ${question.metadata.targetCandidateCount}`,
        "",
        `**Stem:** ${question.stem}`,
        "",
        "| Statement | Message | Code words |",
        "|---|---|---|",
        ...question.structuredPrompt.rows.map((row, index) => `| ${index + 1} | ${row.sentence} | ${row.displayedCode} |`),
        "",
        "**Options:**",
        ...question.options.map((option, index) =>
          `${index + 1}. ${option.value}${option.isCorrect ? " ✓" : ""} — witnesses: ${option.witnessCount}${option.errorLabel ? ` — ${option.errorLabel}` : ""}`,
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
        `**Witness / exclusion:** ${question.explanation.witnessOrExclusion}`,
        `**Conclusion:** ${question.explanation.conclusion}`,
        `**Common Trap Alert:** ${question.explanation.commonTrapAlert}`,
        "",
      );
    }
  }
}

writeFileSync(
  resolve(outputDirectory, "cod-cp009-possible-impossible-review.md"),
  `${markdown.join("\n")}\n`,
  "utf8",
);

const summary = {
  checkpoint: "COD-CP-009",
  maturity: "POSSIBLE_IMPOSSIBLE_QUESTION_PROTOTYPE",
  permanentQlsCreated: 0,
  questionCount: questions.length,
  contracts: Object.fromEntries(
    POSSIBLE_IMPOSSIBLE_PROTOTYPE_CONTRACTS.map((contract) => [
      contract.prototypeId,
      questions.filter((question) => question.prototypeId === contract.prototypeId).length,
    ]),
  ),
};
writeFileSync(resolve(outputDirectory, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ outputDirectory, ...summary }, null, 2));
