import {
  BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_VERSION,
  BLR_CP003_V9_WAVE_02_SEEDS,
  BLR_CP003_V9_WAVE_02_TOPOLOGIES,
  blrCp003V9Wave02EvidencePath,
  blrCp003V9Wave02NamesFor,
  buildBlrCp003V9Wave02Record,
  type BlrCp003V9Wave02CandidateRecord,
  type BlrCp003V9Wave02TopologyTemplate,
} from "./cp003-v9-topology-gap-wave-02-foundation";

const [UNSTATED_SPOUSE, IN_LAW_BRIDGE, FOUR_SIBLING_GRID] =
  BLR_CP003_V9_WAVE_02_TOPOLOGIES;

function names(
  topology: BlrCp003V9Wave02TopologyTemplate,
  seed: number,
): Readonly<Record<string, string>> {
  return blrCp003V9Wave02NamesFor(topology, seed);
}

function unresolvedSingleParentStatus(seed: number): BlrCp003V9Wave02CandidateRecord {
  const topology = UNSTATED_SPOUSE;
  const n = names(topology, seed);
  const stems = [
    `Whose marital status remains unspecified in the passage?`,
    `For which person is a child stated but no marital status established?`,
    `Who must not be treated as unmarried merely because no spouse is named?`,
    `Which adult has an unresolved spouse boundary?`,
  ] as const;
  return buildBlrCp003V9Wave02Record({
    topology,
    seed,
    names: n,
    authority: "IDENTIFY_MEMBER_WITH_UNRESOLVED_MARITAL_STATUS",
    prototypeId: "BLR-CP003-PROT-V9W2-UNRESOLVED-SINGLE-PARENT-STATUS",
    prototypeFamily: "UNSTATED_SPOUSE_BOUNDARY",
    itemSuffix: "UNRESOLVED-SINGLE-PARENT-STATUS",
    stem: stems[seed % stems.length]!,
    answerType: "PERSON_NAME",
    answerSemanticKey: "PERSON:D",
    optionEntries: [
      { text: n.D, semanticKey: "PERSON:D", correct: true },
      { text: n.F, semanticKey: "PERSON:F", correct: false },
      { text: n.C, semanticKey: "PERSON:C", correct: false },
      { text: n.E, semanticKey: "PERSON:E", correct: false },
    ],
    optionShift: seed,
    evidencePaths: [
      blrCp003V9Wave02EvidencePath("D", "I", "AUNT", ["D", "C", "I"]),
    ],
    mixedRelationContract: false,
    coreConcept: [
      "An unnamed spouse does not prove that a person is unmarried.",
      "Unknown marital status and explicit unmarried status are different evidence states.",
    ],
    constraintPoints: [
      `${n.F} is explicitly unmarried, so ${n.F}'s status is known.`,
      `${n.C} and ${n.E} are explicitly married.`,
      `${n.D} is identified as ${n.J}'s mother, but the passage leaves ${n.D}'s spouse boundary unresolved.`,
    ],
    tracePoints: [
      `${n.D} is in the adult sibling generation and is ${n.I}'s aunt.`,
      `No statement establishes ${n.D} as either married or unmarried.`,
    ],
    optionPoints: [
      `${n.F} is explicitly unmarried; ${n.C} and ${n.E} are a married pair.`,
      `${n.D} alone has the requested unresolved status.`,
    ],
    optionReasons: {
      "PERSON:D": `${n.D}'s child is known, but no spouse or marital-status statement is supplied.`,
      "PERSON:F": `${n.F} is explicitly described as unmarried.`,
      "PERSON:C": `${n.C} is explicitly married to ${n.E}.`,
      "PERSON:E": `${n.E} is explicitly married to ${n.C}.`,
    },
    conclusion: `${n.D}'s marital status remains unspecified.`,
    shortcut: "Separate three states: married by an explicit spouse link, unmarried by an explicit statement, and unresolved when neither is provided.",
    traps: [
      "Do not infer marriage merely from parenthood.",
      "Do not infer unmarried status merely from the absence of a named spouse.",
    ],
  });
}

