import {
  NUM_CP014_WAVE03_PROTOTYPE_IDS,
  NUM_CP014_WAVE03_REPRESENTATIONS,
  generateNumCp014Wave03,
} from "./runtime.ts";
import type {
  NumCp014Wave03Ablation,
  NumCp014Wave03Engine,
  NumCp014Wave03Package,
  NumCp014Wave03PrototypeId,
  NumCp014Wave03Representation,
} from "./types.ts";

export type NumCp014Wave03V2PrototypeId = NumCp014Wave03PrototypeId | "NUM-CP014-PROT-019" | "NUM-CP014-PROT-020";
export type NumCp014Wave03V2Package = Omit<NumCp014Wave03Package, "temporaryPrototypeId" | "answerSemantic"> & Readonly<{
  temporaryPrototypeId: NumCp014Wave03V2PrototypeId;
  answerSemantic: NumCp014Wave03Package["answerSemantic"] | "HIDDEN_DIVISOR" | "COMPLETE_VALID_SET";
}>;

export const NUM_CP014_WAVE03_V2_PROTOTYPE_IDS = Object.freeze([
  ...NUM_CP014_WAVE03_PROTOTYPE_IDS,
  "NUM-CP014-PROT-019",
  "NUM-CP014-PROT-020",
] as const satisfies readonly NumCp014Wave03V2PrototypeId[]);

const lifecycle = Object.freeze({
  permanentQlAllocated: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
} as const);

function seedOf(raw: number) {
  return Number.isFinite(raw) && raw > 0 ? Math.trunc(raw) : 1;
}
function ints(lo: number, hi: number) {
  return Array.from({ length: hi - lo + 1 }, (_, index) => lo + index);
}
function gcd(a: number, b: number) {
  let x = Math.abs(a), y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x;
}
function isSquare(n: number) {
  const root = Math.floor(Math.sqrt(n));
  return root * root === n;
}
function representationOf(seed: number): NumCp014Wave03Representation {
  return NUM_CP014_WAVE03_REPRESENTATIONS[(seed - 1) % NUM_CP014_WAVE03_REPRESENTATIONS.length]!;
}
function representationPayload(
  representation: NumCp014Wave03Representation,
  domainText: string,
  aText: string,
  bText: string,
  resultText: string,
) {
  if (representation === "CONSTRAINT_TABLE") return Object.freeze([`Domain | ${domainText}`, `Condition A | ${aText}`, `Condition B | ${bText}`, `Result | ${resultText}`]);
  if (representation === "ELIMINATION_GRID") return Object.freeze([`Grid start: ${domainText}`, `A-survivors: ${aText}`, `B-survivors: ${bText}`, `A ∩ B: ${resultText}`]);
  if (representation === "MINI_CASELET") return Object.freeze([`Candidates come from ${domainText}.`, `The first clue gives ${aText}.`, `The second clue gives ${bText}.`, `Together they give ${resultText}.`]);
  return Object.freeze([`START → ${domainText}`, `→ A → ${aText}`, `→ B → ${bText}`, `→ intersection → ${resultText}`]);
}
function setAnswer(values: readonly number[]) {
  return `{${values.join(", ")}}`;
}
function makeOptions(answer: string, wrongValues: readonly string[], seed: number) {
  const wrong: Array<Readonly<{ value: string; misconceptionId: string }>> = [];
  for (const value of wrongValues) {
    if (value === answer || wrong.some((entry) => entry.value === value)) continue;
    wrong.push(Object.freeze({ value, misconceptionId: "ABLATION_OR_PARTIAL_SET" }));
  }
  if (/^-?\d+$/.test(answer)) {
    const n = Number(answer);
    for (const delta of [1, -1, 2, -2, 3, -3, 5, -5]) {
      const value = String(n + delta);
      if (value !== answer && !wrong.some((entry) => entry.value === value)) wrong.push(Object.freeze({ value, misconceptionId: "NEARBY_NUMERIC" }));
      if (wrong.length >= 3) break;
    }
  } else {
    for (const value of ["{}", "MULTIPLE_SOLUTIONS", "INDETERMINATE"]) {
      if (value !== answer && !wrong.some((entry) => entry.value === value)) wrong.push(Object.freeze({ value, misconceptionId: "SET_SEMANTIC_CONFUSION" }));
      if (wrong.length >= 3) break;
    }
  }
  if (wrong.length < 3) throw new Error("CP014 Wave03 V2 could not construct three unique distractors.");
  const correctIndex = (seed - 1) % 4;
  const options: Array<Readonly<{ value: string; misconceptionId: string }>> = [];
  let wi = 0;
  for (let index = 0; index < 4; index += 1) {
    options.push(Object.freeze(index === correctIndex ? { value: answer, misconceptionId: "CORRECT" } : wrong[wi++]!));
  }
  return { options: Object.freeze(options), correctIndex };
}

