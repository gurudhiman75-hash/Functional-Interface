import { getMalCp006Vessel, malCp006ComponentB, solveMalCp006Ledger } from "./cp006-solver";
import { rational, reduceRationalRatio } from "./rational";
import {
  MAL_CP006_WAVE02_OBJECT_CONTEXTS,
  type MalCp006Wave02ContainerObject,
  type MalCp006Wave02ObjectContextId,
} from "./cp006-wave02-final-authority-v4";

export const MAL_CP006_WAVE04_GENERALISATION_ID =
  "MAL-CP006-WAVE04-WITHIN-IDENTITY-GENERALISATION-V1" as const;

export const MAL_CP006_WAVE04_VARIANT_IDS = [
  "ASYMMETRIC_INVERSE_RETURN",
  "THREE_LEG_ALTERNATING_FORWARD",
] as const;

export type MalCp006Wave04VariantId =
  (typeof MAL_CP006_WAVE04_VARIANT_IDS)[number];

export type MalCp006Wave04ExistingPrototypeId =
  | "MAL-CP006-PROT-INVERSE-TRANSFER-RETURN-TARGET-RATIO"
  | "MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO";

export interface MalCp006Wave04Question {
  prototypeId: MalCp006Wave04ExistingPrototypeId;
  variantId: MalCp006Wave04VariantId;
  generalisationId: typeof MAL_CP006_WAVE04_GENERALISATION_ID;
  seed: string;
  stemShape: number;
  stateKey: string;
  objectContextId: MalCp006Wave02ObjectContextId;
  containerObject: MalCp006Wave02ContainerObject;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  explanation: string[];
  commonMistake: string;
  sourceEvidenceIds: readonly string[];
  validation: { ok: boolean; errors: string[] };
  permanentQlId: null;
  permanentSolveModeId: null;
  active: false;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
}

// [initial amount in each vessel, known first transfer, unknown return]
export const MAL_CP006_WAVE04_INVERSE_STATES = [
  [40, 10, 15],
  [60, 15, 25],
  [60, 15, 35],
  [60, 15, 50],
  [60, 15, 55],
  [80, 20, 25],
  [80, 20, 30],
  [80, 20, 75],
  [90, 10, 40],
  [90, 15, 35],
  [90, 15, 70],
  [90, 30, 20],
  [90, 30, 40],
  [90, 30, 80],
  [100, 25, 45],
  [120, 20, 35],
] as const;

// [initial amount in each vessel, A-to-B, B-to-A, final A-to-B]
// The [40,20,30,25] state is the half-current-source CAT-2022 topology:
// 20 is half of A, 30 is half of current B, and 25 is half of current A.
export const MAL_CP006_WAVE04_FORWARD_STATES = [
  [40, 10, 10, 10],
  [40, 10, 10, 20],
  [40, 10, 15, 15],
  [40, 20, 30, 25],
  [50, 25, 15, 20],
  [60, 15, 15, 10],
  [60, 15, 25, 35],
  [60, 20, 20, 20],
  [60, 30, 45, 35],
  [80, 20, 30, 30],
  [80, 40, 60, 50],
  [90, 30, 40, 50],
  [90, 45, 15, 30],
  [100, 25, 45, 40],
  [120, 30, 50, 70],
  [120, 45, 55, 65],
] as const;

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

function ratioPair(a: number, b: number): readonly [number, number] {
  const g = gcd(a, b);
  return [a / g, b / g] as const;
}

function ratioText(a: number, b: number): string {
  const [x, y] = ratioPair(a, b);
  return `${x} : ${y}`;
}

function rotate<T>(items: readonly T[], by: number): T[] {
  const k = by % items.length;
  return [...items.slice(k), ...items.slice(0, k)];
}

function titleCaseFirst(text: string): string {
  return text.length ? `${text[0]!.toUpperCase()}${text.slice(1)}` : text;
}

function pluralContainer(container: MalCp006Wave02ContainerObject): string {
  if (container === "vessel") return "vessels";
  if (container === "container") return "containers";
  if (container === "tank") return "tanks";
  return "drums";
}

