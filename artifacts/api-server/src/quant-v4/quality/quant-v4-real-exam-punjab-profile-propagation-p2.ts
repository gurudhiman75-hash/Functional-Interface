import {
  generateQuestion as generateQuantQuestion,
  listQuantV4Packages,
} from "../question-studio-review-engine";
import {
  assessExplanationQuality,
  hasQuestionSpecificEvidence,
} from "./semantic-explanation-quality";
import {
  generateQuantV4RealExamSectionWithAdvancedMath,
  type QuantV4AdvancedMathIntegratedSection,
} from "./quant-v4-real-exam-advanced-math-integration-p2";
import {
  QUANT_V4_REAL_EXAM_PROFILES,
  type QuantV4SimulatedQuestion,
} from "./quant-v4-real-exam-simulation-p2";

export const QUANT_V4_REAL_EXAM_PUNJAB_PROFILE_PROPAGATION_AUTHORITY =
  "QUANT-V4-REAL-EXAM-PUNJAB-PROFILE-PROPAGATION-P2" as const;

export const QUANT_V4_PUNJAB_SIMULATION_EXAMS = Object.freeze([
  "PSSSB",
  "PPSC",
  "PUNJAB_POLICE",
] as const);

export type QuantV4PunjabSimulationExamId =
  (typeof QUANT_V4_PUNJAB_SIMULATION_EXAMS)[number];

export interface QuantV4PunjabProfiledQuestion extends QuantV4SimulatedQuestion {
  readonly requestedDeliveryProfile?: "PUNJAB_STATE";
  readonly deliveryProfileApplied?: boolean;
  readonly profilePropagationAuthority?: typeof QUANT_V4_REAL_EXAM_PUNJAB_PROFILE_PROPAGATION_AUTHORITY;
}

export interface QuantV4PunjabProfiledSection extends QuantV4AdvancedMathIntegratedSection {
  readonly questions: readonly QuantV4PunjabProfiledQuestion[];
  readonly profilePropagationAuthority: typeof QUANT_V4_REAL_EXAM_PUNJAB_PROFILE_PROPAGATION_AUTHORITY;
  readonly resolvedCentralDeliveryProfile: "PUNJAB_STATE";
  readonly coreProfileReplacements: number;
}

