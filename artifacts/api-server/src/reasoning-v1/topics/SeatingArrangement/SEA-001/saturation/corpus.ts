import { canonicalDigest } from "../canonical.ts";
import { SEA_001_BLUEPRINTS } from "../manifest.ts";
import { generateSeaCp001Caselet } from "../generation/caselet-assembler.ts";
import type { SeatingBlueprintId } from "../types.ts";
import {
  assertMixedFacingCaseletIntegrity,
  generateMixedFacingCaselet,
  SEA_CP002_BLUEPRINTS,
} from "../cp002/generator.ts";
import type { MixedFacingBlueprintId } from "../cp002/types.ts";
import {
  assertCircularCaseletIntegrity,
  generateCircularCaselet,
  SEA_CP003_BLUEPRINTS,
} from "../cp003/generator.ts";
import type { CircularBlueprintId } from "../cp003/types.ts";
import {
  assertOutwardCaseletIntegrity,
  generateOutwardCaselet,
  SEA_CP004_BLUEPRINTS,
} from "../cp004/generator.ts";
import type { OutwardBlueprintId } from "../cp004/types.ts";
import {
  assertMixedCircleCaseletIntegrity,
  generateMixedCircleCaselet,
  SEA_CP005_BLUEPRINTS,
} from "../cp005/generator.ts";
import type { MixedCircleBlueprintId } from "../cp005/types.ts";

export type Sea001CheckpointId =
  | "SEA-CP-001"
  | "SEA-CP-002"
  | "SEA-CP-003"
  | "SEA-CP-004"
  | "SEA-CP-005";

export interface AuditOption {
  readonly semanticFingerprint: string;
  readonly display: string;
  readonly isCorrect: boolean;
  readonly misconceptionId?: string;
  readonly recomputation: Readonly<Record<string, unknown>>;
  readonly explanation: string;
}

export interface AuditChild {
  readonly questionOrder: number;
  readonly queryContractId: string;
  readonly answerType: string;
  readonly answerDeterminingFactFingerprint: string;
  readonly text: string;
  readonly options: readonly AuditOption[];
  readonly answerIndex: number;
  readonly answer: unknown;
  readonly explanation: string;
}

export interface AuditConstraint {
  readonly id?: string;
  readonly kind: string;
  readonly [key: string]: unknown;
}

export interface AuditCaselet {
  readonly caseletId: string;
  readonly checkpointId: Sea001CheckpointId;
  readonly blueprintAuthorityId: string;
  readonly seed: string;
  readonly locale: string;
  readonly setupText: string;
  readonly clueTexts: readonly string[];
  readonly constraints?: readonly AuditConstraint[];
  readonly clueSetFingerprint?: string;
  readonly solutionPolicy?: string;
  readonly solutionClassCount?: number;
  readonly solutionStateClassCount?: number;
  readonly proofTrace?: readonly unknown[];
  readonly solverOracleAgreement: {
    readonly productionKeys: readonly string[];
    readonly oracleKeys: readonly string[];
    readonly passed: boolean;
  };
  readonly checkpointSkillCoverage: readonly string[];
  readonly queryFactFingerprints: readonly string[];
  readonly crossQuestionLeakagePassed: boolean;
  readonly sharedExplanation: string;
  readonly diagramText?: string;
  readonly diagram?: { readonly text?: string };
  readonly topologySnapshot?: {
    readonly seatCount?: number;
    readonly facing?: string;
    readonly landmark?: { readonly id?: string };
  };
  readonly children: readonly AuditChild[];
  readonly lifecycle: {
    readonly permanentQlCount: number;
    readonly questionStudioRegistered: boolean;
    readonly questionBankWritable: boolean;
    readonly testEligible: boolean;
    readonly publiclyPublishable: boolean;
  };
}

export interface SaturationCorpus {
  readonly caselets: readonly AuditCaselet[];
  readonly rejectedExactDuplicateCandidates: number;
  readonly rejectedNormalizedClueSetCandidates: number;
}

type BlueprintDescriptor = {
  readonly checkpointId: Sea001CheckpointId;
  readonly blueprintId: string;
  readonly generate: (seed: string) => AuditCaselet;
};

