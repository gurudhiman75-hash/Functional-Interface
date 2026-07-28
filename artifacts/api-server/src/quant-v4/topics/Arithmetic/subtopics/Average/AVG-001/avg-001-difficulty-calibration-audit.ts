import { strict as assert } from "node:assert";
import {
  AVG_001_CP_DIFFICULTY_TARGETS,
  AVG_001_DIFFICULTY_SPLITS,
  AVG_001_DIRECT_MODES_WITHOUT_HARD,
  AVG_001_EXAM_DIFFICULTY_CALIBRATION,
  AVG_001_HARD_ONLY_MODES,
  AVG_001_REVERSE_MODES_WITHOUT_EASY,
  getAvg001CalibratedDifficulty,
} from "./foundation/difficulty-calibration";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";
import type { Avg001Difficulty } from "./foundation/types";

const entries = getAvg001QuestionEntries();
const failures: string[] = [];
const difficulties: Avg001Difficulty[] = ["Easy", "Medium", "Hard"];
let generated = 0;

assert.equal(entries.length, 425);
assert.equal(AVG_001_EXAM_DIFFICULTY_CALIBRATION.version, "AVG-001 exam difficulty calibration v2");

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
  if (hard.length) failures.push(`${mode}: direct/moderate family contains Hard QLs ${hard.map((entry) => entry.qlId).join(", ")}`);
}
for (const mode of AVG_001_REVERSE_MODES_WITHOUT_EASY) {
  const easy = entries.filter((entry) => entry.solveMode === mode && entry.difficulty === "Easy");
  if (easy.length) failures.push(`${mode}: reverse/weighted family contains Easy QLs ${easy.map((entry) => entry.qlId).join(", ")}`);
}
for (const mode of AVG_001_HARD_ONLY_MODES) {
  const notHard = entries.filter((entry) => entry.solveMode === mode && entry.difficulty !== "Hard");
  if (notHard.length) failures.push(`${mode}: hard-only family contains ${notHard.map((entry) => `${entry.qlId}:${entry.difficulty}`).join(", ")}`);
}

const expectedExamples: Record<string, Avg001Difficulty> = {
  "AVG-QL-066": "Easy",
  "AVG-QL-071": "Easy",
  "AVG-QL-376": "Medium",
  "AVG-QL-380": "Easy",
  "AVG-QL-109": "Medium",
  "AVG-QL-131": "Medium",
  "AVG-QL-169": "Hard",
  "AVG-QL-172": "Medium",
  "AVG-QL-182": "Hard",
  "AVG-QL-185": "Medium",
  "AVG-QL-193": "Hard",
  "AVG-QL-203": "Easy",
  "AVG-QL-207": "Medium",
  "AVG-QL-225": "Medium",
  "AVG-QL-231": "Hard",
  "AVG-QL-259": "Medium",
  "AVG-QL-267": "Easy",
  "AVG-QL-406": "Medium",
  "AVG-QL-414": "Hard",
  "AVG-QL-420": "Hard",
  "AVG-QL-282": "Easy",
  "AVG-QL-295": "Medium",
  "AVG-QL-321": "Medium",
  "AVG-QL-325": "Hard",
  "AVG-QL-330": "Medium",
  "AVG-QL-344": "Hard",
  "AVG-QL-350": "Medium",
  "AVG-QL-370": "Hard",
};

for (const [qlId, expected] of Object.entries(expectedExamples)) {
  const entry = entries.find((item) => item.qlId === qlId);
  if (!entry) {
    failures.push(`${qlId}: missing representative calibration QL`);
    continue;
  }
  if (entry.difficulty !== expected) failures.push(`${qlId}: ${entry.difficulty}; expected ${expected}`);
  if (getAvg001CalibratedDifficulty(entry) !== expected) failures.push(`${qlId}: calibration function disagrees with ${expected}`);
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
assert.deepEqual(chapterDifficultyCounts, { Easy: 182, Medium: 185, Hard: 58 });
assert.equal(generated, 425);
assert.equal(failures.length, 0, failures.join("\n"));

console.log(JSON.stringify({
  qlCount: entries.length,
  generated,
  calibration: AVG_001_EXAM_DIFFICULTY_CALIBRATION,
  chapterDifficultyCounts,
  cpDifficultyCounts: Object.fromEntries(
    Object.keys(AVG_001_CP_DIFFICULTY_TARGETS).map((cpId) => [
      cpId,
      Object.fromEntries(difficulties.map((difficulty) => [difficulty, entries.filter((entry) => entry.cpId === cpId && entry.difficulty === difficulty).length])),
    ]),
  ),
  representativeChecks: Object.keys(expectedExamples).length,
  directModesWithoutHard: AVG_001_DIRECT_MODES_WITHOUT_HARD.length,
  reverseModesWithoutEasy: AVG_001_REVERSE_MODES_WITHOUT_EASY.length,
  hardOnlyModes: AVG_001_HARD_ONLY_MODES.length,
  failures,
  status: "PASS",
}, null, 2));
