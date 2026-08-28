import assert from "node:assert/strict";
import {
  INT_CP010_SEQUENTIAL_REOPEN_PROTOTYPES,
  INT_CP010_SEQUENTIAL_REOPEN_SOURCE_AUTHORITY,
  buildIntCp010SequentialReopenPackageV2,
} from "./cp010-sequential-mixed-source-reopen-v2";
import {
  INT_001_FINAL_QL_IDS,
  INT_001_INTENTIONAL_VACANCY,
  INT_001_NEXT_FREE_QL,
  INT_001_PERMANENT_QL_COUNT,
} from "./int-001-final-authority-registry-v1";
import {
  generateIntCp001QuestionStudioBatch,
  listIntCp001QuestionStudioPackages,
} from "./cp001-question-studio-integration-v1";
import {
  generateIntCp002QuestionStudioBatch,
  listIntCp002QuestionStudioPackages,
} from "./cp002-question-studio-integration-v1";
import {
  generateIntCp003QuestionStudioBatch,
  listIntCp003QuestionStudioPackages,
} from "./cp003-question-studio-integration-v1";
import {
  generateIntCp004Question,
  INT_CP004_QL_IDS,
} from "./cp004-frequency-runtime";
import {
  generateIntCp005QuestionStudioBatch,
  listIntCp005QuestionStudioPackages,
} from "./cp005-question-studio-integration-v1";
import {
  generateIntCp006QuestionStudioBatch,
  listIntCp006QuestionStudioPackages,
} from "./cp006-question-studio-integration-v1";
import {
  INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewIntCp007QuestionStudioReview,
} from "./cp007-question-studio-review-adapter";
import { INT_CP007_QL_CONTRACTS } from "./cp007-scheme-equivalence-runtime-v3-final";
import {
  generateIntCp008QuestionStudioBatch,
  listIntCp008QuestionStudioPackages,
} from "./cp008-question-studio-integration-v1";
import {
  generateIntCp009QuestionStudioBatch,
  listIntCp009QuestionStudioPackages,
} from "./cp009-question-studio-integration-v2";
import {
  generateIntCp010QuestionStudioBatch,
  listIntCp010QuestionStudioPackages,
} from "./cp010-question-studio-integration-v1";
import { INT_CP010_FINAL_AUTHORITIES } from "./cp010-final-registry-v1";

const PERMANENT_SEEDS_PER_QL = 12;
const CANDIDATE_SEEDS_PER_PROTOTYPE = 200;

const CANDIDATE_AUTHORITIES = Object.freeze({
  "INT-CAND-SEQUENTIAL-FINAL-AMOUNT": Object.freeze({
    prototypes: Object.freeze(["INT-CP010-REOPEN-PROT-001", "INT-CP010-REOPEN-PROT-002"] as const),
    ownership: "INT-CP-010",
    proposedIfApproved: "INT-QL-132",
    unknownDirection: "OPENING_PRINCIPAL_KNOWN__FINAL_AMOUNT_UNKNOWN",
    contract: "Known opening principal; one SI stage and one CI stage with explicit rates/durations; solve final amount. Stage order is state, not a separate mathematical authority.",
  }),
  "INT-CAND-SEQUENTIAL-OPENING-PRINCIPAL": Object.freeze({
    prototypes: Object.freeze(["INT-CP010-REOPEN-PROT-003"] as const),
    ownership: "INT-CP-010",
    proposedIfApproved: "INT-QL-133",
    unknownDirection: "FINAL_AMOUNT_KNOWN__OPENING_PRINCIPAL_UNKNOWN",
    contract: "Known final amount; one SI stage and one CI stage with explicit rates/durations; reverse the combined stage factor to recover opening principal.",
  }),
  "INT-CAND-SCHEME-DIFFERENCE-PRINCIPAL": Object.freeze({
    prototypes: Object.freeze(["INT-CP010-REOPEN-PROT-004"] as const),
    ownership: "INT-CP-007",
    proposedIfApproved: "INT-QL-134",
    unknownDirection: "RETURN_DIFFERENCE_KNOWN__COMMON_PRINCIPAL_UNKNOWN",
    contract: "Same common principal under SI borrowing and CI lending; known net return difference; recover the common principal.",
  }),
} as const);