function asAuditCaselet(value: unknown): AuditCaselet {
  return value as AuditCaselet;
}

export function sea001BlueprintDescriptors(): readonly BlueprintDescriptor[] {
  const output: BlueprintDescriptor[] = [];
  for (const blueprintId of SEA_001_BLUEPRINTS) {
    output.push({
      checkpointId: "SEA-CP-001",
      blueprintId,
      generate: (seed) => asAuditCaselet(generateSeaCp001Caselet({
        blueprintId: blueprintId as SeatingBlueprintId,
        seed,
      })),
    });
  }
  for (const blueprintId of SEA_CP002_BLUEPRINTS) {
    output.push({
      checkpointId: "SEA-CP-002",
      blueprintId,
      generate: (seed) => {
        const record = generateMixedFacingCaselet(seed, blueprintId as MixedFacingBlueprintId);
        assertMixedFacingCaseletIntegrity(record);
        return asAuditCaselet(record);
      },
    });
  }
  for (const blueprintId of SEA_CP003_BLUEPRINTS) {
    output.push({
      checkpointId: "SEA-CP-003",
      blueprintId,
      generate: (seed) => {
        const record = generateCircularCaselet(seed, blueprintId as CircularBlueprintId);
        assertCircularCaseletIntegrity(record);
        return asAuditCaselet(record);
      },
    });
  }
  for (const blueprintId of SEA_CP004_BLUEPRINTS) {
    output.push({
      checkpointId: "SEA-CP-004",
      blueprintId,
      generate: (seed) => {
        const record = generateOutwardCaselet(seed, blueprintId as OutwardBlueprintId);
        assertOutwardCaseletIntegrity(record);
        return asAuditCaselet(record);
      },
    });
  }
  for (const blueprintId of SEA_CP005_BLUEPRINTS) {
    output.push({
      checkpointId: "SEA-CP-005",
      blueprintId,
      generate: (seed) => {
        const record = generateMixedCircleCaselet(seed, blueprintId as MixedCircleBlueprintId);
        assertMixedCircleCaseletIntegrity(record);
        return asAuditCaselet(record);
      },
    });
  }
  return output;
}

function scrubConstraint(constraint: AuditConstraint): Readonly<Record<string, unknown>> {
  return Object.fromEntries(Object.entries(constraint)
    .filter(([key]) => key !== "id")
    .sort(([left], [right]) => left.localeCompare(right)));
}

export function normalizedClueSetFingerprint(caselet: AuditCaselet): string {
  if (caselet.clueSetFingerprint) return `${caselet.blueprintAuthorityId}:${caselet.clueSetFingerprint}`;
  if (caselet.constraints) {
    return canonicalDigest({
      blueprint: caselet.blueprintAuthorityId,
      constraints: caselet.constraints.map(scrubConstraint),
    });
  }
  return canonicalDigest({
    blueprint: caselet.blueprintAuthorityId,
    clues: caselet.clueTexts,
  });
}

export function exactCaseletContentFingerprint(caselet: AuditCaselet): string {
  return canonicalDigest({
    checkpoint: caselet.checkpointId,
    setup: caselet.setupText,
    clues: caselet.clueTexts,
    questions: caselet.children.map((child) => ({
      text: child.text,
      options: child.options.map((option) => option.display),
      answerIndex: child.answerIndex,
      explanation: child.explanation,
    })),
  });
}

export function seatCountOf(caselet: AuditCaselet): number {
  const topologyCount = caselet.topologySnapshot?.seatCount;
  if (topologyCount !== undefined) return topologyCount;
  const setupMatch = caselet.setupText.match(/^(\d+)\s+persons/i);
  if (setupMatch?.[1]) return Number(setupMatch[1]);
  const productionKey = caselet.solverOracleAgreement.productionKeys[0] ?? "";
  const orderPart = productionKey.split("|")[0] ?? "";
  const separator = orderPart.includes(">") ? ">" : ",";
  return orderPart.split(separator).filter(Boolean).length;
}

