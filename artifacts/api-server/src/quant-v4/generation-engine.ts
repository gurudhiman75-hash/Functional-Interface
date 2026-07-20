import {
  generateQuestion as generateCoreQuestion,
  listQuantV4Packages as listCorePackages,
  toQuestionStudioPreview,
  QUANT_V4_PERCENTAGE_ALL_PATTERN_ID,
  type QuantV4Difficulty,
  type QuantV4GenerationRequest,
  type QuantV4Language,
  type QuantV4PackageDefinition,
  type QuantV4PackageId,
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

export type {
  QuantV4Difficulty,
  QuantV4GenerationRequest,
  QuantV4Language,
  QuantV4PackageDefinition,
  QuantV4PackageId,
};
export { QUANT_V4_PERCENTAGE_ALL_PATTERN_ID, toQuestionStudioPreview };

const RAP_LANGUAGES: readonly QuantV4Language[] = ["en", "hi", "pa"];

type RapPackageId = "RAP-001" | "RAP-002" | "RAP-003";

type RapRuntimeDefinition = QuantV4PackageDefinition & {
  packageId: RapPackageId;
};

const RAP_RUNTIME_PACKAGES: readonly RapRuntimeDefinition[] = [
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

class QuantV4RequestError extends Error {
  readonly statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = "QuantV4RequestError";
  }
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

function resolveRapPackage(request: QuantV4GenerationRequest) {
  const explicit = request.packageId ?? request.archetypeId;
  if (explicit) {
    return RAP_RUNTIME_PACKAGES.find((entry) => entry.packageId === explicit);
  }
  const pattern = String(request.patternId ?? "").toUpperCase();
  return RAP_RUNTIME_PACKAGES.find(
    (entry) => pattern === entry.packageId || pattern.includes(entry.packageId),
  );
}

function resolveCpId(pkg: RapRuntimeDefinition, request: QuantV4GenerationRequest) {
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

export function listQuantV4Packages() {
  return listCorePackages().map((pkg) =>
    pkg.packageId.startsWith("RAP-")
      ? { ...pkg, supportedLanguages: [...RAP_LANGUAGES] }
      : pkg,
  );
}

export async function generateQuestion(
  request: QuantV4GenerationRequest = {},
) {
  const language = request.language ?? "en";
  const pkg = resolveRapPackage(request);
  if (!pkg || language === "en") {
    return generateCoreQuestion(request);
  }
  if (!RAP_LANGUAGES.includes(language)) {
    throw new QuantV4RequestError(
      `${pkg.packageId} does not support language '${language}'.`,
    );
  }

  const count = Math.min(
    1000,
    Math.max(1, Math.floor(Number(request.count ?? 1) || 1)),
  );
  const difficultyBand = normalizeDifficulty(request.difficulty);
  const batchSeed =
    request.seed ??
    [
      "quant-v4",
      request.packageId ??
        request.archetypeId ??
        request.patternId ??
        request.subtopic ??
        pkg.packageId,
      request.canonicalProblemId ?? request.cpId ?? "mixed",
      Date.now(),
      Math.random().toString(36).slice(2),
    ].join(":");

  const explicitCp = request.canonicalProblemId ?? request.cpId;
  const selectedCp = resolveCpId(pkg, request);
  const cpOrder = explicitCp
    ? [selectedCp]
    : shuffled(pkg.cpIds, `${batchSeed}:${pkg.packageId}:cp-order`);
  const results: Array<{ questionPackage: any; question: any }> = [];

  for (let index = 0; index < count; index += 1) {
    if (index > 0 && index % 100 === 0) {
      await new Promise((resolve) => setImmediate(resolve));
    }
    const cpId = cpOrder[index % cpOrder.length]!;
    const seed = `${batchSeed}:${cpId}:${index}`;
    const questionPackage = await pkg.run(cpId, {
      difficulty: difficultyBand,
      language,
      questionLanguageId: request.questionLanguageId,
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
    },
    questionPackages: results.map((item) => item.questionPackage),
    questions: results.map((item) => item.question),
  };
}
