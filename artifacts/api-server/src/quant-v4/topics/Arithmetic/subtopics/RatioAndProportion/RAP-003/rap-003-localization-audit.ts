import { strict as assert } from "node:assert";
import { getRap003ActiveCanonicalProblemIds, getRap003QuestionLanguageIds } from "./library";
import { runRap003Pipeline } from "./pipeline";

const languages = ["hi", "pa"] as const;
const seedsPerQl = 3;

function withoutMath(text: string) {
  return text.replace(/\$\$[\s\S]*?\$\$/g, " ");
}

function visible(text: string) {
  return withoutMath(text)
    .replace(/\{[^}]+\}/g, " ")
    .replace(/\\[A-Za-z]+/g, " ")
    .replace(/Rs\./g, " ")
    .replace(/[0-9%₹{}.,:;!?()\-+/=\[\]$|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function bad(text: string, language: "hi" | "pa") {
  const prose = visible(text);
  const wrongScript = language === "hi" ? !/[\u0900-\u097F]/.test(prose) : !/[\u0A00-\u0A7F]/.test(prose);
  const unresolved = /\{[A-Za-z_][A-Za-z0-9_]*\}/.test(withoutMath(text));
  return /[A-Za-z]{2,}/.test(prose)
    || text.includes("???")
    || /[ÃàÂ�]/.test(text)
    || unresolved
    || wrongScript;
}

const failures: string[] = [];
let qlCount = 0;
let generated = 0;

for (const cpId of getRap003ActiveCanonicalProblemIds()) {
  const qlIds = getRap003QuestionLanguageIds(cpId);
  qlCount += qlIds.length;
  for (const qlId of qlIds) {
    for (const language of languages) {
      for (let index = 0; index < seedsPerQl; index += 1) {
        const seed = `rap-003-l10n:${language}:${qlId}:${index}`;
        try {
          const pkg = runRap003Pipeline(cpId, { language, questionLanguageId: qlId, seed });
          generated += 1;
          const failed = pkg.validation.checks.filter((item) => !item.passed).map((item) => item.name);
          if (failed.length) failures.push(`${language}:${qlId}:${index}: validation [${failed.join(",")}]`);
          if (bad(pkg.stem, language)) failures.push(`${language}:${qlId}:${index}: stem -> ${pkg.stem}`);
          const explanation = pkg.explanation.lines.join(" | ");
          if (bad(explanation, language)) failures.push(`${language}:${qlId}:${index}: explanation -> ${explanation}`);
          if (!pkg.explanation.lines.some((line) => line.includes("$$"))) failures.push(`${language}:${qlId}:${index}: no visible arithmetic`);
          if (!pkg.explanation.lines.at(-1)?.includes(String(pkg.solver.answerValue).replaceAll("$$", ""))) {
            failures.push(`${language}:${qlId}:${index}: conclusion does not show answer`);
          }
        } catch (error) {
          generated += 1;
          failures.push(`${language}:${qlId}:${index}: threw ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }
  }
}

console.log(JSON.stringify({ qlCount, languages, seedsPerQl, generated, failureCount: failures.length, failures: failures.slice(0, 160) }, null, 2));
assert.equal(qlCount, 222);
assert.equal(generated, 222 * 2 * seedsPerQl);
assert.equal(failures.length, 0, failures.slice(0, 60).join("\n"));
