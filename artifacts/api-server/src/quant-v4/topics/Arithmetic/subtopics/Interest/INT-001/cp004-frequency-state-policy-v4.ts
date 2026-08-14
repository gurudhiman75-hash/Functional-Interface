import {
  FRIENDLY_BASES,
  canonicalCp004Answer,
  completeAmountFromNominal,
  deepFreeze,
  gcdForCp004,
  hash,
  mixedAmountForState,
  rat,
  type Cp004Frequency,
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

function pairKey(left: number, right: number): string {
  return [left, right].sort((a, b) => a - b).join("-");
}

function nearestCompatiblePrincipal(multiplier: Rational, target: bigint): Rational | undefined {
  const unit = multiplier.denominator / gcdForCp004(multiplier.denominator, 100n);
  if (unit > 100000n) return undefined;
  const friendly = FRIENDLY_BASES.filter((value) => value % unit === 0n);
  if (friendly.length > 0) {
    return rat([...friendly].sort((left, right) => {
      const dl = left > target ? left - target : target - left;
      const dr = right > target ? right - target : target - right;
      return dl < dr ? -1 : dl > dr ? 1 : 0;
    })[0]!);
  }
  const multiple = target / unit > 0n ? target / unit : 1n;
  const candidates = [multiple, multiple + 1n, multiple > 1n ? multiple - 1n : 1n]
    .map((item) => item * unit)
    .filter((item) => item >= 800n && item <= 100000n);
  if (candidates.length === 0) return undefined;
  return rat(candidates[0]!);
}

function generateDirectMonthlyState(qlId: "INT-QL-067" | "INT-QL-068", seed: string): Cp004MathematicalState {
  const raw = generateCp004State(qlId, `${seed}:${qlId}:direct-monthly-base-v4`);
  const nominalAnnualRatePercent = hash(`${seed}:${qlId}:direct-monthly-rate-v4`) % 2 === 0 ? rat(12) : rat(24);
  const periods = 3;
  const multiplier = completeAmountFromNominal(rat(1), nominalAnnualRatePercent, 12, periods);
  const targetPrincipal = FRIENDLY_BASES[hash(`${seed}:${qlId}:direct-monthly-principal-v4`) % FRIENDLY_BASES.length]!;
  const principal = nearestCompatiblePrincipal(multiplier, targetPrincipal);
  if (!principal) throw new Error(`${qlId}/${seed}: no realistic principal for the three-month direct monthly state.`);
  const state = deepFreeze({
    ...raw,
    principal,
    nominalAnnualRatePercent,
    frequency: 12 as const,
    periods,
    years: 1,
  });
  const amount = completeAmountFromNominal(principal, nominalAnnualRatePercent, 12, periods);
  const answer = canonicalCp004Answer(state);
  if (!exactToPaise(amount) || !exactToPaise(answer)) {
    throw new Error(`${qlId}/${seed}: direct monthly state is not exact to paise.`);
  }
  return state;
}

function generateMixedExamReadyState(qlId: IntCp004QlId, seed: string): Cp004MathematicalState {
  const desiredPairs = ["1-2", "1-4"] as const;
  const desiredPair = desiredPairs[hash(`${seed}:${qlId}:mixed-pair-target-v4`) % desiredPairs.length]!;
  let exactFallback: Cp004MathematicalState | undefined;
  for (let attempt = 0; attempt < 1024; attempt += 1) {
    const effectiveSeed = `${seed}:mixed-exam-ready-v4:${attempt}`;
    let state: Cp004MathematicalState;
    try {
      state = generateCp004State(qlId, effectiveSeed);
    } catch {
      continue;
    }
    if (pairKey(state.firstFrequency, state.secondFrequency) !== desiredPair) continue;
    if (state.firstFrequency === 12 || state.secondFrequency === 12) continue;
    if (state.firstYears !== 1 || state.secondYears !== 1) continue;
    const amount = mixedAmountForState(state);
    const answer = canonicalCp004Answer(state);
    if (!exactToPaise(amount) || !exactToPaise(answer)) continue;
    if (answer.denominator === 1n) return state;
    exactFallback ??= state;
  }
  if (exactFallback) return exactFallback;
  throw new Error(`${qlId}/${seed}: could not construct an exact-paise mixed-frequency state for ${desiredPair}.`);
}

function generateFrequencyRecoveryState(seed: string): Cp004MathematicalState {
  const frequencies: readonly Cp004Frequency[] = [1, 2, 4];
  const targetFrequency = frequencies[hash(`${seed}:frequency-recovery-target-v4`) % frequencies.length]!;
  for (let attempt = 0; attempt < 1024; attempt += 1) {
    const effectiveSeed = `${seed}:frequency-recovery-v4:${attempt}`;
    let raw: Cp004MathematicalState;
    try {
      raw = generateCp004State("INT-QL-078", effectiveSeed);
    } catch {
      continue;
    }
    if (raw.frequency !== targetFrequency || raw.years !== 1) continue;
    if (raw.nominalAnnualRatePercent.numerator > 24n * raw.nominalAnnualRatePercent.denominator) continue;
    const multiplier = completeAmountFromNominal(rat(1), raw.nominalAnnualRatePercent, raw.frequency, raw.frequency);
    const targetPrincipal = FRIENDLY_BASES[hash(`${seed}:frequency-recovery-principal-v4`) % FRIENDLY_BASES.length]!;
    const principal = nearestCompatiblePrincipal(multiplier, targetPrincipal);
    if (!principal) continue;
    const state = deepFreeze({ ...raw, principal, periods: raw.frequency, years: 1 });
    const amount = completeAmountFromNominal(principal, state.nominalAnnualRatePercent, state.frequency, state.periods);
    if (!exactToPaise(amount)) continue;
    return state;
  }
  throw new Error(`INT-QL-078/${seed}: could not construct the requested exam-friendly frequency-recovery state.`);
}

function generateRestrictedComparisonState(seed: string): Cp004MathematicalState {
  for (let attempt = 0; attempt < 512; attempt += 1) {
    const effectiveSeed = attempt === 0 ? seed : `${seed}:frequency-comparison-v4:${attempt}`;
    const state = generateExamReadyCp004State("INT-QL-075", effectiveSeed);
    if (state.frequency === 12 || state.comparisonFrequency === 12) continue;
    return state;
  }
  throw new Error(`INT-QL-075/${seed}: could not construct an annual/half-yearly/quarterly comparison state.`);
}

export function generateCp004ExamReadyStateV4(qlId: IntCp004QlId, seed: string): Cp004MathematicalState {
  if ((qlId === "INT-QL-067" || qlId === "INT-QL-068") && hash(`${seed}:${qlId}:direct-frequency-policy-v4`) % 4 === 0) {
    return generateDirectMonthlyState(qlId, seed);
  }
  if (isMixedQl(qlId)) return generateMixedExamReadyState(qlId, seed);
  if (qlId === "INT-QL-078") return generateFrequencyRecoveryState(seed);
  if (qlId === "INT-QL-075") return generateRestrictedComparisonState(seed);
  return generateExamReadyCp004State(qlId, seed);
}
