import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  generateQuestion,
  QUANT_V4_PERCENTAGE_ALL_PATTERN_ID,
  type QuantV4PackageId,
} from "../../../../generation-engine";
import {
  createQuestionExport,
  type QuestionStudioExportItem,
} from "../../../../../../../examtree/src/lib/export-engine";

type AuditSample = {
  questionNo: number;
  stem: string;
  answer?: string;
  explanation?: string;
  options?: string[];
};

type AuditResult = {
  questionCount: number;
  weakOptionCount: number;
  plusMinusOneOptionCount: number;
  mathJaxSuffixCount: number;
  duplicateNormalizedOptionQuestionCount: number;
  invalidCorrectIndexCount: number;
  nonUniqueCorrectOptionCount: number;
  missingOptionsCount: number;
  runtimePlaceholderCount: number;
  boundedPercentageOver100Count: number;
  impossibleDiscountOverBaseCount: number;
  grammarIssueCount: number;
  doublePeriodCount: number;
  countNounDecimalAnswerCount: number;
  silentRoundingCount: number;
  repeatedCalculationLineCount: number;
  missingRepeatedReductionStepCount: number;
  semanticLabelMismatchCount: number;
  validationWarningLeakCount: number;
  metadataLanguageMismatchCount: number;
  duplicateStemGroupCount: number;
  duplicateStemQuestionCount: number;
  samples: {
    boundedPercentageOver100: AuditSample[];
    impossibleDiscountOverBase: AuditSample[];
    grammar: AuditSample[];
    doublePeriod: AuditSample[];
    countNounDecimalAnswer: AuditSample[];
    silentRounding: AuditSample[];
    repeatedCalculationLine: AuditSample[];
    missingRepeatedReductionStep: AuditSample[];
    semanticLabelMismatch: AuditSample[];
    validationWarningLeak: AuditSample[];
    metadataLanguageMismatch: AuditSample[];
    duplicateStem: AuditSample[];
  };
};

const PACKAGE_IDS: readonly QuantV4PackageId[] = [
  "PCT-001",
  "PCT-002",
  "PCT-003",
  "PCT-004",
  "PCT-005",
  "PCT-006",
  "PCT-007",
];

const BAD_GRAMMAR_PATTERNS = [
  /\bproduction production\b/i,
  /(^|\n)salary [A-Z]\b/,
  /(^|\n)production [A-Z]\b/,
  /\bthere are \d+ population\b/i,
  /\bA investment\b/,
  /\ba investment\b/,
  /\bA output\b/,
  /\ba output\b/,
  /\bA train has \d+ students\b/i,
  /\bThe whole (students|employees|passengers|respondents|applicants|users|people|items|units|voters|patients|books|forms|accounts|invoices|seats|bags|boxes|cartons|residents) corresponds\b/i,
  /\bthe total (students|employees|passengers|respondents|applicants|users|people|items|units|voters|patients|books|forms|accounts|invoices|seats|bags|boxes|cartons|residents) is\b/i,
  /\b(students|employees|passengers|respondents|applicants|users|people|items|units|voters|patients|books|forms|accounts|invoices|seats|bags|boxes|cartons|residents) represents\b/i,
  /(?<!number of )\binternet users is\b/i,
  /\bextra internet users is needed\b/i,
  /\bemployees was\b/i,
  /\bstudents was\b/i,
  /\bfinal residents is\b/i,
  /\bthe units becomes\b/i,
  /\bSchool An attendance\b/i,
  /\bA Product A\b/,
  /\bA Warehouse A\b/,
  /\bbooking booking\b/i,
] as const;

const NORMAL_EXPORT_WARNING_PATTERNS = [
  /Missing required/i,
  /Missing translation/i,
  /Translation leakage/i,
  /Broken Unicode/i,
  /Duplicate entities found/i,
] as const;

const COUNT_CONTEXT_PATTERN =
  /\bpeople|students|passengers|workers|employees|items|cartons|books|residents|units|applicants|boxes|voters|accounts|households|bags|visitors|users\b/i;

