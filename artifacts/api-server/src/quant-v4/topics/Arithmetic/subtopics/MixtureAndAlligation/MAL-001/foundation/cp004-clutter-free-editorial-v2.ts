import type { MalCp004Wave05DistractorAnalysis } from "./cp004-editorial-runtime-wave05";
import {
  MAL_CP004_ENGLISH_RELEASE,
  MAL_CP004_PERMANENT_ALLOCATION,
  MAL_CP004_PERMANENT_RUNTIME_ID,
  runMalCp004EnglishReleasePipeline as runMalCp004EnglishReleasePipelineV1,
  type MalCp004PermanentQlId,
  type MalCp004ReleasedQuestion,
} from "./cp004-permanent-runtime";

export const MAL_CP004_CLUTTER_FREE_PRESENTATION_ID =
  "MAL-CP004-EN-CLUTTER-FREE-PRESENTATION-V2" as const;

export const MAL_CP004_CLUTTER_FREE_RUNTIME_ID =
  "MAL-CP004-EN-PERMANENT-RUNTIME-V2" as const;

export const MAL_CP004_ENGLISH_RELEASE_V2 = Object.freeze({
  ...MAL_CP004_ENGLISH_RELEASE,
  releaseId: "MAL-CP004-EN-v2" as const,
  runtimeId: MAL_CP004_CLUTTER_FREE_RUNTIME_ID,
  sourcePermanentRuntimeId: MAL_CP004_PERMANENT_RUNTIME_ID,
  editorialStatus: "CLUTTER_FREE_REMEDIATION_REVIEW_CANDIDATE" as const,
  reviewMethod:
    "PRESENTATION_ONLY_REMEDIATION_WITH_V1_MATHEMATICAL_AND_OPTION_PARITY" as const,
  approvalNote:
    "The V2 candidate keeps MAL-QL-038..047, mathematics, stems, options and answers unchanged while simplifying the visible learner explanation. Human review is required before merge.",
});

const SECTION_TITLES = {
  method: "Method",
  calculation: "Calculation",
  answer: "Answer",
  moreHelp: "More help",
} as const;

export interface MalCp004ClutterFreeOptionalHelp {
  collapsedByDefault: true;
  whyOtherOptionsAreWrong: MalCp004Wave05DistractorAnalysis[];
  verification?: string;
}

export interface MalCp004ClutterFreeExplanation {
  layoutId: "MAL-CP004-EN-CLUTTER-FREE-V2";
  sectionTitles: typeof SECTION_TITLES;
  method: string;
  calculation: string[];
  answer: string;
  visibleLines: string[];
  lines: string[];
  optionalHelp: MalCp004ClutterFreeOptionalHelp;
}

type BaseTraceability = MalCp004ReleasedQuestion["traceability"];
type BaseValidation = MalCp004ReleasedQuestion["validation"];

export type MalCp004ClutterFreeQuestion = Omit<
  MalCp004ReleasedQuestion,
  | "runtimeId"
  | "explanationId"
  | "explanation"
  | "allocationStatus"
  | "parameters"
  | "validation"
  | "traceability"
> & {
  runtimeId: typeof MAL_CP004_CLUTTER_FREE_RUNTIME_ID;
  sourcePermanentRuntimeId: typeof MAL_CP004_PERMANENT_RUNTIME_ID;
  explanationId: string;
  explanation: MalCp004ClutterFreeExplanation;
  allocationStatus: "RELEASED_ENGLISH_V2";
  parameters: MalCp004ReleasedQuestion["parameters"] & {
    editorialPresentationVersion: typeof MAL_CP004_CLUTTER_FREE_PRESENTATION_ID;
  };
  validation: BaseValidation;
  traceability: Omit<BaseTraceability, "releaseId"> & {
    releaseId: "MAL-CP004-EN-v2";
    presentationVersion: typeof MAL_CP004_CLUTTER_FREE_PRESENTATION_ID;
  };
};

const VERIFICATION_HELP_QLS = new Set<MalCp004PermanentQlId>([
  "MAL-QL-045",
  "MAL-QL-047",
]);

function normalizedLine(value: string): string {
  return value.trim().replace(/\s+/gu, " ");
}

function compactCalculation(question: MalCp004ReleasedQuestion): string[] {
  const result: string[] = [];
  const seen = new Set<string>();

  for (const rawStep of question.explanation.stepByStepSolution) {
    const step = normalizedLine(rawStep);
    if (!step) continue;
    if (/^(?:therefore|hence|thus|final answer|answer)\b/iu.test(step)) continue;
    const key = step.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(step);
  }

  if (result.length === 0) {
    throw new Error(`${question.questionId}: compact calculation has no worked line.`);
  }
  return result;
}

