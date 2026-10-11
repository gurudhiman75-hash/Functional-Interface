import { existsSync, readFileSync } from "node:fs";
import {
  TSD_CANONICAL_LIFECYCLE,
  TSD_CANONICAL_REMODEL_AUTHORITY,
  getTsdCanonicalLifecycle,
} from "./canonical-lifecycle";
import { generateTsdEnglishFrozenRecords } from "./TSD-001/english-frozen";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD canonical lifecycle proof failed: ${message}`);
}

const root = "src/quant-v4/topics/Arithmetic/subtopics/TimeSpeedDistance";
const checkpoints = TSD_CANONICAL_LIFECYCLE.map((entry) => entry.checkpoint);

assert(TSD_CANONICAL_LIFECYCLE.length === 12, `expected CP001..CP012 lifecycle entries, received ${TSD_CANONICAL_LIFECYCLE.length}`);
assert(new Set(checkpoints).size === checkpoints.length, "checkpoint lifecycle entries are not unique");
assert(checkpoints.join(",") === [
  "CP001", "CP002", "CP003", "CP004", "CP005", "CP006",
  "CP007", "CP008", "CP009", "CP010", "CP011", "CP012",
].join(","), "checkpoint lifecycle order/coverage changed");

for (const checkpoint of ["CP001", "CP002"] as const) {
  const entry = getTsdCanonicalLifecycle(checkpoint);
  assert(entry.lifecycle === "SUPERSEDED_INTO_REMODEL", `${checkpoint} historical freeze is being treated as current`);
  assert(entry.qlAuthority === "NONE", `${checkpoint} historical permanent QLs leaked into canonical authority`);
  assert(entry.canonicalFreezeAuthorityPath === "TSD-001/english-frozen.ts", `${checkpoint} remodel freeze authority changed`);
  assert(entry.historicalFreezeArtifactPath !== null, `${checkpoint} historical audit artifact path was lost`);
  assert(existsSync(`${root}/${entry.historicalFreezeArtifactPath}`), `${checkpoint} historical freeze artifact is missing`);
}

const remodeledFrozen = generateTsdEnglishFrozenRecords();
assert(remodeledFrozen.length === 153, `remodeled CP001/CP002 frozen corpus changed: ${remodeledFrozen.length}`);
assert(remodeledFrozen.every((row) => row.permanentQlId === null), "remodeled CP001/CP002 freeze acquired permanent QLs");
assert(remodeledFrozen.every((row) => row.englishFreezeProof.questionStudioUnlocked === false), "remodeled CP001/CP002 freeze unlocked Question Studio");
assert(TSD_CANONICAL_REMODEL_AUTHORITY.permanentQLs === 0, "canonical remodel authority no longer records zero permanent QLs");
assert(TSD_CANONICAL_REMODEL_AUTHORITY.nextPermanentQL === null, "canonical remodel authority claims a next permanent QL");
assert(TSD_CANONICAL_REMODEL_AUTHORITY.questionStudioLocked === true, "canonical remodel authority claims Studio is unlocked");

for (const checkpoint of [
  "CP003", "CP004", "CP005", "CP006", "CP007",
  "CP008", "CP009", "CP010", "CP011", "CP012",
] as const) {
  const entry = getTsdCanonicalLifecycle(checkpoint);
  assert(entry.lifecycle === "FROZEN", `${checkpoint} lost frozen lifecycle authority`);
  assert(entry.qlAuthority === "PERMANENT", `${checkpoint} permanent QL authority changed`);
  assert(entry.canonicalFreezeAuthorityPath !== null, `${checkpoint} frozen checkpoint has no freeze authority path`);
  assert(existsSync(`${root}/${entry.canonicalFreezeAuthorityPath}`), `${checkpoint} canonical freeze authority file is missing`);
  assert(entry.studioEligibility === "GOVERNED_BY_CHECKPOINT_PROOFS", `${checkpoint} Studio authority escaped checkpoint-specific proof governance`);
}

for (const checkpoint of ["CP010", "CP011", "CP012"] as const) {
  const entry = getTsdCanonicalLifecycle(checkpoint);
  const cpPath = `${root}/TSD-002/${checkpoint.toLowerCase()}`;
  assert(existsSync(`${cpPath}/ql-allocation.ts`), `${checkpoint} permanent QL allocation is missing`);
  assert(existsSync(`${cpPath}/english-freeze-registry.ts`), `${checkpoint} English freeze registry is missing`);
  assert(existsSync(`${cpPath}/localization-freeze-registry.ts`), `${checkpoint} localization freeze registry is missing`);
  assert(existsSync(`${cpPath}/question-studio-preregistration-lock-proof.test.ts`), `${checkpoint} post-freeze production lock proof is missing`);
}

assert(TSD_CANONICAL_LIFECYCLE.every((entry) => entry.lifecycle !== "PREFREEZE_REVIEW"), "a stale pre-freeze lifecycle entry remains after CP012 freeze completion");
assert(TSD_CANONICAL_LIFECYCLE.every((entry) => entry.qlAuthority !== "PROVISIONAL"), "a stale provisional QL authority remains after CP012 freeze completion");

const tsd001Barrel = readFileSync(`${root}/TSD-001/index.ts`, "utf8");
assert(!tsd001Barrel.includes('export * from "./cp001/freeze-registry"'), "TSD-001 barrel still exports superseded CP001 freeze authority");
assert(!tsd001Barrel.includes('export * from "./cp002/freeze-registry"'), "TSD-001 barrel still exports superseded CP002 freeze authority");
assert(tsd001Barrel.includes('export * from "./english-frozen"'), "TSD-001 barrel no longer exports canonical remodeled English freeze");

console.log("TSD CANONICAL LIFECYCLE COMPLETION PROOF: PASS");
console.log(JSON.stringify({
  checkpoints: checkpoints.length,
  supersededIntoRemodel: 2,
  frozen: 10,
  prefreezeReview: 0,
  remodeledRecords: remodeledFrozen.length,
  remodeledPermanentQls: 0,
  staleFreezeExportsRemoved: true,
  cp010ToCp012ProductionAuthority: "GOVERNED_BY_CHECKPOINT_PROOFS",
}, null, 2));
