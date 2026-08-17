import {
  generateSapCp005,
  type SapCp005Option,
  type SapCp005Package,
  type SapCp005PrototypeId,
} from "./runtime";
import {
  type SapCp005Wave2Package,
  type SapCp005Wave2PrototypeId,
} from "./runtime-wave2";
import {
  generateSapCp005Editorial as generateWave1V1,
  generateSapCp005Wave2Editorial,
} from "./editorial-runtime";

interface Rational { n: bigint; d: bigint; }

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x || 1n;
}

function rat(n: bigint | number, d: bigint | number = 1n): Rational {
  let numerator = BigInt(n);
  let denominator = BigInt(d);
  if (denominator === 0n) throw new Error("Zero denominator.");
  if (denominator < 0n) { numerator = -numerator; denominator = -denominator; }
  const divisor = gcd(numerator, denominator);
  return { n: numerator / divisor, d: denominator / divisor };
}

function format(value: Rational): string {
  return value.d === 1n ? value.n.toString() : `${value.n}/${value.d}`;
}

function positionOptions(
  correct: { value: string; analysis: string },
  wrong: readonly { value: string; misconceptionId: string; analysis: string }[],
  correctIndex: number,
): readonly SapCp005Option[] {
  const options: SapCp005Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push({ value: correct.value, isCorrect: true, misconceptionId: null, analysis: correct.analysis });
    } else {
      const option = wrong[wrongIndex++]!;
      options.push({ ...option, isCorrect: false });
    }
  }
  return Object.freeze(options);
}

function diagnosisOptions(correctIndex: number): readonly SapCp005Option[] {
  return positionOptions(
    {
      value: "Cancellation across addition is invalid",
      analysis: "This correctly identifies that cancellation is legal only for a factor of the complete numerator and denominator.",
    },
    [
      {
        value: "The whole fraction should be inverted first",
        misconceptionId: "UNNECESSARY_RECIPROCAL",
        analysis: "Inverting the complete fraction is not a valid response to the shown addition and would create a different expression.",
      },
      {
        value: "The value of the cancelled x/x term should be 0",
        misconceptionId: "COMMON_FACTOR_VALUE_ERROR",
        analysis: "A non-zero quantity divided by itself is 1, not 0; this does not address the actual illegal cancellation across a sum.",
      },
      {
        value: "There is no error; the cancellation is valid",
        misconceptionId: "ACCEPT_ILLEGAL_CANCELLATION",
        analysis: "A symbol may be cancelled only when it is a factor of the complete numerator and denominator, not merely one term of a sum.",
      },
    ],
    correctIndex,
  );
}

