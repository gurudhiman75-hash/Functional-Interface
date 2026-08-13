import { generateMalCp006Wave02LearnerAuthority } from "./cp006-wave02-learner-authority";
import type { MalCp006Wave02LearnerQuestion } from "./cp006-wave02-inverse-learner";
import type { MalCp006Wave02PrototypeId } from "./cp006-source-fixtures-wave02";

export const MAL_CP006_WAVE02_LEARNER_AUTHORITY_V2_ID = "MAL-CP006-EN-WAVE02-LEARNER-AUTHORITY-V2" as const;

function gcd(a: number, b: number): number {
  let x = a, y = b;
  while (y) { const r = x % y; x = y; y = r; }
  return x;
}

function hardenInverse(q: MalCp006Wave02LearnerQuestion): MalCp006Wave02LearnerQuestion {
  const [v, x] = q.stateKey.split(":").map(Number);
  const oldImpossible = (v * x) / (v - x);
  const share = (v * x) / (v + x);
  const replacement = v - share;
  const options = q.options.map((o) => o === `${oldImpossible} litres` ? `${replacement} litres` : o);
  const g = gcd(v, x);
  const explanation = [
    `Let the transferred quantity be x litres. After the first transfer, A has ${v} − x litres of milk, while B has x litres of milk and ${v} litres of water.`,
    `The x litres sent back from B contain milk = x × x/(${v} + x) and water = x × ${v}/(${v} + x).`,
    `Final milk : water in A = [${v} − x + x²/(${v} + x)] : [${v}x/(${v} + x)] = ${v}:x.`,
    `${v}:x = ${v / g}:${x / g}, so x = ${x} litres.`,
  ];
  const errors = [...q.validation.errors];
  if (new Set(options).size !== 4) errors.push("hardened inverse options collapsed");
  if (options.some((o) => Number(o.split(" ")[0]) >= v)) errors.push("inverse option is physically impossible");
  return { ...q, options, explanation, validation: { ok: errors.length === 0, errors } };
}

export function generateMalCp006Wave02LearnerAuthorityV2(id: MalCp006Wave02PrototypeId, seed: string): MalCp006Wave02LearnerQuestion {
  let q = generateMalCp006Wave02LearnerAuthority(id, seed);
  if (id === "MAL-CP006-PROT-INVERSE-TRANSFER-RETURN-TARGET-RATIO") q = hardenInverse(q);
  const explanation = q.explanation.map((line) => line.replace("x litres returned from B contains", "x litres returned from B contain"));
  const errors = [...q.validation.errors];
  if (explanation.some((line) => line.includes("litres returned from B contains"))) errors.push("plural grammar regression");
  if (q.options[q.correctIndex] !== q.answer) errors.push("answer-option mapping failed");
  return { ...q, explanation, validation: { ok: errors.length === 0, errors } };
}