export interface QuantV4PunjabProfilePropagationSummary {
  readonly examId: QuantV4PunjabSimulationExamId;
  readonly sectionsGenerated: number;
  readonly coreRecords: number;
  readonly coreRuntimeGenerated: number;
  readonly coreProfileApplied: number;
  readonly coreCapabilityGaps: number;
  readonly optionMismatchCount: number;
  readonly historicalSimulatorMetadataStillStale: boolean;
  readonly packageDistribution: Readonly<Record<string, number>>;
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function difficultyFor(seed: string): "Easy" | "Medium" | "Hard" {
  const bucket = hash(seed) % 10;
  if (bucket <= 2) return "Easy";
  if (bucket <= 7) return "Medium";
  return "Hard";
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

function profiledRuntimeRecord(input: {
  source: QuantV4SimulatedQuestion;
  question: any;
  packageId: string;
  packageTopic?: string;
  packageSubtopic?: string;
}): QuantV4PunjabProfiledQuestion {
  const text = questionText(input.question);
  const explanation = explanationText(input.question);
  const options = optionTexts(input.question);
  const assessment = assessExplanationQuality({
    packageId: input.packageId,
    questionKey: String(input.question?.questionId ?? `${input.source.examId}:${input.source.sectionIndex}:${input.source.ordinal}`),
    stem: text,
    explanation,
    answer: input.question?.answer ?? input.question?.canonicalAnswer?.display ?? input.question?.canonicalAnswer?.value,
    options,
  });

  return Object.freeze({
    ...input.source,
    sourceKind: "RUNTIME_GENERATED",
    packageId: input.packageId,
    topic: String(input.question?.topic ?? input.packageTopic ?? input.source.topic),
    subtopic: String(input.question?.subtopic ?? input.packageSubtopic ?? input.source.subtopic),
    representation: "DIRECT_MCQ",
    difficulty: String(input.question?.difficulty ?? input.question?.difficultyLabel ?? input.question?.difficultyBand ?? input.source.difficulty),
    text,
    explanation,
    options,
    optionCount: options.length,
    questionSpecificExplanation: hasQuestionSpecificEvidence(assessment),
    explanationOptionalSectionIssues: assessment.optionalSectionIssues,
    semanticExplanationSignature: assessment.semanticSignature,
    normalizedStemSignature: normalizeStemSignature(text),
    stemWordCount: text.split(/\s+/u).filter(Boolean).length,
    explanationWordCount: explanation.split(/\s+/u).filter(Boolean).length,
    numberTokenCount: (text.match(/-?\d+(?:\.\d+)?/gu) ?? []).length,
    directInverse: inferDirectInverse(input.question),
    calculationIntensity: inferCalculationIntensity(input.question, text, explanation),
    requestedDeliveryProfile: "PUNJAB_STATE",
    deliveryProfileApplied: true,
    profilePropagationAuthority: QUANT_V4_REAL_EXAM_PUNJAB_PROFILE_PROPAGATION_AUTHORITY,
  });
}

function propagationGapRecord(
  source: QuantV4SimulatedQuestion,
  reason: string,
): QuantV4PunjabProfiledQuestion {
  return Object.freeze({
    ...source,
    sourceKind: "CAPABILITY_GAP",
    packageId: "CAPABILITY_GAP",
    topic: "UNFILLED",
    subtopic: source.slotKind,
    representation: "CAPABILITY_GAP",
    difficulty: "UNKNOWN",
    text: "",
    explanation: "",
    options: [],
    optionCount: 0,
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
    gapReason: reason,
    requestedDeliveryProfile: "PUNJAB_STATE",
    deliveryProfileApplied: false,
    profilePropagationAuthority: QUANT_V4_REAL_EXAM_PUNJAB_PROFILE_PROPAGATION_AUTHORITY,
  });
}

function prioritizeSourcePackage(pool: any[], sourcePackageId: string): any[] {
  const source = pool.find((pkg) => String(pkg.packageId) === sourcePackageId);
  if (!source) return pool;
  return [source, ...pool.filter((pkg) => pkg !== source)];
}

async function generatePunjabCoreSlot(
  source: QuantV4SimulatedQuestion,
  sectionSeed: string,
): Promise<QuantV4PunjabProfiledQuestion> {
  if (source.slotKind !== "ARITHMETIC_CORE" && source.slotKind !== "GEOMETRY_MENSURATION") {
    return source;
  }
  const basePool = source.slotKind === "ARITHMETIC_CORE" ? ARITHMETIC_POOL : GEOMETRY_MENSURATION_POOL;
  if (!basePool.length) {
    return propagationGapRecord(source, `No ${source.slotKind} package is exposed through the Quant Question Studio registry.`);
  }

  const preferred = prioritizeSourcePackage(basePool, source.packageId);
  const start = source.packageId !== "CAPABILITY_GAP"
    ? 0
    : hash(`${sectionSeed}:punjab-profile:${source.slotKind}:${source.ordinal}`) % preferred.length;
  const errors: string[] = [];

  for (let offset = 0; offset < preferred.length; offset += 1) {
    const pkg = preferred[(start + offset) % preferred.length]!;
    const seed = `${sectionSeed}:punjab-profile:${source.slotKind}:${source.ordinal}:${pkg.packageId}`;
    try {
      const batch = await generateQuantQuestion({
        packageId: pkg.packageId as any,
        language: "en",
        difficulty: difficultyFor(`${seed}:difficulty`),
        examProfile: "PUNJAB_STATE" as any,
        seed,
        count: 1,
      } as any);
      const question = extractBatchQuestions(batch)[0];
      if (!question) throw new Error("runtime returned no question");
      const record = profiledRuntimeRecord({
        source,
        question,
        packageId: String(question?.packageId ?? pkg.packageId),
        packageTopic: String(pkg?.topic ?? ""),
        packageSubtopic: String(pkg?.subtopic ?? ""),
      });
      if (record.optionCount !== 4 || new Set(record.options).size !== 4) {
        throw new Error(`expected 4 unique Punjab options, received ${record.optionCount}`);
      }
      return record;
    } catch (error) {
      errors.push(`${pkg.packageId}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return propagationGapRecord(
    source,
    `All ${source.slotKind} candidates failed with examProfile=PUNJAB_STATE: ${errors.slice(0, 5).join(" | ")}`,
  );
}

export async function generateQuantV4PunjabRealExamSection(input: {
  examId: QuantV4PunjabSimulationExamId;
  sectionIndex: number;
  seed?: string;
}): Promise<QuantV4PunjabProfiledSection> {
  const base = await generateQuantV4RealExamSectionWithAdvancedMath(input);
  const questions: QuantV4PunjabProfiledQuestion[] = [];
  let coreProfileReplacements = 0;

  for (const source of base.questions) {
    if (source.slotKind !== "ARITHMETIC_CORE" && source.slotKind !== "GEOMETRY_MENSURATION") {
      questions.push(source);
      continue;
    }
    questions.push(await generatePunjabCoreSlot(source, base.seed));
    coreProfileReplacements += 1;
  }

  return Object.freeze({
    ...base,
    questions: Object.freeze(questions),
    profilePropagationAuthority: QUANT_V4_REAL_EXAM_PUNJAB_PROFILE_PROPAGATION_AUTHORITY,
    resolvedCentralDeliveryProfile: "PUNJAB_STATE",
    coreProfileReplacements,
  });
}

function countBy(values: readonly string[]): Readonly<Record<string, number>> {
  const result: Record<string, number> = {};
  for (const value of values) result[value] = (result[value] ?? 0) + 1;
  return Object.freeze(result);
}

export async function runQuantV4PunjabProfilePropagationAudit(input: {
  sectionsPerProfile?: number;
  seedPrefix?: string;
} = {}) {
  const sectionsPerProfile = Math.max(1, Math.floor(input.sectionsPerProfile ?? 3));
  const summaries: QuantV4PunjabProfilePropagationSummary[] = [];

  for (const examId of QUANT_V4_PUNJAB_SIMULATION_EXAMS) {
    const sections: QuantV4PunjabProfiledSection[] = [];
    for (let sectionIndex = 1; sectionIndex <= sectionsPerProfile; sectionIndex += 1) {
      sections.push(await generateQuantV4PunjabRealExamSection({
        examId,
        sectionIndex,
        seed: `${input.seedPrefix ?? QUANT_V4_REAL_EXAM_PUNJAB_PROFILE_PROPAGATION_AUTHORITY}:${examId}:${sectionIndex}`,
      }));
    }
    const core = sections.flatMap((section) => section.questions)
      .filter((question) => question.slotKind === "ARITHMETIC_CORE" || question.slotKind === "GEOMETRY_MENSURATION");
    const historical = QUANT_V4_REAL_EXAM_PROFILES.find((profile) => profile.id === examId)!;

    summaries.push(Object.freeze({
      examId,
      sectionsGenerated: sections.length,
      coreRecords: core.length,
      coreRuntimeGenerated: core.filter((question) => question.sourceKind === "RUNTIME_GENERATED").length,
      coreProfileApplied: core.filter((question) => question.deliveryProfileApplied === true).length,
      coreCapabilityGaps: core.filter((question) => question.sourceKind === "CAPABILITY_GAP").length,
      optionMismatchCount: core.filter((question) => question.optionCount !== 4).length,
      historicalSimulatorMetadataStillStale: String(historical.centralDeliveryProfile ?? "") !== "PUNJAB_STATE",
      packageDistribution: countBy(core.map((question) => question.packageId)),
    }));
  }

  return Object.freeze({
    authority: QUANT_V4_REAL_EXAM_PUNJAB_PROFILE_PROPAGATION_AUTHORITY,
    resolvedCentralDeliveryProfile: "PUNJAB_STATE" as const,
    sectionsPerProfile,
    profilesAudited: summaries.length,
    summaries: Object.freeze(summaries),
  });
}
