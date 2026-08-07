from pathlib import Path

ROOT = Path("artifacts/api-server/src/quant-v4/topics/Probability")


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if new in text:
        return text
    if old not in text:
        raise SystemExit(f"Could not patch {label}")
    return text.replace(old, new, 1)


def replace_between(text: str, start: str, end: str, replacement: str, label: str) -> str:
    if replacement in text:
        return text
    try:
        i = text.index(start)
        j = text.index(end, i)
    except ValueError as exc:
        raise SystemExit(f"Could not patch {label}") from exc
    return text[:i] + replacement.rstrip() + "\n" + text[j:]


# ---------------------------------------------------------------------------
# Parameter contexts
# ---------------------------------------------------------------------------
path = ROOT / "shared/parameter-generation.ts"
text = path.read_text()
new_direct_parameters = '''  if (mode === "findDirectProbability") {
    const [min, max] = difficultyRange(entry, [10, 24], [18, 36], [28, 48]);
    const total = randomInt(random, min, max);
    const favourable = randomInt(random, 2, total - 2);
    const scenario = pickRandom(random, ["LOTTERY_TICKETS", "DEFECTIVE_BULBS", "RED_BALLS", "MATHEMATICS_BOOKS"] as const);
    const object = scenario === "LOTTERY_TICKETS" ? "tickets" : scenario === "DEFECTIVE_BULBS" ? "bulbs" : scenario === "RED_BALLS" ? "balls" : "books";
    return { total, favourable, scenario, object };
  }
'''
text = replace_between(
    text,
    '  if (mode === "findDirectProbability")',
    '  if (mode === "findFavourableOutcomeCount"',
    new_direct_parameters,
    "direct probability parameters",
)
text = replace_once(
    text,
    '["winning tickets", "defective bulbs", "marked counters", "qualified applicants"] as const',
    '["winning tickets", "defective bulbs", "qualified candidates", "female employees"] as const',
    "reverse favourable contexts",
)
text = replace_once(
    text,
    '["winning coupons", "red tokens", "selected files", "successful trials"] as const',
    '["winning tickets", "red balls", "approved loan applications", "successful candidates"] as const',
    "reverse total contexts",
)
path.write_text(text)


# ---------------------------------------------------------------------------
# Student-facing stems
# ---------------------------------------------------------------------------
path = ROOT / "shared/student-facing-renderer.ts"
text = path.read_text()

direct_helper = '''function directProbabilityStem(p: GeneratedParameters): string {
  const total = num(p, "total"), favourable = num(p, "favourable");
  const scenario = text(p, "scenario", "LOTTERY_TICKETS");
  if (scenario === "DEFECTIVE_BULBS") return `A batch contains ${total} bulbs, of which ${favourable} are defective. One bulb is selected at random. What is the probability that it is defective?`;
  if (scenario === "RED_BALLS") return `A bag contains ${total} balls, of which ${favourable} are red. One ball is drawn at random. What is the probability that it is red?`;
  if (scenario === "MATHEMATICS_BOOKS") return `A shelf contains ${total} books, of which ${favourable} are Mathematics books. One book is selected at random. What is the probability that it is a Mathematics book?`;
  return `A box contains ${total} lottery tickets, of which ${favourable} are prize-winning. One ticket is drawn at random. What is the probability that it is prize-winning?`;
}
'''
if direct_helper not in text:
    marker = "function reverseFavourableStem(p: GeneratedParameters): string {"
    if marker not in text:
        raise SystemExit("Could not insert direct stem helper")
    text = text.replace(marker, direct_helper + "\n" + marker, 1)

