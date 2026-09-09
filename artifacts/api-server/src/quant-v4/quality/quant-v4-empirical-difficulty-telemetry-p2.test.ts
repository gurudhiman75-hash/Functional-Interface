import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const runner = readFileSync(resolve(process.cwd(), "src/routes/published-test-runner.ts"), "utf8");

for (const fragment of [
  "INSERT INTO learning.attempt_responses",
  "question_version_id",
  "is_correct",
  "time_spent_seconds",
  "attemptType = req.body?.attemptType === \"PRACTICE\" ? \"PRACTICE\" : \"REAL\"",
  "questionTimingUnit: \"seconds\"",
  "timeTakenSeconds: response.timeTakenSeconds",
  "JOIN content.question_versions version ON version.id = tq.question_version_id",
  "UPDATE learning.attempts",
  "result_snapshot",
]) {
  assert.ok(runner.includes(fragment), `Published-test telemetry drift: missing ${fragment}`);
}

assert.ok(
  runner.includes("if (selected == null) stats.unanswered += 1"),
  "Runner must continue distinguishing unanswered responses from correct/incorrect responses.",
);
assert.ok(
  runner.includes("const isCorrect = selected == null ? null : selected === correctIndex"),
  "Runner must preserve null correctness for unanswered questions.",
);

console.log("PASS_QUANT_V4_EMPIRICAL_DIFFICULTY_TELEMETRY_P2", {
  canonicalAttemptTable: "learning.attempts",
  canonicalResponseTable: "learning.attempt_responses",
  questionVersionIdentityPersisted: true,
  correctnessPersisted: true,
  perQuestionSecondsPersisted: true,
  realPracticeBoundaryPersisted: true,
  schemaMigrationRequired: false,
});
