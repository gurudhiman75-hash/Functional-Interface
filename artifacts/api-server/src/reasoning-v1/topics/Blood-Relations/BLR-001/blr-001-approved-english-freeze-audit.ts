import { buildBlr001EnglishGapAudit } from "./blr-001-english-gap-audit";
import {
  buildBlrCp007EditorialV4Wave3FinalTelemetry,
  generateBlrCp007EditorialV4Wave3FinalBank,
} from "./BLR-CP-007/cp007-editorial-v4-wave3-final";

export const BLR_001_APPROVED_ENGLISH_FREEZE_AUDIT_VERSION =
  "BLR_001_APPROVED_ENGLISH_FREEZE_AUDIT_V1" as const;

export type AuditSeverity = "BLOCKER" | "WARNING";

export interface ApprovedEnglishAuditFinding {
  severity: AuditSeverity;
  code: string;
  itemId: string;
  detail: string;
}

const FORBIDDEN_LEARNER_PATTERNS: readonly { code: string; pattern: RegExp }[] = [
  { code: "SOFTWARE_TOKEN_WORD", pattern: /\btoken(?:s)?\b/i },
  { code: "REDUNDANT_RELATION_QUALIFIER", pattern: /\b(?:marriage-based|blood-based)\b/i },
  { code: "INTERNAL_GRAPH_JARGON", pattern: /\bgraph-valid\b/i },
  { code: "INTERNAL_EDITORIAL_JARGON", pattern: /\b(?:semantic fingerprint|prototype|telemetry|remediation hold|dataset version)\b/i },
  { code: "MALFORMED_NOT_ESTABLISHED", pattern: /\b(?:so|that)\s+[A-Z]+\s+is\b[^.]*\bis not established\b/i },
  { code: "COLOUR_CODE_WORD", pattern: /\b(?:red|blue|green|white|black|amber|silver|gold)\b/i },
] as const;

