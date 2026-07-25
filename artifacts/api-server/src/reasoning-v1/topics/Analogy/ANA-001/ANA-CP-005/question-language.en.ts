export type AlphabetPresentationMode = "MISSING_FOURTH_TERM" | "EQUIVALENT_PAIR_SELECTION";

const RULES = [
  ["Forward alphabet shift", "ALPHA_SHIFT_FORWARD"],
  ["Backward alphabet shift", "ALPHA_SHIFT_BACKWARD"],
  ["Opposite alphabet letter", "ALPHA_OPPOSITE"],
  ["Opposite letter then forward shift", "ALPHA_OPPOSITE_FORWARD"],
  ["Opposite letter then backward shift", "ALPHA_OPPOSITE_BACKWARD"],
  ["Double alphabet position", "ALPHA_POSITION_DOUBLE"],
  ["Double alphabet position minus one", "ALPHA_POSITION_DOUBLE_MINUS_ONE"],
  ["Half an even alphabet position", "ALPHA_POSITION_HALF"],
  ["Round up half of an odd alphabet position", "ALPHA_POSITION_HALF_ROUND_UP"],
  ["Opposite of doubled alphabet position", "ALPHA_OPPOSITE_OF_DOUBLE"],
] as const;

export const ANA_CP005_QLS = RULES.flatMap(([title, ruleId], ruleIndex) =>
  (["MISSING_FOURTH_TERM", "EQUIVALENT_PAIR_SELECTION"] as const).map((presentationMode, modeIndex) => ({
    qlId: `ANA-QL-${String(141 + ruleIndex * 2 + modeIndex).padStart(3, "0")}`,
    cpId: "ANA-CP-005",
    title: `${title} — ${presentationMode === "MISSING_FOURTH_TERM" ? "complete analogy" : "select equivalent pair"}`,
    taskKind: presentationMode === "MISSING_FOURTH_TERM" ? "alphabetMissingTerm" : "alphabetPairSelection",
    solveMode: "ALPHABET_RULE_TRANSFER",
    ruleId,
    presentationMode: presentationMode as AlphabetPresentationMode,
    difficultyBand: ruleIndex < 3 ? "EASY_TO_MEDIUM" : ruleIndex < 7 ? "MEDIUM" : "MEDIUM_TO_HARD",
    answerType: presentationMode === "MISSING_FOURTH_TERM" ? "LETTER" : "LETTER_PAIR",
    renderer: "STRUCTURED_TEXT",
    localeMode: "TRANSLATABLE",
  })),
);

export type AnaCp005Ql = (typeof ANA_CP005_QLS)[number];
