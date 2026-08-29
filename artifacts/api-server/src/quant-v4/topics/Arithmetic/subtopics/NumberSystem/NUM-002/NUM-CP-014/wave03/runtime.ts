import type {
  NumCp014Wave03Ablation,
  NumCp014Wave03Engine,
  NumCp014Wave03Package,
  NumCp014Wave03PrototypeId,
  NumCp014Wave03Representation,
} from "./types.ts";

export const NUM_CP014_WAVE03_PROTOTYPE_IDS = Object.freeze([
  "NUM-CP014-PROT-013",
  "NUM-CP014-PROT-014",
  "NUM-CP014-PROT-015",
  "NUM-CP014-PROT-016",
  "NUM-CP014-PROT-017",
  "NUM-CP014-PROT-018",
] as const satisfies readonly NumCp014Wave03PrototypeId[]);

export const NUM_CP014_WAVE03_REPRESENTATIONS = Object.freeze([
  "CONSTRAINT_TABLE",
  "ELIMINATION_GRID",
  "MINI_CASELET",
  "MULTI_STAGE_GRAPH",
] as const satisfies readonly NumCp014Wave03Representation[]);

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
function isCube(n: number) {
  for (let root = 1; root * root * root <= n; root += 1) if (root * root * root === n) return true;
  return false;
}
function unitDigitOfPower(base: number, exponent: number) {
  let value = 1;
  for (let index = 0; index < exponent; index += 1) value = (value * base) % 10;
  return value;
}

const TAU_LIMIT = 240;
const TAU = Array.from({ length: TAU_LIMIT + 1 }, () => 0);
for (let divisor = 1; divisor <= TAU_LIMIT; divisor += 1) {
  for (let multiple = divisor; multiple <= TAU_LIMIT; multiple += divisor) TAU[multiple] += 1;
}
function tau(n: number) {
  return TAU[n] ?? 0;
}

function representationOf(seed: number): NumCp014Wave03Representation {
  return NUM_CP014_WAVE03_REPRESENTATIONS[(seed - 1) % NUM_CP014_WAVE03_REPRESENTATIONS.length]!;
}
function representationPayload(
  representation: NumCp014Wave03Representation,
  domainText: string,
  conditionAText: string,
  conditionBText: string,
  intersectionText: string,
) {
  if (representation === "CONSTRAINT_TABLE") return Object.freeze([
    `Domain | ${domainText}`,
    `Condition A | ${conditionAText}`,
    `Condition B | ${conditionBText}`,
    `Common row | ${intersectionText}`,
  ]);
  if (representation === "ELIMINATION_GRID") return Object.freeze([
    `Grid start: ${domainText}`,
    `A-survivors: ${conditionAText}`,
    `B-survivors: ${conditionBText}`,
    `A ∩ B: ${intersectionText}`,
  ]);
  if (representation === "MINI_CASELET") return Object.freeze([
    `A candidate is selected from ${domainText}.`,
    `The first clue gives ${conditionAText}.`,
    `The second clue gives ${conditionBText}.`,
    `Using both clues gives ${intersectionText}.`,
  ]);
  return Object.freeze([
    `START → ${domainText}`,
    `→ apply A → ${conditionAText}`,
    `→ apply B → ${conditionBText}`,
    `→ intersect → ${intersectionText}`,
  ]);
}

function makeOptions(answer: string, preferredWrong: readonly string[], seed: number) {
  const wrong: Array<{ value: string; misconceptionId: string }> = [];
  const push = (value: string, misconceptionId: string) => {
    if (value === answer || wrong.some((entry) => entry.value === value)) return;
    wrong.push({ value, misconceptionId });
  };
  for (const value of preferredWrong) push(value, "ABLATION_SURVIVOR");
  if (/^-?\d+$/.test(answer)) {
    const n = Number(answer);
    for (const delta of [1, -1, 2, -2, 3, -3, 5, -5, 10, -10]) {
      push(String(n + delta), "NEARBY_NUMERIC");
      if (wrong.length >= 3) break;
    }
  }
  if (wrong.length < 3) throw new Error("CP014 Wave03 could not construct three unique distractors.");
  const correctIndex = (seed - 1) % 4;
  const options: Array<Readonly<{ value: string; misconceptionId: string }>> = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    options.push(Object.freeze(index === correctIndex
      ? { value: answer, misconceptionId: "CORRECT" }
      : wrong[wrongIndex++]!));
  }
  return { options: Object.freeze(options), correctIndex };
}