function explicitUnmarriedNotUnknown(seed: number): BlrCp003V9Wave02CandidateRecord {
  const topology = UNSTATED_SPOUSE;
  const n = names(topology, seed);
  const stems = [
    `Who is explicitly stated to be unmarried?`,
    `Which adult has confirmed unmarried status rather than an unstated spouse?`,
    `Select the person whose unmarried status is directly given.`,
    `Who is known to be unmarried from positive evidence?`,
  ] as const;
  return buildBlrCp003V9Wave02Record({
    topology,
    seed,
    names: n,
    authority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    prototypeId: "BLR-CP003-PROT-V9W2-EXPLICIT-UNMARRIED-NOT-UNKNOWN",
    prototypeFamily: "EXPLICIT_STATUS_VS_UNKNOWN_BOUNDARY",
    itemSuffix: "EXPLICIT-UNMARRIED-NOT-UNKNOWN",
    stem: stems[seed % stems.length]!,
    answerType: "PERSON_NAME",
    answerSemanticKey: "PERSON:F",
    optionEntries: [
      { text: n.F, semanticKey: "PERSON:F", correct: true },
      { text: n.D, semanticKey: "PERSON:D", correct: false },
      { text: n.C, semanticKey: "PERSON:C", correct: false },
      { text: n.E, semanticKey: "PERSON:E", correct: false },
    ],
    optionShift: seed + 1,
    evidencePaths: [
      blrCp003V9Wave02EvidencePath("F", "I", "UNCLE", ["F", "C", "I"]),
    ],
    mixedRelationContract: false,
    coreConcept: [
      "Only an explicit unmarried statement can establish unmarried status in this task.",
      "An unresolved spouse boundary must remain unresolved.",
    ],
    constraintPoints: [
      `${n.F} is explicitly called unmarried.`,
      `${n.D}'s spouse is not stated, which does not make ${n.D} unmarried.`,
      `${n.C} and ${n.E} are married.`,
    ],
    tracePoints: [
      `${n.F} is ${n.I}'s uncle through sibling ${n.C}.`,
      `The status statement attached to ${n.F} is direct and unambiguous.`,
    ],
    optionPoints: [
      `${n.D} is unresolved, while ${n.C} and ${n.E} are married.`,
      `${n.F} is the only option with explicit unmarried evidence.`,
    ],
    optionReasons: {
      "PERSON:F": `The passage directly states that ${n.F} is unmarried.`,
      "PERSON:D": `${n.D}'s marital status is unspecified, not confirmed unmarried.`,
      "PERSON:C": `${n.C} is married to ${n.E}.`,
      "PERSON:E": `${n.E} is married to ${n.C}.`,
    },
    conclusion: `${n.F} is explicitly unmarried.`,
    shortcut: "Treat 'unmarried' as a positive fact, not as the default for anyone without a named spouse.",
    traps: [
      "Do not convert unknown status into unmarried status.",
      "Do not ignore an explicit marriage link.",
    ],
  });
}

function auntCousinMixedPair(seed: number): BlrCp003V9Wave02CandidateRecord {
  const topology = UNSTATED_SPOUSE;
  const n = names(topology, seed);
  const stems = [
    `Which pair contains ${n.I}'s aunt and cousin, respectively?`,
    `Select the pair formed by an aunt of ${n.I} and that aunt's son.`,
    `Which option combines ${n.I}'s aunt with ${n.I}'s cousin?`,
    `In which pair is the first member ${n.I}'s aunt and the second a cousin?`,
  ] as const;
  return buildBlrCp003V9Wave02Record({
    topology,
    seed,
    names: n,
    authority: "SELECT_UNORDERED_FAMILY_PAIR",
    prototypeId: "BLR-CP003-PROT-V9W2-AUNT-COUSIN-MIXED-PAIR",
    prototypeFamily: "MIXED_RELATION_PAIR_FROM_SINGLE_PARENT_BRANCH",
    itemSuffix: "AUNT-COUSIN-MIXED-PAIR",
    stem: stems[seed % stems.length]!,
    answerType: "UNORDERED_PERSON_PAIR",
    answerSemanticKey: "PAIR:D:J",
    optionEntries: [
      { text: `${n.D} and ${n.J}`, semanticKey: "PAIR:D:J", correct: true },
      { text: `${n.F} and ${n.J}`, semanticKey: "PAIR:F:J", correct: false },
      { text: `${n.D} and ${n.F}`, semanticKey: "PAIR:D:F", correct: false },
      { text: `${n.C} and ${n.I}`, semanticKey: "PAIR:C:I", correct: false },
    ],
    optionShift: seed + 2,
    evidencePaths: [
      blrCp003V9Wave02EvidencePath("D", "I", "AUNT", ["D", "C", "I"]),
      blrCp003V9Wave02EvidencePath("J", "I", "COUSIN", ["J", "D", "C", "I"]),
    ],
    mixedRelationContract: true,
    coreConcept: [
      "A parent's sister is an aunt, and her child is a cousin.",
      "A mixed pair requires both relation slots to be satisfied by the same family branch.",
    ],
    constraintPoints: [
      `${n.D} and ${n.C} are siblings.`,
      `${n.J} is ${n.D}'s son, not ${n.C}'s child.`,
      `${n.F} is an uncle rather than an aunt.`,
    ],
    tracePoints: [
      `${n.D} → ${n.C} → ${n.I} gives aunt.`,
      `${n.J} → ${n.D} → ${n.C} → ${n.I} gives cousin.`,
    ],
    optionPoints: [
      `${n.F} and ${n.J} gives uncle and cousin, not aunt and cousin.`,
      `${n.D} and ${n.J} satisfies both requested roles.`,
    ],
    optionReasons: {
      "PAIR:D:J": `${n.D} is ${n.I}'s aunt and ${n.J} is ${n.I}'s cousin.`,
      "PAIR:F:J": `${n.F} is an uncle, not an aunt.`,
      "PAIR:D:F": `This pair contains an aunt and an uncle but no cousin.`,
      "PAIR:C:I": `This is a father-daughter pair.`,
    },
    conclusion: `${n.D} and ${n.J} form the aunt-cousin pair.`,
    shortcut: "Once the aunt is fixed, move one level down her branch to find the cousin.",
    traps: [
      "Do not use the male sibling when the stem specifically asks for an aunt.",
      "Do not select the reference person as part of the requested pair.",
    ],
  });
}

