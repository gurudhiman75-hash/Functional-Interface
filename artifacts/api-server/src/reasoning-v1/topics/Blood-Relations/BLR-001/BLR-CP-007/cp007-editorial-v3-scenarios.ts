import type {
  BlrCp006DirectRelation,
  BlrCp006Relation,
} from "../BLR-CP-006/cp006-model";
import type { BlrCp007PrototypeId } from "./cp007-model";

export interface BlrCp007V3DirectSpec {
  leftId: string;
  relationId: BlrCp006DirectRelation;
  rightId: string;
}

export interface BlrCp007V3Target {
  subjectId: string;
  relationId: BlrCp006Relation;
  referenceId: string;
}

export interface BlrCp007V3RelationTemplate {
  id: string;
  statements: readonly BlrCp007V3DirectSpec[];
  target: BlrCp007V3Target;
  topology: string;
}

export interface BlrCp007V3MissingPersonTemplate {
  id: string;
  clues: readonly BlrCp007V3DirectSpec[];
  blankStatement: BlrCp007V3DirectSpec;
  blankSide: "LEFT" | "RIGHT";
  target: BlrCp007V3Target;
  correctCandidate: "P" | "Q" | "R" | "S";
  topology: string;
}

const d = (
  leftId: string,
  relationId: BlrCp006DirectRelation,
  rightId: string,
): BlrCp007V3DirectSpec => ({ leftId, relationId, rightId });

const r = (
  id: string,
  statements: readonly BlrCp007V3DirectSpec[],
  subjectId: string,
  relationId: BlrCp006Relation,
  referenceId: string,
  topology: string,
): BlrCp007V3RelationTemplate => ({
  id,
  statements,
  target: { subjectId, relationId, referenceId },
  topology,
});

export const BLR_CP007_V3_DIRECT_FORWARD: readonly BlrCp007V3RelationTemplate[] = [
  r("DIRECT-FATHER", [d("A", "FATHER", "B")], "A", "FATHER", "B", "DIRECT-PARENT"),
  r("DIRECT-MOTHER", [d("C", "MOTHER", "D")], "C", "MOTHER", "D", "DIRECT-PARENT"),
  r("DIRECT-BROTHER", [d("E", "BROTHER", "F")], "E", "BROTHER", "F", "DIRECT-SIBLING"),
  r("DIRECT-SISTER", [d("G", "SISTER", "H")], "G", "SISTER", "H", "DIRECT-SIBLING"),
  r("DIRECT-HUSBAND", [d("J", "HUSBAND", "K")], "J", "HUSBAND", "K", "DIRECT-SPOUSE"),
  r("DIRECT-WIFE", [d("L", "WIFE", "M")], "L", "WIFE", "M", "DIRECT-SPOUSE"),
  r("DIRECT-SON", [d("N", "SON", "O")], "N", "SON", "O", "DIRECT-CHILD"),
  r("DIRECT-DAUGHTER", [d("U", "DAUGHTER", "V")], "U", "DAUGHTER", "V", "DIRECT-CHILD"),
] as const;

export const BLR_CP007_V3_DIRECT_REVERSE: readonly BlrCp007V3RelationTemplate[] = [
  r("REVERSE-FATHER", [d("B", "SON", "A")], "A", "FATHER", "B", "REVERSE-PARENT"),
  r("REVERSE-MOTHER", [d("D", "DAUGHTER", "C")], "C", "MOTHER", "D", "REVERSE-PARENT"),
  r("REVERSE-SON", [d("F", "FATHER", "E")], "E", "SON", "F", "REVERSE-CHILD"),
  r("REVERSE-DAUGHTER", [d("H", "MOTHER", "G")], "G", "DAUGHTER", "H", "REVERSE-CHILD"),
  r("REVERSE-HUSBAND", [d("K", "WIFE", "J")], "J", "HUSBAND", "K", "REVERSE-SPOUSE"),
  r("REVERSE-WIFE", [d("M", "HUSBAND", "L")], "L", "WIFE", "M", "REVERSE-SPOUSE"),
  r("REVERSE-PARENT", [d("N", "SON", "O")], "O", "PARENT", "N", "REVERSE-PARENT-NEUTRAL"),
  r("REVERSE-CHILD", [d("U", "MOTHER", "V")], "V", "CHILD", "U", "REVERSE-CHILD-NEUTRAL"),
] as const;

