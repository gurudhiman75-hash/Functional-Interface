import { solveRelationFromGraph } from "../foundation/graph-closure";
import { stableHash } from "../foundation/prng";
import type { BlrRelationId, FamilyGraph } from "../foundation/types";
import {
  blrCp003FinalGroupKey,
  generateBlrCp003FinalApprovedBank,
  type BlrCp003FinalApprovedRecord,
} from "../BLR-CP-003/cp003-final-approved-bank";

export const BLR_CP004_RUNTIME_VERSION = "blr-cp004-permanent-runtime-v1" as const;
export const BLR_CP004_FREEZE_VERSION = "BLR_CP004_ENGLISH_DISCOVERY_FREEZE_V1" as const;
export const BLR_CP004_APPROVAL_DATE = "2026-08-01" as const;
export const BLR_CP004_OWNER_DIRECTIVE =
  "APPROVED_CONTINUE_AND_FINISH_NEXT_CP" as const;

export type BlrCp004QlId =
  | "BLR-QL-013"
  | "BLR-QL-014"
  | "BLR-QL-015"
  | "BLR-QL-016"
  | "BLR-QL-017";

export type BlrCp004Authority =
  | "COUNT_MEMBERS_BY_FILTER"
  | "COUNT_RELATIVES_OF_REFERENCE"
  | "COUNT_RELATION_PAIRS"
  | "COUNT_GENERATIONS"
  | "SELECT_FAMILY_COMPOSITION_PROFILE";

export type BlrCp004SourcePrototypeId =
  | "BLR-CP004-PROT-COUNT-TOTAL-MEMBERS"
  | "BLR-CP004-PROT-COUNT-GENDER-MEMBERS"
  | "BLR-CP004-PROT-COUNT-MARITAL-STATUS-MEMBERS"
  | "BLR-CP004-PROT-COUNT-GENERATION-MEMBERS"
  | "BLR-CP004-PROT-COUNT-DIRECT-RELATIVES"
  | "BLR-CP004-PROT-COUNT-EXTENDED-RELATIVES"
  | "BLR-CP004-PROT-COUNT-SHARED-CHILDREN"
  | "BLR-CP004-PROT-COUNT-MARRIED-COUPLES"
  | "BLR-CP004-PROT-COUNT-SIBLING-PAIRS"
  | "BLR-CP004-PROT-COUNT-PARENT-CHILD-PAIRS"
  | "BLR-CP004-PROT-COUNT-COUSIN-PAIRS"
  | "BLR-CP004-PROT-COUNT-GENERATIONS"
  | "BLR-CP004-PROT-SELECT-COMPOSITION-PROFILE";

export type BlrCp004AnswerType = "NUMBER" | "COUNT_VECTOR";
export type BlrCp004Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface BlrCp004Option {
  text: string;
  semanticKey: string;
  isCorrect: boolean;
  errorLabel?:
    | "OFF_BY_ONE_LOW"
    | "OFF_BY_ONE_HIGH"
    | "COUNTED_WRONG_UNIVERSE"
    | "DOUBLE_COUNTED_PAIR"
    | "OMITTED_MATCH"
    | "WRONG_COMPONENT";
}