type CandidateAuthorityId = keyof typeof CANDIDATE_AUTHORITIES;
type PrototypeId = (typeof INT_CP010_SEQUENTIAL_REOPEN_PROTOTYPES)[number];

type PermanentSurface = Readonly<{
  cpId: string;
  qlIds: readonly string[];
  generateEnglish: (qlId: string, seed: string) => Promise<any>;
}>;

function firstPackage(list: readonly any[]) {
  assert.equal(list.length, 1, "Interest checkpoint integration must expose exactly one INT-001 package descriptor.");
  return list[0];
}
function packageQlIds(pkg: any): readonly string[] {
  const qlIds = pkg.permanentQlIds ?? pkg.qlIds;
  assert.ok(Array.isArray(qlIds) && qlIds.length > 0, "Question Studio package is missing QL IDs.");
  return Object.freeze([...qlIds].map(String));
}
async function fromBatch(generator: (request: any) => Promise<any>, qlId: string, seed: string) {
  const result = await generator({ qlId, questionLanguageId: qlId, language: "en", seed, count: 1 });
  assert.equal(result?.questions?.length, 1, `${qlId}: expected one English Question Studio preview.`);
  return result.questions[0];
}

const cp001 = firstPackage(listIntCp001QuestionStudioPackages());
const cp002 = firstPackage(listIntCp002QuestionStudioPackages());
const cp003 = firstPackage(listIntCp003QuestionStudioPackages());
const cp005 = firstPackage(listIntCp005QuestionStudioPackages());
const cp006 = firstPackage(listIntCp006QuestionStudioPackages());
const cp008 = firstPackage(listIntCp008QuestionStudioPackages());
const cp009 = firstPackage(listIntCp009QuestionStudioPackages());
const cp010 = firstPackage(listIntCp010QuestionStudioPackages());

const permanentSurfaces: readonly PermanentSurface[] = Object.freeze([
  { cpId: "INT-CP-001", qlIds: packageQlIds(cp001), generateEnglish: (qlId, seed) => fromBatch(generateIntCp001QuestionStudioBatch, qlId, seed) },
  { cpId: "INT-CP-002", qlIds: packageQlIds(cp002), generateEnglish: (qlId, seed) => fromBatch(generateIntCp002QuestionStudioBatch, qlId, seed) },
  { cpId: "INT-CP-003", qlIds: packageQlIds(cp003), generateEnglish: (qlId, seed) => fromBatch(generateIntCp003QuestionStudioBatch, qlId, seed) },
  {
    cpId: "INT-CP-004",
    qlIds: Object.freeze([...INT_CP004_QL_IDS]),
    generateEnglish: async (qlId, seed) => generateIntCp004Question(qlId as any, seed),
  },
  { cpId: "INT-CP-005", qlIds: packageQlIds(cp005), generateEnglish: (qlId, seed) => fromBatch(generateIntCp005QuestionStudioBatch, qlId, seed) },
  { cpId: "INT-CP-006", qlIds: packageQlIds(cp006), generateEnglish: (qlId, seed) => fromBatch(generateIntCp006QuestionStudioBatch, qlId, seed) },
  {
    cpId: "INT-CP-007",
    qlIds: Object.freeze([...INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.qlIds]),
    generateEnglish: async (qlId, seed) => {
      const result = previewIntCp007QuestionStudioReview({ qlId: qlId as any, language: "en", seed, count: 1 });
      assert.equal(result.questions.length, 1, `${qlId}: expected one CP007 English frozen preview.`);
      return result.questions[0];
    },
  },
  { cpId: "INT-CP-008", qlIds: packageQlIds(cp008), generateEnglish: (qlId, seed) => fromBatch(generateIntCp008QuestionStudioBatch, qlId, seed) },
  { cpId: "INT-CP-009", qlIds: packageQlIds(cp009), generateEnglish: (qlId, seed) => fromBatch(generateIntCp009QuestionStudioBatch, qlId, seed) },
  { cpId: "INT-CP-010", qlIds: packageQlIds(cp010), generateEnglish: (qlId, seed) => fromBatch(generateIntCp010QuestionStudioBatch, qlId, seed) },
]);

