import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries().filter((entry) => entry.cpId === "AVG-CP-005");
const failures: string[] = [];
const banned = [/weighted average/i, /respective averages/i, /determine the/i, /combined group/i, /missing group average/i, /solve mode/i, /error delta/i, /delta correction/i];
const structuralByMode = new Map<string, Set<string>>();
const contextByMode = new Map<string, Set<string>>();

function structure(stem: string) {
  return stem.toLowerCase().replace(/₹?\d+(?:\.\d+)?/g, "#").replace(/\b(?:marks|years|runs|kg|units)\b/g, "unit").replace(/\s+/g, " ").trim();
}

for (const entry of entries) {
  if (entry.template.length > 260) failures.push(`${entry.qlId}: template exceeds 260 characters`);
  if (banned.some((pattern) => pattern.test(entry.template))) failures.push(`${entry.qlId}: banned catalogue language`);
  const pkg = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed: `avg-cp005-editorial:${entry.qlId}` });
  if (pkg.stem.length > 260) failures.push(`${entry.qlId}: rendered stem exceeds 260 characters`);
  if (banned.some((pattern) => pattern.test(pkg.stem))) failures.push(`${entry.qlId}: internal or catalogue language leaked`);
  if (!/[?.]$/.test(pkg.stem)) failures.push(`${entry.qlId}: awkward terminal punctuation`);
  const structures = structuralByMode.get(entry.solveMode) ?? new Set<string>();
  structures.add(structure(pkg.stem));
  structuralByMode.set(entry.solveMode, structures);
  const contexts = contextByMode.get(entry.solveMode) ?? new Set<string>();
  contexts.add(entry.contextDomain);
  contextByMode.set(entry.solveMode, contexts);
}
for (const [mode, structures] of structuralByMode) if (structures.size < 3) failures.push(`${mode}: fewer than three rendered stem structures`);
for (const [mode, contexts] of contextByMode) if (contexts.size < 4) failures.push(`${mode}: fewer than four contexts`);

console.log(JSON.stringify({ qlCount: entries.length, structures: Object.fromEntries([...structuralByMode].map(([mode, values]) => [mode, values.size])), contexts: Object.fromEntries([...contextByMode].map(([mode, values]) => [mode, values.size])), failures, status: failures.length ? "FAIL" : "PASS" }, null, 2));
assert.equal(failures.length, 0, failures.join("\n"));
