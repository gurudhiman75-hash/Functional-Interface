import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { EnglishDifficulty } from "../../../../core/types";
import { CP011_SCENES_BY_DIFFICULTY_V1 } from "./cp011-catalog-v1";
import { generateEng001Cp011QuestionV1 } from "./eng-001-cp011-v1";
import { assertValidEng001Cp011QuestionV1 } from "./eng-001-cp011-v1-validator";

const difficulties: readonly EnglishDifficulty[] = ["easy", "medium", "hard"];

export function renderEng001Cp011ReviewV1(): string {
  const lines: string[] = [
    "# ENG-001 CP011 — Conditionals — Human Review V1",
    "",
    "Status: `REVIEW_CANDIDATE_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`",
    "",
    "This batch exposes all 60 authored conditional-grammar errors as four-part QL001 questions. Review exam naturalness, single-error uniqueness, tense/meaning cues, difficulty separation and explanation clarity. QL002 and QL007 behavior is covered by the automated matrix. Debatable was/were variation and volitional if + will are deliberately excluded from keyed mutations.",
    "",
  ];

  for (const difficulty of difficulties) {
    lines.push(`## ${difficulty[0]!.toUpperCase()}${difficulty.slice(1)}`, "");
    for (const scene of CP011_SCENES_BY_DIFFICULTY_V1[difficulty]) {
      const question = generateEng001Cp011QuestionV1({ seed: `review:${scene.id}:ENG-001-QL001`, difficulty, qlId: "ENG-001-QL001", ruleId: scene.ruleId, sceneId: scene.id });
      assertValidEng001Cp011QuestionV1(question);
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

export function writeEng001Cp011ReviewV1(outputPath: string): void {
  mkdirSync(dirname(outputPath), { recursive: true });
  const rendered = renderEng001Cp011ReviewV1();
  writeFileSync(outputPath, rendered, "utf8");
  console.log(`[ENG-001-CP011-REVIEW-V1] wrote ${outputPath} (${Buffer.byteLength(rendered)} bytes)`);
}
