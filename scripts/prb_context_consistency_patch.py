from pathlib import Path

root = Path("artifacts/api-server/src/quant-v4/topics/Probability")


def replace_region(text: str, start_marker: str, end_marker: str, replacement: str, label: str) -> str:
    start = text.find(start_marker)
    if start < 0:
        raise SystemExit(f"Missing start marker for {label}")
    end = text.find(end_marker, start)
    if end < 0:
        raise SystemExit(f"Missing end marker for {label}")
    return text[:start] + replacement + text[end:]


remodeler = root / "shared/exam-depth-remodeler.ts"
text = remodeler.read_text()

helper_marker = "\ninterface GroupContext {"
helpers = '''

function frequencyContext(entry: ProbabilityTaskRegistryEntry): ObjectContext {
  const contexts: ObjectContext[] = [
    { container: "A bag", item: "balls", singular: "ball", selectionVerb: "drawn" },
    { container: "A box", item: "pens", singular: "pen", selectionVerb: "selected" },
    { container: "A jar", item: "marbles", singular: "marble", selectionVerb: "selected" },
    { container: "A pouch", item: "coloured stones", singular: "stone", selectionVerb: "drawn" },
  ];
  return contexts[variant(entry, contexts.length)]!;
}

function definiteContainer(container: string): string {
  return container.replace(/^A /, "The ");
}
'''
if "function frequencyContext" not in text:
    if helper_marker not in text:
        raise SystemExit("Could not insert context helpers")
    text = text.replace(helper_marker, helpers + helper_marker, 1)

frequency_block = '''  if (mode === "findProbabilityFromSimpleFrequencyTable") {
  const red = numberValue(parameters, "red"), blue = numberValue(parameters, "blue"), green = numberValue(parameters, "green");
  const target = textValue(parameters, "target", "red");
  const context = frequencyContext(entry);
  return tidy(`${context.container} contains ${red} red, ${blue} blue and ${green} green ${context.item}. One ${context.singular} is ${context.selectionVerb} at random. What is the probability that it is ${target}?`);
}

'''
text = replace_region(
    text,
    '  if (mode === "findProbabilityFromSimpleFrequencyTable") {',
    '  if (mode === "findNumberRangePropertyProbability") {',
    frequency_block,
    "frequency stem",
)

simultaneous_block = '''function simultaneousExplanation(entry: ProbabilityTaskRegistryEntry, parameters: GeneratedParameters, solved: SolvedProbability): string[] {
  const mode = entry.solveMode;
  const red = numberValue(parameters, "red"), blue = numberValue(parameters, "blue"), draw = numberValue(parameters, "draw");
  const context = objectContext(entry);
  const totalItems = red + blue;
  const totalSelections = choose(totalItems, draw);
  const favourable = solved.evidence.favourableOutcomeCount?.toString() ?? "0";
  const lines = [
    `Because the ${draw} ${context.item} are selected together, their order does not matter; use combinations.`,
    `The number of possible selections of ${context.item} is C(${totalItems},${draw}) = ${totalSelections}.`,
  ];

  if (mode === "findSimultaneousSameTypeProbability") {
    lines.push(`Selections of one colour = C(${red},${draw}) + C(${blue},${draw}) = ${favourable}.`);
  } else if (mode === "findSimultaneousDifferentTypeProbability") {
    if (draw === 2) lines.push(`Select one red and one blue ${context.singular}: C(${red},1) × C(${blue},1) = ${favourable}.`);
    else lines.push(`Subtract the all-red and all-blue selections: ${totalSelections} - C(${red},${draw}) - C(${blue},${draw}) = ${favourable}.`);
  } else if (["findExactCompositionProbability", "findSelectionProbabilityUsingCombination"].includes(mode)) {
    const exactRed = numberValue(parameters, "exactRed", 1);
    lines.push(`Choose ${exactRed} red and ${draw - exactRed} blue ${context.item}: C(${red},${exactRed}) × C(${blue},${draw - exactRed}) = ${favourable}.`);
  } else if (mode === "findNoObjectOfTypeProbability") {
    lines.push(`No red ${context.singular} means all ${draw} selected ${context.item} are blue: C(${blue},${draw}) = ${favourable}.`);
  } else {
    lines.push(`Use the complement of selecting only blue ${context.item}: ${totalSelections} - C(${blue},${draw}) = ${favourable}.`);
  }
  lines.push(probabilityLine(favourable, totalSelections, solved.exactDisplay));
  return lines;
}

'''
text = replace_region(
    text,
    "function simultaneousExplanation(",
    "function successiveExplanation(",
    simultaneous_block,
    "simultaneous explanations",
)

