import { asNumber, asString, primePowers, divisorsFromState, divisorCountOfInteger, math, factorExpression, factorMath, setText, buildOptions, wrong, numericFallbacks, explanation, standardResult, } from "./english-remediation-common";
export function ql052(source) {
    const state = primePowers(source.hiddenState);
    const divisorCount = asNumber(source.hiddenState.divisorCount, "divisorCount");
    const isSquare = Boolean(source.hiddenState.perfectSquareState);
    const exponent = Math.floor(divisorCount / 2);
    const answer = isSquare
        ? math(`n^{${exponent}}\\sqrt{n}`)
        : math(`n^{${exponent}}`);
    const options = buildOptions(answer, isSquare ? [
        wrong(math(`n^{${exponent}}`), "NUM-CP005-TRAP-OMITTED-MIDDLE-DIVISOR", "This omits the unpaired square-root divisor when the number of divisors is odd."),
        wrong(math(`n^{${exponent + 1}}`), "NUM-CP005-TRAP-COUNTED-MIDDLE-TWICE", "This counts the middle divisor twice."),
        wrong(math(`n^{${divisorCount}}`), "NUM-CP005-TRAP-USED-FULL-DIVISOR-COUNT", "This uses d(n) rather than the number of divisor pairs."),
    ] : [
        wrong(math(`n^{${divisorCount}}`), "NUM-CP005-TRAP-USED-FULL-DIVISOR-COUNT", "This uses d(n) rather than half the divisor count."),
        wrong(math(`n^{${Math.max(1, exponent - 1)}}`), "NUM-CP005-TRAP-OMITTED-PAIR", "This omits one complete divisor pair."),
        wrong(math(`n^{${exponent + 1}}`), "NUM-CP005-TRAP-EXTRA-PAIR", "This includes one extra divisor pair."),
    ], source.correctIndex);
    return standardResult(source, {
        stem: `Let ${math(`n=${factorExpression(state)}`)} and let ${math(`d(n)=${divisorCount}`)}. Which expression equals the product of all positive divisors of n?`,
        options,
        canonicalAnswer: answer,
        verifierAnswer: answer,
        difficulty: state.length >= 3 ? "MEDIUM" : source.difficulty,
        explanation: explanation("Divisors pair as d and n/d, and every pair has product n.", isSquare ? "Pair all divisors except the middle divisor √n, then include that middle divisor once." : "Pair the divisors from the two ends of the ordered divisor list.", isSquare ? [
            `There are ${divisorCount} divisors, so ${exponent} complete pairs and one middle divisor ${math("\\sqrt{n}")}.`,
            `Product ${math(`=n^{${exponent}}\\sqrt{n}`)}.`,
        ] : [
            `There are ${divisorCount} divisors, hence ${divisorCount / 2} divisor pairs.`,
            `Each pair has product n, so the product is ${math(`n^{${exponent}}`)}.`,
        ], "Use the divisor-pair theorem; never expand an enormous raw integer.", [
            "Use half the divisor count, not the full divisor count.",
            "For a perfect square, include √n exactly once.",
            "Do not multiply or compare huge expanded answer strings.",
        ], answer),
    });
}
export function ql053(source) {
    const state = primePowers(source.hiddenState);
    const divisors = divisorsFromState(state);
    const correct = setText(divisors);
    const withoutOne = setText(divisors.filter((value) => value !== 1));
    const withoutN = setText(divisors.slice(0, -1));
    let nonDivisor = divisors[divisors.length - 1] + 1;
    while (divisors.includes(nonDivisor))
        nonDivisor += 1;
    const replaced = [...divisors.slice(0, -1), nonDivisor].sort((left, right) => left - right);
    const options = buildOptions(correct, [
        wrong(withoutOne, "NUM-CP005-TRAP-OMITTED-ONE", "This omits 1, which divides every positive integer."),
        wrong(withoutN, "NUM-CP005-TRAP-OMITTED-N", "This omits n itself, which is always a positive divisor."),
        wrong(setText(replaced), "NUM-CP005-TRAP-INSERTED-NONDIVISOR", "This replaces a genuine divisor with a number that does not divide n."),
    ], source.correctIndex);
    return standardResult(source, {
        stem: `The prime factorisation is ${math(`n=${factorExpression(state)}`)}. Select the complete set of positive divisors of n.`,
        options,
        canonicalAnswer: correct,
        verifierAnswer: correct,
        explanation: explanation("The complete divisor set contains every product formed from the allowed prime exponents.", "Generate the exponent combinations systematically and verify both endpoints 1 and n.", [
            `The exponent ranges are ${state.map(({ prime, exponent }) => `${prime}:0\\text{ to }${exponent}`).map(math).join(", ")}.`,
            `The complete ordered set is ${correct}.`,
            `Its size is ${divisors.length}, matching ${math(state.map(({ exponent }) => `(${exponent}+1)`).join(" \\times "))}.`,
        ], "Generate divisors in prime-power blocks and check the final count.", [
            "Do not omit 1.",
            "Do not omit n.",
            "Every listed number must divide n exactly.",
        ], correct),
    });
}
export function ql054(source) {
    const state = primePowers(source.hiddenState);
    const hiddenPrime = asNumber(source.hiddenState.hiddenPrime, "hiddenPrime");
    const target = asNumber(source.hiddenState.targetDivisorCount, "targetDivisorCount");
    const knownProduct = asNumber(source.hiddenState.knownChoiceProduct, "knownChoiceProduct");
    const choiceCount = target / knownProduct;
    const answer = choiceCount - 1;
    const expression = state.map(({ prime, exponent }) => (prime === hiddenPrime ? `${prime}^{x}` : exponent === 1 ? String(prime) : `${prime}^{${exponent}}`)).join(" \\times ");
    const knownSum = state.filter(({ prime }) => prime !== hiddenPrime).reduce((sum, { exponent }) => sum + exponent + 1, 0);
    const options = buildOptions(String(answer), [
        wrong(choiceCount, "NUM-CP005-TRAP-RETURNED-X-PLUS-ONE", "This solves for x+1 but returns it as x."),
        wrong(Math.max(0, target / Math.max(1, knownSum) - 1), "NUM-CP005-TRAP-ADDED-KNOWN-CHOICES", "This adds the known exponent choices instead of multiplying them."),
        wrong(Math.max(0, target - knownProduct), "NUM-CP005-TRAP-SUBTRACTED-KNOWN-PRODUCT", "This subtracts the known choice product instead of dividing by it."),
        wrong(knownProduct, "NUM-CP005-TRAP-RETURNED-KNOWN-PRODUCT", "This returns the contribution of the known prime powers rather than the missing exponent."),
        ...numericFallbacks(answer),
    ], source.correctIndex);
    return standardResult(source, {
        stem: `If ${math(`n=${expression}`)} has exactly ${target} positive divisors, find x.`,
        options,
        canonicalAnswer: String(answer),
        verifierAnswer: String(answer),
        explanation: explanation("The unknown exponent contributes the factor x+1 to the divisor-count product.", "Separate the known exponent-choice product, divide the target by it, and finally subtract one.", [
            `${math(`(x+1)\\times${knownProduct}=${target}`)}.`,
            `${math(`x+1=${target}/${knownProduct}=${choiceCount}`)}.`,
            `${math(`x=${choiceCount}-1=${answer}`)}.`,
        ], "Divide by the known choice product first; subtract one only at the end.", [
            "Do not return x+1 as x.",
            "Multiply known exponent choices; do not add them.",
            "Do not subtract the known product from the target divisor count.",
        ], String(answer)),
    });
}
export function ql055(source) {
    const prime = asNumber(source.hiddenState.prime, "prime");
    const target = asNumber(source.hiddenState.targetDivisorCount, "targetDivisorCount");
    const exponent = target - 1;
    const correct = math(exponent === 1 ? String(prime) : `${prime}^{${exponent}}`);
    const options = buildOptions(correct, [
        wrong(math(`${prime}^{${target}}`), "NUM-CP005-TRAP-USED-D-AS-EXPONENT", "This uses the divisor count itself as the exponent."),
        wrong(math(`${prime}\\times${exponent}`), "NUM-CP005-TRAP-MULTIPLIED-PRIME-AND-EXPONENT", "This multiplies the prime by the exponent instead of raising it to that exponent."),
        wrong(math(exponent - 1 === 0 ? "1" : `${prime}^{${exponent - 1}}`), "NUM-CP005-TRAP-SUBTRACTED-TWICE", "This subtracts one twice from the divisor count."),
    ], source.correctIndex);
    return standardResult(source, {
        stem: `A positive integer is a power of the prime ${prime} and has exactly ${target} positive divisors. Which prime-power expression is the integer?`,
        options,
        canonicalAnswer: correct,
        verifierAnswer: correct,
        difficulty: target <= 3 ? "EASY" : "MEDIUM",
        explanation: explanation("A prime power p^a has exactly a+1 positive divisors.", "Set a+1 equal to the given divisor count and write the answer in prime-power form.", [
            `${math(`a+1=${target}`)}.`,
            `${math(`a=${target}-1=${exponent}`)}.`,
            `Therefore the integer is ${correct}.`,
        ], "For a prime power with d divisors, the exponent is d−1.", [
            "Do not use d itself as the exponent.",
            "Do not multiply the prime by the exponent.",
            "Keep large powers in exponential form unless expansion is explicitly required.",
        ], correct),
    });
}
function parityMatches(value, parity) {
    return parity === "ANY" || (parity === "ODD" ? value % 2 === 1 : value % 2 === 0);
}
export function ql056(source) {
    const target = asNumber(source.hiddenState.targetDivisorCount, "targetDivisorCount");
    const parity = typeof source.hiddenState.parity === "string" ? source.hiddenState.parity : "ANY";
    const answer = asNumber(source.hiddenState.integerValue, "integerValue");
    let leastIgnoringParity = 1;
    while (divisorCountOfInteger(leastIgnoringParity) !== target)
        leastIgnoringParity += 1;
    let nextValid = answer + 1;
    while (nextValid < answer + 5000 && (!parityMatches(nextValid, parity) || divisorCountOfInteger(nextValid) !== target))
        nextValid += 1;
    const primeBase = parity === "ODD" ? 3 : 2;
    const singlePrimePattern = primeBase ** (target - 1);
    const options = buildOptions(String(answer), [
        wrong(leastIgnoringParity, "NUM-CP005-TRAP-IGNORED-PARITY", "This is the least unrestricted value but may violate the required parity."),
        wrong(nextValid, "NUM-CP005-TRAP-NOT-LEAST", "This satisfies the condition but is not the least valid integer."),
        wrong(singlePrimePattern, "NUM-CP005-TRAP-USED-ONLY-PRIME-POWER-PATTERN", "This uses only the single-prime exponent pattern and ignores a smaller composite pattern."),
        wrong(target, "NUM-CP005-TRAP-RETURNED-DIVISOR-COUNT", "This returns the divisor count rather than an integer having that count."),
        ...numericFallbacks(answer),
    ], source.correctIndex);
    const parityLabel = parity === "ANY" ? "" : `${parity.toLowerCase()} `;
    return standardResult(source, {
        stem: `What is the least ${parityLabel}positive integer having exactly ${target} positive divisors?`,
        options,
        canonicalAnswer: String(answer),
        verifierAnswer: String(answer),
        explanation: explanation("A least-integer inverse problem compares all exponent patterns whose choice products equal the target divisor count.", `List the factorisations of ${target} into exponent-choice factors, apply the ${parityLabel || "unrestricted "}condition, and place larger exponents on smaller primes.`, [
            `The selected exponent pattern is ${asString(source.hiddenState.exponentPattern, "exponentPattern")}.`,
            `Assigning that pattern to the smallest admissible primes gives ${factorMath(primePowers(source.hiddenState))}.`,
            `Thus the least valid integer is ${answer}.`,
        ], "Translate factorisations of d(n) into exponent patterns before comparing candidate integers.", [
            "Do not stop at the first prime-power pattern.",
            "Apply the parity restriction before declaring the minimum.",
            "For a fixed pattern, put the largest exponent on the smallest prime.",
        ], String(answer)),
    });
}
export function ql057(source) {
    const bound = asNumber(source.hiddenState.bound, "bound");
    const target = asNumber(source.hiddenState.targetDivisorCount, "targetDivisorCount");
    const parity = asString(source.hiddenState.parity, "parity");
    const answer = Number(source.canonicalAnswer);
    const candidates = [];
    for (let value = bound; value >= 1 && candidates.length < 12; value -= 1) {
        if (value === answer || !parityMatches(value, parity))
            continue;
        candidates.push(value);
    }
    const smallerValid = candidates.find((value) => divisorCountOfInteger(value) === target);
    const wrongValues = [
        candidates.find((value) => divisorCountOfInteger(value) !== target),
        smallerValid,
        ...candidates.filter((value) => value !== smallerValid),
    ].filter((value) => value !== undefined);
    const specs = wrongValues.map((value, index) => wrong(value, index === 1 ? "NUM-CP005-TRAP-STOPPED-BEFORE-MAXIMUM" : "NUM-CP005-TRAP-DID-NOT-VERIFY-DIVISOR-COUNT", index === 1
        ? "This may satisfy the condition, but a larger admissible integer exists."
        : `This satisfies the visible bound/parity condition but has ${divisorCountOfInteger(value)} divisors, not ${target}.`));
    const options = buildOptions(String(answer), [...specs, ...numericFallbacks(answer)], source.correctIndex);
    const parityLabel = parity === "ANY" ? "" : `${parity.toLowerCase()} `;
    return standardResult(source, {
        stem: `What is the greatest ${parityLabel}positive integer not exceeding ${bound} that has exactly ${target} positive divisors?`,
        options,
        canonicalAnswer: String(answer),
        verifierAnswer: String(answer),
        difficulty: bound === answer ? "EASY" : source.difficulty,
        explanation: explanation("A bounded maximum must satisfy the bound, parity and exact divisor-count conditions simultaneously.", "Test admissible integers downward from the bound and verify the divisor count from prime exponents.", [
            `The required parity class is ${parity === "ANY" ? "unrestricted" : parity.toLowerCase()}.`,
            `${factorMath(primePowers(source.hiddenState))} has ${math(String(target))} positive divisors.`,
            `No larger admissible integer at or below ${bound} has exactly ${target} divisors, so the maximum is ${answer}.`,
        ], "Search downward only within the required parity class, checking d(n) exactly.", [
            "A number near the bound is not valid until its divisor count is checked.",
            "Do not let the options reveal parity; every option should satisfy the visible parity condition.",
            "Do not stop at a smaller valid value when a larger one exists.",
        ], String(answer)),
    });
}
