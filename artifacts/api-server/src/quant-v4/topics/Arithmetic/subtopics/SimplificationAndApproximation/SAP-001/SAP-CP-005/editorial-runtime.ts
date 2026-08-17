import {
  generateSapCp005,
  type SapCp005Option,
  type SapCp005Package,
  type SapCp005PrototypeId,
} from "./runtime";
import {
  generateSapCp005Wave2,
  type SapCp005Wave2Package,
  type SapCp005Wave2PrototypeId,
} from "./runtime-wave2";

interface Rational {
  n: bigint;
  d: bigint;
}

interface WrongSpec {
  value: Rational;
  misconceptionId: string;
  analysis: string;
}

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
  if (denominator < 0n) {
    numerator = -numerator;
    denominator = -denominator;
  }
  const divisor = gcd(numerator, denominator);
  return { n: numerator / divisor, d: denominator / divisor };
}

function add(a: Rational, b: Rational): Rational {
  return rat(a.n * b.d + b.n * a.d, a.d * b.d);
}

function mul(a: Rational, b: Rational): Rational {
  return rat(a.n * b.n, a.d * b.d);
}

function div(a: Rational, b: Rational): Rational {
  if (b.n === 0n) throw new Error("Division by zero.");
  return rat(a.n * b.d, a.d * b.n);
}

function format(value: Rational): string {
  return value.d === 1n ? value.n.toString() : `${value.n}/${value.d}`;
}

function parse(value: string): Rational {
  if (value.includes("/")) {
    const [n, d] = value.split("/");
    return rat(BigInt(n!), BigInt(d!));
  }
  return rat(BigInt(value));
}

function factorial(n: number): bigint {
  let result = 1n;
  for (let value = 2; value <= n; value += 1) result *= BigInt(value);
  return result;
}

function numericOptions(
  answer: Rational,
  specs: readonly WrongSpec[],
  correctIndex: number,
): readonly SapCp005Option[] {
  const answerText = format(answer);
  const seen = new Set<string>([answerText]);
  const wrong: WrongSpec[] = [];

  for (const spec of specs) {
    const value = format(spec.value);
    if (spec.value.n <= 0n || seen.has(value)) continue;
    seen.add(value);
    wrong.push(spec);
  }

  const fallback: readonly WrongSpec[] = [
    {
      value: answer.n === 0n ? rat(2) : rat(answer.d, answer.n),
      misconceptionId: "RECIPROCAL_AFTER_REDUCTION",
      analysis: "This reverses the final numerator and denominator after the structural reduction has already fixed their correct positions.",
    },
    {
      value: mul(answer, rat(2)),
      misconceptionId: "ONE_FACTOR_LEFT_UNCANCELLED",
      analysis: "This leaves an extra factor of 2 in the result instead of cancelling every complete common factor that the expression permits.",
    },
    {
      value: div(answer, rat(2)),
      misconceptionId: "ONE_FACTOR_OVER_CANCELLED",
      analysis: "This removes one factor too many, effectively halving the exact value after the valid cancellation steps are finished.",
    },
    {
      value: add(answer, rat(1)),
      misconceptionId: "FINAL_ARITHMETIC_SLIP",
      analysis: "This is a nearby positive value produced by an arithmetic slip after the correct structural simplification has been identified.",
    },
    {
      value: add(answer, rat(2)),
      misconceptionId: "FINAL_ARITHMETIC_SLIP",
      analysis: "This is a nearby positive value produced by an arithmetic slip after the correct structural simplification has been identified.",
    },
  ];

  for (const spec of fallback) {
    if (wrong.length >= 3) break;
    const value = format(spec.value);
    if (spec.value.n <= 0n || seen.has(value)) continue;
    seen.add(value);
    wrong.push(spec);
  }

  if (wrong.length < 3) throw new Error(`Unable to build three positive distinct distractors for ${answerText}.`);

  const options: SapCp005Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push({
        value: answerText,
        isCorrect: true,
        misconceptionId: null,
        analysis: "This value follows from the complete legal cancellation map and preserves the exact value of the original expression.",
      });
    } else {
      const spec = wrong[wrongIndex++]!;
      options.push({
        value: format(spec.value),
        isCorrect: false,
        misconceptionId: spec.misconceptionId,
        analysis: spec.analysis,
      });
    }
  }
  return Object.freeze(options);
}

