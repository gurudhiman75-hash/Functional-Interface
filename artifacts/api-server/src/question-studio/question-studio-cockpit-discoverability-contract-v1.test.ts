import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = readFileSync(
  resolve(process.cwd(), "artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx"),
  "utf8",
);

assert(
  source.includes(".filter((entry) => packageChapter(entry) === chapter)"),
  "Question Studio cockpit must filter packages by the selected chapter.",
);

for (const forbidden of [
  "withoutCoveredAliases",
  "candidateCpIds.every((cpId) => otherSet.has(cpId))",
  "otherCpIds.length <= candidateCpIds.length",
]) {
  assert(
    !source.includes(forbidden),
    `Question Studio cockpit must not hide registered packages using CP-subset alias inference: ${forbidden}`,
  );
}

assert(
  source.includes("left.packageId.localeCompare(right.packageId)"),
  "Question Studio cockpit should use stable package ordering without suppressing registered families.",
);

assert(
  source.includes("{entry.label} · {entry.packageId}"),
  "Question Studio generation selector must show package identity when multiple families share a chapter.",
);

assert(
  source.includes("Lifecycle:"),
  "Question Studio generation summary must expose the active package lifecycle stage.",
);

assert(
  source.includes("reopeningApproved"),
  "Question Studio cockpit must require a reason before reopening an approved review-only item.",
);

assert(
  source.includes("runReviewState(run)"),
  "Question Studio cockpit must derive editorial state from the full run review summary.",
);

assert(
  source.includes("item.status === 'approved'"),
  "Question Studio cockpit must disable redundant approval decisions.",
);
assert(
  source.includes("item.status === 'needs_fix'"),
  "Question Studio cockpit must disable redundant needs-fix decisions.",
);
assert(
  source.includes("item.status === 'rejected'"),
  "Question Studio cockpit must disable redundant rejection decisions.",
);

assert(
  source.includes("expectedVersionNumber: item.currentVersionNumber"),
  "Question Studio revision editor must submit the version it was opened against.",
);

assert(
  source.includes("expectedStatuses"),
  "Question Studio cockpit must submit expected statuses with review decisions.",
);

assert(
  source.includes("catch (caught) { await refreshReviewPage(); setEditingItemId(null);"),
  "Question Studio cockpit must refresh the queue and close a stale editor after revision failure.",
);
assert(
  source.includes("summary.total"),
  "Question Studio run header must distinguish items in view from the full run total.",
);

const apiSource = readFileSync(
  resolve(process.cwd(), "artifacts/admin-app/src/features/question-studio/api.ts"),
  "utf8",
);

assert(
  !apiSource.includes("probabilityExamProfile"),
  "Question Studio client must not overload runtimeMode with Probability exam-profile values.",
);
assert(
  apiSource.includes("body: JSON.stringify(input)"),
  "Question Studio client must forward the canonical generation input without package-specific runtime mutation.",
);

const hookSource = readFileSync(
  resolve(process.cwd(), "artifacts/admin-app/src/features/question-studio/useQuestionStudio.ts"),
  "utf8",
);

assert(
  hookSource.includes("notifyQuestionStudioRefresh();"),
  "Successful generation must notify review consumers even when review filters do not change.",
);

const contentReviewSource = readFileSync(
  resolve(process.cwd(), "artifacts/admin-app/src/features/content-review/useContentReviewController.ts"),
  "utf8",
);

assert(
  contentReviewSource.includes("expectedStatuses"),
  "Content Review must submit expected statuses through the central Question Studio decision path.",
);
assert(
  !contentReviewSource.includes("updateProbabilityReviewItem"),
  "Content Review must not retain a specialist Probability review mutation path.",
);

console.log("[QUESTION-STUDIO-COCKPIT-DISCOVERABILITY-CONTRACT-V1]", {
  valid: true,
  cpSubsetSuppression: false,
  registeredPackageDiscoverability: true,
});
