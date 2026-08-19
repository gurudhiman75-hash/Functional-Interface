import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { generateNumCp008Wave04Reviewed } from "./runtime-review-final.ts";
import type { NumCp008Wave04Package, NumCp008Wave04PrototypeId } from "./types.ts";

function selectMultiplicity(): NumCp008Wave04Package[] {
  const selected: NumCp008Wave04Package[] = [];
  const seenAnswers = new Set<string>();
  const seenDifficulties = new Set<string>();
  const seenStemModes = new Set<number>();

  for (let seed = 1; seed <= 120 && selected.length < 6; seed += 1) {
    const q = generateNumCp008Wave04Reviewed("NUM-CP008-PROT-025", seed);
    const stemMode = seed % 3;
    const addsCoverage = !seenAnswers.has(q.canonicalAnswer) || !seenDifficulties.has(q.difficulty) || !seenStemModes.has(stemMode);
    if (!addsCoverage && selected.length >= 5) continue;
    selected.push(q);
    seenAnswers.add(q.canonicalAnswer);
    seenDifficulties.add(q.difficulty);
    seenStemModes.add(stemMode);
  }

  if (selected.length < 6 || seenAnswers.size !== 3 || seenDifficulties.size < 2 || seenStemModes.size !== 3) {
    throw new Error("Unable to build representative P025 review selection");
  }
  return selected;
}

function selectTripleSet(): NumCp008Wave04Package[] {
  const selected: NumCp008Wave04Package[] = [];
  const seenDifficulties = new Set<string>();
  const seenStemModes = new Set<number>();

  for (let seed = 1; seed <= 120 && selected.length < 6; seed += 1) {
    const q = generateNumCp008Wave04Reviewed("NUM-CP008-PROT-026", seed);
    const stemMode = seed % 3;
    const addsCoverage = !seenDifficulties.has(q.difficulty) || !seenStemModes.has(stemMode);
    if (!addsCoverage && selected.length >= 5) continue;
    selected.push(q);
    seenDifficulties.add(q.difficulty);
    seenStemModes.add(stemMode);
  }

  if (selected.length < 6 || seenDifficulties.size < 2 || seenStemModes.size !== 3) {
    throw new Error("Unable to build representative P026 review selection");
  }
  return selected;
}

const rows = [...selectMultiplicity(), ...selectTripleSet()];
const outDir = join(process.cwd(), "dist", "quant-v4");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "num-002-cp008-wave04-review-final.json"), JSON.stringify(rows, null, 2));

const markdown: string[] = ["# NUM-CP-008 Wave 04 Final English Review Pack", "", `Questions: ${rows.length}`, ""];
for (const q of rows) {
  markdown.push(`## ${q.temporaryPrototypeId} — seed ${q.seed} — ${q.difficulty}`, "", q.stem, "");
  q.options.forEach((option, index) => markdown.push(`${String.fromCharCode(65 + index)}. ${option.value}${option.isCorrect ? " **[correct]**" : ""}`));
  markdown.push("", `**Concept:** ${q.explanation.coreConcept}`, "", `**Strategy:** ${q.explanation.strategy}`, "");
  q.explanation.steps.forEach((step, index) => markdown.push(`${index + 1}. ${step}`));
  markdown.push("", `**Answer:** ${q.explanation.finalAnswer}`, "");
}
writeFileSync(join(outDir, "num-002-cp008-wave04-review-final.md"), `${markdown.join("\n")}\n`);

const byPrototype = rows.reduce<Record<NumCp008Wave04PrototypeId, number>>((acc, q) => {
  acc[q.temporaryPrototypeId] = (acc[q.temporaryPrototypeId] ?? 0) + 1;
  return acc;
}, { "NUM-CP008-PROT-025": 0, "NUM-CP008-PROT-026": 0 });

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_WAVE04_FINAL_REVIEW_EXPORT",
  questions: rows.length,
  byPrototype,
  multiplicityClasses: [...new Set(rows.filter((q) => q.temporaryPrototypeId === "NUM-CP008-PROT-025").map((q) => q.canonicalAnswer))].sort(),
  difficulties: [...new Set(rows.map((q) => q.difficulty))].sort(),
}, null, 2));
