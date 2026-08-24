from pathlib import Path

ROOT = Path(__file__).resolve().parents[8]
route = ROOT / "artifacts/api-server/src/routes/admin-question-studio-data-sufficiency.ts"
client = ROOT / "artifacts/admin-app/src/features/question-studio/data-sufficiency-review-api.ts"
panel = ROOT / "artifacts/admin-app/src/pages/content/QuestionStudioDataSufficiencyReviewPanel.tsx"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)

# ---------------- API route ----------------
s = route.read_text()
s = replace_once(s,
''' } from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-008/localization-review-v1";'''.lstrip(),
''' } from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-008/localization-review-v1";
import {
  DSF_CP009_CHECKPOINT_ID,
  DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,
  DSF_CP009_LOCALIZATION_RELEASE_PACKAGE,
  generateDsfApprovedLocalizedExamProfileBatch,
  type DsfApprovedLocalizedExamProfileQuestion,
} from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-009/localization-approval-release-v1";'''.lstrip(),
"route CP009 import")

s = replace_once(s,
'''type DsfReviewQuestion = DsfExamProfileQuestion | DsfLocalizedExamProfileQuestion;''',
'''type DsfReviewQuestion = DsfExamProfileQuestion | DsfLocalizedExamProfileQuestion | DsfApprovedLocalizedExamProfileQuestion;''',
"route review union")

s = replace_once(s,
'''function isLocalizedQuestion(question: DsfReviewQuestion): question is DsfLocalizedExamProfileQuestion {
  return "localizationAuthority" in question;
}
''',
'''function isLocalizedQuestion(question: DsfReviewQuestion): question is DsfLocalizedExamProfileQuestion | DsfApprovedLocalizedExamProfileQuestion {
  return "localizationAuthority" in question;
}

function isApprovedLocalizedQuestion(question: DsfReviewQuestion): question is DsfApprovedLocalizedExamProfileQuestion {
  return "localizationApprovalAuthority" in question;
}
''',
"route localized guards")

s = replace_once(s,
'''    : generateDsfLocalizedExamProfileBatch({ ...shared, language: filters.language });''',
'''    : generateDsfApprovedLocalizedExamProfileBatch({ ...shared, language: filters.language });''',
"route localized generator")

s = replace_once(s,
'''export function dsfCp008LocalizedReviewPayload(question: DsfLocalizedExamProfileQuestion) {''',
'''export function dsfCp008LocalizedReviewPayload(question: DsfLocalizedExamProfileQuestion | DsfApprovedLocalizedExamProfileQuestion) {''',
"route cp008 payload input")

insert_marker = '''async function persistRun(
'''
release_payload = '''export function dsfCp009LocalizedReleasePayload(question: DsfApprovedLocalizedExamProfileQuestion) {
  const payload = dsfCp008LocalizedReviewPayload(question);
  return {
    ...payload,
    localizationApprovalCheckpointId: question.localizationApprovalCheckpointId,
    localizationApprovalAuthority: question.localizationApprovalAuthority,
    localizationApproval: question.localizationApproval,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
    reviewOnly: false as const,
    humanLanguageReviewRequired: false as const,
    questionBankStatus: "READY_FOR_STORAGE" as const,
    questionBankWritable: true as const,
    questionBankAcceptanceMode: "FULL_RELEASE" as const,
    questionBankAcceptanceCheckpointId: DSF_CP004_CHECKPOINT_ID,
    questionBankAcceptanceAuthority: DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
    testReleaseCheckpointId: DSF_CP005_CHECKPOINT_ID,
    testReleaseAuthority: DSF_CP005_TEST_RELEASE_AUTHORITY,
    mockTestReleaseCheckpointId: DSF_CP006_CHECKPOINT_ID,
    mockTestReleaseAuthority: DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,
    manualQuestionPublicationRequired: true as const,
    testEligibility: "ELIGIBLE" as const,
    testEligible: true as const,
    publiclyPublishable: true as const,
    mockTestEligible: true as const,
    automaticStudentPublication: false as const,
    generationContext: {
      ...payload.generationContext,
      localizationApprovalCheckpointId: question.localizationApprovalCheckpointId,
      localizationApprovalAuthority: question.localizationApprovalAuthority,
      reviewOnly: false as const,
      humanLanguageReviewRequired: false as const,
      questionBankStatus: "READY_FOR_STORAGE" as const,
      questionBankWritable: true as const,
      questionBankAcceptanceMode: "FULL_RELEASE" as const,
      questionBankAcceptanceCheckpointId: DSF_CP004_CHECKPOINT_ID,
      questionBankAcceptanceAuthority: DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
      testReleaseCheckpointId: DSF_CP005_CHECKPOINT_ID,
      testReleaseAuthority: DSF_CP005_TEST_RELEASE_AUTHORITY,
      mockTestReleaseCheckpointId: DSF_CP006_CHECKPOINT_ID,
      mockTestReleaseAuthority: DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,
      manualQuestionPublicationRequired: true as const,
      testEligibility: "ELIGIBLE" as const,
      testEligible: true as const,
      publiclyPublishable: true as const,
      mockTestEligible: true as const,
      automaticStudentPublication: false as const,
    },
  };
}

'''
if insert_marker not in s:
    raise RuntimeError("route persist marker missing")
