import { CP_REGISTRY, getCpRegistryEntry } from "./cp-registry";
import { getCoverageCategoriesForCp } from "./coverage-selector";
import { getDifficultyRegistryEntry } from "./difficulty-registry";
import { selectStemByQlId, selectStemsByCp } from "./stem-selector";
import type {
  QuestionLanguageItem,
  SurdCpId,
  SurdDifficultyBand,
  SurdExplanationId,
  SurdQuestionLanguageId,
} from "./types";

export interface NsSurd001ParameterInput {
  seed?: string;
  questionLanguageId?: SurdQuestionLanguageId;
  difficulty?: SurdDifficultyBand;
}

export interface NsSurd001Parameters {
  packageId: "NS-SURD-001";
  canonicalProblemId: SurdCpId;
  questionId: string;
  difficulty: SurdDifficultyBand;
  questionLanguageId: SurdQuestionLanguageId;
  explanationId: SurdExplanationId;
  coverageCategory: string;
  stemItem: QuestionLanguageItem;
}

export function getNsSurd001ActiveCanonicalProblemIds(): SurdCpId[] {
  return CP_REGISTRY.map((entry) => entry.cpId);
}

export function generateNsSurd001Parameters(
  cpId: SurdCpId,
  input: NsSurd001ParameterInput = {},
): NsSurd001Parameters {
  const cp = getCpRegistryEntry(cpId);
  const stems = selectStemsByCp(cpId);
  if (stems.length === 0) {
    throw new Error(`No NS-SURD-001 stems linked to ${cpId}`);
  }
  const stemItem = input.questionLanguageId
    ? selectStemByQlId(input.questionLanguageId)
    : stems[indexFromSeed(input.seed ?? cpId, stems.length)];
  if (stemItem.cpId !== cpId) {
    throw new Error(`Question language id ${stemItem.id} belongs to ${stemItem.cpId}, not ${cpId}`);
  }
  const coverage = getCoverageCategoriesForCp(cpId);
  const difficulty = input.difficulty ?? difficultyFromSeed(cpId, input.seed);
  getDifficultyRegistryEntry(cpId);
  return {
    packageId: "NS-SURD-001",
    canonicalProblemId: cpId,
    questionId: `NS-SURD-001:${cpId}:${stemItem.id}:${input.seed ?? "default"}`,
    difficulty,
    questionLanguageId: stemItem.id,
    explanationId: cp.explanationId,
    coverageCategory: coverage[indexFromSeed(`${input.seed ?? ""}:${stemItem.id}`, coverage.length)]!,
    stemItem,
  };
}

function difficultyFromSeed(cpId: SurdCpId, seed = ""): SurdDifficultyBand {
  if (cpId === "CP04" || cpId === "CP05" || cpId === "CP07") {
    return ["Medium", "Hard", "Medium"][indexFromSeed(seed || cpId, 3)] as SurdDifficultyBand;
  }
  if (cpId === "CP08") {
    return ["Easy", "Medium", "Hard"][indexFromSeed(seed || cpId, 3)] as SurdDifficultyBand;
  }
  return ["Easy", "Medium"][indexFromSeed(seed || cpId, 2)] as SurdDifficultyBand;
}

function indexFromSeed(seed: string, modulo: number): number {
  let hash = 2166136261;
  for (const char of seed) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) % modulo;
}
