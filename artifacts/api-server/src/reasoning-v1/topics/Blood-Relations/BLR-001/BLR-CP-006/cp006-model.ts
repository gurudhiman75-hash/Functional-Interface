
export const BLR_CP006_RUNTIME_VERSION = "blr-cp006-coded-decoding-v1" as const;
export const BLR_CP006_FREEZE_VERSION = "BLR_CP006_ENGLISH_DISCOVERY_FREEZE_V1" as const;

export type BlrCp006QlId =
  | "BLR-QL-026"
  | "BLR-QL-027"
  | "BLR-QL-028"
  | "BLR-QL-029"
  | "BLR-QL-030";

export type BlrCp006Authority =
  | "RESOLVE_CODED_RELATION"
  | "IDENTIFY_PERSON_FROM_CODED_GRAPH"
  | "DETERMINE_GENDER_FROM_CODED_GRAPH"
  | "SELECT_CODED_RELATION_PAIR"
  | "RESOLVE_CODED_FAMILY_SET_RELATION";

export type BlrCp006PrototypeId =
  | "BLR-CP006-PROT-DIRECT-FORWARD"
  | "BLR-CP006-PROT-DIRECT-REVERSE"
  | "BLR-CP006-PROT-TWO-LINK-FORWARD"
  | "BLR-CP006-PROT-TWO-LINK-REVERSE"
  | "BLR-CP006-PROT-THREE-LINK-FORWARD"
  | "BLR-CP006-PROT-THREE-LINK-REVERSE"
  | "BLR-CP006-PROT-INTERNAL-TO-ENDPOINT"
  | "BLR-CP006-PROT-ENDPOINT-TO-INTERNAL"
  | "BLR-CP006-PROT-MIXED-AFFINAL-ENDPOINT"
  | "BLR-CP006-PROT-IDENTIFY-DIRECT"
  | "BLR-CP006-PROT-IDENTIFY-DERIVED"
  | "BLR-CP006-PROT-GENDER-DIRECT"
  | "BLR-CP006-PROT-GENDER-DERIVED"
  | "BLR-CP006-PROT-PAIR-SIBLING"
  | "BLR-CP006-PROT-PAIR-SPOUSE"
  | "BLR-CP006-PROT-PAIR-PARENT-CHILD"
  | "BLR-CP006-PROT-FAMILY-SET-FORWARD"
  | "BLR-CP006-PROT-FAMILY-SET-REVERSE"
  | "BLR-CP006-PROT-FAMILY-SET-AFFINAL";

export type BlrCp006Gender = "MALE" | "FEMALE" | "UNKNOWN";

export type BlrCp006DirectRelation =
  | "FATHER"
  | "MOTHER"
  | "SON"
  | "DAUGHTER"
  | "BROTHER"
  | "SISTER"
  | "HUSBAND"
  | "WIFE";

export type BlrCp006Relation =
  | BlrCp006DirectRelation
  | "PARENT"
  | "CHILD"
  | "SIBLING"
  | "SPOUSE"
  | "GRANDFATHER"
  | "GRANDMOTHER"
  | "GRANDPARENT"
  | "GRANDSON"
  | "GRANDDAUGHTER"
  | "GRANDCHILD"
  | "UNCLE"
  | "AUNT"
  | "UNCLE_OR_AUNT"
  | "NEPHEW"
  | "NIECE"
  | "NEPHEW_OR_NIECE"
  | "COUSIN"
  | "FATHER_IN_LAW"
  | "MOTHER_IN_LAW"
  | "PARENT_IN_LAW"
  | "SON_IN_LAW"
  | "DAUGHTER_IN_LAW"
  | "CHILD_IN_LAW"
  | "BROTHER_IN_LAW"
  | "SISTER_IN_LAW"
  | "SIBLING_IN_LAW";

export interface BlrCp006CodeDefinition {
  token: string;
  relationId: BlrCp006DirectRelation;
}

export interface BlrCp006CodedStatement {
  leftId: string;
  token: string;
  rightId: string;
}