function categoricalOptions(
  correct: string,
  correctIndex: number,
  specs: readonly { value: string; misconceptionId: string; analysis: string }[],
): readonly SapCp005Option[] {
  if (specs.length !== 3) throw new Error("Categorical editorial options require exactly three distractors.");
  const options: SapCp005Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push({
        value: correct,
        isCorrect: true,
        misconceptionId: null,
        analysis: "This correctly identifies the mathematically valid structural decision for the displayed expression.",
      });
    } else {
      const spec = specs[wrongIndex++]!;
      options.push({ value: spec.value, isCorrect: false, misconceptionId: spec.misconceptionId, analysis: spec.analysis });
    }
  }
  return Object.freeze(options);
}

const CORE: Record<SapCp005PrototypeId | SapCp005Wave2PrototypeId, string> = {
  "SAP-CP005-PROT-MULTI-FRACTION-CHAIN": "In a product of several fractions, combine the factors conceptually and cancel only complete numerator-denominator factors before multiplying what survives.",
  "SAP-CP005-PROT-FACTOR-EXTRACTION-CANCEL": "When the common factors are hidden inside composite numbers, factor the useful numbers first; the cancellation becomes visible without creating large products.",
  "SAP-CP005-PROT-RATIO-OF-PRODUCTS": "A ratio of products should be simplified factor by factor. Identical factors in the numerator and denominator may be cancelled before any multiplication.",
  "SAP-CP005-PROT-CONSECUTIVE-PRODUCT-RATIO": "When the denominator repeats the tail of a consecutive product in the numerator, cancel the entire repeated tail and keep only the unmatched factor.",
  "SAP-CP005-PROT-LONG-FACTORIAL-RATIO": "For a factorial ratio, expand only the larger factorial down to the smaller factorial. The shared factorial block then cancels exactly.",
  "SAP-CP005-PROT-PRODUCT-OF-RECIPROCALS": "In a chained product such as 1/2 × 2/3 × 3/4, every interior integer appears once above and once below the fraction bar, so only the endpoints survive.",
  "SAP-CP005-PROT-DIFFERENCE-OF-SQUARES": "Use a² − b² = (a−b)(a+b) when one of those factors appears in the denominator. Factor first, then cancel the complete common factor.",
  "SAP-CP005-PROT-NUMERIC-CONJUGATE-PRODUCT": "A conjugate product (a+b)(a−b) equals a²−b². This avoids multiplying two larger numbers separately and then combining them.",
  "SAP-CP005-PROT-NESTED-RECIPROCAL-CHAIN": "Keep the inner division grouped. Dividing by a fraction means multiplying by its reciprocal; changing the grouping changes the value.",
  "SAP-CP005-PROT-TELESCOPING-SUM": "In a bounded telescoping sum, adjacent positive and negative terms cancel in pairs. Evaluate the surviving endpoint terms only after verifying the cancellation pattern.",
  "SAP-CP005-PROT-TELESCOPING-PRODUCT": "In a telescoping product of consecutive ratios, each interior factor cancels with its neighbour, leaving only the first denominator and final numerator.",
  "SAP-CP005-PROT-ONE-PLUS-MINUS-CHAIN": "Convert each (1−1/n)(1+1/n) pair to (n−1)(n+1)/n². The resulting consecutive factors then cancel across the complete product.",
  "SAP-CP005-PROT-MISSING-FACTOR-CANCELLATION": "Cancel the known common factor first. The remaining one-step equality reveals the missing factor without introducing unnecessary algebra.",
  "SAP-CP005-PROT-ILLEGAL-CANCELLATION-DIAGNOSIS": "Cancellation applies to common factors multiplying the whole numerator and denominator. A term inside a sum or difference cannot be cancelled by itself.",
  "SAP-CP005-PROT-COMMON-FACTOR-BEFORE-MULTIPLY": "Reduce a visible common factor before multiplying by the remaining number. This keeps intermediate arithmetic small while preserving the exact value.",
  "SAP-CP005-PROT-REPEATED-COMMON-FACTOR-BLOCKS": "Treat an identical repeated product as one complete factor block. Cancel that block first, then simplify only the factors that remain.",
  "SAP-CP005-PROT-SYMMETRIC-FRACTION-PAIR": "For a/b + b/a, combine the pair as (a²+b²)/(ab). Compare that exact structure with the divisor before doing any large arithmetic.",
  "SAP-CP005-PROT-REPEATED-BLOCK-COMPRESSION": "A repeated multiplier in every term of a numerator sum must first be factored from the whole numerator. Only then may it cancel with the denominator.",
  "SAP-CP005-PROT-BEST-FIRST-CANCELLATION": "When several legal routes exist, the best first step is the one that removes a complete visible common factor before larger intermediate products are formed.",
  "SAP-CP005-PROT-RAW-VS-STRUCTURAL-ROUTE": "Exact multiplication-first and legal cancellation-first routes must agree. The structural route is preferred when it reaches the same value with smaller intermediate arithmetic.",
};

