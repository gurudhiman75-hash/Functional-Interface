import type {
  NumCp014Wave02Ablation,
  NumCp014Wave02Engine,
  NumCp014Wave02Package,
  NumCp014Wave02PrototypeId,
} from "./types.ts";

export const NUM_CP014_WAVE02_PROTOTYPE_IDS = Object.freeze([
  "NUM-CP014-PROT-007",
  "NUM-CP014-PROT-008",
  "NUM-CP014-PROT-009",
  "NUM-CP014-PROT-010",
  "NUM-CP014-PROT-011",
  "NUM-CP014-PROT-012",
] as const satisfies readonly NumCp014Wave02PrototypeId[]);

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
  return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
}
function gcd(a: number, b: number) {
  let x = Math.abs(a), y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x;
}
function isPrime(n: number) {
  if (!Number.isInteger(n) || n < 2) return false;
  for (let d = 2; d * d <= n; d += 1) if (n % d === 0) return false;
  return true;
}
function isSquare(n: number) {
  const r = Math.floor(Math.sqrt(n));
  return r * r === n;
}
function isCube(n: number) {
  for (let r = 1; r * r * r <= n; r += 1) if (r * r * r === n) return true;
  return false;
}
function solutionClass(count: number) {
  return count === 0 ? "NO_SOLUTION" : count === 1 ? "ONE_SOLUTION" : "MULTIPLE_SOLUTIONS";
}
function frozenStrings(values: readonly number[]) {
  return Object.freeze(values.map(String));
}

function makeOptions(answer: string, preferredWrong: readonly string[], seed: number) {
  const wrong: Array<{ value: string; misconceptionId: string }> = [];
  const push = (value: string, id: string) => {
    if (value === answer || wrong.some((item) => item.value === value)) return;
    wrong.push({ value, misconceptionId: id });
  };
  for (const value of preferredWrong) push(value, "ABLATION_ANSWER");
  if (/^-?\d+$/.test(answer)) {
    const n = Number(answer);
    for (const delta of [1, -1, 2, -2, 3, -3, 5, -5]) {
      push(String(n + delta), "NEARBY_NUMERIC");
      if (wrong.length >= 3) break;
    }
  } else {
    for (const value of ["NO_SOLUTION", "ONE_SOLUTION", "MULTIPLE_SOLUTIONS", "INDETERMINATE"]) push(value, "SOLUTION_CLASS_CONFUSION");
  }
  if (wrong.length < 3) throw new Error("CP014 Wave02 could not construct three distinct distractors.");
  const correctIndex = (seed - 1) % 4;
  const options: Array<{ value: string; misconceptionId: string }> = [];
  let wi = 0;
  for (let i = 0; i < 4; i += 1) {
    options.push(Object.freeze(i === correctIndex
      ? { value: answer, misconceptionId: "CORRECT" }
      : wrong[wi++]!));
  }
  return { options: Object.freeze(options), correctIndex };
}

function makeAblation(
  components: readonly NumCp014Wave02Engine[],
  fullCandidates: readonly number[] | readonly string[],
  removedCandidates: Readonly<Record<string, readonly number[] | readonly string[]>>,
  fullAnswer: string,
  removedAnswers: Readonly<Record<string, string>>,
): NumCp014Wave02Ablation {
  for (const component of components) {
    if (removedAnswers[component] === fullAnswer) throw new Error(`CP014 Wave02 rejected decorative component ${component}: answer unchanged by ablation.`);
  }
  const normalizedRemoved: Record<string, readonly string[]> = {};
  for (const [key, values] of Object.entries(removedCandidates)) normalizedRemoved[key] = Object.freeze(values.map(String));
  return Object.freeze({
    components: Object.freeze([...components]),
    fullCandidates: Object.freeze(fullCandidates.map(String)),
    componentRemovedCandidates: Object.freeze(normalizedRemoved),
    fullAnswer,
    componentRemovedAnswers: Object.freeze({ ...removedAnswers }),
    everyComponentChangesAnswer: true,
  });
}

function finish(
  base: Omit<NumCp014Wave02Package, "options" | "correctIndex" | "verifierAnswer" | "lifecycle">,
  wrong: readonly string[],
): NumCp014Wave02Package {
  const built = makeOptions(base.canonicalAnswer, wrong, base.seed);
  return Object.freeze({ ...base, ...built, verifierAnswer: base.canonicalAnswer, lifecycle });
}

