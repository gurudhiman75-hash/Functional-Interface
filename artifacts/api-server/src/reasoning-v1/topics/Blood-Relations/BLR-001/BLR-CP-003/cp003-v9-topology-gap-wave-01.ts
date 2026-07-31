import {
  BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_VERSION,
  BLR_CP003_V9_WAVE_01_SEEDS,
  BLR_CP003_V9_WAVE_01_TOPOLOGIES,
  blrCp003V9EvidencePath,
  blrCp003V9NamesFor,
  buildBlrCp003V9Record,
  type BlrCp003V9Authority,
  type BlrCp003V9CandidateRecord,
  type BlrCp003V9TopologyTemplate,
} from "./cp003-v9-topology-gap-wave-01-foundation";

const [MULTI_MARRIED, DUAL_BRANCH, FOUR_GENERATION, UNEQUAL_COUSIN] =
  BLR_CP003_V9_WAVE_01_TOPOLOGIES;

function nameMap(
  topology: BlrCp003V9TopologyTemplate,
  seed: number,
): Readonly<Record<string, string>> {
  return blrCp003V9NamesFor(topology, seed);
}

function multiMarriedBrotherInLawPair(seed: number): BlrCp003V9CandidateRecord {
  const topology = MULTI_MARRIED;
  const n = nameMap(topology, seed);
  const stems = [
    "Which pair consists of brothers-in-law through a wife's brother?",
    "Select the pair linked as a man and his wife's brother.",
    "In which option are the two men brothers-in-law?",
    "Which pair represents a husband and his spouse's brother?",
  ] as const;
  return buildBlrCp003V9Record({
    topology,
    seed,
    names: n,
    authority: "SELECT_UNORDERED_FAMILY_PAIR",
    prototypeId: "BLR-CP003-PROT-V9-BROTHER-IN-LAW-PAIR",
    prototypeFamily: "SPOUSE_SIBLING_PAIR",
    itemSuffix: "BROTHER-IN-LAW-PAIR",
    stem: stems[seed % stems.length]!,
    answerType: "UNORDERED_PERSON_PAIR",
    answerSemanticKey: "PAIR:C:L",
    optionEntries: [
      { text: `${n.C} and ${n.L}`, semanticKey: "PAIR:C:L", correct: true },
      { text: `${n.C} and ${n.E}`, semanticKey: "PAIR:C:E", correct: false },
      { text: `${n.D} and ${n.G}`, semanticKey: "PAIR:D:G", correct: false },
      { text: `${n.F} and ${n.L}`, semanticKey: "PAIR:F:L", correct: false },
    ],
    optionShift: seed,
    evidencePaths: [
      blrCp003V9EvidencePath("L", "C", "BROTHER_IN_LAW", ["L", "F", "C"]),
    ],
    coreConcept: [
      "A spouse's brother is a brother-in-law.",
      "Pair questions require the exact relation between the two displayed members.",
    ],
    branchPoints: [
      `${n.C} is married to ${n.F}.`,
      `${n.L} is the only brother of ${n.F}.`,
    ],
    tracePoints: [
      `Move from ${n.C} to spouse ${n.F}, then to her brother ${n.L}.`,
      `${n.C} and ${n.L} are therefore brothers-in-law.`,
    ],
    optionPoints: [
      `${n.C} and ${n.E} are brothers, ${n.D} and ${n.G} are spouses, and ${n.F} and ${n.L} are siblings.`,
      `Only ${n.C} and ${n.L} match the required in-law pair.`,
    ],
    optionReasons: {
      "PAIR:C:L": `${n.L} is the brother of ${n.C}'s wife ${n.F}.`,
      "PAIR:C:E": `${n.C} and ${n.E} are brothers by birth.`,
      "PAIR:D:G": `${n.D} and ${n.G} are married.`,
      "PAIR:F:L": `${n.F} and ${n.L} are siblings.`,
    },
    conclusion: `${n.C} and ${n.L} are the brothers-in-law pair.`,
    shortcut: "For a spouse-sibling pair, move through the marriage link once and then through one sibling link.",
    traps: [
      "Do not choose blood brothers when the question asks for an in-law relation.",
      "Do not mistake the wife and her brother for brothers-in-law to each other.",
    ],
  });
}

