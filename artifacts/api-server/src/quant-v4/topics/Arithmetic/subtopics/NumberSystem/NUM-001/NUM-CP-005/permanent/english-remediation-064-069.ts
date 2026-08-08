import { parseFactorisation } from "./english-remediation-046-051";
import { EMPTY_SET, asNumber, asString, asNumberArray, primePowers, secondPrimePowers, divisorCountFromState, squareDivisorCountFromState, math, factorMath, factorisationTextToMath, setText, pairSetText, buildOptions, wrong, numericFallbacks, explanation, standardResult, } from "./english-remediation-common";
export function ql064(source) {
    const maximum = asNumber(source.hiddenState.maximumExponent, "maximumExponent");
    const target = asNumber(source.hiddenState.targetDivisorCount, "targetDivisorCount");
    const pairs = source.hiddenState.canonicalPairs;
    const count = Array.isArray(pairs) ? pairs.length : 0;
    const unorderedCount = Array.isArray(pairs)
        ? new Set(pairs.map((pair) => Array.isArray(pair) ? [...pair].sort((a, b) => Number(a) - Number(b)).join(",") : "")).size
        : 0;
    const options = buildOptions(String(count), [
        wrong(unorderedCount, "NUM-CP005-TRAP-COUNTED-UNORDERED-PAIRS", "This merges reversed ordered pairs even though (x,y) and (y,x) are distinct."),
        wrong(target, "NUM-CP005-TRAP-RETURNED-TARGET", "This returns the target divisor count rather than the number of exponent-pair solutions."),
        wrong(maximum + 1, "NUM-CP005-TRAP-RETURNED-BOUND-SIZE", "This counts possible values of one exponent without solving the product equation."),
        wrong((maximum + 1) ** 2, "NUM-CP005-TRAP-COUNTED-ALL-BOUNDED-PAIRS", "This counts every bounded pair without enforcing the divisor-count equation."),
        ...numericFallbacks(count),
    ], source.correctIndex);
    const pairText = pairSetText(pairs);
    return standardResult(source, {
        stem: `For ${math("n=p^{x}q^{y}")}, where p and q are distinct primes and ${math(`0\\le x,y\\le${maximum}`)}, how many ordered pairs (x,y) make n have exactly ${target} positive divisors?`,
        options,
        canonicalAnswer: String(count),
        verifierAnswer: String(count),
        explanation: explanation("The divisor-count condition becomes a bounded factor-pair equation.", `Solve ${math(`(x+1)(y+1)=${target}`)} and retain ordered pairs within the exponent bounds.`, [
            `Factor pairs of ${target} give candidate values for x+1 and y+1.`,
            `After subtracting 1 and applying ${math(`0\\le x,y\\le${maximum}`)}, the ordered-pair set is ${pairText}.`,
            `Therefore the number of ordered pairs is ${count}.`,
        ], "Work with factor pairs of the divisor count, not powers of n.", [
            "Ordered reversed pairs must be counted separately.",
            "Discard any pair that violates either exponent bound.",
            "Return the number of valid pairs, not the target divisor count.",
        ], String(count)),
    });
}
export function ql065(source) {
    const maximum = asNumber(source.hiddenState.maximumExponent, "maximumExponent");
    const target = asNumber(source.hiddenState.targetDivisorCount, "targetDivisorCount");
    const pairs = source.hiddenState.exponentPairs;
    const correct = pairSetText(pairs);
    const pairArray = Array.isArray(pairs) ? pairs : [];
    const missingReversed = pairSetText(pairArray.slice(0, Math.max(0, pairArray.length - 1)));
    const withInvalid = pairSetText([...pairArray, [maximum, maximum]]);
    const shifted = pairSetText(pairArray.map((pair, index) => index === 0 ? [Number(pair[0]) + 1, pair[1]] : pair));
    const options = buildOptions(correct, [
        wrong(missingReversed, "NUM-CP005-TRAP-OMITTED-REVERSED-PAIR", "This omits a valid reversed ordered pair."),
        wrong(withInvalid, "NUM-CP005-TRAP-ADDED-NON-SOLUTION", "This adds a bounded pair that does not satisfy the divisor-count equation."),
        wrong(shifted, "NUM-CP005-TRAP-FORGOT-SUBTRACT-ONE", "This mistranslates a factor pair into exponents."),
        wrong(EMPTY_SET, "NUM-CP005-TRAP-ASSUMED-NO-SOLUTION", "This rejects valid bounded factor pairs."),
    ], source.correctIndex);
    const factorPairs = pairArray.map((pair) => `(${Number(pair[0]) + 1},${Number(pair[1]) + 1})`).join(", ") || "none";
    return standardResult(source, {
        stem: `For ${math("n=p^{x}q^{y}")}, where p and q are distinct primes and ${math(`0\\le x,y\\le${maximum}`)}, find the complete set of ordered pairs (x,y) for which n has exactly ${target} positive divisors.`,
        options,
        canonicalAnswer: correct,
        verifierAnswer: correct,
        explanation: explanation("Every bounded ordered factor pair of the target divisor count produces one exponent pair.", `Solve ${math(`(x+1)(y+1)=${target}`)}, subtract 1 from both factor-pair entries, and apply the bounds.`, [
            `The admissible ordered factor pairs for x+1 and y+1 are ${factorPairs}.`,
            `Subtracting 1 gives ${correct}.`,
            `Every listed pair lies within ${math(`0\\le x,y\\le${maximum}`)}.`,
        ], "List ordered factor pairs and translate each immediately to avoid missing a reversed pair.", [
            "Do not merge reversed ordered pairs.",
            "Subtract 1 from each factor-pair entry.",
            "Check both exponent bounds before including a pair.",
        ], correct),
    });
}
export function ql066(source) {
    const total = asNumber(source.hiddenState.totalDivisors, "totalDivisors");
    const odd = asNumber(source.hiddenState.oddDivisors, "oddDivisors");
    const primes = asNumberArray(source.hiddenState.oddPrimes, "oddPrimes");
    const possible = Array.isArray(source.hiddenState.possibleIntegers) ? source.hiddenState.possibleIntegers.map(String) : [];
    const correct = setText(possible);
    const b = odd - 1;
    const aPlusOne = total / odd;
    const aIsIntegral = Number.isInteger(aPlusOne);
    const a = aPlusOne - 1;
    const forcedInteger = aIsIntegral && a >= 0 ? 2 ** a * primes[0] ** b : 2 ** Math.max(0, Math.floor(a)) * primes[0] ** b;
    const doubled = possible.length ? possible.map((value) => String(Number(value) * 2)) : [String(forcedInteger)];
    const shifted = possible.length ? possible.map((value) => String(Number(value) + 1)) : [String(forcedInteger + 1)];
    const singleton = possible.length ? [possible[0]] : [String(forcedInteger)];
    const options = buildOptions(correct, [
        wrong(setText(singleton), "NUM-CP005-TRAP-FORCED-NONINTEGER-EXPONENT", "This forces an exponent value even when total ÷ odd does not produce an integer choice count."),
        wrong(setText(doubled), "NUM-CP005-TRAP-EXTRA-FACTOR-TWO", "This adds an extra factor 2 after reconstructing the candidate integers."),
        wrong(setText(shifted), "NUM-CP005-TRAP-ADDED-ONE-TO-INTEGERS", "This adds 1 to candidate integers instead of checking the exponent equations."),
        wrong(setText(primes.map((prime) => prime ** Math.max(1, b))), "NUM-CP005-TRAP-IGNORED-TWO-POWER", "This ignores the recovered power of 2."),
        wrong(EMPTY_SET, "NUM-CP005-TRAP-ASSUMED-NO-SOLUTION", "This rejects valid candidates without testing the recovered exponents."),
    ], source.correctIndex);
    const aLine = aIsIntegral ? `${math(`a+1=${total}/${odd}=${aPlusOne}`)}, so ${math(`a=${a}`)}.` : `${math(`a+1=${total}/${odd}`)} is not an integer, so no exponent a exists.`;
    return standardResult(source, {
        stem: `A number has the form ${math("n=2^{a}p^{b}")}, where ${math("0\\le a\\le5")}, ${math("0\\le b\\le4")} and ${math(`p\\in\\{${primes.join(",")}\\}`)}. If n has ${total} positive divisors and ${odd} odd positive ${odd === 1 ? "divisor" : "divisors"}, find the complete set of possible values of n.`,
        options,
        canonicalAnswer: correct,
        verifierAnswer: correct,
        explanation: explanation("For n=2^a p^b, odd divisors equal b+1 and total divisors equal (a+1)(b+1).", "Recover b from the odd-divisor count, recover a from total ÷ odd, and only then substitute the allowed odd primes.", [
            `${math(`b+1=${odd}`)}, so ${math(`b=${b}`)}.`,
            aLine,
            possible.length
                ? `Substitution of the allowed primes gives ${correct}.`
                : `Because a+1 is not an integer, the possible-integer set is ${EMPTY_SET}.`,
        ], "Use total divisors ÷ odd divisors to obtain a+1 immediately.", [
            "Do not force a fractional value of a into an integer exponent.",
            "Test every allowed odd prime when a and b are valid.",
            "Equivalent empty-set notations must not appear as separate answer options.",
        ], correct),
    });
}
function candidateCounts(value) {
    const state = parseFactorisation(value);
    return { total: divisorCountFromState(state), square: squareDivisorCountFromState(state) };
}
export function ql067(source) {
    const candidates = Array.isArray(source.hiddenState.candidateStates) ? source.hiddenState.candidateStates.map(String) : [];
    const targetTotal = asNumber(source.hiddenState.totalDivisors, "totalDivisors");
    const targetSquare = asNumber(source.hiddenState.squareDivisors, "squareDivisors");
    const correctRaw = candidates.find((candidate) => {
        const counts = candidateCounts(candidate);
        return counts.total === targetTotal && counts.square === targetSquare;
    });
    if (!correctRaw)
        throw new Error("No matching factorisation candidate");
    const correct = factorisationTextToMath(correctRaw);
    const wrongSpecs = candidates.filter((candidate) => candidate !== correctRaw).map((candidate, index) => {
        const counts = candidateCounts(candidate);
        return wrong(factorisationTextToMath(candidate), `NUM-CP005-TRAP-TABLE-MISMATCH-${index + 1}`, `This row gives ${counts.total} total divisors and ${counts.square} square divisors, so it fails at least one requirement.`);
    });
    const options = buildOptions(correct, wrongSpecs, source.correctIndex);
    const steps = candidates.map((candidate) => {
        const counts = candidateCounts(candidate);
        return `${factorisationTextToMath(candidate)} gives ${math(`d(n)=${counts.total}`)} and ${counts.square} perfect-square divisors.`;
    });
    return standardResult(source, {
        stem: `Which prime factorisation has exactly ${targetTotal} positive divisors and exactly ${targetSquare} perfect-square positive ${targetSquare === 1 ? "divisor" : "divisors"}?`,
        options,
        canonicalAnswer: correct,
        verifierAnswer: correct,
        explanation: explanation("A candidate must satisfy both the total-divisor and square-divisor formulas.", "Evaluate both counts for each displayed factorisation and retain the unique common match.", steps, "Reject a row as soon as either required count fails.", [
            "Do not accept a row that satisfies only the total-divisor count.",
            "Square-divisor choices use floor(e/2)+1.",
            "Keep each exponent attached to its own base by rendering the whole factorisation as one math expression.",
        ], correct),
    });
}
function metricLabel(metric) {
    if (metric === "TOTAL_DIVISORS")
        return "total positive divisors";
    if (metric === "ODD_DIVISORS")
        return "odd positive divisors";
    return "perfect-square positive divisors";
}
export function ql068(source) {
    const firstState = primePowers(source.hiddenState);
    const secondState = secondPrimePowers(source.hiddenState);
    const metric = asString(source.hiddenState.metricKind, "metricKind");
    const first = asNumber(source.hiddenState.firstValue, "firstValue");
    const second = asNumber(source.hiddenState.secondValue, "secondValue");
    const relation = first > second ? "Number A" : second > first ? "Number B" : "They are equal";
    const correct = `A has ${first} and B has ${second}; ${relation}.`;
    const options = buildOptions(correct, [
        wrong(`A has ${second} and B has ${first}; ${first > second ? "Number B" : second > first ? "Number A" : "They are equal"}.`, "NUM-CP005-TRAP-SWAPPED-VALUES", "This swaps the two computed divisor-function values."),
        wrong(`A has ${first} and B has ${second}; ${relation === "Number A" ? "Number B" : "Number A"}.`, "NUM-CP005-TRAP-REVERSED-COMPARISON", "This computes both values correctly but reverses the comparison."),
        wrong(`A has ${first + 1} and B has ${second}; ${first + 1 > second ? "Number A" : first + 1 < second ? "Number B" : "They are equal"}.`, "NUM-CP005-TRAP-WRONG-A-VALUE", "This uses an incorrect divisor-function value for Number A."),
        wrong(`A has ${first} and B has ${second + 1}; ${first > second + 1 ? "Number A" : first < second + 1 ? "Number B" : "They are equal"}.`, "NUM-CP005-TRAP-WRONG-B-VALUE", "This uses an incorrect divisor-function value for Number B."),
    ], source.correctIndex);
    return standardResult(source, {
        stem: `Number A is ${factorMath(firstState)} and Number B is ${factorMath(secondState)}. Which option correctly compares their ${metricLabel(metric)}?`,
        options,
        canonicalAnswer: correct,
        verifierAnswer: correct,
        explanation: explanation("Comparison questions must evaluate the same divisor function for both numbers before comparing the results.", `Compute ${metricLabel(metric)} separately for A and B.`, [
            `Number A gives ${first}.`,
            `Number B gives ${second}.`,
            `${math(`${first}${first > second ? ">" : first < second ? "<" : "="}${second}`)}, so ${relation}.`,
        ], "Place the two computed values side by side; do not compare the integers themselves.", [
            "Do not swap the values for A and B.",
            "Do not reverse the greater-than comparison.",
            "Use the same named divisor function for both numbers.",
        ], correct),
    });
}
const DS_OPTIONS = [
    "Statement I alone is sufficient, but Statement II alone is not.",
    "Statement II alone is sufficient, but Statement I alone is not.",
    "Both statements together are sufficient, but neither statement alone is sufficient.",
    "Even both statements together are not sufficient.",
];
export function ql069(source) {
    const state = primePowers(source.hiddenState);
    const first = asNumberArray(source.hiddenState.firstCandidates, "firstCandidates");
    const second = asNumberArray(source.hiddenState.secondCandidates, "secondCandidates");
    const combined = asNumberArray(source.hiddenState.combinedCandidates, "combinedCandidates");
    const firstSufficient = first.length === 1;
    const secondSufficient = second.length === 1;
    let correct;
    if (firstSufficient && !secondSufficient)
        correct = DS_OPTIONS[0];
    else if (secondSufficient && !firstSufficient)
        correct = DS_OPTIONS[1];
    else if (!firstSufficient && !secondSufficient && combined.length === 1)
        correct = DS_OPTIONS[2];
    else if (!firstSufficient && !secondSufficient && combined.length !== 1)
        correct = DS_OPTIONS[3];
    else
        throw new Error("Either-statement-alone DS class is unsupported by the four-option contract");
    const options = buildOptions(correct, DS_OPTIONS.filter((value) => value !== correct).map((value, index) => wrong(value, `NUM-CP005-TRAP-DS-${index + 1}`, "This category does not match the number of candidates left by the two statements separately and together.")), source.correctIndex);
    const known = asNumber(source.hiddenState.knownExponent, "knownExponent");
    const firstPrime = state[0]?.prime ?? 2;
    const secondPrime = state[1]?.prime ?? 3;
    return standardResult(source, {
        stem: `For ${math(`n=${firstPrime}^{x}\\times${secondPrime}^{${known}}`)} with ${math("x\\in\\{0,1,2,3,4,5\\}")}, determine sufficiency. ${source.stem.replace(/^.*?Statement I:/u, "Statement I:")}`,
        options,
        canonicalAnswer: correct,
        verifierAnswer: correct,
        explanation: explanation("A statement is sufficient only when it leaves exactly one allowed value of the unknown exponent.", "Form the candidate set from Statement I, from Statement II, and from their intersection.", [
            `Statement I leaves ${math(`x\\in\\{${first.join(",")}\\}`)}; therefore I alone is ${firstSufficient ? "sufficient" : "not sufficient"}.`,
            `Statement II leaves ${math(`x\\in\\{${second.join(",")}\\}`)}; therefore II alone is ${secondSufficient ? "sufficient" : "not sufficient"}.`,
            `Together they leave ${math(`x\\in\\{${combined.join(",")}\\}`)}.`,
        ], "Judge sufficiency from candidate-set size: exactly one candidate means sufficient.", [
            "The four answer categories must be mutually exclusive.",
            "Do not call a statement sufficient merely because the hidden value satisfies it.",
            "When neither statement is sufficient alone, test their intersection.",
        ], correct),
    });
}
