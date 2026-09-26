export const RNK_001_MULTILINGUAL_FREEZE_CANDIDATE_VERSION =
  "RNK_001_MULTILINGUAL_FREEZE_CANDIDATE_V1" as const;

export type RnkMultilingualCandidateStatus = "REVIEW_READY";

export interface RnkMultilingualArtifactEvidence {
  readonly artifactId: number;
  readonly name: string;
  readonly digest: `sha256:${string}`;
  readonly headSha: string;
  readonly retained: true;
}

export interface RnkMultilingualCheckpointCandidate {
  readonly checkpointId: `RNK-CP-00${1 | 2 | 3 | 4 | 5 | 6 | 7}`;
  readonly qlStart: number;
  readonly qlEnd: number;
  readonly pullRequest: number;
  readonly headSha: string;
  readonly workflowRunId: number;
  readonly technicalStatus: RnkMultilingualCandidateStatus;
  readonly assistantLearnerArtifactAudit: "PASS";
  readonly formalNativeApproval: false;
  readonly artifacts: readonly RnkMultilingualArtifactEvidence[];
}

export const RNK_001_MULTILINGUAL_CHECKPOINT_CANDIDATES = Object.freeze([
  {
    checkpointId: "RNK-CP-001",
    qlStart: 1,
    qlEnd: 9,
    pullRequest: 793,
    headSha: "d62bb7ea6bf8312a360318cf4939bd15bce057f0",
    workflowRunId: 32156515182,
    technicalStatus: "REVIEW_READY",
    assistantLearnerArtifactAudit: "PASS",
    formalNativeApproval: false,
    artifacts: [{
      artifactId: 9332085480,
      name: "rnk-cp001-hi-pa-native-editorial-v4-108q",
      digest: "sha256:ccc007d791c17b9d853e50d1f616f01320e402d896182c9113eb21b776d990c9",
      headSha: "d62bb7ea6bf8312a360318cf4939bd15bce057f0",
      retained: true,
    }],
  },
  {
    checkpointId: "RNK-CP-002",
    qlStart: 10,
    qlEnd: 17,
    pullRequest: 798,
    headSha: "0e29a4760f80c638c5e318cdc5dcff621fe3b9a4",
    workflowRunId: 32156263287,
    technicalStatus: "REVIEW_READY",
    assistantLearnerArtifactAudit: "PASS",
    formalNativeApproval: false,
    artifacts: [{
      artifactId: 9331950882,
      name: "rnk-cp002-hi-pa-native-editorial-v2-128q",
      digest: "sha256:a94636e7f3e218e5adc8877f87a3f99d8c0ba9e7ec0c6a872a9dc3032ad1b6f5",
      headSha: "0e29a4760f80c638c5e318cdc5dcff621fe3b9a4",
      retained: true,
    }],
  },
  {
    checkpointId: "RNK-CP-003",
    qlStart: 18,
    qlEnd: 26,
    pullRequest: 803,
    headSha: "618a5a8ebdc33eaad395a10297719cae030d8cc9",
    workflowRunId: 32156696225,
    technicalStatus: "REVIEW_READY",
    assistantLearnerArtifactAudit: "PASS",
    formalNativeApproval: false,
    artifacts: [{
      artifactId: 9332197359,
      name: "rnk-cp003-hi-pa-localization-review-v4-144q",
      digest: "sha256:675d1f3573379907821af576d6ae824f4e9c30cfe9519c3d256dc3cd4dd1609a",
      headSha: "618a5a8ebdc33eaad395a10297719cae030d8cc9",
      retained: true,
    }],
  },
  {
    checkpointId: "RNK-CP-004",
    qlStart: 27,
    qlEnd: 35,
    pullRequest: 839,
    headSha: "7ac8eeeb76cd2c259957baa67d30c1acb329f36e",
    workflowRunId: 32162654654,
    technicalStatus: "REVIEW_READY",
    assistantLearnerArtifactAudit: "PASS",
    formalNativeApproval: false,
    artifacts: [{
      artifactId: 9334465846,
      name: "rnk-cp004-hi-pa-localization-review-v6-32q",
      digest: "sha256:4b4c7675c5c4c027ca9ac634902da4c35bb5cc48f94d518d3a6e268b8f45cb65",
      headSha: "7ac8eeeb76cd2c259957baa67d30c1acb329f36e",
      retained: true,
    }],
  },
  {
    checkpointId: "RNK-CP-005",
    qlStart: 36,
    qlEnd: 38,
    pullRequest: 879,
    headSha: "7d28290d061329153935853cba28d5c3ffe63a43",
    workflowRunId: 32155944463,
    technicalStatus: "REVIEW_READY",
    assistantLearnerArtifactAudit: "PASS",
    formalNativeApproval: false,
    artifacts: [{
      artifactId: 9332478402,
      name: "rnk-cp005-hi-pa-localization-review-v3-48q",
      digest: "sha256:9bfe10c5e7a56eef636a440f8ccdd9a48c9c6947a1e92b91331813dfb3eb1829",
      headSha: "7d28290d061329153935853cba28d5c3ffe63a43",
      retained: true,
    }],
  },
  {
    checkpointId: "RNK-CP-006",
    qlStart: 39,
    qlEnd: 41,
    pullRequest: 895,
    headSha: "361cf571f138572caebfd0ecb0fa145e9afdfda3",
    workflowRunId: 32153076870,
    technicalStatus: "REVIEW_READY",
    assistantLearnerArtifactAudit: "PASS",
    formalNativeApproval: false,
    artifacts: [{
      artifactId: 9331032696,
      name: "rnk-cp006-hi-pa-localization-review-v1-48q",
      digest: "sha256:8dff4e7ae8a9a9abf2a11422167c83e7c4d5fd60920bed2e70f90ec05475ed68",
      headSha: "361cf571f138572caebfd0ecb0fa145e9afdfda3",
      retained: true,
    }],
  },
  {
    checkpointId: "RNK-CP-007",
    qlStart: 42,
    qlEnd: 42,
    pullRequest: 792,
    headSha: "60d1fcca93efd27340f969ff8589b95195c2771e",
    workflowRunId: 32197317683,
    technicalStatus: "REVIEW_READY",
    assistantLearnerArtifactAudit: "PASS",
    formalNativeApproval: false,
    artifacts: [
      {
        artifactId: 9346352174,
        name: "rnk-cp007-hi-pa-native-editorial-v4-64q",
        digest: "sha256:2b15f9e0b198c9e674999b45430bc9c78929b0af656a52d173e9f860f8f02125",
        headSha: "60d1fcca93efd27340f969ff8589b95195c2771e",
        retained: true,
      },
      {
        artifactId: 9346352864,
        name: "rnk-cp007-percentage-presentation-adapter-v2",
        digest: "sha256:404f45048e41f5e2ebd76f7e11546c8847d7735c7c5e325166895407180cbded",
        headSha: "60d1fcca93efd27340f969ff8589b95195c2771e",
        retained: true,
      },
    ],
  },
] as const satisfies readonly RnkMultilingualCheckpointCandidate[]);

export const RNK_001_MULTILINGUAL_FREEZE_CANDIDATE = Object.freeze({
  version: RNK_001_MULTILINGUAL_FREEZE_CANDIDATE_VERSION,
  chapter: "RNK-001",
  permanentQlRange: "RNK-QL-001..042",
  ql043Allocated: false,
  englishAuthorityFrozen: true,
  hindiTechnicalCoverage: "REVIEW_READY" as const,
  punjabiTechnicalCoverage: "REVIEW_READY" as const,
  allCheckpointCandidatesArtifactPinned: true,
  formalNativeApprovalComplete: false,
  chapterMultilingualFreeze: false,
  questionStudioMultilingualDeliveryEnabled: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  productDeliveryUnlocked: false,
  checkpoints: RNK_001_MULTILINGUAL_CHECKPOINT_CANDIDATES,
});
