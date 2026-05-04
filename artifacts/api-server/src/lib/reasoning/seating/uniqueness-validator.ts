import type {
  SeatingClue,
  SeatingQuestionPrompt,
} from "../seating-engine";

export type ClueSetEvaluation = {
  solutionCount: number;
  solverComplexity: number;
  profileSatisfied: boolean;
  promptDirectlyAnswered: boolean;
  uniquelySolvable: boolean;
};

export function evaluateClueSet(
  clues: SeatingClue[],
  input: {
    prompt: SeatingQuestionPrompt;
    solveArrangement: (
      clues: SeatingClue[],
    ) => {
      solutionCount: number;
      solverComplexity: number;
    };
    meetsClueProfile: (
      clues: SeatingClue[],
    ) => boolean;
    isPromptDirectlyAnsweredByClue: (
      prompt: SeatingQuestionPrompt,
      clues: SeatingClue[],
    ) => boolean;
  },
) : ClueSetEvaluation {
  const solution =
    input.solveArrangement(clues);
  const profileSatisfied =
    input.meetsClueProfile(clues);
  const promptDirectlyAnswered =
    input.isPromptDirectlyAnsweredByClue(
      input.prompt,
      clues,
    );

  return {
    solutionCount:
      solution.solutionCount,
    solverComplexity:
      solution.solverComplexity,
    profileSatisfied,
    promptDirectlyAnswered,
    uniquelySolvable:
      solution.solutionCount === 1 &&
      profileSatisfied &&
      !promptDirectlyAnswered,
  };
}
