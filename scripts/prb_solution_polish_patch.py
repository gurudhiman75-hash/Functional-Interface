from pathlib import Path

ROOT = Path("artifacts/api-server/src/quant-v4/topics/Probability")


def replace_region(text: str, start_marker: str, end_marker: str, replacement: str, label: str) -> str:
    start = text.find(start_marker)
    if start < 0:
        raise SystemExit(f"Missing start marker for {label}")
    end = text.find(end_marker, start)
    if end < 0:
        raise SystemExit(f"Missing end marker for {label}")
    return text[:start] + replacement + text[end:]


# ---------------------------------------------------------------------------
# 1. Replace the over-generic wrapper with concise, mode-correct worked solutions.
# ---------------------------------------------------------------------------
remodeler = ROOT / "shared/exam-depth-remodeler.ts"
text = remodeler.read_text(encoding="utf-8")
replacement = r'''function workedSolutionMethod(entry: ProbabilityTaskRegistryEntry, parameters: GeneratedParameters): string {
  const mode = entry.solveMode;
  const reverseModes = new Set([
    "findFavourableOutcomeCount", "findMissingEventCountFromProbability", "findTotalOutcomeCount",
    "findMissingObjectCountFromProbability", "findMissingDeckCountOrEventCount",
    "findReverseDiceOrSpinnerEventCount", "findReverseConditionalCount", "findReverseCountFromProbability",
  ]);
  const coinModes = new Set([
    "findAtLeastOneUsingComplement", "findNoneProbability", "findExactlyOneSuccess", "findExactlyKSuccessSmallCase",
    "findAtMostKSuccessSmallCase", "findAllSuccessOrNotAll", "findCoinPatternProbability", "findCoinHeadCountProbability",
  ]);
  const diceModes = new Set(["findSingleDieEventProbability", "findTwoDiceSumProbability", "findTwoDiceProductOrParityProbability"]);
  const cardModes = new Set([
    "findRankProbability", "findSuitProbability", "findColourProbability", "findFaceCardProbability",
    "findCardPropertyIntersection", "findUnionCardEventProbability", "findComplementCardProbability",
    "findMissingDeckCountOrEventCount", "findConditionalCardProbability",
  ]);
  const simultaneousModes = new Set([
    "findSimultaneousSameTypeProbability", "findSimultaneousDifferentTypeProbability", "findExactCompositionProbability",
    "findSelectionProbabilityUsingCombination", "findNoObjectOfTypeProbability", "findAtLeastOneObjectOfType",
  ]);
  const successiveModes = new Set([
    "findSuccessiveIndependentProbability", "findWithReplacementProbability", "findSuccessiveDependentProbability",
    "findWithoutReplacementProbability", "findOrderedDrawSequenceProbability", "findSameTypeInSuccessiveDraws",
    "findDifferentTypesInSuccessiveDraws", "findAtLeastOneAcrossIndependentStages",
  ]);
  const conditionalModes = new Set([
    "findConditionalProbabilityByCounting", "findConditionalFromTwoWayTable", "findConditionalNumberProbability",
    "findConditionalUrnProbability", "findReverseConditionalCount",
  ]);
  const committeeModes = new Set([
    "findSelectionProbabilityUsingCombination", "findCommitteeCompositionProbability",
    "findRestrictedSelectionProbability", "findReverseCountFromProbability",
  ]);
  const arrangementModes = new Set([
    "findRandomArrangementPropertyProbability", "findTogetherOrApartProbability",
    "findPositionRestrictionProbability", "findNumberFormationProbability",
  ]);
  const eventModes = new Set([
    "findUnionProbability", "findIntersectionProbability", "findExactlyOneOfTwoEvents",
    "findMixedEventExpressionProbability", "findNeitherEventProbability", "findMissingIntersectionOrUnionProbability",
  ]);

  if (reverseModes.has(mode)) {
    return "Use P(E) = favourable cases ÷ total cases and rearrange the relation to find the missing count.";
  }
  if (coinModes.has(mode)) {
    const tosses = numberValue(parameters, "trials", numberValue(parameters, "tosses", 1));
    return mode === "findAtLeastOneUsingComplement"
      ? `Use the complement. With ${tosses} fair tosses there are 2^${tosses} equally likely H/T sequences, and it is shorter to exclude the sequence with no head.`
      : `With ${tosses} fair tosses there are 2^${tosses} equally likely H/T sequences; count the sequences satisfying the stated head condition.`;
  }
  if (diceModes.has(mode)) {
    return mode === "findSingleDieEventProbability"
      ? "A fair die has six equally likely faces; list the faces satisfying the condition and divide their count by 6."
      : "Treat the outcomes as ordered pairs. Two fair dice produce 6 × 6 = 36 equally likely pairs (first die, second die).";
  }
  if (cardModes.has(mode)) {
    return "Use the standard 52-card deck counts, and count any card belonging to two required groups only once.";
  }
  if (entry.cpId === "PRB-CP-005" && simultaneousModes.has(mode)) {
    return mode === "findAtLeastOneObjectOfType"
      ? "The objects are selected together, so use combinations and count the required event through its shorter complement."
      : "The objects are selected together, so order does not matter; use combinations for the total and required selections.";
  }
  if (successiveModes.has(mode)) {
    if (["findSuccessiveIndependentProbability", "findWithReplacementProbability", "findAtLeastOneAcrossIndependentStages"].includes(mode)) {
      return "Follow the two selections in order. Replacement restores the original contents, so the second-stage probability uses the same denominator."
    }
    return "Follow the selections in order and multiply the stage probabilities. Without replacement, update both the remaining favourable count and the total before the second selection.";
  }
  if (mode === "findConditionalCardProbability") {
    return "Use only the cards allowed by the given condition as the sample space; cards outside that restricted set are no longer possible.";
  }
  if (conditionalModes.has(mode)) {
    return "First restrict the sample space to the outcomes allowed by the given condition, then use favourable cases ÷ restricted total.";
  }
  if (entry.cpId === "PRB-CP-008" && committeeModes.has(mode)) {
    return mode === "findRestrictedSelectionProbability"
      ? "A committee is unordered. Count all committees with combinations and subtract the committees excluded by the condition."
      : "A committee is unordered, so use combinations for both the complete set of committees and the required composition.";
  }
  if (arrangementModes.has(mode)) {
    return "Count all equally likely arrangements first, then count only those satisfying the stated position, adjacency or last-digit restriction.";
  }
  if (eventModes.has(mode)) {
    if (mode === "findIntersectionProbability") return "The required event is the overlap of the two groups; compare that overlap with the complete group.";
    if (mode === "findNeitherEventProbability") return "Use inclusion–exclusion to find those in at least one group, then subtract that count from the total.";
    return "Use inclusion–exclusion so that members belonging to both groups are not counted twice.";
  }
  if (mode === "findMutuallyExclusiveUnion") {
    return "The events are mutually exclusive, so add their probabilities; there is no overlap to subtract.";
  }
  if (mode === "findIndependentIntersection") {
    return "The events are independent, so multiply their probabilities to obtain the probability that both occur.";
  }
  if (mode === "findComplementProbability") {
    return "The required event is the opposite of the given event, so use P(not E) = 1 − P(E).";
  }
  if (mode === "findNumberRangePropertyProbability") {
    return "Every integer in the stated range is equally likely; list or count those satisfying the number property."
  }
  if (["findSpinnerEventProbability", "findReverseDiceOrSpinnerEventCount"].includes(mode)) {
    return "The spinner sectors are equal, so probability is favourable sectors ÷ total sectors.";
  }
  return "For one random selection, use P(required event) = favourable cases ÷ total equally likely cases.";
}

function workedSolutionKeyPoint(entry: ProbabilityTaskRegistryEntry): string | null {
  if (entry.difficulty === "Easy") return null;
  const mode = entry.solveMode;
  const coinModes = new Set([
    "findAtLeastOneUsingComplement", "findExactlyOneSuccess", "findExactlyKSuccessSmallCase",
    "findAtMostKSuccessSmallCase", "findAllSuccessOrNotAll", "findCoinPatternProbability", "findCoinHeadCountProbability",
  ]);
  const diceModes = new Set(["findTwoDiceSumProbability", "findTwoDiceProductOrParityProbability"]);
  const simultaneousModes = new Set([
    "findSimultaneousSameTypeProbability", "findSimultaneousDifferentTypeProbability", "findExactCompositionProbability",
    "findSelectionProbabilityUsingCombination", "findNoObjectOfTypeProbability", "findAtLeastOneObjectOfType",
  ]);
  const successiveModes = new Set([
    "findSuccessiveIndependentProbability", "findWithReplacementProbability", "findSuccessiveDependentProbability",
    "findWithoutReplacementProbability", "findOrderedDrawSequenceProbability", "findSameTypeInSuccessiveDraws",
    "findDifferentTypesInSuccessiveDraws", "findAtLeastOneAcrossIndependentStages",
  ]);
  const conditionalModes = new Set([
    "findConditionalProbabilityByCounting", "findConditionalFromTwoWayTable", "findConditionalNumberProbability",
    "findConditionalCardProbability", "findConditionalUrnProbability", "findReverseConditionalCount",
  ]);
  const committeeModes = new Set([
    "findSelectionProbabilityUsingCombination", "findCommitteeCompositionProbability",
    "findRestrictedSelectionProbability", "findReverseCountFromProbability",
  ]);
  const eventModes = new Set([
    "findUnionProbability", "findExactlyOneOfTwoEvents", "findMixedEventExpressionProbability",
    "findNeitherEventProbability", "findMissingIntersectionOrUnionProbability",
  ]);

  if (coinModes.has(mode)) return "Sequences with the same number of heads but in different positions are distinct outcomes.";
  if (diceModes.has(mode)) return "For distinguishable dice, (a,b) and (b,a) are different outcomes unless a = b.";
  if (mode === "findUnionCardEventProbability") return "The card common to the rank and suit groups must be subtracted once after the two counts are added.";
  if (entry.cpId === "PRB-CP-005" && simultaneousModes.has(mode)) return "Changing the order of the same selected objects does not create a new selection, which is why combinations are used.";
  if (successiveModes.has(mode)) {
    return ["findSuccessiveIndependentProbability", "findWithReplacementProbability", "findAtLeastOneAcrossIndependentStages"].includes(mode)
      ? "Replacement makes the two stage probabilities use the original composition each time."
      : "Because the first object is not returned, the second probability is based on one fewer object.";
  }
  if (conditionalModes.has(mode)) return "The condition changes the denominator: outcomes outside the restricted group cannot be selected.";
  if (entry.cpId === "PRB-CP-008" && committeeModes.has(mode)) return "Combinations count each committee once because the order in which its members are named is irrelevant.";
  if (["findTogetherOrApartProbability", "findRandomArrangementPropertyProbability", "findPositionRestrictionProbability", "findNumberFormationProbability"].includes(mode)) {
    return "The probability is valid because every admissible arrangement is treated as equally likely.";
  }
  if (eventModes.has(mode)) return "Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.";
  if (mode === "findMutuallyExclusiveUnion") return "No outcome belongs to both events, so simple addition counts every favourable outcome exactly once.";
  if (mode === "findIndependentIntersection") return "Independence means the first result does not change the probability of the second.";
  return null;
}

function bigintGcd(left: bigint, right: bigint): bigint {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b !== 0n) [a, b] = [b, a % b];
  return a === 0n ? 1n : a;
}

function workedSolutionSimplification(solved: SolvedProbability, core: string[]): string | null {
  if (solved.answer.kind !== "PROBABILITY") return null;
  const favourable = solved.evidence.favourableOutcomeCount;
  const total = solved.evidence.totalOutcomeCount;
  if (favourable === undefined || total === undefined || total === 0n) return null;
  const raw = `${favourable}/${total}`;
  if (core.some((line) => line.includes(raw) && line.includes(solved.exactDisplay))) return null;
  const divisor = bigintGcd(favourable, total);
  if (divisor <= 1n) return null;
  return `${raw} = (${favourable} ÷ ${divisor})/(${total} ÷ ${divisor}) = ${favourable / divisor}/${total / divisor}.`;
}

function capitaliseSentence(value: string): string {
  const cleaned = value
    .replace(/^Method\s+—\s*/i, "")
    .replace(/^(?:Therefore|Hence|So),?\s+/i, "")
    .trim();
  return cleaned.length === 0 ? cleaned : `${cleaned[0]!.toUpperCase()}${cleaned.slice(1)}`;
}

function buildDetailedWorkedSolution(
  entry: ProbabilityTaskRegistryEntry,
  parameters: GeneratedParameters,
  solved: SolvedProbability,
  explanation: string[],
): string[] {
  const core = explanation
    .map(tidy)
    .filter(Boolean)
    .filter((line) => !/^Method\s+—/i.test(line));

  const result: string[] = [`Method — ${workedSolutionMethod(entry, parameters)}`];
  core.forEach((line, index) => result.push(`Step ${index + 1} — ${capitaliseSentence(line)}`));

  const simplification = workedSolutionSimplification(solved, core);
  if (simplification) result.push(`Simplification — ${simplification}`);

  const keyPoint = workedSolutionKeyPoint(entry);
  if (keyPoint) result.push(`Key point — ${keyPoint}`);

  result.push(
    solved.answer.kind === "COUNT"
      ? `Answer — The required number is ${solved.exactDisplay}.`
      : `Answer — The required probability is ${solved.exactDisplay}.`,
  );

  return result.map(tidy).filter(Boolean);
}

'''
text = replace_region(
    text,
    "function workedSolutionApproach(",
    "export function remodelProbabilityExplanation(",
    replacement,
    "worked-solution helper block",
)
text = text.replace(
    "return buildDetailedWorkedSolution(entry, solved, explanation);",
    "return buildDetailedWorkedSolution(entry, parameters, solved, explanation);",
)
remodeler.write_text(text, encoding="utf-8")


