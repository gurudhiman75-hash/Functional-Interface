import fs from "node:fs";
import path from "node:path";

import {
  MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS,
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  generateMensurationStudioQuestionV1,
  type MensurationQuestionStudioQuestion,
} from "./mensuration-question-studio-runtime-v1";

export const MENSURATION_CHAPTER_WIDE_REALISM_AUDIT_V1_AUTHORITY =
  "MENSURATION-CHAPTER-WIDE-GAP-REALISM-AUDIT-V1" as const;

const SAMPLES_PER_PATTERN = 4;
const LABELS = ["A", "B", "C", "D"] as const;

type FindingSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
type FindingCategory =
  | "VALIDITY"
  | "DUPLICATION"
  | "EDITORIAL"
  | "NUMERICAL_REALISM"
  | "EXPLANATION"
  | "DISTRACTOR"
  | "DISTRIBUTION";

interface Finding {
  severity: FindingSeverity;
  category: FindingCategory;
  cpId: string;
  patternId: string;
  seed: string;
  code: string;
  note: string;
  stem: string;
}

interface AuditRecord {
  cpId: string;
  packageId: string;
  patternId: string;
  patternKind: string;
  qlId: string | null;
  patternTitle: string;
  solveMode: string;
  difficulty: string;
  seed: string;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  explanationSteps: string[];
  shortcut: string;
  traps: string[];
  misconceptionCount: number;
  validation: MensurationQuestionStudioQuestion["validation"];
}

function textOf(question: MensurationQuestionStudioQuestion) {
  return [
    question.stem,
    ...question.options,
    ...question.explanation.steps,
    question.explanation.shortcut,
    ...question.explanation.traps,
  ].join("\n");
}

function stemShape(stem: string) {
  return stem
    .toLowerCase()
    .replace(/\$[^$]+\$/g, "<math>")
    .replace(/\b\d+(?:\.\d+)?\b/g, "<n>")
    .replace(/\s+/g, " ")
    .trim();
}

function stateKey(question: MensurationQuestionStudioQuestion) {
  return [question.stem, ...question.options].join("\n");
}

function explanationKey(question: MensurationQuestionStudioQuestion) {
  return [
    ...question.explanation.steps,
    question.explanation.shortcut,
    ...question.explanation.traps,
  ].join("\n");
}

