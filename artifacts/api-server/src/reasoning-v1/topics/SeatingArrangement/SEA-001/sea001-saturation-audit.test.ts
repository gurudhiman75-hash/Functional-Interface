import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { SEA_001_BLUEPRINTS } from "./manifest.ts";
import { generateSeaCp001Caselet } from "./generation/caselet-assembler.ts";
import { SEA_CP001_ACCEPTED_QUERY_CONTRACTS } from "./generation/question-generator.ts";
import { assertMixedFacingCaseletIntegrity, generateMixedFacingCaselet, SEA_CP002_BLUEPRINTS } from "./cp002/generator.ts";
import { SEA_CP002_ACCEPTED_QUERY_CONTRACTS } from "./cp002/questions.ts";
import { assertCircularCaseletIntegrity, generateCircularCaselet, SEA_CP003_BLUEPRINTS } from "./cp003/generator.ts";
import { SEA_CP003_ACCEPTED_QUERY_CONTRACTS } from "./cp003/questions.ts";
import { assertOutwardCaseletIntegrity, generateOutwardCaselet, SEA_CP004_BLUEPRINTS } from "./cp004/generator.ts";
import { assertMixedCircularCaseletIntegrity, generateMixedCircularCaselet, SEA_CP005_BLUEPRINTS } from "./cp005/generator.ts";
import { SEA_CP005_ACCEPTED_QUERY_CONTRACTS } from "./cp005/questions.ts";

const CASES_PER_BLUEPRINT = Number(process.env.SEA_001_SATURATION_CASES_PER_BLUEPRINT ?? 80);
const EXPECTED_BLUEPRINTS = 20;
const EXPECTED_CASELETS = EXPECTED_BLUEPRINTS * CASES_PER_BLUEPRINT;
const EXPECTED_CHILDREN = (SEA_001_BLUEPRINTS.length * CASES_PER_BLUEPRINT * 3)
  + ((SEA_CP002_BLUEPRINTS.length + SEA_CP003_BLUEPRINTS.length + SEA_CP004_BLUEPRINTS.length + SEA_CP005_BLUEPRINTS.length) * CASES_PER_BLUEPRINT * 4);

const CP004_ACCEPTED_QUERY_CONTRACTS = ["SEA-QC-003", "SEA-QC-006", "SEA-QC-009", "SEA-QC-010", "SEA-QC-020"] as const;
const expectedQueriesByCheckpoint: Readonly<Record<string, readonly string[]>> = Object.freeze({
  "SEA-CP-001": SEA_CP001_ACCEPTED_QUERY_CONTRACTS,
  "SEA-CP-002": SEA_CP002_ACCEPTED_QUERY_CONTRACTS,
  "SEA-CP-003": SEA_CP003_ACCEPTED_QUERY_CONTRACTS,
  "SEA-CP-004": CP004_ACCEPTED_QUERY_CONTRACTS,
  "SEA-CP-005": SEA_CP005_ACCEPTED_QUERY_CONTRACTS,
});

type AuditableChild = {
  readonly questionOrder: number;
  readonly queryContractId: string;
  readonly answerDeterminingFactFingerprint: string;
  readonly answerIndex: number;
  readonly options: readonly {
    readonly semanticFingerprint: string;
    readonly isCorrect: boolean;
  }[];
};

const checkpointDistribution: Record<string, number> = {};
const blueprintDistribution: Record<string, number> = {};
const queryContractDistribution: Record<string, number> = {};
const querySurfaceDistribution: Record<string, number> = {};
const answerPositionDistribution = [0, 0, 0, 0];
const answerPositionByChildIndexDistribution = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
const structuralVariants = new Set<string>();
const structuralVariantsByBlueprint = new Map<string, Set<string>>();
const caseletIds = new Set<string>();
const querySequences: Record<string, number> = {};

