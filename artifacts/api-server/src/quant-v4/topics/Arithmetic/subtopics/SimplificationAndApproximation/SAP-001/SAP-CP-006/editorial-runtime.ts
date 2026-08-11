import {
  generateSapCp006,
  type SapCp006Option,
  type SapCp006Package,
  type SapCp006PrototypeId,
} from "./runtime";

interface Rational { n: bigint; d: bigint; }

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x || 1n;
}

function rat(n: bigint | number, d: bigint | number = 1n): Rational {
  let numerator = BigInt(n), denominator = BigInt(d);
  if (denominator === 0n) throw new Error("Zero denominator.");
  if (denominator < 0n) { numerator = -numerator; denominator = -denominator; }
  const divisor = gcd(numerator, denominator);
  return { n: numerator / divisor, d: denominator / divisor };
}

function format(value: Rational): string {
  return value.d === 1n ? value.n.toString() : `${value.n}/${value.d}`;
}

function decimalFromHundredths(value: number): string {
  return `${Math.floor(value / 100)}.${String(value % 100).padStart(2, "0")}`;
}

function positionNumericOptions(
  answer: Rational,
  wrongValues: readonly { value: Rational; misconceptionId: string; analysis: string }[],
  correctIndex: number,
): readonly SapCp006Option[] {
  const answerText = format(answer);
  const seen = new Set<string>([answerText]);
  const wrong = wrongValues.filter((item) => {
    const key = format(item.value);
    if (item.value.n <= 0n || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  let bump = 1;
  while (wrong.length < 3) {
    const value = rat(answer.n + BigInt(bump) * answer.d, answer.d);
    const key = format(value);
    if (!seen.has(key)) {
      seen.add(key);
      wrong.push({
        value,
        misconceptionId: "SUBSTITUTION_NEAR_MISS",
        analysis: "This nearby positive value does not reproduce the complete displayed equality when checked by exact substitution.",
      });
    }
    bump += 1;
  }
  const options: SapCp006Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push({ value: answerText, isCorrect: true, misconceptionId: null, analysis: "This value restores the complete displayed equality exactly." });
    } else {
      const item = wrong[wrongIndex++]!;
      options.push({ value: format(item.value), isCorrect: false, misconceptionId: item.misconceptionId, analysis: item.analysis });
    }
  }
  return Object.freeze(options);
}

function positionDecimalOptions(answerHundredths: number, correctIndex: number): readonly SapCp006Option[] {
  const values = [answerHundredths + 10, Math.max(5, answerHundredths - 10), answerHundredths + 25];
  const seen = new Set<number>([answerHundredths]);
  const wrong = values.filter((value) => value > 0 && !seen.has(value) && Boolean(seen.add(value)));
  let bump = 5;
  while (wrong.length < 3) {
    const value = answerHundredths + bump;
    if (!seen.has(value)) { seen.add(value); wrong.push(value); }
    bump += 5;
  }
  const options: SapCp006Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push({ value: decimalFromHundredths(answerHundredths), isCorrect: true, misconceptionId: null, analysis: "This decimal restores the complete displayed equality exactly." });
    } else {
      options.push({
        value: decimalFromHundredths(wrong[wrongIndex++]!),
        isCorrect: false,
        misconceptionId: "DECIMAL_SUBSTITUTION_MISMATCH",
        analysis: "This decimal is close to the required value but fails when substituted into the complete fraction-and-percentage expression.",
      });
    }
  }
  return Object.freeze(options);
}

function positionTextOptions(
  correct: string,
  wrong: readonly { value: string; misconceptionId: string; analysis: string }[],
  correctIndex: number,
): readonly SapCp006Option[] {
  const options: SapCp006Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push({ value: correct, isCorrect: true, misconceptionId: null, analysis: "This option preserves the exact value after full simplification." });
    } else {
      const item = wrong[wrongIndex++]!;
      options.push({ value: item.value, isCorrect: false, misconceptionId: item.misconceptionId, analysis: item.analysis });
    }
  }
  return Object.freeze(options);
}

