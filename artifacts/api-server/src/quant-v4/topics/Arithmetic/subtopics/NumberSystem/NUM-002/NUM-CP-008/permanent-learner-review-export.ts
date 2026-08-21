import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { NUM_CP008_PERMANENT_ALLOCATION } from "./permanent-allocation.ts";
import { generateNumCp008Permanent } from "./permanent-runtime.ts";

const REVIEW_SEEDS = [7, 18, 29] as const;
const outputPath = resolve(process.cwd(), "dist/quant-v4/num-cp008-permanent-learner-review.md");
mkdirSync(resolve(process.cwd(), "dist/quant-v4"), { recursive: true });

const lines: string[] = [
  "# ExamTree — NUM-CP-008 Permanent Question Review",
  "",
  "**Chapter:** Number System",
  "",
  "**Checkpoint:** NUM-CP-008 — Modular Arithmetic / Congruences",
  "",
  `**Permanent authorities:** ${NUM_CP008_PERMANENT_ALLOCATION.length} (NUM-QL-166..184)`,
  "",
  `**Review questions:** ${NUM_CP008_PERMANENT_ALLOCATION.length * REVIEW_SEEDS.length} (3 per permanent authority)`,
  "",
  "This file is intentionally learner-facing. It keeps only the QL identity, authority label, difficulty, question, options, answer and complete explanation needed for editorial review.",
  "",
  "---",
  "",
];

let questionNumber = 0;
for (const allocation of NUM_CP008_PERMANENT_ALLOCATION) {
  lines.push(`## ${allocation.qlId} — ${allocation.label}`, "");

  for (let sampleIndex = 0; sampleIndex < REVIEW_SEEDS.length; sampleIndex += 1) {
    const seed = REVIEW_SEEDS[sampleIndex]!;
    const question = generateNumCp008Permanent(allocation.qlId, seed);
    questionNumber += 1;

    lines.push(
      `### Q${questionNumber}. Sample ${sampleIndex + 1}`,
      "",
      `**Difficulty:** ${question.difficulty}`,
      "",
      question.stem,
      "",
    );

    for (let index = 0; index < question.options.length; index += 1) {
      lines.push(`${String.fromCharCode(65 + index)}. ${question.options[index]!.value}`);
    }

    lines.push(
      "",
      `**Correct answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.canonicalAnswer}`,
      "",
      "**Concept:**",
      "",
      question.explanation.coreConcept,
      "",
      "**Approach:**",
      "",
      question.explanation.strategy,
      "",
      "**Solution:**",
      "",
    );

    for (const step of question.explanation.steps) {
      lines.push(`- ${step}`);
    }

    lines.push(
      "",
      `**Final answer:** ${question.explanation.finalAnswer}`,
      "",
      "---",
      "",
    );
  }
}

writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_PERMANENT_LEARNER_REVIEW_EXPORT",
  qlCount: NUM_CP008_PERMANENT_ALLOCATION.length,
  samplesPerQl: REVIEW_SEEDS.length,
  questionCount: questionNumber,
  seeds: REVIEW_SEEDS,
  outputPath,
}, null, 2));
