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
s = replace_once(
    s,
    '''} from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-009/localization-approval-release-v1";\nimport { SUFFICIENCY_CLASSES, type SufficiencyClass } from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/foundation";''',
    '''} from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-009/localization-approval-release-v1";\nimport {\n  DSF_CP010_CHECKPOINT_ID,\n  DSF_CP010_FREEZE_FINGERPRINT,\n  DSF_CP010_MULTILINGUAL_PRODUCTION_FREEZE_AUTHORITY,\n  DSF_CP010_MULTILINGUAL_PRODUCTION_PACKAGE,\n} from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-010/multilingual-production-freeze-v1";\nimport { SUFFICIENCY_CLASSES, type SufficiencyClass } from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/foundation";''',
    "route CP010 import",
)

cp010_payload = '''\nexport function dsfCp010ProductionPayload(question: DsfReviewQuestion) {\n  if (isLocalizedQuestion(question) && !isApprovedLocalizedQuestion(question)) {\n    throw new Error("DSF CP-010 cannot retroactively upgrade a CP-008 localization-review payload.");\n  }\n  const payload = isApprovedLocalizedQuestion(question)\n    ? dsfCp009LocalizedReleasePayload(question)\n    : dsfCp006ReviewPayload(question as DsfExamProfileQuestion);\n  return {\n    ...payload,\n    productionReadinessFreezeCheckpointId: DSF_CP010_CHECKPOINT_ID,\n    productionReadinessFreezeAuthority: DSF_CP010_MULTILINGUAL_PRODUCTION_FREEZE_AUTHORITY,\n    productionReadinessFreezeStatus: "PRODUCTION_READY_MULTILINGUAL_FROZEN" as const,\n    productionReadinessFreezeFingerprint: DSF_CP010_FREEZE_FINGERPRINT,\n    chapterStatus: "CLOSED_CURRENT_APPROVED_SCOPE" as const,\n    automaticStudentPublication: false as const,\n    generationContext: {\n      ...payload.generationContext,\n      productionReadinessFreezeCheckpointId: DSF_CP010_CHECKPOINT_ID,\n      productionReadinessFreezeAuthority: DSF_CP010_MULTILINGUAL_PRODUCTION_FREEZE_AUTHORITY,\n      productionReadinessFreezeStatus: "PRODUCTION_READY_MULTILINGUAL_FROZEN" as const,\n      productionReadinessFreezeFingerprint: DSF_CP010_FREEZE_FINGERPRINT,\n      chapterStatus: "CLOSED_CURRENT_APPROVED_SCOPE" as const,\n      automaticStudentPublication: false as const,\n    },\n  };\n}\n'''
s = replace_once(s, '\nasync function persistRun(\n', cp010_payload + '\nasync function persistRun(\n', "insert CP010 payload")

old_payload_select = '''      const payload = isApprovedLocalizedQuestion(question)\n        ? dsfCp009LocalizedReleasePayload(question)\n        : isLocalizedQuestion(question)\n          ? dsfCp008LocalizedReviewPayload(question)\n          : dsfCp006ReviewPayload(question);'''
s = replace_once(s, old_payload_select, '''      const payload = dsfCp010ProductionPayload(question);''', "persist CP010 payload")

s = replace_once(
    s,
    '''          mockTestReleaseAuthority: DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,\n          ...(localized ? {''',
    '''          mockTestReleaseAuthority: DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,\n          productionReadinessFreezeCheckpointId: DSF_CP010_CHECKPOINT_ID,\n          productionReadinessFreezeAuthority: DSF_CP010_MULTILINGUAL_PRODUCTION_FREEZE_AUTHORITY,\n          productionReadinessFreezeStatus: "PRODUCTION_READY_MULTILINGUAL_FROZEN",\n          productionReadinessFreezeFingerprint: DSF_CP010_FREEZE_FINGERPRINT,\n          chapterStatus: "CLOSED_CURRENT_APPROVED_SCOPE",\n          ...(localized ? {''',
    "audit CP010 metadata",
)

