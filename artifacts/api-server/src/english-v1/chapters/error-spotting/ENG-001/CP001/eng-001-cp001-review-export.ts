import { generateEng001Cp001Question } from "./eng-001-cp001";
import type { Eng001Question, EnglishDifficulty } from "../../../../core/types";

export interface Eng001Cp001ReviewPack {
  markdown: string;
  questions: readonly Eng001Question[];
}

export function buildEng001Cp001ReviewPack(): Eng001Cp001ReviewPack {
  const questions: Eng001Question[] = [];
  const difficulties: readonly EnglishDifficulty[] = ["easy", "medium", "hard"];
  const qlIds = ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"] as const;

  for (const difficulty of difficulties) {
    for (const qlId of qlIds) {
      for (let sample = 1; sample <= 4; sample += 1) {
        questions.push(generateEng001Cp001Question({ difficulty, qlId, seed: `ENG001-CP001-REVIEW-V1:${difficulty}:${qlId}:${sample}` }));
      }
    }
  }

  const lines: string[] = [
    "# ENG-001-CP001 — Subject–Verb Agreement Review Pack V1",
    "",
    "Status: `REVIEW_ONLY__NOT_QUESTION_STUDIO_REGISTERED`",
    "",
    "This pack is deterministic. It contains 36 questions: four samples for each Difficulty × QL combination.",
    "",
  ];

  questions.forEach((question, index) => {
    lines.push(`## ${index + 1}. ${question.metadata.difficulty.toUpperCase()} · ${question.metadata.qlId} · ${question.metadata.ruleId}`);
    lines.push("");
    lines.push(question.stem);
    lines.push("");
    question.segments.forEach((segment, segmentIndex) => lines.push(`${String.fromCharCode(65 + segmentIndex)}. ${segment}`));
    if (question.options.at(-1) === "No error") lines.push("No error");
    lines.push("");
    lines.push(`**Answer:** ${question.options[question.correctOptionIndex]}`);
    lines.push("");
    lines.push(`**Explanation:** ${question.explanation}`);
    lines.push("");
    lines.push(`Seed: \`${question.metadata.seed}\` · Candidate: \`${question.metadata.candidateId}\``);
    lines.push("");
  });

  return { markdown: lines.join("\n"), questions };
}
