import {
  MAL_CP006_PERMANENT_ALLOCATION,
  MAL_CP006_PERMANENT_ALLOCATION_ID,
  MAL_CP006_PERMANENT_ALLOCATION_POLICY,
  MAL_CP006_PERMANENT_QL_RANGE,
  getMalCp006PermanentAllocation,
} from "./foundation/cp006-permanent-allocation";
import {
  MAL_CP006_WAVE03_CANDIDATE_IDS,
  MAL_CP006_WAVE03_HELD_IDS,
} from "./foundation/cp006-wave03-merge-split-analysis";
import {
  MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS,
  generateMalCp006Wave01FinalLearnerAuthorityQuestion,
} from "./foundation/cp006-wave01-learner-authority-final";
import {
  MAL_CP006_WAVE02_PROTOTYPE_IDS,
} from "./foundation/cp006-source-fixtures-wave02";
import { generateMalCp006Wave02FinalAuthorityV4 } from "./foundation/cp006-wave02-final-authority-v4";
import {
  MAL_CP006_WAVE04_VARIANT_IDS,
} from "./foundation/cp006-wave04-within-identity-generalisation";
import { generateMalCp006Wave04FinalGeneralisation } from "./foundation/cp006-wave04-within-identity-generalisation-v2";

const failures: string[] = [];

const expectedQls = [
  "MAL-QL-061",
  "MAL-QL-062",
  "MAL-QL-063",
  "MAL-QL-064",
  "MAL-QL-065",
  "MAL-QL-066",
  "MAL-QL-067",
] as const;
const expectedSolveModes = [
  "MAL-CP006-SM-001",
  "MAL-CP006-SM-002",
  "MAL-CP006-SM-003",
  "MAL-CP006-SM-004",
  "MAL-CP006-SM-005",
  "MAL-CP006-SM-006",
  "MAL-CP006-SM-007",
] as const;
const expectedCoreByQl = new Map([
  ["MAL-QL-061", "STAGED_VESSEL_LEDGER"],
  ["MAL-QL-062", "SIMULTANEOUS_EQUAL_EXCHANGE"],
  ["MAL-QL-063", "STAGED_VESSEL_LEDGER"],
  ["MAL-QL-064", "STAGED_VESSEL_LEDGER"],
  ["MAL-QL-065", "STAGED_VESSEL_LEDGER"],
  ["MAL-QL-066", "STAGED_VESSEL_LEDGER"],
  ["MAL-QL-067", "STAGED_VESSEL_LEDGER"],
] as const);

if (MAL_CP006_PERMANENT_ALLOCATION_ID !== "MAL-CP006-EN-PERMANENT-ALLOCATION-V1") {
  failures.push("allocation ID changed");
}
if (MAL_CP006_PERMANENT_QL_RANGE !== "MAL-QL-061..MAL-QL-067") {
  failures.push("permanent QL range changed");
}
if (MAL_CP006_PERMANENT_ALLOCATION.length !== 7) {
  failures.push(`expected 7 allocation entries, found ${MAL_CP006_PERMANENT_ALLOCATION.length}`);
}

const observedQls = MAL_CP006_PERMANENT_ALLOCATION.map((entry) => entry.qlId);
const observedSolveModes = MAL_CP006_PERMANENT_ALLOCATION.map((entry) => entry.solveModeId);
const observedPrototypeIds = MAL_CP006_PERMANENT_ALLOCATION.map((entry) => entry.prototypeId);
if (observedQls.join("|") !== expectedQls.join("|")) failures.push("QL sequence is not exactly MAL-QL-061..067");
if (observedSolveModes.join("|") !== expectedSolveModes.join("|")) failures.push("solve-mode sequence is not exactly MAL-CP006-SM-001..007");
if (new Set(observedQls).size !== 7) failures.push("duplicate permanent QL ID");
if (new Set(observedSolveModes).size !== 7) failures.push("duplicate permanent solve-mode ID");
if (new Set(observedPrototypeIds).size !== 7) failures.push("duplicate prototype allocation");

