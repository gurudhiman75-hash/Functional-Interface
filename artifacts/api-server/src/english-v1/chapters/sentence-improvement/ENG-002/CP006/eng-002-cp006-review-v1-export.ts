import { cp006ScenePoolV1 } from "../../../error-spotting/ENG-001/CP006/eng-001-cp006-v1";
import type { EnglishDifficulty } from "../../../../core/types";
import { ENG002_CP006_STEM, generateEng002Cp006QuestionV1, type Eng002Cp006QuestionV1 } from "./eng-002-cp006-v1";

export interface Eng002Cp006ReviewItemV1 {
  number: number;
  difficulty: EnglishDifficulty;
  question: Eng002Cp006QuestionV1;
}

export function buildEng002Cp006ReviewV1(): Eng002Cp006ReviewItemV1[] {
  const items: Eng002Cp006ReviewItemV1[] = [];
  let number = 1;
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    const scenes = cp006ScenePoolV1(difficulty);
    scenes.forEach((scene, index) => {
      const question = generateEng002Cp006QuestionV1({
        seed: `eng002-cp006-review:${difficulty}:${scene.id}`,
        difficulty,
        ruleId: scene.ruleId,
        sceneId: scene.id,
        noImprovement: index % 4 === 3,
      });
      items.push({ number, difficulty, question });
      number += 1;
    });
  }
  return items;
}

function underlinedSentence(question: Eng002Cp006QuestionV1) {
  return question.segments
    .map((segment, index) => index === question.targetIndex ? `<u>${segment}</u>` : segment)
    .join(" ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function renderEng002Cp006ReviewMarkdownV1() {
  const items = buildEng002Cp006ReviewV1();
  const lines: string[] = [
    "# ENG-002 CP006 — Sentence Improvement: Adjectives, Adverbs and Comparison — Review V1",
    "",
    `**Instruction:** ${ENG002_CP006_STEM}`,
    "",
    "Review-only artifact. Not authorized for Question Bank, tests, mocks, public publication or production release.",
    "",
  ];
  let currentDifficulty = "";
  for (const item of items) {
    const label = item.difficulty[0]!.toUpperCase() + item.difficulty.slice(1);
    if (label !== currentDifficulty) {
      currentDifficulty = label;
      lines.push(`## ${label}`, "");
    }
    const question = item.question;
    lines.push(`### ${item.number}. ${underlinedSentence(question)}`, "");
    question.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option}`));
    lines.push(
      "",
      `**Answer:** ${String.fromCharCode(65 + question.correctOptionIndex)}. ${question.options[question.correctOptionIndex]}`,
      "",
      `**Explanation:** ${question.explanation}`,
      "",
      `*Rule: ${question.metadata.ruleId} · Domain: ${question.metadata.semanticDomain} · Scene: ${question.metadata.sceneId}*`,
      "",
    );
  }
  return `${lines.join("\n").trim()}\n`;
}