reverse_favourable = '''function reverseFavourableStem(p: GeneratedParameters): string {
  const total = num(p, "total");
  const probability = frac(num(p, "probabilityNumerator"), num(p, "probabilityDenominator", 1));
  const context = text(p, "context", "winning tickets");
  if (/winning tickets?/i.test(context)) return `A box contains ${total} lottery tickets. The probability of drawing a prize-winning ticket is ${probability}. How many prize-winning tickets are in the box?`;
  if (/defective bulbs?/i.test(context)) return `A batch contains ${total} bulbs. If one bulb is selected at random, the probability that it is defective is ${probability}. How many bulbs are defective?`;
  if (/qualified candidates?/i.test(context)) return `One candidate is selected at random from ${total} candidates. The probability that the candidate has qualified is ${probability}. How many candidates have qualified?`;
  if (/female employees?/i.test(context)) return `A company has ${total} employees. If one employee is selected at random, the probability that the employee is a woman is ${probability}. How many women work in the company?`;
  return `A group has ${total} people. The probability that a randomly selected person satisfies the stated condition is ${probability}. How many people satisfy it?`;
}
'''
text = replace_between(text, "function reverseFavourableStem", "function reverseTotalStem", reverse_favourable, "reverse favourable stems")

reverse_total = '''function reverseTotalStem(p: GeneratedParameters): string {
  const favourable = num(p, "favourable");
  const probability = frac(num(p, "probabilityNumerator"), num(p, "probabilityDenominator", 1));
  const context = text(p, "context", "winning tickets");
  if (/winning tickets?/i.test(context)) return `A box contains ${favourable} prize-winning lottery tickets. If the probability of drawing a prize-winning ticket is ${probability}, how many lottery tickets are in the box altogether?`;
  if (/red balls?/i.test(context)) return `A bag contains ${favourable} red balls. If a ball drawn at random is red with probability ${probability}, how many balls are in the bag?`;
  if (/approved loan applications?/i.test(context)) return `A bank approved ${favourable} loan applications. If a randomly selected application was approved with probability ${probability}, how many loan applications were received?`;
  if (/successful candidates?/i.test(context)) return `${favourable} candidates passed an examination. If a randomly selected candidate passed with probability ${probability}, how many candidates appeared in the examination?`;
  return `${favourable} people satisfy a condition. If a randomly selected person satisfies it with probability ${probability}, how many people are in the group?`;
}
'''
text = replace_between(text, "function reverseTotalStem", "function committeeStem", reverse_total, "reverse total stems")

direct_case = '''    case "findDirectProbability":
      return tidy(directProbabilityStem(p));
'''
text = replace_between(
    text,
    '    case "findDirectProbability":',
    '    case "findFavourableOutcomeCount":',
    direct_case,
    "direct stem case",
)
text = replace_once(
    text,
    'return tidy(`A box contains ${red} red, ${blue} blue and ${num(p, "green")} green tokens. One token is selected at random. What is the probability of selecting a ${text(p, "target", "red")} token?`);',
    'return tidy(`A bag contains ${red} red, ${blue} blue and ${num(p, "green")} green balls. One ball is drawn at random. What is the probability of drawing a ${text(p, "target", "red")} ball?`);',
    "frequency-table ball stem",
)
path.write_text(text)


# ---------------------------------------------------------------------------
# Concrete explanations
# ---------------------------------------------------------------------------
path = ROOT / "shared/explanation-renderer.ts"
text = path.read_text()

helpers = '''function coinSequences(tosses: number): string[] {
  let sequences = [""];
  for (let toss = 0; toss < tosses; toss += 1) sequences = sequences.flatMap((prefix) => [`${prefix}H`, `${prefix}T`]);
  return sequences;
}

function headCount(sequence: string): number {
  return [...sequence].filter((face) => face === "H").length;
}

function sequenceList(sequences: string[]): string {
  return sequences.join(", ");
}

function integerRangeMatches(parameters: GeneratedParameters): number[] {
  const lower = n(parameters, "lower", 1), upper = n(parameters, "upper");
  const property = s(parameters, "property");
  const divisor = n(parameters, "divisor", 1);
  const isPrime = (value: number) => value > 1 && Array.from({ length: Math.max(0, Math.floor(Math.sqrt(value)) - 1) }, (_, index) => index + 2).every((factor) => value % factor !== 0);
  return Array.from({ length: upper - lower + 1 }, (_, index) => lower + index).filter((value) => {
    if (property === "DIVISIBLE") return value % divisor === 0;
    if (property === "EVEN") return value % 2 === 0;
    if (property === "PRIME") return isPrime(value);
    if (property === "COMPOSITE") return value > 1 && !isPrime(value);
    if (property === "GREATER_THAN") return value > n(parameters, "threshold");
    if (property === "LESS_THAN") return value < n(parameters, "threshold");
    return false;
  });
}
'''
if helpers not in text:
    marker = "function probabilityCalculation(favourable: number | bigint, total: number | bigint, answer: string): string {"
    if marker not in text:
        raise SystemExit("Could not insert concrete outcome helpers")
    text = text.replace(marker, helpers + "\n" + marker, 1)