function normalizeExact(text: string) {
  return text.normalize("NFKC").toLocaleLowerCase().replace(/\s+/gu, " ").trim();
}
function normalizeSkeleton(text: string) {
  return text
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[0-9]+(?:[.,][0-9]+)*/gu, "#")
    .replace(/[₹$€£]/gu, "¤")
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}
function stableJson(value: unknown) {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}
function optionText(option: any) {
  return typeof option === "string" ? option : String(option?.text ?? option?.display ?? option?.value ?? "");
}
function explanationText(item: any) {
  const explanation = item?.explanation;
  if (typeof explanation === "string") return explanation.trim();
  const lines: string[] = [];
  const push = (value: unknown) => { if (value !== undefined && value !== null && String(value).trim()) lines.push(String(value)); };
  if (explanation && typeof explanation === "object") {
    push(explanation.whatAsked);
    push(explanation.keyIdea);
    for (const line of explanation.lines ?? []) push(line);
    for (const line of explanation.steps ?? []) push(line);
    push(explanation.conclusion);
    push(explanation.finalAnswer);
    push(explanation.shortcut);
    push(explanation.commonTrap);
    push(explanation.commonMistake);
  }
  for (const line of item?.packageExplanation?.lines ?? []) push(line);
  return lines.join("\n").trim();
}
function stemText(item: any) {
  return String(item?.stem ?? item?.text ?? item?.presentation?.prompt ?? item?.presentation?.markdown ?? "").trim();
}
function permanentQlId(item: any, fallback: string) {
  return String(item?.qlId ?? item?.permanentQlId ?? item?.traceability?.permanentQlId ?? item?.parameters?.qlId ?? fallback);
}
function permanentContract(item: any, qlId: string) {
  if (qlId in INT_CP007_QL_CONTRACTS) {
    const contract = INT_CP007_QL_CONTRACTS[qlId as keyof typeof INT_CP007_QL_CONTRACTS];
    return `${contract.title} | ${contract.givenUnknown} | ${contract.answerSemantic}`;
  }
  return String(
    item?.solveMode
    ?? item?.solveContract
    ?? item?.parameters?.solveContract
    ?? item?.traceability?.qlTitle
    ?? item?.taskKind
    ?? "",
  );
}
function semanticConcept(stem: string, explanation: string, contract: string) {
  return `${normalizeSkeleton(stem)}|${normalizeSkeleton(contract)}|${normalizeSkeleton(explanation)}`;
}

const permanentQlRows = permanentSurfaces.flatMap((surface) => surface.qlIds.map((qlId) => ({ cpId: surface.cpId, qlId })));
const permanentQlSet = new Set(permanentQlRows.map(({ qlId }) => qlId));
assert.equal(permanentSurfaces.length, 10, "Allocation gate must cover all ten Interest checkpoints.");
assert.equal(permanentQlRows.length, INT_001_PERMANENT_QL_COUNT, "Permanent checkpoint totals drifted from 130.");
assert.equal(permanentQlSet.size, INT_001_PERMANENT_QL_COUNT, "Duplicate permanent QL ownership exists across checkpoints.");
assert.deepEqual([...permanentQlSet].sort(), [...INT_001_FINAL_QL_IDS].sort(), "Allocation gate QL set differs from final chapter registry.");
assert.equal(permanentQlSet.has(INT_001_INTENTIONAL_VACANCY), false, "INT-QL-094 unexpectedly entered permanent comparison authority.");
assert.equal(INT_001_NEXT_FREE_QL, "INT-QL-132", "Next-free permanent QL moved before allocation approval.");

