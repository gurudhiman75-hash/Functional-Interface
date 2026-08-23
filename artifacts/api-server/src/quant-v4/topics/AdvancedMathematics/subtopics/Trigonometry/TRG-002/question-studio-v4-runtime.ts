import { Buffer } from "node:buffer";

import { generateTrg002V4CandidateQuestion } from "./exam-readiness-v4-candidate";
import { applyTrg002V4DiagramSemanticCorrections } from "./exam-readiness-v4-diagram-semantics";
import { generateTrg002V4EnglishAuthorityQuestion } from "./exam-readiness-v4-english-authority";
import { applyTrg002V4PedagogicDiagramLayerFinal } from "./exam-readiness-v4-pedagogic-diagrams-final";
import { applyTrg002V4ReviewDimensions } from "./exam-readiness-v4-review-dimensions";
import {
  applyTrg002V4ApprovedLifecycle,
  TRG_002_V4_ACTIVATION,
  TRG_002_V4_APPROVED_ARTIFACT,
  TRG_002_V4_APPROVED_SOURCE_HEAD,
  TRG_002_V4_HUMAN_APPROVAL,
} from "./exam-readiness-v4-approved-governance";
import {
  TRG_002_PRODUCTION_96_IDS,
  trg002ProductionCpForId,
} from "./production-96-registry";
import {
  TRG_002_EXAMTREE_DIRECTIVE_PREFIX,
  TRG_002_EXAMTREE_MAX_ENCODED_LENGTH,
} from "./examtree-solution-directive";

type AnyRecord = Record<string, any>;
export type Trg002V4StudioLanguage = "en" | "hi" | "pa";

export const TRG_002_V4_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export const TRG_002_V4_QUESTION_STUDIO_CP_IDS = ["TRG-CP-007", "TRG-CP-008", "TRG-CP-009", "TRG-CP-010"] as const;

export const TRG_002_V4_QUESTION_STUDIO_PACKAGE = {
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
  canonicalProblems: TRG_002_V4_QUESTION_STUDIO_CP_IDS.map((cpId) => ({ id: cpId, label: cpId })),
  cpIds: [...TRG_002_V4_QUESTION_STUDIO_CP_IDS],
  qlCount: 96,
  supportedDifficulties: ["easy", "medium", "hard"],
  supportedLanguages: [...TRG_002_V4_QUESTION_STUDIO_LANGUAGES],
  enabled: true,
  runtimeMode: TRG_002_V4_ACTIVATION.runtimeMode,
  reviewStatus: "APPROVED_V4_TRILINGUAL",
  humanReviewStatus: "APPROVED_96_OF_96_TRILINGUAL",
  humanReviewed: 96,
  humanReviewTarget: 96,
  multilingualFreezeGranted: true,
  activationAuthorized: true,
  questionStudioDiscoverable: true,
  questionBankStatus: TRG_002_V4_ACTIVATION.questionBankStatus,
  testEligibility: TRG_002_V4_ACTIVATION.testEligibility,
  publiclyPublishable: false,
  publicReleaseAuthorized: false,
  freezeStatus: TRG_002_V4_ACTIVATION.freezeStatus,
  solutionDiagramPolicy: "REQUIRED_AFTER_ATTEMPT",
  stemDiagramPolicy: "OPTIONAL_NOT_AUTOMATIC",
  approvedBaselineHead: TRG_002_V4_APPROVED_SOURCE_HEAD,
  approvedArtifactId: TRG_002_V4_APPROVED_ARTIFACT.id,
  approvedArtifactDigest: TRG_002_V4_APPROVED_ARTIFACT.digest,
} as const;

