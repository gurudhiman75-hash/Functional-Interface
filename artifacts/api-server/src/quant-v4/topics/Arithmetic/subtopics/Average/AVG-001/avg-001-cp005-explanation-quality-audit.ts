import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries().filter((entry) => entry.cpId === "AVG-CP-005");
const failures: string[] = [];
const structures = new Map<string, Set<string>>();
const banned = [/apply the formula/i, /using the standard method/i, /substitute the values/i, /hence solved/i, /error delta/i, /solve mode/i];
let cases = 0;

function explanationShape(lines: string[]) {
  return lines.map((line) => line.toLowerCase().replace(/₹?\d+(?:,\d+)*(?:\.\d+)?/g, "#").replace(/\\times|\\div/g, "op").replace(/\s+/g, " ").trim()).join(" | ");
}

for (const entry of entries) {
  for (let index = 0; index < 5; index += 1) {
    const pkg = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed: `avg-cp005-explanation:${entry.qlId}:${index}` });
    cases += 1;
    const lines = pkg.explanation.lines;
    const text = lines.join("\n");
    const equationLines = lines.filter((line) => /\$\$/.test(line));
    if (lines.length < 4 || lines.length > 6) failures.push(`${entry.qlId}:${index}: invalid explanation depth`);
    if (equationLines.length !== 2) failures.push(`${entry.qlId}:${index}: expected exactly two calculation lines`);
    if (!equationLines.some((line) => line.includes("\\times") || line.includes("\\div") || /[+\-]=?/.test(line))) failures.push(`${entry.qlId}:${index}: no substituted arithmetic`);
    if (!text.includes(pkg.answer)) failures.push(`${entry.qlId}:${index}: final answer missing`);
    if (banned.some((pattern) => pattern.test(text))) failures.push(`${entry.qlId}:${index}: generic/internal explanation phrase`);
    if (lines.some((line) => !line.trim())) failures.push(`${entry.qlId}:${index}: empty explanation line`);
    if (entry.answerType !== "COUNT" && entry.unitKind === "currency" && !text.includes("₹")) failures.push(`${entry.qlId}:${index}: currency unit missing`);
    if (entry.answerType !== "COUNT" && entry.unitKind === "marks" && !/\bmarks?\b/.test(text)) failures.push(`${entry.qlId}:${index}: marks unit missing`);
    if (entry.answerType !== "COUNT" && entry.unitKind === "kg" && !/\bkg\b/.test(text)) failures.push(`${entry.qlId}:${index}: weight unit missing`);
    if (entry.answerType !== "COUNT" && entry.unitKind === "years" && !/\byears?\b/.test(text)) failures.push(`${entry.qlId}:${index}: age unit missing`);
    if (entry.answerType !== "COUNT" && entry.unitKind === "runs" && !/\bruns?\b/.test(text)) failures.push(`${entry.qlId}:${index}: runs unit missing`);
    if (entry.answerType !== "COUNT" && entry.unitKind === "units" && !/\bunits?\b/.test(text)) failures.push(`${entry.qlId}:${index}: output unit missing`);
    const family = structures.get(entry.solveMode) ?? new Set<string>();
    family.add(explanationShape(lines));
    structures.set(entry.solveMode, family);
  }
}
for (const [mode, shapes] of structures) if (shapes.size < 3) failures.push(`${mode}: fewer than three genuinely rendered explanation structures`);

console.log(JSON.stringify({ qlCount: entries.length, cases, explanationStructures: Object.fromEntries([...structures].map(([mode, values]) => [mode, values.size])), failures, status: failures.length ? "FAIL" : "PASS" }, null, 2));
assert.equal(cases, 280);
assert.equal(failures.length, 0, failures.join("\n"));
