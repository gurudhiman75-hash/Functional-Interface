import type {
  NumCp014AblationEvidence,
  NumCp014ComponentEngine,
  NumCp014Wave01Explanation,
  NumCp014Wave01Option,
  NumCp014Wave01Package,
  NumCp014Wave01PrototypeId,
} from "./types.ts";

export const NUM_CP014_WAVE01_PROTOTYPE_IDS = Object.freeze([
  "NUM-CP014-PROT-001",
  "NUM-CP014-PROT-002",
  "NUM-CP014-PROT-003",
  "NUM-CP014-PROT-004",
  "NUM-CP014-PROT-005",
  "NUM-CP014-PROT-006",
] as const satisfies readonly NumCp014Wave01PrototypeId[]);

const lifecycle = Object.freeze({
  permanentQlAllocated: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
} as const);

function positiveSeed(seed: number) {
  const value = Math.trunc(Number(seed));
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let d = 3; d * d <= n; d += 2) if (n % d === 0) return false;
  return true;
}

function divisorCount(n: number): number {
  let value = n;
  let count = 1;
  for (let p = 2; p * p <= value; p += 1) {
    if (value % p !== 0) continue;
    let exponent = 0;
    while (value % p === 0) {
      value /= p;
      exponent += 1;
    }
    count *= exponent + 1;
  }
  if (value > 1) count *= 2;
  return count;
}

function isPerfectSquare(n: number): boolean {
  const root = Math.floor(Math.sqrt(n));
  return root * root === n;
}

function factorialValuation(n: number, prime: number): number {
  let total = 0;
  let power = prime;
  while (power <= n) {
    total += Math.floor(n / power);
    power *= prime;
  }
  return total;
}

function lastDigitPower(base: number, exponent: number): number {
  let result = 1;
  for (let i = 0; i < exponent; i += 1) result = (result * base) % 10;
  return result;
}

function range(from: number, to: number): number[] {
  return Array.from({ length: Math.max(0, to - from + 1) }, (_, index) => from + index);
}

function strings(values: readonly number[]) {
  return values.map(String);
}

function makeAblation(
  componentA: NumCp014ComponentEngine,
  componentB: NumCp014ComponentEngine,
  fullCandidates: readonly number[],
  componentAOnly: readonly number[],
  componentBOnly: readonly number[],
): NumCp014AblationEvidence {
  if (fullCandidates.length !== 1) throw new Error(`CP014 Wave01 requires a unique full solution, received ${fullCandidates.length}.`);
  if (componentAOnly.length <= 1 || componentBOnly.length <= 1) {
    throw new Error(`CP014 synthesis rejected: both component ablations must become ambiguous (A=${componentAOnly.length}, B=${componentBOnly.length}).`);
  }
  return Object.freeze({
    componentA,
    componentB,
    fullCandidates: Object.freeze(strings(fullCandidates)),
    withoutA: Object.freeze(strings(componentBOnly)),
    withoutB: Object.freeze(strings(componentAOnly)),
    componentANecessary: true,
    componentBNecessary: true,
  });
}

function makeOptions(answer: number, ablation: NumCp014AblationEvidence, seed: number): readonly NumCp014Wave01Option[] {
  const aOnly = ablation.withoutB.map(Number).filter((value) => value !== answer);
  const bOnly = ablation.withoutA.map(Number).filter((value) => value !== answer);
  const distractors: Array<{ value: number; id: string }> = [];
  if (aOnly.length) distractors.push({ value: aOnly[(seed - 1) % aOnly.length]!, id: "SATISFIES_COMPONENT_A_ONLY" });
  if (bOnly.length) distractors.push({ value: bOnly[(seed * 3 - 1) % bOnly.length]!, id: "SATISFIES_COMPONENT_B_ONLY" });
  for (const delta of [1, -1, 2, -2, 3, -3, 5, -5]) {
    const value = answer + delta;
    if (value >= 0 && value !== answer && !distractors.some((item) => item.value === value)) {
      distractors.push({ value, id: "NEARBY_ARITHMETIC_DISTRACTOR" });
    }
    if (distractors.length >= 3) break;
  }
  const unique = distractors.filter((item, index, all) => all.findIndex((other) => other.value === item.value) === index).slice(0, 3);
  if (unique.length < 3) throw new Error("Unable to construct three distinct CP014 distractors.");

  const raw = [
    { value: String(answer), misconceptionId: "CORRECT" },
    ...unique.map((item) => ({ value: String(item.value), misconceptionId: item.id })),
  ];
  const correctPosition = (seed - 1) % 4;
  const correct = raw[0]!;
  const wrong = raw.slice(1);
  const arranged: NumCp014Wave01Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    arranged.push(index === correctPosition ? correct : wrong[wrongIndex++]!);
  }
  return Object.freeze(arranged.map((option) => Object.freeze(option)));
}

