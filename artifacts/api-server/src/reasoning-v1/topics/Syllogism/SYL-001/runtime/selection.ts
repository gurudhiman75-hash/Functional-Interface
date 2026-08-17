import type { EvaluatedConclusion, ModalAnswer, PairClassificationStatus, PairSemanticStatus, ScenarioAnalysis, SylQlDefinition } from "./types";
import {
  analyzeScenario,
  conclusionDirectlyRestatesPremise,
  conclusionSemanticKey,
  isGenuineEitherOr,
  pairClassificationStatus,
  pairSemanticStatus,
  selectedPremisesAreRelevant,
} from "./analysis";
import { createPrng, shuffle } from "./prng";
import { scenariosForGroup } from "./scenarios";

export interface SelectedLogic {
  analysis: ScenarioAnalysis;
  conclusions: readonly EvaluatedConclusion[];
  semanticAnswer: string;
  followMask: number | null;
  pairStatus: PairSemanticStatus | PairClassificationStatus | null;
  relevanceMode: "VERDICT" | "MODEL_SPACE";
}

function rotated<T>(items: readonly T[], start: number): T[] {
  if (items.length === 0) return [];
  const offset = ((start % items.length) + items.length) % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

function combinations<T>(items: readonly T[], count: number, limit = 30000): T[][] {
  const out: T[][] = [];
  const current: T[] = [];
  const visit = (start: number): void => {
    if (out.length >= limit) return;
    if (current.length === count) {
      out.push([...current]);
      return;
    }
    for (let index = start; index < items.length; index += 1) {
      current.push(items[index]);
      visit(index + 1);
      current.pop();
      if (out.length >= limit) return;
    }
  };
  visit(0);
  return out;
}

function candidateMode(candidate: EvaluatedConclusion): "VERDICT" | "MODEL_SPACE" {
  return candidate.profile.classification === "UNDETERMINED" ? "MODEL_SPACE" : "VERDICT";
}

function novelCandidates(analysis: ScenarioAnalysis): readonly EvaluatedConclusion[] {
  return analysis.candidates.filter((candidate) =>
    !conclusionDirectlyRestatesPremise(analysis.premises, candidate.conclusion));
}

function correctCandidateUsesFullChain(
  analysis: ScenarioAnalysis,
  candidate: EvaluatedConclusion,
): boolean {
  return selectedPremisesAreRelevant(analysis, [candidate], candidateMode(candidate));
}

function chooseSelectionQuestion(
  definition: SylQlDefinition,
  seed: number,
  target: "ENTAILED" | "NON_ENTAILED" | "UNDETERMINED" | "CONTRADICTED",
): SelectedLogic | null {
  const random = createPrng(`${definition.qlId}:${seed}:selection`);
  const scenarios = rotated(
    shuffle(scenariosForGroup(definition.scenarioGroup), random),
    seed,
  );

  for (const scenario of scenarios) {
    const analysis = analyzeScenario(scenario);
    const candidateOrder = shuffle(novelCandidates(analysis), random);
    const correctPool = candidateOrder.filter((candidate) => {
      const targetMatch = target === "ENTAILED"
        ? candidate.profile.classification === "ENTAILED"
        : target === "NON_ENTAILED"
          ? candidate.profile.classification !== "ENTAILED"
          : target === "UNDETERMINED"
            ? candidate.profile.classification === "UNDETERMINED"
            : candidate.profile.classification === "CONTRADICTED";
      return targetMatch && correctCandidateUsesFullChain(analysis, candidate);
    });
    const distractorPool = candidateOrder.filter((candidate) => {
      if (target === "ENTAILED") return candidate.profile.classification !== "ENTAILED";
      if (target === "NON_ENTAILED") return candidate.profile.classification === "ENTAILED";
      if (target === "UNDETERMINED") return candidate.profile.classification !== "UNDETERMINED";
      return candidate.profile.canBeTrue;
    });

    for (const correct of correctPool.slice(0, 24)) {
      for (const distractors of combinations(distractorPool.slice(0, 32), 3, 2000)) {
        const selected = [correct, ...distractors];
        if (new Set(selected.map(conclusionSemanticKey)).size !== 4) continue;
        const relevanceMode = candidateMode(correct);
        if (!selectedPremisesAreRelevant(analysis, selected, relevanceMode)) continue;
        return {
          analysis,
          conclusions: shuffle(selected, random),
          semanticAnswer: conclusionSemanticKey(correct),
          followMask: null,
          pairStatus: null,
          relevanceMode,
        };
      }
    }
  }
  return null;
}

function chooseModalQuestion(
  definition: SylQlDefinition,
  seed: number,
): SelectedLogic | null {
  const targets: readonly ModalAnswer[] = [
    "DEFINITELY_TRUE",
    "POSSIBLY_TRUE_NOT_DEFINITE",
    "IMPOSSIBLE",
  ];
  const target = targets[Math.abs(seed) % targets.length];
  const random = createPrng(`${definition.qlId}:${seed}:modal`);
  const scenarios = rotated(shuffle(scenariosForGroup(definition.scenarioGroup), random), seed);
  for (const scenario of scenarios) {
    const analysis = analyzeScenario(scenario);
    const candidates = shuffle(novelCandidates(analysis), random).filter((candidate) => {
      if (target === "DEFINITELY_TRUE") return candidate.profile.classification === "ENTAILED";
      if (target === "POSSIBLY_TRUE_NOT_DEFINITE") return candidate.profile.classification === "UNDETERMINED";
      return candidate.profile.classification === "CONTRADICTED";
    });
    for (const candidate of candidates) {
      const relevanceMode = target === "POSSIBLY_TRUE_NOT_DEFINITE" ? "MODEL_SPACE" : "VERDICT";
      if (!selectedPremisesAreRelevant(analysis, [candidate], relevanceMode)) continue;
      return {
        analysis,
        conclusions: [candidate],
        semanticAnswer: target,
        followMask: null,
        pairStatus: null,
        relevanceMode,
      };
    }
  }
  return null;
}

function chooseTwoConclusionQuestion(
  definition: SylQlDefinition,
  seed: number,
  allowEitherOr: boolean,
): SelectedLogic | null {
  const statuses: readonly PairSemanticStatus[] = allowEitherOr
    ? ["ONLY_FIRST_FOLLOWS", "ONLY_SECOND_FOLLOWS", "BOTH_FOLLOW", "NEITHER_FOLLOWS", "EITHER_OR_FOLLOWS"]
    : ["ONLY_FIRST_FOLLOWS", "ONLY_SECOND_FOLLOWS", "BOTH_FOLLOW", "NEITHER_FOLLOWS"];
  const target = statuses[Math.abs(seed) % statuses.length];
  const random = createPrng(`${definition.qlId}:${seed}:pair:${target}`);
  const scenarios = rotated(shuffle(scenariosForGroup(definition.scenarioGroup), random), seed);

  for (const scenario of scenarios) {
    const analysis = analyzeScenario(scenario);
    const candidates = shuffle(novelCandidates(analysis), random).slice(0, 60);
    for (let firstIndex = 0; firstIndex < candidates.length; firstIndex += 1) {
      for (let secondIndex = 0; secondIndex < candidates.length; secondIndex += 1) {
        if (firstIndex === secondIndex) continue;
        const first = candidates[firstIndex];
        const second = candidates[secondIndex];
        if (conclusionSemanticKey(first) === conclusionSemanticKey(second)) continue;
        const status = pairSemanticStatus(analysis, first, second, allowEitherOr);
        if (status !== target) continue;
        if (!allowEitherOr && isGenuineEitherOr(analysis, first, second)) continue;
        const relevanceMode = target === "EITHER_OR_FOLLOWS" ? "MODEL_SPACE" : "VERDICT";
        if (!selectedPremisesAreRelevant(analysis, [first, second], relevanceMode)) continue;
        const mask = (first.profile.classification === "ENTAILED" ? 1 : 0)
          | (second.profile.classification === "ENTAILED" ? 2 : 0);
        return {
          analysis,
          conclusions: [first, second],
          semanticAnswer: status,
          followMask: mask,
          pairStatus: status,
          relevanceMode,
        };
      }
    }
  }
  return null;
}

function choosePairClassificationQuestion(
  definition: SylQlDefinition,
  seed: number,
): SelectedLogic | null {
  const statuses: readonly PairClassificationStatus[] = [
    "EITHER_OR",
    "BOTH_FOLLOW",
    "ONLY_FIRST_FOLLOWS",
    "ONLY_SECOND_FOLLOWS",
    "NO_COMPLEMENTARY_RELATION",
  ];
  const target = statuses[Math.abs(seed) % statuses.length];
  const random = createPrng(`${definition.qlId}:${seed}:pair-class:${target}`);
  const scenarios = rotated(shuffle(scenariosForGroup(definition.scenarioGroup), random), seed);
  for (const scenario of scenarios) {
    const analysis = analyzeScenario(scenario);
    const candidates = shuffle(novelCandidates(analysis), random).slice(0, 60);
    for (const first of candidates) {
      for (const second of candidates) {
        if (conclusionSemanticKey(first) === conclusionSemanticKey(second)) continue;
        const status = pairClassificationStatus(analysis, first, second);
        if (status !== target) continue;
        const relevanceMode = target === "EITHER_OR" ? "MODEL_SPACE" : "VERDICT";
        if (!selectedPremisesAreRelevant(analysis, [first, second], relevanceMode)) continue;
        return {
          analysis,
          conclusions: [first, second],
          semanticAnswer: status,
          followMask: null,
          pairStatus: status,
          relevanceMode,
        };
      }
    }
  }
  return null;
}

function chooseThreeConclusionQuestion(
  definition: SylQlDefinition,
  seed: number,
): SelectedLogic | null {
  const targetMask = Math.abs(seed) % 8;
  const random = createPrng(`${definition.qlId}:${seed}:triple:${targetMask}`);
  const scenarios = rotated(shuffle(scenariosForGroup(definition.scenarioGroup), random), seed);
  for (const scenario of scenarios) {
    const analysis = analyzeScenario(scenario);
    const candidates = novelCandidates(analysis);
    const follows = shuffle(
      candidates.filter((candidate) => candidate.profile.classification === "ENTAILED"),
      random,
    ).slice(0, 30);
    const notFollows = shuffle(
      candidates.filter((candidate) => candidate.profile.classification !== "ENTAILED"),
      random,
    ).slice(0, 40);
    const pools = [0, 1, 2].map((index) => ((targetMask & (1 << index)) !== 0 ? follows : notFollows));
    for (const first of pools[0]) {
      for (const second of pools[1]) {
        if (conclusionSemanticKey(first) === conclusionSemanticKey(second)) continue;
        if (isGenuineEitherOr(analysis, first, second)) continue;
        for (const third of pools[2]) {
          const keys = [first, second, third].map(conclusionSemanticKey);
          if (new Set(keys).size !== 3) continue;
          if (isGenuineEitherOr(analysis, first, third) || isGenuineEitherOr(analysis, second, third)) continue;
          if (!selectedPremisesAreRelevant(analysis, [first, second, third])) continue;
          return {
            analysis,
            conclusions: [first, second, third],
            semanticAnswer: `MASK_${targetMask}`,
            followMask: targetMask,
            pairStatus: null,
            relevanceMode: "VERDICT",
          };
        }
      }
    }
  }
  return null;
}

export function selectQuestionLogic(definition: SylQlDefinition, seed: number): SelectedLogic {
  let selected: SelectedLogic | null = null;
  switch (definition.taskKind) {
    case "SELECT_DEFINITE_CONCLUSION":
    case "ONLY_SELECT_DEFINITE_CONCLUSION":
    case "FEW_SELECT_DEFINITE_CONCLUSION":
      selected = chooseSelectionQuestion(definition, seed, "ENTAILED");
      break;
    case "SELECT_NON_FOLLOWING_CONCLUSION":
      selected = chooseSelectionQuestion(definition, seed, "NON_ENTAILED");
      break;
    case "SELECT_GENUINE_POSSIBILITY":
      selected = chooseSelectionQuestion(definition, seed, "UNDETERMINED");
      break;
    case "SELECT_IMPOSSIBLE_CONCLUSION":
      selected = chooseSelectionQuestion(definition, seed, "CONTRADICTED");
      break;
    case "CLASSIFY_CONCLUSION_MODALITY":
    case "ONLY_MODAL_CLASSIFICATION":
    case "FEW_MODAL_CLASSIFICATION":
    case "MIXED_MODAL_CLASSIFICATION":
      selected = chooseModalQuestion(definition, seed);
      break;
    case "TWO_CONCLUSION_FOLLOW_MASK":
    case "ONLY_TWO_CONCLUSION_MASK":
    case "FEW_TWO_CONCLUSION_MASK":
    case "MIXED_TWO_CONCLUSION_MASK":
      selected = chooseTwoConclusionQuestion(definition, seed, false);
      break;
    case "TWO_CONCLUSION_EITHER_OR":
      selected = chooseTwoConclusionQuestion(definition, seed, true);
      break;
    case "CLASSIFY_CONCLUSION_PAIR":
      selected = choosePairClassificationQuestion(definition, seed);
      break;
    case "THREE_CONCLUSION_FOLLOW_MASK":
    case "MIXED_THREE_CONCLUSION_MASK":
      selected = chooseThreeConclusionQuestion(definition, seed);
      break;
    default: {
      const exhaustive: never = definition.taskKind;
      throw new Error(`Unsupported task kind: ${String(exhaustive)}.`);
    }
  }

  if (!selected) {
    throw new Error(`No valid generated selection for ${definition.qlId} at seed ${seed}.`);
  }
  return selected;
}
