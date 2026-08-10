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

export const BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_VERSION =
  "BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_V1" as const;

export const BLR_CP003_V9_WAVE_02_SEEDS = [0, 1, 2, 3, 4, 5] as const;

export type BlrCp003V9Wave02Authority =
  | "SELECT_UNORDERED_FAMILY_PAIR"
  | "IDENTIFY_ALL_MEMBERS_BY_RELATION"
  | "IDENTIFY_MEMBER_BY_MARITAL_STATUS"
  | "IDENTIFY_MEMBER_WITH_UNRESOLVED_MARITAL_STATUS";

export type BlrCp003V9Wave02AnswerType =
  | "UNORDERED_PERSON_PAIR"
  | "PERSON_NAME_SET"
  | "PERSON_NAME";

export type BlrCp003V9Wave02TopologyId =
  | "UNSTATED_SPOUSE_SINGLE_PARENT_BRANCH"
  | "IN_LAW_GENERATION_BRIDGE"
  | "FOUR_SIBLING_NEGATIVE_STATUS_GRID";

export type BlrCp003V9Wave02BoundaryPolicy =
  | "EXPLICIT_UNMARRIED_ONLY"
  | "UNSTATED_SPOUSE_IS_UNKNOWN_NOT_UNMARRIED"
  | "MIXED_KNOWN_AND_UNKNOWN_STATUS";