// P007 — least optimum under perfect-square + remainder constraints.
interface SquareOptState { lo: number; hi: number; modulus: number; remainder: number; answer: number; squares: number[]; residue: number[]; full: number[]; }
function buildSquareOptStates() {
  const out: SquareOptState[] = [];
  for (let lo = 10; lo <= 245; lo += 5) for (const width of [60, 80, 100, 120]) {
    const hi = lo + width;
    const domain = ints(lo, hi);
    const squares = domain.filter(isSquare);
    if (squares.length < 3) continue;
    for (let modulus = 5; modulus <= 13; modulus += 1) for (let remainder = 0; remainder < modulus; remainder += 1) {
      const residue = domain.filter((n) => n % modulus === remainder);
      const full = squares.filter((n) => residue.includes(n));
      if (full.length >= 2 && Math.min(...squares) !== Math.min(...full) && Math.min(...residue) !== Math.min(...full)) {
        out.push({ lo, hi, modulus, remainder, answer: Math.min(...full), squares, residue, full });
      }
    }
  }
  return out;
}
const SQUARE_OPT_STATES = buildSquareOptStates();
function p007(seed: number): NumCp014Wave02Package {
  const s = SQUARE_OPT_STATES[(seed * 17 - 1) % SQUARE_OPT_STATES.length]!;
  const noSquareAnswer = String(Math.min(...s.residue));
  const noRemainderAnswer = String(Math.min(...s.squares));
  const answer = String(s.answer);
  const ablation = makeAblation(
    ["PERFECT_POWER", "REMAINDER"], s.full,
    { PERFECT_POWER: s.residue, REMAINDER: s.squares }, answer,
    { PERFECT_POWER: noSquareAnswer, REMAINDER: noRemainderAnswer },
  );
  return finish({
    checkpointId: "NUM-CP-014", temporaryPrototypeId: "NUM-CP014-PROT-007", seed,
    answerSemantic: "LEAST_VALUE",
    stem: `Find the least integer n from ${s.lo} to ${s.hi} that is a perfect square and leaves remainder ${s.remainder} when divided by ${s.modulus}.`,
    canonicalAnswer: answer,
    hiddenState: Object.freeze({ ...s }), ablation,
    explanation: Object.freeze({ standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1",
      fullDerivation: Object.freeze([
        `Perfect squares in the interval are {${s.squares.join(", ")}}.`,
        `Numbers leaving remainder ${s.remainder} modulo ${s.modulus} are {${s.residue.join(", ")}}.`,
        `Both conditions together leave {${s.full.join(", ")}}; the least common candidate is ${s.answer}.`,
        `If the square condition were removed, the least answer would be ${noSquareAnswer}; if the remainder condition were removed, it would be ${noRemainderAnswer}. Hence both conditions change the optimum.`,
        `Therefore the required least integer is ${s.answer}.`,
      ]),
      examShortcut: Object.freeze([`Test only the squares modulo ${s.modulus}.`, `The first square with remainder ${s.remainder} is ${s.answer}.`]),
    }),
    mathematicalFingerprint: `P007|${s.lo}-${s.hi}|least|square|mod${s.modulus}=${s.remainder}|${s.answer}`,
  }, [noSquareAnswer, noRemainderAnswer, String(s.full[1] ?? s.answer + 1)]);
}

