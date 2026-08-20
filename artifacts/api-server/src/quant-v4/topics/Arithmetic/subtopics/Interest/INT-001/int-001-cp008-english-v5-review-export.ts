import { generateIntCp008EnglishQuestion } from "./cp008-instalment-english-v5";
import { INT_CP008_QL_IDS } from "./cp008-instalment-runtime-v1-final";

const lines: string[] = [
  "# INT-CP-008 English V5 Review Pack",
  "",
  "Status: final English human-review candidate. Permanent QL identities are frozen; learner content is not frozen.",
  "",
  "V5 preserves V4 mathematics, options and explanations while repairing residual singular stem grammar, invalid ordinal wording and tiny-value finance contexts found in the second full manual review.",
  "",
];

let reviewQuestions = 0;
for (const qlId of INT_CP008_QL_IDS) {
  lines.push(`## ${qlId}`, "");
  const selected = new Map<string, ReturnType<typeof generateIntCp008EnglishQuestion>>();
  for (let index = 0; index < 800 && selected.size < 6; index += 1) {
    const seed = `int-cp008-en-v5-review:${qlId}:${index}`;
    const question = generateIntCp008EnglishQuestion(qlId, seed);
    if (!selected.has(question.presentation.stemFamilyId)) selected.set(question.presentation.stemFamilyId, question);
  }
  if (selected.size !== 6) throw new Error(`${qlId}: could not collect all six V5 stem families`);

  for (const question of [...selected.values()].sort((a, b) => a.presentation.stemFamilyId.localeCompare(b.presentation.stemFamilyId))) {
    reviewQuestions += 1;
    lines.push(
      `### ${question.presentation.stemFamilyId}`,
      "",
      `- Representation: ${question.presentation.representation}`,
      `- Context: ${question.presentation.contextClass}`,
      `- Correct option: ${question.correctIndex + 1}`,
      "",
      question.presentation.prompt,
      "",
      ...question.options.map((option, index) => `${index + 1}. ${option.text}`),
      "",
      `**Answer:** ${question.correctAnswer}`,
      "",
      `**Key idea:** ${question.explanation.keyIdea}`,
      "",
      "**Steps:**",
      ...question.explanation.steps.map((step, index) => `${index + 1}. ${step}`),
      "",
      `**Common mistake:** ${question.explanation.commonMistake}`,
      "",
    );
  }
}

lines.push(
  "---",
  "",
  `Review questions: **${reviewQuestions}**`,
  `Permanent QLs: **${INT_CP008_QL_IDS.length}**`,
  "Stem families per QL: **6**",
  "Learner content frozen: **false**",
  "Delivery authorized: **false**",
  "",
);

process.stdout.write(lines.join("\n"));
