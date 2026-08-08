import { asNumber, asString, primePowers, product, divisorCountFromState, oddDivisorCountFromState, integerFromState, geometricSum, math, factorExpression, factorMath, factorisationTextToMath, buildOptions, wrong, numericFallbacks, explanation, ordinalPower, legalExponentSequence, standardResult, } from "./english-remediation-common";
export function ql046(source) {
    const state = primePowers(source.hiddenState);
    const total = divisorCountFromState(state);
    const proper = /proper/u.test(source.stem);
    const answer = proper ? total - 1 : total;
    const additive = state.reduce((sum, { exponent }) => sum + exponent + 1, 0);
    const withoutOffsets = product(state.map(({ exponent }) => Math.max(1, exponent)));
    const choices = state.map(({ exponent }) => `(${exponent}+1)`).join(" \\times ");
    const options = buildOptions(String(answer), [
        wrong(additive, "NUM-CP005-TRAP-ADD-CHOICES", "This adds independent exponent choices instead of multiplying them."),
        wrong(withoutOffsets, "NUM-CP005-TRAP-FORGET-PLUS-ONE", "This forgets that exponent 0 is also available for every prime."),
        wrong(proper ? total : Math.max(0, total - 1), "NUM-CP005-TRAP-ENDPOINT", proper ? "This includes n even though proper divisors exclude it." : "This excludes n even though all positive divisors are required."),
        ...numericFallbacks(answer),
    ], source.correctIndex);
    return standardResult(source, {
        stem: proper
            ? `Given ${math(`n=${factorExpression(state)}`)}, how many proper positive divisors does n have?`
            : `Given ${math(`n=${factorExpression(state)}`)}, how many positive divisors does n have?`,
        options,
        canonicalAnswer: String(answer),
        verifierAnswer: String(answer),
        explanation: explanation("For a prime factorisation, each divisor is obtained by independently choosing the exponent of every prime.", `Use the exponent-choice product for ${factorMath(state)}${proper ? ", then exclude n itself" : ""}.`, [
            `The exponent choices are ${math(choices)}.`,
            `Total positive divisors ${math(`=${choices}=${total}`)}.`,
            proper ? `Proper divisors ${math(`=${total}-1=${answer}`)}.` : `Therefore the required count is ${answer}.`,
        ], proper ? "Count all positive divisors and subtract exactly one for n." : "Multiply the exponent choices directly; divisor listing is unnecessary.", [
            "Do not add independent exponent choices.",
            "Do not forget the zero exponent choice.",
            proper ? "Proper divisors include 1 but exclude n." : "All positive divisors include both 1 and n.",
        ], String(answer)),
    });
}
export function ql047(source) {
    const state = primePowers(source.hiddenState);
    const total = divisorCountFromState(state);
    const odd = oddDivisorCountFromState(state);
    const even = total - odd;
    const asksEven = /even/u.test(source.stem);
    const answer = asksEven ? even : odd;
    const other = asksEven ? odd : even;
    const noOffset = product(state.map(({ exponent }) => Math.max(1, exponent)));
    const options = buildOptions(String(answer), [
        wrong(total, "NUM-CP005-TRAP-USED-TOTAL", "This counts all divisors and ignores the odd/even restriction."),
        wrong(other, "NUM-CP005-TRAP-REVERSED-PARITY", `This computes the ${asksEven ? "odd" : "even"} divisor count instead.`),
        wrong(noOffset, "NUM-CP005-TRAP-FORGET-PLUS-ONE", "This omits the zero exponent choice."),
        ...numericFallbacks(answer),
    ], source.correctIndex);
    const oddFactors = state.filter(({ prime }) => prime !== 2).map(({ exponent }) => `(${exponent}+1)`);
    return standardResult(source, {
        stem: `For ${math(`n=${factorExpression(state)}`)}, how many positive divisors are ${asksEven ? "even" : "odd"}?`,
        options,
        canonicalAnswer: String(answer),
        verifierAnswer: String(answer),
        explanation: explanation("Odd divisors use no factor 2; even divisors are obtained by subtracting odd divisors from all divisors.", `First compute the total divisor count and the odd-divisor count for ${factorMath(state)}.`, [
            `Total divisors ${math(`=${state.map(({ exponent }) => `(${exponent}+1)`).join(" \\times ")}=${total}`)}.`,
            `Odd divisors ${math(`=${oddFactors.length ? oddFactors.join(" \\times ") : "1"}=${odd}`)}.`,
            asksEven ? `Even divisors ${math(`=${total}-${odd}=${even}`)}.` : `Hence the required odd-divisor count is ${odd}.`,
        ], asksEven ? "Use total divisors minus odd divisors." : "Fix the exponent of 2 at 0 and multiply the remaining choices.", [
            "Do not count every divisor when a parity restriction is given.",
            "For an odd divisor, the exponent of 2 must be 0.",
            "Even-divisor count is total minus odd, not total minus one.",
        ], String(answer)),
    });
}
export function parseFactorisation(value) {
    if (value.trim() === "1")
        return [];
    return value.split(/\s*×\s*/u).map((term) => {
        const match = term.trim().match(/^(\d+)(?:\^(\d+))?$/u);
        if (!match)
            throw new Error(`Unsupported factorisation term: ${term}`);
        return { prime: Number(match[1]), exponent: Number(match[2] ?? 1) };
    });
}
function countDivisorsDivisibleBy(state, requirement) {
    const required = new Map(requirement.map(({ prime, exponent }) => [prime, exponent]));
    let count = 1;
    for (const { prime, exponent } of state) {
        const minimum = required.get(prime) ?? 0;
        if (minimum > exponent)
            return 0;
        count *= exponent - minimum + 1;
    }
    return count;
}
export function ql048(source) {
    const state = primePowers(source.hiddenState);
    const requirementText = asString(source.hiddenState.requirementFactorisation, "requirementFactorisation");
    const requirement = parseFactorisation(requirementText);
    const total = divisorCountFromState(state);
    const divisible = countDivisorsDivisibleBy(state, requirement);
    const asksNot = source.hiddenState.totalDivisorCount !== undefined || /not divisible/u.test(source.stem);
    const answer = asksNot ? total - divisible : divisible;
    const options = buildOptions(String(answer), [
        wrong(total, "NUM-CP005-TRAP-USED-TOTAL", "This ignores the divisibility restriction and counts every divisor."),
        wrong(divisible, "NUM-CP005-TRAP-REVERSED-COMPLEMENT", asksNot ? "This counts divisors divisible by k rather than those not divisible by k." : "This is the governed divisible count only when all lower exponent bounds are applied."),
        wrong(total - divisible, "NUM-CP005-TRAP-REVERSED-COMPLEMENT", asksNot ? "This value is valid only after subtracting the divisible count from the total." : "This counts the complement that is not divisible by k."),
        wrong(state.reduce((sum, { exponent }) => sum + exponent + 1, 0), "NUM-CP005-TRAP-ADD-CHOICES", "This adds exponent choices instead of multiplying the allowed ranges."),
        ...numericFallbacks(answer),
    ], source.correctIndex);
    const allowed = state.map(({ prime, exponent }) => {
        const minimum = requirement.find((entry) => entry.prime === prime)?.exponent ?? 0;
        return `${prime}: ${minimum}\\text{ to }${exponent}\\Rightarrow${exponent - minimum + 1}\\text{ choices}`;
    });
    return standardResult(source, {
        stem: `Let ${math(`n=${factorExpression(state)}`)}. How many positive divisors of n are ${asksNot ? "not " : ""}divisible by ${factorisationTextToMath(requirementText)}?`,
        options,
        canonicalAnswer: String(answer),
        verifierAnswer: String(answer),
        explanation: explanation("Divisibility by k imposes a lower bound on the exponent of every prime appearing in k.", `Count the divisors satisfying the lower exponent bounds for ${factorisationTextToMath(requirementText)}${asksNot ? ", then subtract from the total" : ""}.`, [
            ...allowed.map((line) => math(line)),
            `Divisors divisible by k ${math(`=${divisible}`)}; total divisors ${math(`=${total}`)}.`,
            asksNot ? `Required count ${math(`=${total}-${divisible}=${answer}`)}.` : `Therefore the required count is ${answer}.`,
        ], asksNot ? "Count the divisible subset first and subtract it from the total." : "For each prime, count exponents from the required minimum to the exponent in n.", [
            "Do not impose a restriction on primes that are absent from k.",
            "A required exponent is a lower bound, not one fixed exponent.",
            asksNot ? "Use the complement only after computing the total correctly." : "Do not count divisors that fall below any required exponent.",
        ], String(answer)),
    });
}
export function ql049(source) {
    const state = primePowers(source.hiddenState);
    const first = asNumber(source.hiddenState.divisibleByFirst, "divisibleByFirst");
    const both = asNumber(source.hiddenState.divisibleByBoth, "divisibleByBoth");
    const answer = first - both;
    const k1 = asString(source.hiddenState.firstRequirement, "firstRequirement");
    const k2 = asString(source.hiddenState.secondRequirement, "secondRequirement");
    const options = buildOptions(String(answer), [
        wrong(first, "NUM-CP005-TRAP-IGNORED-SECOND-CONDITION", "This counts all divisors divisible by the first condition and does not remove the overlap."),
        wrong(both, "NUM-CP005-TRAP-USED-INTERSECTION", "This returns the intersection instead of the required set difference."),
        wrong(first + both, "NUM-CP005-TRAP-ADDED-OVERLAP", "This adds the overlap rather than subtracting it."),
        wrong(0, "NUM-CP005-TRAP-ASSUMED-EMPTY", "This assumes the two conditions leave no valid divisor."),
        ...numericFallbacks(answer),
    ], source.correctIndex);
    return standardResult(source, {
        stem: `Let ${math(`n=${factorExpression(state)}`)}. How many positive divisors are divisible by ${factorisationTextToMath(k1)} but not by ${factorisationTextToMath(k2)}?`,
        options,
        canonicalAnswer: String(answer),
        verifierAnswer: String(answer),
        explanation: explanation("“Divisible by the first but not the second” is a set-difference count.", "Count the first condition, count the overlap satisfying both conditions, then subtract.", [
            `Divisors satisfying the first condition ${math(`=${first}`)}.`,
            `Divisors satisfying both conditions ${math(`=${both}`)}.`,
            `Required count ${math(`=${first}-${both}=${answer}`)}.`,
        ], "Use first-condition count minus overlap count.", [
            "Do not return the full first-condition count.",
            "Do not return only the overlap.",
            "Subtract the overlap; do not add it.",
        ], String(answer)),
    });
}
export function ql050(source) {
    const state = primePowers(source.hiddenState);
    const power = source.hiddenState.power === undefined ? 2 : asNumber(source.hiddenState.power, "power");
    const legalCounts = state.map(({ exponent }) => Math.floor(exponent / power) + 1);
    const answer = product(legalCounts);
    const total = divisorCountFromState(state);
    const omittedZero = product(state.map(({ exponent }) => Math.max(1, Math.floor(exponent / power))));
    const addedCounts = legalCounts.reduce((sum, value) => sum + value, 0);
    const adjacentPower = Math.max(2, power - 1);
    const adjacentCount = product(state.map(({ exponent }) => Math.floor(exponent / adjacentPower) + 1));
    const options = buildOptions(String(answer), [
        wrong(total, "NUM-CP005-TRAP-COUNTED-ALL-DIVISORS", "This counts all divisors instead of only perfect-power divisors."),
        wrong(omittedZero, "NUM-CP005-TRAP-OMITTED-ZERO-EXPONENT", "This omits exponent 0, which is a legal multiple of the required power."),
        wrong(addedCounts, "NUM-CP005-TRAP-ADDED-INDEPENDENT-CHOICES", "This adds the legal exponent counts instead of multiplying independent choices."),
        wrong(adjacentCount, "NUM-CP005-TRAP-WRONG-POWER-STEP", "This uses the wrong step size between legal exponents."),
        ...numericFallbacks(answer),
    ], source.correctIndex);
    const sequenceLines = state.map(({ prime, exponent }) => (`For prime ${prime}, legal exponents are ${legalExponentSequence(exponent, power)}, giving ${Math.floor(exponent / power) + 1} choices.`));
    return standardResult(source, {
        stem: `For ${math(`n=${factorExpression(state)}`)}, how many positive divisors are ${ordinalPower(power)}?`,
        options,
        canonicalAnswer: String(answer),
        verifierAnswer: String(answer),
        explanation: explanation(`A divisor is a perfect ${power}th power only when every chosen prime exponent is a multiple of ${power}.`, `List the legal exponents in steps of ${power} for each prime, then multiply the choice counts.`, [
            ...sequenceLines,
            `Required count ${math(`=${legalCounts.join(" \\times ")}=${answer}`)}.`,
        ], `For exponent a, use ${math(`\\lfloor a/${power}\\rfloor+1`)} choices.`, [
            "Exponent 0 is always a legal choice.",
            "Use multiples of the required power, not consecutive exponents.",
            "Multiply the legal choices for different primes.",
        ], String(answer)),
    });
}
export function ql051(source) {
    const state = primePowers(source.hiddenState);
    const factors = state.map(({ prime, exponent }) => geometricSum(prime, exponent));
    const totalSum = product(factors);
    const integerValue = integerFromState(state);
    const proper = /proper/u.test(source.stem) || source.hiddenState.allDivisorSum !== undefined;
    const answer = proper ? totalSum - integerValue : totalSum;
    const divisorCount = divisorCountFromState(state);
    const addedGeometricFactors = factors.reduce((sum, value) => sum + value, 0);
    const options = buildOptions(String(answer), [
        wrong(totalSum, "NUM-CP005-TRAP-USED-ALL-DIVISOR-SUM", proper ? "This includes n, so it is the sum of all divisors rather than proper divisors." : "This is correct only after multiplying every geometric factor."),
        wrong(proper ? totalSum - 1 : totalSum - integerValue, "NUM-CP005-TRAP-WRONG-ENDPOINT-SUBTRACTION", proper ? "This removes 1 instead of removing n." : "This returns the proper-divisor sum instead of the sum of all divisors."),
        wrong(divisorCount, "NUM-CP005-TRAP-USED-DIVISOR-COUNT", "This uses the divisor-count formula instead of the divisor-sum formula."),
        wrong(addedGeometricFactors, "NUM-CP005-TRAP-ADDED-GEOMETRIC-FACTORS", "This adds the prime-power sums instead of multiplying them."),
        ...numericFallbacks(answer),
    ], source.correctIndex);
    const expandedFactors = state.map(({ prime, exponent }) => {
        const terms = Array.from({ length: exponent + 1 }, (_unused, power) => power === 0 ? "1" : power === 1 ? String(prime) : `${prime}^{${power}}`);
        return `(${terms.join("+")})`;
    });
    return standardResult(source, {
        stem: `For ${math(`n=${factorExpression(state)}`)}, find the sum of all ${proper ? "proper " : ""}positive divisors.`,
        options,
        canonicalAnswer: String(answer),
        verifierAnswer: String(answer),
        explanation: explanation("The sum-of-divisors function is the product of one geometric sum for each prime power.", `Build and multiply the geometric sums for ${factorMath(state)}${proper ? ", then subtract n" : ""}.`, [
            `${math(`\\sigma(n)=${expandedFactors.join(" \\times ")}`)}.`,
            `${math(`\\sigma(n)=${factors.join(" \\times ")}=${totalSum}`)}.`,
            proper ? `Proper-divisor sum ${math(`=${totalSum}-${integerValue}=${answer}`)}.` : `Therefore the required sum is ${answer}.`,
        ], proper ? "Compute σ(n) and subtract n, not 1." : "Evaluate each geometric factor first, then multiply.", [
            "Do not use the divisor-count formula for a divisor-sum question.",
            "Multiply the geometric sums; do not add them.",
            proper ? "Proper divisors exclude n but include 1." : "The sum of all divisors includes both 1 and n.",
        ], String(answer)),
    });
}
