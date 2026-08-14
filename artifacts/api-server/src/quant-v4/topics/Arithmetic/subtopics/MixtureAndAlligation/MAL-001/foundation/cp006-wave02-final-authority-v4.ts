import { generateMalCp006Wave02FinalAuthorityV3 } from "./cp006-wave02-final-authority-v3";
import type { MalCp006Wave02LearnerQuestion } from "./cp006-wave02-inverse-learner";
import type { MalCp006Wave02PrototypeId } from "./cp006-source-fixtures-wave02";

export const MAL_CP006_WAVE02_FINAL_AUTHORITY_V4_ID =
  "MAL-CP006-EN-WAVE02-FINAL-LEARNER-AUTHORITY-V4" as const;

export const MAL_CP006_WAVE02_OBJECT_CONTEXTS = [
  { id: "MILK_WATER", primary: "milk", secondary: "water", primaryInitial: "pure milk", secondaryInitial: "pure water" },
  { id: "SPIRIT_WATER", primary: "spirit", secondary: "water", primaryInitial: "spirit", secondaryInitial: "pure water" },
  { id: "ALCOHOL_WATER", primary: "alcohol", secondary: "water", primaryInitial: "alcohol", secondaryInitial: "pure water" },
  { id: "ACID_WATER", primary: "acid", secondary: "water", primaryInitial: "acid", secondaryInitial: "pure water" },
  { id: "SYRUP_WATER", primary: "syrup", secondary: "water", primaryInitial: "syrup", secondaryInitial: "pure water" },
  { id: "JUICE_WATER", primary: "juice", secondary: "water", primaryInitial: "juice", secondaryInitial: "pure water" },
  { id: "GLYCERINE_WATER", primary: "glycerine", secondary: "water", primaryInitial: "glycerine", secondaryInitial: "pure water" },
  { id: "PETROL_KEROSENE", primary: "petrol", secondary: "kerosene", primaryInitial: "petrol", secondaryInitial: "kerosene" },
] as const;

export const MAL_CP006_WAVE02_CONTAINER_OBJECTS = ["vessel", "container", "tank"] as const;

export type MalCp006Wave02ObjectContextId = (typeof MAL_CP006_WAVE02_OBJECT_CONTEXTS)[number]["id"];
export type MalCp006Wave02ContainerObject = (typeof MAL_CP006_WAVE02_CONTAINER_OBJECTS)[number];
export type MalCp006Wave02FinalQuestionV4 = MalCp006Wave02LearnerQuestion & {
  objectContextId: MalCp006Wave02ObjectContextId;
  containerObject: MalCp006Wave02ContainerObject;
};

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (const ch of seed) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function titleCaseFirst(text: string): string {
  return text.length ? `${text[0].toUpperCase()}${text.slice(1)}` : text;
}

function replaceCaseAware(text: string, pattern: RegExp, replacement: string): string {
  return text.replace(pattern, (match) => /^[A-Z]/u.test(match) ? titleCaseFirst(replacement) : replacement);
}

function applyMaterialContext(
  text: string,
  context: (typeof MAL_CP006_WAVE02_OBJECT_CONTEXTS)[number],
): string {
  let value = text;
  value = replaceCaseAware(value, /\bpure milk\b/giu, context.primaryInitial);
  value = replaceCaseAware(value, /\bpure water\b/giu, context.secondaryInitial);
  value = replaceCaseAware(value, /\bmilk\b/giu, context.primary);
  value = replaceCaseAware(value, /\bwater\b/giu, context.secondary);
  return value;
}

function applyContainerObject(text: string, container: MalCp006Wave02ContainerObject): string {
  const plural = container === "vessel" ? "vessels" : container === "container" ? "containers" : "tanks";
  let value = replaceCaseAware(text, /\bvessels\b/giu, plural);
  value = replaceCaseAware(value, /\bvessel\b/giu, container);
  return value;
}

function applyObjects(
  q: MalCp006Wave02LearnerQuestion,
  seed: string,
): MalCp006Wave02FinalQuestionV4 {
  const h = hashSeed(`${seed}:wave02-object-pool-v4`);
  const context = MAL_CP006_WAVE02_OBJECT_CONTEXTS[h % MAL_CP006_WAVE02_OBJECT_CONTEXTS.length];
  const container = MAL_CP006_WAVE02_CONTAINER_OBJECTS[(h >>> 8) % MAL_CP006_WAVE02_CONTAINER_OBJECTS.length];
  const transform = (text: string) => applyContainerObject(applyMaterialContext(text, context), container);
  const stem = transform(q.stem);
  const options = q.options.map(transform);
  const answer = transform(q.answer);
  const explanation = q.explanation.map(transform);
  const commonMistake = transform(q.commonMistake);
  const errors = [...q.validation.errors];
  const learnerText = [stem, ...options, answer, ...explanation, commonMistake].join(" ");

  if (!stem.toLowerCase().includes(context.primary.toLowerCase())) errors.push("primary object missing from stem");
  if (!stem.toLowerCase().includes(context.secondary.toLowerCase())) errors.push("secondary object missing from stem");
  if (context.id !== "MILK_WATER" && /\bmilk\b/iu.test(learnerText)) errors.push("milk leaked outside milk-water context");
  if (context.secondary !== "water" && /\bwater\b/iu.test(learnerText)) errors.push("water leaked outside selected context");
  if (/litres of pure milk are kept/iu.test(learnerText)) errors.push("quantity-agreement regression");
  if (/\bpure (syrup|juice)\b/iu.test(learnerText)) errors.push("unnatural pure beverage wording");
  if (new Set(options).size !== 4 || options[q.correctIndex] !== answer) errors.push("object transformation changed option mapping");

  return {
    ...q,
    stem,
    options,
    answer,
    explanation,
    commonMistake,
    objectContextId: context.id,
    containerObject: container,
    validation: { ok: errors.length === 0, errors },
  };
}

export function generateMalCp006Wave02FinalAuthorityV4(
  id: MalCp006Wave02PrototypeId,
  seed: string,
): MalCp006Wave02FinalQuestionV4 {
  return applyObjects(generateMalCp006Wave02FinalAuthorityV3(id, seed), seed);
}
