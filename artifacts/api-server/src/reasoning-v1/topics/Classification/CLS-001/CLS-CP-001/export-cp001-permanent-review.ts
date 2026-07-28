import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { CLS_CP001_PERMANENT_CONTRACTS } from "./cp001-permanent-contracts";
import { generateClsCp001Question } from "./cp001-multilingual-runtime";
import type { ClsCp001Locale } from "./localization/cp001-language-pack";

const outputDir = path.resolve(process.cwd(), "dist/reasoning-v1/cls-001/cp001-permanent-review");
const locales: readonly ClsCp001Locale[] = ["en-IN", "hi-IN", "pa-IN"];

const rows = CLS_CP001_PERMANENT_CONTRACTS.flatMap((contract, contractIndex) =>
  locales.flatMap((locale, localeIndex) =>
    Array.from({ length: 16 }, (_, sampleIndex) => {
      const seed = contractIndex * 10_000 + localeIndex * 1_000 + sampleIndex * 17;
      return generateClsCp001Question(contract.qlId, locale, seed);
    }),
  ),
);

type ReviewLabels = {
  readonly question: string;
  readonly givenGroup: string;
  readonly options: string;
  readonly answer: string;
  readonly coreConcept: string;
  readonly solution: string;
  readonly shortcut: string;
  readonly trap: string;
};

function reviewLabels(locale: ClsCp001Locale): ReviewLabels {
  if (locale === "hi-IN") {
    return {
      question: "प्रश्न",
      givenGroup: "दिया गया समूह",
      options: "विकल्प",
      answer: "उत्तर",
      coreConcept: "📌 मुख्य बात",
      solution: "📝 हल",
      shortcut: "⚡ जल्दी तरीका",
      trap: "⚠️ ध्यान रखें",
    };
  }
  if (locale === "pa-IN") {
    return {
      question: "ਪ੍ਰਸ਼ਨ",
      givenGroup: "ਦਿੱਤਾ ਸਮੂਹ",
      options: "ਵਿਕਲਪ",
      answer: "ਜਵਾਬ",
      coreConcept: "📌 ਮੁੱਖ ਗੱਲ",
      solution: "📝 ਹੱਲ",
      shortcut: "⚡ ਤੇਜ਼ ਤਰੀਕਾ",
      trap: "⚠️ ਧਿਆਨ ਰੱਖੋ",
    };
  }
  return {
    question: "Question",
    givenGroup: "Given group",
    options: "Options",
    answer: "Answer",
    coreConcept: "📌 Core Concept",
    solution: "📝 Step-by-Step Solution",
    shortcut: "⚡ Exam Speed Shortcut",
    trap: "⚠️ Common Trap",
  };
}

function paragraphSection(title: string, lines: readonly string[]): string {
  return [`### ${title}`, "", lines.join(" ")].join("\n");
}

function numberedSection(title: string, lines: readonly string[]): string {
  return [
    `### ${title}`,
    "",
    ...lines.map((line, index) => `${index + 1}. ${line}`),
  ].join("\n");
}

function reviewerMetadata(question: (typeof rows)[number]): string {
  return [
    "<details>",
    "<summary>Reviewer metadata</summary>",
    "",
    `- Source control: ${question.metadata.sourcePrototypeId} / ${question.metadata.sourcePrototypeSeed}`,
    `- Solve contract: ${question.metadata.solveContractId}`,
    `- Task: ${question.task}`,
    `- Option count: ${question.options.length}`,
    `- Intended class: ${question.intendedClassLabel}`,
    `- Ambiguity result: ${question.ambiguityAudit.result}`,
    `- Difficulty score: ${question.difficultyFeatures.score}`,
    `- Difficulty features: \`${JSON.stringify(question.difficultyFeatures)}\``,
    "",
    "</details>",
  ].join("\n");
}

const markdown = [
  "# CLS-CP-001 Permanent Multilingual Review",
  "",
  `Questions: ${rows.length}`,
  `Permanent QLs: ${CLS_CP001_PERMANENT_CONTRACTS.length}`,
  `Locales: ${locales.join(", ")}`,
  "Lifecycle: review-only frozen runtime proof",
  "Question Studio: disabled",
  "Question Bank: disabled",
  "Test/publication eligibility: disabled",
  "",
  ...rows.flatMap((question, index) => {
    const labels = reviewLabels(question.metadata.locale);
    return [
      `## ${index + 1}. ${question.qlId} · ${question.metadata.locale} · ${question.difficulty}`,
      "",
      `**${labels.question}:** ${question.stem}`,
      question.givens.length > 0
        ? `\n**${labels.givenGroup}:** ${question.givens.join(", ")}`
        : "",
      "",
      `**${labels.options}:**`,
      "",
      ...question.options.map((option, optionIndex) =>
        `${String.fromCharCode(65 + optionIndex)}. ${option}`
      ),
      "",
      `**${labels.answer}:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`,
      "",
      paragraphSection(labels.coreConcept, question.explanation.coreRule),
      "",
      numberedSection(labels.solution, question.explanation.optionChecks),
      "",
      paragraphSection(labels.shortcut, question.explanation.examSpeedShortcut),
      "",
      paragraphSection(labels.trap, question.explanation.commonTraps),
      "",
      reviewerMetadata(question),
      "",
      "---",
      "",
    ];
  }),
].join("\n");

await mkdir(outputDir, { recursive: true });
await writeFile(
  path.join(outputDir, "cls-cp001-permanent-multilingual-review.json"),
  `${JSON.stringify(rows, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDir, "cls-cp001-permanent-multilingual-review.md"),
  `${markdown}\n`,
  "utf8",
);

console.log("CLS-CP-001 permanent multilingual review written.", {
  outputDir,
  questions: rows.length,
  qls: CLS_CP001_PERMANENT_CONTRACTS.length,
  locales,
  optionCounts: Object.fromEntries(
    [4, 5].map((count) => [count, rows.filter((question) => question.options.length === count).length]),
  ),
  tasks: Object.fromEntries(
    [...new Set(rows.map((question) => question.task))]
      .map((task) => [task, rows.filter((question) => question.task === task).length]),
  ),
});