function normalizeOption(value: string) {
  return value
    .replace(/\$\$/g, "")
    .replace(/\\%/g, "%")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function normalizeStem(value: string) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueByNormalized(values: readonly string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    const normalized = normalizeOption(value);
    if (seen.has(normalized)) {
      duplicates.add(normalized);
      continue;
    }
    seen.add(normalized);
  }
  return duplicates.size;
}

function extractPercentValues(text: string) {
  return Array.from(text.matchAll(/(-?\d+(?:\.\d+)?)\s*\\?%/g)).map((match) =>
    Number(match[1]),
  );
}

function extractAnswerNumber(text: string) {
  const match = text.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function isBoundedPercentageQuestion(stem: string) {
  const normalized = stem.toLowerCase();
  if (
    normalized.includes("more than")
    || normalized.includes("less than")
    || normalized.includes("above")
    || normalized.includes("below")
    || normalized.includes("required percentage increase")
    || normalized.includes("required percentage decrease")
    || normalized.includes("required increase")
    || normalized.includes("required decrease")
  ) {
    return false;
  }

  return (
    /\brevised percentage|new percentage|updated percentage|revised share|new share|updated share|share|ratio|out of|rest|remaining percentage|missing percentage|other expenses|other responses|girls|boys|children|valid|invalid|vacant|solute|solvent|water|milk|sugar|copper|zinc|rent|food|transport|component\b/i.test(
      stem,
    )
    || /\bwhat percent of the same total\b/i.test(stem)
  );
}

function isCountContext(stem: string, answer: string) {
  return COUNT_CONTEXT_PATTERN.test(stem) || COUNT_CONTEXT_PATTERN.test(answer);
}

function hasSilentRounding(stem: string, answer: string, explanation: string) {
  if (!isCountContext(stem, answer) || /\bnearest|approx|approximately|rounded\b/i.test(stem)) {
    return false;
  }

  const answerNumber = extractAnswerNumber(answer);
  if (answerNumber === null || !Number.isInteger(answerNumber)) {
    return false;
  }

  const decimalMatches = Array.from(explanation.matchAll(/\b\d+\.\d+\b/g)).map((match) =>
    Number(match[0]),
  );
  return decimalMatches.some((value) => Math.round(value) === answerNumber && Math.abs(value - answerNumber) > 1e-9);
}

function explanationHasRepeatedCalculation(explanation: string) {
  const helperPercentLinePattern =
    /^\$\$(?:100\\\\?%[+-]\d+(?:\.\d+)?\\\\?%=\d+(?:\.\d+)?\\\\?%|\d+(?:\.\d+)?\\\\?%=\\frac\{[^}]+\}\{[^}]+\})\$\$$/;
  const normalizedLines = explanation
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && /[=\\]/.test(line))
    .filter((line) => /\\times|\\frac|\\div|\\left\||\d+\s*[+\-]\s*\d+/.test(line))
    .filter((line) => !helperPercentLinePattern.test(line))
    .map((line) => line.replace(/\s+/g, " "));
  const seen = new Set<string>();
  for (const line of normalizedLines) {
    if (seen.has(line)) {
      return true;
    }
    seen.add(line);
  }
  return false;
}

function isRepeatedReductionStem(stem: string) {
  const normalized = stem.toLowerCase();
  const matches = normalized.match(/\b(decrease|decreased|reduced|reduction|fell|falls|fall|down)\b/g) ?? [];
  if (matches.length < 2) {
    return false;
  }

  if (
    /\b(net decrease|decreased in all|new share|revised share|new percentage|revised percentage|difference between|before the decrease|reduction only|required percentage|by what percent)\b/.test(
      normalized,
    )
  ) {
    return false;
  }

  return /\b(find|what|determine)\b/.test(normalized)
    && /\b(final|remaining|closing|left|new|revised)\b/.test(normalized);
}

function missingRepeatedReductionStep(explanation: string) {
  return !/\bAfter the first reduction\b/i.test(explanation)
    && !/\bAfter first reduction\b/i.test(explanation)
    && !/\bAfter first decrease\b/i.test(explanation)
    && !/\bAfter the first decrease\b/i.test(explanation)
    && !/\bAfter first stage\b/i.test(explanation)
    && !/\bApply the first-stage multiplier\b/i.test(explanation);
}