const approvedSet = new Set(MAL_CP006_WAVE03_CANDIDATE_IDS as readonly string[]);
const observedSet = new Set(observedPrototypeIds as readonly string[]);
for (const id of approvedSet) if (!observedSet.has(id)) failures.push(`approved prototype missing from allocation: ${id}`);
for (const id of observedSet) if (!approvedSet.has(id)) failures.push(`unapproved prototype allocated: ${id}`);
for (const heldId of MAL_CP006_WAVE03_HELD_IDS) {
  if (observedSet.has(heldId)) failures.push(`CP001-boundary held identity was allocated: ${heldId}`);
}

const coreCounts: Record<string, number> = {};
for (const entry of MAL_CP006_PERMANENT_ALLOCATION) {
  coreCounts[entry.sharedCoreId] = (coreCounts[entry.sharedCoreId] ?? 0) + 1;
  if (expectedCoreByQl.get(entry.qlId) !== entry.sharedCoreId) failures.push(`${entry.qlId}: shared-core mapping changed`);
  if (!entry.permanentIdentityFrozen) failures.push(`${entry.qlId}: permanent identity is not frozen`);
  if (entry.active) failures.push(`${entry.qlId}: active escaped allocation gate`);
  if (entry.publiclyPublishable) failures.push(`${entry.qlId}: public escaped allocation gate`);
  if (entry.questionStudioDiscoverable) failures.push(`${entry.qlId}: Question Studio escaped allocation gate`);
  if (entry.questionBankWritable) failures.push(`${entry.qlId}: Question Bank escaped allocation gate`);
  if (entry.testEligible) failures.push(`${entry.qlId}: test eligibility escaped allocation gate`);
  if (!entry.learnerContract.trim()) failures.push(`${entry.qlId}: empty learner contract`);
  if (entry.authorityIds.length === 0) failures.push(`${entry.qlId}: no learner authority attached`);
  if (getMalCp006PermanentAllocation(entry.prototypeId).qlId !== entry.qlId) failures.push(`${entry.qlId}: lookup round trip failed`);
}
if (coreCounts.STAGED_VESSEL_LEDGER !== 6) failures.push(`STAGED_VESSEL_LEDGER count ${coreCounts.STAGED_VESSEL_LEDGER ?? 0}/6`);
if (coreCounts.SIMULTANEOUS_EQUAL_EXCHANGE !== 1) failures.push(`SIMULTANEOUS_EQUAL_EXCHANGE count ${coreCounts.SIMULTANEOUS_EQUAL_EXCHANGE ?? 0}/1`);

if (MAL_CP006_PERMANENT_ALLOCATION_POLICY.language !== "en") failures.push("allocation language is not English");
if (!MAL_CP006_PERMANENT_ALLOCATION_POLICY.permanentIdentityFrozen) failures.push("allocation policy is not frozen");
if (MAL_CP006_PERMANENT_ALLOCATION_POLICY.questionStudioPermanent) failures.push("Question Studio activated during allocation");
if (MAL_CP006_PERMANENT_ALLOCATION_POLICY.questionBankWritable) failures.push("Question Bank activated during allocation");
if (MAL_CP006_PERMANENT_ALLOCATION_POLICY.testEligible) failures.push("test eligibility activated during allocation");
if (MAL_CP006_PERMANENT_ALLOCATION_POLICY.publiclyPublishable) failures.push("public publication activated during allocation");
if (MAL_CP006_PERMANENT_ALLOCATION_POLICY.hindiAuthorised) failures.push("Hindi silently authorised");
if (MAL_CP006_PERMANENT_ALLOCATION_POLICY.punjabiAuthorised) failures.push("Punjabi silently authorised");

let wave01Generated = 0;
for (const prototypeId of MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS) {
  const allocation = getMalCp006PermanentAllocation(prototypeId);
  for (let i = 0; i < 80; i += 1) {
    const q = generateMalCp006Wave01FinalLearnerAuthorityQuestion(
      prototypeId,
      `mal-cp006-wave05-allocation:w1:${prototypeId}:${i}`,
    );
    wave01Generated += 1;
    if (!q.validation.ok) failures.push(`${prototypeId}/${i}: approved Wave01 authority failed`);
    if (q.prototypeId !== prototypeId) failures.push(`${prototypeId}/${i}: Wave01 prototype changed`);
    if (q.permanentQlId !== null || q.permanentSolveModeId !== null) failures.push(`${prototypeId}/${i}: review generator was mutated into permanent runtime`);
    if (q.active || q.publiclyPublishable || q.questionStudioDiscoverable || q.questionBankWritable || q.testEligible) failures.push(`${prototypeId}/${i}: review lifecycle escaped`);
    if (!allocation.qlId.startsWith("MAL-QL-")) failures.push(`${prototypeId}: permanent lookup unavailable`);
  }
}