s = replace_once(
    s,
    '''function lifecycleForLanguage(_language: DsfRequestLanguage) {\n  return {\n    humanLanguageReviewRequired: false as const,''',
    '''function lifecycleForLanguage(_language: DsfRequestLanguage) {\n  return {\n    productionReadinessFreezeCheckpointId: DSF_CP010_CHECKPOINT_ID,\n    productionReadinessFreezeAuthority: DSF_CP010_MULTILINGUAL_PRODUCTION_FREEZE_AUTHORITY,\n    productionReadinessFreezeStatus: "PRODUCTION_READY_MULTILINGUAL_FROZEN" as const,\n    productionReadinessFreezeFingerprint: DSF_CP010_FREEZE_FINGERPRINT,\n    chapterStatus: "CLOSED_CURRENT_APPROVED_SCOPE" as const,\n    humanLanguageReviewRequired: false as const,''',
    "lifecycle CP010 metadata",
)

s = replace_once(s, '    package: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE,', '    package: DSF_CP010_MULTILINGUAL_PRODUCTION_PACKAGE,', "package CP010 authority")
s = replace_once(
    s,
    '''    localizationApprovalAuthority: DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,\n    localizedHumanReviewRequired: false,''',
    '''    localizationApprovalAuthority: DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,\n    productionReadinessFreezeCheckpointId: DSF_CP010_CHECKPOINT_ID,\n    productionReadinessFreezeAuthority: DSF_CP010_MULTILINGUAL_PRODUCTION_FREEZE_AUTHORITY,\n    productionReadinessFreezeStatus: "PRODUCTION_READY_MULTILINGUAL_FROZEN",\n    productionReadinessFreezeFingerprint: DSF_CP010_FREEZE_FINGERPRINT,\n    chapterStatus: "CLOSED_CURRENT_APPROVED_SCOPE",\n    localizedHumanReviewRequired: false,''',
    "package CP010 fields",
)

s = replace_once(
    s,
    '''        count(*) FILTER (WHERE v.payload ->> 'localizationApprovalAuthority' = ${DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY})::int AS "cp009GenerationItemCount",''',
    '''        count(*) FILTER (WHERE v.payload ->> 'localizationApprovalAuthority' = ${DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY})::int AS "cp009GenerationItemCount",\n        count(*) FILTER (WHERE v.payload ->> 'productionReadinessFreezeAuthority' = ${DSF_CP010_MULTILINGUAL_PRODUCTION_FREEZE_AUTHORITY})::int AS "cp010GenerationItemCount",''',
    "status CP010 SQL count",
)
s = replace_once(s, '      permanentQlCount: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.permanentQlIds.length,', '      permanentQlCount: DSF_CP010_MULTILINGUAL_PRODUCTION_PACKAGE.permanentQlIds.length,', "status CP010 ql")
s = replace_once(s, '      domainCount: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.domains.length,', '      domainCount: DSF_CP010_MULTILINGUAL_PRODUCTION_PACKAGE.domains.length,', "status CP010 domains")
s = replace_once(s, '      solveModeCount: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.solveModeCount,', '      solveModeCount: DSF_CP010_MULTILINGUAL_PRODUCTION_PACKAGE.solveModeCount,', "status CP010 modes")
s = replace_once(
    s,
    '''      cp009GenerationItemCount: Number(rows[0]?.cp009GenerationItemCount ?? 0),''',
    '''      cp009GenerationItemCount: Number(rows[0]?.cp009GenerationItemCount ?? 0),\n      cp010GenerationItemCount: Number(rows[0]?.cp010GenerationItemCount ?? 0),''',
    "status CP010 response count",
)
s = replace_once(
    s,
    '''      localizationApprovalAuthority: DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,\n      localizedHumanReviewRequired: false,''',
    '''      localizationApprovalAuthority: DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,\n      productionReadinessFreezeCheckpointId: DSF_CP010_CHECKPOINT_ID,\n      productionReadinessFreezeAuthority: DSF_CP010_MULTILINGUAL_PRODUCTION_FREEZE_AUTHORITY,\n      productionReadinessFreezeStatus: "PRODUCTION_READY_MULTILINGUAL_FROZEN",\n      productionReadinessFreezeFingerprint: DSF_CP010_FREEZE_FINGERPRINT,\n      chapterStatus: "CLOSED_CURRENT_APPROVED_SCOPE",\n      localizedHumanReviewRequired: false,''',
    "status CP010 fields",
)
for old, new, label in [
    ('      sourceFreezeAuthority: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.sourceFreezeAuthority,', '      sourceFreezeAuthority: DSF_CP010_MULTILINGUAL_PRODUCTION_PACKAGE.sourceFreezeAuthority,', 'status source package'),
    ('      supportedLanguages: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.supportedLanguages,', '      supportedLanguages: DSF_CP010_MULTILINGUAL_PRODUCTION_PACKAGE.supportedLanguages,', 'status languages package'),
    ('      productionLanguages: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.productionLanguages,', '      productionLanguages: DSF_CP010_MULTILINGUAL_PRODUCTION_PACKAGE.productionLanguages,', 'status production package'),
    ('      localizationReviewLanguages: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.localizationReviewLanguages,', '      localizationReviewLanguages: DSF_CP010_MULTILINGUAL_PRODUCTION_PACKAGE.localizationReviewLanguages,', 'status review package'),
    ('      perLanguageLifecycle: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.perLanguageLifecycle,', '      perLanguageLifecycle: DSF_CP010_MULTILINGUAL_PRODUCTION_PACKAGE.perLanguageLifecycle,', 'status lifecycle package'),
    ('      supportedAnswerProfiles: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.supportedAnswerProfiles,', '      supportedAnswerProfiles: DSF_CP010_MULTILINGUAL_PRODUCTION_PACKAGE.supportedAnswerProfiles,', 'status profiles package'),
    ('      answerProfiles: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.answerProfiles,', '      answerProfiles: DSF_CP010_MULTILINGUAL_PRODUCTION_PACKAGE.answerProfiles,', 'status profile defs package'),
    ('      supportedExamFamilies: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.supportedExamFamilies,', '      supportedExamFamilies: DSF_CP010_MULTILINGUAL_PRODUCTION_PACKAGE.supportedExamFamilies,', 'status families package'),
    ('      disabledExamFamilies: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.disabledExamFamilies,', '      disabledExamFamilies: DSF_CP010_MULTILINGUAL_PRODUCTION_PACKAGE.disabledExamFamilies,', 'status disabled families package'),
]:
    s = replace_once(s, old, new, label)
