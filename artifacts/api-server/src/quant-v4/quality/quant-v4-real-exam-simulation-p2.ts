import {
  generateQuestion as generateQuantQuestion,
  listQuantV4Packages,
} from "../question-studio-review-engine";
import { generateDi001TableSet } from "../topics/DataInterpretation/DI-001";
import { generateDi002AdvancedTableSet } from "../topics/DataInterpretation/DI-002";
import { generateDi003GroupedBarSet } from "../topics/DataInterpretation/DI-003";
import { generateDi004LineSet } from "../topics/DataInterpretation/DI-004";
import { generateDi005PieSet } from "../topics/DataInterpretation/DI-005";
import { generateDi006CaseletSet } from "../topics/DataInterpretation/DI-006";
import { generateDi007MissingSet } from "../topics/DataInterpretation/DI-007";
import { generateDi008ArithmeticSet } from "../topics/DataInterpretation/DI-008";
import { generateBns001Question } from "../topics/SpeedMathematics/BankingNumberSeries/BNS-001";
import { generateQcp001Question } from "../representations/QuantityComparison/QCP-001";
import {
  generateSta001Question,
  STA001_CONTRACTS,
} from "../topics/Statistics/STAT-001";
import {
  generateDsfExamProfileBatch,
  type DsfExamAnswerProfileId,
} from "../../reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-003/exam-answer-profiles-v1";
import {
  assessExplanationQuality,
  hasQuestionSpecificEvidence,
  semanticExplanationSignature,
} from "./semantic-explanation-quality";

export const QUANT_V4_REAL_EXAM_SIMULATION_AUTHORITY =
  "QUANT-V4-REAL-EXAM-SIMULATION-AUDIT-P2" as const;

export const QUANT_V4_REAL_EXAM_MIN_SECTIONS_PER_PROFILE = 20 as const;

export type QuantV4RealExamId =
  | "SSC_CGL_TIER_I"
  | "SSC_CGL_TIER_II"
  | "SSC_CHSL"
  | "PSSSB"
  | "PPSC"
  | "PUNJAB_POLICE"
  | "IBPS_PO_PRELIMS"
  | "IBPS_PO_MAINS"
  | "IBPS_CLERK"
  | "SBI_PO"
  | "IBPS_RRB_BANKING";

export type SimulationSlotKind =
  | "ARITHMETIC_CORE"
  | "GEOMETRY_MENSURATION"
  | "TRIGONOMETRY"
  | "ALGEBRA"
  | "PROBABILITY"
  | "STATISTICS"
  | "DATA_INTERPRETATION"
  | "SPEED_MATHS"
  | "BANKING_NUMBER_SERIES"
  | "QUANTITY_COMPARISON"
  | "DATA_SUFFICIENCY";

export type SimulationBlueprintEvidence =
  | "STRUCTURAL_BASELINE"
  | "PROVISIONAL_PYQ_WEIGHTING_REQUIRED";

export type SimulationReadiness =
  | "EXAM_SIMULATION_READY_CANDIDATE"
  | "EXAM_SIMULATION_NOT_READY";

export interface QuantV4RealExamProfile {
  readonly id: QuantV4RealExamId;
  readonly label: string;
  readonly family: "SSC" | "PUNJAB_STATE" | "BANKING";
  readonly questionCount: number;
  readonly expectedOptionCount: 4 | 5;
  readonly sectionsPerAudit: number;
  readonly centralDeliveryProfile:
    | "SSC_CGL_TIER_I"
    | "SSC_CGL_CHSL"
    | "SSC_CGL_JSO"
    | "BANKING_PRELIMS"
    | "BANKING_MAINS"
    | null;
  readonly centralProfileGap: boolean;
  readonly blueprintEvidence: SimulationBlueprintEvidence;
  readonly slotPlan: readonly Readonly<{ kind: SimulationSlotKind; count: number }>[];
}

const profile = (
  input: Omit<QuantV4RealExamProfile, "sectionsPerAudit">,
): QuantV4RealExamProfile => Object.freeze({
  ...input,
  sectionsPerAudit: QUANT_V4_REAL_EXAM_MIN_SECTIONS_PER_PROFILE,
});

