import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { listQuantV4Packages } from "../../../../../generation-engine";
import { INT_CP001_FINAL_QL_IDS, type IntCp001FinalQlId } from "./cp001-final-registry";
import { INT_CP001_APPROVED_INACTIVE_PROVIDER_V2 } from "./cp001-approved-inactive-release-provider-v2";
import { stableBigIntJson } from "./cp001-localization-foundation";
import {
  generateIntCp001ExplanationSanitizationQuestion,
  validateIntCp001SanitizedExplanation,
  type IntCp001ExplanationSanitizationLanguage,
  type IntCp001ExplanationSanitizationQuestion,
} from "./cp001-explanation-sanitization-runtime";

const LANGUAGES: readonly IntCp001ExplanationSanitizationLanguage[] = ["en", "hi", "pa"];
const SET_COUNT = 5;
const LABELS = ["A", "B", "C", "D"] as const;
const OUTPUT = join(process.cwd(), "dist", "quant-v4", "int-cp001-sanitized-review-pack");
const FILE_LABEL = { en: "english", hi: "hindi", pa: "punjabi" } as const;
const LANGUAGE_LABEL = { en: "English", hi: "Hindi", pa: "Punjabi" } as const;
const RELEASE = {
  en: "INT-CP-001-EN-v5",
  hi: "INT-CP-001-HI-v5",
  pa: "INT-CP-001-PA-v5",
} as const;
const RELEASE_STATUS = {
  en: "APPROVED — unchanged by this remediation",
  hi: "EXPLANATION-SANITIZATION CANDIDATE — pending human review",
  pa: "EXPLANATION-SANITIZATION CANDIDATE — pending human review",
} as const;

type Row = {
  language: IntCp001ExplanationSanitizationLanguage;
  releaseId: string;
  releaseStatus: string;
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
  explanation: IntCp001ExplanationSanitizationQuestion["explanation"];
  lifecycle: {
    maturity: string;
    reviewStatus: string;
    localeReviewStatus: string;
    questionBankStatus: string;
    testEligibility: string;
    publiclyPublishable: boolean;
    questionStudioDiscoverable: boolean;
  };
};

function fail(message: string): never {
  throw new Error(message);
}

function stemMarkdown(question: IntCp001ExplanationSanitizationQuestion): string {
  let rendered = question.stem;
  for (const span of [...question.stemPresentation.emphasisSpans].sort((a, b) => b.start - a.start)) {
    if (question.stem.slice(span.start, span.end) !== span.text) {
      fail(`${question.qlId}/${question.seed}: emphasis span drifted.`);
    }
    rendered = `${rendered.slice(0, span.start)}**${span.text}**${rendered.slice(span.end)}`;
  }
  return rendered;
}

function optionLines(options: readonly string[]): string[] {
  return options.map((option, index) => `${LABELS[index]}. ${option}`);
}

function explanationLines(row: Row): string[] {
  const value = row.explanation;
  return [
    `#### ${value.coreConcept.heading}`,
    "",
    value.coreConcept.narrative,
    "",
    value.coreConcept.displayMath,
    "",
    `#### ${value.stepByStep.heading}`,
    "",
    ...value.stepByStep.steps.flatMap((step, index) => [`${index + 1}. ${step}`, ""]),
    value.stepByStep.verification,
    "",
    value.stepByStep.conclusion,
    "",
    `#### ${value.examShortcut.heading}`,
    "",
    value.examShortcut.narrative,
    "",
    value.examShortcut.displayMath ?? "",
    "",
    `#### ${value.trapAnalysis.heading}`,
    "",
    ...value.trapAnalysis.items.map((trap) =>
      `- Option ${LABELS[trap.optionNumber - 1]} (${trap.optionText}): ${trap.explanation}`
    ),
  ].filter((line, index, all) => line !== "" || all[index - 1] !== "");
}

function learnerHeader(language: IntCp001ExplanationSanitizationLanguage, kind: string, count: number): string[] {
  return [
    `# INT-001 / CP-001 ${LANGUAGE_LABEL[language]} Clean ${kind}`,
    "",
    `Release: **${RELEASE[language]}**`,
    `Release status: **${RELEASE_STATUS[language]}**`,
    `Records: **${count}**`,
    "Delivery status: **INACTIVE, NOT REGISTERED, NOT STORED, NOT PUBLISHED**",
    "",
    "Internal QL IDs, seeds, solve-contract names and backend traces are intentionally excluded from this learner-shaped file.",
    "",
    "---",
  ];
}

