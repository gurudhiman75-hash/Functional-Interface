import { SeededRandom, stableHash } from "../foundation/prng";
import { answerLabel } from "./presentation";
import type { IneCp001AnswerSemantic, IneCp001Option } from "./types";

interface DistractorCandidate {
  semanticValue: IneCp001AnswerSemantic;
  errorLabel: string;
}

const DISTRACTORS: Readonly<
  Record<IneCp001AnswerSemantic, readonly DistractorCandidate[]>
> = {
  GREATER_THAN: [
    { semanticValue: "LESS_THAN", errorLabel: "MISREAD_QUERY_DIRECTION" },
    {
      semanticValue: "GREATER_THAN_OR_EQUAL",
      errorLabel: "DEMOTE_STRICT_TO_INCLUSIVE",
    },
    { semanticValue: "EQUAL_TO", errorLabel: "IGNORE_STRICTNESS" },
    { semanticValue: "INDETERMINATE", errorLabel: "DROP_VALID_PROOF_PATH" },
  ],
  LESS_THAN: [
    { semanticValue: "GREATER_THAN", errorLabel: "MISREAD_QUERY_DIRECTION" },
    {
      semanticValue: "LESS_THAN_OR_EQUAL",
      errorLabel: "DEMOTE_STRICT_TO_INCLUSIVE",
    },
    { semanticValue: "EQUAL_TO", errorLabel: "IGNORE_STRICTNESS" },
    { semanticValue: "INDETERMINATE", errorLabel: "DROP_VALID_PROOF_PATH" },
  ],
  EQUAL_TO: [
    {
      semanticValue: "GREATER_THAN",
      errorLabel: "IGNORE_EQUALITY_PROPAGATION",
    },
    { semanticValue: "LESS_THAN", errorLabel: "IGNORE_EQUALITY_PROPAGATION" },
    { semanticValue: "INDETERMINATE", errorLabel: "TREAT_EQUALITY_AS_UNKNOWN" },
    {
      semanticValue: "GREATER_THAN_OR_EQUAL",
      errorLabel: "WEAKEN_EXACT_EQUALITY",
    },
  ],
  GREATER_THAN_OR_EQUAL: [
    {
      semanticValue: "GREATER_THAN",
      errorLabel: "PROMOTE_INCLUSIVE_TO_STRICT",
    },
    {
      semanticValue: "LESS_THAN_OR_EQUAL",
      errorLabel: "MISREAD_QUERY_DIRECTION",
    },
    { semanticValue: "EQUAL_TO", errorLabel: "KEEP_ONLY_EQUALITY_CASE" },
    { semanticValue: "INDETERMINATE", errorLabel: "DROP_VALID_PROOF_PATH" },
  ],
  LESS_THAN_OR_EQUAL: [
    { semanticValue: "LESS_THAN", errorLabel: "PROMOTE_INCLUSIVE_TO_STRICT" },
    {
      semanticValue: "GREATER_THAN_OR_EQUAL",
      errorLabel: "MISREAD_QUERY_DIRECTION",
    },
    { semanticValue: "EQUAL_TO", errorLabel: "KEEP_ONLY_EQUALITY_CASE" },
    { semanticValue: "INDETERMINATE", errorLabel: "DROP_VALID_PROOF_PATH" },
  ],
  INDETERMINATE: [
    { semanticValue: "EQUAL_TO", errorLabel: "TREAT_UNKNOWN_AS_EQUAL" },
    { semanticValue: "GREATER_THAN", errorLabel: "ASSUME_LEFT_BRANCH_HIGHER" },
    { semanticValue: "LESS_THAN", errorLabel: "ASSUME_RIGHT_BRANCH_HIGHER" },
    {
      semanticValue: "GREATER_THAN_OR_EQUAL",
      errorLabel: "ASSUME_SHARED_BOUND_IMPLIES_ORDER",
    },
  ],
};

export function buildIneCp001Options(
  correctAnswer: IneCp001AnswerSemantic,
  prototypeId: string,
  seed: number,
): { options: readonly IneCp001Option[]; correctIndex: number } {
  const random = new SeededRandom(
    seed ^ Number.parseInt(stableHash([prototypeId, "options"]), 16),
  );
  const distractors = random.shuffle(DISTRACTORS[correctAnswer]).slice(0, 3);
  const correctIndex = ((Math.trunc(seed) % 4) + 4) % 4;
  const options: IneCp001Option[] = [];
  let distractorIndex = 0;
  for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
    if (optionIndex === correctIndex) {
      options.push({
        value: answerLabel(correctAnswer),
        semanticValue: correctAnswer,
        isCorrect: true,
      });
    } else {
      const distractor = distractors[distractorIndex++]!;
      options.push({
        value: answerLabel(distractor.semanticValue),
        semanticValue: distractor.semanticValue,
        isCorrect: false,
        errorLabel: distractor.errorLabel,
      });
    }
  }
  return { options, correctIndex };
}