function diagnosisPackage(seed: number): SapCp005Package {
  const prototypeId = "SAP-CP005-PROT-ILLEGAL-CANCELLATION-DIAGNOSIS" as const;
  const pkg = generateSapCp005(prototypeId, seed);
  const d = pkg.oracle.data;
  const stem = `A student writes (${d.x} + ${d.y})/${d.x} = 1 + ${d.y} by cancelling ${d.x}. Which statement correctly identifies the first error?`;
  const options = diagnosisOptions(pkg.correctIndex);
  const errors: string[] = [];
  if (new Set(options.map((option) => option.value)).size !== 4) errors.push("Diagnosis options are not distinct.");
  if (options.filter((option) => option.isCorrect).length !== 1) errors.push("Diagnosis package does not have exactly one correct option.");
  if (options[pkg.correctIndex]?.value !== pkg.canonicalAnswer) errors.push("Diagnosis correct option is not answer-bound.");
  if (options.filter((option) => !option.isCorrect).some((option) => !option.misconceptionId || option.analysis.length < 40)) errors.push("Diagnosis distractor provenance is incomplete.");
  return Object.freeze({
    ...pkg,
    stem,
    options,
    explanation: Object.freeze({
      ...pkg.explanation,
      coreConcept: "Cancellation applies to common factors multiplying the whole numerator and denominator. A term inside a sum or difference cannot be cancelled by itself.",
    }),
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem, answer: pkg.canonicalAnswer, oracle: pkg.oracle }),
    generationIdentity: `${pkg.generationIdentity}:EDITORIAL-V2-DIAGNOSIS`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

function reciprocalChainPackage(seed: number): SapCp005Package {
  const prototypeId = "SAP-CP005-PROT-PRODUCT-OF-RECIPROCALS" as const;
  const pkg = generateSapCp005(prototypeId, seed);
  const pairIndex = (seed - 1) % 36;
  const start = 1 + (pairIndex % 9);
  const span = 4 + Math.floor(pairIndex / 9);
  const terminal = start + span;
  const answer = rat(start, terminal);
  const canonicalAnswer = format(answer);
  const factors = Array.from({ length: span }, (_, index) => {
    const numerator = start + index;
    return `${numerator}/${numerator + 1}`;
  });
  const stem = `Simplify ${factors.join(" × ")}.`;
  const wrong = [
    {
      value: format(rat(start, terminal - 1)),
      misconceptionId: "TELESCOPING_CHAIN_STOPS_EARLY",
      analysis: "This stops the displayed cancellation chain one fraction too early, so the previous denominator is incorrectly treated as the final endpoint.",
    },
    {
      value: format(rat(start, terminal + 1)),
      misconceptionId: "TELESCOPING_CHAIN_EXTENDS_ONE_TERM",
      analysis: "This behaves as though one extra consecutive fraction followed the displayed chain and therefore uses an endpoint that is not present.",
    },
    {
      value: format(rat(terminal, start)),
      misconceptionId: "TELESCOPING_ENDPOINTS_INVERTED",
      analysis: "The two surviving endpoints are identified but written in the opposite numerator-denominator order after the interior factors cancel.",
    },
  ] as const;
  const options = positionOptions(
    {
      value: canonicalAnswer,
      analysis: "This keeps the first numerator and final denominator after every interior factor has cancelled exactly once.",
    },
    wrong,
    pkg.correctIndex,
  );
  const oracle = Object.freeze({
    kind: prototypeId,
    data: Object.freeze({ start, span, terminal, editorialMode: 2 }),
  });
  const errors: string[] = [];
  if (new Set(options.map((option) => option.value)).size !== 4) errors.push("Reciprocal-chain options are not distinct.");
  if (options.filter((option) => option.isCorrect).length !== 1) errors.push("Reciprocal-chain package does not have exactly one correct option.");
  if (options[pkg.correctIndex]?.value !== canonicalAnswer) errors.push("Reciprocal-chain correct option is not answer-bound.");
  return Object.freeze({
    ...pkg,
    stem,
    canonicalAnswer,
    options,
    explanation: Object.freeze({
      coreConcept: "In a chained product such as 3/4 × 4/5 × 5/6, every interior integer appears once above and once below the fraction bar, so only the two endpoints survive.",
      steps: Object.freeze([
        `Write the product as (${Array.from({ length: span }, (_, index) => start + index).join("×")})/(${Array.from({ length: span }, (_, index) => start + index + 1).join("×")}).`,
        `Cancel the common interior factors from ${start + 1} through ${terminal - 1}. Only ${start}/${terminal} remains, which reduces to ${canonicalAnswer}.`,
      ]),
      finalAnswer: `Therefore, the answer is ${canonicalAnswer}.`,
      cancellationMap: Object.freeze([
        `Cancel each interior value from ${start + 1} through ${terminal - 1} between adjacent numerator and denominator positions.`,
        `Keep the first numerator ${start} and final denominator ${terminal}; then reduce ${start}/${terminal} if required.`,
      ]),
    }),
    oracle,
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem, answer: canonicalAnswer, oracle }),
    generationIdentity: `${prototypeId}:seed:${seed}:EDITORIAL-V2-BOUNDED:${start}:${span}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

function normaliseStem<T extends SapCp005Package | SapCp005Wave2Package>(pkg: T): T {
  if (pkg.stem.length >= 20) return pkg;
  const compact = pkg.stem.replace(/^Simplify\s*/i, "").replace(/^Evaluate\s*/i, "");
  const stem = `Find the value of ${compact}`;
  return Object.freeze({
    ...pkg,
    stem,
    canonicalPayloadKey: JSON.stringify({
      prototypeId: pkg.prototypeId,
      stem,
      answer: pkg.canonicalAnswer,
      oracle: pkg.oracle,
    }),
    generationIdentity: `${pkg.generationIdentity}:EXAM-STEM`,
  }) as T;
}

export function generateSapCp005Editorial(prototypeId: SapCp005PrototypeId, seed: number): SapCp005Package {
  if (prototypeId === "SAP-CP005-PROT-ILLEGAL-CANCELLATION-DIAGNOSIS") return diagnosisPackage(seed);
  if (prototypeId === "SAP-CP005-PROT-PRODUCT-OF-RECIPROCALS") return reciprocalChainPackage(seed);
  return normaliseStem(generateWave1V1(prototypeId, seed));
}

export function generateSapCp005Wave2EditorialV2(prototypeId: SapCp005Wave2PrototypeId, seed: number): SapCp005Wave2Package {
  return normaliseStem(generateSapCp005Wave2Editorial(prototypeId, seed));
}