export const QUANT_V4_REAL_EXAM_PROFILES: readonly QuantV4RealExamProfile[] = Object.freeze([
  profile({
    id: "SSC_CGL_TIER_I",
    label: "SSC CGL Tier I",
    family: "SSC",
    questionCount: 25,
    expectedOptionCount: 4,
    centralDeliveryProfile: "SSC_CGL_TIER_I",
    centralProfileGap: false,
    blueprintEvidence: "PROVISIONAL_PYQ_WEIGHTING_REQUIRED",
    slotPlan: [
      { kind: "ARITHMETIC_CORE", count: 13 },
      { kind: "GEOMETRY_MENSURATION", count: 4 },
      { kind: "TRIGONOMETRY", count: 3 },
      { kind: "ALGEBRA", count: 2 },
      { kind: "PROBABILITY", count: 3 },
    ],
  }),
  profile({
    id: "SSC_CGL_TIER_II",
    label: "SSC CGL Tier II",
    family: "SSC",
    questionCount: 30,
    expectedOptionCount: 4,
    centralDeliveryProfile: "SSC_CGL_JSO",
    centralProfileGap: false,
    blueprintEvidence: "PROVISIONAL_PYQ_WEIGHTING_REQUIRED",
    slotPlan: [
      { kind: "ARITHMETIC_CORE", count: 12 },
      { kind: "GEOMETRY_MENSURATION", count: 5 },
      { kind: "TRIGONOMETRY", count: 4 },
      { kind: "ALGEBRA", count: 3 },
      { kind: "STATISTICS", count: 3 },
      { kind: "PROBABILITY", count: 3 },
    ],
  }),
  profile({
    id: "SSC_CHSL",
    label: "SSC CHSL",
    family: "SSC",
    questionCount: 25,
    expectedOptionCount: 4,
    centralDeliveryProfile: "SSC_CGL_CHSL",
    centralProfileGap: false,
    blueprintEvidence: "PROVISIONAL_PYQ_WEIGHTING_REQUIRED",
    slotPlan: [
      { kind: "ARITHMETIC_CORE", count: 15 },
      { kind: "GEOMETRY_MENSURATION", count: 4 },
      { kind: "TRIGONOMETRY", count: 2 },
      { kind: "ALGEBRA", count: 2 },
      { kind: "PROBABILITY", count: 2 },
    ],
  }),
  profile({
    id: "PSSSB",
    label: "PSSSB",
    family: "PUNJAB_STATE",
    questionCount: 20,
    expectedOptionCount: 4,
    centralDeliveryProfile: null,
    centralProfileGap: true,
    blueprintEvidence: "PROVISIONAL_PYQ_WEIGHTING_REQUIRED",
    slotPlan: [
      { kind: "ARITHMETIC_CORE", count: 14 },
      { kind: "GEOMETRY_MENSURATION", count: 2 },
      { kind: "TRIGONOMETRY", count: 1 },
      { kind: "ALGEBRA", count: 1 },
      { kind: "PROBABILITY", count: 2 },
    ],
  }),
  profile({
    id: "PPSC",
    label: "PPSC",
    family: "PUNJAB_STATE",
    questionCount: 20,
    expectedOptionCount: 4,
    centralDeliveryProfile: null,
    centralProfileGap: true,
    blueprintEvidence: "PROVISIONAL_PYQ_WEIGHTING_REQUIRED",
    slotPlan: [
      { kind: "ARITHMETIC_CORE", count: 14 },
      { kind: "GEOMETRY_MENSURATION", count: 2 },
      { kind: "TRIGONOMETRY", count: 1 },
      { kind: "ALGEBRA", count: 1 },
      { kind: "PROBABILITY", count: 2 },
    ],
  }),
  profile({
    id: "PUNJAB_POLICE",
    label: "Punjab Police",
    family: "PUNJAB_STATE",
    questionCount: 20,
    expectedOptionCount: 4,
    centralDeliveryProfile: null,
    centralProfileGap: true,
    blueprintEvidence: "PROVISIONAL_PYQ_WEIGHTING_REQUIRED",
    slotPlan: [
      { kind: "ARITHMETIC_CORE", count: 15 },
      { kind: "GEOMETRY_MENSURATION", count: 2 },
      { kind: "TRIGONOMETRY", count: 1 },
      { kind: "ALGEBRA", count: 1 },
      { kind: "PROBABILITY", count: 1 },
    ],
  }),
  profile({
    id: "IBPS_PO_PRELIMS",
    label: "IBPS PO Prelims",
    family: "BANKING",
    questionCount: 35,
    expectedOptionCount: 5,
    centralDeliveryProfile: "BANKING_PRELIMS",
    centralProfileGap: false,
    blueprintEvidence: "PROVISIONAL_PYQ_WEIGHTING_REQUIRED",
    slotPlan: [
      { kind: "DATA_INTERPRETATION", count: 10 },
      { kind: "ARITHMETIC_CORE", count: 10 },
      { kind: "SPEED_MATHS", count: 5 },
      { kind: "BANKING_NUMBER_SERIES", count: 5 },
      { kind: "QUANTITY_COMPARISON", count: 3 },
      { kind: "DATA_SUFFICIENCY", count: 2 },
    ],
  }),
  profile({
    id: "IBPS_PO_MAINS",
    label: "IBPS PO Mains",
    family: "BANKING",
    questionCount: 35,
    expectedOptionCount: 5,
    centralDeliveryProfile: "BANKING_MAINS",
    centralProfileGap: false,
    blueprintEvidence: "PROVISIONAL_PYQ_WEIGHTING_REQUIRED",
    slotPlan: [
      { kind: "DATA_INTERPRETATION", count: 15 },
      { kind: "ARITHMETIC_CORE", count: 8 },
      { kind: "SPEED_MATHS", count: 3 },
      { kind: "QUANTITY_COMPARISON", count: 4 },
      { kind: "DATA_SUFFICIENCY", count: 5 },
    ],
  }),
  profile({
    id: "IBPS_CLERK",
    label: "IBPS Clerk",
    family: "BANKING",
    questionCount: 35,
    expectedOptionCount: 5,
    centralDeliveryProfile: "BANKING_PRELIMS",
    centralProfileGap: false,
    blueprintEvidence: "PROVISIONAL_PYQ_WEIGHTING_REQUIRED",
    slotPlan: [
      { kind: "DATA_INTERPRETATION", count: 10 },
      { kind: "ARITHMETIC_CORE", count: 10 },
      { kind: "SPEED_MATHS", count: 8 },
      { kind: "BANKING_NUMBER_SERIES", count: 5 },
      { kind: "QUANTITY_COMPARISON", count: 2 },
    ],
  }),
  profile({
    id: "SBI_PO",
    label: "SBI PO",
    family: "BANKING",
    questionCount: 30,
    expectedOptionCount: 5,
    centralDeliveryProfile: "BANKING_PRELIMS",
    centralProfileGap: false,
    blueprintEvidence: "PROVISIONAL_PYQ_WEIGHTING_REQUIRED",
    slotPlan: [
      { kind: "DATA_INTERPRETATION", count: 10 },
      { kind: "ARITHMETIC_CORE", count: 8 },
      { kind: "SPEED_MATHS", count: 5 },
      { kind: "BANKING_NUMBER_SERIES", count: 4 },
      { kind: "QUANTITY_COMPARISON", count: 3 },
    ],
  }),
  profile({
    id: "IBPS_RRB_BANKING",
    label: "IBPS RRB Banking",
    family: "BANKING",
    questionCount: 40,
    expectedOptionCount: 5,
    centralDeliveryProfile: "BANKING_PRELIMS",
    centralProfileGap: false,
    blueprintEvidence: "PROVISIONAL_PYQ_WEIGHTING_REQUIRED",
    slotPlan: [
      { kind: "DATA_INTERPRETATION", count: 10 },
      { kind: "ARITHMETIC_CORE", count: 15 },
      { kind: "SPEED_MATHS", count: 5 },
      { kind: "BANKING_NUMBER_SERIES", count: 5 },
      { kind: "DATA_SUFFICIENCY", count: 3 },
      { kind: "QUANTITY_COMPARISON", count: 2 },
    ],
  }),
]);