export const BLR_CP007_V3_TWO_LINK_FORWARD: readonly BlrCp007V3RelationTemplate[] = [
  r("TWO-GRANDFATHER", [d("A", "FATHER", "B"), d("B", "MOTHER", "C")], "A", "GRANDFATHER", "C", "TWO-GENERATION-DOWN"),
  r("TWO-GRANDMOTHER", [d("D", "MOTHER", "E"), d("E", "FATHER", "F")], "D", "GRANDMOTHER", "F", "TWO-GENERATION-DOWN"),
  r("TWO-GRANDSON", [d("G", "SON", "H"), d("H", "SON", "J")], "G", "GRANDSON", "J", "TWO-GENERATION-UP"),
  r("TWO-GRANDDAUGHTER", [d("K", "DAUGHTER", "L"), d("L", "DAUGHTER", "M")], "K", "GRANDDAUGHTER", "M", "TWO-GENERATION-UP"),
  r("TWO-UNCLE", [d("N", "BROTHER", "P"), d("P", "MOTHER", "Q")], "N", "UNCLE", "Q", "SIBLING-OF-PARENT"),
  r("TWO-AUNT", [d("R", "SISTER", "S"), d("S", "FATHER", "T")], "R", "AUNT", "T", "SIBLING-OF-PARENT"),
  r("TWO-NEPHEW", [d("U", "SON", "V"), d("V", "SISTER", "W")], "U", "NEPHEW", "W", "CHILD-OF-SIBLING"),
  r("TWO-NIECE", [d("X", "DAUGHTER", "Y"), d("Y", "BROTHER", "Z")], "X", "NIECE", "Z", "CHILD-OF-SIBLING"),
] as const;

export const BLR_CP007_V3_TWO_LINK_REVERSE: readonly BlrCp007V3RelationTemplate[] = [
  r("TWO-FATHER-IN-LAW", [d("A", "FATHER", "B"), d("B", "HUSBAND", "C")], "A", "FATHER_IN_LAW", "C", "PARENT-OF-SPOUSE"),
  r("TWO-MOTHER-IN-LAW", [d("D", "MOTHER", "E"), d("E", "WIFE", "F")], "D", "MOTHER_IN_LAW", "F", "PARENT-OF-SPOUSE"),
  r("TWO-SON-IN-LAW", [d("G", "HUSBAND", "H"), d("H", "DAUGHTER", "J")], "G", "SON_IN_LAW", "J", "SPOUSE-OF-CHILD"),
  r("TWO-DAUGHTER-IN-LAW", [d("K", "WIFE", "L"), d("L", "SON", "M")], "K", "DAUGHTER_IN_LAW", "M", "SPOUSE-OF-CHILD"),
  r("TWO-BROTHER-IN-LAW", [d("N", "BROTHER", "P"), d("P", "HUSBAND", "Q")], "N", "BROTHER_IN_LAW", "Q", "SIBLING-OF-SPOUSE"),
  r("TWO-SISTER-IN-LAW", [d("R", "SISTER", "S"), d("S", "WIFE", "T")], "R", "SISTER_IN_LAW", "T", "SIBLING-OF-SPOUSE"),
  r("TWO-GRANDPARENT", [d("V", "SON", "U"), d("W", "DAUGHTER", "V")], "U", "GRANDPARENT", "W", "TWO-GENERATION-NEUTRAL"),
  r("TWO-GRANDCHILD", [d("Y", "FATHER", "X"), d("Z", "MOTHER", "Y")], "X", "GRANDCHILD", "Z", "TWO-GENERATION-NEUTRAL"),
] as const;

