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
import {
  generateQuantV4AdvancedMathSectionQuestion,
} from "./quant-v4-real-exam-advanced-math-adapters-p2";
import {
  generateQuantV4RealExamSectionWithAdvancedMath,
} from "./quant-v4-real-exam-advanced-math-integration-p2";
import {
  QUANT_V4_REAL_EXAM_PROFILES,
  type QuantV4RealExamProfile,
} from "./quant-v4-real-exam-simulation-p2";
import {
  buildQuantV4CglTier1ShadowFrequencyGovernance,
  type QuantV4CglTier1ShadowSlotKind,
} from "./quant-v4-cgl-tier1-shadow-frequency-governance-p3";

export const QUANT_V4_CGL_TIER1_SHADOW_SIMULATION_AUTHORITY =
  "QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-P3" as const;

export const QUANT_V4_CGL_TIER1_SHADOW_SIMULATION_SECTIONS = 20 as const;

export type QuantV4CglTier1ShadowSimulationStatus =
  | "SHADOW_SIMULATION_HOLD"
  | "SHADOW_SIMULATION_CANDIDATE";

export interface QuantV4CglTier1ShadowQuestionRecord {
  readonly sectionIndex: number;
  readonly ordinal: number;
  readonly slotKind: QuantV4CglTier1ShadowSlotKind;
  readonly sourceKind: "RUNTIME_GENERATED" | "CAPABILITY_GAP";
  readonly packageId: string;
  readonly questionId?: string;
  readonly canonicalProblemId?: string;
  readonly questionLanguageId?: string;
  readonly taskKind?: string;
  readonly optionCount: number;
  readonly emptyExplanation: boolean;
  readonly literalStemSignature: string;
  readonly normalizedStemSignature: string;
  readonly testEligible: boolean | null;
  readonly publiclyPublishable: boolean | null;
  readonly bankOnly: boolean;
  readonly gapReason?: string;
}

export interface QuantV4CglTier1ShadowSection {
  readonly sectionIndex: number;
  readonly expectedQuestionCount: 25;
  readonly records: readonly QuantV4CglTier1ShadowQuestionRecord[];
}

export interface QuantV4CglTier1ShadowSimulationAudit {
  readonly authority: typeof QUANT_V4_CGL_TIER1_SHADOW_SIMULATION_AUTHORITY;
  readonly status: QuantV4CglTier1ShadowSimulationStatus;
  readonly sectionsGenerated: number;
  readonly questionsExpected: number;
  readonly recordsGenerated: number;
  readonly runtimeGeneratedCount: number;
  readonly capabilityGapCount: number;
  readonly advancedMathCapabilityGapCount: number;
  readonly structuralCapabilityGapCount: number;
  readonly structuralCapabilityGapsPerSection: number;
  readonly currentStructuralCapabilityGapsPerSection: number;
  readonly baseSimulatorHistoricalAdvancedMathGapsPerSection: number;
  readonly currentBaselineCapabilityGapCount: number;
  readonly currentBaselineAlgebraBankOnlyCount: number;
  readonly algebraRecordCount: number;
  readonly algebraBankOnlyCount: number;
  readonly trigonometryRecordCount: number;
  readonly trigonometryTestEligibleCount: number;
  readonly optionMismatchCount: number;
  readonly emptyExplanationCount: number;
  readonly literalStemDuplicateRate: number;
  readonly normalizedStructuralStemReuseRate: number;
  readonly slotDistribution: Readonly<Record<string, number>>;
  readonly packageDistribution: Readonly<Record<string, number>>;
  readonly blockers: readonly string[];
  readonly productionPromotionAuthorized: false;
  readonly runtimeBlueprintMutationAuthorized: false;
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function optionTexts(question: any): string[] {
  const raw = Array.isArray(question?.options) ? question.options : [];
  return raw.map((option: any) =>
    typeof option === "string"
      ? option
      : String(option?.value ?? option?.text ?? option?.label ?? ""),
  );
}

function questionText(question: any): string {
  return String(question?.text ?? question?.stem ?? question?.question ?? "").trim();
}

function literalStemSignature(value: unknown): string {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/\s+/gu, " ")
    .trim();
}