// P008 — greatest optimum under HCF + prime-shift constraints.
interface HcfOptState { lo: number; hi: number; anchor: number; hcf: number; shift: number; answer: number; hcfSet: number[]; primeSet: number[]; full: number[]; }
function buildHcfOptStates() {
  const out: HcfOptState[] = [];
  for (const anchor of [30, 42, 60, 66, 70, 84, 90]) for (const hcf of [2, 3, 5, 6, 7, 10, 14, 15]) {
    if (anchor % hcf !== 0) continue;
    for (const shift of [-1, 1, 2]) for (let lo = 8; lo <= 48; lo += 4) {
      const hi = lo + 40, domain = ints(lo, hi);
      const hcfSet = domain.filter((n) => gcd(n, anchor) === hcf);
      const primeSet = domain.filter((n) => isPrime(n + shift));
      const full = hcfSet.filter((n) => primeSet.includes(n));
      if (full.length >= 2 && Math.max(...hcfSet) !== Math.max(...full) && Math.max(...primeSet) !== Math.max(...full)) {
        out.push({ lo, hi, anchor, hcf, shift, answer: Math.max(...full), hcfSet, primeSet, full });
      }
    }
  }
  return out;
}
const HCF_OPT_STATES = buildHcfOptStates();
function p008(seed: number): NumCp014Wave02Package {
  const s = HCF_OPT_STATES[(seed * 19 - 1) % HCF_OPT_STATES.length]!;
  const noHcf = String(Math.max(...s.primeSet)), noPrime = String(Math.max(...s.hcfSet)), answer = String(s.answer);
  const shifted = s.shift >= 0 ? `n + ${s.shift}` : `n - ${Math.abs(s.shift)}`;
  const ablation = makeAblation(["HCF_LCM", "PRIME_STRUCTURE"], s.full,
    { HCF_LCM: s.primeSet, PRIME_STRUCTURE: s.hcfSet }, answer,
    { HCF_LCM: noHcf, PRIME_STRUCTURE: noPrime });
  return finish({ checkpointId: "NUM-CP-014", temporaryPrototypeId: "NUM-CP014-PROT-008", seed, answerSemantic: "GREATEST_VALUE",
    stem: `Find the greatest integer n from ${s.lo} to ${s.hi} such that HCF(n, ${s.anchor}) = ${s.hcf} and ${shifted} is prime.`,
    canonicalAnswer: answer, hiddenState: Object.freeze({ ...s }), ablation,
    explanation: Object.freeze({ standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1",
      fullDerivation: Object.freeze([
        `The HCF condition gives {${s.hcfSet.join(", ")}}.`,
        `The prime condition gives {${s.primeSet.join(", ")}}.`,
        `Their common candidates are {${s.full.join(", ")}}, whose greatest value is ${s.answer}.`,
        `Removing the HCF condition changes the greatest answer to ${noHcf}; removing the prime condition changes it to ${noPrime}.`,
        `Hence both engines are essential and the answer is ${s.answer}.`,
      ]), examShortcut: Object.freeze([`Scan the HCF candidates downward from the top of the interval.`, `The first candidate for which ${shifted} is prime is ${s.answer}.`]), }),
    mathematicalFingerprint: `P008|${s.lo}-${s.hi}|greatest|gcd${s.anchor}=${s.hcf}|primeShift${s.shift}|${s.answer}`,
  }, [noHcf, noPrime, String(s.full.at(-2) ?? s.answer - 1)]);
}