context_helpers = '''function contextNoun(context: string): string {
  if (/tickets?/i.test(context)) return "tickets";
  if (/bulbs?/i.test(context)) return "bulbs";
  if (/candidates?/i.test(context)) return "candidates";
  if (/employees?/i.test(context)) return "employees";
  if (/applications?/i.test(context)) return "applications";
  if (/balls?/i.test(context)) return "balls";
  return "people";
}

function contextDescription(context: string): string {
  if (/winning|prize-winning/i.test(context)) return "prize-winning";
  if (/defective/i.test(context)) return "defective";
  if (/qualified/i.test(context)) return "qualified";
  if (/female/i.test(context)) return "female";
  if (/red/i.test(context)) return "red";
  if (/approved/i.test(context)) return "approved";
  if (/successful/i.test(context)) return "successful";
  return context.trim();
}
'''
text = replace_between(text, "function contextNoun", "function colourCount", context_helpers, "explanation context helpers")

direct_explanation = '''function renderDirectExplanation(parameters: GeneratedParameters, solved: SolvedProbability): string[] {
  const total = n(parameters, "total"), favourable = n(parameters, "favourable");
  const scenario = s(parameters, "scenario", "LOTTERY_TICKETS");
  let reason = `There are ${total} lottery tickets in all, and ${favourable} are prize-winning.`;
  if (scenario === "DEFECTIVE_BULBS") reason = `The batch has ${total} bulbs, of which ${favourable} are defective.`;
  if (scenario === "RED_BALLS") reason = `The bag has ${total} balls, of which ${favourable} are red.`;
  if (scenario === "MATHEMATICS_BOOKS") reason = `The shelf has ${total} books, of which ${favourable} are Mathematics books.`;
  return [reason, probabilityCalculation(favourable, total, solved.exactDisplay)];
}
'''
text = replace_between(text, "function renderDirectExplanation", "function renderReverseFavourable", direct_explanation, "direct explanations")
text = replace_once(
    text,
    '`The box has ${all} tokens altogether. ${targetCount} of them are ${target}.`',
    '`The bag has ${all} balls altogether. ${targetCount} of them are ${target}.`',
    "frequency-table ball explanation",
)

exact_coin = '''  if (["findExactlyOneSuccess", "findExactlyKSuccessSmallCase", "findCoinHeadCountProbability"].includes(mode)) {
    const tosses = n(parameters, "trials", n(parameters, "tosses"));
    const heads = mode === "findExactlyOneSuccess" ? 1 : n(parameters, mode === "findCoinHeadCountProbability" ? "heads" : "k", 1);
    const matches = coinSequences(tosses).filter((sequence) => headCount(sequence) === heads);
    return [
      `The sequences with exactly ${heads} ${plural(heads, "head")} are ${sequenceList(matches)}.`,
      `${matches.length} of the ${2 ** tosses} H/T sequences work. ${probabilityCalculation(matches.length, 2 ** tosses, solved.exactDisplay)}`,
    ];
  }
'''
text = replace_between(text, '  if (["findExactlyOneSuccess"', '  if (mode === "findAtMostKSuccessSmallCase")', exact_coin, "exact coin outcomes")