function metadataValue(question: any, key: string): string | undefined {
  const value =
    question?.[key] ??
    question?.traceability?.[key] ??
    question?.parameters?.[key] ??
    question?.sourceQuestion?.[key] ??
    question?.sourceQuestion?.traceability?.[key];
  const text = String(value ?? "").trim();
  return text || undefined;
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

function triState(value: unknown): boolean | null {
  return value === true ? true : value === false ? false : null;
}

function isBankOnlyQuestion(question: any): boolean {
  return [
    question?.questionBankAcceptanceMode,
    question?.lifecycleStage,
    question?.questionBankStatus,
  ].some((value) => String(value ?? "").toUpperCase().includes("BANK_ONLY"));
}

function extractBatchQuestions(batch: any): any[] {
  if (Array.isArray(batch?.questions)) return batch.questions;
  if (Array.isArray(batch?.questionPackages)) return batch.questionPackages;
  return [];
}

function countBy<T>(items: readonly T[], key: (item: T) => string): Readonly<Record<string, number>> {
  const result: Record<string, number> = {};
  for (const item of items) {
    const value = key(item);
    result[value] = (result[value] ?? 0) + 1;
  }
  return Object.freeze(Object.fromEntries(Object.entries(result).sort(([left], [right]) => left.localeCompare(right))));
}

function duplicateRate(signatures: readonly string[]): number {
  const filtered = signatures.filter(Boolean);
  if (!filtered.length) return 0;
  const counts = countBy(filtered, (entry) => entry);
  const duplicateItems = Object.values(counts).reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  return duplicateItems / filtered.length;
}

function profile(): QuantV4RealExamProfile {
  const found = QUANT_V4_REAL_EXAM_PROFILES.find((entry) => entry.id === "SSC_CGL_TIER_I");
  if (!found) throw new Error("SSC_CGL_TIER_I real-exam profile is missing.");
  return found;
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

const DI_GENERATORS = [
  ["DI-001", generateDi001TableSet],
  ["DI-002", generateDi002AdvancedTableSet],
  ["DI-003", generateDi003GroupedBarSet],
  ["DI-004", generateDi004LineSet],
  ["DI-005", generateDi005PieSet],
  ["DI-006", generateDi006CaseletSet],
] as const;

function runtimeRecord(input: {
  sectionIndex: number;
  ordinal: number;
  slotKind: QuantV4CglTier1ShadowSlotKind;
  packageId: string;
  question: any;
}): QuantV4CglTier1ShadowQuestionRecord {
  const stem = questionText(input.question);
  const explanation = explanationText(input.question);
  return Object.freeze({
    sectionIndex: input.sectionIndex,
    ordinal: input.ordinal,
    slotKind: input.slotKind,
    sourceKind: "RUNTIME_GENERATED",
    packageId: input.packageId,
    questionId: metadataValue(input.question, "questionId"),
    canonicalProblemId: metadataValue(input.question, "canonicalProblemId"),
    questionLanguageId: metadataValue(input.question, "questionLanguageId"),
    taskKind:
      metadataValue(input.question, "taskKind") ??
      metadataValue(input.question, "kind"),
    optionCount: optionTexts(input.question).length,
    emptyExplanation: !explanation,
    literalStemSignature: literalStemSignature(stem),
    normalizedStemSignature: normalizeStemSignature(stem),
    testEligible: triState(input.question?.testEligible),
    publiclyPublishable: triState(input.question?.publiclyPublishable),
    bankOnly: isBankOnlyQuestion(input.question),
  });
}

function gapRecord(input: {
  sectionIndex: number;
  ordinal: number;
  slotKind: QuantV4CglTier1ShadowSlotKind;
  reason: string;
}): QuantV4CglTier1ShadowQuestionRecord {
  return Object.freeze({
    sectionIndex: input.sectionIndex,
    ordinal: input.ordinal,
    slotKind: input.slotKind,
    sourceKind: "CAPABILITY_GAP",
    packageId: "CAPABILITY_GAP",
    optionCount: 0,
    emptyExplanation: true,
    literalStemSignature: "",
    normalizedStemSignature: "",
    testEligible: null,
    publiclyPublishable: null,
    bankOnly: false,
    gapReason: input.reason,
  });
}

async function generateCoreRecord(input: {
  sectionIndex: number;
  ordinal: number;
  slotKind: "ARITHMETIC_CORE" | "GEOMETRY_MENSURATION";
  seed: string;
}): Promise<QuantV4CglTier1ShadowQuestionRecord> {
  const pool = input.slotKind === "ARITHMETIC_CORE" ? ARITHMETIC_POOL : GEOMETRY_MENSURATION_POOL;
  if (!pool.length) {
    return gapRecord({ ...input, reason: `No ${input.slotKind} package is exposed through Question Studio.` });
  }
  const start = hash(input.seed) % pool.length;
  const errors: string[] = [];
  for (let offset = 0; offset < pool.length; offset += 1) {
    const pkg = pool[(start + offset) % pool.length]!;
    try {
      const batch = await generateQuantQuestion({
        packageId: pkg.packageId as any,
        language: "en",
        examProfile: "SSC_CGL_TIER_I",
        seed: input.seed,
        count: 1,
      } as any);
      const question = extractBatchQuestions(batch)[0];
      if (!question) throw new Error("runtime returned no question");
      return runtimeRecord({
        sectionIndex: input.sectionIndex,
        ordinal: input.ordinal,
        slotKind: input.slotKind,
        packageId: String(question?.packageId ?? pkg.packageId),
        question,
      });
    } catch (error) {
      errors.push(`${pkg.packageId}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return gapRecord({
    ...input,
    reason: `All ${input.slotKind} candidates failed: ${errors.slice(0, 3).join(" | ")}`,
  });
}

function generateDiRecords(input: {
  sectionIndex: number;
  startOrdinal: number;
  requestedCount: number;
  seed: string;
}): QuantV4CglTier1ShadowQuestionRecord[] {
  const records: QuantV4CglTier1ShadowQuestionRecord[] = [];
  let setIndex = 0;
  while (records.length < input.requestedCount && setIndex < input.requestedCount + 6) {
    const setSeed = `${input.seed}:set:${setIndex}`;
    const [packageId, generate] = DI_GENERATORS[hash(setSeed) % DI_GENERATORS.length]!;
    try {
      const set = generate({ seed: setSeed, examProfile: "SSC_CGL_TIER_I" } as any) as any;
      const questions = Array.isArray(set?.questions) ? set.questions : [];
      if (!questions.length) throw new Error(`${packageId} returned no questions.`);

      const remaining = input.requestedCount - records.length;
      const takeCount = Math.min(remaining, questions.length);
      const startQuestionIndex = hash(`${setSeed}:question-window`) % questions.length;
      for (let offset = 0; offset < takeCount; offset += 1) {
        const question = questions[(startQuestionIndex + offset) % questions.length]!;
        records.push(runtimeRecord({
          sectionIndex: input.sectionIndex,
          ordinal: input.startOrdinal + records.length,
          slotKind: "DATA_INTERPRETATION",
          packageId,
          question,
        }));
      }
    } catch (error) {
      records.push(gapRecord({
        sectionIndex: input.sectionIndex,
        ordinal: input.startOrdinal + records.length,
        slotKind: "DATA_INTERPRETATION",
        reason: error instanceof Error ? error.message : String(error),
      }));
    }
    setIndex += 1;
  }
  while (records.length < input.requestedCount) {
    records.push(gapRecord({
      sectionIndex: input.sectionIndex,
      ordinal: input.startOrdinal + records.length,
      slotKind: "DATA_INTERPRETATION",
      reason: "DI shadow runtime could not fill the requested count.",
    }));
  }
  return records;
}

async function generateAdvancedMathRecord(input: {
  sectionIndex: number;
  ordinal: number;
  slotKind: "ALGEBRA" | "TRIGONOMETRY";
  seed: string;
}): Promise<QuantV4CglTier1ShadowQuestionRecord> {
  try {
    const result = await generateQuantV4AdvancedMathSectionQuestion({
      examId: "SSC_CGL_TIER_I",
      slotKind: input.slotKind,
      seed: input.seed,
    });
    return runtimeRecord({
      sectionIndex: input.sectionIndex,
      ordinal: input.ordinal,
      slotKind: input.slotKind,
      packageId: result.packageId,
      question: result.question,
    });
  } catch (error) {
    return gapRecord({
      ...input,
      reason: `Advanced Mathematics adapter failed: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

export async function generateQuantV4CglTier1ShadowSection(input: {
  readonly sectionIndex: number;
  readonly seed?: string;
}): Promise<QuantV4CglTier1ShadowSection> {
  const current = profile();
  const governance = buildQuantV4CglTier1ShadowFrequencyGovernance({ currentSlotPlan: current.slotPlan });
  if (governance.status !== "SHADOW_EMPIRICAL_CANDIDATE_LOCKED") {
    throw new Error(`Shadow frequency governance is not candidate: ${governance.evidenceBlockers.join(", ")}`);
  }

  const sectionIndex = Math.max(1, Math.floor(input.sectionIndex));
  const seed = input.seed ?? `${QUANT_V4_CGL_TIER1_SHADOW_SIMULATION_AUTHORITY}:${sectionIndex}`;
  const records: QuantV4CglTier1ShadowQuestionRecord[] = [];

  for (const slot of governance.shadowSlotPlan) {
    if (slot.kind === "DATA_INTERPRETATION") {
      records.push(...generateDiRecords({
        sectionIndex,
        startOrdinal: records.length + 1,
        requestedCount: slot.shadowQuestionCount,
        seed: `${seed}:${slot.kind}`,
      }));
      continue;
    }

    for (let index = 0; index < slot.shadowQuestionCount; index += 1) {
      const ordinal = records.length + 1;
      const slotSeed = `${seed}:${slot.kind}:${index}`;
      if (slot.kind === "ARITHMETIC_CORE" || slot.kind === "GEOMETRY_MENSURATION") {
        records.push(await generateCoreRecord({ sectionIndex, ordinal, slotKind: slot.kind, seed: slotSeed }));
      } else if (slot.kind === "ALGEBRA" || slot.kind === "TRIGONOMETRY") {
        records.push(await generateAdvancedMathRecord({ sectionIndex, ordinal, slotKind: slot.kind, seed: slotSeed }));
      } else {
        records.push(gapRecord({
          sectionIndex,
          ordinal,
          slotKind: slot.kind,
          reason: `${slot.kind} is not part of the empirical shadow candidate plan.`,
        }));
      }
    }
  }

  if (records.length !== 25) {
    throw new Error(`Shadow section generated ${records.length}/25 records.`);
  }

  return Object.freeze({
    sectionIndex,
    expectedQuestionCount: 25,
    records: Object.freeze(records),
  });
}

export async function runQuantV4CglTier1ShadowSimulationAudit(input: {
  readonly sections?: number;
  readonly seedPrefix?: string;
} = {}): Promise<QuantV4CglTier1ShadowSimulationAudit> {
  const current = profile();
  const governance = buildQuantV4CglTier1ShadowFrequencyGovernance({ currentSlotPlan: current.slotPlan });
  const sections = Math.max(1, Math.floor(input.sections ?? QUANT_V4_CGL_TIER1_SHADOW_SIMULATION_SECTIONS));
  const seedPrefix = input.seedPrefix ?? QUANT_V4_CGL_TIER1_SHADOW_SIMULATION_AUTHORITY;

  const shadowSections: QuantV4CglTier1ShadowSection[] = [];
  const integratedBaselineSections = [];
  for (let sectionIndex = 1; sectionIndex <= sections; sectionIndex += 1) {
    shadowSections.push(await generateQuantV4CglTier1ShadowSection({
      sectionIndex,
      seed: `${seedPrefix}:shadow:${sectionIndex}`,
    }));
    integratedBaselineSections.push(await generateQuantV4RealExamSectionWithAdvancedMath({
      examId: "SSC_CGL_TIER_I",
      sectionIndex,
      seed: `${seedPrefix}:baseline-integrated:${sectionIndex}`,
    }));
  }

  const records = shadowSections.flatMap((section) => section.records);
  const runtimeRecords = records.filter((record) => record.sourceKind === "RUNTIME_GENERATED");
  const capabilityGapCount = records.length - runtimeRecords.length;
  const advancedRecords = records.filter((record) => record.slotKind === "ALGEBRA" || record.slotKind === "TRIGONOMETRY");
  const advancedMathCapabilityGapCount = advancedRecords.filter((record) => record.sourceKind === "CAPABILITY_GAP").length;
  const algebraRecords = records.filter((record) => record.slotKind === "ALGEBRA");
  const trigonometryRecords = records.filter((record) => record.slotKind === "TRIGONOMETRY");
  const algebraBankOnlyCount = algebraRecords.filter((record) => record.sourceKind === "RUNTIME_GENERATED" && record.bankOnly).length;
  const trigonometryTestEligibleCount = trigonometryRecords.filter((record) => record.sourceKind === "RUNTIME_GENERATED" && record.testEligible === true).length;
  const optionMismatchCount = runtimeRecords.filter((record) => record.optionCount !== 4).length;
  const emptyExplanationCount = runtimeRecords.filter((record) => record.emptyExplanation).length;
  const literalStemDuplicateRate = duplicateRate(runtimeRecords.map((record) => record.literalStemSignature));
  const normalizedStructuralStemReuseRate = duplicateRate(
    runtimeRecords.map((record) => record.normalizedStemSignature),
  );

  const baselineQuestions = integratedBaselineSections.flatMap((section) => section.questions);
  const currentBaselineCapabilityGapCount = baselineQuestions.filter((question) => question.sourceKind === "CAPABILITY_GAP").length;
  const currentBaselineAlgebraBankOnlyCount = baselineQuestions.filter((question) =>
    question.slotKind === "ALGEBRA" && question.sourceKind === "RUNTIME_GENERATED" && question.testEligible === false,
  ).length;

  const advancedLifecycleBreachCount = advancedRecords.filter((record) => {
    if (record.sourceKind !== "RUNTIME_GENERATED") return false;
    if (record.slotKind === "ALGEBRA") {
      return !record.bankOnly || record.testEligible !== false || record.publiclyPublishable === true;
    }
    return record.testEligible !== true || record.publiclyPublishable === true;
  }).length;

  const blockers: string[] = [];
  if (governance.status !== "SHADOW_EMPIRICAL_CANDIDATE_LOCKED") blockers.push("SHADOW_FREQUENCY_GOVERNANCE_NOT_CANDIDATE");
  if (capabilityGapCount) blockers.push("SHADOW_CAPABILITY_GAPS_PRESENT");
  if (advancedMathCapabilityGapCount) blockers.push("SHADOW_ADVANCED_MATH_CAPABILITY_GAPS_PRESENT");
  if (currentBaselineCapabilityGapCount) blockers.push("CURRENT_INTEGRATED_BASELINE_CAPABILITY_GAPS_PRESENT");
  if (advancedLifecycleBreachCount) blockers.push("ADVANCED_MATH_LIFECYCLE_CONTRACT_BREACH");
  if (algebraBankOnlyCount) blockers.push("ALGEBRA_BANK_ONLY_LIFECYCLE_LOCK");
  if (optionMismatchCount) blockers.push("SHADOW_OPTION_COUNT_PROFILE_DRIFT");
  if (emptyExplanationCount) blockers.push("SHADOW_EMPTY_EXPLANATIONS_PRESENT");
  if (normalizedStructuralStemReuseRate > 0.05) {
    blockers.push("SHADOW_STRUCTURAL_STEM_REUSE_ABOVE_5_PERCENT");
  }

  return Object.freeze({
    authority: QUANT_V4_CGL_TIER1_SHADOW_SIMULATION_AUTHORITY,
    status: blockers.length ? "SHADOW_SIMULATION_HOLD" : "SHADOW_SIMULATION_CANDIDATE",
    sectionsGenerated: sections,
    questionsExpected: sections * 25,
    recordsGenerated: records.length,
    runtimeGeneratedCount: runtimeRecords.length,
    capabilityGapCount,
    advancedMathCapabilityGapCount,
    structuralCapabilityGapCount: advancedMathCapabilityGapCount,
    structuralCapabilityGapsPerSection: advancedMathCapabilityGapCount / sections,
    currentStructuralCapabilityGapsPerSection: currentBaselineCapabilityGapCount / sections,
    baseSimulatorHistoricalAdvancedMathGapsPerSection: 5,
    currentBaselineCapabilityGapCount,
    currentBaselineAlgebraBankOnlyCount,
    algebraRecordCount: algebraRecords.length,
    algebraBankOnlyCount,
    trigonometryRecordCount: trigonometryRecords.length,
    trigonometryTestEligibleCount,
    optionMismatchCount,
    emptyExplanationCount,
    literalStemDuplicateRate,
    normalizedStructuralStemReuseRate,
    slotDistribution: countBy(records, (record) => record.slotKind),
    packageDistribution: countBy(runtimeRecords, (record) => record.packageId),
    blockers: Object.freeze([...new Set(blockers)]),
    productionPromotionAuthorized: false,
    runtimeBlueprintMutationAuthorized: false,
  });
}
