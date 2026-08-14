import { generateMalCp006Wave02FinalAuthorityV2 } from "./cp006-wave02-final-authority-v2";
import type { MalCp006Wave02LearnerQuestion } from "./cp006-wave02-inverse-learner";
import type { MalCp006Wave02PrototypeId } from "./cp006-source-fixtures-wave02";

export const MAL_CP006_WAVE02_FINAL_AUTHORITY_V3_ID =
  "MAL-CP006-EN-WAVE02-FINAL-LEARNER-AUTHORITY-V3" as const;

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (const ch of seed) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const r = x % y;
    x = y;
    y = r;
  }
  return x || 1;
}

function inverseStem(q: MalCp006Wave02LearnerQuestion, seed: string): MalCp006Wave02LearnerQuestion {
  const [volume, transfer] = q.stateKey.split(":").map(Number);
  const g = gcd(volume, transfer);
  const milkPart = volume / g;
  const waterPart = transfer / g;
  const shape = hashSeed(`${seed}:inverse-stem-v3`) % 8;
  const stems = [
    `Vessel A contains ${volume} litres of pure milk, while vessel B contains ${volume} litres of pure water. Some milk is transferred from A to B. After B is mixed thoroughly, the same quantity is transferred back to A. The final milk-to-water ratio in A is ${milkPart}:${waterPart}. How many litres were transferred each time?`,
    `Two vessels, A and B, initially contain equal quantities of liquid: A has ${volume} litres of pure milk and B has ${volume} litres of pure water. An equal quantity is moved first from A to B and then, after mixing, from B back to A. If A finally has milk and water in the ratio ${milkPart}:${waterPart}, what was the quantity moved on each occasion?`,
    `After a transfer-and-return operation, vessel A has milk and water in the ratio ${milkPart}:${waterPart}. Initially, A contained ${volume} litres of pure milk and B contained ${volume} litres of pure water. The same quantity was transferred from A to B and then from the mixed liquid in B back to A. What was that quantity?`,
    `A and B start with ${volume} litres each, A containing only milk and B containing only water. Let the common quantity transferred in both steps be x litres: first A to B, then the well-mixed liquid in B back to A. If A ends with a milk-to-water ratio of ${milkPart}:${waterPart}, what is x?`,
    `Vessel A starts with ${volume} litres of pure milk and vessel B with ${volume} litres of pure water. First, some milk from A is poured into B. B is mixed well, and exactly the same volume is then poured back into A. A finally contains milk and water in the ratio ${milkPart}:${waterPart}. What volume was poured each time?`,
    `The quantity transferred from A to B is the same as the quantity later returned from B to A. Before these transfers, A contains ${volume} litres of pure milk and B contains ${volume} litres of pure water. After the return, the milk-to-water ratio in A is ${milkPart}:${waterPart}. How many litres were involved in each transfer?`,
    `A contains ${volume} litres of pure milk and B contains an equal volume of pure water. A certain volume is sent from A to B. Once B is mixed uniformly, that same volume is sent back to A. If the final ratio of milk to water in A is ${milkPart}:${waterPart}, what is the transferred volume?`,
    `Initially, vessel A has only ${volume} litres of milk and vessel B has only ${volume} litres of water. A transfer is made from A to B, followed by an equal-volume return from the mixed contents of B to A. The resulting milk-to-water ratio in A is ${milkPart}:${waterPart}. What is the volume of each transfer?`,
  ] as const;
  return { ...q, stem: stems[shape], stemShape: shape };
}

