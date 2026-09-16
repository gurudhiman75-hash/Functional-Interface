import { cp011ScenePoolV1 } from "../../../error-spotting/ENG-001/CP011/eng-001-cp011-v1";
import type { EnglishDifficulty } from "../../../../core/types";
import { ENG002_CP011_STEM, type Eng002Cp011QuestionV1 } from "./eng-002-cp011-v1";
import { generateEng002Cp011ReviewedQuestionV1 } from "./eng-002-cp011-reviewed-v1";

export interface Eng002Cp011ReviewItemV1 { number: number; difficulty: EnglishDifficulty; question: Eng002Cp011QuestionV1 }

export function buildEng002Cp011ReviewV1(): Eng002Cp011ReviewItemV1[] {
  const items: Eng002Cp011ReviewItemV1[] = [];
  let number = 1;
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    cp011ScenePoolV1(difficulty).forEach((scene, index) => {
      items.push({
        number,
        difficulty,
        question: generateEng002Cp011ReviewedQuestionV1({
          seed: `eng002-cp011-review:${difficulty}:${scene.id}`,
          difficulty,
          ruleId: scene.ruleId,
          sceneId: scene.id,
          noImprovement: index % 4 === 3,
        }),
      });
      number += 1;
    });
  }
  return items;
}

function underlinedSentence(question: Eng002Cp011QuestionV1) {
  return question.segments
    .map((segment, index) => index === question.targetIndex ? `<u>${segment.replace(/[,.;:!?]+$/, "")}</u>${segment.match(/([,.;:!?]+)$/)?.[1] ?? ""}` : segment)
    .join(" ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function renderEng002Cp011ReviewMarkdownV1() {
  const lines: string[] = [
    "# ENG-002 CP011 — Sentence Improvement: Conditionals — Review V1",
    "",
    `**Instruction:** ${ENG002_CP011_STEM}`,
    "",
    "Review-only artifact. Not authorized for Question Bank, tests, mocks, public publication or production release.",
    "",
  ];
  let currentDifficulty = "";
  for (const item of buildEng002Cp011ReviewV1()) {
    const label = item.difficulty[0]!.toUpperCase() + item.difficulty.slice(1);
    if (label !== currentDifficulty) { currentDifficulty = label; lines.push(`## ${label}`, ""); }
    const q = item.question;
    lines.push(`### ${item.number}. ${underlinedSentence(q)}`, "");
    q.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option}`));
    lines.push(
      "",
      `**Answer:** ${String.fromCharCode(65 + q.correctOptionIndex)}. ${q.options[q.correctOptionIndex]}`,
      "",
      `**Explanation:** ${q.explanation}`,
      "",
      `*Rule: ${q.metadata.ruleId} · Domain: ${q.metadata.semanticDomain} · Scene: ${q.metadata.sceneId}*`,
      "",
    );
  }
  return `${lines.join("\n").trim()}\n`;
}