function multiMarriedChildrenInLawSet(seed: number): BlrCp003V9CandidateRecord {
  const topology = MULTI_MARRIED;
  const n = nameMap(topology, seed);
  const stems = [
    `Which option lists all children-in-law of ${n.A} and ${n.B}?`,
    `Select the complete set of people married to the children of ${n.A} and ${n.B}.`,
    `Which option contains every son-in-law and daughter-in-law of the top couple?`,
    `Which option gives the complete in-law children set for ${n.A} and ${n.B}?`,
  ] as const;
  return buildBlrCp003V9Record({
    topology,
    seed,
    names: n,
    authority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    prototypeId: "BLR-CP003-PROT-V9-THREE-CHILDREN-IN-LAW-SET",
    prototypeFamily: "COMPLETE_MULTI_BRANCH_IN_LAW_SET",
    itemSuffix: "THREE-CHILDREN-IN-LAW-SET",
    stem: stems[seed % stems.length]!,
    answerType: "PERSON_NAME_SET",
    answerSemanticKey: "PERSON_SET:F:G:H",
    optionEntries: [
      { text: `${n.F}, ${n.G} and ${n.H}`, semanticKey: "PERSON_SET:F:G:H", correct: true },
      { text: `${n.F} and ${n.G}`, semanticKey: "PERSON_SET:F:G", correct: false },
      { text: `${n.G} and ${n.H}`, semanticKey: "PERSON_SET:G:H", correct: false },
      { text: `${n.C}, ${n.D} and ${n.E}`, semanticKey: "PERSON_SET:C:D:E", correct: false },
    ],
    optionShift: seed + 1,
    evidencePaths: [
      blrCp003V9EvidencePath("F", "A", "DAUGHTER_IN_LAW", ["F", "C", "A"]),
      blrCp003V9EvidencePath("G", "A", "SON_IN_LAW", ["G", "D", "A"]),
      blrCp003V9EvidencePath("H", "A", "DAUGHTER_IN_LAW", ["H", "E", "A"]),
    ],
    coreConcept: [
      "Children-in-law are the spouses of a person's children.",
      "A complete-set answer must cover every married branch and include no birth child.",
    ],
    branchPoints: [
      `${n.C}, ${n.D} and ${n.E} are children of ${n.A} and ${n.B}.`,
      `Their spouses are ${n.F}, ${n.G} and ${n.H}, respectively.`,
    ],
    tracePoints: [
      `${n.F} and ${n.H} are daughters-in-law, while ${n.G} is a son-in-law.`,
      `All three belong in the requested set.`,
    ],
    optionPoints: [
      `The two-name options omit one married branch.`,
      `${n.C}, ${n.D} and ${n.E} are the couple's own children, not children-in-law.`,
    ],
    optionReasons: {
      "PERSON_SET:F:G:H": `It contains the spouses from all three child branches.`,
      "PERSON_SET:F:G": `${n.H}, spouse of ${n.E}, is missing.`,
      "PERSON_SET:G:H": `${n.F}, spouse of ${n.C}, is missing.`,
      "PERSON_SET:C:D:E": `These are the birth children of ${n.A} and ${n.B}.`,
    },
    conclusion: `The complete children-in-law set is ${n.F}, ${n.G} and ${n.H}.`,
    shortcut: "List the top couple's children first, then replace each married child with that child's spouse.",
    traps: [
      "Do not stop after finding only two married branches.",
      "Do not include the couple's own children in the in-law set.",
    ],
  });
}

function multiMarriedUnmarriedBrotherInLaw(seed: number): BlrCp003V9CandidateRecord {
  const topology = MULTI_MARRIED;
  const n = nameMap(topology, seed);
  const stems = [
    `Who is the unmarried brother-in-law of ${n.C}?`,
    `Which person is both unmarried and the brother of ${n.C}'s wife?`,
    `Select ${n.C}'s brother-in-law who is explicitly unmarried.`,
    `Who satisfies both conditions: spouse's brother and unmarried?`,
  ] as const;
  return buildBlrCp003V9Record({
    topology,
    seed,
    names: n,
    authority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    prototypeId: "BLR-CP003-PROT-V9-UNMARRIED-BROTHER-IN-LAW",
    prototypeFamily: "KINSHIP_PLUS_EXPLICIT_STATUS",
    itemSuffix: "UNMARRIED-BROTHER-IN-LAW",
    stem: stems[seed % stems.length]!,
    answerType: "PERSON_NAME",
    answerSemanticKey: "PERSON:L",
    optionEntries: [
      { text: n.L, semanticKey: "PERSON:L", correct: true },
      { text: n.E, semanticKey: "PERSON:E", correct: false },
      { text: n.G, semanticKey: "PERSON:G", correct: false },
      { text: n.A, semanticKey: "PERSON:A", correct: false },
    ],
    optionShift: seed + 2,
    evidencePaths: [
      blrCp003V9EvidencePath("L", "C", "BROTHER_IN_LAW", ["L", "F", "C"]),
    ],
    coreConcept: [
      "Resolve the kinship condition before applying an explicit marital-status condition.",
      "A missing spouse is never evidence of being unmarried unless the passage states it.",
    ],
    branchPoints: [
      `${n.C} is married to ${n.F}.`,
      `${n.F}'s only brother is ${n.L}.`,
    ],
    tracePoints: [
      `${n.L} is the brother-in-law of ${n.C}.`,
      `The passage explicitly states that ${n.L} is unmarried.`,
    ],
    optionPoints: [
      `${n.E}, ${n.G} and ${n.A} do not satisfy both conditions.`,
      `${n.L} is the only listed member matching relation and status together.`,
    ],
    optionReasons: {
      "PERSON:L": `${n.L} is ${n.C}'s wife's brother and is explicitly unmarried.`,
      "PERSON:E": `${n.E} is ${n.C}'s brother and is married to ${n.H}.`,
      "PERSON:G": `${n.G} is married to ${n.D}.`,
      "PERSON:A": `${n.A} is a parent in the top generation.`,
    },
    conclusion: `${n.L} is the unmarried brother-in-law of ${n.C}.`,
    shortcut: "Use two filters: spouse's brother first, then the explicit unmarried statement.",
    traps: [
      "Do not confuse a blood brother with a brother-in-law.",
      "Do not infer marital status from silence.",
    ],
  });
}

