import { generateWfm001Question, WFM_001_QL_IDS } from "./runtime";
import type { WfmDifficulty, WfmGeneratedQuestion, WfmLanguage, WfmQlId } from "./types";

const DIFFICULTIES: readonly WfmDifficulty[] = ["EASY", "MEDIUM", "HARD"];

export function buildWfm001ReviewPack(language: WfmLanguage, samplesPerDifficulty = 2): readonly WfmGeneratedQuestion[] {
  const out: WfmGeneratedQuestion[] = [];
  for (let qlIndex = 0; qlIndex < WFM_001_QL_IDS.length; qlIndex += 1) {
    const qlId = WFM_001_QL_IDS[qlIndex] as WfmQlId;
    for (let difficultyIndex = 0; difficultyIndex < DIFFICULTIES.length; difficultyIndex += 1) {
      const difficulty = DIFFICULTIES[difficultyIndex];
      for (let sample = 0; sample < samplesPerDifficulty; sample += 1) {
        const seed = 1000 * (qlIndex + 1) + 100 * difficultyIndex + sample * 17 + 2;
        out.push(generateWfm001Question({ qlId, seed, language, examProfile: "SSC_CGL_4", difficulty }));
      }
    }
  }
  return out;
}

export function renderWfm001ReviewMarkdown(questions: readonly WfmGeneratedQuestion[]): string {
  const lines: string[] = [
    "# WFM-001 — Word Formation V2 review candidate",
    "",
    "> Review-only ownership candidate. Not registered in shared Question Studio, not stored in Question Bank, not test/mock eligible, and not publicly publishable.",
    "",
    "Proposed product code: `REAS-WFM`  ",
    "Checkpoints: `WFM-CP-001..003`  ",
    "QLs: `WFM-QL-001..004`.",
    "",
  ];

  questions.forEach((question, index) => {
    lines.push(`## ${index + 1}. ${question.qlId} — ${question.difficulty} — ${question.renderer}`);
    lines.push("");
    if (question.sourceWord) lines.push(`**Source:** ${question.sourceWord}`, "");
    lines.push(question.stem, "");
    for (const option of question.options) lines.push(`${option.id}. ${option.text}`);
    lines.push("", `**Answer:** ${question.correctOptionId}`, "", `**Explanation:** ${question.explanation}`, "");
    lines.push(`_Seed ${question.seed}; profile ${question.examProfile}; difficulty basis ${question.metadata.difficultyBasis}._`, "");
  });

  return `${lines.join("\n")}\n`;
}
