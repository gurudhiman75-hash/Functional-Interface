import { stableHash } from "../foundation/prng";
import type { BlrRelationId, FamilyGraph } from "../foundation/types";
import type { BlrCp003FinalApprovedRecord } from "../BLR-CP-003/cp003-final-approved-bank";

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

export type BlrCp004PrototypeId =
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

export interface BlrCp004PermanentContract {
  qlId: BlrCp004QlId;
  solveAuthority: BlrCp004Authority;
  answerType: BlrCp004AnswerType;
  sourcePrototypeIds: readonly BlrCp004PrototypeId[];
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

export const BLR_CP004_DIRECT_RELATIONS = new Set<BlrRelationId>([
  "FATHER",
  "MOTHER",
  "SON",
  "DAUGHTER",
  "BROTHER",
  "SISTER",
  "HUSBAND",
  "WIFE",
]);

export const BLR_CP004_RELATION_PLURALS: Readonly<Record<BlrRelationId, string>> = {
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

export interface BlrCp004Option {
  text: string;
  semanticKey: string;
  isCorrect: boolean;
  errorLabel?: string;
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
  sourcePrototypeId: BlrCp004PrototypeId;
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

export function positiveModulo(value: number, modulus: number): number {
  if (!Number.isFinite(value)) throw new Error(`CP-004 seed must be finite: ${value}.`);
  return ((Math.trunc(value) % modulus) + modulus) % modulus;
}

export function unorderedPairKey(left: string, right: string): string {
  return [left, right].sort().join("::");
}

export function diagramGraph(record: BlrCp003FinalApprovedRecord): FamilyGraph {
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

export function personLabel(
  record: BlrCp003FinalApprovedRecord,
  personId: string,
): string {
  return record.proceduralLogic.nodes.find((node) => node.id === personId)?.label ?? personId;
}

export function optionLabel(index: number): "A" | "B" | "C" | "D" {
  return String.fromCharCode(65 + index) as "A" | "B" | "C" | "D";
}

function rotate<T>(values: readonly T[], offset: number): T[] {
  const shift = positiveModulo(offset, values.length);
  return [...values.slice(shift), ...values.slice(0, shift)];
}

export function numericOptions(
  correct: number,
  rotationKey: readonly (string | number)[],
): { options: BlrCp004Option[]; correctIndex: number } {
  const values = new Set<number>([correct]);
  for (const value of [
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
    values.add(value);
    if (values.size === 4) break;
  }
  const ordered = rotate([...values], parseInt(stableHash(rotationKey), 16));
  const options = ordered.map((value) => ({
    text: String(value),
    semanticKey: `NUMBER:${value}`,
    isCorrect: value === correct,
    errorLabel: value === correct ? undefined : "COUNT_MISCLASSIFICATION",
  }));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (options.length !== 4 || correctIndex < 0) throw new Error("Invalid numeric options.");
  return { options, correctIndex };
}

export function vectorText(value: readonly [number, number, number, number]): string {
  return `${value[0]} males, ${value[1]} females, ${value[2]} married couples, ${value[3]} generations`;
}

export function vectorOptions(
  correct: readonly [number, number, number, number],
  rotationKey: readonly (string | number)[],
): { options: BlrCp004Option[]; correctIndex: number } {
  const variants: [number, number, number, number][] = [
    [...correct],
    [correct[0] + 1, Math.max(0, correct[1] - 1), correct[2], correct[3]],
    [correct[0], correct[1], correct[2] + 1, correct[3]],
    [correct[0], correct[1], correct[2], correct[3] + 1],
  ];
  const ordered = rotate(variants, parseInt(stableHash(rotationKey), 16));
  const correctKey = correct.join(":");
  const options = ordered.map((value) => ({
    text: vectorText(value),
    semanticKey: `COUNT_VECTOR:${value.join(":")}`,
    isCorrect: value.join(":") === correctKey,
    errorLabel: value.join(":") === correctKey ? undefined : "WRONG_COMPONENT",
  }));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (new Set(options.map((option) => option.semanticKey)).size !== 4 || correctIndex < 0) {
    throw new Error("Invalid composition options.");
  }
  return { options, correctIndex };
}

export function difficultyFor(
  nodeCount: number,
  evidenceCount: number,
  advanced: boolean,
): BlrCp004Difficulty {
  const score = nodeCount + evidenceCount * 2 + (advanced ? 5 : 0);
  if (score >= 24) return "HARD";
  if (score >= 15) return "MEDIUM";
  return "EASY";
}

export function contractForAuthority(
  authority: BlrCp004Authority,
): BlrCp004PermanentContract {
  const contract = BLR_CP004_PERMANENT_CONTRACTS.find(
    (entry) => entry.solveAuthority === authority,
  );
  if (!contract) throw new Error(`Missing CP-004 contract for ${authority}.`);
  return contract;
}

export function contractForQl(qlId: BlrCp004QlId): BlrCp004PermanentContract {
  const contract = BLR_CP004_PERMANENT_CONTRACTS.find((entry) => entry.qlId === qlId);
  if (!contract) throw new Error(`Unknown BLR-CP-004 QL '${qlId}'.`);
  return contract;
}
