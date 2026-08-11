import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { listQuantV4Packages } from "../../../../../generation-engine";
import { INT_CP001_FINAL_QL_IDS, type IntCp001FinalQlId } from "./cp001-final-registry";
import {
  generateIntCp001CalculationRichQuestion,
  type IntCp001CalculationRichLanguage,
  type IntCp001CalculationRichQuestion,
} from "./cp001-calculation-rich-explanation-runtime";
import { stableBigIntJson } from "./cp001-localization-foundation";

const LANGUAGES: readonly IntCp001CalculationRichLanguage[] = ["en", "hi", "pa"];
const SET_COUNT = 5;
const OUTPUT_DIRECTORY = join(process.cwd(), "dist", "quant-v4", "int-cp001-calculation-rich-review-pack");
const OPTION_LABELS = ["A", "B", "C", "D"] as const;

const LANGUAGE_LABELS: Record<IntCp001CalculationRichLanguage, string> = {
  en: "English",
  hi: "Hindi",
  pa: "Punjabi",
};
const FILE_LABELS: Record<IntCp001CalculationRichLanguage, string> = {
  en: "english",
  hi: "hindi",
  pa: "punjabi",
};
const EXPECTED_RELEASES: Record<IntCp001CalculationRichLanguage, string> = {
  en: "INT-CP-001-EN-v6",
  hi: "INT-CP-001-HI-v6",
  pa: "INT-CP-001-PA-v6",
};

interface ReviewRow {
  language: IntCp001CalculationRichLanguage;
  releaseId: string;
  setNumber: number;
  questionNumber: number;
  languageQuestionNumber: number;
  qlId: IntCp001FinalQlId;
  seed: string;
  solveContract: string;
  stem: string;
  stemMarkdown: string;
  options: string[];
  optionResults: unknown[];
  correctIndex: number;
  correctOption: string;
  explanation: IntCp001CalculationRichQuestion["explanation"];
  lifecycle: {
    maturity: string;
    reviewStatus: string;
    localeReviewStatus: string;
    questionBankStatus: string;
    testEligibility: string;
    publiclyPublishable: boolean;
    questionStudioDiscoverable: boolean;
  };
}

function fail(message: string): never {
  throw new Error(message);
}

function markdownStem(question: IntCp001CalculationRichQuestion): string {
  let rendered = question.stem;
  for (const span of [...question.stemPresentation.emphasisSpans].sort((a, b) => b.start - a.start)) {
    if (question.stem.slice(span.start, span.end) !== span.text) {
      fail(`${question.qlId}/${question.seed}: emphasis span drifted.`);
    }
    rendered = `${rendered.slice(0, span.start)}**${rendered.slice(span.start, span.end)}**${rendered.slice(span.end)}`;
  }
  return rendered;
}

function optionLines(options: readonly string[]): string[] {
  return options.map((option, index) => `${OPTION_LABELS[index]}. ${option}`);
}

function explanationLines(row: ReviewRow): string[] {
  const explanation = row.explanation;
  return [
    `#### ${explanation.coreConcept.heading}`,
    "",
    explanation.coreConcept.narrative,
    "",
    explanation.coreConcept.displayMath,
    "",
    `#### ${explanation.stepByStep.heading}`,
    "",
    ...explanation.stepByStep.steps.flatMap((step, index) => [`${index + 1}. ${step}`, ""]),
    explanation.stepByStep.verification,
    "",
    explanation.stepByStep.conclusion,
    "",
    `#### ${explanation.examShortcut.heading}`,
    "",
    explanation.examShortcut.narrative,
    "",
    explanation.examShortcut.displayMath ?? "",
    "",
    `#### ${explanation.trapAnalysis.heading}`,
    "",
    ...explanation.trapAnalysis.items.map((trap) =>
      `- Option ${OPTION_LABELS[trap.optionNumber - 1]} (${trap.optionText}): ${trap.explanation}`
    ),
  ].filter((line, index, values) => line !== "" || values[index - 1] !== "");
}

function questionMarkdown(language: IntCp001CalculationRichLanguage, rows: readonly ReviewRow[]): string {
  const lines: string[] = [
    `# INT-001 / CP-001 ${LANGUAGE_LABELS[language]} Calculation-Rich Question Review Pack`,
    "",
    `Candidate release: **${EXPECTED_RELEASES[language]}**`,
    `Questions: **${rows.length}**`,
    `Coverage: **21 question languages × ${SET_COUNT} sets**`,
    "Status: **MANUAL-REVIEW CANDIDATE — INACTIVE, NOT REGISTERED, NOT STORED, NOT PUBLISHED**",
    "",
    "This learner-shaped file contains no answers, internal QL identifiers, seeds or backend traces.",
    "",
    "---",
  ];
  for (let setNumber = 1; setNumber <= SET_COUNT; setNumber += 1) {
    lines.push("", `## Review Set ${setNumber}`, "");
    for (const row of rows.filter((item) => item.setNumber === setNumber)) {
      lines.push(
        `### Q${row.questionNumber}`,
        "",
        `> ${row.stemMarkdown}`,
        "",
        ...optionLines(row.options),
        "",
        "---",
      );
    }
  }
  return `${lines.join("\n")}\n`;
}

