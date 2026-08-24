from pathlib import Path

ROOT = Path(__file__).resolve().parents[8]
base = ROOT / "artifacts/api-server/src/reasoning-v1/topics/Data-Sufficiency/DSF-001"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)

# CP-006 proves its historical release helper while allowing CP-009 to own the latest package label/UI.
p = base / "DSF-CP-006/mock-test-release-route-v1.test.ts"
s = p.read_text()
s = replace_once(s,
    "assert.ok(route.includes('activationMode: \"MOCK_TEST_RELEASE_ENABLED\"'));",
    "assert.ok(route.includes('activationMode: \"MULTILINGUAL_MOCK_TEST_RELEASE_ENABLED\"'));\nassert.ok(route.includes('export function dsfCp009LocalizedReleasePayload'));",
    "CP006 route activation")
s = replace_once(s,
    "assert.ok(adminClient.includes(\"activationMode: 'MOCK_TEST_RELEASE_ENABLED'\"));",
    "assert.ok(adminClient.includes(\"activationMode: 'MULTILINGUAL_MOCK_TEST_RELEASE_ENABLED'\"));",
    "CP006 client activation")
s = replace_once(s,
    "assert.ok(adminPanel.includes('CP-006 mock-test release'));\nassert.ok(adminPanel.includes('canonical published-test and test-series QA/release path'));\nassert.ok(adminPanel.includes('Automatic student publication remains OFF'));\nassert.ok(adminPanel.includes('Older CP-004 BANK_ONLY and CP-005 mock-ineligible payloads are not upgraded'));",
    "assert.ok(adminPanel.includes('CP-006 enables mock-test eligibility'));\nassert.ok(adminPanel.includes('test-series QA/release before mock delivery'));\nassert.ok(adminPanel.includes('Automatic student publication remains OFF'));\nassert.ok(adminPanel.includes('Historical CP-004/CP-005/CP-008 payloads are not retroactively upgraded'));",
    "CP006 panel later-overlay copy")
p.write_text(s)

# CP-008 remains a historical review-only payload contract; CP-009 is the later approved release overlay.
p = base / "DSF-CP-008/localization-route-v1.test.ts"
s = p.read_text()
s = replace_once(s,
    "assert.ok(route.includes('activationMode: \"MOCK_TEST_RELEASE_ENABLED\"'), \"CP-006 English release marker must remain visible\");\nassert.ok(route.includes('localizationReviewMode: \"HI_PA_EXECUTABLE_REVIEW\"'));\nassert.ok(route.includes(\"DSF_CP008_LOCALIZATION_REVIEW_PACKAGE\"));\nassert.ok(route.includes(\"DSF_CP008_SUPPORTED_LANGUAGES\"));\nassert.ok(route.includes(\"generateDsfLocalizedExamProfileBatch\"));",
    "assert.ok(route.includes('activationMode: \"MULTILINGUAL_MOCK_TEST_RELEASE_ENABLED\"'));\nassert.ok(route.includes('localizationReviewMode: \"HI_PA_PRODUCT_OWNER_APPROVED\"'));\nassert.ok(route.includes(\"DSF_CP008_SUPPORTED_LANGUAGES\"));\nassert.ok(route.includes(\"generateDsfApprovedLocalizedExamProfileBatch\"));\nassert.ok(route.includes(\"DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY\"));",
    "CP008 latest route overlay")
s = replace_once(s,
    "assert.ok(client.includes(\"localizationReviewMode: 'HI_PA_EXECUTABLE_REVIEW'\"));\nassert.ok(client.includes(\"activationMode: 'MOCK_TEST_RELEASE_ENABLED'\"));",
    "assert.ok(client.includes(\"localizationReviewMode: 'HI_PA_PRODUCT_OWNER_APPROVED'\"));\nassert.ok(client.includes(\"activationMode: 'MULTILINGUAL_MOCK_TEST_RELEASE_ENABLED'\"));",
    "CP008 latest client overlay")
