export const ARG_CP006_CHECKPOINT_ID = "ARG-CP-006" as const;
export const ARG_CP006_FREEZE_AUTHORITY = "ARG_CP006_IMMUTABLE_FREEZE_V1" as const;
export const ARG_CP006_CHAPTER_ID = "ARG-001" as const;
export const ARG_CP006_SUBJECT_CODE = "REAS-ARG" as const;

export const ARG_CP006_FROZEN_CONTRACT = Object.freeze({
  chapterId: ARG_CP006_CHAPTER_ID,
  subjectCode: ARG_CP006_SUBJECT_CODE,
  checkpointId: ARG_CP006_CHECKPOINT_ID,
  authority: ARG_CP006_FREEZE_AUTHORITY,
  status: "FROZEN_CERTIFIED" as const,
  permanentQlIds: Object.freeze([
    "ARG-QL-001",
    "ARG-QL-002",
    "ARG-QL-003",
    "ARG-QL-004",
    "ARG-QL-005",
    "ARG-QL-006",
  ] as const),
  answerClasses: Object.freeze(["ONLY_I", "ONLY_II", "BOTH", "NEITHER"] as const),
  locales: Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const),
  questionStudioLanguages: Object.freeze(["en", "hi", "pa"] as const),
  difficulties: Object.freeze(["Easy", "Medium", "Hard"] as const),
  sourceTemplateCount: 48 as const,
  sourceTemplatesPerQl: 8 as const,
  difficultyDistribution: Object.freeze({ Easy: 13, Medium: 15, Hard: 20 } as const),
  semanticVariantsPerTemplate: 256 as const,
  semanticSurfacesPerQl: 2048 as const,
  englishSemanticSurfaceCount: 12_288 as const,
  trilingualSemanticSurfaceCount: 36_864 as const,
  localizedTemplateCountPerLocale: 48 as const,
  localizedOverlayCount: 96 as const,
  maximumIdenticalAnswerRun: 2 as const,
  argumentOrderReversalPerTemplate: 128 as const,
  questionStudioRuntimeMode: "REVIEW_ONLY_CERTIFIED_CP004" as const,
  questionStudioReviewStatus: "QUESTION_STUDIO_REVIEW_CONNECTED" as const,
  manualApprovalRequired: true as const,
  persistenceAllowed: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  learnerRelease: "LOCKED" as const,
});

/**
 * Git blob hashes pin the exact byte content of every chapter/runtime authority
 * that defines ARG-001 semantics, scheduling, localization or Question Studio
 * review delivery at CP006. Documentation/proof files are intentionally not
 * included because they may be expanded without altering the frozen runtime.
 */
export const ARG_CP006_FROZEN_BLOBS = Object.freeze([
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/types.ts", "907ee131e6e347fee1dcd80c8cda4bbb717f25b6"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp001-english-authorities.ts", "2460344e88140bdfa482182a7bfa3a568105bcaa"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp002-archetype-ledger.ts", "7bf3fb4311eee4752af43bf0d28f23350cdc7144"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp002-editorial-replacements.ts", "48c6977b361a24830ad856bb558b7ceb4103739e"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp002-english-expansion.ts", "53c143ee51efcdc3778117734e765619dbac15b7"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/english-authorities.ts", "8bdc6adbfd7ec7a27ddc8931e14364577f9d2cfb"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp003-saturation-types.ts", "fce37fab63a51074d74bd480e4bf7166719a453c"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp003-saturation-helpers.ts", "9c1bfc9f7ab9f15352de92d5d0c64df8abd5043d"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp003-ql001-templates.ts", "6a97f2ef70a2603dbf5051b285c02e75953e300e"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp003-ql002-templates.ts", "69b73d5c455fe28973da618b96eaefdb273bef75"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp003-ql003-templates.ts", "9986d0b280a75a6aa01c1230ccfd91143c090faa"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp003-ql004-templates.ts", "aafe6882b9c11c8fc2e8adef8d8e8fc22ae8a0b2"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp003-ql005-templates.ts", "2d0955403ac2e98d357ff04a8c9ad63b1a2bd6be"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp003-ql006-templates.ts", "14d6fe7837ce715989f95d61cd40d5c1decdbe02"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp003-templates.ts", "d04077b44431e862c813570566169bfb30863c8b"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp003-generator.ts", "3a0fc26c163b3ec9e3f880ee79005d9be02354dd"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp004-localization-types.ts", "83409e3c24f3db2e369d994294ae364a8ba0c33b"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp004-localization-helpers.ts", "a4fd2e915810cf01505c3ddc49b6226327041be5"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp004-ql001-localized.ts", "b90b784a415fbc0a469e137c4fe167d18dbc82aa"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp004-ql002-localized.ts", "3e12f9b716527f40b950eca2c7f83ce44ad0174c"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp004-ql003-localized.ts", "03ecdf1feaac8a1225096579a205a8a0369caf70"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp004-ql004-localized.ts", "37b5030eea44890f41029fff9671f2ba39bf44aa"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp004-ql005-localized.ts", "827517119771472453ccf63beeaf8225e8f64c95"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp004-ql006-localized.ts", "a4f215b8407e9d7728fe7353a5ea22b2beeeca2e"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp004-localized-templates.ts", "e9fb8370359c784ce922686ee04d71f06d05e753"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp004-generator.ts", "6ec08af3fc496f5e2b8e002eaac54ce48acdefe6"],
  ["artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp005-question-studio-integration.ts", "93bdff919911de889ad56325bcf054e51d55779d"],
  ["artifacts/api-server/src/question-studio/shared-generation-engine-arg.ts", "6a9ec25d596297aada77d0524f25a0723f96a61b"],
  ["artifacts/api-server/src/routes/admin-question-studio-arguments.ts", "f5cae55945fb7813bd1a0fc5c46d728e3b4f8461"],
] as const);