function makeAblation(
  components: readonly NumCp014Wave03Engine[],
  fullCandidates: readonly number[],
  componentRemovedCandidates: Readonly<Record<string, readonly number[]>>,
  answer: string,
): NumCp014Wave03Ablation {
  const removedCandidates: Record<string, readonly string[]> = {};
  const removedAnswers: Record<string, string> = {};
  for (const component of components) {
    const candidates = componentRemovedCandidates[component] ?? [];
    if (candidates.length <= 1) throw new Error(`CP014 Wave03 rejected ${component}: ablation did not restore ambiguity.`);
    removedCandidates[component] = Object.freeze(candidates.map(String));
    removedAnswers[component] = "MULTIPLE_SOLUTIONS";
  }
  return Object.freeze({
    components: Object.freeze([...components]),
    fullCandidates: Object.freeze(fullCandidates.map(String)),
    componentRemovedCandidates: Object.freeze(removedCandidates),
    fullAnswer: answer,
    componentRemovedAnswers: Object.freeze(removedAnswers),
    everyComponentChangesAnswer: true,
  });
}

function finish(
  base: Omit<NumCp014Wave03Package, "options" | "correctIndex" | "verifierAnswer" | "lifecycle">,
  preferredWrong: readonly string[],
): NumCp014Wave03Package {
  const built = makeOptions(base.canonicalAnswer, preferredWrong, base.seed);
  return Object.freeze({ ...base, ...built, verifierAnswer: base.canonicalAnswer, lifecycle });
}

