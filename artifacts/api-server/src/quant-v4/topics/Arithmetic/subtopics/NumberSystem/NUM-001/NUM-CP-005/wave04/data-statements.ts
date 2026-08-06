import {
  LIFECYCLE,
  Rng,
  correctIndex,
  difficulty,
  divisorCountFormula,
  explanation,
  factorText,
  makeOptions,
  oddDivisorCountFormula,
  squareDivisorCountFormula,
} from "./common";
import type {
  NumCp005Wave04Package,
  NumCp005Wave04PrototypeId,
} from "./types";

const DS_CLASSES = [
  "I alone is sufficient",
  "II alone is sufficient",
  "Both together are sufficient",
  "Even together are insufficient",
] as const;

type DsClass = (typeof DS_CLASSES)[number];
type Predicate = Readonly<{ description: string; test: (x: number) => boolean }>;

function classifySufficiency(
  domain: readonly number[],
  first: Predicate,
  second: Predicate,
): DsClass {
  const firstCandidates = domain.filter(first.test);
  const secondCandidates = domain.filter(second.test);
  const combinedCandidates = domain.filter((value) => first.test(value) && second.test(value));
  const firstSufficient = firstCandidates.length === 1;
  const secondSufficient = secondCandidates.length === 1;
  const combinedSufficient = combinedCandidates.length === 1;

  if (firstSufficient && !secondSufficient) return "I alone is sufficient";
  if (!firstSufficient && secondSufficient) return "II alone is sufficient";
  if (!firstSufficient && !secondSufficient && combinedSufficient) {
    return "Both together are sufficient";
  }
  return "Even together are insufficient";
}

export function generateDataSufficiency(
  prototypeId: NumCp005Wave04PrototypeId,
  seed: number,
): NumCp005Wave04Package {
  const rng = new Rng(`${prototypeId}:${seed}`);
  const scenario = (seed - 1) % 4;
  const b = 1 + (seed % 4);
  const hiddenX = rng.int(0, 5);
  const domain = Object.freeze([0, 1, 2, 3, 4, 5]);
  const exactTotal = (hiddenX + 1) * (b + 1);

  const parityPredicate: Predicate = Object.freeze({
    description: hiddenX % 2 === 0
      ? `the number of even divisors is divisible by ${2 * (b + 1)}`
      : `the number of even divisors is not divisible by ${2 * (b + 1)}`,
    test: (x: number) => x % 2 === hiddenX % 2,
  });
  const exactTotalPredicate: Predicate = Object.freeze({
    description: `the total number of positive divisors is ${exactTotal}`,
    test: (x: number) => (x + 1) * (b + 1) === exactTotal,
  });
  const exactEven = hiddenX * (b + 1);
  const exactEvenPredicate: Predicate = Object.freeze({
    description: `the number of even positive divisors is ${exactEven}`,
    test: (x: number) => x * (b + 1) === exactEven,
  });
  const residue = (hiddenX + 1) % 3;
  const residuePredicate: Predicate = Object.freeze({
    description: `after dividing the total divisor count by ${b + 1}, the remainder on division by 3 is ${residue}`,
    test: (x: number) => (x + 1) % 3 === residue,
  });

  let first: Predicate;
  let second: Predicate;
  if (scenario === 0) {
    first = exactTotalPredicate;
    second = parityPredicate;
  } else if (scenario === 1) {
    first = parityPredicate;
    second = exactEvenPredicate;
  } else if (scenario === 2) {
    first = parityPredicate;
    second = residuePredicate;
  } else {
    first = parityPredicate;
    second = Object.freeze({
      description: `the total divisor count has the same parity as ${exactTotal}`,
      test: (x: number) => ((x + 1) * (b + 1)) % 2 === exactTotal % 2,
    });
  }

  const firstCandidates = domain.filter(first.test);
  const secondCandidates = domain.filter(second.test);
  const combinedCandidates = domain.filter((value) => first.test(value) && second.test(value));
  const canonicalAnswer = classifySufficiency(domain, first, second);
  const verifierAnswer = classifySufficiency(
    [...domain],
    Object.freeze({ description: first.description, test: first.test }),
    Object.freeze({ description: second.description, test: second.test }),
  );
  const answerIndex = correctIndex(prototypeId, seed);
  const factors = Object.freeze([
    Object.freeze({ prime: 2, exponent: hiddenX }),
    Object.freeze({ prime: 3, exponent: b }),
  ]);

  return Object.freeze({
    packageId: "NUM-001",
    checkpointId: "NUM-CP-005",
    temporaryPrototypeId: prototypeId,
    permanentQlId: null,
    seed,
    locale: "en-IN",
    difficulty: difficulty(seed),
    answerSemantic: "DATA_SUFFICIENCY_CLASS",
    representation: "DATA_SUFFICIENCY",
    stem: `For n = 2^x × 3^${b}, where x is an integer from 0 to 5, decide whether x can be determined. Statement I: ${first.description}. Statement II: ${second.description}.`,
    options: makeOptions(canonicalAnswer, DS_CLASSES, answerIndex, "NUM-CP005-DS"),
    correctIndex: answerIndex,
    canonicalAnswer,
    verifierAnswer,
    hiddenState: Object.freeze({
      factorState: factors,
      hiddenExponent: hiddenX,
      knownExponent: b,
      scenario,
      firstCandidates,
      secondCandidates,
      combinedCandidates,
    }),
    mathematicalFingerprint: `${prototypeId}|b=${b}|x=${hiddenX}|scenario=${scenario}|I=${first.description}|II=${second.description}`,
    explanation: explanation(
      "A statement is sufficient only when it leaves exactly one allowed value of the unknown exponent.",
      "Test Statement I, Statement II and then their intersection over x = 0,1,2,3,4,5.",
      [
        `Statement I leaves x in {${firstCandidates.join(", ")}}.`,
        `Statement II leaves x in {${secondCandidates.join(", ")}}.`,
        `Together they leave x in {${combinedCandidates.join(", ")}}.`,
      ],
      "Convert each statement into an exponent restriction before judging sufficiency.",
      canonicalAnswer,
    ),
    sourceAncestry: Object.freeze([
      "NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY",
      "NUMBER-SYSTEM-OPEN-QL-DISCOVERY-AND-FREEZE-PROTOCOL",
      "NUM-CP005-WAVES-01-03",
      "SSC-DIVISOR-DATA-SUFFICIENCY-SOURCE-FAMILY",
    ]),
    prototypeAncestry: Object.freeze([prototypeId, "NUM-CP005-WAVE04-DATA-SUFFICIENCY"]),
    lifecycle: LIFECYCLE,
  });
}