function finish(
  pkg: SapCp006Package,
  patch: {
    stem: string;
    canonicalAnswer?: string;
    options?: readonly SapCp006Option[];
    steps: readonly string[];
    verification: readonly string[];
    data: Record<string, number>;
    coreConcept?: string;
  },
): SapCp006Package {
  const canonicalAnswer = patch.canonicalAnswer ?? pkg.canonicalAnswer;
  const options = patch.options ?? pkg.options;
  const errors: string[] = [];
  if (options.length !== 4) errors.push("Editorial package must contain four options.");
  if (new Set(options.map((option) => option.value)).size !== 4) errors.push("Editorial options must be distinct.");
  if (options.filter((option) => option.isCorrect).length !== 1) errors.push("Editorial package must contain exactly one correct option.");
  if (options[pkg.correctIndex]?.value !== canonicalAnswer) errors.push("Editorial correct option is not answer-bound.");
  return Object.freeze({
    ...pkg,
    stem: patch.stem,
    canonicalAnswer,
    options,
    explanation: Object.freeze({
      coreConcept: patch.coreConcept ?? pkg.explanation.coreConcept,
      steps: Object.freeze([...patch.steps]),
      finalAnswer: `Therefore, the answer is ${canonicalAnswer}.`,
      verification: Object.freeze([...patch.verification]),
    }),
    oracle: Object.freeze({ kind: pkg.oracle.kind, data: Object.freeze({ ...patch.data, editorialMode: 1 }) }),
    canonicalPayloadKey: JSON.stringify({ prototypeId: pkg.prototypeId, stem: patch.stem, answer: canonicalAnswer, data: patch.data }),
    generationIdentity: `${pkg.generationIdentity}:EDITORIAL-V1:${JSON.stringify(patch.data)}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

export function generateSapCp006Editorial(prototypeId: SapCp006PrototypeId, seed: number): SapCp006Package {
  const pkg = generateSapCp006(prototypeId, seed);
  const d = pkg.oracle.data;

  switch (prototypeId) {
    case "SAP-CP006-PROT-MISSING-MIXED-ADDEND": {
      const fractionScale = 4 + (seed % 7), percentScale = 2 + ((seed * 3) % 6);
      const fractionBase = d.b! * fractionScale, percentBase = 100 * percentScale;
      const fractionValue = d.a! * fractionScale, percentValue = d.p! * percentScale;
      const target = d.x! + fractionValue + percentValue;
      return finish(pkg, {
        stem: `Find ?: ? + ${d.a}/${d.b} of ${fractionBase} + ${d.p}% of ${percentBase} = ${target}.`,
        steps: [`${d.a}/${d.b} of ${fractionBase} = ${fractionValue}, and ${d.p}% of ${percentBase} = ${percentValue}.`, `So ? = ${target} − ${fractionValue} − ${percentValue} = ${d.x}.`],
        verification: [`Substitute ? = ${d.x}.`, `${d.x} + ${fractionValue} + ${percentValue} = ${target}, so the equality is exact.`],
        data: { ...d, fractionBase, percentBase, fractionValue, percentValue, target },
      });
    }

    case "SAP-CP006-PROT-MISSING-MIXED-FACTOR": {
      const fractionScale = 3 + (seed % 6), percentScale = 2 + ((seed * 5) % 5);
      const fractionBase = d.b! * fractionScale, percentBase = 100 * percentScale;
      const coefficient = d.a! * fractionScale, percentValue = d.p! * percentScale;
      const target = d.x! * coefficient + percentValue;
      return finish(pkg, {
        stem: `Find ?: (? × ${d.a}/${d.b} of ${fractionBase}) + ${d.p}% of ${percentBase} = ${target}.`,
        steps: [`${d.a}/${d.b} of ${fractionBase} = ${coefficient}, while ${d.p}% of ${percentBase} = ${percentValue}.`, `Thus ${coefficient}? + ${percentValue} = ${target}; after subtracting ${percentValue}, divide by ${coefficient} to get ? = ${d.x}.`],
        verification: [`For ? = ${d.x}, the first term is ${d.x} × ${coefficient} = ${d.x! * coefficient}.`, `${d.x! * coefficient} + ${percentValue} = ${target}.`],
        data: { ...d, fractionBase, percentBase, coefficient, percentValue, target },
      });
    }

    case "SAP-CP006-PROT-MISSING-MIXED-DIVISOR": {
      const quotientScale = 2 + (seed % 6), percentScale = 2 + ((seed * 7) % 5);
      const fractionBase = d.b! * d.x! * quotientScale;
      const fractionValue = d.a! * d.x! * quotientScale;
      const quotientValue = d.a! * quotientScale;
      const percentBase = 100 * percentScale, percentValue = d.p! * percentScale;
      const target = quotientValue + percentValue;
      return finish(pkg, {
        stem: `Find ?: (${d.a}/${d.b} of ${fractionBase}) ÷ ? + ${d.p}% of ${percentBase} = ${target}.`,
        steps: [`${d.a}/${d.b} of ${fractionBase} = ${fractionValue}, and ${d.p}% of ${percentBase} = ${percentValue}.`, `So ${fractionValue} ÷ ? = ${target - percentValue} = ${quotientValue}; hence ? = ${fractionValue}/${quotientValue} = ${d.x}.`],
        verification: [`Substitute ? = ${d.x}: ${fractionValue} ÷ ${d.x} = ${quotientValue}.`, `${quotientValue} + ${percentValue} = ${target}.`],
        data: { ...d, fractionBase, fractionValue, quotientValue, percentBase, percentValue, target },
      });
    }

    case "SAP-CP006-PROT-MISSING-BRACKET-VALUE": {
      const answer = rat(3 + (seed % 10));
      const percentScale = 2 + ((seed * 3) % 5), percentBase = 100 * percentScale, percentValue = d.p! * percentScale;
      const target = (Number(answer.n) + percentValue) * d.c!;
      const options = positionNumericOptions(answer, [
        { value: rat(Number(answer.n) + percentValue), misconceptionId: "WHOLE_BRACKET_AS_UNKNOWN", analysis: "This returns the complete bracket value after the percentage term has been included, not the missing value represented by the box." },
        { value: rat(target), misconceptionId: "OUTER_MULTIPLIER_NOT_REVERSED", analysis: "This treats the final product as the missing value and does not undo the multiplication outside the bracket." },
        { value: rat(Math.max(1, Number(answer.n) - 1)), misconceptionId: "INVERSE_ARITHMETIC_SLIP", analysis: "This nearby integer does not restore the exact bracket value when checked against the displayed product." },
      ], pkg.correctIndex);
      return finish(pkg, {
        stem: `If [? + ${d.p}% of ${percentBase}] × ${d.c} = ${target}, find ?.`,
        canonicalAnswer: format(answer), options,
        steps: [`Divide ${target} by ${d.c} to get the complete bracket value ${Number(answer.n) + percentValue}.`, `${d.p}% of ${percentBase} = ${percentValue}; subtract it to get ? = ${format(answer)}.`],
        verification: [`Substitute ? = ${format(answer)}: the bracket becomes ${Number(answer.n) + percentValue}.`, `${Number(answer.n) + percentValue} × ${d.c} = ${target}.`],
        data: { ...d, percentBase, percentValue, target, answer: Number(answer.n) },
      });
    }

    case "SAP-CP006-PROT-MISSING-DECIMAL-MIXED": {
      const fractionScale = 3 + (seed % 6), percentScale = 2 + ((seed * 5) % 5);
      const fractionBase = d.b! * fractionScale, fractionValue = d.a! * fractionScale;
      const percentBase = 100 * percentScale, percentValue = d.p! * percentScale;
      const targetHundredths = d.hundredths! + 100 * (fractionValue + percentValue);
      const options = positionDecimalOptions(d.hundredths!, pkg.correctIndex);
      return finish(pkg, {
        stem: `The box is a decimal. Find ?: ? + ${d.a}/${d.b} of ${fractionBase} + ${d.p}% of ${percentBase} = ${decimalFromHundredths(targetHundredths)}.`,
        options,
        steps: [`${d.a}/${d.b} of ${fractionBase} = ${fractionValue}, and ${d.p}% of ${percentBase} = ${percentValue}.`, `Subtract these known values from ${decimalFromHundredths(targetHundredths)}; the remainder is ${decimalFromHundredths(d.hundredths!)}.`],
        verification: [`Add ${decimalFromHundredths(d.hundredths!)} + ${fractionValue} + ${percentValue}.`, `The sum is exactly ${decimalFromHundredths(targetHundredths)}.`],
        data: { ...d, fractionBase, fractionValue, percentBase, percentValue, targetHundredths },
      });
    }

    case "SAP-CP006-PROT-COMPOSED-POWER-MISSING": {
      const fractionScale = 3 + (seed % 7), fractionBase = d.b! * fractionScale, fractionValue = d.a! * fractionScale;
      const factorialValue = [1, 1, 2, 6, 24, 120][d.factN!]!;
      const powerValue = d.base! ** d.exponent!;
      const target = factorialValue + powerValue + fractionValue;
      return finish(pkg, {
        stem: `Find the integer ?: ${d.factN}! + ${d.base}^? + ${d.a}/${d.b} of ${fractionBase} = ${target}.`,
        steps: [`${d.factN}! = ${factorialValue}, and ${d.a}/${d.b} of ${fractionBase} = ${fractionValue}.`, `Subtract these from ${target}; ${d.base}^? = ${powerValue} = ${d.base}^${d.exponent}, so ? = ${d.exponent}.`],
        verification: [`Substitute ? = ${d.exponent}; then ${d.base}^? = ${powerValue}.`, `${factorialValue} + ${powerValue} + ${fractionValue} = ${target}.`],
        data: { ...d, fractionBase, fractionValue, factorialValue, powerValue, target },
      });
    }

    case "SAP-CP006-PROT-EQUIVALENT-EXPRESSION": {
      const exact = rat(d.numerator!, d.denominator!);
      const correct = format(exact);
      const wrong = [
        { value: format(rat(d.a! + d.p!, d.b! + 100)), misconceptionId: "ADDS_NUMERATORS_AND_DENOMINATORS", analysis: "This incorrectly adds numerators and denominators of unlike fractions instead of first forming a common denominator." },
        { value: format(rat(d.a! * 100 + d.p!, d.denominator!)), misconceptionId: "PERCENT_SCALE_FACTOR_MISSED", analysis: "This omits the factor contributed by the original fraction denominator when the percentage term is moved to the common denominator." },
        { value: format(rat(d.a! + d.p! * d.b!, d.denominator!)), misconceptionId: "FRACTION_SCALE_FACTOR_MISSED", analysis: "This omits the factor 100 required to rewrite the original fraction over the percentage-based common denominator." },
      ];
      const options = positionTextOptions(correct, wrong, pkg.correctIndex);
      return finish(pkg, {
        stem: `Which fraction, in lowest terms, is equal to ${d.a}/${d.b} + ${d.p}%?`,
        canonicalAnswer: correct, options,
        steps: [`Write ${d.p}% as ${d.p}/100 and combine it with ${d.a}/${d.b} over a common denominator.`, `The combined fraction is ${d.numerator}/${d.denominator}, which reduces to ${correct}.`],
        verification: [`Cross-check ${correct} against ${d.a}/${d.b} + ${d.p}/100.`, `Both have the same exact rational value.`],
        data: { ...d, reducedNumerator: Number(exact.n), reducedDenominator: Number(exact.d) },
      });
    }

    case "SAP-CP006-PROT-CORRECT-SIMPLIFICATION-STATEMENT": {
      const exact = rat(d.numerator!, d.denominator!);
      const rhs = format(exact);
      const prefix = `${d.a}/${d.b} + ${d.p}%`;
      const correct = `${prefix} = ${rhs}`;
      const wrong = [
        { value: `${prefix} = ${format(rat(d.a! + d.p!, d.b! + 100))}`, misconceptionId: "ILLEGAL_FRACTION_ADDITION", analysis: "This adds unlike fraction numerators and denominators directly, which does not preserve the exact value." },
        { value: `${prefix} = ${format(rat(d.a! * 100 + d.p!, d.denominator!))}`, misconceptionId: "PERCENT_SCALE_FACTOR_MISSED", analysis: "This misses the factor required to place the percentage term over the common denominator." },
        { value: `${prefix} = ${format(rat(d.a! + d.p! * d.b!, d.denominator!))}`, misconceptionId: "FRACTION_SCALE_FACTOR_MISSED", analysis: "This misses the factor 100 required when the original fraction is converted to the common denominator." },
      ];
      const options = positionTextOptions(correct, wrong, pkg.correctIndex);
      return finish(pkg, {
        stem: `Which statement gives the correct value in lowest terms?`,
        canonicalAnswer: correct, options,
        steps: [`Convert ${d.p}% to ${d.p}/100 and add it exactly to ${d.a}/${d.b}.`, `Reduce the resulting fraction completely; the value is ${rhs}.`],
        verification: [`Evaluate the left side independently as a rational number.`, `Its lowest-term form is ${rhs}, matching only the selected statement.`],
        data: { ...d, reducedNumerator: Number(exact.n), reducedDenominator: Number(exact.d) },
      });
    }

    case "SAP-CP006-PROT-CANDIDATE-SUBSTITUTION": {
      const fractionScale = 3 + (seed % 6), percentScale = 2 + ((seed * 5) % 5);
      const fractionBase = d.b! * fractionScale, coefficient = d.a! * fractionScale;
      const percentBase = 100 * percentScale, percentValue = d.p! * percentScale;
      const target = d.x! * coefficient + percentValue;
      return finish(pkg, {
        stem: `Which value of x makes (x × ${d.a}/${d.b} of ${fractionBase}) + ${d.p}% of ${percentBase} = ${target}?`,
        steps: [`${d.a}/${d.b} of ${fractionBase} = ${coefficient}, and ${d.p}% of ${percentBase} = ${percentValue}.`, `The equation becomes ${coefficient}x + ${percentValue} = ${target}; checking the options gives x = ${d.x}.`],
        verification: [`Substitute x = ${d.x}: ${coefficient} × ${d.x} = ${coefficient * d.x!}.`, `${coefficient * d.x!} + ${percentValue} = ${target}.`],
        data: { ...d, fractionBase, coefficient, percentBase, percentValue, target },
      });
    }

    default:
      return pkg;
  }
}
