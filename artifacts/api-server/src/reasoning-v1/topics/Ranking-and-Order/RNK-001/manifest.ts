export const RNK_001_CHAPTER_AUTHORITY = Object.freeze({
  packageId: "RNK-001",
  familyId: "REAS-RNK",
  authorityId: "RNK_001_CHAPTER_CLOSEOUT_V1",
  status: "CLOSED_FOR_QUESTION_STUDIO_REVIEW_PERSISTENCE__DELIVERY_LOCKED",

  developmentClosureStatus: "CLOSED",
  mathematicalAuthorityStatus: "FROZEN",
  multilingualContentStatus: "APPROVED_FROZEN",
  questionStudioStatus: "MULTILINGUAL_REVIEW_PERSISTENCE_ENABLED",

  permanentQlCount: 42,
  permanentQlRange: "RNK-QL-001..042",
  permanentQlIds: Array.from(
    { length: 42 },
    (_, index) => `RNK-QL-${String(index + 1).padStart(3, "0")}`,
  ),
  ql043Allocated: false,
  checkpointRanges: Object.freeze({
    "RNK-CP-001": "RNK-QL-001..009",
    "RNK-CP-002": "RNK-QL-010..017",
    "RNK-CP-003": "RNK-QL-018..026",
    "RNK-CP-004": "RNK-QL-027..035",
    "RNK-CP-005": "RNK-QL-036..038",
    "RNK-CP-006": "RNK-QL-039..041",
    "RNK-CP-007": "RNK-QL-042",
    "RNK-CP-008": "DERIVATION_CASELET_ADAPTERS_ONLY__ZERO_NEW_QL",
  }),

  supportedLanguages: ["en", "hi", "pa"] as const,
  locales: ["en-IN", "hi-IN", "pa-IN"] as const,
  englishContentFrozen: true,
  hindiContentApproved: true,
  punjabiContentApproved: true,
  multilingualContentFrozen: true,
  studentExplanationDecluttered: true,
  nativeArrangementExplanationValidated: true,
  examProfileDeliveryValidated: true,
  bankingFiveOptionDeliveryValidated: true,
  percentagePresentationValidated: true,

  questionStudioVisible: true,
  questionStudioGenerationEnabled: true,
  questionStudioReviewPersistenceEnabled: true,
  persistedLifecycleStatus: "REVIEW_ONLY_PERSISTED",

  questionBankStatus: "NOT_STORED",
  questionBankWritable: false,
  testEligibility: "INELIGIBLE",
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,

  frozenEvidence: Object.freeze({
    productApprovalPr: 934,
    multilingualFreeze: Object.freeze({
      pr: 945,
      head: "d73b445916d8c10b4551d1a05e75a7ca3973081c",
      run: 32335249084,
      artifact: 9394423204,
    }),
    multilingualQuestionStudioActivation: Object.freeze({
      pr: 966,
      head: "043b43e4ab469a03e9860078950203e5dd14e1ef",
      run: 32453743946,
    }),
    reviewPersistence: Object.freeze({
      pr: 974,
      head: "184d42b4516262f00aab2b635cba7e83a62d59f1",
      run: 32463680002,
      artifact: 9440232238,
      artifactDigest: "sha256:0f3b64946699481f89fb707523a6da7a34c6ae63e26326ec1e2a997518e4e1b1",
    }),
  }),

  activationBoundary:
    "RNK-001 chapter development is closed with multilingual Question Studio generation and review persistence enabled. Question Bank conversion, test/mock eligibility and learner/public publication remain separate product-release gates and do not reopen chapter development.",

  reopeningRule: Object.freeze([
    "Recurring authoritative source evidence proves a materially new ranking/order semantic contract not owned by RNK-QL-001..042 or another chapter.",
    "A correctness defect is proven in frozen mathematics, answer authority, or approved native learner content.",
    "A chapter-boundary ownership defect is proven and requires QL reassignment or semantic change.",
  ] as const),
});