# ---------------------------------------------------------------------------
# 2. Calibrate validation for detailed but non-padded solutions.
# ---------------------------------------------------------------------------
validator = ROOT / "shared/validator.ts"
text = validator.read_text(encoding="utf-8")
old = '''  const minimumExplanationWords = entry.difficulty === "Easy" ? 32 : entry.difficulty === "Medium" ? 48 : 55;
  const minimumExplanationLines = entry.difficulty === "Easy" ? 4 : 5;
  checks.push(check("detailed-explanation-length", explanationWords >= minimumExplanationWords && explanationWords <= 220, `Explanation has ${explanationWords} words; expected ${minimumExplanationWords}-220 for ${entry.difficulty}.`));
  checks.push(check("worked-solution-line-depth", explanation.length >= minimumExplanationLines, `${entry.difficulty} explanation has ${explanation.length} lines; expected at least ${minimumExplanationLines}.`));
  checks.push(check("worked-solution-structure", /^Approach —/.test(explanation[0] ?? "") && explanation.some((line) => /^Why this works —/.test(line)) && /^Answer —/.test(explanation[explanation.length - 1] ?? ""), "Explanation must contain an approach, worked steps, method justification and a final answer line."));
  checks.push(check("exam-depth-decision-path", !EXAM_DEPTH_MODES.has(entry.solveMode) || (explanation.length >= 5 && hasMethodDecision(explanation)), "A multi-step explanation must state the method decision and show at least five reasoning lines."));'''
