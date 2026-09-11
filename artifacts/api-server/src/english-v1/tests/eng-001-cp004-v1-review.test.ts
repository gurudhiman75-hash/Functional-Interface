import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { CP004_SCENES_BY_DIFFICULTY_V1 } from "../chapters/error-spotting/ENG-001/CP004/cp004-catalog-v1";
import { generateEng001Cp004QuestionV1 } from "../chapters/error-spotting/ENG-001/CP004/eng-001-cp004-v1";
import { validateEng001Cp004QuestionV1 } from "../chapters/error-spotting/ENG-001/CP004/eng-001-cp004-v1-validator";
import type { Eng001QlId, EnglishDifficulty } from "../core/types";

const label = (index: number): string => String.fromCharCode(65 + index);
const qlForIndex = (index: number): Eng001QlId => index < 7 ? "ENG-001-QL001" : index < 14 ? "ENG-001-QL002" : "ENG-001-QL007";
const sectionLabel: Record<EnglishDifficulty, string> = { easy: "Easy", medium: "Medium", hard: "Hard" };
const idPrefix: Record<EnglishDifficulty, string> = { easy: "E", medium: "M", hard: "H" };

const out: string[] = [
  "# ENG-001 CP004 — Pronouns — Review V1",
  "",
  "Status: `REVIEW_CANDIDATE_V1__NOT_QUESTION_STUDIO_REGISTERED__HUMAN_REVIEW_PENDING`",
  "",
  "This review contains 60 deterministic questions: 20 Easy, 20 Medium and 20 Hard. CP004 remains review-only and is not registered in Question Studio.",
  "",
];

for (const difficulty of ["easy", "medium", "hard"] as const) {
  const scenes = CP004_SCENES_BY_DIFFICULTY_V1[difficulty];
  assert.equal(scenes.length, 20);
  out.push(`## ${sectionLabel[difficulty]} — 20 questions`, "");
  for (const [index, scene] of scenes.entries()) {
    const qlId = qlForIndex(index);
    const seed = `cp004-review-v1:${difficulty}:${String(index + 1).padStart(2, "0")}`;
    const question = generateEng001Cp004QuestionV1({ seed, difficulty, qlId, ruleId: scene.ruleId, sceneId: scene.id });
    const result = validateEng001Cp004QuestionV1(question);
    assert.equal(result.ok, true, `${scene.id}: ${result.issues.map((issue) => issue.message).join(" | ")}`);
    const qid = `${idPrefix[difficulty]}${String(index + 1).padStart(2, "0")}`;
    const sentence = question.segments.map((segment, partIndex) => `${label(partIndex)}. ${segment}`).join(" / ");
    const answer = question.options[question.correctOptionIndex] === "No error"
      ? `${label(question.correctOptionIndex)} — No error`
      : `${label(question.correctOptionIndex)} — ${question.options[question.correctOptionIndex]}`;
    out.push(
      `### ${qid}`,
      "",
      `- **Rule:** \`${question.metadata.ruleId}\``,
      `- **QL:** \`${question.metadata.qlId}\``,
      `- **Instruction:** ${question.stem}`,
      `- **Sentence:** ${sentence}`,
      `- **Answer:** ${answer}`,
      `- **Explanation:** ${question.explanation}`,
      "",
    );
  }
}

const markdown = `${out.join("\n").trim()}\n`;
assert.equal((markdown.match(/^### [EMH]\d{2}$/gm) ?? []).length, 60);
assert.equal((markdown.match(/^## Easy — 20 questions$/gm) ?? []).length, 1);
assert.equal((markdown.match(/^## Medium — 20 questions$/gm) ?? []).length, 1);
assert.equal((markdown.match(/^## Hard — 20 questions$/gm) ?? []).length, 1);

const target = resolve(process.cwd(), "dist/english-v1/ENG-001-CP004-REVIEW-V1.md");
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, markdown, "utf8");
console.log(`[ENG-001-CP004-REVIEW-V1] wrote ${target} (${Buffer.byteLength(markdown, "utf8")} bytes)`);