export interface BlrCp004Explanation {
  coreConcept: readonly string[];
  working: readonly string[];
  conclusion: string;
  examShortcut: string;
  optionAnalysis: readonly {
    optionLabel: "A" | "B" | "C" | "D";
    optionText: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  familyTree: BlrCp003FinalApprovedRecord["proceduralLogic"];
}

export interface GeneratedBlrCp004Question {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-004";
  qlId: BlrCp004QlId;
  permanentQlId: BlrCp004QlId;
  solveAuthority: BlrCp004Authority;
  sourcePrototypeId: BlrCp004SourcePrototypeId;
  prototypeOnly: false;
  reviewOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  questionBankEligible: false;
  mockTestEligible: false;
  locale: "en-IN";
  sourceGroupKey: string;
  sourceItemId: string;
  scenarioId: string;
  topologyId: string;
  seed: number;
  itemId: string;
  sharedPrompt: string;
  stem: string;
  answerType: BlrCp004AnswerType;
  options: readonly BlrCp004Option[];
  correctIndex: number;
  answer:
    | {
        kind: "NUMBER";
        value: number;
        countedMemberIds: readonly string[];
        countedPairKeys: readonly string[];
      }
    | {
        kind: "COUNT_VECTOR";
        value: readonly [number, number, number, number];
        labels: readonly ["males", "females", "married couples", "generations"];
      };
  explanation: BlrCp004Explanation;
  metadata: {
    runtimeVersion: typeof BLR_CP004_RUNTIME_VERSION;
    freezeVersion: typeof BLR_CP004_FREEZE_VERSION;
    approvalDate: typeof BLR_CP004_APPROVAL_DATE;
    approvedBy: "PROJECT_OWNER";
    ownerDirective: typeof BLR_CP004_OWNER_DIRECTIVE;
    structuralSaturationApproved: true;
    finalDiscoveryFreezeApproved: true;
    independentVerifierAgreed: true;
    explicitCountUniverse: true;
    uniqueAnswer: true;
    optionSemanticsUnique: true;
    difficulty: BlrCp004Difficulty;
    sourceFingerprint: string;
    semanticFingerprint: string;
  };
}

export interface BlrCp004PermanentContract {
  qlId: BlrCp004QlId;
  solveAuthority: BlrCp004Authority;
  answerType: BlrCp004AnswerType;
  sourcePrototypeIds: readonly BlrCp004SourcePrototypeId[];
  status: "ENGLISH_DISCOVERY_FROZEN";
  reviewOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  questionBankEligible: false;
  mockTestEligible: false;
}

export const BLR_CP004_PERMANENT_CONTRACTS: readonly BlrCp004PermanentContract[] = [
  {
    qlId: "BLR-QL-013",
    solveAuthority: "COUNT_MEMBERS_BY_FILTER",
    answerType: "NUMBER",
    sourcePrototypeIds: [
      "BLR-CP004-PROT-COUNT-TOTAL-MEMBERS",
      "BLR-CP004-PROT-COUNT-GENDER-MEMBERS",
      "BLR-CP004-PROT-COUNT-MARITAL-STATUS-MEMBERS",
      "BLR-CP004-PROT-COUNT-GENERATION-MEMBERS",
    ],
    status: "ENGLISH_DISCOVERY_FROZEN",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
  },
  {
    qlId: "BLR-QL-014",
    solveAuthority: "COUNT_RELATIVES_OF_REFERENCE",
    answerType: "NUMBER",
    sourcePrototypeIds: [
      "BLR-CP004-PROT-COUNT-DIRECT-RELATIVES",
      "BLR-CP004-PROT-COUNT-EXTENDED-RELATIVES",
      "BLR-CP004-PROT-COUNT-SHARED-CHILDREN",
    ],
    status: "ENGLISH_DISCOVERY_FROZEN",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
  },
  {
    qlId: "BLR-QL-015",
    solveAuthority: "COUNT_RELATION_PAIRS",
    answerType: "NUMBER",
    sourcePrototypeIds: [
      "BLR-CP004-PROT-COUNT-MARRIED-COUPLES",
      "BLR-CP004-PROT-COUNT-SIBLING-PAIRS",
      "BLR-CP004-PROT-COUNT-PARENT-CHILD-PAIRS",
      "BLR-CP004-PROT-COUNT-COUSIN-PAIRS",
    ],
    status: "ENGLISH_DISCOVERY_FROZEN",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
  },
  {
    qlId: "BLR-QL-016",
    solveAuthority: "COUNT_GENERATIONS",
    answerType: "NUMBER",
    sourcePrototypeIds: ["BLR-CP004-PROT-COUNT-GENERATIONS"],
    status: "ENGLISH_DISCOVERY_FROZEN",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
  },
  {
    qlId: "BLR-QL-017",
    solveAuthority: "SELECT_FAMILY_COMPOSITION_PROFILE",
    answerType: "COUNT_VECTOR",
    sourcePrototypeIds: ["BLR-CP004-PROT-SELECT-COMPOSITION-PROFILE"],
    status: "ENGLISH_DISCOVERY_FROZEN",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
  },
] as const;

const CONTRACT_BY_QL = new Map(
  BLR_CP004_PERMANENT_CONTRACTS.map((contract) => [contract.qlId, contract]),
);

const CONTRACT_BY_AUTHORITY = new Map(
  BLR_CP004_PERMANENT_CONTRACTS.map((contract) => [
    contract.solveAuthority,
    contract,
  ]),
);

const DIRECT_RELATIONS = new Set<BlrRelationId>([
  "FATHER",
  "MOTHER",
  "SON",
  "DAUGHTER",
  "BROTHER",
  "SISTER",
  "HUSBAND",
  "WIFE",
]);

const RELATION_PLURALS: Readonly<Record<BlrRelationId, string>> = {
  FATHER: "fathers",
  MOTHER: "mothers",
  SON: "sons",
  DAUGHTER: "daughters",
  BROTHER: "brothers",
  SISTER: "sisters",
  HUSBAND: "husbands",
  WIFE: "wives",
  GRANDFATHER: "grandfathers",
  GRANDMOTHER: "grandmothers",
  GRANDSON: "grandsons",
  GRANDDAUGHTER: "granddaughters",
  GREAT_GRANDFATHER: "great-grandfathers",
  GREAT_GRANDMOTHER: "great-grandmothers",
  GREAT_GRANDSON: "great-grandsons",
  GREAT_GRANDDAUGHTER: "great-granddaughters",
  UNCLE: "uncles",
  AUNT: "aunts",
  NEPHEW: "nephews",
  NIECE: "nieces",
  COUSIN: "cousins",
  FATHER_IN_LAW: "fathers-in-law",
  MOTHER_IN_LAW: "mothers-in-law",
  SON_IN_LAW: "sons-in-law",
  DAUGHTER_IN_LAW: "daughters-in-law",
  BROTHER_IN_LAW: "brothers-in-law",
  SISTER_IN_LAW: "sisters-in-law",
};

function positiveModulo(value: number, modulus: number): number {
  if (!Number.isFinite(value)) {
    throw new Error(`BLR-CP-004 seed must be finite; received ${value}.`);
  }
  return ((Math.trunc(value) % modulus) + modulus) % modulus;
}

function unorderedPairKey(left: string, right: string): string {
  return [left, right].sort().join("::");
}

function diagramGraph(
  record: BlrCp003FinalApprovedRecord,
): FamilyGraph {
  return {
    persons: record.proceduralLogic.nodes.map((node) => ({
      personId: node.id,
      name: node.label,
      gender:
        node.gender === "male"
          ? "MALE"
          : node.gender === "female"
            ? "FEMALE"
            : "UNKNOWN",
    })),
    parentEdges: record.proceduralLogic.edges
      .filter((edge) => edge.type === "parent-child")
      .map((edge) => ({ parentId: edge.sourceId, childId: edge.targetId })),
    spouseEdges: record.proceduralLogic.edges
      .filter((edge) => edge.type === "marriage")
      .map((edge) => ({ personAId: edge.sourceId, personBId: edge.targetId })),
    siblingEdges: record.proceduralLogic.edges
      .filter((edge) => edge.type === "sibling")
      .map((edge) => ({ personAId: edge.sourceId, personBId: edge.targetId })),
  };
}

function personLabel(
  record: BlrCp003FinalApprovedRecord,
  personId: string,
): string {
  return (
    record.proceduralLogic.nodes.find((node) => node.id === personId)?.label ??
    personId
  );
}

function rotate<T>(values: readonly T[], offset: number): T[] {
  const shift = positiveModulo(offset, values.length);
  return [...values.slice(shift), ...values.slice(0, shift)];
}

function optionLabel(index: number): "A" | "B" | "C" | "D" {
  return String.fromCharCode(65 + index) as "A" | "B" | "C" | "D";
}

function numericOptionValues(correct: number): number[] {
  const values = new Set<number>([correct]);
  for (const candidate of [
    Math.max(0, correct - 1),
    correct + 1,
    Math.max(0, correct - 2),
    correct + 2,
    correct + 3,
    0,
    1,
    2,
    3,
  ]) {
    values.add(candidate);
    if (values.size === 4) break;
  }
  if (values.size !== 4) throw new Error(`Unable to build options for count ${correct}.`);
  return [...values];
}

function numericOptions(
  correct: number,
  rotation: number,
): { options: BlrCp004Option[]; correctIndex: number } {
  const values = rotate(numericOptionValues(correct), rotation);
  const options = values.map((value) => ({
    text: String(value),
    semanticKey: `NUMBER:${value}`,
    isCorrect: value === correct,
    errorLabel:
      value === correct
        ? undefined
        : value === correct - 1
          ? ("OFF_BY_ONE_LOW" as const)
          : value === correct + 1
            ? ("OFF_BY_ONE_HIGH" as const)
            : value > correct
              ? ("DOUBLE_COUNTED_PAIR" as const)
              : ("OMITTED_MATCH" as const),
  }));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (
    options.length !== 4 ||
    correctIndex < 0 ||
    new Set(options.map((option) => option.semanticKey)).size !== 4 ||
    options.filter((option) => option.isCorrect).length !== 1
  ) {
    throw new Error("Invalid BLR-CP-004 numeric option set.");
  }
  return { options, correctIndex };
}

function vectorText(value: readonly [number, number, number, number]): string {
  return `${value[0]} males, ${value[1]} females, ${value[2]} married couples, ${value[3]} generations`;
}

function vectorOptions(
  correct: readonly [number, number, number, number],
  rotation: number,
): { options: BlrCp004Option[]; correctIndex: number } {
  const variants: [number, number, number, number][] = [
    [...correct],
    [correct[0] + 1, Math.max(0, correct[1] - 1), correct[2], correct[3]],
    [correct[0], correct[1], correct[2] + 1, correct[3]],
    [correct[0], correct[1], correct[2], correct[3] + 1],
  ];
  const unique = [...new Map(variants.map((value) => [value.join(":"), value])).values()];
  if (unique.length !== 4) throw new Error("Invalid BLR-CP-004 vector option set.");
  const values = rotate(unique, rotation);
  const correctKey = correct.join(":");
  const options = values.map((value) => ({
    text: vectorText(value),
    semanticKey: `COUNT_VECTOR:${value.join(":")}`,
    isCorrect: value.join(":") === correctKey,
    errorLabel:
      value.join(":") === correctKey ? undefined : ("WRONG_COMPONENT" as const),
  }));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  return { options, correctIndex };
}

function optionAnalysis(
  options: readonly BlrCp004Option[],
  correctExplanation: string,
  wrongExplanation: (option: BlrCp004Option) => string,
): BlrCp004Explanation["optionAnalysis"] {
  return options.map((option, index) => ({
    optionLabel: optionLabel(index),
    optionText: option.text,
    isCorrect: option.isCorrect,
    explanation: option.isCorrect
      ? `Option ${optionLabel(index)} is correct. ${correctExplanation}`
      : `Option ${optionLabel(index)} is incorrect. ${wrongExplanation(option)}`,
  }));
}

function difficultyFor(input: {
  nodeCount: number;
  evidenceCount: number;
  extended: boolean;
  vector: boolean;
}): BlrCp004Difficulty {
  const score =
    input.nodeCount + input.evidenceCount * 2 + (input.extended ? 4 : 0) +
    (input.vector ? 5 : 0);
  if (score >= 24) return "HARD";
  if (score >= 15) return "MEDIUM";
  return "EASY";
}

function buildNumberQuestion(input: {
  source: BlrCp003FinalApprovedRecord;
  groupIndex: number;
  slot: string;
  authority: Extract<BlrCp004Authority, Exclude<BlrCp004Authority, "SELECT_FAMILY_COMPOSITION_PROFILE">>;
  prototypeId: Exclude<BlrCp004SourcePrototypeId, "BLR-CP004-PROT-SELECT-COMPOSITION-PROFILE">;
  stem: string;
  value: number;
  countedMemberIds?: readonly string[];
  countedPairKeys?: readonly string[];
  coreConcept: readonly string[];
  working: readonly string[];
  conclusion: string;
  shortcut: string;
  extended?: boolean;
}): GeneratedBlrCp004Question {
  const contract = CONTRACT_BY_AUTHORITY.get(input.authority);
  if (!contract) throw new Error(`Missing CP-004 contract for ${input.authority}.`);
  const rotation = parseInt(
    stableHash([input.source.itemId, input.groupIndex, input.slot]),
    16,
  );
  const { options, correctIndex } = numericOptions(input.value, rotation);
  const countedMemberIds = [...(input.countedMemberIds ?? [])].sort();
  const countedPairKeys = [...(input.countedPairKeys ?? [])].sort();
  const answerNames = countedMemberIds.map((id) => personLabel(input.source, id));
  const sourceFingerprint = input.source.metadata.semanticFingerprint;
  const itemId = `BLR-CP004-${input.slot}-${stableHash([
    input.sourceGroupKey ?? blrCp003FinalGroupKey(input.source),
    input.groupIndex,
    input.prototypeId,
    input.stem,
  ])}`;
  const semanticFingerprint = stableHash([
    sourceFingerprint,
    BLR_CP004_RUNTIME_VERSION,
    contract.qlId,
    input.prototypeId,
    input.stem,
    input.value,
    ...countedMemberIds,
    ...countedPairKeys,
  ]);
  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-004",
    qlId: contract.qlId,
    permanentQlId: contract.qlId,
    solveAuthority: input.authority,
    sourcePrototypeId: input.prototypeId,
    prototypeOnly: false,
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    locale: "en-IN",
    sourceGroupKey: blrCp003FinalGroupKey(input.source),
    sourceItemId: input.source.itemId,
    scenarioId: input.source.scenarioId,
    topologyId: input.source.topologyId,
    seed: input.source.seed,
    itemId,
    sharedPrompt: input.source.sharedPrompt,
    stem: input.stem,
    answerType: "NUMBER",
    options,
    correctIndex,
    answer: {
      kind: "NUMBER",
      value: input.value,
      countedMemberIds,
      countedPairKeys,
    },
    explanation: {
      coreConcept: input.coreConcept,
      working: input.working,
      conclusion: input.conclusion,
      examShortcut: input.shortcut,
      optionAnalysis: optionAnalysis(
        options,
        `${input.value} is obtained from the explicitly defined counting universe.`,
        (option) =>
          `${option.text} results from omitting a valid match, adding a non-match or counting one unordered pair twice.`,
      ),
      familyTree: input.source.proceduralLogic,
    },
    metadata: {
      runtimeVersion: BLR_CP004_RUNTIME_VERSION,
      freezeVersion: BLR_CP004_FREEZE_VERSION,
      approvalDate: BLR_CP004_APPROVAL_DATE,
      approvedBy: "PROJECT_OWNER",
      ownerDirective: BLR_CP004_OWNER_DIRECTIVE,
      structuralSaturationApproved: true,
      finalDiscoveryFreezeApproved: true,
      independentVerifierAgreed: true,
      explicitCountUniverse: true,
      uniqueAnswer: true,
      optionSemanticsUnique: true,
      difficulty: difficultyFor({
        nodeCount: input.source.proceduralLogic.nodes.length,
        evidenceCount: Math.max(countedMemberIds.length, countedPairKeys.length, input.value),
        extended: input.extended ?? false,
        vector: false,
      }),
      sourceFingerprint,
      semanticFingerprint,
    },
  };
}