export const BLR_CP007_V3_THREE_LINK: readonly BlrCp007V3RelationTemplate[] = [
  r("THREE-COUSIN-MALE", [d("A", "SON", "B"), d("B", "BROTHER", "C"), d("D", "DAUGHTER", "C")], "A", "COUSIN", "D", "COUSIN-PATH"),
  r("THREE-COUSIN-FEMALE", [d("E", "DAUGHTER", "F"), d("F", "SISTER", "G"), d("H", "SON", "G")], "E", "COUSIN", "H", "COUSIN-PATH"),
  r("THREE-UNCLE", [d("J", "BROTHER", "K"), d("K", "FATHER", "L"), d("L", "HUSBAND", "M")], "J", "UNCLE", "L", "UNCLE-WITH-AFFINAL-CONTEXT"),
  r("THREE-AUNT", [d("N", "SISTER", "P"), d("P", "MOTHER", "Q"), d("Q", "WIFE", "R")], "N", "AUNT", "Q", "AUNT-WITH-AFFINAL-CONTEXT"),
  r("THREE-NEPHEW", [d("S", "SON", "T"), d("T", "BROTHER", "U"), d("U", "HUSBAND", "V")], "S", "NEPHEW", "U", "NEPHEW-WITH-AFFINAL-CONTEXT"),
  r("THREE-NIECE", [d("W", "DAUGHTER", "X"), d("X", "SISTER", "Y"), d("Y", "WIFE", "Z")], "W", "NIECE", "Y", "NIECE-WITH-AFFINAL-CONTEXT"),
  r("THREE-BROTHER-IN-LAW", [d("A", "BROTHER", "B"), d("B", "WIFE", "C"), d("C", "MOTHER", "D")], "A", "BROTHER_IN_LAW", "C", "AFFINAL-WITH-CHILD-CONTEXT"),
  r("THREE-SISTER-IN-LAW", [d("E", "SISTER", "F"), d("F", "HUSBAND", "G"), d("G", "FATHER", "H")], "E", "SISTER_IN_LAW", "G", "AFFINAL-WITH-CHILD-CONTEXT"),
] as const;

export const BLR_CP007_V3_AFFINAL: readonly BlrCp007V3RelationTemplate[] = [
  r("AFFINAL-FATHER-IN-LAW", [d("A", "FATHER", "B"), d("B", "WIFE", "C")], "A", "FATHER_IN_LAW", "C", "PARENT-OF-SPOUSE"),
  r("AFFINAL-MOTHER-IN-LAW", [d("D", "MOTHER", "E"), d("E", "HUSBAND", "F")], "D", "MOTHER_IN_LAW", "F", "PARENT-OF-SPOUSE"),
  r("AFFINAL-SON-IN-LAW", [d("G", "HUSBAND", "H"), d("H", "DAUGHTER", "J")], "G", "SON_IN_LAW", "J", "SPOUSE-OF-CHILD"),
  r("AFFINAL-DAUGHTER-IN-LAW", [d("K", "WIFE", "L"), d("L", "SON", "M")], "K", "DAUGHTER_IN_LAW", "M", "SPOUSE-OF-CHILD"),
  r("AFFINAL-BROTHER-IN-LAW-A", [d("N", "BROTHER", "P"), d("P", "HUSBAND", "Q")], "N", "BROTHER_IN_LAW", "Q", "SIBLING-OF-SPOUSE"),
  r("AFFINAL-SISTER-IN-LAW-A", [d("R", "SISTER", "S"), d("S", "WIFE", "T")], "R", "SISTER_IN_LAW", "T", "SIBLING-OF-SPOUSE"),
  r("AFFINAL-BROTHER-IN-LAW-B", [d("U", "HUSBAND", "V"), d("V", "SISTER", "W")], "U", "BROTHER_IN_LAW", "W", "SPOUSE-OF-SIBLING"),
  r("AFFINAL-SISTER-IN-LAW-B", [d("X", "WIFE", "Y"), d("Y", "BROTHER", "Z")], "X", "SISTER_IN_LAW", "Z", "SPOUSE-OF-SIBLING"),
] as const;

const mp = (
  id: string,
  clues: readonly BlrCp007V3DirectSpec[],
  blankStatement: BlrCp007V3DirectSpec,
  blankSide: "LEFT" | "RIGHT",
  subjectId: string,
  relationId: BlrCp006Relation,
  referenceId: string,
  correctCandidate: "P" | "Q" | "R" | "S",
  topology: string,
): BlrCp007V3MissingPersonTemplate => ({
  id,
  clues,
  blankStatement,
  blankSide,
  target: { subjectId, relationId, referenceId },
  correctCandidate,
  topology,
});

