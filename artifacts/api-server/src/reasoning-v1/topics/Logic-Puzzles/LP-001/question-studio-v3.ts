import {
  generateLogicPuzzleQuestionStudioBatch as generateLegacyBatch,
  isLogicPuzzleQuestionStudioRequest as isLegacyRequest,
  listLogicPuzzleQuestionStudioPackages as listLegacyPackages,
  type LogicPuzzleQuestionStudioRequest,
} from "./question-studio-v2.ts";
import { LP_011_REVIEW_PACKAGE } from "./lp-011.ts";
import { generateLp011BatchStabilizedV1_3 } from "./lp-011-stabilized-v1-3.ts";
import { LP_011_ENGLISH_FREEZE_V1 } from "./lp-011-permanent-freeze-v1.ts";
import { generateLp006ProjectionBatchV2 } from "./lp-006-projection-extension-v2.ts";
import { LP_006_PROJECTION_ENGLISH_FREEZE_V1 } from "./lp-006-projection-permanent-freeze-v1.ts";

function normalize(value: unknown): string {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function selector(request: LogicPuzzleQuestionStudioRequest): string {
  return normalize(request.cpId ?? request.canonicalProblemId ?? request.patternId);
}

function isLp011Request(request: LogicPuzzleQuestionStudioRequest): boolean {
  const pkg = normalize(request.packageId ?? request.archetypeId);
  const selected = selector(request);
  return pkg === "lp 011" || /^lp ql 04[1-4]$/u.test(selected) || selected === "lp cp 011";
}

function isLp006ProjectionRequest(request: LogicPuzzleQuestionStudioRequest): boolean {
  const selected = selector(request);
  return /^lp ql 04[5-6]$/u.test(selected) || selected === "lp cp 006 projection";
}

function requireEnglish(request: LogicPuzzleQuestionStudioRequest): "en" {
  const language = normalize(request.language || "en");
  if (language && language !== "en" && language !== "english") {
    throw new Error("LP-011 and LP-006 projection localization is not frozen yet. Use language=en for the current review authority.");
  }
  return "en";
}

function commonQuestion(child: any, caselet: any, packageId: string, checkpointId: string, seed: string, index: number, authorityId: string, text: string) {
  return {
    text,
    options: child.options,
    correct: child.correctIndex,
    correctIndex: child.correctIndex,
    answer: child.answer,
    explanation: child.explanation.lines.join("\n\n"),
    packageExplanation: child.explanation,
    difficulty: child.difficultyBand,
    difficultyLabel: child.difficultyBand,
    patternId: child.qlId,
    section: "Reasoning",
    topic: "Puzzles",
    subtopic: "Logic Puzzles",
    generationBackend: "reasoning-v1",
    packageId,
    canonicalProblemId: child.qlId,
    questionLanguageId: `${child.qlId}-EN`,
    questionId: child.questionId,
    language: "en",
    seed,
    questionIndex: index,
    runtimeMode: "REVIEW_ONLY",
    reviewStatus: "REVIEW_ONLY",
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    testEligibility: "INELIGIBLE",
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    traceability: { checkpointId, qlId: child.qlId, caseletId: caselet.caseletId, sourceStatus: authorityId },
    metadata: { packageId, checkpointId, qlId: child.qlId, caseletId: caselet.caseletId, language: "en", localizationAuthorityId: null, englishAuthorityId: authorityId },
  };
}

export function isLogicPuzzleQuestionStudioRequestV3(request: LogicPuzzleQuestionStudioRequest): boolean {
  return isLp011Request(request) || isLp006ProjectionRequest(request) || isLegacyRequest(request);
}

export function listLogicPuzzleQuestionStudioPackagesV3() {
  return [
    ...listLegacyPackages(),
    {
      id: "LP-011",
      packageId: "LP-011",
      type: "reasoning-v1",
      section: "Reasoning",
      domain: "reasoning",
      subject: "Reasoning",
      topic: "Puzzles",
      subtopic: "Logic Puzzles",
      name: LP_011_REVIEW_PACKAGE.label,
      label: LP_011_REVIEW_PACKAGE.label,
      generationDomain: "reasoning-v1",
      cpIds: [LP_011_REVIEW_PACKAGE.checkpointId],
      canonicalProblems: LP_011_ENGLISH_FREEZE_V1.permanentQlIds.map((id) => ({ id, label: id, checkpointId: LP_011_REVIEW_PACKAGE.checkpointId })),
      patternIds: [...LP_011_ENGLISH_FREEZE_V1.permanentQlIds],
      supportedDifficulties: ["Easy", "Medium", "Hard"],
      supportedLanguages: ["en"],
      enabled: true,
      runtimeMode: "REVIEW_ONLY",
      reviewOnly: true,
      permanentQlCount: 4,
      permanentQlIds: [...LP_011_ENGLISH_FREEZE_V1.permanentQlIds],
      permanentQlAllocationStatus: "ALLOCATED",
      localizationFreezeStatus: "PENDING",
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
    {
      id: "LP-006-PROJECTION",
      packageId: "LP-006",
      extensionId: "LP-006-PROJECTION",
      type: "reasoning-v1",
      section: "Reasoning",
      domain: "reasoning",
      subject: "Reasoning",
      topic: "Puzzles",
      subtopic: "Logic Puzzles",
      name: "LP-006 Cross-Attribute Projections",
      label: "LP-006 Cross-Attribute Projections",
      generationDomain: "reasoning-v1",
      cpIds: [LP_006_PROJECTION_ENGLISH_FREEZE_V1.checkpointId],
      canonicalProblems: LP_006_PROJECTION_ENGLISH_FREEZE_V1.permanentQlIds.map((id) => ({ id, label: id, checkpointId: LP_006_PROJECTION_ENGLISH_FREEZE_V1.checkpointId })),
      patternIds: [...LP_006_PROJECTION_ENGLISH_FREEZE_V1.permanentQlIds],
      supportedDifficulties: ["Easy", "Medium", "Hard"],
      supportedLanguages: ["en"],
      enabled: true,
      runtimeMode: "REVIEW_ONLY",
      reviewOnly: true,
      permanentQlCount: 2,
      permanentQlIds: [...LP_006_PROJECTION_ENGLISH_FREEZE_V1.permanentQlIds],
      permanentQlAllocationStatus: "ALLOCATED",
      localizationFreezeStatus: "PENDING",
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  ];
}

export async function generateLogicPuzzleQuestionStudioBatchV3(request: LogicPuzzleQuestionStudioRequest = {}) {
  if (!isLp011Request(request) && !isLp006ProjectionRequest(request)) return generateLegacyBatch(request);
  requireEnglish(request);
  const count = Math.min(12, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const seed = String(request.seed || (isLp011Request(request) ? "question-studio:LP-011" : "question-studio:LP-006-PROJECTION"));

  if (isLp011Request(request)) {
    const caselets = generateLp011BatchStabilizedV1_3(seed, count);
    const questions = caselets.flatMap((caselet, caseletIndex) => caselet.children.map((child, childIndex) => {
      const text = `${caselet.scenario}\n\nClues:\n${caselet.clues.map((clue) => `- ${clue.text}`).join("\n")}\n\n${child.stem}`;
      return commonQuestion(child, caselet, "LP-011", LP_011_REVIEW_PACKAGE.checkpointId, seed, caseletIndex * 4 + childIndex, LP_011_ENGLISH_FREEZE_V1.authorityId, text);
    }));
    return { generationContext: { generationDomain: "reasoning-v1", packageId: "LP-011", chapterId: "REAS-PUZ", seed, runtimeMode: "REVIEW_ONLY", permanentQlIds: [...LP_011_ENGLISH_FREEZE_V1.permanentQlIds], permanentQlAllocationStatus: "ALLOCATED", localizationFreezeStatus: "PENDING", language: "en", checkpointId: LP_011_REVIEW_PACKAGE.checkpointId }, questionPackages: questions, questions };
  }

  const caselets = generateLp006ProjectionBatchV2(seed, count);
  const questions = caselets.flatMap((caselet, caseletIndex) => caselet.projectionChildren.map((child, childIndex) => commonQuestion(child, caselet, "LP-006", LP_006_PROJECTION_ENGLISH_FREEZE_V1.checkpointId, seed, caseletIndex * 2 + childIndex, LP_006_PROJECTION_ENGLISH_FREEZE_V1.authorityId, child.stem)));
  return { generationContext: { generationDomain: "reasoning-v1", packageId: "LP-006", extensionId: "LP-006-PROJECTION", chapterId: "REAS-PUZ", seed, runtimeMode: "REVIEW_ONLY", permanentQlIds: [...LP_006_PROJECTION_ENGLISH_FREEZE_V1.permanentQlIds], permanentQlAllocationStatus: "ALLOCATED", localizationFreezeStatus: "PENDING", language: "en", checkpointId: LP_006_PROJECTION_ENGLISH_FREEZE_V1.checkpointId }, questionPackages: questions, questions };
}
