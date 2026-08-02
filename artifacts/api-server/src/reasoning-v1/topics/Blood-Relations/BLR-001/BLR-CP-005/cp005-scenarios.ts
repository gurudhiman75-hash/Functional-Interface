import {
  type BlrCp005Authority,
  type BlrCp005ModelSpace,
  type BlrCp005PrototypeId,
  type BlrCp005QuerySpec,
  personName,
} from "./cp005-model";
import {
  affinalRouteSpace,
  childGenderSpace,
  fixedSpouseOpenChildSpace,
  fixedTotalVariableGenderSpace,
  oldWomanSpace,
  optionalChildrenSpace,
  parentSideSpace,
  spouseIdentitySpace,
  threeWayRelationSpace,
} from "./cp005-spaces";

export interface BlrCp005PrototypeCase {
  prototypeId: BlrCp005PrototypeId;
  authority: BlrCp005Authority;
  build: (seed: number) => {
    modelSpace: BlrCp005ModelSpace;
    stem: string;
    querySpec: BlrCp005QuerySpec;
  };
}


export const BLR_CP005_PROTOTYPE_CASES: readonly BlrCp005PrototypeCase[] = [
  {
    prototypeId: "BLR-CP005-PROT-EXACT-RELATION-INVARIANT",
    authority: "RESOLVE_INVARIANT_RELATION",
    build: (seed) => {
      const modelSpace = childGenderSpace(seed);
      return { modelSpace, stem: `How is ${personName(modelSpace, "F")} related to ${personName(modelSpace, "C")}?`, querySpec: { kind: "INVARIANT_RELATION", subjectId: "F", referenceId: "C" } };
    },
  },
  {
    prototypeId: "BLR-CP005-PROT-GENDER-NEUTRAL-RELATION",
    authority: "RESOLVE_INVARIANT_RELATION",
    build: (seed) => {
      const modelSpace = childGenderSpace(seed);
      return { modelSpace, stem: `What gender-neutral relation of ${personName(modelSpace, "C")} to ${personName(modelSpace, "F")} is certain?`, querySpec: { kind: "INVARIANT_RELATION", subjectId: "C", referenceId: "F" } };
    },
  },
  {
    prototypeId: "BLR-CP005-PROT-BROAD-LINEAGE-RELATION",
    authority: "RESOLVE_INVARIANT_RELATION",
    build: (seed) => {
      const modelSpace = parentSideSpace(seed);
      return { modelSpace, stem: `How is ${personName(modelSpace, "U")} related to ${personName(modelSpace, "T")}, without assuming the parental side?`, querySpec: { kind: "INVARIANT_RELATION", subjectId: "U", referenceId: "T" } };
    },
  },
  {
    prototypeId: "BLR-CP005-PROT-BROAD-AFFINAL-RELATION",
    authority: "RESOLVE_INVARIANT_RELATION",
    build: (seed) => {
      const modelSpace = affinalRouteSpace(seed);
      return { modelSpace, stem: `Which relation of ${personName(modelSpace, "S")} to ${personName(modelSpace, "R")} remains the same in every valid structure?`, querySpec: { kind: "INVARIANT_RELATION", subjectId: "S", referenceId: "R" } };
    },
  },
  {
    prototypeId: "BLR-CP005-PROT-ONE-OF-TWO-RELATIONS",
    authority: "RESOLVE_RELATION_UNCERTAINTY",
    build: (seed) => {
      const modelSpace = oldWomanSpace(seed);
      return { modelSpace, stem: `What is the exact relation of ${personName(modelSpace, "O")} to ${personName(modelSpace, "A")}?`, querySpec: { kind: "RELATION_UNCERTAINTY", subjectId: "O", referenceId: "A", mode: "ONE_OF_TWO" } };
    },
  },
  {
    prototypeId: "BLR-CP005-PROT-RELATION-CANNOT-BE-DETERMINED",
    authority: "RESOLVE_RELATION_UNCERTAINTY",
    build: (seed) => {
      const modelSpace = threeWayRelationSpace(seed);
      return { modelSpace, stem: `How is ${personName(modelSpace, "S")} related to ${personName(modelSpace, "R")}?`, querySpec: { kind: "RELATION_UNCERTAINTY", subjectId: "S", referenceId: "R", mode: "INDETERMINATE" } };
    },
  },
  ...([
    ["BLR-CP005-PROT-SELECT-DEFINITE-CLAIM", "DEFINITE", "Which statement is definitely true in every valid family model?"],
    ["BLR-CP005-PROT-SELECT-POSSIBLE-CLAIM", "POSSIBLE", "Which statement is possible but not definite?"],
    ["BLR-CP005-PROT-SELECT-IMPOSSIBLE-CLAIM", "IMPOSSIBLE", "Which statement is impossible?"],
    ["BLR-CP005-PROT-SELECT-INVARIANT-FACT", "DEFINITE", "Which fact remains invariant when the child's gender is varied?"],
  ] as const).map(([prototypeId, requestedStatus, stem]): BlrCp005PrototypeCase => ({
    prototypeId,
    authority: "SELECT_CLAIM_BY_MODEL_STATUS",
    build: (seed) => {
      const modelSpace = childGenderSpace(seed);
      const child = personName(modelSpace, "C");
      const father = personName(modelSpace, "F");
      return {
        modelSpace,
        stem,
        querySpec: {
          kind: "CLAIM_STATUS",
          requestedStatus,
          claims: requestedStatus === "POSSIBLE"
            ? [
                { claimId: "CHILD", text: `${child} is a child of ${father}.`, predicate: { kind: "RELATION", subjectId: "C", referenceId: "F", relationId: "CHILD" } },
                { claimId: "SON", text: `${child} is the son of ${father}.`, predicate: { kind: "RELATION", subjectId: "C", referenceId: "F", relationId: "SON" } },
                { claimId: "BROTHER", text: `${child} is the brother of ${father}.`, predicate: { kind: "RELATION", subjectId: "C", referenceId: "F", relationId: "BROTHER" } },
                { claimId: "FATHER", text: `${child} is the father of ${father}.`, predicate: { kind: "RELATION", subjectId: "C", referenceId: "F", relationId: "FATHER" } },
              ]
            : [
                { claimId: "CHILD", text: `${child} is a child of ${father}.`, predicate: { kind: "RELATION", subjectId: "C", referenceId: "F", relationId: "CHILD" } },
                { claimId: "SON", text: `${child} is the son of ${father}.`, predicate: { kind: "RELATION", subjectId: "C", referenceId: "F", relationId: "SON" } },
                { claimId: "DAUGHTER", text: `${child} is the daughter of ${father}.`, predicate: { kind: "RELATION", subjectId: "C", referenceId: "F", relationId: "DAUGHTER" } },
                { claimId: "BROTHER", text: `${child} is the brother of ${father}.`, predicate: { kind: "RELATION", subjectId: "C", referenceId: "F", relationId: "BROTHER" } },
              ],
        },
      };
    },
  })),
  {
    prototypeId: "BLR-CP005-PROT-SELECT-UNSUPPORTED-EXACT-RELATION",
    authority: "SELECT_CLAIM_BY_MODEL_STATUS",
    build: (seed) => {
      const modelSpace = parentSideSpace(seed);
      const uncle = personName(modelSpace, "U");
      const child = personName(modelSpace, "T");
      return {
        modelSpace,
        stem: "Which exact claim is unsupported by every valid model?",
        querySpec: {
          kind: "CLAIM_STATUS", requestedStatus: "IMPOSSIBLE",
          claims: [
            { claimId: "PATERNAL", text: `${uncle} is the paternal uncle of ${child}.`, predicate: { kind: "SIDE_RELATION", subjectId: "U", referenceId: "T", relationId: "UNCLE", lineageSide: "PATERNAL" } },
            { claimId: "MATERNAL", text: `${uncle} is the maternal uncle of ${child}.`, predicate: { kind: "SIDE_RELATION", subjectId: "U", referenceId: "T", relationId: "UNCLE", lineageSide: "MATERNAL" } },
            { claimId: "UNCLE", text: `${uncle} is an uncle of ${child}.`, predicate: { kind: "RELATION", subjectId: "U", referenceId: "T", relationId: "UNCLE" } },
            { claimId: "FATHER", text: `${uncle} is the father of ${child}.`, predicate: { kind: "RELATION", subjectId: "U", referenceId: "T", relationId: "FATHER" } },
          ],
        },
      };
    },
  },
  {
    prototypeId: "BLR-CP005-PROT-SELECT-BROAD-FOLLOWING-CLAIM",
    authority: "SELECT_CLAIM_BY_MODEL_STATUS",
    build: (seed) => {
      const modelSpace = parentSideSpace(seed);
      const uncle = personName(modelSpace, "U");
      const child = personName(modelSpace, "T");
      return {
        modelSpace,
        stem: "Which broad relation follows even though the maternal or paternal side is open?",
        querySpec: {
          kind: "CLAIM_STATUS", requestedStatus: "DEFINITE",
          claims: [
            { claimId: "UNCLE", text: `${uncle} is an uncle of ${child}.`, predicate: { kind: "RELATION", subjectId: "U", referenceId: "T", relationId: "UNCLE" } },
            { claimId: "PATERNAL", text: `${uncle} is specifically the paternal uncle of ${child}.`, predicate: { kind: "SIDE_RELATION", subjectId: "U", referenceId: "T", relationId: "UNCLE", lineageSide: "PATERNAL" } },
            { claimId: "MATERNAL", text: `${uncle} is specifically the maternal uncle of ${child}.`, predicate: { kind: "SIDE_RELATION", subjectId: "U", referenceId: "T", relationId: "UNCLE", lineageSide: "MATERNAL" } },
            { claimId: "BROTHER", text: `${uncle} is the brother of ${child}.`, predicate: { kind: "RELATION", subjectId: "U", referenceId: "T", relationId: "BROTHER" } },
          ],
        },
      };
    },
  },
  {
    prototypeId: "BLR-CP005-PROT-IDENTIFY-DEFINITE-PERSON",
    authority: "IDENTIFY_PERSON_BY_MODEL_STATUS",
    build: (seed) => {
      const modelSpace = fixedSpouseOpenChildSpace(seed);
      return {
        modelSpace,
        stem: `Who is definitely the husband of ${personName(modelSpace, "W")}?`,
        querySpec: { kind: "PERSON_STATUS", requestedStatus: "DEFINITE", referenceId: "W", relationId: "HUSBAND", candidatePersonIds: ["H", "O", "P", "B"] },
      };
    },
  },
  {
    prototypeId: "BLR-CP005-PROT-IDENTIFY-POSSIBLE-PERSON",
    authority: "IDENTIFY_PERSON_BY_MODEL_STATUS",
    build: (seed) => {
      const modelSpace = spouseIdentitySpace(seed, 3);
      return {
        modelSpace,
        stem: `Who could be the husband of ${personName(modelSpace, "W")}?`,
        querySpec: { kind: "PERSON_STATUS", requestedStatus: "POSSIBLE", referenceId: "W", relationId: "HUSBAND", candidatePersonIds: ["C1", "O", "Q", "R"] },
      };
    },
  },
  {
    prototypeId: "BLR-CP005-PROT-IDENTIFY-IMPOSSIBLE-PERSON",
    authority: "IDENTIFY_PERSON_BY_MODEL_STATUS",
    build: (seed) => {
      const modelSpace = spouseIdentitySpace(seed, 3);
      return {
        modelSpace,
        stem: `Who cannot be the husband of ${personName(modelSpace, "W")}?`,
        querySpec: { kind: "PERSON_STATUS", requestedStatus: "IMPOSSIBLE", referenceId: "W", relationId: "HUSBAND", candidatePersonIds: ["O", "C1", "C2", "C3"] },
      };
    },
  },
  {
    prototypeId: "BLR-CP005-PROT-PERSON-ONE-OF-TWO",
    authority: "RESOLVE_PERSON_IDENTITY_UNCERTAINTY",
    build: (seed) => {
      const modelSpace = spouseIdentitySpace(seed, 2);
      return {
        modelSpace,
        stem: `Who is the husband of ${personName(modelSpace, "W")}?`,
        querySpec: { kind: "PERSON_UNCERTAINTY", referenceId: "W", relationId: "HUSBAND", candidatePersonIds: ["C1", "C2", "O"], mode: "ONE_OF_TWO" },
      };
    },
  },
  {
    prototypeId: "BLR-CP005-PROT-PERSON-CANNOT-BE-DETERMINED",
    authority: "RESOLVE_PERSON_IDENTITY_UNCERTAINTY",
    build: (seed) => {
      const modelSpace = spouseIdentitySpace(seed, 3);
      return {
        modelSpace,
        stem: `Who is the husband of ${personName(modelSpace, "W")}?`,
        querySpec: { kind: "PERSON_UNCERTAINTY", referenceId: "W", relationId: "HUSBAND", candidatePersonIds: ["C1", "C2", "C3", "O"], mode: "INDETERMINATE" },
      };
    },
  },
  {
    prototypeId: "BLR-CP005-PROT-MINIMUM-POSSIBLE-COUNT",
    authority: "DETERMINE_COUNT_BOUND",
    build: (seed) => {
      const modelSpace = optionalChildrenSpace(seed);
      return { modelSpace, stem: `What is the minimum possible number of children of ${personName(modelSpace, "F")}?`, querySpec: { kind: "COUNT_BOUND", countSpec: { kind: "CHILDREN_OF", parentId: "F" }, bound: "MINIMUM" } };
    },
  },
  {
    prototypeId: "BLR-CP005-PROT-MAXIMUM-POSSIBLE-COUNT",
    authority: "DETERMINE_COUNT_BOUND",
    build: (seed) => {
      const modelSpace = optionalChildrenSpace(seed);
      return { modelSpace, stem: `What is the maximum possible number of children of ${personName(modelSpace, "F")}?`, querySpec: { kind: "COUNT_BOUND", countSpec: { kind: "CHILDREN_OF", parentId: "F" }, bound: "MAXIMUM" } };
    },
  },
  {
    prototypeId: "BLR-CP005-PROT-SELECT-POSSIBLE-COUNT",
    authority: "SELECT_COUNT_BY_MODEL_STATUS",
    build: (seed) => {
      const modelSpace = optionalChildrenSpace(seed);
      return { modelSpace, stem: `Which number could be the number of children of ${personName(modelSpace, "F")}?`, querySpec: { kind: "COUNT_STATUS", countSpec: { kind: "CHILDREN_OF", parentId: "F" }, requestedStatus: "POSSIBLE", candidateValues: [2, 0, 4, 5] } };
    },
  },
  {
    prototypeId: "BLR-CP005-PROT-SELECT-IMPOSSIBLE-COUNT",
    authority: "SELECT_COUNT_BY_MODEL_STATUS",
    build: (seed) => {
      const modelSpace = optionalChildrenSpace(seed);
      return { modelSpace, stem: `Which number cannot be the number of children of ${personName(modelSpace, "F")}?`, querySpec: { kind: "COUNT_STATUS", countSpec: { kind: "CHILDREN_OF", parentId: "F" }, requestedStatus: "IMPOSSIBLE", candidateValues: [4, 1, 2, 3] } };
    },
  },
  {
    prototypeId: "BLR-CP005-PROT-EXACT-COUNT-INVARIANT",
    authority: "RESOLVE_COUNT_DETERMINACY",
    build: (seed) => {
      const modelSpace = fixedTotalVariableGenderSpace(seed);
      return { modelSpace, stem: "How many named family members are there?", querySpec: { kind: "COUNT_DETERMINACY", countSpec: { kind: "TOTAL_MEMBERS" } } };
    },
  },
  {
    prototypeId: "BLR-CP005-PROT-COUNT-CANNOT-BE-DETERMINED",
    authority: "RESOLVE_COUNT_DETERMINACY",
    build: (seed) => {
      const modelSpace = fixedTotalVariableGenderSpace(seed);
      return { modelSpace, stem: "How many male members are there?", querySpec: { kind: "COUNT_DETERMINACY", countSpec: { kind: "GENDER", gender: "MALE" } } };
    },
  },
] as const;

export function prototypeCase(prototypeId: BlrCp005PrototypeId): BlrCp005PrototypeCase {
  const value = BLR_CP005_PROTOTYPE_CASES.find((entry) => entry.prototypeId === prototypeId);
  if (!value) throw new Error(`Missing CP-005 prototype case ${prototypeId}.`);
  return value;
}