function explanation(fullDerivation: readonly string[], examShortcut: readonly string[]): NumCp014Wave01Explanation {
  return Object.freeze({
    standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1",
    fullDerivation: Object.freeze([...fullDerivation]),
    examShortcut: Object.freeze([...examShortcut]),
  });
}

function finish(
  base: Omit<NumCp014Wave01Package, "options" | "correctIndex" | "verifierAnswer" | "lifecycle">,
): NumCp014Wave01Package {
  const answerNumber = Number(base.canonicalAnswer);
  const options = makeOptions(answerNumber, base.ablation, base.seed);
  const correctIndex = options.findIndex((option) => option.value === base.canonicalAnswer);
  if (correctIndex < 0) throw new Error("CP014 correct option missing.");
  return Object.freeze({
    ...base,
    options,
    correctIndex,
    verifierAnswer: base.canonicalAnswer,
    lifecycle,
  });
}

function generateP001(seed: number): NumCp014Wave01Package {
  const targets = [2, 5, 8] as const;
  const target = targets[(seed - 1) % targets.length]!;
  const digits = range(0, 9);
  const numberFor = (digit: number) => 4720 + digit;
  const componentA = digits.filter((digit) => numberFor(digit) % 3 === 0);
  const requiredRemainder = numberFor(target) % 5;
  const componentB = digits.filter((digit) => numberFor(digit) % 5 === requiredRemainder);
  const full = componentA.filter((digit) => componentB.includes(digit));
  const ablation = makeAblation("DIVISIBILITY", "REMAINDER", full, componentA, componentB);

  return finish({
    checkpointId: "NUM-CP-014",
    temporaryPrototypeId: "NUM-CP014-PROT-001",
    taskKind: "HIDDEN_DIGIT_DIVISIBILITY_REMAINDER",
    seed,
    stem: `In the four-digit number 472x, x is a digit. The number is divisible by 3 and leaves remainder ${requiredRemainder} when divided by 5. Find x.`,
    canonicalAnswer: String(target),
    hiddenState: Object.freeze({ prefix: 472, divisor: 3, remainderModulus: 5, requiredRemainder, targetDigit: target, candidateDomain: digits }),
    componentEngines: Object.freeze(["DIVISIBILITY", "REMAINDER"] as const),
    ablation,
    explanation: explanation([
      "We must use both conditions; either condition alone leaves more than one possible digit.",
      `For divisibility by 3, the digit sum is 4 + 7 + 2 + x = 13 + x. Therefore 13 + x must be divisible by 3. Testing digit residues gives x ∈ {${componentA.join(", ")}}.`,
      `Now use the remainder condition. Since 472x = 4720 + x and 4720 is divisible by 5, the remainder on division by 5 is exactly the remainder of x. Hence x ∈ {${componentB.join(", ")}} for remainder ${requiredRemainder}.`,
      `Intersect the two candidate sets: {${componentA.join(", ")}} ∩ {${componentB.join(", ")}} = {${target}}.`,
      `Therefore x = ${target}.`,
    ], [
      `Write the two residue conditions directly: x ≡ ${target % 3} (mod 3) and x ≡ ${requiredRemainder} (mod 5), with 0 ≤ x ≤ 9.`,
      `The only digit satisfying both is ${target}.`,
    ]),
    mathematicalFingerprint: `P001|472x|mod3=0|mod5=${requiredRemainder}|x=${target}`,
  });
}