interface P019State {
  maxDivisor: number; number: number; anchor: number; hcf: number;
  divisorSet: number[]; hcfSet: number[]; full: number[];
}
function buildP019States() {
  const states: P019State[] = [];
  for (let maxDivisor = 8; maxDivisor <= 20; maxDivisor += 1) {
    const domain = ints(2, maxDivisor);
    for (let number = 24; number <= 240; number += 1) {
      const divisorSet = domain.filter((d) => number % d === 0);
      if (divisorSet.length < 2) continue;
      for (const anchor of [12, 18, 20, 24, 30, 36, 42, 60]) for (const hcf of [1, 2, 3, 4, 5, 6, 10, 12]) {
        if (anchor % hcf !== 0) continue;
        const hcfSet = domain.filter((d) => gcd(d, anchor) === hcf);
        const full = divisorSet.filter((d) => hcfSet.includes(d));
        if (hcfSet.length > 1 && full.length === 1) states.push({ maxDivisor, number, anchor, hcf, divisorSet, hcfSet, full });
      }
    }
  }
  return states;
}
const P019_STATES = buildP019States();
function p019(seed: number): NumCp014Wave03V2Package {
  const state = P019_STATES[(seed * 41 - 1) % P019_STATES.length]!;
  const answer = String(state.full[0]!);
  const representation = representationOf(seed);
  const representationPayloadValue = representationPayload(
    representation,
    `integer divisor d ∈ [2, ${state.maxDivisor}]`,
    `d | ${state.number} → {${state.divisorSet.join(", ")}}`,
    `HCF(d, ${state.anchor}) = ${state.hcf} → {${state.hcfSet.join(", ")}}`,
    `d = ${answer}`,
  );
  const ablation: NumCp014Wave03Ablation = Object.freeze({
    components: Object.freeze(["DIVISOR_FUNCTION", "HCF_LCM"] as const),
    fullCandidates: Object.freeze(state.full.map(String)),
    componentRemovedCandidates: Object.freeze({
      DIVISOR_FUNCTION: Object.freeze(state.hcfSet.map(String)),
      HCF_LCM: Object.freeze(state.divisorSet.map(String)),
    }),
    fullAnswer: answer,
    componentRemovedAnswers: Object.freeze({ DIVISOR_FUNCTION: "MULTIPLE_SOLUTIONS", HCF_LCM: "MULTIPLE_SOLUTIONS" }),
    everyComponentChangesAnswer: true,
  });
  const built = makeOptions(answer, [...state.divisorSet.map(String), ...state.hcfSet.map(String)], seed);
  return Object.freeze({
    checkpointId: "NUM-CP-014", temporaryPrototypeId: "NUM-CP014-PROT-019", seed,
    answerSemantic: "HIDDEN_DIVISOR", representation, representationPayload: representationPayloadValue,
    stem: `An integer d from 2 to ${state.maxDivisor} is a divisor of ${state.number} and satisfies HCF(d, ${state.anchor}) = ${state.hcf}. Find d.`,
    canonicalAnswer: answer, verifierAnswer: answer,
    hiddenState: Object.freeze({ ...state }),
    componentEngines: Object.freeze(["DIVISOR_FUNCTION", "HCF_LCM"] as const), ablation,
    explanation: Object.freeze({
      standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1",
      fullDerivation: Object.freeze([
        `List every divisor of ${state.number} in the allowed domain 2 to ${state.maxDivisor}: {${state.divisorSet.join(", ")}}.`,
        `Independently, test HCF(d, ${state.anchor}) = ${state.hcf}; the allowed-domain values are {${state.hcfSet.join(", ")}}.`,
        `The two complete candidate sets intersect only at d = ${answer}.`,
        `Therefore the hidden divisor is ${answer}.`,
        `Removing divisibility leaves ${state.hcfSet.length} possible d-values, while removing the HCF condition leaves ${state.divisorSet.length}. Both engines are essential.`,
        `Verification: ${state.number} ÷ ${answer} is an integer and HCF(${answer}, ${state.anchor}) = ${state.hcf}.`,
      ]),
      examShortcut: Object.freeze([`Write only the small divisors of ${state.number}, then evaluate their HCF with ${state.anchor}.`, `Only d = ${answer} survives.`]),
    }),
    mathematicalFingerprint: `P019|d2-${state.maxDivisor}|d|${state.number}|gcd(d,${state.anchor})=${state.hcf}|${answer}`,
    ...built, lifecycle,
  });
}