function completeParentsOfChild(seed: number): BlrCp003V9Wave02CandidateRecord {
  const topology = UNSTATED_SPOUSE;
  const n = names(topology, seed);
  const stems = [
    `Which option lists both parents of ${n.I}?`,
    `Select the complete parent set for ${n.I}.`,
    `Who are the two established parents of ${n.I}?`,
    `Which pair contains every parent named for ${n.I}?`,
  ] as const;
  return buildBlrCp003V9Wave02Record({
    topology,
    seed,
    names: n,
    authority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    prototypeId: "BLR-CP003-PROT-V9W2-COMPLETE-PARENTS-AFTER-EXCLUSION",
    prototypeFamily: "COMPLETE_SET_AFTER_NEGATIVE_FILTERING",
    itemSuffix: "COMPLETE-PARENTS-AFTER-EXCLUSION",
    stem: stems[seed % stems.length]!,
    answerType: "PERSON_NAME_SET",
    answerSemanticKey: "PERSON_SET:C:E",
    optionEntries: [
      { text: `${n.C} and ${n.E}`, semanticKey: "PERSON_SET:C:E", correct: true },
      { text: `${n.A} and ${n.B}`, semanticKey: "PERSON_SET:A:B", correct: false },
      { text: `${n.D} and ${n.F}`, semanticKey: "PERSON_SET:D:F", correct: false },
      { text: `${n.D} and ${n.J}`, semanticKey: "PERSON_SET:D:J", correct: false },
    ],
    optionShift: seed + 3,
    evidencePaths: [
      blrCp003V9Wave02EvidencePath("C", "I", "FATHER", ["C", "I"]),
      blrCp003V9Wave02EvidencePath("E", "I", "MOTHER", ["E", "I"]),
    ],
    mixedRelationContract: true,
    coreConcept: [
      "A complete parent set contains every named father and mother of the child.",
      "Negative parent clues remove nearby relatives but do not create new parents.",
    ],
    constraintPoints: [
      `${n.D} is explicitly not ${n.I}'s mother.`,
      `${n.F} is explicitly not a parent.`,
      `${n.C} and ${n.E} are married and ${n.I} is their daughter.`,
    ],
    tracePoints: [
      `${n.C} is ${n.I}'s father.`,
      `${n.E} is ${n.I}'s mother.`,
    ],
    optionPoints: [
      `${n.A} and ${n.B} are grandparents; ${n.D} and ${n.F} are collateral relatives.`,
      `${n.C} and ${n.E} is the only complete parent set.`,
    ],
    optionReasons: {
      "PERSON_SET:C:E": `Both named parents of ${n.I} are included.`,
      "PERSON_SET:A:B": `${n.A} and ${n.B} are grandparents of ${n.I}.`,
      "PERSON_SET:D:F": `${n.D} and ${n.F} are aunt and uncle of ${n.I}.`,
      "PERSON_SET:D:J": `This is a mother-son pair from another branch.`,
    },
    conclusion: `${n.C} and ${n.E} are the complete parent set for ${n.I}.`,
    shortcut: "Mark every explicit parent edge to the target child, then reject generation-above and collateral pairs.",
    traps: [
      "Do not include grandparents in the parent set.",
      "Do not treat a negative clue as a positive parent link.",
    ],
  });
}

function motherInLawDaughterPair(seed: number): BlrCp003V9Wave02CandidateRecord {
  const topology = IN_LAW_BRIDGE;
  const n = names(topology, seed);
  const stems = [
    `Which pair contains ${n.E}'s mother-in-law and daughter?`,
    `Select the mother-in-law–daughter pair relative to ${n.E}.`,
    `Which option combines one generation above ${n.E} through marriage and one generation below by blood?`,
    `Who are ${n.E}'s mother-in-law and daughter?`,
  ] as const;
  return buildBlrCp003V9Wave02Record({
    topology,
    seed,
    names: n,
    authority: "SELECT_UNORDERED_FAMILY_PAIR",
    prototypeId: "BLR-CP003-PROT-V9W2-MOTHER-IN-LAW-DAUGHTER-PAIR",
    prototypeFamily: "IN_LAW_PLUS-DESCENDANT-MIXED-PAIR",
    itemSuffix: "MOTHER-IN-LAW-DAUGHTER-PAIR",
    stem: stems[seed % stems.length]!,
    answerType: "UNORDERED_PERSON_PAIR",
    answerSemanticKey: "PAIR:B:I",
    optionEntries: [
      { text: `${n.B} and ${n.I}`, semanticKey: "PAIR:B:I", correct: true },
      { text: `${n.A} and ${n.I}`, semanticKey: "PAIR:A:I", correct: false },
      { text: `${n.B} and ${n.K}`, semanticKey: "PAIR:B:K", correct: false },
      { text: `${n.D} and ${n.J}`, semanticKey: "PAIR:D:J", correct: false },
    ],
    optionShift: seed,
    evidencePaths: [
      blrCp003V9Wave02EvidencePath("B", "E", "MOTHER_IN_LAW", ["B", "C", "E"]),
      blrCp003V9Wave02EvidencePath("I", "E", "DAUGHTER", ["I", "E"]),
    ],
    mixedRelationContract: true,
    coreConcept: [
      "A spouse's mother is a mother-in-law.",
      "A daughter is one generation below through a parent-child edge.",
    ],
    constraintPoints: [
      `${n.C}, not ${n.F}, is the child of ${n.A} and ${n.B} who married ${n.E}.`,
      `${n.I} is not the child of ${n.D}; she is the daughter of ${n.C} and ${n.E}.`,
      `${n.B} is therefore connected to ${n.E} through spouse ${n.C}.`,
    ],
    tracePoints: [
      `${n.B} → ${n.C} → ${n.E} gives mother-in-law.`,
      `${n.I} → ${n.E} gives daughter.`,
    ],
    optionPoints: [
      `${n.A} is father-in-law, while ${n.K} and ${n.J} are nephews of ${n.E}.`,
      `${n.B} and ${n.I} satisfies both generation directions.`,
    ],
    optionReasons: {
      "PAIR:B:I": `${n.B} is ${n.E}'s mother-in-law and ${n.I} is his daughter.`,
      "PAIR:A:I": `${n.A} is father-in-law, not mother-in-law.`,
      "PAIR:B:K": `${n.K} is a nephew of ${n.E}, not his daughter.`,
      "PAIR:D:J": `${n.D} is brother-in-law and ${n.J} is nephew.`,
    },
    conclusion: `${n.B} and ${n.I} are the mother-in-law–daughter pair relative to ${n.E}.`,
    shortcut: "For mixed generation pairs, trace each requested role independently from the same reference person.",
    traps: [
      "Do not replace mother-in-law with father-in-law.",
      "Do not confuse a nephew from another branch with the reference person's daughter.",
    ],
  });
}