function buildVectorQuestion(input: {
  source: BlrCp003FinalApprovedRecord;
  groupIndex: number;
  value: readonly [number, number, number, number];
  working: readonly string[];
}): GeneratedBlrCp004Question {
  const contract = CONTRACT_BY_AUTHORITY.get("SELECT_FAMILY_COMPOSITION_PROFILE");
  if (!contract) throw new Error("Missing CP-004 composition contract.");
  const stem =
    "Which option correctly gives the numbers of males, females, married couples and generations, in that order?";
  const rotation = parseInt(
    stableHash([input.source.itemId, input.groupIndex, "PROFILE"]),
    16,
  );
  const { options, correctIndex } = vectorOptions(input.value, rotation);
  const sourceFingerprint = input.source.metadata.semanticFingerprint;
  const itemId = `BLR-CP004-PROFILE-${stableHash([
    blrCp003FinalGroupKey(input.source),
    input.groupIndex,
    stem,
  ])}`;
  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-004",
    qlId: contract.qlId,
    permanentQlId: contract.qlId,
    solveAuthority: contract.solveAuthority,
    sourcePrototypeId: "BLR-CP004-PROT-SELECT-COMPOSITION-PROFILE",
    prototypeOnly: false,
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    locale: "en-IN",
    sourceGroupKey: blrCp003FinalGroupKey(input.source),
    sourceItemId: input.source.itemId,
    scenarioId: input.source.scenarioId,
    topologyId: input.source.topologyId,
    seed: input.source.seed,
    itemId,
    sharedPrompt: input.source.sharedPrompt,
    stem,
    answerType: "COUNT_VECTOR",
    options,
    correctIndex,
    answer: {
      kind: "COUNT_VECTOR",
      value: input.value,
      labels: ["males", "females", "married couples", "generations"],
    },
    explanation: {
      coreConcept: [
        "A composition option is correct only when every component uses the same completed family graph.",
        "Count people, unordered marriage edges and occupied generation rows separately before comparing the tuple.",
      ],
      working: input.working,
      conclusion: `The composition profile is ${vectorText(input.value)}.`,
      examShortcut:
        "Write a four-box tally—male, female, couple, generation—and reject an option as soon as one box differs.",
      optionAnalysis: optionAnalysis(
        options,
        `All four components match: ${vectorText(input.value)}.`,
        () => "At least one component is inconsistent with the completed family map.",
      ),
      familyTree: input.source.proceduralLogic,
    },
    metadata: {
      runtimeVersion: BLR_CP004_RUNTIME_VERSION,
      freezeVersion: BLR_CP004_FREEZE_VERSION,
      approvalDate: BLR_CP004_APPROVAL_DATE,
      approvedBy: "PROJECT_OWNER",
      ownerDirective: BLR_CP004_OWNER_DIRECTIVE,
      structuralSaturationApproved: true,
      finalDiscoveryFreezeApproved: true,
      independentVerifierAgreed: true,
      explicitCountUniverse: true,
      uniqueAnswer: true,
      optionSemanticsUnique: true,
      difficulty: difficultyFor({
        nodeCount: input.source.proceduralLogic.nodes.length,
        evidenceCount: input.value.reduce((total, value) => total + value, 0),
        extended: true,
        vector: true,
      }),
      sourceFingerprint,
      semanticFingerprint: stableHash([
        sourceFingerprint,
        BLR_CP004_RUNTIME_VERSION,
        contract.qlId,
        ...input.value,
        stem,
      ]),
    },
  };
}