function facingPartition(caselet: AuditCaselet): string {
  if (caselet.checkpointId === "SEA-CP-001") {
    const facing = caselet.setupText.match(/all facing\s+(north|south)/i)?.[1]?.toUpperCase() ?? "UNKNOWN";
    return `same:${facing}`;
  }
  if (caselet.checkpointId === "SEA-CP-003") return "all:CENTER";
  if (caselet.checkpointId === "SEA-CP-004") return "all:OUTWARD";

  const key = caselet.solverOracleAgreement.productionKeys[0] ?? "";
  const facingText = key.split("|")[1] ?? "";
  const values = facingText.split(",")
    .map((entry) => entry.split(":")[1])
    .filter((value): value is string => Boolean(value));
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([facing, count]) => `${facing}:${count}`)
    .join(",") || "mixed:UNKNOWN";
}

function constraintKindSignature(caselet: AuditCaselet): string {
  if (!caselet.constraints) return `clues:${caselet.clueTexts.length}`;
  const counts = new Map<string, number>();
  for (const constraint of caselet.constraints) {
    counts.set(constraint.kind, (counts.get(constraint.kind) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([kind, count]) => `${kind}:${count}`)
    .join(",");
}

export function structuralVariantFingerprint(caselet: AuditCaselet): string {
  const seatCount = seatCountOf(caselet);
  const landmark = caselet.topologySnapshot?.landmark?.id ?? "NONE";
  const parity = seatCount % 2 === 0 ? "EVEN" : "ODD";
  return [
    caselet.blueprintAuthorityId,
    `N=${seatCount}`,
    `parity=${parity}`,
    `facing=${facingPartition(caselet)}`,
    `landmark=${landmark}`,
    `clues=${constraintKindSignature(caselet)}`,
  ].join("|");
}

export function querySurfaceFingerprint(caselet: AuditCaselet, child: AuditChild): string {
  return `${caselet.checkpointId}|${child.queryContractId}|${child.answerType}`;
}

export function buildSea001SaturationCorpus(
  acceptedPerBlueprint = 75,
): SaturationCorpus {
  const caselets: AuditCaselet[] = [];
  const exactSeen = new Set<string>();
  const clueSetSeen = new Set<string>();
  let rejectedExactDuplicateCandidates = 0;
  let rejectedNormalizedClueSetCandidates = 0;

  for (const descriptor of sea001BlueprintDescriptors()) {
    let accepted = 0;
    const maximumAttempts = acceptedPerBlueprint * 40;
    for (let attempt = 0; attempt < maximumAttempts && accepted < acceptedPerBlueprint; attempt += 1) {
      const seed = `sea001-saturation:${descriptor.blueprintId}:${String(attempt).padStart(4, "0")}`;
      const caselet = descriptor.generate(seed);
      const exact = exactCaseletContentFingerprint(caselet);
      if (exactSeen.has(exact)) {
        rejectedExactDuplicateCandidates += 1;
        continue;
      }
      const clueSet = normalizedClueSetFingerprint(caselet);
      const clueSetScope = `${descriptor.blueprintId}:${clueSet}`;
      if (clueSetSeen.has(clueSetScope)) {
        rejectedNormalizedClueSetCandidates += 1;
        continue;
      }
      exactSeen.add(exact);
      clueSetSeen.add(clueSetScope);
      caselets.push(caselet);
      accepted += 1;
    }
    if (accepted !== acceptedPerBlueprint) {
      throw new Error(`Saturation could only obtain ${accepted}/${acceptedPerBlueprint} unique caselets for ${descriptor.blueprintId}`);
    }
  }

  return {
    caselets,
    rejectedExactDuplicateCandidates,
    rejectedNormalizedClueSetCandidates,
  };
}

export function selectManualReviewCorpus(
  corpus: readonly AuditCaselet[],
  perBlueprint = 5,
): readonly AuditCaselet[] {
  const selected: AuditCaselet[] = [];
  for (const descriptor of sea001BlueprintDescriptors()) {
    const candidates = corpus.filter((caselet) => caselet.blueprintAuthorityId === descriptor.blueprintId);
    if (candidates.length < perBlueprint) throw new Error(`Insufficient review candidates for ${descriptor.blueprintId}`);
    selected.push(...candidates.slice(0, perBlueprint));
  }
  return selected;
}
