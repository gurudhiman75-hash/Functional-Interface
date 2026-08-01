import {
  SER_V3_NATURAL_STANDARD_ID,
  type SerV3CompatibleQuestion,
  type SerV3NaturalExplanation,
  type SerV3NaturalQuestion,
  applySerV3NaturalExplanation as applyBase,
  auditSerV3NaturalExplanation as auditBase,
  buildSerV3NaturalExplanation as buildBase,
} from "./ser-v3-natural";

export { SER_V3_NATURAL_STANDARD_ID };
export type { SerV3CompatibleQuestion, SerV3NaturalExplanation, SerV3NaturalQuestion };

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const VOWELS = ["A", "E", "I", "O", "U"] as const;
const CONSONANTS = [...ALPHABET].filter((letter) => !VOWELS.includes(letter as (typeof VOWELS)[number]));

type Term = number | string;
type LaneRule =
  | { readonly kind: "ADDITIVE"; readonly step: number }
  | { readonly kind: "MULTIPLICATIVE"; readonly ratio: number }
  | { readonly kind: "LETTER_SHIFT"; readonly shift: number };

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
}

function sourceOf(question: SerV3CompatibleQuestion): string {
  return question.sourceRuleId
    ?? question.candidateRuleId
    ?? question.ruleId
    ?? question.canonicalAuthorityId
    ?? "SERIES_PATTERN";
}

function authorityOf(question: SerV3CompatibleQuestion): string {
  return question.canonicalAuthorityId
    ?? question.candidateRuleId
    ?? question.sourceRuleId
    ?? question.ruleId
    ?? "SERIES_PATTERN";
}

function isLetter(value: Term): value is string {
  return typeof value === "string" && /^[A-Z]$/.test(value);
}

function alphabetPosition(letter: string): number {
  return ALPHABET.indexOf(letter) + 1;
}

function inlineMath(value: string): string {
  return `$${value}$`;
}

function signed(value: number): string {
  return value >= 0 ? `+${value}` : String(value);
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(4)));
}

function formatTerm(value: Term): string {
  return isLetter(value) ? `${value}(${alphabetPosition(value)})` : String(value);
}

function subsetInfo(question: SerV3CompatibleQuestion): {
  readonly values: readonly string[];
  readonly label: "vowel" | "consonant";
} | undefined {
  const source = sourceOf(question);
  if (/VOWEL/.test(source)) return { values: VOWELS, label: "vowel" };
  if (/CONSONANT/.test(source)) return { values: CONSONANTS, label: "consonant" };
  return undefined;
}

function isLaneQuestion(question: SerV3CompatibleQuestion): boolean {
  const identity = `${sourceOf(question)}|${authorityOf(question)}`;
  return /INTERLEAVED|ALTERNATING_ADDITIVE_STEPS|ALTERNATING_MULTIPLICATIVE_RATIOS|ALTERNATING_SHIFT_PAIR/.test(identity);
}

function cyclicSignedShift(from: string, to: string): number {
  const forward = mod(alphabetPosition(to) - alphabetPosition(from), 26);
  return forward > 13 ? forward - 26 : forward;
}

function inferLaneRule(values: readonly Term[]): LaneRule {
  if (values.length < 2) throw new Error("A Series lane needs at least two values.");
  if (values.every(isLetter)) {
    return { kind: "LETTER_SHIFT", shift: cyclicSignedShift(values[0]!, values[1]!) };
  }
  const numbers = values.map(Number);
  if (numbers[0] !== 0) {
    const ratio = numbers[1]! / numbers[0]!;
    const multiplicative = numbers.slice(1).every((value, index) => {
      const previous = numbers[index]!;
      return previous !== 0 && value / previous === ratio;
    });
    if (multiplicative && ratio !== 1) return { kind: "MULTIPLICATIVE", ratio };
  }
  return { kind: "ADDITIVE", step: numbers[1]! - numbers[0]! };
}

function laneIndexes(length: number, parity: 0 | 1): number[] {
  return Array.from({ length }, (_, index) => index).filter((index) => index % 2 === parity);
}

function laneValues(question: SerV3CompatibleQuestion, parity: 0 | 1): Term[] {
  return laneIndexes(question.hiddenState.canonicalSequence.length, parity)
    .map((index) => question.hiddenState.canonicalSequence[index]!);
}