new = '''  const minimumExplanationWords = entry.difficulty === "Easy" ? 28 : entry.difficulty === "Medium" ? 45 : 55;
  const minimumExplanationLines = entry.difficulty === "Easy" ? 4 : 5;
  checks.push(check("detailed-explanation-length", explanationWords >= minimumExplanationWords && explanationWords <= 200, `Explanation has ${explanationWords} words; expected ${minimumExplanationWords}-200 for ${entry.difficulty}.`));
  checks.push(check("worked-solution-line-depth", explanation.length >= minimumExplanationLines, `${entry.difficulty} explanation has ${explanation.length} lines; expected at least ${minimumExplanationLines}.`));
  checks.push(check("worked-solution-structure", /^Method —/.test(explanation[0] ?? "") && explanation.some((line) => /^Step 1 —/.test(line)) && /^Answer —/.test(explanation[explanation.length - 1] ?? ""), "Explanation must contain a method, numbered working and a final answer line."));
  checks.push(check("exam-depth-decision-path", !EXAM_DEPTH_MODES.has(entry.solveMode) || (explanation.length >= 5 && hasMethodDecision(explanation)), "A multi-step explanation must state the method decision and show at least five reasoning lines."));'''
if old not in text:
    raise SystemExit("Could not update validator worked-solution checks")
