export const DSF_CP016_REQUIRED_CHECKPOINTS = [
  "DSF-CP-011",
  "DSF-CP-012",
  "DSF-CP-013",
  "DSF-CP-014",
  "DSF-CP-015",
] as const;

export type DsfCp016RequiredCheckpoint = (typeof DSF_CP016_REQUIRED_CHECKPOINTS)[number];

export type DsfImplementationStatus = "EXECUTABLE_GREEN" | "PENDING" | "FAILED";

export interface DsfCheckpointClosureEvidence {
  readonly checkpointId: DsfCp016RequiredCheckpoint;
  readonly implementationStatus: DsfImplementationStatus;
  readonly executableRunId?: number;
  readonly exactExecutableHead?: string;
  readonly mergedToCommonBase: boolean;
  readonly externalSourceHolds?: readonly string[];
}

export interface DsfClosureLifecycleState {
  readonly questionStudioDiscoverable: boolean;
  readonly questionBankWritable: boolean;
  readonly testEligible: boolean;
  readonly mockTestEligible: boolean;
  readonly publiclyPublishable: boolean;
  readonly automaticStudentPublication: boolean;
}

export interface DsfClosureInput {
  readonly checkpoints: readonly DsfCheckpointClosureEvidence[];
  readonly currentPermanentQlIds: readonly string[];
  readonly currentNextAvailableQlId: string;
  readonly lifecycle: DsfClosureLifecycleState;
}

export interface DsfClosureAssessment {
  readonly implementationEvidenceComplete: boolean;
  readonly commonBaseIntegrationComplete: boolean;
  readonly permanentSemanticRegistryComplete: boolean;
  readonly reviewOnlyLifecycleLocked: boolean;
  readonly implementationClosureReady: boolean;
  readonly commonBaseClosureReady: boolean;
  readonly learnerReleaseReady: false;
  readonly documentedExternalSourceHolds: readonly string[];
  readonly violations: readonly string[];
}

const EXPECTED_PERMANENT_QL_IDS = ["DSF-QL-001", "DSF-QL-002"] as const;
const EXPECTED_NEXT_QL_ID = "DSF-QL-003" as const;

function duplicates(values: readonly string[]): readonly string[] {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value]) => value).sort();
}

export function assessDsfCp016Closure(input: DsfClosureInput): DsfClosureAssessment {
  const violations: string[] = [];
  const checkpointIds = input.checkpoints.map((entry) => entry.checkpointId);
  const duplicateCheckpointIds = duplicates(checkpointIds);
  if (duplicateCheckpointIds.length) {
    violations.push(`Duplicate checkpoint evidence: ${duplicateCheckpointIds.join(", ")}.`);
  }

  for (const checkpointId of DSF_CP016_REQUIRED_CHECKPOINTS) {
    const matches = input.checkpoints.filter((entry) => entry.checkpointId === checkpointId);
    if (matches.length === 0) violations.push(`Missing closure evidence for ${checkpointId}.`);
    if (matches.length > 1) continue;
    const evidence = matches[0]!;
    if (evidence.implementationStatus !== "EXECUTABLE_GREEN") {
      violations.push(`${checkpointId} implementation status is ${evidence.implementationStatus}, not EXECUTABLE_GREEN.`);
    }
    if (evidence.implementationStatus === "EXECUTABLE_GREEN") {
      if (!Number.isInteger(evidence.executableRunId) || (evidence.executableRunId ?? 0) <= 0) {
        violations.push(`${checkpointId} is marked green without a valid executable run id.`);
      }
      if (!/^[0-9a-f]{40}$/u.test(evidence.exactExecutableHead ?? "")) {
        violations.push(`${checkpointId} is marked green without a full exact executable head SHA.`);
      }
    }
  }

  const requiredEvidence = DSF_CP016_REQUIRED_CHECKPOINTS
    .map((checkpointId) => input.checkpoints.find((entry) => entry.checkpointId === checkpointId))
    .filter((entry): entry is DsfCheckpointClosureEvidence => Boolean(entry));

  const implementationEvidenceComplete =
    requiredEvidence.length === DSF_CP016_REQUIRED_CHECKPOINTS.length &&
    requiredEvidence.every((entry) => entry.implementationStatus === "EXECUTABLE_GREEN") &&
    duplicateCheckpointIds.length === 0;

  const commonBaseIntegrationComplete =
    implementationEvidenceComplete && requiredEvidence.every((entry) => entry.mergedToCommonBase);

  const currentQlIds = [...input.currentPermanentQlIds];
  const qlDuplicates = duplicates(currentQlIds);
  if (qlDuplicates.length) violations.push(`Duplicate current permanent QL ids: ${qlDuplicates.join(", ")}.`);
  const expectedSet = new Set(EXPECTED_PERMANENT_QL_IDS);
  const actualSet = new Set(currentQlIds);
  for (const qlId of EXPECTED_PERMANENT_QL_IDS) {
    if (!actualSet.has(qlId)) violations.push(`Current permanent registry is missing ${qlId}.`);
  }
  for (const qlId of currentQlIds) {
    if (!expectedSet.has(qlId)) violations.push(`Unexpected permanent QL identity at CP016 closure: ${qlId}.`);
  }
  if (input.currentNextAvailableQlId !== EXPECTED_NEXT_QL_ID) {
    violations.push(`Next available DSF QL must be ${EXPECTED_NEXT_QL_ID}; received ${input.currentNextAvailableQlId}.`);
  }
  const permanentSemanticRegistryComplete =
    qlDuplicates.length === 0 &&
    actualSet.size === expectedSet.size &&
    [...expectedSet].every((qlId) => actualSet.has(qlId)) &&
    input.currentNextAvailableQlId === EXPECTED_NEXT_QL_ID;

  const lifecycleEntries = Object.entries(input.lifecycle) as readonly [keyof DsfClosureLifecycleState, boolean][];
  for (const [capability, enabled] of lifecycleEntries) {
    if (enabled) violations.push(`Review-only closure requires ${capability}=false.`);
  }
  const reviewOnlyLifecycleLocked = lifecycleEntries.every(([, enabled]) => enabled === false);

  const documentedExternalSourceHolds = Object.freeze(
    [...new Set(requiredEvidence.flatMap((entry) => entry.externalSourceHolds ?? []))].sort(),
  );

  const implementationClosureReady =
    implementationEvidenceComplete && permanentSemanticRegistryComplete && reviewOnlyLifecycleLocked;
  const commonBaseClosureReady = implementationClosureReady && commonBaseIntegrationComplete;

  return Object.freeze({
    implementationEvidenceComplete,
    commonBaseIntegrationComplete,
    permanentSemanticRegistryComplete,
    reviewOnlyLifecycleLocked,
    implementationClosureReady,
    commonBaseClosureReady,
    learnerReleaseReady: false as const,
    documentedExternalSourceHolds,
    violations: Object.freeze(violations),
  });
}