interface P020State {
  lo: number; hi: number; modulus: number; remainder: number;
  squareSet: number[]; remainderSet: number[]; full: number[];
}
function buildP020States() {
  const states: P020State[] = [];
  for (let lo = 1; lo <= 100; lo += 5) {
    const hi = lo + 120, domain = ints(lo, hi);
    const squareSet = domain.filter(isSquare);
    if (squareSet.length < 4) continue;
    for (let modulus = 3; modulus <= 12; modulus += 1) for (let remainder = 0; remainder < modulus; remainder += 1) {
      const remainderSet = domain.filter((n) => n % modulus === remainder);
      const full = squareSet.filter((n) => remainderSet.includes(n));
      if (full.length >= 2 && full.length <= 4 && squareSet.length > full.length && remainderSet.length > full.length) states.push({ lo, hi, modulus, remainder, squareSet, remainderSet, full });
    }
  }
  return states;
}
const P020_STATES = buildP020States();
function p020(seed: number): NumCp014Wave03V2Package {
  const state = P020_STATES[(seed * 43 - 1) % P020_STATES.length]!;
  const answer = setAnswer(state.full);
  const noPowerAnswer = setAnswer(state.remainderSet);
  const noRemainderAnswer = setAnswer(state.squareSet);
  const representation = representationOf(seed);
  const representationPayloadValue = representationPayload(
    representation,
    `n ∈ [${state.lo}, ${state.hi}]`,
    `perfect squares = {${state.squareSet.join(", ")}}`,
    `n ≡ ${state.remainder} (mod ${state.modulus}) = {${state.remainderSet.join(", ")}}`,
    `complete set = ${answer}`,
  );
  const ablation: NumCp014Wave03Ablation = Object.freeze({
    components: Object.freeze(["PERFECT_POWER", "REMAINDER"] as const),
    fullCandidates: Object.freeze(state.full.map(String)),
    componentRemovedCandidates: Object.freeze({
      PERFECT_POWER: Object.freeze(state.remainderSet.map(String)),
      REMAINDER: Object.freeze(state.squareSet.map(String)),
    }),
    fullAnswer: answer,
    componentRemovedAnswers: Object.freeze({ PERFECT_POWER: noPowerAnswer, REMAINDER: noRemainderAnswer }),
    everyComponentChangesAnswer: true,
  });
  const built = makeOptions(answer, [noPowerAnswer, noRemainderAnswer, setAnswer(state.full.slice(0, -1))], seed);
  return Object.freeze({
    checkpointId: "NUM-CP-014", temporaryPrototypeId: "NUM-CP014-PROT-020", seed,
    answerSemantic: "COMPLETE_VALID_SET", representation, representationPayload: representationPayloadValue,
    stem: `List the complete set of integers n from ${state.lo} to ${state.hi} that are perfect squares and satisfy n ≡ ${state.remainder} (mod ${state.modulus}).`,
    canonicalAnswer: answer, verifierAnswer: answer,
    hiddenState: Object.freeze({ ...state }),
    componentEngines: Object.freeze(["PERFECT_POWER", "REMAINDER"] as const), ablation,
    explanation: Object.freeze({
      standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1",
      fullDerivation: Object.freeze([
        `The perfect squares in [${state.lo}, ${state.hi}] are {${state.squareSet.join(", ")}}.`,
        `Independently, the numbers satisfying n ≡ ${state.remainder} (mod ${state.modulus}) are {${state.remainderSet.join(", ")}}.`,
        `Taking the intersection gives every value satisfying both conditions: ${answer}.`,
        `Because the question asks for the complete set, no surviving value may be omitted and no extra value may be included.`,
        `Without the perfect-square condition the answer set would be ${noPowerAnswer}; without the remainder condition it would be ${noRemainderAnswer}.`,
        `Verification: every member of ${answer} is a perfect square and has remainder ${state.remainder} modulo ${state.modulus}.`,
      ]),
      examShortcut: Object.freeze([`Test only the square list modulo ${state.modulus}.`, `Collect every square with remainder ${state.remainder}; the complete set is ${answer}.`]),
    }),
    mathematicalFingerprint: `P020|${state.lo}-${state.hi}|complete-set|square|mod${state.modulus}=${state.remainder}|${answer}`,
    ...built, lifecycle,
  });
}

export function generateNumCp014Wave03V2(prototypeId: NumCp014Wave03V2PrototypeId, rawSeed: number): NumCp014Wave03V2Package {
  const seed = seedOf(rawSeed);
  if (prototypeId === "NUM-CP014-PROT-019") return p019(seed);
  if (prototypeId === "NUM-CP014-PROT-020") return p020(seed);
  return generateNumCp014Wave03(prototypeId, seed) as NumCp014Wave03V2Package;
}