let caseletCount = 0;
let childQuestionCount = 0;
let queryFactDuplicateCount = 0;
let checkpointSkillCoverageFailureCount = 0;
let crossQuestionLeakageCount = 0;
let solverOracleMismatchCount = 0;
let invalidOptionCount = 0;
let semanticDuplicateOptionCount = 0;
let incorrectAnswerCount = 0;
let lifecycleViolationCount = 0;
let exactDuplicateCaseletCount = 0;
const startedAt = performance.now();

function increment(record: Record<string, number>, key: string): void {
  record[key] = (record[key] ?? 0) + 1;
}

function constraintKindSignature(constraints: readonly { readonly kind: string }[]): string {
  const counts: Record<string, number> = {};
  for (const constraint of constraints) increment(counts, constraint.kind);
  return Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)).map(([kind, count]) => `${kind}:${count}`).join(",");
}

function querySurface(checkpointId: string, child: AuditableChild): string {
  const prefix = child.answerDeterminingFactFingerprint.split("|")[0] ?? "";
  return /^SEA-CP00[1-5]-QS-/.test(prefix) ? prefix : `${checkpointId}:${child.queryContractId}`;
}

function recordCaselet(input: {
  readonly checkpointId: string;
  readonly blueprintId: string;
  readonly caseletId: string;
  readonly solverAgreementPassed: boolean;
  readonly skills: readonly string[];
  readonly leakagePassed: boolean;
  readonly children: readonly AuditableChild[];
  readonly structuralFingerprint: string;
  readonly permanentQlCount: number;
  readonly questionBankWritable: boolean;
  readonly testEligible: boolean;
  readonly publiclyPublishable: boolean;
}): void {
  caseletCount += 1;
  increment(checkpointDistribution, input.checkpointId);
  increment(blueprintDistribution, input.blueprintId);

  if (caseletIds.has(input.caseletId)) exactDuplicateCaseletCount += 1;
  caseletIds.add(input.caseletId);
  if (!input.solverAgreementPassed) solverOracleMismatchCount += 1;
  if (input.skills.length === 0) checkpointSkillCoverageFailureCount += 1;
  if (!input.leakagePassed) crossQuestionLeakageCount += 1;
  if (input.permanentQlCount !== 0 || input.questionBankWritable || input.testEligible || input.publiclyPublishable) lifecycleViolationCount += 1;

  structuralVariants.add(input.structuralFingerprint);
  const blueprintVariants = structuralVariantsByBlueprint.get(input.blueprintId) ?? new Set<string>();
  blueprintVariants.add(input.structuralFingerprint);
  structuralVariantsByBlueprint.set(input.blueprintId, blueprintVariants);

  const queryFacts = input.children.map((child) => child.answerDeterminingFactFingerprint);
  if (new Set(queryFacts).size !== queryFacts.length) queryFactDuplicateCount += 1;
  const querySequence = input.children.map((child) => child.queryContractId).join(">");
  increment(querySequences, `${input.checkpointId}:${querySequence}`);

  for (const child of input.children) {
    childQuestionCount += 1;
    increment(queryContractDistribution, `${input.checkpointId}:${child.queryContractId}`);
    increment(querySurfaceDistribution, querySurface(input.checkpointId, child));

    if (child.answerIndex < 0 || child.answerIndex > 3) invalidOptionCount += 1;
    else {
      answerPositionDistribution[child.answerIndex] += 1;
      if (child.questionOrder >= 1 && child.questionOrder <= 4) {
        answerPositionByChildIndexDistribution[child.questionOrder - 1]![child.answerIndex] += 1;
      }
    }
    if (child.options.length !== 4) invalidOptionCount += 1;
    if (new Set(child.options.map((option) => option.semanticFingerprint)).size !== child.options.length) semanticDuplicateOptionCount += 1;
    if (child.options.filter((option) => option.isCorrect).length !== 1 || !child.options[child.answerIndex]?.isCorrect) incorrectAnswerCount += 1;
  }
}