export interface BlrCp003V9Wave02CandidateRecord {
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
  provisionalAuthority: BlrCp003V9Wave02Authority;
  sourceAuthority: "STRUCTURAL_GAP_WAVE_02";
  prototypeId: string;
  prototypeFamily: string;
  scenarioId: string;
  topologyId: BlrCp003V9Wave02TopologyId;
  seed: number;
  itemId: string;
  sharedPrompt: string;
  stem: string;
  answerType: BlrCp003V9Wave02AnswerType;
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
    runtimeVersion: "blr-cp003-v9-topology-gap-wave-02-v1";
    gapWaveVersion: typeof BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_VERSION;
    competitiveCandidate: true;
    humanReviewApproved: false;
    wave02StructuralStagingApproved: false;
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
    negativeClueSystem: true;
    negativeClueCount: number;
    unknownSpouseBoundaryIds: readonly string[];
    explicitUnmarriedIds: readonly string[];
    boundaryPolicy: BlrCp003V9Wave02BoundaryPolicy;
    unknownStatusInferenceForbidden: true;
    mixedRelationContract: boolean;
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

type PassageProfile = {
  text: string;
  audit: BlrCp003V8PassageAudit;
  negativeClueCount: number;
};

export type BlrCp003V9Wave02TopologyTemplate = {
  scenarioId: string;
  topologyId: BlrCp003V9Wave02TopologyId;
  persons: readonly PersonSpec[];
  edges: readonly EdgeSpec[];
  explicitUnmarriedIds: readonly string[];
  unknownSpouseBoundaryIds: readonly string[];
  boundaryPolicy: BlrCp003V9Wave02BoundaryPolicy;
  passage: (
    names: Readonly<Record<string, string>>,
    seed: number,
  ) => PassageProfile;
};

type OptionEntry = {
  text: string;
  semanticKey: string;
  correct: boolean;
};

export type BlrCp003V9Wave02BuildInput = {
  topology: BlrCp003V9Wave02TopologyTemplate;
  seed: number;
  names: Readonly<Record<string, string>>;
  authority: BlrCp003V9Wave02Authority;
  prototypeId: string;
  prototypeFamily: string;
  itemSuffix: string;
  stem: string;
  answerType: BlrCp003V9Wave02AnswerType;
  answerSemanticKey: string;
  optionEntries: readonly OptionEntry[];
  optionShift: number;
  evidencePaths: readonly BlrCp003V6EvidencePath[];
  mixedRelationContract: boolean;
  coreConcept: readonly string[];
  constraintPoints: readonly string[];
  tracePoints: readonly string[];
  optionPoints: readonly string[];
  optionReasons: Readonly<Record<string, string>>;
  conclusion: string;
  shortcut: string;
  traps: readonly string[];
};

const MALE_NAMES = [
  "Aman", "Bharat", "Charan", "Deepak", "Gagan", "Harjit",
  "Karan", "Manav", "Nitin", "Rohit", "Sahil", "Vikas",
  "Arjun", "Dev", "Ishaan", "Kabir", "Laksh", "Mohan",
  "Naveen", "Rajat", "Sameer", "Tarun", "Varun", "Yash",
] as const;

const FEMALE_NAMES = [
  "Asha", "Bhavna", "Divya", "Gurleen", "Isha", "Kavita",
  "Meena", "Neha", "Pooja", "Ritu", "Simran", "Tanya",
  "Anita", "Deepa", "Geeta", "Jasleen", "Komal", "Manya",
  "Navya", "Reena", "Sonia", "Trisha", "Vidhi", "Yamini",
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
  generationTransitionCount: number,
  indirectAnchorCount = 3,
): BlrCp003V8PassageAudit {
  return {
    clueOrderStrategy: "DISJOINT_NON_TOPOLOGICAL",
    indirectAnchorCount,
    generationTransitionCount,
    sentenceCount,
    directEdgeSentenceCount: 2,
    stackedLinearChain: false,
  };
}

function unstatedSpousePassage(
  n: Readonly<Record<string, string>>,
  seed: number,
): PassageProfile {
  const variants = [
    `${n.F} is neither the parent of ${n.I} nor of ${n.J}; he is explicitly unmarried. ${n.D} is the mother of ${n.J}, but no spouse is named for ${n.D}. ${n.C} is not the parent of ${n.J}. ${n.A} and ${n.B} are married and have three children, ${n.C}, ${n.D} and ${n.F}. ${n.C} is married to ${n.E}, and their daughter is ${n.I}.`,
    `${n.J}'s mother is ${n.D}, not ${n.E}; the passage does not state whether ${n.D} is married. ${n.F}, another child of ${n.A} and ${n.B}, is unmarried and is not a parent. ${n.I} is not the child of ${n.D}. ${n.A} is married to ${n.B}. Their son ${n.C} is married to ${n.E}, and ${n.I} is their daughter.`,
    `Among the three children of ${n.A} and ${n.B}, ${n.F} is the one who is unmarried. ${n.D} is not married to ${n.E}; she is the mother of ${n.J}, and her spouse is not identified. ${n.C} is not the parent of ${n.J}. ${n.A} and ${n.B} are married. ${n.C} and ${n.E} are married and have one daughter, ${n.I}.`,
  ] as const;
  return {
    text: `Study the following information. Treat an unnamed spouse as unknown, not as proof of being unmarried.\n\n${variants[seed % variants.length]!}`,
    audit: passageAudit(5, 3),
    negativeClueCount: 4,
  };
}

function inLawBridgePassage(
  n: Readonly<Record<string, string>>,
  seed: number,
): PassageProfile {
  const variants = [
    `${n.J} is not the child of ${n.C} or ${n.D}; he is the son of ${n.F} and ${n.G}. ${n.K} is neither ${n.I}'s sibling nor ${n.F}'s child; he is the son of ${n.D} and ${n.H}. ${n.C} and ${n.D} are siblings and are children of ${n.A} and ${n.B}. ${n.C} is married to ${n.E}, while ${n.D} is married to ${n.H}. ${n.E}'s sister ${n.F} is married to ${n.G}; ${n.C} and ${n.E} have a daughter, ${n.I}.`,
    `${n.K}'s father is ${n.D}, not ${n.E}. ${n.J}'s mother ${n.F} is not a child of ${n.A} and ${n.B}; she is ${n.E}'s sister. ${n.I} is neither the child of ${n.D} nor of ${n.F}. ${n.A} and ${n.B} are married and have ${n.C} and ${n.D}. ${n.C} is married to ${n.E}, ${n.D} to ${n.H}, and ${n.F} to ${n.G}. Their children are ${n.I}, ${n.K} and ${n.J}, respectively.`,
    `${n.F} is not the sister of ${n.C}; she is the sister of ${n.C}'s husband ${n.E}. ${n.J} is the son of ${n.F} and ${n.G}, not of ${n.C}. ${n.K} is not ${n.E}'s son; he is the son of ${n.D} and ${n.H}. ${n.A} and ${n.B} are parents of the siblings ${n.C} and ${n.D}. ${n.C} is married to ${n.E}; their daughter is ${n.I}. ${n.D} and ${n.H} are married.`,
  ] as const;
  return {
    text: `Study the following family information and use both blood and marriage links.\n\n${variants[seed % variants.length]!}`,
    audit: passageAudit(6, 3),
    negativeClueCount: 4,
  };
}

function fourSiblingGridPassage(
  n: Readonly<Record<string, string>>,
  seed: number,
): PassageProfile {
  const variants = [
    `${n.E} is neither a parent nor a spouse in the family; he is explicitly unmarried. ${n.F} is the mother of ${n.M}, but no spouse is named for ${n.F}. ${n.M} is not the sibling of ${n.K} or ${n.L}. ${n.A} and ${n.B} are married and have four children, ${n.C}, ${n.D}, ${n.E} and ${n.F}. ${n.C} is married to ${n.G} and has daughter ${n.K}; ${n.D} is married to ${n.H} and has son ${n.L}.`,
    `${n.M}'s mother is ${n.F}, not ${n.D}; ${n.F}'s marital status is not stated. ${n.E} is unmarried and is not the parent of any youngest-generation member. ${n.K} is not the child of ${n.D}, and ${n.L} is not the child of ${n.C}. ${n.A} is married to ${n.B}; their children are ${n.C}, ${n.D}, ${n.E} and ${n.F}. ${n.C}'s wife is ${n.G}, ${n.D}'s husband is ${n.H}, and their children are ${n.K} and ${n.L}, respectively.`,
    `Of ${n.C}, ${n.D}, ${n.E} and ${n.F}, only ${n.E} is explicitly unmarried. ${n.F} has daughter ${n.M}, but her spouse is not identified. ${n.M} is neither ${n.K}'s sibling nor ${n.L}'s sibling. ${n.A} and ${n.B} are married and are parents of the four adults. ${n.C} is married to ${n.G} and their daughter is ${n.K}. ${n.D} is married to ${n.H} and their son is ${n.L}.`,
  ] as const;
  return {
    text: `Study the following four-branch family information. Distinguish explicit unmarried status from an unstated spouse.\n\n${variants[seed % variants.length]!}`,
    audit: passageAudit(6, 3),
    negativeClueCount: 4,
  };
}

const UNSTATED_SPOUSE_TOPOLOGY: BlrCp003V9Wave02TopologyTemplate = {
  scenarioId: "BLR-CP003-V9-SCN-UNSTATED-SPOUSE-SINGLE-PARENT-BRANCH",
  topologyId: "UNSTATED_SPOUSE_SINGLE_PARENT_BRANCH",
  persons: [
    { id: "A", gender: "male", generation: 1 },
    { id: "B", gender: "female", generation: 1 },
    { id: "C", gender: "male", generation: 0 },
    { id: "D", gender: "female", generation: 0, roleLabel: "marital status unstated" },
    { id: "F", gender: "male", generation: 0, roleLabel: "explicitly unmarried" },
    { id: "E", gender: "female", generation: 0 },
    { id: "I", gender: "female", generation: -1 },
    { id: "J", gender: "male", generation: -1 },
  ],
  edges: [
    { type: "marriage", sourceId: "A", targetId: "B" },
    { type: "marriage", sourceId: "C", targetId: "E" },
    { type: "parent-child", sourceId: "A", targetId: "C" },
    { type: "parent-child", sourceId: "B", targetId: "C" },
    { type: "parent-child", sourceId: "A", targetId: "D" },
    { type: "parent-child", sourceId: "B", targetId: "D" },
    { type: "parent-child", sourceId: "A", targetId: "F" },
    { type: "parent-child", sourceId: "B", targetId: "F" },
    { type: "parent-child", sourceId: "C", targetId: "I" },
    { type: "parent-child", sourceId: "E", targetId: "I" },
    { type: "parent-child", sourceId: "D", targetId: "J" },
  ],
  explicitUnmarriedIds: ["F"],
  unknownSpouseBoundaryIds: ["D"],
  boundaryPolicy: "UNSTATED_SPOUSE_IS_UNKNOWN_NOT_UNMARRIED",
  passage: unstatedSpousePassage,
};

const IN_LAW_BRIDGE_TOPOLOGY: BlrCp003V9Wave02TopologyTemplate = {
  scenarioId: "BLR-CP003-V9-SCN-IN-LAW-GENERATION-BRIDGE",
  topologyId: "IN_LAW_GENERATION_BRIDGE",
  persons: [
    { id: "A", gender: "male", generation: 1 },
    { id: "B", gender: "female", generation: 1 },
    { id: "C", gender: "female", generation: 0 },
    { id: "D", gender: "male", generation: 0 },
    { id: "E", gender: "male", generation: 0 },
    { id: "F", gender: "female", generation: 0 },
    { id: "G", gender: "male", generation: 0 },
    { id: "H", gender: "female", generation: 0 },
    { id: "I", gender: "female", generation: -1 },
    { id: "J", gender: "male", generation: -1 },
    { id: "K", gender: "male", generation: -1 },
  ],
  edges: [
    { type: "marriage", sourceId: "A", targetId: "B" },
    { type: "marriage", sourceId: "C", targetId: "E" },
    { type: "marriage", sourceId: "D", targetId: "H" },
    { type: "marriage", sourceId: "F", targetId: "G" },
    { type: "sibling", sourceId: "E", targetId: "F" },
    { type: "parent-child", sourceId: "A", targetId: "C" },
    { type: "parent-child", sourceId: "B", targetId: "C" },
    { type: "parent-child", sourceId: "A", targetId: "D" },
    { type: "parent-child", sourceId: "B", targetId: "D" },
    { type: "parent-child", sourceId: "C", targetId: "I" },
    { type: "parent-child", sourceId: "E", targetId: "I" },
    { type: "parent-child", sourceId: "F", targetId: "J" },
    { type: "parent-child", sourceId: "G", targetId: "J" },
    { type: "parent-child", sourceId: "D", targetId: "K" },
    { type: "parent-child", sourceId: "H", targetId: "K" },
  ],
  explicitUnmarriedIds: [],
  unknownSpouseBoundaryIds: [],
  boundaryPolicy: "EXPLICIT_UNMARRIED_ONLY",
  passage: inLawBridgePassage,
};

const FOUR_SIBLING_GRID_TOPOLOGY: BlrCp003V9Wave02TopologyTemplate = {
  scenarioId: "BLR-CP003-V9-SCN-FOUR-SIBLING-NEGATIVE-STATUS-GRID",
  topologyId: "FOUR_SIBLING_NEGATIVE_STATUS_GRID",
  persons: [
    { id: "A", gender: "male", generation: 1 },
    { id: "B", gender: "female", generation: 1 },
    { id: "C", gender: "male", generation: 0 },
    { id: "D", gender: "female", generation: 0 },
    { id: "E", gender: "male", generation: 0, roleLabel: "explicitly unmarried" },
    { id: "F", gender: "female", generation: 0, roleLabel: "marital status unstated" },
    { id: "G", gender: "female", generation: 0 },
    { id: "H", gender: "male", generation: 0 },
    { id: "K", gender: "female", generation: -1 },
    { id: "L", gender: "male", generation: -1 },
    { id: "M", gender: "female", generation: -1 },
  ],
  edges: [
    { type: "marriage", sourceId: "A", targetId: "B" },
    { type: "marriage", sourceId: "C", targetId: "G" },
    { type: "marriage", sourceId: "D", targetId: "H" },
    { type: "parent-child", sourceId: "A", targetId: "C" },
    { type: "parent-child", sourceId: "B", targetId: "C" },
    { type: "parent-child", sourceId: "A", targetId: "D" },
    { type: "parent-child", sourceId: "B", targetId: "D" },
    { type: "parent-child", sourceId: "A", targetId: "E" },
    { type: "parent-child", sourceId: "B", targetId: "E" },
    { type: "parent-child", sourceId: "A", targetId: "F" },
    { type: "parent-child", sourceId: "B", targetId: "F" },
    { type: "parent-child", sourceId: "C", targetId: "K" },
    { type: "parent-child", sourceId: "G", targetId: "K" },
    { type: "parent-child", sourceId: "D", targetId: "L" },
    { type: "parent-child", sourceId: "H", targetId: "L" },
    { type: "parent-child", sourceId: "F", targetId: "M" },
  ],
  explicitUnmarriedIds: ["E"],
  unknownSpouseBoundaryIds: ["F"],
  boundaryPolicy: "MIXED_KNOWN_AND_UNKNOWN_STATUS",
  passage: fourSiblingGridPassage,
};

export const BLR_CP003_V9_WAVE_02_TOPOLOGIES = [
  UNSTATED_SPOUSE_TOPOLOGY,
  IN_LAW_BRIDGE_TOPOLOGY,
  FOUR_SIBLING_GRID_TOPOLOGY,
] as const;

export function blrCp003V9Wave02NamesFor(
  topology: BlrCp003V9Wave02TopologyTemplate,
  seed: number,
): Readonly<Record<string, string>> {
  const topologyIndex = BLR_CP003_V9_WAVE_02_TOPOLOGIES.findIndex(
    (entry) => entry.topologyId === topology.topologyId,
  );
  const maleNames = rotate(MALE_NAMES, seed * 4 + topologyIndex * 7);
  const femaleNames = rotate(FEMALE_NAMES, seed * 5 + topologyIndex * 9);
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
    throw new Error(`Duplicate names in V9 Wave 02 topology ${topology.topologyId}/${seed}.`);
  }
  return result;
}

