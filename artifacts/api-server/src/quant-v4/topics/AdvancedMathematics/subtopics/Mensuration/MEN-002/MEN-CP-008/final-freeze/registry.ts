import {
  MEN_CP_008_CANDIDATE_FAMILY_REGISTRY,
} from "../../cp008-chapter-audit/candidate-registry";
import type { MenCp008AnyPrototypeId } from "../../cp008-chapter-audit/compression";

export interface MenCp008FrozenQlDefinition {
  qlId: string;
  templateId: string;
  candidateId: string;
  canonicalKey: string;
  title: string;
  prototypeIds: readonly MenCp008AnyPrototypeId[];
  mergeRule: "PARAMETERISED_FAMILY" | "STANDALONE_FAMILY";
  maturity: "IMPLEMENTATION_PROOF";
  allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF";
  permanentIdentityFrozen: true;
  questionStudioDiscoverable: false;
  publiclyPublishable: false;
}

function qlId(index: number) {
  return `MEN-002-QL-${String(44 + index).padStart(3, "0")}`;
}

function titleFromKey(key: string) {
  return key
    .toLowerCase()
    .split("_")
    .map((word) => word ? `${word[0]!.toUpperCase()}${word.slice(1)}` : word)
    .join(" ");
}

export const MEN_CP_008_FROZEN_QLS: readonly MenCp008FrozenQlDefinition[] =
  MEN_CP_008_CANDIDATE_FAMILY_REGISTRY.map((candidate, index) => ({
    qlId: qlId(index),
    templateId: `MEN-CP008-TPL-${String(index + 1).padStart(3, "0")}`,
    candidateId: candidate.candidateId,
    canonicalKey: candidate.canonicalKey,
    title: titleFromKey(candidate.canonicalKey),
    prototypeIds: candidate.ancestries,
    mergeRule: candidate.origin === "SETTLED_MERGE_GROUP"
      ? "PARAMETERISED_FAMILY" as const
      : "STANDALONE_FAMILY" as const,
    maturity: "IMPLEMENTATION_PROOF" as const,
    allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF" as const,
    permanentIdentityFrozen: true as const,
    questionStudioDiscoverable: false as const,
    publiclyPublishable: false as const,
  }));

const byQlId = new Map(MEN_CP_008_FROZEN_QLS.map((definition) => [definition.qlId, definition]));
const byPrototypeId = new Map<MenCp008AnyPrototypeId, MenCp008FrozenQlDefinition>();
for (const definition of MEN_CP_008_FROZEN_QLS) {
  for (const prototypeId of definition.prototypeIds) {
    if (byPrototypeId.has(prototypeId)) {
      throw new Error(`Duplicate MEN-CP-008 permanent ancestry: ${prototypeId}`);
    }
    byPrototypeId.set(prototypeId, definition);
  }
}

export function getMenCp008FrozenQlDefinition(qlId: string) {
  const definition = byQlId.get(qlId);
  if (!definition) throw new Error(`Unknown MEN-CP-008 permanent QL: ${qlId}`);
  return definition;
}

export function getMenCp008FrozenQlForPrototype(prototypeId: MenCp008AnyPrototypeId) {
  const definition = byPrototypeId.get(prototypeId);
  if (!definition) throw new Error(`No permanent MEN-CP-008 family for prototype: ${prototypeId}`);
  return definition;
}

export function getMenCp008FrozenQlIds() {
  return MEN_CP_008_FROZEN_QLS.map((definition) => definition.qlId);
}

export function auditMenCp008FrozenRegistry() {
  const qlIds = getMenCp008FrozenQlIds();
  const ancestryIds = MEN_CP_008_FROZEN_QLS.flatMap((definition) => definition.prototypeIds);
  const expectedIds = MEN_CP_008_FROZEN_QLS.map((_definition, index) => qlId(index));
  return {
    qlCount: MEN_CP_008_FROZEN_QLS.length,
    firstQlId: qlIds[0],
    lastQlId: qlIds.at(-1),
    uniqueQlIds: new Set(qlIds).size,
    contiguousQlIds: JSON.stringify(qlIds) === JSON.stringify(expectedIds),
    ancestryCount: ancestryIds.length,
    uniqueAncestryCount: new Set(ancestryIds).size,
    permanentIdentityFrozen: MEN_CP_008_FROZEN_QLS.every((definition) => definition.permanentIdentityFrozen),
    lifecycleLocked: MEN_CP_008_FROZEN_QLS.every(
      (definition) => !definition.questionStudioDiscoverable && !definition.publiclyPublishable,
    ),
  } as const;
}
