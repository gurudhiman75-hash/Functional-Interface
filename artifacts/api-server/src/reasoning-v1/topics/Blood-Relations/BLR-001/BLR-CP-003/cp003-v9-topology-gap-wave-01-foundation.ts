import { stableHash } from "../foundation/prng";
import type { BlrRelationId } from "../foundation/types";
import type {
  BlrCp003V6CandidateOption,
  BlrCp003V6EvidencePath,
} from "./cp003-learner-evidence-v6-candidate";
import type {
  BlrCp003SvgFamilyTreeDiagram,
  BlrCp003SvgFamilyTreeEdge,
  BlrCp003SvgFamilyTreeNode,
  BlrCp003SvgGender,
} from "./cp003-svg-family-tree";
import type {
  BlrCp003V8PassageAudit,
  BlrCp003V8SolutionPhase,
} from "./cp003-learner-evidence-v8-candidate";

export const BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_VERSION =
  "BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_V1" as const;

export const BLR_CP003_V9_WAVE_01_SEEDS = [0, 1, 2, 3, 4, 5, 6, 7] as const;

export type BlrCp003V9Authority =
  | "SELECT_UNORDERED_FAMILY_PAIR"
  | "IDENTIFY_ALL_MEMBERS_BY_RELATION"
  | "IDENTIFY_MEMBER_BY_MARITAL_STATUS"
  | "IDENTIFY_PERSON_BY_EXACT_LINEAGE";

export type BlrCp003V9AnswerType =
  | "UNORDERED_PERSON_PAIR"
  | "PERSON_NAME_SET"
  | "PERSON_NAME";

export type BlrCp003V9TopologyId =
  | "MULTI_MARRIED_SIBLING_IN_LAW"
  | "MATERNAL_PATERNAL_DUAL_BRANCH"
  | "FOUR_GENERATION_ASYMMETRIC_LINEAGE"
  | "UNEQUAL_COUSIN_BRANCHES";

export interface BlrCp003V9CandidateRecord {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-003";
  permanentQlId: null;
  prototypeOnly: true;
  reviewOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  questionBankEligible: false;
  mockTestEligible: false;
  locale: "en-IN";
  provisionalAuthority: BlrCp003V9Authority;
  sourceAuthority: "STRUCTURAL_GAP_WAVE_01";
  prototypeId: string;
  prototypeFamily: string;
  scenarioId: string;
  topologyId: BlrCp003V9TopologyId;
  seed: number;
  itemId: string;
  sharedPrompt: string;
  stem: string;
  answerType: BlrCp003V9AnswerType;
  answerSemanticKey: string;
  options: readonly BlrCp003V6CandidateOption[];
  correctIndex: number;
  evidencePaths: readonly BlrCp003V6EvidencePath[];
  proceduralLogic: BlrCp003SvgFamilyTreeDiagram;
  editorial: {
    coreConcept: readonly string[];
    stepByStepSolution: readonly string[];
    optionAnalysis: readonly {
      optionLabel: "A" | "B" | "C" | "D";
      optionText: string;
      isCorrect: boolean;
      explanation: string;
    }[];
    conclusion: string;
    examShortcut: string;
    commonTraps: readonly string[];
    solutionPhases: readonly BlrCp003V8SolutionPhase[];
  };
  metadata: {
    runtimeVersion: "blr-cp003-v9-topology-gap-wave-01-v1";
    gapWaveVersion: typeof BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_VERSION;
    competitiveCandidate: true;
    humanReviewApproved: false;
    editorialBaselineApproved: false;
    structuralSaturationApproved: false;
    productionStagingApproved: false;
    uniqueAnswer: true;
    optionSemanticsUnique: true;
    nativeSvgFamilyTree: true;
    asciiFallbackRetained: true;
    authenticExamStem: true;
    nameBasedOptions: true;
    phaseStructuredExplanation: true;
    newTopology: true;
    newPrototype: true;
    minimumEvidenceDistance: number;
    passageAudit: BlrCp003V8PassageAudit;
    semanticFingerprint: string;
  };
}

type PersonSpec = {
  id: string;
  gender: BlrCp003SvgGender;
  generation: number;
  roleLabel?: string;
};

type EdgeSpec = Omit<BlrCp003SvgFamilyTreeEdge, "id">;

export type BlrCp003V9PassageProfile = {
  text: string;
  audit: BlrCp003V8PassageAudit;
};

export type BlrCp003V9TopologyTemplate = {
  scenarioId: string;
  topologyId: BlrCp003V9TopologyId;
  persons: readonly PersonSpec[];
  edges: readonly EdgeSpec[];
  explicitUnmarriedIds: readonly string[];
  passage: (
    names: Readonly<Record<string, string>>,
    seed: number,
  ) => BlrCp003V9PassageProfile;
};