function brotherInLawNephewPair(seed: number): BlrCp003V9Wave02CandidateRecord {
  const topology = IN_LAW_BRIDGE;
  const n = names(topology, seed);
  const stems = [
    `Which pair contains ${n.E}'s brother-in-law and nephew?`,
    `Select a spouse-side brother-in-law and a blood-side nephew of ${n.E}.`,
    `Which option combines ${n.E}'s wife's brother with ${n.E}'s sister's son?`,
    `Who are the brother-in-law and nephew relative to ${n.E}?`,
  ] as const;
  return buildBlrCp003V9Wave02Record({
    topology,
    seed,
    names: n,
    authority: "SELECT_UNORDERED_FAMILY_PAIR",
    prototypeId: "BLR-CP003-PROT-V9W2-BROTHER-IN-LAW-NEPHEW-PAIR",
    prototypeFamily: "IN_LAW_PLUS-COLLATERAL-DESCENDANT-PAIR",
    itemSuffix: "BROTHER-IN-LAW-NEPHEW-PAIR",
    stem: stems[seed % stems.length]!,
    answerType: "UNORDERED_PERSON_PAIR",
    answerSemanticKey: "PAIR:D:J",
    optionEntries: [
      { text: `${n.D} and ${n.J}`, semanticKey: "PAIR:D:J", correct: true },
      { text: `${n.F} and ${n.J}`, semanticKey: "PAIR:F:J", correct: false },
      { text: `${n.A} and ${n.K}`, semanticKey: "PAIR:A:K", correct: false },
      { text: `${n.D} and ${n.I}`, semanticKey: "PAIR:D:I", correct: false },
    ],
    optionShift: seed + 1,
    evidencePaths: [
      blrCp003V9Wave02EvidencePath("D", "E", "BROTHER_IN_LAW", ["D", "C", "E"]),
      blrCp003V9Wave02EvidencePath("J", "E", "NEPHEW", ["J", "F", "E"]),
    ],
    mixedRelationContract: true,
    coreConcept: [
      "A spouse's brother is a brother-in-law.",
      "A sister's son is a nephew.",
    ],
    constraintPoints: [
      `${n.D} is ${n.C}'s brother and is not ${n.E}'s blood brother.`,
      `${n.J} is ${n.F}'s son, not ${n.C}'s child.`,
      `${n.F} is ${n.E}'s sister.`,
    ],
    tracePoints: [
      `${n.D} → ${n.C} → ${n.E} gives brother-in-law.`,
      `${n.J} → ${n.F} → ${n.E} gives nephew.`,
    ],
    optionPoints: [
      `${n.F} is a sister, ${n.A} a father-in-law, and ${n.I} a daughter.`,
      `${n.D} and ${n.J} is the only brother-in-law–nephew combination.`,
    ],
    optionReasons: {
      "PAIR:D:J": `${n.D} is ${n.E}'s brother-in-law and ${n.J} is his nephew.`,
      "PAIR:F:J": `${n.F} is ${n.E}'s sister, not brother-in-law.`,
      "PAIR:A:K": `${n.A} is father-in-law, not brother-in-law.`,
      "PAIR:D:I": `${n.I} is ${n.E}'s daughter, not nephew.`,
    },
    conclusion: `${n.D} and ${n.J} form the brother-in-law–nephew pair.`,
    shortcut: "Marriage-side siblings and blood-side sibling children may meet in one mixed pair; trace both paths separately.",
    traps: [
      "Do not call a blood sister a brother-in-law.",
      "Do not replace the nephew with the reference person's own child.",
    ],
  });
}

