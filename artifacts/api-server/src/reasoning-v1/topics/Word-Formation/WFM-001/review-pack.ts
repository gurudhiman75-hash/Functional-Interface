import { WFM_001_QUESTION_STUDIO_ADAPTER } from "./question-studio-adapter";
import type { WfmDifficulty, WfmGeneratedQuestion, WfmLanguage, WfmQlId } from "./types";

const DIFFICULTIES: readonly WfmDifficulty[] = ["EASY", "MEDIUM", "HARD"];
const QLS: readonly WfmQlId[] = ["WFM-QL-001", "WFM-QL-002"];

export function buildWfm001ReviewPack(language: WfmLanguage = "en-IN", perDifficulty = 2): WfmGeneratedQuestion[] {
  const questions: WfmGeneratedQuestion[] = [];
  for (let qlIndex = 0; qlIndex < QLS.length; qlIndex += 1) {
    for (let difficultyIndex = 0; difficultyIndex < DIFFICULTIES.length; difficultyIndex += 1) {
      for (let sample = 0; sample < perDifficulty; sample += 1) {
        questions.push(WFM_001_QUESTION_STUDIO_ADAPTER.generate({
          qlId: QLS[qlIndex],
          difficulty: DIFFICULTIES[difficultyIndex],
          language,
          examProfile: "SSC_CGL_4",
          seed: 1000 + qlIndex * 1000 + difficultyIndex * 100 + sample * 17,
        }));
      }
    }
  }
  return questions;
}

export function renderWfm001ReviewMarkdown(questions: readonly WfmGeneratedQuestion[]): string {
  const lines: string[] = [
    "# WFM-001 — Word Formation review candidate",
    "",
    "> Review-only ownership candidate. Not stored in Question Bank, not test-eligible, and not publicly publishable.",
    "",
    "Proposed product code: `REAS-WFM`  ",
    "Checkpoint: `WFM-CP-001`  ",
    "QLs: `WFM-QL-001` can-form, `WFM-QL-002` cannot-form.",
    "",
  ];

  let number = 0;
  for (const question of questions) {
    number += 1;
    lines.push(`## ${number}. ${question.qlId} — ${question.difficulty}`);
    lines.push("");
    lines.push(`**Source:** ${question.sourceWord}`);
    lines.push("");
    lines.push(question.stem);
    lines.push("");
    for (const option of question.options) lines.push(`${option.id}. ${option.text}`);
    lines.push("");
    lines.push(`**Answer:** ${question.correctOptionId}`);
    lines.push("");
    lines.push(`**Explanation:** ${question.explanation}`);
    lines.push("");
    lines.push(`_Seed ${question.seed}; profile ${question.examProfile}; difficulty basis ${question.metadata.difficultyBasis}._`);
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}