interface HcfPrimeState { readonly lo: number; readonly hi: number; readonly anchor: number; readonly hcf: number; readonly shift: number; readonly target: number; readonly a: number[]; readonly b: number[]; }
function hcfPrimeStates(): HcfPrimeState[] {
  const states: HcfPrimeState[] = [];
  for (const anchor of [30, 42, 60, 66, 70, 84]) {
    for (const hcf of [2, 3, 5, 6, 7, 10, 14]) {
      if (anchor % hcf !== 0) continue;
      for (const shift of [-1, 1, 2]) {
        for (let lo = 8; lo <= 45; lo += 3) {
          const hi = lo + 24;
          const domain = range(lo, hi);
          const a = domain.filter((n) => gcd(n, anchor) === hcf);
          const b = domain.filter((n) => isPrime(n + shift));
          const full = a.filter((n) => b.includes(n));
          if (a.length > 1 && b.length > 1 && full.length === 1) states.push({ lo, hi, anchor, hcf, shift, target: full[0]!, a, b });
        }
      }
    }
  }
  return states;
}

const HCF_PRIME_STATES = hcfPrimeStates();
function generateP002(seed: number): NumCp014Wave01Package {
  if (!HCF_PRIME_STATES.length) throw new Error("No HCF+prime synthesis states available.");
  const state = HCF_PRIME_STATES[(seed * 17 - 1) % HCF_PRIME_STATES.length]!;
  const full = state.a.filter((n) => state.b.includes(n));
  const ablation = makeAblation("HCF_LCM", "PRIME_STRUCTURE", full, state.a, state.b);
  const shiftedText = state.shift >= 0 ? `n + ${state.shift}` : `n - ${Math.abs(state.shift)}`;
  return finish({
    checkpointId: "NUM-CP-014",
    temporaryPrototypeId: "NUM-CP014-PROT-002",
    taskKind: "HIDDEN_NUMBER_HCF_PRIME",
    seed,
    stem: `An integer n lies from ${state.lo} to ${state.hi}. If HCF(n, ${state.anchor}) = ${state.hcf} and ${shiftedText} is prime, find n.`,
    canonicalAnswer: String(state.target),
    hiddenState: Object.freeze({ ...state }),
    componentEngines: Object.freeze(["HCF_LCM", "PRIME_STRUCTURE"] as const),
    ablation,
    explanation: explanation([
      `First apply the HCF condition across the bounded domain ${state.lo} ≤ n ≤ ${state.hi}. The values with HCF(n, ${state.anchor}) = ${state.hcf} are {${state.a.join(", ")}}.`,
      `Independently apply the prime condition. The values for which ${shiftedText} is prime are {${state.b.join(", ")}}.`,
      `The HCF condition alone is not enough (${state.a.length} candidates), and the prime condition alone is not enough (${state.b.length} candidates).`,
      `Their intersection is {${state.target}}, so n = ${state.target}.`,
      `Verification: HCF(${state.target}, ${state.anchor}) = ${gcd(state.target, state.anchor)}, and ${state.target + state.shift} is prime.`,
    ], [
      `List only the HCF-${state.hcf} candidates, then test ${shiftedText} for primality.`,
      `Only ${state.target} survives both filters.`,
    ]),
    mathematicalFingerprint: `P002|${state.lo}-${state.hi}|gcd:${state.anchor}:${state.hcf}|primeShift:${state.shift}|n=${state.target}`,
  });
}

