import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  INT_CP005_V16_QL_IDS,
  INT_CP005_RUNTIME_VERSION_V16,
  generateIntCp005QuestionV16Final,
} from "./cp005-variable-growth-decay-runtime-v16-final";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const selected: ReturnType<typeof generateIntCp005QuestionV16Final>[] = [];
for (const qlId of INT_CP005_V16_QL_IDS) {
  const positions = new Map<number, ReturnType<typeof generateIntCp005QuestionV16Final>>();
  const stems = new Set<string>();
  for (let index = 0; index < 1600 && positions.size < 4; index += 1) {
    const seed = `int-cp005-v16-final-review-${qlId}-${index}`;
    const question = generateIntCp005QuestionV16Final(qlId, seed);
    if (!positions.has(question.correctIndex) && !stems.has(question.presentation.markdown)) {
      positions.set(question.correctIndex, question);
      stems.add(question.presentation.markdown);
    }
  }
  assert(positions.size === 4, `${qlId}: could not find four balanced answer positions`);
  selected.push(...[0, 1, 2, 3].map((position) => positions.get(position)!));
}

const answerCounts = [0, 0, 0, 0];
selected.forEach((question) => { answerCounts[question.correctIndex] += 1; });
assert(selected.length === INT_CP005_V16_QL_IDS.length * 4, "wrong review question count");
assert(answerCounts.every((count) => count === INT_CP005_V16_QL_IDS.length), `unbalanced review answers ${answerCounts.join("/")}`);
assert(new Set(selected.map((question) => question.presentation.markdown)).size === selected.length, "duplicate review stems");

const lines: string[] = [];
lines.push("# INT-CP-005 V16 English Exam-Readiness Review");
lines.push("");
lines.push(`Runtime: \`${INT_CP005_RUNTIME_VERSION_V16}\``);
lines.push("");
lines.push("**Review status:** English candidate only. Not frozen, not merged, and not localized yet.");
lines.push("");
lines.push("**Scope correction:** `INT-QL-094` is excluded because percentage growth plus fixed migration/event-order arithmetic has no recovered Interest-family authority. Production and salary contexts are also excluded from CP-005 V16.");
lines.push("");

selected.forEach((question, index) => {
  lines.push(`## ${index + 1}. ${question.qlId}`);
  lines.push("");
  lines.push(`**Context:** ${question.mathematicalState.context}`);
  lines.push("");
  lines.push(question.presentation.markdown);
  if (question.presentation.table) {
    lines.push("");
    lines.push(`| ${question.presentation.table.headers.join(" | ")} |`);
    lines.push(`| ${question.presentation.table.headers.map(() => "---").join(" | ")} |`);
    for (const row of question.presentation.table.rows) lines.push(`| ${row.join(" | ")} |`);
  }
  lines.push("");
  question.options.forEach((option, optionIndex) => lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option.text}`));
  lines.push("");
  lines.push(`**Correct answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.correctAnswer}`);
  lines.push("");
  lines.push(`**Key idea:** ${question.explanation.keyIdea}`);
  lines.push("");
  lines.push("**Explanation**");
  question.explanation.steps.forEach((step, stepIndex) => lines.push(`${stepIndex + 1}. ${step}`));
  lines.push("");
  lines.push(`**Common mistake:** ${question.explanation.commonMistake}`);
  lines.push("");
  lines.push("---");
  lines.push("");
});

lines.push("## Review summary");
lines.push("");
lines.push(`- Learner QLs: ${INT_CP005_V16_QL_IDS.length}`);
lines.push(`- Review questions: ${selected.length}`);
lines.push(`- Correct positions A/B/C/D: ${answerCounts.join("/")}`);
lines.push(`- Unique stems: ${new Set(selected.map((question) => question.presentation.markdown)).size}`);
lines.push("- QL-094: excluded from V16 Interest authority");
lines.push("- Production/salary contexts: excluded");
lines.push("- Ordinary opening values: ₹10,000 to ₹2,00,000");
lines.push("- Ordinary durations: 2 to 3 years");
lines.push("- QL-095: same-rate-permutation comparisons explicitly rejected");
lines.push("- Lifecycle: review-only; Question Studio remains inactive");

const output = resolve(process.env.INT_CP005_V16_REVIEW_OUT ?? "dist/quant-v4/INT-CP-005-V16-ENGLISH-REVIEW.md");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, lines.join("\n"), "utf8");
console.log(JSON.stringify({ output, questions: selected.length, answerCounts }, null, 2));
console.log("PASS_INT_CP005_V16_FINAL_REVIEW_EXPORT");
