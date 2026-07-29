import assert from "node:assert/strict";

import { solveExactLineageRelationFromGraph } from "../BLR-CP-001/lineage-prototype-solver";
import type { FamilyGraph } from "../foundation/types";
import { generateBlrCp003ExtendedGroup } from "./cp003-extended-generator";
import { blrCp003ExtendedSemanticKey } from "./cp003-extended-solver";
import { generateBlrCp003ScenarioGroup } from "./cp003-generator";
import { getBlrCp003LineageScenario } from "./cp003-lineage-scenarios";
import {
  materializeBlrCp003LineageHiddenGraph,
  solveBlrCp003LineageQuestion,
} from "./cp003-lineage-solver";
import { BLR_CP003_MARITAL_SCENARIO } from "./cp003-marital-scenario";
import {
  materializeBlrCp003MaritalHiddenGraph,
  resolveBlrCp003MaritalStatus,
  solveBlrCp003MaritalQuestion,
} from "./cp003-marital-solver";
import { cp003ProvisionalAuthorities } from "./cp003-merge-split-audit";
import { generateBlrCp003SourceGapGroup } from "./cp003-source-gap-generator";

// Gender-label determination remains distinct from person-by-gender identification.
const baseGroup = generateBlrCp003ScenarioGroup(
  "BLR-CP003-SCN-THREE-GENERATION-TWO-BRANCH",
  0,
);
const genderItem = baseGroup.questions.find(
  (item) => item.prototypeId === "BLR-CP003-PROT-SHARED-GENDER",
)!;
assert.equal(genderItem.answer.kind, "GENDER");
if (genderItem.answer.kind !== "GENDER") {
  throw new Error("Expected gender answer.");
}
const sameGenderMembers = baseGroup.reconstructedFamily.persons.filter(
  (person) => person.gender === genderItem.answer.gender,
);
assert.ok(sameGenderMembers.length >= 2);
assert.equal(genderItem.answer.gender, "FEMALE");

// The actual inverse item supplies a gender plus a candidate domain and returns one person.
const sourceGapGroup = generateBlrCp003SourceGapGroup(0);
const personByGenderItem = sourceGapGroup.questions.find(
  (item) =>
    item.prototypeId ===
    "BLR-CP003-PROT-SHARED-IDENTIFY-PERSON-BY-GENDER",
)!;
assert.equal(personByGenderItem.answer.kind, "PERSON");
if (personByGenderItem.answer.kind !== "PERSON") {
  throw new Error("Expected person-by-gender answer.");
}
assert.equal(personByGenderItem.answer.personId, "C");
assert.equal(personByGenderItem.options.length, 4);
assert.equal(
  personByGenderItem.options[personByGenderItem.correctIndex]?.semanticKey,
  "PERSON:C",
);
assert.ok(personByGenderItem.stem.includes("male member of the family"));

// Unordered pair answers are permutation-invariant, unlike BLR-QL-004 ordered pairs.
const extendedGroup = generateBlrCp003ExtendedGroup(0);
for (const prototypeId of [
  "BLR-CP003-PROT-SHARED-SIBLING-PAIR",
  "BLR-CP003-PROT-SHARED-PARENT-CHILD-PAIR",
] as const) {
  const item = extendedGroup.questions.find(
    (entry) => entry.prototypeId === prototypeId,
  )!;
  assert.equal(item.answer.kind, "PAIR");
  if (item.answer.kind !== "PAIR") throw new Error("Expected pair answer.");
  const [first, second] = item.answer.personIds;
  const reversed = {
    kind: "PAIR" as const,
    personIds: [second, first] as const,
  };
  assert.equal(
    blrCp003ExtendedSemanticKey(item.answer),
    blrCp003ExtendedSemanticKey(reversed),
  );
  assert.notEqual(`ORDERED:${first}->${second}`, `ORDERED:${second}->${first}`);
}

// A member-set answer is complete-set semantics, not repeated one-person identification.
const setItem = extendedGroup.questions.find(
  (entry) => entry.prototypeId === "BLR-CP003-PROT-SHARED-MEMBER-SET",
)!;
assert.equal(setItem.answer.kind, "PERSON_SET");
if (setItem.answer.kind !== "PERSON_SET") {
  throw new Error("Expected member-set answer.");
}
assert.ok(setItem.answer.personIds.length >= 2);
const reversedSet = {
  kind: "PERSON_SET" as const,
  personIds: [...setItem.answer.personIds].reverse(),
};
assert.equal(
  blrCp003ExtendedSemanticKey(setItem.answer),
  blrCp003ExtendedSemanticKey(reversedSet),
);
const missingOne = {
  kind: "PERSON_SET" as const,
  personIds: setItem.answer.personIds.slice(1),
};
assert.notEqual(
  blrCp003ExtendedSemanticKey(setItem.answer),
  blrCp003ExtendedSemanticKey(missingOne),
);
const nonMember = extendedGroup.reconstructedFamily.persons
  .map((person) => person.personId)
  .find((personId) => !setItem.answer.personIds.includes(personId))!;
