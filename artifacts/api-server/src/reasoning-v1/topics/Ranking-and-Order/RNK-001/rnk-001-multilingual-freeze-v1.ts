export const RNK_001_MULTILINGUAL_FREEZE_V1 = Object.freeze({
  chapterId: "RNK-001",
  version: "RNK_001_MULTILINGUAL_FREEZE_V1",
  state: "MULTILINGUAL_FROZEN",
  permanentQlRange: "RNK-QL-001..042",
  permanentQlCount: 42,
  nextAvailableQl: "RNK-QL-043",
  ql043Allocated: false,

  english: Object.freeze({
    status: "FROZEN",
  }),

  nativeProductApproval: Object.freeze({
    hindi: true,
    punjabi: true,
    approvalPr: 934,
    approvedNativeSurfaceHead: "d905d72a71d36794984e67d30fd7581eb5c3f60d",
    exactGreenPresentationHead: "26136894f074945ae7d7d9d3729f5bc778dd8aeb",
    presentationRunId: 32326775478,
    presentationArtifactId: 9391923609,
    presentationArtifactDigest:
      "sha256:f66e78d61e2b0dd178e31fd43959a13ba4767ff200ef5ce2eed75c0fc1f771c5",
  }),

  approvedLocaleSources: Object.freeze([
    Object.freeze({ cpId: "RNK-CP-001", qlRange: "RNK-QL-001..009", pr: 793, head: "d62bb7ea6bf8312a360318cf4939bd15bce057f0" }),
    Object.freeze({ cpId: "RNK-CP-002", qlRange: "RNK-QL-010..017", pr: 798, head: "0e29a4760f80c638c5e318cdc5dcff621fe3b9a4" }),
    Object.freeze({ cpId: "RNK-CP-003", qlRange: "RNK-QL-018..026", pr: 803, head: "618a5a8ebdc33eaad395a10297719cae030d8cc9" }),
    Object.freeze({ cpId: "RNK-CP-004", qlRange: "RNK-QL-027..035", pr: 839, head: "7ac8eeeb76cd2c259957baa67d30c1acb329f36e" }),
    Object.freeze({ cpId: "RNK-CP-005", qlRange: "RNK-QL-036..038", pr: 879, head: "7d28290d061329153935853cba28d5c3ffe63a43" }),
    Object.freeze({ cpId: "RNK-CP-006", qlRange: "RNK-QL-039..041", pr: 895, head: "361cf571f138572caebfd0ecb0fa145e9afdfda3" }),
    Object.freeze({ cpId: "RNK-CP-007", qlRange: "RNK-QL-042", pr: 792, head: "60d1fcca93efd27340f969ff8589b95195c2771e" }),
  ]),

  combinedTreeProof: Object.freeze({
    integrationPr: 938,
    exactHead: "07ed844d248411ddd385ec0d620d56cb2692571f",
    workflow: "Validate RNK-001 Approved Multilingual Integration V1",
    runId: 32327889203,
    status: "SUCCESS",
    artifactId: 9392687777,
    artifactName: "rnk-001-approved-multilingual-combined-tree-v1",
    artifactDigest:
      "sha256:6c08bbbcf39dc1c2d61f587623cc653c6bb25e3724e24761c891deaf8dfd0c8e",
    exactApprovedLocaleOverlayFileCount: 68,
  }),

  lifecycle: Object.freeze({
    formalNativeApproval: true,
    combinedTreeGreen: true,
    multilingualFreeze: true,

    // Freeze is content authority, not product activation.
    questionStudioMultilingualEnabled: false,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    manualActivationRequired: true,
  }),
});

export type Rnk001MultilingualFreezeV1 = typeof RNK_001_MULTILINGUAL_FREEZE_V1;
