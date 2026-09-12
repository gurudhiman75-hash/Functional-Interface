import {
  COM004_AUTHORITY_PROPOSALS_V1,
  COM004_EXTERNAL_OWNERSHIP_DISPOSITIONS_V1,
  COM004_NON_AUTHORITY_DISCOVERY_DISPOSITIONS_V1,
  auditCom004SourceSaturationClosureMergeSplitV1,
} from "./com004-source-saturation-closure-merge-split-v1";

export type Com004PermanentQlId = `COM-004-QL-${string}`;

export type Com004PermanentQlAllocationV1 = {
  permanentQlId: Com004PermanentQlId;
  authorityProposalId: string;
  chapterCode: "COM-004";
  name: string;
  sourceCandidateIds: string[];
  objectPoolExamples: string[];
  protectedBoundaries: string[];
  allocationStatus: "PERMANENT_QL_ID_ALLOCATED";
  englishCorpusStatus: "NOT_AUTHORED";
  difficultyAuthorityStatus: "UNASSIGNED";
  active: false;
  questionStudioDiscoverable: false;
  questionStudioRegistrationStatus: "NOT_REGISTERED";
  questionBankWritable: false;
  testEligible: false;
  mockEligible: false;
  publiclyPublishable: false;
  hindiPunjabiGeneration: false;
};

const closureAudit = auditCom004SourceSaturationClosureMergeSplitV1();

function ql(permanentQlId: Com004PermanentQlId, authorityProposalId: string): Com004PermanentQlAllocationV1 {
  const proposal = COM004_AUTHORITY_PROPOSALS_V1.find((candidate) => candidate.authorityKey === authorityProposalId);
  if (!proposal) throw new Error(`Missing COM-004 authority proposal ${authorityProposalId}`);

  return {
    permanentQlId,
    authorityProposalId,
    chapterCode: "COM-004",
    name: proposal.learnerTask,
    sourceCandidateIds: [...proposal.sourceCandidateIds],
    objectPoolExamples: [...proposal.objectPoolExamples],
    protectedBoundaries: [...(proposal.protectedBoundaries ?? [])],
    allocationStatus: "PERMANENT_QL_ID_ALLOCATED",
    englishCorpusStatus: "NOT_AUTHORED",
    difficultyAuthorityStatus: "UNASSIGNED",
    active: false,
    questionStudioDiscoverable: false,
    questionStudioRegistrationStatus: "NOT_REGISTERED",
    questionBankWritable: false,
    testEligible: false,
    mockEligible: false,
    publiclyPublishable: false,
    hindiPunjabiGeneration: false,
  };
}

export const COM004_PERMANENT_QL_ALLOCATIONS_V1: Com004PermanentQlAllocationV1[] = [
  ql("COM-004-QL-001", "COM004-AUTH-PROP-001"),
  ql("COM-004-QL-002", "COM004-AUTH-PROP-002"),
  ql("COM-004-QL-003", "COM004-AUTH-PROP-003"),
  ql("COM-004-QL-004", "COM004-AUTH-PROP-004"),
  ql("COM-004-QL-005", "COM004-AUTH-PROP-005"),
  ql("COM-004-QL-006", "COM004-AUTH-PROP-006"),
  ql("COM-004-QL-007", "COM004-AUTH-PROP-007"),
  ql("COM-004-QL-008", "COM004-AUTH-PROP-008"),
  ql("COM-004-QL-009", "COM004-AUTH-PROP-009"),
  ql("COM-004-QL-010", "COM004-AUTH-PROP-010"),
  ql("COM-004-QL-011", "COM004-AUTH-PROP-011"),
  ql("COM-004-QL-012", "COM004-AUTH-PROP-012"),
  ql("COM-004-QL-013", "COM004-AUTH-PROP-013"),
  ql("COM-004-QL-014", "COM004-AUTH-PROP-014"),
  ql("COM-004-QL-015", "COM004-AUTH-PROP-015"),
  ql("COM-004-QL-016", "COM004-AUTH-PROP-016"),
  ql("COM-004-QL-017", "COM004-AUTH-PROP-017"),
];

export const COM004_COMPOSITION_ONLY_FORMS_V1 = COM004_NON_AUTHORITY_DISCOVERY_DISPOSITIONS_V1.map((entry) => ({
  sourceCandidateId: entry.candidateId,
  disposition: entry.disposition,
  reason: entry.reason,
  permanentQlAllocated: false as const,
  mayComposeOnlyFromAllocatedFacts: true as const,
}));

export const COM004_PERMANENT_QL_ALLOCATION_AUTHORITY_V1 = {
  authorityId: "COM-004-PERMANENT-QL-ALLOCATION-V1",
  chapterCode: "COM-004",
  status: "PERMANENT_QL_IDS_ALLOCATED_ENGLISH_NOT_AUTHORED" as const,
  sourceSaturationClosureValidated: closureAudit.valid,
  sourceSaturationClosed: closureAudit.valid,
  mergeSplitClosed: closureAudit.valid,
  discoveryCandidateCount: closureAudit.discoveryCandidateCount,
  allocations: COM004_PERMANENT_QL_ALLOCATIONS_V1,
  permanentQlCount: COM004_PERMANENT_QL_ALLOCATIONS_V1.length,
  nextAvailablePermanentQlId: "COM-004-QL-018",
  compositionOnlyForms: COM004_COMPOSITION_ONLY_FORMS_V1,
  externalOwnershipDispositions: COM004_EXTERNAL_OWNERSHIP_DISPOSITIONS_V1,
  englishCorpus: {
    authored: false,
    reviewed: false,
    frozen: false,
    questionCount: 0,
  },
  difficultyAuthority: {
    assigned: false,
    calibrationStarted: false,
  },
  lifecycle: {
    active: false,
    questionStudioDiscoverable: false,
    questionStudioRegistrationStatus: "NOT_REGISTERED" as const,
    questionBankWritable: false,
    testEligible: false,
    mockEligible: false,
    publiclyPublishable: false,
    hindiPunjabiGeneration: false,
  },
  nextGate: "COM004_ENGLISH_PRODUCTION_V1" as const,
} as const;