// P013 — one missing decimal digit requires both divisibility and perfect-square structure.
interface P013State {
  thousands: number; tens: number; units: number; divisor: number;
  squareDigits: number[]; divisibleDigits: number[]; fullDigits: number[]; value: number;
}
function buildP013States() {
  const states: P013State[] = [];
  for (let thousands = 1; thousands <= 9; thousands += 1) {
    for (let tens = 0; tens <= 9; tens += 1) for (let units = 0; units <= 9; units += 1) {
      const valueOf = (digit: number) => thousands * 1000 + digit * 100 + tens * 10 + units;
      const squareDigits = ints(0, 9).filter((digit) => isSquare(valueOf(digit)));
      if (squareDigits.length < 2) continue;
      for (let divisor = 3; divisor <= 12; divisor += 1) {
        const divisibleDigits = ints(0, 9).filter((digit) => valueOf(digit) % divisor === 0);
        const fullDigits = squareDigits.filter((digit) => divisibleDigits.includes(digit));
        if (divisibleDigits.length > 1 && fullDigits.length === 1) {
          states.push({ thousands, tens, units, divisor, squareDigits, divisibleDigits, fullDigits, value: valueOf(fullDigits[0]!) });
        }
      }
    }
  }
  return states;
}
const P013_STATES = buildP013States();
function p013(seed: number): NumCp014Wave03Package {
  const state = P013_STATES[(seed * 17 - 1) % P013_STATES.length]!;
  const answer = String(state.fullDigits[0]!);
  const representation = representationOf(seed);
  const pattern = `${state.thousands}x${state.tens}${state.units}`;
  const squareValues = state.squareDigits.map((digit) => state.thousands * 1000 + digit * 100 + state.tens * 10 + state.units);
  const payload = representationPayload(
    representation,
    `x ∈ {0,1,...,9} in ${pattern}`,
    `perfect-square x-values = {${state.squareDigits.join(", ")}}`,
    `divisible-by-${state.divisor} x-values = {${state.divisibleDigits.join(", ")}}`,
    `x = ${answer}`,
  );
  const ablation = makeAblation(
    ["DIVISIBILITY", "PERFECT_POWER"], state.fullDigits,
    { DIVISIBILITY: state.squareDigits, PERFECT_POWER: state.divisibleDigits }, answer,
  );
  return finish({
    checkpointId: "NUM-CP-014", temporaryPrototypeId: "NUM-CP014-PROT-013", seed,
    answerSemantic: "DIGIT", representation, representationPayload: payload,
    stem: `In the ${representation.toLowerCase().replaceAll("_", " ")} below, the four-digit number ${pattern} is both a perfect square and divisible by ${state.divisor}. Find x.`,
    canonicalAnswer: answer,
    hiddenState: Object.freeze({ ...state, pattern, squareValues: Object.freeze(squareValues) }),
    componentEngines: Object.freeze(["DIVISIBILITY", "PERFECT_POWER"]), ablation,
    explanation: Object.freeze({
      standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1",
      fullDerivation: Object.freeze([
        `The unknown digit has the complete domain x ∈ {0,1,...,9}, so every admissible four-digit number is checked rather than guessed.`,
        `Testing the ten numbers for perfect-square structure leaves x ∈ {${state.squareDigits.join(", ")}}, corresponding to square values {${squareValues.join(", ")}}.`,
        `Independently, applying divisibility by ${state.divisor} to the same ten candidates leaves x ∈ {${state.divisibleDigits.join(", ")}}.`,
        `Intersecting the two independently derived sets gives {${state.fullDigits.join(", ")}}. Therefore x = ${answer}.`,
        `If divisibility is removed there are ${state.squareDigits.length} possible digits; if square structure is removed there are ${state.divisibleDigits.length}. Both engines are therefore necessary.`,
        `Verification: ${state.value} is a perfect square and ${state.value} ÷ ${state.divisor} is an integer.`,
      ]),
      examShortcut: Object.freeze([
        `List only square numbers between ${state.thousands}000 and ${state.thousands}999 whose last two digits are ${state.tens}${state.units}; this gives x ∈ {${state.squareDigits.join(", ")}}.`,
        `Apply the divisibility rule for ${state.divisor} only to those survivors; x = ${answer}.`,
      ]),
    }),
    mathematicalFingerprint: `P013|${pattern}|square|div${state.divisor}|x=${answer}`,
  }, [...state.squareDigits.map(String), ...state.divisibleDigits.map(String)]);
}