function baseAmountFromStem(stem: string) {
  const match = stem.match(/Rs\.\s*(\d+(?:\.\d+)?)/i) ?? stem.match(/\b(\d+(?:\.\d+)?)\b/);
  return match ? Number(match[1]) : null;
}

function extractFinalExplanationLabel(explanation: string) {
  const labels = Array.from(
    String(explanation ?? "").matchAll(/\\text\{([^}]+)\}\s*=/g),
  ).map((match) => String(match[1] ?? "").trim());
  return labels.length ? labels[labels.length - 1] : null;
}

function hasSemanticLabelMismatch(stem: string, explanation: string) {
  const label = extractFinalExplanationLabel(explanation)?.toLowerCase();
  if (!label) {
    return false;
  }

  const normalizedStem = stem.toLowerCase();
  const countLabels = new Set([
    "students",
    "girls",
    "boys",
    "children",
    "passengers",
    "employees",
    "residents",
    "users",
    "applicants",
    "voters",
    "books",
    "items",
    "units",
    "boxes",
    "cartons",
    "bags",
    "patients",
    "respondents",
  ]);

  if (
    /\busage\b|\bbudget\b|\bpayroll\b|\bincome\b|\bsalary\b|\bbill\b|\bcollection\b|\bexpense\b|\bexpenses\b|\brainfall\b|\bfee\b|\bvalue\b|\bamount\b/.test(
      normalizedStem,
    )
    && countLabels.has(label)
  ) {
    return true;
  }

  if (label === "students" && !/\bstudent|enrolment\b/.test(normalizedStem)) {
    return true;
  }

  return false;
}

function toSample(
  questionNo: number,
  stem: string,
  answer: string,
  explanation: string,
  options: readonly string[],
): AuditSample {
  return {
    questionNo,
    stem,
    answer,
    explanation,
    options: [...options],
  };
}