function laneRuleText(rule: LaneRule): string {
  if (rule.kind === "ADDITIVE") return `a fixed change of ${inlineMath(signed(rule.step))}`;
  if (rule.kind === "MULTIPLICATIVE") return `a fixed multiplier of ${inlineMath(formatNumber(rule.ratio))}`;
  return `a cyclic alphabet shift of ${inlineMath(signed(rule.shift))}`;
}

function laneTransition(from: Term, to: Term, rule: LaneRule): string {
  if (rule.kind === "ADDITIVE") {
    return inlineMath(`${formatTerm(from)} \\xrightarrow{${signed(rule.step)}} ${formatTerm(to)}`);
  }
  if (rule.kind === "MULTIPLICATIVE") {
    return inlineMath(`${formatTerm(from)} \\xrightarrow{\\times ${formatNumber(rule.ratio)}} ${formatTerm(to)}`);
  }
  return inlineMath(`${formatTerm(from)} \\xrightarrow{${signed(rule.shift)}} ${formatTerm(to)}`);
}

function inverseLaneTransition(known: Term, target: Term, rule: LaneRule): string {
  if (rule.kind === "ADDITIVE") {
    return `${inlineMath(`${formatTerm(known)}-(${rule.step})=${formatTerm(target)}`)}`;
  }
  if (rule.kind === "MULTIPLICATIVE") {
    return `${inlineMath(`${formatTerm(known)}/${formatNumber(rule.ratio)}=${formatTerm(target)}`)}`;
  }
  return `${inlineMath(`${formatTerm(known)} \\xrightarrow{${signed(-rule.shift)}} ${formatTerm(target)}`)}`;
}

function laneDisplay(values: readonly Term[]): string {
  return inlineMath(values.map(formatTerm).join(" \\rightarrow "));
}

function laneDerivation(question: SerV3CompatibleQuestion): {
  readonly derivation: readonly string[];
  readonly answerRevealStep: number;
} {
  const canonical = question.hiddenState.canonicalSequence;
  const targetIndex = question.hiddenState.targetIndex;
  const targetParity = (targetIndex % 2) as 0 | 1;
  const firstLane = laneValues(question, 0);
  const secondLane = laneValues(question, 1);
  const firstRule = inferLaneRule(firstLane);
  const secondRule = inferLaneRule(secondLane);
  const targetLane = targetParity === 0 ? firstLane : secondLane;
  const targetRule = targetParity === 0 ? firstRule : secondRule;
  const targetLaneIndexes = laneIndexes(canonical.length, targetParity);
  const targetLanePosition = targetLaneIndexes.indexOf(targetIndex);
  const replacement = question.hiddenState.correctReplacement;

  if (question.taskKind === "PREVIOUS_TERM") {
    const knownTargetLane = targetLane.slice(1);
    const knownRule = inferLaneRule(knownTargetLane);
    const firstKnown = knownTargetLane[0]!;
    return {
      derivation: [
        `Separate alternate positions before doing any arithmetic. Lane 1 has known terms ${laneDisplay(knownTargetLane)} and follows ${laneRuleText(knownRule)}; Lane 2 is ${laneDisplay(secondLane)} and follows ${laneRuleText(secondRule)}.`,
        "The missing first term belongs to Lane 1, so reverse Lane 1's rule only. Adjacent terms belong to different lanes and must not be compared.",
        `Starting from the first known Lane 1 term ${inlineMath(formatTerm(firstKnown))}, one inverse lane-step gives ${inverseLaneTransition(firstKnown, replacement, knownRule)}.`,
        `Verify within the same lane: ${laneTransition(replacement, firstKnown, knownRule)}. The recovered term therefore fits Lane 1 exactly.`,
      ],
      answerRevealStep: 3,
    };
  }

  if (question.taskKind === "WRONG_TERM") {
    const corrupted = question.hiddenState.corruptedValue;
    const laneLabel = targetParity === 0 ? "Lane 1 (positions 1, 3, 5, ...)" : "Lane 2 (positions 2, 4, 6, ...)";
    const previousSameLane = targetLanePosition > 0 ? targetLane[targetLanePosition - 1] : undefined;
    const nextSameLane = targetLanePosition < targetLane.length - 1 ? targetLane[targetLanePosition + 1] : undefined;
    const checks = [
      previousSameLane !== undefined ? laneTransition(previousSameLane, replacement, targetRule) : undefined,
      nextSameLane !== undefined ? laneTransition(replacement, nextSameLane, targetRule) : undefined,
    ].filter((value): value is string => Boolean(value));
    return {
      derivation: [
        `First separate the expected lanes. Lane 1 is ${laneDisplay(firstLane)} with ${laneRuleText(firstRule)}; Lane 2 is ${laneDisplay(secondLane)} with ${laneRuleText(secondRule)}.`,
        `The target is in ${laneLabel}. Following that lane's rule, position ${inlineMath(String(targetIndex + 1))} should contain ${inlineMath(formatTerm(replacement))}.`,
        `The displayed term is ${inlineMath(formatTerm(corrupted ?? "?"))}, so it is the anomaly and must be replaced by ${inlineMath(formatTerm(replacement))}.`,
        `Check only the same lane: ${checks.join(" and ")}. Both same-lane transitions agree with the rule.`,
      ],
      answerRevealStep: 2,
    };
  }

  const laneLabel = targetParity === 0 ? "Lane 1 (odd positions)" : "Lane 2 (even positions)";
  const previousSameLane = targetLanePosition > 0 ? targetLane[targetLanePosition - 1] : undefined;
  const nextSameLane = targetLanePosition < targetLane.length - 1 ? targetLane[targetLanePosition + 1] : undefined;
  const derivation = [
    `Split the series into alternate positions. Lane 1 is ${laneDisplay(firstLane)} and follows ${laneRuleText(firstRule)}; Lane 2 is ${laneDisplay(secondLane)} and follows ${laneRuleText(secondRule)}.`,
    `The target belongs to ${laneLabel}, so use only that lane's rule.`,
    previousSameLane !== undefined
      ? `From the previous same-lane term, ${laneTransition(previousSameLane, replacement, targetRule)}.`
      : `Applying the lane rule gives ${inlineMath(formatTerm(replacement))}.`,
  ];
  if (nextSameLane !== undefined) {
    derivation.push(`A same-lane check on the other side gives ${laneTransition(replacement, nextSameLane, targetRule)}.`);
  }
  return { derivation, answerRevealStep: 3 };
}