interface TauSquareState { readonly lo: number; readonly hi: number; readonly tau: number; readonly target: number; readonly a: number[]; readonly b: number[]; }
function tauSquareStates(): TauSquareState[] {
  const states: TauSquareState[] = [];
  for (let lo = 4; lo <= 160; lo += 4) {
    const hi = lo + 60;
    const domain = range(lo, hi);
    const squares = domain.filter(isPerfectSquare);
    if (squares.length <= 1) continue;
    const tauValues = [...new Set(squares.map(divisorCount))];
    for (const tau of tauValues) {
      const a = domain.filter((n) => divisorCount(n) === tau);
      const full = a.filter((n) => squares.includes(n));
      if (a.length > 1 && squares.length > 1 && full.length === 1) states.push({ lo, hi, tau, target: full[0]!, a, b: squares });
    }
  }
  return states;
}
const TAU_SQUARE_STATES = tauSquareStates();
function generateP003(seed: number): NumCp014Wave01Package {
  if (!TAU_SQUARE_STATES.length) throw new Error("No divisor-count+perfect-square synthesis states available.");
  const state = TAU_SQUARE_STATES[(seed * 11 - 1) % TAU_SQUARE_STATES.length]!;
  const full = state.a.filter((n) => state.b.includes(n));
  const ablation = makeAblation("DIVISOR_FUNCTION", "PERFECT_POWER", full, state.a, state.b);
  const root = Math.sqrt(state.target);
  return finish({
    checkpointId: "NUM-CP-014",
    temporaryPrototypeId: "NUM-CP014-PROT-003",
    taskKind: "DIVISOR_COUNT_PERFECT_POWER",
    seed,
    stem: `An integer n lies from ${state.lo} to ${state.hi}. It has exactly ${state.tau} positive divisors and is a perfect square. Find n.`,
    canonicalAnswer: String(state.target),
    hiddenState: Object.freeze({ ...state, squareRoot: root }),
    componentEngines: Object.freeze(["DIVISOR_FUNCTION", "PERFECT_POWER"] as const),
    ablation,
    explanation: explanation([
      `Apply the divisor-function condition first. In the stated interval, the numbers having exactly ${state.tau} positive divisors are {${state.a.join(", ")}}.`,
      `Now list the perfect squares in the same interval: {${state.b.join(", ")}}.`,
      `Neither list is a single value, so neither component determines n by itself.`,
      `The only common value is ${state.target}. Therefore n = ${state.target}.`,
      `Verification of the power condition: ${root}² = ${state.target}. Verification of the divisor condition: τ(${state.target}) = ${divisorCount(state.target)}.`,
    ], [
      `Generate the squares between ⌈√${state.lo}⌉² and ⌊√${state.hi}⌋² and test only those for τ(n) = ${state.tau}.`,
      `Only ${state.target} remains.`,
    ]),
    mathematicalFingerprint: `P003|${state.lo}-${state.hi}|tau=${state.tau}|square|n=${state.target}`,
  });
}

interface ValuationCycleState { readonly lo: number; readonly hi: number; readonly valuationPrime: number; readonly valuation: number; readonly cycleBase: number; readonly terminalDigit: number; readonly target: number; readonly a: number[]; readonly b: number[]; }
function valuationCycleStates(): ValuationCycleState[] {
  const states: ValuationCycleState[] = [];
  for (const valuationPrime of [3, 5]) {
    for (const cycleBase of [2, 3, 7, 8]) {
      for (let lo = 3; lo <= 28; lo += 2) {
        const hi = lo + 11;
        const domain = range(lo, hi);
        for (const target of domain) {
          const valuation = factorialValuation(target, valuationPrime);
          const terminalDigit = lastDigitPower(cycleBase, target);
          const a = domain.filter((n) => factorialValuation(n, valuationPrime) === valuation);
          const b = domain.filter((n) => lastDigitPower(cycleBase, n) === terminalDigit);
          const full = a.filter((n) => b.includes(n));
          if (a.length > 1 && b.length > 1 && full.length === 1 && full[0] === target) {
            states.push({ lo, hi, valuationPrime, valuation, cycleBase, terminalDigit, target, a, b });
          }
        }
      }
    }
  }
  return states;
}
const VALUATION_CYCLE_STATES = valuationCycleStates();
function generateP004(seed: number): NumCp014Wave01Package {
  if (!VALUATION_CYCLE_STATES.length) throw new Error("No valuation+terminal-cycle synthesis states available.");
  const state = VALUATION_CYCLE_STATES[(seed * 13 - 1) % VALUATION_CYCLE_STATES.length]!;
  const full = state.a.filter((n) => state.b.includes(n));
  const ablation = makeAblation("FACTORIAL_VALUATION", "TERMINAL_DIGIT_CYCLE", full, state.a, state.b);
  return finish({
    checkpointId: "NUM-CP-014",
    temporaryPrototypeId: "NUM-CP014-PROT-004",
    taskKind: "FACTORIAL_VALUATION_TERMINAL_CYCLE",
    seed,
    stem: `An integer n lies from ${state.lo} to ${state.hi}. In n!, the exponent of ${state.valuationPrime} is exactly ${state.valuation}. Also, the units digit of ${state.cycleBase}^n is ${state.terminalDigit}. Find n.`,
    canonicalAnswer: String(state.target),
    hiddenState: Object.freeze({ ...state }),
    componentEngines: Object.freeze(["FACTORIAL_VALUATION", "TERMINAL_DIGIT_CYCLE"] as const),
    ablation,
    explanation: explanation([
      `For the factorial condition use Legendre's valuation: v_${state.valuationPrime}(n!) = ⌊n/${state.valuationPrime}⌋ + ⌊n/${state.valuationPrime ** 2}⌋ + ... . Across the stated interval, v_${state.valuationPrime}(n!) = ${state.valuation} for n ∈ {${state.a.join(", ")}}.`,
      `For the terminal-digit condition, powers of ${state.cycleBase} repeat in a fixed units-digit cycle. In the same interval, units(${state.cycleBase}^n) = ${state.terminalDigit} for n ∈ {${state.b.join(", ")}}.`,
      `Each component alone leaves several exponents. Their intersection is {${state.target}}.`,
      `Therefore n = ${state.target}.`,
      `Check: v_${state.valuationPrime}(${state.target}!) = ${factorialValuation(state.target, state.valuationPrime)} and the units digit of ${state.cycleBase}^${state.target} is ${lastDigitPower(state.cycleBase, state.target)}.`,
    ], [
      `Use the valuation plateau to get {${state.a.join(", ")}}, then reduce those exponents modulo the terminal-digit cycle length.`,
      `Only n = ${state.target} has the required units digit.`,
    ]),
    mathematicalFingerprint: `P004|${state.lo}-${state.hi}|v${state.valuationPrime}=${state.valuation}|units:${state.cycleBase}^n=${state.terminalDigit}|n=${state.target}`,
  });
}

