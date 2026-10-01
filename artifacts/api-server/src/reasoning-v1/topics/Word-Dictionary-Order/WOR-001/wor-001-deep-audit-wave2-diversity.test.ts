import assert from "node:assert/strict";

import { generateWor001Question } from "./runtime";
import {
  WOR_001_QUESTION_STUDIO_PRODUCTION_PROTOTYPES,
} from "./question-studio-production-authority";
import { WOR_001_QUESTION_STUDIO_CATALOG } from "./question-studio-review";
import type { GeneratedWorQuestion, WorDifficulty } from "./foundation/types";

const runtimeDifficulty: Record<string, WorDifficulty> = {
  Easy: "EASY",
  Medium: "MEDIUM",
  Hard: "HARD",
};

function lexicalSignature(question: GeneratedWorQuestion): string {
  return [
    question.prototypeId,
    question.difficulty,
    [...question.structuredPrompt.words].sort().join("|"),
    question.structuredPrompt.insertionWord ?? "",
    question.structuredPrompt.presentedSequence?.join("|") ?? "",
    question.structuredPrompt.partialSequence?.join("|") ?? "",
  ].join("::");
}

function bankingParameterSignature(question: GeneratedWorQuestion): string {
  const trace = question.metadata.bankingTrace;
  if (!trace) return "";
  return [
    trace.taskKind,
    trace.transformation,
    trace.sortDirection,
    trace.wordRank ?? "",
    trace.wordRankSide ?? "",
    trace.characterIndex ?? "",
    trace.characterSide ?? "",
    trace.alphabetOffset ?? "",
    trace.globalCharacterIndex ?? "",
    trace.globalCharacterSide ?? "",
    trace.answerMode ?? "",
  ].join("|");
}

const report: Array<Record<string, unknown>> = [];

for (const prototype of WOR_001_QUESTION_STUDIO_PRODUCTION_PROTOTYPES) {
  const catalog = WOR_001_QUESTION_STUDIO_CATALOG.find((entry) => entry.prototypeId === prototype.prototypeId)!;
  for (const studioDifficulty of catalog.supportedDifficulties) {
    const difficulty = runtimeDifficulty[studioDifficulty]!;
    const sampleSize = 180;
    const lexical = new Set<string>();
    const families = new Set<string>();
    const answerPositions = new Set<number>();
    const parameterShapes = new Set<string>();

    for (let index = 0; index < sampleSize; index += 1) {
      const question = generateWor001Question(
        prototype.prototypeId,
        810000 + index * 131 + prototype.prototypeId.charCodeAt(prototype.prototypeId.length - 1),
        "en-IN",
        difficulty,
      );
      assert.equal(question.difficulty, difficulty);
      lexical.add(lexicalSignature(question));
      families.add(question.metadata.sourceFamilyId);
      answerPositions.add(question.correctIndex);
      if (question.metadata.bankingTrace) parameterShapes.add(bankingParameterSignature(question));
    }

    const lexicalUniqueness = lexical.size / sampleSize;
    assert.ok(
      lexicalUniqueness >= 0.85,
      `${prototype.prototypeId}/${studioDifficulty} lexical uniqueness too low: ${lexical.size}/${sampleSize}`,
    );

    const expectedOptionPositions = prototype.checkpointId === "WOR-CP-005" ? 5 : 4;
    assert.equal(
      answerPositions.size,
      expectedOptionPositions,
      `${prototype.prototypeId}/${studioDifficulty} does not cover every answer position`,
    );

    if (prototype.checkpointId === "WOR-CP-005") {
      assert.ok(
        families.size >= 12,
        `${prototype.prototypeId}/${studioDifficulty} Banking family reach is too narrow: ${families.size}`,
      );
      const minimumParameterShapes =
        prototype.prototypeId === "WOR-PROT-020" ? 8 :
        prototype.prototypeId === "WOR-PROT-021" ? 20 :
        prototype.prototypeId === "WOR-PROT-022" ? 28 :
        prototype.prototypeId === "WOR-PROT-023" ? 24 : 28;
      assert.ok(
        parameterShapes.size >= minimumParameterShapes,
        `${prototype.prototypeId}/${studioDifficulty} Banking parameter diversity too low: ${parameterShapes.size}`,
      );
    } else {
      assert.ok(
        families.size >= 10,
        `${prototype.prototypeId}/${studioDifficulty} classic family reach is too narrow: ${families.size}`,
      );
    }

    report.push({
      prototypeId: prototype.prototypeId,
      difficulty: studioDifficulty,
      sampleSize,
      uniqueLexicalInstances: lexical.size,
      lexicalUniqueness: Number(lexicalUniqueness.toFixed(3)),
      familyCount: families.size,
      answerPositions: [...answerPositions].sort((a, b) => a - b),
      ...(prototype.checkpointId === "WOR-CP-005" ? { uniqueParameterShapes: parameterShapes.size } : {}),
    });
  }
}

console.log("WOR-001 deep audit Wave 2 diversity diagnostic passed.");
for (const row of report) console.log(JSON.stringify(row));