function dualBranchCousinPair(seed: number): BlrCp003V9CandidateRecord {
  const topology = DUAL_BRANCH;
  const n = nameMap(topology, seed);
  const stems = [
    `Which pair contains one paternal cousin and one maternal cousin of ${n.I}?`,
    `Select ${n.I}'s paternal-cousin and maternal-cousin pair.`,
    `Which option combines a cousin from each side of ${n.I}'s family?`,
    `In which pair is one member related through ${n.I}'s father and the other through ${n.I}'s mother?`,
  ] as const;
  return buildBlrCp003V9Record({
    topology,
    seed,
    names: n,
    authority: "SELECT_UNORDERED_FAMILY_PAIR",
    prototypeId: "BLR-CP003-PROT-V9-DUAL-SIDE-COUSIN-PAIR",
    prototypeFamily: "REFERENCE_BASED_DUAL_BRANCH_PAIR",
    itemSuffix: "DUAL-SIDE-COUSIN-PAIR",
    stem: stems[seed % stems.length]!,
    answerType: "UNORDERED_PERSON_PAIR",
    answerSemanticKey: "PAIR:J:M",
    optionEntries: [
      { text: `${n.J} and ${n.M}`, semanticKey: "PAIR:J:M", correct: true },
      { text: `${n.J} and ${n.D}`, semanticKey: "PAIR:J:D", correct: false },
      { text: `${n.M} and ${n.H}`, semanticKey: "PAIR:M:H", correct: false },
      { text: `${n.C} and ${n.E}`, semanticKey: "PAIR:C:E", correct: false },
    ],
    optionShift: seed + 3,
    evidencePaths: [
      blrCp003V9EvidencePath("J", "I", "COUSIN", ["J", "D", "A", "C", "I"]),
      blrCp003V9EvidencePath("M", "I", "COUSIN", ["M", "H", "F", "E", "I"]),
    ],
    coreConcept: [
      "A paternal cousin comes through a sibling of the father.",
      "A maternal cousin comes through a sibling of the mother.",
    ],
    branchPoints: [
      `${n.D} is the sister of ${n.I}'s father ${n.C}.`,
      `${n.H} is the brother of ${n.I}'s mother ${n.E}.`,
    ],
    tracePoints: [
      `${n.J}, child of ${n.D}, is the paternal cousin.`,
      `${n.M}, child of ${n.H}, is the maternal cousin.`,
    ],
    optionPoints: [
      `The other pairs contain a parent-child or spouse relation.`,
      `${n.J} and ${n.M} are the only option drawing one cousin from each side.`,
    ],
    optionReasons: {
      "PAIR:J:M": `${n.J} is the paternal cousin and ${n.M} is the maternal cousin of ${n.I}.`,
      "PAIR:J:D": `${n.D} is the mother of ${n.J}.`,
      "PAIR:M:H": `${n.H} is the father of ${n.M}.`,
      "PAIR:C:E": `${n.C} and ${n.E} are ${n.I}'s parents and are married.`,
    },
    conclusion: `${n.J} and ${n.M} form the required dual-side cousin pair.`,
    shortcut: "Trace one branch through the father and one through the mother; take the children of those two siblings.",
    traps: [
      "Do not select a cousin together with that cousin's parent.",
      "Keep the maternal and paternal branches separate until the final pair is formed.",
    ],
  });
}

function dualBranchGrandparentSet(seed: number): BlrCp003V9CandidateRecord {
  const topology = DUAL_BRANCH;
  const n = nameMap(topology, seed);
  const stems = [
    `Which option lists all four grandparents of ${n.I}?`,
    `Select the complete maternal-and-paternal grandparent set of ${n.I}.`,
    `Which option contains every grandparent of ${n.I} and no parent?`,
    `Which option gives the complete grandparent set from both family sides?`,
  ] as const;
  return buildBlrCp003V9Record({
    topology,
    seed,
    names: n,
    authority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    prototypeId: "BLR-CP003-PROT-V9-FOUR-GRANDPARENT-SET",
    prototypeFamily: "COMPLETE_DUAL_SIDE_ANCESTOR_SET",
    itemSuffix: "FOUR-GRANDPARENT-SET",
    stem: stems[seed % stems.length]!,
    answerType: "PERSON_NAME_SET",
    answerSemanticKey: "PERSON_SET:A:B:F:G",
    optionEntries: [
      { text: `${n.A}, ${n.B}, ${n.F} and ${n.G}`, semanticKey: "PERSON_SET:A:B:F:G", correct: true },
      { text: `${n.A} and ${n.B}`, semanticKey: "PERSON_SET:A:B", correct: false },
      { text: `${n.F} and ${n.G}`, semanticKey: "PERSON_SET:F:G", correct: false },
      { text: `${n.C}, ${n.E}, ${n.A} and ${n.F}`, semanticKey: "PERSON_SET:C:E:A:F", correct: false },
    ],
    optionShift: seed + 4,
    evidencePaths: [
      blrCp003V9EvidencePath("A", "I", "GRANDFATHER", ["A", "C", "I"]),
      blrCp003V9EvidencePath("B", "I", "GRANDMOTHER", ["B", "C", "I"]),
      blrCp003V9EvidencePath("F", "I", "GRANDFATHER", ["F", "E", "I"]),
      blrCp003V9EvidencePath("G", "I", "GRANDMOTHER", ["G", "E", "I"]),
    ],
    coreConcept: [
      "A complete grandparent set contains both parents of the father and both parents of the mother.",
      "Parents and grandparents must not be mixed in one answer set.",
    ],
    branchPoints: [
      `${n.A} and ${n.B} are parents of ${n.I}'s father ${n.C}.`,
      `${n.F} and ${n.G} are parents of ${n.I}'s mother ${n.E}.`,
    ],
    tracePoints: [
      `${n.A} and ${n.B} are paternal grandparents.`,
      `${n.F} and ${n.G} are maternal grandparents.`,
    ],
    optionPoints: [
      `Each two-name option covers only one side of the family.`,
      `The mixed option incorrectly includes ${n.I}'s parents ${n.C} and ${n.E}.`,
    ],
    optionReasons: {
      "PERSON_SET:A:B:F:G": `It contains both paternal and both maternal grandparents.`,
      "PERSON_SET:A:B": `It omits the maternal grandparents.`,
      "PERSON_SET:F:G": `It omits the paternal grandparents.`,
      "PERSON_SET:C:E:A:F": `${n.C} and ${n.E} are parents, not grandparents.`,
    },
    conclusion: `All four grandparents are ${n.A}, ${n.B}, ${n.F} and ${n.G}.`,
    shortcut: "Write the father's parents on one side and the mother's parents on the other; combine the two pairs.",
    traps: [
      "Do not answer with only the paternal or only the maternal pair.",
      "Do not include either parent of the reference person.",
    ],
  });
}