export function blrCp003V9Wave02EvidencePath(
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
    throw new Error("Invalid BLR-CP-003 V9 Wave 02 option set.");
  }
  return { options, correctIndex };
}

const CORRECT_VOICES = [
  (label: string, reason: string) => `Option ${label} is correct because ${reason}`,
  (label: string, reason: string) => `The completed constraint map supports Option ${label}. ${reason}`,
  (label: string, reason: string) => `Choose Option ${label}: ${reason}`,
  (label: string, reason: string) => `Option ${label} satisfies the relation and boundary conditions. ${reason}`,
] as const;

const INCORRECT_VOICES = [
  (label: string, reason: string) => `Option ${label} is incorrect because ${reason}`,
  (label: string, reason: string) => `Reject Option ${label}: ${reason}`,
  (label: string, reason: string) => `Option ${label} fails one of the stated constraints. ${reason}`,
  (label: string, reason: string) => `Option ${label} does not survive the full elimination check; ${reason}`,
] as const;

function analyseOptions(
  options: readonly BlrCp003V6CandidateOption[],
  reasons: Readonly<Record<string, string>>,
  seed: number,
): BlrCp003V9Wave02CandidateRecord["editorial"]["optionAnalysis"] {
  return options.map((option, index) => {
    const label = optionLabel(index);
    const reason = reasons[option.semanticKey];
    if (!reason) throw new Error(`Missing V9 Wave 02 reason for ${option.semanticKey}.`);
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
  topology: BlrCp003V9Wave02TopologyTemplate,
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
  topology: BlrCp003V9Wave02TopologyTemplate,
  names: Readonly<Record<string, string>>,
  constraintPoints: readonly string[],
  tracePoints: readonly string[],
  optionPoints: readonly string[],
): readonly BlrCp003V8SolutionPhase[] {
  return [
    { title: "Phase 1 — Map generation levels", points: generationPoints(topology, names) },
    { title: "Phase 2 — Apply negative and status constraints", points: constraintPoints },
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
  if (!first) throw new Error("V9 Wave 02 record requires evidence paths.");
  if (paths.some((path) => path.referenceId !== first.referenceId)) {
    throw new Error("V9 Wave 02 multi-path records must share one reference person.");
  }
  const walk = [...first.personIds];
  for (let index = 1; index < paths.length; index += 1) {
    const path = paths[index]!;
    const reversed = [...path.personIds].reverse();
    if (walk.at(-1) !== reversed[0]) {
      throw new Error("V9 Wave 02 evidence walk lost the shared reference person.");
    }
    walk.push(...reversed.slice(1));
    if (index < paths.length - 1) {
      walk.push(...path.personIds.slice(1));
    }
  }
  return walk;
}

function asciiFallback(
  topology: BlrCp003V9Wave02TopologyTemplate,
  names: Readonly<Record<string, string>>,
): string {
  return [
    "VISUAL FAMILY TREE GRID — V9 WAVE 02",
    ...generationPoints(topology, names),
    `Explicitly unmarried: ${topology.explicitUnmarriedIds.length ? topology.explicitUnmarriedIds.map((id) => names[id]).join(", ") : "none"}.`,
    `Spouse boundary unresolved: ${topology.unknownSpouseBoundaryIds.length ? topology.unknownSpouseBoundaryIds.map((id) => names[id]).join(", ") : "none"}.`,
  ].join("\n");
}

function diagram(
  topology: BlrCp003V9Wave02TopologyTemplate,
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
    title: "Blood-relation negative and boundary gap-wave map",
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
  record: Omit<BlrCp003V9Wave02CandidateRecord, "metadata">,
  negativeClueCount: number,
  mixedRelationContract: boolean,
): string {
  return stableHash([
    BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_VERSION,
    record.topologyId,
    record.prototypeId,
    record.seed,
    record.sharedPrompt,
    record.stem,
    record.answerSemanticKey,
    negativeClueCount,
    mixedRelationContract ? 1 : 0,
    ...record.options.flatMap((option) => [option.semanticKey, option.text]),
    ...record.evidencePaths.flatMap((path) => [path.relationId, ...path.personIds]),
    ...record.editorial.solutionPhases.flatMap((phase) => [phase.title, ...phase.points]),
  ]);
}

function pairKey(left: string, right: string): string {
  return [left, right].sort().join("::");
}

function assertVisualEvidence(record: BlrCp003V9Wave02CandidateRecord): void {
  const ids = record.proceduralLogic.query?.pathPersonIds ?? [];
  const nodes = new Set(ids);
  const pairs = new Set(
    ids.slice(0, -1).map((id, index) => pairKey(id, ids[index + 1]!)),
  );
  for (const path of record.evidencePaths) {
    for (const id of path.personIds) {
      if (!nodes.has(id)) throw new Error(`V9 Wave 02 visual omits node ${id} in ${record.itemId}.`);
    }
    for (let index = 0; index < path.personIds.length - 1; index += 1) {
      const key = pairKey(path.personIds[index]!, path.personIds[index + 1]!);
      if (!pairs.has(key)) throw new Error(`V9 Wave 02 visual omits edge ${key} in ${record.itemId}.`);
    }
  }
}

function assertBoundaryText(
  topology: BlrCp003V9Wave02TopologyTemplate,
  names: Readonly<Record<string, string>>,
  prompt: string,
): void {
  for (const id of topology.explicitUnmarriedIds) {
    const name = names[id]!;
    if (!new RegExp(`${name}[^.]{0,80}unmarried|unmarried[^.]{0,80}${name}`, "i").test(prompt)) {
      throw new Error(`V9 Wave 02 passage does not explicitly establish ${name} as unmarried.`);
    }
  }
  for (const id of topology.unknownSpouseBoundaryIds) {
    const name = names[id]!;
    const pattern = new RegExp(
      `${name}[^.]{0,120}(?:spouse is not|spouse is not identified|marital status is not stated|does not state whether|no spouse is named|spouse is not named)|(?:no spouse is named|spouse is not identified|marital status is not stated|does not state whether)[^.]{0,120}${name}`,
      "i",
    );
    if (!pattern.test(prompt)) {
      throw new Error(`V9 Wave 02 passage does not preserve the unknown spouse boundary for ${name}.`);
    }
  }
}

export function buildBlrCp003V9Wave02Record(
  input: BlrCp003V9Wave02BuildInput,
): BlrCp003V9Wave02CandidateRecord {
  const { options, correctIndex } = makeOptions(input.optionEntries, input.optionShift);
  const correctAnswer = options[correctIndex]!.text;
  const phases = solutionPhases(
    input.topology,
    input.names,
    input.constraintPoints,
    input.tracePoints,
    input.optionPoints,
  );
  const passage = input.topology.passage(input.names, input.seed);
  assertBoundaryText(input.topology, input.names, passage.text);
  const withoutMetadata: Omit<BlrCp003V9Wave02CandidateRecord, "metadata"> = {
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
    sourceAuthority: "STRUCTURAL_GAP_WAVE_02",
    prototypeId: input.prototypeId,
    prototypeFamily: input.prototypeFamily,
    scenarioId: input.topology.scenarioId,
    topologyId: input.topology.topologyId,
    seed: input.seed,
    itemId: `${input.topology.scenarioId}-S${input.seed}-V9W2-${input.itemSuffix}`,
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
  const record: BlrCp003V9Wave02CandidateRecord = {
    ...withoutMetadata,
    metadata: {
      runtimeVersion: "blr-cp003-v9-topology-gap-wave-02-v1",
      gapWaveVersion: BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_VERSION,
      competitiveCandidate: true,
      humanReviewApproved: false,
      wave02StructuralStagingApproved: false,
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
      negativeClueSystem: true,
      negativeClueCount: passage.negativeClueCount,
      unknownSpouseBoundaryIds: input.topology.unknownSpouseBoundaryIds,
      explicitUnmarriedIds: input.topology.explicitUnmarriedIds,
      boundaryPolicy: input.topology.boundaryPolicy,
      unknownStatusInferenceForbidden: true,
      mixedRelationContract: input.mixedRelationContract,
      minimumEvidenceDistance: Math.min(...input.evidencePaths.map((path) => path.distance)),
      passageAudit: passage.audit,
      semanticFingerprint: fingerprint(
        withoutMetadata,
        passage.negativeClueCount,
        input.mixedRelationContract,
      ),
    },
  };
  const learnerText = [
    record.sharedPrompt,
    record.stem,
    ...record.options.map((option) => option.text),
    ...record.editorial.optionAnalysis.map((entry) => entry.explanation),
  ].join(" ");
  if (/Don't fall for Option|The passage is contradictory|Divorced/i.test(learnerText)) {
    throw new Error(`V9 Wave 02 learner text contains prohibited boilerplate in ${record.itemId}.`);
  }
  if (
    record.metadata.negativeClueCount < 3 ||
    record.metadata.passageAudit.indirectAnchorCount < 2 ||
    record.metadata.passageAudit.stackedLinearChain ||
    record.editorial.solutionPhases.length !== 4
  ) {
    throw new Error(`V9 Wave 02 authenticity contract failed for ${record.itemId}.`);
  }
  assertVisualEvidence(record);
  return record;
}