function subsetAnnotated(letter: string, subset: readonly string[], label: string): string {
  return `${letter}(${alphabetPosition(letter)})[\\text{${label} }${subset.indexOf(letter) + 1}]`;
}

function subsetShift(subset: readonly string[], from: string, to: string): number {
  return mod(subset.indexOf(to) - subset.indexOf(from), subset.length);
}

function subsetTransition(
  from: string,
  to: string,
  subset: readonly string[],
  label: string,
  shift: number,
): string {
  return inlineMath(`${subsetAnnotated(from, subset, label)} \\xrightarrow{+${shift}\\;\\text{${label} steps}} ${subsetAnnotated(to, subset, label)}`);
}

function subsetSequence(values: readonly Term[], subset: readonly string[], label: string): string {
  return inlineMath(values.map((value) => subsetAnnotated(String(value), subset, label)).join(" \\rightarrow "));
}

function subsetDerivation(question: SerV3CompatibleQuestion): {
  readonly derivation: readonly string[];
  readonly answerRevealStep: number;
} {
  const info = subsetInfo(question)!;
  const canonical = question.hiddenState.canonicalSequence.map(String);
  const targetIndex = question.hiddenState.targetIndex;
  const replacement = String(question.hiddenState.correctReplacement);
  const shift = subsetShift(info.values, canonical[0]!, canonical[1]!);
  const subsetOrder = inlineMath(info.values.map((letter, index) => `${index + 1}:${letter}`).join(",\\;"));

  if (question.taskKind === "PREVIOUS_TERM") {
    const firstKnown = canonical[1]!;
    const secondKnown = canonical[2]!;
    const thirdKnown = canonical[3]!;
    const knownIndex = info.values.indexOf(firstKnown) + 1;
    const targetSubsetIndex = info.values.indexOf(replacement) + 1;
    return {
      derivation: [
        `Write the ordered ${info.label} list with subset indexes: ${subsetOrder}. The known transitions ${subsetTransition(firstKnown, secondKnown, info.values, info.label, shift)} and ${subsetTransition(secondKnown, thirdKnown, info.values, info.label, shift)} establish the forward jump.`,
        `The series advances by ${inlineMath(`+${shift}`)} ${info.label} steps, so an earlier term requires ${inlineMath(`-${shift}`)} ${info.label} steps within this subset.`,
        `The first known term is subset index ${inlineMath(String(knownIndex))}. Moving backward gives ${inlineMath(`(( ${knownIndex}-1-${shift})\\bmod ${info.values.length})+1=${targetSubsetIndex}`)}, which is ${inlineMath(subsetAnnotated(replacement, info.values, info.label))}.`,
        `Verify forward: ${subsetTransition(replacement, firstKnown, info.values, info.label, shift)}.`,
      ],
      answerRevealStep: 3,
    };
  }

  if (question.taskKind === "WRONG_TERM") {
    const corrupted = String(question.hiddenState.corruptedValue ?? "?");
    const previous = canonical[targetIndex - 1];
    const next = canonical[targetIndex + 1];
    return {
      derivation: [
        `First construct the expected ${info.label} cycle using subset order ${subsetOrder}: ${subsetSequence(canonical, info.values, info.label)}.`,
        `At position ${inlineMath(String(targetIndex + 1))}, the cycle requires ${inlineMath(subsetAnnotated(replacement, info.values, info.label))}.`,
        `The displayed term is ${inlineMath(isLetter(corrupted) && info.values.includes(corrupted) ? subsetAnnotated(corrupted, info.values, info.label) : `${corrupted}(${isLetter(corrupted) ? alphabetPosition(corrupted) : "?"})`)}, so it is the anomaly and must be replaced by ${inlineMath(subsetAnnotated(replacement, info.values, info.label))}.`,
        `The corrected term links properly on both sides: ${previous ? subsetTransition(previous, replacement, info.values, info.label, shift) : ""}${previous && next ? " and " : ""}${next ? subsetTransition(replacement, next, info.values, info.label, shift) : ""}.`,
      ],
      answerRevealStep: 2,
    };
  }

  const previous = targetIndex > 0 ? canonical[targetIndex - 1]! : canonical[0]!;
  const next = targetIndex < canonical.length - 1 ? canonical[targetIndex + 1] : undefined;
  const derivation = [
    `Write the ordered ${info.label} list with subset indexes: ${subsetOrder}. The known terms show a jump of ${inlineMath(`+${shift}`)} ${info.label} steps each time.`,
    `At the target, continue inside the ${info.label} subset: ${subsetTransition(previous, replacement, info.values, info.label, shift)}.`,
  ];
  if (next) derivation.push(`Check the following transition: ${subsetTransition(replacement, next, info.values, info.label, shift)}.`);
  return { derivation, answerRevealStep: 2 };
}