export type Trg002V4QuestionStudioRequest = {
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

function normalizeRequestText(value: unknown) {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function normalizeLanguage(value: unknown): Trg002V4StudioLanguage {
  const language = String(value ?? "en").trim().toLowerCase();
  if (["en", "en-in", "en-us", "english"].includes(language)) return "en";
  if (["hi", "hi-in", "hindi"].includes(language)) return "hi";
  if (["pa", "pa-in", "punjabi", "panjabi"].includes(language)) return "pa";
  throw Object.assign(new Error(`TRG-002 approved V4 runtime supports en/hi/pa, not '${String(value)}'.`), { statusCode: 400 });
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
  const normalized = String(requested).trim().toLowerCase();
  return qlDifficulty.toLowerCase() === (normalized === "moderate" ? "medium" : normalized);
}

export function isTrg002V4GenerationRequest(request: Trg002V4QuestionStudioRequest) {
  const explicit = String(request.packageId ?? request.archetypeId ?? "").toUpperCase();
  const pattern = String(request.patternId ?? "").toUpperCase();
  if (explicit === "TRG-002" || pattern === "TRG-002" || pattern.includes("TRG-002")) return true;
  const topic = normalizeRequestText(request.topic);
  const subtopic = normalizeRequestText(request.subtopic);
  return topic === "trigonometry"
    || subtopic.includes("heights distances")
    || subtopic.includes("heights and distances")
    || (topic === "advanced mathematics" && subtopic.includes("trigonometry"));
}

function requestedQlIds(request: Trg002V4QuestionStudioRequest) {
  const qlId = String(request.questionLanguageId ?? "").toUpperCase();
  if (qlId) {
    if (TRG_002_PRODUCTION_96_IDS.includes(qlId)) return [qlId];
    throw Object.assign(new Error(`Unknown TRG-002 question language id '${qlId}'.`), { statusCode: 400 });
  }
  const cp = String(request.canonicalProblemId ?? request.cpId ?? "").toUpperCase();
  if (!cp) return TRG_002_PRODUCTION_96_IDS;
  if (TRG_002_PRODUCTION_96_IDS.includes(cp)) return [cp];
  if ((TRG_002_V4_QUESTION_STUDIO_CP_IDS as readonly string[]).includes(cp)) {
    return TRG_002_PRODUCTION_96_IDS.filter((id) => trg002ProductionCpForId(id) === cp);
  }
  throw Object.assign(new Error(`Unknown TRG-002 canonical problem or CP '${cp}'.`), { statusCode: 400 });
}

function explanationText(explanation: AnyRecord) {
  return [
    explanation?.keyRule ?? "",
    ...(explanation?.steps ?? []).map((step: AnyRecord) => step?.body ?? ""),
    explanation?.shortcut ?? "",
    ...(explanation?.traps ?? []),
  ].join(" ");
}

function normalizeMath(value: unknown) {
  return String(value ?? "").replaceAll("−", "-").replace(/\s+/gu, "").replace(/m$/u, "").trim();
}

function suppressAnswerEquivalentDerivedHelpers(diagram: AnyRecord, answer: string) {
  const target = normalizeMath(answer);
  diagram.measurementArrows = (diagram.measurementArrows ?? []).filter((arrow: AnyRecord) => {
    const kind = String(arrow.kind ?? "");
    if (!kind.includes("DERIVED_HELPER")) return true;
    return normalizeMath(String(arrow.label ?? "").replace(/^[^=]*=/u, "")) !== target;
  });
  if (diagram.reviewDimensionAudit) diagram.reviewDimensionAudit.totalDimensions = diagram.measurementArrows.length;
  return diagram;
}

function splitSentences(value: unknown) {
  return String(value ?? "").replace(/\s+/gu, " ").trim().split(/(?<=[.!?])\s*/u).map((part) => part.trim()).filter(Boolean);
}

function isWorkedEquation(sentence: string) {
  const trigToken = /\b(?:tan|sin|cos|cot)(?=\s*(?:\d|°|θ|\())/iu;
  return trigToken.test(sentence) || /⇒/u.test(sentence) || (/=/u.test(sentence) && !/^\s*let\b/iu.test(sentence));
}

function geometryCue(diagram: AnyRecord, stem: string) {
  const segments = diagram.segments ?? [];
  const points = diagram.points ?? [];
  const support = segments.some((segment: AnyRecord) => ["LADDER", "WIRE"].includes(String(segment.semanticKind ?? segment.kind ?? "")));
  const shadowEndpoints = points.filter((point: AnyRecord) => /shadow/i.test(String(point.id ?? ""))).length;
  const eyeLevel = segments.some((segment: AnyRecord) => String(segment.kind) === "EYE_LEVEL")
    && points.some((point: AnyRecord) => /^H\d*$/u.test(String(point.label ?? "")));
  if (/shadow/iu.test(stem)) return shadowEndpoints >= 2
    ? "The two shadow endpoints are separate right-triangle states; match each sun angle to its own shadow."
    : "The vertical object and its shadow are the perpendicular legs of the working right triangle.";
  if (support) return "The wall/object is perpendicular to the ground and the ladder/wire is the hypotenuse of the working right triangle.";
  if (eyeLevel) return "Use the visible eye-level helper and the rise/drop from that level in the tangent triangle.";
  const sights = segments.filter((segment: AnyRecord) => String(segment.kind) === "SIGHT_LINE").length;
  if (sights >= 2) return "Treat each sight line as its own observation triangle and link the triangles through the shared height or ground relation.";
  return "Use the bold vertical and horizontal segments as the perpendicular legs; the blue segment is the line of sight.";
}

function teachingCues(english: AnyRecord, diagram: AnyRecord) {
  const steps = (english.explanation?.steps ?? []).flatMap((step: AnyRecord) => splitSentences(step?.body));
  const worked = steps.find(isWorkedEquation) ?? steps.find((sentence: string) => /\blet\s/iu.test(sentence)) ?? steps[0] ?? "Use the marked right triangle.";
  return [
    { kind: "GEOMETRY", text: geometryCue(diagram, english.stem) },
    { kind: "RULE", text: String(english.explanation?.keyRule ?? "Use the applicable trigonometric ratio.").trim() },
    { kind: "CALCULATION", text: worked },
  ];
}

function addQl037WallAngleOverlay(diagram: AnyRecord) {
  const contact = (diagram.points ?? []).find((point: AnyRecord) => point.id === "wall-contact");
  const wallBase = (diagram.points ?? []).find((point: AnyRecord) => point.id === "wall-base");
  const ladderBase = (diagram.points ?? []).find((point: AnyRecord) => point.id === "ladder-base");
  if (!contact || !wallBase || !ladderBase) throw new Error("TRG-002-QL-037: approved runtime requires C/wall/ladder angle geometry.");
  contact.label = "C";
  const a = Math.atan2(Number(wallBase.y) - Number(contact.y), Number(wallBase.x) - Number(contact.x));
  const b = Math.atan2(Number(ladderBase.y) - Number(contact.y), Number(ladderBase.x) - Number(contact.x));
  let delta = b - a;
  while (delta > Math.PI) delta -= 2 * Math.PI;
  while (delta < -Math.PI) delta += 2 * Math.PI;
  const actualDegrees = Math.abs(delta) * 180 / Math.PI;
  if (Math.abs(actualDegrees - 30) > 0.75) throw new Error(`TRG-002-QL-037: approved runtime wall angle is ${actualDegrees.toFixed(2)}°, not 30°.`);
  diagram.pedagogicAngleOverlays = [{
    id: "ql037-given-wall-angle",
    vertexPointId: "wall-contact",
    referencePointId: "wall-base",
    rayPointId: "ladder-base",
    label: "30°",
    semanticRole: "GIVEN_LADDER_TO_WALL_ANGLE",
    actualDegrees,
  }];
}

function approvedTeachingDiagram(qlId: string, english: AnyRecord) {
  const dimensioned = applyTrg002V4ReviewDimensions({
    qlId,
    diagram: { ...english.solutionDiagram, measurementArrows: [] },
    canonicalSpatialState: english.canonicalSpatialState,
    englishStem: english.stem,
    englishExplanationText: explanationText(english.explanation),
  });
  const semantic = applyTrg002V4DiagramSemanticCorrections({ qlId, diagram: dimensioned, englishStem: english.stem });
  const cleaned = suppressAnswerEquivalentDerivedHelpers(semantic.diagram, english.answer);
  const pedagogic = applyTrg002V4PedagogicDiagramLayerFinal({
    qlId,
    diagram: cleaned,
    englishStem: english.stem,
    englishExplanationText: explanationText(english.explanation),
    englishAnswer: english.answer,
    topology: english.v4ExamReadiness?.spatialTopology,
  });
  if (qlId === "TRG-002-QL-037") addQl037WallAngleOverlay(pedagogic.diagram);
  const cues = teachingCues(english, pedagogic.diagram);
  pedagogic.diagram.pedagogicTeachingCues = cues;
  pedagogic.diagram.pedagogicDiagramAudit = {
    ...(pedagogic.diagram.pedagogicDiagramAudit ?? {}),
    teachingPanelPresent: true,
    teachingCues: 3,
    approvedRuntime: true,
  };
  return pedagogic.diagram;
}

function sourceQuestion(qlId: string, seed: string, language: Trg002V4StudioLanguage) {
  const english: AnyRecord = generateTrg002V4EnglishAuthorityQuestion(qlId, seed);
  const localized: AnyRecord = language === "en"
    ? english
    : generateTrg002V4CandidateQuestion(qlId, seed, language === "hi" ? "hi-IN" : "pa-IN");
  const cpId = trg002ProductionCpForId(qlId);
  const approved: AnyRecord = applyTrg002V4ApprovedLifecycle({ ...localized, cpId, qlId }) as AnyRecord;
  return { english, question: approved };
}

function v4Annotations(diagram: AnyRecord) {
  const dimensions = (diagram.measurementArrows ?? []).map((arrow: AnyRecord, index: number) => ({
    id: String(arrow.id ?? `v4-dimension-${index + 1}`),
    role: String(arrow.kind ?? "DIMENSION"),
    fromPointId: String(arrow.fromPointId ?? ""),
    toPointId: String(arrow.toPointId ?? ""),
    label: String(arrow.label ?? ""),
    placement: String(arrow.side ?? "LEFT"),
    lane: Number(arrow.lane ?? 0),
    pedagogic: Boolean(arrow.pedagogic),
  }));
  const cues = (diagram.pedagogicTeachingCues ?? []).map((cue: AnyRecord, index: number) => ({
    id: `teaching-cue-${index + 1}`,
    role: String(cue.kind ?? "TEACHING"),
    label: String(cue.text ?? ""),
    pedagogic: true,
  }));
  return [...dimensions, ...cues];
}

function storagePayload(question: AnyRecord, diagram: AnyRecord) {
  const annotations = v4Annotations(diagram);
  const payload = {
    kind: "TRG002_HEIGHTS_DISTANCES",
    version: 2,
    qlId: question.qlId,
    disclosure: "AFTER_ATTEMPT",
    sourceStateFingerprint: String(question.v4Fingerprint ?? question.diagramEvidence?.sourceStateFingerprint ?? ""),
    approvedSourceHead: TRG_002_V4_APPROVED_SOURCE_HEAD,
    approvedArtifactId: TRG_002_V4_APPROVED_ARTIFACT.id,
    diagram,
    annotations,
  };
  JSON.stringify(payload);
  return payload;
}

function encodeBase64Url(value: string) {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/gu, "-")
    .replace(/\//gu, "_")
    .replace(/=+$/gu, "");
}

function buildV4ExamTreeExplanation(question: AnyRecord, solutionDiagram: AnyRecord) {
  const directivePayload = {
    version: 2,
    qlId: question.qlId,
    diagram: solutionDiagram.diagram,
    annotations: solutionDiagram.annotations,
    approvedSourceHead: TRG_002_V4_APPROVED_SOURCE_HEAD,
    approvedArtifactId: TRG_002_V4_APPROVED_ARTIFACT.id,
  };
  const encoded = encodeBase64Url(JSON.stringify(directivePayload));
  if (encoded.length > TRG_002_EXAMTREE_MAX_ENCODED_LENGTH) {
    throw new Error(`${question.qlId}: V4 ExamTree solution directive exceeds ${TRG_002_EXAMTREE_MAX_ENCODED_LENGTH} encoded characters.`);
  }
  const structured = question.explanation ?? {};
  return [
    `Core rule: ${String(structured.keyRule ?? "")}`,
    ...(structured.steps ?? []).map((step: AnyRecord) => `${String(step.title ?? "Step")}: ${String(step.body ?? "")}`),
    structured.shortcut ? `Shortcut: ${String(structured.shortcut)}` : "",
    (structured.traps ?? []).length ? `Common trap: ${(structured.traps ?? []).join(" ")}` : "",
    `${TRG_002_EXAMTREE_DIRECTIVE_PREFIX}${encoded}]]`,
  ].filter(Boolean).join("\n\n");
}

function optionDisplay(option: any) {
  return String(option?.display ?? option?.text ?? option?.value ?? option?.label ?? option);
}

function questionStudioPreview(qlId: string, seed: string, language: Trg002V4StudioLanguage, index: number, count: number) {
  const { english, question } = sourceQuestion(qlId, seed, language);
  const diagram = approvedTeachingDiagram(qlId, english);
  const solutionDiagram = storagePayload(question, diagram);
  const options = (question.options ?? []).map(optionDisplay);
  const explanation = buildV4ExamTreeExplanation(question, solutionDiagram);
  const cpId = trg002ProductionCpForId(qlId);
  const answerModel = {
    kind: "single_choice",
    options,
    correctOptionIndex: question.correctIndex,
    solutionDiagram,
  };
  const preview = {
    id: `${qlId}:${language}:${seed}`,
    questionId: `${qlId}:${language}:${seed}`,
    text: question.stem,
    stem: question.stem,
    options,
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: { kind: "symbolic", value: question.answer, display: question.answer, rendered: question.answer, rounding: "exact" },
    answerModel,
    explanation,
    packageExplanation: question.explanation,
    section: "Quant",
    topic: "Advanced Mathematics",
    subtopic: "Trigonometry — Heights & Distances",
    difficulty: question.difficulty,
    difficultyLabel: question.difficulty,
    packageId: "TRG-002",
    language,
    seed,
    patternId: "TRG-002",
    runtimeMode: "RELEASED",
    reviewStatus: "HUMAN_APPROVED_V4",
    humanReviewStatus: "APPROVED",
    multilingualFreezeGranted: true,
    activationAuthorized: true,
    questionStudioDiscoverable: true,
    questionBankStatus: "WRITABLE",
    testEligibility: "ELIGIBLE",
    publiclyPublishable: false,
    publicReleaseAuthorized: false,
    freezeStatus: "FROZEN",
    solutionDiagram,
    canonicalProblemId: cpId,
    cpId,
    questionLanguageId: qlId,
    explanationId: `${qlId}-EXP-${language.toUpperCase()}`,
    taskKind: question.solveMode,
    scenarioId: String(question.canonicalSpatialState?.scenario ?? question.v4ExamReadiness?.recommendedScenarioShell ?? ""),
    proceduralLogic: {
      generationSystem: "quant-v4",
      packageId: "TRG-002",
      cpId,
      qlId,
      lockedFamily: String(question.lockedFamily ?? ""),
      solveMode: String(question.solveMode ?? ""),
      target: String(question.target ?? ""),
      seed,
      approvedBaselineHead: TRG_002_V4_APPROVED_SOURCE_HEAD,
      approvedArtifactId: TRG_002_V4_APPROVED_ARTIFACT.id,
      humanReviewStatus: "APPROVED",
      multilingualFreezeGranted: true,
      activationAuthorized: true,
      solutionDiagramPolicy: "REQUIRED_AFTER_ATTEMPT",
    },
    motifs: ["TRG-002", cpId, qlId, String(question.lockedFamily ?? "")],
    languages: [...TRG_002_V4_QUESTION_STUDIO_LANGUAGES],
    generationMetadata: {
      packageId: "TRG-002",
      cpId,
      qlId,
      questionIndex: index + 1,
      questionCount: count,
      seed,
      language,
      reviewStatus: "HUMAN_APPROVED_V4",
      humanReviewStatus: "APPROVED",
      multilingualFreezeGranted: true,
      activationAuthorized: true,
      questionBankStatus: "WRITABLE",
      testEligibility: "ELIGIBLE",
      publiclyPublishable: false,
      publicReleaseAuthorized: false,
      approvedBaselineHead: TRG_002_V4_APPROVED_SOURCE_HEAD,
      approvedArtifactId: TRG_002_V4_APPROVED_ARTIFACT.id,
      approvedArtifactDigest: TRG_002_V4_APPROVED_ARTIFACT.digest,
      solutionDiagramStoredIn: "answerModel.solutionDiagram",
      solutionDiagramPresentation: "EXPLANATION_DIRECTIVE_WITH_PEDAGOGIC_METADATA",
    },
  };
  JSON.stringify(preview);
  return preview;
}

export function generateApprovedTrg002V4Question(qlId: string, seed: string, language: Trg002V4StudioLanguage = "en") {
  return questionStudioPreview(qlId, seed, language, 0, 1);
}

export function generateTrg002V4QuestionStudioBatch(request: Trg002V4QuestionStudioRequest = {}) {
  if (TRG_002_V4_HUMAN_APPROVAL.status !== "APPROVED" || !TRG_002_V4_ACTIVATION.activationAuthorized) {
    throw new Error("TRG-002 V4 runtime activation is not approved.");
  }
  const language = normalizeLanguage(request.language);
  const count = Math.min(1000, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const batchSeed = request.seed ?? `trg-002-v4-question-studio:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  const pool = requestedQlIds(request);
  const difficultyPool = pool.filter((qlId, index) => {
    const probe: AnyRecord = generateTrg002V4EnglishAuthorityQuestion(qlId, `${batchSeed}:difficulty:${index}`);
    return difficultyMatches(String(probe.difficulty ?? ""), request.difficulty);
  });
  if (!difficultyPool.length) throw Object.assign(new Error("No approved TRG-002 V4 QL matches the requested difficulty in the selected scope."), { statusCode: 400 });
  const order = shuffled(difficultyPool, `${batchSeed}:ql-order`);
  const questions: AnyRecord[] = [];
  const questionPackages: AnyRecord[] = [];
  for (let index = 0; index < count; index += 1) {
    const qlId = order[index % order.length]!;
    const seed = `${batchSeed}:${language}:${qlId}:${index}`;
    const preview = questionStudioPreview(qlId, seed, language, index, count);
    questions.push(preview);
    questionPackages.push({
      packageId: "TRG-002",
      cpId: preview.cpId,
      qlId,
      seed,
      language,
      stem: preview.stem,
      options: preview.options,
      correctIndex: preview.correctIndex,
      answer: preview.answer,
      difficulty: preview.difficulty,
      explanation: preview.explanation,
      answerModel: preview.answerModel,
      solutionDiagram: preview.solutionDiagram,
      runtimeMode: preview.runtimeMode,
      reviewStatus: preview.reviewStatus,
      humanReviewStatus: preview.humanReviewStatus,
      multilingualFreezeGranted: true,
      activationAuthorized: true,
      questionBankStatus: "WRITABLE",
      testEligibility: "ELIGIBLE",
      publiclyPublishable: false,
      publicReleaseAuthorized: false,
      questionStudioDiscoverable: true,
    });
  }
  return {
    generationContext: {
      generationDomain: "quant-v4",
      packageId: "TRG-002",
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: "RELEASED",
      reviewStatus: "HUMAN_APPROVED_V4",
      humanReviewStatus: "APPROVED_96_OF_96_TRILINGUAL",
      humanReviewed: 96,
      supportedLanguages: [...TRG_002_V4_QUESTION_STUDIO_LANGUAGES],
      multilingualFreezeGranted: true,
      activationAuthorized: true,
      questionStudioDiscoverable: true,
      questionBankStatus: "WRITABLE",
      testEligibility: "ELIGIBLE",
      publiclyPublishable: false,
      publicReleaseAuthorized: false,
      freezeStatus: "FROZEN",
      approvedBaselineHead: TRG_002_V4_APPROVED_SOURCE_HEAD,
      approvedArtifactId: TRG_002_V4_APPROVED_ARTIFACT.id,
      approvedArtifactDigest: TRG_002_V4_APPROVED_ARTIFACT.digest,
      solutionDiagramStorage: "answerModel.solutionDiagram",
      solutionDiagramPresentation: "stored explanation directive + pedagogic metadata",
    },
    questionPackages,
    questions,
  };
}
