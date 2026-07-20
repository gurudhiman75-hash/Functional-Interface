import { strict as assert } from "node:assert";
import { getRap002ActiveCanonicalProblemIds, getRap002QuestionLanguageIds, validateRap002Libraries } from "./library";
import { runRap002Pipeline } from "./pipeline";

const languages = ["hi", "pa"] as const;
const seedsPerQl = 5;

function withoutMath(text: string) {
  return text.replace(/\$\$[\s\S]*?\$\$/g, " ");
}

function visible(text: string) {
  return withoutMath(text).replace(/\{[^}]+\}/g, " ").replace(/\\[A-Za-z]+/g, " ")
    .replace(/Rs\./g, " ").replace(/[0-9%₹{}.,:;!?()\-+/=\[\]$|]/g, " ").replace(/\s+/g, " ").trim();
}

function bad(text: string, language: "hi" | "pa") {
  const prose = visible(text);
  const wrongScript = language === "hi" ? !/[\u0900-\u097F]/.test(prose) : !/[\u0A00-\u0A7F]/.test(prose);
  const unresolved = /\{[A-Za-z_][A-Za-z0-9_]*\}/.test(withoutMath(text));
  return /[A-Za-z]{2,}/.test(prose) || text.includes("???") || /[ÃàÂ�]/.test(text) || unresolved || wrongScript;
}

const library = validateRap002Libraries();
const failures = [...library.failures];
let qlCount = 0;
let generated = 0;

for (const cpId of getRap002ActiveCanonicalProblemIds()) {
  const qlIds = getRap002QuestionLanguageIds(cpId);
  qlCount += qlIds.length;
  for (const qlId of qlIds) {
    for (const language of languages) {
      for (let index = 0; index < seedsPerQl; index += 1) {
        const pkg = runRap002Pipeline(cpId, { language, questionLanguageId: qlId, seed: `rap-002-l10n:${language}:${qlId}:${index}` });
        generated += 1;
        const failed = pkg.validation.checks.filter((item) => !item.passed).map((item) => item.name);
        if (failed.length) failures.push(`${language}:${qlId}:${index}: ${failed.join(",")}`);
        if (bad(pkg.stem, language)) failures.push(`${language}:${qlId}:${index}: stem -> ${pkg.stem}`);
        const explanation = pkg.explanation.lines.join(" | ");
        if (bad(explanation, language)) failures.push(`${language}:${qlId}:${index}: explanation -> ${explanation}`);
        if (!pkg.explanation.lines.some((line) => line.includes("$$"))) failures.push(`${language}:${qlId}:${index}: no arithmetic`);
      }
    }
  }
}

console.log(JSON.stringify({ libraryValid: library.valid, qlCount, languages, seedsPerQl, generated, failureCount: failures.length, failures: failures.slice(0, 100) }, null, 2));
assert.equal(qlCount, 102);
assert.equal(generated, 102 * 2 * seedsPerQl);
assert.equal(failures.length, 0, failures.slice(0, 40).join("\n"));