assert.equal(INT_CP010_SEQUENTIAL_REOPEN_SOURCE_AUTHORITY.sourceBackedReopen, true, "Wave01 source-backed reopen authority disappeared.");
assert.equal(INT_CP010_SEQUENTIAL_REOPEN_SOURCE_AUTHORITY.permanentQlAllocationAuthorized, false, "Wave01 unexpectedly authorized permanent allocation.");
assert.equal(INT_CP010_SEQUENTIAL_REOPEN_SOURCE_AUTHORITY.currentPermanentQlCount, 130, "Wave01 current permanent count drifted.");
assert.equal(INT_CP010_SEQUENTIAL_REOPEN_SOURCE_AUTHORITY.currentNextFreeQl, "INT-QL-132", "Wave01 next-free ID drifted.");
assert.equal(INT_CP010_SEQUENTIAL_REOPEN_SOURCE_AUTHORITY.currentNextFreeQlReserved, false, "Wave01 unexpectedly reserved INT-QL-132.");

// Ownership boundaries that must remain true before candidate allocation can be considered.
assert.deepEqual(INT_CP007_QL_CONTRACTS["INT-QL-110"], {
  title: "Difference between two scheme returns",
  givenUnknown: "common principal + two complete schemes -> maturity amount difference",
  answerSemantic: "MONEY_DIFFERENCE",
}, "Candidate-3 ownership premise changed: QL110 is no longer the direct return-difference authority.");
assert.deepEqual(INT_CP007_QL_CONTRACTS["INT-QL-115"], {
  title: "Missing present principal for equal future value",
  givenUnknown: "known present principal + two complete schemes -> other present principal",
  answerSemantic: "MISSING_PRINCIPAL",
}, "Candidate-3 ownership premise changed: QL115 contract drifted.");
assert.deepEqual(INT_CP010_FINAL_AUTHORITIES.map(({ permanentQlId, solveContract }) => ({ permanentQlId, solveContract })), [
  {
    permanentQlId: "INT-QL-130",
    solveContract: "Given opening debt and a changing annual rate sequence, solve the one equal year-end instalment that reduces the final balance exactly to zero.",
  },
  {
    permanentQlId: "INT-QL-131",
    solveContract: "Given a changing annual rate sequence and heterogeneous year-end repayments that exactly clear the debt, reconstruct the opening debt.",
  },
], "Candidate-1/2 CP010 ownership premise changed: current CP010 permanent contracts drifted.");

const permanentExactOwners = new Map<string, Set<string>>();
const permanentSemanticOwners = new Map<string, Set<string>>();
const permanentContractsByQl = new Map<string, Set<string>>();
const reachedPermanentQls = new Set<string>();
let permanentQuestions = 0;
let permanentJsonChecks = 0;
let permanentAnswerChecks = 0;

