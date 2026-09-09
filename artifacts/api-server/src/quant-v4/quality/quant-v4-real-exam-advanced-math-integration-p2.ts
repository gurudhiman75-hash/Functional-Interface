import {
  getQuantV4ExamProfileContract,
  type QuantV4ExamProfileId,
} from "../common/exam-profile";
import {
  assessExplanationQuality,
  hasQuestionSpecificEvidence,
} from "./semantic-explanation-quality";
import {
  generateQuantV4AdvancedMathSectionQuestion,
  type QuantV4AdvancedMathSectionExamId,
} from "./quant-v4-real-exam-advanced-math-adapters-p2";
import {
  QUANT_V4_REAL_EXAM_PROFILES,
  generateQuantV4RealExamSection,
  type QuantV4RealExamProfile,
  type QuantV4SimulatedQuestion,
  type QuantV4SimulatedSection,
} from "./quant-v4-real-exam-simulation-p2";

export const QUANT_V4_REAL_EXAM_ADVANCED_MATH_INTEGRATION_AUTHORITY =
  "QUANT-V4-REAL-EXAM-ADVANCED-MATH-INTEGRATION-P2" as const;

export interface QuantV4AdvancedMathIntegratedSection extends QuantV4SimulatedSection {
  readonly integrationAuthority: typeof QUANT_V4_REAL_EXAM_ADVANCED_MATH_INTEGRATION_AUTHORITY;
  readonly advancedMathReplacements: number;
}

export interface QuantV4AdvancedMathIntegrationSummary {
  readonly examId: QuantV4AdvancedMathSectionExamId;
  readonly sectionsGenerated: number;
  readonly advancedMathRecords: number;
  readonly advancedMathRuntimeGenerated: number;
  readonly advancedMathCapabilityGaps: number;
  readonly algebraRecords: number;
  readonly trigonometryRecords: number;
  readonly optionMismatchCount: number;
  readonly centralProfileAuthority: QuantV4ExamProfileId;
  readonly simulatorCentralProfilePropagationPending: boolean;
}

const ADVANCED_MATH_EXAMS = new Set<QuantV4AdvancedMathSectionExamId>([
  "SSC_CGL_TIER_I",
  "SSC_CGL_TIER_II",
  "SSC_CHSL",
  "PSSSB",
  "PPSC",
  "PUNJAB_POLICE",
]);

function isAdvancedMathExamId(value: string): value is QuantV4AdvancedMathSectionExamId {
  return ADVANCED_MATH_EXAMS.has(value as QuantV4AdvancedMathSectionExamId);
}

export function centralProfileAuthorityForRealExam(
  examId: QuantV4AdvancedMathSectionExamId,
): QuantV4ExamProfileId {
  if (examId === "SSC_CGL_TIER_I") return "SSC_CGL_TIER_I";
  if (examId === "SSC_CGL_TIER_II") return "SSC_CGL_JSO";
  if (examId === "SSC_CHSL") return "SSC_CGL_CHSL";
  return "PUNJAB_STATE";
}

function optionTexts(question: any): string[] {
  const raw = Array.isArray(question?.options) ? question.options : [];
  return raw.map((option: any) =>
    typeof option === "string"
      ? option
      : String(option?.value ?? option?.text ?? option?.label ?? option),
  );
}

function explanationText(question: any): string {
  if (typeof question?.explanation === "string") return question.explanation.trim();
  if (Array.isArray(question?.explanation?.lines)) return question.explanation.lines.join("\n\n").trim();
  if (Array.isArray(question?.explanation?.steps)) {
    return [
      question.explanation.keyIdea,
      ...question.explanation.steps,
      question.explanation.shortcut,
      question.explanation.trap,
    ].filter(Boolean).join("\n\n").trim();
  }
  if (typeof question?.learnerExplanation === "string") return question.learnerExplanation.trim();
  if (Array.isArray(question?.learnerExplanation?.lines)) return question.learnerExplanation.lines.join("\n\n").trim();
  if (Array.isArray(question?.packageExplanation?.lines)) return question.packageExplanation.lines.join("\n\n").trim();
  return "";
}