function words(value: string): number {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function normalizeStem(value: string): string {
  return value
    .toLowerCase()
    .replace(/\b[A-Z][A-Z0-9]*\b/g, "person")
    .replace(/[A-Z]/g, "person")
    .replace(/[+×÷=@#$%^&*~<>]/g, "symbol")
    .replace(/\s+/g, " ")
    .trim();
}

function visibleFields(question: ReturnType<typeof generateBlrCp007EditorialV4Wave3FinalBank>[number]): readonly { field: string; text: string }[] {
  return [
    { field: "sharedPrompt", text: question.sharedPrompt },
    { field: "stem", text: question.stem },
    ...question.options.map((option, index) => ({ field: `option-${index + 1}`, text: option.text })),
    ...question.options.map((option, index) => ({ field: `option-explanation-${index + 1}`, text: option.studentExplanation })),
    ...question.explanation.steps.map((text, index) => ({ field: `step-${index + 1}`, text })),
    { field: "conclusion", text: question.explanation.conclusion },
    { field: "shortcut", text: question.explanation.shortcut ?? "" },
    { field: "commonTrap", text: question.explanation.commonTrap ?? "" },
    ...question.explanation.optionAnalysis.map((entry, index) => ({ field: `analysis-${index + 1}`, text: entry.explanation })),
  ];
}

function frequency(values: readonly string[]): Readonly<Record<string, number>> {
  const result: Record<string, number> = {};
  for (const value of values) result[value] = (result[value] ?? 0) + 1;
  return result;
}

function maximumFrequency(values: readonly string[]): number {
  return Math.max(0, ...Object.values(frequency(values)));
}

export function buildBlr001ApprovedEnglishFreezeAudit() {
  const chapterBaseline = buildBlr001EnglishGapAudit();
  const bank = generateBlrCp007EditorialV4Wave3FinalBank();
  const telemetry = buildBlrCp007EditorialV4Wave3FinalTelemetry(bank);
  const findings: ApprovedEnglishAuditFinding[] = [];
  const add = (severity: AuditSeverity, code: string, itemId: string, detail: string) =>
    findings.push({ severity, code, itemId, detail });

  if (chapterBaseline.failures.length > 0) {
    for (const failure of chapterBaseline.failures) add("BLOCKER", "CHAPTER_BASELINE_FAILURE", "BLR-001", failure);
  }
  if (bank.length !== 168) add("BLOCKER", "WRONG_APPROVED_CORPUS_SIZE", "BLR-CP-007", `Expected 168 questions, found ${bank.length}.`);

  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const stemWordCounts: number[] = [];
  const optionWordCounts: number[] = [];
  const explanationWordCounts: number[] = [];
  const normalizedStemCounts: Record<string, number> = {};

  for (const question of bank) {
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    stemWordCounts.push(words(question.stem));
    optionWordCounts.push(...question.options.map((option) => words(option.text)));
    explanationWordCounts.push(words([
      ...question.explanation.steps,
      question.explanation.conclusion,
      question.explanation.shortcut ?? "",
      question.explanation.commonTrap ?? "",
    ].join(" ")));

    if (stems.has(question.stem)) add("BLOCKER", "DUPLICATE_STEM", question.itemId, question.stem);
    stems.add(question.stem);
    if (fingerprints.has(question.metadata.v4EditorialFingerprint)) {
      add("BLOCKER", "DUPLICATE_EDITORIAL_FINGERPRINT", question.itemId, question.metadata.v4EditorialFingerprint);
    }
    fingerprints.add(question.metadata.v4EditorialFingerprint);
    const normalizedStem = normalizeStem(question.stem);
    normalizedStemCounts[normalizedStem] = (normalizedStemCounts[normalizedStem] ?? 0) + 1;

    if (!question.stem.includes("?")) add("BLOCKER", "NON_QUESTION_STEM", question.itemId, question.stem);
    if (question.options.length !== 4) add("BLOCKER", "OPTION_COUNT", question.itemId, `Found ${question.options.length} options.`);
    if (new Set(question.options.map((option) => option.text)).size !== 4) {
      add("BLOCKER", "DUPLICATE_OPTIONS", question.itemId, "Options are not textually unique.");
    }
    if (question.correctIndex < 0 || question.correctIndex > 3) {
      add("BLOCKER", "INVALID_CORRECT_INDEX", question.itemId, String(question.correctIndex));
    } else if (question.options[question.correctIndex]?.text !== question.answer) {
      add("BLOCKER", "ANSWER_INDEX_MISMATCH", question.itemId, question.answer);
    }
    if (question.options.filter((option) => option.isCorrectAnswerForTask).length !== 1) {
      add("BLOCKER", "MARKED_CORRECT_COUNT", question.itemId, "Exactly one option must be marked correct.");
    }
    if (question.qlId !== "BLR-QL-035" && question.options.filter((option) => option.targetRelationSatisfied).length !== 1) {
      add("BLOCKER", "SEMANTIC_ANSWER_COUNT", question.itemId, "Exactly one option must satisfy the target relation.");
    }
    if (!question.explanation.steps.length || !question.explanation.conclusion.trim()) {
      add("BLOCKER", "INCOMPLETE_CORE_EXPLANATION", question.itemId, "Steps or conclusion are missing.");
    }
    if (!question.explanation.shortcut?.trim() || !question.explanation.commonTrap?.trim()) {
      add("BLOCKER", "INCOMPLETE_LEARNING_GUIDANCE", question.itemId, "Shortcut or common trap is missing.");
    }
    if (question.explanation.optionAnalysis.length !== 4) {
      add("BLOCKER", "OPTION_ANALYSIS_COUNT", question.itemId, `Found ${question.explanation.optionAnalysis.length} analyses.`);
    }
    question.options.forEach((option, index) => {
      if (!option.studentExplanation.trim()) add("BLOCKER", "EMPTY_OPTION_EXPLANATION", question.itemId, `Option ${index + 1}.`);
      const analysis = question.explanation.optionAnalysis[index];
      if (!analysis || analysis.optionText !== option.text || analysis.explanation !== option.studentExplanation) {
        add("BLOCKER", "OPTION_ANALYSIS_MISMATCH", question.itemId, `Option ${index + 1}.`);
      }
    });

    const usedSymbols = new Set(question.options.flatMap((option) => option.completedStatements.map((statement) => statement.token)));
    const displayedSymbols = new Set(question.codeKey.map((entry) => entry.token));
    for (const symbol of usedSymbols) {
      if (!displayedSymbols.has(symbol)) add("BLOCKER", "MISSING_DISPLAYED_SYMBOL", question.itemId, symbol);
    }

    if (question.publiclyPublishable || question.questionStudioVisible || question.questionBankEligible || question.mockTestEligible) {
      add("BLOCKER", "LIFECYCLE_LOCK_OPEN", question.itemId, "A downstream product flag is enabled before English freeze.");
    }
    if (JSON.stringify(question.metadata.activeEditorialBlockers) !== JSON.stringify(["ENGLISH_FREEZE_PENDING"])) {
      add("BLOCKER", "WRONG_EDITORIAL_BLOCKER", question.itemId, JSON.stringify(question.metadata.activeEditorialBlockers));
    }
    if (!question.reviewProof.reviewerNote.includes("Product-owner approved")) {
      add("BLOCKER", "APPROVAL_NOTE_MISSING", question.itemId, question.reviewProof.reviewerNote);
    }

    for (const { field, text } of visibleFields(question)) {
      for (const rule of FORBIDDEN_LEARNER_PATTERNS) {
        if (rule.pattern.test(text)) add("BLOCKER", rule.code, question.itemId, `${field}: ${text}`);
      }
    }

    if (words(question.stem) > 38) add("WARNING", "LONG_STEM", question.itemId, `${words(question.stem)} words.`);
    if (Math.max(...question.options.map((option) => words(option.text))) > 26) {
      add("WARNING", "LONG_OPTION", question.itemId, "At least one option exceeds 26 words.");
    }
    if (words(question.explanation.conclusion) > 32) {
      add("WARNING", "LONG_CONCLUSION", question.itemId, `${words(question.explanation.conclusion)} words.`);
    }
  }

  const expectedQlCounts: Readonly<Record<string, number>> = {
    "BLR-QL-031": 48,
    "BLR-QL-032": 32,
    "BLR-QL-033": 24,
    "BLR-QL-034": 32,
    "BLR-QL-035": 32,
  };
  for (const [qlId, expected] of Object.entries(expectedQlCounts)) {
    if ((qlCounts[qlId] ?? 0) !== expected) add("BLOCKER", "QL_COUNT_MISMATCH", qlId, `Expected ${expected}, found ${qlCounts[qlId] ?? 0}.`);
  }

  const blockerFindings = findings.filter((finding) => finding.severity === "BLOCKER");
  const warningFindings = findings.filter((finding) => finding.severity === "WARNING");
  const normalizedTemplateClusters = Object.entries(normalizedStemCounts)
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1]);

  return {
    auditVersion: BLR_001_APPROVED_ENGLISH_FREEZE_AUDIT_VERSION,
    chapterBaselineVersion: chapterBaseline.auditVersion,
    chapterBaselineVerdict: chapterBaseline.verdict,
    permanentQlCount: chapterBaseline.permanentQlCount,
    approvedCorpusQuestionCount: bank.length,
    qlCounts,
    difficultyCounts: telemetry.difficultyCounts,
    recommendedUseCounts: telemetry.recommendedUseCounts,
    exactStemCount: stems.size,
    editorialFingerprintCount: fingerprints.size,
    normalizedTemplateClusterCount: normalizedTemplateClusters.length,
    maximumNormalizedTemplateRepeat: Math.max(0, ...normalizedTemplateClusters.map(([, count]) => count)),
    maximumShortcutRepeat: telemetry.maximumExactShortcutRepeat,
    maximumTrapRepeat: telemetry.maximumExactTrapRepeat,
    maximumStemWords: Math.max(...stemWordCounts),
    averageStemWords: Number((stemWordCounts.reduce((sum, value) => sum + value, 0) / stemWordCounts.length).toFixed(2)),
    maximumOptionWords: Math.max(...optionWordCounts),
    averageOptionWords: Number((optionWordCounts.reduce((sum, value) => sum + value, 0) / optionWordCounts.length).toFixed(2)),
    maximumExplanationWords: Math.max(...explanationWordCounts),
    averageExplanationWords: Number((explanationWordCounts.reduce((sum, value) => sum + value, 0) / explanationWordCounts.length).toFixed(2)),
    blockerCount: blockerFindings.length,
    warningCount: warningFindings.length,
    findings,
    blockerFindings,
    warningFindings,
    normalizedTemplateClusters: normalizedTemplateClusters.slice(0, 30).map(([template, count]) => ({ template, count })),
    verdict: blockerFindings.length === 0
      ? "APPROVED_CORPUS_ENGLISH_FREEZE_REVIEW_CANDIDATE"
      : "APPROVED_CORPUS_ENGLISH_FREEZE_BLOCKED",
    manualEnglishFreezeRequired: true as const,
  };
}
