import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { listQuantV4Packages } from "../../../../../generation-engine";
import {
  INT_CP001_FINAL_QL_IDS,
  type IntCp001FinalQlId,
} from "./cp001-final-registry";
import {
  generateIntCp001ApprovedInactiveEnvelope,
  INT_CP001_APPROVED_INACTIVE_PROVIDER_V2,
  type IntCp001ApprovedInactiveLanguage,
  type IntCp001ApprovedInactiveQuestion,
} from "./cp001-approved-inactive-release-provider-v2";

const LANGUAGES: readonly IntCp001ApprovedInactiveLanguage[] = ["en", "hi", "pa"];
const SET_COUNT = 5;
const OUTPUT_DIRECTORY = join(process.cwd(), "dist", "quant-v4", "int-cp001-large-review-pack");
const OPTION_LABELS = ["A", "B", "C", "D"] as const;

const LANGUAGE_LABELS: Record<IntCp001ApprovedInactiveLanguage, string> = {
  en: "English",
  hi: "Hindi",
  pa: "Punjabi",
};

const FILE_LABELS: Record<IntCp001ApprovedInactiveLanguage, string> = {
  en: "english",
  hi: "hindi",
  pa: "punjabi",
};

const EXPECTED_RELEASES: Record<IntCp001ApprovedInactiveLanguage, string> = {
  en: "INT-CP-001-EN-v5",
  hi: "INT-CP-001-HI-v4",
  pa: "INT-CP-001-PA-v4",
};

type ReviewRow = {
  language: IntCp001ApprovedInactiveLanguage;
  releaseId: string;
  setNumber: number;
  setQuestionNumber: number;
  languageQuestionNumber: number;
  qlId: IntCp001FinalQlId;
  seed: string;
  solveContract: string;
  stem: string;
  stemMarkdown: string;
  stemHtml: string;
  emphasisSpans: IntCp001ApprovedInactiveQuestion["stemPresentation"]["emphasisSpans"];
  options: string[];
  correctIndex: number;
  correctLabel: string;
  correctOption: string;
  difficulty: IntCp001ApprovedInactiveQuestion["difficulty"];
  explanation: IntCp001ApprovedInactiveQuestion["explanation"];
  distractorEditorialTrace: IntCp001ApprovedInactiveQuestion["distractorEditorialTrace"];
  readabilityEditorialTrace: IntCp001ApprovedInactiveQuestion["readabilityEditorialTrace"];
};

function fail(message: string): never {
  throw new Error(message);
}

function markdownStem(question: IntCp001ApprovedInactiveQuestion): string {
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

function validateQuestion(question: IntCp001ApprovedInactiveQuestion, language: IntCp001ApprovedInactiveLanguage): void {
  if (!question.validation.ok) fail(`${question.qlId}/${question.seed}/${language}: ${question.validation.errors.join(" | ")}`);
  if (question.releaseId !== EXPECTED_RELEASES[language]) fail(`${question.qlId}/${question.seed}/${language}: wrong release ${question.releaseId}.`);
  if (question.options.length !== 4) fail(`${question.qlId}/${question.seed}/${language}: expected four options.`);
  if (new Set(question.options).size !== 4) fail(`${question.qlId}/${question.seed}/${language}: duplicate options.`);
  if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex > 3) {
    fail(`${question.qlId}/${question.seed}/${language}: invalid correct index.`);
  }
  if (question.questionBankStatus !== "NOT_STORED") fail(`${question.qlId}/${question.seed}/${language}: Question Bank lock changed.`);
  if (question.testEligibility !== "INELIGIBLE") fail(`${question.qlId}/${question.seed}/${language}: test eligibility changed.`);
  if (question.publiclyPublishable) fail(`${question.qlId}/${question.seed}/${language}: question became publishable.`);
  if (question.questionStudioDiscoverable) fail(`${question.qlId}/${question.seed}/${language}: question became Question Studio discoverable.`);
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
    ...explanation.trapAnalysis.items.flatMap((trap) => [
      `- Option ${OPTION_LABELS[trap.optionNumber - 1]} (${trap.optionText}): ${trap.explanation}`,
    ]),
  ].filter((line, index, values) => line !== "" || values[index - 1] !== "");
}

