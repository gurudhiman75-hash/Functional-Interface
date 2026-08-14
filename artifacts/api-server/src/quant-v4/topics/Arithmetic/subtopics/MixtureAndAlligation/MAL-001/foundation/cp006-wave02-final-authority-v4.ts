import { generateMalCp006Wave02FinalAuthorityV3 } from "./cp006-wave02-final-authority-v3";
import type { MalCp006Wave02LearnerQuestion } from "./cp006-wave02-inverse-learner";
import type { MalCp006Wave02PrototypeId } from "./cp006-source-fixtures-wave02";

export const MAL_CP006_WAVE02_FINAL_AUTHORITY_V4_ID =
  "MAL-CP006-EN-WAVE02-FINAL-LEARNER-AUTHORITY-V4" as const;

export const MAL_CP006_WAVE02_CONTAINER_OBJECTS = ["vessel", "container", "tank", "drum"] as const;

export const MAL_CP006_WAVE02_OBJECT_CONTEXTS = [
  { id: "MILK_WATER", primaryId: "milk", secondaryId: "water", primary: "milk", secondary: "water", primaryInitial: "pure milk", secondaryInitial: "pure water", containers: ["vessel", "container", "tank"] },
  { id: "SPIRIT_WATER", primaryId: "spirit", secondaryId: "water", primary: "spirit", secondary: "water", primaryInitial: "spirit", secondaryInitial: "pure water", containers: ["vessel", "container", "tank"] },
  { id: "ALCOHOL_WATER", primaryId: "alcohol", secondaryId: "water", primary: "alcohol", secondary: "water", primaryInitial: "alcohol", secondaryInitial: "pure water", containers: ["vessel", "container", "tank"] },
  { id: "WINE_WATER", primaryId: "wine", secondaryId: "water", primary: "wine", secondary: "water", primaryInitial: "wine", secondaryInitial: "pure water", containers: ["vessel", "container", "tank"] },
  { id: "ACID_WATER", primaryId: "acid", secondaryId: "water", primary: "acid", secondary: "water", primaryInitial: "acid", secondaryInitial: "pure water", containers: ["vessel", "container", "tank"] },
  { id: "SYRUP_WATER", primaryId: "syrup", secondaryId: "water", primary: "syrup", secondary: "water", primaryInitial: "syrup", secondaryInitial: "pure water", containers: ["vessel", "container", "tank"] },
  { id: "JUICE_WATER", primaryId: "juice", secondaryId: "water", primary: "juice", secondary: "water", primaryInitial: "juice", secondaryInitial: "pure water", containers: ["vessel", "container", "tank"] },
  { id: "HONEY_WATER", primaryId: "honey", secondaryId: "water", primary: "honey", secondary: "water", primaryInitial: "honey", secondaryInitial: "pure water", containers: ["vessel", "container", "tank"] },
  { id: "VINEGAR_WATER", primaryId: "vinegar", secondaryId: "water", primary: "vinegar", secondary: "water", primaryInitial: "vinegar", secondaryInitial: "pure water", containers: ["vessel", "container", "tank"] },
  { id: "GLYCERIN_WATER", primaryId: "glycerin", secondaryId: "water", primary: "glycerin", secondary: "water", primaryInitial: "glycerin", secondaryInitial: "pure water", containers: ["vessel", "container", "tank"] },
  { id: "PETROL_KEROSENE", primaryId: "petrol", secondaryId: "kerosene", primary: "petrol", secondary: "kerosene", primaryInitial: "petrol", secondaryInitial: "kerosene", containers: ["tank", "drum", "container"] },
  { id: "DIESEL_KEROSENE", primaryId: "diesel", secondaryId: "kerosene", primary: "diesel", secondary: "kerosene", primaryInitial: "diesel", secondaryInitial: "kerosene", containers: ["tank", "drum", "container"] },
  { id: "PETROL_DIESEL", primaryId: "petrol", secondaryId: "diesel", primary: "petrol", secondary: "diesel", primaryInitial: "petrol", secondaryInitial: "diesel", containers: ["tank", "drum", "container"] },
  { id: "MUSTARD_COCONUT_OIL", primaryId: "mustard_oil", secondaryId: "coconut_oil", primary: "mustard oil", secondary: "coconut oil", primaryInitial: "mustard oil", secondaryInitial: "coconut oil", containers: ["container", "tank", "drum"] },
  { id: "OLIVE_SUNFLOWER_OIL", primaryId: "olive_oil", secondaryId: "sunflower_oil", primary: "olive oil", secondary: "sunflower oil", primaryInitial: "olive oil", secondaryInitial: "sunflower oil", containers: ["container", "tank", "drum"] },
  { id: "SOYABEAN_MUSTARD_OIL", primaryId: "soyabean_oil", secondaryId: "mustard_oil", primary: "soyabean oil", secondary: "mustard oil", primaryInitial: "soyabean oil", secondaryInitial: "mustard oil", containers: ["container", "tank", "drum"] },
] as const;

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

function polishArticles(text: string): string {
  return text.replace(/\ba ([aeiou])/gu, (_match, vowel: string) => `an ${vowel}`);
}

function polishQuantityAgreement(text: string): string {
  const bareAmount = "((?:[0-9]+(?:\\.[0-9]+)?(?:\\s+[0-9]+\\/[0-9]+)?|[0-9]*x))";
  const amount = `(${bareAmount.slice(1, -1)} litres)`;
  return text
    .replace(
      new RegExp(`\\b${bareAmount} litre (?=(?:sample|portion|batch|mixture|solution|transfer|return|amount|quantity|container|vessel|tank|drum)\\b)`, "giu"),
      "$1-litre ",
    )
    .replace(
      new RegExp(`\\b${bareAmount} litre\\b`, "giu"),
      (_match, numericAmount: string) =>
        `${numericAmount} ${numericAmount === "1" ? "litre" : "litres"}`,
    )
    .replace(
      new RegExp(`${amount} of ([^,.;?]+) is (transferred|sent|moved|poured|added|returned|removed)`, "giu"),
      "$1 of $2 are $3",
    )
    .replace(
      new RegExp(`${amount} is (transferred|sent|moved|poured|added|returned|removed)`, "giu"),
      "$1 are $2",
    );
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
  return polishArticles(value);
}

function applyContainerObject(text: string, container: MalCp006Wave02ContainerObject): string {
  const plural = container === "vessel"
    ? "vessels"
    : container === "container"
      ? "containers"
      : container === "tank"
        ? "tanks"
        : "drums";
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
  const container = context.containers[(h >>> 8) % context.containers.length] as MalCp006Wave02ContainerObject;
  const transform = (text: string) =>
    polishQuantityAgreement(
      applyContainerObject(applyMaterialContext(text, context), container),
    );
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
  if (/\b(?:[0-9]+(?:\.\d+)?(?:\s+[0-9]+\/[0-9]+)?|[0-9]*x) litres(?: of [^,.;?]+)? is (?:transferred|sent|moved|poured|added|returned|removed)/iu.test(learnerText)) errors.push("plural-transfer agreement regression");
  if (/\b(?:[2-9]|\d{2,})(?:\.\d+)?(?:\s+\d+\/\d+)? litre\b/iu.test(learnerText)) errors.push("plural-litre regression");
  if (/\bpure (syrup|juice|honey|wine|vinegar)\b/iu.test(learnerText)) errors.push("unnatural pure-liquid wording");
  if (/\ba [aeiou]/u.test(learnerText)) errors.push("indefinite-article regression");
  if (/\bAn (and|ends|contains|starts|has|first|finally)\b/u.test(learnerText)) errors.push("vessel-A label corrupted by article polish");
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
