import { strict as assert } from "node:assert";
import { extractPlaceholders, getCommonQuestionLanguageIds } from "./library";
import { getEffectiveRap001QuestionEntry } from "./effective-question-entry";
import { getRap001ActiveCanonicalProblemIds } from "./parameter-generator";
import { runRap001Pipeline } from "./pipeline";

const languages = ["hi", "pa"] as const;
const seedsPerQl = 10;

function withoutMath(text: string) {
  return text.replace(/\$\$[\s\S]*?\$\$/g, " ");
}

function prose(text: string) {
  return withoutMath(text).replace(/\{[^}]+\}/g, " ").replace(/\\[A-Za-z]+/g, " ")
    .replace(/Rs\./g, " ").replace(/[0-9%₹{}.,:;!?()\-+/=\[\]$|]/g, " ").replace(/\s+/g, " ").trim();
}

function bad(text: string, language: "hi" | "pa", allowPlaceholders = false) {
  const visible = prose(text);
  const wrongScript = language === "hi" ? !/[\u0900-\u097F]/.test(visible) : !/[\u0A00-\u0A7F]/.test(visible);
  const unresolved = !allowPlaceholders && /\{[A-Za-z_][A-Za-z0-9_]*\}/.test(withoutMath(text));
  return /[A-Za-z]{2,}/.test(visible) || text.includes("???") || /[ÃàÂ�]/.test(text) || unresolved || wrongScript;
}

function samePlaceholders(a: string, b: string) {
  const left = extractPlaceholders(a).sort();
  const right = extractPlaceholders(b).sort();
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

const failures: string[] = [];
let qlCount = 0;
let generated = 0;

for (const cpId of getRap001ActiveCanonicalProblemIds()) {
  const qlIds = getCommonQuestionLanguageIds(cpId);
  qlCount += qlIds.length;
  for (const qlId of qlIds) {
    const en = getEffectiveRap001QuestionEntry(cpId, qlId, "en").template;
    for (const language of languages) {
      const localized = getEffectiveRap001QuestionEntry(cpId, qlId, language).template;
      if (!samePlaceholders(en, localized)) failures.push(`${language}:${qlId}: placeholder occurrences`);
      if (bad(localized, language, true)) failures.push(`${language}:${qlId}: source stem -> ${localized}`);
      for (let index = 0; index < seedsPerQl; index += 1) {
        const seed = `rap-001-l10n:${language}:${qlId}:${index}`;
        const pkg = runRap001Pipeline(cpId, { language, questionLanguageId: qlId, seed });
        generated += 1;
        const failed = pkg.validation.checks.filter((item) => !item.passed).map((item) => item.name);
        if (failed.length) failures.push(`${language}:${qlId}:${index}: ${failed.join(",")}`);
        if (bad(pkg.stem, language)) failures.push(`${language}:${qlId}:${index}: stem -> ${pkg.stem}`);
        const explanation = pkg.explanation.lines.join(" | ");
        if (bad(explanation, language)) failures.push(`${language}:${qlId}:${index}: explanation -> ${explanation}`);
        if (!pkg.explanation.lines.some((line) => line.includes("\\Rightarrow"))) failures.push(`${language}:${qlId}:${index}: arithmetic`);
      }
    }
  }
}

console.log(JSON.stringify({ qlCount, languages, seedsPerQl, generated, failureCount: failures.length, failures: failures.slice(0, 80) }, null, 2));
assert.equal(qlCount, 67);
assert.equal(generated, 67 * 2 * seedsPerQl);
assert.equal(failures.length, 0, failures.slice(0, 30).join("\n"));
