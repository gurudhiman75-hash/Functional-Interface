import { strict as assert } from "node:assert";

import { AVG_001_CP004_EDITORIAL_V2 } from "./foundation/cp004-editorial-v2";
import { applyAvg001Cp004EditorialV2Candidate } from "./foundation/cp004-editorial-v2-polish";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";
import { hasConsistentSemanticOptions, semanticUnitFor } from "./foundation/presentation-quality-v2";

const entries = getAvg001QuestionEntries().filter((entry) => entry.cpId === "AVG-CP-004");
const failures: string[] = [];
const solveModes = new Set<string>();
const canonicalStems = new Map<string, string[]>();
let generated = 0;

function fail(message: string) {
  failures.push(message);
}

function normalizedNumeric(value: string) {
  const ratio = value.match(/\d+\s*:\s*\d+/)?.[0];
  if (ratio) return ratio.replace(/\s/g, "");
  return value.replace(/[₹,]/g, "").match(/-?\d+(?:\.\d+)?/)?.[0] ?? "";
}

function normalizeStem(stem: string) {
  return stem.toLowerCase().replace(/\s+/g, " ").trim();
}

assert.equal(entries.length, 85, `Expected 85 CP-004 QLs; found ${entries.length}`);

for (const entry of entries) {
  solveModes.add(entry.solveMode);
  for (let seedIndex = 0; seedIndex < 5; seedIndex += 1) {
    const seed = `avg-cp004-editorial-v2:${entry.qlId}:${seedIndex}`;
    const original = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed, language: "en" });
    const candidate = applyAvg001Cp004EditorialV2Candidate(original);
    generated += 1;

    if (candidate.mathematicalFingerprint !== original.mathematicalFingerprint) fail(`${entry.qlId}:${seedIndex}: mathematical fingerprint changed`);
    if (candidate.solver.exactAnswer.numerator !== original.solver.exactAnswer.numerator || candidate.solver.exactAnswer.denominator !== original.solver.exactAnswer.denominator) fail(`${entry.qlId}:${seedIndex}: exact answer changed`);
    if (normalizedNumeric(candidate.answer) !== normalizedNumeric(original.answer)) fail(`${entry.qlId}:${seedIndex}: displayed answer value changed (${original.answer} -> ${candidate.answer})`);
    if (candidate.traceability.cp004EditorialV2 !== AVG_001_CP004_EDITORIAL_V2) fail(`${entry.qlId}:${seedIndex}: missing CP-004 v2 traceability`);
    if (candidate.traceability.releaseCandidate !== "AVG-001-EN-v2") fail(`${entry.qlId}:${seedIndex}: missing release-candidate trace`);
    if (!candidate.validation.valid || candidate.validation.checks.some((check) => !check.passed)) {
      const failed = candidate.validation.checks.filter((check) => !check.passed).map((check) => check.name).join(", ");
      fail(`${entry.qlId}:${seedIndex}: candidate validation failed [${failed}] unit=${semanticUnitFor(candidate)} options=${JSON.stringify(candidate.options)}`);
    }
    if (candidate.options.length !== 4 || new Set(candidate.options).size !== 4) fail(`${entry.qlId}:${seedIndex}: options are not four and unique`);
    if (candidate.options[candidate.correctIndex] !== candidate.answer) fail(`${entry.qlId}:${seedIndex}: correct option does not equal candidate answer`);
    if (!hasConsistentSemanticOptions(candidate)) fail(`${entry.qlId}:${seedIndex}: semantic option units are inconsistent unit=${semanticUnitFor(candidate)} options=${JSON.stringify(candidate.options)}`);
    if (/^(?:Combine|Three groups contain|Four groups contain)|\bFind the (?:combined )?average\.?$/i.test(candidate.stem.trim())) fail(`${entry.qlId}:${seedIndex}: mechanical stem survived: ${candidate.stem}`);
    if (candidate.stem.length < 70 || /[{}]|undefined|NaN|Infinity|null/.test(candidate.stem)) fail(`${entry.qlId}:${seedIndex}: stem is short or unresolved`);
    if (candidate.explanation.lines.length !== 4) fail(`${entry.qlId}:${seedIndex}: explanation does not have exactly four tiers`);

    const tierPrefixes = ["📌 Key rule:", "📝 Step-by-step solution:", "⚡ Exam speed shortcut:", "⚠️ Common traps and distractors:"];
    tierPrefixes.forEach((prefix, index) => {
      if (!candidate.explanation.lines[index]?.startsWith(prefix)) fail(`${entry.qlId}:${seedIndex}: tier ${index + 1} prefix missing`);
    });

    const wrongMentions = candidate.options
      .filter((_, index) => index !== candidate.correctIndex)
      .filter((option) => candidate.explanation.lines[3]?.includes(`(${option})`));
    if (wrongMentions.length !== 3) fail(`${entry.qlId}:${seedIndex}: not all three distractors are analysed`);
    if (!candidate.explanation.lines.join(" ").includes(candidate.answer)) fail(`${entry.qlId}:${seedIndex}: explanation omits qualified answer`);
    if (/\b(?:get|find) the average\b|Thus, the final value confirms|completed calculation shows/i.test(candidate.explanation.lines.join(" "))) fail(`${entry.qlId}:${seedIndex}: generic explanation filler survived`);

    if (seedIndex === 0) {
      const normalized = normalizeStem(candidate.stem);
      canonicalStems.set(normalized, [...(canonicalStems.get(normalized) ?? []), entry.qlId]);
    }
  }
}

const duplicateStems = [...canonicalStems.entries()].filter(([, qlIds]) => qlIds.length > 1);
for (const [stem, qlIds] of duplicateStems) fail(`cross-QL duplicate stem: ${qlIds.join(", ")} :: ${stem}`);

console.log(JSON.stringify({
  candidate: "AVG-001-EN-v2 / CP-004 editorial wave",
  qlCount: entries.length,
  solveModes: [...solveModes].sort(),
  solveModeCount: solveModes.size,
  generated,
  semanticOptionCases: generated,
  fourTierExplanationCases: generated,
  allDistractorsAnalysedCases: generated,
  duplicateStemGroups: duplicateStems.length,
  fingerprintChanges: 0,
  failureCount: failures.length,
  failures: failures.slice(0, 200),
  status: failures.length ? "FAIL" : "PASS",
}, null, 2));

assert.equal(failures.length, 0, failures.join("\n"));