// P014 — divisor-count structure plus exact HCF reconstructs one integer.
interface P014State {
  lo: number; hi: number; divisorCount: number; anchor: number; hcf: number;
  divisorCountSet: number[]; hcfSet: number[]; full: number[];
}
function buildP014States() {
  const states: P014State[] = [];
  for (let lo = 10; lo <= 80; lo += 5) {
    const hi = lo + 60, domain = ints(lo, hi);
    for (let divisorCount = 4; divisorCount <= 16; divisorCount += 1) {
      const divisorCountSet = domain.filter((n) => tau(n) === divisorCount);
      if (divisorCountSet.length < 2) continue;
      for (const anchor of [24, 30, 36, 42, 48, 60, 72, 84, 90]) {
        for (const hcf of [1, 2, 3, 4, 5, 6, 7, 8, 10, 12]) {
          if (anchor % hcf !== 0) continue;
          const hcfSet = domain.filter((n) => gcd(n, anchor) === hcf);
          const full = divisorCountSet.filter((n) => hcfSet.includes(n));
          if (hcfSet.length > 1 && full.length === 1) states.push({ lo, hi, divisorCount, anchor, hcf, divisorCountSet, hcfSet, full });
        }
      }
    }
  }
  return states;
}
const P014_STATES = buildP014States();
function p014(seed: number): NumCp014Wave03Package {
  const state = P014_STATES[(seed * 19 - 1) % P014_STATES.length]!;
  const answer = String(state.full[0]!);
  const representation = representationOf(seed);
  const payload = representationPayload(
    representation,
    `n ∈ [${state.lo}, ${state.hi}]`,
    `τ(n) = ${state.divisorCount} → {${state.divisorCountSet.join(", ")}}`,
    `HCF(n, ${state.anchor}) = ${state.hcf} → {${state.hcfSet.join(", ")}}`,
    `n = ${answer}`,
  );
  const ablation = makeAblation(
    ["DIVISOR_FUNCTION", "HCF_LCM"], state.full,
    { DIVISOR_FUNCTION: state.hcfSet, HCF_LCM: state.divisorCountSet }, answer,
  );
  return finish({
    checkpointId: "NUM-CP-014", temporaryPrototypeId: "NUM-CP014-PROT-014", seed,
    answerSemantic: "HIDDEN_NUMBER", representation, representationPayload: payload,
    stem: `An integer n lies from ${state.lo} to ${state.hi}. It has exactly ${state.divisorCount} positive divisors and HCF(n, ${state.anchor}) = ${state.hcf}. Find n.`,
    canonicalAnswer: answer, hiddenState: Object.freeze({ ...state }),
    componentEngines: Object.freeze(["DIVISOR_FUNCTION", "HCF_LCM"]), ablation,
    explanation: Object.freeze({
      standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1",
      fullDerivation: Object.freeze([
        `For a factorisation n = p₁^a¹ p₂^a²..., the divisor count is τ(n) = (a₁+1)(a₂+1)... . Applying that rule throughout [${state.lo}, ${state.hi}] leaves {${state.divisorCountSet.join(", ")}}.`,
        `Now apply the second engine independently: HCF(n, ${state.anchor}) must equal exactly ${state.hcf}. The interval candidates satisfying this are {${state.hcfSet.join(", ")}}.`,
        `The only number present in both lists is ${answer}.`,
        `So n = ${answer}; it is not enough merely to have ${state.hcf} as a common divisor—the HCF must be exactly ${state.hcf}.`,
        `Removing the divisor-count clue leaves ${state.hcfSet.length} candidates, while removing the HCF clue leaves ${state.divisorCountSet.length}. Hence neither clue is decorative.`,
        `Final verification: τ(${answer}) = ${state.divisorCount} and HCF(${answer}, ${state.anchor}) = ${state.hcf}.`,
      ]),
      examShortcut: Object.freeze([
        `Start with the shorter of the τ(n) list and the exact-HCF list rather than scanning every integer.`,
        `Cross-check those few values; only ${answer} satisfies both.`,
      ]),
    }),
    mathematicalFingerprint: `P014|${state.lo}-${state.hi}|tau${state.divisorCount}|gcd${state.anchor}=${state.hcf}|${answer}`,
  }, [...state.divisorCountSet.slice(0, 3).map(String), ...state.hcfSet.slice(0, 3).map(String)]);
}

