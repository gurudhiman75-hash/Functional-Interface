import type {
  SapCp001PermanentQlId,
  SapPermanentQlRegistryEntry,
} from "../../../SAP-PERMANENT-QL-REGISTRY";
import type { SapCp001EnglishTemplateId } from "../SAP-CP-001-ENGLISH-TEMPLATE-PROPOSAL";
import type {
  SapCp001EnglishCandidate,
  SapCp001EnglishTechnicalDetails,
} from "../english-freeze/types";

export interface SapCp001AllocatedLifecycle {
  readonly permanentQlId: SapCp001PermanentQlId;
  readonly identityStatus: "PERMANENT_ID_ALLOCATED";
  readonly contentStatus: "ENGLISH_FROZEN";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

export interface SapCp001AllocatedTechnicalDetails extends Omit<
  SapCp001EnglishTechnicalDetails,
  "lifecycle"
> {
  readonly lifecycle: SapCp001AllocatedLifecycle;
}

export interface SapCp001PermanentEnglishPackage extends Omit<
  SapCp001EnglishCandidate,
  "permanentQlId" | "reviewDecision" | "technicalDetails"
> {
  readonly templateId: SapCp001EnglishTemplateId;
  readonly permanentQlId: SapCp001PermanentQlId;
  readonly reviewDecision: "APPROVED_FOR_PERMANENT_IDENTITY";
  readonly allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE";
  readonly registryEntry: SapPermanentQlRegistryEntry;
  readonly lifecycle: SapCp001AllocatedLifecycle;
  readonly technicalDetails: SapCp001AllocatedTechnicalDetails;
}