s = s.replace(insert_marker, release_payload + insert_marker, 1)

s = replace_once(s,
'''  const localized = isLocalizedQuestion(questions[0]!);
''',
'''  const localized = isLocalizedQuestion(questions[0]!);
  const approvedLocalized = isApprovedLocalizedQuestion(questions[0]!);
''',
"route persist guards")

s = replace_once(s,
'''        'examtree', ${localized ? "reasoning-v1-dsf-cp008-localization-review-v1" : "reasoning-v1-dsf-cp006-mock-test-release-v1"},''',
'''        'examtree', ${approvedLocalized ? "reasoning-v1-dsf-cp009-hi-pa-localization-release-v1" : localized ? "reasoning-v1-dsf-cp008-localization-review-v1" : "reasoning-v1-dsf-cp006-mock-test-release-v1"},''',
"route model")

s = replace_once(s,
'''      const payload = isLocalizedQuestion(question)
        ? dsfCp008LocalizedReviewPayload(question)
        : dsfCp006ReviewPayload(question);''',
'''      const payload = isApprovedLocalizedQuestion(question)
        ? dsfCp009LocalizedReleasePayload(question)
        : isLocalizedQuestion(question)
          ? dsfCp008LocalizedReviewPayload(question)
          : dsfCp006ReviewPayload(question);''',
"route persisted payload")

s = replace_once(s,
'''    const auditReason = localized
      ? "DSF-CP-008 Hindi/Punjabi items are executable localization review candidates; Question Bank, tests, mocks and public publication remain blocked until explicit human language approval"
      : "DSF-CP-006 items require manual approval, manual Question Bank publication and normal test QA; mock-test eligibility is enabled while automatic student publication remains locked";
    const auditSummary = localized
      ? `Created ${questions.length} Data Sufficiency localized review items in ${publicCode}`
      : `Created ${questions.length} Data Sufficiency mock-eligible review items in ${publicCode}`;''',
'''    const auditReason = localized
      ? "DSF-CP-009 Hindi/Punjabi localization is product-owner approved; items require manual generation approval, explicit Question Bank publication and canonical test/test-series QA while automatic student publication remains locked"
      : "DSF-CP-006 items require manual approval, manual Question Bank publication and normal test QA; mock-test eligibility is enabled while automatic student publication remains locked";
    const auditSummary = localized
      ? `Created ${questions.length} Data Sufficiency approved localized production-review items in ${publicCode}`
      : `Created ${questions.length} Data Sufficiency mock-eligible review items in ${publicCode}`;''',
"route audit text")