function dualBranchExactMaternalLineage(seed: number): BlrCp003V9CandidateRecord {
  const topology = DUAL_BRANCH;
  const n = nameMap(topology, seed);
  const stems = [
    `Who is ${n.I}'s mother's brother's daughter?`,
    `Identify the daughter of the brother of ${n.I}'s mother.`,
    `Which person follows the lineage ${n.I} → mother → brother → daughter?`,
    `Who is the female child of ${n.I}'s maternal uncle?`,
  ] as const;
  return buildBlrCp003V9Record({
    topology,
    seed,
    names: n,
    authority: "IDENTIFY_PERSON_BY_EXACT_LINEAGE",
    prototypeId: "BLR-CP003-PROT-V9-MATERNAL-UNCLE-DAUGHTER-LINEAGE",
    prototypeFamily: "EXACT_MATERNAL_BRANCH_LINEAGE",
    itemSuffix: "MATERNAL-UNCLE-DAUGHTER-LINEAGE",
    stem: stems[seed % stems.length]!,
    answerType: "PERSON_NAME",
    answerSemanticKey: "PERSON:M",
    optionEntries: [
      { text: n.M, semanticKey: "PERSON:M", correct: true },
      { text: n.J, semanticKey: "PERSON:J", correct: false },
      { text: n.N, semanticKey: "PERSON:N", correct: false },
      { text: n.D, semanticKey: "PERSON:D", correct: false },
    ],
    optionShift: seed + 5,
    evidencePaths: [
      blrCp003V9EvidencePath("M", "I", "COUSIN", ["M", "H", "F", "E", "I"]),
    ],
    coreConcept: [
      "Exact-lineage questions must follow every relation word in order.",
      "The target is a person, not merely a named relation label.",
    ],
    branchPoints: [
      `${n.E} is the mother of ${n.I}.`,
      `${n.H} is the brother of ${n.E} and is married to ${n.N}.`,
    ],
    tracePoints: [
      `Mother of ${n.I}: ${n.E}.`,
      `Her brother: ${n.H}; his daughter: ${n.M}.`,
    ],
    optionPoints: [
      `${n.J} belongs to the paternal cousin branch.`,
      `${n.N} is the uncle's wife, while ${n.D} is the father's sister.`,
    ],
    optionReasons: {
      "PERSON:M": `${n.M} is the daughter of maternal uncle ${n.H}.`,
      "PERSON:J": `${n.J} is the child of the father's sister.`,
      "PERSON:N": `${n.N} is the wife of ${n.H}, not his daughter.`,
      "PERSON:D": `${n.D} is the sister of ${n.I}'s father.`,
    },
    conclusion: `${n.M} is ${n.I}'s mother's brother's daughter.`,
    shortcut: "Read the lineage from left to right and write one name after each relation word.",
    traps: [
      "Do not jump directly from 'mother's brother' to his wife.",
      "Do not switch from the maternal branch to the paternal branch.",
    ],
  });
}

