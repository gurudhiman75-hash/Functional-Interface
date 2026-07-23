import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const failures: string[] = [];
const summary: Record<string, number> = {};

for (const entry of getAvg001QuestionEntries()) {
  const fingerprints = new Set<string>();
  const stems = new Set<string>();

  for (let index = 0; index < 12; index += 1) {
    const questionPackage = runAvg001Pipeline({
      questionLanguageId: entry.qlId,
      seed: `avg-diversity:${entry.qlId}:${index}`,
    });
    fingerprints.add(questionPackage.mathematicalFingerprint);
    stems.add(questionPackage.stem);
  }

  const minimum = entry.difficulty === "Easy" ? 6 : 8;
  summary[entry.qlId] = fingerprints.size;
  if (fingerprints.size < minimum) {
    failures.push(
      `${entry.qlId}: ${fingerprints.size} unique fingerprints; expected ${minimum}`,
    );
  }
  if (stems.size < minimum) {
    failures.push(
      `${entry.qlId}: ${stems.size} unique stems; expected ${minimum}`,
    );
  }
}

console.log(
  JSON.stringify(
    {
      qlCount: Object.keys(summary).length,
      failureCount: failures.length,
      failures,
      summary,
    },
    null,
    2,
  ),
);
assert.equal(failures.length, 0, failures.join("\n"));
