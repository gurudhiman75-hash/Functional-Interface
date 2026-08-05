import { asNumber, asString, asNumberArray, primePowers, divisorsFromState, math, factorExpression, buildOptions, wrong, numericFallbacks, explanation, standardResult, } from "./english-remediation-common";
export function ql058(source) {
    const state = primePowers(source.hiddenState);
    const integerValue = asNumber(source.hiddenState.integerValue, "integerValue");
    const bound = asNumber(source.hiddenState.bound, "bound");
    const divisors = divisorsFromState(state);
    const atOrBelow = divisors.filter((value) => value <= bound);
    const answer = atOrBelow[atOrBelow.length - 1];
    const previous = atOrBelow.length > 1 ? atOrBelow[atOrBelow.length - 2] : 1;
    const above = divisors.find((value) => value > bound);
    const complement = integerValue / answer;
    const options = buildOptions(String(answer), [
        ...(above === undefined ? [] : [wrong(above, "NUM-CP005-TRAP-IGNORED-BOUND", "This is a divisor of n but exceeds the stated bound.")]),
        wrong(previous, "NUM-CP005-TRAP-STOPPED-EARLY", "This is a divisor below the bound, but it is not the greatest one."),
        wrong(complement, "NUM-CP005-TRAP-USED-COMPLEMENTARY-DIVISOR", "This returns the paired complementary divisor rather than the greatest divisor within the bound."),
        wrong(bound, "NUM-CP005-TRAP-ASSUMED-BOUND-IS-DIVISOR", "This assumes the bound itself divides n without checking."),
        ...numericFallbacks(answer),
    ], source.correctIndex);
    return standardResult(source, {
        stem: `For ${math(`n=${factorExpression(state)}`)}, find the greatest positive divisor not exceeding ${bound}.`,
        options,
        canonicalAnswer: String(answer),
        verifierAnswer: String(answer),
        difficulty: answer === bound ? "EASY" : source.difficulty,
        explanation: explanation("The required value must be both a divisor of n and no greater than the bound.", "Generate the divisors near the bound and select the largest admissible one.", [
            `The divisors at or below ${bound} end with ${atOrBelow.slice(-3).join(", ")}.`,
            `${answer} divides ${integerValue} exactly because ${math(`${integerValue}/${answer}=${integerValue / answer}`)}.`,
            `Therefore the greatest permitted divisor is ${answer}.`,
        ], "Check divisors around the bound; do not assume the bound itself is a divisor.", [
            "A divisor above the bound is inadmissible.",
            "A smaller valid divisor is not the greatest one.",
            "The complementary divisor need not lie on the required side of the bound.",
        ], String(answer)),
    });
}
export function ql059(source) {
    const state = primePowers(source.hiddenState);
    const divisors = divisorsFromState(state);
    const index = asNumber(source.hiddenState.requestedIndex, "requestedIndex");
    const answer = divisors[index - 1];
    const previous = divisors[index - 2];
    const next = divisors[index];
    const integerValue = asNumber(source.hiddenState.integerValue, "integerValue");
    const complement = integerValue / answer;
    const options = buildOptions(String(answer), [
        ...(previous === undefined ? [] : [wrong(previous, "NUM-CP005-TRAP-ZERO-BASED-INDEX", "This selects the preceding divisor by treating the rank as zero-based.")]),
        ...(next === undefined ? [] : [wrong(next, "NUM-CP005-TRAP-NEXT-DIVISOR", "This selects the next divisor after the requested rank.")]),
        wrong(complement, "NUM-CP005-TRAP-USED-PAIRED-DIVISOR", "This returns the complementary paired divisor rather than the divisor at the requested rank."),
        wrong(index, "NUM-CP005-TRAP-RETURNED-RANK", "This returns the rank number itself instead of the divisor at that rank."),
        ...divisors.filter((value) => value !== answer).slice(0, 5).map((value) => wrong(value, "NUM-CP005-TRAP-WRONG-RANK", "This is a divisor of n, but it is not at the requested one-based rank.")),
    ], source.correctIndex);
    return standardResult(source, {
        stem: `The positive divisors of ${math(`n=${factorExpression(state)}`)} are arranged in increasing order. What is the divisor at position ${index}?`,
        options,
        canonicalAnswer: String(answer),
        verifierAnswer: String(answer),
        difficulty: index === 1 || index === divisors.length ? "EASY" : source.difficulty,
        explanation: explanation("Indexed-divisor questions use the fully ordered divisor list with one-based positions.", "Generate the divisors in increasing order and read the requested one-based position.", [
            `The ordered list contains ${divisors.length} divisors.`,
            `Around position ${index}, the list is ${divisors.slice(Math.max(0, index - 3), Math.min(divisors.length, index + 2)).join(", ")}.`,
            `The divisor at position ${index} is ${answer}.`,
        ], index === 1 ? "The first positive divisor is always 1." : index === divisors.length ? "The last positive divisor is always n." : "Merge divisor pairs into one increasing list before applying the rank.", [
            "Positions are one-based, not zero-based.",
            "A complementary divisor is not automatically at the requested rank.",
            "Do not return the rank number as the divisor value.",
        ], String(answer)),
    });
}
export function ql060(source) {
    const lower = asNumber(source.hiddenState.lower, "lower");
    const upper = asNumber(source.hiddenState.upper, "upper");
    const target = asNumber(source.hiddenState.targetDivisorCount, "targetDivisorCount");
    const matches = asNumberArray(source.hiddenState.matches, "matches");
    const answer = matches.length;
    const rangeSize = upper - lower + 1;
    const firstMatchOrLower = matches[0] ?? lower;
    const sumOfMatches = matches.reduce((sum, value) => sum + value, 0);
    const options = buildOptions(String(answer), [
        wrong(target, "NUM-CP005-TRAP-RETURNED-TARGET-DIVISOR-COUNT", "This returns the required divisor count for each integer, not the number of matching integers."),
        wrong(rangeSize, "NUM-CP005-TRAP-COUNTED-ENTIRE-INTERVAL", "This counts every integer in the interval without testing d(n)."),
        wrong(firstMatchOrLower, "NUM-CP005-TRAP-RETURNED-FIRST-VALUE", "This returns an interval value rather than the number of valid values."),
        wrong(sumOfMatches, "NUM-CP005-TRAP-SUMMED-MATCHES", "This adds the matching integers instead of counting them."),
        ...numericFallbacks(answer),
    ], source.correctIndex);
    return standardResult(source, {
        stem: `How many integers in the inclusive interval ${math(`[${lower},${upper}]`)} have exactly ${target} positive divisors?`,
        options,
        canonicalAnswer: String(answer),
        verifierAnswer: String(answer),
        explanation: explanation("The question asks for the number of interval values satisfying an exact divisor-count condition.", "Test each candidate in the inclusive interval and count only those with d(n) equal to the target.", [
            `The matching integers are ${matches.length ? matches.join(", ") : "none"}.`,
            `Number of matches ${math(`=${answer}`)}.`,
        ], "Use structural forms when possible—for example, d(n)=2 means n is prime and d(n)=3 means n is a square of a prime.", [
            "Do not return the target divisor count itself.",
            "Do not count every number in the interval.",
            "Count matching values; do not sum them.",
        ], String(answer)),
    });
}
export function ql061(source) {
    const state = primePowers(source.hiddenState);
    const label = asString(source.hiddenState.propertyLabel, "propertyLabel");
    const actual = asString(source.hiddenState.actualValue, "actualValue");
    const claimed = asString(source.hiddenState.claimedValue, "claimedValue");
    const isTrue = asString(source.hiddenState.claimPolarity, "claimPolarity") === "True";
    const correct = `The claim is ${isTrue ? "correct" : "incorrect"}; the actual value is ${actual}.`;
    const wrongValue1 = String(Number(actual) + 1);
    const wrongValue2 = String(Math.max(0, Number(actual) - 1));
    const options = buildOptions(correct, [
        wrong(`The claim is ${isTrue ? "incorrect" : "correct"}; the actual value is ${actual}.`, "NUM-CP005-TRAP-REVERSED-VERDICT", "This computes the value correctly but reverses the truth verdict."),
        wrong(`The claim is correct; the actual value is ${wrongValue1}.`, "NUM-CP005-TRAP-WRONG-PROPERTY-VALUE", "This uses an incorrect divisor-function value."),
        wrong(`The claim is incorrect; the actual value is ${wrongValue2}.`, "NUM-CP005-TRAP-WRONG-PROPERTY-VALUE", "This uses an incorrect divisor-function value."),
        wrong(`The claim is correct; the actual value is ${claimed}.`, "NUM-CP005-TRAP-ACCEPTED-CLAIM-WITHOUT-CHECK", "This repeats the claimed value without independently computing it."),
    ], source.correctIndex);
    return standardResult(source, {
        stem: `For ${math(`n=${factorExpression(state)}`)}, a student claims that its ${label} is ${claimed}. Which option correctly evaluates the claim?`,
        options,
        canonicalAnswer: correct,
        verifierAnswer: correct,
        explanation: explanation("A numerical claim must be checked by independently evaluating the stated divisor function.", `Compute the ${label} from the prime exponents, then compare it with ${claimed}.`, [
            `The governed calculation gives ${label} ${math(`=${actual}`)}.`,
            `${math(`${actual}${isTrue ? "=" : "\\ne"}${claimed}`)}.`,
            `Therefore ${correct.toLowerCase()}`,
        ], "Compute first and judge the claim second.", [
            "Do not accept a claim merely because its number is close to the true value.",
            "Do not reverse the truth verdict after obtaining the correct calculation.",
            "Use the divisor function named in the claim, not a related formula.",
        ], correct),
    });
}
const STATEMENT_LABELS = [
    "None",
    "I only",
    "II only",
    "I and II only",
    "III only",
    "I and III only",
    "II and III only",
    "I, II and III",
];
export function ql062(source) {
    const state = primePowers(source.hiddenState);
    const claims = asNumberArray(source.hiddenState.claims, "claims");
    const actuals = asNumberArray(source.hiddenState.actuals, "actuals");
    const mask = asNumber(source.hiddenState.truthMask, "truthMask");
    const correct = STATEMENT_LABELS[mask];
    const alternativeMasks = [mask ^ 1, mask ^ 2, mask ^ 4, 7 - mask, (mask + 3) % 8];
    const options = buildOptions(correct, alternativeMasks.map((candidate, index) => wrong(STATEMENT_LABELS[candidate], `NUM-CP005-TRAP-STATEMENT-PATTERN-${index + 1}`, "This truth combination results from mischecking at least one of the three divisor functions.")), source.correctIndex);
    return standardResult(source, {
        stem: `Let ${math(`n=${factorExpression(state)}`)}. Consider: I. n has ${claims[0]} positive divisors. II. n has ${claims[1]} odd positive ${claims[1] === 1 ? "divisor" : "divisors"}. III. n has ${claims[2]} perfect-square positive ${claims[2] === 1 ? "divisor" : "divisors"}. Which statements are correct?`,
        options,
        canonicalAnswer: correct,
        verifierAnswer: correct,
        explanation: explanation("Each statement must be checked independently with the divisor function it names.", "Compute total, odd and perfect-square divisor counts in separate lines, then form the truth combination.", [
            `I: total divisors ${math(`=${state.map(({ exponent }) => `(${exponent}+1)`).join(" \\times ")}=${actuals[0]}`)}, so I is ${claims[0] === actuals[0] ? "true" : "false"}.`,
            `II: odd divisors ${math(`=${actuals[1]}`)}, so II is ${claims[1] === actuals[1] ? "true" : "false"}.`,
            `III: square divisors ${math(`=${actuals[2]}`)}, so III is ${claims[2] === actuals[2] ? "true" : "false"}.`,
        ], "Write the three computed values in one row and compare them with I, II and III.", [
            "Do not use the total-divisor formula for the odd-divisor statement.",
            "For square divisors, use floor(e/2)+1 for every prime exponent.",
            "Check all three statements before selecting a combination.",
        ], correct),
    });
}
export function ql063(source) {
    const integerValue = asNumber(source.hiddenState.integerValue, "integerValue");
    const visible = asNumber(source.hiddenState.visiblePartner, "visiblePartner");
    const answer = integerValue / visible;
    const divisors = divisorsFromState(primePowers(source.hiddenState));
    const nearby = divisors.filter((value) => value !== answer && value !== visible).sort((left, right) => Math.abs(left - answer) - Math.abs(right - answer));
    const options = buildOptions(String(answer), [
        wrong(integerValue, "NUM-CP005-TRAP-COPIED-N", "This copies n instead of dividing by the visible partner."),
        wrong(visible, "NUM-CP005-TRAP-COPIED-VISIBLE-FACTOR", "This repeats the visible factor instead of finding its pair."),
        ...nearby.slice(0, 4).map((value) => wrong(value, "NUM-CP005-TRAP-NEARBY-DIVISOR", "This is a divisor of n but is not paired with the displayed factor.")),
        ...numericFallbacks(answer),
    ], source.correctIndex);
    return standardResult(source, {
        stem: `A divisor-pair row for ${integerValue} is ${math(`${visible}\\times ?=${integerValue}`)}. What replaces the question mark?`,
        options,
        canonicalAnswer: String(answer),
        verifierAnswer: String(answer),
        representation: "DIVISOR_PAIR_TABLE",
        difficulty: String(integerValue).length >= 5 ? "MEDIUM" : "EASY",
        explanation: explanation("The two entries in a divisor-pair row multiply to n.", "Divide n by the visible partner; listing the complete factor table is unnecessary.", [
            `${math(`?=${integerValue}/${visible}`)}.`,
            `${math(`?=${answer}`)}.`,
            `Check: ${math(`${visible}\\times${answer}=${integerValue}`)}.`,
        ], "Use n ÷ visible partner.", [
            "Do not copy the visible factor.",
            "Do not choose a nearby divisor that belongs to another pair.",
            "A full divisor-pair table is unnecessary when one factor is already given.",
        ], String(answer)),
    });
}
