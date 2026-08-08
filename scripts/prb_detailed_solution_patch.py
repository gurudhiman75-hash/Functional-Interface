from pathlib import Path

ROOT = Path("artifacts/api-server/src/quant-v4/topics/Probability")


def replace_once(path: Path, old: str, new: str, label: str) -> None:
    text = path.read_text(encoding="utf-8")
    if new in text:
        return
    if old not in text:
        raise SystemExit(f"Could not patch {label} in {path}")
    path.write_text(text.replace(old, new, 1), encoding="utf-8")


# ---------------------------------------------------------------------------
# 1. Replace compact answer-key output with a visible worked-solution model.
# ---------------------------------------------------------------------------
remodeler = ROOT / "shared/exam-depth-remodeler.ts"
text = remodeler.read_text(encoding="utf-8")
helper_marker = "export function remodelProbabilityExplanation("
helper = r'''
function workedSolutionApproach(entry: ProbabilityTaskRegistryEntry): string {
  const mode = entry.solveMode;

  if (["findFavourableOutcomeCount", "findMissingEventCountFromProbability", "findTotalOutcomeCount", "findMissingObjectCountFromProbability", "findMissingDeckCountOrEventCount", "findReverseDiceOrSpinnerEventCount", "findReverseConditionalCount", "findReverseCountFromProbability"].includes(mode)) {
    return "Work backwards from probability = favourable cases ÷ total cases, and solve for the missing count.";
  }
  if (["findComplementProbability", "findAtLeastOneUsingComplement", "findAtLeastOneObjectOfType", "findAtLeastOneAcrossIndependentStages", "findComplementCardProbability", "findRestrictedSelectionProbability", "findNeitherEventProbability"].includes(mode)) {
    return "Use the complementary event because it is shorter to count the unwanted case and subtract its probability from 1.";
  }
  if (/Coin|Head|Success|None|AllSuccess|AtMost|AtLeastOneUsingComplement/.test(mode)) {
    return "For fair coin tosses, every H/T sequence is equally likely, so count the sequences that satisfy the condition.";
  }
  if (/Dice|Die/.test(mode)) {
    return "Treat the result as an ordered outcome; for two dice, (first die, second die) gives 6 × 6 = 36 equally likely pairs.";
  }
  if (/Card|Deck|Rank|Suit|Colour|Face/.test(mode)) {
    return "Use the standard 52-card deck counts and adjust for any card that belongs to both required groups.";
  }
  if (["findSimultaneousSameTypeProbability", "findSimultaneousDifferentTypeProbability", "findExactCompositionProbability", "findSelectionProbabilityUsingCombination", "findNoObjectOfTypeProbability"].includes(mode) && entry.cpId === "PRB-CP-005") {
    return "The objects are selected together, so order does not matter; count selections with combinations.";
  }
  if (["findSuccessiveIndependentProbability", "findWithReplacementProbability", "findSuccessiveDependentProbability", "findWithoutReplacementProbability", "findOrderedDrawSequenceProbability", "findSameTypeInSuccessiveDraws", "findDifferentTypesInSuccessiveDraws"].includes(mode)) {
    return "Follow the selections in order and multiply the stage probabilities, updating the contents whenever an object is not replaced.";
  }
  if (/Conditional/.test(mode)) {
    return "First restrict the sample space to the outcomes allowed by the given condition, and then form favourable ÷ restricted total.";
  }
  if (["findCommitteeCompositionProbability", "findRestrictedSelectionProbability", "findSelectionProbabilityUsingCombination", "findReverseCountFromProbability"].includes(mode) && entry.cpId === "PRB-CP-008") {
    return "A committee is an unordered selection, so use combinations for both the complete set of committees and the required composition.";
  }
  if (["findTogetherOrApartProbability", "findRandomArrangementPropertyProbability", "findPositionRestrictionProbability", "findNumberFormationProbability"].includes(mode)) {
    return "Count all equally likely arrangements first, then count only the arrangements that satisfy the stated position or adjacency condition.";
  }
  if (["findUnionProbability", "findExactlyOneOfTwoEvents", "findMixedEventExpressionProbability", "findNeitherEventProbability", "findMissingIntersectionOrUnionProbability"].includes(mode)) {
    return "Use inclusion–exclusion so that members belonging to both groups are not counted twice.";
  }
  if (mode === "findIntersectionProbability") {
    return "The required event is the overlap of the two groups, so compare the number in both groups with the complete group.";
  }
  if (mode === "findMutuallyExclusiveUnion") {
    return "The events cannot occur together, so their probabilities are added without subtracting any overlap.";
  }
  if (mode === "findIndependentIntersection") {
    return "The events are independent, so the probability that both occur is the product of their individual probabilities.";
  }
  return "Identify the equally likely total cases, count the cases satisfying the condition, and use probability = favourable cases ÷ total cases.";
}

function workedSolutionReason(entry: ProbabilityTaskRegistryEntry): string {
  const mode = entry.solveMode;

  if (["findFavourableOutcomeCount", "findMissingEventCountFromProbability", "findTotalOutcomeCount", "findMissingObjectCountFromProbability", "findMissingDeckCountOrEventCount", "findReverseDiceOrSpinnerEventCount", "findReverseConditionalCount", "findReverseCountFromProbability"].includes(mode)) {
    return "Substituting the derived count back into favourable cases ÷ total cases reproduces the probability stated in the question.";
  }
  if (["findComplementProbability", "findAtLeastOneUsingComplement", "findAtLeastOneObjectOfType", "findAtLeastOneAcrossIndependentStages", "findComplementCardProbability", "findRestrictedSelectionProbability", "findNeitherEventProbability"].includes(mode)) {
    return "The required event and its complement are disjoint and together cover every possible outcome, so their probabilities add to 1.";
  }
  if (/Coin|Head|Success|None|AllSuccess|AtMost/.test(mode)) {
    return "A fair coin makes every sequence of the same length equally likely, so counting valid sequences gives the exact probability.";
  }
  if (/Dice|Die/.test(mode)) {
    return "Each ordered die result is equally likely; counting ordered pairs prevents (a,b) and (b,a) from being incorrectly treated as one case.";
  }
  if (/Card|Deck|Rank|Suit|Colour|Face/.test(mode)) {
    return "Each card is equally likely to be drawn, so the required card count over 52 gives the probability; any overlap must be counted only once.";
  }
  if (["findSimultaneousSameTypeProbability", "findSimultaneousDifferentTypeProbability", "findExactCompositionProbability", "findSelectionProbabilityUsingCombination", "findNoObjectOfTypeProbability"].includes(mode) && entry.cpId === "PRB-CP-005") {
    return "Each selected group is counted exactly once by combinations because changing the order of the same selected objects does not create a new selection.";
  }
  if (["findSuccessiveIndependentProbability", "findWithReplacementProbability", "findSuccessiveDependentProbability", "findWithoutReplacementProbability", "findOrderedDrawSequenceProbability", "findSameTypeInSuccessiveDraws", "findDifferentTypesInSuccessiveDraws"].includes(mode)) {
    return "Both stages must occur along the same path, so their probabilities are multiplied; without replacement, the second numerator and denominator change.";
  }
  if (/Conditional/.test(mode)) {
    return "Once the condition is known, outcomes outside the restricted group are impossible and must not remain in the denominator.";
  }
  if (["findCommitteeCompositionProbability", "findRestrictedSelectionProbability", "findSelectionProbabilityUsingCombination", "findReverseCountFromProbability"].includes(mode) && entry.cpId === "PRB-CP-008") {
    return "Choosing the required members uniquely determines a committee, so the product of the combination counts includes every valid committee exactly once.";
  }
  if (["findTogetherOrApartProbability", "findRandomArrangementPropertyProbability", "findPositionRestrictionProbability", "findNumberFormationProbability"].includes(mode)) {
    return "All admissible arrangements are equally likely, and the restriction count selects precisely the arrangements described in the question.";
  }
  if (["findUnionProbability", "findExactlyOneOfTwoEvents", "findMixedEventExpressionProbability", "findNeitherEventProbability", "findMissingIntersectionOrUnionProbability"].includes(mode)) {
    return "Adding the two group counts includes the overlap twice, so inclusion–exclusion removes the extra copy before the probability is formed.";
  }
  if (mode === "findIntersectionProbability") {
    return "The intersection contains only members satisfying both conditions, which is exactly the overlap supplied in the data.";
  }
  if (mode === "findMutuallyExclusiveUnion") {
    return "Mutually exclusive events have no common outcome, so simple addition counts every favourable outcome exactly once.";
  }
  if (mode === "findIndependentIntersection") {
    return "Independence means the first result does not alter the second probability, making multiplication valid.";
  }
  return "Every elementary case is equally likely, so the ratio of favourable cases to total cases is the required probability.";
}

function bigintGcd(left: bigint, right: bigint): bigint {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b !== 0n) [a, b] = [b, a % b];
  return a === 0n ? 1n : a;
}

function workedSolutionSimplification(solved: SolvedProbability): string | null {
  if (solved.answer.kind !== "PROBABILITY") return null;
  const favourable = solved.evidence.favourableOutcomeCount;
  const total = solved.evidence.totalOutcomeCount;
  if (favourable === undefined || total === undefined || total === 0n) return null;
  const divisor = bigintGcd(favourable, total);
  if (divisor <= 1n) return null;
  return `Divide the numerator and denominator by ${divisor}: ${favourable}/${total} = ${favourable / divisor}/${total / divisor} = ${solved.exactDisplay}.`;
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
  solved: SolvedProbability,
  explanation: string[],
): string[] {
  const core = explanation
    .map(tidy)
    .filter(Boolean)
    .filter((line) => !/^Method\s+—/i.test(line));

  const result: string[] = [`Approach — ${workedSolutionApproach(entry)}`];
  core.forEach((line, index) => {
    result.push(`Step ${index + 1} — ${capitaliseSentence(line)}`);
  });

  const simplification = workedSolutionSimplification(solved);
  if (simplification && !core.some((line) => /divide (?:the )?numerator|lowest terms/i.test(line))) {
    result.push(`Simplification — ${simplification}`);
  }

  result.push(`Why this works — ${workedSolutionReason(entry)}`);
  result.push(
    solved.answer.kind === "COUNT"
      ? `Answer — The required number is ${solved.exactDisplay}.`
      : `Answer — The required probability is ${solved.exactDisplay}.`,
  );

  return result.map(tidy).filter(Boolean);
}

'''
if "function buildDetailedWorkedSolution(" not in text:
    if helper_marker not in text:
        raise SystemExit("Could not find remodel explanation export marker")
    text = text.replace(helper_marker, helper + helper_marker, 1)

