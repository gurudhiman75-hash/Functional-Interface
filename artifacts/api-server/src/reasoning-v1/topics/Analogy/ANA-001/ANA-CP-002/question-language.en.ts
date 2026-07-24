import { ANA_CP002_RELATIONS } from "./relation-definitions";

export const ANA_CP002_QLS = ANA_CP002_RELATIONS.flatMap((relation, relationIndex) =>
  (["MISSING_FOURTH_TERM", "EQUIVALENT_PAIR_SELECTION"] as const).map((presentationMode, modeIndex) => {
    const ordinal = 37 + relationIndex * 2 + modeIndex;
    return {
      qlId: `ANA-QL-${String(ordinal).padStart(3, "0")}`,
      cpId: "ANA-CP-002",
      title: `${relation.label} — ${presentationMode === "MISSING_FOURTH_TERM" ? "complete analogy" : "select equivalent pair"}`,
      taskKind: presentationMode === "MISSING_FOURTH_TERM" ? "lexicalMissingTerm" : "semanticPairSelection",
      solveMode: "LEXICAL_RELATION_TRANSFER",
      ruleId: relation.id,
      presentationMode,
      difficultyPolicy: "FACT_DIFFICULTY_PLUS_DISTRACTOR_PROXIMITY",
      answerType: presentationMode === "MISSING_FOURTH_TERM" ? "WORD_OR_PHRASE" : "WORD_PAIR",
      requiredDatasets: ["ANA_LEXICAL_FACTS_EN_V1"],
      requiredVariables: ["sourceFactId", "targetFactId", "optionFactIds"],
      distractorKinds: ["SAME_ANSWER_CATEGORY", "CLOSE_BUT_WRONG_MEANING", "MISMATCHED_VALID_CATEGORIES"],
      localeMode: "LANGUAGE_SPECIFIC",
      renderer: "TEXT",
      implementationCheckpoint: "ANA-CP-002",
    } as const;
  }),
);
