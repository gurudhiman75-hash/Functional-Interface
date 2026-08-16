import { buildTrg002ExamTreeExplanation } from "./examtree-solution-directive";
import {
  TRG_002_MVP_48_BY_CP,
  TRG_002_MVP_48_IDS,
  type Trg002Mvp48Id,
} from "./mvp-48-registry";
import { generateFinalEditorialTrg002Mvp48Question } from "./mvp-final-editorial-runtime";
import { buildTrg002SolutionAnnotations } from "./solution-diagram-annotations";

export const TRG_002_QUESTION_STUDIO_PACKAGE_ID = "TRG-002" as const;
export const TRG_002_QUESTION_STUDIO_CP_IDS = Object.keys(
  TRG_002_MVP_48_BY_CP,
) as Array<keyof typeof TRG_002_MVP_48_BY_CP>;
export const TRG_002_QUESTION_STUDIO_LANGUAGES = ["en"] as const;

export const TRG_002_QUESTION_STUDIO_PACKAGE = {
  id: TRG_002_QUESTION_STUDIO_PACKAGE_ID,
  packageId: TRG_002_QUESTION_STUDIO_PACKAGE_ID,
  type: "quant-v4",
  section: "Quant",
  domain: "quant",
  topic: "Advanced Mathematics",
  subtopic: "Trigonometry — Heights & Distances",
  name: "TRG-002 Heights & Distances Applications",
  label: "Heights & Distances Applications",
  generationDomain: "quant-v4",
  cpIds: [...TRG_002_QUESTION_STUDIO_CP_IDS],
  canonicalProblems: TRG_002_QUESTION_STUDIO_CP_IDS.map((cpId) => ({
    id: cpId,
    label: cpId,
  })),
  supportedDifficulties: ["easy", "medium", "hard"],
  supportedLanguages: [...TRG_002_QUESTION_STUDIO_LANGUAGES],
  enabled: true,
  runtimeMode: "RELEASED",
  supportedRuntimeModes: ["RELEASED"],
  reviewStatus: "APPROVED_EDITORIAL_CANONICAL",
  humanReviewStatus: "APPROVED_48_OF_48",
  questionBankStatus: "WRITABLE",
  testEligibility: "ELIGIBLE",
  publiclyPublishable: true,
  solutionDiagramPolicy: "REQUIRED_AFTER_ATTEMPT",
  approvedQuestionCount: 48,
} as const;

export type Trg002QuestionStudioRequest = {
  packageId?: string;
  archetypeId?: string;
  patternId?: string;
  topic?: string;
  subtopic?: string;
  canonicalProblemId?: string;
  cpId?: string;
  questionLanguageId?: string;
  language?: string;
  difficulty?: string | number;
  count?: number;
  seed?: string;
};

export type Trg002StoredSolutionDiagram = {
  kind: "TRG002_HEIGHTS_DISTANCES";
  version: 1;
  qlId: Trg002Mvp48Id;
  disclosure: "AFTER_ATTEMPT";
  sourceStateFingerprint?: string;
  diagram: unknown;
  annotations: unknown[];
};