// P009 — count all valid bases under validity + divisibility.
interface BaseCountState { hi: number; digit: number; divisor: number; valid: number[]; divisible: number[]; full: number[]; }
function buildBaseCountStates() {
  const out: BaseCountState[] = [];
  for (let hi = 8; hi <= 16; hi += 1) {
    const domain = ints(2, hi);
    for (let digit = 2; digit <= 9; digit += 1) {
      const valid = domain.filter((b) => digit < b);
      if (valid.length < 2) continue;
      for (let divisor = 2; divisor <= 9; divisor += 1) {
        const divisible = domain.filter((b) => (b + digit) % divisor === 0);
        const full = valid.filter((b) => divisible.includes(b));
        if (full.length >= 1 && valid.length !== full.length && divisible.length !== full.length) out.push({ hi, digit, divisor, valid, divisible, full });
      }
    }
  }
  return out;
}
const BASE_COUNT_STATES = buildBaseCountStates();
function p009(seed: number): NumCp014Wave02Package {
  const s = BASE_COUNT_STATES[(seed * 23 - 1) % BASE_COUNT_STATES.length]!;
  const answer = String(s.full.length), noBase = String(s.divisible.length), noDiv = String(s.valid.length);
  const ablation = makeAblation(["POSITIONAL_BASE", "DIVISIBILITY"], s.full,
    { POSITIONAL_BASE: s.divisible, DIVISIBILITY: s.valid }, answer,
    { POSITIONAL_BASE: noBase, DIVISIBILITY: noDiv });
  return finish({ checkpointId: "NUM-CP-014", temporaryPrototypeId: "NUM-CP014-PROT-009", seed, answerSemantic: "COUNT",
    stem: `For how many integer bases b with 2 ≤ b ≤ ${s.hi} is the numeral (1${s.digit})_b valid and its decimal value divisible by ${s.divisor}?`,
    canonicalAnswer: answer, hiddenState: Object.freeze({ ...s }), ablation,
    explanation: Object.freeze({ standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1",
      fullDerivation: Object.freeze([
        `Validity requires b > ${s.digit}, giving bases {${s.valid.join(", ")}}.`,
        `The decimal value is b + ${s.digit}. Divisibility by ${s.divisor} holds for bases {${s.divisible.join(", ")}} within the stated domain.`,
        `The valid-and-divisible bases are {${s.full.join(", ")}}. Their count is ${s.full.length}.`,
        `Ignoring validity would give count ${s.divisible.length}; ignoring divisibility would give count ${s.valid.length}. Both conditions therefore change the requested count.`,
        `Answer = ${s.full.length}.`,
      ]), examShortcut: Object.freeze([`Solve b ≡ ${(-s.digit % s.divisor + s.divisor) % s.divisor} (mod ${s.divisor}) and then impose b > ${s.digit}.`, `Count the surviving bases: ${s.full.length}.`]), }),
    mathematicalFingerprint: `P009|2-${s.hi}|count|1${s.digit}_b|div${s.divisor}|${s.full.length}`,
  }, [noBase, noDiv, String(s.full.length + 1)]);
}

// P010 — solution class, admitted only when answer class changes under either ablation.
interface TopologyState { lo: number; hi: number; modulus: number; remainder: number; cubes: number[]; residue: number[]; full: number[]; }
function buildTopologyStates() {
  const no: TopologyState[] = [], one: TopologyState[] = [];
  for (let lo = 2; lo <= 497; lo += 5) for (const width of [40, 60, 80, 100, 120]) {
    const hi = lo + width, domain = ints(lo, hi), cubes = domain.filter(isCube);
    if (cubes.length < 2) continue;
    for (let modulus = 4; modulus <= 15; modulus += 1) for (let remainder = 0; remainder < modulus; remainder += 1) {
      const residue = domain.filter((n) => n % modulus === remainder);
      const full = cubes.filter((n) => residue.includes(n));
      if (residue.length <= 1) continue;
      const state = { lo, hi, modulus, remainder, cubes, residue, full };
      if (full.length === 0) no.push(state);
      else if (full.length === 1) one.push(state);
    }
  }
  return { no, one };
}
const TOPOLOGY_STATES = buildTopologyStates();
function p010(seed: number): NumCp014Wave02Package {
  const mode = seed % 2 === 0 ? "NO_SOLUTION" : "ONE_SOLUTION";
  const pool = mode === "NO_SOLUTION" ? TOPOLOGY_STATES.no : TOPOLOGY_STATES.one;
  const s = pool[(seed * 31 - 1) % pool.length]!;
  const answer = solutionClass(s.full.length);
  const noCube = solutionClass(s.residue.length), noRemainder = solutionClass(s.cubes.length);
  if (answer === noCube || answer === noRemainder) throw new Error("CP014 P010 class-ablation failed.");
  const ablation = makeAblation(["PERFECT_POWER", "REMAINDER"], s.full,
    { PERFECT_POWER: s.residue, REMAINDER: s.cubes }, answer,
    { PERFECT_POWER: noCube, REMAINDER: noRemainder });
  return finish({ checkpointId: "NUM-CP-014", temporaryPrototypeId: "NUM-CP014-PROT-010", seed, answerSemantic: "SOLUTION_CLASS",
    stem: `How many-solution class applies to integers n from ${s.lo} to ${s.hi} that are perfect cubes and satisfy n ≡ ${s.remainder} (mod ${s.modulus})?`,
    canonicalAnswer: answer, hiddenState: Object.freeze({ ...s, mode: answer }), ablation,
    explanation: Object.freeze({ standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1",
      fullDerivation: Object.freeze([
        `Perfect cubes in the interval are {${s.cubes.join(", ")}}.`,
        `The residue condition gives {${s.residue.join(", ")}}.`,
        `Their intersection is {${s.full.join(", ") || "∅"}}, so the class is ${answer}.`,
        `Without the cube condition the class is ${noCube}; without the remainder condition it is ${noRemainder}. Thus each component changes the reported answer class.`,
        `Therefore the correct classification is ${answer}.`,
      ]), examShortcut: Object.freeze([`Reduce only the cubes modulo ${s.modulus}.`, `The number of surviving cubes gives class ${answer}.`]), }),
    mathematicalFingerprint: `P010|${s.lo}-${s.hi}|class|cube|mod${s.modulus}=${s.remainder}|${answer}`,
  }, [noCube, noRemainder, answer === "NO_SOLUTION" ? "ONE_SOLUTION" : "NO_SOLUTION"]);
}