s = replace_once(s,
'''          ...(localized ? {
            localizationCheckpointId: DSF_CP008_CHECKPOINT_ID,
            localizationAuthority: DSF_CP008_LOCALIZATION_AUTHORITY,
            humanLanguageReviewRequired: true,
            questionBankWritable: false,
            testEligible: false,
            publiclyPublishable: false,
            mockTestEligible: false,
          } : {
            questionBankAcceptanceAuthority: DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
            testReleaseAuthority: DSF_CP005_TEST_RELEASE_AUTHORITY,
            mockTestReleaseAuthority: DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,
            questionBankWritable: true,
            questionBankAcceptanceMode: "FULL_RELEASE",
            testEligible: true,
            publiclyPublishable: true,
            mockTestEligible: true,
          }),''',
'''          questionBankAcceptanceAuthority: DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
          testReleaseAuthority: DSF_CP005_TEST_RELEASE_AUTHORITY,
          mockTestReleaseAuthority: DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,
          ...(localized ? {
            localizationCheckpointId: DSF_CP008_CHECKPOINT_ID,
            localizationAuthority: DSF_CP008_LOCALIZATION_AUTHORITY,
            localizationApprovalCheckpointId: DSF_CP009_CHECKPOINT_ID,
            localizationApprovalAuthority: DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,
          } : {}),
          humanLanguageReviewRequired: false,
          questionBankWritable: true,
          questionBankAcceptanceMode: "FULL_RELEASE",
          testEligible: true,
          publiclyPublishable: true,
          mockTestEligible: true,''',
"route audit metadata")

start = s.index('function lifecycleForLanguage(language: DsfRequestLanguage) {')
end = s.index('\nrouter.use(authenticate);', start)
s = s[:start] + '''function lifecycleForLanguage(_language: DsfRequestLanguage) {
  return {
    humanLanguageReviewRequired: false as const,
    questionBankAcceptanceEnabled: true as const,
    questionBankWritable: true as const,
    questionBankAcceptanceMode: "FULL_RELEASE" as const,
    testEligibility: "ELIGIBLE" as const,
    testEligible: true as const,
    publiclyPublishable: true as const,
    mockTestEligible: true as const,
    automaticStudentPublication: false as const,
  };
}
''' + s[end:]

s = s.replace('activationMode: "MOCK_TEST_RELEASE_ENABLED",', 'activationMode: "MULTILINGUAL_MOCK_TEST_RELEASE_ENABLED",')
s = s.replace('localizationReviewMode: "HI_PA_EXECUTABLE_REVIEW",', 'localizationReviewMode: "HI_PA_PRODUCT_OWNER_APPROVED",\n    localizationReleaseMode: "HI_PA_PRODUCT_OWNER_APPROVED",')
s = s.replace('package: DSF_CP008_LOCALIZATION_REVIEW_PACKAGE,', 'package: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE,')
s = s.replace('    localizedHumanReviewRequired: true,\n    localizedQuestionBankWritable: false,\n    localizedTestEligible: false,\n    localizedMockTestEligible: false,\n    localizedPubliclyPublishable: false,', '    localizationApprovalCheckpointId: DSF_CP009_CHECKPOINT_ID,\n    localizationApprovalAuthority: DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,\n    localizedHumanReviewRequired: false,\n    localizedQuestionBankWritable: true,\n    localizedTestEligible: true,\n    localizedMockTestEligible: true,\n    localizedPubliclyPublishable: true,')

s = s.replace('manualQuestionPublicationRequired: filters.language === "en",', 'manualQuestionPublicationRequired: true,')
s = s.replace('localizationAuthority: filters.language === "en" ? undefined : DSF_CP008_LOCALIZATION_AUTHORITY,', 'localizationAuthority: filters.language === "en" ? undefined : DSF_CP008_LOCALIZATION_AUTHORITY,\n      localizationApprovalCheckpointId: filters.language === "en" ? undefined : DSF_CP009_CHECKPOINT_ID,\n      localizationApprovalAuthority: filters.language === "en" ? undefined : DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,')