export const BLR_CP007_V3_MISSING_PERSON_BASE: readonly BlrCp007V3MissingPersonTemplate[] = [
  mp(
    "MP-UNCLE-P",
    [d("P", "FATHER", "D"), d("Q", "BROTHER", "D"), d("R", "SISTER", "D"), d("S", "WIFE", "Q")],
    d("A", "BROTHER", "P"),
    "RIGHT",
    "A", "UNCLE", "D", "P", "CANDIDATE-PARENT-BRIDGE",
  ),
  mp(
    "MP-AUNT-Q",
    [d("Q", "MOTHER", "E"), d("P", "BROTHER", "E"), d("R", "SISTER", "E"), d("S", "HUSBAND", "R")],
    d("A", "SISTER", "Q"),
    "RIGHT",
    "A", "AUNT", "E", "Q", "CANDIDATE-PARENT-BRIDGE",
  ),
  mp(
    "MP-GRANDFATHER-R",
    [d("R", "FATHER", "F"), d("P", "BROTHER", "F"), d("Q", "SISTER", "F"), d("S", "WIFE", "P")],
    d("A", "FATHER", "R"),
    "RIGHT",
    "A", "GRANDFATHER", "F", "R", "CANDIDATE-GENERATION-BRIDGE",
  ),
  mp(
    "MP-GRANDMOTHER-S",
    [d("S", "MOTHER", "G"), d("P", "BROTHER", "G"), d("Q", "SISTER", "G"), d("R", "HUSBAND", "Q")],
    d("A", "MOTHER", "S"),
    "RIGHT",
    "A", "GRANDMOTHER", "G", "S", "CANDIDATE-GENERATION-BRIDGE",
  ),
  mp(
    "MP-FATHER-IN-LAW-P",
    [d("P", "WIFE", "H"), d("Q", "BROTHER", "H"), d("R", "MOTHER", "H"), d("S", "HUSBAND", "Q")],
    d("A", "FATHER", "P"),
    "RIGHT",
    "A", "FATHER_IN_LAW", "H", "P", "CANDIDATE-AFFINAL-BRIDGE",
  ),
  mp(
    "MP-MOTHER-IN-LAW-Q",
    [d("Q", "HUSBAND", "J"), d("P", "SISTER", "J"), d("R", "FATHER", "J"), d("S", "WIFE", "R")],
    d("A", "MOTHER", "Q"),
    "RIGHT",
    "A", "MOTHER_IN_LAW", "J", "Q", "CANDIDATE-AFFINAL-BRIDGE",
  ),
  mp(
    "MP-NEPHEW-R",
    [d("R", "SISTER", "K"), d("P", "FATHER", "K"), d("Q", "WIFE", "P"), d("S", "DAUGHTER", "Q")],
    d("A", "SON", "R"),
    "RIGHT",
    "A", "NEPHEW", "K", "R", "CANDIDATE-CHILD-BRIDGE",
  ),
  mp(
    "MP-NIECE-S",
    [d("S", "BROTHER", "L"), d("P", "MOTHER", "L"), d("Q", "HUSBAND", "P"), d("R", "SON", "Q")],
    d("A", "DAUGHTER", "S"),
    "RIGHT",
    "A", "NIECE", "L", "S", "CANDIDATE-CHILD-BRIDGE",
  ),
] as const;

export type BlrCp007V3TaskKind =
  | "SELECT_EXPRESSION"
  | "MISSING_TOKEN"
  | "MISSING_TOKEN_PAIR"
  | "MISSING_PERSON"
  | "SELECT_VALIDITY";

export interface BlrCp007V3PrototypePlan {
  prototypeId: BlrCp007PrototypeId;
  taskKind: BlrCp007V3TaskKind;
  templates: readonly BlrCp007V3RelationTemplate[];
  blankStatementIndex?: number;
  blankStatementIndices?: readonly [number, number];
  validityStatus?: "VALID" | "INVALID";
}

