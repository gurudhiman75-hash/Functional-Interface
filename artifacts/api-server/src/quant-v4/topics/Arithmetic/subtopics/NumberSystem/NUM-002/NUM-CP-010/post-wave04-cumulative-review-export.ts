import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { generateNumCp010Wave01 } from "./wave01/runtime.ts";
import { NUM_CP010_WAVE01_PROTOTYPE_IDS } from "./wave01/types.ts";
import { generateNumCp010Wave02 } from "./wave02/runtime.ts";
import { NUM_CP010_WAVE02_PROTOTYPE_IDS } from "./wave02/types.ts";
import { generateNumCp010Wave03 } from "./wave03/runtime.ts";
import { NUM_CP010_WAVE03_PROTOTYPE_IDS } from "./wave03/types.ts";
import { generateNumCp010Wave04 } from "./wave04/runtime.ts";
import { NUM_CP010_WAVE04_PROTOTYPE_IDS } from "./wave04/types.ts";

const seeds = [7, 18, 29] as const;

const titles: Readonly<Record<string, string>> = Object.freeze({
  "NUM-CP010-PROT-001": "Place value of a digit",
  "NUM-CP010-PROT-002": "Missing digit from digit sum",
  "NUM-CP010-PROT-003": "Two-digit reversal reconstruction",
  "NUM-CP010-PROT-004": "Three-digit reversal reconstruction",
  "NUM-CP010-PROT-005": "Missing digit in addition",
  "NUM-CP010-PROT-006": "Missing digit in subtraction",
  "NUM-CP010-PROT-007": "Four-digit palindrome reconstruction",
  "NUM-CP010-PROT-008": "Increasing consecutive digits",
  "NUM-CP010-PROT-009": "Recover digit from place value",
  "NUM-CP010-PROT-010": "Recover position from place value",
  "NUM-CP010-PROT-011": "Chained-carry addition reconstruction",
  "NUM-CP010-PROT-012": "Chained-borrow subtraction reconstruction",
  "NUM-CP010-PROT-013": "Least/greatest numeral under digit constraints",
  "NUM-CP010-PROT-014": "Complete valid digit set",
  "NUM-CP010-PROT-015": "Bounded occurrence of a non-zero digit",
  "NUM-CP010-PROT-016": "Five-digit palindrome reconstruction",
  "NUM-CP010-PROT-017": "Exact number of decimal digits",
  "NUM-CP010-PROT-018": "No/one/multiple solution classification",
  "NUM-CP010-PROT-019": "Complete valid number set",
  "NUM-CP010-PROT-020": "Two unknown digits in column addition",
  "NUM-CP010-PROT-021": "Missing digit in multiplication",
  "NUM-CP010-PROT-022": "Repeated decimal block reconstruction",
  "NUM-CP010-PROT-023": "Reversal with trailing zero",
  "NUM-CP010-PROT-024": "Decreasing consecutive digits",
  "NUM-CP010-PROT-025": "Digital root",
  "NUM-CP010-PROT-026": "Bounded occurrence of digit zero",
});

type ReviewPackage = Readonly<{
  temporaryPrototypeId: string;
  difficulty: string;
  stem: string;
  options: readonly Readonly<{ value: string }>[];
  correctIndex: number;
  canonicalAnswer: string;
  verifierAnswer: string;
  explanation: Readonly<{
    coreConcept: string;
    strategy: string;
    steps: readonly string[];
    finalAnswer: string;
  }>;
}>;

const entries: Array<Readonly<{ prototypeId: string; generate: (seed: number) => ReviewPackage }>> = [
  ...NUM_CP010_WAVE01_PROTOTYPE_IDS.map((prototypeId) => ({ prototypeId, generate: (seed: number) => generateNumCp010Wave01(prototypeId, seed) })),
  ...NUM_CP010_WAVE02_PROTOTYPE_IDS.map((prototypeId) => ({ prototypeId, generate: (seed: number) => generateNumCp010Wave02(prototypeId, seed) })),
  ...NUM_CP010_WAVE03_PROTOTYPE_IDS.map((prototypeId) => ({ prototypeId, generate: (seed: number) => generateNumCp010Wave03(prototypeId, seed) })),
  ...NUM_CP010_WAVE04_PROTOTYPE_IDS.map((prototypeId) => ({ prototypeId, generate: (seed: number) => generateNumCp010Wave04(prototypeId, seed) })),
];

const lines: string[] = [
  "# ExamTree — NUM-CP-010 Cumulative Discovery Review",
  "",
  "**Checkpoint:** Digit Structure, Place Value and Number Reconstruction",
  "",
  "**Status:** ID-free source-saturation review; permanent authority count not yet approved",
  "",
  `**Temporary prototypes:** ${entries.length}`,
  "",
  `**Review questions:** ${entries.length * seeds.length}`,
  "",
  "**Lifecycle:** Question Studio OFF · Question Bank OFF · Test/Mock OFF · Public release OFF",
  "",
  "---",
  "",
];

let questionNumber = 0;
for (const entry of entries) {
  lines.push(`## ${entry.prototypeId} — ${titles[entry.prototypeId] ?? entry.prototypeId}`, "");
  for (const seed of seeds) {
    questionNumber += 1;
    const q = entry.generate(seed);
    if (q.canonicalAnswer !== q.verifierAnswer) throw new Error(`${entry.prototypeId}/${seed}: verifier drift during review export`);
    if (q.explanation.finalAnswer !== q.canonicalAnswer) throw new Error(`${entry.prototypeId}/${seed}: explanation answer drift during review export`);

    lines.push(`### Q${questionNumber}`, "");
    lines.push(`**Difficulty:** ${q.difficulty}`, "");
    lines.push(q.stem, "");
    q.options.forEach((option, optionIndex) => lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option.value}`));
    lines.push("");
    lines.push(`**Correct answer:** ${String.fromCharCode(65 + q.correctIndex)}. ${q.canonicalAnswer}`, "");
    lines.push("**Explanation:**", "");
    lines.push(`- ${q.explanation.coreConcept}`);
    lines.push(`- ${q.explanation.strategy}`);
    q.explanation.steps.forEach((step) => lines.push(`- ${step}`));
    lines.push("", `**Final answer:** ${q.canonicalAnswer}`, "", "---", "");
  }
}

const output = resolve(process.cwd(), "artifacts/api-server/dist/quant-v4/num-cp010-cumulative-discovery-review.md");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${lines.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_NUM_CP010_CUMULATIVE_REVIEW_EXPORT",
  prototypes: entries.length,
  questions: questionNumber,
  output,
}, null, 2));