s = replace_once(s,
'''      ...(filters.language === "en" ? {
        questionBankAcceptanceCheckpointId: DSF_CP004_CHECKPOINT_ID,
        questionBankAcceptanceAuthority: DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
        testReleaseCheckpointId: DSF_CP005_CHECKPOINT_ID,
        testReleaseAuthority: DSF_CP005_TEST_RELEASE_AUTHORITY,
        mockTestReleaseCheckpointId: DSF_CP006_CHECKPOINT_ID,
        mockTestReleaseAuthority: DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,
      } : {
        localizationCheckpointId: DSF_CP008_CHECKPOINT_ID,
        localizationAuthority: DSF_CP008_LOCALIZATION_AUTHORITY,
        humanLanguageReviewRequired: true,
      }),''',
'''      questionBankAcceptanceCheckpointId: DSF_CP004_CHECKPOINT_ID,
      questionBankAcceptanceAuthority: DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
      testReleaseCheckpointId: DSF_CP005_CHECKPOINT_ID,
      testReleaseAuthority: DSF_CP005_TEST_RELEASE_AUTHORITY,
      mockTestReleaseCheckpointId: DSF_CP006_CHECKPOINT_ID,
      mockTestReleaseAuthority: DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,
      ...(filters.language === "en" ? {} : {
        localizationCheckpointId: DSF_CP008_CHECKPOINT_ID,
        localizationAuthority: DSF_CP008_LOCALIZATION_AUTHORITY,
        localizationApprovalCheckpointId: DSF_CP009_CHECKPOINT_ID,
        localizationApprovalAuthority: DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,
        humanLanguageReviewRequired: false,
      }),''',
"route run snapshot authorities")
s = s.replace('questionBankStatus: filters.language === "en" ? "READY_FOR_STORAGE" : "NOT_STORED",', 'questionBankStatus: "READY_FOR_STORAGE",')

s = replace_once(s,
'''      ...(filters.language === "en" ? {
        questionBankAcceptanceCheckpointId: DSF_CP004_CHECKPOINT_ID,
        questionBankAcceptanceAuthority: DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
        testReleaseCheckpointId: DSF_CP005_CHECKPOINT_ID,
        testReleaseAuthority: DSF_CP005_TEST_RELEASE_AUTHORITY,
        mockTestReleaseCheckpointId: DSF_CP006_CHECKPOINT_ID,
        mockTestReleaseAuthority: DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,
      } : {
        localizationCheckpointId: DSF_CP008_CHECKPOINT_ID,
        localizationAuthority: DSF_CP008_LOCALIZATION_AUTHORITY,
      }),''',
'''      questionBankAcceptanceCheckpointId: DSF_CP004_CHECKPOINT_ID,
      questionBankAcceptanceAuthority: DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
      testReleaseCheckpointId: DSF_CP005_CHECKPOINT_ID,
      testReleaseAuthority: DSF_CP005_TEST_RELEASE_AUTHORITY,
      mockTestReleaseCheckpointId: DSF_CP006_CHECKPOINT_ID,
      mockTestReleaseAuthority: DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,
      ...(filters.language === "en" ? {} : {
        localizationCheckpointId: DSF_CP008_CHECKPOINT_ID,
        localizationAuthority: DSF_CP008_LOCALIZATION_AUTHORITY,
        localizationApprovalCheckpointId: DSF_CP009_CHECKPOINT_ID,
        localizationApprovalAuthority: DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,
      }),''',
"route run response authorities")

