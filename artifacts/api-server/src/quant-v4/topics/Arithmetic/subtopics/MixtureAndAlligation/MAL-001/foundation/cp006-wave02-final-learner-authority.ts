import { generateMalCp006Wave02LearnerAuthorityV2 } from "./cp006-wave02-learner-authority-v2";
import type { MalCp006Wave02LearnerQuestion } from "./cp006-wave02-inverse-learner";
import type { MalCp006Wave02PrototypeId } from "./cp006-source-fixtures-wave02";

export const MAL_CP006_WAVE02_FINAL_LEARNER_AUTHORITY_ID = "MAL-CP006-EN-WAVE02-FINAL-LEARNER-AUTHORITY-V1" as const;

function gcd(a: number, b: number): number {
  let x = a, y = b;
  while (y) { const r = x % y; x = y; y = r; }
  return x;
}

function calculationFirstInverse(q: MalCp006Wave02LearnerQuestion): MalCp006Wave02LearnerQuestion {
  const [v, x] = q.stateKey.split(":").map(Number);
  const g = gcd(v, x);
  const r1 = v / g, r2 = x / g;
  const waterReturned = (v * x) / (v + x);
  const milkReturned = x - waterReturned;
  const finalMilk = v - x + milkReturned;
  const explanation = [
    `Equal round-trip shortcut: final milk-to-water ratio in A = starting quantity in A : quantity transferred = ${v}:x.`,
    `${v}:x = ${r1}:${r2}, so x = ${v} × ${r2}/${r1} = ${x} litres.`,
    `Check: B then has ${x} litres of milk + ${v} litres of water = ${v + x} litres. In the ${x} litres returned, milk = ${milkReturned} litres and water = ${waterReturned} litres.`,
    `A finally has milk = ${v} − ${x} + ${milkReturned} = ${finalMilk} litres and water = ${waterReturned} litres, giving ${r1}:${r2}.`,
  ];
  const errors = [...q.validation.errors];
  if (![waterReturned, milkReturned, finalMilk].every(Number.isInteger)) errors.push("inverse visible arithmetic is not whole-number friendly");
  return { ...q, explanation, validation: { ok: errors.length === 0, errors } };
}

export function generateMalCp006Wave02FinalLearnerAuthority(id: MalCp006Wave02PrototypeId, seed: string): MalCp006Wave02LearnerQuestion {
  let q = generateMalCp006Wave02LearnerAuthorityV2(id, seed);
  if (id === "MAL-CP006-PROT-INVERSE-TRANSFER-RETURN-TARGET-RATIO") q = calculationFirstInverse(q);
  const text = [q.stem, ...q.options, ...q.explanation, q.commonMistake].join(" ");
  const errors = [...q.validation.errors];
  if (text.includes("x²") || text.includes("state key") || text.includes("component load")) errors.push("technical learner text leaked");
  if (q.explanation.length !== 4) errors.push("explanation must have four lines");
  if (q.options[q.correctIndex] !== q.answer) errors.push("answer-option mapping failed");
  return { ...q, validation: { ok: errors.length === 0, errors } };
}
