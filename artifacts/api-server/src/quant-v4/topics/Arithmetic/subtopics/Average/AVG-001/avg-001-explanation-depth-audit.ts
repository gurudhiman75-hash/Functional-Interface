import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const failures: string[] = [];
const countsByCp: Record<string, number> = {};
let cases = 0;

const conceptPatterns: Record<string, RegExp> = {
  "AVG-CP-001":
    /multiply the average|divide the total|known total|required total|shared among|total is/i,
  "AVG-CP-002":
    /equally spaced|halfway|middle term|equal gaps|half-span|span/i,
  "AVG-CP-003":
    /old total|new total|remaining total|count stays|add |subtract |replace |difference between|total rises|current runs|required runs/i,
};

const bannedTextbookLanguage =
  /representative share|equal-share groups?|opposite-end pairs?|common mean of|deviations? cancel|point of symmetry|combined total represented by|unaccounted for|revised average is the updated total shared equally|must supply exactly|locates the requested/i;

const formulaOnlyOpeners = /^(use:|substitute\b)/i;

function wordCount(line: string) {
  return line
    .replace(/\$\$.*?\$\$/g, "")
    .replace(/[^A-Za-z]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function numericValue(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value.replace(/,/g, ""));
  if (
    value &&
    typeof value === "object" &&
    "numerator" in value &&
    "denominator" in value
  ) {
    return (
      Number((value as { numerator: number }).numerator) /
      Number((value as { denominator: number }).denominator)
    );
  }
  return Number.NaN;
}

function containsAnswer(line: string, answer: string) {
  const tokens =
    line.replace(/,/g, "").match(/-?\d+(?:\.\d+)?(?:\/\d+)?/g) ?? [];
  return tokens.includes(answer.replace(/,/g, ""));
}

for (const entry of getAvg001QuestionEntries()) {
  for (let index = 0; index < 12; index += 1) {
    const pkg = runAvg001Pipeline({
      questionLanguageId: entry.qlId,
      seed: `avg-explanation-depth:${entry.qlId}:${index}`,
    });
    cases += 1;
    countsByCp[pkg.canonicalProblemId] =
      (countsByCp[pkg.canonicalProblemId] ?? 0) + 1;

    const lines = pkg.explanation.lines.map((line) => line.trim()).filter(Boolean);
    const equationLines = lines.filter((line) => /\$\$/.test(line));
    const conclusionLines = lines.filter(
      (line) => containsAnswer(line, pkg.answer) && !/\$\$/.test(line),
    );
    const reasoningLines = lines.filter(
      (line) => !/\$\$/.test(line) && !conclusionLines.includes(line),
    );
    const joined = lines.join(" ");
    const normalizedJoined = joined.replace(/,/g, "");
    const conceptPattern = conceptPatterns[pkg.canonicalProblemId];
    const totalWords = lines.reduce((sum, line) => sum + wordCount(line), 0);

    if (lines.length < 3 || lines.length > 6) {
      failures.push(
        `${entry.qlId}:${index}: expected three to six explanation lines, found ${lines.length}`,
      );
    }
    if (equationLines.length < 1 || equationLines.length > 2) {
      failures.push(
        `${entry.qlId}:${index}: expected one or two calculation lines, found ${equationLines.length}`,
      );
    }
    if (reasoningLines.length < 1) {
      failures.push(`${entry.qlId}:${index}: missing a plain-language reasoning step`);
    }
    if (reasoningLines.every((line) => wordCount(line) < 6)) {
      failures.push(`${entry.qlId}:${index}: reasoning is too thin`);
    }
    if (!conceptPattern?.test(joined)) {
      failures.push(`${entry.qlId}:${index}: missing CP-specific reasoning`);
    }
    if (bannedTextbookLanguage.test(joined)) {
      failures.push(`${entry.qlId}:${index}: contains formal textbook-style wording`);
    }
    if (lines.some((line) => formulaOnlyOpeners.test(line))) {
      failures.push(`${entry.qlId}:${index}: begins with a formula instruction`);
    }
    if (!conclusionLines.length) {
      failures.push(`${entry.qlId}:${index}: missing a contextual conclusion with the answer`);
    }
    if (/required answer|required result/i.test(joined)) {
      failures.push(`${entry.qlId}:${index}: uses a generic conclusion`);
    }
    if (reasoningLines.some((line) => wordCount(line) > 22)) {
      failures.push(`${entry.qlId}:${index}: contains an overly long reasoning sentence`);
    }
    if (totalWords > 75) {
      failures.push(`${entry.qlId}:${index}: explanation is too verbose (${totalWords} words)`);
    }
    if (/check:|verification:|indeed,/i.test(joined)) {
      failures.push(`${entry.qlId}:${index}: includes an unnecessary verification line`);
    }

    const values = pkg.parameters.values as Record<string, unknown>;
    if (
      pkg.parameters.scenarioVariant === "familyAgeElapsedTime" &&
      pkg.solveMode === "findNewAverageAfterAddition"
    ) {
      const expectedAgedTotal =
        (numericValue(values.oldAverage) + numericValue(values.elapsedYears)) *
        numericValue(values.oldCount);
      if (!normalizedJoined.includes(String(expectedAgedTotal))) {
        failures.push(
          `${entry.qlId}:${index}: explanation omits the aged group total ${expectedAgedTotal}`,
        );
      }
    }
    if (
      pkg.parameters.scenarioVariant === "newbornAfterElapsedYears" &&
      /\bchild\b/i.test(joined)
    ) {
      failures.push(`${entry.qlId}:${index}: reintroduces child wording for the joining member`);
    }
  }
}

console.log(
  JSON.stringify(
    {
      cases,
      countsByCp,
      failureCount: failures.length,
      failures: failures.slice(0, 100),
      status: failures.length ? "FAIL" : "PASS",
    },
    null,
    2,
  ),
);

assert.equal(cases, 1056);
assert.equal(failures.length, 0, failures.join("\n"));
