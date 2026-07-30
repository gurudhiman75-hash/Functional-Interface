import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { listQuantV4Packages } from "../../../../../generation-engine";
import {
  INT_CP001_FINAL_QL_IDS,
  type IntCp001FinalQlId,
} from "./cp001-final-registry";
import {
  INT_CP001_APPROVED_INACTIVE_PROVIDER_V2,
} from "./cp001-approved-inactive-release-provider-v2";
import {
  generateIntCp001ExplanationSanitizationQuestion,
  validateIntCp001SanitizedExplanation,
  type IntCp001ExplanationSanitizationLanguage,
  type IntCp001ExplanationSanitizationQuestion,
} from "./cp001-explanation-sanitization-runtime";
import { stableBigIntJson } from "./cp001-localization-foundation";

const LANGUAGES: readonly IntCp001ExplanationSanitizationLanguage[] = ["en", "hi", "pa"];
const SET_COUNT = 5;
const OUTPUT_DIRECTORY = join(process.cwd(), "dist", "quant-v4", "int-cp001-sanitized-review-pack");
const OPTION_LABELS = ["A", "B", "C", "D"] as const;

const LANGUAGE_LABELS: Record<IntCp001ExplanationSanitizationLanguage, string> = {
  en: "English",
  hi: "Hindi",
  pa: "Punjabi",
};

const FILE_LABELS: Record<IntCp001ExplanationSanitizationLanguage, string> = {
  en: "english",
  hi: "hindi",
  pa: "punjabi",
};

const EXPECTED_RELEASES: Record<IntCp001ExplanationSanitizationLanguage, string> = {
  en: "INT-CP-001-EN-v5",
  hi: "INT-CP-001-HI-v5",
  pa: "INT-CP-001-PA-v5",
};

const RELEASE_STATUS: Record<IntCp001ExplanationSanitizationLanguage, string> = {
  en: "APPROVED — unchanged by this remediation",
  hi: "EXPLANATION-SANITIZATION CANDIDATE — pending human review",
  pa: "EXPLANATION-SANITIZATION CANDIDATE — pending human review",
};

