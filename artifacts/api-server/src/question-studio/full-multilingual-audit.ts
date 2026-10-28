// Offline only: exhaustively probe every canonical CP in every admitted
// trilingual Question Studio package. No queues, database or publication.
import { writeFile } from "node:fs/promises";
import { generateQuestionStudioQuestions, listQuestionStudioPackages } from "./engine-registry";

const langs = ["en", "hi", "pa"] as const;
const admissionReasons = (p: ReturnType<typeof listQuestionStudioPackages>[number]) => [
  p.enabled !== true,
  p.reviewSurfaceRequired !== true,
  p.manualApprovalRequired !== true,
  p.productionReleaseAuthorized !== false,
  p.automaticStudentPublication !== false,
  p.publiclyPublishable !== false,
  !Array.isArray(p.cpIds) || p.cpIds.length === 0,
  new Set(p.cpIds).size !== p.cpIds.length,
  p.cpIds.some(id => !/^[A-Z][A-Z0-9-]{1,80}$/.test(id)),
].some(Boolean);
const packages = listQuestionStudioPackages().filter(p =>
  !admissionReasons(p) && langs.every(lang => p.supportedLanguages.includes(lang))
);
type Probe = { engineId: string; packageId: string; cpId: string; language: string; status: "PASS" | "FAIL"; error?: string };
const results: Probe[] = [];
for (const pkg of packages) {
  for (const cpId of pkg.cpIds) {
    for (const language of langs) {
      const row: Probe = {engineId: pkg.engineId, packageId: pkg.packageId, cpId, language, status: "PASS"};
      try {
        const generated = await generateQuestionStudioQuestions({
          packageId: pkg.packageId, canonicalProblemId: cpId, language,
          ...(pkg.packageId === "WFM-001" && ["WFM-CP-004", "WFM-CP-005"].includes(cpId) ? { exam: "BANKING_5" } : {}),
          count: 1, seed: "qs-language-audit-" + pkg.packageId + "-" + cpId + "-" + language,
        });
        if (generated.questions.length !== 1) throw new Error("EXPECTED_EXACTLY_ONE_QUESTION");
      } catch (err) {
        row.status = "FAIL";
        row.error = String(err instanceof Error ? err.message : err).slice(0, 350);
      }
      results.push(row);
      console.log("QS_FULL_MULTILINGUAL_PROBE", JSON.stringify(row));
    }
  }
}
const failures = results.filter(row => row.status === "FAIL");
const report = {
  classification: "offline generation smoke only; editorial localization/semantic parity NOT VERIFIED",
  packages: packages.length,
  checkpoints: results.length / langs.length,
  attempted: results.length, passed: results.length - failures.length, failed: failures.length,
  failures,
};
await writeFile("qs-full-multilingual-audit.json", JSON.stringify(report, null, 2));
console.log("QS_FULL_MULTILINGUAL_SUMMARY", JSON.stringify(report));
if (failures.length) process.exitCode = 1;