old_return = '''  if (entry.difficulty !== "Easy" && explanation.length < 3) {
    explanation = [methodLead(entry), ...explanation];
  }

  return explanation.map(tidy).filter(Boolean);
}'''
new_return = '''  if (entry.difficulty !== "Easy" && explanation.length < 3) {
    explanation = [methodLead(entry), ...explanation];
  }

  return buildDetailedWorkedSolution(entry, solved, explanation);
}'''
if new_return not in text:
    if old_return not in text:
        raise SystemExit("Could not replace compact explanation return")
    text = text.replace(old_return, new_return, 1)
remodeler.write_text(text, encoding="utf-8")


# ---------------------------------------------------------------------------
# 2. Make the detailed structure a permanent validation requirement.
# ---------------------------------------------------------------------------
validator = ROOT / "shared/validator.ts"
text = validator.read_text(encoding="utf-8")
old_validation = '''  checks.push(check("simple-explanation-length", explanationWords >= 12 && explanationWords <= 120, `Explanation has ${explanationWords} words; expected 12-120.`));
  checks.push(check("difficulty-appropriate-explanation-depth", entry.difficulty === "Easy" || explanationWords >= 20, `Medium/Hard explanation has only ${explanationWords} words; expected at least 20.`));
  checks.push(check("exam-depth-decision-path", !EXAM_DEPTH_MODES.has(entry.solveMode) || (explanation.length >= 3 && hasMethodDecision(explanation)), "A multi-step explanation must state the method decision and show at least three reasoning lines."));'''
