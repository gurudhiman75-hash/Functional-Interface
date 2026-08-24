from pathlib import Path

ROOT = Path(__file__).resolve().parents[8]
route = ROOT / "artifacts/api-server/src/routes/admin-question-studio-data-sufficiency.ts"
client = ROOT / "artifacts/admin-app/src/features/question-studio/data-sufficiency-review-api.ts"
panel = ROOT / "artifacts/admin-app/src/pages/content/QuestionStudioDataSufficiencyReviewPanel.tsx"


def replace_exact(text: str, old: str, new: str, expected: int, label: str) -> str:
    count = text.count(old)
    if count != expected:
        raise RuntimeError(f"{label}: expected {expected} matches, found {count}")
    return text.replace(old, new)

# Remove CP-008 symbols no longer used by the production route while preserving CP-008 historical payload types/authority.
s = route.read_text()
s = replace_exact(s, "  DSF_CP008_LOCALIZATION_REVIEW_PACKAGE,\n", "", 1, "unused CP008 package import")
s = replace_exact(s, "  generateDsfLocalizedExamProfileBatch,\n", "", 1, "unused CP008 generator import")
route.write_text(s)

# Tighten admin client to the CP-009 production contract returned by the API.
s = client.read_text()
s = replace_exact(s, "  localizationStatus: 'EXECUTABLE_REVIEW_REQUIRED';", "  localizationStatus: 'PRODUCT_OWNER_APPROVED';", 2, "package/status localization status")

package_anchor = "  localizationCheckpointId: 'DSF-CP-008';\n  localizationAuthority: string;\n  localizationStatus: 'PRODUCT_OWNER_APPROVED';"
package_replacement = "  localizationCheckpointId: 'DSF-CP-008';\n  localizationAuthority: string;\n  localizationApprovalCheckpointId: 'DSF-CP-009';\n  localizationApprovalAuthority: string;\n  localizationStatus: 'PRODUCT_OWNER_APPROVED';"
s = replace_exact(s, package_anchor, package_replacement, 2, "package/status CP009 approval metadata")

package_response_anchor = "    localizationCheckpointId: 'DSF-CP-008';\n    localizationAuthority: string;\n    localizedHumanReviewRequired: false;\n    localizedQuestionBankWritable: false;\n    localizedTestEligible: false;\n    localizedMockTestEligible: false;\n    localizedPubliclyPublishable: false;"
package_response_replacement = "    localizationCheckpointId: 'DSF-CP-008';\n    localizationAuthority: string;\n    localizationApprovalCheckpointId: 'DSF-CP-009';\n    localizationApprovalAuthority: string;\n    localizedHumanReviewRequired: false;\n    localizedQuestionBankWritable: true;\n    localizedTestEligible: true;\n    localizedMockTestEligible: true;\n    localizedPubliclyPublishable: true;"
s = replace_exact(s, package_response_anchor, package_response_replacement, 1, "package response localized lifecycle")
client.write_text(s)

# Nine status metrics are now rendered at desktop width.
s = panel.read_text()
s = replace_exact(s, 'xl:grid-cols-8', 'xl:grid-cols-9', 2, "panel desktop grids")
panel.write_text(s)

print("PASS_DSF_CP009_FINALIZE_RELEASE_CONTRACTS")