function chooseContext(seed: string) {
  const h = hashSeed(`${seed}:wave04-context`);
  const context = MAL_CP006_WAVE02_OBJECT_CONTEXTS[
    h % MAL_CP006_WAVE02_OBJECT_CONTEXTS.length
  ]!;
  const container = context.containers[
    (h >>> 8) % context.containers.length
  ] as MalCp006Wave02ContainerObject;
  return { context, container, h };
}

export function malCp006Wave04InverseStateSummary(
  state: (typeof MAL_CP006_WAVE04_INVERSE_STATES)[number],
) {
  const [volume, firstTransfer, returnTransfer] = state;
  const fractionGcd = gcd(firstTransfer, volume);
  const primaryPart = firstTransfer / fractionGcd;
  const secondaryPart = volume / fractionGcd;
  const denominator = (volume + firstTransfer) / fractionGcd;
  const basePrimary = volume - firstTransfer;
  const finalPrimaryScaled = denominator * basePrimary + primaryPart * returnTransfer;
  const finalSecondaryScaled = secondaryPart * returnTransfer;
  const [ratioPrimary, ratioSecondary] = ratioPair(
    finalPrimaryScaled,
    finalSecondaryScaled,
  );
  return {
    volume,
    firstTransfer,
    returnTransfer,
    primaryPart,
    secondaryPart,
    denominator,
    basePrimary,
    ratioPrimary,
    ratioSecondary,
  };
}

export function malCp006Wave04ForwardStateSummary(
  state: (typeof MAL_CP006_WAVE04_FORWARD_STATES)[number],
) {
  const [volume, firstTransfer, returnTransfer, finalTransfer] = state;
  const primaryReturned = (returnTransfer * firstTransfer) / (volume + firstTransfer);
  const secondaryReturned = returnTransfer - primaryReturned;
  const primaryA2 = volume - firstTransfer + primaryReturned;
  const secondaryA2 = secondaryReturned;
  const volumeA2 = volume - firstTransfer + returnTransfer;
  const primaryFinalMove = (finalTransfer * primaryA2) / volumeA2;
  const secondaryFinalMove = finalTransfer - primaryFinalMove;
  const primaryB2 = firstTransfer - primaryReturned;
  const secondaryB2 = volume - secondaryReturned;
  const finalPrimaryB = primaryB2 + primaryFinalMove;
  const finalSecondaryB = secondaryB2 + secondaryFinalMove;
  return {
    volume,
    firstTransfer,
    returnTransfer,
    finalTransfer,
    primaryReturned,
    secondaryReturned,
    primaryA2,
    secondaryA2,
    volumeA2,
    primaryFinalMove,
    secondaryFinalMove,
    primaryB2,
    secondaryB2,
    finalPrimaryB,
    finalSecondaryB,
  };
}

function lifecycleErrors(q: Omit<MalCp006Wave04Question, "validation">): string[] {
  const errors: string[] = [];
  if (!q.stem.endsWith("?")) errors.push("stem is not interrogative");
  if (q.explanation.length !== 4) errors.push("explanation must have four calculation-first lines");
  if (new Set(q.options).size !== 4 || q.options[q.correctIndex] !== q.answer) {
    errors.push("option mapping failed");
  }
  const learnerText = [q.stem, ...q.options, ...q.explanation, q.commonMistake].join(" ");
  if (/component load|state key|current fraction|global component/iu.test(learnerText)) {
    errors.push("internal terminology leaked");
  }
  if (learnerText.includes("→")) errors.push("arrow shorthand leaked");
  if (/litres of pure milk (?:is|are) kept/iu.test(learnerText)) {
    errors.push("awkward quantity wording returned");
  }
  if (/\ba [aeiou]/u.test(learnerText)) errors.push("indefinite article regression");
  if (
    q.permanentQlId !== null ||
    q.permanentSolveModeId !== null ||
    q.active ||
    q.publiclyPublishable ||
    q.questionStudioDiscoverable ||
    q.questionBankWritable ||
    q.testEligible
  ) {
    errors.push("lifecycle escaped discovery lock");
  }
  return errors;
}