interface BaseDivState { readonly lo: number; readonly hi: number; readonly digit: number; readonly divisor: number; readonly target: number; readonly a: number[]; readonly b: number[]; }
function baseDivStates(): BaseDivState[] {
  const states: BaseDivState[] = [];
  for (let hi = 8; hi <= 16; hi += 1) {
    const lo = 2;
    const domain = range(lo, hi);
    for (let digit = 2; digit <= 9; digit += 1) {
      const a = domain.filter((base) => digit < base);
      if (a.length <= 1) continue;
      for (let divisor = 2; divisor <= 9; divisor += 1) {
        const b = domain.filter((base) => (base + digit) % divisor === 0);
        const full = a.filter((base) => b.includes(base));
        if (b.length > 1 && full.length === 1) states.push({ lo, hi, digit, divisor, target: full[0]!, a, b });
      }
    }
  }
  return states;
}
const BASE_DIV_STATES = baseDivStates();
function generateP005(seed: number): NumCp014Wave01Package {
  if (!BASE_DIV_STATES.length) throw new Error("No base-validity+divisibility synthesis states available.");
  const state = BASE_DIV_STATES[(seed * 19 - 1) % BASE_DIV_STATES.length]!;
  const full = state.a.filter((n) => state.b.includes(n));
  const ablation = makeAblation("POSITIONAL_BASE", "DIVISIBILITY", full, state.a, state.b);
  const value = state.target + state.digit;
  return finish({
    checkpointId: "NUM-CP-014",
    temporaryPrototypeId: "NUM-CP014-PROT-005",
    taskKind: "UNKNOWN_BASE_VALIDITY_DIVISIBILITY",
    seed,
    stem: `The numeral (1${state.digit})_b is written in an integer base b with ${state.lo} ≤ b ≤ ${state.hi}. The numeral is valid and its decimal value is divisible by ${state.divisor}. Find b.`,
    canonicalAnswer: String(state.target),
    hiddenState: Object.freeze({ ...state, decimalValueAtTarget: value }),
    componentEngines: Object.freeze(["POSITIONAL_BASE", "DIVISIBILITY"] as const),
    ablation,
    explanation: explanation([
      `Validity comes first: digit ${state.digit} can appear only when b > ${state.digit}. Within ${state.lo} ≤ b ≤ ${state.hi}, this gives b ∈ {${state.a.join(", ")}}.`,
      `The numeral (1${state.digit})_b has decimal value 1×b + ${state.digit} = b + ${state.digit}. Testing divisibility by ${state.divisor} over the bounded base domain gives b ∈ {${state.b.join(", ")}}.`,
      `The divisibility condition by itself includes invalid bases, while validity by itself leaves several bases.`,
      `Intersecting the two sets gives b = ${state.target}.`,
      `Verification: (${state.digit} < ${state.target}) so the numeral is valid, and its decimal value is ${state.target} + ${state.digit} = ${value}, which is divisible by ${state.divisor}.`,
    ], [
      `Solve b + ${state.digit} ≡ 0 (mod ${state.divisor}), then keep only bases b > ${state.digit} in the stated range.`,
      `The only surviving base is ${state.target}.`,
    ]),
    mathematicalFingerprint: `P005|1${state.digit}_b|${state.lo}-${state.hi}|valid|div${state.divisor}|b=${state.target}`,
  });
}

