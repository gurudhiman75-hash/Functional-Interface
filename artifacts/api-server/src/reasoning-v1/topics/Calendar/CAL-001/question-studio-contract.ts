import { CALENDAR_PROTOTYPES } from "./registry.ts";
import type { CalendarQuestionPackage, Locale } from "./types.ts";
import { INITIAL_CALENDAR_SOURCE_AUDIT_GATE } from "./source-audit-gate.ts";

export const CALENDAR_QUESTION_STUDIO_CONTRACT = {
  chapter: "CAL-001",
  family: "REAS-CAL",
  mode: "INTERNAL_REVIEW_ONLY",
  permanentQlCount: 0,
  prototypeCount: CALENDAR_PROTOTYPES.length,
  supportedLocales: ["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly Locale[],
  filters: [
    "checkpoint", "prototypeAuthority", "difficulty", "locale", "queryType", "outputType",
    "forwardBackward", "ordinaryLeapCentury", "crossesFeb29", "crossesCentury",
    "countSemantics", "fullYearOrMonthMatch", "answerWeekday", "misconceptionFamily",
    "editorialStatus", "languageStatus", "storageStatus", "testEligibility", "publicationStatus",
  ],
  deliveryLocks: {
    publicDiscovery: false,
    questionBankWrites: false,
    mockTestEligibility: false,
    publicPublication: false,
  },
} as const;

export type CalendarActivationEvidence = {
  familyFTaxonomyMerged: boolean;
  sourceAuditPassed: boolean;
  mergeSplitAuditPassed: boolean;
  inverseAuditPassed: boolean;
  gapAuditPassed: boolean;
  englishHumanFreeze: boolean;
  hindiHumanFreeze: boolean;
  punjabiHumanFreeze: boolean;
  multilingualParityPassed: boolean;
  questionBankSafeguardsPassed: boolean;
  mockTestEligibilityApproved: boolean;
  publicationApproved: boolean;
};

export function assertCalendarActivationAllowed(evidence: CalendarActivationEvidence): void {
  const failed = Object.entries(evidence).filter(([, passed]) => !passed).map(([gate]) => gate);
  if (failed.length) throw new Error(`CAL-001 activation blocked by: ${failed.join(", ")}.`);
}

export function currentCalendarActivationEvidence(): CalendarActivationEvidence {
  return {
    familyFTaxonomyMerged: false,
    sourceAuditPassed: INITIAL_CALENDAR_SOURCE_AUDIT_GATE.passed,
    mergeSplitAuditPassed: false,
    inverseAuditPassed: false,
    gapAuditPassed: false,
    englishHumanFreeze: false,
    hindiHumanFreeze: false,
    punjabiHumanFreeze: false,
    multilingualParityPassed: false,
    questionBankSafeguardsPassed: false,
    mockTestEligibilityApproved: false,
    publicationApproved: false,
  };
}

export function toCalendarQuestionStudioReviewRecord(pkg: CalendarQuestionPackage): Record<string, unknown> {
  return {
    chapter: pkg.chapter,
    family: pkg.family,
    checkpoint: pkg.checkpoint,
    prototypeAuthority: pkg.prototypeAuthority,
    permanentQlId: pkg.permanentQlId,
    version: pkg.version,
    seed: pkg.seed,
    locale: pkg.locale,
    dateModel: "PROLEPTIC_GREGORIAN_CALENDAR_ARITHMETIC",
    queryType: pkg.queryType,
    outputType: pkg.outputType,
    stemTemplateId: pkg.stemTemplateId,
    explanationTemplateId: pkg.explanationTemplateId,
    studentView: {
      stem: pkg.stem,
      options: pkg.options.map((option) => option.display),
      answerIndex: pkg.answerIndex,
      explanation: pkg.explanation,
    },
    semanticFacts: pkg.facts,
    canonicalAnswer: pkg.canonicalAnswer,
    crossCheck: pkg.crossCheck,
    groundTruth: pkg.groundTruth,
    teachingTrace: pkg.teachingTrace,
    distractors: pkg.options.filter((option) => !option.isCorrect).map((option) => ({
      display: option.display,
      semanticValue: option.semanticValue,
      misconceptionId: option.misconceptionId,
      derivation: option.derivation,
      diagnosis: option.explanation,
    })),
    coverageFlags: pkg.coverageFlags,
    difficulty: pkg.difficulty,
    difficultyDimensions: pkg.difficultyDimensions,
    mathematicalFingerprint: pkg.mathematicalFingerprint,
    lifecycle: pkg.lifecycle,
  };
}