function contextualPreviousShortcut(question: SerV3CompatibleQuestion): string {
  const canonical = question.hiddenState.canonicalSequence;
  const target = question.hiddenState.correctReplacement;
  const firstKnown = canonical[1]!;
  const info = subsetInfo(question);
  if (info && isLetter(String(firstKnown)) && isLetter(String(target))) {
    const shift = subsetShift(info.values, String(target), String(firstKnown));
    return `Use the subset indexes, not the raw alphabet gap: ${inlineMath(`${info.values.indexOf(String(firstKnown)) + 1}-${shift}`)} with cyclic wrap lands on ${inlineMath(subsetAnnotated(String(target), info.values, info.label))}.`;
  }
  if (isLaneQuestion(question)) {
    return "Write odd and even positions on separate lines. Find the rule of the target lane from its known terms, then reverse that lane once.";
  }
  if (isLetter(firstKnown) && isLetter(target)) {
    const forward = cyclicSignedShift(String(target), String(firstKnown));
    return `Use the actual first known letter: ${inlineMath(`${formatTerm(firstKnown)} \\xrightarrow{${signed(-forward)}} ${formatTerm(target)}`)}. Reverse the confirmed shift once.`;
  }
  return `Use the actual boundary value ${inlineMath(formatTerm(firstKnown))} and reverse the confirmed operation once to obtain ${inlineMath(formatTerm(target))}.`;
}

export function buildSerV3NaturalExplanation(question: SerV3CompatibleQuestion): SerV3NaturalExplanation {
  const base = buildBase(question);
  const lane = isLaneQuestion(question) ? laneDerivation(question) : undefined;
  const subset = subsetInfo(question) ? subsetDerivation(question) : undefined;
  const corrected = lane ?? subset;
  return {
    ...base,
    derivation: corrected?.derivation ?? base.derivation,
    answerRevealStep: corrected?.answerRevealStep ?? base.answerRevealStep,
    examSpeedShortcut:
      question.taskKind === "PREVIOUS_TERM"
        ? contextualPreviousShortcut(question)
        : base.examSpeedShortcut,
  };
}

