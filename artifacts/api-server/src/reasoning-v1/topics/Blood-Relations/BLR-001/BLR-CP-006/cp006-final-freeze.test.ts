
import {
  BLR_CP006_CONTRACTS,
  type BlrCp006Authority,
  type BlrCp006PrototypeId,
} from "./cp006-model";
import {
  BLR_CP006_PROTOTYPES,
  buildBlrCp006Telemetry,
  generateBlrCp006FrozenBank,
} from "./cp006-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function equal(actual: unknown, expected: unknown, message: string): void {
  if (actual !== expected) throw new Error(`${message}: expected ${String(expected)}, got ${String(actual)}`);
}

const expectedOwnership: Readonly<Record<BlrCp006PrototypeId, BlrCp006Authority>> = {
  "BLR-CP006-PROT-DIRECT-FORWARD": "RESOLVE_CODED_RELATION",
  "BLR-CP006-PROT-DIRECT-REVERSE": "RESOLVE_CODED_RELATION",
  "BLR-CP006-PROT-TWO-LINK-FORWARD": "RESOLVE_CODED_RELATION",
  "BLR-CP006-PROT-TWO-LINK-REVERSE": "RESOLVE_CODED_RELATION",
  "BLR-CP006-PROT-THREE-LINK-FORWARD": "RESOLVE_CODED_RELATION",
  "BLR-CP006-PROT-THREE-LINK-REVERSE": "RESOLVE_CODED_RELATION",
  "BLR-CP006-PROT-INTERNAL-TO-ENDPOINT": "RESOLVE_CODED_RELATION",
  "BLR-CP006-PROT-ENDPOINT-TO-INTERNAL": "RESOLVE_CODED_RELATION",
  "BLR-CP006-PROT-MIXED-AFFINAL-ENDPOINT": "RESOLVE_CODED_RELATION",
  "BLR-CP006-PROT-IDENTIFY-DIRECT": "IDENTIFY_PERSON_FROM_CODED_GRAPH",
  "BLR-CP006-PROT-IDENTIFY-DERIVED": "IDENTIFY_PERSON_FROM_CODED_GRAPH",
  "BLR-CP006-PROT-GENDER-DIRECT": "DETERMINE_GENDER_FROM_CODED_GRAPH",
  "BLR-CP006-PROT-GENDER-DERIVED": "DETERMINE_GENDER_FROM_CODED_GRAPH",
  "BLR-CP006-PROT-PAIR-SIBLING": "SELECT_CODED_RELATION_PAIR",
  "BLR-CP006-PROT-PAIR-SPOUSE": "SELECT_CODED_RELATION_PAIR",
  "BLR-CP006-PROT-PAIR-PARENT-CHILD": "SELECT_CODED_RELATION_PAIR",
  "BLR-CP006-PROT-FAMILY-SET-FORWARD": "RESOLVE_CODED_FAMILY_SET_RELATION",
  "BLR-CP006-PROT-FAMILY-SET-REVERSE": "RESOLVE_CODED_FAMILY_SET_RELATION",
  "BLR-CP006-PROT-FAMILY-SET-AFFINAL": "RESOLVE_CODED_FAMILY_SET_RELATION",
};

const bank = generateBlrCp006FrozenBank();
const telemetry = buildBlrCp006Telemetry(bank);

equal(Object.keys(expectedOwnership).length, 19, "ownership inventory");
equal(BLR_CP006_PROTOTYPES.length, 19, "prototype inventory");
equal(BLR_CP006_CONTRACTS.length, 5, "contract inventory");

for (const prototype of BLR_CP006_PROTOTYPES) {
  equal(
    prototype.authority,
    expectedOwnership[prototype.prototypeId],
    `${prototype.prototypeId}: ownership`,
  );
  const owners = BLR_CP006_CONTRACTS.filter((contract) => contract.solveAuthority === prototype.authority);
  equal(owners.length, 1, `${prototype.prototypeId}: exactly one permanent QL owner`);
}