function questionMarkdown(language: IntCp001ExplanationSanitizationLanguage, rows: readonly Row[]): string {
  const lines = learnerHeader(language, "Question Review Pack", rows.length);
  for (let setNumber = 1; setNumber <= SET_COUNT; setNumber += 1) {
    lines.push("", `## Review Set ${setNumber}`, "");
    for (const row of rows.filter((item) => item.setNumber === setNumber)) {
      lines.push(`### Q${row.questionNumber}`, "", `> ${row.stemMarkdown}`, "", ...optionLines(row.options), "", "---");
    }
  }
  return `${lines.join("\n")}\n`;
}

function answerMarkdown(language: IntCp001ExplanationSanitizationLanguage, rows: readonly Row[]): string {
  const lines = learnerHeader(language, "Answer and Explanation Pack", rows.length);
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
        `**Correct answer: ${LABELS[row.correctIndex]}. ${row.correctOption}**`,
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
  for (const token of ["<sub>Trace:", "seed large-review", "INT-QL-", "language question", "FIND_"]) {
    if (markdown.includes(token)) fail(`${label} leaked '${token}'.`);
  }
  const mathErrors = validateIntCp001SanitizedExplanation(markdown);
  if (mathErrors.length > 0) fail(`${label}: ${mathErrors.join(" | ")}`);
}

