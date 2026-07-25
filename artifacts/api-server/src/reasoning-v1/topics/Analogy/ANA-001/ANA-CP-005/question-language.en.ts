export type AlphabetPresentationMode = "DIRECT_COMPLETION" | "PAIR_SELECTION";

const RULES = [
  ["Fixed forward shift", "ALPHA_FIXED_SHIFT_FORWARD"],
  ["Fixed backward shift", "ALPHA_FIXED_SHIFT_BACKWARD"],
  ["Cyclic forward shift", "ALPHA_CYCLIC_SHIFT_FORWARD"],
  ["Cyclic backward shift", "ALPHA_CYCLIC_SHIFT_BACKWARD"],
  ["Opposite alphabet letter", "ALPHA_OPPOSITE"],
  ["Equal positional distance", "ALPHA_EQUAL_DISTANCE"],
  ["Reverse-position transform", "ALPHA_REVERSE_POSITION"],
  ["Doubled positional movement", "ALPHA_DOUBLED_MOVEMENT"],
  ["Vowel/consonant class correspondence", "ALPHA_CLASS_CORRESPONDENCE"],
  ["Two-step position transform", "ALPHA_TWO_STEP_POSITION"],
] as const;

export const ANA_CP005_QLS = RULES.flatMap(([title, ruleId], ruleIndex) =>
  (["DIRECT_COMPLETION", "PAIR_SELECTION"] as const).map((presentationMode, modeIndex) => ({
    qlId: `ANA-QL-${String(141 + ruleIndex * 2 + modeIndex).padStart(3, "0")}`,
    cpId: "ANA-CP-005",
    title: `${title} — ${presentationMode === "DIRECT_COMPLETION" ? "direct completion" : "pair selection"}`,
    taskKind: "singleLetterTransform",
    solveMode: "ALPHABET_RULE",
    ruleId,
    presentationMode: presentationMode as AlphabetPresentationMode,
    difficultyBand: presentationMode === "DIRECT_COMPLETION" ? "EASY" : "MEDIUM",
    answerType: presentationMode === "DIRECT_COMPLETION" ? "LETTER" : "LETTER_PAIR",
    requiredDatasets: ["alphabet.core"] as const,
    requiredVariables: ["sourceLetter", "ruleParams", "targetLetter"] as const,
    distractorKinds: ["wrongDirection", "offByOne", "noWrapTrap"] as const,
    renderer: "STRUCTURED_TEXT",
    localeMode: "TRANSLATABLE",
  })),
);

export type AnaCp005Ql = (typeof ANA_CP005_QLS)[number];