at_most_coin = '''  if (mode === "findAtMostKSuccessSmallCase") {
    const tosses = n(parameters, "trials"), k = n(parameters, "k");
    const allSequences = coinSequences(tosses);
    const matches = allSequences.filter((sequence) => headCount(sequence) <= k);
    const excluded = allSequences.filter((sequence) => headCount(sequence) > k);
    const detail = matches.length <= 16
      ? `The favourable sequences are ${sequenceList(matches)}.`
      : `It is shorter to exclude ${sequenceList(excluded)}; every other sequence has at most ${k} heads.`;
    return [detail, `${matches.length} of the ${allSequences.length} H/T sequences work. ${probabilityCalculation(matches.length, allSequences.length, solved.exactDisplay)}`];
  }
'''
text = replace_between(text, '  if (mode === "findAtMostKSuccessSmallCase")', '  if (mode === "findAllSuccessOrNotAll")', at_most_coin, "at-most coin outcomes")

all_same_coin = '''  if (mode === "findAllSuccessOrNotAll") {
    const tosses = n(parameters, "trials");
    const allHeads = "H".repeat(tosses), allTails = "T".repeat(tosses);
    return [
      `All tosses show the same face only in ${allHeads} and ${allTails}.`,
      probabilityCalculation(2, 2 ** tosses, solved.exactDisplay),
    ];
  }
'''
text = replace_between(text, '  if (mode === "findAllSuccessOrNotAll")', '  if (mode === "findCoinPatternProbability")', all_same_coin, "same-face coin outcomes")

pattern_coin = '''  if (mode === "findCoinPatternProbability") {
    const tosses = n(parameters, "tosses"), pattern = s(parameters, "pattern");
    const outcomes = coinSequences(tosses);
    const universe = outcomes.length <= 8
      ? `The possible sequences are ${sequenceList(outcomes)}.`
      : `There are 2^${tosses} = ${outcomes.length} possible H/T sequences.`;
    return [universe, `${pattern} is one of these sequences. ${probabilityCalculation(1, outcomes.length, solved.exactDisplay)}`];
  }
'''
text = replace_between(text, '  if (mode === "findCoinPatternProbability")', '  if (mode === "findSingleDieEventProbability")', pattern_coin, "coin-pattern outcomes")

dice_parity = '''  if (mode === "findTwoDiceProductOrParityProbability") {
    const kind = s(parameters, "eventType");
    if (kind === "PRODUCT") {
      const target = n(parameters, "targetProduct");
      const pairs = diceProductPairs(target);
      return [
        `Two dice have 36 ordered outcomes. Product ${target} occurs for ${pairs.join(", ")}.`,
        probabilityCalculation(pairs.length, 36, solved.exactDisplay),
      ];
    }
    if (kind === "SAME_PARITY") {
      return [
        `Odd faces are 1, 3, 5 and even faces are 2, 4, 6. Same parity means odd-odd or even-even.`,
        `Required ordered pairs = 3 × 3 + 3 × 3 = 18. ${probabilityCalculation(18, 36, solved.exactDisplay)}`,
      ];
    }
    return [
      `Odd faces are 1, 3, 5 and even faces are 2, 4, 6. Different parity means odd-even or even-odd.`,
      `Required ordered pairs = 3 × 3 + 3 × 3 = 18. ${probabilityCalculation(18, 36, solved.exactDisplay)}`,
    ];
  }
'''
text = replace_between(text, '  if (mode === "findTwoDiceProductOrParityProbability")', '  if (mode === "findSpinnerEventProbability")', dice_parity, "dice parity outcomes")

number_range = '''  if (mode === "findNumberRangePropertyProbability") {
    const lower = n(parameters, "lower", 1), upper = n(parameters, "upper");
    const matches = integerRangeMatches(parameters);
    const rangeSize = upper - lower + 1;
    const shown = matches.length <= 15
      ? `The required integers are ${matches.join(", ")}.`
      : `The first required integers are ${matches.slice(0, 10).join(", ")}; there are ${matches.length} in all.`;
    return [shown, probabilityCalculation(matches.length, rangeSize, solved.exactDisplay)];
  }
'''
text = replace_between(text, '  if (mode === "findNumberRangePropertyProbability")', '  if (["findRankProbability"', number_range, "number-range outcomes")

