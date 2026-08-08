import type { SapCp004Package } from "./runtime";

type Explanation = SapCp004Package["explanation"];

function power(base: bigint, exponent: number): bigint {
  let result = 1n;
  for (let index = 0; index < exponent; index += 1) result *= base;
  return result;
}

function factorial(n: number): bigint {
  let result = 1n;
  for (let value = 2; value <= n; value += 1) result *= BigInt(value);
  return result;
}

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x || 1n;
}

function descendingProduct(start: number, endInclusive: number): string {
  return Array.from({ length: start - endInclusive + 1 }, (_, index) => start - index).join(" × ");
}

function repeatedFactor(base: number, exponent: number): string {
  return exponent === 0 ? "1" : Array.from({ length: exponent }, () => String(base)).join(" × ");
}

function rootName(index: number): string {
  if (index === 2) return "square root";
  if (index === 3) return "cube root";
  if (index === 4) return "fourth root";
  if (index === 5) return "fifth root";
  return `${index}th root`;
}

function rootExpression(index: number, radicand: bigint | number | string): string {
  if (index === 2) return `√${radicand}`;
  if (index === 3) return `∛${radicand}`;
  return `${rootName(index)} of ${radicand}`;
}

function explanation(coreConcept: string, steps: readonly string[], answer: string): Explanation {
  return Object.freeze({
    coreConcept,
    steps: Object.freeze([...steps]),
    finalAnswer: `Answer: ${answer}.`,
  });
}

function parsePowerDiagnosis(stem: string): {
  base: number;
  exponent: number;
  radicand: number;
  shownStep1: number;
  shownStep2: number;
  shownStep3: number;
} | null {
  const match = stem.match(
    /A student evaluates (\d+)\^(\d+) \+ √(\d+):\r?\nStep 1: [^\n]+ = (-?\d+)\r?\nStep 2: [^\n]+ = (-?\d+)\r?\nStep 3: The value is (-?\d+)/,
  );
  if (!match) return null;
  return {
    base: Number(match[1]),
    exponent: Number(match[2]),
    radicand: Number(match[3]),
    shownStep1: Number(match[4]),
    shownStep2: Number(match[5]),
    shownStep3: Number(match[6]),
  };
}

function parseFactorialDiagnosis(stem: string): {
  n: number;
  denominatorN: number;
  m: number;
  shownStep1: number;
  shownStep2: number;
  shownStep3: number;
} | null {
  const match = stem.match(
    /A student evaluates (\d+)!\/(\d+)! \+ (\d+)!:\s*\r?\nStep 1: [^\n]+ = (-?\d+)\r?\nStep 2: [^\n]+ = (-?\d+)\r?\nStep 3: The value is (-?\d+)/,
  );
  if (!match) return null;
  return {
    n: Number(match[1]),
    denominatorN: Number(match[2]),
    m: Number(match[3]),
    shownStep1: Number(match[4]),
    shownStep2: Number(match[5]),
    shownStep3: Number(match[6]),
  };
}