new_validation = '''  const minimumExplanationWords = entry.difficulty === "Easy" ? 32 : entry.difficulty === "Medium" ? 48 : 55;
  const minimumExplanationLines = entry.difficulty === "Easy" ? 4 : 5;
  checks.push(check("detailed-explanation-length", explanationWords >= minimumExplanationWords && explanationWords <= 220, `Explanation has ${explanationWords} words; expected ${minimumExplanationWords}-220 for ${entry.difficulty}.`));
  checks.push(check("worked-solution-line-depth", explanation.length >= minimumExplanationLines, `${entry.difficulty} explanation has ${explanation.length} lines; expected at least ${minimumExplanationLines}.`));
  checks.push(check("worked-solution-structure", /^Approach —/.test(explanation[0] ?? "") && explanation.some((line) => /^Why this works —/.test(line)) && /^Answer —/.test(explanation.at(-1) ?? ""), "Explanation must contain an approach, worked steps, method justification and a final answer line."));
  checks.push(check("exam-depth-decision-path", !EXAM_DEPTH_MODES.has(entry.solveMode) || (explanation.length >= 5 && hasMethodDecision(explanation)), "A multi-step explanation must state the method decision and show at least five reasoning lines."));'''
if new_validation not in text:
    if old_validation not in text:
        raise SystemExit("Could not replace validator explanation-depth checks")
    text = text.replace(old_validation, new_validation, 1)
validator.write_text(text, encoding="utf-8")


