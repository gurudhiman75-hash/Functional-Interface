import { writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { mkdirSync } from "node:fs";

import type { Eng001QlId, EnglishDifficulty } from "../../../../core/types";
import { CP005_SCENES_BY_DIFFICULTY_V1 } from "./cp005-catalog-v1";
import { generateEng001Cp005QuestionV1 } from "./eng-001-cp005-v1";
import { assertValidEng001Cp005QuestionV1 } from "./eng-001-cp005-v1-validator";

const qls: readonly Eng001QlId[] = ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"];
const difficulties: readonly EnglishDifficulty[] = ["easy", "medium", "hard"];

export function renderEng001Cp005ReviewV1(): string {
  const lines: string[] = [
    "# ENG-001 CP005 — Prepositions — Human Review V1",
    "",
    "Status: `REVIEW_CANDIDATE_V1__NOT_QUESTION_STUDIO_REGISTERED__HUMAN_REVIEW_PENDING`",
    "",
    "This batch is generated deterministically from the CP005 source catalog. Review wording, answer uniqueness, difficulty, naturalness and explanations. Any defect must be fixed at source/generator level.",
    "",
  ];

  let serial = 0;
  for (const difficulty of difficulties) {
    lines.push(`## ${difficulty[0]!.toUpperCase()}${difficulty.slice(1)}`, "");
    const scenes = CP005_SCENES_BY_DIFFICULTY_V1[difficulty];
    for (const scene of scenes) {
      serial += 1;
      const qlId = qls[(serial - 1) % qls.length]!;
      const question = generateEng001Cp005QuestionV1({ seed: `review:${scene.id}:${qlId}`, difficulty, qlId, ruleId: scene.ruleId, sceneId: scene.id });
      assertValidEng001Cp005QuestionV1(question);
      const optionLines = question.segments.map((segment, index) => `${String.fromCharCode(65 + index)}. ${segment}`);
      if (question.options.includes("No error")) optionLines.push(`${String.fromCharCode(65 + question.segments.length)}. No error`);
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

export function writeEng001Cp005ReviewV1(outputPath: string): void {
  mkdirSync(dirname(outputPath), { recursive: true });
  const rendered = renderEng001Cp005ReviewV1();
  writeFileSync(outputPath, rendered, "utf8");
  console.log(`[ENG-001-CP005-REVIEW-V1] wrote ${outputPath} (${Buffer.byteLength(rendered)} bytes)`);
}