export interface QuantV4SimulatedQuestion {
  readonly examId: QuantV4RealExamId;
  readonly sectionIndex: number;
  readonly ordinal: number;
  readonly slotKind: SimulationSlotKind;
  readonly sourceKind: "RUNTIME_GENERATED" | "CAPABILITY_GAP";
  readonly packageId: string;
  readonly topic: string;
  readonly subtopic: string;
  readonly representation: string;
  readonly difficulty: string;
  readonly text: string;
  readonly explanation: string;
  readonly options: readonly string[];
  readonly optionCount: number;
  readonly expectedOptionCount: 4 | 5;
  readonly questionSpecificExplanation: boolean;
  readonly explanationOptionalSectionIssues: readonly string[];
  readonly semanticExplanationSignature: string;
  readonly normalizedStemSignature: string;
  readonly stemWordCount: number;
  readonly explanationWordCount: number;
  readonly numberTokenCount: number;
  readonly directInverse: "DIRECT" | "INVERSE" | "MIXED_OR_UNKNOWN";
  readonly calculationIntensity: "LOW" | "MEDIUM" | "HIGH";
  readonly testEligible: boolean;
  readonly publiclyPublishable: boolean;
  readonly gapReason?: string;
  readonly stimulusId?: string;
}

export interface QuantV4SimulatedSection {
  readonly authority: typeof QUANT_V4_REAL_EXAM_SIMULATION_AUTHORITY;
  readonly examId: QuantV4RealExamId;
  readonly sectionIndex: number;
  readonly seed: string;
  readonly expectedQuestionCount: number;
  readonly expectedOptionCount: 4 | 5;
  readonly questions: readonly QuantV4SimulatedQuestion[];
}