// P011 — three-engine hidden reconstruction; every single-engine ablation restores ambiguity.
interface ThreeState { lo: number; hi: number; anchor: number; hcf: number; shift: number; modulus: number; remainder: number; target: number; a: number[]; b: number[]; c: number[]; full: number[]; noA: number[]; noB: number[]; noC: number[]; }
function buildThreeStates() {
  const out: ThreeState[] = [];
  for (let lo = 8; lo <= 76; lo += 4) {
    const hi = lo + 60, domain = ints(lo, hi);
    for (const anchor of [30, 42, 60, 66, 70, 84, 90]) for (const hcf of [2, 3, 5, 6, 7, 10, 14, 15]) {
      if (anchor % hcf !== 0) continue;
      const a = domain.filter((n) => gcd(n, anchor) === hcf);
      if (a.length < 2) continue;
      for (const shift of [-1, 1, 2]) {
        const b = domain.filter((n) => isPrime(n + shift));
        if (b.length < 2) continue;
        for (let modulus = 4; modulus <= 12; modulus += 1) for (let remainder = 0; remainder < modulus; remainder += 1) {
          const c = domain.filter((n) => n % modulus === remainder);
          const full = domain.filter((n) => a.includes(n) && b.includes(n) && c.includes(n));
          if (full.length !== 1) continue;
          const noA = domain.filter((n) => b.includes(n) && c.includes(n));
          const noB = domain.filter((n) => a.includes(n) && c.includes(n));
          const noC = domain.filter((n) => a.includes(n) && b.includes(n));
          if (noA.length > 1 && noB.length > 1 && noC.length > 1) out.push({ lo, hi, anchor, hcf, shift, modulus, remainder, target: full[0]!, a, b, c, full, noA, noB, noC });
        }
      }
    }
  }
  return out;
}
const THREE_STATES = buildThreeStates();
function p011(seed: number): NumCp014Wave02Package {
  const s = THREE_STATES[(seed * 37 - 1) % THREE_STATES.length]!, answer = String(s.target);
  const ablation = makeAblation(["HCF_LCM", "PRIME_STRUCTURE", "REMAINDER"], s.full,
    { HCF_LCM: s.noA, PRIME_STRUCTURE: s.noB, REMAINDER: s.noC }, answer,
    { HCF_LCM: "MULTIPLE_SOLUTIONS", PRIME_STRUCTURE: "MULTIPLE_SOLUTIONS", REMAINDER: "MULTIPLE_SOLUTIONS" });
  const shifted = s.shift >= 0 ? `n + ${s.shift}` : `n - ${Math.abs(s.shift)}`;
  return finish({ checkpointId: "NUM-CP-014", temporaryPrototypeId: "NUM-CP014-PROT-011", seed, answerSemantic: "HIDDEN_NUMBER",
    stem: `An integer n lies from ${s.lo} to ${s.hi}. HCF(n, ${s.anchor}) = ${s.hcf}, ${shifted} is prime, and n leaves remainder ${s.remainder} when divided by ${s.modulus}. Find n.`,
    canonicalAnswer: answer, hiddenState: Object.freeze({ ...s }), ablation,
    explanation: Object.freeze({ standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1",
      fullDerivation: Object.freeze([
        `HCF candidates are {${s.a.join(", ")}}.`, `Prime-shift candidates are {${s.b.join(", ")}}.`, `Remainder candidates are {${s.c.join(", ")}}.`,
        `All three filters intersect only at ${s.target}.`,
        `Removing HCF leaves {${s.noA.join(", ")}}; removing primality leaves {${s.noB.join(", ")}}; removing the remainder leaves {${s.noC.join(", ")}}. Each ablation restores multiple solutions.`,
        `Therefore n = ${s.target}.`,
      ]), examShortcut: Object.freeze([`Start from the smallest candidate list and test the other two conditions.`, `Only ${s.target} survives all three.`]), }),
    mathematicalFingerprint: `P011|${s.lo}-${s.hi}|gcd${s.anchor}=${s.hcf}|prime${s.shift}|mod${s.modulus}=${s.remainder}|${s.target}`,
  }, [String(s.noA[0]), String(s.noB[0]), String(s.noC[0])]);
}

