import { LinearTopology } from "../topology/linear.ts";
import { CircularTopology } from "../cp003/topology.ts";
import { oppositeFacing } from "../cp005/constraints.ts";
import {
  seatCountOf,
  type AuditCaselet,
  type Sea001CheckpointId,
} from "./corpus.ts";

export type AuditDecision = "RETAIN_SEPARATE" | "MERGE_CANDIDATE" | "SPLIT_CANDIDATE";

interface BlueprintAuthorityDescriptor {
  readonly blueprintId: string;
  readonly checkpointId: Sea001CheckpointId;
  readonly contract: string;
  readonly definingDiscriminators: readonly string[];
}

export const SEA001_BLUEPRINT_AUTHORITY_DESCRIPTORS: readonly BlueprintAuthorityDescriptor[] = [
  { blueprintId: "SEA-PBA-001", checkpointId: "SEA-CP-001", contract: "end anchor plus linked consecutive block", definingDiscriminators: ["END_ANCHOR", "LINKED_BLOCK"] },
  { blueprintId: "SEA-PBA-002", checkpointId: "SEA-CP-001", contract: "middle anchor plus exact-gap chain", definingDiscriminators: ["MIDDLE_ANCHOR", "EXACT_GAP"] },
  { blueprintId: "SEA-PBA-003", checkpointId: "SEA-CP-001", contract: "two-end constraints plus adjacency elimination", definingDiscriminators: ["TWO_ENDS", "ADJACENCY_ELIMINATION"] },
  { blueprintId: "SEA-PBA-004", checkpointId: "SEA-CP-001", contract: "negative adjacency plus only-remaining placement", definingDiscriminators: ["NEGATIVE_ADJACENCY", "ONLY_REMAINING"] },
  { blueprintId: "SEA-PBA-005", checkpointId: "SEA-CP-002", contract: "stated mixed facings plus relative chain", definingDiscriminators: ["MIXED_ROW", "STATED_FACING", "RELATIVE_CHAIN"] },
  { blueprintId: "SEA-PBA-006", checkpointId: "SEA-CP-002", contract: "inferred facing from directional consistency", definingDiscriminators: ["MIXED_ROW", "INFERRED_FACING"] },
  { blueprintId: "SEA-PBA-007", checkpointId: "SEA-CP-002", contract: "mixed-facing block placement", definingDiscriminators: ["MIXED_ROW", "BLOCK_PLACEMENT"] },
  { blueprintId: "SEA-PBA-008", checkpointId: "SEA-CP-002", contract: "exact-gap relations under mixed facing", definingDiscriminators: ["MIXED_ROW", "EXACT_GAP"] },
  { blueprintId: "SEA-PBA-009", checkpointId: "SEA-CP-003", contract: "centre-facing opposite-anchor cycle", definingDiscriminators: ["CENTER", "OPPOSITE", "EVEN_ONLY"] },
  { blueprintId: "SEA-PBA-010", checkpointId: "SEA-CP-003", contract: "centre-facing linked clockwise block", definingDiscriminators: ["CENTER", "CLOCKWISE_BLOCK"] },
  { blueprintId: "SEA-PBA-011", checkpointId: "SEA-CP-003", contract: "centre-facing gap and adjacency mix", definingDiscriminators: ["CENTER", "DIRECTED_GAP", "ADJACENCY"] },
  { blueprintId: "SEA-PBA-012", checkpointId: "SEA-CP-003", contract: "centre-facing external-landmark anchor with elimination", definingDiscriminators: ["CENTER", "EXTERNAL_LANDMARK", "ELIMINATION"] },
  { blueprintId: "SEA-PBA-013", checkpointId: "SEA-CP-004", contract: "outward-facing opposite-anchor cycle", definingDiscriminators: ["OUTWARD", "OPPOSITE", "EVEN_ONLY"] },
  { blueprintId: "SEA-PBA-014", checkpointId: "SEA-CP-004", contract: "outward left/right reversal-intensive chain", definingDiscriminators: ["OUTWARD", "REVERSAL_INTENSIVE"] },
  { blueprintId: "SEA-PBA-015", checkpointId: "SEA-CP-004", contract: "outward gap and neighbour mix", definingDiscriminators: ["OUTWARD", "DIRECTED_GAP", "NEIGHBOUR"] },
  { blueprintId: "SEA-PBA-016", checkpointId: "SEA-CP-004", contract: "outward external-landmark anchor and reversal", definingDiscriminators: ["OUTWARD", "EXTERNAL_LANDMARK", "REVERSAL"] },
  { blueprintId: "SEA-PBA-017", checkpointId: "SEA-CP-005", contract: "mixed-facing known-direction ring", definingDiscriminators: ["MIXED_CIRCLE", "KNOWN_FACING"] },
  { blueprintId: "SEA-PBA-018", checkpointId: "SEA-CP-005", contract: "mixed-facing inferred-direction ring", definingDiscriminators: ["MIXED_CIRCLE", "INFERRED_FACING"] },
  { blueprintId: "SEA-PBA-019", checkpointId: "SEA-CP-005", contract: "mixed-facing opposite and gap chain", definingDiscriminators: ["MIXED_CIRCLE", "OPPOSITE", "DIRECTED_GAP", "EVEN_ONLY"] },
  { blueprintId: "SEA-PBA-020", checkpointId: "SEA-CP-005", contract: "mixed-facing conditional orientation", definingDiscriminators: ["MIXED_CIRCLE", "CONDITIONAL_FACING"] },
] as const;