function uniqueGroupSources(): readonly BlrCp003FinalApprovedRecord[] {
  const groups = new Map<string, BlrCp003FinalApprovedRecord>();
  for (const record of generateBlrCp003FinalApprovedBank()) {
    const key = blrCp003FinalGroupKey(record);
    const existing = groups.get(key);
    if (!existing || record.itemId.localeCompare(existing.itemId, "en-IN") < 0) {
      groups.set(key, record);
    }
  }
  return [...groups.entries()]
    .sort(([left], [right]) => left.localeCompare(right, "en-IN"))
    .map(([, record]) => record);
}

function marriedIds(graph: FamilyGraph): Set<string> {
  return new Set(graph.spouseEdges.flatMap((edge) => [edge.personAId, edge.personBId]));
}

function generationGroups(record: BlrCp003FinalApprovedRecord): Map<number, string[]> {
  const groups = new Map<number, string[]>();
  for (const node of record.proceduralLogic.nodes) {
    const members = groups.get(node.generation) ?? [];
    members.push(node.id);
    groups.set(node.generation, members);
  }
  return groups;
}

function globalFilterQuestion(
  source: BlrCp003FinalApprovedRecord,
  groupIndex: number,
): GeneratedBlrCp004Question {
  const graph = diagramGraph(source);
  const nodes = source.proceduralLogic.nodes;
  const mode = groupIndex % 6;
  if (mode === 0) {
    const ids = nodes.map((node) => node.id);
    return buildNumberQuestion({
      source,
      groupIndex,
      slot: "MEMBER-TOTAL",
      authority: "COUNT_MEMBERS_BY_FILTER",
      prototypeId: "BLR-CP004-PROT-COUNT-TOTAL-MEMBERS",
      stem: "How many named members are there in the family?",
      value: ids.length,
      countedMemberIds: ids,
      coreConcept: [
        "The universe is the set of distinct named people in the passage.",
        "A person is counted once even if several clues mention that person.",
      ],
      working: [
        `Distinct named members: ${ids.map((id) => personLabel(source, id)).join(", ")}.`,
        `Total = ${ids.length}.`,
      ],
      conclusion: `The family has ${ids.length} named members.`,
      shortcut: "Tick each name once; do not count clue appearances.",
    });
  }
  if (mode === 1 || mode === 5) {
    const targetGender = groupIndex % 2 === 0 ? "male" : "female";
    const ids = nodes.filter((node) => node.gender === targetGender).map((node) => node.id);
    const noun = targetGender === "male" ? "male members" : "female members";
    return buildNumberQuestion({
      source,
      groupIndex,
      slot: `MEMBER-${targetGender.toUpperCase()}`,
      authority: "COUNT_MEMBERS_BY_FILTER",
      prototypeId: "BLR-CP004-PROT-COUNT-GENDER-MEMBERS",
      stem: `How many ${noun} are there in the family?`,
      value: ids.length,
      countedMemberIds: ids,
      coreConcept: [
        `Count only nodes whose established gender is ${targetGender}.`,
        "Marriage, parenthood or generation does not create an extra member.",
      ],
      working: [
        `${noun[0]!.toUpperCase()}${noun.slice(1)}: ${ids.map((id) => personLabel(source, id)).join(", ") || "none"}.`,
        `Count = ${ids.length}.`,
      ],
      conclusion: `There are ${ids.length} ${noun}.`,
      shortcut: `Mark every ${targetGender === "male" ? "M" : "F"} node before counting.`,
    });
  }
  if (mode === 2 || mode === 3) {
    const married = marriedIds(graph);
    const explicitUnmarried = nodes
      .filter((node) => /explicitly unmarried/i.test(node.roleLabel ?? ""))
      .map((node) => node.id);
    const unresolved = nodes
      .filter((node) => /marital status unstated/i.test(node.roleLabel ?? ""))
      .map((node) => node.id);
    const chooseExplicit = mode === 3 && explicitUnmarried.length > 0;
    const chooseUnresolved = mode === 3 && !chooseExplicit && unresolved.length > 0;
    const ids = chooseExplicit
      ? explicitUnmarried
      : chooseUnresolved
        ? unresolved
        : [...married];
    const label = chooseExplicit
      ? "explicitly unmarried members"
      : chooseUnresolved
        ? "members whose marital status is unstated"
        : "members with a named spouse";
    return buildNumberQuestion({
      source,
      groupIndex,
      slot: "MEMBER-STATUS",
      authority: "COUNT_MEMBERS_BY_FILTER",
      prototypeId: "BLR-CP004-PROT-COUNT-MARITAL-STATUS-MEMBERS",
      stem: `How many ${label} are there?`,
      value: ids.length,
      countedMemberIds: ids,
      coreConcept: [
        "Named spouse, explicit unmarried status and unstated marital status are different evidence states.",
        "Do not infer unmarried status merely because a spouse is not shown.",
      ],
      working: [
        `${label[0]!.toUpperCase()}${label.slice(1)}: ${ids.map((id) => personLabel(source, id)).join(", ") || "none"}.`,
        `Count = ${ids.length}.`,
      ],
      conclusion: `The required status count is ${ids.length}.`,
      shortcut: "Use only direct status evidence; keep unknown status separate.",
      extended: true,
    });
  }
  const groups = generationGroups(source);
  const generations = [...groups.keys()].sort((left, right) => right - left);
  const generation = generations[positiveModulo(groupIndex, generations.length)]!;
  const ids = groups.get(generation) ?? [];
  const position =
    generation === Math.max(...generations)
      ? "oldest"
      : generation === Math.min(...generations)
        ? "youngest"
        : `generation ${generation}`;
  return buildNumberQuestion({
    source,
    groupIndex,
    slot: "MEMBER-GENERATION",
    authority: "COUNT_MEMBERS_BY_FILTER",
    prototypeId: "BLR-CP004-PROT-COUNT-GENERATION-MEMBERS",
    stem: `How many members are in the ${position} generation?`,
    value: ids.length,
    countedMemberIds: ids,
    coreConcept: [
      "A spouse or sibling remains on the same generation row.",
      "Count the distinct people placed on the requested row.",
    ],
    working: [
      `${position[0]!.toUpperCase()}${position.slice(1)} generation: ${ids.map((id) => personLabel(source, id)).join(", ")}.`,
      `Count = ${ids.length}.`,
    ],
    conclusion: `The ${position} generation contains ${ids.length} members.`,
    shortcut: "Draw horizontal generation rows and count only the requested row.",
  });
}