s = s.replace('count(*) FILTER (WHERE v.payload ->> \'localizationAuthority\' = ${DSF_CP008_LOCALIZATION_AUTHORITY})::int AS "cp008GenerationItemCount",', 'count(*) FILTER (WHERE v.payload ->> \'localizationAuthority\' = ${DSF_CP008_LOCALIZATION_AUTHORITY})::int AS "cp008GenerationItemCount",\n        count(*) FILTER (WHERE v.payload ->> \'localizationApprovalAuthority\' = ${DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY})::int AS "cp009GenerationItemCount",')
s = s.replace('count(*) FILTER (WHERE v.payload ->> \'localizationAuthority\' = ${DSF_CP008_LOCALIZATION_AUTHORITY} AND v.payload ->> \'language\' = \'hi\')::int AS "hindiReviewItemCount",', 'count(*) FILTER (WHERE v.payload ->> \'localizationAuthority\' = ${DSF_CP008_LOCALIZATION_AUTHORITY} AND v.payload ->> \'language\' = \'hi\' AND v.payload ->> \'localizationApprovalAuthority\' IS NULL)::int AS "hindiReviewItemCount",\n        count(*) FILTER (WHERE v.payload ->> \'localizationApprovalAuthority\' = ${DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY} AND v.payload ->> \'language\' = \'hi\')::int AS "hindiReleaseItemCount",')
s = s.replace('count(*) FILTER (WHERE v.payload ->> \'localizationAuthority\' = ${DSF_CP008_LOCALIZATION_AUTHORITY} AND v.payload ->> \'language\' = \'pa\')::int AS "punjabiReviewItemCount"', 'count(*) FILTER (WHERE v.payload ->> \'localizationAuthority\' = ${DSF_CP008_LOCALIZATION_AUTHORITY} AND v.payload ->> \'language\' = \'pa\' AND v.payload ->> \'localizationApprovalAuthority\' IS NULL)::int AS "punjabiReviewItemCount",\n        count(*) FILTER (WHERE v.payload ->> \'localizationApprovalAuthority\' = ${DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY} AND v.payload ->> \'language\' = \'pa\')::int AS "punjabiReleaseItemCount"')

s = s.replace('cp008GenerationItemCount: Number(rows[0]?.cp008GenerationItemCount ?? 0),', 'cp008GenerationItemCount: Number(rows[0]?.cp008GenerationItemCount ?? 0),\n      cp009GenerationItemCount: Number(rows[0]?.cp009GenerationItemCount ?? 0),')
s = s.replace('hindiReviewItemCount: Number(rows[0]?.hindiReviewItemCount ?? 0),', 'hindiReviewItemCount: Number(rows[0]?.hindiReviewItemCount ?? 0),\n      hindiReleaseItemCount: Number(rows[0]?.hindiReleaseItemCount ?? 0),')
s = s.replace('punjabiReviewItemCount: Number(rows[0]?.punjabiReviewItemCount ?? 0),', 'punjabiReviewItemCount: Number(rows[0]?.punjabiReviewItemCount ?? 0),\n      punjabiReleaseItemCount: Number(rows[0]?.punjabiReleaseItemCount ?? 0),')
s = s.replace('permanentQlCount: DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.permanentQlIds.length,', 'permanentQlCount: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.permanentQlIds.length,')
s = s.replace('domainCount: DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.domains.length,', 'domainCount: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.domains.length,')
s = s.replace('solveModeCount: DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.solveModeCount,', 'solveModeCount: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.solveModeCount,')
s = s.replace('localizationStatus: DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.localizationStatus,\n      localizedHumanReviewRequired: true,\n      sourceFreezeAuthority: DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.sourceFreezeAuthority,\n      supportedLanguages: DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.supportedLanguages,\n      productionLanguages: DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.productionLanguages,\n      localizationReviewLanguages: DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.localizationReviewLanguages,\n      perLanguageLifecycle: DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.perLanguageLifecycle,\n      supportedAnswerProfiles: DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.supportedAnswerProfiles,\n      answerProfiles: DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.answerProfiles,\n      supportedExamFamilies: DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.supportedExamFamilies,\n      disabledExamFamilies: DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.disabledExamFamilies,', 'localizationStatus: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.localizationStatus,\n      localizationApprovalCheckpointId: DSF_CP009_CHECKPOINT_ID,\n      localizationApprovalAuthority: DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,\n      localizedHumanReviewRequired: false,\n      sourceFreezeAuthority: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.sourceFreezeAuthority,\n      supportedLanguages: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.supportedLanguages,\n      productionLanguages: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.productionLanguages,\n      localizationReviewLanguages: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.localizationReviewLanguages,\n      perLanguageLifecycle: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.perLanguageLifecycle,\n      supportedAnswerProfiles: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.supportedAnswerProfiles,\n      answerProfiles: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.answerProfiles,\n      supportedExamFamilies: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.supportedExamFamilies,\n      disabledExamFamilies: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.disabledExamFamilies,')