// P015 — divisor-count structure plus a residue condition reconstructs one integer.
interface P015State {
  lo: number; hi: number; divisorCount: number; modulus: number; remainder: number;
  divisorCountSet: number[]; remainderSet: number[]; full: number[];
}
function buildP015States() {
  const states: P015State[] = [];
  for (let lo = 10; lo <= 100; lo += 5) {
    const hi = lo + 70, domain = ints(lo, hi);
    for (let divisorCount = 4; divisorCount <= 16; divisorCount += 1) {
      const divisorCountSet = domain.filter((n) => tau(n) === divisorCount);
      if (divisorCountSet.length < 2) continue;
      for (let modulus = 5; modulus <= 15; modulus += 1) for (let remainder = 0; remainder < modulus; remainder += 1) {
        const remainderSet = domain.filter((n) => n % modulus === remainder);
        const full = divisorCountSet.filter((n) => remainderSet.includes(n));
        if (remainderSet.length > 1 && full.length === 1) states.push({ lo, hi, divisorCount, modulus, remainder, divisorCountSet, remainderSet, full });
      }
    }
  }
  return states;
}
const P015_STATES = buildP015States();
function p015(seed: number): NumCp014Wave03Package {
  const state = P015_STATES[(seed * 23 - 1) % P015_STATES.length]!;
  const answer = String(state.full[0]!);
  const representation = representationOf(seed);
  const payload = representationPayload(
    representation,
    `n ∈ [${state.lo}, ${state.hi}]`,
    `τ(n) = ${state.divisorCount} → {${state.divisorCountSet.join(", ")}}`,
    `n ≡ ${state.remainder} (mod ${state.modulus}) → {${state.remainderSet.join(", ")}}`,
    `n = ${answer}`,
  );
  const ablation = makeAblation(
    ["DIVISOR_FUNCTION", "REMAINDER"], state.full,
    { DIVISOR_FUNCTION: state.remainderSet, REMAINDER: state.divisorCountSet }, answer,
  );
  return finish({
    checkpointId: "NUM-CP-014", temporaryPrototypeId: "NUM-CP014-PROT-015", seed,
    answerSemantic: "HIDDEN_NUMBER", representation, representationPayload: payload,
    stem: `Find the integer n from ${state.lo} to ${state.hi} that has exactly ${state.divisorCount} positive divisors and leaves remainder ${state.remainder} when divided by ${state.modulus}.`,
    canonicalAnswer: answer, hiddenState: Object.freeze({ ...state }),
    componentEngines: Object.freeze(["DIVISOR_FUNCTION", "REMAINDER"]), ablation,
    explanation: Object.freeze({
      standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1",
      fullDerivation: Object.freeze([
        `Use prime exponents to count divisors: τ(n) = ∏(exponent + 1). In the stated interval this gives the complete set {${state.divisorCountSet.join(", ")}}.`,
        `Separately, numbers satisfying n ≡ ${state.remainder} (mod ${state.modulus}) are generated as ${state.remainder} + k×${state.modulus}; within the interval they are {${state.remainderSet.join(", ")}}.`,
        `Intersect the two complete sets. Their only common value is ${answer}.`,
        `Therefore n = ${answer}.`,
        `Without the divisor-count condition there are ${state.remainderSet.length} residue candidates; without the residue condition there are ${state.divisorCountSet.length} divisor-count candidates.`,
        `Verification: ${answer} mod ${state.modulus} = ${state.remainder} and τ(${answer}) = ${state.divisorCount}.`,
      ]),
      examShortcut: Object.freeze([
        `Generate the short arithmetic progression n ≡ ${state.remainder} (mod ${state.modulus}) first.`,
        `Factor only those values until τ(n) = ${state.divisorCount}; the unique hit is ${answer}.`,
      ]),
    }),
    mathematicalFingerprint: `P015|${state.lo}-${state.hi}|tau${state.divisorCount}|mod${state.modulus}=${state.remainder}|${answer}`,
  }, [...state.divisorCountSet.slice(0, 3).map(String), ...state.remainderSet.slice(0, 3).map(String)]);
}