function validateOptions(options: readonly SapCp005Option[], answer: string, correctIndex: number): readonly string[] {
  const errors: string[] = [];
  if (options.length !== 4) errors.push("Editorial package must contain four options.");
  if (new Set(options.map((option) => option.value)).size !== 4) errors.push("Editorial options must be distinct.");
  if (options.filter((option) => option.isCorrect).length !== 1) errors.push("Editorial package must contain exactly one correct option.");
  if (options[correctIndex]?.value !== answer) errors.push("Editorial correct option is not answer-bound.");
  if (options.filter((option) => !option.isCorrect).some((option) => !option.misconceptionId || option.analysis.length < 40)) errors.push("Editorial distractor provenance is incomplete.");
  return Object.freeze(errors);
}

function editorialiseWave1(pkg: SapCp005Package): SapCp005Package {
  const d = pkg.oracle.data;
  let stem = pkg.stem;
  let answer = parse(pkg.canonicalAnswer);
  let steps = [...pkg.explanation.steps];
  let map = [...pkg.explanation.cancellationMap];
  let oracle = pkg.oracle;
  let specs: WrongSpec[] = [];

  switch (pkg.prototypeId) {
    case "SAP-CP005-PROT-MULTI-FRACTION-CHAIN":
      specs = [
        { value: rat(d.b!, d.a!), misconceptionId: "RECIPROCAL_FINAL_RATIO", analysis: "This reverses the two surviving endpoint factors after the valid cross-cancellation has already fixed their positions." },
        { value: rat(d.a! * d.x!, d.b! * d.z!), misconceptionId: "INCOMPLETE_CHAIN_CANCELLATION", analysis: "This leaves part of the first-to-middle chain uncancelled, so an extra x/z factor remains in the result." },
        { value: rat(d.a! * d.z!, d.b! * d.x!), misconceptionId: "CANCELLATION_DIRECTION_MIXED", analysis: "This pairs the outer factors in the wrong direction and leaves z/x instead of cancelling the complete chain." },
      ];
      break;

    case "SAP-CP005-PROT-FACTOR-EXTRACTION-CANCEL": {
      const r = 2 + (pkg.seed % 5);
      const s = 3 + ((pkg.seed * 3) % 7);
      const left = d.p! * r;
      const right = d.q! * s;
      stem = `Simplify (${left} × ${s}) / (${right} × ${r}).`;
      oracle = Object.freeze({ kind: pkg.oracle.kind, data: Object.freeze({ ...d, r, s, left, right, editorialMode: 1 }) });
      steps = [
        `${left} = ${d.p} × ${r} and ${right} = ${d.q} × ${s}.`,
        `So the expression becomes [${d.p}×${r}×${s}]/[${d.q}×${s}×${r}]. Cancel ${r} and ${s}.`,
        `${d.p}/${d.q} = (${d.k}×${d.m})/(${d.k}×${d.n}); cancel ${d.k} to get ${format(answer)}.`,
      ];
      map = [`Extract ${r} from ${left} and ${s} from ${right}.`, `Cancel the exposed ${r} and ${s}, then cancel the common factor ${d.k} from ${d.p}/${d.q}.`];
      specs = [
        { value: rat(d.p!, d.n!), misconceptionId: "COMMON_FACTOR_REMOVED_FROM_DENOMINATOR_ONLY", analysis: "This removes the shared factor from the denominator side without removing the same factor from the numerator, changing the fraction's value." },
        { value: rat(d.m!, d.q!), misconceptionId: "COMMON_FACTOR_REMOVED_FROM_NUMERATOR_ONLY", analysis: "This removes the shared factor from the numerator side only, so the cancellation is not value-preserving." },
        { value: rat(d.n!, d.m!), misconceptionId: "REDUCED_FRACTION_INVERTED", analysis: "The hidden common factors are found correctly, but the final reduced numerator and denominator are then reversed." },
      ];
      break;
    }

    case "SAP-CP005-PROT-RATIO-OF-PRODUCTS":
      steps = ["Treat the division as one ratio of the two products.", `Cancel the repeated factors ${d.x} and ${d.y}; the ratio becomes ${d.a}/${d.b}.`, `Reduce that surviving ratio if necessary: ${d.a}/${d.b} = ${format(answer)}.`];
      specs = [
        { value: rat(d.b!, d.a!), misconceptionId: "SURVIVING_RATIO_INVERTED", analysis: "The repeated product factors are cancelled, but the two surviving factors are reversed at the final step." },
        { value: rat(d.a! * d.x!, d.b!), misconceptionId: "ONE_REPEATED_FACTOR_LEFT", analysis: "This cancels one repeated factor but mistakenly leaves the other repeated numerator factor in the result." },
        { value: rat(d.a!, d.b! * d.y!), misconceptionId: "EXTRA_DENOMINATOR_FACTOR_LEFT", analysis: "This leaves one repeated denominator factor after cancellation instead of removing the complete matching product." },
      ];
      break;

    case "SAP-CP005-PROT-CONSECUTIVE-PRODUCT-RATIO":
      specs = [
        { value: rat(d.n! - 1), misconceptionId: "FIRST_SURVIVING_FACTOR_DROPPED", analysis: "This cancels the leading numerator factor as well and incorrectly keeps the next consecutive integer as the result." },
        { value: rat(d.n! + 1), misconceptionId: "CONSECUTIVE_ENDPOINT_SHIFT", analysis: "This shifts the surviving endpoint one place upward instead of keeping the unmatched leading factor in the numerator." },
        { value: rat(d.n! * (d.n! - 1)), misconceptionId: "ONE_DENOMINATOR_FACTOR_NOT_CANCELLED", analysis: "This leaves one extra consecutive factor in the numerator after the common tail should have cancelled completely." },
      ];
      break;

    case "SAP-CP005-PROT-LONG-FACTORIAL-RATIO": {
      stem = `Simplify ${d.n}! / ${d.n! - d.k!}!.`;
      const last = d.n! - d.k! + 1;
      specs = [
        { value: div(answer, rat(last)), misconceptionId: "FACTORIAL_RATIO_OMITS_LAST_FACTOR", analysis: "This stops the descending factorial expansion one factor too early and omits the final factor required before the denominator factorial appears." },
        { value: mul(answer, rat(d.n! - d.k!)), misconceptionId: "FACTORIAL_RATIO_INCLUDES_EXTRA_FACTOR", analysis: "This expands one factor too far and includes a factor that already belongs to the denominator factorial block." },
        { value: rat(factorial(d.k!)), misconceptionId: "FACTORIAL_OF_INPUT_DIFFERENCE", analysis: "This takes the factorial of the numerical difference instead of cancelling the common factorial block in the quotient." },
      ];
      break;
    }

    case "SAP-CP005-PROT-PRODUCT-OF-RECIPROCALS":
      stem = pkg.stem.replace("Simplify the reciprocal product ", "Simplify ");
      specs = [
        { value: rat(1, d.n!), misconceptionId: "TELESCOPING_PRODUCT_STOPS_EARLY", analysis: "This stops the product one fraction too early, so the previous denominator is incorrectly treated as the final endpoint." },
        { value: rat(1, d.n! + 2), misconceptionId: "TELESCOPING_PRODUCT_EXTENDS_ONE_TERM", analysis: "This behaves as though one extra consecutive reciprocal factor were present beyond the displayed final fraction." },
        { value: rat(d.n! + 1), misconceptionId: "TELESCOPING_ENDPOINTS_INVERTED", analysis: "The correct endpoint cancellation is recognised, but the surviving numerator and denominator are reversed." },
      ];
      break;

    case "SAP-CP005-PROT-DIFFERENCE-OF-SQUARES":
      specs = [
        { value: rat(d.x! - d.y!), misconceptionId: "KEEPS_CANCELLED_DIFFERENCE_FACTOR", analysis: "This keeps the factor x−y as the result instead of cancelling it and retaining the other factor x+y." },
        { value: rat(d.x! * d.x! - d.y! * d.y!), misconceptionId: "DENOMINATOR_NOT_APPLIED", analysis: "The numerator difference of squares is evaluated, but the displayed denominator is then ignored completely." },
        { value: rat(d.x! * d.x! - d.y!, d.x! - d.y!), misconceptionId: "SECOND_TERM_NOT_SQUARED", analysis: "This uses x²−y in the numerator instead of x²−y² before carrying out the division." },
      ];
      break;

    case "SAP-CP005-PROT-NUMERIC-CONJUGATE-PRODUCT":
      stem = `Evaluate (${d.x} + ${d.y})(${d.x} − ${d.y}).`;
      specs = [
        { value: rat(d.x! * d.x! + d.y! * d.y!), misconceptionId: "CONJUGATE_SIGN_CHANGED_TO_PLUS", analysis: "This remembers the squared terms but uses a plus sign between them instead of the required difference a²−b²." },
        { value: rat((d.x! - d.y!) * (d.x! - d.y!)), misconceptionId: "CONJUGATE_AS_SQUARE_OF_DIFFERENCE", analysis: "This replaces (a+b)(a−b) by (a−b)², which loses the effect of the positive conjugate factor." },
        { value: rat(d.x! * d.x! - d.y!), misconceptionId: "SECOND_TERM_NOT_SQUARED", analysis: "This squares the first term but subtracts the second term itself instead of subtracting its square." },
      ];
      break;

    case "SAP-CP005-PROT-NESTED-RECIPROCAL-CHAIN":
      specs = [
        { value: rat(d.x!, d.y! * d.z!), misconceptionId: "NESTED_DIVISION_READ_LEFT_TO_RIGHT", analysis: "This treats x ÷ (y ÷ z) as though it were (x ÷ y) ÷ z, changing the grouping shown by the brackets." },
        { value: rat(d.x! * d.y!, d.z!), misconceptionId: "INNER_FRACTION_NOT_RECIPROCATED", analysis: "This multiplies by y/z after the inner division instead of multiplying by its reciprocal z/y." },
        { value: rat(d.y!, d.x! * d.z!), misconceptionId: "WHOLE_RESULT_RECIPROCATED", analysis: "The nested structure is processed, but the final ratio is inverted after the correct grouped division should be complete." },
      ];
      break;

    case "SAP-CP005-PROT-TELESCOPING-SUM":
      specs = [
        { value: add(rat(1, d.start!), rat(1, d.end! + 1)), misconceptionId: "TELESCOPING_ENDPOINT_SIGN_ERROR", analysis: "The correct two endpoints are retained, but the final negative endpoint is added instead of subtracted." },
        { value: add(rat(1, d.start!), rat(-1, d.end!)), misconceptionId: "TELESCOPING_WRONG_FINAL_ENDPOINT", analysis: "The cancellation is recognised, but 1/end is used as the last surviving negative term instead of 1/(end+1)." },
        { value: add(rat(1, d.start! + 1), rat(-1, d.end! + 1)), misconceptionId: "TELESCOPING_WRONG_INITIAL_ENDPOINT", analysis: "The first positive endpoint is cancelled one step too far, so the chain incorrectly begins at 1/(start+1)." },
      ];
      break;

    case "SAP-CP005-PROT-TELESCOPING-PRODUCT":
      specs = [
        { value: rat(d.end!, d.start!), misconceptionId: "TELESCOPING_FINAL_FACTOR_DROPPED", analysis: "This cancels the final numerator as though another denominator followed it, so the endpoint is one factor too small." },
        { value: rat(d.end! + 1, d.start! + 1), misconceptionId: "TELESCOPING_FIRST_FACTOR_DROPPED", analysis: "This cancels the first denominator even though there is no preceding numerator available to remove it." },
        { value: rat(d.start!, d.end! + 1), misconceptionId: "TELESCOPING_ENDPOINTS_INVERTED", analysis: "The surviving endpoints are identified correctly but then written in the opposite numerator-denominator order." },
      ];
      break;

    case "SAP-CP005-PROT-ONE-PLUS-MINUS-CHAIN": {
      const start = d.start!;
      const end = d.end!;
      specs = [
        { value: rat((start - 1) * end, start * (end - 1)), misconceptionId: "FINAL_CONJUGATE_PAIR_OMITTED", analysis: "This telescopes correctly only up to the penultimate n-value and therefore omits the final displayed conjugate pair." },
        { value: rat(start * (end + 1), (start + 1) * end), misconceptionId: "FIRST_CONJUGATE_PAIR_OMITTED", analysis: "This starts the structural product one pair too late, so the first displayed conjugate pair is incorrectly discarded." },
        { value: rat(answer.d, answer.n), misconceptionId: "TELESCOPED_PRODUCT_INVERTED", analysis: "The endpoint structure is found, but the final reduced fraction is inverted after the cancellation is complete." },
      ];
      break;
    }

    case "SAP-CP005-PROT-MISSING-FACTOR-CANCELLATION":
      specs = [
        { value: rat(d.target! * d.x!), misconceptionId: "WRONG_FACTOR_USED_AFTER_CANCELLATION", analysis: "This multiplies the target by the factor that should cancel, instead of using the denominator that remains after cancellation." },
        { value: rat(d.target!, d.y!), misconceptionId: "INVERSE_MISSING_FACTOR_OPERATION", analysis: "After reaching □/y = target, this divides by y rather than multiplying both sides by y." },
        { value: rat(d.y!, d.target!), misconceptionId: "MISSING_FACTOR_RATIO_INVERTED", analysis: "This reverses the final relation between the surviving denominator and the target value." },
      ];
      break;

    case "SAP-CP005-PROT-ILLEGAL-CANCELLATION-DIAGNOSIS": {
      const correct = "Cancellation across addition is invalid";
      const options = categoricalOptions(correct, pkg.correctIndex, [
        { value: "The whole fraction should be inverted first", misconceptionId: "UNNECESSARY_RECIPROCAL", analysis: "Inverting the complete fraction is not a valid response to the shown addition and would create a different expression." },
        { value: "The value of the cancelled x/x term should be 0", misconceptionId: "COMMON_FACTOR_VALUE_ERROR", analysis: "A non-zero quantity divided by itself is 1, not 0; this does not address the actual illegal cancellation across a sum." },
        { value: "There is no error; the cancellation is valid", misconceptionId: "ACCEPT_ILLEGAL_CANCELLATION", analysis: "A symbol may be cancelled only when it is a factor of the complete numerator and denominator, not merely one term of a sum." },
      ]);
      stem = `A student writes (${d.x} + ${d.y})/${d.x} = 1 + ${d.y} by cancelling ${d.x}. Which statement correctly identifies the first error?`;
      const errors = validateOptions(options, correct, pkg.correctIndex);
      return Object.freeze({
        ...pkg,
        stem,
        options,
        explanation: Object.freeze({ ...pkg.explanation, coreConcept: CORE[pkg.prototypeId] }),
        canonicalPayloadKey: JSON.stringify({ prototypeId: pkg.prototypeId, stem, answer: correct, oracle: pkg.oracle }),
        generationIdentity: `${pkg.generationIdentity}:EDITORIAL-V1`,
        validation: Object.freeze({ ok: errors.length === 0, errors }),
      });
    }
  }

  const options = numericOptions(answer, specs, pkg.correctIndex);
  const errors = validateOptions(options, format(answer), pkg.correctIndex);
  return Object.freeze({
    ...pkg,
    stem,
    canonicalAnswer: format(answer),
    options,
    explanation: Object.freeze({
      coreConcept: CORE[pkg.prototypeId],
      steps: Object.freeze(steps),
      finalAnswer: `Therefore, the answer is ${format(answer)}.`,
      cancellationMap: Object.freeze(map),
    }),
    oracle,
    canonicalPayloadKey: JSON.stringify({ prototypeId: pkg.prototypeId, stem, answer: format(answer), oracle }),
    generationIdentity: `${pkg.generationIdentity}:EDITORIAL-V1`,
    validation: Object.freeze({ ok: errors.length === 0, errors }),
  });
}

