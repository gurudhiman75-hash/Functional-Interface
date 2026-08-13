import fs from "node:fs";
import path from "node:path";
import { generateNumCp001Wave02, NUM_CP001_WAVE02_PROTOTYPE_IDS } from "./runtime";

const rows = NUM_CP001_WAVE02_PROTOTYPE_IDS.flatMap((prototypeId) =>
  [1, 2, 3, 4].map((seed) => {
    const pkg = generateNumCp001Wave02(prototypeId, seed);
    return {
      prototypeId,
      seed,
      difficulty: pkg.difficulty,
      stem: pkg.stem,
      options: pkg.options.map((option, index) => ({
        label: String.fromCharCode(65 + index),
        value: option.value,
        isCorrect: option.isCorrect,
      })),
      answer: pkg.canonicalAnswer,
      explanation: pkg.explanation,
    };
  }),
);

const outDir = path.resolve(process.cwd(), "dist/quant-v4");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "num-001-cp001-wave02-review.json"), JSON.stringify(rows, null, 2));

const md = rows.map((row, index) => {
  const options = row.options.map((option) => `${option.label}. ${option.value}${option.isCorrect ? " ✓" : ""}`).join("\n");
  const steps = row.explanation.stepByStep.map((step, i) => `${i + 1}. ${step}`).join("\n");
  return `## ${index + 1}. ${row.prototypeId} · seed ${row.seed} · ${row.difficulty}\n\n${row.stem}\n\n${options}\n\n**Answer:** ${row.answer}\n\n**Concept:** ${row.explanation.coreConcept.join(" ")}\n\n**Strategy:** ${row.explanation.givenDataAndStrategy.join(" ")}\n\n${steps}\n\n**Exam-speed:** ${row.explanation.examSpeedMethod.join(" ")}\n`;
}).join("\n---\n\n");

fs.writeFileSync(path.join(outDir, "num-001-cp001-wave02-review.md"), md);
console.log(JSON.stringify({ status: "PASS_NUM_CP001_WAVE02_REVIEW_EXPORT", questions: rows.length }, null, 2));