export interface BlrCp006Person {
  personId: string;
  label: string;
  gender: BlrCp006Gender;
}

export interface BlrCp006Graph {
  persons: readonly BlrCp006Person[];
  parents: readonly { parentId: string; childId: string }[];
  spouses: readonly { personAId: string; personBId: string }[];
  siblings: readonly { personAId: string; personBId: string }[];
}

export type BlrCp006Query =
  | {
      kind: "RELATION";
      subjectId: string;
      referenceId: string;
    }
  | {
      kind: "IDENTIFY_PERSON";
      referenceId: string;
      relationId: BlrCp006Relation;
      candidateIds: readonly string[];
    }
  | {
      kind: "GENDER";
      personId: string;
    }
  | {
      kind: "SELECT_PAIR";
      relationId: BlrCp006Relation;
      candidatePairs: readonly (readonly [string, string])[];
    };

export interface BlrCp006Scenario {
  scenarioId: string;
  topologyId: string;
  keyStyle: "SYMBOL" | "LETTER" | "NEUTRAL_WORD";
  codeKey: readonly BlrCp006CodeDefinition[];
  statements: readonly BlrCp006CodedStatement[];
  expressionLines: readonly string[];
  query: BlrCp006Query;
  authority: BlrCp006Authority;
  prototypeId: BlrCp006PrototypeId;
  qlId: BlrCp006QlId;
  stem: string;
  note?: string;
}

export interface BlrCp006Option {
  text: string;
  semanticKey: string;
  isCorrect: boolean;
  errorLabel?: string;
}

export interface BlrCp006FamilyTree {
  kind: "blood-relation-family-tree";
  version: 1;
  title: string;
  nodes: readonly {
    id: string;
    label: string;
    gender: "male" | "female" | "unknown";
    generation: number;
  }[];
  edges: readonly {
    id: string;
    type: "marriage" | "parent-child" | "sibling";
    sourceId: string;
    targetId: string;
  }[];
  query: {
    subjectId?: string;
    referenceId?: string;
    answerLabel: string;
    pathPersonIds: readonly string[];
  };
  accessibleSummary: string;
  asciiFallback: string;
}

export interface GeneratedBlrCp006Question {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-006";
  qlId: BlrCp006QlId;
  permanentQlId: BlrCp006QlId;
  solveAuthority: BlrCp006Authority;
  sourcePrototypeId: BlrCp006PrototypeId;
  prototypeOnly: false;
  reviewOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  questionBankEligible: false;
  mockTestEligible: false;
  locale: "en-IN";
  seed: number;
  itemId: string;
  scenarioId: string;
  topologyId: string;
  keyStyle: BlrCp006Scenario["keyStyle"];
  codeKey: readonly BlrCp006CodeDefinition[];
  codedStatements: readonly BlrCp006CodedStatement[];
  query: BlrCp006Query;
  sharedPrompt: string;
  stem: string;
  answerType: "RELATION_LABEL" | "PERSON_NAME" | "GENDER_LABEL" | "PERSON_PAIR";
  options: readonly BlrCp006Option[];
  correctIndex: number;
  answer: string;
  decodedStatements: readonly string[];
  graph: BlrCp006Graph;
  explanation: {
    coreConcept: readonly string[];
    decodingAudit: readonly string[];
    graphAudit: readonly string[];
    conclusion: string;
    examShortcut: string;
    commonTraps: readonly string[];
    optionAnalysis: readonly {
      optionLabel: "A" | "B" | "C" | "D";
      optionText: string;
      isCorrect: boolean;
      explanation: string;
    }[];
    familyTree: BlrCp006FamilyTree;
  };
  metadata: {
    runtimeVersion: typeof BLR_CP006_RUNTIME_VERSION;
    freezeVersion: typeof BLR_CP006_FREEZE_VERSION;
    completeKeyCoverage: true;
    everyStatementContributes: true;
    noArithmeticPrecedence: true;
    explicitGenderEvidence: true;
    nameBasedGenderAssumptions: 0;
    independentSolverAgreed: true;
    uniqueAnswer: true;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    semanticFingerprint: string;
  };
}

