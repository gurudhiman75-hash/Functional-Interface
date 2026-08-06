import {
  SAP_CP001_TEMPLATE_TO_PERMANENT_QL,
  SAP_PERMANENT_QL_BY_ID,
} from "../../../SAP-PERMANENT-QL-REGISTRY";
import {
  SAP_CP001_ALL_PROTOTYPE_IDS,
  type SapCp001PrototypeId,
} from "../SAP-CP-001-ENGLISH-TEMPLATE-PROPOSAL";
import { generateSapCp001EnglishCandidate } from "../english-freeze/runtime";
import type {
  SapCp001AllocatedLifecycle,
  SapCp001PermanentEnglishPackage,
} from "./types";

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }
}

function allocatedLifecycle(
  permanentQlId: SapCp001PermanentEnglishPackage["permanentQlId"],
): SapCp001AllocatedLifecycle {
  return Object.freeze({
    permanentQlId,
    identityStatus: "PERMANENT_ID_ALLOCATED" as const,
    contentStatus: "ENGLISH_FROZEN" as const,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  });
}

export function generateSapCp001PermanentEnglishPackage(
  prototypeId: SapCp001PrototypeId,
  seed: number,
): SapCp001PermanentEnglishPackage {
  assertPositiveInteger(seed, "SAP-CP-001 permanent English seed");
  if (!SAP_CP001_ALL_PROTOTYPE_IDS.includes(prototypeId as never)) {
    throw new Error(`Unknown SAP-CP-001 prototype: ${prototypeId}`);
  }

  const frozen = generateSapCp001EnglishCandidate(prototypeId, seed);
  const templateId = frozen.proposedTemplateId;
  const permanentQlId = SAP_CP001_TEMPLATE_TO_PERMANENT_QL[templateId];
  const registryEntry = SAP_PERMANENT_QL_BY_ID[permanentQlId];

  if (registryEntry.templateId !== templateId) {
    throw new Error(`${templateId} is not bound to ${permanentQlId} in the permanent registry.`);
  }
  if (!registryEntry.prototypeAncestry.includes(prototypeId)) {
    throw new Error(`${prototypeId} is not part of ${permanentQlId} prototype ancestry.`);
  }
  if (frozen.permanentQlId !== null) {
    throw new Error("The immutable English-freeze candidate unexpectedly contains a permanent QL ID.");
  }

  const lifecycle = allocatedLifecycle(permanentQlId);
  return Object.freeze({
    ...frozen,
    templateId,
    permanentQlId,
    reviewDecision: "APPROVED_FOR_PERMANENT_IDENTITY" as const,
    allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE" as const,
    registryEntry,
    lifecycle,
    technicalDetails: Object.freeze({
      ...frozen.technicalDetails,
      lifecycle,
    }),
  });
}

export function generateSapCp001PermanentEnglishSweep(
  seedsPerPrototype: number,
): readonly SapCp001PermanentEnglishPackage[] {
  assertPositiveInteger(seedsPerPrototype, "SAP-CP-001 permanent sweep seeds per prototype");
  const packages: SapCp001PermanentEnglishPackage[] = [];
  for (const prototypeId of SAP_CP001_ALL_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) {
      packages.push(generateSapCp001PermanentEnglishPackage(prototypeId, seed));
    }
  }
  return Object.freeze(packages);
}