// P012 — complete ordered digit-pair count via divisibility + remainder elimination grid.
function p012(seed: number): NumCp014Wave02Package {
  const divisor = [4, 8][seed % 2]!, modulus = [7, 9, 11][(seed - 1) % 3]!, remainder = (seed * 5) % modulus;
  const pairs = Array.from({ length: 100 }, (_, code) => ({ x: Math.floor(code / 10), y: code % 10, n: 500 + code }));
  const a = pairs.filter((p) => p.n % divisor === 0);
  const b = pairs.filter((p) => p.n % modulus === remainder);
  const full = a.filter((p) => b.some((q) => q.n === p.n));
  const encode = (items: typeof pairs) => items.map((p) => `${p.x}${p.y}`);
  const answer = String(full.length), noDivisibility = String(b.length), noRemainder = String(a.length);
  if (full.length === 0 || answer === noDivisibility || answer === noRemainder) return p012(seed + 1);
  const ablation = makeAblation(["DIVISIBILITY", "REMAINDER"], encode(full),
    { DIVISIBILITY: encode(b), REMAINDER: encode(a) }, answer,
    { DIVISIBILITY: noDivisibility, REMAINDER: noRemainder });
  return finish({ checkpointId: "NUM-CP-014", temporaryPrototypeId: "NUM-CP014-PROT-012", seed, answerSemantic: "COUNT",
    stem: `How many ordered digit pairs (x, y), where 0 ≤ x,y ≤ 9, make the number 5xy divisible by ${divisor} and leave remainder ${remainder} when divided by ${modulus}?`,
    canonicalAnswer: answer,
    hiddenState: Object.freeze({ divisor, modulus, remainder, divisibilityPairs: Object.freeze(encode(a)), remainderPairs: Object.freeze(encode(b)), fullPairs: Object.freeze(encode(full)) }), ablation,
    explanation: Object.freeze({ standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1",
      fullDerivation: Object.freeze([
        `Enumerating the two-digit endings xy that make 5xy divisible by ${divisor} gives {${encode(a).join(", ")}}.`,
        `Independently, the endings satisfying 5xy ≡ ${remainder} (mod ${modulus}) are {${encode(b).join(", ")}}.`,
        `The common ordered pairs are {${encode(full).join(", ")}}.`,
        `Hence the complete solution count is ${full.length}.`,
        `If divisibility were removed the count would be ${b.length}; if the remainder condition were removed it would be ${a.length}. Both conditions change the requested count.`,
      ]), examShortcut: Object.freeze([`Generate only endings allowed by divisibility by ${divisor}, then test those modulo ${modulus}.`, `There are ${full.length} survivors.`]), }),
    mathematicalFingerprint: `P012|5xy|div${divisor}|mod${modulus}=${remainder}|count=${full.length}`,
  }, [noDivisibility, noRemainder, String(full.length + 1)]);
}

export function generateNumCp014Wave02(prototypeId: NumCp014Wave02PrototypeId, rawSeed: number): NumCp014Wave02Package {
  const seed = seedOf(rawSeed);
  switch (prototypeId) {
    case "NUM-CP014-PROT-007": return p007(seed);
    case "NUM-CP014-PROT-008": return p008(seed);
    case "NUM-CP014-PROT-009": return p009(seed);
    case "NUM-CP014-PROT-010": return p010(seed);
    case "NUM-CP014-PROT-011": return p011(seed);
    case "NUM-CP014-PROT-012": return p012(seed);
  }
}