s = replace_once(s,
    "assert.ok(panel.includes('CP-008 Hindi/Punjabi localization review'));\nassert.ok(panel.includes('<Field label=\"Language\">'));\nassert.ok(panel.includes(\"Hindi + Punjabi review\"));\nassert.ok(panel.includes('CP-006 mock-test release'));\nassert.ok(panel.includes('canonical published-test and test-series QA/release path'));\nassert.ok(panel.includes('Automatic student publication remains OFF'));\nassert.ok(panel.includes('Older CP-004 BANK_ONLY and CP-005 mock-ineligible payloads are not upgraded'));\nassert.ok(panel.includes('Question Bank, tests, mocks and public publication remain blocked'));",
    "assert.ok(panel.includes('CP-009 multilingual production release'));\nassert.ok(panel.includes('<Field label=\"Language\">'));\nassert.ok(panel.includes(\"English + Hindi + Punjabi production\"));\nassert.ok(panel.includes('CP-006 enables mock-test eligibility'));\nassert.ok(panel.includes('test-series QA/release before mock delivery'));\nassert.ok(panel.includes('Automatic student publication remains OFF'));\nassert.ok(panel.includes('Historical CP-004/CP-005/CP-008 payloads are not retroactively upgraded'));\nassert.ok(panel.includes('localization is product-owner approved'));",
    "CP008 panel later-overlay copy")
s = s.replace('localizedDownstreamLockedPendingHumanReview: true', 'historicalCp008DownstreamLocked: true')
p.write_text(s)

# CP-002 checks its immutable source lifecycle and enumerates later overlays through CP-009.
p = base / "DSF-CP-002/question-studio-route-v1.test.ts"
s = p.read_text()
s = replace_once(s,
    '  "DSF_CP008_LOCALIZATION_AUTHORITY",\n  "dsfCp004ReviewPayload",',
    '  "DSF_CP008_LOCALIZATION_AUTHORITY",\n  "DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY",\n  "dsfCp004ReviewPayload",',
    "CP002 later authority list")
s = replace_once(s,
    '  "Create review run", "CP-006 mock-test release", "Banking + SSC", "Punjab-specific answer-profile rendering remains disabled",\n  "canonical published-test and test-series QA/release path", "Automatic student publication remains OFF",\n  "CP-008 Hindi/Punjabi localization review", "Hindi + Punjabi review",',
    '  "Create review run", "CP-006 enables mock-test eligibility", "Banking + SSC", "Punjab-specific answer-profile rendering remains disabled",\n  "test-series QA/release before mock delivery", "Automatic student publication remains OFF",\n  "CP-009 multilingual production release", "English + Hindi + Punjabi production",',
    "CP002 panel later-overlay list")
s = replace_once(s,
    '  laterLocalizationCheckpointAllowed: "DSF-CP-008",\n  cp008LearnerTextOverlayOnly: true,',
    '  laterLocalizationCheckpointAllowed: "DSF-CP-008",\n  laterLocalizationApprovalCheckpointAllowed: "DSF-CP-009",\n  cp008LearnerTextOverlayOnly: true,',
    "CP002 output CP009")
p.write_text(s)

# CP-003 continues to own semantic option order; CP-009 is only a later language-approval/release overlay.
p = base / "DSF-CP-003/exam-answer-profiles-route-v1.test.ts"
s = p.read_text()
s = replace_once(s,
    '  "DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY", "DSF_CP005_TEST_RELEASE_AUTHORITY", "DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY",\n  "dsfCp004ReviewPayload", "dsfCp005ReviewPayload", "dsfCp006ReviewPayload",',
    '  "DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY", "DSF_CP005_TEST_RELEASE_AUTHORITY", "DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY",\n  "DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY", "dsfCp004ReviewPayload", "dsfCp005ReviewPayload", "dsfCp006ReviewPayload",',
    "CP003 later authority")
s = replace_once(s,
    '  "canonical semantics, correct option position and profile order cannot change",',
    '  "Canonical semantics, correct option position and profile order cannot change",',
    "CP003 panel semantic wording")
s = replace_once(s,
    '  laterLocalizationCheckpoint: "DSF-CP-008",\n  cp008LearnerTextOverlayOnly: true,',
    '  laterLocalizationCheckpoint: "DSF-CP-008",\n  laterLocalizationApprovalCheckpoint: "DSF-CP-009",\n  cp008LearnerTextOverlayOnly: true,',
    "CP003 output CP009")
p.write_text(s)

print("PASS_DSF_CP009_HISTORICAL_ROUTE_TEST_COMPAT")