// P016 — exact HCF plus square/cube structure reconstructs one integer.
interface P016State {
  lo: number; hi: number; powerKind: "SQUARE" | "CUBE"; anchor: number; hcf: number;
  powerSet: number[]; hcfSet: number[]; full: number[];
}
function buildP016States() {
  const states: P016State[] = [];
  for (let lo = 5; lo <= 150; lo += 5) {
    const hi = lo + 100, domain = ints(lo, hi);
    for (const powerKind of ["SQUARE", "CUBE"] as const) {
      const powerSet = domain.filter(powerKind === "SQUARE" ? isSquare : isCube);
      if (powerSet.length < 2) continue;
      for (const anchor of [24, 30, 36, 42, 48, 60, 72, 84, 90, 120]) {
        for (const hcf of [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15]) {
          if (anchor % hcf !== 0) continue;
          const hcfSet = domain.filter((n) => gcd(n, anchor) === hcf);
          const full = powerSet.filter((n) => hcfSet.includes(n));
          if (hcfSet.length > 1 && full.length === 1) states.push({ lo, hi, powerKind, anchor, hcf, powerSet, hcfSet, full });
        }
      }
    }
  }
  return states;
}
const P016_STATES = buildP016States();
function p016(seed: number): NumCp014Wave03Package {
  const state = P016_STATES[(seed * 29 - 1) % P016_STATES.length]!;
  const answer = String(state.full[0]!);
  const representation = representationOf(seed);
  const powerWord = state.powerKind === "SQUARE" ? "perfect square" : "perfect cube";
  const payload = representationPayload(
    representation,
    `n ∈ [${state.lo}, ${state.hi}]`,
    `${powerWord} → {${state.powerSet.join(", ")}}`,
    `HCF(n, ${state.anchor}) = ${state.hcf} → {${state.hcfSet.join(", ")}}`,
    `n = ${answer}`,
  );
  const ablation = makeAblation(
    ["PERFECT_POWER", "HCF_LCM"], state.full,
    { PERFECT_POWER: state.hcfSet, HCF_LCM: state.powerSet }, answer,
  );
  return finish({
    checkpointId: "NUM-CP-014", temporaryPrototypeId: "NUM-CP014-PROT-016", seed,
    answerSemantic: "HIDDEN_NUMBER", representation, representationPayload: payload,
    stem: `An integer n from ${state.lo} to ${state.hi} is a ${powerWord} and satisfies HCF(n, ${state.anchor}) = ${state.hcf}. Find n.`,
    canonicalAnswer: answer, hiddenState: Object.freeze({ ...state }),
    componentEngines: Object.freeze(["PERFECT_POWER", "HCF_LCM"]), ablation,
    explanation: Object.freeze({
      standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1",
      fullDerivation: Object.freeze([
        `First generate every ${powerWord} in [${state.lo}, ${state.hi}]: {${state.powerSet.join(", ")}}.`,
        `Independently enforce the exact HCF condition HCF(n, ${state.anchor}) = ${state.hcf}; its interval candidates are {${state.hcfSet.join(", ")}}.`,
        `Only ${answer} belongs to both lists.`,
        `Hence n = ${answer}.`,
        `If perfect-power structure is removed, ${state.hcfSet.length} values remain; if the HCF condition is removed, ${state.powerSet.length} values remain.`,
        `Verification confirms both ${powerWord} structure and HCF(${answer}, ${state.anchor}) = ${state.hcf}.`,
      ]),
      examShortcut: Object.freeze([
        `Because there are far fewer ${powerWord}s than general integers, test HCF only on {${state.powerSet.join(", ")}}.`,
        `The unique matching value is ${answer}.`,
      ]),
    }),
    mathematicalFingerprint: `P016|${state.lo}-${state.hi}|${state.powerKind}|gcd${state.anchor}=${state.hcf}|${answer}`,
  }, [...state.powerSet.slice(0, 3).map(String), ...state.hcfSet.slice(0, 3).map(String)]);
}

