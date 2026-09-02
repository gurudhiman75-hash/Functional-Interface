import {
  INT_CP008_PROTOTYPE_IDS,
  buildIntCp008DiscoveryPackage,
  displayIntCp008Rational,
} from "./cp008-instalment-discovery-v1";

function stateJson(value: unknown): string {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? current.toString() : current, 2);
}

const lines: string[] = [
  "# INT-CP-008 Wave 01 Discovery Review",
  "",
  "Status: temporary executable discovery only. No permanent QL is allocated.",
  "",
  "Ownership: one opening balance/fund with an explicitly ordered equal periodic cash-flow topology.",
  "Heterogeneous dated cash flows remain INT-CP-009.",
  "",
];

let reviewQuestions = 0;
for (const prototypeId of INT_CP008_PROTOTYPE_IDS) {
  lines.push(`## ${prototypeId}`, "");
  for (let sample = 0; sample < 3; sample += 1) {
    const question = buildIntCp008DiscoveryPackage(prototypeId, `int-cp008-wave01-review:${prototypeId}:${sample}`);
    reviewQuestions += 1;
    lines.push(
      `### Sample ${sample + 1}`,
      "",
      `- Difficulty: ${question.difficulty}`,
      `- Stem family: ${question.stemFamilyId}`,
      `- Answer semantic: ${question.answerSemantic}`,
      `- Correct option: ${question.correctIndex + 1}`,
      "",
      question.stem,
      "",
      ...question.options.map((option, index) => `${index + 1}. ${displayIntCp008Rational(option)}`),
      "",
      `**Answer:** ${displayIntCp008Rational(question.answer)}`,
      "",
      "<details><summary>Discovery mathematical state</summary>",
      "",
      "```json",
      stateJson(question.mathematicalState),
      "```",
      "",
      "</details>",
      "",
    );
  }
}

lines.push(
  "---",
  "",
  `Review questions: **${reviewQuestions}**`,
  `Temporary prototypes: **${INT_CP008_PROTOTYPE_IDS.length}**`,
  "Permanent QLs: **0**",
  "Next potential identity after approved merge/split only: **INT-QL-116**",
  "",
);

process.stdout.write(lines.join("\n"));
