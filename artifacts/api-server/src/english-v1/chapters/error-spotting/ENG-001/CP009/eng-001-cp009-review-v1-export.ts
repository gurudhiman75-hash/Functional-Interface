import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { Eng001QlId, EnglishDifficulty } from "../../../../core/types";
import { CP009_SCENES_BY_DIFFICULTY_V1 } from "./cp009-catalog-v1";
import { generateEng001Cp009QuestionV1 } from "./eng-001-cp009-v1";
import { assertValidEng001Cp009QuestionV1 } from "./eng-001-cp009-v1-validator";

const reviewQls: readonly Eng001QlId[] = ["ENG-001-QL001", "ENG-001-QL002"];
const difficulties: readonly EnglishDifficulty[] = ["easy", "medium", "hard"];

export function renderEng001Cp009ReviewV1(): string {
  const lines: string[] = [
    "# ENG-001 CP009 — Gerunds, Infinitives & Participles — Human Review V1",
    "",
    "Status: `REVIEW_CANDIDATE_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`",
    "",
    "This batch exposes all 60 authored invalid mutations using curated learner-facing part boundaries. Review exam naturalness, one-error uniqueness, difficulty separation and explanation clarity. QL007/no-error behavior is covered by the automated matrix. Any defect must be fixed at source/generator level and regenerated.",
    "",
  ];

  let serial = 0;
  for (const difficulty of difficulties) {
    lines.push(`## ${difficulty[0]!.toUpperCase()}${difficulty.slice(1)}`, "");
    for (const scene of CP009_SCENES_BY_DIFFICULTY_V1[difficulty]) {
      serial += 1;
      const qlId = reviewQls[(serial - 1) % reviewQls.length]!;
      const question = generateEng001Cp009QuestionV1({
        seed: `review:${scene.id}:${qlId}`,
        difficulty,
        qlId,
        ruleId: scene.ruleId,
        sceneId: scene.id,
      });
      assertValidEng001Cp009QuestionV1(question);
      const optionLines = question.segments.map(
        (segment, index) => `${String.fromCharCode(65 + index)}. ${segment}`,
      );
      if (question.options.includes("No error")) {
        optionLines.push(`${String.fromCharCode(65 + question.segments.length)}. No error`);
      }
      lines.push(
        `### ${scene.id} · ${scene.ruleId} · ${qlId}`,
        "",
        question.stem,
        "",
        ...optionLines,
        "",
        `**Answer:** ${question.options[question.correctOptionIndex]}`,
        "",
        `**Explanation:** ${question.explanation}`,
        "",
      );
    }
  }
  return `${lines.join("\n").trim()}\n`;
}

export function writeEng001Cp009ReviewV1(outputPath: string): void {
  mkdirSync(dirname(outputPath), { recursive: true });
  const rendered = renderEng001Cp009ReviewV1();
  writeFileSync(outputPath, rendered, "utf8");
  console.log(`[ENG-001-CP009-REVIEW-V1] wrote ${outputPath} (${Buffer.byteLength(rendered)} bytes)`);
}