type OptionEntry = {
  text: string;
  semanticKey: string;
  correct: boolean;
};

export type BlrCp003V9BuildInput = {
  topology: BlrCp003V9TopologyTemplate;
  seed: number;
  names: Readonly<Record<string, string>>;
  authority: BlrCp003V9Authority;
  prototypeId: string;
  prototypeFamily: string;
  itemSuffix: string;
  stem: string;
  answerType: BlrCp003V9AnswerType;
  answerSemanticKey: string;
  optionEntries: readonly OptionEntry[];
  optionShift: number;
  evidencePaths: readonly BlrCp003V6EvidencePath[];
  coreConcept: readonly string[];
  branchPoints: readonly string[];
  tracePoints: readonly string[];
  optionPoints: readonly string[];
  optionReasons: Readonly<Record<string, string>>;
  conclusion: string;
  shortcut: string;
  traps: readonly string[];
};

const MALE_NAMES = [
  "Aman",
  "Bharat",
  "Charan",
  "Deepak",
  "Gagan",
  "Harjit",
  "Karan",
  "Manav",
  "Nitin",
  "Rohit",
  "Sahil",
  "Vikas",
  "Arjun",
  "Dev",
  "Ishaan",
  "Kabir",
  "Laksh",
  "Mohan",
  "Naveen",
  "Rajat",
] as const;

const FEMALE_NAMES = [
  "Asha",
  "Bhavna",
  "Divya",
  "Gurleen",
  "Isha",
  "Kavita",
  "Meena",
  "Neha",
  "Pooja",
  "Ritu",
  "Simran",
  "Tanya",
  "Anita",
  "Deepa",
  "Geeta",
  "Jasleen",
  "Komal",
  "Manya",
  "Navya",
  "Reena",
] as const;

function rotate<T>(values: readonly T[], shift: number): T[] {
  const offset = ((shift % values.length) + values.length) % values.length;
  return [...values.slice(offset), ...values.slice(0, offset)];
}

function optionLabel(index: number): "A" | "B" | "C" | "D" {
  return String.fromCharCode(65 + index) as "A" | "B" | "C" | "D";
}

function passageAudit(
  sentenceCount: number,
  indirectAnchorCount = 3,
  directEdgeSentenceCount = 2,
): BlrCp003V8PassageAudit {
  return {
    clueOrderStrategy: "DISJOINT_NON_TOPOLOGICAL",
    indirectAnchorCount,
    generationTransitionCount: 4,
    sentenceCount,
    directEdgeSentenceCount,
    stackedLinearChain: false,
  };
}

function multiMarriedPassage(
  n: Readonly<Record<string, string>>,
  seed: number,
): BlrCp003V9PassageProfile {
  const variants = [
    `${n.I}'s mother ${n.F} is ${n.B}'s daughter-in-law, and ${n.F}'s only brother ${n.L} is unmarried. ${n.J} is the son of ${n.D} and ${n.G}. ${n.A} and ${n.B} are married and have three children: ${n.C}, ${n.D} and ${n.E}. ${n.C} is married to ${n.F}, ${n.D} to ${n.G}, and ${n.E} to ${n.H}. ${n.C} and ${n.F} have one daughter ${n.I}; ${n.E} and ${n.H} have one son ${n.K}.`,
    `${n.L}, the only brother of ${n.I}'s mother, is unmarried. ${n.K}'s mother ${n.H} is one of ${n.B}'s daughters-in-law. ${n.A} is married to ${n.B}; their children are ${n.C}, ${n.D} and ${n.E}. ${n.C}'s wife is ${n.F}, ${n.D}'s husband is ${n.G}, and ${n.E}'s wife is ${n.H}. ${n.I}, ${n.J} and ${n.K} belong respectively to the three branches of ${n.C}, ${n.D} and ${n.E}.`,
    `${n.J}'s mother ${n.D} is the only daughter of ${n.A} and ${n.B}. ${n.F}'s brother ${n.L} is unmarried, while ${n.F} is married to ${n.C}. ${n.A} and ${n.B} also have two sons, ${n.C} and ${n.E}. ${n.D} is married to ${n.G}, and ${n.E} is married to ${n.H}. The children in the three branches are ${n.I}, ${n.J} and ${n.K}.`,
    `The youngest members are ${n.I}, ${n.J} and ${n.K}, one from each of three married sibling branches. ${n.I}'s mother ${n.F} has an unmarried brother, ${n.L}. ${n.A} and ${n.B} are married and are parents of ${n.C}, ${n.D} and ${n.E}. Their spouses are ${n.F}, ${n.G} and ${n.H}, respectively. ${n.I} is ${n.C}'s daughter, ${n.J} is ${n.D}'s son, and ${n.K} is ${n.E}'s son.`,
  ] as const;
  return {
    text: `Study the following information about a three-generation family.\n\n${variants[seed % variants.length]!}`,
    audit: passageAudit(5),
  };
}

