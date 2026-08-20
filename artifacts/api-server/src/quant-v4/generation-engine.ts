import {
  generateQuestion as generateCoreQuestion,
  listQuantV4Packages as listCorePackages,
  toQuestionStudioPreview,
  QUANT_V4_PERCENTAGE_ALL_PATTERN_ID,
  type QuantV4Difficulty,
  type QuantV4GenerationRequest as CoreQuantV4GenerationRequest,
  type QuantV4Language,
  type QuantV4PackageDefinition,
  type QuantV4PackageId as CoreQuantV4PackageId,
} from "./generation-engine-core";
import {
  getRap001ActiveCanonicalProblemIds,
  runRap001Pipeline,
  type Rap001CanonicalProblemId,
} from "./topics/Arithmetic/subtopics/RatioAndProportion/RAP-001";
import {
  getRap002ActiveCanonicalProblemIds,
  runRap002Pipeline,
  type Rap002CanonicalProblemId,
} from "./topics/Arithmetic/subtopics/RatioAndProportion/RAP-002";
import {
  getRap003ActiveCanonicalProblemIds,
  runRap003Pipeline,
  type Rap003CanonicalProblemId,
} from "./topics/Arithmetic/subtopics/RatioAndProportion/RAP-003";
import {
  PNL_001_LANGUAGES,
  getPnl001ActiveCanonicalProblemIds,
  runPnl001ReviewPipeline,
  type Pnl001CanonicalProblemId,
} from "./topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/question-studio-review-runtime";
import {
  getPnl001StandaloneDynamicCpIds,
  runPnl001StandaloneDynamicPipeline,
} from "./topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/pnl-standalone-multilingual-dynamic-runtime";
import {
  getPrb001ActiveCanonicalProblemIds,
  runPrb001Pipeline,
  type Prb001CanonicalProblemId,
} from "./topics/Probability/PRB-001";
import {
  getPrb002ActiveCanonicalProblemIds,
  runPrb002Pipeline,
  type Prb002CanonicalProblemId,
} from "./topics/Probability/PRB-002";
import type { ProbabilityExamProfile } from "./topics/Probability/shared";
import {
  CAL_001_QUESTION_STUDIO_PACKAGE,
  generateCal001QuestionStudioBatch,
  isCal001GenerationRequest,
  type Cal001QuestionStudioRequest,
} from "../reasoning-v1/topics/Calendar/CAL-001/question-studio-runtime";
import {
  TSD_001_QUESTION_STUDIO_PACKAGE,
  generateTsd001QuestionStudioBatch,
  isTsd001QuestionStudioRequest,
  type Tsd001QuestionStudioRequest,
} from "./topics/Arithmetic/subtopics/TimeSpeedDistance/TSD-001/question-studio-adapter";

export type QuantV4PackageId =
  | CoreQuantV4PackageId
  | "PNL-001"
  | "PRB-001"
  | "PRB-002"
  | "CAL-001"
  | "TSD-001";

export type QuantV4GenerationRequest = Omit<
  CoreQuantV4GenerationRequest,
  "packageId" | "archetypeId"
> & {
  packageId?: QuantV4PackageId;
  archetypeId?: QuantV4PackageId;
  runtimeMode?: "CANONICAL_REVIEW" | "DYNAMIC_CANDIDATE";
  examProfile?: ProbabilityExamProfile;
};

export type { QuantV4Difficulty, QuantV4Language, QuantV4PackageDefinition };
export { QUANT_V4_PERCENTAGE_ALL_PATTERN_ID, toQuestionStudioPreview };

const RAP_LANGUAGES: readonly QuantV4Language[] = ["en", "hi", "pa"];
const PNL_LANGUAGES: readonly QuantV4Language[] = [...PNL_001_LANGUAGES];
const PRB_LANGUAGES: readonly QuantV4Language[] = ["en"];
const PNL_DYNAMIC_CP_IDS = getPnl001StandaloneDynamicCpIds();
type Pnl001RuntimeMode = "CANONICAL_REVIEW" | "DYNAMIC_CANDIDATE";

type RuntimePackageId =
  | "RAP-001"
  | "RAP-002"
  | "RAP-003"
  | "PNL-001"
  | "PRB-001"
  | "PRB-002";

type RuntimeDefinition = Omit<QuantV4PackageDefinition, "run"> & {
  packageId: RuntimePackageId;
  run: (
    cpId: string,
    input: {
      difficulty?: QuantV4Difficulty;
      language?: QuantV4Language;
      questionLanguageId?: string;
      seed?: string;
      examProfile?: ProbabilityExamProfile;
    },
  ) => Promise<any> | any;
};

