import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { EnglishDifficulty } from "../../../../core/types";
import { CP013_SCENES_BY_DIFFICULTY_V1 } from "./cp013-catalog-v1";
import { generateEng001Cp013QuestionV1 } from "./eng-001-cp013-v1";
import { assertValidEng001Cp013QuestionV1 } from "./eng-001-cp013-v1-validator";

const difficulties: readonly EnglishDifficulty[] = ["easy", "medium", "hard"];

export function renderEng001Cp013ReviewV1(): string {
  const lines: string[] = [
    "# ENG-001 CP013 — Common Usage / Idiomatic Grammar — Human Review V1",
    "",
    "Status: `REVIEW_CANDIDATE_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`",
    "",
    "This batch exposes all 60 authored CP013 scenes as four-part QL001 questions: 20 Easy, 20 Medium and 20 Hard. It covers nine carefully bounded usage families: prefer X to Y; senior/junior to; different from; capable of; insist on; prevent ... from; despite/in spite of; no sooner ... than; and hardly/scarcely ... when. Review sentence naturalness, single-error uniqueness, difficulty separation and explanation clarity. QL002 and QL007 behavior is covered by the automated matrix.",
    "",
    "Variation guard: this checkpoint never marks `different to` or `different than` as errors, never treats omission of `from` after `prevent` as the keyed defect, and does not reject valid `insist that + clause` structures. The authored mutations use only the narrower unambiguous forms described in the source audit.",
    "",
  ];

  for (const difficulty of difficulties) {
    lines.push(`## ${difficulty[0]!.toUpperCase()}${difficulty.slice(1)}`, "");
    for (const scene of CP013_SCENES_BY_DIFFICULTY_V1[difficulty]) {
      const question = generateEng001Cp013QuestionV1({ seed: `review:${scene.id}:ENG-001-QL001`, difficulty, qlId: "ENG-001-QL001", ruleId: scene.ruleId, sceneId: scene.id });
      assertValidEng001Cp013QuestionV1(question);
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

export function writeEng001Cp013ReviewV1(outputPath: string): void {
  mkdirSync(dirname(outputPath), { recursive: true });
  const rendered = renderEng001Cp013ReviewV1();
  writeFileSync(outputPath, rendered, "utf8");
  console.log(`[ENG-001-CP013-REVIEW-V1] wrote ${outputPath} (${Buffer.byteLength(rendered)} bytes)`);
}