function parentsInLawSet(seed: number): BlrCp003V9Wave02CandidateRecord {
  const topology = IN_LAW_BRIDGE;
  const n = names(topology, seed);
  const stems = [
    `Which option lists both parents-in-law of ${n.E}?`,
    `Select the complete parent-in-law set for ${n.E}.`,
    `Who are the two members one generation above ${n.E} through marriage?`,
    `Which pair contains ${n.E}'s father-in-law and mother-in-law?`,
  ] as const;
  return buildBlrCp003V9Wave02Record({
    topology,
    seed,
    names: n,
    authority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    prototypeId: "BLR-CP003-PROT-V9W2-PARENTS-IN-LAW-SET",
    prototypeFamily: "COMPLETE_IN_LAW_GENERATION_SET",
    itemSuffix: "PARENTS-IN-LAW-SET",
    stem: stems[seed % stems.length]!,
    answerType: "PERSON_NAME_SET",
    answerSemanticKey: "PERSON_SET:A:B",
    optionEntries: [
      { text: `${n.A} and ${n.B}`, semanticKey: "PERSON_SET:A:B", correct: true },
      { text: `${n.A} and ${n.C}`, semanticKey: "PERSON_SET:A:C", correct: false },
      { text: `${n.B} and ${n.D}`, semanticKey: "PERSON_SET:B:D", correct: false },
      { text: `${n.C} and ${n.D}`, semanticKey: "PERSON_SET:C:D", correct: false },
    ],
    optionShift: seed + 2,
    evidencePaths: [
      blrCp003V9Wave02EvidencePath("A", "E", "FATHER_IN_LAW", ["A", "C", "E"]),
      blrCp003V9Wave02EvidencePath("B", "E", "MOTHER_IN_LAW", ["B", "C", "E"]),
    ],
    mixedRelationContract: true,
    coreConcept: [
      "Parents-in-law are the parents of one's spouse.",
      "A complete set must include both members of the spouse's parent generation.",
    ],
    constraintPoints: [
      `${n.C} is married to ${n.E}.`,
      `${n.A} and ${n.B}, not ${n.F}, are ${n.C}'s parents.`,
      `${n.D} is ${n.C}'s brother rather than a parent.`,
    ],
    tracePoints: [
      `${n.A} → ${n.C} → ${n.E} gives father-in-law.`,
      `${n.B} → ${n.C} → ${n.E} gives mother-in-law.`,
    ],
    optionPoints: [
      `Options containing ${n.C} or ${n.D} mix spouse or sibling roles into the parent set.`,
      `${n.A} and ${n.B} is the complete answer.`,
    ],
    optionReasons: {
      "PERSON_SET:A:B": `They are the two parents of ${n.E}'s spouse ${n.C}.`,
      "PERSON_SET:A:C": `${n.C} is ${n.E}'s spouse, not a parent-in-law.`,
      "PERSON_SET:B:D": `${n.D} is ${n.E}'s brother-in-law.`,
      "PERSON_SET:C:D": `This pair contains spouse and brother-in-law but no parent-in-law.`,
    },
    conclusion: `${n.A} and ${n.B} are ${n.E}'s parents-in-law.`,
    shortcut: "Move from the reference to the spouse, then one generation upward to collect both parents.",
    traps: [
      "Do not include the spouse in the parent-in-law set.",
      "Do not include the spouse's sibling as a parent-in-law.",
    ],
  });
}

function twoNephewBranchSet(seed: number): BlrCp003V9Wave02CandidateRecord {
  const topology = IN_LAW_BRIDGE;
  const n = names(topology, seed);
  const stems = [
    `Which option lists both nephews of ${n.E} shown in the family?`,
    `Select the complete nephew set for ${n.E} across blood and spouse branches.`,
    `Who are ${n.E}'s two nephews, one through his sister and one through his wife?`,
    `Which pair contains every nephew of ${n.E} in the passage?`,
  ] as const;
  return buildBlrCp003V9Wave02Record({
    topology,
    seed,
    names: n,
    authority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    prototypeId: "BLR-CP003-PROT-V9W2-TWO-NEPHEW-BRANCH-SET",
    prototypeFamily: "BLOOD_AND_IN_LAW_SAME_RELATION_SET",
    itemSuffix: "TWO-NEPHEW-BRANCH-SET",
    stem: stems[seed % stems.length]!,
    answerType: "PERSON_NAME_SET",
    answerSemanticKey: "PERSON_SET:J:K",
    optionEntries: [
      { text: `${n.J} and ${n.K}`, semanticKey: "PERSON_SET:J:K", correct: true },
      { text: `${n.I} and ${n.J}`, semanticKey: "PERSON_SET:I:J", correct: false },
      { text: `${n.D} and ${n.K}`, semanticKey: "PERSON_SET:D:K", correct: false },
      { text: `${n.A} and ${n.K}`, semanticKey: "PERSON_SET:A:K", correct: false },
    ],
    optionShift: seed + 3,
    evidencePaths: [
      blrCp003V9Wave02EvidencePath("J", "E", "NEPHEW", ["J", "F", "E"]),
      blrCp003V9Wave02EvidencePath("K", "E", "NEPHEW", ["K", "D", "C", "E"]),
    ],
    mixedRelationContract: false,
    coreConcept: [
      "A sister's son is a nephew by blood.",
      "A spouse's brother's son is also a nephew through marriage.",
    ],
    constraintPoints: [
      `${n.J} is ${n.F}'s son and ${n.F} is ${n.E}'s sister.`,
      `${n.K} is not ${n.E}'s son; he is the son of ${n.E}'s brother-in-law ${n.D}.`,
      `${n.I} is ${n.E}'s daughter.`,
    ],
    tracePoints: [
      `${n.J} → ${n.F} → ${n.E} gives nephew.`,
      `${n.K} → ${n.D} → ${n.C} → ${n.E} also gives nephew.`,
    ],
    optionPoints: [
      `${n.I} is a daughter, ${n.D} a brother-in-law, and ${n.A} a father-in-law.`,
      `${n.J} and ${n.K} is the only complete nephew set.`,
    ],
    optionReasons: {
      "PERSON_SET:J:K": `Both blood-side and spouse-side nephew branches are included.`,
      "PERSON_SET:I:J": `${n.I} is ${n.E}'s daughter.`,
      "PERSON_SET:D:K": `${n.D} is a brother-in-law, not a nephew.`,
      "PERSON_SET:A:K": `${n.A} is a father-in-law, not a nephew.`,
    },
    conclusion: `${n.J} and ${n.K} are the two nephews of ${n.E}.`,
    shortcut: "Check sibling children on both the reference's own side and the spouse's side.",
    traps: [
      "Do not stop after finding only the blood-side nephew.",
      "Do not include the spouse's brother himself in the nephew set.",
    ],
  });
}

