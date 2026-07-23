import {
  generateQuestion as generateBaseQuestion,
  listQuantV4Packages as listBasePackages,
  toQuestionStudioPreview,
  type QuantV4Difficulty,
  type QuantV4GenerationRequest,
  type QuantV4Language,
} from "./generation-engine";
import {
  AVG_001_QUESTION_STUDIO_CP_IDS,
  runAvg001QuestionStudioPipeline,
  type Avg001QuestionStudioCpId,
} from "./topics/Arithmetic/subtopics/Average/AVG-001/question-studio-adapter";

export type QuestionStudioQuantV4PackageId =
  | NonNullable<QuantV4GenerationRequest["packageId"]>
  | "AVG-001";

export type QuestionStudioQuantV4GenerationRequest = Omit<
  QuantV4GenerationRequest,
  "packageId" | "archetypeId"
> & {
  packageId?: QuestionStudioQuantV4PackageId;
  archetypeId?: QuestionStudioQuantV4PackageId;
};

const AVG_PACKAGE_DEFINITION = {
  packageId: "AVG-001",
  topic: "Arithmetic",
  subtopic: "Average",
  label: "Average",
  cpIds: AVG_001_QUESTION_STUDIO_CP_IDS,
  supportedLanguages: ["en"] as const,
};

function normalizeSelector(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isAverageRequest(request: QuestionStudioQuantV4GenerationRequest) {
  const packageId = normalizeSelector(request.packageId ?? request.archetypeId);
  const patternId = normalizeSelector(request.patternId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  return (
    packageId === "avg 001" ||
    patternId.includes("avg 001") ||
    (topic === "average" && !subtopic) ||
    (topic === "arithmetic" && subtopic === "average")
  );
}

function normalizeDifficulty(value: unknown): QuantV4Difficulty | undefined {
  const text = String(value ?? "").toLowerCase();
  if (text === "easy") return "Easy";
  if (text === "medium" || text === "moderate") return "Medium";
  if (text === "hard") return "Hard";
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value >= 6) return "Hard";
    if (value >= 3) return "Medium";
    return "Easy";
  }
  return undefined;
}

function seededHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function listQuantV4Packages() {
  const existing = listBasePackages();
  if (existing.some((pkg: any) => pkg.packageId === "AVG-001")) return existing;
  return [
    ...existing,
    {
      id: "AVG-001",
      packageId: "AVG-001",
      type: "quant-v4",
      section: "Quant",
      domain: "quant",
      topic: "Arithmetic",
      subtopic: "Average",
      name: "AVG-001 Average",
      label: "Average",
      generationDomain: "quant-v4",
      cpIds: [...AVG_001_QUESTION_STUDIO_CP_IDS],
      canonicalProblems: AVG_001_QUESTION_STUDIO_CP_IDS.map((cpId) => ({
        id: cpId,
        label: cpId,
      })),
      supportedDifficulties: ["easy", "medium", "hard"],
      supportedLanguages: ["en"],
      enabled: true,
    },
  ];
}

export async function generateQuestion(
  request: QuestionStudioQuantV4GenerationRequest = {},
) {
  if (!isAverageRequest(request)) {
    return generateBaseQuestion(request as QuantV4GenerationRequest);
  }

  const language = (request.language ?? "en") as QuantV4Language;
  if (language !== "en") {
    throw new Error("AVG-001 supports English generation only in Question Studio.");
  }

  const count = Math.min(
    1000,
    Math.max(1, Math.floor(Number(request.count ?? 1) || 1)),
  );
  const difficulty = normalizeDifficulty(request.difficulty);
  const explicitCp = request.canonicalProblemId ?? request.cpId;
  if (
    explicitCp &&
    !AVG_001_QUESTION_STUDIO_CP_IDS.includes(explicitCp as Avg001QuestionStudioCpId)
  ) {
    throw new Error(`Unknown canonical problem '${explicitCp}' for package AVG-001`);
  }

  const batchSeed =
    request.seed ??
    `quant-v4:AVG-001:${explicitCp ?? "mixed"}:${Date.now()}:${Math.random()
      .toString(36)
      .slice(2)}`;
  const cpOffset = seededHash(`${batchSeed}:cp-offset`) % AVG_001_QUESTION_STUDIO_CP_IDS.length;
  const questionPackages = [];
  const questions = [];

  for (let index = 0; index < count; index += 1) {
    if (index > 0 && index % 100 === 0) {
      await new Promise((resolve) => setImmediate(resolve));
    }
    const cpId = (explicitCp ??
      AVG_001_QUESTION_STUDIO_CP_IDS[
        (cpOffset + index) % AVG_001_QUESTION_STUDIO_CP_IDS.length
      ]) as Avg001QuestionStudioCpId;
    const seed = `${batchSeed}:${cpId}:${index}`;
    const pkg = runAvg001QuestionStudioPipeline(cpId, {
      difficulty,
      language: "en",
      questionLanguageId: request.questionLanguageId,
      seed,
    });
    questionPackages.push(pkg);
    questions.push(
      toQuestionStudioPreview(pkg, {
        packageDefinition: AVG_PACKAGE_DEFINITION,
        questionIndex: index + 1,
        questionCount: count,
        seed,
      }),
    );
  }

  return {
    generationContext: {
      generationDomain: "quant-v4",
      seed: batchSeed,
      timestamp: Date.now(),
    },
    questionPackages,
    questions,
  };
}

export type {
  QuantV4Difficulty,
  QuantV4Language,
};