validator.write_text(text.replace(old, new, 1), encoding="utf-8")


# ---------------------------------------------------------------------------
# 3. Update the corpus audit to reject padding and wrong method families.
# ---------------------------------------------------------------------------
audit = ROOT / "exam-depth-review-audit.py"
text = audit.read_text(encoding="utf-8")
text = text.replace(
    '    if mean(explanation_lengths) < 52:\n        raise SystemExit(f"Average explanation length is only {mean(explanation_lengths):.1f} words; expected at least 52")',
    '    if mean(explanation_lengths) < 50:\n        raise SystemExit(f"Average explanation length is only {mean(explanation_lengths):.1f} words; expected at least 50")',
)
text = text.replace(
    '    if not medium_hard_lengths or mean(medium_hard_lengths) < 62:\n        raise SystemExit(f"Medium/Hard explanation average is {mean(medium_hard_lengths):.1f}; expected at least 62")',
    '    if not medium_hard_lengths or mean(medium_hard_lengths) < 62:\n        raise SystemExit(f"Medium/Hard explanation average is {mean(medium_hard_lengths):.1f}; expected at least 62")',
)
text = text.replace(
    '        if "Approach —" not in explanation or "Why this works —" not in explanation or "Answer —" not in explanation:\n            raise SystemExit(f"{row[\'qlId\']}: worked-solution structure is incomplete")',
    '        if "Method —" not in explanation or "Step 1 —" not in explanation or "Answer —" not in explanation:\n            raise SystemExit(f"{row[\'qlId\']}: worked-solution structure is incomplete")',
)
wrong_method_marker = '    explanation_lengths = [len(row["explanation"].split()) for row in rows]\n'
wrong_method_block = '''    successive_modes = {
        "findSuccessiveIndependentProbability", "findWithReplacementProbability", "findSuccessiveDependentProbability",
        "findWithoutReplacementProbability", "findOrderedDrawSequenceProbability", "findSameTypeInSuccessiveDraws",
        "findDifferentTypesInSuccessiveDraws", "findAtLeastOneAcrossIndependentStages",
    }
    for row in rows:
        if row["solveMode"] in successive_modes and re.search(r"coin toss|H/T sequence", row["explanation"], re.I):
            raise SystemExit(f"{row['qlId']}: successive-draw solution received a coin method")
        if re.search(r"=\s*([^ ]+)\s*=\s*\1(?:\.|\s|$)", row["explanation"]):
            raise SystemExit(f"{row['qlId']}: explanation repeats the same reduced value")

'''
if "successive-draw solution received a coin method" not in text:
    if wrong_method_marker not in text:
        raise SystemExit("Could not insert method-family audit")
    text = text.replace(wrong_method_marker, wrong_method_block + wrong_method_marker, 1)
