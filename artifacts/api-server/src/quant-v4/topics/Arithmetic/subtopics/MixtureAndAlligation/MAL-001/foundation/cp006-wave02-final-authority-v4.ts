import { generateMalCp006Wave02FinalAuthorityV3 } from "./cp006-wave02-final-authority-v3";
import type { MalCp006Wave02LearnerQuestion } from "./cp006-wave02-inverse-learner";
import type { MalCp006Wave02PrototypeId } from "./cp006-source-fixtures-wave02";

export const MAL_CP006_WAVE02_FINAL_AUTHORITY_V4_ID =
  "MAL-CP006-EN-WAVE02-FINAL-LEARNER-AUTHORITY-V4" as const;

export const MAL_CP006_WAVE02_CONTAINER_OBJECTS = ["vessel", "container", "tank", "drum"] as const;

export { MAL_CP006_WAVE02_OBJECT_CONTEXTS } from "./cp006-object-contexts";
import { MAL_CP006_WAVE02_OBJECT_CONTEXTS } from "./cp006-object-contexts";

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