type ReviewRow = {
  language: IntCp001ExplanationSanitizationLanguage;
  releaseId: string;
  releaseStatus: string;
  setNumber: number;
  setQuestionNumber: number;
  languageQuestionNumber: number;
  qlId: IntCp001FinalQlId;
  seed: string;
  solveContract: string;
  stem: string;
  stemMarkdown: string;
  stemHtml: string;
  emphasisSpans: IntCp001ExplanationSanitizationQuestion["stemPresentation"]["emphasisSpans"];
  options: string[];
  optionResults: unknown[];
  correctIndex: number;
  correctLabel: string;
  correctOption: string;
  difficulty: IntCp001ExplanationSanitizationQuestion["difficulty"];
  explanation: IntCp001ExplanationSanitizationQuestion["explanation"];
  validation: IntCp001ExplanationSanitizationQuestion["validation"];
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

function markdownStem(question: IntCp001ExplanationSanitizationQuestion): string {
  let rendered = question.stem;
  const spans = [...question.stemPresentation.emphasisSpans]
    .sort((left, right) => right.start - left.start);
  for (const span of spans) {
    if (question.stem.slice(span.start, span.end) !== span.text) {
      fail(`${question.qlId}/${question.seed}: emphasis span '${span.text}' drifted from the stem.`);
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

function questionPackMarkdown(
  language: IntCp001ExplanationSanitizationLanguage,
  rows: readonly ReviewRow[],
): string {
  const lines: string[] = [
    `# INT-001 / CP-001 ${LANGUAGE_LABELS[language]} Clean Question Review Pack`,
    "",
    `Release: **${EXPECTED_RELEASES[language]}**`,
    `Release status: **${RELEASE_STATUS[language]}**`,
    `Questions: **${rows.length}**`,
    `Coverage: **21 question languages × ${SET_COUNT} sets**`,
    "Delivery status: **INACTIVE, NOT REGISTERED, NOT STORED, NOT PUBLISHED**",
    "",
    "This learner-shaped file intentionally contains no marked answers, internal QL identifiers, seeds, solve-contract names or backend trace tags.",
    "",
    "---",
  ];

  for (let setNumber = 1; setNumber <= SET_COUNT; setNumber += 1) {
    lines.push("", `## Review Set ${setNumber}`, "");
    for (const row of rows.filter((item) => item.setNumber === setNumber)) {
      lines.push(
        `### Q${row.setQuestionNumber}`,
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

function answerPackMarkdown(
  language: IntCp001ExplanationSanitizationLanguage,
  rows: readonly ReviewRow[],
): string {
  const lines: string[] = [
    `# INT-001 / CP-001 ${LANGUAGE_LABELS[language]} Clean Answer and Explanation Pack`,
    "",
    `Release: **${EXPECTED_RELEASES[language]}**`,
    `Release status: **${RELEASE_STATUS[language]}**`,
    `Answers: **${rows.length}**`,
    "",
    "The numbering matches the separate clean question-only review pack. Internal generation metadata is available only in the companion review data and checklist.",
    "",
    "---",
  ];

  for (let setNumber = 1; setNumber <= SET_COUNT; setNumber += 1) {
    lines.push("", `## Review Set ${setNumber}`, "");
    for (const row of rows.filter((item) => item.setNumber === setNumber)) {
      lines.push(
        `### Q${row.setQuestionNumber}`,
        "",
        `> ${row.stemMarkdown}`,
        "",
        ...optionLines(row.options),
        "",
        `**Correct answer: ${row.correctLabel}. ${row.correctOption}**`,
        "",
        ...explanationLines(row),
        "",
        "---",
      );
    }
  }

  return `${lines.join("\n")}\n`;
}

function assertCleanLearnerMarkdown(label: string, markdown: string): void {
  const forbidden = [
    "<sub>Trace:",
    "seed large-review",
    "INT-QL-",
    "FIND_SIMPLE_INTEREST_FROM_PRT",
    "FIND_AMOUNT_FROM_PRT",
    "language question",
  ];
  for (const token of forbidden) {
    if (markdown.includes(token)) fail(`${label} leaked internal token '${token}'.`);
  }
  if (/\$\$[\s\S]*?₹[\s\S]*?\$\$|\$(?:\\.|[^$])*₹(?:\\.|[^$])*\$/u.test(markdown)) {
    fail(`${label} retains a currency symbol inside learner math.`);
  }
  const mathSegments = markdown.match(/\$\$[\s\S]*?\$\$|\$(?:\\.|[^$])*\$/gu) ?? [];
  const badRate = /(?:\d+(?:\.\d+)?|\\frac\{[-+]?\d+\}\{\d+\})\\%(?:\s*\\times)|(?:\\times\s*)(?:\d+(?:\.\d+)?|\\frac\{[-+]?\d+\}\{\d+\})\\%/u;
  if (mathSegments.some((segment) => badRate.test(segment))) {
    fail(`${label} retains a redundant numeric percent in a scaled substitution.`);
  }
}

function csvEscape(value: unknown): string {
  const text = String(value ?? "");
  return /[",\n\r]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

mkdirSync(OUTPUT_DIRECTORY, { recursive: true });

if (INT_CP001_APPROVED_INACTIVE_PROVIDER_V2.enabled) fail("Inactive provider became enabled.");
if (INT_CP001_APPROVED_INACTIVE_PROVIDER_V2.registrationStatus !== "NOT_REGISTERED") {
  fail("Inactive provider became registered.");
}
if (INT_CP001_APPROVED_INACTIVE_PROVIDER_V2.questionStudioDiscoverable) {
  fail("Inactive provider became discoverable.");
}
if (listQuantV4Packages().some((item) => String(item.packageId) === "INT-001")) {
  fail("INT-001 is present in the central Question Studio registry.");
}

const rowsByLanguage = Object.fromEntries(LANGUAGES.map((language) => [language, []])) as Record<
  IntCp001ExplanationSanitizationLanguage,
  ReviewRow[]
>;
const parityRows = new Map<string, Partial<Record<IntCp001ExplanationSanitizationLanguage, ReviewRow>>>();

for (const language of LANGUAGES) {
  const seenStems = new Set<string>();
  const qlCounts = new Map<string, number>();
  const answerPositions = [0, 0, 0, 0];

  for (let setIndex = 0; setIndex < SET_COUNT; setIndex += 1) {
    for (let qlIndex = 0; qlIndex < INT_CP001_FINAL_QL_IDS.length; qlIndex += 1) {
      const qlId = INT_CP001_FINAL_QL_IDS[qlIndex]!;
      const setNumber = setIndex + 1;
      const seed = `large-review-v2:set-${setNumber}:${qlId}`;
      const question = generateIntCp001ExplanationSanitizationQuestion(qlId, seed, language);
      if (!question.validation.ok) {
        fail(`${qlId}/${seed}/${language}: ${question.validation.errors.join(" | ")}`);
      }
      if (question.releaseId !== EXPECTED_RELEASES[language]) {
        fail(`${qlId}/${seed}/${language}: wrong release ${question.releaseId}.`);
      }
      if (question.options.length !== 4 || new Set(question.options).size !== 4) {
        fail(`${qlId}/${seed}/${language}: invalid option set.`);
      }
      if (question.questionBankStatus !== "NOT_STORED" || question.testEligibility !== "INELIGIBLE") {
        fail(`${qlId}/${seed}/${language}: downstream lifecycle changed.`);
      }
      if (question.publiclyPublishable || question.questionStudioDiscoverable) {
        fail(`${qlId}/${seed}/${language}: became publishable or discoverable.`);
      }
      if (language !== "en") {
        const sanitationErrors = validateIntCp001SanitizedExplanation(question.explanation);
        if (sanitationErrors.length > 0) fail(`${qlId}/${seed}/${language}: ${sanitationErrors.join(" | ")}`);
      }

      const row: ReviewRow = {
        language,
        releaseId: question.releaseId,
        releaseStatus: RELEASE_STATUS[language],
        setNumber,
        setQuestionNumber: qlIndex + 1,
        languageQuestionNumber: (setIndex * INT_CP001_FINAL_QL_IDS.length) + qlIndex + 1,
        qlId,
        seed,
        solveContract: question.solveContract,
        stem: question.stem,
        stemMarkdown: markdownStem(question),
        stemHtml: question.stemPresentation.richTextHtml,
        emphasisSpans: question.stemPresentation.emphasisSpans,
        options: [...question.options],
        optionResults: question.optionAudit.map((item) => item.result),
        correctIndex: question.correctIndex,
        correctLabel: OPTION_LABELS[question.correctIndex],
        correctOption: question.options[question.correctIndex]!,
        difficulty: question.difficulty,
        explanation: question.explanation,
        validation: question.validation,
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
      const key = `${setNumber}:${qlId}`;
      parityRows.set(key, { ...(parityRows.get(key) ?? {}), [language]: row });
    }
  }

  const expectedCount = INT_CP001_FINAL_QL_IDS.length * SET_COUNT;
  if (rowsByLanguage[language].length !== expectedCount) {
    fail(`${language}: generated ${rowsByLanguage[language].length}; expected ${expectedCount}.`);
  }
  if (seenStems.size !== expectedCount) fail(`${language}: only ${seenStems.size}/${expectedCount} stems are distinct.`);
  for (const qlId of INT_CP001_FINAL_QL_IDS) {
    if (qlCounts.get(qlId) !== SET_COUNT) fail(`${language}/${qlId}: expected ${SET_COUNT} samples.`);
  }
  if (answerPositions.some((count) => count === 0)) fail(`${language}: not all answer positions are represented.`);
}

let parityChecks = 0;
for (const [key, group] of parityRows) {
  if (!group.en || !group.hi || !group.pa) fail(`${key}: incomplete language group.`);
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
  const questionsMarkdown = questionPackMarkdown(language, rows);
  const answersMarkdown = answerPackMarkdown(language, rows);
  assertCleanLearnerMarkdown(`${language} question pack`, questionsMarkdown);
  assertCleanLearnerMarkdown(`${language} answer pack`, answersMarkdown);

  writeFileSync(
    join(OUTPUT_DIRECTORY, `int-001-cp001-${fileLabel}-105-clean-questions.md`),
    questionsMarkdown,
    "utf8",
  );
  writeFileSync(
    join(OUTPUT_DIRECTORY, `int-001-cp001-${fileLabel}-105-clean-answers-and-explanations.md`),
    answersMarkdown,
    "utf8",
  );
  writeFileSync(
    join(OUTPUT_DIRECTORY, `int-001-cp001-${fileLabel}-105-sanitized-review-data.json`),
    `${JSON.stringify({
      generatedAt: new Date().toISOString(),
      providerId: INT_CP001_APPROVED_INACTIVE_PROVIDER_V2.providerId,
      language,
      releaseId: EXPECTED_RELEASES[language],
      releaseStatus: RELEASE_STATUS[language],
      setCount: SET_COUNT,
      qlCount: INT_CP001_FINAL_QL_IDS.length,
      questionCount: rows.length,
      rows,
    }, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2)}\n`,
    "utf8",
  );

  summaryLanguages[language] = {
    releaseId: EXPECTED_RELEASES[language],
    releaseStatus: RELEASE_STATUS[language],
    questionCount: rows.length,
    distinctStems: new Set(rows.map((row) => row.stem)).size,
    answerPositions: [0, 1, 2, 3].map((index) => rows.filter((row) => row.correctIndex === index).length),
  };
}

const allRows = LANGUAGES.flatMap((language) => rowsByLanguage[language]);
if (allRows.length !== 315) fail(`Generated ${allRows.length}; expected 315.`);

const checklistHeader = [
  "language", "releaseId", "releaseStatus", "setNumber", "questionNumber", "languageQuestionNumber",
  "qlId", "seed", "solveContract", "stemVerdict", "optionVerdict", "explanationVerdict",
  "issueSeverity", "reviewerNotes",
];
const checklistRows = allRows.map((row) => [
  row.language,
  row.releaseId,
  row.releaseStatus,
  row.setNumber,
  row.setQuestionNumber,
  row.languageQuestionNumber,
  row.qlId,
  row.seed,
  row.solveContract,
  "",
  "",
  "",
  "",
  "",
]);
writeFileSync(
  join(OUTPUT_DIRECTORY, "int-001-cp001-315-sanitized-review-checklist.csv"),
  `${[checklistHeader, ...checklistRows].map((row) => row.map(csvEscape).join(",")).join("\n")}\n`,
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
  join(OUTPUT_DIRECTORY, "int-001-cp001-315-sanitized-review-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP001_315_SANITIZED_REVIEW_EXPORT");
