import { toMixedString } from "../foundation/rational";
import { inlineMathText } from "./pedagogy";
import { generateCp001Candidate } from "./runtime";
import type { TsdCp001GeneratedQuestion } from "./runtime-types";
import {
  DISTANCE_LABEL,
  SPEED_LABEL,
  TIME_LABEL,
  stableStringify,
} from "./runtime-support";

const CONCENTRATED_NUMBER_FAMILY = /\b(?:30|40|60)\b/;
const ROAD_OPENING = /^(?:A|An|The)\s+(?:car|bus)\b/i;

function restyle(
  candidate: TsdCp001GeneratedQuestion,
  representation: string,
  stem: string,
): TsdCp001GeneratedQuestion {
  const errors: string[] = [];
  if (!candidate.validation.valid) errors.push(...candidate.validation.errors);
  if (!stem.endsWith("?")) errors.push("P2 Batch 02 stem must end with a question mark");
  if (ROAD_OPENING.test(stem)) errors.push("P2 Batch 02 must not open with car or bus");
  if (CONCENTRATED_NUMBER_FAMILY.test(stem) || CONCENTRATED_NUMBER_FAMILY.test(candidate.answerText)) {
    errors.push("P2 Batch 02 contains the concentrated 30/40/60 family");
  }
  const stemMathJax = inlineMathText(stem);
  if (!stemMathJax.includes("\\(")) errors.push("P2 Batch 02 stem must contain a MathJax quantity");
  if (candidate.options[candidate.correctIndex] !== candidate.answerText) errors.push("Answer key mismatch");
  if (new Set(candidate.options).size !== 4) errors.push("Options are not unique");

  return Object.freeze({
    ...candidate,
    representation,
    stem,
    stemMathJax,
    mathematicalFingerprint: `P2-BATCH-02|${candidate.provisionalAuthorityId}|${representation}|${stableStringify(candidate.input)}`,
    validation: Object.freeze({
      valid: errors.length === 0,
      errors: Object.freeze(errors),
      warnings: Object.freeze([] as string[]),
    }),
  });
}

function distanceSupplements(): readonly TsdCp001GeneratedQuestion[] {
  const found: TsdCp001GeneratedQuestion[] = [];
  const usedAnswers = new Set(["180 km", "450 km", "240 km"]);
  for (let index = 700; index < 12000 && found.length < 2; index += 1) {
    const candidate = generateCp001Candidate("TSD-CP001-DISC-017", `p2-b02:reference-distance:${index}`);
    if (candidate.input.solveMode !== "distanceByProportion") continue;
    if (usedAnswers.has(candidate.answerText)) continue;
    const input = candidate.input;
    const frame = found.length === 0
      ? `A route-survey vehicle covers ${toMixedString(input.knownDistance)} km in ${toMixedString(input.knownTime)} hours. During a second survey it moves at ${toMixedString(input.targetSpeed)} km/h for ${toMixedString(input.targetTime)} hours. What distance does it cover in the second survey?`
      : `A parcel network records ${toMixedString(input.knownDistance)} km covered in ${toMixedString(input.knownTime)} hours on a reference run. If the next run lasts ${toMixedString(input.targetTime)} hours at ${toMixedString(input.targetSpeed)} km/h, how many kilometres are covered?`;
    if (CONCENTRATED_NUMBER_FAMILY.test(frame) || CONCENTRATED_NUMBER_FAMILY.test(candidate.answerText)) continue;
    const representation = found.length === 0
      ? "P2_ROUTE_SURVEY_CHANGED_SPEED_DISTANCE"
      : "P2_PARCEL_NETWORK_REFERENCE_DISTANCE";
    found.push(restyle(candidate, representation, frame));
    usedAnswers.add(candidate.answerText);
  }
  if (found.length !== 2) throw new Error("Could not find two diverse changed-condition distance states");
  return Object.freeze(found);
}

function timeSupplements(): readonly TsdCp001GeneratedQuestion[] {
  const found: TsdCp001GeneratedQuestion[] = [];
  const usedAnswers = new Set(["6 hours", "4 hours", "3.75 hours"]);
  for (let index = 900; index < 14000 && found.length < 2; index += 1) {
    const candidate = generateCp001Candidate("TSD-CP001-DISC-018", `p2-b02:reference-time:${index}`);
    if (candidate.input.solveMode !== "timeByProportion") continue;
    if (usedAnswers.has(candidate.answerText)) continue;
    const input = candidate.input;
    const frame = found.length === 0
      ? `A field-mapping unit covers ${toMixedString(input.knownDistance)} km in ${toMixedString(input.knownTime)} hours. How long will it take to cover ${toMixedString(input.targetDistance)} km at ${toMixedString(input.targetSpeed)} km/h?`
      : `A logistics route takes ${toMixedString(input.knownTime)} hours for ${toMixedString(input.knownDistance)} km on its reference run. At ${toMixedString(input.targetSpeed)} km/h, what time is needed for a ${toMixedString(input.targetDistance)} km assignment?`;
    if (CONCENTRATED_NUMBER_FAMILY.test(frame) || CONCENTRATED_NUMBER_FAMILY.test(candidate.answerText)) continue;
    const representation = found.length === 0
      ? "P2_FIELD_MAPPING_CHANGED_TIME"
      : "P2_LOGISTICS_ASSIGNMENT_REFERENCE_TIME";
    found.push(restyle(candidate, representation, frame));
    usedAnswers.add(candidate.answerText);
  }
  if (found.length !== 2) throw new Error("Could not find two diverse changed-condition time states");
  return Object.freeze(found);
}

function mixedUnitSupplements(): readonly TsdCp001GeneratedQuestion[] {
  const found: TsdCp001GeneratedQuestion[] = [];
  const usedAnswers = new Set(["18 km/h", "500 m/min", "15 m/s"]);
  for (let index = 1100; index < 16000 && found.length < 2; index += 1) {
    const candidate = generateCp001Candidate("TSD-CP001-DISC-007", `p2-b02:mixed-units:${index}`);
    if (candidate.input.solveMode !== "speedFromMixedUnits") continue;
    if (usedAnswers.has(candidate.answerText)) continue;
    const input = candidate.input;
    const distance = `${toMixedString(input.distance)} ${DISTANCE_LABEL[input.distanceUnit]}`;
    const duration = `${toMixedString(input.duration)} ${TIME_LABEL[input.timeUnit]}`;
    const output = SPEED_LABEL[input.outputUnit];
    const frame = found.length === 0
      ? `A motion sensor records an inspection unit covering ${distance} in ${duration}. What is its speed in ${output}?`
      : `During a calibrated track test, a mobile platform travels ${distance} in ${duration}. What is its speed in ${output}?`;
    if (CONCENTRATED_NUMBER_FAMILY.test(frame) || CONCENTRATED_NUMBER_FAMILY.test(candidate.answerText)) continue;
    const representation = found.length === 0
      ? "P2_SENSOR_LOG_MIXED_UNIT_SPEED"
      : "P2_CALIBRATED_TRACK_MIXED_UNIT_SPEED";
    found.push(restyle(candidate, representation, frame));
    usedAnswers.add(candidate.answerText);
  }
  if (found.length !== 2) throw new Error("Could not find two diverse mixed-unit speed states");
  return Object.freeze(found);
}

export function generateP2DiversityBatch02Supplements(): readonly TsdCp001GeneratedQuestion[] {
  return Object.freeze([
    ...distanceSupplements(),
    ...timeSupplements(),
    ...mixedUnitSupplements(),
  ]);
}
