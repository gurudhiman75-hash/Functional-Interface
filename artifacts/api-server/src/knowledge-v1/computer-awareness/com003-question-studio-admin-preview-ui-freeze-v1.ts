export const COM003_QUESTION_STUDIO_ADMIN_PREVIEW_UI_FREEZE_V1 = {
  authorityId: "COM-003-QUESTION-STUDIO-ADMIN-PREVIEW-UI-FREEZE-V1",
  packageId: "COM-003",
  chapterTitle: "Office & Productivity Software",
  frozenAt: "2026-09-01",
  validatedHeadSha: "603682c51d49526b2db9c6c963c4f17c86cace7f",
  validation: {
    workflow: "COM-003 Review Synthesis One-Off",
    runId: 33421564944,
    jobId: 99584946060,
    conclusion: "success",
    apiBuild: true,
    adminBuild: true,
    uiNoWriteContract: true,
    fullCom003GateChain: true,
  },
  frozenSourceBlobs: {
    adminPreviewApi: "58942597b08a06e974dbd052aa93d74cf3cd3585",
    adminPreviewPanel: "7fd3e17b50f076e16bd7bb40ab55e00ef5584686",
    questionStudioOperationsPage: "90baafa6d6480e14ebc093a9fd13464d4a3d1569",
  },
  corpus: {
    permanentQlCount: 19,
    englishQuestions: 228,
    hindiQuestions: 228,
    punjabiQuestions: 228,
    frozenQuestionLanguageArtifacts: 684,
    languages: ["en", "hi", "pa"] as const,
    interactivePreviewCap: 12,
  },
  surface: {
    location: "Question Studio / Computer Awareness",
    mode: "READ_ONLY_FROZEN_CORPUS_PREVIEW",
    requiresPermission: "content.generation.read",
    endpoints: [
      "GET /admin/question-studio/computer/com003/package",
      "GET /admin/question-studio/computer/com003/preview",
      "GET /admin/question-studio/computer/com003/status",
    ] as const,
    deterministicWithoutReplacement: true,
    qlSelection: true,
    languageSelection: true,
    deterministicSeedSelection: true,
    answerAndExplanationVisible: true,
    provenanceVisible: true,
    difficultySelector: false,
  },
  lifecycleLocks: {
    normalQuestionStudioRegistration: false,
    capabilityPickerDiscoverable: false,
    generationRunPersistence: false,
    questionBankWritable: false,
    reviewMutation: false,
    regeneration: false,
    inlineRevision: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleased: false,
  },
  replacementRule:
    "Any change to the frozen admin preview API, panel, operations-page mount, write-lock contract, corpus authority, or lifecycle state requires a new versioned authority and a new green validation lineage.",
  nextGate:
    "Audit COM-003 for explicit persistence/Question Bank registration readiness. This freeze does not authorize POST /runs, Question Bank writes, test eligibility, or publication.",
} as const;

export type Com003QuestionStudioAdminPreviewUiFreezeV1 =
  typeof COM003_QUESTION_STUDIO_ADMIN_PREVIEW_UI_FREEZE_V1;