export function auditCom004PermanentQlAllocationV1() {
  const issues: string[] = [];
  const allocations = COM004_PERMANENT_QL_ALLOCATIONS_V1;
  const qlIds = allocations.map((allocation) => allocation.permanentQlId);
  const proposalIds = allocations.map((allocation) => allocation.authorityProposalId);
  const sourceCandidateIds = allocations.flatMap((allocation) => allocation.sourceCandidateIds);
  const expectedQlIds = Array.from({ length: 17 }, (_, index) => `COM-004-QL-${String(index + 1).padStart(3, "0")}`);
  const expectedProposalIds = Array.from({ length: 17 }, (_, index) => `COM004-AUTH-PROP-${String(index + 1).padStart(3, "0")}`);

  if (!closureAudit.valid || !closureAudit.sourceSaturationClosed) issues.push("Source saturation closure is not valid; permanent allocation forbidden");
  if (allocations.length !== 17) issues.push(`Expected 17 permanent QLs, found ${allocations.length}`);
  if (new Set(qlIds).size !== qlIds.length) issues.push("Duplicate permanent QL id");
  if (new Set(proposalIds).size !== proposalIds.length) issues.push("Duplicate authority proposal allocation");
  for (const expectedId of expectedQlIds) if (!qlIds.includes(expectedId as Com004PermanentQlId)) issues.push(`Missing permanent QL ${expectedId}`);
  for (const expectedId of expectedProposalIds) if (!proposalIds.includes(expectedId)) issues.push(`Missing authority proposal ${expectedId}`);
  if (new Set(sourceCandidateIds).size !== sourceCandidateIds.length) issues.push("A source discovery candidate is allocated to multiple permanent QLs");

  const compositionOnlyIds = COM004_COMPOSITION_ONLY_FORMS_V1.map((entry) => entry.sourceCandidateId);
  for (const compositionId of compositionOnlyIds) {
    if (sourceCandidateIds.includes(compositionId)) issues.push(`Composition-only candidate ${compositionId} received a permanent factual QL`);
  }
  if (sourceCandidateIds.length !== 39) issues.push(`Expected 39 factual discovery candidates across QLs, found ${sourceCandidateIds.length}`);
  if (COM004_COMPOSITION_ONLY_FORMS_V1.length !== 2) issues.push("Expected exactly two composition-only families");

  for (const allocation of allocations) {
    if (allocation.allocationStatus !== "PERMANENT_QL_ID_ALLOCATED") issues.push(`${allocation.permanentQlId}: wrong allocation status`);
    if (allocation.englishCorpusStatus !== "NOT_AUTHORED") issues.push(`${allocation.permanentQlId}: English corpus was prematurely authorized`);
    if (allocation.active || allocation.questionStudioDiscoverable || allocation.questionBankWritable || allocation.testEligible || allocation.mockEligible || allocation.publiclyPublishable || allocation.hindiPunjabiGeneration) {
      issues.push(`${allocation.permanentQlId}: downstream lifecycle escaped allocation-only state`);
    }
  }

  const urlQl = allocations.find((allocation) => allocation.permanentQlId === "COM-004-QL-008");
  if (!urlQl?.protectedBoundaries.some((boundary) => /generic TLDs.*proof/i.test(boundary))) issues.push("URL/domain QL lost TLD misconception lock");
  const protocolQl = allocations.find((allocation) => allocation.permanentQlId === "COM-004-QL-015");
  if (!protocolQl?.protectedBoundaries.some((boundary) => /POP3.*invariably deleting/i.test(boundary))) issues.push("Mail protocol QL lost POP3 misconception lock");
  const bankingQl = allocations.find((allocation) => allocation.permanentQlId === "COM-004-QL-016");
  if (!bankingQl?.protectedBoundaries.some((boundary) => /Banking Awareness\/current affairs/i.test(boundary))) issues.push("E-banking capability QL lost Banking Awareness boundary");
  const safetyQl = allocations.find((allocation) => allocation.permanentQlId === "COM-004-QL-017");
  if (!safetyQl?.protectedBoundaries.some((boundary) => /HTTPS alone is not proof/i.test(boundary))) issues.push("E-banking safety QL lost HTTPS legitimacy lock");

  return {
    valid: issues.length === 0,
    issues,
    sourceSaturationClosed: issues.length === 0,
    mergeSplitClosed: issues.length === 0,
    permanentQlCount: allocations.length,
    englishQuestionCount: 0,
    englishCorpusFrozen: false,
    questionStudioAuthorized: false,
    productionReady: false,
    nextGate: "COM004_ENGLISH_PRODUCTION_V1",
  } as const;
}