export const BLR_CP007_V3_PROTOTYPE_PLANS: readonly BlrCp007V3PrototypePlan[] = [
  { prototypeId: "BLR-CP007-PROT-SELECT-DIRECT-FORWARD", taskKind: "SELECT_EXPRESSION", templates: BLR_CP007_V3_DIRECT_FORWARD },
  { prototypeId: "BLR-CP007-PROT-SELECT-DIRECT-REVERSE", taskKind: "SELECT_EXPRESSION", templates: BLR_CP007_V3_DIRECT_REVERSE },
  { prototypeId: "BLR-CP007-PROT-SELECT-TWO-LINK-FORWARD", taskKind: "SELECT_EXPRESSION", templates: BLR_CP007_V3_TWO_LINK_FORWARD },
  { prototypeId: "BLR-CP007-PROT-SELECT-TWO-LINK-REVERSE", taskKind: "SELECT_EXPRESSION", templates: BLR_CP007_V3_TWO_LINK_REVERSE },
  { prototypeId: "BLR-CP007-PROT-SELECT-THREE-LINK", taskKind: "SELECT_EXPRESSION", templates: BLR_CP007_V3_THREE_LINK },
  { prototypeId: "BLR-CP007-PROT-SELECT-AFFINAL", taskKind: "SELECT_EXPRESSION", templates: BLR_CP007_V3_AFFINAL },
  { prototypeId: "BLR-CP007-PROT-MISSING-TOKEN-DIRECT", taskKind: "MISSING_TOKEN", templates: BLR_CP007_V3_DIRECT_FORWARD, blankStatementIndex: 0 },
  { prototypeId: "BLR-CP007-PROT-MISSING-TOKEN-REVERSE", taskKind: "MISSING_TOKEN", templates: BLR_CP007_V3_DIRECT_REVERSE, blankStatementIndex: 0 },
  { prototypeId: "BLR-CP007-PROT-MISSING-TOKEN-FIRST-LINK", taskKind: "MISSING_TOKEN", templates: BLR_CP007_V3_TWO_LINK_FORWARD, blankStatementIndex: 0 },
  { prototypeId: "BLR-CP007-PROT-MISSING-TOKEN-SECOND-LINK", taskKind: "MISSING_TOKEN", templates: BLR_CP007_V3_TWO_LINK_REVERSE, blankStatementIndex: 1 },
  { prototypeId: "BLR-CP007-PROT-MISSING-PAIR-TWO-LINK", taskKind: "MISSING_TOKEN_PAIR", templates: BLR_CP007_V3_TWO_LINK_FORWARD, blankStatementIndices: [0, 1] },
  { prototypeId: "BLR-CP007-PROT-MISSING-PAIR-THREE-LINK", taskKind: "MISSING_TOKEN_PAIR", templates: BLR_CP007_V3_THREE_LINK, blankStatementIndices: [0, 2] },
  { prototypeId: "BLR-CP007-PROT-MISSING-PAIR-AFFINAL", taskKind: "MISSING_TOKEN_PAIR", templates: BLR_CP007_V3_AFFINAL, blankStatementIndices: [0, 1] },
  { prototypeId: "BLR-CP007-PROT-MISSING-PERSON-DIRECT-LEFT", taskKind: "MISSING_PERSON", templates: BLR_CP007_V3_DIRECT_FORWARD },
  { prototypeId: "BLR-CP007-PROT-MISSING-PERSON-DIRECT-RIGHT", taskKind: "MISSING_PERSON", templates: BLR_CP007_V3_DIRECT_REVERSE },
  { prototypeId: "BLR-CP007-PROT-MISSING-PERSON-INTERNAL", taskKind: "MISSING_PERSON", templates: BLR_CP007_V3_TWO_LINK_FORWARD },
  { prototypeId: "BLR-CP007-PROT-MISSING-PERSON-ENDPOINT", taskKind: "MISSING_PERSON", templates: BLR_CP007_V3_TWO_LINK_REVERSE },
  { prototypeId: "BLR-CP007-PROT-VALIDITY-CORRECT-DIRECT", taskKind: "SELECT_VALIDITY", templates: BLR_CP007_V3_DIRECT_FORWARD, validityStatus: "VALID" },
  { prototypeId: "BLR-CP007-PROT-VALIDITY-INCORRECT-DIRECT", taskKind: "SELECT_VALIDITY", templates: BLR_CP007_V3_DIRECT_REVERSE, validityStatus: "INVALID" },
  { prototypeId: "BLR-CP007-PROT-VALIDITY-CORRECT-DERIVED", taskKind: "SELECT_VALIDITY", templates: BLR_CP007_V3_TWO_LINK_FORWARD, validityStatus: "VALID" },
  { prototypeId: "BLR-CP007-PROT-VALIDITY-INCORRECT-DERIVED", taskKind: "SELECT_VALIDITY", templates: BLR_CP007_V3_AFFINAL, validityStatus: "INVALID" },
] as const;