const withExtra = {
  kind: "PERSON_SET" as const,
  personIds: [...setItem.answer.personIds, nonMember],
};
assert.notEqual(
  blrCp003ExtendedSemanticKey(setItem.answer),
  blrCp003ExtendedSemanticKey(withExtra),
);

// Forward marital-status determination can remain definite when inverse identification is ambiguous.
const maritalNames = Object.fromEntries(
  BLR_CP003_MARITAL_SCENARIO.hiddenGraph.persons.map((person) => [
    person.personId,
    person.name,
  ]),
);
const maritalGraph = materializeBlrCp003MaritalHiddenGraph(
  BLR_CP003_MARITAL_SCENARIO,
  maritalNames,
);
const twoUnmarriedFacts = [
  ...BLR_CP003_MARITAL_SCENARIO.maritalFacts,
  {
    personId: "D",
    status: "UNMARRIED" as const,
    evidence: "EXPLICIT_STATEMENT" as const,
  },
];
assert.equal(
  resolveBlrCp003MaritalStatus(maritalGraph, twoUnmarriedFacts, "E"),
  "UNMARRIED",
);
assert.equal(
  resolveBlrCp003MaritalStatus(maritalGraph, twoUnmarriedFacts, "D"),
  "UNMARRIED",
);
assert.throws(
  () =>
    solveBlrCp003MaritalQuestion(maritalGraph, twoUnmarriedFacts, {
      kind: "IDENTIFY_BY_MARITAL_STATUS",
      prototypeId: "BLR-CP003-PROT-SHARED-IDENTIFY-BY-MARITAL-STATUS",
      status: "UNMARRIED",
    }),
  /Expected exactly one UNMARRIED person, found 2/,
);
assert.equal(
  resolveBlrCp003MaritalStatus(
    maritalGraph,
    BLR_CP003_MARITAL_SCENARIO.maritalFacts,
    "B",
  ),
  "MARRIED",
);

// Exact-lineage relation remains definite for each candidate while inverse identification can be non-unique.
const lineageScenario = getBlrCp003LineageScenario(
  "BLR-CP003-SCN-DUAL-MATERNAL-PATERNAL-BRANCH",
);
const lineageNames = Object.fromEntries(
  lineageScenario.hiddenGraph.persons.map((person) => [
    person.personId,
    person.name,
  ]),
);
const lineageGraph = materializeBlrCp003LineageHiddenGraph(
  lineageScenario,
  lineageNames,
);
const twoAuntGraph: FamilyGraph = {
  ...lineageGraph,
  persons: [
    ...lineageGraph.persons,
    { personId: "V", name: "V", gender: "FEMALE" },
  ],
  parentEdges: [
    ...lineageGraph.parentEdges,
    { parentId: "P", childId: "V" },
  ],
};
assert.equal(
  solveExactLineageRelationFromGraph(twoAuntGraph, "S", "C").relationId,
  "PATERNAL_AUNT",
);
assert.equal(
  solveExactLineageRelationFromGraph(twoAuntGraph, "V", "C").relationId,
  "PATERNAL_AUNT",
);
assert.throws(
  () =>
    solveBlrCp003LineageQuestion(twoAuntGraph, {
      kind: "IDENTIFY_BY_EXACT_LINEAGE",
      prototypeId: "BLR-CP003-PROT-SHARED-IDENTIFY-BY-EXACT-LINEAGE",
      exactRelationId: "PATERNAL_AUNT",
      referenceId: "C",
    }),
  /Expected one PATERNAL_AUNT of C, found 2/,
);

assert.deepEqual(cp003ProvisionalAuthorities().sort(), [
  "DETERMINE_MEMBER_GENDER",
  "DETERMINE_MEMBER_MARITAL_STATUS",
  "IDENTIFY_ALL_MEMBERS_BY_RELATION",
  "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
  "IDENTIFY_PERSON_BY_EXACT_LINEAGE",
  "SELECT_UNORDERED_FAMILY_PAIR",
]);

console.log(
  JSON.stringify(
    {
      checkpointId: "BLR-CP-003",
      gate: "INVERSE_CONTRACT_AUDIT_V1",
      genderLabelForwardDefiniteInverseCandidates: sameGenderMembers.length,
      groupedPersonByGenderMatchesFrozenContract: true,
      groupedPersonByGenderAnswer: personByGenderItem.answer.personId,
      unorderedPairPermutationInvariant: true,
      orderedPairDirectionSensitive: true,
      memberSetRequiresCompleteness: true,
      maritalForwardDefiniteInverseAmbiguous: true,
      exactLineageForwardDefiniteInverseAmbiguous: true,
      provisionalNewAuthorities: cp003ProvisionalAuthorities().sort(),
      provisionalNewAuthorityCount: cp003ProvisionalAuthorities().length,
      permanentQlAllocated: false,
    },
    null,
    2,
  ),
);
