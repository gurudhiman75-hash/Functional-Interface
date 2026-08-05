export const EMPTY_SET = "∅";
export function asNumber(value, label) {
    const parsed = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(parsed))
        throw new Error(`${label}: expected finite number`);
    return parsed;
}
export function asString(value, label) {
    if (typeof value !== "string")
        throw new Error(`${label}: expected string`);
    return value;
}
export function asNumberArray(value, label) {
    if (!Array.isArray(value) || value.some((item) => !Number.isFinite(Number(item)))) {
        throw new Error(`${label}: expected numeric array`);
    }
    return value.map(Number);
}
export function primePowers(hiddenState) {
    const value = hiddenState.factorState;
    if (!Array.isArray(value))
        return [];
    return value.map((entry, index) => {
        if (!entry || typeof entry !== "object")
            throw new Error(`factorState/${index}: invalid entry`);
        const record = entry;
        return {
            prime: asNumber(record.prime, `factorState/${index}/prime`),
            exponent: asNumber(record.exponent, `factorState/${index}/exponent`),
        };
    });
}
export function secondPrimePowers(hiddenState) {
    const value = hiddenState.secondFactorState;
    if (!Array.isArray(value))
        return [];
    return value.map((entry, index) => {
        if (!entry || typeof entry !== "object")
            throw new Error(`secondFactorState/${index}: invalid entry`);
        const record = entry;
        return {
            prime: asNumber(record.prime, `secondFactorState/${index}/prime`),
            exponent: asNumber(record.exponent, `secondFactorState/${index}/exponent`),
        };
    });
}
export function product(values) {
    return values.reduce((accumulator, value) => accumulator * value, 1);
}
export function divisorCountFromState(state) {
    return product(state.map(({ exponent }) => exponent + 1));
}
export function squareDivisorCountFromState(state) {
    return product(state.map(({ exponent }) => Math.floor(exponent / 2) + 1));
}
export function oddDivisorCountFromState(state) {
    return product(state.filter(({ prime }) => prime !== 2).map(({ exponent }) => exponent + 1));
}
export function integerFromState(state) {
    return state.reduce((value, { prime, exponent }) => value * prime ** exponent, 1);
}
export function divisorsFromState(state) {
    let values = [1];
    for (const { prime, exponent } of state) {
        const next = [];
        for (const value of values) {
            for (let power = 0; power <= exponent; power += 1)
                next.push(value * prime ** power);
        }
        values = next;
    }
    return [...new Set(values)].sort((left, right) => left - right);
}
export function divisorCountOfInteger(value) {
    if (!Number.isInteger(value) || value <= 0)
        return 0;
    let remaining = value;
    let count = 1;
    for (let prime = 2; prime * prime <= remaining; prime += prime === 2 ? 1 : 2) {
        if (remaining % prime !== 0)
            continue;
        let exponent = 0;
        while (remaining % prime === 0) {
            remaining /= prime;
            exponent += 1;
        }
        count *= exponent + 1;
    }
    if (remaining > 1)
        count *= 2;
    return count;
}
export function geometricSum(prime, exponent) {
    let sum = 0;
    for (let power = 0; power <= exponent; power += 1)
        sum += prime ** power;
    return sum;
}
export function math(expression) {
    return `\\(${expression}\\)`;
}
export function factorExpression(state) {
    if (state.length === 0)
        return "1";
    return state.map(({ prime, exponent }) => (exponent === 1 ? String(prime) : `${prime}^{${exponent}}`)).join(" \\times ");
}
export function factorMath(state) {
    return math(factorExpression(state));
}
export function factorisationTextToMath(value) {
    const expression = value
        .split(/\s*×\s*/u)
        .map((term) => {
        const match = term.trim().match(/^(\d+)(?:\^([a-zA-Z]|\d+))?$/u);
        if (!match)
            return term.trim();
        return match[2] ? `${match[1]}^{${match[2]}}` : match[1];
    })
        .join(" \\times ");
    return math(expression);
}
export function setText(values) {
    return values.length === 0 ? EMPTY_SET : `{${values.join(", ")}}`;
}
export function pairSetText(value) {
    if (!Array.isArray(value) || value.length === 0)
        return EMPTY_SET;
    const pairs = value.map((pair) => {
        if (!Array.isArray(pair) || pair.length !== 2)
            throw new Error("Invalid ordered pair");
        return `(${Number(pair[0])},${Number(pair[1])})`;
    });
    return `{${pairs.join(", ")}}`;
}
export function normalizeNumCp005OptionSemantic(value) {
    const normalized = value
        .trim()
        .toLowerCase()
        .replace(/\s+/gu, "")
        .replace(/[{}]/gu, "")
        .replace(/\((?:1|2|3|4)\)$/u, "");
    if (["∅", "emptyset", "empty-set", "emptyset.", "none"].includes(normalized))
        return EMPTY_SET;
    return normalized;
}
export function option(value, isCorrect, misconceptionId, analysis) {
    return { value, isCorrect, misconceptionId, analysis };
}
export function buildOptions(correctValue, wrongCandidates, correctIndex) {
    const used = new Set([normalizeNumCp005OptionSemantic(correctValue)]);
    const wrong = [];
    for (const candidate of wrongCandidates) {
        const semantic = normalizeNumCp005OptionSemantic(candidate.value);
        if (!semantic || used.has(semantic))
            continue;
        used.add(semantic);
        wrong.push(candidate);
        if (wrong.length === 3)
            break;
    }
    if (wrong.length !== 3) {
        throw new Error(`Unable to build three semantically distinct distractors for ${correctValue}`);
    }
    const result = [];
    let wrongIndex = 0;
    for (let index = 0; index < 4; index += 1) {
        if (index === correctIndex) {
            result.push(option(correctValue, true, null, "This matches the complete governed calculation."));
        }
        else {
            const candidate = wrong[wrongIndex++];
            result.push(option(candidate.value, false, candidate.misconceptionId, candidate.analysis));
        }
    }
    return result;
}
export function wrong(value, misconceptionId, analysis) {
    return { value: String(value), misconceptionId, analysis };
}
export function numericFallbacks(correct) {
    const magnitude = Math.max(2, Math.abs(correct));
    return [
        wrong(correct * 2, "NUM-CP005-TRAP-DOUBLE-RESULT", "This doubles the governed result without a valid divisor-function step."),
        wrong(Math.max(0, Math.floor(correct / 2)), "NUM-CP005-TRAP-HALF-RESULT", "This halves the result without preserving the governing condition."),
        wrong(correct + magnitude, "NUM-CP005-TRAP-UNRELATED-MAGNITUDE", "This uses a nearby scale rather than the required divisor-function calculation."),
        wrong(Math.max(0, correct - magnitude), "NUM-CP005-TRAP-UNRELATED-REDUCTION", "This subtracts an unrelated magnitude from the governed result."),
    ];
}
export function explanation(coreConcept, strategy, steps, speedMethod, traps, finalAnswer) {
    if (traps.length !== 3)
        throw new Error("Every explanation must own exactly three traps");
    return {
        coreConcept,
        givenDataAndStrategy: strategy,
        stepByStep: steps,
        examSpeedMethod: speedMethod,
        commonTraps: traps,
        finalAnswer,
    };
}
export function ordinalPower(power) {
    if (power === 2)
        return "perfect squares";
    if (power === 3)
        return "perfect cubes";
    if (power === 5)
        return "perfect fifth powers";
    return `perfect ${power}th powers`;
}
export function legalExponentSequence(exponent, power) {
    const values = [];
    for (let value = 0; value <= exponent; value += power)
        values.push(value);
    return values.join(", ");
}
export function standardResult(source, changes) {
    return {
        difficulty: changes.difficulty ?? source.difficulty,
        stem: changes.stem ?? source.stem,
        options: changes.options ?? source.options,
        correctIndex: changes.correctIndex ?? source.correctIndex,
        canonicalAnswer: changes.canonicalAnswer ?? source.canonicalAnswer,
        verifierAnswer: changes.verifierAnswer ?? changes.canonicalAnswer ?? source.verifierAnswer,
        representation: changes.representation ?? source.representation ?? "DIRECT",
        explanation: changes.explanation ?? source.explanation,
    };
}
