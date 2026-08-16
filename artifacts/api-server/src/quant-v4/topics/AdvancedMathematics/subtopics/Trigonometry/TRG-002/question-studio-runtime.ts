import { buildTrg002ExamTreeExplanation } from "./examtree-solution-directive";
import {
  TRG_002_MVP_48_BY_CP,
  TRG_002_MVP_48_IDS,
  type Trg002Mvp48Id,
} from "./mvp-48-registry";
import { generateFinalEditorialTrg002Mvp48Question } from "./mvp-final-editorial-runtime";

export const TRG_002_APPROVED_BASELINE_HEAD =
  "60e289ee6c89a3f595ad75038ac563daf2a5fc5f" as const;
export const TRG_002_APPROVED_ARTIFACT_ID = 9259815578 as const;
export const TRG_002_QUESTION_STUDIO_LANGUAGES = ["en"] as const;

export const TRG_002_QUESTION_STUDIO_PACKAGE = {
  id: "TRG-002",
  packageId: "TRG-002",
  type: "quant-v4",
  section: "Quant",
  domain: "quant",
  topic: "Advanced Mathematics",
  subtopic: "Trigonometry — Heights & Distances",
  name: "TRG-002 Heights & Distances Applications",
  label: "Heights & Distances Applications",
  generationDomain: "quant-v4",
  canonicalProblems: TRG_002_MVP_48_IDS.map((qlId) => ({ id: qlId, label: qlId })),
  cpIds: [...TRG_002_MVP_48_IDS],
  supportedDifficulties: ["easy", "medium", "hard"],
  supportedLanguages: [...TRG_002_QUESTION_STUDIO_LANGUAGES],
  enabled: true,
  runtimeMode: "HUMAN_APPROVED_48",
  reviewStatus: "HUMAN_APPROVED_48",
  humanReviewed: 48,
  humanReviewTarget: 48,
  questionBankStatus: "WRITABLE",
  testEligibility: "ELIGIBLE",
  publiclyPublishable: true,
  freezeStatus: "APPROVED_BASELINE",
  solutionDiagramPolicy: "REQUIRED",
  stemDiagramPolicy: "OPTIONAL_NOT_AUTOMATIC",
  approvedBaselineHead: TRG_002_APPROVED_BASELINE_HEAD,
  approvedArtifactId: TRG_002_APPROVED_ARTIFACT_ID,
} as const;

export type Trg002QuestionStudioRequest = {
  packageId?: string;
  archetypeId?: string;
  patternId?: string;
  topic?: string;
  subtopic?: string;
  canonicalProblemId?: string;
  cpId?: string;
  difficulty?: string | number;
  language?: string;
  questionLanguageId?: string;
  seed?: string;
  count?: number;
};