function countBy<T>(items: readonly T[], keyOf: (item: T) => string) {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyOf(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

function visibleInternalCode(text: string) {
  return /\b(?:MEN-(?:00[12]|CP|QL)|PROT-|TPL-|SM-|WAVE-|clusterId|sourceId|prototypeId|misconceptionId|integrationAuthority)\b/i.test(text);
}

function malformedTex(text: string) {
  if (text.includes("\\pih")) return true;
  if ((text.match(/\$/g) ?? []).length % 2 !== 0) return true;
  if (/\$\$/.test(text)) return true;
  return false;
}

function engineeringStemShorthand(stem: string) {
  return /(?:^|[,;:(]\s*)(?:R|r|h|l|L|b|a|A|V)\s*=/.test(stem) || /\b(?:side|radius|height|length|breadth|rate)\s*=\s*\d/i.test(stem);
}

function rawFractionPercent(text: string) {
  return /\b\d+\s*\/\s*\d+\s*%/.test(text);
}

function longDecimal(text: string) {
  return /\b\d+\.\d{3,}\b/.test(text);
}

function giantPlainNumber(text: string) {
  return /(?<![\d.])\d{7,}(?![\d.])/.test(text.replace(/\d{4}-\d{2}-\d{2}/g, ""));
}

function genericShortcut(shortcut: string) {
  return shortcut.trim() === "Use the governing mensuration relation and keep units consistent.";
}

function hasNumericWorking(question: MensurationQuestionStudioQuestion) {
  const body = question.explanation.steps.join(" ");
  const numericTokens = body.match(/\d+(?:\.\d+)?/g) ?? [];
  return numericTokens.length >= 2;
}

function answerNeedsUnit(question: MensurationQuestionStudioQuestion) {
  const stem = question.stem;
  const answer = question.answer;
  const looksRatioOrPercent = /ratio|percentage|percent|%|times|number of|how many|count/i.test(stem) || /[:%]/.test(answer);
  const stemHasMeasure = /\b(?:cm|mm|m|km)(?:\^?[23]|²|³)?\b|₹|rupees?|litres?|liters?/i.test(stem);
  const answerHasMeasure = /\b(?:cm|mm|m|km)(?:\^?[23]|²|³)?\b|₹|rupees?|litres?|liters?|[:%]/i.test(answer);
  return stemHasMeasure && !looksRatioOrPercent && !answerHasMeasure;
}

function recordFor(
  question: MensurationQuestionStudioQuestion,
  patternTitle: string,
): AuditRecord {
  return {
    cpId: question.cpId,
    packageId: question.packageId,
    patternId: question.patternId,
    patternKind: question.patternKind,
    qlId: question.qlId,
    patternTitle,
    solveMode: question.solveMode,
    difficulty: question.difficultyBand,
    seed: question.seed,
    stem: question.stem,
    options: question.options,
    correctIndex: question.correctIndex,
    answer: question.answer,
    explanationSteps: question.explanation.steps,
    shortcut: question.explanation.shortcut,
    traps: question.explanation.traps,
    misconceptionCount: question.optionDetails.filter((option) => option.misconceptionId !== null).length,
    validation: question.validation,
  };
}

const records: AuditRecord[] = [];
const questions: MensurationQuestionStudioQuestion[] = [];
const findings: Finding[] = [];

function addFinding(
  question: MensurationQuestionStudioQuestion,
  severity: FindingSeverity,
  category: FindingCategory,
  code: string,
  note: string,
) {
  findings.push({
    severity,
    category,
    cpId: question.cpId,
    patternId: question.patternId,
    seed: question.seed,
    code,
    note,
    stem: question.stem,
  });
}

for (const pattern of MENSURATION_QUESTION_STUDIO_PATTERNS) {
  for (let sampleIndex = 0; sampleIndex < SAMPLES_PER_PATTERN; sampleIndex += 1) {
    const seed = `mensuration-realism-v1:${pattern.cpId}:${pattern.patternId}:${sampleIndex}`;
    const question = generateMensurationStudioQuestionV1({ patternId: pattern.patternId, seed });
    questions.push(question);
    records.push(recordFor(question, pattern.title));

    if (!question.validation.valid) {
      addFinding(question, "CRITICAL", "VALIDITY", "INVALID_NORMALIZED_QUESTION", "Question Studio normalized validity failed.");
    }
    if (question.options.length !== 4 || new Set(question.options).size !== 4) {
      addFinding(question, "CRITICAL", "VALIDITY", "OPTION_CONTRACT", "Expected four distinct options.");
    }
    if (question.options[question.correctIndex] !== question.answer) {
      addFinding(question, "CRITICAL", "VALIDITY", "ANSWER_PARITY", "Answer does not match the indexed correct option.");
    }

    const visible = textOf(question);
    if (visibleInternalCode(visible)) {
      addFinding(question, "HIGH", "EDITORIAL", "INTERNAL_CODE_LEAK", "Learner-visible text appears to expose an internal Mensuration identifier.");
    }
    if (malformedTex(visible)) {
      addFinding(question, "HIGH", "EDITORIAL", "MALFORMED_TEX", "Learner-visible text has malformed or unbalanced TeX delimiters.");
    }
    if (engineeringStemShorthand(question.stem)) {
      addFinding(question, "MEDIUM", "EDITORIAL", "ENGINEERING_STEM_SHORTHAND", "Stem uses setter/probe-style assignment shorthand rather than normal exam prose.");
    }
    if (rawFractionPercent(visible)) {
      addFinding(question, "MEDIUM", "NUMERICAL_REALISM", "RAW_FRACTION_PERCENT", "Percentage is displayed as a raw fractional percentage.");
    }
    if (longDecimal(question.stem + " " + question.answer + " " + question.options.join(" "))) {
      addFinding(question, "LOW", "NUMERICAL_REALISM", "LONG_DECIMAL", "Question surface contains a decimal with three or more places; inspect whether this is exam-natural.");
    }
    if (giantPlainNumber(question.stem + " " + question.answer + " " + question.options.join(" "))) {
      addFinding(question, "LOW", "NUMERICAL_REALISM", "GIANT_PLAIN_NUMBER", "Question surface contains a 7+ digit plain number; inspect calculation burden/context realism.");
    }
    if (answerNeedsUnit(question)) {
      addFinding(question, "HIGH", "EDITORIAL", "ANSWER_UNIT_MISSING", "Stem uses measurement units but answer surface appears unitless.");
    }
    if (!hasNumericWorking(question)) {
      addFinding(question, "MEDIUM", "EXPLANATION", "NO_NUMERIC_WORKING", "Explanation does not visibly demonstrate at least two numerical quantities.");
    }
    if (genericShortcut(question.explanation.shortcut)) {
      addFinding(question, "LOW", "EXPLANATION", "GENERIC_SHORTCUT_FALLBACK", "Question Studio had to use the generic Mensuration shortcut fallback.");
    }
    if (question.explanation.steps.length < 2) {
      addFinding(question, "MEDIUM", "EXPLANATION", "THIN_EXPLANATION", "Explanation has fewer than two learner-facing steps.");
    }
    if (question.optionDetails.filter((option) => option.misconceptionId !== null).length === 0) {
      addFinding(question, "LOW", "DISTRACTOR", "NO_EXPLICIT_DISTRACTOR_SEMANTICS", "No normalized option exposes misconception provenance; manually inspect whether wrong options are plausible mistakes.");
    }
  }
}

const questionsByPattern = new Map<string, MensurationQuestionStudioQuestion[]>();
for (const question of questions) {
  const bucket = questionsByPattern.get(question.patternId) ?? [];
  bucket.push(question);
  questionsByPattern.set(question.patternId, bucket);
}

for (const [patternId, patternQuestions] of questionsByPattern) {
  const stateCount = new Set(patternQuestions.map(stateKey)).size;
  const stemCount = new Set(patternQuestions.map((question) => question.stem)).size;
  const explanationCount = new Set(patternQuestions.map(explanationKey)).size;
  const shapeCount = new Set(patternQuestions.map((question) => stemShape(question.stem))).size;
  const first = patternQuestions[0]!;
  if (stateCount < SAMPLES_PER_PATTERN) {
    addFinding(first, "HIGH", "DUPLICATION", "REPEATED_QUESTION_STATE", `${patternId} produced only ${stateCount}/${SAMPLES_PER_PATTERN} distinct stem+option states.`);
  }
  if (stemCount < Math.min(3, SAMPLES_PER_PATTERN)) {
    addFinding(first, "MEDIUM", "DUPLICATION", "LOW_STEM_DIVERSITY", `${patternId} produced only ${stemCount}/${SAMPLES_PER_PATTERN} distinct stems.`);
  }
  if (shapeCount === 1 && stemCount === 1) {
    addFinding(first, "LOW", "DUPLICATION", "SINGLE_STEM_SURFACE", `${patternId} exposes only one stem surface in this four-state audit.`);
  }
  if (explanationCount === 1) {
    addFinding(first, "MEDIUM", "EXPLANATION", "REPEATED_EXPLANATION", `${patternId} repeats the same explanation across all four generated states.`);
  }
}

const cpSummaries = MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS.map((cp) => {
  const cpRecords = records.filter((record) => record.cpId === cp.cpId);
  const cpFindings = findings.filter((finding) => finding.cpId === cp.cpId);
  const patternIds = [...new Set(cpRecords.map((record) => record.patternId))];
  const solveModes = [...new Set(cpRecords.map((record) => record.solveMode))];
  const difficultyCounts = countBy(cpRecords, (record) => record.difficulty);
  const answerPositionCounts = countBy(cpRecords, (record) => LABELS[record.correctIndex] ?? "?");
  const distinctStemCount = new Set(cpRecords.map((record) => record.stem)).size;
  const distinctStateCount = new Set(cpRecords.map((record) => [record.stem, ...record.options].join("\n"))).size;
  const explicitDistractorSemanticsCount = cpRecords.filter((record) => record.misconceptionCount > 0).length;
  const numericWorkingCount = cpRecords.filter((record) => (record.explanationSteps.join(" ").match(/\d+(?:\.\d+)?/g) ?? []).length >= 2).length;
  return {
    cpId: cp.cpId,
    title: cp.title,
    packageId: cp.packageId,
    patternCount: patternIds.length,
    qlCount: cp.qlCount,
    prototypeCount: cp.prototypeCount,
    sampledQuestionCount: cpRecords.length,
    solveModeCount: solveModes.length,
    solveModes,
    difficultyCounts,
    answerPositionCounts,
    distinctStemCount,
    distinctStateCount,
    explicitDistractorSemanticsCount,
    numericWorkingCount,
    findingCounts: countBy(cpFindings, (finding) => `${finding.severity}:${finding.code}`),
  };
});

const severityCounts = countBy(findings, (finding) => finding.severity);
const categoryCounts = countBy(findings, (finding) => finding.category);
const codeCounts = countBy(findings, (finding) => finding.code);
const difficultyCounts = countBy(records, (record) => record.difficulty);
const answerPositionCounts = countBy(records, (record) => LABELS[record.correctIndex] ?? "?");
const repeatedShapeCounts = countBy(records, (record) => `${record.cpId}:${stemShape(record.stem)}`);
const repeatedShapes = Object.entries(repeatedShapeCounts)
  .filter(([, count]) => count >= 8)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 40)
  .map(([shape, count]) => ({ shape, count }));

const structuralCriticalCount = findings.filter((finding) => finding.severity === "CRITICAL").length;
if (structuralCriticalCount > 0) {
  throw new Error(`Mensuration chapter-wide realism audit found ${structuralCriticalCount} critical structural findings.`);
}

const reviewSample: AuditRecord[] = [];
for (const cp of MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS) {
  const cpRecords = records.filter((record) => record.cpId === cp.cpId);
  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    const picked = cpRecords.find((record) => record.difficulty === difficulty && !reviewSample.some((row) => row.patternId === record.patternId));
    if (picked) reviewSample.push(picked);
  }
  for (const record of cpRecords) {
    if (reviewSample.filter((row) => row.cpId === cp.cpId).length >= 5) break;
    if (!reviewSample.some((row) => row.patternId === record.patternId)) reviewSample.push(record);
  }
}

const highMediumExamples = findings
  .filter((finding) => finding.severity === "HIGH" || finding.severity === "MEDIUM")
  .slice(0, 80);

const report = {
  authority: MENSURATION_CHAPTER_WIDE_REALISM_AUDIT_V1_AUTHORITY,
  generatedAt: new Date().toISOString(),
  scope: {
    canonicalProblems: MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS.length,
    patterns: MENSURATION_QUESTION_STUDIO_PATTERNS.length,
    samplesPerPattern: SAMPLES_PER_PATTERN,
    sampledQuestions: records.length,
  },
  global: {
    structuralCriticalCount,
    difficultyCounts,
    answerPositionCounts,
    distinctStemCount: new Set(records.map((record) => record.stem)).size,
    distinctStateCount: new Set(records.map((record) => [record.stem, ...record.options].join("\n"))).size,
    severityCounts,
    categoryCounts,
    codeCounts,
  },
  cpSummaries,
  repeatedShapes,
  highMediumExamples,
  findings,
  reviewSample,
  records,
};

function markdownQuestion(record: AuditRecord, index: number) {
  const options = record.options.map((option, optionIndex) => `${LABELS[optionIndex]}. ${option}`).join("\n");
  return [
    `### ${index + 1}. ${record.cpId} · ${record.patternId} · ${record.difficulty}`,
    "",
    record.stem,
    "",
    options,
    "",
    `**Answer:** ${LABELS[record.correctIndex]} — ${record.answer}`,
    "",
    "**Explanation**",
    ...record.explanationSteps.map((step, stepIndex) => `${stepIndex + 1}. ${step}`),
    "",
    record.shortcut ? `**Shortcut:** ${record.shortcut}` : "",
    record.traps.length ? `**Traps:** ${record.traps.join(" | ")}` : "",
    "",
  ].filter(Boolean).join("\n");
}

const md = [
  `# Mensuration Chapter-Wide Gap & Realism Audit V1 — Machine + Human Review Pack`,
  "",
  `Authority: \`${MENSURATION_CHAPTER_WIDE_REALISM_AUDIT_V1_AUTHORITY}\``,
  "",
  `- Canonical problems: **${report.scope.canonicalProblems}**`,
  `- Registered patterns: **${report.scope.patterns}**`,
  `- Samples per pattern: **${report.scope.samplesPerPattern}**`,
  `- Generated questions: **${report.scope.sampledQuestions}**`,
  `- Critical structural findings: **${structuralCriticalCount}**`,
  `- Distinct stems: **${report.global.distinctStemCount}**`,
  `- Distinct stem+option states: **${report.global.distinctStateCount}**`,
  "",
  "## CP summary",
  "",
  "| CP | Patterns | QLs | Prototypes | Samples | Easy | Medium | Hard | Numeric-working | Misconception-tagged |",
  "|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|",
  ...cpSummaries.map((row) => `| ${row.cpId} | ${row.patternCount} | ${row.qlCount} | ${row.prototypeCount} | ${row.sampledQuestionCount} | ${row.difficultyCounts.Easy ?? 0} | ${row.difficultyCounts.Medium ?? 0} | ${row.difficultyCounts.Hard ?? 0} | ${row.numericWorkingCount} | ${row.explicitDistractorSemanticsCount} |`),
  "",
  "## Finding counts",
  "",
  ...Object.entries(codeCounts).sort((a, b) => b[1] - a[1]).map(([code, count]) => `- ${code}: ${count}`),
  "",
  "## Stratified human-review sample",
  "",
  ...reviewSample.map(markdownQuestion),
].join("\n");

const outDir = path.resolve(process.cwd(), "dist/quant-v4");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "mensuration-chapter-wide-realism-audit-v1.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outDir, "mensuration-chapter-wide-realism-audit-v1.md"), md);

console.log(JSON.stringify({
  authority: report.authority,
  scope: report.scope,
  global: report.global,
  cpSummaries: cpSummaries.map((row) => ({
    cpId: row.cpId,
    patternCount: row.patternCount,
    solveModeCount: row.solveModeCount,
    difficultyCounts: row.difficultyCounts,
    answerPositionCounts: row.answerPositionCounts,
    distinctStemCount: row.distinctStemCount,
    distinctStateCount: row.distinctStateCount,
    numericWorkingCount: row.numericWorkingCount,
    explicitDistractorSemanticsCount: row.explicitDistractorSemanticsCount,
    findingCounts: row.findingCounts,
  })),
  topFindingCodes: Object.entries(codeCounts).sort((a, b) => b[1] - a[1]).slice(0, 20),
  highMediumExamples: highMediumExamples.slice(0, 30),
}, null, 2));