export function generateMalCp006Wave04AsymmetricInverse(
  seed: string,
): MalCp006Wave04Question {
  const { context, container, h } = chooseContext(`${seed}:inverse`);
  const state = MAL_CP006_WAVE04_INVERSE_STATES[
    (h >>> 12) % MAL_CP006_WAVE04_INVERSE_STATES.length
  ]!;
  const s = malCp006Wave04InverseStateSummary(state);
  const shape = (h >>> 20) % 8;
  const singular = titleCaseFirst(container);
  const plural = pluralContainer(container);
  const ratio = `${s.ratioPrimary}:${s.ratioSecondary}`;

  const stems = [
    `${singular} A contains ${s.volume} litres of ${context.primaryInitial}, while ${container} B contains ${s.volume} litres of ${context.secondaryInitial}. First, ${s.firstTransfer} litres is transferred from A to B. After B is mixed thoroughly, an unknown quantity is transferred back to A. If the final ratio of ${context.primary} to ${context.secondary} in A is ${ratio}, how many litres are transferred back?`,
    `Two ${plural}, A and B, start with ${s.volume} litres each: A contains ${context.primaryInitial} and B contains ${context.secondaryInitial}. A sends ${s.firstTransfer} litres to B. B is mixed, and then x litres is returned to A. A finally has ${context.primary} and ${context.secondary} in the ratio ${ratio}. What is x?`,
    `After the return transfer, the ratio of ${context.primary} to ${context.secondary} in A is ${ratio}. Initially A had ${s.volume} litres of ${context.primaryInitial} and B had ${s.volume} litres of ${context.secondaryInitial}. A first transferred ${s.firstTransfer} litres to B; after mixing B, some of its mixture was sent back to A. What quantity was sent back?`,
    `${singular} A begins with ${s.volume} litres of ${context.primaryInitial} and ${container} B with ${s.volume} litres of ${context.secondaryInitial}. Step 1 transfers ${s.firstTransfer} litres from A to B. Step 2 returns x litres of the well-mixed contents of B to A. If A ends in the ratio ${ratio} of ${context.primary} to ${context.secondary}, what is x?`,
    `A contains only ${context.primaryInitial} and B contains only ${context.secondaryInitial}, ${s.volume} litres in each ${container}. A known ${s.firstTransfer} litres is first moved from A into B. Once B is mixed uniformly, a different quantity is moved back. The final ratio in A is ${ratio}. How many litres came back from B?`,
    `The first transfer is ${s.firstTransfer} litres from A to B, but the return quantity is not the same. Before the transfers, A contains ${s.volume} litres of ${context.primaryInitial} and B contains ${s.volume} litres of ${context.secondaryInitial}. After B is mixed and some mixture is returned, A has ${context.primary}:${context.secondary} = ${ratio}. What is the return quantity?`,
    `Initially, ${singular} A has ${s.volume} litres of ${context.primaryInitial}; ${container} B has ${s.volume} litres of ${context.secondaryInitial}. After ${s.firstTransfer} litres moves from A to B, B is mixed well. How many litres must then be transferred from B back to A so that A finishes with ${context.primary} and ${context.secondary} in the ratio ${ratio}?`,
    `A starts with ${s.volume} litres of ${context.primaryInitial} and B with the same quantity of ${context.secondaryInitial}. ${s.firstTransfer} litres is transferred from A to B. A different amount is then returned from the mixed contents of B. Given A's final ${context.primary}-to-${context.secondary} ratio of ${ratio}, what is the amount returned?`,
  ] as const;

  const rawOptions = [
    { value: s.returnTransfer, id: "CORRECT" },
    { value: s.firstTransfer, id: "ASSUMES_EQUAL_OUT_AND_BACK" },
    { value: s.volume - s.firstTransfer, id: "REPORTS_PRIMARY_LEFT_AFTER_FIRST_TRANSFER" },
    { value: s.volume + s.firstTransfer - s.returnTransfer, id: "REPORTS_MIXTURE_LEFT_IN_B" },
  ];
  const ordered = rotate(rawOptions, (h >>> 5) % 4);
  const options = ordered.map((item) => `${item.value} litres`);
  const correctIndex = ordered.findIndex((item) => item.id === "CORRECT");
  const answer = `${s.returnTransfer} litres`;

  const proof = solveMalCp006Ledger(
    [
      { id: "A", volume: rational(s.volume), componentA: rational(s.volume) },
      { id: "B", volume: rational(s.volume), componentA: rational(0) },
    ],
    [
      { kind: "TRANSFER", from: "A", to: "B", amount: rational(s.firstTransfer) },
      { kind: "TRANSFER", from: "B", to: "A", amount: rational(s.returnTransfer) },
    ],
  );
  const finalA = getMalCp006Vessel(proof, "A");
  const [provedPrimary, provedSecondary] = reduceRationalRatio(
    finalA.componentA,
    malCp006ComponentB(finalA),
  );

  const base = {
    prototypeId: "MAL-CP006-PROT-INVERSE-TRANSFER-RETURN-TARGET-RATIO" as const,
    variantId: "ASYMMETRIC_INVERSE_RETURN" as const,
    generalisationId: MAL_CP006_WAVE04_GENERALISATION_ID,
    seed,
    stemShape: shape,
    stateKey: `${s.volume}:${s.firstTransfer}:${s.returnTransfer}`,
    objectContextId: context.id,
    containerObject: container,
    stem: stems[shape]!,
    options,
    correctIndex,
    answer,
    explanation: [
      `After the first transfer, B contains ${s.firstTransfer} litres of ${context.primary} and ${s.volume} litres of ${context.secondary}, so B has ${s.volume + s.firstTransfer} litres in all.`,
      `Therefore an x-litre return from B contains (${s.primaryPart}/${s.denominator})x litres of ${context.primary} and (${s.secondaryPart}/${s.denominator})x litres of ${context.secondary}.`,
      `A then has ${s.basePrimary} + (${s.primaryPart}/${s.denominator})x litres of ${context.primary} and (${s.secondaryPart}/${s.denominator})x litres of ${context.secondary}. Using ${ratio}: ${s.ratioSecondary}(${s.denominator * s.basePrimary} + ${s.primaryPart}x) = ${s.ratioPrimary * s.secondaryPart}x.`,
      `Solving this linear equation gives x = ${s.returnTransfer} litres.`,
    ],
    commonMistake: `Do not assume the return is also ${s.firstTransfer} litres. The first transfer is known; the return quantity is the unknown, and the liquid returning from B has B's changed composition.`,
    sourceEvidenceIds: [
      "BANK-MAINS-2021-GENERAL-INVERSE-RETURN",
      "CAT-2025-S3-ROUND-TRIP-INVERSE",
    ] as const,
    permanentQlId: null,
    permanentSolveModeId: null,
    active: false as const,
    publiclyPublishable: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
  };
  const errors = lifecycleErrors(base);
  if (
    provedPrimary.numerator !== BigInt(s.ratioPrimary) ||
    provedPrimary.denominator !== 1n ||
    provedSecondary.numerator !== BigInt(s.ratioSecondary) ||
    provedSecondary.denominator !== 1n
  ) {
    errors.push("inverse ledger ratio mismatch");
  }
  if (new Set(rawOptions.map((x) => x.value)).size !== 4 || rawOptions.some((x) => x.value <= 0)) {
    errors.push("inverse options are not four unique positive quantities");
  }

  return { ...base, validation: { ok: errors.length === 0, errors } };
}

