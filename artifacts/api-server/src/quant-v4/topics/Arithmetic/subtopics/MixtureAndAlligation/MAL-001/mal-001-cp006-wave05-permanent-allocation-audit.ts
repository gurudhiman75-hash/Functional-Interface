import {
  MAL_CP006_PERMANENT_ALLOCATION,
  MAL_CP006_PERMANENT_ALLOCATION_ID,
  MAL_CP006_PERMANENT_ALLOCATION_POLICY,
  MAL_CP006_PERMANENT_QL_RANGE,
  getMalCp006PermanentAllocation,
} from "./foundation/cp006-permanent-allocation";
import {
  MAL_CP006_WAVE03_CANDIDATE_IDS,
  MAL_CP006_WAVE03_HELD_BOUNDARY,
} from "./foundation/cp006-wave03-merge-split-analysis";
import {
  MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS,
  generateMalCp006Wave01FinalLearnerAuthorityQuestion,
} from "./foundation/cp006-wave01-learner-authority-final";
import { MAL_CP006_WAVE02_PROTOTYPE_IDS } from "./foundation/cp006-source-fixtures-wave02";
import { generateMalCp006Wave02FinalAuthorityV4 } from "./foundation/cp006-wave02-final-authority-v4";
import { MAL_CP006_WAVE04_VARIANT_IDS } from "./foundation/cp006-wave04-within-identity-generalisation";
import { generateMalCp006Wave04FinalGeneralisation } from "./foundation/cp006-wave04-within-identity-generalisation-v2";

const failures: string[] = [];
const expectedQls = ["MAL-QL-061","MAL-QL-062","MAL-QL-063","MAL-QL-064","MAL-QL-065","MAL-QL-066","MAL-QL-067"];
const expectedModes = ["MAL-CP006-SM-001","MAL-CP006-SM-002","MAL-CP006-SM-003","MAL-CP006-SM-004","MAL-CP006-SM-005","MAL-CP006-SM-006","MAL-CP006-SM-007"];
const expectedCoreByQl: Record<string, string> = {
  "MAL-QL-061": "STAGED_VESSEL_LEDGER",
  "MAL-QL-062": "SIMULTANEOUS_EQUAL_EXCHANGE",
  "MAL-QL-063": "STAGED_VESSEL_LEDGER",
  "MAL-QL-064": "STAGED_VESSEL_LEDGER",
  "MAL-QL-065": "STAGED_VESSEL_LEDGER",
  "MAL-QL-066": "STAGED_VESSEL_LEDGER",
  "MAL-QL-067": "STAGED_VESSEL_LEDGER",
};

const qls = MAL_CP006_PERMANENT_ALLOCATION.map((x) => x.qlId);
const modes = MAL_CP006_PERMANENT_ALLOCATION.map((x) => x.solveModeId);
const prototypes = MAL_CP006_PERMANENT_ALLOCATION.map((x) => x.prototypeId);
const approved = new Set(MAL_CP006_WAVE03_CANDIDATE_IDS as readonly string[]);
const allocated = new Set(prototypes as readonly string[]);
const heldIds = Object.keys(MAL_CP006_WAVE03_HELD_BOUNDARY);

if (MAL_CP006_PERMANENT_ALLOCATION_ID !== "MAL-CP006-EN-PERMANENT-ALLOCATION-V1") failures.push("allocation ID changed");
if (MAL_CP006_PERMANENT_QL_RANGE !== "MAL-QL-061..MAL-QL-067") failures.push("allocation range changed");
if (MAL_CP006_PERMANENT_ALLOCATION.length !== 7) failures.push("allocation does not contain exactly seven entries");
if (qls.join("|") !== expectedQls.join("|")) failures.push("QL sequence is not exactly MAL-QL-061..067");
if (modes.join("|") !== expectedModes.join("|")) failures.push("solve-mode sequence is not exactly MAL-CP006-SM-001..007");
if (new Set(qls).size !== 7) failures.push("duplicate QL allocation");
if (new Set(modes).size !== 7) failures.push("duplicate solve-mode allocation");
if (allocated.size !== 7) failures.push("duplicate prototype allocation");
for (const id of approved) if (!allocated.has(id)) failures.push(`approved prototype missing: ${id}`);
for (const id of allocated) if (!approved.has(id)) failures.push(`unapproved prototype allocated: ${id}`);
for (const id of heldIds) if (allocated.has(id)) failures.push(`held CP001-boundary prototype allocated: ${id}`);

const coreCounts: Record<string, number> = {};
for (const entry of MAL_CP006_PERMANENT_ALLOCATION) {
  coreCounts[entry.sharedCoreId] = (coreCounts[entry.sharedCoreId] ?? 0) + 1;
  if (expectedCoreByQl[entry.qlId] !== entry.sharedCoreId) failures.push(`${entry.qlId}: shared-core mapping changed`);
  if (getMalCp006PermanentAllocation(entry.prototypeId).qlId !== entry.qlId) failures.push(`${entry.qlId}: prototype lookup mismatch`);
  if (!entry.permanentIdentityFrozen) failures.push(`${entry.qlId}: identity not frozen`);
  if (entry.active || entry.publiclyPublishable || entry.questionStudioDiscoverable || entry.questionBankWritable || entry.testEligible) failures.push(`${entry.qlId}: delivery lifecycle escaped allocation lock`);
  if (!entry.learnerContract.trim() || entry.authorityIds.length === 0) failures.push(`${entry.qlId}: learner contract or authority missing`);
}
if (coreCounts.STAGED_VESSEL_LEDGER !== 6) failures.push(`staged-ledger count ${coreCounts.STAGED_VESSEL_LEDGER ?? 0}/6`);
if (coreCounts.SIMULTANEOUS_EQUAL_EXCHANGE !== 1) failures.push(`equal-exchange count ${coreCounts.SIMULTANEOUS_EQUAL_EXCHANGE ?? 0}/1`);