function fourGenerationGreatGrandparentPair(seed: number): BlrCp003V9CandidateRecord {
  const topology = FOUR_GENERATION;
  const n = nameMap(topology, seed);
  const stems = [
    `Which pair consists of the great-grandparents of ${n.G}?`,
    `Select the married pair at the great-grandparent level of ${n.G}.`,
    `Which option lists both great-grandparents of ${n.G}?`,
    `Which pair is three generations above ${n.G}?`,
  ] as const;
  return buildBlrCp003V9Record({
    topology,
    seed,
    names: n,
    authority: "SELECT_UNORDERED_FAMILY_PAIR",
    prototypeId: "BLR-CP003-PROT-V9-GREAT-GRANDPARENT-PAIR",
    prototypeFamily: "REFERENCE_BASED_GENERATION_PAIR",
    itemSuffix: "GREAT-GRANDPARENT-PAIR",
    stem: stems[seed % stems.length]!,
    answerType: "UNORDERED_PERSON_PAIR",
    answerSemanticKey: "PAIR:A:B",
    optionEntries: [
      { text: `${n.A} and ${n.B}`, semanticKey: "PAIR:A:B", correct: true },
      { text: `${n.C} and ${n.D}`, semanticKey: "PAIR:C:D", correct: false },
      { text: `${n.H} and ${n.I}`, semanticKey: "PAIR:H:I", correct: false },
      { text: `${n.E} and ${n.F}`, semanticKey: "PAIR:E:F", correct: false },
    ],
    optionShift: seed + 6,
    evidencePaths: [
      blrCp003V9EvidencePath("A", "G", "GREAT_GRANDFATHER", ["A", "C", "E", "G"]),
      blrCp003V9EvidencePath("B", "G", "GREAT_GRANDMOTHER", ["B", "C", "E", "G"]),
    ],
    coreConcept: [
      "Great-grandparents are three parent links above the reference person.",
      "Generation placement distinguishes great-grandparents from grandparents and parents.",
    ],
    branchPoints: [
      `${n.G}'s mother is ${n.E}, and ${n.E}'s father is ${n.C}.`,
      `${n.C} is a son of ${n.A} and ${n.B}.`,
    ],
    tracePoints: [
      `${n.G} → ${n.E} → ${n.C} → ${n.A} reaches the great-grandfather.`,
      `The matching great-grandmother is ${n.B}.`,
    ],
    optionPoints: [
      `${n.C} and ${n.D} are grandparents; ${n.E} and ${n.F} are parents.`,
      `${n.A} and ${n.B} alone occupy the great-grandparent generation.`,
    ],
    optionReasons: {
      "PAIR:A:B": `Both are three generations above ${n.G}.`,
      "PAIR:C:D": `They are the maternal grandparents of ${n.G}.`,
      "PAIR:H:I": `They belong to the parallel grandparent branch.`,
      "PAIR:E:F": `They are the parents of ${n.G}.`,
    },
    conclusion: `${n.A} and ${n.B} are the great-grandparents of ${n.G}.`,
    shortcut: "Count three upward parent links from the reference person.",
    traps: [
      "Do not stop after two upward links at the grandparent level.",
      "A married pair in the tree is not automatically the requested generation pair.",
    ],
  });
}

function fourGenerationGreatGrandchildrenSet(seed: number): BlrCp003V9CandidateRecord {
  const topology = FOUR_GENERATION;
  const n = nameMap(topology, seed);
  const stems = [
    `Which option lists all great-grandchildren of ${n.A} and ${n.B}?`,
    `Select the complete great-grandchild set of the top-generation couple.`,
    `Which option contains every member three generations below ${n.A} and ${n.B}?`,
    `Which option gives the complete youngest-generation descendant set?`,
  ] as const;
  return buildBlrCp003V9Record({
    topology,
    seed,
    names: n,
    authority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    prototypeId: "BLR-CP003-PROT-V9-TWO-BRANCH-GREAT-GRANDCHILD-SET",
    prototypeFamily: "COMPLETE_MULTI_BRANCH_DEEP_DESCENDANT_SET",
    itemSuffix: "GREAT-GRANDCHILD-SET",
    stem: stems[seed % stems.length]!,
    answerType: "PERSON_NAME_SET",
    answerSemanticKey: "PERSON_SET:G:L",
    optionEntries: [
      { text: `${n.G} and ${n.L}`, semanticKey: "PERSON_SET:G:L", correct: true },
      { text: `${n.G} only`, semanticKey: "PERSON_SET:G", correct: false },
      { text: `${n.L} only`, semanticKey: "PERSON_SET:L", correct: false },
      { text: `${n.E} and ${n.J}`, semanticKey: "PERSON_SET:E:J", correct: false },
    ],
    optionShift: seed + 7,
    evidencePaths: [
      blrCp003V9EvidencePath("G", "A", "GREAT_GRANDSON", ["G", "E", "C", "A"]),
      blrCp003V9EvidencePath("L", "A", "GREAT_GRANDDAUGHTER", ["L", "J", "H", "A"]),
    ],
    coreConcept: [
      "A complete descendant set must inspect every branch at the required generation depth.",
      "Great-grandchildren are three child links below the reference ancestor.",
    ],
    branchPoints: [
      `${n.C}'s branch continues through ${n.E} to ${n.G}.`,
      `${n.H}'s branch continues through ${n.J} to ${n.L}.`,
    ],
    tracePoints: [
      `${n.G} is a great-grandson through the ${n.C} branch.`,
      `${n.L} is a great-granddaughter through the ${n.H} branch.`,
    ],
    optionPoints: [
      `A one-name option omits one complete branch.`,
      `${n.E} and ${n.J} are grandchildren, one generation too high.`,
    ],
    optionReasons: {
      "PERSON_SET:G:L": `It includes the youngest member from both descendant branches.`,
      "PERSON_SET:G": `${n.L} from the second branch is missing.`,
      "PERSON_SET:L": `${n.G} from the first branch is missing.`,
      "PERSON_SET:E:J": `These members are grandchildren, not great-grandchildren.`,
    },
    conclusion: `The complete great-grandchild set is ${n.G} and ${n.L}.`,
    shortcut: "Follow every child branch exactly three levels downward and collect the endpoints.",
    traps: [
      "Do not inspect only the branch containing the named child in the first clue.",
      "Do not confuse grandchildren with great-grandchildren.",
    ],
  });
}