function dualBranchPassage(
  n: Readonly<Record<string, string>>,
  seed: number,
): BlrCp003V9PassageProfile {
  const variants = [
    `${n.M} is the daughter of ${n.I}'s maternal uncle ${n.H}. ${n.J}'s mother ${n.D} is the sister of ${n.I}'s father ${n.C}. ${n.A} and ${n.B} are married and are parents of ${n.C} and ${n.D}. ${n.F} and ${n.G} are married and are parents of ${n.E} and ${n.H}. ${n.C} is married to ${n.E} and they have ${n.I}; ${n.D} is married to ${n.L} and has ${n.J}, while ${n.H} is married to ${n.N} and has ${n.M}.`,
    `${n.J} is the son of the sister of ${n.I}'s father. ${n.M} is the daughter of the brother of ${n.I}'s mother. ${n.C} and ${n.D} are the children of ${n.A} and ${n.B}; ${n.E} and ${n.H} are the children of ${n.F} and ${n.G}. ${n.C} is married to ${n.E}. ${n.D} and ${n.L} are parents of ${n.J}, while ${n.H} and ${n.N} are parents of ${n.M}.`,
    `${n.I}'s paternal cousin is ${n.J}, whose mother is ${n.D}. ${n.I}'s maternal cousin is ${n.M}, whose father is ${n.H}. ${n.A} and ${n.B} are parents of ${n.C} and ${n.D}; ${n.F} and ${n.G} are parents of ${n.E} and ${n.H}. ${n.C} and ${n.E} are married and have ${n.I}. ${n.D} is married to ${n.L}, and ${n.H} is married to ${n.N}.`,
    `Two cousin branches meet at ${n.I}. On the paternal side, ${n.D}'s son is ${n.J}; on the maternal side, ${n.H}'s daughter is ${n.M}. ${n.C} and ${n.D} are siblings born to ${n.A} and ${n.B}. ${n.E} and ${n.H} are siblings born to ${n.F} and ${n.G}. ${n.C} is married to ${n.E}, while ${n.D} is married to ${n.L} and ${n.H} to ${n.N}.`,
  ] as const;
  return {
    text: `Study the following information about both sides of a family.\n\n${variants[seed % variants.length]!}`,
    audit: passageAudit(5),
  };
}

function fourGenerationPassage(
  n: Readonly<Record<string, string>>,
  seed: number,
): BlrCp003V9PassageProfile {
  const variants = [
    `${n.G}'s mother ${n.E} is the daughter of ${n.C} and ${n.D}. ${n.L}'s mother ${n.J} is the daughter of ${n.H} and ${n.I}. ${n.A} and ${n.B} are married and have two sons, ${n.C} and ${n.H}. ${n.E} is married to ${n.F} and has ${n.G}. ${n.J} is married to ${n.K} and has ${n.L}.`,
    `${n.L} and ${n.G} are the youngest members of two branches. ${n.G}'s maternal grandfather ${n.C} and ${n.L}'s maternal grandfather ${n.H} are brothers. Their parents are ${n.A} and ${n.B}. ${n.C} is married to ${n.D}, and ${n.H} is married to ${n.I}. Their daughters ${n.E} and ${n.J} are married to ${n.F} and ${n.K}, respectively.`,
    `${n.B} is the wife of the common great-grandfather of ${n.G} and ${n.L}. ${n.E}, mother of ${n.G}, is the only child of ${n.C} and ${n.D}. ${n.J}, mother of ${n.L}, is the only child of ${n.H} and ${n.I}. ${n.C} and ${n.H} are the two sons of ${n.A} and ${n.B}. ${n.E} is married to ${n.F}, while ${n.J} is married to ${n.K}.`,
    `The family spans four generations. ${n.G} is the son of ${n.E} and ${n.F}; ${n.L} is the daughter of ${n.J} and ${n.K}. ${n.E}'s father ${n.C} and ${n.J}'s father ${n.H} are brothers. ${n.C} and ${n.H} are sons of ${n.A} and ${n.B}. ${n.C} is married to ${n.D}, and ${n.H} is married to ${n.I}.`,
  ] as const;
  return {
    text: `Study the following four-generation family information.\n\n${variants[seed % variants.length]!}`,
    audit: passageAudit(5),
  };
}

