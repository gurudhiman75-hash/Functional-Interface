import { strict as assert } from "node:assert";
import ownershipSource from "./rap003-ownership.e9.json" assert { type: "json" };
import { generateQuestion, listQuantV4Packages } from "../../../../../generation-engine-core";
import { getRap003ActiveCanonicalProblemIds } from "../RatioAndProportion/RAP-003";
import { getPrt001QuestionLanguageIds } from "./foundation/library";

interface OwnershipEntry {
  legacyQlId: string;
  legacyTaskKind: string;
  disposition: "RETIRED_TO_PRT" | "DELEGATED_TIME_AND_WORK";
  replacementAuthority: string;
  representativePrtQlIds: string[];
}

const ownership = ownershipSource as {
  chapterId: string;
  wave: string;
  legacyPackage: string;
  legacyCanonicalProblemId: string;
  productOwnership: string;
  legacyRuntimeRetention: string;
  entries: OwnershipEntry[];
};

assert.equal(ownership.chapterId, "PRT-001");
assert.equal(ownership.wave, "E9");
assert.equal(ownership.legacyPackage, "RAP-003");
assert.equal(ownership.legacyCanonicalProblemId, "RAP-CP-013");
assert.equal(ownership.productOwnership, "PRT-001");
assert.equal(ownership.legacyRuntimeRetention, "HISTORICAL_REGRESSION_ONLY");

const expectedLegacyQlIds = Array.from(
  { length: 16 },
  (_, index) => `RAP-QL-${801 + index}`,
);
assert.deepEqual(
  ownership.entries.map((entry) => entry.legacyQlId).sort(),
  expectedLegacyQlIds,
  "E9 ownership ledger must account for every RAP-QL-801..816 exactly once.",
);
assert.equal(new Set(ownership.entries.map((entry) => entry.legacyQlId)).size, 16);

const retiredToPrt = ownership.entries.filter((entry) => entry.disposition === "RETIRED_TO_PRT");
const delegated = ownership.entries.filter((entry) => entry.disposition === "DELEGATED_TIME_AND_WORK");
assert.equal(retiredToPrt.length, 15, "Exactly 15 legacy Partnership QLs should retire to PRT-001.");
assert.deepEqual(
  delegated.map((entry) => entry.legacyQlId),
  ["RAP-QL-812"],
  "workContributionShare must be delegated to Time & Work rather than copied into PRT-001.",
);

const activePrtQlIds = new Set(getPrt001QuestionLanguageIds());
for (const entry of retiredToPrt) {
  assert.ok(entry.representativePrtQlIds.length > 0, `${entry.legacyQlId} has no PRT representative.`);
  for (const qlId of entry.representativePrtQlIds) {
    assert.ok(activePrtQlIds.has(qlId), `${entry.legacyQlId} maps to inactive/missing ${qlId}.`);
  }
}

const activeRapCps = getRap003ActiveCanonicalProblemIds();
assert.equal(activeRapCps.length, 9);
assert.equal(activeRapCps.includes("RAP-CP-013"), false, "RAP-CP-013 must be retired from active RAP routing.");

const packages = listQuantV4Packages();
const rap003 = packages.find((pkg) => pkg.packageId === "RAP-003");
const prt001 = packages.find((pkg) => pkg.packageId === "PRT-001");
assert.ok(rap003, "RAP-003 must remain discoverable for its non-Partnership CPs.");
assert.ok(prt001, "PRT-001 must remain discoverable as the Partnership product owner.");
assert.equal(
  rap003.canonicalProblems.some((cp) => cp.id === "RAP-CP-013"),
  false,
  "Question Studio discovery must not expose legacy RAP Partnership CP013.",
);
assert.deepEqual(
  prt001.canonicalProblems.map((cp) => cp.id),
  ["PRT-CP-001", "PRT-CP-002", "PRT-CP-003", "PRT-CP-004", "PRT-CP-005", "PRT-CP-006", "PRT-CP-007"],
);

await assert.rejects(
  () =>
    generateQuestion({
      packageId: "RAP-003",
      cpId: "RAP-CP-013",
      language: "en",
      count: 1,
      seed: "prt-e9-retired-rap-partnership",
    }),
  /Unknown canonical problem|RAP-CP-013/i,
);

const prtSmoke = await generateQuestion({
  packageId: "PRT-001",
  cpId: "PRT-CP-003",
  language: "en",
  count: 2,
  seed: "prt-e9-product-owner-smoke",
});
assert.equal(prtSmoke.questionPackages.length, 2);
assert.ok(prtSmoke.questionPackages.every((pkg) => pkg.packageId === "PRT-001"));
assert.ok(prtSmoke.questionPackages.every((pkg) => pkg.validation.valid));

console.log(JSON.stringify({
  audit: "PRT-001-E9-RAP003-ownership",
  status: "PASS",
  legacyQlCount: ownership.entries.length,
  retiredToPrt: retiredToPrt.length,
  delegatedToTimeAndWork: delegated.map((entry) => entry.legacyQlId),
  activeRapCpCount: activeRapCps.length,
  legacyRapPartnershipProductExposed: false,
  partnershipProductOwner: "PRT-001",
  activePrtQls: activePrtQlIds.size,
}, null, 2));