export function generateMalCp006Wave04ThreeLegForward(
  seed: string,
): MalCp006Wave04Question {
  const { context, container, h } = chooseContext(`${seed}:forward`);
  const state = MAL_CP006_WAVE04_FORWARD_STATES[
    (h >>> 12) % MAL_CP006_WAVE04_FORWARD_STATES.length
  ]!;
  const s = malCp006Wave04ForwardStateSummary(state);
  const shape = (h >>> 20) % 8;
  const singular = titleCaseFirst(container);
  const plural = pluralContainer(container);
  const answer = ratioText(s.finalPrimaryB, s.finalSecondaryB);

  const stems = [
    `${singular} A contains ${s.volume} litres of ${context.primaryInitial} and ${container} B contains ${s.volume} litres of ${context.secondaryInitial}. ${s.firstTransfer} litres is transferred from A to B. After mixing B, ${s.returnTransfer} litres is transferred from B to A. A is mixed again, and ${s.finalTransfer} litres is transferred from A to B. What is the final ratio of ${context.primary} to ${context.secondary} in B?`,
    `Two ${plural}, A and B, initially hold ${s.volume} litres each: A has ${context.primaryInitial} and B has ${context.secondaryInitial}. The transfers are ${s.firstTransfer} litres from A to B, then ${s.returnTransfer} litres from the mixed B to A, and finally ${s.finalTransfer} litres from the mixed A back to B. What is B's final ratio of ${context.primary} to ${context.secondary}?`,
    `At the end of three alternating transfers, find the ${context.primary}:${context.secondary} ratio in B. A starts with ${s.volume} litres of ${context.primaryInitial} and B with ${s.volume} litres of ${context.secondaryInitial}. The successive transfer quantities are ${s.firstTransfer} litres A to B, ${s.returnTransfer} litres B to A after mixing, and ${s.finalTransfer} litres A to B after mixing again. What is the required ratio?`,
    `${singular} A starts with ${context.primaryInitial}; ${container} B starts with ${context.secondaryInitial}; each has ${s.volume} litres. Step 1: transfer ${s.firstTransfer} litres from A to B. Step 2: mix B and return ${s.returnTransfer} litres to A. Step 3: mix A and send ${s.finalTransfer} litres back to B. What is the final ratio of ${context.primary} to ${context.secondary} in B?`,
    `A and B each contain ${s.volume} litres initially, A containing ${context.primaryInitial} and B containing ${context.secondaryInitial}. First A sends ${s.firstTransfer} litres to B. From B's new mixture, ${s.returnTransfer} litres goes to A. From A's new mixture, ${s.finalTransfer} litres then goes to B. What ratio of ${context.primary} to ${context.secondary} does B finally contain?`,
    `The contents move between A and B three times. Initially A contains ${s.volume} litres of ${context.primaryInitial} and B contains ${s.volume} litres of ${context.secondaryInitial}. After transfers of ${s.firstTransfer} litres A to B, ${s.returnTransfer} litres B to A, and ${s.finalTransfer} litres A to B, with mixing before each later transfer, what is the final ${context.primary}-to-${context.secondary} ratio in B?`,
    `Starting from ${s.volume} litres of ${context.primaryInitial} in A and ${s.volume} litres of ${context.secondaryInitial} in B, ${s.firstTransfer} litres is first poured into B from A. B is mixed before ${s.returnTransfer} litres is returned to A; A is then mixed before ${s.finalTransfer} litres is sent back to B. What is the final ratio of ${context.primary} to ${context.secondary} in B?`,
    `A begins with only ${context.primaryInitial} and B with only ${context.secondaryInitial}, ${s.volume} litres each. A transfers ${s.firstTransfer} litres to B. The changed mixture in B then sends ${s.returnTransfer} litres to A, and the changed mixture in A later sends ${s.finalTransfer} litres to B. What is B's final ${context.primary}:${context.secondary} ratio?`,
  ] as const;

  const correct = ratioText(s.finalPrimaryB, s.finalSecondaryB);
  const ignoreThird = ratioText(s.primaryB2, s.secondaryB2);
  const treatThirdPure = ratioText(s.primaryB2 + s.finalTransfer, s.secondaryB2);
  const reversed = ratioText(s.finalSecondaryB, s.finalPrimaryB);
  const rawOptions = [
    { value: correct, id: "CORRECT" },
    { value: ignoreThird, id: "IGNORES_THIRD_TRANSFER" },
    { value: treatThirdPure, id: "TREATS_THIRD_TRANSFER_AS_PURE_PRIMARY" },
    { value: reversed, id: "REVERSES_FINAL_RATIO" },
  ];
  const ordered = rotate(rawOptions, (h >>> 5) % 4);
  const options = ordered.map((item) => item.value);
  const correctIndex = ordered.findIndex((item) => item.id === "CORRECT");

  const proof = solveMalCp006Ledger(
    [
      { id: "A", volume: rational(s.volume), componentA: rational(s.volume) },
      { id: "B", volume: rational(s.volume), componentA: rational(0) },
    ],
    [
      { kind: "TRANSFER", from: "A", to: "B", amount: rational(s.firstTransfer) },
      { kind: "TRANSFER", from: "B", to: "A", amount: rational(s.returnTransfer) },
      { kind: "TRANSFER", from: "A", to: "B", amount: rational(s.finalTransfer) },
    ],
  );
  const finalB = getMalCp006Vessel(proof, "B");
  const finalSecondaryExact = malCp006ComponentB(finalB);

  const base = {
    prototypeId: "MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO" as const,
    variantId: "THREE_LEG_ALTERNATING_FORWARD" as const,
    generalisationId: MAL_CP006_WAVE04_GENERALISATION_ID,
    seed,
    stemShape: shape,
    stateKey: `${s.volume}:${s.firstTransfer}:${s.returnTransfer}:${s.finalTransfer}`,
    objectContextId: context.id,
    containerObject: container,
    stem: stems[shape]!,
    options,
    correctIndex,
    answer,
    explanation: [
      `After A sends ${s.firstTransfer} litres, B contains ${s.firstTransfer} litres of ${context.primary} and ${s.volume} litres of ${context.secondary}, total ${s.volume + s.firstTransfer} litres.`,
      `From B, the ${s.returnTransfer}-litre return contains ${s.primaryReturned} litres of ${context.primary} and ${s.secondaryReturned} litres of ${context.secondary}. A therefore has ${s.primaryA2} litres of ${context.primary} and ${s.secondaryA2} litres of ${context.secondary}.`,
      `The final ${s.finalTransfer}-litre transfer from this changed A contains ${s.primaryFinalMove} litres of ${context.primary} and ${s.secondaryFinalMove} litres of ${context.secondary}. B finally has ${s.finalPrimaryB} litres of ${context.primary} and ${s.finalSecondaryB} litres of ${context.secondary}.`,
      `Required ratio = ${s.finalPrimaryB} : ${s.finalSecondaryB} = ${answer}.`,
    ],
    commonMistake: `Do not use A's original composition for the third transfer. A has already received the mixed ${s.returnTransfer} litres from B, so its composition has changed.`,
    sourceEvidenceIds: [
      "CAT-2022-S2-Q61-TWO-CONTAINER-ROUND-TRIP",
      "TESTBOOK-RUM-WATER-25PCT-RETURN",
    ] as const,
    permanentQlId: null,
    permanentSolveModeId: null,
    active: false as const,
    publiclyPublishable: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
  };
  const errors = lifecycleErrors(base);
  if (
    finalB.componentA.denominator !== 1n ||
    finalB.componentA.numerator !== BigInt(s.finalPrimaryB) ||
    finalSecondaryExact.denominator !== 1n ||
    finalSecondaryExact.numerator !== BigInt(s.finalSecondaryB)
  ) {
    errors.push("forward ledger state mismatch");
  }
  if (![s.primaryReturned, s.secondaryReturned, s.primaryFinalMove, s.secondaryFinalMove].every(Number.isInteger)) {
    errors.push("forward visible arithmetic is not whole-number friendly");
  }
  if (new Set(rawOptions.map((x) => x.value)).size !== 4) {
    errors.push("forward options are not four unique ratios");
  }

  return { ...base, validation: { ok: errors.length === 0, errors } };
}

export function generateMalCp006Wave04Generalisation(
  variantId: MalCp006Wave04VariantId,
  seed: string,
): MalCp006Wave04Question {
  return variantId === "ASYMMETRIC_INVERSE_RETURN"
    ? generateMalCp006Wave04AsymmetricInverse(seed)
    : generateMalCp006Wave04ThreeLegForward(seed);
}