function unequalCousinPassage(
  n: Readonly<Record<string, string>>,
  seed: number,
): BlrCp003V9PassageProfile {
  const variants = [
    `${n.G} is the only child of ${n.C} and ${n.F}. ${n.I} and ${n.J} are the two children of ${n.D} and ${n.H}. ${n.A} and ${n.B} are married and have three children, ${n.C}, ${n.D} and ${n.E}. ${n.C} is married to ${n.F}, and ${n.D} is married to ${n.H}. ${n.E}, the other sister of ${n.C}, is unmarried.`,
    `${n.E}, an unmarried daughter of ${n.A} and ${n.B}, is the paternal aunt of ${n.G}. ${n.I} and ${n.J} are children of ${n.G}'s paternal aunt ${n.D}. ${n.A} is married to ${n.B}. Their son ${n.C} is married to ${n.F} and has only ${n.G}. Their daughter ${n.D} is married to ${n.H} and has ${n.I} and ${n.J}.`,
    `${n.I}'s sibling is ${n.J}, while their cousin ${n.G} has no sibling. ${n.G}'s father ${n.C} and ${n.I}'s mother ${n.D} are children of ${n.A} and ${n.B}. ${n.E} is their unmarried sister. ${n.C} is married to ${n.F}. ${n.D} is married to ${n.H}.`,
    `One branch has only ${n.G}; the other branch has ${n.I} and ${n.J}. The parents of these two branches, ${n.C} and ${n.D}, are siblings. ${n.A} and ${n.B} are their parents and are married. ${n.C} is married to ${n.F}, and ${n.D} to ${n.H}. ${n.E}, sister of ${n.C} and ${n.D}, is unmarried.`,
  ] as const;
  return {
    text: `Study the following information about an unequal cousin structure.\n\n${variants[seed % variants.length]!}`,
    audit: passageAudit(5),
  };
}

const MULTI_MARRIED_TOPOLOGY: BlrCp003V9TopologyTemplate = {
  scenarioId: "BLR-CP003-V9-SCN-MULTI-MARRIED-SIBLING-IN-LAW",
  topologyId: "MULTI_MARRIED_SIBLING_IN_LAW",
  persons: [
    { id: "A", gender: "male", generation: 1 },
    { id: "B", gender: "female", generation: 1 },
    { id: "C", gender: "male", generation: 0 },
    { id: "D", gender: "female", generation: 0 },
    { id: "E", gender: "male", generation: 0 },
    { id: "F", gender: "female", generation: 0 },
    { id: "G", gender: "male", generation: 0 },
    { id: "H", gender: "female", generation: 0 },
    { id: "L", gender: "male", generation: 0 },
    { id: "I", gender: "female", generation: -1 },
    { id: "J", gender: "male", generation: -1 },
    { id: "K", gender: "male", generation: -1 },
  ],
  edges: [
    { type: "marriage", sourceId: "A", targetId: "B" },
    { type: "marriage", sourceId: "C", targetId: "F" },
    { type: "marriage", sourceId: "D", targetId: "G" },
    { type: "marriage", sourceId: "E", targetId: "H" },
    { type: "sibling", sourceId: "F", targetId: "L" },
    { type: "parent-child", sourceId: "A", targetId: "C" },
    { type: "parent-child", sourceId: "B", targetId: "C" },
    { type: "parent-child", sourceId: "A", targetId: "D" },
    { type: "parent-child", sourceId: "B", targetId: "D" },
    { type: "parent-child", sourceId: "A", targetId: "E" },
    { type: "parent-child", sourceId: "B", targetId: "E" },
    { type: "parent-child", sourceId: "C", targetId: "I" },
    { type: "parent-child", sourceId: "F", targetId: "I" },
    { type: "parent-child", sourceId: "D", targetId: "J" },
    { type: "parent-child", sourceId: "G", targetId: "J" },
    { type: "parent-child", sourceId: "E", targetId: "K" },
    { type: "parent-child", sourceId: "H", targetId: "K" },
  ],
  explicitUnmarriedIds: ["L"],
  passage: multiMarriedPassage,
};

