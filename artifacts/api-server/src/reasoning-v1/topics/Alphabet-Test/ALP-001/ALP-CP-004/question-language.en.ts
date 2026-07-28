import type { AlpQuestionLogic, AlpTransformId } from "../types";

const transforms: readonly AlpTransformId[] = [
  "REVERSE_ALL",
  "REVERSE_FIRST_HALF",
  "REVERSE_SECOND_HALF",
  "REVERSE_BOTH_HALVES",
  "SWAP_HALVES",
  "ROTATE_TO_START",
  "ODD_THEN_EVEN",
  "EVEN_THEN_ODD",
  "ALTERNATE_LEFT_RIGHT",
  "ALTERNATE_RIGHT_LEFT",
  "REMOVE_VOWELS",
  "REMOVE_CONSONANTS",
  "SWAP_ADJACENT_PAIRS",
  "REVERSE_BLOCKS_OF_THREE",
];

export const ALP_CP004_QLS: readonly AlpQuestionLogic[] = transforms.flatMap((transformId, transformIndex) => {
  const start = 47 + transformIndex * 2;
  return [
    {
      qlId: `ALP-QL-${String(start).padStart(3, "0")}`,
      checkpointId: "ALP-CP-004",
      ruleId: `ALPHA_TRANSFORM_${transformId}`,
      taskKind: "findLetterAfterAlphabetRearrangement",
      solveMode: "LETTER_AT_TRANSFORMED_POSITION",
      presentationMode: "TRANSFORM_THEN_POSITION_QUERY",
      answerType: "LETTER",
      renderer: "TOKEN_ROW",
      localeMode: "TRANSLATABLE",
      difficultyProfile: transformIndex < 5 ? "ONE_GLOBAL_TRANSFORM" : transformIndex < 10 ? "ORDER_RECONSTRUCTION" : "FILTER_OR_BLOCK_TRANSFORM",
      status: "IMPLEMENTED",
      transformId,
    },
    {
      qlId: `ALP-QL-${String(start + 1).padStart(3, "0")}`,
      checkpointId: "ALP-CP-004",
      ruleId: `ALPHA_TRANSFORM_${transformId}`,
      taskKind: "findPositionAfterAlphabetRearrangement",
      solveMode: "TRANSFORMED_POSITION_OF_LETTER",
      presentationMode: "TRANSFORM_THEN_INVERSE_POSITION_QUERY",
      answerType: "NUMBER",
      renderer: "TOKEN_ROW",
      localeMode: "TRANSLATABLE",
      difficultyProfile: transformIndex < 5 ? "ONE_GLOBAL_TRANSFORM" : transformIndex < 10 ? "ORDER_RECONSTRUCTION" : "FILTER_OR_BLOCK_TRANSFORM",
      status: "IMPLEMENTED",
      transformId,
    },
  ] as const;
});
