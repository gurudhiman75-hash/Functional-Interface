import { CP_REGISTRY, getCpRegistryEntry } from "./cp-registry";
import { getCoverageCategoriesForCp } from "./coverage-selector";
import { selectStemByQlId, selectStemsByCp } from "./stem-selector";
import type {
  FlattenedQuestionLanguageEntry,
  SimplCpId,
  SimplDifficultyBand,
  SimplExplanationId,
  SimplQuestionLanguageId,
} from "./types";

export interface Simpl001ParameterInput {
  seed?: string;
  questionLanguageId?: SimplQuestionLanguageId;
  difficulty?: SimplDifficultyBand;
}

export interface Simpl001Parameters {
  packageId: "SIMPL-001";
  canonicalProblemId: SimplCpId;
  questionId: string;
  difficulty: SimplDifficultyBand;
  questionLanguageId: SimplQuestionLanguageId;
  explanationId: SimplExplanationId;
  coverageCategory: string;
  stemItem: FlattenedQuestionLanguageEntry;
}

export function getSimpl001ActiveCanonicalProblemIds(): SimplCpId[] {
  return CP_REGISTRY.map((entry) => entry.cpId);
}

export function generateSimpl001Parameters(
  cpId: SimplCpId,
  input: Simpl001ParameterInput = {},
): Simpl001Parameters {
  const cp = getCpRegistryEntry(cpId);
  const stems = selectStemsByCp(cpId);
  if (stems.length === 0) {
    throw new Error(`No SIMPL-001 stems linked to ${cpId}`);
  }
  const stemItem = input.questionLanguageId
    ? selectStemByQlId(input.questionLanguageId)
    : stems[indexFromSeed(input.seed ?? cpId, stems.length)];
  if (stemItem.cpId !== cpId) {
    throw new Error(`Question language id ${stemItem.id} belongs to ${stemItem.cpId}, not ${cpId}`);
  }
  const coverage = getCoverageCategoriesForCp(cpId);
  return {
    packageId: "SIMPL-001",
    canonicalProblemId: cpId,
    questionId: `SIMPL-001:${cpId}:${stemItem.id}:${input.seed ?? "default"}`,
    difficulty: input.difficulty ?? difficultyFromSeed(input.seed ?? stemItem.id),
    questionLanguageId: stemItem.id,
    explanationId: cp.explanationId,
    coverageCategory: coverage[indexFromSeed(`${input.seed ?? ""}:${stemItem.id}`, coverage.length)]!,
    stemItem,
  };
}

function difficultyFromSeed(seed: string): SimplDifficultyBand {
  return (["Easy", "Medium", "Hard"] as const)[indexFromSeed(seed, 3)];
}

export function indexFromSeed(seed: string, modulo: number): number {
  let hash = 2166136261;
  for (const char of seed) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) % modulo;
}
