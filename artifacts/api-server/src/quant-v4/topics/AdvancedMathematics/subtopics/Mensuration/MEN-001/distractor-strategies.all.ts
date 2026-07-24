import {
  MEN_001_DISTRACTOR_STRATEGIES as MEN_001_CP001_CP002_DISTRACTOR_STRATEGIES,
} from "./distractor-strategies";
import { MEN_001_CP003_DISTRACTOR_STRATEGIES } from "./distractor-strategies.cp003";
import { MEN_001_CP004_DISTRACTOR_STRATEGIES } from "./distractor-strategies.cp004";
import type {
  Men001Parameters,
  Men001QuestionLanguageEntry,
  Men001SolverResult,
} from "./types";

export const MEN_001_ALL_DISTRACTOR_STRATEGIES = {
  ...MEN_001_CP001_CP002_DISTRACTOR_STRATEGIES,
  ...MEN_001_CP003_DISTRACTOR_STRATEGIES,
  ...MEN_001_CP004_DISTRACTOR_STRATEGIES,
} as const;

export type Men001AllDistractorStrategyId =
  keyof typeof MEN_001_ALL_DISTRACTOR_STRATEGIES;

export function hasMen001DistractorStrategy(
  strategyId: string,
): strategyId is Men001AllDistractorStrategyId {
  return strategyId in MEN_001_ALL_DISTRACTOR_STRATEGIES;
}

function seedHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function buildMen001Options(
  entry: Men001QuestionLanguageEntry,
  parameters: Men001Parameters,
  solver: Men001SolverResult,
) {
  if (entry.distractorStrategyIds.length !== 3) {
    throw new Error(`${entry.qlId} must declare exactly three misconception strategies.`);
  }
  const correct =
    solver.canonicalAnswer.kind === "symbolic"
      ? solver.canonicalAnswer.rendered
      : solver.canonicalAnswer.display;
  const distractors = entry.distractorStrategyIds.map((strategyId) => {
    if (!hasMen001DistractorStrategy(strategyId)) {
      throw new Error(
        `${entry.qlId} references unknown distractor strategy ${strategyId}.`,
      );
    }
    return MEN_001_ALL_DISTRACTOR_STRATEGIES[strategyId]({
      parameters,
      solver,
    });
  });
  const normalized = [correct, ...distractors].map((option) =>
    option.trim().toLowerCase(),
  );
  if (new Set(normalized).size !== 4) {
    throw new Error(
      `${entry.qlId} misconception strategies did not produce four unique options.`,
    );
  }

  const options = [correct, ...distractors];
  for (let index = options.length - 1; index > 0; index -= 1) {
    const swapIndex =
      seedHash(`${parameters.seed}:${entry.qlId}:option:${index}`) % (index + 1);
    [options[index], options[swapIndex]] = [
      options[swapIndex]!,
      options[index]!,
    ];
  }
  const correctIndex = options.indexOf(correct);
  return { options, correctIndex, distractors };
}
