import { base, cleanExplanation, difficulty, formatRemainderPair, hidden, mod, sources, textOptions, tierForSeed, type Rng } from "./core.ts";
import { WAVE04_GENERATORS as BASE_GENERATORS } from "./generators.ts";
import type { NumCp007Wave04Package } from "./types.ts";

function makeChain(tier: 0 | 1 | 2, rng: Rng) {
  const d1 = tier === 0 ? rng.int(3, 9) : tier === 1 ? rng.int(7, 17) : rng.int(11, 29);
  let d2 = tier === 0 ? rng.int(3, 9) : tier === 1 ? rng.int(7, 19) : rng.int(13, 31);
  if (d2 === d1) d2 += 1;
  const r1 = rng.int(0, d1 - 1);
  const r2 = rng.int(0, d2 - 1);
  const finalQ = tier === 0 ? rng.int(2, 9) : tier === 1 ? rng.int(10, 39) : rng.int(40, 99);
  const dividend = d1 * (d2 * finalQ + r2) + r1;
  return { d1, d2, r1, r2, finalQ, dividend };
}

function reversedChain(seed: number, rng: Rng): NumCp007Wave04Package {
  const tier = tierForSeed(seed);
  const state = makeChain(tier, rng);
  const firstQ = Math.floor(state.dividend / state.d2);
  const firstR = mod(state.dividend, state.d2);
  const secondR = mod(firstQ, state.d1);
  const answer = formatRemainderPair(firstR, secondR);

  const distractors: { value: string; misconceptionId: string }[] = [];
  const seen = new Set<string>([answer]);
  const add = (a: number, b: number, misconceptionId: string) => {
    if (a < 0 || a >= state.d2 || b < 0 || b >= state.d1) return;
    const value = formatRemainderPair(a, b);
    if (seen.has(value)) return;
    seen.add(value);
    distractors.push({ value, misconceptionId });
  };

  add(state.r1, state.r2, "ASSUMED_REMAINDERS_UNCHANGED");
  add(state.r2, state.r1, "ONLY_SWAPPED_OLD_REMAINDERS");
  add(secondR, firstR, "SWAPPED_NEW_REMAINDER_ORDER");
  add(mod(firstR + 1, state.d2), secondR, "OFF_BY_ONE_FIRST_REMAINDER");
  add(firstR, mod(secondR + 1, state.d1), "OFF_BY_ONE_SECOND_REMAINDER");

  for (let a = 0; a < state.d2 && distractors.length < 3; a++) {
    for (let b = 0; b < state.d1 && distractors.length < 3; b++) {
      add(a, b, "ALTERNATIVE_PAIR_FAILS_REVERSED_DIVISION");
    }
  }
  if (distractors.length < 3) throw new Error(`Distinct reversed-chain options unavailable for seed ${seed}.`);

  const optionSet = textOptions(answer, distractors, rng);
  return base({
    temporaryPrototypeId: "NUM-CP007-PROT-028",
    seed,
    difficulty: difficulty(tier, 3),
    answerSemantic: "REMAINDER_SEQUENCE",
    representation: "SUCCESSIVE_DIVISION_REVERSED_ORDER",
    stem: `A number is divided successively by ${state.d1} and ${state.d2}; the remainders are ${state.r1} and ${state.r2}, and the final quotient is ${state.finalQ}. If the same number is instead divided successively by ${state.d2} and ${state.d1}, what are the new remainders in order?`,
    ...optionSet,
    verifierAnswer: answer,
    hiddenState: hidden("REVERSE_SUCCESSIVE_DIVISION", { d1: state.d1, d2: state.d2, r1: state.r1, r2: state.r2, finalQ: state.finalQ }),
    mathematicalFingerprint: `REVCHAIN|${state.d1}|${state.d2}|${state.r1}|${state.r2}|${state.finalQ}|${firstR}|${secondR}`,
    explanation: cleanExplanation(
      "Changing the order of successive divisors changes the intermediate quotient, so the old remainders cannot simply be swapped.",
      "First reconstruct the original number, then carry out the reversed divisions.",
      [
        `Original number = ${state.d1} × (${state.d2} × ${state.finalQ} + ${state.r2}) + ${state.r1} = ${state.dividend}.`,
        `${state.dividend} ÷ ${state.d2} gives quotient ${firstQ} and remainder ${firstR}.`,
        `${firstQ} ÷ ${state.d1} leaves remainder ${secondR}.`,
      ],
      answer,
    ),
    sourceAncestry: sources("SSC-RRB-REVERSED-SUCCESSIVE-DIVISION"),
    prototypeAncestry: ["NUM-CP007-SUCCESSIVE-DIVISION-CHAIN-REORDER"],
  });
}

export const WAVE04_GENERATORS = {
  ...BASE_GENERATORS,
  "NUM-CP007-PROT-028": reversedChain,
} as const;