const RAP_RUNTIME_PACKAGES: readonly RuntimeDefinition[] = [
  {
    packageId: "RAP-001",
    topic: "Arithmetic",
    subtopic: "Ratio & Proportion",
    label: "Ratio & Proportion Fundamentals",
    cpIds: getRap001ActiveCanonicalProblemIds(),
    supportedLanguages: RAP_LANGUAGES,
    run: (cpId, input) =>
      runRap001Pipeline(cpId as Rap001CanonicalProblemId, {
        difficultyBand: input.difficulty,
        language: input.language,
        questionLanguageId: input.questionLanguageId,
        seed: input.seed,
      }),
  },
  {
    packageId: "RAP-002",
    topic: "Arithmetic",
    subtopic: "Ratio & Proportion",
    label: "Compound Proportions & Linked Ratios",
    cpIds: getRap002ActiveCanonicalProblemIds(),
    supportedLanguages: RAP_LANGUAGES,
    run: (cpId, input) =>
      runRap002Pipeline(cpId as Rap002CanonicalProblemId, {
        difficultyBand:
          input.difficulty === "Medium" || input.difficulty === "Hard"
            ? input.difficulty
            : undefined,
        language: input.language,
        questionLanguageId: input.questionLanguageId,
        seed: input.seed,
      }),
  },
  {
    packageId: "RAP-003",
    topic: "Arithmetic",
    subtopic: "Ratio & Proportion",
    label: "Advanced Ratio & Proportion Applications",
    cpIds: getRap003ActiveCanonicalProblemIds(),
    supportedLanguages: RAP_LANGUAGES,
    run: (cpId, input) =>
      runRap003Pipeline(cpId as Rap003CanonicalProblemId, {
        difficultyBand: input.difficulty,
        language: input.language,
        questionLanguageId: input.questionLanguageId,
        seed: input.seed,
      }),
  },
];

const PNL_RUNTIME_PACKAGE: RuntimeDefinition = {
  packageId: "PNL-001",
  topic: "Arithmetic",
  subtopic: "Profit & Loss",
  label: "Profit & Loss — Canonical & Dynamic",
  cpIds: getPnl001ActiveCanonicalProblemIds(),
  supportedLanguages: PNL_LANGUAGES,
  run: (cpId, input) =>
    runPnl001ReviewPipeline(cpId as Pnl001CanonicalProblemId, {
      difficultyBand: input.difficulty,
      language: input.language,
      questionLanguageId: input.questionLanguageId,
      seed: input.seed,
    }),
};

const PRB_RUNTIME_PACKAGES: readonly RuntimeDefinition[] = [
  {
    packageId: "PRB-001",
    topic: "Arithmetic",
    subtopic: "Probability",
    label: "Classical Probability & Standard Experiments",
    cpIds: getPrb001ActiveCanonicalProblemIds(),
    supportedLanguages: PRB_LANGUAGES,
    run: (cpId, input) =>
      runPrb001Pipeline(cpId as Prb001CanonicalProblemId, {
        difficultyBand: input.difficulty,
        language: input.language,
        questionLanguageId: input.questionLanguageId,
        examProfile: input.examProfile,
        seed: input.seed,
      }),
  },
  {
    packageId: "PRB-002",
    topic: "Arithmetic",
    subtopic: "Probability",
    label: "Compound, Conditional & Counting-Based Probability",
    cpIds: getPrb002ActiveCanonicalProblemIds(),
    supportedLanguages: PRB_LANGUAGES,
    run: (cpId, input) =>
      runPrb002Pipeline(cpId as Prb002CanonicalProblemId, {
        difficultyBand: input.difficulty,
        language: input.language,
        questionLanguageId: input.questionLanguageId,
        examProfile: input.examProfile,
        seed: input.seed,
      }),
  },
];

class QuantV4RequestError extends Error {
  readonly statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = "QuantV4RequestError";
  }
}