function editorialiseWave2(pkg: SapCp005Wave2Package): SapCp005Wave2Package {
  const d = pkg.oracle.data;
  let stem = pkg.stem;
  let answer = typeof pkg.canonicalAnswer === "string" && /^\d+(?:\/\d+)?$/.test(pkg.canonicalAnswer) ? parse(pkg.canonicalAnswer) : null;
  let steps = [...pkg.explanation.steps];
  let map = [...pkg.explanation.cancellationMap];
  let oracle = pkg.oracle;
  let specs: WrongSpec[] = [];

  switch (pkg.prototypeId) {
    case "SAP-CP005-PROT-COMMON-FACTOR-BEFORE-MULTIPLY":
      stem = `Simplify (${d.p}/${d.q}) × ${d.r}.`;
      specs = [
        { value: rat(d.m! * d.r!, d.q!), misconceptionId: "COMMON_FACTOR_REMOVED_FROM_NUMERATOR_ONLY", analysis: "This divides the numerator by the common factor but leaves the original denominator unchanged, so the fraction's value is altered." },
        { value: rat(d.p! * d.r!, d.n!), misconceptionId: "COMMON_FACTOR_REMOVED_FROM_DENOMINATOR_ONLY", analysis: "This reduces only the denominator by the common factor and therefore changes the value instead of performing a legal cancellation." },
        { value: rat(d.n!, d.m! * d.r!), misconceptionId: "FINAL_PRODUCT_RECIPROCATED", analysis: "The visible fraction is reduced, but the complete final product is then inverted instead of keeping its numerator-denominator order." },
      ];
      break;

    case "SAP-CP005-PROT-REPEATED-COMMON-FACTOR-BLOCKS":
      specs = [
        { value: rat(d.w! * d.z!, d.u! * d.v!), misconceptionId: "REMAINING_PRODUCT_RATIO_INVERTED", analysis: "The repeated block is cancelled correctly, but the remaining numerator and denominator products are written in reverse order." },
        { value: rat(d.u! + d.v!, d.w! * d.z!), misconceptionId: "NUMERATOR_PRODUCT_CHANGED_TO_SUM", analysis: "After removing the repeated block, this adds the two surviving numerator factors instead of multiplying them." },
        { value: rat(d.u! * d.v!, d.w! + d.z!), misconceptionId: "DENOMINATOR_PRODUCT_CHANGED_TO_SUM", analysis: "After cancellation, this adds the surviving denominator factors instead of preserving their product." },
      ];
      break;

    case "SAP-CP005-PROT-SYMMETRIC-FRACTION-PAIR": {
      const c = 2 + (pkg.seed % 6);
      answer = rat(c);
      stem = `Simplify [(${d.a}/${d.b}) + (${d.b}/${d.a})] ÷ [(${d.a! * d.a! + d.b! * d.b!})/${d.a! * d.b! * c}].`;
      oracle = Object.freeze({ kind: pkg.oracle.kind, data: Object.freeze({ ...d, c, editorialMode: 1 }) });
      steps = [
        `${d.a}/${d.b} + ${d.b}/${d.a} = (${d.a! * d.a!}+${d.b! * d.b!})/${d.a! * d.b!}.`,
        `The divisor is the same numerator over ${d.a! * d.b!} × ${c}, so it is exactly 1/${c} of the first bracket.`,
        `Therefore the first bracket divided by that divisor equals ${c}.`,
      ];
      map = ["Combine the symmetric fraction pair over the common denominator ab.", `Recognise that the displayed divisor is the combined fraction divided by ${c}; the common fraction cancels, leaving ${c}.`];
      specs = [
        { value: rat(1, c), misconceptionId: "SYMMETRIC_RATIO_INVERTED", analysis: "The scale factor between the two matching symmetric expressions is identified, but the final division is inverted." },
        { value: rat(c + 1), misconceptionId: "SCALE_FACTOR_OFF_BY_ONE", analysis: "This uses the correct structural idea but carries the multiplier one unit too far when comparing the two denominators." },
        { value: rat(c - 1), misconceptionId: "SCALE_FACTOR_UNDERCOUNTED", analysis: "This recognises that a scale factor survives but understates that factor by one after the common symmetric expression cancels." },
      ];
      break;
    }

    case "SAP-CP005-PROT-REPEATED-BLOCK-COMPRESSION":
      stem = `Simplify [(${d.k} × ${d.a}) + (${d.k} × ${d.b})] / (${d.k} × ${d.c}).`;
      specs = [
        { value: rat(d.a! * d.b!, d.c!), misconceptionId: "SUM_CHANGED_TO_PRODUCT_AFTER_FACTORING", analysis: "This replaces the required surviving sum a+b by the product ab after the common factor has been removed." },
        { value: rat((d.a! + d.b!) * d.c!), misconceptionId: "DENOMINATOR_MOVED_TO_NUMERATOR", analysis: "The repeated factor is handled, but the remaining denominator c is multiplied into the numerator instead of dividing it." },
        { value: rat(d.a! + d.b!), misconceptionId: "REMAINING_DENOMINATOR_DROPPED", analysis: "This cancels the repeated factor correctly but then also drops the surviving denominator c, which is not a common factor." },
      ];
      break;

    case "SAP-CP005-PROT-BEST-FIRST-CANCELLATION": {
      const options = categoricalOptions(pkg.canonicalAnswer, pkg.correctIndex, [
        { value: "Multiply the two numerators first", misconceptionId: "RAW_MULTIPLY_FIRST", analysis: "This is mathematically possible but creates a larger numerator before using the visible exact reduction, so it is not the best first step." },
        { value: "Multiply the two denominators first", misconceptionId: "RAW_MULTIPLY_FIRST", analysis: "This postpones the visible common-factor reduction and creates a larger denominator before any simplification is used." },
        { value: "Invert the second fraction before multiplying", misconceptionId: "UNJUSTIFIED_RECIPROCAL", analysis: "The displayed operation is multiplication, so replacing the second fraction by its reciprocal changes the expression's value." },
      ]);
      const errors = validateOptions(options, pkg.canonicalAnswer, pkg.correctIndex);
      return Object.freeze({
        ...pkg,
        options,
        explanation: Object.freeze({ ...pkg.explanation, coreConcept: CORE[pkg.prototypeId] }),
        canonicalPayloadKey: JSON.stringify({ prototypeId: pkg.prototypeId, stem: pkg.stem, answer: pkg.canonicalAnswer, oracle: pkg.oracle }),
        generationIdentity: `${pkg.generationIdentity}:EDITORIAL-V1`,
        validation: Object.freeze({ ok: errors.length === 0, errors }),
      });
    }

    case "SAP-CP005-PROT-RAW-VS-STRUCTURAL-ROUTE": {
      const options = categoricalOptions(pkg.canonicalAnswer, pkg.correctIndex, [
        { value: "Only Route A is valid", misconceptionId: "REJECT_VALID_CANCELLATION", analysis: "This incorrectly rejects legal cancellation of a complete common factor even though that reduction preserves the exact value." },
        { value: "Only Route B is valid", misconceptionId: "REJECT_RAW_ROUTE", analysis: "Multiplying first is less efficient in this case, but exact multiplication is still mathematically valid when performed correctly." },
        { value: "The two routes give different exact values", misconceptionId: "VALUE_NOT_PRESERVED", analysis: "Legal common-factor cancellation preserves value, so exact raw evaluation and exact structural evaluation must agree." },
      ]);
      const errors = validateOptions(options, pkg.canonicalAnswer, pkg.correctIndex);
      return Object.freeze({
        ...pkg,
        options,
        explanation: Object.freeze({ ...pkg.explanation, coreConcept: CORE[pkg.prototypeId] }),
        canonicalPayloadKey: JSON.stringify({ prototypeId: pkg.prototypeId, stem: pkg.stem, answer: pkg.canonicalAnswer, oracle: pkg.oracle }),
        generationIdentity: `${pkg.generationIdentity}:EDITORIAL-V1`,
        validation: Object.freeze({ ok: errors.length === 0, errors }),
      });
    }
  }

  if (!answer) throw new Error(`${pkg.prototypeId}: numeric editorial answer was not available.`);
  const options = numericOptions(answer, specs, pkg.correctIndex);
  const errors = validateOptions(options, format(answer), pkg.correctIndex);
  return Object.freeze({
    ...pkg,
    stem,
    canonicalAnswer: format(answer),
    options,
    explanation: Object.freeze({
      coreConcept: CORE[pkg.prototypeId],
      steps: Object.freeze(steps),
      finalAnswer: `Therefore, the answer is ${format(answer)}.`,
      cancellationMap: Object.freeze(map),
    }),
    oracle,
    canonicalPayloadKey: JSON.stringify({ prototypeId: pkg.prototypeId, stem, answer: format(answer), oracle }),
    generationIdentity: `${pkg.generationIdentity}:EDITORIAL-V1`,
    validation: Object.freeze({ ok: errors.length === 0, errors }),
  });
}

export function generateSapCp005Editorial(prototypeId: SapCp005PrototypeId, seed: number): SapCp005Package {
  return editorialiseWave1(generateSapCp005(prototypeId, seed));
}

export function generateSapCp005Wave2Editorial(prototypeId: SapCp005Wave2PrototypeId, seed: number): SapCp005Wave2Package {
  return editorialiseWave2(generateSapCp005Wave2(prototypeId, seed));
}
