const RELATIONS = [
  ["Country and capital", "SEM_COUNTRY_CAPITAL"],
  ["State and capital", "SEM_STATE_CAPITAL"],
  ["Country and currency", "SEM_COUNTRY_CURRENCY"],
  ["Animal and young one", "SEM_ANIMAL_YOUNG"],
  ["Male and female", "SEM_MALE_FEMALE"],
  ["Animal and sound", "SEM_ANIMAL_SOUND"],
  ["Animal and movement", "SEM_ANIMAL_MOVEMENT"],
  ["Worker and workplace", "SEM_WORKER_WORKPLACE"],
  ["Worker and tool", "SEM_WORKER_TOOL"],
  ["Worker and product", "SEM_WORKER_PRODUCT"],
  ["Instrument and measurement", "SEM_INSTRUMENT_MEASUREMENT"],
  ["Quantity and unit", "SEM_QUANTITY_UNIT"],
  ["Object and function", "SEM_OBJECT_FUNCTION"],
  ["Part and whole", "SEM_PART_WHOLE"],
  ["Member and class", "SEM_MEMBER_CLASS"],
  ["Individual and group", "SEM_INDIVIDUAL_GROUP"],
  ["Product and material", "SEM_PRODUCT_MATERIAL"],
  ["Place and purpose", "SEM_PLACE_PURPOSE"],
] as const;

export const ANA_CP001_QLS = RELATIONS.flatMap(([title, ruleId], relationIndex) =>
  (["MISSING_FOURTH_TERM", "EQUIVALENT_PAIR_SELECTION"] as const).map((presentationMode, modeIndex) => {
    const ordinal = relationIndex * 2 + modeIndex + 1;
    return {
      qlId: `ANA-QL-${String(ordinal).padStart(3, "0")}`,
      cpId: "ANA-CP-001",
      title: `${title} — ${presentationMode === "MISSING_FOURTH_TERM" ? "complete analogy" : "select equivalent pair"}`,
      taskKind: presentationMode === "MISSING_FOURTH_TERM" ? "semanticMissingTerm" : "semanticPairSelection",
      solveMode: "SEMANTIC_RELATION_TRANSFER",
      ruleId,
      presentationMode,
      difficultyBand: ordinal <= 24 ? "EASY" : "MEDIUM",
      answerType: presentationMode === "MISSING_FOURTH_TERM" ? "WORD" : "WORD_PAIR",
      requiredDatasets: ["ANA_SEMANTIC_FACTS_EN_V1"],
      requiredVariables: ["sourceFactId", "targetFactId", "optionFactIds"],
      distractorKinds: ["WRONG_RELATION", "REVERSED_DIRECTION", "NEAR_CATEGORY"],
      localeMode: "LANGUAGE_ADAPTED",
      renderer: "TEXT",
      implementationCheckpoint: "ANA-CP-001",
    } as const;
  }),
);