function distinctSorted(values: Iterable<string>): readonly string[] {
  return [...new Set(values)].sort();
}

function constraintKindUnion(caselets: readonly AuditCaselet[]): readonly string[] {
  return distinctSorted(caselets.flatMap((caselet) => caselet.constraints?.map((constraint) => constraint.kind) ?? []));
}

function answerTypeUnion(caselets: readonly AuditCaselet[]): readonly string[] {
  return distinctSorted(caselets.flatMap((caselet) => caselet.children.map((child) => child.answerType)));
}

function queryContractUnion(caselets: readonly AuditCaselet[]): readonly string[] {
  return distinctSorted(caselets.flatMap((caselet) => caselet.children.map((child) => child.queryContractId)));
}

function skillUnion(caselets: readonly AuditCaselet[]): readonly string[] {
  return distinctSorted(caselets.flatMap((caselet) => caselet.checkpointSkillCoverage));
}

function solutionPolicyUnion(caselets: readonly AuditCaselet[]): readonly string[] {
  return distinctSorted(caselets.map((caselet) => String(caselet.solutionPolicy ?? "UNIQUE_CLASS")));
}

function executionSignature(caselets: readonly AuditCaselet[]): string {
  return JSON.stringify({
    checkpoint: caselets[0]?.checkpointId,
    constraintKinds: constraintKindUnion(caselets),
    answerTypes: answerTypeUnion(caselets),
    skills: skillUnion(caselets),
    solutionPolicies: solutionPolicyUnion(caselets),
    landmarkPolicy: caselets.some((caselet) => Boolean(caselet.topologySnapshot?.landmark)) ? "MAY_HAVE_LANDMARK" : "NO_LANDMARK",
  });
}

export interface MergeSplitDecision {
  readonly blueprintId: string;
  readonly checkpointId: Sea001CheckpointId;
  readonly authorityContract: string;
  readonly decision: AuditDecision;
  readonly observedCaselets: number;
  readonly definingDiscriminators: readonly string[];
  readonly constraintKinds: readonly string[];
  readonly answerTypes: readonly string[];
  readonly queryContracts: readonly string[];
  readonly skillCoverage: readonly string[];
  readonly solutionPolicies: readonly string[];
  readonly rationale: string;
}

export interface MergeSplitAudit {
  readonly decisions: readonly MergeSplitDecision[];
  readonly mergeCandidatePairs: readonly (readonly [string, string])[];
  readonly splitCandidates: readonly string[];
  readonly missingAuthorities: readonly string[];
  readonly passed: boolean;
}

