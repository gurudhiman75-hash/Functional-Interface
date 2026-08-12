import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  INT_CP004_QL_IDS,
  INT_CP004_REGISTRY,
  generateIntCp004Question,
  type IntCp004Question,
} from "./cp004-frequency-runtime";
import {
  INT_CP004_ENGLISH_FREEZE_V2_APPROVAL,
  INT_CP004_ENGLISH_FREEZE_V2_ID,
  INT_CP004_ENGLISH_FROZEN_V2_REGISTRY,
} from "./cp004-english-freeze-authority-v2";
import {
  generateIntCp004EnglishFrozenV2Question,
  type IntCp004EnglishFrozenV2Question,
} from "./cp004-english-frozen-runtime-v2";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}
function serializable(value: unknown): unknown { return JSON.parse(stable(value)); }
function sha256(value: string): string { return createHash("sha256").update(value, "utf8").digest("hex"); }
function fail(message: string): never { throw new Error(message); }

function contentProjection(question: IntCp004Question | IntCp004EnglishFrozenV2Question): unknown {
  const record = serializable(question) as Record<string, unknown>;
  for (const key of [
    "editorialStatus", "approvalStatus", "freezeId", "allocationStatus", "permanentIdentityFrozen",
    "learnerContentFrozen", "approval", "frozenRegistry", "lifecycle",
  ]) delete record[key];
  return record;
}

function assertDeepFrozen(value: unknown, path: string, seen = new WeakSet<object>()): number {
  if (typeof value !== "object" || value === null) return 0;
  if (seen.has(value)) return 0;
  seen.add(value);
  if (!Object.isFrozen(value)) fail(`${path}: frozen runtime contains a mutable object.`);
  let checked = 1;
  for (const key of Reflect.ownKeys(value)) {
    checked += assertDeepFrozen((value as Record<PropertyKey, unknown>)[key], `${path}.${String(key)}`, seen);
  }
  return checked;
}

const approval = INT_CP004_ENGLISH_FREEZE_V2_APPROVAL;
if (approval.approvalAuthority !== "EXPLICIT_USER_EDITORIAL_SIGN_OFF") fail("Missing explicit approval authority.");
if (approval.approvalCommentId !== 5261641903) fail("Approval comment changed.");
if (approval.approvedSourceHead !== "3613ed2ab34cb3416935c147a5be22cca4dc1975") fail("Approved V6 source head changed.");
if (!approval.formulaFirstExplanations) fail("Formula-first explanation approval flag is missing.");
if (INT_CP004_QL_IDS.length !== 19 || INT_CP004_ENGLISH_FROZEN_V2_REGISTRY.length !== 19) fail("Frozen QL count changed.");

const registryDigest = sha256(stable(INT_CP004_REGISTRY));
if (registryDigest !== approval.approvedRegistrySha256) fail(`Approved registry digest changed: ${registryDigest}.`);

let runtimeQuestions = 0;
let deterministicChecks = 0;
let contentIdentityChecks = 0;
let lifecycleChecks = 0;
let frozenObjectChecks = 0;
let formulaChecks = 0;
const answerPositions = [0, 0, 0, 0];
const frequencies = new Set<number>();
const representations = new Set<string>();
const domains = new Set<string>();

for (const qlId of INT_CP004_QL_IDS) {
  const frozenRegistry = INT_CP004_ENGLISH_FROZEN_V2_REGISTRY.find((entry) => entry.qlId === qlId);
  if (!frozenRegistry) fail(`${qlId}: missing frozen registry entry.`);
  for (let seedIndex = 0; seedIndex < 100; seedIndex += 1) {
    const seed = `int-cp004-approved-english-v2:${qlId}:${seedIndex}`;
    const source = generateIntCp004Question(qlId, seed);
    const frozen = generateIntCp004EnglishFrozenV2Question(qlId, seed);
    const replay = generateIntCp004EnglishFrozenV2Question(qlId, seed);
    runtimeQuestions += 1;

    deterministicChecks += 1;
    if (stable(frozen) !== stable(replay)) fail(`${qlId}/${seed}: deterministic replay changed.`);

    contentIdentityChecks += 1;
    if (stable(contentProjection(source)) !== stable(contentProjection(frozen))) {
      fail(`${qlId}/${seed}: freeze wrapper changed learner content or mathematics.`);
    }

    formulaChecks += 1;
    if (!frozen.explanation.steps[0]?.startsWith("Formula:")) fail(`${qlId}/${seed}: formula is not the first calculation step.`);

    lifecycleChecks += 10;
    if (
      frozen.freezeId !== INT_CP004_ENGLISH_FREEZE_V2_ID
      || frozen.editorialStatus !== "ENGLISH_IMPLEMENTATION_FROZEN"
      || frozen.approvalStatus !== "APPROVED_ENGLISH_FROZEN"
      || frozen.enabled
      || frozen.stagingStatus !== "NOT_STAGED"
      || frozen.registrationStatus !== "NOT_REGISTERED"
      || frozen.questionStudioDiscoverable
      || frozen.questionBankStatus !== "NOT_STORED"
      || frozen.testEligibility !== "INELIGIBLE"
      || frozen.publiclyPublishable
    ) fail(`${qlId}/${seed}: frozen lifecycle changed.`);

    frozenObjectChecks += assertDeepFrozen(frozen, `${qlId}/${seed}`);
    answerPositions[frozen.correctIndex] += 1;
    frequencies.add(frozen.mathematicalState.frequency);
    frequencies.add(frozen.mathematicalState.firstFrequency);
    frequencies.add(frozen.mathematicalState.secondFrequency);
    representations.add(frozen.representation);
    domains.add(frozenRegistry.domain);
  }
}

if (runtimeQuestions !== 1900 || deterministicChecks !== 1900 || contentIdentityChecks !== 1900 || formulaChecks !== 1900) {
  fail("Approved V6 replay counts changed.");
}
if (answerPositions.some((count) => count === 0)) fail(`Answer-position coverage changed: ${answerPositions.join("/")}.`);
if (frequencies.size !== 4) fail(`Frequency coverage changed: ${frequencies.size}/4.`);
if (domains.size !== 5) fail(`Domain coverage changed: ${domains.size}/5.`);
if (![1, 2].includes(representations.size)) fail(`Unexpected representation coverage: ${representations.size}.`);

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp004-approved-english-freeze-v2");
mkdirSync(outputDirectory, { recursive: true });
const summary = {
  freezeId: INT_CP004_ENGLISH_FREEZE_V2_ID,
  approval,
  approvedRegistrySha256: registryDigest,
  runtimeQuestions,
  deterministicChecks,
  contentIdentityChecks,
  formulaChecks,
  lifecycleChecks,
  frozenObjectChecks,
  answerPositions,
  frequencies: [...frequencies].sort((a, b) => a - b),
  representations: [...representations].sort(),
  domains: [...domains].sort(),
  lifecycle: {
    maturity: "ENGLISH_IMPLEMENTATION_FROZEN",
    reviewStatus: "APPROVED_ENGLISH_FROZEN",
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
};
writeFileSync(join(outputDirectory, "int-cp004-approved-english-freeze-v2-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
writeFileSync(join(outputDirectory, "int-cp004-approved-english-frozen-v2-registry.json"), `${JSON.stringify(serializable(INT_CP004_ENGLISH_FROZEN_V2_REGISTRY), null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_APPROVED_ENGLISH_FREEZE_V2");