function normalize(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function hash(value: string) {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.charCodeAt(0);
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

function difficultyMatches(qlDifficulty: string, requested: unknown) {
  if (requested == null || requested === "") return true;
  if (typeof requested === "number" && Number.isFinite(requested)) {
    const band = requested >= 6 ? "hard" : requested >= 3 ? "medium" : "easy";
    return qlDifficulty.toLowerCase() === band;
  }
  return qlDifficulty.toLowerCase() === String(requested).trim().toLowerCase();
}

export function isTrg002GenerationRequest(request: Trg002QuestionStudioRequest) {
  const explicit = String(request.packageId ?? request.archetypeId ?? "").toUpperCase();
  const pattern = String(request.patternId ?? "").toUpperCase();
  if (explicit === "TRG-002" || pattern === "TRG-002" || pattern.includes("TRG-002")) {
    return true;
  }
  const topic = normalize(request.topic);
  const subtopic = normalize(request.subtopic);
  return (
    topic === "trigonometry" ||
    subtopic.includes("heights distances") ||
    subtopic.includes("heights and distances") ||
    (topic === "advanced mathematics" && subtopic.includes("trigonometry"))
  );
}

function requestedQlIds(request: Trg002QuestionStudioRequest): readonly Trg002Mvp48Id[] {
  const explicit = String(request.canonicalProblemId ?? request.cpId ?? "").toUpperCase();
  if (!explicit) return TRG_002_MVP_48_IDS;
  if ((TRG_002_MVP_48_IDS as readonly string[]).includes(explicit)) {
    return [explicit as Trg002Mvp48Id];
  }
  const cpIds = TRG_002_MVP_48_BY_CP[explicit as keyof typeof TRG_002_MVP_48_BY_CP];
  if (cpIds) return cpIds as readonly Trg002Mvp48Id[];
  throw Object.assign(new Error(`Unknown TRG-002 canonical problem or CP '${explicit}'.`), {
    statusCode: 400,
  });
}

function storagePayload(question: any) {
  return {
    version: 1 as const,
    family: "TRG-002" as const,
    qlId: question.qlId,
    diagram: question.solutionDiagram,
    annotations: question.solutionAnnotations ?? [],
  };
}

function questionStudioPreview(question: any, index: number, count: number, seed: string) {
  const diagramPayload = storagePayload(question);
  return {
    id: `${question.qlId}:${seed}`,
    text: question.stem,
    stem: question.stem,
    options: question.options.map((option: any) => option.display),
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    explanation: buildTrg002ExamTreeExplanation(question),
    section: "Quant",
    topic: "Advanced Mathematics",
    subtopic: "Trigonometry — Heights & Distances",
    difficulty: question.difficulty,
    difficultyLabel: question.difficulty,
    packageId: "TRG-002",
    language: "en",
    seed,
    patternId: null,
    runtimeMode: "HUMAN_APPROVED_48",
    reviewStatus: "HUMAN_APPROVED_48",
    questionBankStatus: "WRITABLE",
    testEligibility: "ELIGIBLE",
    publiclyPublishable: true,
    solutionDiagram: diagramPayload,
    proceduralLogic: {
      generationSystem: "quant-v4",
      packageId: "TRG-002",
      cpId: question.cpId,
      qlId: question.qlId,
      lockedFamily: question.lockedFamily,
      solveMode: question.solveMode,
      seed,
      approvedBaselineHead: TRG_002_APPROVED_BASELINE_HEAD,
      approvedArtifactId: TRG_002_APPROVED_ARTIFACT_ID,
      humanReviewStatus: "APPROVED",
      solutionDiagram: diagramPayload,
      canonicalSpatialState: question.canonicalSpatialState,
    },
    motifs: ["TRG-002", question.cpId, question.qlId, question.lockedFamily],
    languages: ["en"],
    questionLanguageId: question.qlId,
    generationMetadata: {
      packageId: "TRG-002",
      cpId: question.cpId,
      qlId: question.qlId,
      questionIndex: index + 1,
      questionCount: count,
      seed,
      reviewStatus: "HUMAN_APPROVED_48",
      questionBankStatus: "WRITABLE",
      testEligibility: "ELIGIBLE",
      publiclyPublishable: true,
      solutionDiagramStoredIn: "answerModel.generation.solutionDiagram",
      solutionDiagramPresentation: "EXPLANATION_DIRECTIVE",
    },
  };
}

export function generateTrg002QuestionStudioBatch(request: Trg002QuestionStudioRequest = {}) {
  const language = String(request.language ?? "en").toLowerCase();
  if (language !== "en") {
    throw Object.assign(new Error(`TRG-002 approved runtime currently supports English only, not '${language}'.`), {
      statusCode: 400,
    });
  }

  const count = Math.min(1000, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const batchSeed = request.seed ?? `trg-002-question-studio:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  const pool = requestedQlIds(request);
  const difficultyPool = pool.filter((qlId, index) => {
    const probe = generateFinalEditorialTrg002Mvp48Question(qlId, `${batchSeed}:difficulty:${index}`) as any;
    return difficultyMatches(probe.difficulty, request.difficulty);
  });
  if (!difficultyPool.length) {
    throw Object.assign(new Error("No approved TRG-002 QL matches the requested difficulty in the selected scope."), {
      statusCode: 400,
    });
  }
  const order = shuffled(difficultyPool, `${batchSeed}:ql-order`);
  const generated: Array<{ questionPackage: any; question: any }> = [];

  for (let index = 0; index < count; index += 1) {
    const qlId = order[index % order.length]!;
    const seed = `${batchSeed}:${qlId}:${index}`;
    const questionPackage: any = generateFinalEditorialTrg002Mvp48Question(qlId, seed);
    if (!questionPackage.validation?.valid || !questionPackage.solutionDiagram) {
      throw new Error(`${qlId}: approved TRG-002 generation failed validation before Question Studio projection.`);
    }
    generated.push({
      questionPackage,
      question: questionStudioPreview(questionPackage, index, count, seed),
    });
  }

  return {
    generationContext: {
      generationDomain: "quant-v4",
      packageId: "TRG-002",
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: "HUMAN_APPROVED_48",
      reviewStatus: "HUMAN_APPROVED_48",
      humanReviewed: 48,
      questionBankStatus: "WRITABLE",
      testEligibility: "ELIGIBLE",
      publiclyPublishable: true,
      approvedBaselineHead: TRG_002_APPROVED_BASELINE_HEAD,
      approvedArtifactId: TRG_002_APPROVED_ARTIFACT_ID,
      solutionDiagramStorage: "answerModel.generation.solutionDiagram + explanation directive",
      solutionDiagramPresentation: "stored explanation directive",
    },
    questionPackages: generated.map((item) => item.questionPackage),
    questions: generated.map((item) => item.question),
  };
}