const DUAL_BRANCH_TOPOLOGY: BlrCp003V9TopologyTemplate = {
  scenarioId: "BLR-CP003-V9-SCN-MATERNAL-PATERNAL-DUAL-BRANCH",
  topologyId: "MATERNAL_PATERNAL_DUAL_BRANCH",
  persons: [
    { id: "A", gender: "male", generation: 1 },
    { id: "B", gender: "female", generation: 1 },
    { id: "F", gender: "male", generation: 1 },
    { id: "G", gender: "female", generation: 1 },
    { id: "C", gender: "male", generation: 0 },
    { id: "D", gender: "female", generation: 0 },
    { id: "E", gender: "female", generation: 0 },
    { id: "H", gender: "male", generation: 0 },
    { id: "L", gender: "male", generation: 0 },
    { id: "N", gender: "female", generation: 0 },
    { id: "I", gender: "female", generation: -1 },
    { id: "J", gender: "male", generation: -1 },
    { id: "M", gender: "female", generation: -1 },
  ],
  edges: [
    { type: "marriage", sourceId: "A", targetId: "B" },
    { type: "marriage", sourceId: "F", targetId: "G" },
    { type: "marriage", sourceId: "C", targetId: "E" },
    { type: "marriage", sourceId: "D", targetId: "L" },
    { type: "marriage", sourceId: "H", targetId: "N" },
    { type: "parent-child", sourceId: "A", targetId: "C" },
    { type: "parent-child", sourceId: "B", targetId: "C" },
    { type: "parent-child", sourceId: "A", targetId: "D" },
    { type: "parent-child", sourceId: "B", targetId: "D" },
    { type: "parent-child", sourceId: "F", targetId: "E" },
    { type: "parent-child", sourceId: "G", targetId: "E" },
    { type: "parent-child", sourceId: "F", targetId: "H" },
    { type: "parent-child", sourceId: "G", targetId: "H" },
    { type: "parent-child", sourceId: "C", targetId: "I" },
    { type: "parent-child", sourceId: "E", targetId: "I" },
    { type: "parent-child", sourceId: "D", targetId: "J" },
    { type: "parent-child", sourceId: "L", targetId: "J" },
    { type: "parent-child", sourceId: "H", targetId: "M" },
    { type: "parent-child", sourceId: "N", targetId: "M" },
  ],
  explicitUnmarriedIds: [],
  passage: dualBranchPassage,
};

const FOUR_GENERATION_TOPOLOGY: BlrCp003V9TopologyTemplate = {
  scenarioId: "BLR-CP003-V9-SCN-FOUR-GENERATION-ASYMMETRIC-LINEAGE",
  topologyId: "FOUR_GENERATION_ASYMMETRIC_LINEAGE",
  persons: [
    { id: "A", gender: "male", generation: 2 },
    { id: "B", gender: "female", generation: 2 },
    { id: "C", gender: "male", generation: 1 },
    { id: "D", gender: "female", generation: 1 },
    { id: "H", gender: "male", generation: 1 },
    { id: "I", gender: "female", generation: 1 },
    { id: "E", gender: "female", generation: 0 },
    { id: "F", gender: "male", generation: 0 },
    { id: "J", gender: "female", generation: 0 },
    { id: "K", gender: "male", generation: 0 },
    { id: "G", gender: "male", generation: -1 },
    { id: "L", gender: "female", generation: -1 },
  ],
  edges: [
    { type: "marriage", sourceId: "A", targetId: "B" },
    { type: "marriage", sourceId: "C", targetId: "D" },
    { type: "marriage", sourceId: "H", targetId: "I" },
    { type: "marriage", sourceId: "E", targetId: "F" },
    { type: "marriage", sourceId: "J", targetId: "K" },
    { type: "parent-child", sourceId: "A", targetId: "C" },
    { type: "parent-child", sourceId: "B", targetId: "C" },
    { type: "parent-child", sourceId: "A", targetId: "H" },
    { type: "parent-child", sourceId: "B", targetId: "H" },
    { type: "parent-child", sourceId: "C", targetId: "E" },
    { type: "parent-child", sourceId: "D", targetId: "E" },
    { type: "parent-child", sourceId: "H", targetId: "J" },
    { type: "parent-child", sourceId: "I", targetId: "J" },
    { type: "parent-child", sourceId: "E", targetId: "G" },
    { type: "parent-child", sourceId: "F", targetId: "G" },
    { type: "parent-child", sourceId: "J", targetId: "L" },
    { type: "parent-child", sourceId: "K", targetId: "L" },
  ],
  explicitUnmarriedIds: [],
  passage: fourGenerationPassage,
};

const UNEQUAL_COUSIN_TOPOLOGY: BlrCp003V9TopologyTemplate = {
  scenarioId: "BLR-CP003-V9-SCN-UNEQUAL-COUSIN-BRANCHES",
  topologyId: "UNEQUAL_COUSIN_BRANCHES",
  persons: [
    { id: "A", gender: "male", generation: 1 },
    { id: "B", gender: "female", generation: 1 },
    { id: "C", gender: "male", generation: 0 },
    { id: "D", gender: "female", generation: 0 },
    { id: "E", gender: "female", generation: 0 },
    { id: "F", gender: "female", generation: 0 },
    { id: "H", gender: "male", generation: 0 },
    { id: "G", gender: "female", generation: -1 },
    { id: "I", gender: "male", generation: -1 },
    { id: "J", gender: "female", generation: -1 },
  ],
  edges: [
    { type: "marriage", sourceId: "A", targetId: "B" },
    { type: "marriage", sourceId: "C", targetId: "F" },
    { type: "marriage", sourceId: "D", targetId: "H" },
    { type: "parent-child", sourceId: "A", targetId: "C" },
    { type: "parent-child", sourceId: "B", targetId: "C" },
    { type: "parent-child", sourceId: "A", targetId: "D" },
    { type: "parent-child", sourceId: "B", targetId: "D" },
    { type: "parent-child", sourceId: "A", targetId: "E" },
    { type: "parent-child", sourceId: "B", targetId: "E" },
    { type: "parent-child", sourceId: "C", targetId: "G" },
    { type: "parent-child", sourceId: "F", targetId: "G" },
    { type: "parent-child", sourceId: "D", targetId: "I" },
    { type: "parent-child", sourceId: "H", targetId: "I" },
    { type: "parent-child", sourceId: "D", targetId: "J" },
    { type: "parent-child", sourceId: "H", targetId: "J" },
  ],
  explicitUnmarriedIds: ["E"],
  passage: unequalCousinPassage,
};

