import type {
  BlrGender,
  BlrRelationId,
  DirectRelationId,
  PrimitivePathStep,
} from "./types";

const DISPLAY_LABELS: Readonly<Record<BlrRelationId, string>> = {
  FATHER: "Father",
  MOTHER: "Mother",
  SON: "Son",
  DAUGHTER: "Daughter",
  BROTHER: "Brother",
  SISTER: "Sister",
  HUSBAND: "Husband",
  WIFE: "Wife",
  GRANDFATHER: "Grandfather",
  GRANDMOTHER: "Grandmother",
  GRANDSON: "Grandson",
  GRANDDAUGHTER: "Granddaughter",
  UNCLE: "Uncle",
  AUNT: "Aunt",
  NEPHEW: "Nephew",
  NIECE: "Niece",
  COUSIN: "Cousin",
  FATHER_IN_LAW: "Father-in-law",
  MOTHER_IN_LAW: "Mother-in-law",
  SON_IN_LAW: "Son-in-law",
  DAUGHTER_IN_LAW: "Daughter-in-law",
};

const DIRECT_SUBJECT_GENDER: Readonly<Record<DirectRelationId, "MALE" | "FEMALE">> = {
  FATHER: "MALE",
  MOTHER: "FEMALE",
  SON: "MALE",
  DAUGHTER: "FEMALE",
  BROTHER: "MALE",
  SISTER: "FEMALE",
  HUSBAND: "MALE",
  WIFE: "FEMALE",
};

export function relationLabel(relationId: BlrRelationId): string {
  return DISPLAY_LABELS[relationId];
}

export function directRelationSubjectGender(relationId: DirectRelationId): "MALE" | "FEMALE" {
  return DIRECT_SUBJECT_GENDER[relationId];
}

export function relationForPath(
  steps: readonly PrimitivePathStep[],
  subjectGender: BlrGender,
): BlrRelationId | null {
  const key = steps.join(">");
  if (subjectGender === "UNKNOWN" && key !== "PARENT>SIBLING>CHILD") return null;
  if (key === "CHILD") return subjectGender === "MALE" ? "FATHER" : "MOTHER";
  if (key === "PARENT") return subjectGender === "MALE" ? "SON" : "DAUGHTER";
  if (key === "SIBLING") return subjectGender === "MALE" ? "BROTHER" : "SISTER";
  if (key === "SPOUSE") return subjectGender === "MALE" ? "HUSBAND" : "WIFE";
  if (key === "CHILD>CHILD") return subjectGender === "MALE" ? "GRANDFATHER" : "GRANDMOTHER";
  if (key === "PARENT>PARENT") return subjectGender === "MALE" ? "GRANDSON" : "GRANDDAUGHTER";
  if (key === "SIBLING>CHILD") return subjectGender === "MALE" ? "UNCLE" : "AUNT";
  if (key === "PARENT>SIBLING") return subjectGender === "MALE" ? "NEPHEW" : "NIECE";
  if (key === "PARENT>SIBLING>CHILD") return "COUSIN";
  if (key === "CHILD>SPOUSE") return subjectGender === "MALE" ? "FATHER_IN_LAW" : "MOTHER_IN_LAW";
  if (key === "SPOUSE>PARENT") return subjectGender === "MALE" ? "SON_IN_LAW" : "DAUGHTER_IN_LAW";
  return null;
}

export function genderSwap(relationId: BlrRelationId): BlrRelationId | null {
  const swaps: Partial<Record<BlrRelationId, BlrRelationId>> = {
    FATHER: "MOTHER",
    MOTHER: "FATHER",
    SON: "DAUGHTER",
    DAUGHTER: "SON",
    BROTHER: "SISTER",
    SISTER: "BROTHER",
    HUSBAND: "WIFE",
    WIFE: "HUSBAND",
    GRANDFATHER: "GRANDMOTHER",
    GRANDMOTHER: "GRANDFATHER",
    GRANDSON: "GRANDDAUGHTER",
    GRANDDAUGHTER: "GRANDSON",
    UNCLE: "AUNT",
    AUNT: "UNCLE",
    NEPHEW: "NIECE",
    NIECE: "NEPHEW",
    FATHER_IN_LAW: "MOTHER_IN_LAW",
    MOTHER_IN_LAW: "FATHER_IN_LAW",
    SON_IN_LAW: "DAUGHTER_IN_LAW",
    DAUGHTER_IN_LAW: "SON_IN_LAW",
  };
  return swaps[relationId] ?? null;
}

export function defaultDistractorPool(relationId: BlrRelationId): readonly BlrRelationId[] {
  const pools: Partial<Record<BlrRelationId, readonly BlrRelationId[]>> = {
    FATHER: ["BROTHER", "GRANDFATHER", "SON", "FATHER_IN_LAW"],
    MOTHER: ["SISTER", "GRANDMOTHER", "DAUGHTER", "MOTHER_IN_LAW"],
    SON: ["BROTHER", "GRANDSON", "FATHER", "SON_IN_LAW"],
    DAUGHTER: ["SISTER", "GRANDDAUGHTER", "MOTHER", "DAUGHTER_IN_LAW"],
    BROTHER: ["SON", "FATHER", "UNCLE", "COUSIN"],
    SISTER: ["DAUGHTER", "MOTHER", "AUNT", "COUSIN"],
    HUSBAND: ["BROTHER", "FATHER", "SON_IN_LAW", "FATHER_IN_LAW"],
    WIFE: ["SISTER", "MOTHER", "DAUGHTER_IN_LAW", "MOTHER_IN_LAW"],
    GRANDFATHER: ["FATHER", "UNCLE", "GRANDSON", "FATHER_IN_LAW"],
    GRANDMOTHER: ["MOTHER", "AUNT", "GRANDDAUGHTER", "MOTHER_IN_LAW"],
    GRANDSON: ["SON", "NEPHEW", "GRANDFATHER", "SON_IN_LAW"],
    GRANDDAUGHTER: ["DAUGHTER", "NIECE", "GRANDMOTHER", "DAUGHTER_IN_LAW"],
    UNCLE: ["BROTHER", "FATHER", "NEPHEW", "FATHER_IN_LAW"],
    AUNT: ["SISTER", "MOTHER", "NIECE", "MOTHER_IN_LAW"],
    NEPHEW: ["SON", "BROTHER", "UNCLE", "COUSIN"],
    NIECE: ["DAUGHTER", "SISTER", "AUNT", "COUSIN"],
    COUSIN: ["BROTHER", "SISTER", "NEPHEW", "NIECE"],
    FATHER_IN_LAW: ["FATHER", "UNCLE", "SON_IN_LAW", "GRANDFATHER"],
    MOTHER_IN_LAW: ["MOTHER", "AUNT", "DAUGHTER_IN_LAW", "GRANDMOTHER"],
    SON_IN_LAW: ["SON", "NEPHEW", "FATHER_IN_LAW", "HUSBAND"],
    DAUGHTER_IN_LAW: ["DAUGHTER", "NIECE", "MOTHER_IN_LAW", "WIFE"],
  };
  return pools[relationId] ?? ["BROTHER", "SISTER", "FATHER", "MOTHER"];
}
