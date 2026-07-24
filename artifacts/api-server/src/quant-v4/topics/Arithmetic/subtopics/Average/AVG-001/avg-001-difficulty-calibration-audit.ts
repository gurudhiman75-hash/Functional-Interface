import { strict as assert } from "node:assert";
import {
  AVG_001_CP_DIFFICULTY_TARGETS,
  AVG_001_DIFFICULTY_SPLITS,
  AVG_001_DIRECT_MODES_WITHOUT_HARD,
  AVG_001_REVERSE_MODES_WITHOUT_EASY,
} from "./foundation/difficulty-calibration";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";
import type { Avg001Difficulty } from "./foundation/types";

const entries = getAvg001QuestionEntries();
const failures: string[] = [];
const difficulties: Avg001Difficulty[] = ["Easy", "Medium", "Hard"];
let generated = 0;

assert.equal(entries.length, 425);

for (const [cpId, target] of Object.entries(AVG_001_CP_DIFFICULTY_TARGETS)) {
  const family = entries.filter((entry) => entry.cpId === cpId);
  const actual = Object.fromEntries(
    difficulties.map((difficulty) => [difficulty, family.filter((entry) => entry.difficulty === difficulty).length]),
  );
  if (JSON.stringify(actual) !== JSON.stringify(target)) {
    failures.push(`${cpId}: ${JSON.stringify(actual)}; expected ${JSON.stringify(target)}`);
  }
}

for (const [mode, target] of Object.entries(AVG_001_DIFFICULTY_SPLITS)) {
  const family = entries.filter((entry) => entry.solveMode === mode);
  const actual = Object.fromEntries(
    difficulties.map((difficulty) => [difficulty, family.filter((entry) => entry.difficulty === difficulty).length]),
  );
  if (JSON.stringify(actual) !== JSON.stringify(target)) {
    failures.push(`${mode}: ${JSON.stringify(actual)}; expected ${JSON.stringify(target)}`);
  }
}

for (const mode of AVG_001_DIRECT_MODES_WITHOUT_HARD) {
  const hard = entries.filter((entry) => entry.solveMode === mode && entry.difficulty === "Hard");
  if (hard.length) failures.push(`${mode}: direct one-step family contains Hard QLs ${hard.map((entry) => entry.qlId).join(", ")}`);
}
for (const mode of AVG_001_REVERSE_MODES_WITHOUT_EASY) {
  const easy = entries.filter((entry) => entry.solveMode === mode && entry.difficulty === "Easy");
  if (easy.length) failures.push(`${mode}: reverse/multi-step family contains Easy QLs ${easy.map((entry) => entry.qlId).join(", ")}`);
}

for (const entry of entries) {
  const pkg = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed: `difficulty-proof:${entry.qlId}` });
  generated += 1;
  if (pkg.difficultyBand !== entry.difficulty) failures.push(`${entry.qlId}: package difficulty ${pkg.difficultyBand}; entry ${entry.difficulty}`);
  if (pkg.parameters.difficulty !== entry.difficulty) failures.push(`${entry.qlId}: parameter difficulty ${pkg.parameters.difficulty}; entry ${entry.difficulty}`);
  if (!pkg.validation.valid) failures.push(`${entry.qlId}: generated package failed validation`);
}

const chapterDifficultyCounts = Object.fromEntries(
  difficulties.map((difficulty) => [difficulty, entries.filter((entry) => entry.difficulty === difficulty).length]),
);
assert.deepEqual(chapterDifficultyCounts, { Easy: 109, Medium: 187, Hard: 129 });
assert.equal(generated, 425);
assert.equal(failures.length, 0, failures.join("\n"));

console.log(JSON.stringify({
  qlCount: entries.length,
  generated,
  chapterDifficultyCounts,
  cpDifficultyCounts: Object.fromEntries(
    Object.keys(AVG_001_CP_DIFFICULTY_TARGETS).map((cpId) => [
      cpId,
      Object.fromEntries(difficulties.map((difficulty) => [difficulty, entries.filter((entry) => entry.cpId === cpId && entry.difficulty === difficulty).length])),
    ]),
  ),
  directModesWithoutHard: AVG_001_DIRECT_MODES_WITHOUT_HARD.length,
  reverseModesWithoutEasy: AVG_001_REVERSE_MODES_WITHOUT_EASY.length,
  failures,
  status: "PASS",
}, null, 2));
