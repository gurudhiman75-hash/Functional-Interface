import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { EnglishDifficulty } from "../../../../core/types";
import { cp003ScenePoolV1 } from "../../../error-spotting/ENG-001/CP003/eng-001-cp003-v1";
import { generateEng003Cp003QuestionV1 } from "./eng-003-cp003-v1";

const OUTPUT = resolve(process.cwd(), "dist/english-v1/ENG-003-CP003-REVIEW-V1.md");
const LABELS = ["A", "B", "C", "D"] as const;
const DIFFICULTIES = ["easy", "medium", "hard"] as const;
const SAMPLES_PER_DIFFICULTY = 10;

function title(value: string) {
  return value.slice(0, 1).toUpperCase() + value.slice(1);
}

function reviewScenes(difficulty: EnglishDifficulty) {
  const pool = [...cp003ScenePoolV1(difficulty)];
  const selected: typeof pool = [];
  const selectedIds = new Set<string>();
  const representedRules = new Set<string>();

  for (const scene of pool) {
    if (representedRules.has(scene.ruleId)) continue;
    selected.push(scene);
    selectedIds.add(scene.id);
    representedRules.add(scene.ruleId);
    if (selected.length >= SAMPLES_PER_DIFFICULTY) break;
  }

  for (const scene of pool) {
    if (selected.length >= SAMPLES_PER_DIFFICULTY) break;
    if (selectedIds.has(scene.id)) continue;
    selected.push(scene);
    selectedIds.add(scene.id);
  }

  if (selected.length !== SAMPLES_PER_DIFFICULTY) {
    throw new Error(`ENG-003 CP003 review needs ${SAMPLES_PER_DIFFICULTY} ${difficulty} scenes; received ${selected.length}`);
  }
  return selected;
}

const lines: string[] = [
  "# ENG-003-CP003 — Articles and Determiners Grammar Fillers — Review V1",
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
  for (const scene of reviewScenes(difficulty)) {
    const seed = `eng003-cp003-review-v1:${difficulty}:${scene.id}`;
    const question = generateEng003Cp003QuestionV1({
      difficulty,
      ruleId: scene.ruleId,
      sceneId: scene.id,
      seed,
    });

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
    lines.push(`**Scene:** ${question.metadata.sceneId}  `);
    lines.push(`**Seed:** \`${seed}\``);
    lines.push("", "---", "");
    number += 1;
  }
}

lines.push(
  "## Review checklist",
  "",
  "- Stem reads like a normal competitive-exam filler instruction.",
  "- Sentence remains natural after the article/determiner target is blanked.",
  "- Exactly one option is defensible.",
  "- Distractors stay tied to the same noun phrase and grammar concept.",
  "- Zero-article answers remain natural where the rule requires them.",
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
