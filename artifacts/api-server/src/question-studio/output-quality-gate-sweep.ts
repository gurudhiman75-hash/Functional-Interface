// Offline only: generate a small sample from every Question Studio package in
// every supported language and run the critical output gate on each item.
//
//   tsx output-quality-gate-sweep.ts            # fail on anything not in the baseline
//   tsx output-quality-gate-sweep.ts --update   # rewrite the baseline (only after review)
//
// The baseline records defects that are already known and tracked (for
// example Indian Geography HI/PA, awaiting native translation). A new
// package/language/code pair, or a higher count than recorded, fails the run.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { generateQuestionStudioQuestions, listQuestionStudioPackages } from "./engine-registry";
import { generateQuestion, listQuestionStudioPackages as listSharedPackages } from "./shared-generation-engine";
import { gateInputFromQuestion, inspectQuestionStudioOutput, type QuestionStudioGateLanguage } from "./output-quality-gate";

const LANGUAGES: readonly QuestionStudioGateLanguage[] = ["en", "hi", "pa"];
const COUNT = Number(process.env.QS_GATE_COUNT ?? 4);
const SEED = process.env.QS_GATE_SEED ?? "qs-output-gate-v1";
const here = dirname(fileURLToPath(import.meta.url));
const BASELINE_PATH = join(here, "output-quality-gate-baseline.json");
const update = process.argv.includes("--update");

type Source = "registry" | "shared";
const targets = new Map<string, { source: Source; languages: string[] }>();
for (const pkg of listQuestionStudioPackages() as Array<{ packageId: string; supportedLanguages?: string[] }>) {
  targets.set(pkg.packageId, { source: "registry", languages: pkg.supportedLanguages ?? ["en"] });
}
for (const pkg of listSharedPackages() as Array<{ packageId: string; supportedLanguages?: string[] }>) {
  if (!targets.has(pkg.packageId)) targets.set(pkg.packageId, { source: "shared", languages: pkg.supportedLanguages ?? ["en"] });
}

const silence = { log: console.log, warn: console.warn, info: console.info };
const observed: Record<string, number> = {};
const examples: Record<string, string> = {};
const generationErrors: string[] = [];

for (const [packageId, target] of [...targets.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  for (const language of LANGUAGES.filter((lang) => target.languages.includes(lang))) {
    let questions: Record<string, unknown>[] = [];
    console.log = console.warn = console.info = () => {};
    try {
      const request = { packageId, language, count: COUNT, seed: `${SEED}:${packageId}:${language}` };
      const batch: any = target.source === "registry"
        ? await generateQuestionStudioQuestions(request as never)
        : await generateQuestion(request as never);
      questions = (batch?.questions ?? batch?.questionPackages ?? []) as Record<string, unknown>[];
    } catch (error) {
      generationErrors.push(`${packageId}|${language}: ${String((error as Error)?.message ?? error).slice(0, 160)}`);
    } finally {
      Object.assign(console, silence);
    }
    for (const question of questions) {
      for (const finding of inspectQuestionStudioOutput(gateInputFromQuestion(packageId, language, question))) {
        const key = `${packageId}|${language}|${finding.code}`;
        observed[key] = (observed[key] ?? 0) + 1;
        examples[key] ??= finding.evidence;
      }
    }
  }
}

const sortObject = (value: Record<string, number>) => Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)));

if (update) {
  writeFileSync(BASELINE_PATH, `${JSON.stringify({ count: COUNT, seed: SEED, known: sortObject(observed) }, null, 2)}\n`);
  console.log(`QS_OUTPUT_GATE baseline written: ${Object.keys(observed).length} known keys`);
} else {
  const baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf8")) as { known: Record<string, number> };
  const regressions = Object.entries(observed)
    .filter(([key, count]) => count > (baseline.known[key] ?? 0))
    .map(([key, count]) => `${key}: ${count} (baseline ${baseline.known[key] ?? 0}) e.g. ${JSON.stringify(examples[key])}`);
  const fixed = Object.keys(baseline.known).filter((key) => !(key in observed));
  console.log(`QS_OUTPUT_GATE packages=${targets.size} findings=${Object.values(observed).reduce((a, b) => a + b, 0)} regressions=${regressions.length} fixedSinceBaseline=${fixed.length}`);
  if (fixed.length) console.log(`Fixed since baseline (run with --update to tighten):\n  ${fixed.join("\n  ")}`);
  if (generationErrors.length) console.log(`Generation errors (not gated):\n  ${generationErrors.join("\n  ")}`);
  if (regressions.length) {
    console.error(`New critical output defects:\n  ${regressions.join("\n  ")}`);
    process.exitCode = 1;
  }
}