export function runSea001MergeSplitAudit(corpus: readonly AuditCaselet[]): MergeSplitAudit {
  const decisions: MergeSplitDecision[] = [];
  const missingAuthorities: string[] = [];
  const signatureByBlueprint = new Map<string, string>();

  for (const authority of SEA001_BLUEPRINT_AUTHORITY_DESCRIPTORS) {
    const caselets = corpus.filter((caselet) => caselet.blueprintAuthorityId === authority.blueprintId);
    if (caselets.length === 0) {
      missingAuthorities.push(authority.blueprintId);
      continue;
    }
    const policies = solutionPolicyUnion(caselets);
    const splitCandidate = policies.length > 1;
    const signature = executionSignature(caselets);
    signatureByBlueprint.set(authority.blueprintId, signature);
    decisions.push({
      blueprintId: authority.blueprintId,
      checkpointId: authority.checkpointId,
      authorityContract: authority.contract,
      decision: splitCandidate ? "SPLIT_CANDIDATE" : "RETAIN_SEPARATE",
      observedCaselets: caselets.length,
      definingDiscriminators: authority.definingDiscriminators,
      constraintKinds: constraintKindUnion(caselets),
      answerTypes: answerTypeUnion(caselets),
      queryContracts: queryContractUnion(caselets),
      skillCoverage: skillUnion(caselets),
      solutionPolicies: policies,
      rationale: splitCandidate
        ? "Observed more than one solution-policy contract inside one provisional authority."
        : `Retain the named V3 authority while its defining discriminator remains distinct: ${authority.definingDiscriminators.join(", ")}.`,
    });
  }

  const mergeCandidatePairs: (readonly [string, string])[] = [];
  for (let firstIndex = 0; firstIndex < SEA001_BLUEPRINT_AUTHORITY_DESCRIPTORS.length; firstIndex += 1) {
    const first = SEA001_BLUEPRINT_AUTHORITY_DESCRIPTORS[firstIndex];
    if (!first) continue;
    for (let secondIndex = firstIndex + 1; secondIndex < SEA001_BLUEPRINT_AUTHORITY_DESCRIPTORS.length; secondIndex += 1) {
      const second = SEA001_BLUEPRINT_AUTHORITY_DESCRIPTORS[secondIndex];
      if (!second || first.checkpointId !== second.checkpointId) continue;
      const sameAuthorityDiscriminator = JSON.stringify([...first.definingDiscriminators].sort())
        === JSON.stringify([...second.definingDiscriminators].sort());
      const sameExecutionSignature = signatureByBlueprint.get(first.blueprintId) === signatureByBlueprint.get(second.blueprintId);
      if (sameAuthorityDiscriminator && sameExecutionSignature) {
        mergeCandidatePairs.push([first.blueprintId, second.blueprintId]);
      }
    }
  }

  const splitCandidates = decisions
    .filter((decision) => decision.decision === "SPLIT_CANDIDATE")
    .map((decision) => decision.blueprintId);
  return {
    decisions,
    mergeCandidatePairs,
    splitCandidates,
    missingAuthorities,
    passed: missingAuthorities.length === 0 && mergeCandidatePairs.length === 0 && splitCandidates.length === 0,
  };
}

export interface InverseAudit {
  readonly linearRoundTrips: number;
  readonly linearFacingInversions: number;
  readonly cyclicRoundTrips: number;
  readonly centreOutwardFacingInversions: number;
  readonly oppositeInvolutions: number;
  readonly oddOppositeGuards: number;
  readonly arcComplementChecks: number;
  readonly mixedFacingDoubleInversions: number;
  readonly passed: boolean;
}

function oppositeDirection(direction: "LEFT" | "RIGHT"): "LEFT" | "RIGHT" {
  return direction === "LEFT" ? "RIGHT" : "LEFT";
}

function oppositeCyclic(direction: "CLOCKWISE" | "ANTICLOCKWISE"): "CLOCKWISE" | "ANTICLOCKWISE" {
  return direction === "CLOCKWISE" ? "ANTICLOCKWISE" : "CLOCKWISE";
}