type RelationCandidate = {
  referenceId: string;
  relationId: BlrRelationId;
  memberIds: string[];
};

function relationCandidates(
  source: BlrCp003FinalApprovedRecord,
): RelationCandidate[] {
  const graph = diagramGraph(source);
  const result: RelationCandidate[] = [];
  for (const reference of graph.persons) {
    const byRelation = new Map<BlrRelationId, string[]>();
    for (const subject of graph.persons) {
      if (subject.personId === reference.personId) continue;
      try {
        const relation = solveRelationFromGraph(
          graph,
          subject.personId,
          reference.personId,
        ).relationId;
        const ids = byRelation.get(relation) ?? [];
        ids.push(subject.personId);
        byRelation.set(relation, ids);
      } catch {
        // Unsupported or intentionally ambiguous paths are outside the count universe.
      }
    }
    for (const [relationId, memberIds] of byRelation.entries()) {
      if (memberIds.length > 0) {
        result.push({ referenceId: reference.personId, relationId, memberIds });
      }
    }
  }
  return result.sort((left, right) =>
    `${left.referenceId}:${left.relationId}`.localeCompare(
      `${right.referenceId}:${right.relationId}`,
      "en-IN",
    ),
  );
}

function relativeCountQuestion(
  source: BlrCp003FinalApprovedRecord,
  groupIndex: number,
  slotIndex: number,
): GeneratedBlrCp004Question {
  const candidates = relationCandidates(source);
  const wantDirect = (groupIndex + slotIndex) % 2 === 0;
  const preferred = candidates.filter((candidate) =>
    wantDirect
      ? DIRECT_RELATIONS.has(candidate.relationId)
      : !DIRECT_RELATIONS.has(candidate.relationId),
  );
  const pool = preferred.length ? preferred : candidates;
  if (!pool.length) throw new Error(`No relation count candidates for ${source.itemId}.`);
  const candidate = pool[positiveModulo(groupIndex * 7 + slotIndex * 11, pool.length)]!;
  const prototypeId: BlrCp004SourcePrototypeId = DIRECT_RELATIONS.has(
    candidate.relationId,
  )
    ? "BLR-CP004-PROT-COUNT-DIRECT-RELATIVES"
    : "BLR-CP004-PROT-COUNT-EXTENDED-RELATIVES";
  const relationText = RELATION_PLURALS[candidate.relationId];
  const referenceName = personLabel(source, candidate.referenceId);
  const names = candidate.memberIds.map((id) => personLabel(source, id));
  return buildNumberQuestion({
    source,
    groupIndex,
    slot: `RELATIVE-${slotIndex}-${candidate.relationId}`,
    authority: "COUNT_RELATIVES_OF_REFERENCE",
    prototypeId,
    stem: `How many ${relationText} of ${referenceName} are named in the family?`,
    value: candidate.memberIds.length,
    countedMemberIds: candidate.memberIds,
    coreConcept: [
      `Keep ${referenceName} fixed and test every other named person as the subject.`,
      `Count only people whose solved relation to ${referenceName} is ${candidate.relationId.toLocaleLowerCase("en-IN").replaceAll("_", " ")}.`,
    ],
    working: [
      `Matching members: ${names.join(", ")}.`,
      `Therefore, ${names.length} ${relationText} are named.`,
    ],
    conclusion: `${referenceName} has ${names.length} named ${relationText} in this family.`,
    shortcut: `Hold ${referenceName} fixed, scan the names once and make one tick per matching relation.`,
    extended: !DIRECT_RELATIONS.has(candidate.relationId),
  });
}

