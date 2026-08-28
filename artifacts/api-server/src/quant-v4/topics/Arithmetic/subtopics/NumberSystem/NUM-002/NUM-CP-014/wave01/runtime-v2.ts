import {
  NUM_CP014_WAVE01_PROTOTYPE_IDS,
  generateNumCp014Wave01 as generateBaseWave01,
} from "./runtime.ts";
import type {
  NumCp014Wave01Option,
  NumCp014Wave01Package,
  NumCp014Wave01PrototypeId,
} from "./types.ts";

export { NUM_CP014_WAVE01_PROTOTYPE_IDS };

function divisorCount(n: number) {
  let count = 0;
  for (let d = 1; d <= n; d += 1) if (n % d === 0) count += 1;
  return count;
}

function integerCubeRoot(n: number) {
  for (let root = 1; root * root * root <= n; root += 1) {
    if (root * root * root === n) return root;
  }
  return null;
}

function isPerfectCube(n: number) {
  return integerCubeRoot(n) !== null;
}

function range(lo: number, hi: number) {
  return Array.from({ length: hi - lo + 1 }, (_, index) => lo + index);
}

interface CubeState {
  readonly lo: number;
  readonly hi: number;
  readonly tau: number;
  readonly target: number;
  readonly divisorCandidates: readonly number[];
  readonly cubeCandidates: readonly number[];
}

function buildCubeStates(): readonly CubeState[] {
  const states: CubeState[] = [];
  for (const width of [40, 60, 80, 100, 120, 150]) {
    for (let lo = 2; lo <= 497; lo += 5) {
      const hi = lo + width;
      const domain = range(lo, hi);
      const cubes = domain.filter(isPerfectCube);
      if (cubes.length <= 1) continue;
      const tauValues = [...new Set(cubes.map(divisorCount))];
      for (const tau of tauValues) {
        const divisorCandidates = domain.filter((n) => divisorCount(n) === tau);
        const full = divisorCandidates.filter((n) => cubes.includes(n));
        if (divisorCandidates.length > 1 && cubes.length > 1 && full.length === 1) {
          states.push(Object.freeze({
            lo,
            hi,
            tau,
            target: full[0]!,
            divisorCandidates: Object.freeze(divisorCandidates),
            cubeCandidates: Object.freeze(cubes),
          }));
        }
      }
    }
  }
  if (states.length < 3) throw new Error("CP014 P003 cube synthesis state pool is too thin.");
  return Object.freeze(states);
}

const CUBE_STATES = buildCubeStates();

function robustOptions(answer: number, a: readonly number[], b: readonly number[], seed: number) {
  const selected: Array<{ value: number; misconceptionId: string }> = [];
  const push = (value: number, misconceptionId: string) => {
    if (value === answer || value < 0 || selected.some((item) => item.value === value)) return;
    selected.push({ value, misconceptionId });
  };

  const aOnly = a.filter((value) => value !== answer);
  const bOnly = b.filter((value) => value !== answer);
  if (aOnly.length) push(aOnly[(seed - 1) % aOnly.length]!, "SATISFIES_DIVISOR_COUNT_ONLY");
  if (bOnly.length) push(bOnly[(seed * 3 - 1) % bOnly.length]!, "SATISFIES_PERFECT_CUBE_ONLY");
  for (const delta of [1, -1, 2, -2, 3, -3, 5, -5, 7, -7]) {
    push(answer + delta, "NEARBY_ARITHMETIC_DISTRACTOR");
    if (selected.length >= 3) break;
  }
  if (selected.length < 3) throw new Error("CP014 P003 could not construct three unique distractors.");

  const correctPosition = (seed - 1) % 4;
  const wrong = selected.slice(0, 3);
  const options: NumCp014Wave01Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    options.push(Object.freeze(index === correctPosition
      ? { value: String(answer), misconceptionId: "CORRECT" }
      : { value: String(wrong[wrongIndex]!.value), misconceptionId: wrong[wrongIndex++]!.misconceptionId }));
  }
  return Object.freeze(options);
}

