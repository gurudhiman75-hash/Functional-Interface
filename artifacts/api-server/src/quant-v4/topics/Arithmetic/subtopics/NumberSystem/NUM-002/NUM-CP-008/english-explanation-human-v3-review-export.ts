import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { presentNumCp008EnglishAnswer } from "./english-answer-presentation-v2.ts";
import { NUM_CP008_PERMANENT_ALLOCATION } from "./permanent-allocation.ts";
import { generateNumCp008Permanent, type NumCp008PermanentQlId } from "./permanent-runtime.ts";

const reviewSeeds = [7, 18, 29] as const;

const learnerTitles: Readonly<Record<string, string>> = Object.freeze({
  "NUM-QL-166": "Basic remainder operations",
  "NUM-QL-167": "Remainders of powers",
  "NUM-QL-168": "Finding x from a remainder condition",
  "NUM-QL-169": "When a remainder condition has no solution",
  "NUM-QL-170": "Combining remainder conditions",
  "NUM-QL-171": "Detecting impossible combined conditions",
  "NUM-QL-172": "Least or greatest valid number in a range",
  "NUM-QL-173": "Counting valid numbers in a range",
  "NUM-QL-174": "Listing all common values in a range",
  "NUM-QL-175": "Finding a missing multiplier",
  "NUM-QL-176": "Finding the divisor from a remainder",
  "NUM-QL-177": "Remainder of a power series",
  "NUM-QL-178": "Finding a missing remainder",
  "NUM-QL-179": "Two-stage remainder calculation",
  "NUM-QL-180": "Checking a candidate against several conditions",
  "NUM-QL-181": "Statement-based remainder questions",
  "NUM-QL-182": "Data Sufficiency with remainder conditions",
  "NUM-QL-183": "Repeated-digit numbers",
  "NUM-QL-184": "Classifying the number of common solutions",
});

const lines: string[] = [
  "# ExamTree — NUM-CP-008 Full Explanation Review V3",
  "",
  "**Chapter:** Number System",
  "",
  "**Checkpoint:** NUM-CP-008 — Advanced Remainder Problems & Modular Conditions",
  "",
  "**Boundary:** CP007 remains the basic Remainder checkpoint. CP008 covers advanced/combined remainder conditions and modular-style constructions.",
  "",
  `**Permanent authorities:** ${NUM_CP008_PERMANENT_ALLOCATION.length} (NUM-QL-166..184)`,
  "",
  `**Review questions:** ${NUM_CP008_PERMANENT_ALLOCATION.length * reviewSeeds.length} (${reviewSeeds.length} per permanent authority)`,
  "",
  "Every explanation below states the idea, what the question is asking, and the actual worked calculation. Mathematical authority and answer binding remain unchanged.",
  "",
  "---",
  "",
];

for (const allocation of NUM_CP008_PERMANENT_ALLOCATION) {
  const qlId = allocation.qlId as NumCp008PermanentQlId;
  lines.push(`## ${qlId} — ${learnerTitles[qlId] ?? allocation.label}`, "");

  reviewSeeds.forEach((seed, sampleIndex) => {
    const q = generateNumCp008Permanent(qlId, seed);
    const options = q.options.map((option) => presentNumCp008EnglishAnswer(option.value));
    const displayedAnswer = presentNumCp008EnglishAnswer(q.canonicalAnswer);

    lines.push(`### Q${sampleIndex + 1}. Sample ${sampleIndex + 1}`, "");
    lines.push(`**Difficulty:** ${q.difficulty}`, "");
    lines.push(q.stem, "");
    options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option}`));
    lines.push("");
    lines.push(`**Correct answer:** ${String.fromCharCode(65 + q.correctIndex)}. ${displayedAnswer}`, "");
    lines.push("**Explanation:**", "");
    lines.push(`- ${q.explanation.coreConcept}`);
    lines.push(`- ${q.explanation.strategy}`);
    q.explanation.steps.forEach((step) => lines.push(`- ${step}`));
    lines.push("");
    lines.push(`**Final answer:** ${displayedAnswer}`, "", "---", "");
  });
}

const output = resolve(process.cwd(), "dist/quant-v4/num-cp008-full-explanation-v3-review.md");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${lines.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_FULL_EXPLANATION_V3_REVIEW_EXPORT",
  output,
  questions: NUM_CP008_PERMANENT_ALLOCATION.length * reviewSeeds.length,
  checkpointLabel: "Advanced Remainder Problems & Modular Conditions",
}, null, 2));
