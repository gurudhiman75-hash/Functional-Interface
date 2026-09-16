import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { EnglishDifficulty } from "../../../../core/types";
import { CP012_SCENES_BY_DIFFICULTY_V1 } from "./cp012-catalog-v1";
import { generateEng001Cp012QuestionV1 } from "./eng-001-cp012-v1";
import { assertValidEng001Cp012QuestionV1 } from "./eng-001-cp012-v1-validator";

const difficulties: readonly EnglishDifficulty[] = ["easy", "medium", "hard"];

export function renderEng001Cp012ReviewV1(): string {
  const lines: string[] = [
    "# ENG-001 CP012 — Voice & Narration — Human Review V1",
    "",
    "Status: `REVIEW_CANDIDATE_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`",
    "",
    "This batch exposes all 68 authored CP012 scenes as four-part QL001 questions: 20 Easy, 24 Medium and 24 Hard. It covers five voice rule families and seven narration rule families. Review sentence naturalness, single-error uniqueness, transformation/reference cues, difficulty separation and explanation clarity. QL002 and QL007 behavior is covered by the automated matrix. Debatable still-true backshift and mechanical time/place replacement are deliberately excluded.",
    "",
  ];

  for (const difficulty of difficulties) {
    lines.push(`## ${difficulty[0]!.toUpperCase()}${difficulty.slice(1)}`, "");
    for (const scene of CP012_SCENES_BY_DIFFICULTY_V1[difficulty]) {
      const question = generateEng001Cp012QuestionV1({ seed: `review:${scene.id}:ENG-001-QL001`, difficulty, qlId: "ENG-001-QL001", ruleId: scene.ruleId, sceneId: scene.id });
      assertValidEng001Cp012QuestionV1(question);
      lines.push(
        `### ${scene.id} · ${scene.ruleId} · ENG-001-QL001`, "", question.stem, "",
        ...question.segments.map((segment, index) => `${String.fromCharCode(65 + index)}. ${segment}`), "",
        `**Answer:** ${question.options[question.correctOptionIndex]}`, "",
        `**Explanation:** ${question.explanation}`, "",
      );
    }
  }
  return `${lines.join("\n").trim()}\n`;
}

export function writeEng001Cp012ReviewV1(outputPath: string): void {
  mkdirSync(dirname(outputPath), { recursive: true });
  const rendered = renderEng001Cp012ReviewV1();
  writeFileSync(outputPath, rendered, "utf8");
  console.log(`[ENG-001-CP012-REVIEW-V1] wrote ${outputPath} (${Buffer.byteLength(rendered)} bytes)`);
}