export interface QuantV4RealExamAuditSummary {
  readonly authority: typeof QUANT_V4_REAL_EXAM_SIMULATION_AUTHORITY;
  readonly examId: QuantV4RealExamId;
  readonly sectionsGenerated: number;
  readonly questionsExpected: number;
  readonly recordsGenerated: number;
  readonly runtimeGeneratedCount: number;
  readonly capabilityGapCount: number;
  readonly centralProfileGap: boolean;
  readonly optionMismatchCount: number;
  readonly emptyExplanationCount: number;
  readonly explanationSpecificityRate: number;
  readonly exactStemDuplicateRate: number;
  readonly semanticExplanationDuplicateRate: number;
  readonly releaseIneligibleCount: number;
  readonly publiclyLockedCount: number;
  readonly representationDistribution: Readonly<Record<string, number>>;
  readonly topicDistribution: Readonly<Record<string, number>>;
  readonly difficultyDistribution: Readonly<Record<string, number>>;
  readonly directInverseDistribution: Readonly<Record<string, number>>;
  readonly calculationIntensityDistribution: Readonly<Record<string, number>>;
  readonly averageStemWords: number;
  readonly averageExplanationWords: number;
  readonly diSetCount: number;
  readonly readiness: SimulationReadiness;
  readonly blockers: readonly string[];
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function words(value: unknown): string[] {
  return String(value ?? "").trim().split(/\s+/u).filter(Boolean);
}

function normalizeStemSignature(value: unknown): string {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/₹|\brs\.?\b|\binr\b/giu, "<money>")
    .replace(/-?\d+(?:\.\d+)?/gu, "<n>")
    .replace(/\b[a-e]\b/giu, "<option>")
    .replace(/[^a-z<>%+*/=\-]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function optionTexts(question: any): string[] {
  const raw = Array.isArray(question?.options) ? question.options : [];
  return raw.map((option: any) =>
    typeof option === "string"
      ? option
      : String(option?.value ?? option?.text ?? option?.label ?? ""),
  );
}

function explanationText(question: any): string {
  if (typeof question?.explanation === "string") return question.explanation.trim();
  if (Array.isArray(question?.explanation?.lines)) return question.explanation.lines.join("\n\n").trim();
  if (Array.isArray(question?.explanation?.steps)) {
    const pieces = [
      question.explanation.keyIdea,
      ...question.explanation.steps,
      question.explanation.shortcut,
      question.explanation.trap,
    ].filter(Boolean);
    return pieces.join("\n\n").trim();
  }
  if (typeof question?.learnerExplanation === "string") return question.learnerExplanation.trim();
  if (Array.isArray(question?.learnerExplanation?.lines)) return question.learnerExplanation.lines.join("\n\n").trim();
  if (Array.isArray(question?.packageExplanation?.lines)) return question.packageExplanation.lines.join("\n\n").trim();
  return "";
}

function questionText(question: any): string {
  return String(question?.text ?? question?.stem ?? question?.question ?? "").trim();
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

function inferCalculationIntensity(question: any, text: string, explanation: string): QuantV4SimulatedQuestion["calculationIntensity"] {
  const source = `${text} ${explanation}`;
  const operators = (source.match(/[=+*/%÷×−-]/gu) ?? []).length;
  const numbers = (source.match(/-?\d+(?:\.\d+)?/gu) ?? []).length;
  const complexityHint = String(question?.difficulty ?? question?.difficultyLabel ?? "").toLowerCase();
  if (operators >= 8 || numbers >= 16 || complexityHint === "hard") return "HIGH";
  if (operators >= 3 || numbers >= 8 || complexityHint === "medium") return "MEDIUM";
  return "LOW";
}

function lifecycleFlag(question: any, positiveNames: readonly string[], negativeValues: readonly string[]): boolean {
  for (const name of positiveNames) {
    const value = question?.[name] ?? question?.metadata?.[name] ?? question?.traceability?.[name];
    if (value === true) return true;
    if (typeof value === "string" && !negativeValues.includes(value.toUpperCase())) return true;
  }
  return false;
}

function runtimeRecord(input: {
  profile: QuantV4RealExamProfile;
  sectionIndex: number;
  ordinal: number;
  slotKind: SimulationSlotKind;
  question: any;
  packageId: string;
  topic: string;
  subtopic: string;
  representation: string;
  stimulusId?: string;
}): QuantV4SimulatedQuestion {
  const text = questionText(input.question);
  const explanation = explanationText(input.question);
  const options = optionTexts(input.question);
  const assessment = assessExplanationQuality({
    packageId: input.packageId,
    questionKey: String(input.question?.questionId ?? `${input.profile.id}:${input.sectionIndex}:${input.ordinal}`),
    stem: text,
    explanation,
    answer: input.question?.answer ?? input.question?.canonicalAnswer?.display ?? input.question?.canonicalAnswer?.value,
    options,
  });
  const testEligible = lifecycleFlag(input.question, ["testEligible", "testEligibility"], ["INELIGIBLE", "NOT_ELIGIBLE", "LOCKED"]);
  const publiclyPublishable = lifecycleFlag(input.question, ["publiclyPublishable", "publicReleaseAuthorized"], ["FALSE", "LOCKED", "NOT_AUTHORIZED"]);

  return Object.freeze({
    examId: input.profile.id,
    sectionIndex: input.sectionIndex,
    ordinal: input.ordinal,
    slotKind: input.slotKind,
    sourceKind: "RUNTIME_GENERATED",
    packageId: input.packageId,
    topic: input.topic,
    subtopic: input.subtopic,
    representation: input.representation,
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
    stemWordCount: words(text).length,
    explanationWordCount: words(explanation).length,
    numberTokenCount: (text.match(/-?\d+(?:\.\d+)?/gu) ?? []).length,
    directInverse: inferDirectInverse(input.question),
    calculationIntensity: inferCalculationIntensity(input.question, text, explanation),
    testEligible,
    publiclyPublishable,
    stimulusId: input.stimulusId,
  });
}

function gapRecord(input: {
  profile: QuantV4RealExamProfile;
  sectionIndex: number;
  ordinal: number;
  slotKind: SimulationSlotKind;
  reason: string;
}): QuantV4SimulatedQuestion {
  return Object.freeze({
    examId: input.profile.id,
    sectionIndex: input.sectionIndex,
    ordinal: input.ordinal,
    slotKind: input.slotKind,
    sourceKind: "CAPABILITY_GAP",
    packageId: "CAPABILITY_GAP",
    topic: "UNFILLED",
    subtopic: input.slotKind,
    representation: "CAPABILITY_GAP",
    difficulty: "UNKNOWN",
    text: "",
    explanation: "",
    options: [],
    optionCount: 0,
    expectedOptionCount: input.profile.expectedOptionCount,
    questionSpecificExplanation: false,
    explanationOptionalSectionIssues: [],
    semanticExplanationSignature: "CAPABILITY_GAP",
    normalizedStemSignature: "CAPABILITY_GAP",
    stemWordCount: 0,
    explanationWordCount: 0,
    numberTokenCount: 0,
    directInverse: "MIXED_OR_UNKNOWN",
    calculationIntensity: "LOW",
    testEligible: false,
    publiclyPublishable: false,
    gapReason: input.reason,
  });
}

function difficultyFor(seed: string): "Easy" | "Medium" | "Hard" {
  const bucket = hash(seed) % 10;
  if (bucket <= 2) return "Easy";
  if (bucket <= 7) return "Medium";
  return "Hard";
}

function probabilityProfile(profile: QuantV4RealExamProfile): string {
  if (profile.id === "SSC_CHSL") return "SSC_CGL_CHSL";
  if (profile.id === "SSC_CGL_TIER_II") return "SSC_CGL_JSO";
  if (profile.family === "BANKING") return profile.centralDeliveryProfile ?? "BANKING_PRELIMS";
  return "SSC_CGL_CHSL";
}

function diProfile(profile: QuantV4RealExamProfile): "SSC_CGL_TIER_I" | "BANKING_PRELIMS" | "BANKING_MAINS" {
  if (profile.centralDeliveryProfile === "BANKING_MAINS") return "BANKING_MAINS";
  if (profile.family === "BANKING") return "BANKING_PRELIMS";
  return "SSC_CGL_TIER_I";
}

function dsProfile(profile: QuantV4RealExamProfile, seed: string): DsfExamAnswerProfileId {
  if (profile.family === "BANKING") {
    return hash(seed) % 2 === 0 ? "BANKING_STANDARD_5_EN" : "BANKING_BOB_2015_5_EN";
  }
  return hash(seed) % 2 === 0 ? "SSC_CGL_TIER2_2023_4_EN" : "SSC_CGL_TIER2_2024_4_EN";
}

function extractBatchQuestions(batch: any): any[] {
  if (Array.isArray(batch?.questions)) return batch.questions;
  if (Array.isArray(batch?.questionPackages)) return batch.questionPackages;
  return [];
}

function packagePool(predicate: (pkg: any) => boolean): any[] {
  return (listQuantV4Packages() as any[])
    .filter((pkg) => pkg?.enabled !== false)
    .filter(predicate)
    .sort((left, right) => String(left.packageId).localeCompare(String(right.packageId)));
}

const ARITHMETIC_POOL = packagePool((pkg) => {
  const topic = String(pkg?.topic ?? "").toLowerCase();
  const subtopic = String(pkg?.subtopic ?? "").toLowerCase();
  const id = String(pkg?.packageId ?? "");
  return topic.includes("arithmetic")
    && !subtopic.includes("probability")
    && !subtopic.includes("simplification")
    && id !== "SAP";
});

const GEOMETRY_MENSURATION_POOL = packagePool((pkg) => {
  const id = String(pkg?.packageId ?? "");
  return id === "GEO-001" || id === "MEN-002";
});

async function generateCoreSlot(
  profile: QuantV4RealExamProfile,
  sectionIndex: number,
  ordinal: number,
  slotKind: "ARITHMETIC_CORE" | "GEOMETRY_MENSURATION",
  seed: string,
): Promise<QuantV4SimulatedQuestion> {
  const pool = slotKind === "ARITHMETIC_CORE" ? ARITHMETIC_POOL : GEOMETRY_MENSURATION_POOL;
  if (!pool.length) {
    return gapRecord({ profile, sectionIndex, ordinal, slotKind, reason: `No ${slotKind} package is exposed through the normal Quant Question Studio registry.` });
  }

  const start = hash(seed) % pool.length;
  const errors: string[] = [];
  for (let offset = 0; offset < pool.length; offset += 1) {
    const pkg = pool[(start + offset) % pool.length]!;
    try {
      const batch = await generateQuantQuestion({
        packageId: pkg.packageId as any,
        language: "en",
        difficulty: difficultyFor(`${seed}:difficulty`),
        examProfile: profile.centralDeliveryProfile ?? undefined,
        seed,
        count: 1,
      } as any);
      const question = extractBatchQuestions(batch)[0];
      if (!question) throw new Error("runtime returned no question");
      return runtimeRecord({
        profile,
        sectionIndex,
        ordinal,
        slotKind,
        question,
        packageId: String(question?.packageId ?? pkg.packageId),
        topic: String(question?.topic ?? pkg.topic ?? (slotKind === "ARITHMETIC_CORE" ? "Arithmetic" : "Advanced Mathematics")),
        subtopic: String(question?.subtopic ?? pkg.subtopic ?? slotKind),
        representation: "DIRECT_MCQ",
      });
    } catch (error) {
      errors.push(`${pkg.packageId}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return gapRecord({
    profile,
    sectionIndex,
    ordinal,
    slotKind,
    reason: `All ${slotKind} runtime candidates failed: ${errors.slice(0, 3).join(" | ")}`,
  });
}

async function generateProbabilitySlot(
  profile: QuantV4RealExamProfile,
  sectionIndex: number,
  ordinal: number,
  seed: string,
): Promise<QuantV4SimulatedQuestion> {
  try {
    const packageId = hash(seed) % 2 === 0 ? "PRB-001" : "PRB-002";
    const batch = await generateQuantQuestion({
      packageId: packageId as any,
      language: "en",
      difficulty: difficultyFor(`${seed}:difficulty`),
      examProfile: probabilityProfile(profile) as any,
      seed,
      count: 1,
    } as any);
    const question = extractBatchQuestions(batch)[0];
    if (!question) throw new Error("Probability runtime returned no question.");
    return runtimeRecord({
      profile,
      sectionIndex,
      ordinal,
      slotKind: "PROBABILITY",
      question,
      packageId,
      topic: "Advanced Mathematics",
      subtopic: "Probability",
      representation: "DIRECT_MCQ",
    });
  } catch (error) {
    return gapRecord({ profile, sectionIndex, ordinal, slotKind: "PROBABILITY", reason: error instanceof Error ? error.message : String(error) });
  }
}

function generateStatisticsSlot(
  profile: QuantV4RealExamProfile,
  sectionIndex: number,
  ordinal: number,
  seed: string,
): QuantV4SimulatedQuestion {
  if (profile.id !== "SSC_CGL_TIER_II") {
    return gapRecord({ profile, sectionIndex, ordinal, slotKind: "STATISTICS", reason: "STAT-001 currently owns only SSC CGL Tier-II/JSO central-tendency review profiles." });
  }
  try {
    const contractId = STA001_CONTRACTS[hash(seed) % STA001_CONTRACTS.length]!;
    const question = generateSta001Question({
      seed,
      examProfile: hash(`${seed}:profile`) % 2 === 0 ? "SSC_CGL_TIER_II" : "SSC_CGL_JSO",
      contractId,
      difficulty: difficultyFor(`${seed}:difficulty`),
    } as any);
    return runtimeRecord({
      profile,
      sectionIndex,
      ordinal,
      slotKind: "STATISTICS",
      question,
      packageId: "STAT-001",
      topic: "Statistics",
      subtopic: "Measures of Central Tendency",
      representation: "DIRECT_MCQ",
    });
  } catch (error) {
    return gapRecord({ profile, sectionIndex, ordinal, slotKind: "STATISTICS", reason: error instanceof Error ? error.message : String(error) });
  }
}

const DI_PRELIMS_GENERATORS = [
  ["DI-001", generateDi001TableSet, "TABLE_DI"],
  ["DI-002", generateDi002AdvancedTableSet, "ADVANCED_TABLE_DI"],
  ["DI-003", generateDi003GroupedBarSet, "GROUPED_BAR_DI"],
  ["DI-004", generateDi004LineSet, "LINE_DI"],
  ["DI-005", generateDi005PieSet, "PIE_DI"],
  ["DI-006", generateDi006CaseletSet, "CASELET_DI"],
] as const;

const DI_MAINS_GENERATORS = [
  ["DI-007", generateDi007MissingSet, "MISSING_DI"],
  ["DI-008", generateDi008ArithmeticSet, "ARITHMETIC_DI"],
] as const;

function generateDiQuestions(
  profile: QuantV4RealExamProfile,
  sectionIndex: number,
  startOrdinal: number,
  requestedCount: number,
  seed: string,
): QuantV4SimulatedQuestion[] {
  const output: QuantV4SimulatedQuestion[] = [];
  let setIndex = 0;
  while (output.length < requestedCount) {
    const generators = profile.centralDeliveryProfile === "BANKING_MAINS" ? DI_MAINS_GENERATORS : DI_PRELIMS_GENERATORS;
    const [packageId, generate, representation] = generators[hash(`${seed}:set:${setIndex}`) % generators.length]!;
    try {
      const set = generate({ seed: `${seed}:set:${setIndex}`, examProfile: diProfile(profile) } as any) as any;
      const questions = Array.isArray(set?.questions) ? set.questions : [];
      if (!questions.length) throw new Error(`${packageId} returned no linked questions.`);
      const stimulusId = String(set?.setId ?? set?.stimulusId ?? `${packageId}:${seed}:set:${setIndex}`);
      for (const question of questions) {
        if (output.length >= requestedCount) break;
        output.push(runtimeRecord({
          profile,
          sectionIndex,
          ordinal: startOrdinal + output.length,
          slotKind: "DATA_INTERPRETATION",
          question,
          packageId,
          topic: "Data Interpretation",
          subtopic: representation,
          representation,
          stimulusId,
        }));
      }
    } catch (error) {
      output.push(gapRecord({
        profile,
        sectionIndex,
        ordinal: startOrdinal + output.length,
        slotKind: "DATA_INTERPRETATION",
        reason: error instanceof Error ? error.message : String(error),
      }));
    }
    setIndex += 1;
    if (setIndex > requestedCount + 5) break;
  }
  while (output.length < requestedCount) {
    output.push(gapRecord({
      profile,
      sectionIndex,
      ordinal: startOrdinal + output.length,
      slotKind: "DATA_INTERPRETATION",
      reason: "DI runtime could not fill the requested linked-question count.",
    }));
  }
  return output;
}

async function generateSpeedMathsSlot(
  profile: QuantV4RealExamProfile,
  sectionIndex: number,
  ordinal: number,
  seed: string,
): Promise<QuantV4SimulatedQuestion> {
  if (profile.family !== "BANKING") {
    return gapRecord({ profile, sectionIndex, ordinal, slotKind: "SPEED_MATHS", reason: "Banking Speed Maths is a banking-only representation." });
  }
  try {
    const batch = await generateQuantQuestion({
      packageId: "SAP" as any,
      examProfile: profile.centralDeliveryProfile === "BANKING_MAINS" ? "BANKING_MAINS" : "BANKING_PRELIMS",
      language: "en",
      difficulty: difficultyFor(`${seed}:difficulty`),
      seed,
      count: 1,
    } as any);
    const question = extractBatchQuestions(batch)[0];
    if (!question) throw new Error("SAP banking runtime returned no question.");
    return runtimeRecord({
      profile,
      sectionIndex,
      ordinal,
      slotKind: "SPEED_MATHS",
      question,
      packageId: "SAP",
      topic: "Speed Mathematics",
      subtopic: "Simplification & Approximation",
      representation: "SPEED_MATHS",
    });
  } catch (error) {
    return gapRecord({ profile, sectionIndex, ordinal, slotKind: "SPEED_MATHS", reason: error instanceof Error ? error.message : String(error) });
  }
}

function generateBnsSlot(
  profile: QuantV4RealExamProfile,
  sectionIndex: number,
  ordinal: number,
  seed: string,
): QuantV4SimulatedQuestion {
  if (profile.centralDeliveryProfile === "BANKING_MAINS") {
    return gapRecord({ profile, sectionIndex, ordinal, slotKind: "BANKING_NUMBER_SERIES", reason: "BNS-001 currently owns BANKING_PRELIMS only; a mains-specific number-series profile is not frozen." });
  }
  try {
    const question = generateBns001Question({ seed });
    return runtimeRecord({
      profile,
      sectionIndex,
      ordinal,
      slotKind: "BANKING_NUMBER_SERIES",
      question,
      packageId: "BNS-001",
      topic: "Speed Mathematics",
      subtopic: "Banking Number Series",
      representation: "NUMBER_SERIES",
    });
  } catch (error) {
    return gapRecord({ profile, sectionIndex, ordinal, slotKind: "BANKING_NUMBER_SERIES", reason: error instanceof Error ? error.message : String(error) });
  }
}

function generateQcSlot(
  profile: QuantV4RealExamProfile,
  sectionIndex: number,
  ordinal: number,
  seed: string,
): QuantV4SimulatedQuestion {
  try {
    const question = generateQcp001Question({
      seed,
      examProfile: profile.centralDeliveryProfile === "BANKING_MAINS" ? "BANKING_MAINS" : "BANKING_PRELIMS",
    });
    return runtimeRecord({
      profile,
      sectionIndex,
      ordinal,
      slotKind: "QUANTITY_COMPARISON",
      question,
      packageId: "QCP-001",
      topic: "Representation",
      subtopic: "Quantity Comparison",
      representation: "QUANTITY_I_II",
    });
  } catch (error) {
    return gapRecord({ profile, sectionIndex, ordinal, slotKind: "QUANTITY_COMPARISON", reason: error instanceof Error ? error.message : String(error) });
  }
}

function generateDsSlot(
  profile: QuantV4RealExamProfile,
  sectionIndex: number,
  ordinal: number,
  seed: string,
): QuantV4SimulatedQuestion {
  if (profile.family === "PUNJAB_STATE") {
    return gapRecord({ profile, sectionIndex, ordinal, slotKind: "DATA_SUFFICIENCY", reason: "DSF-CP-003 explicitly keeps Punjab State exam-specific answer contracts disabled pending stronger source evidence." });
  }
  try {
    const domains = ["NUMBER_SYSTEM", "RATIO_PROPORTION", "PERCENTAGE", "ALGEBRA"] as const;
    const result = generateDsfExamProfileBatch({
      answerProfile: dsProfile(profile, seed),
      domain: domains[hash(`${seed}:domain`) % domains.length],
      language: "en",
      count: 1,
      seed,
    } as any) as any;
    const question = result?.questions?.[0];
    if (!question) throw new Error("DSF exam-profile runtime returned no question.");
    return runtimeRecord({
      profile,
      sectionIndex,
      ordinal,
      slotKind: "DATA_SUFFICIENCY",
      question,
      packageId: "DSF-001",
      topic: "Representation",
      subtopic: "Data Sufficiency",
      representation: "DATA_SUFFICIENCY",
    });
  } catch (error) {
    return gapRecord({ profile, sectionIndex, ordinal, slotKind: "DATA_SUFFICIENCY", reason: error instanceof Error ? error.message : String(error) });
  }
}

async function generateOneSlot(
  profile: QuantV4RealExamProfile,
  sectionIndex: number,
  ordinal: number,
  slotKind: Exclude<SimulationSlotKind, "DATA_INTERPRETATION">,
  seed: string,
): Promise<QuantV4SimulatedQuestion> {
  switch (slotKind) {
    case "ARITHMETIC_CORE":
    case "GEOMETRY_MENSURATION":
      return generateCoreSlot(profile, sectionIndex, ordinal, slotKind, seed);
    case "PROBABILITY":
      return generateProbabilitySlot(profile, sectionIndex, ordinal, seed);
    case "STATISTICS":
      return generateStatisticsSlot(profile, sectionIndex, ordinal, seed);
    case "SPEED_MATHS":
      return generateSpeedMathsSlot(profile, sectionIndex, ordinal, seed);
    case "BANKING_NUMBER_SERIES":
      return generateBnsSlot(profile, sectionIndex, ordinal, seed);
    case "QUANTITY_COMPARISON":
      return generateQcSlot(profile, sectionIndex, ordinal, seed);
    case "DATA_SUFFICIENCY":
      return generateDsSlot(profile, sectionIndex, ordinal, seed);
    case "TRIGONOMETRY":
      return gapRecord({
        profile,
        sectionIndex,
        ordinal,
        slotKind,
        reason: "TRG-001/TRG-002 are internally activated but are not yet exposed through the central Quant section-simulation generation contract.",
      });
    case "ALGEBRA":
      return gapRecord({
        profile,
        sectionIndex,
        ordinal,
        slotKind,
        reason: "Algebra is productionized BANK_ONLY, but no central Quant section-simulation adapter exists yet for deterministic exam-profile sampling.",
      });
  }
}

export async function generateQuantV4RealExamSection(input: {
  examId: QuantV4RealExamId;
  sectionIndex: number;
  seed?: string;
}): Promise<QuantV4SimulatedSection> {
  const exam = QUANT_V4_REAL_EXAM_PROFILES.find((entry) => entry.id === input.examId);
  if (!exam) throw new Error(`Unknown Quant V4 real-exam simulation profile ${input.examId}.`);
  const sectionIndex = Math.max(1, Math.floor(input.sectionIndex));
  const seed = input.seed ?? `${QUANT_V4_REAL_EXAM_SIMULATION_AUTHORITY}:${exam.id}:section:${sectionIndex}`;
  const questions: QuantV4SimulatedQuestion[] = [];

  for (const slot of exam.slotPlan) {
    if (slot.kind === "DATA_INTERPRETATION") {
      questions.push(...generateDiQuestions(exam, sectionIndex, questions.length + 1, slot.count, `${seed}:${slot.kind}`));
      continue;
    }
    for (let index = 0; index < slot.count; index += 1) {
      const ordinal = questions.length + 1;
      questions.push(await generateOneSlot(exam, sectionIndex, ordinal, slot.kind, `${seed}:${slot.kind}:${index}`));
    }
  }

  if (questions.length !== exam.questionCount) {
    throw new Error(`${exam.id} blueprint generated ${questions.length}/${exam.questionCount} section records.`);
  }

  return Object.freeze({
    authority: QUANT_V4_REAL_EXAM_SIMULATION_AUTHORITY,
    examId: exam.id,
    sectionIndex,
    seed,
    expectedQuestionCount: exam.questionCount,
    expectedOptionCount: exam.expectedOptionCount,
    questions: Object.freeze(questions),
  });
}

function countBy<T>(items: readonly T[], key: (item: T) => string): Record<string, number> {
  const result: Record<string, number> = {};
  for (const item of items) {
    const value = key(item);
    result[value] = (result[value] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(result).sort(([left], [right]) => left.localeCompare(right)));
}

function duplicateRate(signatures: readonly string[]): number {
  const filtered = signatures.filter((entry) => entry && entry !== "CAPABILITY_GAP");
  if (!filtered.length) return 0;
  const counts = countBy(filtered, (entry) => entry);
  const duplicateItems = Object.values(counts).reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  return duplicateItems / filtered.length;
}

function average(values: readonly number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function summarizeQuantV4RealExamSections(
  profile: QuantV4RealExamProfile,
  sections: readonly QuantV4SimulatedSection[],
): QuantV4RealExamAuditSummary {
  const questions = sections.flatMap((section) => section.questions);
  const runtimeQuestions = questions.filter((question) => question.sourceKind === "RUNTIME_GENERATED");
  const capabilityGapCount = questions.length - runtimeQuestions.length;
  const optionMismatchCount = runtimeQuestions.filter((question) => question.optionCount !== profile.expectedOptionCount).length;
  const emptyExplanationCount = runtimeQuestions.filter((question) => !question.explanation.trim()).length;
  const specificExplanationCount = runtimeQuestions.filter((question) => question.questionSpecificExplanation).length;
  const releaseIneligibleCount = runtimeQuestions.filter((question) => !question.testEligible).length;
  const publiclyLockedCount = runtimeQuestions.filter((question) => !question.publiclyPublishable).length;
  const stimulusIds = new Set(runtimeQuestions.map((question) => question.stimulusId).filter(Boolean));

  const blockers: string[] = [];
  if (profile.centralProfileGap) blockers.push("CENTRAL_EXAM_PROFILE_MISSING");
  if (capabilityGapCount) blockers.push("CAPABILITY_GAPS_PRESENT");
  if (optionMismatchCount) blockers.push("OPTION_COUNT_PROFILE_DRIFT");
  if (emptyExplanationCount) blockers.push("EMPTY_EXPLANATIONS_PRESENT");
  const explanationSpecificityRate = runtimeQuestions.length ? specificExplanationCount / runtimeQuestions.length : 0;
  if (explanationSpecificityRate < 0.9) blockers.push("EXPLANATION_SPECIFICITY_BELOW_90_PERCENT");
  const exactStemDuplicateRate = duplicateRate(runtimeQuestions.map((question) => question.normalizedStemSignature));
  if (exactStemDuplicateRate > 0.05) blockers.push("STEM_REPETITION_ABOVE_5_PERCENT");
  const semanticExplanationDuplicateRate = duplicateRate(runtimeQuestions.map((question) => question.semanticExplanationSignature));
  if (semanticExplanationDuplicateRate > 0.2) blockers.push("EXPLANATION_REPETITION_ABOVE_20_PERCENT");
  if (releaseIneligibleCount) blockers.push("TEST_INELIGIBLE_RUNTIME_CONTENT_PRESENT");
  if (profile.blueprintEvidence !== "STRUCTURAL_BASELINE") blockers.push("PYQ_FREQUENCY_WEIGHTING_PENDING");

  return Object.freeze({
    authority: QUANT_V4_REAL_EXAM_SIMULATION_AUTHORITY,
    examId: profile.id,
    sectionsGenerated: sections.length,
    questionsExpected: profile.questionCount * sections.length,
    recordsGenerated: questions.length,
    runtimeGeneratedCount: runtimeQuestions.length,
    capabilityGapCount,
    centralProfileGap: profile.centralProfileGap,
    optionMismatchCount,
    emptyExplanationCount,
    explanationSpecificityRate,
    exactStemDuplicateRate,
    semanticExplanationDuplicateRate,
    releaseIneligibleCount,
    publiclyLockedCount,
    representationDistribution: countBy(runtimeQuestions, (question) => question.representation),
    topicDistribution: countBy(runtimeQuestions, (question) => question.topic),
    difficultyDistribution: countBy(runtimeQuestions, (question) => question.difficulty),
    directInverseDistribution: countBy(runtimeQuestions, (question) => question.directInverse),
    calculationIntensityDistribution: countBy(runtimeQuestions, (question) => question.calculationIntensity),
    averageStemWords: average(runtimeQuestions.map((question) => question.stemWordCount)),
    averageExplanationWords: average(runtimeQuestions.map((question) => question.explanationWordCount)),
    diSetCount: stimulusIds.size,
    readiness: blockers.length ? "EXAM_SIMULATION_NOT_READY" : "EXAM_SIMULATION_READY_CANDIDATE",
    blockers: Object.freeze([...new Set(blockers)]),
  });
}

export async function runQuantV4RealExamSimulationAudit(input: {
  sectionsPerProfile?: number;
  profileIds?: readonly QuantV4RealExamId[];
  seedPrefix?: string;
} = {}) {
  const sectionsPerProfile = Math.max(
    QUANT_V4_REAL_EXAM_MIN_SECTIONS_PER_PROFILE,
    Math.floor(input.sectionsPerProfile ?? QUANT_V4_REAL_EXAM_MIN_SECTIONS_PER_PROFILE),
  );
  const selected = input.profileIds?.length
    ? QUANT_V4_REAL_EXAM_PROFILES.filter((profile) => input.profileIds!.includes(profile.id))
    : QUANT_V4_REAL_EXAM_PROFILES;
  const summaries: QuantV4RealExamAuditSummary[] = [];

  for (const exam of selected) {
    const sections: QuantV4SimulatedSection[] = [];
    for (let sectionIndex = 1; sectionIndex <= sectionsPerProfile; sectionIndex += 1) {
      sections.push(await generateQuantV4RealExamSection({
        examId: exam.id,
        sectionIndex,
        seed: `${input.seedPrefix ?? QUANT_V4_REAL_EXAM_SIMULATION_AUTHORITY}:${exam.id}:${sectionIndex}`,
      }));
    }
    summaries.push(summarizeQuantV4RealExamSections(exam, sections));
  }

  return Object.freeze({
    authority: QUANT_V4_REAL_EXAM_SIMULATION_AUTHORITY,
    sectionsPerProfile,
    profilesAudited: summaries.length,
    totalSections: summaries.length * sectionsPerProfile,
    summaries: Object.freeze(summaries),
  });
}

export function semanticExplanationDuplicateKey(question: QuantV4SimulatedQuestion): string {
  return semanticExplanationSignature(question.explanation);
}
