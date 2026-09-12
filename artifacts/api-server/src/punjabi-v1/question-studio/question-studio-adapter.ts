/**
 * Punjabi Content Engine — Question Studio Review Adapter
 * Connects the `punjabi-v1` generation engine to the Question Studio preview and review harness.
 */

import type {
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
} from "../core/types";
import {
  generatePUN001Question,
  generatePUN001ReviewBatch,
  listPUN001Checkpoints,
  PUN_001_PACKAGE_ID,
} from "../packages/PUN-001/package-definition";

export const PUNJABI_QUESTION_STUDIO_PACKAGE_ID = PUN_001_PACKAGE_ID;

export interface PunjabiQuestionStudioPackage {
  readonly packageId: typeof PUNJABI_QUESTION_STUDIO_PACKAGE_ID;
  readonly title: string;
  readonly titleGurmukhi: string;
  readonly subject: "Punjabi";
  readonly language: "pa";
  readonly enabled: boolean;
  readonly checkpoints: ReadonlyArray<{
    readonly cpId: string;
    readonly name: string;
    readonly nameGurmukhi: string;
    readonly families: readonly string[];
    readonly difficulties: readonly PunjabiDifficulty[];
    readonly status: "REVIEW_READY" | "IN_DEVELOPMENT" | "FROZEN";
  }>;
}

export function listPunjabiQuestionStudioPackages(): readonly PunjabiQuestionStudioPackage[] {
  const checkpoints = listPUN001Checkpoints().map((cp) => ({
    cpId: cp.cpId,
    name: cp.name,
    nameGurmukhi: cp.nameGurmukhi,
    families: cp.families.map((f) => f.familyId),
    difficulties: ["Easy", "Medium", "Hard"] as const,
    status: "REVIEW_READY" as const,
  }));

  return [
    {
      packageId: PUNJABI_QUESTION_STUDIO_PACKAGE_ID,
      title: "PUN-001 — Punjabi Language & Grammar",
      titleGurmukhi: "ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਅਤੇ ਵਿਆਕਰਣ",
      subject: "Punjabi",
      language: "pa",
      enabled: true,
      checkpoints,
    },
  ];
}

export interface PunjabiQuestionStudioReviewRequest {
  packageId: typeof PUNJABI_QUESTION_STUDIO_PACKAGE_ID;
  cpId?: string;
  familyId?: string;
  difficulty?: PunjabiDifficulty;
  count?: number;
  seed?: number;
}

export interface QuestionStudioPreviewItem {
  id: string;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  correctAnswer: string;
  explanation: string;
  difficulty: PunjabiDifficulty;
  subject: "Punjabi";
  packageId: string;
  cpId: string;
  familyId: string;
  seed: number;
  language: "pa";
}

export interface PunjabiQuestionStudioReviewResponse {
  packageId: string;
  totalGenerated: number;
  items: readonly QuestionStudioPreviewItem[];
}

export function previewPunjabiQuestionStudioReview(
  request: PunjabiQuestionStudioReviewRequest
): PunjabiQuestionStudioReviewResponse {
  const targetCpId = request.cpId || "PUN-001-CP001";
  const count = Math.min(Math.max(request.count || 10, 1), 60);
  const baseSeed = request.seed ?? Math.floor(Math.random() * 100000);
  const difficulty = request.difficulty || "Medium";

  const items: QuestionStudioPreviewItem[] = [];

  for (let i = 0; i < count; i++) {
    const currentSeed = baseSeed + i * 37;
    const question = generatePUN001Question(
      targetCpId,
      currentSeed,
      difficulty,
      request.familyId
    );

    items.push({
      id: question.id,
      stem: question.stem,
      options: question.options,
      correctIndex: question.correctIndex,
      correctAnswer: question.options[question.correctIndex]!,
      explanation: question.explanation,
      difficulty: question.difficulty,
      subject: "Punjabi",
      packageId: question.metadata.packageId,
      cpId: question.metadata.cpId,
      familyId: question.metadata.familyId,
      seed: question.metadata.seed,
      language: "pa",
    });
  }

  return {
    packageId: request.packageId,
    totalGenerated: items.length,
    items,
  };
}

export function exportGoldenBatchJson(
  cpId: string = "PUN-001-CP001",
  count: number = 60,
  seed: number = 5000
): string {
  const batch = generatePUN001ReviewBatch(cpId, count, seed);
  return JSON.stringify(batch, null, 2);
}
