import {
  INT_CP008_LOCALIZED_LOCALES,
  generateIntCp008LocalizedReviewQuestion,
} from "./cp008-instalment-localized-v1";
import { INT_CP008_QL_IDS } from "./cp008-instalment-runtime-v1-final";

const lines: string[] = [
  "# INT-CP-008 Hindi/Punjabi V1 Review Pack",
  "",
  "Status: multilingual native review candidate. English V6 source is frozen; localized learner content is not frozen.",
  "",
  "This pack exports all six stem families for every permanent QL in both Hindi and Punjabi.",
  "",
];

let reviewQuestions = 0;
for (const qlId of INT_CP008_QL_IDS) {
  lines.push(`## ${qlId}`, "");
  for (const locale of INT_CP008_LOCALIZED_LOCALES) {
    lines.push(`### ${locale}`, "");
    const selected = new Map<string, ReturnType<typeof generateIntCp008LocalizedReviewQuestion>>();
    for (let index = 0; index < 1000 && selected.size < 6; index += 1) {
      const seed = `int-cp008-localized-v1-review:${qlId}:${index}`;
      const question = generateIntCp008LocalizedReviewQuestion(qlId, seed, locale);
      if (!selected.has(question.presentation.stemFamilyId)) selected.set(question.presentation.stemFamilyId, question);
    }
    if (selected.size !== 6) throw new Error(`${qlId}/${locale}: could not collect all six localized stem families`);

    for (const question of [...selected.values()].sort((a, b) => a.presentation.stemFamilyId.localeCompare(b.presentation.stemFamilyId))) {
      reviewQuestions += 1;
      lines.push(
        `#### ${question.presentation.stemFamilyId}`,
        "",
        `- Locale: ${locale}`,
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
}

if (reviewQuestions !== 108) throw new Error(`expected 108 localized review questions, got ${reviewQuestions}`);

lines.push(
  "---",
  "",
  `Review questions: **${reviewQuestions}**`,
  `Permanent QLs: **${INT_CP008_QL_IDS.length}**`,
  `Locales: **${INT_CP008_LOCALIZED_LOCALES.length}**`,
  "Stem families per QL per locale: **6**",
  "Source English content frozen: **true**",
  "Localized learner content frozen: **false**",
  "Delivery authorized: **false**",
  "",
);

process.stdout.write(lines.join("\n"));