const requiredBoundaryFamilies = [
  "DIRECT-FORWARD",
  "DIRECT-REVERSE",
  "TWO-LINK-FORWARD",
  "TWO-LINK-REVERSE",
  "THREE-LINK-FORWARD",
  "THREE-LINK-REVERSE",
  "INTERNAL-TO-ENDPOINT",
  "ENDPOINT-TO-INTERNAL",
  "MIXED-AFFINAL-ENDPOINT",
  "IDENTIFY-DIRECT",
  "IDENTIFY-DERIVED",
  "GENDER-DIRECT",
  "GENDER-DERIVED",
  "PAIR-SIBLING",
  "PAIR-SPOUSE",
  "PAIR-PARENT-CHILD",
  "FAMILY-SET-FORWARD",
  "FAMILY-SET-REVERSE",
  "FAMILY-SET-AFFINAL",
];
for (const family of requiredBoundaryFamilies) {
  assert(
    BLR_CP006_PROTOTYPES.some((prototype) => prototype.prototypeId.endsWith(family)),
    `Missing source/boundary family ${family}`,
  );
}

const ql026 = bank.filter((question) => question.qlId === "BLR-QL-026");
assert(ql026.some((question) => question.sourcePrototypeId.includes("DIRECT-FORWARD")), "missing direct forward");
assert(ql026.some((question) => question.sourcePrototypeId.includes("DIRECT-REVERSE")), "missing direct reverse");
assert(ql026.some((question) => question.sourcePrototypeId.includes("TWO-LINK")), "missing two-link");
assert(ql026.some((question) => question.sourcePrototypeId.includes("THREE-LINK")), "missing three-link");
assert(ql026.some((question) => question.sourcePrototypeId.includes("INTERNAL")), "missing internal query");
assert(ql026.some((question) => question.answer.includes("in-law")), "missing affinal result");
assert(ql026.some((question) => ["Child", "Parent", "Grandchild"].includes(question.answer)), "missing broad reverse result");

const familySet = bank.filter((question) => question.qlId === "BLR-QL-030");
assert(familySet.every((question) => question.codedStatements.length >= 5), "family-set statement density");
assert(familySet.some((question) => question.answer === "Brother-in-law"), "family-set affinal coverage");
assert(familySet.some((question) => question.answer === "Grandfather"), "family-set forward coverage");
assert(familySet.some((question) => question.answer === "Grandson"), "family-set reverse coverage");

const excludedCp007Language = [
  /which expression represents/i,
  /fill the missing/i,
  /missing token/i,
  /which code should replace/i,
  /correctly coded statement/i,
  /incorrectly coded statement/i,
];
for (const question of bank) {
  const text = `${question.sharedPrompt} ${question.stem}`;
  for (const pattern of excludedCp007Language) {
    assert(!pattern.test(text), `${question.itemId}: CP-007 inverse task leaked into CP-006`);
  }
}

equal(telemetry.recordCount, 152, "record count");
equal(telemetry.topologyCount, 17, "topology count");
equal(telemetry.statementCount, 440, "statement count");
equal(telemetry.permanentQlRange, "BLR-QL-026..BLR-QL-030", "permanent range");
equal(telemetry.nextAvailableChapterQlId, "BLR-QL-031", "next ID");

console.log(JSON.stringify({
  sourceFamilies: requiredBoundaryFamilies.length,
  retainedPrototypes: BLR_CP006_PROTOTYPES.length,
  permanentAuthorities: BLR_CP006_CONTRACTS.length,
  inverseDirectionsCovered: true,
  internalQueriesCovered: true,
  independentFamilySetsCovered: true,
  symbolLetterWordTokensCovered: Object.keys(telemetry.keyStyleCounts).length === 3,
  cp007ConstructionTasksExcluded: true,
  openMeaningfulCp006Gaps: 0,
  verdict: "BLR-CP-006 FINAL DISCOVERY FREEZE PASSED",
}, null, 2));
