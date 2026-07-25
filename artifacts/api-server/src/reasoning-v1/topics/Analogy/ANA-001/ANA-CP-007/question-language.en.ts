export type WordPresentationMode = "DIRECT_COMPLETION" | "PAIR_SELECTION";

const WORD_RULE_FAMILIES = [
  ["Remove vowels", "WORD_REMOVE_VOWELS", "LETTER_CLUSTER"],
  ["Remove consonants", "WORD_REMOVE_CONSONANTS", "LETTER_CLUSTER"],
  ["Select alternate source positions", "WORD_POSITION_EXTRACTION", "LETTER_CLUSTER"],
  ["Calculate complete alphabet-position sum", "WORD_ALPHABET_POSITION_SUM", "NUMBER"],
  ["Calculate word length minus one", "WORD_LENGTH_MINUS_ONE", "NUMBER"],
  ["Build repeated-letter equality pattern", "WORD_EQUALITY_PATTERN", "NUMBER_PATTERN"],
  ["Shift vowels and consonants differently", "WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT", "LETTER_CLUSTER"],
] as const;

export type AnaCp007RuleId = (typeof WORD_RULE_FAMILIES)[number][1];
export type AnaCp007DirectAnswerType = (typeof WORD_RULE_FAMILIES)[number][2];

export const ANA_CP007_QLS = WORD_RULE_FAMILIES.flatMap(
  ([title, ruleId, directAnswerType], familyIndex) =>
    (["DIRECT_COMPLETION", "PAIR_SELECTION"] as const).map((presentationMode, modeIndex) => {
      const qlNumber = 209 + familyIndex * 2 + modeIndex;
      return {
        qlId: `ANA-QL-${String(qlNumber).padStart(3, "0")}`,
        cpId: "ANA-CP-007",
        title: `${title} — ${presentationMode === "DIRECT_COMPLETION" ? "direct completion" : "pair selection"}`,
        taskKind: "wordStructureTransform",
        solveMode: "WORD_STRUCTURE_RULE",
        ruleId,
        presentationMode: presentationMode as WordPresentationMode,
        difficultyBand:
          ruleId === "WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT" ||
          ruleId === "WORD_EQUALITY_PATTERN"
            ? "MEDIUM_TO_HARD"
            : presentationMode === "PAIR_SELECTION"
              ? "MEDIUM"
              : "EASY_TO_MEDIUM",
        answerType: presentationMode === "DIRECT_COMPLETION"
          ? directAnswerType
          : "WORD_RESULT_PAIR",
        requiredDatasets: ["ana.cp007.words.en-IN"] as const,
        requiredVariables: ["sourceWord", "ruleContext", "targetWord"] as const,
        distractorKinds: [
          "wrongClass",
          "wrongPosition",
          "wrongNumericRule",
          "partialPattern",
          "wrongShiftDirection",
        ] as const,
        renderer: "STRUCTURED_TEXT",
        localeMode: "TRANSLATABLE_INSTRUCTIONS_LATIN_TOKENS",
        implementationCheckpoint: "ANA-CP-007",
        status: "IMPLEMENTED" as const,
      };
    }),
);

export type AnaCp007Ql = (typeof ANA_CP007_QLS)[number];

export function anaCp007QlById(qlId: string): AnaCp007Ql {
  const ql = ANA_CP007_QLS.find((entry) => entry.qlId === qlId);
  if (!ql) throw new Error(`Unknown ANA-CP-007 QL: ${qlId}`);
  return ql;
}
