import { ALPHABET, positionTrack } from "./foundation/alphabet";
import { auditAlpInstance } from "./ambiguity-checker";
import { buildAlpOptions, validateAlpOptions } from "./distractors";
import { generateAlpInstance } from "./instance-generator";
import { solveAlpInstance } from "./independent-solver";
import { renderAlpExplanation, renderAlpStem } from "./localization-safe";
import { alp001QlById } from "./ql-registry";
import type { AlpDifficulty, AlpInstanceData, AlpLocale, AlpQuestionLogic, GeneratedAlpQuestion } from "./types";

function difficultyFor(ql: AlpQuestionLogic, data: AlpInstanceData, seed: number): AlpDifficulty {
  let score = 0;
  if (ql.checkpointId === "ALP-CP-002") score += 1;
  if (ql.checkpointId === "ALP-CP-003") score += 1;
  if (ql.checkpointId === "ALP-CP-004") score += 2;
  if (ql.checkpointId === "ALP-CP-005") score += 1;
  if (ql.presentationMode.includes("INVERSE") || ql.taskKind.startsWith("recover")) score += 1;
  if (ql.presentationMode.includes("COMPOSITE") || ql.presentationMode.includes("RANGE")) score += 1;
  if (ql.solveMode.includes("CYCLIC") || ql.solveMode.includes("MIDDLE") || ql.solveMode.includes("UNCHANGED")) score += 1;
  if (data.occurrenceRef && data.occurrenceRef.occurrence > 1) score += 1;
  score += Math.abs(seed) % 3 === 2 ? 2 : Math.abs(seed) % 3 === 1 ? 1 : 0;
  if (score <= 1) return "EASY";
  if (score <= 3) return "MEDIUM";
  return "HARD";
}

function structuredPrompt(ql: AlpQuestionLogic, data: AlpInstanceData) {
  const sequence = data.sequence ?? (ql.checkpointId !== "ALP-CP-005" ? ALPHABET : undefined);
  return {
    ...(sequence ? { sequence } : {}),
    ...(data.transformedSequence ? { transformedSequence: data.transformedSequence } : {}),
    ...(data.word ? { word: data.word } : {}),
    ...(data.transformedWord ? { transformedWord: data.transformedWord } : {}),
    ...(sequence && ql.renderer === "POSITION_TRACK" ? { positionTrack: positionTrack(sequence) } : {}),
  };
}

export function generateAlp001Question(
  qlId: string,
  seed = 0,
  locale: AlpLocale = "en-IN",
): GeneratedAlpQuestion {
  const ql = alp001QlById(qlId);
  const data = generateAlpInstance(ql, seed);
  const solved = solveAlpInstance(ql, data);
  const ambiguity = auditAlpInstance(ql, data, solved);
  if (!ambiguity.accepted) {
    throw new Error(`${qlId} seed ${seed} failed ambiguity audit: ${ambiguity.reasons.join(" | ")}`);
  }
  const options = buildAlpOptions(ql, data, solved, seed);
  const correctIndex = validateAlpOptions(options, solved.answer);
  const stem = renderAlpStem(ql, data, locale);
  const explanation = renderAlpExplanation(ql, data, solved, locale);
  if (!stem.trim() || /\{\{|\}\}|undefined|null/.test(stem)) throw new Error(`${qlId} rendered an unresolved stem.`);

  return {
    chapterId: "ALP-001",
    qlId: ql.qlId,
    checkpointId: ql.checkpointId,
    ruleId: ql.ruleId,
    solveMode: ql.solveMode,
    locale,
    seed,
    difficulty: difficultyFor(ql, data, seed),
    renderer: ql.renderer,
    presentationMode: ql.presentationMode,
    stem,
    structuredPrompt: structuredPrompt(ql, data),
    options,
    correctIndex,
    answer: solved.answer,
    explanation,
    metadata: {
      runtimeVersion: "ALP-001-RUNTIME-V1",
      localeMode: "TRANSLATABLE",
      independentSolverVerified: true,
      ambiguityAudit: "EXPLICIT_OPERATION_UNIQUE",
      ...(data.transformId ? { transformId: data.transformId } : {}),
      ...(data.wordTransformId ? { wordTransformId: data.wordTransformId } : {}),
      occurrenceAware: Boolean(data.occurrenceRef),
    },
  };
}
