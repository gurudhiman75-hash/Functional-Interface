import { strict as assert } from "node:assert";
import { add, divide, equals, multiply, rational, subtract } from "./foundation/math";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries().filter((entry) => entry.cpId === "AVG-CP-005");
const failures: string[] = [];
let cases = 0;
for (const entry of entries) {
  for (let index = 0; index < 12; index += 1) {
    const seed = `avg-cp005-validity:${entry.qlId}:${index}`;
    const pkg = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed });
    cases += 1;
    const v = pkg.parameters.values;
    if (!pkg.validation.valid) failures.push(`${entry.qlId}:${index}: package validation failed`);
    if (pkg.seed !== seed || pkg.parameters.seed !== seed) failures.push(`${entry.qlId}:${index}: seed identity changed`);
    if (pkg.options.length !== 4 || new Set(pkg.options).size !== 4 || pkg.options[pkg.correctIndex] !== pkg.answer) failures.push(`${entry.qlId}:${index}: invalid options`);
    if (/undefined|NaN|Infinity|null|\{[A-Za-z]/.test(pkg.stem)) failures.push(`${entry.qlId}:${index}: unresolved stem`);
    const count = rational(v.count);
    const signedCorrection = subtract(v.correctValue!, v.incorrectValue!);
    const reconstructed = add(v.reportedAverage!, divide(signedCorrection, count));
    if (entry.solveMode !== "findCorrectedAverageFromMultipleMistakes" && !equals(reconstructed, v.correctedAverage!)) failures.push(`${entry.qlId}:${index}: correction identity mismatch`);
    if (entry.solveMode === "findCorrectedAverageFromMultipleMistakes") {
      const net = v.correctValues!.reduce((sum, value, i) => add(sum, subtract(value, v.incorrectValues![i]!)), rational(0));
      const corrected = add(v.reportedAverage!, divide(net, count));
      if (!equals(net, v.netCorrection!) || !equals(corrected, v.correctedAverage!)) failures.push(`${entry.qlId}:${index}: multi-entry identity mismatch`);
    }
    if (!equals(multiply(v.correctedAverage!, count), v.total)) failures.push(`${entry.qlId}:${index}: corrected total mismatch`);
    if (v.count < 5 || v.count > 60) failures.push(`${entry.qlId}:${index}: unrealistic count ${v.count}`);
    if (v.averageChange!.numerator <= 0 || v.entryDifference!.numerator <= 0) failures.push(`${entry.qlId}:${index}: non-positive correction magnitude`);
  }
}
console.log(JSON.stringify({ qlCount: entries.length, cases, failures, status: failures.length ? "FAIL" : "PASS" }, null, 2));
assert.equal(cases, 672);
assert.equal(failures.length, 0, failures.join("\n"));