function fourGridExplicitUnmarried(seed: number): BlrCp003V9Wave02CandidateRecord {
  const topology = FOUR_SIBLING_GRID;
  const n = names(topology, seed);
  const stems = [
    `Which sibling is explicitly unmarried?`,
    `Who has confirmed unmarried status in the four-sibling generation?`,
    `Select the adult stated to be unmarried rather than merely lacking a named spouse.`,
    `Which person is directly identified as unmarried?`,
  ] as const;
  return buildBlrCp003V9Wave02Record({
    topology,
    seed,
    names: n,
    authority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    prototypeId: "BLR-CP003-PROT-V9W2-FOUR-GRID-EXPLICIT-UNMARRIED",
    prototypeFamily: "MULTI_BRANCH_STATUS_ELIMINATION",
    itemSuffix: "FOUR-GRID-EXPLICIT-UNMARRIED",
    stem: stems[seed % stems.length]!,
    answerType: "PERSON_NAME",
    answerSemanticKey: "PERSON:E",
    optionEntries: [
      { text: n.E, semanticKey: "PERSON:E", correct: true },
      { text: n.F, semanticKey: "PERSON:F", correct: false },
      { text: n.C, semanticKey: "PERSON:C", correct: false },
      { text: n.D, semanticKey: "PERSON:D", correct: false },
    ],
    optionShift: seed,
    evidencePaths: [
      blrCp003V9Wave02EvidencePath("E", "K", "UNCLE", ["E", "C", "K"]),
    ],
    mixedRelationContract: false,
    coreConcept: [
      "Explicit unmarried status must be separated from an unresolved spouse boundary.",
      "Known marriage links eliminate married siblings before the status choice is made.",
    ],
    constraintPoints: [
      `${n.C} and ${n.D} have explicit spouses.`,
      `${n.F}'s spouse boundary is unresolved rather than explicitly unmarried.`,
      `${n.E} alone is directly called unmarried.`,
    ],
    tracePoints: [
      `${n.E} is ${n.K}'s uncle in the four-sibling grid.`,
      `The passage attaches the unmarried statement specifically to ${n.E}.`,
    ],
    optionPoints: [
      `${n.F} is unknown; ${n.C} and ${n.D} are married.`,
      `${n.E} is the only valid option.`,
    ],
    optionReasons: {
      "PERSON:E": `${n.E} is explicitly stated to be unmarried.`,
      "PERSON:F": `${n.F}'s spouse is not identified, so her status remains unresolved.`,
      "PERSON:C": `${n.C} is married to ${n.G}.`,
      "PERSON:D": `${n.D} is married to ${n.H}.`,
    },
    conclusion: `${n.E} is the explicitly unmarried sibling.`,
    shortcut: "Cross out explicit spouse pairs, preserve unknown status as unknown, and select only the direct unmarried statement.",
    traps: [
      "Do not treat an unstated spouse as evidence of being unmarried.",
      "Do not overlook the two explicit marriage links.",
    ],
  });
}