function sharedChildrenQuestion(
  source: BlrCp003FinalApprovedRecord,
  groupIndex: number,
): GeneratedBlrCp004Question | null {
  const graph = diagramGraph(source);
  const candidates = graph.spouseEdges
    .map((edge) => ({
      parents: [edge.personAId, edge.personBId] as const,
      children: graph.persons
        .filter((person) =>
          graph.parentEdges.some(
            (parentEdge) =>
              parentEdge.parentId === edge.personAId &&
              parentEdge.childId === person.personId,
          ) &&
          graph.parentEdges.some(
            (parentEdge) =>
              parentEdge.parentId === edge.personBId &&
              parentEdge.childId === person.personId,
          ),
        )
        .map((person) => person.personId),
    }))
    .filter((candidate) => candidate.children.length > 0);
  if (!candidates.length) return null;
  const candidate = candidates[positiveModulo(groupIndex, candidates.length)]!;
  const parentNames = candidate.parents.map((id) => personLabel(source, id));
  const childNames = candidate.children.map((id) => personLabel(source, id));
  return buildNumberQuestion({
    source,
    groupIndex,
    slot: "SHARED-CHILDREN",
    authority: "COUNT_RELATIVES_OF_REFERENCE",
    prototypeId: "BLR-CP004-PROT-COUNT-SHARED-CHILDREN",
    stem: `How many children of ${parentNames[0]} and ${parentNames[1]} are named in the family?`,
    value: candidate.children.length,
    countedMemberIds: candidate.children,
    coreConcept: [
      "The two named adults form the reference unit for this count.",
      "A child is included only when the displayed graph establishes the required parent links.",
    ],
    working: [
      `Children connected to the couple: ${childNames.join(", ")}.`,
      `Count = ${childNames.length}.`,
    ],
    conclusion: `${parentNames[0]} and ${parentNames[1]} have ${childNames.length} named children.`,
    shortcut: "Trace downward from the couple and count each child node once.",
    extended: true,
  });
}

function inferredSiblingPairKeys(graph: FamilyGraph): string[] {
  const keys = new Set(
    graph.siblingEdges.map((edge) =>
      unorderedPairKey(edge.personAId, edge.personBId),
    ),
  );
  const childrenByParent = new Map<string, string[]>();
  for (const edge of graph.parentEdges) {
    const children = childrenByParent.get(edge.parentId) ?? [];
    children.push(edge.childId);
    childrenByParent.set(edge.parentId, children);
  }
  for (const children of childrenByParent.values()) {
    const unique = [...new Set(children)];
    for (let left = 0; left < unique.length; left += 1) {
      for (let right = left + 1; right < unique.length; right += 1) {
        keys.add(unorderedPairKey(unique[left]!, unique[right]!));
      }
    }
  }
  return [...keys].sort();
}

function cousinPairKeys(graph: FamilyGraph): string[] {
  const keys = new Set<string>();
  for (let left = 0; left < graph.persons.length; left += 1) {
    for (let right = left + 1; right < graph.persons.length; right += 1) {
      const personA = graph.persons[left]!;
      const personB = graph.persons[right]!;
      try {
        const relation = solveRelationFromGraph(
          graph,
          personA.personId,
          personB.personId,
        ).relationId;
        if (relation === "COUSIN") {
          keys.add(unorderedPairKey(personA.personId, personB.personId));
        }
      } catch {
        // Non-resolvable pairs are not cousin pairs.
      }
    }
  }
  return [...keys].sort();
}