function chainStem(q: MalCp006Wave02LearnerQuestion, seed: string): MalCp006Wave02LearnerQuestion {
  const [waterB, firstFactor, secondFactor, x] = q.stateKey.split(":").map(Number);
  const firstTransfer = firstFactor * x;
  const g = gcd(waterB, firstTransfer);
  const waterPart = waterB / g;
  const milkPart = firstTransfer / g;
  const shape = hashSeed(`${seed}:chain-stem-v3`) % 8;
  const stems = [
    `Vessel B initially contains ${waterB} litres of pure water and vessel C is empty. Vessel A sends ${firstFactor}x litres of pure milk to B. After B is mixed thoroughly, ${secondFactor}x litres of the mixture is transferred from B to C. If the water-to-milk ratio in C is ${waterPart}:${milkPart}, how many litres of milk remain in B?`,
    `A contains pure milk, B contains ${waterB} litres of pure water, and C is empty. First, A transfers ${firstFactor}x litres of milk to B. Next, after mixing B well, ${secondFactor}x litres of B's contents is transferred to C. C finally has water and milk in the ratio ${waterPart}:${milkPart}. How much milk is left in B?`,
    `The final water-to-milk ratio in vessel C is ${waterPart}:${milkPart}. To obtain this mixture, B started with ${waterB} litres of pure water, received ${firstFactor}x litres of pure milk from A, and then sent ${secondFactor}x litres of its well-mixed contents to the initially empty vessel C. How much milk remains in B?`,
    `Initially, B has ${waterB} litres of water and C is empty. In step 1, vessel A supplies ${firstFactor}x litres of pure milk to B. In step 2, B is mixed and then supplies ${secondFactor}x litres of the mixture to C. Given that C has water and milk in the ratio ${waterPart}:${milkPart}, how many litres of milk remain in B?`,
    `Three vessels are used. A contains pure milk; B contains ${waterB} litres of pure water; C is empty. A quantity of ${firstFactor}x litres is transferred from A to B, and after thorough mixing, ${secondFactor}x litres is transferred from B to C. If C's water-to-milk ratio is ${waterPart}:${milkPart}, what quantity of milk is still present in B?`,
    `Vessel C receives ${secondFactor}x litres from B and ends with water and milk in the ratio ${waterPart}:${milkPart}. Before that transfer, B had been formed by adding ${firstFactor}x litres of pure milk from A to ${waterB} litres of pure water. After the transfer to C, how many litres of milk are left in B?`,
    `B starts with ${waterB} litres of pure water. A adds ${firstFactor}x litres of pure milk to B. The contents of B are mixed, after which B sends ${secondFactor}x litres to empty vessel C. The mixture received by C has water and milk in the ratio ${waterPart}:${milkPart}. How many litres of milk remain in B?`,
    `A first transfers ${firstFactor}x litres of pure milk into B, which initially contains ${waterB} litres of pure water. B is then mixed uniformly and ${secondFactor}x litres is transferred to empty vessel C. Knowing that the water-to-milk ratio in C is ${waterPart}:${milkPart}, how much milk remains in B after both transfers?`,
  ] as const;
  return { ...q, stem: stems[shape], stemShape: shape };
}

export function generateMalCp006Wave02FinalAuthorityV3(
  id: MalCp006Wave02PrototypeId,
  seed: string,
): MalCp006Wave02LearnerQuestion {
  let q = generateMalCp006Wave02FinalAuthorityV2(id, seed);
  q = id.includes("CHANGED-SOURCE-CHAIN")
    ? chainStem(q, seed)
    : inverseStem(q, seed);

  const errors = [...q.validation.errors];
  const learnerText = [q.stem, ...q.options, ...q.explanation, q.commonMistake].join(" ");
  if (!q.stem.endsWith("?")) errors.push("stem is not interrogative");
  if (/litres of pure milk are kept/iu.test(learnerText)) errors.push("quantity agreement regression");
  if (/litres of pure milk is kept/iu.test(learnerText)) errors.push("awkward kept construction retained");
  if (learnerText.includes("→")) errors.push("arrow shorthand");
  if (learnerText.includes("component load") || learnerText.includes("state key")) errors.push("internal terminology");
  if (new Set(q.options).size !== 4 || q.options[q.correctIndex] !== q.answer) errors.push("option mapping");
  if (q.permanentQlId !== null || q.permanentSolveModeId !== null || q.active || q.publiclyPublishable || q.questionStudioDiscoverable || q.questionBankWritable || q.testEligible) errors.push("lifecycle");
  return { ...q, validation: { ok: errors.length === 0, errors } };
}