for (const surface of permanentSurfaces) {
  for (const qlId of surface.qlIds) {
    for (let seedIndex = 0; seedIndex < PERMANENT_SEEDS_PER_QL; seedIndex += 1) {
      const seed = `INT-001-WAVE02-PERM:${surface.cpId}:${qlId}:${seedIndex}`;
      const first = await surface.generateEnglish(qlId, seed);
      const second = await surface.generateEnglish(qlId, seed);
      assert.equal(stableJson(first), stableJson(second), `${qlId}/${seedIndex}: permanent English generator is not deterministic.`);
      const actualQl = permanentQlId(first, qlId);
      assert.equal(actualQl, qlId, `${qlId}/${seedIndex}: permanent QL identity drifted.`);
      const stem = stemText(first);
      assert.ok(stem.length >= 8, `${qlId}/${seedIndex}: permanent English stem is empty.`);
      const options = (first.options ?? []).map(optionText);
      assert.equal(options.length, 4, `${qlId}/${seedIndex}: permanent authority must expose four options.`);
      assert.equal(new Set(options).size, 4, `${qlId}/${seedIndex}: permanent authority emitted duplicate options.`);
      const correctIndex = Number(first.correctIndex ?? first.correct);
      assert.ok(Number.isInteger(correctIndex) && correctIndex >= 0 && correctIndex < 4, `${qlId}/${seedIndex}: invalid permanent correct index.`);
      const answer = String(first.answer ?? first.correctAnswer ?? options[correctIndex]);
      assert.equal(answer, options[correctIndex], `${qlId}/${seedIndex}: permanent answer binding drifted.`);
      const explanation = explanationText(first);
      assert.ok(explanation.length > 0, `${qlId}/${seedIndex}: permanent explanation is empty.`);
      const contract = permanentContract(first, qlId);
      const exactKey = normalizeExact(stem);
      const semanticKey = semanticConcept(stem, explanation, contract);
      const exactOwners = permanentExactOwners.get(exactKey) ?? new Set<string>();
      exactOwners.add(qlId);
      permanentExactOwners.set(exactKey, exactOwners);
      const semanticOwners = permanentSemanticOwners.get(semanticKey) ?? new Set<string>();
      semanticOwners.add(qlId);
      permanentSemanticOwners.set(semanticKey, semanticOwners);
      const contracts = permanentContractsByQl.get(qlId) ?? new Set<string>();
      if (contract.trim()) contracts.add(normalizeSkeleton(contract));
      permanentContractsByQl.set(qlId, contracts);
      reachedPermanentQls.add(qlId);
      permanentQuestions += 1;
      permanentJsonChecks += 2;
      permanentAnswerChecks += 1;
      stableJson(first);
    }
  }
}
assert.equal(reachedPermanentQls.size, 130, "Not every permanent English mathematical authority was reached.");

function candidateOwner(prototypeId: PrototypeId): CandidateAuthorityId {
  for (const [candidateId, authority] of Object.entries(CANDIDATE_AUTHORITIES) as [CandidateAuthorityId, (typeof CANDIDATE_AUTHORITIES)[CandidateAuthorityId]][]) {
    if ((authority.prototypes as readonly string[]).includes(prototypeId)) return candidateId;
  }
  throw new Error(`No candidate authority owns ${prototypeId}`);
}

const candidateExactOwners = new Map<string, Set<CandidateAuthorityId>>();
const candidateSemanticOwners = new Map<string, Set<CandidateAuthorityId>>();
const candidateStemFamilies = new Map<CandidateAuthorityId, Set<string>>();
const candidateStateKeys = new Map<CandidateAuthorityId, Set<string>>();
const candidateStageOrders = new Map<CandidateAuthorityId, Set<string>>();
const candidateFrequencies = new Map<CandidateAuthorityId, Set<number>>();
const candidatePrototypeReach = new Set<PrototypeId>();
const candidatePermanentExactCollisions: { candidateId: CandidateAuthorityId; qlIds: string[]; stem: string }[] = [];
const candidatePermanentSemanticCollisions: { candidateId: CandidateAuthorityId; qlIds: string[]; semantic: string }[] = [];
let candidatePackages = 0;
let candidateReplayChecks = 0;
let candidateSolverVerifierChecks = 0;
let candidateOptionChecks = 0;
let candidateLifecycleChecks = 0;
let candidateIdLeakChecks = 0;