function normalizeSelectorText(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizePnlRuntimeMode(value: unknown): Pnl001RuntimeMode {
  const normalized = String(value ?? "CANONICAL_REVIEW")
    .trim()
    .toUpperCase();
  if (normalized === "CANONICAL_REVIEW" || normalized === "DYNAMIC_CANDIDATE") {
    return normalized;
  }
  throw new QuantV4RequestError(
    `Unsupported PNL-001 runtime mode '${String(value ?? "")}'.`,
  );
}

function normalizeDifficulty(value: unknown): QuantV4Difficulty | undefined {
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (normalized === "easy") return "Easy";
    if (normalized === "medium") return "Medium";
    if (normalized === "hard") return "Hard";
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value >= 6) return "Hard";
    if (value >= 3) return "Medium";
    return "Easy";
  }
  return undefined;
}

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function shuffled<T>(items: readonly T[], seed: string) {
  const result = [...items];
  let state = hash(seed) || 1;
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

function resolveByPackageOrPattern(
  request: QuantV4GenerationRequest,
  packages: readonly RuntimeDefinition[],
) {
  const explicit = request.packageId ?? request.archetypeId;
  if (explicit) return packages.find((entry) => entry.packageId === explicit);
  const pattern = String(request.patternId ?? "").toUpperCase();
  return packages.find(
    (entry) => pattern === entry.packageId || pattern.includes(entry.packageId),
  );
}

function resolvePnlPackage(request: QuantV4GenerationRequest) {
  const explicit = request.packageId ?? request.archetypeId;
  if (explicit === PNL_RUNTIME_PACKAGE.packageId) return PNL_RUNTIME_PACKAGE;

  const pattern = String(request.patternId ?? "").toUpperCase();
  if (
    pattern === PNL_RUNTIME_PACKAGE.packageId ||
    pattern.includes(PNL_RUNTIME_PACKAGE.packageId)
  ) {
    return PNL_RUNTIME_PACKAGE;
  }

  const topic = normalizeSelectorText(request.topic);
  const subtopic = normalizeSelectorText(request.subtopic);
  const isProfitLoss =
    subtopic === "profit loss" ||
    subtopic === "profit and loss" ||
    subtopic === "profitandloss" ||
    topic === "profit loss" ||
    topic === "profit and loss";
  if (
    isProfitLoss &&
    (!topic || topic === "arithmetic" || topic.includes("profit"))
  ) {
    return PNL_RUNTIME_PACKAGE;
  }
  return undefined;
}

function resolvePrbPackage(request: QuantV4GenerationRequest) {
  const direct = resolveByPackageOrPattern(request, PRB_RUNTIME_PACKAGES);
  if (direct) return direct;
  const topic = normalizeSelectorText(request.topic);
  const subtopic = normalizeSelectorText(request.subtopic);
  if (
    subtopic === "probability" ||
    topic === "probability" ||
    (topic === "arithmetic" && subtopic.includes("probability"))
  ) {
    const cpId = request.canonicalProblemId ?? request.cpId;
    return PRB_RUNTIME_PACKAGES.find((entry) => !cpId || entry.cpIds.includes(cpId)) ?? PRB_RUNTIME_PACKAGES[0];
  }
  return undefined;
}

function resolveRapPackage(request: QuantV4GenerationRequest) {
  return resolveByPackageOrPattern(request, RAP_RUNTIME_PACKAGES);
}
function resolveCpId(
  pkg: QuantV4PackageDefinition,
  request: QuantV4GenerationRequest,
) {
  const explicit = request.canonicalProblemId ?? request.cpId;
  if (explicit) {
    if (pkg.cpIds.includes(explicit)) return explicit;
    throw new QuantV4RequestError(
      `Unknown canonical problem '${explicit}' for package ${pkg.packageId}`,
    );
  }
  const pattern = String(request.patternId ?? "").toUpperCase();
  return pkg.cpIds.find((cpId) => pattern.includes(cpId)) ?? pkg.cpIds[0]!;
}

function isRawPnlCheckpointPackage(pkg: any) {
  const subtopic = normalizeSelectorText(pkg?.subtopic);
  return (
    /^CP-\d{3}$/.test(String(pkg?.packageId ?? "")) &&
    (subtopic === "profitandloss" || subtopic === "profit loss")
  );
}

function pnlPackageForQuestionStudio() {
  return {
    id: PNL_RUNTIME_PACKAGE.packageId,
    packageId: PNL_RUNTIME_PACKAGE.packageId,
    type: "quant-v4",
    section: "Quant",
    domain: "quant",
    topic: PNL_RUNTIME_PACKAGE.topic,
    subtopic: PNL_RUNTIME_PACKAGE.subtopic,
    name: `${PNL_RUNTIME_PACKAGE.packageId} ${PNL_RUNTIME_PACKAGE.label}`,
    label: PNL_RUNTIME_PACKAGE.label,
    generationDomain: "quant-v4",
    canonicalProblems: PNL_RUNTIME_PACKAGE.cpIds.map((cpId) => ({ id: cpId, label: cpId })),
    supportedDifficulties: ["easy", "medium", "hard"],
    supportedLanguages: [...PNL_LANGUAGES],
    enabled: true,
    runtimeMode: "CANONICAL_REVIEW",
    supportedRuntimeModes: ["CANONICAL_REVIEW", "DYNAMIC_CANDIDATE"],
    dynamicCandidateCpIds: [...PNL_DYNAMIC_CP_IDS],
    reviewStatus: "APPROVED_EDITORIAL_CANONICAL",
    questionBankStatus: "WRITABLE",
    testEligibility: "ELIGIBLE",
    publiclyPublishable: true,
    runtimePolicies: {
      CANONICAL_REVIEW: {
        reviewStatus: "APPROVED_EDITORIAL_CANONICAL",
        questionBankStatus: "WRITABLE",
        testEligibility: "ELIGIBLE",
        publiclyPublishable: true,
      },
      DYNAMIC_CANDIDATE: {
        reviewStatus: "UNREVIEWED_DYNAMIC_CANDIDATE",
        questionBankStatus: "NOT_STORED",
        testEligibility: "INELIGIBLE",
        publiclyPublishable: false,
      },
    },
  };
}

function probabilityPackageForQuestionStudio(pkg: RuntimeDefinition) {
  return {
    id: pkg.packageId,
    packageId: pkg.packageId,
    type: "quant-v4",
    section: "Quant",
    domain: "quant",
    topic: pkg.topic,
    subtopic: pkg.subtopic,
    name: `${pkg.packageId} ${pkg.label}`,
    label: pkg.label,
    generationDomain: "quant-v4",
    canonicalProblems: pkg.cpIds.map((cpId) => ({ id: cpId, label: cpId })),
    supportedDifficulties: ["easy", "medium", "hard"],
    supportedLanguages: [...PRB_LANGUAGES],
    supportedExamProfiles: ["SSC_CGL_CHSL", "SSC_CGL_JSO", "BANKING_PRELIMS", "BANKING_MAINS", "GENERIC_PRACTICE"],
    optionCountByExamProfile: { SSC_CGL_CHSL: 4, SSC_CGL_JSO: 4, BANKING_PRELIMS: 5, BANKING_MAINS: 5, GENERIC_PRACTICE: 4 },
    enabled: true,
    runtimeMode: "ENGLISH_MOCK_READY",
    reviewStatus: "APPROVED_EDITORIAL_ENGLISH",
    questionBankStatus: "WRITABLE",
    testEligibility: "ELIGIBLE_WITH_FAMILY_LIMIT",
    publiclyPublishable: false,
    freezeStatus: "ENGLISH_MOCK_READY",
    itemPolicyAuthority: "QUESTION_TRACEABILITY",
    maxPerMockPerFamily: 1,
    exactArithmetic: "BIGINT_RATIONAL",
  };
}

export function listQuantV4Packages() {
  const specialIds = new Set(["PNL-001", "PRB-001", "PRB-002", "CAL-001", "TSD-001"]);
  const corePackages = listCorePackages()
    .filter((pkg) => !isRawPnlCheckpointPackage(pkg))
    .filter((pkg) => !specialIds.has(pkg.packageId))
    .map((pkg) =>
      pkg.packageId.startsWith("RAP-")
        ? { ...pkg, supportedLanguages: [...RAP_LANGUAGES] }
        : pkg,
    );

  return [
    ...corePackages,
    CAL_001_QUESTION_STUDIO_PACKAGE,
    TSD_001_QUESTION_STUDIO_PACKAGE,
    pnlPackageForQuestionStudio(),
    ...PRB_RUNTIME_PACKAGES.map(probabilityPackageForQuestionStudio),
  ].sort((left, right) => left.packageId.localeCompare(right.packageId));
}

async function generateWithRuntimePackage(
  pkg: RuntimeDefinition,
  request: QuantV4GenerationRequest,
  language: QuantV4Language,
) {
  const supportedLanguages = pkg.supportedLanguages ?? ["en"];
  if (!supportedLanguages.includes(language)) {
    throw new QuantV4RequestError(
      `${pkg.packageId} does not support language '${language}'.`,
    );
  }

  const isPnl = pkg.packageId === PNL_RUNTIME_PACKAGE.packageId;
  const isProbability = pkg.packageId === "PRB-001" || pkg.packageId === "PRB-002";
  const pnlRuntimeMode = isPnl ? normalizePnlRuntimeMode(request.runtimeMode) : undefined;
  const runtimeCpIds =
    pnlRuntimeMode === "DYNAMIC_CANDIDATE"
      ? [...PNL_DYNAMIC_CP_IDS]
      : pkg.cpIds;
  const runtimePackage = runtimeCpIds === pkg.cpIds ? pkg : { ...pkg, cpIds: runtimeCpIds };
  const count = Math.min(1000, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const difficultyBand = normalizeDifficulty(request.difficulty);
  const batchSeed =
    request.seed ??
    [
      "quant-v4",
      request.packageId ?? request.archetypeId ?? request.patternId ?? request.subtopic ?? pkg.packageId,
      request.canonicalProblemId ?? request.cpId ?? "mixed",
      pnlRuntimeMode ?? "DYNAMIC",
      Date.now(),
      Math.random().toString(36).slice(2),
    ].join(":");

  const explicitCp = request.canonicalProblemId ?? request.cpId;
  const selectedCp = resolveCpId(runtimePackage, request);
  const cpOrder = explicitCp
    ? [selectedCp]
    : shuffled(runtimeCpIds, `${batchSeed}:${pkg.packageId}:cp-order`);
  const results: Array<{ questionPackage: any; question: any }> = [];

  for (let index = 0; index < count; index += 1) {
    if (index > 0 && index % 100 === 0) await new Promise((resolve) => setImmediate(resolve));
    const cpId = cpOrder[index % cpOrder.length]!;
    const seed = `${batchSeed}:${cpId}:${index}`;
    const questionPackage =
      pnlRuntimeMode === "DYNAMIC_CANDIDATE"
        ? runPnl001StandaloneDynamicPipeline({
            canonicalProblemId: cpId as any,
            difficultyBand,
            language: language as any,
            questionLanguageId: request.questionLanguageId,
            seed,
          })
        : await pkg.run(cpId, {
            difficulty: difficultyBand,
            language,
            questionLanguageId: request.questionLanguageId,
            examProfile: request.examProfile,
            seed,
          });
    results.push({
      questionPackage,
      question: toQuestionStudioPreview(questionPackage, {
        packageDefinition: pkg,
        questionIndex: index + 1,
        questionCount: count,
        seed,
      }),
    });
  }

  return {
    generationContext: {
      generationDomain: "quant-v4",
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: pnlRuntimeMode ?? (isProbability ? "ENGLISH_MOCK_READY" : "DYNAMIC"),
      ...(isPnl
        ? {
            reviewStatus: pnlRuntimeMode === "DYNAMIC_CANDIDATE" ? "UNREVIEWED_DYNAMIC_CANDIDATE" : "APPROVED_EDITORIAL_CANONICAL",
            questionBankStatus: pnlRuntimeMode === "DYNAMIC_CANDIDATE" ? "NOT_STORED" : "WRITABLE",
            testEligibility: pnlRuntimeMode === "DYNAMIC_CANDIDATE" ? "INELIGIBLE" : "ELIGIBLE",
            publiclyPublishable: pnlRuntimeMode !== "DYNAMIC_CANDIDATE",
          }
        : {}),
      ...(isProbability
        ? {
            reviewStatus: "APPROVED_EDITORIAL_ENGLISH",
            questionBankStatus: "WRITABLE",
            testEligibility: "ELIGIBLE_WITH_FAMILY_LIMIT",
            publiclyPublishable: false,
            freezeStatus: "ENGLISH_MOCK_READY",
            itemPolicyAuthority: "QUESTION_TRACEABILITY",
            maxPerMockPerFamily: 1,
          }
        : {}),
    },
    questionPackages: results.map((item) => item.questionPackage),
    questions: results.map((item) => item.question),
  };
}

export async function generateQuestion(request: QuantV4GenerationRequest = {}) {
  if (isTsd001QuestionStudioRequest(request as Tsd001QuestionStudioRequest)) {
    return generateTsd001QuestionStudioBatch(request as Tsd001QuestionStudioRequest);
  }

  if (isCal001GenerationRequest(request as Cal001QuestionStudioRequest)) {
    return generateCal001QuestionStudioBatch(
      request as Cal001QuestionStudioRequest,
    );
  }

  const language = request.language ?? "en";
  const pnlPackage = resolvePnlPackage(request);
  if (pnlPackage) return generateWithRuntimePackage(pnlPackage, request, language);

  const probabilityPackage = resolvePrbPackage(request);
  if (probabilityPackage) return generateWithRuntimePackage(probabilityPackage, request, language);

  const rapPackage = resolveRapPackage(request);
  if (!rapPackage || language === "en") {
    return generateCoreQuestion(request as CoreQuantV4GenerationRequest);
  }
  return generateWithRuntimePackage(rapPackage, request, language);
}