function statementSetLabel(mask: number): string {
  const labels = ["I", "II", "III"].filter((_label, index) => (mask & (1 << index)) !== 0);
  if (labels.length === 0) return "None";
  if (labels.length === 3) return "All three";
  if (labels.length === 1) return `${labels[0]} only`;
  return `${labels[0]} and ${labels[1]} only`;
}

export function generateStatementSet(
  prototypeId: NumCp005Wave04PrototypeId,
  seed: number,
): NumCp005Wave04Package {
  const rng = new Rng(`${prototypeId}:${seed}`);
  const factors = Object.freeze([
    Object.freeze({ prime: 2, exponent: rng.int(1, 4) }),
    Object.freeze({ prime: 3, exponent: rng.int(1, 4) }),
    ...(seed % 3 === 0 ? [Object.freeze({ prime: 5, exponent: rng.int(1, 3) })] : []),
  ]);
  const actuals = [
    divisorCountFormula(factors),
    oddDivisorCountFormula(factors),
    squareDivisorCountFormula(factors),
  ];
  const truthMask = (seed - 1) % 8;
  const claims = actuals.map((actual, index) =>
    (truthMask & (1 << index)) !== 0 ? actual : actual + 1 + ((seed + index) % 2));
  const evaluatedMask = claims.reduce(
    (mask, claim, index) => mask | (claim === actuals[index] ? (1 << index) : 0),
    0,
  );
  const canonicalAnswer = statementSetLabel(truthMask);
  const verifierAnswer = statementSetLabel(evaluatedMask);
  const allLabels = Array.from({ length: 8 }, (_unused, mask) => statementSetLabel(mask));
  const answerIndex = correctIndex(prototypeId, seed);

  return Object.freeze({
    packageId: "NUM-001",
    checkpointId: "NUM-CP-005",
    temporaryPrototypeId: prototypeId,
    permanentQlId: null,
    seed,
    locale: "en-IN",
    difficulty: difficulty(seed),
    answerSemantic: "STATEMENT_SET",
    representation: "STATEMENT_SET",
    stem: `Let n = ${factorText(factors)}. Consider: I. n has ${claims[0]} positive divisors. II. n has ${claims[1]} odd positive divisors. III. n has ${claims[2]} perfect-square positive divisors. Which statements are correct?`,
    options: makeOptions(canonicalAnswer, allLabels, answerIndex, "NUM-CP005-STATEMENT"),
    correctIndex: answerIndex,
    canonicalAnswer,
    verifierAnswer,
    hiddenState: Object.freeze({
      factorState: factors,
      truthMask,
      claims: Object.freeze(claims),
      actuals: Object.freeze(actuals),
    }),
    mathematicalFingerprint: `${prototypeId}|${factorText(factors)}|mask=${truthMask}|claims=${claims.join("-")}`,
    explanation: explanation(
      "Each divisor-function statement must be checked independently from the prime exponents.",
      "Compute the total, odd and square-divisor counts separately, then retain only the matching statements.",
      [
        `Total divisors = ${actuals[0]}.`,
        `Odd divisors = ${actuals[1]}.`,
        `Perfect-square divisors = ${actuals[2]}.`,
      ],
      "Write the three formula results in one row and compare them with I, II and III.",
      canonicalAnswer,
    ),
    sourceAncestry: Object.freeze([
      "NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY",
      "NUM-CP005-WAVES-01-03",
      "SSC-DIVISOR-STATEMENT-COMBINATION-SOURCE-FAMILY",
    ]),
    prototypeAncestry: Object.freeze([prototypeId, "NUM-CP005-WAVE04-STATEMENT-SET"]),
    lifecycle: LIFECYCLE,
  });
}