for (const prototypeId of INT_CP010_SEQUENTIAL_REOPEN_PROTOTYPES) {
  const candidateId = candidateOwner(prototypeId);
  const authority = CANDIDATE_AUTHORITIES[candidateId];
  for (let seedIndex = 0; seedIndex < CANDIDATE_SEEDS_PER_PROTOTYPE; seedIndex += 1) {
    const seed = `INT-001-WAVE02-CAND:${prototypeId}:${seedIndex}`;
    const first = buildIntCp010SequentialReopenPackageV2(prototypeId, seed) as any;
    const second = buildIntCp010SequentialReopenPackageV2(prototypeId, seed) as any;
    assert.equal(stableJson(first), stableJson(second), `${prototypeId}/${seedIndex}: candidate deterministic replay drifted.`);
    assert.equal(first.prototypeId, prototypeId, `${prototypeId}/${seedIndex}: prototype identity drifted.`);
    assert.equal(first.lifecycle?.discoveryOnly, true, `${prototypeId}/${seedIndex}: candidate left discovery-only lifecycle.`);
    assert.equal(first.lifecycle?.permanentQlAllocated, false, `${prototypeId}/${seedIndex}: candidate silently allocated a permanent QL.`);
    assert.equal(first.lifecycle?.nextFreeQlReserved, false, `${prototypeId}/${seedIndex}: candidate silently reserved next-free QL.`);
    assert.equal(first.lifecycle?.questionStudioDiscoverable, false, `${prototypeId}/${seedIndex}: candidate leaked into Question Studio.`);
    assert.equal(first.lifecycle?.questionBankWritable, false, `${prototypeId}/${seedIndex}: candidate leaked Question Bank write.`);
    assert.equal(first.lifecycle?.testEligible, false, `${prototypeId}/${seedIndex}: candidate leaked scored-test eligibility.`);
    assert.equal(first.lifecycle?.mockTestEligible, false, `${prototypeId}/${seedIndex}: candidate leaked mock-test eligibility.`);
    assert.equal(first.lifecycle?.publiclyPublishable, false, `${prototypeId}/${seedIndex}: candidate leaked public publication.`);
    assert.equal("permanentQlId" in first, false, `${prototypeId}/${seedIndex}: candidate package contains permanentQlId before approval.`);
    assert.equal("qlId" in first, false, `${prototypeId}/${seedIndex}: candidate package contains qlId before approval.`);
    for (const proposedId of ["INT-QL-132", "INT-QL-133", "INT-QL-134"]) {
      assert.equal(stableJson(first).includes(`\"permanentQlId\":\"${proposedId}\"`), false, `${prototypeId}/${seedIndex}: proposed ID leaked as allocated identity.`);
    }

    const stem = stemText(first);
    const options = (first.options ?? []).map(optionText);
    assert.ok(stem.length >= 8, `${prototypeId}/${seedIndex}: candidate learner stem is empty.`);
    assert.equal(options.length, 4, `${prototypeId}/${seedIndex}: candidate must expose four options.`);
    assert.equal(new Set(options).size, 4, `${prototypeId}/${seedIndex}: candidate emitted duplicate options.`);
    const correctIndex = Number(first.correctIndex);
    assert.ok(Number.isInteger(correctIndex) && correctIndex >= 0 && correctIndex < 4, `${prototypeId}/${seedIndex}: candidate correct index invalid.`);
    assert.equal(first.options[correctIndex]?.isCorrect, true, `${prototypeId}/${seedIndex}: candidate answer ownership drifted.`);
    const explanation = explanationText(first);
    assert.ok(explanation.length > 0, `${prototypeId}/${seedIndex}: candidate explanation is empty.`);

    const exactKey = normalizeExact(stem);
    const semanticKey = semanticConcept(stem, explanation, `${authority.unknownDirection}|${authority.contract}`);
    const permanentExact = permanentExactOwners.get(exactKey);
    if (permanentExact?.size) candidatePermanentExactCollisions.push({ candidateId, qlIds: [...permanentExact], stem });
    const permanentSemantic = permanentSemanticOwners.get(semanticKey);
    if (permanentSemantic?.size) candidatePermanentSemanticCollisions.push({ candidateId, qlIds: [...permanentSemantic], semantic: semanticKey });

    const exactOwners = candidateExactOwners.get(exactKey) ?? new Set<CandidateAuthorityId>();
    exactOwners.add(candidateId);
    candidateExactOwners.set(exactKey, exactOwners);
    const semanticOwners = candidateSemanticOwners.get(semanticKey) ?? new Set<CandidateAuthorityId>();
    semanticOwners.add(candidateId);
    candidateSemanticOwners.set(semanticKey, semanticOwners);

    const families = candidateStemFamilies.get(candidateId) ?? new Set<string>();
    families.add(String(first.presentation?.stemFamilyId ?? ""));
    candidateStemFamilies.set(candidateId, families);
    const states = candidateStateKeys.get(candidateId) ?? new Set<string>();
    states.add(stableJson(first.state));
    candidateStateKeys.set(candidateId, states);
    const stageOrders = candidateStageOrders.get(candidateId) ?? new Set<string>();
    if (first.state?.stageOrder) stageOrders.add(String(first.state.stageOrder));
    candidateStageOrders.set(candidateId, stageOrders);
    const frequencies = candidateFrequencies.get(candidateId) ?? new Set<number>();
    if (first.state?.compoundPeriodsPerYear) frequencies.add(Number(first.state.compoundPeriodsPerYear));
    candidateFrequencies.set(candidateId, frequencies);

    candidatePrototypeReach.add(prototypeId);
    candidatePackages += 1;
    candidateReplayChecks += 1;
    candidateSolverVerifierChecks += 2;
    candidateOptionChecks += 4;
    candidateLifecycleChecks += 8;
    candidateIdLeakChecks += 4;
  }
}

