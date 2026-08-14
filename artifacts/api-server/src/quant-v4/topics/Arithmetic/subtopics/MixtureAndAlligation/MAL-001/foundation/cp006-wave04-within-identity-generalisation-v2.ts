import {
  generateMalCp006Wave04Generalisation,
  malCp006Wave04InverseStateSummary,
  type MalCp006Wave04Question,
  type MalCp006Wave04VariantId,
} from "./cp006-wave04-within-identity-generalisation";
import { MAL_CP006_WAVE02_OBJECT_CONTEXTS } from "./cp006-wave02-final-authority-v4";

export const MAL_CP006_WAVE04_FINAL_GENERALISATION_ID =
  "MAL-CP006-WAVE04-WITHIN-IDENTITY-GENERALISATION-V2" as const;

function polishStem(text: string): string {
  return text
    .replace(/\b(\d+) litres is transferred from A to B\b/gu, "A transfers $1 litres to B")
    .replace(/\b(\d+) litres is transferred from B to A\b/gu, "B transfers $1 litres to A")
    .replace(/\bx litres is returned to A\b/gu, "B returns x litres to A")
    .replace(/\bAfter (\d+) litres moves from A to B\b/gu, "After A transfers $1 litres to B")
    .replace(/\bFrom B's new mixture, (\d+) litres goes to A\b/gu, "B then sends $1 litres of its new mixture to A")
    .replace(/\bFrom A's new mixture, (\d+) litres then goes to B\b/gu, "A then sends $1 litres of its new mixture to B")
    .replace(/, (\d+) litres is first poured into B from A\./gu, ". A first pours $1 litres into B.")
    .replace(/\b(\d+) litres is sent back to B\b/gu, "A sends $1 litres back to B");
}

function xTerm(coefficient: number): string {
  if (coefficient === 1) return "x";
  return `${coefficient}x`;
}

function inverseExplanation(q: MalCp006Wave04Question): string[] {
  const [volume, firstTransfer, returnTransfer] = q.stateKey.split(":").map(Number);
  const state = [volume, firstTransfer, returnTransfer] as const;
  const s = malCp006Wave04InverseStateSummary(state as never);
  const context = MAL_CP006_WAVE02_OBJECT_CONTEXTS.find((x) => x.id === q.objectContextId)!;
  const ratio = `${s.ratioPrimary}:${s.ratioSecondary}`;
  const primaryX = xTerm(s.primaryPart);
  const secondaryX = xTerm(s.secondaryPart);
  const scaledPrimary = s.denominator * s.basePrimary;
  const leftConstant = s.ratioSecondary * scaledPrimary;
  const leftX = s.ratioSecondary * s.primaryPart;
  const rightX = s.ratioPrimary * s.secondaryPart;
  const netX = rightX - leftX;

  return [
    `After A transfers ${s.firstTransfer} litres, B contains ${s.firstTransfer} litres of ${context.primary} and ${s.volume} litres of ${context.secondary}, total ${s.volume + s.firstTransfer} litres.`,
    `So an x-litre return from B contains (${s.primaryPart}/${s.denominator})x litres of ${context.primary} and (${s.secondaryPart}/${s.denominator})x litres of ${context.secondary}.`,
    `A's final ratio is (${s.basePrimary} + ${s.primaryPart}/${s.denominator}x) : (${s.secondaryPart}/${s.denominator}x) = ${ratio}. Multiplying both parts by ${s.denominator} gives (${scaledPrimary} + ${primaryX}) : ${secondaryX} = ${ratio}.`,
    `${s.ratioSecondary}(${scaledPrimary} + ${primaryX}) = ${rightX}x, so ${leftConstant} + ${leftX}x = ${rightX}x and ${leftConstant} = ${netX}x. Therefore x = ${s.returnTransfer} litres.`,
  ];
}

function finalise(q: MalCp006Wave04Question): MalCp006Wave04Question {
  const stem = polishStem(q.stem);
  const explanation = q.variantId === "ASYMMETRIC_INVERSE_RETURN"
    ? inverseExplanation(q)
    : q.explanation;
  const errors = [...q.validation.errors];
  const learnerText = [stem, ...q.options, ...explanation, q.commonMistake].join(" ");

  if (/\b\d+ litres is\b/iu.test(learnerText)) errors.push("quantity-plus-is grammar regression");
  if (/\b\d+ litres goes\b/iu.test(learnerText)) errors.push("litres-goes grammar regression");
  if (/\b1x\b/u.test(learnerText)) errors.push("1x arithmetic notation regression");
  if (/Solving this linear equation gives/iu.test(learnerText)) errors.push("inverse explanation still skips visible solving");
  if (!stem.endsWith("?")) errors.push("stem is not interrogative");
  if (explanation.length !== 4) errors.push("explanation length changed");
  if (new Set(q.options).size !== 4 || q.options[q.correctIndex] !== q.answer) errors.push("option mapping changed");

  return {
    ...q,
    generalisationId: q.generalisationId,
    stem,
    explanation,
    validation: { ok: errors.length === 0, errors },
  };
}

export function generateMalCp006Wave04FinalGeneralisation(
  variantId: MalCp006Wave04VariantId,
  seed: string,
): MalCp006Wave04Question {
  return finalise(generateMalCp006Wave04Generalisation(variantId, seed));
}