function auditItems(items: readonly QuestionStudioExportItem[]): AuditResult {
  const result: AuditResult = {
    questionCount: items.length,
    weakOptionCount: 0,
    plusMinusOneOptionCount: 0,
    mathJaxSuffixCount: 0,
    duplicateNormalizedOptionQuestionCount: 0,
    invalidCorrectIndexCount: 0,
    nonUniqueCorrectOptionCount: 0,
    missingOptionsCount: 0,
    runtimePlaceholderCount: 0,
    boundedPercentageOver100Count: 0,
    impossibleDiscountOverBaseCount: 0,
    grammarIssueCount: 0,
    doublePeriodCount: 0,
    countNounDecimalAnswerCount: 0,
    silentRoundingCount: 0,
    repeatedCalculationLineCount: 0,
    missingRepeatedReductionStepCount: 0,
    semanticLabelMismatchCount: 0,
    validationWarningLeakCount: 0,
    metadataLanguageMismatchCount: 0,
    duplicateStemGroupCount: 0,
    duplicateStemQuestionCount: 0,
    samples: {
      boundedPercentageOver100: [],
      impossibleDiscountOverBase: [],
      grammar: [],
      doublePeriod: [],
      countNounDecimalAnswer: [],
      silentRounding: [],
      repeatedCalculationLine: [],
      missingRepeatedReductionStep: [],
      semanticLabelMismatch: [],
      validationWarningLeak: [],
      metadataLanguageMismatch: [],
      duplicateStem: [],
    },
  };

  items.forEach((item, index) => {
    const questionNo = index + 1;
    const stem = String(item.text ?? "");
    const explanation = String(item.explanation ?? "");
    const options = Array.isArray(item.options)
      ? item.options.map((option) => String(option ?? ""))
      : [];
    const correct = typeof item.correct === "number" ? item.correct : null;
    const answer = String(item.answer ?? (correct !== null && options[correct] ? options[correct] : ""));
    const textBlob = [stem, explanation, answer, ...options].join("\n");

    if (!options.length) {
      result.missingOptionsCount += 1;
    }

    if (correct === null || correct < 0 || correct >= options.length) {
      result.invalidCorrectIndexCount += 1;
    }

    if (uniqueByNormalized(options) > 0) {
      result.duplicateNormalizedOptionQuestionCount += 1;
    }

    if (correct !== null && options.length) {
      const normalizedCorrect = normalizeOption(options[correct] ?? "");
      const sameAsCorrect = options.filter((option) => normalizeOption(option) === normalizedCorrect).length;
      if (sameAsCorrect > 1) {
        result.nonUniqueCorrectOptionCount += 1;
      }
    }

    if (options.some((option) => /(?:\+\s*1|-\s*1)\s*$/.test(option))) {
      result.plusMinusOneOptionCount += 1;
      result.weakOptionCount += 1;
    }

    if (options.some((option) => /\$\$.*\$\$\s*\d+\s*$/.test(option))) {
      result.mathJaxSuffixCount += 1;
      result.weakOptionCount += 1;
    }

    if (/\b(?:undefined|null|nan)\b/i.test(textBlob)) {
      result.runtimePlaceholderCount += 1;
    }

    if (BAD_GRAMMAR_PATTERNS.some((pattern) => pattern.test(textBlob))) {
      result.grammarIssueCount += 1;
      if (result.samples.grammar.length < 5) {
        result.samples.grammar.push(toSample(questionNo, stem, answer, explanation, options));
      }
    }

    if (/\.\./.test(textBlob)) {
      result.doublePeriodCount += 1;
      if (result.samples.doublePeriod.length < 5) {
        result.samples.doublePeriod.push(toSample(questionNo, stem, answer, explanation, options));
      }
    }

    if (isBoundedPercentageQuestion(stem)) {
      const outOfRangeOptions = options.some((option) =>
        extractPercentValues(option).some((value) => value < 0 || value > 100),
      );
      if (outOfRangeOptions) {
        result.boundedPercentageOver100Count += 1;
        if (result.samples.boundedPercentageOver100.length < 5) {
          result.samples.boundedPercentageOver100.push(toSample(questionNo, stem, answer, explanation, options));
        }
      }
    }

    if (/\b(discount amount|reduction amount|amount of discount)\b/i.test(stem) && /\bmarked price|bill|price\b/i.test(stem)) {
      const baseAmount = baseAmountFromStem(stem);
      const optionValues = options.map(extractAnswerNumber).filter((value): value is number => value !== null);
      if (baseAmount !== null && optionValues.some((value) => value >= baseAmount)) {
        result.impossibleDiscountOverBaseCount += 1;
        if (result.samples.impossibleDiscountOverBase.length < 5) {
          result.samples.impossibleDiscountOverBase.push(toSample(questionNo, stem, answer, explanation, options));
        }
      }
    }

    if (isCountContext(stem, answer) && !/%/.test(answer) && /\b\d+\.\d+\b/.test(answer)) {
      result.countNounDecimalAnswerCount += 1;
      if (result.samples.countNounDecimalAnswer.length < 5) {
        result.samples.countNounDecimalAnswer.push(toSample(questionNo, stem, answer, explanation, options));
      }
    }

    if (hasSilentRounding(stem, answer, explanation)) {
      result.silentRoundingCount += 1;
      if (result.samples.silentRounding.length < 5) {
        result.samples.silentRounding.push(toSample(questionNo, stem, answer, explanation, options));
      }
    }

    if (explanationHasRepeatedCalculation(explanation)) {
      result.repeatedCalculationLineCount += 1;
      if (result.samples.repeatedCalculationLine.length < 5) {
        result.samples.repeatedCalculationLine.push(toSample(questionNo, stem, answer, explanation, options));
      }
    }

    if (isRepeatedReductionStem(stem) && missingRepeatedReductionStep(explanation)) {
      result.missingRepeatedReductionStepCount += 1;
      if (result.samples.missingRepeatedReductionStep.length < 5) {
        result.samples.missingRepeatedReductionStep.push(toSample(questionNo, stem, answer, explanation, options));
      }
    }

    if (hasSemanticLabelMismatch(stem, explanation)) {
      result.semanticLabelMismatchCount += 1;
      if (result.samples.semanticLabelMismatch.length < 5) {
        result.samples.semanticLabelMismatch.push(toSample(questionNo, stem, answer, explanation, options));
      }
    }
  });

  return result;
}

