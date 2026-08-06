import { toMixedString } from "../foundation/rational";
import { inlineMathText } from "./pedagogy";
import { generateCp001Candidate } from "./runtime";
import type { TsdCp001GeneratedQuestion } from "./runtime-types";
import { DISTANCE_LABEL, SPEED_LABEL, formatClock, stableStringify } from "./runtime-support";

const CONCENTRATED_NUMBER_FAMILY = /\b(?:30|40|60)\b/;

function restyle(
  candidate: TsdCp001GeneratedQuestion,
  representation: string,
  stem: string,
): TsdCp001GeneratedQuestion {
  const errors: string[] = [];
  if (!candidate.validation.valid) errors.push(...candidate.validation.errors);
  if (!stem.endsWith("?")) errors.push("Batch 04 stem must end with a question mark");
  const stemMathJax = inlineMathText(stem);
  if (!stemMathJax.includes("\\(")) errors.push("Batch 04 stem must contain a MathJax quantity");
  if (candidate.options[candidate.correctIndex] !== candidate.answerText) errors.push("Answer key mismatch");
  if (new Set(candidate.options).size !== 4) errors.push("Options are not unique");

  return Object.freeze({
    ...candidate,
    representation,
    stem,
    stemMathJax,
    mathematicalFingerprint: `P1-BATCH-04|${candidate.provisionalAuthorityId}|${representation}|${stableStringify(candidate.input)}`,
    validation: Object.freeze({
      valid: errors.length === 0,
      errors: Object.freeze(errors),
      warnings: Object.freeze([] as string[]),
    }),
  });
}

function directSpeedSupplement(): TsdCp001GeneratedQuestion {
  for (let index = 100; index < 5000; index += 1) {
    const candidate = generateCp001Candidate("TSD-CP001-DISC-002", `p1-b04:direct-speed:${index}`);
    if (candidate.input.solveMode !== "speedFromDistanceAndTime") continue;
    if (candidate.answerText === "5 m/s" || candidate.answerText === "8 m/s") continue;

    const stem = `A timing gate records a test vehicle covering ${toMixedString(candidate.input.distanceMetres)} metres in ${toMixedString(candidate.input.durationSeconds)} seconds. What average speed does this represent in m/s?`;
    if (CONCENTRATED_NUMBER_FAMILY.test(stem) || CONCENTRATED_NUMBER_FAMILY.test(candidate.answerText)) continue;
    return restyle(candidate, "DIRECT_SPEED_TIMING_GATE_P1_B04", stem);
  }
  throw new Error("Batch 04 could not find a diverse direct-speed state");
}

function deadlineSpeedSupplement(): TsdCp001GeneratedQuestion {
  for (let index = 100; index < 5000; index += 1) {
    const candidate = generateCp001Candidate("TSD-CP001-DISC-023", `p1-b04:deadline-speed:${index}`);
    if (candidate.input.solveMode !== "requiredUniformSpeedForDeadline") continue;
    if (candidate.answerText === "36 km/h" || candidate.answerText === "40 km/h") continue;

    const departure = formatClock(candidate.input.departureMinuteOfDay, 0n);
    const deadline = formatClock(candidate.input.deadlineMinuteOfDay, candidate.input.deadlineDayOffset);
    const distance = `${toMixedString(candidate.input.distance)} ${DISTANCE_LABEL[candidate.input.distanceUnit]}`;
    const outputUnit = SPEED_LABEL[candidate.input.outputUnit];
    const stem = `A field inspection vehicle leaves at ${departure} and must finish a ${distance} route by ${deadline}. What minimum uniform speed is required in ${outputUnit}?`;
    if (CONCENTRATED_NUMBER_FAMILY.test(candidate.answerText)) continue;
    return restyle(candidate, "DEADLINE_FIELD_ROUTE_P1_B04", stem);
  }
  throw new Error("Batch 04 could not find a diverse deadline-speed state");
}

export function generateP1DiversityBatch04Cp001Supplements(): readonly TsdCp001GeneratedQuestion[] {
  return Object.freeze([directSpeedSupplement(), deadlineSpeedSupplement()]);
}