function answerMarkdown(language: IntCp001CalculationRichLanguage, rows: readonly ReviewRow[]): string {
  const lines: string[] = [
    `# INT-001 / CP-001 ${LANGUAGE_LABELS[language]} Calculation-Rich Answer and Explanation Pack`,
    "",
    `Candidate release: **${EXPECTED_RELEASES[language]}**`,
    `Answers: **${rows.length}**`,
    "",
    "Each solution shows the formula, actual numerical substitution and the intermediate arithmetic.",
    "",
    "---",
  ];
  for (let setNumber = 1; setNumber <= SET_COUNT; setNumber += 1) {
    lines.push("", `## Review Set ${setNumber}`, "");
    for (const row of rows.filter((item) => item.setNumber === setNumber)) {
      lines.push(
        `### Q${row.questionNumber}`,
        "",
        `> ${row.stemMarkdown}`,
        "",
        ...optionLines(row.options),
        "",
        `**Correct answer: ${OPTION_LABELS[row.correctIndex]}. ${row.correctOption}**`,
        "",
        ...explanationLines(row),
        "",
        "---",
      );
    }
  }
  return `${lines.join("\n")}\n`;
}

function assertLearnerMarkdown(label: string, markdown: string): void {
  for (const token of ["<sub>Trace:", "INT-QL-", "calculation-rich-v1:", "FIND_", "language question"]) {
    if (markdown.includes(token)) fail(`${label}: leaked internal token ${token}.`);
  }
}