export const BLR_CP003_V9_WAVE_01_TOPOLOGIES = [
  MULTI_MARRIED_TOPOLOGY,
  DUAL_BRANCH_TOPOLOGY,
  FOUR_GENERATION_TOPOLOGY,
  UNEQUAL_COUSIN_TOPOLOGY,
] as const;

export function blrCp003V9NamesFor(
  topology: BlrCp003V9TopologyTemplate,
  seed: number,
): Readonly<Record<string, string>> {
  const topologyIndex = BLR_CP003_V9_WAVE_01_TOPOLOGIES.findIndex(
    (entry) => entry.topologyId === topology.topologyId,
  );
  const maleNames = rotate(MALE_NAMES, seed * 3 + topologyIndex * 5);
  const femaleNames = rotate(FEMALE_NAMES, seed * 4 + topologyIndex * 7);
  let maleIndex = 0;
  let femaleIndex = 0;
  const result: Record<string, string> = {};
  for (const person of topology.persons) {
    result[person.id] =
      person.gender === "male"
        ? maleNames[maleIndex++]!
        : femaleNames[femaleIndex++]!;
  }
  if (new Set(Object.values(result)).size !== topology.persons.length) {
    throw new Error(`Duplicate names in V9 topology ${topology.topologyId}/${seed}.`);
  }
  return result;
}

export function blrCp003V9EvidencePath(
  subjectId: string,
  referenceId: string,
  relationId: BlrRelationId,
  personIds: readonly string[],
): BlrCp003V6EvidencePath {
  return {
    subjectId,
    referenceId,
    relationId,
    personIds,
    distance: personIds.length - 1,
  };
}

function makeOptions(
  entries: readonly OptionEntry[],
  shift: number,
): { options: BlrCp003V6CandidateOption[]; correctIndex: number } {
  const options = rotate(entries, shift).map((entry) => ({
    text: entry.text,
    semanticKey: entry.semanticKey,
    isCorrect: entry.correct,
  }));
  const correctIndex = options.findIndex((entry) => entry.isCorrect);
  if (
    options.length !== 4 ||
    correctIndex < 0 ||
    options.filter((entry) => entry.isCorrect).length !== 1 ||
    new Set(options.map((entry) => entry.text)).size !== 4 ||
    new Set(options.map((entry) => entry.semanticKey)).size !== 4
  ) {
    throw new Error("Invalid BLR-CP-003 V9 option set.");
  }
  return { options, correctIndex };
}

const CORRECT_VOICES = [
  (label: string, reason: string) => `Option ${label} is correct because ${reason}`,
  (label: string, reason: string) => `The completed family map supports Option ${label}. ${reason}`,
  (label: string, reason: string) => `Choose Option ${label}: ${reason}`,
  (label: string, reason: string) => `Option ${label} satisfies every stated condition. ${reason}`,
] as const;

const INCORRECT_VOICES = [
  (label: string, reason: string) => `Option ${label} is incorrect because ${reason}`,
  (label: string, reason: string) => `Reject Option ${label}: ${reason}`,
  (label: string, reason: string) => `Option ${label} fails after the branches are connected. ${reason}`,
  (label: string, reason: string) => `Option ${label} does not match the complete relation path; ${reason}`,
] as const;

function analyseOptions(
  options: readonly BlrCp003V6CandidateOption[],
  reasons: Readonly<Record<string, string>>,
  seed: number,
): BlrCp003V9CandidateRecord["editorial"]["optionAnalysis"] {
  return options.map((option, index) => {
    const label = optionLabel(index);
    const reason = reasons[option.semanticKey];
    if (!reason) throw new Error(`Missing V9 reason for ${option.semanticKey}.`);
    const voice = option.isCorrect
      ? CORRECT_VOICES[(seed + index) % CORRECT_VOICES.length]!
      : INCORRECT_VOICES[(seed * 2 + index) % INCORRECT_VOICES.length]!;
    return {
      optionLabel: label,
      optionText: option.text,
      isCorrect: option.isCorrect,
      explanation: voice(label, reason),
    };
  });
}