for (const blueprintId of SEA_001_BLUEPRINTS) {
  for (let index = 0; index < CASES_PER_BLUEPRINT; index += 1) {
    const caselet = generateSeaCp001Caselet({ blueprintId, seed: `SEA-001-SAT-CP001-${blueprintId}-${index}` });
    const seatCount = Number(caselet.setupText.match(/^(\d+) persons/)?.[1]);
    const facing = caselet.solverOracleAgreement.productionKeys[0]?.split("|")[0] ?? "UNKNOWN";
    const traceKinds = caselet.proofTrace.map((event) => event.kind).sort().join("+");
    recordCaselet({
      checkpointId: caselet.checkpointId,
      blueprintId,
      caseletId: caselet.caseletId,
      solverAgreementPassed: caselet.solverOracleAgreement.passed,
      skills: caselet.checkpointSkillCoverage,
      leakagePassed: caselet.crossQuestionLeakagePassed,
      children: caselet.children,
      structuralFingerprint: `${blueprintId}|N:${seatCount}|F:${facing}|TRACE:${traceKinds}`,
      permanentQlCount: caselet.lifecycle.permanentQlCount,
      questionBankWritable: caselet.lifecycle.questionBankWritable,
      testEligible: caselet.lifecycle.testEligible,
      publiclyPublishable: caselet.lifecycle.publiclyPublishable,
    });
  }
}

for (const blueprintId of SEA_CP002_BLUEPRINTS) {
  for (let index = 0; index < CASES_PER_BLUEPRINT; index += 1) {
    const caselet = generateMixedFacingCaselet(`SEA-001-SAT-CP002-${blueprintId}-${index}`, blueprintId);
    assertMixedFacingCaseletIntegrity(caselet);
    const modelKey = caselet.solverOracleAgreement.productionKeys[0] ?? "";
    const facingPart = modelKey.split("|")[1] ?? "";
    const north = (facingPart.match(/:NORTH/g) ?? []).length;
    const south = (facingPart.match(/:SOUTH/g) ?? []).length;
    const seatCount = caselet.diagramText.split(" | ").length;
    recordCaselet({
      checkpointId: caselet.checkpointId,
      blueprintId,
      caseletId: caselet.caseletId,
      solverAgreementPassed: caselet.solverOracleAgreement.passed,
      skills: caselet.checkpointSkillCoverage,
      leakagePassed: caselet.crossQuestionLeakagePassed,
      children: caselet.children,
      structuralFingerprint: `${blueprintId}|N:${seatCount}|FACE:${north}N-${south}S|CLUES:${constraintKindSignature(caselet.constraints)}`,
      permanentQlCount: caselet.lifecycle.permanentQlCount,
      questionBankWritable: caselet.lifecycle.questionBankWritable,
      testEligible: caselet.lifecycle.testEligible,
      publiclyPublishable: caselet.lifecycle.publiclyPublishable,
    });
  }
}

for (const blueprintId of SEA_CP003_BLUEPRINTS) {
  for (let index = 0; index < CASES_PER_BLUEPRINT; index += 1) {
    const caselet = generateCircularCaselet(`SEA-001-SAT-CP003-${blueprintId}-${index}`, blueprintId);
    assertCircularCaseletIntegrity(caselet);
    recordCaselet({
      checkpointId: caselet.checkpointId,
      blueprintId,
      caseletId: caselet.caseletId,
      solverAgreementPassed: caselet.solverOracleAgreement.passed,
      skills: caselet.checkpointSkillCoverage,
      leakagePassed: caselet.crossQuestionLeakagePassed,
      children: caselet.children,
      structuralFingerprint: `${blueprintId}|N:${caselet.topologySnapshot.seatCount}|LM:${caselet.topologySnapshot.landmark?.id ?? "NONE"}|CLUES:${constraintKindSignature(caselet.constraints)}`,
      permanentQlCount: caselet.lifecycle.permanentQlCount,
      questionBankWritable: caselet.lifecycle.questionBankWritable,
      testEligible: caselet.lifecycle.testEligible,
      publiclyPublishable: caselet.lifecycle.publiclyPublishable,
    });
  }
}