conditional_number = '''  if (mode === "findConditionalNumberProbability") {
    const upper = n(parameters, "upper"), conditionDivisor = n(parameters, "conditionDivisor"), targetDivisor = n(parameters, "targetDivisor");
    const restricted = Array.from({ length: Math.floor(upper / conditionDivisor) }, (_, index) => (index + 1) * conditionDivisor);
    const required = restricted.filter((value) => value % targetDivisor === 0);
    return [
      `The restricted numbers are ${restricted.join(", ")}.`,
      `Among them, ${required.join(", ")} are divisible by ${targetDivisor}. ${probabilityCalculation(required.length, restricted.length, solved.exactDisplay)}`,
    ];
  }
'''
text = replace_between(text, '  if (mode === "findConditionalNumberProbability")', '  if (mode === "findConditionalUrnProbability")', conditional_number, "conditional number outcomes")
path.write_text(text)


# ---------------------------------------------------------------------------
# Validation and versions
# ---------------------------------------------------------------------------
path = ROOT / "shared/validator.ts"
text = path.read_text()
concrete_helper = '''function hasConcreteOutcomeEvidence(entry: ProbabilityTaskRegistryEntry, explanation: string[]): boolean {
  const value = explanation.join(" ");
  const coinModes = [
    "findAtLeastOneUsingComplement", "findNoneProbability", "findExactlyOneSuccess", "findExactlyKSuccessSmallCase",
    "findAtMostKSuccessSmallCase", "findAllSuccessOrNotAll", "findCoinPatternProbability", "findCoinHeadCountProbability",
  ];
  if (coinModes.includes(entry.solveMode)) return /\\b[HT]{2,5}\\b/.test(value);
  if (["findTwoDiceSumProbability", "findTwoDiceProductOrParityProbability"].includes(entry.solveMode)) return /\\(\\d,\\d\\)/.test(value) || /Odd faces are 1, 3, 5/.test(value);
  if (entry.solveMode === "findSingleDieEventProbability") return /favourable faces are/i.test(value);
  if (entry.solveMode === "findNumberRangePropertyProbability") return /required integers are|first required integers are/i.test(value);
  return true;
}
'''
if concrete_helper not in text:
    marker = "export function validateProbabilityQuestion(args: {"
    if marker not in text:
        raise SystemExit("Could not insert concrete-outcome validator")
    text = text.replace(marker, concrete_helper + "\n" + marker, 1)
if '/\\b(?:tokens?|counters?|selected files?)\\b/i,' not in text:
    marker = '    /\\ba ace\\b/i,'
    if marker not in text:
        raise SystemExit("Could not add artificial-noun validator")
    text = text.replace(marker, marker + '\n    /\\b(?:tokens?|counters?|selected files?)\\b/i,', 1)
check_line = '  checks.push(check("concrete-outcome-visibility", hasConcreteOutcomeEvidence(entry, explanation), "Small outcome spaces must show the actual H/T sequences, die faces, dice pairs or qualifying integers."));'
if check_line not in text:
    marker = '  checks.push(check("contextual-explanation", !hasGenericExplanation(explanation), "The explanation states generic counts without explaining the question-specific reasoning."));'
    if marker not in text:
        raise SystemExit("Could not add concrete-outcome validation check")
    text = text.replace(marker, marker + "\n" + check_line, 1)
path.write_text(text)

path = ROOT / "shared/pipeline.ts"
text = path.read_text()
text = text.replace("-SIMPLE-V2", "-CONCRETE-V3")
text = text.replace('studentRendererVersion: "PRB-STUDENT-RENDERER-V2"', 'studentRendererVersion: "PRB-STUDENT-RENDERER-V3"')
text = text.replace('explanationVersion: "PRB-SIMPLE-EXPLANATION-V2"', 'explanationVersion: "PRB-CONCRETE-EXPLANATION-V3"')
path.write_text(text)
