import { strict as assert } from "node:assert";
import { getAvg001QuestionLanguageIds } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const bannedStemPatterns: Array<[RegExp, string]> = [
  [/\bbranche\b/i, "misspelling of branch"],
  [/\b(?:shows|has|gives|reports|is) a average\b/i, "wrong article before average"],
  [/\bwas averaged to\b/i, "unnatural passive average wording"],
  [/\bfind the accurate average\b/i, "unnatural accurate-average wording"],
  [/\bhas reported average\b/i, "missing article before reported average"],
  [/\brecover the average\b/i, "technical recover wording"],
  [/\bwhat average appeared\b/i, "unnatural appeared wording"],
  [/\bwhat belonged there\b/i, "informal placeholder wording"],
  [/\bproduced average\b/i, "missing article before average"],
  [/\bmoved the average\b/i, "unnatural moved-average wording"],
  [/\bwhat had that record shown\b/i, "unnatural record wording"],
  [/\bwhat total does this represent\b/i, "abstract total wording"],
  [/\bparent group\b/i, "internal hierarchy terminology"],
  [/\blower groups\b/i, "internal hierarchy terminology"],
  [/\bfind the final average\b/i, "vague final-average wording"],
  [/\bfind the remaining size\b/i, "vague remaining-size wording"],
  [/\btotal represented by that average\b/i, "abstract represented-total wording"],
  [/\(\s*\d[^)]*,\s*\d[^)]*\)/, "tuple notation in a question stem"],
  [/\b1 hours\b/i, "singular/plural mismatch"],
  [/\bnew member with value\b/i, "generic member-value wording"],
];

const failures: string[] = [];
let checked = 0;

for (const qlId of getAvg001QuestionLanguageIds()) {
  const question = runAvg001Pipeline({ questionLanguageId: qlId, seed: `natural-language:${qlId}` });

  for (const [pattern, reason] of bannedStemPatterns) {
    if (pattern.test(question.stem)) failures.push(`${qlId}: ${reason}: ${question.stem}`);
  }

  const wordCount = question.stem.trim().split(/\s+/).length;
  if (wordCount > 55) failures.push(`${qlId}: stem has ${wordCount} words`);

  if (question.canonicalProblemId === "AVG-CP-006" && question.parameters.answerType !== "COUNT") {
    const ending = question.explanation.lines.at(-1) ?? "";
    if (/missing count/i.test(ending)) failures.push(`${qlId}: non-count answer is labelled as a missing count`);
  }

  checked += 1;
}

assert.equal(checked, 425);
assert.equal(failures.length, 0, failures.join("\n"));
console.log(JSON.stringify({ checked, failureCount: failures.length, failures, status: "PASS" }, null, 2));