function csvEscape(value: unknown): string {
  const text = String(value ?? "");
  return /[",\n\r]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

mkdirSync(OUTPUT, { recursive: true });
if (INT_CP001_APPROVED_INACTIVE_PROVIDER_V2.enabled) fail("Inactive provider became enabled.");
if (INT_CP001_APPROVED_INACTIVE_PROVIDER_V2.registrationStatus !== "NOT_REGISTERED") fail("Provider became registered.");
if (INT_CP001_APPROVED_INACTIVE_PROVIDER_V2.questionStudioDiscoverable) fail("Provider became discoverable.");
if (listQuantV4Packages().some((item) => String(item.packageId) === "INT-001")) {
  fail("INT-001 is present in the central Question Studio registry.");
}

const rowsByLanguage = Object.fromEntries(LANGUAGES.map((language) => [language, []])) as Record<
  IntCp001ExplanationSanitizationLanguage,
  Row[]
>;
const parityGroups = new Map<string, Partial<Record<IntCp001ExplanationSanitizationLanguage, Row>>>();

for (const language of LANGUAGES) {
  const stems = new Set<string>();
  const qlCounts = new Map<string, number>();
  const positions = [0, 0, 0, 0];
  for (let setIndex = 0; setIndex < SET_COUNT; setIndex += 1) {
    for (let qlIndex = 0; qlIndex < INT_CP001_FINAL_QL_IDS.length; qlIndex += 1) {
      const qlId = INT_CP001_FINAL_QL_IDS[qlIndex]!;
      const setNumber = setIndex + 1;
      const seed = `large-review-v2:set-${setNumber}:${qlId}`;
      const question = generateIntCp001ExplanationSanitizationQuestion(qlId, seed, language);
      if (!question.validation.ok) fail(`${qlId}/${seed}/${language}: ${question.validation.errors.join(" | ")}`);
      if (question.releaseId !== RELEASE[language]) fail(`${qlId}/${seed}/${language}: wrong release.`);
      if (question.options.length !== 4 || new Set(question.options).size !== 4) fail(`${qlId}/${seed}/${language}: bad options.`);
      if (question.questionBankStatus !== "NOT_STORED" || question.testEligibility !== "INELIGIBLE") {
        fail(`${qlId}/${seed}/${language}: downstream lifecycle changed.`);
      }
      if (question.publiclyPublishable || question.questionStudioDiscoverable) {
        fail(`${qlId}/${seed}/${language}: became publishable or discoverable.`);
      }
      if (language !== "en") {
        const errors = validateIntCp001SanitizedExplanation(question.explanation);
        if (errors.length > 0) fail(`${qlId}/${seed}/${language}: ${errors.join(" | ")}`);
      }

      const row: Row = {
        language,
        releaseId: question.releaseId,
        releaseStatus: RELEASE_STATUS[language],
        setNumber,
        questionNumber: qlIndex + 1,
        languageQuestionNumber: (setIndex * INT_CP001_FINAL_QL_IDS.length) + qlIndex + 1,
        qlId,
        seed,
        solveContract: question.solveContract,
        stem: question.stem,
        stemMarkdown: stemMarkdown(question),
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
      stems.add(question.stem);
      qlCounts.set(qlId, (qlCounts.get(qlId) ?? 0) + 1);
      positions[question.correctIndex] += 1;
      const key = `${setNumber}:${qlId}`;
      parityGroups.set(key, { ...(parityGroups.get(key) ?? {}), [language]: row });
    }
  }
  const expected = INT_CP001_FINAL_QL_IDS.length * SET_COUNT;
  if (rowsByLanguage[language].length !== expected || stems.size !== expected) fail(`${language}: incomplete or duplicate corpus.`);
  if (INT_CP001_FINAL_QL_IDS.some((qlId) => qlCounts.get(qlId) !== SET_COUNT)) fail(`${language}: incomplete QL coverage.`);
  if (positions.some((count) => count === 0)) fail(`${language}: incomplete answer-position coverage.`);
}

let parityChecks = 0;
for (const [key, group] of parityGroups) {
  if (!group.en || !group.hi || !group.pa) fail(`${key}: incomplete parity group.`);
  for (const locale of ["hi", "pa"] as const) {
    if (stableBigIntJson(group[locale]!.optionResults) !== stableBigIntJson(group.en.optionResults)) {
      fail(`${key}/${locale}: option-value parity drifted.`);
    }
    if (group[locale]!.correctIndex !== group.en.correctIndex) fail(`${key}/${locale}: answer-index parity drifted.`);
    parityChecks += 1;
  }
}

const summaryLanguages: Record<string, unknown> = {};
for (const language of LANGUAGES) {
  const rows = rowsByLanguage[language];
  const questions = questionMarkdown(language, rows);
  const answers = answerMarkdown(language, rows);
  assertLearnerMarkdown(`${language} questions`, questions);
  assertLearnerMarkdown(`${language} answers`, answers);
  const prefix = `int-001-cp001-${FILE_LABEL[language]}-105`;
  writeFileSync(join(OUTPUT, `${prefix}-clean-questions.md`), questions, "utf8");
  writeFileSync(join(OUTPUT, `${prefix}-clean-answers-and-explanations.md`), answers, "utf8");
  writeFileSync(
    join(OUTPUT, `${prefix}-sanitized-review-data.json`),
    `${JSON.stringify({
      generatedAt: new Date().toISOString(),
      providerId: INT_CP001_APPROVED_INACTIVE_PROVIDER_V2.providerId,
      language,
      releaseId: RELEASE[language],
      releaseStatus: RELEASE_STATUS[language],
      rows,
    }, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2)}\n`,
    "utf8",
  );
  summaryLanguages[language] = {
    releaseId: RELEASE[language],
    releaseStatus: RELEASE_STATUS[language],
    questionCount: rows.length,
    distinctStems: new Set(rows.map((row) => row.stem)).size,
    answerPositions: [0, 1, 2, 3].map((index) => rows.filter((row) => row.correctIndex === index).length),
  };
}

const allRows = LANGUAGES.flatMap((language) => rowsByLanguage[language]);
if (allRows.length !== 315) fail(`Generated ${allRows.length}; expected 315.`);
const checklist = [[
  "language", "releaseId", "releaseStatus", "setNumber", "questionNumber", "languageQuestionNumber",
  "qlId", "seed", "solveContract", "stemVerdict", "optionVerdict", "explanationVerdict", "severity", "notes",
], ...allRows.map((row) => [
  row.language, row.releaseId, row.releaseStatus, row.setNumber, row.questionNumber, row.languageQuestionNumber,
  row.qlId, row.seed, row.solveContract, "", "", "", "", "",
])];
writeFileSync(
  join(OUTPUT, "int-001-cp001-315-sanitized-review-checklist.csv"),
  `${checklist.map((row) => row.map(csvEscape).join(",")).join("\n")}\n`,
  "utf8",
);

const summary = {
  generatedAt: new Date().toISOString(),
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
  join(OUTPUT, "int-001-cp001-315-sanitized-review-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP001_315_SANITIZED_REVIEW_EXPORT");