function fourGridUnknownStatus(seed: number): BlrCp003V9Wave02CandidateRecord {
  const topology = FOUR_SIBLING_GRID;
  const n = names(topology, seed);
  const stems = [
    `Whose marital status remains unspecified in the four-branch family?`,
    `Which parent has no stated spouse or marital-status label?`,
    `Who belongs to the unresolved spouse branch?`,
    `For which adult must marital status remain unknown?`,
  ] as const;
  return buildBlrCp003V9Wave02Record({
    topology,
    seed,
    names: n,
    authority: "IDENTIFY_MEMBER_WITH_UNRESOLVED_MARITAL_STATUS",
    prototypeId: "BLR-CP003-PROT-V9W2-FOUR-GRID-UNKNOWN-STATUS",
    prototypeFamily: "UNKNOWN_STATUS_INSIDE_MULTI_BRANCH_GRID",
    itemSuffix: "FOUR-GRID-UNKNOWN-STATUS",
    stem: stems[seed % stems.length]!,
    answerType: "PERSON_NAME",
    answerSemanticKey: "PERSON:F",
    optionEntries: [
      { text: n.F, semanticKey: "PERSON:F", correct: true },
      { text: n.E, semanticKey: "PERSON:E", correct: false },
      { text: n.C, semanticKey: "PERSON:C", correct: false },
      { text: n.D, semanticKey: "PERSON:D", correct: false },
    ],
    optionShift: seed + 1,
    evidencePaths: [
      blrCp003V9Wave02EvidencePath("F", "K", "AUNT", ["F", "C", "K"]),
    ],
    mixedRelationContract: false,
    coreConcept: [
      "Parenthood does not by itself establish a marriage.",
      "A named child and an unnamed spouse can coexist with unresolved marital status.",
    ],
    constraintPoints: [
      `${n.F} is identified as ${n.M}'s mother.`,
      `No spouse or status label is supplied for ${n.F}.`,
      `${n.E} is explicitly unmarried, while ${n.C} and ${n.D} have named spouses.`,
    ],
    tracePoints: [
      `${n.F} is ${n.K}'s aunt through sibling ${n.C}.`,
      `The status evidence for ${n.F} stops at parenthood and does not establish marriage.`,
    ],
    optionPoints: [
      `${n.E}, ${n.C} and ${n.D} all have resolved statuses.`,
      `${n.F} alone remains unspecified.`,
    ],
    optionReasons: {
      "PERSON:F": `${n.F} has a named child but no stated spouse or marital-status label.`,
      "PERSON:E": `${n.E} is explicitly unmarried.`,
      "PERSON:C": `${n.C} is married to ${n.G}.`,
      "PERSON:D": `${n.D} is married to ${n.H}.`,
    },
    conclusion: `${n.F}'s marital status remains unspecified.`,
    shortcut: "A child proves parenthood, not marriage; require a spouse link or an explicit status statement.",
    traps: [
      "Do not infer marriage from the existence of a child.",
      "Do not merge unknown and unmarried into one category.",
    ],
  });
}

function childrenInLawPair(seed: number): BlrCp003V9Wave02CandidateRecord {
  const topology = FOUR_SIBLING_GRID;
  const n = names(topology, seed);
  const stems = [
    `Which pair contains the two established children-in-law of ${n.A} and ${n.B}?`,
    `Select the spouses of the married children of ${n.A} and ${n.B}.`,
    `Which option lists every named son-in-law or daughter-in-law of the top couple?`,
    `Who form the complete established children-in-law pair?`,
  ] as const;
  return buildBlrCp003V9Wave02Record({
    topology,
    seed,
    names: n,
    authority: "SELECT_UNORDERED_FAMILY_PAIR",
    prototypeId: "BLR-CP003-PROT-V9W2-ESTABLISHED-CHILDREN-IN-LAW-PAIR",
    prototypeFamily: "KNOWN_IN_LAWS_WITH_UNKNOWN_BRANCH_EXCLUDED",
    itemSuffix: "ESTABLISHED-CHILDREN-IN-LAW-PAIR",
    stem: stems[seed % stems.length]!,
    answerType: "UNORDERED_PERSON_PAIR",
    answerSemanticKey: "PAIR:G:H",
    optionEntries: [
      { text: `${n.G} and ${n.H}`, semanticKey: "PAIR:G:H", correct: true },
      { text: `${n.C} and ${n.D}`, semanticKey: "PAIR:C:D", correct: false },
      { text: `${n.G} and ${n.D}`, semanticKey: "PAIR:G:D", correct: false },
      { text: `${n.C} and ${n.H}`, semanticKey: "PAIR:C:H", correct: false },
    ],
    optionShift: seed + 2,
    evidencePaths: [
      blrCp003V9Wave02EvidencePath("G", "A", "DAUGHTER_IN_LAW", ["G", "C", "A"]),
      blrCp003V9Wave02EvidencePath("H", "A", "SON_IN_LAW", ["H", "D", "A"]),
    ],
    mixedRelationContract: true,
    coreConcept: [
      "Children-in-law are the named spouses of a person's children.",
      "An unresolved spouse branch contributes no named child-in-law candidate.",
    ],
    constraintPoints: [
      `${n.C} is married to ${n.G}, and ${n.D} is married to ${n.H}.`,
      `${n.E} is unmarried.`,
      `${n.F}'s spouse is not identified, so no additional named child-in-law comes from that branch.`,
    ],
    tracePoints: [
      `${n.G} → ${n.C} → ${n.A} gives daughter-in-law.`,
      `${n.H} → ${n.D} → ${n.A} gives son-in-law.`,
    ],
    optionPoints: [
      `${n.C} and ${n.D} are birth children of the top couple.`,
      `${n.G} and ${n.H} are the complete named children-in-law pair.`,
    ],
    optionReasons: {
      "PAIR:G:H": `They are the named spouses of ${n.A} and ${n.B}'s married children.`,
      "PAIR:C:D": `These are the top couple's own children.`,
      "PAIR:G:D": `${n.D} is a birth child, not a child-in-law.`,
      "PAIR:C:H": `${n.C} is a birth child, not a child-in-law.`,
    },
    conclusion: `${n.G} and ${n.H} are the established children-in-law pair.`,
    shortcut: "Use only explicit spouse links; an unnamed spouse cannot enter a name-based answer set.",
    traps: [
      "Do not invent a spouse for the unresolved branch.",
      "Do not include the top couple's own children as children-in-law.",
    ],
  });
}