function buildExplanation(pkg: SapCp004Package): Explanation {
  const data = pkg.oracle.data;
  const mode = data.mode ?? 0;

  switch (pkg.prototypeId) {
    case "SAP-CP004-PROT-POWER-MIXED-EXPRESSION": {
      const base = data.base!;
      const exponent = data.exponent!;
      const powered = power(BigInt(base), exponent);
      if (mode === 1) {
        return explanation(
          "Use BODMAS: evaluate the power first, then perform the outside subtraction.",
          [`${base}^${exponent} = ${powered}.`, `${powered} - ${data.add!} = ${pkg.canonicalAnswer}.`],
          pkg.canonicalAnswer,
        );
      }
      if (mode === 2) {
        const product = BigInt(data.multiplier!) * powered;
        return explanation(
          "Use BODMAS: evaluate the power, multiply by its coefficient, and add the final term.",
          [
            `${base}^${exponent} = ${powered}.`,
            `${data.multiplier!} × ${powered} = ${product}.`,
            `${product} + ${data.add!} = ${pkg.canonicalAnswer}.`,
          ],
          pkg.canonicalAnswer,
        );
      }
      if (mode === 3) {
        const bracketValue = powered + BigInt(data.adjustment!);
        return explanation(
          "The divisor applies to the complete bracket, so finish the bracket before dividing.",
          [
            `${base}^${exponent} = ${powered}.`,
            `${powered} + ${data.adjustment!} = ${bracketValue}.`,
            `${bracketValue} ÷ ${data.divisor!} = ${pkg.canonicalAnswer}.`,
          ],
          pkg.canonicalAnswer,
        );
      }
      return explanation(
        "Use BODMAS: evaluate the power first, then perform the outside addition.",
        [`${base}^${exponent} = ${powered}.`, `${powered} + ${data.add!} = ${pkg.canonicalAnswer}.`],
        pkg.canonicalAnswer,
      );
    }

    case "SAP-CP004-PROT-ZERO-ONE-EXPONENT": {
      const base = data.base!;
      const other = data.other!;
      if (mode === 1) {
        return explanation(
          "Fast rule: a non-zero number to power 0 is 1, while power 1 leaves the number unchanged.",
          [`${other}^1 = ${other} and ${base}^0 = 1.`, `${other} - 1 = ${pkg.canonicalAnswer}.`],
          pkg.canonicalAnswer,
        );
      }
      if (mode === 2) {
        return explanation(
          "Resolve the zero and first powers before applying the coefficient and final addition.",
          [
            `${base}^0 = 1 and ${other}^1 = ${other}.`,
            `${data.multiplier!} × 1 + ${other} = ${data.multiplier!} + ${other}.`,
            `${data.multiplier!} + ${other} = ${pkg.canonicalAnswer}.`,
          ],
          pkg.canonicalAnswer,
        );
      }
      if (mode === 3) {
        return explanation(
          "Each non-zero zero-power term equals 1; simplify the bracket before multiplying.",
          [`${base}^0 + ${other}^0 = 1 + 1 = 2.`, `2 × ${data.multiplier!} = ${pkg.canonicalAnswer}.`],
          pkg.canonicalAnswer,
        );
      }
      return explanation(
        "Fast rule: a non-zero number to power 0 is 1, while power 1 leaves the number unchanged.",
        [`${base}^0 = 1 and ${other}^1 = ${other}.`, `1 + ${other} = ${pkg.canonicalAnswer}.`],
        pkg.canonicalAnswer,
      );
    }

    case "SAP-CP004-PROT-NEGATIVE-BASE-PARITY": {
      const base = data.base!;
      const exponent = data.exponent!;
      const signedPower = power(BigInt(-base), exponent);
      const parity = exponent % 2 === 0 ? "even" : "odd";
      const signEffect = exponent % 2 === 0 ? "positive" : "negative";
      const concept = `The parentheses make −${base} the complete base. An ${parity} exponent makes the power ${signEffect}.`;
      if (mode === 1) {
        return explanation(
          concept,
          [`(-${base})^${exponent} = ${signedPower}.`, `${data.add!} - (${signedPower}) = ${pkg.canonicalAnswer}.`],
          pkg.canonicalAnswer,
        );
      }
      if (mode === 2) {
        const product = BigInt(data.multiplier!) * signedPower;
        return explanation(
          concept,
          [
            `(-${base})^${exponent} = ${signedPower}.`,
            `${data.multiplier!} × ${signedPower} = ${product}.`,
            `${product} + ${data.add!} = ${pkg.canonicalAnswer}.`,
          ],
          pkg.canonicalAnswer,
        );
      }
      if (mode === 3) {
        return explanation(
          concept,
          [`(-${base})^${exponent} = ${signedPower}.`, `${signedPower} - ${data.add!} = ${pkg.canonicalAnswer}.`],
          pkg.canonicalAnswer,
        );
      }
      return explanation(
        concept,
        [`(-${base})^${exponent} = ${signedPower}.`, `${signedPower} + ${data.add!} = ${pkg.canonicalAnswer}.`],
        pkg.canonicalAnswer,
      );
    }

    case "SAP-CP004-PROT-FRACTION-POWER": {
      const numerator = BigInt(data.numerator!);
      const denominator = BigInt(data.denominator!);
      const exponent = data.exponent!;
      const common = gcd(numerator, denominator);
      if (common > 1n) {
        const reducedNumerator = numerator / common;
        const reducedDenominator = denominator / common;
        return explanation(
          "Fast method: reduce the fraction first, then apply the power to the smaller numerator and denominator.",
          [
            `${numerator}/${denominator} = ${reducedNumerator}/${reducedDenominator}.`,
            `(${reducedNumerator}/${reducedDenominator})^${exponent} = ${power(reducedNumerator, exponent)}/${power(reducedDenominator, exponent)} = ${pkg.canonicalAnswer}.`,
          ],
          pkg.canonicalAnswer,
        );
      }
      const numeratorPower = power(numerator, exponent);
      const denominatorPower = power(denominator, exponent);
      return explanation(
        "Apply the exponent to both parts of the fraction; coprime bases produce a fraction already in lowest terms.",
        [
          `(${numerator}/${denominator})^${exponent} = ${numerator}^${exponent}/${denominator}^${exponent} = ${numeratorPower}/${denominatorPower}.`,
          `${numerator} and ${denominator} share no common factor, so ${numeratorPower}/${denominatorPower} is already reduced.`,
        ],
        pkg.canonicalAnswer,
      );
    }

    case "SAP-CP004-PROT-PERFECT-SQUARE-ROOT": {
      const root = data.root!;
      const radicand = data.radicand!;
      return explanation(
        "Recognise the perfect square directly instead of estimating the root.",
        [`${root}^2 = ${radicand}.`, `So √${radicand} = ${root}.`],
        pkg.canonicalAnswer,
      );
    }

    case "SAP-CP004-PROT-PERFECT-CUBE-ROOT": {
      const root = data.root!;
      const radicand = data.radicand!;
      return explanation(
        "Recognise the perfect cube directly: the cube root is the number used as three equal factors.",
        [`${root}^3 = ${radicand}.`, `So ∛${radicand} = ${root}.`],
        pkg.canonicalAnswer,
      );
    }

    case "SAP-CP004-PROT-BOUNDED-NTH-ROOT": {
      const root = data.root!;
      const index = data.index!;
      const radicand = data.radicand!;
      return explanation(
        `Recognise the perfect ${index}th power; the principal ${rootName(index)} is the positive base that produces it.`,
        [`${root}^${index} = ${radicand}.`, `So the principal ${rootName(index)} of ${radicand} is ${root}.`],
        pkg.canonicalAnswer,
      );
    }

    case "SAP-CP004-PROT-EXACT-ROOT-OF-FRACTION": {
      const numeratorRoot = BigInt(data.numeratorRoot!);
      const denominatorRoot = BigInt(data.denominatorRoot!);
      const index = data.index!;
      const numerator = power(numeratorRoot, index);
      const denominator = power(denominatorRoot, index);
      const radical = rootExpression(index, `${numerator}/${denominator}`);
      const common = gcd(numeratorRoot, denominatorRoot);
      const steps = [
        `${rootExpression(index, numerator)} = ${numeratorRoot} and ${rootExpression(index, denominator)} = ${denominatorRoot}.`,
        `${radical} = ${numeratorRoot}/${denominatorRoot}.`,
      ];
      if (common > 1n) {
        steps.push(`Divide numerator and denominator by ${common}: ${numeratorRoot}/${denominatorRoot} = ${pkg.canonicalAnswer}.`);
      } else {
        steps.push(`${numeratorRoot} and ${denominatorRoot} are coprime, so ${numeratorRoot}/${denominatorRoot} is already reduced.`);
      }
      return explanation(
        "Take the exact root of the numerator and denominator separately, then reduce only when a common factor exists.",
        steps,
        pkg.canonicalAnswer,
      );
    }

    case "SAP-CP004-PROT-ROOT-MIXED-ARITHMETIC": {
      const root = data.root!;
      const index = data.index!;
      const radicand = power(BigInt(root), index);
      const radical = rootExpression(index, radicand);
      if (mode === 1) {
        const product = root * data.multiplier!;
        return explanation(
          "Fast method: replace the perfect root by its exact value, then continue with ordinary BODMAS.",
          [`${radical} = ${root}.`, `${root} × ${data.multiplier!} = ${product}.`, `${product} - ${data.add!} = ${pkg.canonicalAnswer}.`],
          pkg.canonicalAnswer,
        );
      }
      if (mode === 2) {
        const bracket = root + data.add!;
        return explanation(
          "Evaluate the perfect root inside the bracket, finish the bracket, and multiply the whole bracket last.",
          [`${radical} = ${root}.`, `${root} + ${data.add!} = ${bracket}.`, `${bracket} × ${data.multiplier!} = ${pkg.canonicalAnswer}.`],
          pkg.canonicalAnswer,
        );
      }
      if (mode === 3) {
        const square = data.multiplier! * data.multiplier!;
        return explanation(
          "Evaluate the perfect root and the square separately before adding their values.",
          [`${radical} = ${root} and ${data.multiplier!}^2 = ${square}.`, `${root} + ${square} = ${pkg.canonicalAnswer}.`],
          pkg.canonicalAnswer,
        );
      }
      const product = root * data.multiplier!;
      return explanation(
        "Fast method: replace the perfect root by its exact value, then continue with ordinary BODMAS.",
        [`${radical} = ${root}.`, `${data.multiplier!} × ${root} = ${product}.`, `${product} + ${data.add!} = ${pkg.canonicalAnswer}.`],
        pkg.canonicalAnswer,
      );
    }

    case "SAP-CP004-PROT-POWER-ROOT-CANCELLATION": {
      const base = data.base!;
      const index = data.index ?? 2;
      const radicalPower = index === 2 ? `√(${base}^2)` : `∛(${base}^3)`;
      return explanation(
        `Fast method: do not expand ${base}^${index}; the matching ${rootName(index)} and power undo each other for this positive base.`,
        [`${radicalPower} = ${base}.`, `${base} + ${data.add!} = ${pkg.canonicalAnswer}.`],
        pkg.canonicalAnswer,
      );
    }

    case "SAP-CP004-PROT-NESTED-PERFECT-ROOT": {
      const root = data.root!;
      const innerIndex = data.innerIndex!;
      const outerIndex = data.outerIndex!;
      const radicand = BigInt(data.radicand!);
      const innerValue = power(BigInt(root), outerIndex);
      return explanation(
        "Work from the innermost root outward; each layer is an exact perfect power.",
        [
          `The inner ${rootName(innerIndex)} of ${radicand} is ${innerValue}, because ${innerValue}^${innerIndex} = ${radicand}.`,
          `${rootExpression(outerIndex, innerValue)} = ${root}, because ${root}^${outerIndex} = ${innerValue}.`,
        ],
        pkg.canonicalAnswer,
      );
    }

    case "SAP-CP004-PROT-SMALL-FACTORIAL": {
      const n = data.n!;
      const value = factorial(n);
      return explanation(
        "A factorial is the descending product from the given positive integer down to 1.",
        [`${n}! = ${descendingProduct(n, 1)}.`, `${n}! = ${value}.`],
        pkg.canonicalAnswer,
      );
    }

    case "SAP-CP004-PROT-FACTORIAL-RATIO": {
      const n = data.n!;
      const denominatorN = n - data.k!;
      const factors = descendingProduct(n, denominatorN + 1);
      return explanation(
        "Fast method: expand the numerator only until the denominator factorial appears; do not calculate the full factorials.",
        [`${n}! = ${factors} × ${denominatorN}!.`, `Cancel ${denominatorN}!: ${n}!/${denominatorN}! = ${factors} = ${pkg.canonicalAnswer}.`],
        pkg.canonicalAnswer,
      );
    }

    case "SAP-CP004-PROT-FACTORIAL-MIXED-EXPRESSION": {
      const n = data.n!;
      const base = data.base!;
      if (mode === 1) {
        const product = n * data.multiplier!;
        return explanation(
          "Cancel the factorial ratio first, then multiply and perform the final subtraction.",
          [`${n}!/${n - 1}! = ${n}.`, `${n} × ${data.multiplier!} = ${product}.`, `${product} - ${data.add!} = ${pkg.canonicalAnswer}.`],
          pkg.canonicalAnswer,
        );
      }
      if (mode === 2) {
        const ratio = n * (n - 1);
        const square = base * base;
        return explanation(
          "Expand the factorial quotient only far enough to cancel, evaluate the square separately, and subtract.",
          [`${n}!/${n - 2}! = ${n} × ${n - 1} = ${ratio}.`, `${base}^2 = ${square}.`, `${ratio} - ${square} = ${pkg.canonicalAnswer}.`],
          pkg.canonicalAnswer,
        );
      }
      if (mode === 3) {
        const radicand = base * base;
        return explanation(
          "Simplify the factorial ratio and perfect root independently, then add the two small values.",
          [`${n}!/${n - 1}! = ${n}.`, `√${radicand} = ${base}.`, `${n} + ${base} = ${pkg.canonicalAnswer}.`],
          pkg.canonicalAnswer,
        );
      }
      const square = base * base;
      return explanation(
        "Simplify the factorial ratio first, evaluate the square, and then add.",
        [`${n}!/${n - 1}! = ${n}.`, `${base}^2 = ${square}.`, `${n} + ${square} = ${pkg.canonicalAnswer}.`],
        pkg.canonicalAnswer,
      );
    }

    case "SAP-CP004-PROT-MISSING-EXPONENT": {
      const base = data.base!;
      const exponent = data.exponent!;
      const target = data.target!;
      if (exponent === 0) {
        return explanation(
          "Use the zero-exponent rule: any non-zero base raised to power 0 equals 1.",
          [`${base}^0 = 1, which matches the target ${target}.`, `Check: ${base}^0 = ${target}.`],
          pkg.canonicalAnswer,
        );
      }
      return explanation(
        "Match the target with repeated factors of the given base, then count those factors.",
        [
          `${target} = ${repeatedFactor(base, exponent)}.`,
          `There are ${exponent} factors of ${base}, so x = ${exponent}.`,
          `Check: ${base}^${exponent} = ${target}.`,
        ],
        pkg.canonicalAnswer,
      );
    }

    case "SAP-CP004-PROT-MISSING-PERFECT-RADICAND": {
      const root = data.root!;
      const index = data.index!;
      const radicand = power(BigInt(root), index);
      return explanation(
        `Reverse the ${rootName(index)} by raising the stated root to power ${index}.`,
        [`The missing radicand is ${root}^${index} = ${radicand}.`, `Check: the exact ${rootName(index)} of ${radicand} is ${root}.`],
        pkg.canonicalAnswer,
      );
    }

    case "SAP-CP004-PROT-COMPARE-POWER-ROOT-EXPRESSIONS": {
      const aValue = power(BigInt(data.aBase!), data.aExponent!);
      const bRadicand = power(BigInt(data.bRoot!), data.bIndex!);
      const bExpression = rootExpression(data.bIndex!, bRadicand);
      return explanation(
        "Evaluate both special forms exactly and compare the resulting numbers, not the visible bases or radicands.",
        [
          `A = ${data.aBase!}^${data.aExponent!} = ${aValue}.`,
          `B = ${bExpression} = ${data.bRoot!}.`,
          `${aValue} ${pkg.canonicalAnswer === "A = B" ? "=" : pkg.canonicalAnswer === "A > B" ? ">" : "<"} ${data.bRoot!}.`,
        ],
        pkg.canonicalAnswer,
      );
    }

    case "SAP-CP004-PROT-FIRST-INCORRECT-POWER-ROOT-STEP": {
      const parsed = parsePowerDiagnosis(pkg.stem);
      if (!parsed) return pkg.explanation;
      const correctPower = Number(power(BigInt(parsed.base), parsed.exponent));
      const correctRoot = Math.trunc(Math.sqrt(parsed.radicand));
      const correctTotal = correctPower + correctRoot;
      const errorStep = data.errorStep!;
      if (errorStep === 1) {
        return explanation(
          "Check the steps in order and stop as soon as a displayed equality is wrong.",
          [
            `Step 1 should be ${parsed.base}^${parsed.exponent} = ${correctPower}, not ${parsed.shownStep1}.`,
            "Step 1 is already incorrect, so later dependent steps need not be checked.",
          ],
          pkg.canonicalAnswer,
        );
      }
      if (errorStep === 2) {
        return explanation(
          "Check the steps in order and stop as soon as a displayed equality is wrong.",
          [
            `Step 1 is correct: ${parsed.base}^${parsed.exponent} = ${correctPower}.`,
            `Step 2 should be √${parsed.radicand} = ${correctRoot}, not ${parsed.shownStep2}.`,
            "Step 2 is the first incorrect step; the final dependent step need not be checked.",
          ],
          pkg.canonicalAnswer,
        );
      }
      if (errorStep === 3) {
        return explanation(
          "Check the steps in order; only after the earlier values are verified should the final arithmetic be tested.",
          [
            `Step 1 is correct: ${parsed.base}^${parsed.exponent} = ${correctPower}.`,
            `Step 2 is correct: √${parsed.radicand} = ${correctRoot}.`,
            `Step 3 should be ${correctPower} + ${correctRoot} = ${correctTotal}, not ${parsed.shownStep3}.`,
          ],
          pkg.canonicalAnswer,
        );
      }
      return explanation(
        "Check every displayed equality in order; select no error only when all three values agree.",
        [
          `Step 1 is correct: ${parsed.base}^${parsed.exponent} = ${correctPower}.`,
          `Step 2 is correct: √${parsed.radicand} = ${correctRoot}.`,
          `Step 3 is correct: ${correctPower} + ${correctRoot} = ${correctTotal}.`,
        ],
        pkg.canonicalAnswer,
      );
    }

    case "SAP-CP004-PROT-FIRST-INCORRECT-FACTORIAL-STEP": {
      const parsed = parseFactorialDiagnosis(pkg.stem);
      if (!parsed) return pkg.explanation;
      const correctRatio = parsed.n;
      const correctFactorial = Number(factorial(parsed.m));
      const correctTotal = correctRatio + correctFactorial;
      const errorStep = data.errorStep!;
      if (errorStep === 1) {
        return explanation(
          "Check the steps in order and stop at the first incorrect factorial value.",
          [
            `Step 1 should be ${parsed.n}!/${parsed.denominatorN}! = ${correctRatio}, not ${parsed.shownStep1}.`,
            "Step 1 is already incorrect, so later dependent steps need not be checked.",
          ],
          pkg.canonicalAnswer,
        );
      }
      if (errorStep === 2) {
        return explanation(
          "Check the factorial ratio first, then the separate factorial; stop at the first mismatch.",
          [
            `Step 1 is correct: ${parsed.n}!/${parsed.denominatorN}! = ${correctRatio}.`,
            `Step 2 should be ${parsed.m}! = ${correctFactorial}, not ${parsed.shownStep2}.`,
            "Step 2 is the first incorrect step; the final dependent step need not be checked.",
          ],
          pkg.canonicalAnswer,
        );
      }
      if (errorStep === 3) {
        return explanation(
          "Verify both special forms before checking the final addition.",
          [
            `Step 1 is correct: ${parsed.n}!/${parsed.denominatorN}! = ${correctRatio}.`,
            `Step 2 is correct: ${parsed.m}! = ${correctFactorial}.`,
            `Step 3 should be ${correctRatio} + ${correctFactorial} = ${correctTotal}, not ${parsed.shownStep3}.`,
          ],
          pkg.canonicalAnswer,
        );
      }
      return explanation(
        "Select no error only after the factorial ratio, factorial value, and final sum all agree.",
        [
          `Step 1 is correct: ${parsed.n}!/${parsed.denominatorN}! = ${correctRatio}.`,
          `Step 2 is correct: ${parsed.m}! = ${correctFactorial}.`,
          `Step 3 is correct: ${correctRatio} + ${correctFactorial} = ${correctTotal}.`,
        ],
        pkg.canonicalAnswer,
      );
    }
  }

  return pkg.explanation;
}

export function applySapCp004ExplanationRemediation(pkg: SapCp004Package): SapCp004Package {
  const revised = buildExplanation(pkg);
  const errors = [...pkg.validation.errors];
  if (revised.coreConcept.length < 35) errors.push("The remediated explanation strategy is too short.");
  if (revised.steps.length < 2 || revised.steps.length > 4) errors.push("The remediated explanation must contain two to four focused steps.");
  if (!revised.finalAnswer.includes(pkg.canonicalAnswer)) errors.push("The remediated final answer is not answer-bound.");
  if (/\b(?:undefined|NaN|Infinity)\b/.test([revised.coreConcept, ...revised.steps, revised.finalAnswer].join("\n"))) {
    errors.push("Malformed text appears in the remediated explanation.");
  }
  if (/(\d+\/\d+) = \1 in lowest terms/i.test(revised.steps.join("\n"))) {
    errors.push("A tautological lowest-terms statement remains in the remediated explanation.");
  }

  return Object.freeze({
    ...pkg,
    explanation: revised,
    generationIdentity: `${pkg.generationIdentity}:EXPLANATION-V2`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}