function pairCountQuestion(
  source: BlrCp003FinalApprovedRecord,
  groupIndex: number,
): GeneratedBlrCp004Question {
  const graph = diagramGraph(source);
  const mode = groupIndex % 4;
  let pairKeys: string[];
  let prototypeId: BlrCp004SourcePrototypeId;
  let noun: string;
  let rule: string;
  if (mode === 0) {
    pairKeys = [
      ...new Set(
        graph.spouseEdges.map((edge) =>
          unorderedPairKey(edge.personAId, edge.personBId),
        ),
      ),
    ].sort();
    prototypeId = "BLR-CP004-PROT-COUNT-MARRIED-COUPLES";
    noun = "married couples";
    rule = "Each undirected marriage edge represents one couple, not two ordered relations.";
  } else if (mode === 1) {
    pairKeys = inferredSiblingPairKeys(graph);
    prototypeId = "BLR-CP004-PROT-COUNT-SIBLING-PAIRS";
    noun = "sibling pairs";
    rule = "A sibling pair is unordered and is counted once even when both directions are true.";
  } else if (mode === 2) {
    pairKeys = [
      ...new Set(
        graph.parentEdges.map((edge) => `${edge.parentId}->${edge.childId}`),
      ),
    ].sort();
    prototypeId = "BLR-CP004-PROT-COUNT-PARENT-CHILD-PAIRS";
    noun = "parent-child links";
    rule = "Each displayed parent-to-child edge is one structural pair.";
  } else {
    pairKeys = cousinPairKeys(graph);
    prototypeId = "BLR-CP004-PROT-COUNT-COUSIN-PAIRS";
    noun = "cousin pairs";
    rule = "A cousin pair is unordered and must be supported by the solved family graph.";
  }
  const renderedPairs = pairKeys.map((key) =>
    key.includes("->")
      ? key
          .split("->")
          .map((id) => personLabel(source, id))
          .join(" → ")
      : key
          .split("::")
          .map((id) => personLabel(source, id))
          .join(" and "),
  );
  return buildNumberQuestion({
    source,
    groupIndex,
    slot: `PAIR-${mode}`,
    authority: "COUNT_RELATION_PAIRS",
    prototypeId: prototypeId as Exclude<
      BlrCp004SourcePrototypeId,
      "BLR-CP004-PROT-SELECT-COMPOSITION-PROFILE"
    >,
    stem: `How many ${noun} are present in the family?`,
    value: pairKeys.length,
    countedPairKeys: pairKeys,
    coreConcept: [
      rule,
      "Canonicalise every pair before counting so the same connection is not counted twice.",
    ],
    working: [
      `${noun[0]!.toUpperCase()}${noun.slice(1)}: ${renderedPairs.join("; ") || "none"}.`,
      `Count = ${pairKeys.length}.`,
    ],
    conclusion: `The family contains ${pairKeys.length} ${noun}.`,
    shortcut: "Write each pair in one fixed order and cross out duplicates before counting.",
    extended: mode === 3,
  });
}

function generationCountQuestion(
  source: BlrCp003FinalApprovedRecord,
  groupIndex: number,
): GeneratedBlrCp004Question {
  const groups = generationGroups(source);
  const generations = [...groups.keys()].sort((left, right) => right - left);
  const working = generations.map(
    (generation, index) =>
      `Row ${index + 1}: ${(groups.get(generation) ?? []).map((id) => personLabel(source, id)).join(", ")}.`,
  );
  return buildNumberQuestion({
    source,
    groupIndex,
    slot: "GENERATIONS",
    authority: "COUNT_GENERATIONS",
    prototypeId: "BLR-CP004-PROT-COUNT-GENERATIONS",
    stem: "How many generations are represented in the family?",
    value: generations.length,
    coreConcept: [
      "Generation count is the number of occupied horizontal levels, not the number of parent-child edges.",
      "Spouses and siblings remain on the same level.",
    ],
    working: [...working, `Occupied generation rows = ${generations.length}.`],
    conclusion: `The family spans ${generations.length} generations.`,
    shortcut: "Place everyone on horizontal rows; count the occupied rows once.",
  });
}

function compositionQuestion(
  source: BlrCp003FinalApprovedRecord,
  groupIndex: number,
): GeneratedBlrCp004Question {
  const graph = diagramGraph(source);
  const maleCount = graph.persons.filter((person) => person.gender === "MALE").length;
  const femaleCount = graph.persons.filter((person) => person.gender === "FEMALE").length;
  const coupleCount = new Set(
    graph.spouseEdges.map((edge) =>
      unorderedPairKey(edge.personAId, edge.personBId),
    ),
  ).size;
  const generationCount = generationGroups(source).size;
  return buildVectorQuestion({
    source,
    groupIndex,
    value: [maleCount, femaleCount, coupleCount, generationCount],
    working: [
      `Male members = ${maleCount}.`,
      `Female members = ${femaleCount}.`,
      `Undirected marriage edges = ${coupleCount}.`,
      `Occupied generation rows = ${generationCount}.`,
    ],
  });
}

function questionsForGroup(
  source: BlrCp003FinalApprovedRecord,
  groupIndex: number,
): GeneratedBlrCp004Question[] {
  const sharedChildren = sharedChildrenQuestion(source, groupIndex);
  return [
    globalFilterQuestion(source, groupIndex),
    relativeCountQuestion(source, groupIndex, 0),
    sharedChildren ?? relativeCountQuestion(source, groupIndex, 1),
    pairCountQuestion(source, groupIndex),
    generationCountQuestion(source, groupIndex),
    compositionQuestion(source, groupIndex),
  ];
}

let cachedBank: readonly GeneratedBlrCp004Question[] | null = null;