function generateP003(seed: number): NumCp014Wave01Package {
  const state = CUBE_STATES[(seed * 29 - 1) % CUBE_STATES.length]!;
  const full = state.divisorCandidates.filter((n) => state.cubeCandidates.includes(n));
  if (full.length !== 1 || full[0] !== state.target) throw new Error("CP014 P003 full candidate set drift.");
  if (state.divisorCandidates.length <= 1 || state.cubeCandidates.length <= 1) throw new Error("CP014 P003 failed ablation admission.");

  const answer = String(state.target);
  const root = integerCubeRoot(state.target)!;
  const options = robustOptions(state.target, state.divisorCandidates, state.cubeCandidates, seed);
  const correctIndex = options.findIndex((option) => option.value === answer);

  return Object.freeze({
    checkpointId: "NUM-CP-014",
    temporaryPrototypeId: "NUM-CP014-PROT-003",
    taskKind: "DIVISOR_COUNT_PERFECT_POWER",
    seed,
    stem: `An integer n lies from ${state.lo} to ${state.hi}. It has exactly ${state.tau} positive divisors and is a perfect cube. Find n.`,
    options,
    correctIndex,
    canonicalAnswer: answer,
    verifierAnswer: answer,
    hiddenState: Object.freeze({
      lo: state.lo,
      hi: state.hi,
      tau: state.tau,
      target: state.target,
      divisorCandidates: state.divisorCandidates,
      cubeCandidates: state.cubeCandidates,
      cubeRoot: root,
      powerIndex: 3,
    }),
    componentEngines: Object.freeze(["DIVISOR_FUNCTION", "PERFECT_POWER"] as const),
    ablation: Object.freeze({
      componentA: "DIVISOR_FUNCTION",
      componentB: "PERFECT_POWER",
      fullCandidates: Object.freeze([answer]),
      withoutA: Object.freeze(state.cubeCandidates.map(String)),
      withoutB: Object.freeze(state.divisorCandidates.map(String)),
      componentANecessary: true,
      componentBNecessary: true,
    }),
    explanation: Object.freeze({
      standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1",
      fullDerivation: Object.freeze([
        `First apply the divisor-function condition across ${state.lo} ≤ n ≤ ${state.hi}. The values having exactly ${state.tau} positive divisors are {${state.divisorCandidates.join(", ")}}.`,
        `Independently list the perfect cubes in the same interval: {${state.cubeCandidates.join(", ")}}.`,
        `The divisor condition alone leaves ${state.divisorCandidates.length} candidates, and the cube condition alone leaves ${state.cubeCandidates.length} candidates. Therefore both engines are genuinely needed.`,
        `Their intersection is {${state.target}}, so n = ${state.target}.`,
        `Verification: ${root}³ = ${root} × ${root} × ${root} = ${state.target}, and direct divisor enumeration gives τ(${state.target}) = ${divisorCount(state.target)}.`,
      ]),
      examShortcut: Object.freeze([
        `List only the cubes in the interval, then test those few values for τ(n) = ${state.tau}.`,
        `Only ${state.target} satisfies both conditions.`,
      ]),
    }),
    mathematicalFingerprint: `P003V2|${state.lo}-${state.hi}|tau=${state.tau}|cube|n=${state.target}`,
    lifecycle: Object.freeze({
      permanentQlAllocated: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    }),
  });
}

export function generateNumCp014Wave01(prototypeId: NumCp014Wave01PrototypeId, rawSeed: number): NumCp014Wave01Package {
  const seed = Number.isFinite(rawSeed) && rawSeed > 0 ? Math.trunc(rawSeed) : 1;
  if (prototypeId === "NUM-CP014-PROT-003") return generateP003(seed);
  return generateBaseWave01(prototypeId, seed);
}