audit.write_text(text, encoding="utf-8")


# ---------------------------------------------------------------------------
# 4. Present each solution as readable Markdown rather than one dense paragraph.
# ---------------------------------------------------------------------------
generator = ROOT / "generate-comprehensive-questions.ts"
text = generator.read_text(encoding="utf-8")
option_marker = '''function renderPackage(packageId: "PRB-001" | "PRB-002", rows: ReviewRow[], startNumber: number): { lines: string[]; nextNumber: number } {'''
helper = r'''function explanationLines(explanation: string): string[] {
  const parts = explanation
    .split(/(?=(?:Method|Step \d+|Simplification|Key point|Answer) — )/)
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.map((part) => {
    const match = part.match(/^(Method|Step (\d+)|Simplification|Key point|Answer) — (.*)$/);
    if (!match) return part;
    const label = match[1]!;
    const stepNumber = match[2];
    const body = match[3]!;
    if (label.startsWith("Step") && stepNumber) return `${stepNumber}. ${body}`;
    return `- **${label}:** ${body}`;
  });
}

'''
if "function explanationLines(" not in text:
    if option_marker not in text:
        raise SystemExit("Could not insert Markdown explanation renderer")
    text = text.replace(option_marker, helper + option_marker, 1)
text = text.replace(
    '      lines.push(`**Explanation:** ${row.explanation}`);\n',
    '      lines.push("**Explanation:**");\n      lines.push("");\n      lines.push(...explanationLines(row.explanation));\n',
)
text = text.replace(
    '> Every explanation uses the shortest complete method possible.',
    '> Every explanation is presented as a student-friendly worked solution with method, numbered calculation and final answer.',
)
old_standard = '''    "Most solutions follow three simple steps:",
    "",
    "1. Find the total possible cases.",
    "2. Find the required cases.",
    "3. Divide and simplify.",
    "",
    "For small coin, dice and number sample spaces, the actual outcomes are shown. For larger spaces, compact counting is used.",
    "For successive draws, complements, conditional probability and counting questions, only the extra step actually needed is shown.",'''
