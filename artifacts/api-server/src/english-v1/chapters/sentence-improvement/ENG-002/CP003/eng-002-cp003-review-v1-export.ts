import type { EnglishDifficulty } from "../../../../core/types";
import { cp003ScenePoolV1 } from "../../../error-spotting/ENG-001/CP003/eng-001-cp003-v1";
import { generateEng002Cp003QuestionV1, type Eng002Cp003QuestionV1 } from "./eng-002-cp003-v1";

export interface Eng002Cp003ReviewItemV1 {
  difficulty: EnglishDifficulty;
  question: Eng002Cp003QuestionV1;
}

function buildSlice(difficulty: EnglishDifficulty): Eng002Cp003ReviewItemV1[] {
  const scenes = cp003ScenePoolV1(difficulty).slice(0, 20);
  if (scenes.length !== 20) throw new Error(`ENG-002 CP003 needs 20 ${difficulty} review scenes; received ${scenes.length}`);
  return scenes.map((scene, index) => ({
    difficulty,
    question: generateEng002Cp003QuestionV1({
      difficulty,
      ruleId: scene.ruleId,
      sceneId: scene.id,
      noImprovement: index % 4 === 3,
      seed: `eng002-cp003-review-v1:${difficulty}:${scene.id}`,
    }),
  }));
}

export function buildEng002Cp003ReviewV1(): Eng002Cp003ReviewItemV1[] {
  return (["easy", "medium", "hard"] as const).flatMap(buildSlice);
}

function renderSentence(question: Eng002Cp003QuestionV1): string {
  return question.segments
    .map((segment, index) => index === question.targetIndex ? `<u>${segment}</u>` : segment)
    .join(" ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function renderEng002Cp003ReviewMarkdownV1(): string {
  const review = buildEng002Cp003ReviewV1();
  const lines: string[] = [
    "# ENG-002-CP003 — Sentence Improvement: Articles and Determiners — Review V1",
    "",
    "Status: `REVIEW_CANDIDATE_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`",
    "",
    "60 deterministic questions: 20 Easy, 20 Medium and 20 Hard. Every fourth question is a calibrated No-improvement case.",
    "",
  ];

  for (const difficulty of ["easy", "medium", "hard"] as const) {
    const slice = review.filter((item) => item.difficulty === difficulty);
    lines.push(`## ${difficulty[0]!.toUpperCase()}${difficulty.slice(1)} — 20 questions`, "");
    slice.forEach((item, index) => {
      const q = item.question;
      lines.push(
        `### ${difficulty[0]!.toUpperCase()}${String(index + 1).padStart(2, "0")}`,
        "",
        `- **Rule:** \`${q.metadata.ruleId}\``,
        `- **Domain:** \`${q.metadata.semanticDomain}\``,
        `- **Instruction:** ${q.stem}`,
        `- **Sentence:** ${renderSentence(q)}`,
        ...q.options.map((option, optionIndex) => `  ${String.fromCharCode(65 + optionIndex)}. ${option}`),
        `- **Answer:** ${String.fromCharCode(65 + q.correctOptionIndex)} — ${q.options[q.correctOptionIndex]}`,
        `- **Explanation:** ${q.explanation}`,
        "",
      );
    });
  }
  return `${lines.join("\n").trim()}\n`;
}
