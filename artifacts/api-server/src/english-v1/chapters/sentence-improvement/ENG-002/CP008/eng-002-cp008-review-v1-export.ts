import { cp008ScenePoolV1 } from "../../../error-spotting/ENG-001/CP008/eng-001-cp008-v1";
import type { EnglishDifficulty } from "../../../../core/types";
import { ENG002_CP008_STEM, generateEng002Cp008QuestionV1, type Eng002Cp008QuestionV1 } from "./eng-002-cp008-v1";

export interface Eng002Cp008ReviewItemV1 { number: number; difficulty: EnglishDifficulty; question: Eng002Cp008QuestionV1 }
export function buildEng002Cp008ReviewV1(): Eng002Cp008ReviewItemV1[] {
  const items: Eng002Cp008ReviewItemV1[] = []; let number = 1;
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    cp008ScenePoolV1(difficulty).forEach((scene, index) => {
      items.push({ number, difficulty, question: generateEng002Cp008QuestionV1({ seed: `eng002-cp008-review:${difficulty}:${scene.id}`, difficulty, ruleId: scene.ruleId, sceneId: scene.id, noImprovement: index % 4 === 3 }) });
      number += 1;
    });
  }
  return items;
}
function underlinedSentence(question: Eng002Cp008QuestionV1) { return question.segments.map((segment, index) => index === question.targetIndex ? `<u>${segment}</u>` : segment).join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim(); }
export function renderEng002Cp008ReviewMarkdownV1() {
  const lines: string[] = ["# ENG-002 CP008 — Sentence Improvement: Nouns & Quantifiers — Review V1", "", `**Instruction:** ${ENG002_CP008_STEM}`, "", "Review-only artifact. Not authorized for Question Bank, tests, mocks, public publication or production release.", ""];
  let currentDifficulty = "";
  for (const item of buildEng002Cp008ReviewV1()) {
    const label = item.difficulty[0]!.toUpperCase() + item.difficulty.slice(1);
    if (label !== currentDifficulty) { currentDifficulty = label; lines.push(`## ${label}`, ""); }
    const q = item.question; lines.push(`### ${item.number}. ${underlinedSentence(q)}`, "");
    q.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option}`));
    lines.push("", `**Answer:** ${String.fromCharCode(65 + q.correctOptionIndex)}. ${q.options[q.correctOptionIndex]}`, "", `**Explanation:** ${q.explanation}`, "", `*Rule: ${q.metadata.ruleId} · Domain: ${q.metadata.semanticDomain} · Scene: ${q.metadata.sceneId}*`, "");
  }
  return `${lines.join("\n").trim()}\n`;
}