function normalizeSelector(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function isTrg002GenerationRequest(request: Trg002QuestionStudioRequest) {
  const packageId = normalizeSelector(request.packageId ?? request.archetypeId);
  const patternId = normalizeSelector(request.patternId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  return (
    packageId === "trg 002" ||
    patternId.includes("trg 002") ||
    topic === "trigonometry" ||
    subtopic === "trigonometry heights distances" ||
    subtopic === "heights distances" ||
    subtopic === "heights and distances"
  );
}

function normalizeDifficulty(value: unknown): "Easy" | "Medium" | "Hard" | undefined {
  const text = String(value ?? "").trim().toLowerCase();
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

function hash(value: string) {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function cpForQl(qlId: Trg002Mvp48Id) {
  return TRG_002_QUESTION_STUDIO_CP_IDS.find((cpId) =>
    (TRG_002_MVP_48_BY_CP[cpId] as readonly string[]).includes(qlId),
  )!;
}

function qlCandidates(request: Trg002QuestionStudioRequest) {
  const requestedCp = request.canonicalProblemId ?? request.cpId;
  if (requestedCp) {
    if (!TRG_002_QUESTION_STUDIO_CP_IDS.includes(requestedCp as any)) {
      throw new Error(`Unknown canonical problem '${requestedCp}' for TRG-002.`);
    }
    return [...TRG_002_MVP_48_BY_CP[requestedCp as keyof typeof TRG_002_MVP_48_BY_CP]] as Trg002Mvp48Id[];
  }
  return [...TRG_002_MVP_48_IDS] as Trg002Mvp48Id[];
}

function chooseQl(
  request: Trg002QuestionStudioRequest,
  seed: string,
  index: number,
): { qlId: Trg002Mvp48Id; question: any } {
  const candidates = qlCandidates(request);
  const explicitQl = request.questionLanguageId;
  const requestedDifficulty = normalizeDifficulty(request.difficulty);

  if (explicitQl) {
    if (!TRG_002_MVP_48_IDS.includes(explicitQl as Trg002Mvp48Id) || !candidates.includes(explicitQl as Trg002Mvp48Id)) {
      throw new Error(`Unknown or out-of-scope TRG-002 question language id '${explicitQl}'.`);
    }
    const qlId = explicitQl as Trg002Mvp48Id;
    const question = generateFinalEditorialTrg002Mvp48Question(qlId, seed);
    if (requestedDifficulty && question.difficulty !== requestedDifficulty) {
      throw new Error(`${qlId} is ${question.difficulty}, not requested ${requestedDifficulty}.`);
    }
    return { qlId, question };
  }

  const start = (hash(`${seed}|${index}|trg-002`) + index) % candidates.length;
  for (let offset = 0; offset < candidates.length; offset += 1) {
    const qlId = candidates[(start + offset) % candidates.length]!;
    const question = generateFinalEditorialTrg002Mvp48Question(qlId, `${seed}|${qlId}`);
    if (!requestedDifficulty || question.difficulty === requestedDifficulty) {
      return { qlId, question };
    }
  }
  throw new Error(`No TRG-002 question matches requested difficulty ${requestedDifficulty}.`);
}

function storedSolutionDiagram(qlId: Trg002Mvp48Id, question: any): Trg002StoredSolutionDiagram {
  if (!question.solutionDiagram) {
    throw new Error(`${qlId}: required solution diagram is missing.`);
  }
  const annotations = Array.isArray(question.solutionAnnotations)
    ? question.solutionAnnotations
    : buildTrg002SolutionAnnotations(question).annotations;
  const stored: Trg002StoredSolutionDiagram = {
    kind: "TRG002_HEIGHTS_DISTANCES",
    version: 1,
    qlId,
    disclosure: "AFTER_ATTEMPT",
    ...(question.diagramEvidence?.sourceStateFingerprint
      ? { sourceStateFingerprint: String(question.diagramEvidence.sourceStateFingerprint) }
      : {}),
    diagram: question.solutionDiagram,
    annotations,
  };
  JSON.stringify(stored);
  return stored;
}

function previewQuestion(qlId: Trg002Mvp48Id, question: any, seed: string, index: number, count: number) {
  const solutionDiagram = storedSolutionDiagram(qlId, question);
  const options = question.options.map((option: any) => String(option.display));
  const explanation = buildTrg002ExamTreeExplanation({
    ...question,
    solutionAnnotations: solutionDiagram.annotations,
  });
  const cpId = question.cpId ?? cpForQl(qlId);
  const questionId = `${qlId}:${seed}`;
  const answerModel = {
    kind: "single_choice",
    options,
    correctOptionIndex: question.correctIndex,
    solutionDiagram,
  };
  const traceability = {
    packageId: TRG_002_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: cpId,
    questionLanguageId: qlId,
    lockedFamily: question.lockedFamily,
    solveMode: question.solveMode,
    releaseStatus: "HUMAN_APPROVED_48_OF_48",
    runtimeMode: "RELEASED",
    reviewStatus: "APPROVED_EDITORIAL_CANONICAL",
    questionBankStatus: "WRITABLE",
    testEligibility: "ELIGIBLE",
    publiclyPublishable: true,
  };

  return {
    text: question.stem,
    stem: question.stem,
    options,
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    explanation,
    packageExplanation: question.explanation,
    difficulty: question.difficulty,
    difficultyLabel: question.difficulty,
    patternId: TRG_002_QUESTION_STUDIO_PACKAGE_ID,
    section: "Quant",
    topic: "Advanced Mathematics",
    subtopic: "Trigonometry — Heights & Distances",
    generationBackend: "quant-v4",
    debugSource: "trg-002-approved-runtime",
    semanticMetadata: traceability,
    traceability,
    validation: question.validation,
    questionId,
    seed,
    answer: question.answer,
    canonicalAnswer: {
      kind: "symbolic",
      value: question.answer,
      display: question.answer,
      rendered: question.answer,
      rounding: "exact",
    },
    answerModel,
    solutionDiagram,
    runtimeMode: "RELEASED",
    reviewStatus: "APPROVED_EDITORIAL_CANONICAL",
    humanReviewStatus: "APPROVED",
    questionBankStatus: "WRITABLE",
    testEligibility: "ELIGIBLE",
    publiclyPublishable: true,
    packageSource: "trg-002-approved-runtime",
    packageId: TRG_002_QUESTION_STUDIO_PACKAGE_ID,
    taskKind: question.solveMode,
    scenarioId: String(question.canonicalSpatialState?.scenario ?? ""),
    language: "en",
    metadata: {
      language: "en",
      packageId: TRG_002_QUESTION_STUDIO_PACKAGE_ID,
      canonicalProblemId: cpId,
      questionLanguageId: qlId,
      explanationId: `${qlId}-EXP-EN`,
      taskKind: question.solveMode,
      runtimeMode: "RELEASED",
      reviewStatus: "APPROVED_EDITORIAL_CANONICAL",
      humanReviewStatus: "APPROVED",
      questionBankStatus: "WRITABLE",
      testEligibility: "ELIGIBLE",
      publiclyPublishable: true,
      solutionDiagramPolicy: "REQUIRED_AFTER_ATTEMPT",
    },
    questionIndex: index + 1,
    questionCount: count,
    canonicalProblemId: cpId,
    questionLanguageId: qlId,
    explanationId: `${qlId}-EXP-EN`,
    proceduralLogic: {
      qlId,
      lockedFamily: String(question.lockedFamily ?? ""),
      solveMode: String(question.solveMode ?? ""),
      target: String(question.target ?? ""),
    },
    logic: {
      qlId,
      lockedFamily: String(question.lockedFamily ?? ""),
      solveMode: String(question.solveMode ?? ""),
    },
    debugMetadata: {
      generationDomain: "quant-v4",
      selectedPattern: TRG_002_QUESTION_STUDIO_PACKAGE_ID,
      selectedArchetype: TRG_002_QUESTION_STUDIO_PACKAGE_ID,
      selectedMotif: cpId,
      canonicalProblemId: cpId,
      questionLanguageId: qlId,
      explanationId: `${qlId}-EXP-EN`,
      questionIndex: index + 1,
      questionCount: count,
      questionId,
      packageSource: "trg-002-approved-runtime",
      seed,
      validatorReports: question.validation,
    },
  };
}

export async function generateTrg002QuestionStudioBatch(request: Trg002QuestionStudioRequest = {}) {
  const language = request.language ?? "en";
  if (language !== "en") {
    throw new Error("TRG-002 currently supports Question Studio language 'en' only.");
  }
  const count = Math.min(1000, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const batchSeed = request.seed ?? `trg-002:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  const questions = [];
  const questionPackages = [];

  for (let index = 0; index < count; index += 1) {
    if (index > 0 && index % 100 === 0) await new Promise((resolve) => setImmediate(resolve));
    const itemSeed = `${batchSeed}:${index}`;
    const { qlId, question } = chooseQl(request, itemSeed, index);
    const preview = previewQuestion(qlId, question, itemSeed, index, count);
    JSON.stringify(preview);
    questions.push(preview);
    questionPackages.push({
      packageId: TRG_002_QUESTION_STUDIO_PACKAGE_ID,
      qlId,
      cpId: preview.canonicalProblemId,
      seed: itemSeed,
      stem: preview.stem,
      options: preview.options,
      correctIndex: preview.correctIndex,
      answer: preview.answer,
      difficulty: preview.difficulty,
      explanation: preview.explanation,
      solutionDiagram: preview.solutionDiagram,
      answerModel: preview.answerModel,
      reviewStatus: preview.reviewStatus,
      humanReviewStatus: preview.humanReviewStatus,
      questionBankStatus: preview.questionBankStatus,
      testEligibility: preview.testEligibility,
      publiclyPublishable: preview.publiclyPublishable,
      questionStudioDiscoverable: true,
    });
  }

  return {
    generationContext: {
      generationDomain: "quant-v4",
      packageId: TRG_002_QUESTION_STUDIO_PACKAGE_ID,
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: "RELEASED",
      reviewStatus: "APPROVED_EDITORIAL_CANONICAL",
      humanReviewStatus: "APPROVED_48_OF_48",
      questionBankStatus: "WRITABLE",
      testEligibility: "ELIGIBLE",
      publiclyPublishable: true,
      solutionDiagramPolicy: "REQUIRED_AFTER_ATTEMPT",
    },
    questionPackages,
    questions,
  };
}