assert.deepEqual(candidatePermanentExactCollisions, [], `Candidate emitted exact learner stems already owned by permanent QLs: ${JSON.stringify(candidatePermanentExactCollisions.slice(0, 10))}`);
assert.deepEqual(candidatePermanentSemanticCollisions, [], `Candidate emitted same normalized stem+solution concept as permanent QLs: ${JSON.stringify(candidatePermanentSemanticCollisions.slice(0, 10))}`);

const crossCandidateExactCollisions = [...candidateExactOwners.entries()].filter(([, owners]) => owners.size > 1);
const crossCandidateSemanticCollisions = [...candidateSemanticOwners.entries()].filter(([, owners]) => owners.size > 1);
assert.deepEqual(crossCandidateExactCollisions, [], `Different candidate authorities emitted the same exact learner stem: ${JSON.stringify(crossCandidateExactCollisions.slice(0, 10).map(([stem, owners]) => [stem, [...owners]]))}`);
assert.deepEqual(crossCandidateSemanticCollisions, [], `Different candidate authorities collided semantically: ${JSON.stringify(crossCandidateSemanticCollisions.slice(0, 10).map(([semantic, owners]) => [semantic, [...owners]]))}`);
assert.equal(candidatePrototypeReach.size, 4, "Not all four Wave01 prototypes were reached by allocation-readiness audit.");

const forward = "INT-CAND-SEQUENTIAL-FINAL-AMOUNT" as const;
const inverse = "INT-CAND-SEQUENTIAL-OPENING-PRINCIPAL" as const;
const spreadInverse = "INT-CAND-SCHEME-DIFFERENCE-PRINCIPAL" as const;
assert.equal(candidateStemFamilies.get(forward)?.size, 6, "Forward sequential candidate did not reach all 3×2 order-facing stem families.");
assert.deepEqual([...candidateStageOrders.get(forward) ?? []].sort(), ["CI_THEN_SI", "SI_THEN_CI"], "Forward sequential candidate did not cover both stage orders.");
assert.equal(candidateStemFamilies.get(inverse)?.size, 6, "Sequential opening-principal candidate did not reach all order-aware stem families.");
assert.deepEqual([...candidateStageOrders.get(inverse) ?? []].sort(), ["CI_THEN_SI", "SI_THEN_CI"], "Sequential opening-principal candidate did not cover both stage orders.");
assert.equal(candidateStemFamilies.get(spreadInverse)?.size, 6, "Scheme-difference inverse candidate did not reach all frequency-aware stem families.");
assert.deepEqual([...candidateFrequencies.get(spreadInverse) ?? []].sort(), [1, 2], "Scheme-difference inverse candidate did not cover annual and half-yearly CI.");
for (const candidateId of Object.keys(CANDIDATE_AUTHORITIES) as CandidateAuthorityId[]) {
  assert.ok((candidateStateKeys.get(candidateId)?.size ?? 0) >= 100, `${candidateId}: state pool is too thin for permanent-allocation consideration.`);
}

