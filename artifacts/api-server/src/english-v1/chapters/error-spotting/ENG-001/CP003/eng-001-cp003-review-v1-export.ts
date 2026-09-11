import type { Eng001QlId, Eng001Question, EnglishDifficulty } from "../../../../core/types";
import { cp003ScenePoolV1, generateEng001Cp003QuestionV1 } from "./eng-001-cp003-v1";

export interface Cp003ReviewItemV1 {
  difficulty: EnglishDifficulty;
  qlId: Eng001QlId;
  question: Eng001Question;
}

const qls: readonly Eng001QlId[] = ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"];

export function buildEng001Cp003ReviewV1(): Record<EnglishDifficulty, Cp003ReviewItemV1[]> {
  return Object.fromEntries((["easy", "medium", "hard"] as const).map((difficulty) => {
    const scenes = cp003ScenePoolV1(difficulty).slice(0, 20);
    const items = scenes.map((scene, index) => {
      const qlId = qls[index % qls.length]!;
      const seed = `cp003-review-v1:${difficulty}:${scene.id}`;
      return { difficulty, qlId, question: generateEng001Cp003QuestionV1({ seed, difficulty, ruleId: scene.ruleId, sceneId: scene.id, qlId }) };
    });
    return [difficulty, items];
  })) as Record<EnglishDifficulty, Cp003ReviewItemV1[]>;
}

function sentence(q: Eng001Question): string {
  return q.segments.map((seg, i) => `${String.fromCharCode(65 + i)}. ${seg}`).join(" / ");
}

export function renderEng001Cp003ReviewV1(): string {
  const review = buildEng001Cp003ReviewV1();
  const lines: string[] = [
    "# ENG-001 CP003 — Articles and Determiners — Review V1",
    "",
    "Status: `REVIEW_CANDIDATE_V1__NOT_QUESTION_STUDIO_REGISTERED__HUMAN_REVIEW_PENDING`",
    "",
    "This frozen review contains 60 deterministic questions: 20 Easy, 20 Medium and 20 Hard. Questions remain review-only and are not registered in Question Studio.",
    "",
  ];
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    lines.push(`## ${difficulty[0]!.toUpperCase()}${difficulty.slice(1)} — 20 questions`, "");
    review[difficulty].forEach((item, i) => {
      const q = item.question;
      lines.push(
        `### ${difficulty[0]!.toUpperCase()}${String(i + 1).padStart(2, "0")}`,
        "",
        `- **Rule:** \`${q.metadata.ruleId}\``,
        `- **QL:** \`${q.metadata.qlId}\``,
        `- **Instruction:** ${q.stem}`,
        `- **Sentence:** ${sentence(q)}`,
        `- **Answer:** ${String.fromCharCode(65 + q.correctOptionIndex)} — ${q.options[q.correctOptionIndex]}`,
        `- **Explanation:** ${q.explanation}`,
        "",
      );
    });
  }
  return `${lines.join("\n").trim()}\n`;
}