function questionPackMarkdown(language: IntCp001ApprovedInactiveLanguage, rows: readonly ReviewRow[]): string {
  const lines: string[] = [
    `# INT-001 / CP-001 ${LANGUAGE_LABELS[language]} Large Question Review Pack`,
    "",
    `Approved release: **${EXPECTED_RELEASES[language]}**`,
    `Questions: **${rows.length}**`,
    `Coverage: **21 QLs × ${SET_COUNT} sets**`,
    "Status: **APPROVED CONTENT — INACTIVE, NOT REGISTERED, NOT PUBLISHED**",
    "",
    "This file intentionally contains no marked answers or explanations. Use the separate answer-and-explanation file after attempting or reviewing each set.",
    "",
    "---",
  ];

  for (let setNumber = 1; setNumber <= SET_COUNT; setNumber += 1) {
    lines.push("", `## Review Set ${setNumber}`, "");
    const setRows = rows.filter((row) => row.setNumber === setNumber);
    for (const row of setRows) {
      lines.push(
        `### Q${row.setQuestionNumber}. ${row.qlId}`,
        "",
        `> ${row.stemMarkdown}`,
        "",
        ...optionLines(row.options),
        "",
        `<sub>Trace: ${row.qlId} · seed ${row.seed}</sub>`,
        "",
        "---",
      );
    }
  }

  return `${lines.join("\n")}\n`;
}

function answerPackMarkdown(language: IntCp001ApprovedInactiveLanguage, rows: readonly ReviewRow[]): string {
  const lines: string[] = [
    `# INT-001 / CP-001 ${LANGUAGE_LABELS[language]} Answer and Explanation Pack`,
    "",
    `Approved release: **${EXPECTED_RELEASES[language]}**`,
    `Answers: **${rows.length}**`,
    "",
    "The numbering matches the separate question-only review pack.",
    "",
    "---",
  ];

  for (let setNumber = 1; setNumber <= SET_COUNT; setNumber += 1) {
    lines.push("", `## Review Set ${setNumber}`, "");
    const setRows = rows.filter((row) => row.setNumber === setNumber);
    for (const row of setRows) {
      lines.push(
        `### Q${row.setQuestionNumber}. ${row.qlId} — ${row.solveContract}`,
        "",
        `> ${row.stemMarkdown}`,
        "",
        ...optionLines(row.options),
        "",
        `**Correct answer: ${row.correctLabel}. ${row.correctOption}**`,
        "",
        ...explanationLines(row),
        "",
        `<sub>Trace: ${row.qlId} · seed ${row.seed} · language question ${row.languageQuestionNumber}</sub>`,
        "",
        "---",
      );
    }
  }

  return `${lines.join("\n")}\n`;
}