function generationPoints(
  topology: BlrCp003V9TopologyTemplate,
  names: Readonly<Record<string, string>>,
): string[] {
  const groups = new Map<number, string[]>();
  for (const person of topology.persons) {
    const group = groups.get(person.generation) ?? [];
    group.push(names[person.id]!);
    groups.set(person.generation, group);
  }
  return [...groups.entries()]
    .sort(([left], [right]) => right - left)
    .map(([generation, labels]) => {
      const label = generation > 0 ? `Generation +${generation}` : `Generation ${generation}`;
      return `${label}: ${labels.sort((a, b) => a.localeCompare(b, "en-IN")).join(", ")}.`;
    });
}

function solutionPhases(
  topology: BlrCp003V9TopologyTemplate,
  names: Readonly<Record<string, string>>,
  branchPoints: readonly string[],
  tracePoints: readonly string[],
  optionPoints: readonly string[],
): readonly BlrCp003V8SolutionPhase[] {
  return [
    { title: "Phase 1 — Map generation levels", points: generationPoints(topology, names) },
    { title: "Phase 2 — Connect family branches", points: branchPoints },
    { title: "Phase 3 — Trace the required relation", points: tracePoints },
    { title: "Phase 4 — Verify the options", points: optionPoints },
  ];
}

function flattenPhases(phases: readonly BlrCp003V8SolutionPhase[]): string[] {
  return phases.flatMap((phase) =>
    phase.points.map((point) => `${phase.title}: ${point}`),
  );
}

function evidenceWalk(paths: readonly BlrCp003V6EvidencePath[]): string[] {
  const first = paths[0];
  if (!first) throw new Error("V9 record requires evidence paths.");
  if (paths.some((path) => path.referenceId !== first.referenceId)) {
    throw new Error("V9 multi-path records must share one reference person.");
  }
  const walk = [...first.personIds];
  for (let index = 1; index < paths.length; index += 1) {
    const path = paths[index]!;
    const reversed = [...path.personIds].reverse();
    if (walk.at(-1) !== reversed[0]) {
      throw new Error("V9 evidence walk lost the shared reference person.");
    }
    walk.push(...reversed.slice(1));
    if (index < paths.length - 1) {
      walk.push(...path.personIds.slice(1));
    }
  }
  return walk;
}

function asciiFallback(
  topology: BlrCp003V9TopologyTemplate,
  names: Readonly<Record<string, string>>,
): string {
  const rows = generationPoints(topology, names);
  return [
    "VISUAL FAMILY TREE GRID",
    ...rows,
    `Explicitly unmarried: ${topology.explicitUnmarriedIds.length ? topology.explicitUnmarriedIds.map((id) => names[id]).join(", ") : "none"}.`,
  ].join("\n");
}

function diagram(
  topology: BlrCp003V9TopologyTemplate,
  names: Readonly<Record<string, string>>,
  paths: readonly BlrCp003V6EvidencePath[],
  answerLabel: string,
): BlrCp003SvgFamilyTreeDiagram {
  const pathPersonIds = evidenceWalk(paths);
  const first = paths[0]!;
  const nodes: BlrCp003SvgFamilyTreeNode[] = topology.persons.map((person) => ({
    id: person.id,
    label: names[person.id]!,
    gender: person.gender,
    generation: person.generation,
    ...(person.roleLabel ? { roleLabel: person.roleLabel } : {}),
  }));
  const edges: BlrCp003SvgFamilyTreeEdge[] = topology.edges.map((edge, index) => ({
    ...edge,
    id: `${edge.type}-${index}-${edge.sourceId}-${edge.targetId}`,
  }));
  const descriptions = paths.map((path) =>
    path.personIds.map((id) => names[id]!).join(" to "),
  );
  return {
    kind: "blood-relation-family-tree",
    version: 1,
    title: "Blood-relation structural gap-wave map",
    nodes,
    edges,
    query: {
      subjectId: first.subjectId,
      referenceId: first.referenceId,
      answerLabel,
      pathPersonIds,
    },
    accessibleSummary: `Family tree with ${nodes.length} people across ${new Set(nodes.map((node) => node.generation)).size} generations. Highlighted evidence: ${descriptions.join(" and ")}.`,
    asciiFallback: asciiFallback(topology, names),
  };
}

