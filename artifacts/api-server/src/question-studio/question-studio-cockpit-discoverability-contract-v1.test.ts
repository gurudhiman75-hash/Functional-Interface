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

console.log("[QUESTION-STUDIO-COCKPIT-DISCOVERABILITY-CONTRACT-V1]", {
  valid: true,
  cpSubsetSuppression: false,
  registeredPackageDiscoverability: true,
});