route.write_text(s)

# ---------------- Admin API client ----------------
s = client.read_text()
s = replace_once(
    s,
    '''  localizationApprovalCheckpointId: 'DSF-CP-009';\n  localizationApprovalAuthority: string;\n  localizationStatus: 'PRODUCT_OWNER_APPROVED';''',
    '''  localizationApprovalCheckpointId: 'DSF-CP-009';\n  localizationApprovalAuthority: string;\n  productionReadinessFreezeCheckpointId: 'DSF-CP-010';\n  productionReadinessFreezeAuthority: string;\n  productionReadinessFreezeStatus: 'PRODUCTION_READY_MULTILINGUAL_FROZEN';\n  productionReadinessFreezeFingerprint: string;\n  chapterStatus: 'CLOSED_CURRENT_APPROVED_SCOPE';\n  localizationStatus: 'PRODUCT_OWNER_APPROVED';''',
    "client package CP010 fields",
)
s = replace_once(
    s,
    '''  cp009GenerationItemCount: number;\n  hindiReviewItemCount: number;''',
    '''  cp009GenerationItemCount: number;\n  cp010GenerationItemCount: number;\n  hindiReviewItemCount: number;''',
    "client status CP010 count",
)
s = replace_once(
    s,
    '''  localizationApprovalCheckpointId: 'DSF-CP-009';\n  localizationApprovalAuthority: string;\n  localizationStatus: 'PRODUCT_OWNER_APPROVED';''',
    '''  localizationApprovalCheckpointId: 'DSF-CP-009';\n  localizationApprovalAuthority: string;\n  productionReadinessFreezeCheckpointId: 'DSF-CP-010';\n  productionReadinessFreezeAuthority: string;\n  productionReadinessFreezeStatus: 'PRODUCTION_READY_MULTILINGUAL_FROZEN';\n  productionReadinessFreezeFingerprint: string;\n  chapterStatus: 'CLOSED_CURRENT_APPROVED_SCOPE';\n  localizationStatus: 'PRODUCT_OWNER_APPROVED';''',
    "client status CP010 fields",
)
s = replace_once(
    s,
    '''    localizationApprovalCheckpointId: 'DSF-CP-009';\n    localizationApprovalAuthority: string;\n    localizedHumanReviewRequired: false;''',
    '''    localizationApprovalCheckpointId: 'DSF-CP-009';\n    localizationApprovalAuthority: string;\n    productionReadinessFreezeCheckpointId: 'DSF-CP-010';\n    productionReadinessFreezeAuthority: string;\n    productionReadinessFreezeStatus: 'PRODUCTION_READY_MULTILINGUAL_FROZEN';\n    productionReadinessFreezeFingerprint: string;\n    chapterStatus: 'CLOSED_CURRENT_APPROVED_SCOPE';\n    localizedHumanReviewRequired: false;''',
    "client package response CP010 fields",
)
client.write_text(s)