function applyNormalExportAudit(result: AuditResult, payload: unknown) {
  const questions = Array.isArray((payload as { questions?: unknown[] })?.questions)
    ? (payload as { questions: unknown[] }).questions
    : [];
  const stemBuckets = new Map<string, number[]>();

  questions.forEach((question, index) => {
    const item = question as {
      stem?: unknown;
      explanation?: unknown;
      options?: unknown;
      answer?: unknown;
      metadata?: { language?: unknown };
      validationSummary?: {
        messageAuditWarnings?: unknown;
      };
    };
    const stem = String(item.stem ?? "");
    const explanation = String(item.explanation ?? "");
    const options = Array.isArray(item.options)
      ? item.options.map((option) => String(option ?? ""))
      : [];
    const answer = String(item.answer ?? "");
    const questionNo = index + 1;

    const language = String(item.metadata?.language ?? "");
    if (language !== "en") {
      result.metadataLanguageMismatchCount += 1;
      if (result.samples.metadataLanguageMismatch.length < 5) {
        result.samples.metadataLanguageMismatch.push(
          toSample(questionNo, stem, answer, explanation, options),
        );
      }
    }

    const warningList = Array.isArray(item.validationSummary?.messageAuditWarnings)
      ? item.validationSummary?.messageAuditWarnings.map((warning) => String(warning ?? ""))
      : [];
    const validationBlob = JSON.stringify(item.validationSummary ?? {});
    if (
      Object.prototype.hasOwnProperty.call(item.validationSummary ?? {}, "messageAuditWarnings")
      || warningList.length > 0
      || NORMAL_EXPORT_WARNING_PATTERNS.some((pattern) => pattern.test(validationBlob))
    ) {
      result.validationWarningLeakCount += 1;
      if (result.samples.validationWarningLeak.length < 5) {
        result.samples.validationWarningLeak.push(
          toSample(questionNo, stem, answer, explanation, options),
        );
      }
    }

    const normalizedStem = normalizeStem(stem);
    const existing = stemBuckets.get(normalizedStem) ?? [];
    existing.push(questionNo);
    stemBuckets.set(normalizedStem, existing);
  });

  for (const [normalizedStem, questionNos] of stemBuckets.entries()) {
    if (questionNos.length < 2) {
      continue;
    }
    result.duplicateStemGroupCount += 1;
    result.duplicateStemQuestionCount += questionNos.length;
    if (result.samples.duplicateStem.length < 5) {
      const firstQuestion = questions[questionNos[0]! - 1] as { stem?: unknown; explanation?: unknown; options?: unknown; answer?: unknown };
      const options = Array.isArray(firstQuestion.options)
        ? firstQuestion.options.map((option) => String(option ?? ""))
        : [];
      result.samples.duplicateStem.push(
        toSample(
          questionNos[0]!,
          `${String(firstQuestion.stem ?? "")} [duplicate group size: ${questionNos.length}]`,
          String(firstQuestion.answer ?? ""),
          String(firstQuestion.explanation ?? ""),
          options,
        ),
      );
    }
  }
}

async function exportQuestions(
  fileName: string,
  items: readonly QuestionStudioExportItem[],
  cleanExport: boolean,
) {
  const exportResult = createQuestionExport(
    [...items],
    {
      format: "json",
      content: "explanations",
      cleanExport,
      generatedAt: new Date(),
      title: "Question Studio Export",
    },
  );
  const text = await exportResult.blob.text();
  writeFileSync(
    join(resolve(process.cwd(), "..", "generated-exports"), fileName),
    text,
    "utf8",
  );
  return JSON.parse(text);
}