export function applySerV3NaturalExplanation<T extends SerV3CompatibleQuestion>(
  question: T,
): SerV3NaturalQuestion<T> {
  const baseEnhanced = applyBase(question);
  return { ...baseEnhanced, explanationV3: buildSerV3NaturalExplanation(question) };
}

function balancedMathJax(text: string): boolean {
  return (text.match(/\$/g)?.length ?? 0) % 2 === 0;
}

export function auditSerV3NaturalExplanation(question: SerV3CompatibleQuestion) {
  const baseChecks = auditBase(question).filter((check) => ![
    "series-v3-previous-non-spoiling",
    "series-v3-mathjax-balanced",
    "series-v3-alphabet-position-anchors",
  ].includes(check.name));
  const explanation = buildSerV3NaturalExplanation(question);
  const text = [
    explanation.corePattern,
    ...explanation.derivation,
    explanation.examSpeedShortcut,
    explanation.commonTrap.warning,
    ...explanation.commonTrap.optionWarnings,
  ];
  const laneText = explanation.derivation.join(" ");
  const subset = subsetInfo(question);
  return [
    ...baseChecks,
    {
      name: "series-v3-previous-non-spoiling",
      passed: question.taskKind !== "PREVIOUS_TERM" || explanation.answerRevealStep >= 3,
      message: "Previous-term explanations must establish the known rule and inverse direction before revealing the target.",
    },
    {
      name: "series-v3-mathjax-balanced",
      passed: text.every(balancedMathJax),
      message: "Every Series V3 explanation must have balanced MathJax delimiters.",
    },
    {
      name: "series-v3-alphabet-position-anchors",
      passed:
        !question.hiddenState.canonicalSequence.every(isLetter)
        || (laneText.match(/[A-Z]\(\d{1,2}\)/g)?.length ?? 0) >= 2,
      message: "Alphabetic Series explanations must show standard A=1 through Z=26 position anchors.",
    },
    {
      name: "series-v3-interleaved-lane-integrity",
      passed:
        !isLaneQuestion(question)
        || (laneText.includes("Lane 1") && laneText.includes("Lane 2") && /same lane|same-lane|target lane/i.test(laneText)),
      message: "Interleaved Series explanations must separate lanes and verify within the target lane only.",
    },
    {
      name: "series-v3-subset-domain-integrity",
      passed:
        !subset
        || (laneText.includes(`${subset.label} steps`) && laneText.includes(`\\text{${subset.label} `)),
      message: "Vowel and consonant cycles must calculate in subset indexes while retaining standard alphabet-position anchors.",
    },
    {
      name: "series-v3-no-canned-shortcut-example",
      passed: !explanation.examSpeedShortcut.includes("Q=17"),
      message: "Exam shortcuts must use the actual generated values instead of a repeated canned example.",
    },
  ];
}

export function renderSerV3NaturalReview(question: SerV3CompatibleQuestion): string {
  const enhanced = applySerV3NaturalExplanation(question);
  const optionLines = enhanced.options.map(
    (option, index) => `${index === enhanced.correctIndex ? "✓" : " "} ${String.fromCharCode(65 + index)}. ${option}`,
  );
  return [
    `## ${enhanced.temporaryTemplateId} · seed ${enhanced.seed}${enhanced.difficulty ? ` · ${enhanced.difficulty}` : ""}`,
    "",
    enhanced.stem,
    "",
    ...optionLines,
    "",
    `**Answer:** ${String.fromCharCode(65 + enhanced.correctIndex)}. ${enhanced.correctAnswer}`,
    "",
    "📌 **Core Pattern**",
    enhanced.explanationV3.corePattern,
    "",
    "📝 **Step-by-Step Derivation**",
    ...enhanced.explanationV3.derivation.map((line, index) => `${index + 1}. ${line}`),
    "",
    "⚡ **Exam Speed Shortcut**",
    enhanced.explanationV3.examSpeedShortcut,
    "",
    "⚠️ **Common Student Trap**",
    `${enhanced.explanationV3.commonTrap.warning} [${enhanced.explanationV3.commonTrap.code}]`,
    ...enhanced.explanationV3.commonTrap.optionWarnings.map((line) => `- ${line}`),
  ].join("\n");
}