route.write_text(s)

# ---------------- Admin API types ----------------
s = client.read_text()
s = s.replace("  status: 'EXECUTABLE_REVIEW_REQUIRED';", "  status: 'PRODUCT_OWNER_APPROVED';")
s = s.replace("  humanLanguageReviewRequired: true;", "  humanLanguageReviewRequired: false;")
s = s.replace("  localizationAuthority?: string;\n  canonicalEnglishProfileQuestionId?: string;", "  localizationAuthority?: string;\n  localizationApprovalCheckpointId?: 'DSF-CP-009';\n  localizationApprovalAuthority?: string;\n  canonicalEnglishProfileQuestionId?: string;")
s = s.replace("    reviewOnly: true;\n    questionBankStatus: 'NOT_STORED';\n    questionBankWritable: false;\n    testEligibility: 'INELIGIBLE';\n    testEligible: false;\n    mockTestEligible: false;\n    publiclyPublishable: false;", "    reviewOnly: false;\n    questionBankStatus: 'READY_FOR_STORAGE';\n    questionBankWritable: true;\n    questionBankAcceptanceMode: 'FULL_RELEASE';\n    manualQuestionPublicationRequired: true;\n    testEligibility: 'ELIGIBLE';\n    testEligible: true;\n    mockTestEligible: true;\n    publiclyPublishable: true;")
s = s.replace("status: 'PRODUCTION_READY_FROZEN' | 'LOCALIZED_REVIEW_REQUIRED';", "status: 'PRODUCTION_READY_FROZEN' | 'LOCALIZED_PRODUCTION_READY';")
s = s.replace("  localizationStatus: 'EXECUTABLE_REVIEW_REQUIRED';\n  humanLanguageReviewRequired: true;", "  localizationApprovalCheckpointId: 'DSF-CP-009';\n  localizationApprovalAuthority: string;\n  localizationStatus: 'PRODUCT_OWNER_APPROVED';\n  humanLanguageReviewRequired: false;")
s = s.replace("  productionLanguages: ['en'];\n  localizationReviewLanguages: ['hi', 'pa'];", "  productionLanguages: ['en', 'hi', 'pa'];\n  localizationReviewLanguages: [];")
s = s.replace("  cp008GenerationItemCount: number;", "  cp008GenerationItemCount: number;\n  cp009GenerationItemCount: number;")
s = s.replace("  hindiReviewItemCount: number;", "  hindiReviewItemCount: number;\n  hindiReleaseItemCount: number;")
s = s.replace("  punjabiReviewItemCount: number;", "  punjabiReviewItemCount: number;\n  punjabiReleaseItemCount: number;")
s = s.replace("  localizedHumanReviewRequired: true;", "  localizedHumanReviewRequired: false;")
s = s.replace("    activationMode: 'MOCK_TEST_RELEASE_ENABLED';\n    localizationReviewMode: 'HI_PA_EXECUTABLE_REVIEW';", "    activationMode: 'MULTILINGUAL_MOCK_TEST_RELEASE_ENABLED';\n    localizationReviewMode: 'HI_PA_PRODUCT_OWNER_APPROVED';\n    localizationReleaseMode: 'HI_PA_PRODUCT_OWNER_APPROVED';")
s = s.replace("    localizedHumanReviewRequired: true;\n    localizedQuestionBankWritable: false;\n    localizedTestEligible: false;\n    localizedMockTestEligible: false;\n    localizedPubliclyPublishable: false;", "    localizationApprovalCheckpointId: 'DSF-CP-009';\n    localizationApprovalAuthority: string;\n    localizedHumanReviewRequired: false;\n    localizedQuestionBankWritable: true;\n    localizedTestEligible: true;\n    localizedMockTestEligible: true;\n    localizedPubliclyPublishable: true;")
s = s.replace("    questionBankAcceptanceMode: 'FULL_RELEASE' | 'LOCALIZATION_REVIEW_ONLY';", "    questionBankAcceptanceMode: 'FULL_RELEASE';")
s = s.replace("    localizationAuthority?: string;\n  }>(`/admin/question-studio/reasoning/data-sufficiency/preview", "    localizationAuthority?: string;\n    localizationApprovalCheckpointId?: 'DSF-CP-009';\n    localizationApprovalAuthority?: string;\n  }>(`/admin/question-studio/reasoning/data-sufficiency/preview") if False else s
# Explicit preview tail replacement (avoid template-string quoting ambiguity).
s = s.replace("    localizationCheckpointId?: 'DSF-CP-008';\n    localizationAuthority?: string;\n  }>(`/admin/question-studio/reasoning/data-sufficiency/preview?${paramsFor(input).toString()}`", "    localizationCheckpointId?: 'DSF-CP-008';\n    localizationAuthority?: string;\n    localizationApprovalCheckpointId?: 'DSF-CP-009';\n    localizationApprovalAuthority?: string;\n  }>(`/admin/question-studio/reasoning/data-sufficiency/preview?${paramsFor(input).toString()}`")
s = s.replace("    localizationCheckpointId?: 'DSF-CP-008';\n    localizationAuthority?: string;\n    questionBankAcceptanceCheckpointId?: 'DSF-CP-004';", "    localizationCheckpointId?: 'DSF-CP-008';\n    localizationAuthority?: string;\n    localizationApprovalCheckpointId?: 'DSF-CP-009';\n    localizationApprovalAuthority?: string;\n    questionBankAcceptanceCheckpointId?: 'DSF-CP-004';")
s = s.replace("    questionBankAcceptanceMode: 'FULL_RELEASE' | 'LOCALIZATION_REVIEW_ONLY';", "    questionBankAcceptanceMode: 'FULL_RELEASE';")
client.write_text(s)

