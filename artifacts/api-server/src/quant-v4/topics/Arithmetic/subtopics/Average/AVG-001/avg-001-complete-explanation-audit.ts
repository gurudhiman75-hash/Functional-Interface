import assert from "node:assert/strict";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001EditorialV2Pipeline } from "./foundation/editorial-v2-release";
import { runAvg001LocalizedRelease } from "./foundation/localized-release";
import { applyAvg001CompleteLearnerExplanation } from "./foundation/complete-learner-explanation";
import { runAvg001QuestionStudioPipeline } from "./question-studio-adapter";
import type { Avg001QuestionPackage } from "./foundation/types";

const entries = getAvg001QuestionEntries();
const languages = ["en", "hi", "pa"] as const;
const seeds = ["avg-explanation-review-20261101", "avg-explanation-boundary-a", "avg-explanation-boundary-b"];
const modes = new Set<string>();
let checked = 0;

function mathematicalSurface(pkg: Avg001QuestionPackage) {
  const { explanation: _explanation, validation: _validation, traceability: _traceability, ...surface } = pkg;
  return surface;
}

for (const entry of entries) for (const language of languages) for (const seed of seeds) {
  const source = language === "en"
    ? runAvg001EditorialV2Pipeline({ questionLanguageId: entry.qlId, language, seed })
    : runAvg001LocalizedRelease({ questionLanguageId: entry.qlId, language, seed });
  const revised = runAvg001QuestionStudioPipeline(entry.cpId, { questionLanguageId: entry.qlId, language, seed });
  assert.deepEqual(mathematicalSurface(revised), mathematicalSurface(source), `${entry.qlId}:${language}: changed mathematical or question authority`);
  assert(revised.validation.valid, `${entry.qlId}:${language}: invalid package`);
  assert.equal(revised.explanation.lines.length, 4);
  assert(revised.explanation.lines.every(line => line.trim().length > 0));
  const text = revised.explanation.lines.join("\n\n");
  assert(!/undefined|NaN|Infinity|MISCONCEPTION|ARITHMETIC_|Common traps|Exam speed shortcut|ਸਰਲ ਕਰਨ ਉੱਤੇ ਸਰਲ/.test(text));
  assert.equal((text.match(/\$\$/g) ?? []).length % 2, 0, `${entry.qlId}: unbalanced math`);
  assert(revised.explanation.lines[2].includes("$$"), `${entry.qlId}: missing final working`);
  assert(!revised.validation.checks.some(check => /four-tier|analyses every wrong option|shortcut and trap/.test(check.message)));
  if (language !== "en") {
    const prose = text.replace(/\$\$[\s\S]*?\$\$/g, "").replace(/\bn\b/g, "");
    assert(!/[A-Za-z]/.test(prose), `${entry.qlId}:${language}: English leaked into prose`);
  }
  if (seed === seeds[0]) {
    assert.deepEqual(applyAvg001CompleteLearnerExplanation(revised), revised, `${entry.qlId}: not idempotent`);
  }
  modes.add(entry.solveMode);
  checked++;
}

const sample = (id: string, language: "en" | "hi" | "pa" = "en") => {
  const entry = entries.find(entry => entry.qlId === id)!;
  return runAvg001QuestionStudioPipeline(entry.cpId, { questionLanguageId: id, language, seed: seeds[0] });
};
const added = sample("AVG-QL-123").explanation.lines.join("\n");
assert(added.includes("300 + 52 = 352") && added.includes("352 \\div 11 = 32"));
assert(!added.includes("years"), "Unitless numbers were described as ages");
const child = sample("AVG-QL-133", "pa").explanation.lines.join("\n");
assert(child.includes("30 + 4 = 34") && child.includes("170 + 10 = 180"));
assert(!/ਨਵਜਾਤ|ਨਵਜੰਮੇ/.test(child), "A ten-year-old was called a newborn");
const hierarchy = sample("AVG-QL-330").explanation.lines.join("\n");
assert(hierarchy.includes("1680 + 3600 + 1920 = 7200") && hierarchy.includes("7200 \\div 120 = 60"));
const missing = sample("AVG-QL-355").explanation.lines.join("\n");
assert(missing.includes("3900 + 34n = 28(150 + n)") && missing.includes("300 \\div (6) = 50"));
const cricket = sample("AVG-QL-197").explanation.lines.join("\n");
assert(cricket.includes("252 - 200 = 52") && cricket.includes("52 runs") && !cricket.includes("marks"));
const mismatch = sample("AVG-QL-123");
assert.throws(() => applyAvg001CompleteLearnerExplanation({ ...mismatch, solver: { ...mismatch.solver, exactAnswer: { numerator: 999, denominator: 1 } } }), /disagrees/);
assert.throws(() => applyAvg001CompleteLearnerExplanation({ ...mismatch, independentVerification: { ...mismatch.independentVerification, exactAnswer: { numerator: 999, denominator: 1 } } }), /disagrees/);

console.log(JSON.stringify({ status: "PASS", questionLanguages: entries.length, languages, seeds: seeds.length, solveModes: modes.size, checked }));