export function runSea001InverseAudit(): InverseAudit {
  let linearRoundTrips = 0;
  let linearFacingInversions = 0;
  let cyclicRoundTrips = 0;
  let centreOutwardFacingInversions = 0;
  let oppositeInvolutions = 0;
  let oddOppositeGuards = 0;
  let arcComplementChecks = 0;
  let mixedFacingDoubleInversions = 0;

  for (const seatCount of [5, 6, 7, 8]) {
    const topology = new LinearTopology(seatCount);
    for (let seatIndex = 0; seatIndex < seatCount; seatIndex += 1) {
      const seatId = topology.seatId(seatIndex);
      for (const facing of ["NORTH", "SOUTH"] as const) {
        const invertedFacing = facing === "NORTH" ? "SOUTH" : "NORTH";
        for (const direction of ["LEFT", "RIGHT"] as const) {
          for (let steps = 1; steps < seatCount; steps += 1) {
            const target = topology.moveRelative({ seatId, facing, direction, steps });
            if (target === null) continue;
            const roundTrip = topology.moveRelative({ seatId: target, facing, direction: oppositeDirection(direction), steps });
            if (roundTrip !== seatId) throw new Error(`Linear inverse failed for N=${seatCount}/${seatId}/${facing}/${direction}/${steps}`);
            linearRoundTrips += 1;
            const transformed = topology.moveRelative({ seatId, facing: invertedFacing, direction: oppositeDirection(direction), steps });
            if (transformed !== target) throw new Error(`Linear facing inversion failed for N=${seatCount}/${seatId}/${facing}/${direction}/${steps}`);
            linearFacingInversions += 1;
          }
        }
      }
    }
  }

  for (const seatCount of [6, 7, 8, 9, 10]) {
    const topology = new CircularTopology(seatCount);
    for (let seatIndex = 0; seatIndex < seatCount; seatIndex += 1) {
      for (const direction of ["CLOCKWISE", "ANTICLOCKWISE"] as const) {
        for (let steps = 1; steps < seatCount; steps += 1) {
          const target = topology.moveCyclic(seatIndex, direction, steps);
          const roundTrip = topology.moveCyclic(target, oppositeCyclic(direction), steps);
          if (roundTrip !== seatIndex) throw new Error(`Cyclic inverse failed for N=${seatCount}/${seatIndex}/${direction}/${steps}`);
          cyclicRoundTrips += 1;
        }
      }
      for (const direction of ["LEFT", "RIGHT"] as const) {
        for (let steps = 1; steps < seatCount; steps += 1) {
          const centreTarget = topology.moveRelativeCentre(seatIndex, direction, steps);
          const outwardTransformed = topology.moveRelativeOutward(seatIndex, oppositeDirection(direction), steps);
          if (centreTarget !== outwardTransformed) throw new Error(`Centre/outward facing inversion failed for N=${seatCount}/${seatIndex}/${direction}/${steps}`);
          centreOutwardFacingInversions += 1;
        }
      }
      const opposite = topology.oppositeSeatIndex(seatIndex);
      if (seatCount % 2 === 0) {
        if (opposite === null || topology.oppositeSeatIndex(opposite) !== seatIndex) throw new Error(`Opposite involution failed for N=${seatCount}/${seatIndex}`);
        oppositeInvolutions += 1;
      } else {
        if (opposite !== null) throw new Error(`Odd circle exposed an opposite seat for N=${seatCount}`);
        oddOppositeGuards += 1;
      }
      for (let secondSeat = 0; secondSeat < seatCount; secondSeat += 1) {
        if (secondSeat === seatIndex) continue;
        const clockwise = topology.countBetween(seatIndex, secondSeat, "CLOCKWISE");
        const anticlockwise = topology.countBetween(seatIndex, secondSeat, "ANTICLOCKWISE");
        if (clockwise + anticlockwise !== seatCount - 2) throw new Error(`Arc complement failed for N=${seatCount}/${seatIndex}/${secondSeat}`);
        arcComplementChecks += 1;
      }
    }
  }

  for (const facing of ["CENTER", "OUTWARD"] as const) {
    if (oppositeFacing(oppositeFacing(facing)) !== facing) throw new Error(`Mixed-circle facing double inversion failed for ${facing}`);
    mixedFacingDoubleInversions += 1;
  }

  return {
    linearRoundTrips,
    linearFacingInversions,
    cyclicRoundTrips,
    centreOutwardFacingInversions,
    oppositeInvolutions,
    oddOppositeGuards,
    arcComplementChecks,
    mixedFacingDoubleInversions,
    passed: true,
  };
}

export type GapDisposition =
  | "COVERED"
  | "PACKAGE_BOUNDARY"
  | "SOURCE_GATED"
  | "OPEN_GOVERNANCE"
  | "GENUINE_MISSING_IMPLEMENTATION";

export interface GapRecord {
  readonly id: string;
  readonly disposition: GapDisposition;
  readonly statement: string;
}

export interface GapAudit {
  readonly records: readonly GapRecord[];
  readonly checkpointSeatCounts: Readonly<Record<string, readonly number[]>>;
  readonly checkpointQueryContracts: Readonly<Record<string, readonly string[]>>;
  readonly technicalGapCount: number;
  readonly openGovernanceCount: number;
  readonly passedAutomatedGate: boolean;
  readonly eligibleForPermanentAllocation: boolean;
}