successive_block = '''function successiveExplanation(entry: ProbabilityTaskRegistryEntry, parameters: GeneratedParameters, solved: SolvedProbability): string[] {
  const mode = entry.solveMode;
  const red = numberValue(parameters, "red"), blue = numberValue(parameters, "blue"), total = red + blue;
  const context = objectContext(entry);

  if (["findSuccessiveIndependentProbability", "findWithReplacementProbability"].includes(mode)) {
    return [
      `The first ${context.singular} is replaced, so the container again has ${red} red and ${blue} blue ${context.item} before the second selection.`,
      `Thus, P(red ${context.singular} on each selection) = ${red}/${total}.`,
      `P(both red ${context.item}) = ${red}/${total} × ${red}/${total} = ${solved.exactDisplay}.`,
    ];
  }
  if (["findSuccessiveDependentProbability", "findWithoutReplacementProbability"].includes(mode)) {
    return [
      `On the first selection, P(red ${context.singular}) = ${red}/${total}.`,
      `After one red ${context.singular} is removed, ${red - 1} red ${context.item} remain among ${total - 1} ${context.item}.`,
      `P(both red ${context.item}) = ${red}/${total} × ${red - 1}/${total - 1} = ${solved.exactDisplay}.`,
    ];
  }
  if (mode === "findOrderedDrawSequenceProbability") {
    return [
      `The order is fixed: a red ${context.singular} must occur first and a blue ${context.singular} second.`,
      `P(red first) = ${red}/${total}; after that, P(blue second) = ${blue}/${total - 1}.`,
      `Required probability = ${red}/${total} × ${blue}/${total - 1} = ${solved.exactDisplay}.`,
    ];
  }
  if (mode === "findSameTypeInSuccessiveDraws") {
    return [
      `The same colour can occur in two disjoint ways for the ${context.item}: red-red or blue-blue.`,
      `P(red-red) = ${red}/${total} × ${red - 1}/${total - 1}, and P(blue-blue) = ${blue}/${total} × ${blue - 1}/${total - 1}.`,
      `Adding the two cases gives ${solved.exactDisplay}.`,
    ];
  }
  if (mode === "findDifferentTypesInSuccessiveDraws") {
    return [
      `Different colours can occur as red-blue or blue-red, so both orders of the ${context.item} must be counted.`,
      `P = ${red}/${total} × ${blue}/${total - 1} + ${blue}/${total} × ${red}/${total - 1}.`,
      `After simplification, the required probability is ${solved.exactDisplay}.`,
    ];
  }
  return [
    `Use the complement: at least one red ${context.singular} fails only when both selected ${context.item} are blue.`,
    `Replacement keeps P(blue ${context.singular}) = ${blue}/${total} on both selections.`,
    `P(at least one red ${context.singular}) = 1 - (${blue}/${total} × ${blue}/${total}) = ${solved.exactDisplay}.`,
  ];
}

'''
text = replace_region(
    text,
    "function successiveExplanation(",
    "function conditionalExplanation(",
    successive_block,
    "successive explanations",
)

text = text.replace(
    "The condition tells us that the first selected item was red and was not replaced.",
    "The condition tells us that the first selected ball was red and was not replaced.",
)
text = text.replace(
    "Therefore, ${red - 1} red items remain among ${total - 1} items for the second selection.",
    "Therefore, ${red - 1} red balls remain among ${total - 1} balls for the second selection.",
)

insertion_marker = '''  const simultaneousModes = [
'''
direct_explanations = '''  if (mode === "findProbabilityFromSimpleFrequencyTable") {
  const red = numberValue(parameters, "red"), blue = numberValue(parameters, "blue"), green = numberValue(parameters, "green");
  const target = textValue(parameters, "target", "red");
  const context = frequencyContext(entry);
  const total = red + blue + green;
  const targetCount = target === "red" ? red : target === "blue" ? blue : green;
  explanation = [
    `${definiteContainer(context.container)} contains ${total} ${context.item} altogether: ${red} red, ${blue} blue and ${green} green.`,
    `${targetCount} of the ${total} ${context.item} are ${target}.`,
    probabilityLine(targetCount, total, solved.exactDisplay),
  ];
}

if (["findSingleDrawColourProbability", "findMissingObjectCountFromProbability"].includes(mode)) {
  const red = numberValue(parameters, "red"), blue = numberValue(parameters, "blue"), total = red + blue;
  const context = objectContext(entry);
  if (mode === "findSingleDrawColourProbability") {
    explanation = [
      `${definiteContainer(context.container)} contains ${total} ${context.item}, of which ${red} are red.`,
      `Thus, ${red} of the ${total} equally possible ${context.item} are favourable.`,
      probabilityLine(red, total, solved.exactDisplay),
    ];
  } else {
    const probability = fraction(red, total);
    explanation = [
      `Red ${context.item} make up ${probability} of all ${total} ${context.item}.`,
      `Required number of red ${context.item} = ${total} × ${probability} = ${red}.`,
      `Therefore, there are ${solved.exactDisplay} red ${context.item}.`,
    ];
  }
}

'''
if direct_explanations.strip() not in text:
    if insertion_marker not in text:
        raise SystemExit("Could not insert direct context explanations")
    text = text.replace(insertion_marker, direct_explanations + insertion_marker, 1)