for (const blueprintId of SEA_CP004_BLUEPRINTS) {
  for (let index = 0; index < CASES_PER_BLUEPRINT; index += 1) {
    const caselet = generateOutwardCaselet(`SEA-001-SAT-CP004-${blueprintId}-${index}`, blueprintId);
    assertOutwardCaseletIntegrity(caselet);
    recordCaselet({
      checkpointId: caselet.checkpointId,
      blueprintId,
      caseletId: caselet.caseletId,
      solverAgreementPassed: caselet.solverOracleAgreement.passed,
      skills: caselet.checkpointSkillCoverage,
      leakagePassed: caselet.crossQuestionLeakagePassed,
      children: caselet.children,
      structuralFingerprint: `${blueprintId}|N:${caselet.topologySnapshot.seatCount}|LM:${caselet.topologySnapshot.landmark?.id ?? "NONE"}|CLUES:${constraintKindSignature(caselet.constraints)}`,
      permanentQlCount: caselet.lifecycle.permanentQlCount,
      questionBankWritable: caselet.lifecycle.questionBankWritable,
      testEligible: caselet.lifecycle.testEligible,
      publiclyPublishable: caselet.lifecycle.publiclyPublishable,
    });
  }
}

for (const blueprintId of SEA_CP005_BLUEPRINTS) {
  for (let index = 0; index < CASES_PER_BLUEPRINT; index += 1) {
    const caselet = generateMixedCircularCaselet(`SEA-001-SAT-CP005-${blueprintId}-${index}`, blueprintId);
    assertMixedCircularCaseletIntegrity(caselet);
    const modelKey = caselet.solverOracleAgreement.productionKeys[0] ?? "";
    const centre = (modelKey.match(/:C(?:\||$)/g) ?? []).length;
    const outward = (modelKey.match(/:O(?:\||$)/g) ?? []).length;
    recordCaselet({
      checkpointId: caselet.checkpointId,
      blueprintId,
      caseletId: caselet.caseletId,
      solverAgreementPassed: caselet.solverOracleAgreement.passed,
      skills: caselet.checkpointSkillCoverage,
      leakagePassed: caselet.crossQuestionLeakagePassed,
      children: caselet.children,
      structuralFingerprint: `${blueprintId}|N:${caselet.topologySnapshot.seatCount}|FACE:${centre}C-${outward}O|CLUES:${constraintKindSignature(caselet.constraints)}`,
      permanentQlCount: caselet.lifecycle.permanentQlCount,
      questionBankWritable: caselet.lifecycle.questionBankWritable,
      testEligible: caselet.lifecycle.testEligible,
      publiclyPublishable: caselet.lifecycle.publiclyPublishable,
    });
  }
}

assert.equal(CASES_PER_BLUEPRINT, 80, "production-candidate proof is frozen at 80 caselets per authority");
assert.equal(Object.keys(blueprintDistribution).length, EXPECTED_BLUEPRINTS, "not all 20 SEA-001 authority families were reached");
assert.equal(caseletCount, EXPECTED_CASELETS);
assert.ok(caseletCount >= 1500, "production-candidate caselet target not met");
assert.equal(childQuestionCount, EXPECTED_CHILDREN);
assert.ok(childQuestionCount >= 6000, "production-candidate child-question target not met");
assert.equal(exactDuplicateCaseletCount, 0, "duplicate caselet IDs detected");
assert.equal(solverOracleMismatchCount, 0);
assert.equal(queryFactDuplicateCount, 0);
assert.equal(checkpointSkillCoverageFailureCount, 0);
assert.equal(crossQuestionLeakageCount, 0);
assert.equal(invalidOptionCount, 0);
assert.equal(semanticDuplicateOptionCount, 0);
assert.equal(incorrectAnswerCount, 0);
assert.equal(lifecycleViolationCount, 0);

