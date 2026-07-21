import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const failures: string[] = [];
const countsByCp: Record<string, number> = {};
let cases = 0;

const conceptPatterns: Record<string, RegExp> = {
  "AVG-CP-001":
    /equal share|distributed evenly|equal groups|combined total|required full total|remaining gap|known contribution/i,
  "AVG-CP-002":
    /equally spaced|opposite pair|opposite-end|balanced pair|deviation|halfway|equal gaps|complete span|centre/i,
  "AVG-CP-003":
    /combined total|changes both|count rises|count remains|count stays|reduces both|difference between|total gap|target total|total rise|updated total|remaining group/i,
};

const formulaOnlyOpeners =
  /^(use:|substitute\b|average\s*=|total\s*=|count\s*=|middle term\s*=)/i;

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
  const normalizedLine = line.replace(/,/g, "");
  const normalizedAnswer = answer.replace(/,/g, "");
  const escaped = normalizedAnswer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^0-9.])${escaped}([^0-9.]|$)`).test(normalizedLine);
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
    const proseLines = lines.filter(
      (line) => !/\$\$/.test(line) && !/check|verification|indeed|again/i.test(line),
    );
    const substantialProse = proseLines.filter((line) => wordCount(line) >= 7);
    const joined = lines.join(" ");
    const normalizedJoined = joined.replace(/,/g, "");
    const conceptPattern = conceptPatterns[pkg.canonicalProblemId];
    const contextualConclusion = lines.some(
      (line) =>
        containsAnswer(line, pkg.answer) &&
        !/\$\$/.test(line) &&
        !/check|verification|indeed|again/i.test(line),
    );

    if (lines.length < 5) {
      failures.push(`${entry.qlId}:${index}: fewer than five explanation lines`);
    }
    if (equationLines.length < 1 || equationLines.length > 2) {
      failures.push(
        `${entry.qlId}:${index}: expected one or two calculation lines, found ${equationLines.length}`,
      );
    }
    if (substantialProse.length < 3) {
      failures.push(
        `${entry.qlId}:${index}: only ${substantialProse.length} substantial reasoning lines`,
      );
    }
    if (!conceptPattern?.test(joined)) {
      failures.push(`${entry.qlId}:${index}: missing CP-specific conceptual reasoning`);
    }
    if (lines.some((line) => formulaOnlyOpeners.test(line))) {
      failures.push(`${entry.qlId}:${index}: begins a line with formula-only instruction`);
    }
    if (!contextualConclusion) {
      failures.push(`${entry.qlId}:${index}: missing contextual conclusion containing the answer`);
    }
    if (/required answer|required result/i.test(joined)) {
      failures.push(`${entry.qlId}:${index}: uses a generic rather than contextual conclusion`);
    }
    if (equationLines.length >= proseLines.length) {
      failures.push(`${entry.qlId}:${index}: calculation lines dominate the explanation`);
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
