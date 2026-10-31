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
type EditorialSample = { packageId: string; cpId: string; language: string; stem: string; options: string[]; explanation: string; warnings: string[] };
const editorialSamples: EditorialSample[] = [];
const editorialWarnings: Record<string, number> = {};
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
        const q = generated.questions[0] as Record<string, unknown>;
        const getText = (value: unknown) => typeof value === "string" ? value : "";
        const stem = getText(q.stem) || getText(q.text);
        const options = Array.isArray(q.options) ? q.options.map((v: unknown) =>
          typeof v === "string" ? v : getText((v as Record<string, unknown>)?.text)) : [];
        const explanation = typeof q.explanation === "string" ? q.explanation :
          JSON.stringify(q.explanation ?? "");
        const warnings: string[] = [];
        if (!stem.trim()) warnings.push("EMPTY_STEM");
        if (!options.length) warnings.push("OPTIONS_NOT_IN_STANDARD_FIELD");
        if (options.some(v => !v.trim())) warnings.push("EMPTY_OPTION");
        if (!explanation.trim() || explanation === "{}") warnings.push("EMPTY_EXPLANATION");
        if (language === "hi" && stem && !/[\u0900-\u097F]/u.test(stem)) warnings.push("NO_DEVANAGARI_STEM");
        if (language === "pa" && stem && !/[\u0A00-\u0A7F]/u.test(stem)) warnings.push("NO_GURMUKHI_STEM");
        for (const warning of warnings) editorialWarnings[warning] = (editorialWarnings[warning] ?? 0) + 1;
        if (warnings.length || !editorialSamples.some(v => v.packageId === pkg.packageId && v.language === language)) {
          editorialSamples.push({packageId: pkg.packageId, cpId, language, stem: stem.slice(0,450),
            options: options.slice(0,8).map(v => v.slice(0,200)),
            explanation: explanation.slice(0,800), warnings});
        }
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
  editorialDiagnostics: { warningCounts: editorialWarnings, sampleCount: editorialSamples.length,
    limitation: "Diagnostic heuristics only; not human language approval" },
};
await writeFile("qs-multilingual-editorial-samples.json", JSON.stringify(editorialSamples, null, 2));
await writeFile("qs-full-multilingual-audit.json", JSON.stringify(report, null, 2));
console.log("QS_FULL_MULTILINGUAL_SUMMARY", JSON.stringify(report));
if (failures.length) process.exitCode = 1;