remodeler.write_text(text)

validator = root / "shared/validator.ts"
text = validator.read_text()
helper_marker = "function hasGenericExplanation(explanation: string[]): boolean {"
validator_helper = '''function hasStemExplanationContextAgreement(stem: string, explanation: string[]): boolean {
  const value = explanation.join(" ");
  const rules = [
    { stem: /\\bpens?\\b/i, explanation: /\\bpens?\\b/i },
    { stem: /\\bmarbles?\\b/i, explanation: /\\bmarbles?\\b/i },
    { stem: /\\bcoloured stones?\\b/i, explanation: /\\bstones?\\b/i },
    { stem: /\\bballs?\\b/i, explanation: /\\bballs?\\b/i },
  ];
  return rules.every((rule) => !rule.stem.test(stem) || rule.explanation.test(value));
}

'''
if "function hasStemExplanationContextAgreement" not in text:
    if helper_marker not in text:
        raise SystemExit("Could not insert validator context helper")
    text = text.replace(helper_marker, validator_helper + helper_marker, 1)
check_marker = '  checks.push(check("contextual-explanation", !hasGenericExplanation(explanation), "The explanation states generic counts or uses unnatural instructional wording."));\n'
context_check = '  checks.push(check("stem-explanation-context-agreement", hasStemExplanationContextAgreement(stem, explanation), "The explanation changes the object named in the question stem."));\n'
if context_check not in text:
    if check_marker not in text:
        raise SystemExit("Could not insert validator context check")
    text = text.replace(check_marker, check_marker + context_check, 1)
validator.write_text(text)

audit = root / "exam-depth-review-audit.py"
text = audit.read_text()
audit_marker = "    explanation_lengths = [len(row[\"explanation\"].split()) for row in rows]\n"
audit_block = '''    context_rules = [
        (re.compile(r"\\bpens?\\b", re.I), re.compile(r"\\bpens?\\b", re.I), "pen"),
        (re.compile(r"\\bmarbles?\\b", re.I), re.compile(r"\\bmarbles?\\b", re.I), "marble"),
        (re.compile(r"\\bcoloured stones?\\b", re.I), re.compile(r"\\bstones?\\b", re.I), "stone"),
        (re.compile(r"\\bballs?\\b", re.I), re.compile(r"\\bballs?\\b", re.I), "ball"),
    ]
    for row in rows:
        for stem_pattern, explanation_pattern, label in context_rules:
            if stem_pattern.search(row["stem"]) and not explanation_pattern.search(row["explanation"]):
                raise SystemExit(f"{row['qlId']}: {label} context is missing from the explanation")

'''
if "context is missing from the explanation" not in text:
    if audit_marker not in text:
        raise SystemExit("Could not insert audit context agreement")
    text = text.replace(audit_marker, audit_block + audit_marker, 1)
audit.write_text(text)

generator = root / "generate-exam-review.ts"
text = generator.read_text()
old = "Explanations follow a deliberately simple pattern:\\n\\n1. Identify the total cases.\\n2. Count the required cases.\\n3. Divide and simplify.\\n\\nFor complement, conditional, successive-draw and event-algebra questions, only the shortest necessary method is shown. Internal QA terminology is never displayed to students."
new = "Explanations follow an exam-depth pattern:\\n\\n1. State why the selected method applies.\\n2. Identify the complete or restricted sample space.\\n3. Count the required cases, showing concrete outcomes when the set is small.\\n4. Form and simplify the final probability.\\n\\nCombination questions explain what is being chosen; replacement, order, overlap and conditional restrictions are stated explicitly. The object named in the stem remains the same throughout the explanation. Internal QA terminology is never displayed to students."
if new not in text:
    if old not in text:
        raise SystemExit("Could not update report standard")
    text = text.replace(old, new, 1)
generator.write_text(text)