function fourGenerationExactGreatGrandmother(seed: number): BlrCp003V9CandidateRecord {
  const topology = FOUR_GENERATION;
  const n = nameMap(topology, seed);
  const stems = [
    `Who is ${n.G}'s mother's father's father's wife?`,
    `Identify the wife reached by ${n.G} → mother → father → father.`,
    `Which person is the wife of the father of ${n.G}'s maternal grandfather?`,
    `Who follows the exact lineage: mother, her father, his father, then wife?`,
  ] as const;
  return buildBlrCp003V9Record({
    topology,
    seed,
    names: n,
    authority: "IDENTIFY_PERSON_BY_EXACT_LINEAGE",
    prototypeId: "BLR-CP003-PROT-V9-GREAT-GRANDMOTHER-EXACT-LINEAGE",
    prototypeFamily: "FOUR_GENERATION_EXACT_LINEAGE",
    itemSuffix: "GREAT-GRANDMOTHER-EXACT-LINEAGE",
    stem: stems[seed % stems.length]!,
    answerType: "PERSON_NAME",
    answerSemanticKey: "PERSON:B",
    optionEntries: [
      { text: n.B, semanticKey: "PERSON:B", correct: true },
      { text: n.A, semanticKey: "PERSON:A", correct: false },
      { text: n.D, semanticKey: "PERSON:D", correct: false },
      { text: n.I, semanticKey: "PERSON:I", correct: false },
    ],
    optionShift: seed + 8,
    evidencePaths: [
      blrCp003V9EvidencePath("B", "G", "GREAT_GRANDMOTHER", ["B", "C", "E", "G"]),
    ],
    coreConcept: [
      "Exact-lineage questions require each possession step to be resolved in order.",
      "The final word 'wife' changes the target from the great-grandfather to the great-grandmother.",
    ],
    branchPoints: [
      `${n.E} is the mother of ${n.G}.`,
      `${n.C} is ${n.E}'s father, and ${n.A} is ${n.C}'s father.`,
    ],
    tracePoints: [
      `${n.G} → mother ${n.E} → father ${n.C} → father ${n.A}.`,
      `The wife of ${n.A} is ${n.B}.`,
    ],
    optionPoints: [
      `${n.A} is reached before applying the final wife step.`,
      `${n.D} and ${n.I} are spouses in the grandparent generation, not the target.`,
    ],
    optionReasons: {
      "PERSON:B": `${n.B} is the wife of ${n.A}, the father of ${n.G}'s maternal grandfather.`,
      "PERSON:A": `This stops one relation word early at the great-grandfather.`,
      "PERSON:D": `${n.D} is the wife of maternal grandfather ${n.C}.`,
      "PERSON:I": `${n.I} belongs to the parallel grandparent branch.`,
    },
    conclusion: `${n.B} is the person identified by the exact lineage.`,
    shortcut: "Underline every relation word and do not answer until the final word has been applied.",
    traps: [
      "Do not stop at the mother's father's father.",
      "Do not cross into the parallel branch containing the other grandfather.",
    ],
  });
}

function unequalCompositePair(seed: number): BlrCp003V9CandidateRecord {
  const topology = UNEQUAL_COUSIN;
  const n = nameMap(topology, seed);
  const stems = [
    `Which pair contains ${n.G}'s male cousin and unmarried paternal aunt?`,
    `Select the pair made of the male cousin and unmarried paternal aunt of ${n.G}.`,
    `In which option is one member ${n.G}'s male cousin and the other the unmarried paternal aunt?`,
    `Which pair satisfies both reference-based conditions for ${n.G}?`,
  ] as const;
  return buildBlrCp003V9Record({
    topology,
    seed,
    names: n,
    authority: "SELECT_UNORDERED_FAMILY_PAIR",
    prototypeId: "BLR-CP003-PROT-V9-COMPOSITE-REFERENCE-PAIR",
    prototypeFamily: "TWO_CONDITION_REFERENCE_PAIR",
    itemSuffix: "MALE-COUSIN-UNMARRIED-AUNT-PAIR",
    stem: stems[seed % stems.length]!,
    answerType: "UNORDERED_PERSON_PAIR",
    answerSemanticKey: "PAIR:I:E",
    optionEntries: [
      { text: `${n.I} and ${n.E}`, semanticKey: "PAIR:I:E", correct: true },
      { text: `${n.J} and ${n.E}`, semanticKey: "PAIR:J:E", correct: false },
      { text: `${n.I} and ${n.D}`, semanticKey: "PAIR:I:D", correct: false },
      { text: `${n.C} and ${n.E}`, semanticKey: "PAIR:C:E", correct: false },
    ],
    optionShift: seed + 9,
    evidencePaths: [
      blrCp003V9EvidencePath("I", "G", "COUSIN", ["I", "D", "A", "C", "G"]),
      blrCp003V9EvidencePath("E", "G", "AUNT", ["E", "A", "C", "G"]),
    ],
    coreConcept: [
      "Some pair questions apply a separate condition to each member relative to one reference person.",
      "Gender and explicit marital status can distinguish otherwise similar relatives.",
    ],
    branchPoints: [
      `${n.I} and ${n.J} are children of ${n.G}'s paternal aunt ${n.D}.`,
      `${n.E} is another sister of ${n.G}'s father and is explicitly unmarried.`,
    ],
    tracePoints: [
      `${n.I} is the male cousin of ${n.G}.`,
      `${n.E} is the unmarried paternal aunt of ${n.G}.`,
    ],
    optionPoints: [
      `${n.J} is a female cousin, while ${n.D} is married.`,
      `${n.C} is the father of ${n.G}, not a cousin.`,
    ],
    optionReasons: {
      "PAIR:I:E": `${n.I} is the male cousin and ${n.E} is the explicitly unmarried paternal aunt.`,
      "PAIR:J:E": `${n.J} is a female cousin, not the requested male cousin.`,
      "PAIR:I:D": `${n.D} is married to ${n.H}.`,
      "PAIR:C:E": `${n.C} is ${n.G}'s father.`,
    },
    conclusion: `${n.I} and ${n.E} form the required composite pair.`,
    shortcut: "Check each half of the pair independently against the reference person before combining them.",
    traps: [
      "Do not ignore the gender condition on the cousin.",
      "Do not confuse an unmarried aunt with another aunt whose spouse is shown.",
    ],
  });
}