function completeCousinsAcrossThreeBranches(seed: number): BlrCp003V9Wave02CandidateRecord {
  const topology = FOUR_SIBLING_GRID;
  const n = names(topology, seed);
  const stems = [
    `Which option lists all cousins of ${n.K} shown in the family?`,
    `Select the complete cousin set for ${n.K} across the other child branches.`,
    `Who are the two cousins of ${n.K}?`,
    `Which pair contains every cousin of ${n.K} in the passage?`,
  ] as const;
  return buildBlrCp003V9Wave02Record({
    topology,
    seed,
    names: n,
    authority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    prototypeId: "BLR-CP003-PROT-V9W2-THREE-BRANCH-COUSIN-SET",
    prototypeFamily: "COMPLETE_COUSIN_SET_WITH_UNKNOWN_SPOUSE_BRANCH",
    itemSuffix: "THREE-BRANCH-COUSIN-SET",
    stem: stems[seed % stems.length]!,
    answerType: "PERSON_NAME_SET",
    answerSemanticKey: "PERSON_SET:L:M",
    optionEntries: [
      { text: `${n.L} and ${n.M}`, semanticKey: "PERSON_SET:L:M", correct: true },
      { text: `${n.D} and ${n.F}`, semanticKey: "PERSON_SET:D:F", correct: false },
      { text: `${n.G} and ${n.H}`, semanticKey: "PERSON_SET:G:H", correct: false },
      { text: `${n.K} and ${n.L}`, semanticKey: "PERSON_SET:K:L", correct: false },
    ],
    optionShift: seed + 3,
    evidencePaths: [
      blrCp003V9Wave02EvidencePath("L", "K", "COUSIN", ["L", "D", "C", "K"]),
      blrCp003V9Wave02EvidencePath("M", "K", "COUSIN", ["M", "F", "C", "K"]),
    ],
    mixedRelationContract: false,
    coreConcept: [
      "Children of a parent's siblings are cousins.",
      "The identity of the other parent is unnecessary when the linking parent branch is explicit.",
    ],
    constraintPoints: [
      `${n.L} is not ${n.K}'s sibling; ${n.L}'s parent ${n.D} is ${n.C}'s sibling.`,
      `${n.M} is not a sibling of either ${n.K} or ${n.L}; ${n.M}'s mother ${n.F} is another sibling of ${n.C}.`,
      `${n.E} has no child branch because he is explicitly unmarried.`,
    ],
    tracePoints: [
      `${n.L} → ${n.D} → ${n.C} → ${n.K} gives cousin.`,
      `${n.M} → ${n.F} → ${n.C} → ${n.K} also gives cousin.`,
    ],
    optionPoints: [
      `${n.D} and ${n.F} are aunts, while ${n.G} and ${n.H} are spouses in the parent generation.`,
      `${n.L} and ${n.M} is the complete cousin set.`,
    ],
    optionReasons: {
      "PERSON_SET:L:M": `Both descend from siblings of ${n.K}'s parent ${n.C}.`,
      "PERSON_SET:D:F": `These are ${n.K}'s aunts, not cousins.`,
      "PERSON_SET:G:H": `These adults belong to the parent generation.`,
      "PERSON_SET:K:L": `${n.K} is the reference person, not one of her own cousins.`,
    },
    conclusion: `${n.L} and ${n.M} are all cousins of ${n.K} shown in the passage.`,
    shortcut: "For cousins, the named linking parent is sufficient; do not invent the other parent's identity.",
    traps: [
      "Do not exclude a cousin merely because one spouse boundary is unknown.",
      "Do not include aunts or the reference person in the cousin set.",
    ],
  });
}

const PROTOTYPE_BUILDERS = [
  unresolvedSingleParentStatus,
  explicitUnmarriedNotUnknown,
  auntCousinMixedPair,
  completeParentsOfChild,
  motherInLawDaughterPair,
  brotherInLawNephewPair,
  parentsInLawSet,
  twoNephewBranchSet,
  fourGridExplicitUnmarried,
  fourGridUnknownStatus,
  childrenInLawPair,
  completeCousinsAcrossThreeBranches,
] as const;

export function generateBlrCp003V9TopologyGapWave02Candidates(
  seeds: readonly number[] = BLR_CP003_V9_WAVE_02_SEEDS,
): readonly BlrCp003V9Wave02CandidateRecord[] {
  const records = seeds.flatMap((seed) =>
    PROTOTYPE_BUILDERS.map((builder) => builder(seed)),
  );
  const fingerprints = new Set<string>();
  for (const record of records) {
    if (fingerprints.has(record.metadata.semanticFingerprint)) {
      throw new Error(`Duplicate V9 Wave 02 fingerprint ${record.metadata.semanticFingerprint}.`);
    }
    fingerprints.add(record.metadata.semanticFingerprint);
    if (
      record.metadata.humanReviewApproved ||
      record.metadata.wave02StructuralStagingApproved ||
      record.metadata.editorialBaselineApproved ||
      record.metadata.structuralSaturationApproved ||
      record.metadata.productionStagingApproved ||
      record.permanentQlId !== null ||
      record.publiclyPublishable ||
      record.questionStudioVisible ||
      record.questionBankEligible ||
      record.mockTestEligible
    ) {
      throw new Error(`V9 Wave 02 leaked a release flag for ${record.itemId}.`);
    }
  }
  return records;
}

export {
  BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_VERSION,
  BLR_CP003_V9_WAVE_02_SEEDS,
  BLR_CP003_V9_WAVE_02_TOPOLOGIES,
};
export type { BlrCp003V9Wave02CandidateRecord };
