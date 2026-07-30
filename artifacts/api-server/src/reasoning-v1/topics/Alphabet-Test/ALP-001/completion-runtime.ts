import type { AlpLocale, AlpQuestionLogic, GeneratedAlpQuestion } from "./types";
import { buildCp006 } from "./completion/cp006";
import { buildCp007 } from "./completion/cp007";
import { buildCp008 } from "./completion/cp008";
import { buildCp009 } from "./completion/cp009";
import { buildCp010 } from "./completion/cp010";
import { renderCompletionEditorial } from "./completion/editorial";
import { difficulty, options, track, type C } from "./completion/shared";

function build(ql: AlpQuestionLogic, seed: number): C {
  switch (ql.checkpointId) {
    case "ALP-CP-006": return buildCp006(ql, seed);
    case "ALP-CP-007": return buildCp007(ql, seed);
    case "ALP-CP-008": return buildCp008(ql, seed);
    case "ALP-CP-009": return buildCp009(ql, seed);
    case "ALP-CP-010": return buildCp010(ql, seed);
    default: throw new Error("Not an ALP-001 completion checkpoint.");
  }
}

export function generateAlpCompletionQuestion(ql: AlpQuestionLogic, seed: number, locale: AlpLocale): GeneratedAlpQuestion {
  if (!Number.isInteger(seed)) throw new Error("ALP-001 completion seed must be an integer.");
  const completion = build(ql, seed);
  const builtOptions = options(completion.answer, completion.pool, ql, seed);
  const editorial = renderCompletionEditorial(ql, completion, builtOptions.out, builtOptions.correctIndex, locale);
  const optionOnlyQuestion = ql.solveMode === "IDENTIFY_WORD_BY_ALPHA_PAIR_COUNT";

  return {
    chapterId: "ALP-001",
    qlId: ql.qlId,
    checkpointId: ql.checkpointId,
    ruleId: ql.ruleId,
    solveMode: ql.solveMode,
    locale,
    seed,
    difficulty: difficulty(ql, seed),
    renderer: ql.renderer,
    presentationMode: ql.presentationMode,
    stem: editorial.stem,
    structuredPrompt: {
      ...(!optionOnlyQuestion ? { sequence: completion.source } : {}),
      ...(!optionOnlyQuestion && completion.changed ? { transformedSequence: completion.changed } : {}),
      ...(!optionOnlyQuestion && completion.word ? { word: completion.word } : {}),
      ...(!optionOnlyQuestion && completion.changedWord ? { transformedWord: completion.changedWord } : {}),
      ...(!optionOnlyQuestion ? { positionTrack: track(completion.source) } : {}),
    },
    options: builtOptions.out,
    correctIndex: builtOptions.correctIndex,
    answer: completion.answer,
    explanation: {
      schemaVersion: "ALP-001-PEDAGOGY-V2",
      coreConcept: editorial.coreConcept,
      ruleStatement: editorial.ruleStatement,
      steps: editorial.steps,
      visualWorking: editorial.visualWorking,
      examShortcut: editorial.examShortcut,
      conclusion: editorial.conclusion,
      distractorAnalyses: editorial.distractorAnalyses,
      closestTrapRejection: editorial.closestTrapRejection,
    },
    metadata: {
      runtimeVersion: "ALP-001-RUNTIME-V3",
      localeMode: "TRANSLATABLE",
      independentSolverVerified: true,
      ambiguityAudit: "EXPLICIT_OPERATION_UNIQUE",
      occurrenceAware: false,
    },
  };
}