const policy = MAL_CP006_PERMANENT_ALLOCATION_POLICY;
if (policy.language !== "en" || !policy.permanentIdentityFrozen) failures.push("permanent English identity policy changed");
if (policy.questionStudioPermanent || policy.questionBankWritable || policy.testEligible || policy.publiclyPublishable) failures.push("delivery activated during allocation");
if (policy.hindiAuthorised || policy.punjabiAuthorised) failures.push("localization silently authorized");
if (policy.permanentQlCount !== 7 || policy.permanentSolveModeCount !== 7 || policy.sharedCoreCount !== 2) failures.push("allocation policy counts changed");

let wave01 = 0;
for (const prototypeId of MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS) {
  const allocation = getMalCp006PermanentAllocation(prototypeId);
  for (let i = 0; i < 80; i += 1) {
    const q = generateMalCp006Wave01FinalLearnerAuthorityQuestion(prototypeId, `mal-cp006-wave05:w1:${prototypeId}:${i}`);
    wave01 += 1;
    if (!q.validation.ok || q.prototypeId !== prototypeId) failures.push(`${prototypeId}/${i}: Wave01 authority regression`);
    if (q.permanentQlId !== null || q.permanentSolveModeId !== null || q.active || q.publiclyPublishable || q.questionStudioDiscoverable || q.questionBankWritable || q.testEligible) failures.push(`${prototypeId}/${i}: Wave01 review generator mutated into active permanent runtime`);
    if (!allocation.qlId) failures.push(`${prototypeId}: allocation lookup failed`);
  }
}

let wave02 = 0;
for (const prototypeId of MAL_CP006_WAVE02_PROTOTYPE_IDS) {
  const allocation = getMalCp006PermanentAllocation(prototypeId);
  for (let i = 0; i < 100; i += 1) {
    const q = generateMalCp006Wave02FinalAuthorityV4(prototypeId, `mal-cp006-wave05:w2:${prototypeId}:${i}`);
    wave02 += 1;
    if (!q.validation.ok || q.prototypeId !== prototypeId) failures.push(`${prototypeId}/${i}: Wave02 V4 authority regression`);
    if (q.permanentQlId !== null || q.permanentSolveModeId !== null || q.active || q.publiclyPublishable || q.questionStudioDiscoverable || q.questionBankWritable || q.testEligible) failures.push(`${prototypeId}/${i}: Wave02 review generator mutated into active permanent runtime`);
    if (!allocation.qlId) failures.push(`${prototypeId}: allocation lookup failed`);
  }
}

const wave04Expected: Record<string, string> = {
  ASYMMETRIC_INVERSE_RETURN: "MAL-QL-066",
  THREE_LEG_ALTERNATING_FORWARD: "MAL-QL-061",
};
let wave04 = 0;
for (const variantId of MAL_CP006_WAVE04_VARIANT_IDS) {
  for (let i = 0; i < 120; i += 1) {
    const q = generateMalCp006Wave04FinalGeneralisation(variantId, `mal-cp006-wave05:w4:${variantId}:${i}`);
    wave04 += 1;
    if (!q.validation.ok) failures.push(`${variantId}/${i}: Wave04 authority regression`);
    const allocation = getMalCp006PermanentAllocation(q.prototypeId as never);
    if (allocation.qlId !== wave04Expected[variantId]) failures.push(`${variantId}/${i}: Wave04 generalisation escaped its approved QL`);
    if (q.permanentQlId !== null || q.permanentSolveModeId !== null || q.active || q.publiclyPublishable || q.questionStudioDiscoverable || q.questionBankWritable || q.testEligible) failures.push(`${variantId}/${i}: Wave04 review generator mutated into active permanent runtime`);
  }
}

const report = {
  status: failures.length ? "FAIL_MAL_CP006_PERMANENT_ALLOCATION" : "PASS_MAL_CP006_PERMANENT_ALLOCATION",
  allocationId: MAL_CP006_PERMANENT_ALLOCATION_ID,
  permanentQlRange: MAL_CP006_PERMANENT_QL_RANGE,
  permanentQls: MAL_CP006_PERMANENT_ALLOCATION.length,
  permanentSolveModes: new Set(modes).size,
  approvedPrototypeCoverage: `${allocated.size}/${approved.size}`,
  heldCp001BoundaryIds: heldIds,
  heldCp001BoundaryAllocated: heldIds.some((id) => allocated.has(id)),
  sharedCoreCounts: coreCounts,
  approvedAuthorityRegressionQuestions: wave01 + wave02 + wave04,
  regressionBreakdown: { wave01FinalLearnerAuthority: wave01, wave02FinalAuthorityV4: wave02, wave04WithinIdentityGeneralisationV2: wave04 },
  wave04GeneralisationMapping: wave04Expected,
  lifecycle: {
    permanentIdentityFrozen: true,
    active: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    language: "en",
    hindiAuthorised: false,
    punjabiAuthorised: false,
  },
  failures,
};

console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
