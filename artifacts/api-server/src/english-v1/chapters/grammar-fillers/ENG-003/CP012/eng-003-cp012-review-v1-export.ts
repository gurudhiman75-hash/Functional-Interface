import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { EnglishDifficulty } from "../../../../core/types";
import type { VoiceNarrationRuleId } from "../../../../grammar/voice-narration";
import { cp012ScenePoolV1, rulesForDifficultyCp012V1 } from "../../../error-spotting/ENG-001/CP012/eng-001-cp012-v1";
import { generateEng003Cp012QuestionV1 } from "./eng-003-cp012-v1";

const OUTPUT = resolve(process.cwd(), "dist/english-v1/ENG-003-CP012-REVIEW-V1.md");
const LABELS = ["A", "B", "C", "D"] as const;
const DIFFICULTIES = ["easy", "medium", "hard"] as const;
const OFFSETS: Record<EnglishDifficulty, number> = { easy: 0, medium: 8, hard: 4 };
const title = (value: string) => value.slice(0, 1).toUpperCase() + value.slice(1);

function rotatedRules(difficulty: EnglishDifficulty) {
  const rules = [...rulesForDifficultyCp012V1(difficulty)];
  const offset = OFFSETS[difficulty] % rules.length;
  return [...rules.slice(offset), ...rules.slice(0, offset)];
}

function reviewScenes(difficulty: EnglishDifficulty) {
  const pool = [...cp012ScenePoolV1(difficulty)];
  const selected: typeof pool = [];
  const selectedIds = new Set<string>();
  for (const ruleId of rotatedRules(difficulty).slice(0, 10) as VoiceNarrationRuleId[]) {
    const scene = difficulty === "hard" && ruleId === "GR-VNR-001"
      ? pool.find((item) => item.id === "VNR-H-002")
      : pool.find((item) => item.ruleId === ruleId);
    if (scene) { selected.push(scene); selectedIds.add(scene.id); }
  }
  for (const scene of pool) {
    if (selected.length >= 10) break;
    if (!selectedIds.has(scene.id)) { selected.push(scene); selectedIds.add(scene.id); }
  }
  if (selected.length !== 10) throw new Error(`ENG-003 CP012 needs 10 ${difficulty} review scenes`);
  return selected;
}

const lines: string[] = [
  "# ENG-003-CP012 — Voice and Narration Grammar Fillers — Review V1",
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
const representedRules = new Set<string>();
for (const difficulty of DIFFICULTIES) {
  lines.push(`## ${title(difficulty)}`, "");
  for (const scene of reviewScenes(difficulty)) {
    const seed = `eng003-cp012-review-v1:${difficulty}:${scene.id}`;
    const q = generateEng003Cp012QuestionV1({ difficulty, ruleId: scene.ruleId, sceneId: scene.id, seed });
    representedRules.add(q.metadata.ruleId);
    lines.push(`### Q${String(number).padStart(2, "0")}`, "", q.stem, "", q.sentence, "");
    q.options.forEach((option, index) => lines.push(`${LABELS[index]}. ${option}`));
    lines.push("", `**Answer:** ${LABELS[q.correctOptionIndex]}. ${q.options[q.correctOptionIndex]}`, "");
    lines.push(`**Explanation:** ${q.explanation}`, "");
    lines.push(`**Rule:** ${q.metadata.ruleId}  `);
    lines.push(`**Semantic domain:** ${q.metadata.semanticDomain}  `);
    lines.push(`**Scene:** ${q.metadata.sceneId}  `);
    lines.push(`**Seed:** \`${seed}\``, "", "---", "");
    number += 1;
  }
}
if (representedRules.size !== 12) throw new Error(`Review covers ${representedRules.size}/12 voice/narration rules`);

lines.push(
  "## Review checklist", "",
  "- Stem reads like a normal competitive-exam filler instruction.",
  "- The blank focuses on the voice or narration form being tested.",
  "- Exactly one option is defensible.",
  "- All 12 voice/narration rule families are represented across the review.",
  "- Explanations use simple language: answer, rule, sentence application, corrected sentence.",
  "- Easy / Medium / Hard separation feels genuine.",
  "- No `No improvement` / sentence-improvement wording leaks into ENG-003.",
  "", "Approval is required before Question Studio registration or merge.", "",
);

await mkdir(dirname(OUTPUT), { recursive: true });
await writeFile(OUTPUT, `${lines.join("\n")}\n`, "utf8");
console.log(OUTPUT);
