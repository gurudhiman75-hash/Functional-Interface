export type ClsCp008Disposition =
  | "MERGE_EXISTING_QL"
  | "REASSIGN_TO_CHAPTER"
  | "REJECT_FOR_SOURCE_GAP";

export type ClsCp008Renderer = "TEXT" | "FIGURE" | "TABLE";

export type ClsCp008CandidateFamily = {
  readonly candidateId: string;
  readonly label: string;
  readonly disposition: ClsCp008Disposition;
  readonly targetOwner: string | null;
  readonly targetQlId: string | null;
  readonly renderer: ClsCp008Renderer;
  readonly sourceBacked: boolean;
  readonly recurringSourceAuthority: boolean;
  readonly reason: string;
};

export type ClsCp008SourceControl = {
  readonly sourceControlId: string;
  readonly sourceDocument: string;
  readonly sourceLocation: string;
  readonly candidateId: string;
  readonly renderer: ClsCp008Renderer;
  readonly observedForm: string;
};

export type ClsCp008OwnershipAuditResult = {
  readonly checkpointId: "CLS-CP-008";
  readonly permanentQlCount: 0;
  readonly permanentQlIds: readonly [];
  readonly newRuntimeGeneratorCount: 0;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
  readonly candidates: readonly ClsCp008CandidateFamily[];
  readonly sourceControls: readonly ClsCp008SourceControl[];
};