function csvEscape(value: unknown): string {
  const text = String(value ?? "");
  return /[",\n\r]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

mkdirSync(OUTPUT_DIRECTORY, { recursive: true });
if (listQuantV4Packages().some((item) => String(item.packageId) === "INT-001")) {
  fail("INT-001 is present in the central Question Studio registry.");
}

const rowsByLanguage = Object.fromEntries(LANGUAGES.map((language) => [language, []])) as Record<
  IntCp001CalculationRichLanguage,
  ReviewRow[]
>;
const parityRows = new Map<string, Partial<Record<IntCp001CalculationRichLanguage, ReviewRow>>>();

for (const language of LANGUAGES) {
  const seenStems = new Set<string>();
  const qlCounts = new Map<string, number>();
  const answerPositions = [0, 0, 0, 0];
  for (let setIndex = 0; setIndex < SET_COUNT; setIndex += 1) {
    for (let qlIndex = 0; qlIndex < INT_CP001_FINAL_QL_IDS.length; qlIndex += 1) {
      const qlId = INT_CP001_FINAL_QL_IDS[qlIndex]!;
      const setNumber = setIndex + 1;
      const seed = `calculation-rich-review-v1:set-${setNumber}:${qlId}`;
      const question = generateIntCp001CalculationRichQuestion(qlId, seed, language);
      if (!question.validation.ok) fail(`${qlId}/${seed}/${language}: ${question.validation.errors.join(" | ")}`);
      if (question.releaseId !== EXPECTED_RELEASES[language]) fail(`${qlId}/${seed}/${language}: wrong release.`);
      if (question.explanation.stepByStep.steps.length < 4) fail(`${qlId}/${seed}/${language}: short solution.`);
      const row: ReviewRow = {
        language,
        releaseId: question.releaseId,
        setNumber,
        questionNumber: qlIndex + 1,
        languageQuestionNumber: setIndex * INT_CP001_FINAL_QL_IDS.length + qlIndex + 1,
        qlId,
        seed,
        solveContract: question.solveContract,
        stem: question.stem,
        stemMarkdown: markdownStem(question),
        options: [...question.options],
        optionResults: question.optionAudit.map((item) => item.result),
        correctIndex: question.correctIndex,
        correctOption: question.options[question.correctIndex]!,
        explanation: question.explanation,
        lifecycle: {
          maturity: question.maturity,
          reviewStatus: question.reviewStatus,
          localeReviewStatus: question.localeReviewStatus,
          questionBankStatus: question.questionBankStatus,
          testEligibility: question.testEligibility,
          publiclyPublishable: question.publiclyPublishable,
          questionStudioDiscoverable: question.questionStudioDiscoverable,
        },
      };
      rowsByLanguage[language].push(row);
      seenStems.add(question.stem);
      qlCounts.set(qlId, (qlCounts.get(qlId) ?? 0) + 1);
      answerPositions[question.correctIndex] += 1;
      const parityKey = `${setNumber}:${qlId}`;
      parityRows.set(parityKey, { ...(parityRows.get(parityKey) ?? {}), [language]: row });
    }
  }
  const expected = SET_COUNT * INT_CP001_FINAL_QL_IDS.length;
  if (rowsByLanguage[language].length !== expected || seenStems.size !== expected) {
    fail(`${language}: incomplete or duplicate review corpus.`);
  }
  for (const qlId of INT_CP001_FINAL_QL_IDS) {
    if (qlCounts.get(qlId) !== SET_COUNT) fail(`${language}/${qlId}: wrong sample count.`);
  }
  if (answerPositions.some((count) => count === 0)) fail(`${language}: incomplete answer-position coverage.`);
}

let parityChecks = 0;
for (const [key, group] of parityRows) {
  if (!group.en || !group.hi || !group.pa) fail(`${key}: incomplete parity group.`);
  for (const locale of ["hi", "pa"] as const) {
    if (stableBigIntJson(group[locale]!.optionResults) !== stableBigIntJson(group.en.optionResults)) {
      fail(`${key}/${locale}: option-value parity drifted.`);
    }
    if (group[locale]!.correctIndex !== group.en.correctIndex) fail(`${key}/${locale}: correct-index parity drifted.`);
    parityChecks += 1;
  }
}

const summaryLanguages: Record<string, unknown> = {};
for (const language of LANGUAGES) {
  const rows = rowsByLanguage[language];
  const fileLabel = FILE_LABELS[language];
  const questions = questionMarkdown(language, rows);
  const answers = answerMarkdown(language, rows);
  assertLearnerMarkdown(`${language} questions`, questions);
  assertLearnerMarkdown(`${language} answers`, answers);
  writeFileSync(join(OUTPUT_DIRECTORY, `int-001-cp001-${fileLabel}-105-calculation-rich-questions.md`), questions, "utf8");
  writeFileSync(join(OUTPUT_DIRECTORY, `int-001-cp001-${fileLabel}-105-calculation-rich-answers.md`), answers, "utf8");
  writeFileSync(
    join(OUTPUT_DIRECTORY, `int-001-cp001-${fileLabel}-105-calculation-rich-review-data.json`),
    `${JSON.stringify({ language, releaseId: EXPECTED_RELEASES[language], rows }, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2)}\n`,
    "utf8",
  );
  summaryLanguages[language] = {
    releaseId: EXPECTED_RELEASES[language],
    questionCount: rows.length,
    distinctStems: new Set(rows.map((row) => row.stem)).size,
    minimumWorkedSteps: Math.min(...rows.map((row) => row.explanation.stepByStep.steps.length)),
    totalWorkedSteps: rows.reduce((sum, row) => sum + row.explanation.stepByStep.steps.length, 0),
  };
}

const allRows = LANGUAGES.flatMap((language) => rowsByLanguage[language]);
const checklistHeader = [
  "language", "releaseId", "setNumber", "questionNumber", "languageQuestionNumber", "qlId", "seed", "solveContract",
  "formulaVerdict", "substitutionVerdict", "arithmeticVerdict", "languageVerdict", "issueSeverity", "reviewerNotes",
];
const checklistRows = allRows.map((row) => [
  row.language, row.releaseId, row.setNumber, row.questionNumber, row.languageQuestionNumber, row.qlId, row.seed,
  row.solveContract, "", "", "", "", "", "",
]);
writeFileSync(
  join(OUTPUT_DIRECTORY, "int-001-cp001-315-calculation-rich-review-checklist.csv"),
  `${[checklistHeader, ...checklistRows].map((row) => row.map(csvEscape).join(",")).join("\n")}\n`,
  "utf8",
);

const summary = {
  packageId: "INT-001",
  canonicalProblemId: "INT-CP-001",
  questionCount: allRows.length,
  setsPerLanguage: SET_COUNT,
  questionsPerSet: INT_CP001_FINAL_QL_IDS.length,
  languages: summaryLanguages,
  crossLanguageParityChecks: parityChecks,
  learnerMarkdownTraceCount: 0,
  enabled: false,
  registrationStatus: "NOT_REGISTERED",
  centralQuestionStudioRegistered: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
};
writeFileSync(
  join(OUTPUT_DIRECTORY, "int-001-cp001-315-calculation-rich-review-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP001_315_CALCULATION_RICH_REVIEW_EXPORT");