function unequalCompleteCousinSet(seed: number): BlrCp003V9CandidateRecord {
  const topology = UNEQUAL_COUSIN;
  const n = nameMap(topology, seed);
  const stems = [
    `Which option lists all cousins of ${n.G}?`,
    `Select the complete cousin set of ${n.G}.`,
    `Which option contains every child of ${n.G}'s father's sister?`,
    `Which option gives all of ${n.G}'s cousins and no aunt?`,
  ] as const;
  return buildBlrCp003V9Record({
    topology,
    seed,
    names: n,
    authority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    prototypeId: "BLR-CP003-PROT-V9-UNEQUAL-BRANCH-COUSIN-SET",
    prototypeFamily: "ONE_TO_MANY_COUSIN_SET",
    itemSuffix: "UNEQUAL-BRANCH-COUSIN-SET",
    stem: stems[seed % stems.length]!,
    answerType: "PERSON_NAME_SET",
    answerSemanticKey: "PERSON_SET:I:J",
    optionEntries: [
      { text: `${n.I} and ${n.J}`, semanticKey: "PERSON_SET:I:J", correct: true },
      { text: `${n.I} only`, semanticKey: "PERSON_SET:I", correct: false },
      { text: `${n.J} only`, semanticKey: "PERSON_SET:J", correct: false },
      { text: `${n.I}, ${n.J} and ${n.E}`, semanticKey: "PERSON_SET:I:J:E", correct: false },
    ],
    optionShift: seed + 10,
    evidencePaths: [
      blrCp003V9EvidencePath("I", "G", "COUSIN", ["I", "D", "A", "C", "G"]),
      blrCp003V9EvidencePath("J", "G", "COUSIN", ["J", "D", "A", "C", "G"]),
    ],
    coreConcept: [
      "In unequal branches, one child may have more than one cousin in another branch.",
      "Complete-set options must include all siblings in the cousin branch and exclude their parent generation.",
    ],
    branchPoints: [
      `${n.G} is the only child in ${n.C}'s branch.`,
      `${n.I} and ${n.J} are the two children in sibling ${n.D}'s branch.`,
    ],
    tracePoints: [
      `${n.C} and ${n.D} are siblings.`,
      `Therefore both ${n.I} and ${n.J} are cousins of ${n.G}.`,
    ],
    optionPoints: [
      `Each one-name option is incomplete.`,
      `${n.E} is an aunt of ${n.G}, so the three-name option contains an extra member.`,
    ],
    optionReasons: {
      "PERSON_SET:I:J": `It includes both children of the sibling branch.`,
      "PERSON_SET:I": `${n.J} is also a cousin and is missing.`,
      "PERSON_SET:J": `${n.I} is also a cousin and is missing.`,
      "PERSON_SET:I:J:E": `${n.E} is a paternal aunt, not a cousin.`,
    },
    conclusion: `The complete cousin set is ${n.I} and ${n.J}.`,
    shortcut: "After identifying the parent's sibling, include every child in that sibling's branch.",
    traps: [
      "Do not assume each branch contains the same number of children.",
      "Do not add an aunt from the parent generation to the cousin set.",
    ],
  });
}