function questionText(question: any): string {
  return String(question?.text ?? question?.stem ?? question?.question ?? "").trim();
}

function normalizeStemSignature(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/₹|\brs\.?\b|\binr\b/giu, "<money>")
    .replace(/-?\d+(?:\.\d+)?/gu, "<n>")
    .replace(/\b[a-e]\b/giu, "<option>")
    .replace(/[^a-z<>%+*/=\-]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function inferDirectInverse(question: any): QuantV4SimulatedQuestion["directInverse"] {
  const trace = [
    question?.taskKind,
    question?.solveMode,
    question?.canonicalProblemId,
    question?.traceability?.taskDirection,
    question?.semanticMetadata?.taskDirection,
  ].filter(Boolean).join(" ").toUpperCase();
  if (/REVERSE|INVERSE|MISSING|RECOVER|UNKNOWN_FROM|BACKWARD/u.test(trace)) return "INVERSE";
  if (/DIRECT|FORWARD|TOTAL|DIFFERENCE|MEAN|RATIO|PERCENT/u.test(trace)) return "DIRECT";
  return "MIXED_OR_UNKNOWN";
}

function inferCalculationIntensity(
  question: any,
  text: string,
  explanation: string,
): QuantV4SimulatedQuestion["calculationIntensity"] {
  const source = `${text} ${explanation}`;
  const operators = (source.match(/[=+*/%÷×−-]/gu) ?? []).length;
  const numbers = (source.match(/-?\d+(?:\.\d+)?/gu) ?? []).length;
  const difficulty = String(question?.difficulty ?? question?.difficultyLabel ?? "").toLowerCase();
  if (operators >= 8 || numbers >= 16 || difficulty === "hard") return "HIGH";
  if (operators >= 3 || numbers >= 8 || difficulty === "medium") return "MEDIUM";
  return "LOW";
}

function buildRuntimeRecord(input: {
  profile: QuantV4RealExamProfile;
  source: QuantV4SimulatedQuestion;
  packageId: string;
  question: any;
}): QuantV4SimulatedQuestion {
  const text = questionText(input.question);
  const explanation = explanationText(input.question);
  const options = optionTexts(input.question);
  const assessment = assessExplanationQuality({
    packageId: input.packageId,
    questionKey: String(input.question?.questionId ?? `${input.profile.id}:${input.source.sectionIndex}:${input.source.ordinal}`),
    stem: text,
    explanation,
    answer: input.question?.answer ?? input.question?.canonicalAnswer?.display ?? input.question?.canonicalAnswer?.value,
    options,
  });
  const algebra = input.source.slotKind === "ALGEBRA";

  return Object.freeze({
    examId: input.source.examId,
    sectionIndex: input.source.sectionIndex,
    ordinal: input.source.ordinal,
    slotKind: input.source.slotKind,
    sourceKind: "RUNTIME_GENERATED",
    packageId: input.packageId,
    topic: "Advanced Mathematics",
    subtopic: algebra ? "Algebra" : "Trigonometry",
    representation: "DIRECT_MCQ",
    difficulty: String(input.question?.difficulty ?? input.question?.difficultyLabel ?? input.question?.difficultyBand ?? "UNKNOWN"),
    text,
    explanation,
    options,
    optionCount: options.length,
    expectedOptionCount: input.profile.expectedOptionCount,
    questionSpecificExplanation: hasQuestionSpecificEvidence(assessment),
    explanationOptionalSectionIssues: assessment.optionalSectionIssues,
    semanticExplanationSignature: assessment.semanticSignature,
    normalizedStemSignature: normalizeStemSignature(text),
    stemWordCount: text.split(/\s+/u).filter(Boolean).length,
    explanationWordCount: explanation.split(/\s+/u).filter(Boolean).length,
    numberTokenCount: (text.match(/-?\d+(?:\.\d+)?/gu) ?? []).length,
    directInverse: inferDirectInverse(input.question),
    calculationIntensity: inferCalculationIntensity(input.question, text, explanation),
    testEligible: algebra ? false : input.question?.testEligible === true,
    publiclyPublishable: false,
  });
}

export async function generateQuantV4RealExamSectionWithAdvancedMath(input: {
  examId: QuantV4AdvancedMathSectionExamId;
  sectionIndex: number;
  seed?: string;
}): Promise<QuantV4AdvancedMathIntegratedSection> {
  const profile = QUANT_V4_REAL_EXAM_PROFILES.find((entry) => entry.id === input.examId);
  if (!profile) throw new Error(`Unknown real-exam profile ${input.examId}.`);
  const base = await generateQuantV4RealExamSection(input);
  let replacements = 0;
  const questions: QuantV4SimulatedQuestion[] = [];

  for (const source of base.questions) {
    if (
      source.sourceKind !== "CAPABILITY_GAP"
      || (source.slotKind !== "ALGEBRA" && source.slotKind !== "TRIGONOMETRY")
    ) {
      questions.push(source);
      continue;
    }

    const result = await generateQuantV4AdvancedMathSectionQuestion({
      examId: input.examId,
      slotKind: source.slotKind,
      seed: `${base.seed}:advanced-math:${source.slotKind}:${source.ordinal}`,
    });
    questions.push(buildRuntimeRecord({
      profile,
      source,
      packageId: result.packageId,
      question: result.question,
    }));
    replacements += 1;
  }

  return Object.freeze({
    ...base,
    questions: Object.freeze(questions),
    integrationAuthority: QUANT_V4_REAL_EXAM_ADVANCED_MATH_INTEGRATION_AUTHORITY,
    advancedMathReplacements: replacements,
  });
}

export async function runQuantV4AdvancedMathRealExamIntegrationAudit(input: {
  sectionsPerProfile?: number;
  seedPrefix?: string;
} = {}) {
  const sectionsPerProfile = Math.max(1, Math.floor(input.sectionsPerProfile ?? 5));
  const summaries: QuantV4AdvancedMathIntegrationSummary[] = [];

  for (const examId of [...ADVANCED_MATH_EXAMS].sort()) {
    if (!isAdvancedMathExamId(examId)) continue;
    const profile = QUANT_V4_REAL_EXAM_PROFILES.find((entry) => entry.id === examId)!;
    const sections: QuantV4AdvancedMathIntegratedSection[] = [];
    for (let sectionIndex = 1; sectionIndex <= sectionsPerProfile; sectionIndex += 1) {
      sections.push(await generateQuantV4RealExamSectionWithAdvancedMath({
        examId,
        sectionIndex,
        seed: `${input.seedPrefix ?? QUANT_V4_REAL_EXAM_ADVANCED_MATH_INTEGRATION_AUTHORITY}:${examId}:${sectionIndex}`,
      }));
    }
    const advanced = sections.flatMap((section) => section.questions)
      .filter((question) => question.slotKind === "ALGEBRA" || question.slotKind === "TRIGONOMETRY");
    const centralProfileAuthority = centralProfileAuthorityForRealExam(examId);
    const centralContract = getQuantV4ExamProfileContract(centralProfileAuthority);
    const simulatorCentral = profile.centralDeliveryProfile;

    summaries.push(Object.freeze({
      examId,
      sectionsGenerated: sections.length,
      advancedMathRecords: advanced.length,
      advancedMathRuntimeGenerated: advanced.filter((question) => question.sourceKind === "RUNTIME_GENERATED").length,
      advancedMathCapabilityGaps: advanced.filter((question) => question.sourceKind === "CAPABILITY_GAP").length,
      algebraRecords: advanced.filter((question) => question.slotKind === "ALGEBRA").length,
      trigonometryRecords: advanced.filter((question) => question.slotKind === "TRIGONOMETRY").length,
      optionMismatchCount: advanced.filter((question) => question.optionCount !== centralContract.optionCount).length,
      centralProfileAuthority,
      simulatorCentralProfilePropagationPending: simulatorCentral !== centralProfileAuthority,
    }));
  }

  return Object.freeze({
    authority: QUANT_V4_REAL_EXAM_ADVANCED_MATH_INTEGRATION_AUTHORITY,
    sectionsPerProfile,
    profilesAudited: summaries.length,
    summaries: Object.freeze(summaries),
  });
}
