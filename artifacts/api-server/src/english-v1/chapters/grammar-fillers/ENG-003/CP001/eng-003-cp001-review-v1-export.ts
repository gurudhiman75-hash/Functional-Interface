import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { generateEng003Cp001QuestionV1 } from "./eng-003-cp001-v1";

const OUTPUT = resolve(process.cwd(), "dist/english-v1/ENG-003-CP001-REVIEW-V1.md");
const LABELS = ["A", "B", "C", "D"] as const;
const DIFFICULTIES = ["easy", "medium", "hard"] as const;
const SAMPLES_PER_DIFFICULTY = 10;

const title = (value: string) => value.slice(0, 1).toUpperCase() + value.slice(1);
const lines: string[] = [
  "# ENG-003-CP001 — Subject–Verb Agreement Grammar Fillers — Review V1",
  "",
  "Status: `HUMAN_REVIEW_PENDING__REVIEW_ONLY__NO_PRODUCTION_PROMOTION`",
  "",
  "Question family: Fill in the Blank / Grammar Filler",
  "",
  "Review size: 30 questions — 10 Easy / 10 Medium / 10 Hard.",
  "",
  "---",
  "",
];

let number = 1;
for (const difficulty of DIFFICULTIES) {
  lines.push(`## ${title(difficulty)}`, "");
  for (let index = 0; index < SAMPLES_PER_DIFFICULTY; index += 1) {
    const seed = `eng003-cp001-review-v1:${difficulty}:${index}`;
    const question = generateEng003Cp001QuestionV1({ difficulty, seed });
    lines.push(`### Q${String(number).padStart(2, "0")}`, "");
    lines.push(question.stem, "");
    lines.push(question.sentence, "");
    question.options.forEach((option, optionIndex) => {
      lines.push(`${LABELS[optionIndex]}. ${option}`);
    });
    lines.push("");
    lines.push(`**Answer:** ${LABELS[question.correctOptionIndex]}. ${question.options[question.correctOptionIndex]}`);
    lines.push("");
    lines.push(`**Explanation:** ${question.explanation}`);
    lines.push("");
    lines.push(`**Rule:** ${question.metadata.ruleId}  `);
    lines.push(`**Semantic domain:** ${question.metadata.semanticDomain}  `);
    lines.push(`**Seed:** \`${seed}\``);
    lines.push("", "---", "");
    number += 1;
  }
}

lines.push(
  "## Review checklist",
  "",
  "- Stem reads like a normal competitive-exam filler instruction.",
  "- Sentence remains natural after the blank is inserted.",
  "- Exactly one option is defensible.",
  "- Distractors remain plausible but preserve the intended SVA defect.",
  "- Explanation is simple, sentence-specific and useful.",
  "- Easy / Medium / Hard separation feels genuine.",
  "- No `No improvement` / sentence-improvement wording leaks into ENG-003.",
  "",
  "Approval of this review is required before checkpoint registration/integration.",
  "",
);

await mkdir(dirname(OUTPUT), { recursive: true });
await writeFile(OUTPUT, `${lines.join("\n")}\n`, "utf8");
console.log(OUTPUT);