# ---------------- Admin panel ----------------
s = panel.read_text()
s = replace_once(
    s,
    '''<CardTitle className="flex items-center gap-2 text-base"><BrainCircuit className="h-4 w-4" /> Data Sufficiency · CP-009 multilingual production release</CardTitle>''',
    '''<CardTitle className="flex items-center gap-2 text-base"><BrainCircuit className="h-4 w-4" /> Data Sufficiency · CP-010 multilingual production freeze</CardTitle>''',
    "panel CP010 title",
)
s = replace_once(
    s,
    '''<Badge variant="outline">English + Hindi + Punjabi production</Badge><Badge variant="outline">CP-009 approved</Badge>''',
    '''<Badge variant="outline">English + Hindi + Punjabi production</Badge><Badge variant="outline">English + Hindi + Punjabi frozen production</Badge><Badge variant="outline">CP-009 approved</Badge><Badge variant="outline">CP-010 frozen</Badge>''',
    "panel CP010 badges",
)
s = replace_once(
    s,
    '''CP-001 owns frozen semantic truth, CP-003 owns approved answer-profile rendering, CP-004 owns Question Bank acceptance, CP-005 enables manual scored-test release, CP-006 enables mock-test eligibility, CP-008 owns executable Hindi/Punjabi localization parity, and CP-009 records product-owner language approval. Canonical semantics, correct option position and profile order cannot change.''',
    '''CP-001 owns frozen semantic truth, CP-003 owns approved answer-profile rendering, CP-004 owns Question Bank acceptance, CP-005 enables manual scored-test release, CP-006 enables mock-test eligibility, CP-008 owns executable Hindi/Punjabi localization parity, and CP-009 records product-owner language approval. The CP-009 multilingual production release is now pinned by CP-010 as the final current-scope multilingual production freeze. Canonical semantics, correct option position and profile order cannot change.''',
    "panel CP009 history + CP010 freeze",
)
s = replace_once(s, 'className="grid gap-3 sm:grid-cols-2 xl:grid-cols-9"', 'className="grid gap-3 sm:grid-cols-2 xl:grid-cols-10"', "panel metric grid")
s = replace_once(
    s,
    '''            <Metric label="CP-009 items" value={status.cp009GenerationItemCount} />\n            <Metric label="Hindi released" value={status.hindiReleaseItemCount} />''',
    '''            <Metric label="CP-009 items" value={status.cp009GenerationItemCount} />\n            <Metric label="CP-010 items" value={status.cp010GenerationItemCount} />\n            <Metric label="Hindi released" value={status.hindiReleaseItemCount} />''',
    "panel CP010 metric",
)
s = replace_once(
    s,
    '''<div className="flex items-center gap-2 font-medium"><ShieldCheck className="h-4 w-4" /> CP-009 Hindi/Punjabi approval · canonical production gates</div>''',
    '''<div className="flex items-center gap-2 font-medium"><ShieldCheck className="h-4 w-4" /> CP-010 multilingual production freeze · canonical production gates</div>''',
    "panel freeze heading",
)
s = replace_once(
    s,
    '''English, Hindi and Punjabi now share the controlled production lifecycle: manual Question Studio approval, explicit Question Bank publication, canonical scored-test validation, and test-series QA/release before mock delivery. Automatic student publication remains OFF. Historical CP-004/CP-005/CP-008 payloads are not retroactively upgraded. Punjab-specific answer-profile rendering remains disabled.''',
    '''English, Hindi and Punjabi are frozen in the controlled production lifecycle: manual Question Studio approval, explicit Question Bank publication, canonical scored-test validation, and test-series QA/release before mock delivery. Chapter status = CLOSED_CURRENT_APPROVED_SCOPE. Automatic student publication remains OFF. Historical CP-004/CP-005/CP-008 payloads are not retroactively upgraded. Punjab-specific answer-profile rendering remains disabled.''',
    "panel final freeze text",
)
panel.write_text(s)