function clutterFreeExplanation(
  question: MalCp004ReleasedQuestion,
): MalCp004ClutterFreeExplanation {
  const method = normalizedLine(question.explanation.coreConceptAndFormula);
  const calculation = compactCalculation(question);
  const answer = question.answer;
  const visibleLines = [method, ...calculation, `Answer: ${answer}`];
  const optionalHelp: MalCp004ClutterFreeOptionalHelp = {
    collapsedByDefault: true,
    whyOtherOptionsAreWrong: question.explanation.distractorAnalysis,
    ...(VERIFICATION_HELP_QLS.has(question.permanentQlId)
      ? { verification: normalizedLine(question.explanation.verification) }
      : {}),
  };

  return {
    layoutId: "MAL-CP004-EN-CLUTTER-FREE-V2",
    sectionTitles: SECTION_TITLES,
    method,
    calculation,
    answer,
    visibleLines,
    lines: visibleLines,
    optionalHelp,
  };
}

function assertClutterFree(question: MalCp004ClutterFreeQuestion): void {
  const explanation = question.explanation;
  if (explanation.layoutId !== "MAL-CP004-EN-CLUTTER-FREE-V2") {
    throw new Error(`${question.questionId}: wrong clutter-free layout identity.`);
  }
  if (explanation.calculation.length === 0) {
    throw new Error(`${question.questionId}: visible calculation is empty.`);
  }
  if (explanation.visibleLines.join("\n") !== explanation.lines.join("\n")) {
    throw new Error(`${question.questionId}: visible lines and compatibility lines differ.`);
  }
  if (explanation.optionalHelp.collapsedByDefault !== true) {
    throw new Error(`${question.questionId}: optional help is not collapsed by default.`);
  }
  if (explanation.optionalHelp.whyOtherOptionsAreWrong.length !== 3) {
    throw new Error(`${question.questionId}: hidden option analysis is incomplete.`);
  }
  const visibleText = explanation.visibleLines.join("\n");
  const forbiddenVisibleLabels = [
    /10-second/iu,
    /exam shortcut/iu,
    /fast method/iu,
    /quick check/iu,
    /common traps/iu,
    /distractor analysis/iu,
  ];
  for (const pattern of forbiddenVisibleLabels) {
    if (pattern.test(visibleText)) {
      throw new Error(
        `${question.questionId}: cluttered learner label remains visible: ${pattern}.`,
      );
    }
  }
  if (
    VERIFICATION_HELP_QLS.has(question.permanentQlId) !==
    Object.hasOwn(explanation.optionalHelp, "verification")
  ) {
    throw new Error(`${question.questionId}: verification-help policy is inconsistent.`);
  }
}

export function runMalCp004EnglishClutterFreeV2Pipeline(
  input: {
    questionLanguageId: MalCp004PermanentQlId;
    seed?: string;
    language?: "en";
  },
): MalCp004ClutterFreeQuestion {
  const base = runMalCp004EnglishReleasePipelineV1(input);
  const question: MalCp004ClutterFreeQuestion = {
    ...base,
    runtimeId: MAL_CP004_CLUTTER_FREE_RUNTIME_ID,
    sourcePermanentRuntimeId: MAL_CP004_PERMANENT_RUNTIME_ID,
    explanationId: `${base.permanentQlId}-EN-CLUTTER-FREE-V2`,
    explanation: clutterFreeExplanation(base),
    allocationStatus: "RELEASED_ENGLISH_V2",
    parameters: {
      ...base.parameters,
      editorialPresentationVersion: MAL_CP004_CLUTTER_FREE_PRESENTATION_ID,
    },
    validation: {
      ...base.validation,
      checks: [
        ...base.validation.checks,
        {
          name: "CLUTTER_FREE_VISIBLE_EXPLANATION",
          passed: true,
          message:
            "The visible explanation contains only Method, Calculation and Answer.",
        },
        {
          name: "OPTIONAL_HELP_COLLAPSED",
          passed: true,
          message:
            "Verification and displayed-option analysis are outside the default learner surface.",
        },
        {
          name: "NO_FORCED_FAST_METHOD",
          passed: true,
          message:
            "No Fast Method is emitted unless a genuinely different alternative is authored later.",
        },
      ],
    },
    traceability: {
      ...base.traceability,
      releaseId: "MAL-CP004-EN-v2",
      presentationVersion: MAL_CP004_CLUTTER_FREE_PRESENTATION_ID,
    },
  };

  assertClutterFree(question);
  return question;
}

export function malCp004ClutterFreeStable(
  question: MalCp004ClutterFreeQuestion,
): string {
  return JSON.stringify(question, (_key, value) =>
    typeof value === "bigint" ? `${value}n` : value,
  );
}

export const MAL_CP004_CLUTTER_FREE_QL_IDS =
  MAL_CP004_PERMANENT_ALLOCATION.map((entry) => entry.qlId);