# ---------------------------------------------------------------------------
# 3. Raise the corpus-wide editorial audit to the new teaching standard.
# ---------------------------------------------------------------------------
audit = ROOT / "exam-depth-review-audit.py"
text = audit.read_text(encoding="utf-8")
text = text.replace(
    '    if mean(explanation_lengths) < 24:\n        raise SystemExit(f"Average explanation length is only {mean(explanation_lengths):.1f} words; expected at least 24")',
    '    if mean(explanation_lengths) < 52:\n        raise SystemExit(f"Average explanation length is only {mean(explanation_lengths):.1f} words; expected at least 52")',
)
text = text.replace(
    '    if not medium_hard_lengths or mean(medium_hard_lengths) < 30:\n        raise SystemExit(f"Medium/Hard explanation average is {mean(medium_hard_lengths):.1f}; expected at least 30")',
    '    if not medium_hard_lengths or mean(medium_hard_lengths) < 62:\n        raise SystemExit(f"Medium/Hard explanation average is {mean(medium_hard_lengths):.1f}; expected at least 62")',
)
text = text.replace(
    '            if words < 22:\n                raise SystemExit(f"{row[\'qlId\']}: multi-step explanation is too short ({words} words)")',
    '            if words < 48:\n                raise SystemExit(f"{row[\'qlId\']}: multi-step explanation is too short ({words} words)")',
)
structure_marker = '''    for row in rows:
        if row["solveMode"] in DEPTH_MODES:
'''
structure_block = '''    for row in rows:
        explanation = row["explanation"]
        if "Approach —" not in explanation or "Why this works —" not in explanation or "Answer —" not in explanation:
            raise SystemExit(f"{row['qlId']}: worked-solution structure is incomplete")
        if not re.search(r"Step 1 —", explanation):
            raise SystemExit(f"{row['qlId']}: numbered working is missing")

    for row in rows:
        if row["solveMode"] in DEPTH_MODES:
'''
if "worked-solution structure is incomplete" not in text:
    if structure_marker not in text:
        raise SystemExit("Could not insert worked-solution corpus audit")
    text = text.replace(structure_marker, structure_block, 1)
audit.write_text(text, encoding="utf-8")


# ---------------------------------------------------------------------------
# 4. Update generated-report wording to describe the new learner surface.
# ---------------------------------------------------------------------------
generator = ROOT / "generate-exam-review.ts"
text = generator.read_text(encoding="utf-8")
old_report = '''Explanations follow an exam-depth pattern:\\n\\n1. State why the selected method applies.\\n2. Identify the complete or restricted sample space.\\n3. Count the required cases, showing concrete outcomes when the set is small.\\n4. Form and simplify the final probability.\\n\\nCombination questions explain what is being chosen; replacement, order, overlap and conditional restrictions are stated explicitly. The object named in the stem remains the same throughout the explanation. Internal QA terminology is never displayed to students.'''
new_report = '''Explanations now use a visible worked-solution pattern:\\n\\n1. **Approach:** state the exact probability idea and why it fits.\\n2. **Numbered working:** establish the sample space, derive any missing value and count the required cases.\\n3. **Simplification:** reduce the fraction explicitly when reduction is required.\\n4. **Why this works:** explain why the counting or probability rule is valid.\\n5. **Answer:** close with the exact required probability or count.\\n\\nCombination questions explain what is being chosen; replacement, order, overlap and conditional restrictions are stated explicitly. Small sample spaces display their actual outcomes. The object named in the stem remains the same throughout the explanation. Internal QA terminology is never displayed to students.'''
if new_report not in text:
    if old_report not in text:
        raise SystemExit("Could not update generated report explanation standard")
    text = text.replace(old_report, new_report, 1)
generator.write_text(text, encoding="utf-8")


# ---------------------------------------------------------------------------
# 5. Record the standard permanently for future chapter work.
# ---------------------------------------------------------------------------
standard = ROOT / "PROBABILITY-EXAM-DEPTH-STANDARD.md"
text = standard.read_text(encoding="utf-8")
marker = "## 3. Distractor standard"
section = '''## 2.6 Worked-solution presentation

Every learner explanation must read as a complete worked solution rather than a compressed answer key. The visible order is:

1. **Approach** — name the exact idea being used and why it is suitable.
2. **Numbered steps** — use the values from the question to establish the sample space, derive missing quantities and count the required cases.
3. **Simplification** — show how the final fraction is reduced whenever reduction is needed.
4. **Why this works** — explain why the counting rule, complement, conditional restriction, multiplication rule or inclusion–exclusion step is valid.
5. **Answer** — state the exact final probability or count in a separate closing line.

An explanation must not become “detailed” merely by repeating the question or adding generic theory. Every added sentence must clarify the actual numerical reasoning of that question.

'''
if "## 2.6 Worked-solution presentation" not in text:
    if marker not in text:
        raise SystemExit("Could not insert worked-solution standard")
    text = text.replace(marker, section + marker, 1)
standard.write_text(text, encoding="utf-8")