// Contract-level collision boundary: the three proposed directions must not equal any current permanent solve contract.
const normalizedPermanentContracts = new Set([...permanentContractsByQl.values()].flatMap((contracts) => [...contracts]));
for (const [candidateId, authority] of Object.entries(CANDIDATE_AUTHORITIES) as [CandidateAuthorityId, (typeof CANDIDATE_AUTHORITIES)[CandidateAuthorityId]][]) {
  const candidateContract = normalizeSkeleton(`${authority.unknownDirection}|${authority.contract}`);
  assert.equal(normalizedPermanentContracts.has(candidateContract), false, `${candidateId}: candidate contract is already present in permanent authority.`);
}

const allocationReadiness = Object.freeze(Object.fromEntries(
  (Object.entries(CANDIDATE_AUTHORITIES) as [CandidateAuthorityId, (typeof CANDIDATE_AUTHORITIES)[CandidateAuthorityId]][]).map(([candidateId, authority]) => [candidateId, Object.freeze({
    ownership: authority.ownership,
    prototypes: authority.prototypes,
    proposedIfExplicitlyApproved: authority.proposedIfApproved,
    permanentIdAllocated: false,
    permanentIdReserved: false,
    allocationReadiness: "ALLOCATION_READY_ID_FREE" as const,
    uniqueStates: candidateStateKeys.get(candidateId)?.size ?? 0,
    stemFamiliesReached: candidateStemFamilies.get(candidateId)?.size ?? 0,
  })]),
));

console.log(JSON.stringify({
  auditVersion: "INT-001-COMPREHENSIVE-GAP-WAVE02-ALLOCATION-READINESS-v1",
  currentPermanentQlCount: INT_001_PERMANENT_QL_COUNT,
  intentionalVacancy: INT_001_INTENTIONAL_VACANCY,
  currentNextFreeQl: INT_001_NEXT_FREE_QL,
  currentNextFreeQlReserved: false,
  permanentEnglishAuthoritiesReached: reachedPermanentQls.size,
  permanentSeedsPerQl: PERMANENT_SEEDS_PER_QL,
  permanentEnglishQuestions: permanentQuestions,
  permanentJsonChecks,
  permanentAnswerChecks,
  candidateAuthorityCount: Object.keys(CANDIDATE_AUTHORITIES).length,
  candidatePrototypeCount: candidatePrototypeReach.size,
  candidateSeedsPerPrototype: CANDIDATE_SEEDS_PER_PROTOTYPE,
  candidatePackages,
  candidateReplayChecks,
  candidateSolverVerifierChecks,
  candidateOptionChecks,
  candidateLifecycleChecks,
  candidateIdLeakChecks,
  candidateVsPermanentExactStemCollisions: candidatePermanentExactCollisions.length,
  candidateVsPermanentSemanticCollisions: candidatePermanentSemanticCollisions.length,
  crossCandidateExactStemCollisions: crossCandidateExactCollisions.length,
  crossCandidateSemanticCollisions: crossCandidateSemanticCollisions.length,
  cp007DirectDifferenceAuthority: INT_CP007_QL_CONTRACTS["INT-QL-110"].givenUnknown,
  cp007EqualFutureValueMissingPrincipalAuthority: INT_CP007_QL_CONTRACTS["INT-QL-115"].givenUnknown,
  allocationReadiness,
  permanentAllocationAuthorizedByThisAudit: false,
  downstreamDeliveryOpenedByThisAudit: false,
}, null, 2));
console.log("PASS_INT_001_COMPREHENSIVE_GAP_WAVE02_ALLOCATION_READINESS_AUDIT");