let wave02Generated = 0;
for (const prototypeId of MAL_CP006_WAVE02_PROTOTYPE_IDS) {
  const allocation = getMalCp006PermanentAllocation(prototypeId);
  for (let i = 0; i < 100; i += 1) {
    const q = generateMalCp006Wave02FinalAuthorityV4(
      prototypeId,
      `mal-cp006-wave05-allocation:w2:${prototypeId}:${i}`,
    );
    wave02Generated += 1;
    if (!q.validation.ok) failures.push(`${prototypeId}/${i}: approved Wave02 V4 authority failed`);
    if (q.prototypeId !== prototypeId) failures.push(`${prototypeId}/${i}: Wave02 prototype changed`);
    if (q.permanentQlId !== null || q.permanentSolveModeId !== null) failures.push(`${prototypeId}/${i}: review generator was mutated into permanent runtime`);
    if (q.active || q.publiclyPublishable || q.questionStudioDiscoverable || q.questionBankWritable || q.testEligible) failures.push(`${prototypeId}/${i}: review lifecycle escaped`);
    if (!allocation.qlId.startsWith("MAL-QL-")) failures.push(`${prototypeId}: permanent lookup unavailable`);
  }
}

const wave04Expected = {
  ASYMMETRIC_INVERSE_RETURN: "MAL-QL-066",
  THREE_LEG_ALTERNATING_FORWARD: "MAL-QL-061",
} as const;
let wave04Generated = 0;
for (const variantId of MAL_CP006_WAVE04_VARIANT_IDS) {
  for (let i = 0; i < 120; i += 1) {
    const q = generateMalCp006Wave04FinalGeneralisation(
      variantId,
      `mal-cp006-wave05-allocation:w4:${variantId}:${i}`,
    );
    wave04Generated += 1;
    if (!q.validation.ok) failures.push(`${variantId}/${i}: Wave04 final authority failed`);
    const allocation = getMalCp006PermanentAllocation(q.prototypeId);
    if (allocation.qlId !== wave04Expected[variantId]) failures.push(`${variantId}/${i}: generalisation split into wrong permanent QL ${allocation.qlId}`);
    if (q.permanentQlId !== null || q.permanentSolveModeId !== null) failures.push(`${variantId}/${i}: Wave04 review generator was mutated into permanent runtime`);
    if (q.active || q.publiclyPublishable || q.questionStudioDiscoverable || q.questionBankWritable || q.testEligible) failures.push(`${variantId}/${i}: Wave04 lifecycle escaped`);
  }
}

const report = {
  status: failures.length ? "FAIL_MAL_CP006_PERMANENT_ALLOCATION" : "PASS_MAL_CP006_PERMANENT_ALLOCATION",
  allocationId: MAL_CP006_PERMANENT_ALLOCATION_ID,
  permanentQlRange: MAL_CP006_PERMANENT_QL_RANGE,
  permanentQls: MAL_CP006_PERMANENT_ALLOCATION.length,
  permanentSolveModes: new Set(observedSolveModes).size,
  approvedPrototypeCoverage: `${observedSet.size}/${approvedSet.size}`,
  heldCp001BoundaryAllocated: false,
  sharedCoreCounts: coreCounts,
  approvedAuthorityRegressionQuestions: wave01Generated + wave02Generated + wave04Generated,
  regressionBreakdown: {
    wave01FinalLearnerAuthority: wave01Generated,
    wave02FinalAuthorityV4: wave02Generated,
    wave04WithinIdentityGeneralisationV2: wave04Generated,
  },
  wave04GeneralisationMapping: {
    ASYMMETRIC_INVERSE_RETURN: "MAL-QL-066",
    THREE_LEG_ALTERNATING_FORWARD: "MAL-QL-061",
  },
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
