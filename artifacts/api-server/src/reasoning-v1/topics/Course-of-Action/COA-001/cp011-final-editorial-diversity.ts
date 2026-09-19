import type {
  QuestionStudioGenerationRequest,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types.ts";
import {
  COA_CURRENT_ENGLISH_AUTHORITIES,
} from "./english-authorities.ts";
import {
  COA_CP008_EITHER_AUTHORITIES,
  COA_CP008_THREE_ACTION_AUTHORITIES,
} from "./cp008-profile-authorities.ts";
import {
  COA_CP010_ACTIVE_QL_IDS,
  COA_CP010_PRESENTATION_PROFILES,
  COA_CP010_QUESTION_STUDIO_PACKAGE,
  generateCoaCp010QuestionStudioBatch,
  isCoaCp010QuestionStudioRequest,
  type CoaCp010ActiveQlId,
  type CoaCp010PresentationProfile,
} from "./cp010-question-studio-integration.ts";
import type { CoaDifficulty } from "./types.ts";

export const COA_CP011_CHECKPOINT_ID = "COA-CP-011" as const;
export const COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY =
  "COA_CP011_FINAL_EDITORIAL_DIVERSITY_FREEZE_V1" as const;
export const COA_CP011_STATUS = "FINAL_EDITORIAL_DIVERSITY_REVIEW_PENDING" as const;

type ExtendedRequest = QuestionStudioGenerationRequest & Readonly<{
  cpId?: string;
  presentationProfile?: string;
}>;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeDifficulty(value: unknown): CoaDifficulty | undefined {
  const normalized = text(value).toLowerCase();
  if (!normalized || normalized === "mixed") return undefined;
  if (normalized === "easy") return "EASY";
  if (normalized === "medium" || normalized === "moderate") return "MEDIUM";
  if (normalized === "hard") return "HARD";
  throw new Error(`COA-001 difficulty must be Easy, Medium, Hard or Mixed; received ${String(value)}`);
}

function resolveQl(request: ExtendedRequest): CoaCp010ActiveQlId | undefined {
  const candidates = [
    request.canonicalProblemId,
    request.questionLanguageId,
    text(request.patternId).toUpperCase().startsWith("COA-QL-") ? request.patternId : undefined,
  ]
    .map((value) => text(value).toUpperCase())
    .filter((value) => value.startsWith("COA-QL-"));
  const unique = [...new Set(candidates)];
  if (unique.length > 1) throw new Error(`Conflicting COA QL selectors: ${unique.join(", ")}`);
  const selected = unique[0];
  if (!selected) return undefined;
  if (selected === "COA-QL-007") {
    throw new Error("COA-QL-007 is retired from semantic generation");
  }
  if (!(COA_CP010_ACTIVE_QL_IDS as readonly string[]).includes(selected)) {
    throw new Error(`Unsupported COA Question Studio QL ${selected}`);
  }
  return selected as CoaCp010ActiveQlId;
}

function qlsForCheckpoint(value: unknown): readonly CoaCp010ActiveQlId[] | undefined {
  const checkpoint = text(value).toUpperCase();
  if (!checkpoint || ["COA-CP-001","COA-CP-005","COA-CP-008","COA-CP-009","COA-CP-010","COA-CP-011"].includes(checkpoint)) {
    return undefined;
  }
  if (checkpoint === "COA-CP-002") return ["COA-QL-001","COA-QL-002"];
  if (checkpoint === "COA-CP-003") return ["COA-QL-003","COA-QL-004"];
  if (checkpoint === "COA-CP-004") return ["COA-QL-005","COA-QL-006"];
  if (checkpoint === "COA-CP-006") return ["COA-QL-008"];
  if (checkpoint === "COA-CP-007") return ["COA-QL-009"];
  if (checkpoint.startsWith("COA-CP-")) throw new Error(`Unsupported COA checkpoint selector ${checkpoint}`);
  return undefined;
}

function resolveProfile(request: ExtendedRequest): CoaCp010PresentationProfile {
  const explicit = text(request.presentationProfile || request.patternId).toUpperCase();
  if (!explicit || explicit.startsWith("COA-QL-")) return "TWO_ACTION_FOUR_WAY";
  if ((COA_CP010_PRESENTATION_PROFILES as readonly string[]).includes(explicit)) {
    return explicit as CoaCp010PresentationProfile;
  }
  if (explicit.startsWith("COA-")) throw new Error(`Unsupported COA presentation profile ${explicit}`);
  return "TWO_ACTION_FOUR_WAY";
}

function ordinaryPoolSize(
  qlId: CoaCp010ActiveQlId | undefined,
  checkpointQls: readonly CoaCp010ActiveQlId[] | undefined,
  difficulty: CoaDifficulty | undefined,
): number {
  const allowed = qlId ? [qlId] : checkpointQls ?? COA_CP010_ACTIVE_QL_IDS;
  return COA_CURRENT_ENGLISH_AUTHORITIES.filter(
    (entry) =>
      entry.qlId !== "COA-QL-007"
      && (allowed as readonly string[]).includes(entry.qlId)
      && (!difficulty || entry.difficulty === difficulty),
  ).length;
}

export function getCoaCp011SafeSemanticCapacity(request: ExtendedRequest): number {
  const difficulty = normalizeDifficulty(request.difficulty);
  const qlId = resolveQl(request);
  const checkpointQls = qlsForCheckpoint(request.cpId);
  if (qlId && checkpointQls && !checkpointQls.includes(qlId)) return 0;
  const profile = resolveProfile(request);

  if (profile === "THREE_ACTION_COMBINATION") {
    if (qlId || checkpointQls) return 0;
    return COA_CP008_THREE_ACTION_AUTHORITIES.filter(
      (entry) => !difficulty || entry.difficulty === difficulty,
    ).length;
  }

  const ordinary = ordinaryPoolSize(qlId, checkpointQls, difficulty);
  if (profile === "TWO_ACTION_FOUR_WAY") return ordinary;

  if (qlId || checkpointQls) return ordinary;

  const either = COA_CP008_EITHER_AUTHORITIES.filter(
    (entry) => !difficulty || entry.difficulty === difficulty,
  ).length;
  if (either === 0) return ordinary;

  // CP010 deliberately places one dedicated Either item every five positions.
  // Stop before either authorities or ordinary authorities can cycle within the same review batch.
  return Math.min(ordinary, either * 5);
}

export function isCoaCp011QuestionStudioRequest(
  request: Readonly<Record<string, unknown>>,
): boolean {
  return isCoaCp010QuestionStudioRequest(request);
}

function cp010SourceRequest(request: ExtendedRequest): ExtendedRequest {
  return text(request.cpId).toUpperCase() === COA_CP011_CHECKPOINT_ID
    ? { ...request, cpId: COA_CP010_QUESTION_STUDIO_PACKAGE.cpIds.at(-1) === "COA-CP-010" ? "COA-CP-010" : undefined }
    : request;
}

export async function generateCoaCp011QuestionStudioBatch(request: ExtendedRequest) {
  const requestedCount = request.count ?? 5;
  const capacity = getCoaCp011SafeSemanticCapacity(request);
  if (capacity < 1) {
    throw new Error("No COA semantic authority matches the requested Question Studio filters");
  }
  if (requestedCount > capacity) {
    throw new Error(
      `COA-001 CP011 anti-repetition gate: requested ${requestedCount} questions but this filter has only ${capacity} semantically unique review items. Narrower batches are required; semantic scenarios will not be silently recycled.`,
    );
  }

  const result = await generateCoaCp010QuestionStudioBatch(cp010SourceRequest(request));
  const ids = result.questions.map((question: any) => String(question.semanticAuthorityId ?? ""));
  if (new Set(ids).size !== ids.length) {
    throw new Error("COA-001 CP011 anti-repetition gate detected a repeated semantic authority in one review batch");
  }

  return {
    ...result,
    checkpointId: COA_CP011_CHECKPOINT_ID,
    authority: COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
    questions: result.questions.map((question: any) => ({
      ...question,
      checkpointId: COA_CP011_CHECKPOINT_ID,
      currentQuestionStudioAuthority: COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
      diversityFreezeAuthority: COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
      semanticUniqueWithinBatch: true,
      safeSemanticCapacity: capacity,
      editorialDiversityStatus: COA_CP011_STATUS,
    })),
    generationContext: {
      ...result.generationContext,
      checkpointId: COA_CP011_CHECKPOINT_ID,
      authority: COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
      diversityFreezeAuthority: COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
      semanticUniqueWithinBatch: true,
      safeSemanticCapacity: capacity,
      editorialDiversityStatus: COA_CP011_STATUS,
      antiRepetitionGate: "NO_REPEATED_SEMANTIC_AUTHORITY_WITHIN_REVIEW_BATCH",
    },
  };
}

export const COA_CP011_QUESTION_STUDIO_PACKAGE = {
  ...COA_CP010_QUESTION_STUDIO_PACKAGE,
  cpIds: [...COA_CP010_QUESTION_STUDIO_PACKAGE.cpIds, COA_CP011_CHECKPOINT_ID],
  metadata: {
    ...(COA_CP010_QUESTION_STUDIO_PACKAGE.metadata ?? {}),
    currentQuestionStudioAuthority: COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
    editorialDiversityStatus: COA_CP011_STATUS,
    antiRepetitionGate: "NO_REPEATED_SEMANTIC_AUTHORITY_WITHIN_REVIEW_BATCH",
    activeOrdinaryAuthorities: 118,
    legacyAuthoritiesExcludedFromGeneration: 2,
    totalFrozenSemanticAuthorities: 130,
    runtimeSemanticUniqueness: true,
  },
} satisfies QuestionStudioPackageDefinition & Readonly<Record<string, unknown>>;