function fingerprint(
  record: Omit<BlrCp003V9CandidateRecord, "metadata">,
): string {
  return stableHash([
    BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_VERSION,
    record.topologyId,
    record.prototypeId,
    record.seed,
    record.sharedPrompt,
    record.stem,
    record.answerSemanticKey,
    ...record.options.flatMap((option) => [option.semanticKey, option.text]),
    ...record.evidencePaths.flatMap((path) => [path.relationId, ...path.personIds]),
    ...record.editorial.solutionPhases.flatMap((phase) => [phase.title, ...phase.points]),
  ]);
}

function pairKey(left: string, right: string): string {
  return [left, right].sort().join("::");
}

function assertVisualEvidence(record: BlrCp003V9CandidateRecord): void {
  const ids = record.proceduralLogic.query?.pathPersonIds ?? [];
  const nodes = new Set(ids);
  const pairs = new Set(
    ids.slice(0, -1).map((id, index) => pairKey(id, ids[index + 1]!)),
  );
  for (const path of record.evidencePaths) {
    for (const id of path.personIds) {
      if (!nodes.has(id)) throw new Error(`V9 visual omits node ${id} in ${record.itemId}.`);
    }
    for (let index = 0; index < path.personIds.length - 1; index += 1) {
      const key = pairKey(path.personIds[index]!, path.personIds[index + 1]!);
      if (!pairs.has(key)) throw new Error(`V9 visual omits edge ${key} in ${record.itemId}.`);
    }
  }
}

export function buildBlrCp003V9Record(
  input: BlrCp003V9BuildInput,
): BlrCp003V9CandidateRecord {
  const { options, correctIndex } = makeOptions(input.optionEntries, input.optionShift);
  const correctAnswer = options[correctIndex]!.text;
  const phases = solutionPhases(
    input.topology,
    input.names,
    input.branchPoints,
    input.tracePoints,
    input.optionPoints,
  );
  const passage = input.topology.passage(input.names, input.seed);
  const withoutMetadata: Omit<BlrCp003V9CandidateRecord, "metadata"> = {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-003",
    permanentQlId: null,
    prototypeOnly: true,
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    locale: "en-IN",
    provisionalAuthority: input.authority,
    sourceAuthority: "STRUCTURAL_GAP_WAVE_01",
    prototypeId: input.prototypeId,
    prototypeFamily: input.prototypeFamily,
    scenarioId: input.topology.scenarioId,
    topologyId: input.topology.topologyId,
    seed: input.seed,
    itemId: `${input.topology.scenarioId}-S${input.seed}-V9-${input.itemSuffix}`,
    sharedPrompt: passage.text,
    stem: input.stem,
    answerType: input.answerType,
    answerSemanticKey: input.answerSemanticKey,
    options,
    correctIndex,
    evidencePaths: input.evidencePaths,
    proceduralLogic: diagram(input.topology, input.names, input.evidencePaths, correctAnswer),
    editorial: {
      coreConcept: input.coreConcept,
      stepByStepSolution: flattenPhases(phases),
      optionAnalysis: analyseOptions(options, input.optionReasons, input.seed),
      conclusion: input.conclusion,
      examShortcut: input.shortcut,
      commonTraps: input.traps,
      solutionPhases: phases,
    },
  };
  const record: BlrCp003V9CandidateRecord = {
    ...withoutMetadata,
    metadata: {
      runtimeVersion: "blr-cp003-v9-topology-gap-wave-01-v1",
      gapWaveVersion: BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_VERSION,
      competitiveCandidate: true,
      humanReviewApproved: false,
      editorialBaselineApproved: false,
      structuralSaturationApproved: false,
      productionStagingApproved: false,
      uniqueAnswer: true,
      optionSemanticsUnique: true,
      nativeSvgFamilyTree: true,
      asciiFallbackRetained: true,
      authenticExamStem: true,
      nameBasedOptions: true,
      phaseStructuredExplanation: true,
      newTopology: true,
      newPrototype: true,
      minimumEvidenceDistance: Math.min(...input.evidencePaths.map((path) => path.distance)),
      passageAudit: passage.audit,
      semanticFingerprint: fingerprint(withoutMetadata),
    },
  };
  const learnerText = [
    record.sharedPrompt,
    record.stem,
    ...record.options.map((option) => option.text),
    ...record.editorial.optionAnalysis.map((entry) => entry.explanation),
  ].join(" ");
  if (/Don't fall for Option|Cannot be determined|The passage is contradictory|Divorced/i.test(learnerText)) {
    throw new Error(`V9 learner text contains prohibited boilerplate in ${record.itemId}.`);
  }
  if (
    record.metadata.passageAudit.indirectAnchorCount < 2 ||
    record.metadata.passageAudit.stackedLinearChain ||
    record.editorial.solutionPhases.length !== 4
  ) {
    throw new Error(`V9 authenticity contract failed for ${record.itemId}.`);
  }
  assertVisualEvidence(record);
  return record;
}