new_standard = '''    "Every solution is arranged for quick student reading:",
    "",
    "1. **Method:** the exact probability idea used in the question.",
    "2. **Numbered working:** values, sample space and required cases shown in order.",
    "3. **Simplification:** included only when the reduction is not already visible in the calculation.",
    "4. **Key point:** added for multi-step questions to explain the important trap or reasoning decision.",
    "5. **Answer:** the final exact probability or count.",
    "",
    "Small coin, dice and number sample spaces show their actual outcomes. Larger spaces use combinations or structured counting.",
    "The solution avoids repeated formulas, generic padding and method labels unrelated to the question.",'''
if old_standard not in text:
    raise SystemExit("Could not update Markdown explanation standard")
text = text.replace(old_standard, new_standard, 1)
generator.write_text(text, encoding="utf-8")


# ---------------------------------------------------------------------------
# 5. Align report and permanent standard with the polished format.
# ---------------------------------------------------------------------------
report_generator = ROOT / "generate-exam-review.ts"
text = report_generator.read_text(encoding="utf-8")
text = text.replace(
    '''1. **Approach:** state the exact probability idea and why it fits.\\n2. **Numbered working:** establish the sample space, derive any missing value and count the required cases.\\n3. **Simplification:** reduce the fraction explicitly when reduction is required.\\n4. **Why this works:** explain why the counting rule, complement, conditional restriction, multiplication rule or inclusion–exclusion step is valid.\\n5. **Answer:** close with the exact required probability or count.''',
    '''1. **Method:** state the exact probability idea used in that question.\\n2. **Numbered working:** establish the sample space, derive any missing value and count the required cases.\\n3. **Simplification:** reduce the fraction only when that reduction is not already visible.\\n4. **Key point:** explain the important trap or decision in multi-step questions.\\n5. **Answer:** close with the exact required probability or count.''',
)
report_generator.write_text(text, encoding="utf-8")

standard = ROOT / "PROBABILITY-EXAM-DEPTH-STANDARD.md"
text = standard.read_text(encoding="utf-8")
text = text.replace(
    '''1. **Approach** — name the exact idea being used and why it is suitable.
2. **Numbered steps** — use the values from the question to establish the sample space, derive missing quantities and count the required cases.
3. **Simplification** — show how the final fraction is reduced whenever reduction is needed.
4. **Why this works** — explain why the counting rule, complement, conditional restriction, multiplication rule or inclusion–exclusion step is valid.
5. **Answer** — state the exact final probability or count in a separate closing line.''',
    '''1. **Method** — name the exact idea used in the question; never attach a coin, card or arrangement method to an unrelated family.
2. **Numbered steps** — use the values from the question to establish the sample space, derive missing quantities and count the required cases.
3. **Simplification** — show reduction only when it has not already been displayed in the calculation.
4. **Key point** — for multi-step questions, explain the decisive trap or rule, such as order, replacement, overlap or restricted denominator.
5. **Answer** — state the exact final probability or count in a separate closing line.''',
)
standard.write_text(text, encoding="utf-8")