export const BLR_CP006_CONTRACTS = [
  {
    qlId: "BLR-QL-026",
    solveAuthority: "RESOLVE_CODED_RELATION",
    answerType: "RELATION_LABEL",
  },
  {
    qlId: "BLR-QL-027",
    solveAuthority: "IDENTIFY_PERSON_FROM_CODED_GRAPH",
    answerType: "PERSON_NAME",
  },
  {
    qlId: "BLR-QL-028",
    solveAuthority: "DETERMINE_GENDER_FROM_CODED_GRAPH",
    answerType: "GENDER_LABEL",
  },
  {
    qlId: "BLR-QL-029",
    solveAuthority: "SELECT_CODED_RELATION_PAIR",
    answerType: "PERSON_PAIR",
  },
  {
    qlId: "BLR-QL-030",
    solveAuthority: "RESOLVE_CODED_FAMILY_SET_RELATION",
    answerType: "RELATION_LABEL",
  },
] as const;

export function semanticFingerprint(parts: readonly (string | number)[]): string {
  const text = parts.join("¦");
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let index = 0; index < text.length; index += 1) {
    const code = text.charCodeAt(index);
    h1 ^= code;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= code + index;
    h2 = Math.imul(h2, 0x85ebca6b);
  }
  const left = (h1 >>> 0).toString(16).padStart(8, "0");
  const right = (h2 >>> 0).toString(16).padStart(8, "0");
  return `${left}${right}${right}${left}`;
}

export function relationDisplay(relationId: BlrCp006Relation): string {
  const values: Record<BlrCp006Relation, string> = {
    FATHER: "Father",
    MOTHER: "Mother",
    SON: "Son",
    DAUGHTER: "Daughter",
    BROTHER: "Brother",
    SISTER: "Sister",
    HUSBAND: "Husband",
    WIFE: "Wife",
    PARENT: "Parent",
    CHILD: "Child",
    SIBLING: "Sibling",
    SPOUSE: "Spouse",
    GRANDFATHER: "Grandfather",
    GRANDMOTHER: "Grandmother",
    GRANDPARENT: "Grandparent",
    GRANDSON: "Grandson",
    GRANDDAUGHTER: "Granddaughter",
    GRANDCHILD: "Grandchild",
    UNCLE: "Uncle",
    AUNT: "Aunt",
    UNCLE_OR_AUNT: "Uncle or Aunt",
    NEPHEW: "Nephew",
    NIECE: "Niece",
    NEPHEW_OR_NIECE: "Nephew or Niece",
    COUSIN: "Cousin",
    FATHER_IN_LAW: "Father-in-law",
    MOTHER_IN_LAW: "Mother-in-law",
    PARENT_IN_LAW: "Parent-in-law",
    SON_IN_LAW: "Son-in-law",
    DAUGHTER_IN_LAW: "Daughter-in-law",
    CHILD_IN_LAW: "Child-in-law",
    BROTHER_IN_LAW: "Brother-in-law",
    SISTER_IN_LAW: "Sister-in-law",
    SIBLING_IN_LAW: "Sibling-in-law",
  };
  return values[relationId];
}

export function directRelationSentence(
  left: string,
  relationId: BlrCp006DirectRelation,
  right: string,
): string {
  return `${left} is the ${relationDisplay(relationId).toLocaleLowerCase("en-IN")} of ${right}.`;
}

export function optionLabel(index: number): "A" | "B" | "C" | "D" {
  return ["A", "B", "C", "D"][index] as "A" | "B" | "C" | "D";
}

export function rotate<T>(values: readonly T[], amount: number): T[] {
  if (!values.length) return [];
  const offset = ((amount % values.length) + values.length) % values.length;
  return [...values.slice(offset), ...values.slice(0, offset)];
}