// P017 — base validity and HCF of the numeral's decimal value are both essential.
interface P017State {
  maxBase: number; digit: number; anchor: number; hcf: number;
  validBases: number[]; hcfBases: number[]; full: number[];
}
function buildP017States() {
  const states: P017State[] = [];
  for (let maxBase = 8; maxBase <= 20; maxBase += 1) {
    const domain = ints(2, maxBase);
    for (let digit = 2; digit <= 9; digit += 1) {
      const validBases = domain.filter((base) => base > digit);
      if (validBases.length < 2) continue;
      for (const anchor of [6, 8, 10, 12, 14, 15, 18, 20, 24, 30]) {
        for (const hcf of [1, 2, 3, 4, 5, 6, 7, 10]) {
          if (anchor % hcf !== 0) continue;
          const hcfBases = domain.filter((base) => gcd(base + digit, anchor) === hcf);
          const full = validBases.filter((base) => hcfBases.includes(base));
          if (hcfBases.length > 1 && full.length === 1) states.push({ maxBase, digit, anchor, hcf, validBases, hcfBases, full });
        }
      }
    }
  }
  return states;
}
const P017_STATES = buildP017States();
function p017(seed: number): NumCp014Wave03Package {
  const state = P017_STATES[(seed * 31 - 1) % P017_STATES.length]!;
  const answer = String(state.full[0]!);
  const representation = representationOf(seed);
  const payload = representationPayload(
    representation,
    `integer base b ∈ [2, ${state.maxBase}]`,
    `(1${state.digit})_b valid → b > ${state.digit} → {${state.validBases.join(", ")}}`,
    `HCF(b + ${state.digit}, ${state.anchor}) = ${state.hcf} → {${state.hcfBases.join(", ")}}`,
    `b = ${answer}`,
  );
  const ablation = makeAblation(
    ["POSITIONAL_BASE", "HCF_LCM"], state.full,
    { POSITIONAL_BASE: state.hcfBases, HCF_LCM: state.validBases }, answer,
  );
  return finish({
    checkpointId: "NUM-CP-014", temporaryPrototypeId: "NUM-CP014-PROT-017", seed,
    answerSemantic: "HIDDEN_BASE", representation, representationPayload: payload,
    stem: `For an integer base b with 2 ≤ b ≤ ${state.maxBase}, the numeral (1${state.digit})_b is valid and the HCF of its decimal value with ${state.anchor} is ${state.hcf}. Find b.`,
    canonicalAnswer: answer, hiddenState: Object.freeze({ ...state }),
    componentEngines: Object.freeze(["POSITIONAL_BASE", "HCF_LCM"]), ablation,
    explanation: Object.freeze({
      standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1",
      fullDerivation: Object.freeze([
        `In base b, the digit ${state.digit} is legal only when ${state.digit} < b. Therefore the valid bases are {${state.validBases.join(", ")}}.`,
        `The decimal value of (1${state.digit})_b is 1×b + ${state.digit} = b + ${state.digit}.`,
        `Checking HCF(b + ${state.digit}, ${state.anchor}) = ${state.hcf} over the full base domain gives {${state.hcfBases.join(", ")}}.`,
        `Combining validity with the HCF condition leaves only b = ${answer}.`,
        `Without validity, ${state.hcfBases.length} algebraic base candidates remain; without the HCF condition, ${state.validBases.length} valid bases remain.`,
        `Verification: ${state.digit} < ${answer} and HCF(${Number(answer) + state.digit}, ${state.anchor}) = ${state.hcf}.`,
      ]),
      examShortcut: Object.freeze([
        `Convert symbolically first: (1${state.digit})_b = b + ${state.digit}.`,
        `Test the HCF condition only for bases b > ${state.digit}; the unique base is ${answer}.`,
      ]),
    }),
    mathematicalFingerprint: `P017|bases2-${state.maxBase}|1${state.digit}_b|gcd(value,${state.anchor})=${state.hcf}|b=${answer}`,
  }, [...state.validBases.slice(0, 3).map(String), ...state.hcfBases.slice(0, 3).map(String)]);
}