function unequalUnmarriedPaternalAunt(seed: number): BlrCp003V9CandidateRecord {
  const topology = UNEQUAL_COUSIN;
  const n = nameMap(topology, seed);
  const stems = [
    `Who is the unmarried paternal aunt of ${n.G}?`,
    `Which person is both unmarried and a sister of ${n.G}'s father?`,
    `Select ${n.G}'s paternal aunt who is explicitly unmarried.`,
    `Who satisfies the paternal-aunt relation and the unmarried condition?`,
  ] as const;
  return buildBlrCp003V9Record({
    topology,
    seed,
    names: n,
    authority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    prototypeId: "BLR-CP003-PROT-V9-UNMARRIED-PATERNAL-AUNT",
    prototypeFamily: "KINSHIP_PLUS_EXPLICIT_STATUS",
    itemSuffix: "UNMARRIED-PATERNAL-AUNT",
    stem: stems[seed % stems.length]!,
    answerType: "PERSON_NAME",
    answerSemanticKey: "PERSON:E",
    optionEntries: [
      { text: n.E, semanticKey: "PERSON:E", correct: true },
      { text: n.D, semanticKey: "PERSON:D", correct: false },
      { text: n.F, semanticKey: "PERSON:F", correct: false },
      { text: n.B, semanticKey: "PERSON:B", correct: false },
    ],
    optionShift: seed + 11,
    evidencePaths: [
      blrCp003V9EvidencePath("E", "G", "AUNT", ["E", "A", "C", "G"]),
    ],
    coreConcept: [
      "A paternal aunt is a sister of the father.",
      "When more than one paternal aunt exists, the explicit status clue selects the target.",
    ],
    branchPoints: [
      `${n.C} is the father of ${n.G}.`,
      `${n.D} and ${n.E} are sisters of ${n.C}.`,
    ],
    tracePoints: [
      `Both ${n.D} and ${n.E} are paternal aunts of ${n.G}.`,
      `${n.D} is married to ${n.H}, while ${n.E} is explicitly unmarried.`,
    ],
    optionPoints: [
      `${n.F} is ${n.G}'s mother and ${n.B} is a grandmother.`,
      `${n.E} alone satisfies both relation and status.`,
    ],
    optionReasons: {
      "PERSON:E": `${n.E} is the father's sister and is explicitly unmarried.`,
      "PERSON:D": `${n.D} is a paternal aunt but is married to ${n.H}.`,
      "PERSON:F": `${n.F} is the mother of ${n.G}.`,
      "PERSON:B": `${n.B} is the paternal grandmother of ${n.G}.`,
    },
    conclusion: `${n.E} is the unmarried paternal aunt of ${n.G}.`,
    shortcut: "List the father's sisters, then use only the explicit status statement to select between them.",
    traps: [
      "Do not stop after identifying the first paternal aunt.",
      "Do not infer unmarried status from a missing spouse unless the passage states it.",
    ],
  });
}

export function generateBlrCp003V9TopologyGapWave01Candidates(
  seeds: readonly number[] = BLR_CP003_V9_WAVE_01_SEEDS,
): readonly BlrCp003V9CandidateRecord[] {
  const records: BlrCp003V9CandidateRecord[] = [];
  for (const seed of seeds) {
    records.push(
      multiMarriedBrotherInLawPair(seed),
      multiMarriedChildrenInLawSet(seed),
      multiMarriedUnmarriedBrotherInLaw(seed),
      dualBranchCousinPair(seed),
      dualBranchGrandparentSet(seed),
      dualBranchExactMaternalLineage(seed),
      fourGenerationGreatGrandparentPair(seed),
      fourGenerationGreatGrandchildrenSet(seed),
      fourGenerationExactGreatGrandmother(seed),
      unequalCompositePair(seed),
      unequalCompleteCousinSet(seed),
      unequalUnmarriedPaternalAunt(seed),
    );
  }

  const itemIds = new Set<string>();
  const fingerprints = new Set<string>();
  for (const record of records) {
    if (itemIds.has(record.itemId)) throw new Error(`Duplicate V9 item ID ${record.itemId}.`);
    if (fingerprints.has(record.metadata.semanticFingerprint)) {
      throw new Error(`Duplicate V9 fingerprint ${record.metadata.semanticFingerprint}.`);
    }
    itemIds.add(record.itemId);
    fingerprints.add(record.metadata.semanticFingerprint);
  }
  return records;
}

export function blrCp003V9Wave01AuthorityCounts(
  records: readonly BlrCp003V9CandidateRecord[] =
    generateBlrCp003V9TopologyGapWave01Candidates(),
): Readonly<Record<BlrCp003V9Authority, number>> {
  const counts: Record<BlrCp003V9Authority, number> = {
    SELECT_UNORDERED_FAMILY_PAIR: 0,
    IDENTIFY_ALL_MEMBERS_BY_RELATION: 0,
    IDENTIFY_MEMBER_BY_MARITAL_STATUS: 0,
    IDENTIFY_PERSON_BY_EXACT_LINEAGE: 0,
  };
  for (const record of records) counts[record.provisionalAuthority] += 1;
  return counts;
}

export function blrCp003V9Wave01TopologyCounts(
  records: readonly BlrCp003V9CandidateRecord[] =
    generateBlrCp003V9TopologyGapWave01Candidates(),
): Readonly<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const record of records) counts[record.topologyId] = (counts[record.topologyId] ?? 0) + 1;
  return counts;
}

export function blrCp003V9Wave01PrototypeIds(
  records: readonly BlrCp003V9CandidateRecord[] =
    generateBlrCp003V9TopologyGapWave01Candidates(),
): readonly string[] {
  return [...new Set(records.map((record) => record.prototypeId))].sort();
}

export {
  BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_VERSION,
  BLR_CP003_V9_WAVE_01_SEEDS,
  BLR_CP003_V9_WAVE_01_TOPOLOGIES,
};
export type { BlrCp003V9CandidateRecord };