interface SquareRemainderState { readonly lo: number; readonly hi: number; readonly modulus: number; readonly remainder: number; readonly target: number; readonly a: number[]; readonly b: number[]; }
function squareRemainderStates(): SquareRemainderState[] {
  const states: SquareRemainderState[] = [];
  for (let lo = 10; lo <= 240; lo += 10) {
    const hi = lo + 70;
    const domain = range(lo, hi);
    const squares = domain.filter(isPerfectSquare);
    if (squares.length <= 1) continue;
    for (let modulus = 5; modulus <= 13; modulus += 1) {
      for (const target of squares) {
        const remainder = target % modulus;
        const b = domain.filter((n) => n % modulus === remainder);
        const full = squares.filter((n) => b.includes(n));
        if (b.length > 1 && full.length === 1 && full[0] === target) states.push({ lo, hi, modulus, remainder, target, a: squares, b });
      }
    }
  }
  return states;
}
const SQUARE_REMAINDER_STATES = squareRemainderStates();
function generateP006(seed: number): NumCp014Wave01Package {
  if (!SQUARE_REMAINDER_STATES.length) throw new Error("No perfect-square+remainder synthesis states available.");
  const state = SQUARE_REMAINDER_STATES[(seed * 23 - 1) % SQUARE_REMAINDER_STATES.length]!;
  const full = state.a.filter((n) => state.b.includes(n));
  const ablation = makeAblation("PERFECT_POWER", "REMAINDER", full, state.a, state.b);
  const root = Math.sqrt(state.target);
  return finish({
    checkpointId: "NUM-CP-014",
    temporaryPrototypeId: "NUM-CP014-PROT-006",
    taskKind: "HIDDEN_NUMBER_PERFECT_POWER_REMAINDER",
    seed,
    stem: `An integer n lies from ${state.lo} to ${state.hi}. It is a perfect square and leaves remainder ${state.remainder} when divided by ${state.modulus}. Find n.`,
    canonicalAnswer: String(state.target),
    hiddenState: Object.freeze({ ...state, squareRoot: root }),
    componentEngines: Object.freeze(["PERFECT_POWER", "REMAINDER"] as const),
    ablation,
    explanation: explanation([
      `List the perfect squares in the interval: {${state.a.join(", ")}}.`,
      `Independently, the numbers in the interval satisfying n ≡ ${state.remainder} (mod ${state.modulus}) are {${state.b.join(", ")}}.`,
      `There are several candidates in each individual list, so neither the square condition nor the remainder condition is decorative.`,
      `Their only common value is ${state.target}; hence n = ${state.target}.`,
      `Verification: ${root}² = ${state.target}, and ${state.target} = ${Math.floor(state.target / state.modulus)}×${state.modulus} + ${state.remainder}.`,
    ], [
      `Check only the squares modulo ${state.modulus} rather than scanning every integer.`,
      `Among {${state.a.join(", ")}}, only ${state.target} gives remainder ${state.remainder}.`,
    ]),
    mathematicalFingerprint: `P006|${state.lo}-${state.hi}|square|mod${state.modulus}=${state.remainder}|n=${state.target}`,
  });
}

export function generateNumCp014Wave01(prototypeId: NumCp014Wave01PrototypeId, rawSeed: number): NumCp014Wave01Package {
  const seed = positiveSeed(rawSeed);
  switch (prototypeId) {
    case "NUM-CP014-PROT-001": return generateP001(seed);
    case "NUM-CP014-PROT-002": return generateP002(seed);
    case "NUM-CP014-PROT-003": return generateP003(seed);
    case "NUM-CP014-PROT-004": return generateP004(seed);
    case "NUM-CP014-PROT-005": return generateP005(seed);
    case "NUM-CP014-PROT-006": return generateP006(seed);
  }
}