function queryContractsForCheckpoint(corpus: readonly AuditCaselet[], checkpointId: Sea001CheckpointId): readonly string[] {
  return distinctSorted(corpus
    .filter((caselet) => caselet.checkpointId === checkpointId)
    .flatMap((caselet) => caselet.children.map((child) => child.queryContractId)));
}

function seatCountsForCheckpoint(corpus: readonly AuditCaselet[], checkpointId: Sea001CheckpointId): readonly number[] {
  return [...new Set(corpus
    .filter((caselet) => caselet.checkpointId === checkpointId)
    .map(seatCountOf))]
    .sort((left, right) => left - right);
}

function hasOddOppositeDefect(caselet: AuditCaselet): boolean {
  if (seatCountOf(caselet) % 2 === 0) return false;
  if (caselet.children.some((child) => child.queryContractId === "SEA-QC-010")) return true;
  return caselet.constraints?.some((constraint) => constraint.kind === "OPPOSITE") ?? false;
}

export function runSea001GapAudit(corpus: readonly AuditCaselet[]): GapAudit {
  const records: GapRecord[] = [];
  const checkpointSeatCounts = Object.fromEntries(
    (["SEA-CP-001", "SEA-CP-002", "SEA-CP-003", "SEA-CP-004", "SEA-CP-005"] as const)
      .map((checkpointId) => [checkpointId, seatCountsForCheckpoint(corpus, checkpointId)]),
  ) as Readonly<Record<string, readonly number[]>>;
  const checkpointQueryContracts = Object.fromEntries(
    (["SEA-CP-001", "SEA-CP-002", "SEA-CP-003", "SEA-CP-004", "SEA-CP-005"] as const)
      .map((checkpointId) => [checkpointId, queryContractsForCheckpoint(corpus, checkpointId)]),
  ) as Readonly<Record<string, readonly string[]>>;

  const expectedSeatCounts: Readonly<Record<string, readonly number[]>> = {
    "SEA-CP-001": [5, 6, 7, 8],
    "SEA-CP-002": [6, 7, 8],
    "SEA-CP-003": [6, 7, 8, 9, 10],
    "SEA-CP-004": [6, 7, 8, 9, 10],
    "SEA-CP-005": [6, 7],
  };
  for (const [checkpointId, expected] of Object.entries(expectedSeatCounts)) {
    const observed = checkpointSeatCounts[checkpointId] ?? [];
    const missing = expected.filter((seatCount) => !observed.includes(seatCount));
    records.push({
      id: `GAP-SEAT-${checkpointId}`,
      disposition: missing.length === 0 ? "COVERED" : "GENUINE_MISSING_IMPLEMENTATION",
      statement: missing.length === 0
        ? `${checkpointId} exercises the implemented V3 seat-count partitions: ${observed.join(", ")}.`
        : `${checkpointId} is missing seat-count partitions: ${missing.join(", ")}.`,
    });
  }

  const missingAuthorities = SEA001_BLUEPRINT_AUTHORITY_DESCRIPTORS
    .filter((authority) => !corpus.some((caselet) => caselet.blueprintAuthorityId === authority.blueprintId))
    .map((authority) => authority.blueprintId);
  records.push({
    id: "GAP-PBA-001-020",
    disposition: missingAuthorities.length === 0 ? "COVERED" : "GENUINE_MISSING_IMPLEMENTATION",
    statement: missingAuthorities.length === 0
      ? "All 20 SEA-001 provisional blueprint authorities are reachable."
      : `Unreachable SEA-001 provisional authorities: ${missingAuthorities.join(", ")}.`,
  });

  const oddOppositeDefects = corpus.filter((caselet) =>
    (caselet.checkpointId === "SEA-CP-003" || caselet.checkpointId === "SEA-CP-004")
    && hasOddOppositeDefect(caselet));
  records.push({
    id: "GAP-ODD-OPPOSITE-GUARD",
    disposition: oddOppositeDefects.length === 0 ? "COVERED" : "GENUINE_MISSING_IMPLEMENTATION",
    statement: oddOppositeDefects.length === 0
      ? "Odd circular variants are exercised without opposite clues or direct-opposite questions."
      : `${oddOppositeDefects.length} odd circular caselets violate the opposite-seat guard.`,
  });

  const cp003Landmarks = corpus.filter((caselet) => caselet.blueprintAuthorityId === "SEA-PBA-012" && Boolean(caselet.topologySnapshot?.landmark));
  const cp004Landmarks = corpus.filter((caselet) => caselet.blueprintAuthorityId === "SEA-PBA-016" && Boolean(caselet.topologySnapshot?.landmark));
  records.push({
    id: "GAP-LANDMARK-ANCHORS",
    disposition: cp003Landmarks.length > 0 && cp004Landmarks.length > 0 ? "COVERED" : "GENUINE_MISSING_IMPLEMENTATION",
    statement: `External-landmark variants observed: centre=${cp003Landmarks.length}, outward=${cp004Landmarks.length}.`,
  });

  const cp005Mixed = corpus.filter((caselet) => caselet.checkpointId === "SEA-CP-005").every((caselet) => {
    const key = caselet.solverOracleAgreement.productionKeys[0] ?? "";
    return /CENTER/.test(key) && /OUTWARD/.test(key);
  });
  records.push({
    id: "GAP-CP005-MIXED-FACING",
    disposition: cp005Mixed ? "COVERED" : "GENUINE_MISSING_IMPLEMENTATION",
    statement: cp005Mixed ? "Every sampled CP-005 solved state is genuinely mixed-facing." : "At least one CP-005 sampled state is not genuinely mixed-facing.",
  });

  const cp001QueryContracts = checkpointQueryContracts["SEA-CP-001"] ?? [];
  records.push({
    id: "GAP-CP001-QUERY-TEMPLATE-ROADMAP",
    disposition: cp001QueryContracts.length >= 10 ? "COVERED" : "OPEN_GOVERNANCE",
    statement: cp001QueryContracts.length >= 10
      ? `CP-001 reaches at least ten distinct query-contract families (${cp001QueryContracts.length}).`
      : `CP-001 currently reaches ${cp001QueryContracts.length} distinct query-contract families; V3 Wave 2 separately requests ten query templates, so template-level review remains open even though package query-surface saturation passes.`,
  });

  records.push(
    { id: "GAP-SEA001-SOURCE-AUDIT", disposition: "OPEN_GOVERNANCE", statement: "Final SSC/Banking/Railway/Punjab source-audit evidence must be closed before permanent allocation; this executable audit does not substitute for source evidence." },
    { id: "GAP-SEA001-MANUAL-ENGLISH-REVIEW", disposition: "OPEN_GOVERNANCE", statement: "The 100-caselet English review corpus exists, but its caselet and child decisions remain human-review inputs until REWRITE and REJECT are both zero." },
    { id: "GAP-CP001-AUTHORITY-COUNT", disposition: "OPEN_GOVERNANCE", statement: "V3 roadmap text requests five CP-001 provisional blueprints while the authoritative inventory names SEA-PBA-001 through SEA-PBA-004; no fifth authority is invented without governance resolution." },
  );

  records.push(
    { id: "GAP-SEA002-BOUNDARY", disposition: "PACKAGE_BOUNDARY", statement: "Parallel rows, square/rectangle/polygon and concentric-ring contracts belong to SEA-002 and are not missing SEA-001 work." },
    { id: "GAP-SEA003-BOUNDARY", disposition: "PACKAGE_BOUNDARY", statement: "Attribute, vacancy, conditional, ranking-linked and controlled multi-model contracts belong to SEA-003 and are not missing SEA-001 work." },
    { id: "GAP-SOURCE-GATED-HYPOTHETICALS", disposition: "SOURCE_GATED", statement: "Insertion/removal and exact truth-set/arrangement-count query contracts remain source-gated and are not promoted into SEA-001 without source evidence." },
  );

  const technicalGapCount = records.filter((record) => record.disposition === "GENUINE_MISSING_IMPLEMENTATION").length;
  const openGovernanceCount = records.filter((record) => record.disposition === "OPEN_GOVERNANCE").length;
  return {
    records,
    checkpointSeatCounts,
    checkpointQueryContracts,
    technicalGapCount,
    openGovernanceCount,
    passedAutomatedGate: technicalGapCount === 0,
    eligibleForPermanentAllocation: technicalGapCount === 0 && openGovernanceCount === 0,
  };
}
