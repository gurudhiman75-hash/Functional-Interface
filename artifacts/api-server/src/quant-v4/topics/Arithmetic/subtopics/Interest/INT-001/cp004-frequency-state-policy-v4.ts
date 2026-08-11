import {
  canonicalCp004Answer,
  mixedAmountForState,
  type Cp004MathematicalState,
  type IntCp004QlId,
  type Rational,
} from "./cp004-frequency-math";
import { generateCp004State } from "./cp004-frequency-generation";
import { generateExamReadyCp004State } from "./cp004-frequency-exam-readiness-v4";

function exactToPaise(value: Rational): boolean {
  return (value.numerator * 100n) % value.denominator === 0n;
}

function isMixedQl(qlId: IntCp004QlId): boolean {
  return qlId === "INT-QL-084" || qlId === "INT-QL-085";
}

function generateMixedExamReadyState(qlId: IntCp004QlId, seed: string): Cp004MathematicalState {
  let exactFallback: Cp004MathematicalState | undefined;
  for (let attempt = 0; attempt < 512; attempt += 1) {
    const effectiveSeed = attempt === 0 ? seed : `${seed}:mixed-exam-ready-v4:${attempt}`;
    let state: Cp004MathematicalState;
    try {
      state = generateCp004State(qlId, effectiveSeed);
    } catch {
      continue;
    }
    if (state.firstFrequency === 12 || state.secondFrequency === 12) continue;
    if (state.firstYears !== 1 || state.secondYears !== 1) continue;
    const amount = mixedAmountForState(state);
    const answer = canonicalCp004Answer(state);
    if (!exactToPaise(amount) || !exactToPaise(answer)) continue;
    if (answer.denominator === 1n) return state;
    exactFallback ??= state;
  }
  if (exactFallback) return exactFallback;
  throw new Error(`${qlId}/${seed}: could not construct an exact-paise mixed-frequency state.`);
}

export function generateCp004ExamReadyStateV4(qlId: IntCp004QlId, seed: string): Cp004MathematicalState {
  return isMixedQl(qlId) ? generateMixedExamReadyState(qlId, seed) : generateExamReadyCp004State(qlId, seed);
}
