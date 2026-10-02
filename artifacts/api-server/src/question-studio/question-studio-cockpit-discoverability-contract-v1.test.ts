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

console.log("[QUESTION-STUDIO-COCKPIT-DISCOVERABILITY-CONTRACT-V1]", {
  valid: true,
  cpSubsetSuppression: false,
  registeredPackageDiscoverability: true,
});