for (const [checkpointId, contracts] of Object.entries(expectedQueriesByCheckpoint)) {
  for (const contract of contracts) {
    assert.ok((queryContractDistribution[`${checkpointId}:${contract}`] ?? 0) > 0, `unused accepted query contract: ${checkpointId}/${contract}`);
  }
}

assert.ok(Object.keys(querySurfaceDistribution).length >= 24, `query-template surface target missed: ${Object.keys(querySurfaceDistribution).length}`);
assert.ok(structuralVariants.size >= 60, `structural blueprint variant target missed: ${structuralVariants.size}`);
for (const [blueprintId, variants] of structuralVariantsByBlueprint) {
  assert.ok(variants.size >= 2, `${blueprintId} did not produce at least two genuine structural variants`);
}

for (let childIndex = 0; childIndex < answerPositionByChildIndexDistribution.length; childIndex += 1) {
  const counts = answerPositionByChildIndexDistribution[childIndex] as number[];
  assert.ok(counts.every((count) => count > 0), `child ${childIndex + 1} misses an answer position: ${counts.join(",")}`);
}
assert.ok(answerPositionDistribution.every((count) => count > 0));

const repeatedQuerySequenceCount = Object.values(querySequences).reduce((sum, count) => sum + Math.max(0, count - 1), 0);
const sameStructuralFingerprintCount = caseletCount - structuralVariants.size;
const unusedBlueprintCount = EXPECTED_BLUEPRINTS - Object.keys(blueprintDistribution).length;
const unusedQueryContractCount = Object.entries(expectedQueriesByCheckpoint).reduce((sum, [checkpointId, contracts]) =>
  sum + contracts.filter((contract) => (queryContractDistribution[`${checkpointId}:${contract}`] ?? 0) === 0).length, 0);

console.log("PASS_SEA_001_PRODUCTION_CANDIDATE_SATURATION");
console.log(`caseletCount ${caseletCount}`);
console.log(`childQuestionCount ${childQuestionCount}`);
console.log(`blueprintAuthorityCount ${Object.keys(blueprintDistribution).length}`);
console.log(`structuralBlueprintVariantCount ${structuralVariants.size}`);
console.log(`queryTemplateSurfaceCount ${Object.keys(querySurfaceDistribution).length}`);
console.log(`unusedBlueprintCount ${unusedBlueprintCount}`);
console.log(`unusedQueryContractCount ${unusedQueryContractCount}`);
console.log(`queryFactDuplicateCount ${queryFactDuplicateCount}`);
console.log(`checkpointSkillCoverageFailureCount ${checkpointSkillCoverageFailureCount}`);
console.log(`crossQuestionLeakageCount ${crossQuestionLeakageCount}`);
console.log(`solverOracleMismatchCount ${solverOracleMismatchCount}`);
console.log(`invalidOptionCount ${invalidOptionCount}`);
console.log(`semanticDuplicateOptionCount ${semanticDuplicateOptionCount}`);
console.log(`incorrectAnswerCount ${incorrectAnswerCount}`);
console.log(`lifecycleViolationCount ${lifecycleViolationCount}`);
console.log(`exactDuplicateCaseletCount ${exactDuplicateCaseletCount}`);
console.log(`sameStructuralFingerprintCount ${sameStructuralFingerprintCount}`);
console.log(`repeatedQuerySequenceCount ${repeatedQuerySequenceCount}`);
console.log(`answerPositionDistribution ${answerPositionDistribution.join(",")}`);
for (let index = 0; index < answerPositionByChildIndexDistribution.length; index += 1) {
  console.log(`answerPositionChild${index + 1} ${answerPositionByChildIndexDistribution[index]!.join(",")}`);
}
console.log(`checkpointDistribution ${JSON.stringify(checkpointDistribution)}`);
console.log(`elapsedMilliseconds ${Math.round(performance.now() - startedAt)}`);
console.log("manualEnglishReviewStatus PENDING_HUMAN_REVIEW");
console.log("permanentQLs 0");