export function generateBlrCp004FrozenBank(): readonly GeneratedBlrCp004Question[] {
  if (cachedBank) return cachedBank;
  const records = uniqueGroupSources().flatMap(questionsForGroup);
  const ids = new Set<string>();
  const fingerprints = new Set<string>();
  for (const record of records) {
    const contract = CONTRACT_BY_QL.get(record.qlId);
    if (!contract || contract.solveAuthority !== record.solveAuthority) {
      throw new Error(`CP-004 contract mismatch for ${record.itemId}.`);
    }
    if (!contract.sourcePrototypeIds.includes(record.sourcePrototypeId)) {
      throw new Error(`CP-004 prototype ownership mismatch for ${record.itemId}.`);
    }
    if (ids.has(record.itemId)) throw new Error(`Duplicate CP-004 item id ${record.itemId}.`);
    if (fingerprints.has(record.metadata.semanticFingerprint)) {
      throw new Error(`Duplicate CP-004 fingerprint ${record.metadata.semanticFingerprint}.`);
    }
    ids.add(record.itemId);
    fingerprints.add(record.metadata.semanticFingerprint);
    if (
      record.prototypeOnly ||
      !record.reviewOnly ||
      record.publiclyPublishable ||
      record.questionStudioVisible ||
      record.questionBankEligible ||
      record.mockTestEligible ||
      !record.metadata.structuralSaturationApproved ||
      !record.metadata.finalDiscoveryFreezeApproved
    ) {
      throw new Error(`CP-004 release boundary failed for ${record.itemId}.`);
    }
  }
  cachedBank = records;
  return cachedBank;
}

export function getBlrCp004PermanentContract(
  qlId: BlrCp004QlId,
): BlrCp004PermanentContract {
  const contract = CONTRACT_BY_QL.get(qlId);
  if (!contract) throw new Error(`Unknown BLR-CP-004 QL '${qlId}'.`);
  return contract;
}

export function generateBlrCp004Question(
  qlId: BlrCp004QlId,
  seed: number,
): GeneratedBlrCp004Question {
  const pool = generateBlrCp004FrozenBank().filter(
    (question) => question.qlId === qlId,
  );
  if (!pool.length) throw new Error(`No BLR-CP-004 questions exist for ${qlId}.`);
  return pool[positiveModulo(seed, pool.length)]!;
}

export interface GeneratedBlrCp004QuestionGroup {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-004";
  groupId: string;
  permanentQlIds: readonly BlrCp004QlId[];
  prototypeOnly: false;
  reviewOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  questionBankEligible: false;
  mockTestEligible: false;
  locale: "en-IN";
  sourceGroupKey: string;
  sharedPrompt: string;
  questions: readonly GeneratedBlrCp004Question[];
  metadata: {
    runtimeVersion: typeof BLR_CP004_RUNTIME_VERSION;
    finalDiscoveryFreezeApproved: true;
    sharedPromptSolvedOnce: true;
    itemCount: number;
    semanticFingerprint: string;
  };
}

export function generateBlrCp004QuestionGroup(
  seed: number,
): GeneratedBlrCp004QuestionGroup {
  const groups = new Map<string, GeneratedBlrCp004Question[]>();
  for (const question of generateBlrCp004FrozenBank()) {
    const entries = groups.get(question.sourceGroupKey) ?? [];
    entries.push(question);
    groups.set(question.sourceGroupKey, entries);
  }
  const ordered = [...groups.entries()].sort(([left], [right]) =>
    left.localeCompare(right, "en-IN"),
  );
  const selected = ordered[positiveModulo(seed, ordered.length)];
  if (!selected) throw new Error("BLR-CP-004 group bank is empty.");
  const [sourceGroupKey, questions] = selected;
  const sortedQuestions = [...questions].sort((left, right) =>
    left.itemId.localeCompare(right.itemId, "en-IN"),
  );
  const sharedPrompt = sortedQuestions[0]?.sharedPrompt;
  if (!sharedPrompt || sortedQuestions.some((question) => question.sharedPrompt !== sharedPrompt)) {
    throw new Error(`Inconsistent BLR-CP-004 group ${sourceGroupKey}.`);
  }
  const permanentQlIds = [
    ...new Set(sortedQuestions.map((question) => question.qlId)),
  ];
  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-004",
    groupId: `BLR-CP004-GRP-${stableHash([sourceGroupKey])}`,
    permanentQlIds,
    prototypeOnly: false,
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    locale: "en-IN",
    sourceGroupKey,
    sharedPrompt,
    questions: sortedQuestions,
    metadata: {
      runtimeVersion: BLR_CP004_RUNTIME_VERSION,
      finalDiscoveryFreezeApproved: true,
      sharedPromptSolvedOnce: true,
      itemCount: sortedQuestions.length,
      semanticFingerprint: stableHash([
        BLR_CP004_RUNTIME_VERSION,
        sourceGroupKey,
        ...sortedQuestions.map((question) => question.metadata.semanticFingerprint),
      ]),
    },
  };
}

export function buildBlrCp004Telemetry(
  bank: readonly GeneratedBlrCp004Question[] = generateBlrCp004FrozenBank(),
) {
  const countBy = (values: readonly string[]) => {
    const counts: Record<string, number> = {};
    for (const value of values) counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  };
  const signatures = bank.map((question) =>
    `${question.sharedPrompt}\n${question.stem}`
      .toLocaleLowerCase("en-IN")
      .replace(/\s+/g, " ")
      .trim(),
  );
  return {
    recordCount: bank.length,
    groupCount: new Set(bank.map((question) => question.sourceGroupKey)).size,
    topologyCount: new Set(bank.map((question) => question.topologyId)).size,
    prototypeCount: new Set(bank.map((question) => question.sourcePrototypeId)).size,
    authorityCount: new Set(bank.map((question) => question.solveAuthority)).size,
    permanentQlCount: new Set(bank.map((question) => question.qlId)).size,
    answerPositions: [0, 1, 2, 3].map(
      (index) => bank.filter((question) => question.correctIndex === index).length,
    ),
    authorityCounts: countBy(bank.map((question) => question.solveAuthority)),
    prototypeCounts: countBy(bank.map((question) => question.sourcePrototypeId)),
    difficultyCounts: countBy(bank.map((question) => question.metadata.difficulty)),
    uniqueQuestionSignatureCount: new Set(signatures).size,
    questionSignatureUniquenessRatio: new Set(signatures).size / bank.length,
    zeroAnswerCount: bank.filter(
      (question) => question.answer.kind === "NUMBER" && question.answer.value === 0,
    ).length,
    nextAvailableChapterQlId: "BLR-QL-018" as const,
  } as const;
}
