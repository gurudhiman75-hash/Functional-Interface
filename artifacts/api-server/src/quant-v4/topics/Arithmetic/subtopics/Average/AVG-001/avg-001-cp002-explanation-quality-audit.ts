import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const failures: string[] = [];
let cases = 0;

for (const entry of getAvg001QuestionEntries().filter(
  (item) => item.cpId === "AVG-CP-002",
)) {
  for (let index = 0; index < 3; index += 1) {
    const pkg = runAvg001Pipeline({
      questionLanguageId: entry.qlId,
      seed: `avg-explanation:${entry.qlId}:${index}`,
    });
    cases += 1;
    const lines = pkg.explanation.lines;
    const joined = lines.join("\n");
    const minimum = entry.difficulty === "Easy" ? 6 : 7;

    if (lines.length < minimum) {
      failures.push(
        `${entry.qlId}:${index}: ${lines.length} explanation lines; expected ${minimum}`,
      );
    }
    if (!joined.includes(pkg.answer)) {
      failures.push(`${entry.qlId}:${index}: final answer absent`);
    }
    if (!/[0-9]/.test(joined)) {
      failures.push(`${entry.qlId}:${index}: no numeric substitution`);
    }
    if (!/[×÷+\-]|\\times|\\div/.test(joined)) {
      failures.push(`${entry.qlId}:${index}: no decisive arithmetic`);
    }
    if (
      /^(setup|calculation|answer|apply formula)\b/im.test(joined) &&
      lines.length <= 4
    ) {
      failures.push(`${entry.qlId}:${index}: generic explanation shell`);
    }
    if (
      entry.cpId === "AVG-CP-002" &&
      !/symmetr|progression|equally spaced|middle term|average lies/i.test(
        joined,
      )
    ) {
      failures.push(`${entry.qlId}:${index}: AP concept not explained`);
    }
  }
}

console.log(
  JSON.stringify(
    {
      cases,
      failureCount: failures.length,
      failures: failures.slice(0, 100),
    },
    null,
    2,
  ),
);
assert.equal(cases, 150);
assert.equal(failures.length, 0, failures.join("\n"));
