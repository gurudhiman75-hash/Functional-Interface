import {
  SER_CP007_TEMPLATE_PROBES_V71,
  type SerCp007TemplateProbe,
} from "../SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-compression-contract-v7-1";
import type { SerCp007EditorialQuestion } from "../SER-CP-007-ENGLISH-REMODEL/adaptive-review";
import {
  buildAdaptiveSerCp007ReviewV71,
  type SerCp007AdaptiveReviewV71,
} from "../SER-CP-007-ENGLISH-REMODEL/adaptive-review-v7-1";
import type { SerPermanentQlRegistryEntry } from "../SER-PERMANENT-QL-REGISTRY";
import {
  SER_CP007_FROZEN_TEMPLATE_BY_ID,
  type SerCp007FrozenTemplateAuthority,
} from "./ser-cp-007-english-freeze-authority";

export interface SerCp007AllocatedLifecycle {
  readonly permanentQlId: SerPermanentQlRegistryEntry["permanentQlId"];
  readonly identityStatus: "PERMANENT_ID_ALLOCATED";
  readonly contentStatus: "ENGLISH_FROZEN";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

export interface SerCp007PermanentEnglishPackage {
  readonly permanentQlId: SerPermanentQlRegistryEntry["permanentQlId"];
  readonly temporaryTemplateId: string;
  readonly seed: number;
  readonly question: SerCp007EditorialQuestion;
  readonly review: SerCp007AdaptiveReviewV71;
  readonly frozenTemplateAuthority: SerCp007FrozenTemplateAuthority;
  readonly registryEntry: SerPermanentQlRegistryEntry;
  readonly allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE";
  readonly reviewDecision: "APPROVED_FOR_PERMANENT_IDENTITY";
  readonly lifecycle: SerCp007AllocatedLifecycle;
}

const PROBE_BY_TEMPLATE_ID: Readonly<Record<string, SerCp007TemplateProbe>> =
  Object.freeze(
    Object.fromEntries(
      SER_CP007_TEMPLATE_PROBES_V71.map((probe) => [
        probe.temporaryTemplateId,
        probe,
      ]),
    ),
  );

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }
}

function allocatedLifecycle(
  permanentQlId: SerPermanentQlRegistryEntry["permanentQlId"],
): SerCp007AllocatedLifecycle {
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

export function generateSerCp007PermanentEnglishPackage(
  temporaryTemplateId: string,
  seed: number,
): SerCp007PermanentEnglishPackage {
  assertPositiveInteger(seed, "SER-CP-007 permanent English seed");
  const probe = PROBE_BY_TEMPLATE_ID[temporaryTemplateId];
  const frozenTemplateAuthority =
    SER_CP007_FROZEN_TEMPLATE_BY_ID[temporaryTemplateId];
  if (!probe || !frozenTemplateAuthority) {
    throw new Error(`Unknown frozen SER-CP-007 template: ${temporaryTemplateId}`);
  }

  const question = probe.generate(seed) as unknown as SerCp007EditorialQuestion;
  const review = buildAdaptiveSerCp007ReviewV71(question);
  const registryEntry = frozenTemplateAuthority.registryEntry;
  if (
    registryEntry.permanentQlId !== frozenTemplateAuthority.permanentQlId ||
    registryEntry.authorityId !== frozenTemplateAuthority.candidateAuthorityId
  ) {
    throw new Error(
      `Permanent Series registry binding failed for ${temporaryTemplateId}.`,
    );
  }
  if (
    question.temporaryTemplateId !== temporaryTemplateId ||
    question.seed !== seed
  ) {
    throw new Error(
      `Deterministic Series generation identity failed for ${temporaryTemplateId}:${seed}.`,
    );
  }
  if (
    question.options.length !== 4 ||
    new Set(question.options).size !== 4 ||
    question.options[question.correctIndex] !== question.correctAnswer
  ) {
    throw new Error(
      `Permanent Series option contract failed for ${temporaryTemplateId}:${seed}.`,
    );
  }

  const lifecycle = allocatedLifecycle(registryEntry.permanentQlId);
  return Object.freeze({
    permanentQlId: registryEntry.permanentQlId,
    temporaryTemplateId,
    seed,
    question,
    review,
    frozenTemplateAuthority,
    registryEntry,
    allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE" as const,
    reviewDecision: "APPROVED_FOR_PERMANENT_IDENTITY" as const,
    lifecycle,
  });
}

export function regenerateSerCp007PermanentEnglishPackage(input: {
  readonly temporaryTemplateId: string;
  readonly seed: number;
  readonly subtypeId: string;
  readonly learnerRenderer: string;
}): SerCp007PermanentEnglishPackage {
  const frozen = SER_CP007_FROZEN_TEMPLATE_BY_ID[input.temporaryTemplateId];
  if (!frozen) {
    throw new Error(`Unknown frozen SER-CP-007 template: ${input.temporaryTemplateId}`);
  }
  if (
    frozen.subtypeId !== input.subtypeId ||
    frozen.learnerRenderer !== input.learnerRenderer
  ) {
    throw new Error(
      `Stored Series subtype metadata does not match ${input.temporaryTemplateId}.`,
    );
  }
  return generateSerCp007PermanentEnglishPackage(
    input.temporaryTemplateId,
    input.seed,
  );
}

export function generateSerCp007PermanentEnglishSweep(
  seedsPerTemplate: number,
): readonly SerCp007PermanentEnglishPackage[] {
  assertPositiveInteger(
    seedsPerTemplate,
    "SER-CP-007 permanent sweep seeds per template",
  );
  const packages: SerCp007PermanentEnglishPackage[] = [];
  for (const probe of SER_CP007_TEMPLATE_PROBES_V71) {
    for (let seed = 1; seed <= seedsPerTemplate; seed += 1) {
      packages.push(
        generateSerCp007PermanentEnglishPackage(
          probe.temporaryTemplateId,
          seed,
        ),
      );
    }
  }
  return Object.freeze(packages);
}