// P018 — terminal digit cycle plus a congruence on the exponent reconstructs n.
interface P018State {
  lo: number; hi: number; powerBase: number; terminalDigit: number; modulus: number; remainder: number;
  terminalSet: number[]; remainderSet: number[]; full: number[];
}
function buildP018States() {
  const states: P018State[] = [];
  for (let lo = 1; lo <= 20; lo += 1) {
    const hi = lo + 24, domain = ints(lo, hi);
    for (const powerBase of [2, 3, 4, 7, 8, 9]) {
      for (let terminalDigit = 0; terminalDigit <= 9; terminalDigit += 1) {
        const terminalSet = domain.filter((n) => unitDigitOfPower(powerBase, n) === terminalDigit);
        if (terminalSet.length < 2) continue;
        for (let modulus = 3; modulus <= 9; modulus += 1) for (let remainder = 0; remainder < modulus; remainder += 1) {
          const remainderSet = domain.filter((n) => n % modulus === remainder);
          const full = terminalSet.filter((n) => remainderSet.includes(n));
          if (remainderSet.length > 1 && full.length === 1) states.push({ lo, hi, powerBase, terminalDigit, modulus, remainder, terminalSet, remainderSet, full });
        }
      }
    }
  }
  return states;
}
const P018_STATES = buildP018States();
function terminalCycle(base: number) {
  const seen: number[] = [];
  for (let exponent = 1; exponent <= 8; exponent += 1) {
    const digit = unitDigitOfPower(base, exponent);
    if (seen.length > 0 && digit === seen[0]) break;
    seen.push(digit);
  }
  return seen;
}
function p018(seed: number): NumCp014Wave03Package {
  const state = P018_STATES[(seed * 37 - 1) % P018_STATES.length]!;
  const answer = String(state.full[0]!);
  const representation = representationOf(seed);
  const cycle = terminalCycle(state.powerBase);
  const payload = representationPayload(
    representation,
    `integer exponent n ∈ [${state.lo}, ${state.hi}]`,
    `unit digit of ${state.powerBase}^n is ${state.terminalDigit} → {${state.terminalSet.join(", ")}}`,
    `n ≡ ${state.remainder} (mod ${state.modulus}) → {${state.remainderSet.join(", ")}}`,
    `n = ${answer}`,
  );
  const ablation = makeAblation(
    ["TERMINAL_CYCLE", "REMAINDER"], state.full,
    { TERMINAL_CYCLE: state.remainderSet, REMAINDER: state.terminalSet }, answer,
  );
  return finish({
    checkpointId: "NUM-CP-014", temporaryPrototypeId: "NUM-CP014-PROT-018", seed,
    answerSemantic: "HIDDEN_EXPONENT", representation, representationPayload: payload,
    stem: `An integer exponent n lies from ${state.lo} to ${state.hi}. The units digit of ${state.powerBase}^n is ${state.terminalDigit}, and n leaves remainder ${state.remainder} when divided by ${state.modulus}. Find n.`,
    canonicalAnswer: answer, hiddenState: Object.freeze({ ...state, terminalCycle: Object.freeze(cycle) }),
    componentEngines: Object.freeze(["TERMINAL_CYCLE", "REMAINDER"]), ablation,
    explanation: Object.freeze({
      standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1",
      fullDerivation: Object.freeze([
        `The units digits of successive powers of ${state.powerBase} repeat in the cycle {${cycle.join(", ")}}.`,
        `Using that cycle over n ∈ [${state.lo}, ${state.hi}], the exponents giving units digit ${state.terminalDigit} are {${state.terminalSet.join(", ")}}.`,
        `The second clue is n ≡ ${state.remainder} (mod ${state.modulus}), whose interval solutions are {${state.remainderSet.join(", ")}}.`,
        `The two exponent lists intersect only at n = ${answer}.`,
        `Removing the terminal-cycle clue leaves ${state.remainderSet.length} exponents; removing the exponent-remainder clue leaves ${state.terminalSet.length}. Both are essential.`,
        `Verification: ${answer} mod ${state.modulus} = ${state.remainder}, and ${state.powerBase}^${answer} has units digit ${state.terminalDigit}.`,
      ]),
      examShortcut: Object.freeze([
        `Translate the units-digit condition into the exponent's cycle position, then combine that congruence with n ≡ ${state.remainder} (mod ${state.modulus}).`,
        `Within the stated interval, the unique common exponent is ${answer}.`,
      ]),
    }),
    mathematicalFingerprint: `P018|n${state.lo}-${state.hi}|unit(${state.powerBase}^n)=${state.terminalDigit}|nmod${state.modulus}=${state.remainder}|${answer}`,
  }, [...state.terminalSet.slice(0, 3).map(String), ...state.remainderSet.slice(0, 3).map(String)]);
}

export function generateNumCp014Wave03(prototypeId: NumCp014Wave03PrototypeId, rawSeed: number): NumCp014Wave03Package {
  const seed = seedOf(rawSeed);
  switch (prototypeId) {
    case "NUM-CP014-PROT-013": return p013(seed);
    case "NUM-CP014-PROT-014": return p014(seed);
    case "NUM-CP014-PROT-015": return p015(seed);
    case "NUM-CP014-PROT-016": return p016(seed);
    case "NUM-CP014-PROT-017": return p017(seed);
    case "NUM-CP014-PROT-018": return p018(seed);
  }
}