async function generateBatch(
  selector: QuantV4PackageId | typeof QUANT_V4_PERCENTAGE_ALL_PATTERN_ID,
  count: number,
  seed: string,
) {
  const response = await generateQuestion(
    selector === QUANT_V4_PERCENTAGE_ALL_PATTERN_ID
      ? {
          patternId: QUANT_V4_PERCENTAGE_ALL_PATTERN_ID,
          language: "en",
          count,
          seed,
        }
      : {
          packageId: selector,
          language: "en",
          count,
          seed,
        },
  );
  return response.questions as QuestionStudioExportItem[];
}

async function main() {
  const exportDir = resolve(process.cwd(), "..", "generated-exports");
  mkdirSync(exportDir, { recursive: true });

  const summary: Record<string, unknown> = {};

  const fullItems = await generateBatch(
    QUANT_V4_PERCENTAGE_ALL_PATTERN_ID,
    500,
    "quant-v4-percentage-residual-v3",
  );
  const fullOptionQaPayload = await exportQuestions("quant-v4-percentage-pct-all-500-option-qa.json", fullItems, false);
  await exportQuestions("quant-v4-percentage-pct-all-500-clean.json", fullItems, true);
  const fullBatchAudit = auditItems(fullItems);
  applyNormalExportAudit(fullBatchAudit, fullOptionQaPayload);
  summary.fullBatch = {
    fileName: "quant-v4-percentage-pct-all-500-option-qa.json",
    audit: fullBatchAudit,
  };

  const packageSmokes: Record<string, unknown> = {};
  for (const packageId of PACKAGE_IDS) {
    const items = await generateBatch(
      packageId,
      20,
      `quant-v4-percentage-${packageId.toLowerCase()}-residual-v3`,
    );
    const fileName = `quant-v4-percentage-${packageId.toLowerCase()}-20-option-qa.json`;
    const payload = await exportQuestions(fileName, items, false);
    const audit = auditItems(items);
    applyNormalExportAudit(audit, payload);
    packageSmokes[packageId] = {
      fileName,
      audit,
    };
  }

  const fullAudit = summary.fullBatch as { audit: AuditResult };
  const lines = [
    "Residual QA rerun complete.",
    `Full batch questions: ${fullAudit.audit.questionCount}`,
    `Full batch bounded-percentage blockers: ${fullAudit.audit.boundedPercentageOver100Count}`,
    `Full batch impossible discount blockers: ${fullAudit.audit.impossibleDiscountOverBaseCount}`,
    `Full batch grammar blockers: ${fullAudit.audit.grammarIssueCount}`,
    `Full batch double-period blockers: ${fullAudit.audit.doublePeriodCount}`,
    `Full batch count-decimal blockers: ${fullAudit.audit.countNounDecimalAnswerCount}`,
    `Full batch silent-rounding blockers: ${fullAudit.audit.silentRoundingCount}`,
    `Full batch repeated-calculation blockers: ${fullAudit.audit.repeatedCalculationLineCount}`,
    `Full batch repeated-reduction blockers: ${fullAudit.audit.missingRepeatedReductionStepCount}`,
    `Full batch semantic-label blockers: ${fullAudit.audit.semanticLabelMismatchCount}`,
    `Full batch normal-export warning leaks: ${fullAudit.audit.validationWarningLeakCount}`,
    `Full batch metadata.language mismatches: ${fullAudit.audit.metadataLanguageMismatchCount}`,
    `Full batch duplicate stem groups: ${fullAudit.audit.duplicateStemGroupCount}`,
    `Full batch duplicate stem questions: ${fullAudit.audit.duplicateStemQuestionCount}`,
  ];

  const summaryPayload = {
    generatedAt: new Date().toISOString(),
    fullBatch: summary.fullBatch,
    packageSmokes,
  };
  writeFileSync(
    join(exportDir, "quant-v4-percentage-residual-qa-summary.json"),
    JSON.stringify(summaryPayload, null, 2),
    "utf8",
  );
  writeFileSync(
    join(exportDir, "quant-v4-percentage-residual-qa-run.log"),
    `${lines.join("\n")}\n`,
    "utf8",
  );

  console.log(lines.join("\n"));
}

await main();
