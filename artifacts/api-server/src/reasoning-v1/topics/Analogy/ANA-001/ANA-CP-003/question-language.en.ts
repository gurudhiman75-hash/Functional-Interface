export type NumericPresentationMode = "MISSING_FOURTH_TERM" | "EQUIVALENT_PAIR_SELECTION";

const RULES = [
  ["Add a constant", "NUM_ADD_K"], ["Subtract a constant", "NUM_SUBTRACT_K"],
  ["Multiply by a constant", "NUM_MULTIPLY_K"], ["Divide by a constant", "NUM_DIVIDE_K"],
  ["Multiply then add", "NUM_MULTIPLY_ADD"], ["Multiply then subtract", "NUM_MULTIPLY_SUBTRACT"],
  ["Divide then add", "NUM_DIVIDE_ADD"], ["Divide then subtract", "NUM_DIVIDE_SUBTRACT"],
  ["Square", "NUM_SQUARE"], ["Square then add", "NUM_SQUARE_ADD"],
  ["Square then subtract", "NUM_SQUARE_SUBTRACT"], ["Cube", "NUM_CUBE"],
  ["Cube then add", "NUM_CUBE_ADD"], ["Double then square", "NUM_DOUBLE_SQUARE"],
  ["Half then square", "NUM_HALF_SQUARE"], ["Number times its successor", "NUM_TIMES_SUCCESSOR"],
  ["Number times its predecessor", "NUM_TIMES_PREDECESSOR"], ["Sum of digits", "DIGIT_SUM"],
  ["Product of digits", "DIGIT_PRODUCT"], ["Absolute digit difference", "DIGIT_ABS_DIFF"],
  ["Sum of squares of digits", "DIGIT_SUM_SQUARES"], ["Digit product plus digit sum", "DIGIT_PRODUCT_PLUS_SUM"],
  ["Reverse the digits", "DIGIT_REVERSE"], ["Tens digit times ones digit plus tens digit", "DIGIT_POSITIONAL"],
] as const;

export const ANA_CP003_QLS = RULES.flatMap(([title, ruleId], ruleIndex) =>
  (["MISSING_FOURTH_TERM", "EQUIVALENT_PAIR_SELECTION"] as const).map((presentationMode, modeIndex) => ({
    qlId: `ANA-QL-${String(61 + ruleIndex * 2 + modeIndex).padStart(3, "0")}`,
    cpId: "ANA-CP-003",
    title: `${title} — ${presentationMode === "MISSING_FOURTH_TERM" ? "complete analogy" : "select equivalent pair"}`,
    taskKind: presentationMode === "MISSING_FOURTH_TERM" ? "numericMissingTerm" : "numericPairSelection",
    solveMode: "NUMERIC_RULE_TRANSFER",
    ruleId,
    presentationMode: presentationMode as NumericPresentationMode,
    difficultyBand: ruleIndex < 9 ? "EASY_TO_MEDIUM" : ruleIndex < 18 ? "MEDIUM" : "MEDIUM_TO_HARD",
    answerType: presentationMode === "MISSING_FOURTH_TERM" ? "NUMBER" : "NUMBER_PAIR",
  })),
);

export type AnaCp003Ql = (typeof ANA_CP003_QLS)[number];