# ---------------- Admin panel copy ----------------
s = panel.read_text()
s = s.replace("<CheckCircle2 className=\"h-3 w-3\" /> Localization parity proved", "<CheckCircle2 className=\"h-3 w-3\" /> Localization approved")
s = s.replace("<strong>CP-008 localization review:</strong> executable semantic parity is proved, but human Hindi/Punjabi editorial approval is still required. Question Bank, tests, mocks and public publication remain blocked for this localized item.", "<strong>CP-009 localized production release:</strong> the CP-008 semantic-parity pack is product-owner approved. This localized item follows the same manual generation approval, explicit Question Bank publication, scored-test and mock-test QA gates as English. Automatic student publication remains off.")
s = s.replace("      if (language === 'en') {\n        showToast.success('Review run created', `${result.publicCode}: after manual approval, publication and normal test QA, these questions are eligible for scored tests and mocks. Automatic student publication remains off.`);\n      } else {\n        showToast.success('Localization review run created', `${result.publicCode}: ${LANGUAGE_LABELS[language]} items are saved for human language review only. Question Bank, tests, mocks and public publication remain blocked until localization approval.`);\n      }", "      showToast.success('Review run created', `${result.publicCode}: ${LANGUAGE_LABELS[language]} items require manual approval and explicit Question Bank publication, then are eligible for scored tests and mocks through canonical QA/release. Automatic student publication remains off.`);")
s = s.replace("Data Sufficiency · CP-008 Hindi/Punjabi localization review", "Data Sufficiency · CP-009 multilingual production release")
s = s.replace("<Badge variant=\"outline\">English production</Badge><Badge variant=\"outline\">Hindi + Punjabi review</Badge>", "<Badge variant=\"outline\">English + Hindi + Punjabi production</Badge><Badge variant=\"outline\">CP-009 approved</Badge>")
s = s.replace("CP-001 owns frozen semantic truth, CP-003 owns approved answer-profile rendering, CP-004 owns Question Bank acceptance, CP-005 enables manual scored-test release, and CP-006 enables mock-test eligibility. CP-008 localizes only learner-facing text; canonical semantics, correct option position and profile order cannot change.", "CP-001 owns frozen semantic truth, CP-003 owns approved answer-profile rendering, CP-004 owns Question Bank acceptance, CP-005 enables manual scored-test release, CP-006 enables mock-test eligibility, CP-008 owns executable Hindi/Punjabi localization parity, and CP-009 records product-owner language approval. Canonical semantics, correct option position and profile order cannot change.")
s = s.replace("            <Metric label=\"CP-008 items\" value={status.cp008GenerationItemCount} />\n            <Metric label=\"Hindi review\" value={status.hindiReviewItemCount} />\n            <Metric label=\"Punjabi review\" value={status.punjabiReviewItemCount} />\n            <Metric label=\"Test eligible (EN)\" value={status.testEligible ? 'Yes' : 'No'} />\n            <Metric label=\"Mock eligible (EN)\" value={status.mockTestEligible ? 'Yes' : 'No'} />", "            <Metric label=\"CP-008 items\" value={status.cp008GenerationItemCount} />\n            <Metric label=\"CP-009 items\" value={status.cp009GenerationItemCount} />\n            <Metric label=\"Hindi released\" value={status.hindiReleaseItemCount} />\n            <Metric label=\"Punjabi released\" value={status.punjabiReleaseItemCount} />\n            <Metric label=\"Test eligible\" value={status.testEligible ? 'Yes' : 'No'} />\n            <Metric label=\"Mock eligible\" value={status.mockTestEligible ? 'Yes' : 'No'} />")
s = s.replace("CP-006 mock-test release · CP-008 localization boundary", "CP-009 Hindi/Punjabi approval · canonical production gates")
s = s.replace("English keeps the CP-006 mock-test release: new English items still require manual Question Studio approval and explicit Question Bank publication, then enter mocks only through the canonical published-test and test-series QA/release path. Automatic student publication remains OFF. Older CP-004 BANK_ONLY and CP-005 mock-ineligible payloads are not upgraded. Hindi and Punjabi are executable review candidates only; their downstream gates remain locked until explicit human language approval. Punjab-specific answer-profile rendering remains disabled.", "English, Hindi and Punjabi now share the controlled production lifecycle: manual Question Studio approval, explicit Question Bank publication, canonical scored-test validation, and test-series QA/release before mock delivery. Automatic student publication remains OFF. Historical CP-004/CP-005/CP-008 payloads are not retroactively upgraded. Punjab-specific answer-profile rendering remains disabled.")
s = s.replace("        {activeLanguageLifecycle && language !== 'en' && (\n          <div className=\"rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs leading-5 text-muted-foreground\">\n            <strong>{LANGUAGE_LABELS[language]} localization is review-only.</strong> Semantic parity is executable-proved, but Question Bank writable = No, test eligible = No, mock eligible = No, public publication = No until editorial approval.\n          </div>\n        )}", "        {activeLanguageLifecycle && language !== 'en' && (\n          <div className=\"rounded-lg border border-success/30 bg-success/5 p-3 text-xs leading-5 text-muted-foreground\">\n            <strong>{LANGUAGE_LABELS[language]} localization is product-owner approved.</strong> Question Bank writable = Yes, test eligible = Yes, mock eligible = Yes, public publication = Yes through the canonical manual gates. Automatic student publication = No.\n          </div>\n        )}")
s = s.replace("{language === 'en' ? 'Create review run' : 'Create localization review run'}", "Create review run")
panel.write_text(s)

print("PASS_DSF_CP009_APPLY_RELEASE_PATCH")