function csvEscape(value: unknown): string {
  const text = String(value ?? "");
  return /[",\n\r]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

mkdirSync(OUTPUT_DIRECTORY, { recursive: true });

if (INT_CP001_APPROVED_INACTIVE_PROVIDER_V2.enabled) fail("Inactive provider became enabled.");
if (INT_CP001_APPROVED_INACTIVE_PROVIDER_V2.registrationStatus !== "NOT_REGISTERED") fail("Inactive provider became registered.");
if (INT_CP001_APPROVED_INACTIVE_PROVIDER_V2.questionStudioDiscoverable) fail("Inactive provider became discoverable.");
if (listQuantV4Packages().some((item) => String(item.packageId) === "INT-001")) {
  fail("INT-001 is present in the central Question Studio registry.");
}

const allRows: ReviewRow[] = [];
const summaryLanguages: Record<string, unknown> = {};

for (const language of LANGUAGES) {
  const rows: ReviewRow[] = [];
  const seenStems = new Set<string>();
  const answerPositions = [0, 0, 0, 0];
  const qlCounts = new Map<string, number>();

  for (let setIndex = 0; setIndex < SET_COUNT; setIndex += 1) {
    for (let qlIndex = 0; qlIndex < INT_CP001_FINAL_QL_IDS.length; qlIndex += 1) {
      const qlId = INT_CP001_FINAL_QL_IDS[qlIndex]!;
      const setNumber = setIndex + 1;
      const seed = `large-review-v1:set-${setNumber}:${qlId}`;
      const envelope = generateIntCp001ApprovedInactiveEnvelope({ qlId, language, seed });
      const question = envelope.question;
      validateQuestion(question, language);
      const row: ReviewRow = {
        language,
        releaseId: question.releaseId,
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
        correctIndex: question.correctIndex,
        correctLabel: OPTION_LABELS[question.correctIndex],
        correctOption: question.options[question.correctIndex]!,
        difficulty: question.difficulty,
        explanation: question.explanation,
        distractorEditorialTrace: question.distractorEditorialTrace,
        readabilityEditorialTrace: question.readabilityEditorialTrace,
      };
      rows.push(row);
      allRows.push(row);
      seenStems.add(question.stem);
      answerPositions[question.correctIndex] += 1;
      qlCounts.set(qlId, (qlCounts.get(qlId) ?? 0) + 1);
    }
  }

  const expectedCount = INT_CP001_FINAL_QL_IDS.length * SET_COUNT;
  if (rows.length !== expectedCount) fail(`${language}: generated ${rows.length}; expected ${expectedCount}.`);
  if (seenStems.size !== expectedCount) fail(`${language}: only ${seenStems.size}/${expectedCount} stems are distinct.`);
  for (const qlId of INT_CP001_FINAL_QL_IDS) {
    if (qlCounts.get(qlId) !== SET_COUNT) fail(`${language}/${qlId}: expected ${SET_COUNT} samples.`);
  }
  if (answerPositions.some((count) => count === 0)) fail(`${language}: not all answer positions are represented.`);

  const fileLabel = FILE_LABELS[language];
  writeFileSync(
    join(OUTPUT_DIRECTORY, `int-001-cp001-${fileLabel}-105-questions.md`),
    questionPackMarkdown(language, rows),
    "utf8",
  );
  writeFileSync(
    join(OUTPUT_DIRECTORY, `int-001-cp001-${fileLabel}-105-answers-and-explanations.md`),
    answerPackMarkdown(language, rows),
    "utf8",
  );
  writeFileSync(
    join(OUTPUT_DIRECTORY, `int-001-cp001-${fileLabel}-105-review-data.json`),
    `${JSON.stringify({
      generatedAt: new Date().toISOString(),
      provider: INT_CP001_APPROVED_INACTIVE_PROVIDER_V2,
      language,
      releaseId: EXPECTED_RELEASES[language],
      setCount: SET_COUNT,
      qlCount: INT_CP001_FINAL_QL_IDS.length,
      questionCount: rows.length,
      rows,
    }, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2)}\n`,
    "utf8",
  );

  summaryLanguages[language] = {
    releaseId: EXPECTED_RELEASES[language],
    questionCount: rows.length,
    distinctStems: seenStems.size,
    qlCoverage: Object.fromEntries(qlCounts),
    answerPositions,
  };
}

if (allRows.length !== 315) fail(`Generated ${allRows.length}; expected 315 questions.`);

const checklistHeader = [
  "language", "releaseId", "setNumber", "questionNumber", "qlId", "seed",
  "stemVerdict", "optionVerdict", "explanationVerdict", "issueSeverity", "reviewerNotes",
];
const checklistRows = allRows.map((row) => [
  row.language,
  row.releaseId,
  row.setNumber,
  row.setQuestionNumber,
  row.qlId,
  row.seed,
  "",
  "",
  "",
  "",
  "",
]);
writeFileSync(
  join(OUTPUT_DIRECTORY, "int-001-cp001-315-question-review-checklist.csv"),
  `${[checklistHeader, ...checklistRows].map((row) => row.map(csvEscape).join(",")).join("\n")}\n`,
  "utf8",
);

const summary = {
  generatedAt: new Date().toISOString(),
  providerId: INT_CP001_APPROVED_INACTIVE_PROVIDER_V2.providerId,
  packageId: "INT-001",
  canonicalProblemId: "INT-CP-001",
  totalQuestions: allRows.length,
  languages: summaryLanguages,
  setsPerLanguage: SET_COUNT,
  questionsPerSet: INT_CP001_FINAL_QL_IDS.length,
  qlCount: INT_CP001_FINAL_QL_IDS.length,
  enabled: false,
  registrationStatus: "NOT_REGISTERED",
  centralQuestionStudioRegistered: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
};

writeFileSync(
  join(OUTPUT_DIRECTORY, "int-001-cp001-315-question-review-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  join(OUTPUT_DIRECTORY, "README.md"),
  [
    "# INT-001 / CP-001 Large Multilingual Review Pack",
    "",
    "- Total questions: **315**",
    "- English: **105**",
    "- Hindi: **105**",
    "- Punjabi: **105**",
    "- Structure: **5 sets × 21 QLs per language**",
    "- Approved releases: **EN-v5 / HI-v4 / PA-v4**",
    "- Question Studio registration: **NOT_REGISTERED**",
    "- Publication: **disabled**",
    "",
    "Each language has a question-only file, a separately numbered answer-and-explanation file, and machine-readable JSON. The CSV checklist can be used to record stem, option and explanation findings.",
    "",
  ].join("\n"),
  "utf8",
);

console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP001_315_QUESTION_REVIEW_EXPORT");
