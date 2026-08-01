export const SER_V3_NATURAL_STANDARD_ID = "SER-V3-NATURAL" as const;

export type SerV3Term = number | string;
export type SerV3TaskKind = "NEXT_TERM" | "MISSING_TERM" | "PREVIOUS_TERM" | "WRONG_TERM";

export interface SerV3CompatibleQuestion {
  readonly questionId: string;
  readonly checkpointId: string;
  readonly temporaryTemplateId: string;
  readonly taskKind: SerV3TaskKind;
  readonly seed: number;
  readonly difficulty?: string;
  readonly stem: string;
  readonly sequence: readonly (SerV3Term | null)[];
  readonly options: readonly SerV3Term[];
  readonly correctAnswer: SerV3Term;
  readonly correctIndex: number;
  readonly ruleId?: string;
  readonly candidateRuleId?: string;
  readonly sourceRuleId?: string;
  readonly canonicalAuthorityId?: string;
  readonly explanation: {
    readonly ruleStatement: string;
    readonly working: readonly string[];
    readonly conclusion: string;
    readonly trapAnalyses: readonly string[];
  };
  readonly hiddenState: {
    readonly canonicalSequence: readonly SerV3Term[];
    readonly targetIndex: number;
    readonly corruptedValue: SerV3Term | null;
    readonly correctReplacement: SerV3Term;
    readonly start?: number;
    readonly step?: number;
    readonly multiplier?: number;
    readonly addition?: number;
    readonly firstDifference?: number;
    readonly secondDifference?: number;
    readonly thirdDifference?: number;
    readonly parameterKey?: string;
  };
}

export interface SerV3NaturalExplanation {
  readonly standardId: typeof SER_V3_NATURAL_STANDARD_ID;
  readonly corePattern: string;
  readonly derivation: readonly string[];
  readonly examSpeedShortcut: string;
  readonly commonTrap: {
    readonly code: string;
    readonly warning: string;
    readonly optionWarnings: readonly string[];
  };
  readonly answerRevealStep: number;
}

export type SerV3NaturalQuestion<T extends SerV3CompatibleQuestion> = T & {
  readonly explanationV3: SerV3NaturalExplanation;
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const VOWELS = ["A", "E", "I", "O", "U"] as const;
const CONSONANTS = [...ALPHABET].filter((letter) => !VOWELS.includes(letter as (typeof VOWELS)[number]));

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
}

function authorityOf(question: SerV3CompatibleQuestion): string {
  return question.canonicalAuthorityId
    ?? question.candidateRuleId
    ?? question.sourceRuleId
    ?? question.ruleId
    ?? "SERIES_PATTERN";
}

function sourceOf(question: SerV3CompatibleQuestion): string {
  return question.sourceRuleId
    ?? question.candidateRuleId
    ?? question.ruleId
    ?? question.canonicalAuthorityId
    ?? "SERIES_PATTERN";
}

function isSingleLetter(value: SerV3Term): value is string {
  return typeof value === "string" && /^[A-Z]$/.test(value);
}

function isAlphabeticQuestion(question: SerV3CompatibleQuestion): boolean {
  return question.hiddenState.canonicalSequence.every(isSingleLetter);
}

function alphabetPosition(letter: string): number {
  return ALPHABET.indexOf(letter) + 1;
}

function plainTerm(value: SerV3Term): string {
  return String(value).replace("−", "-");
}

function mathTerm(value: SerV3Term, showAlphabetPosition = false): string {
  if (showAlphabetPosition && isSingleLetter(value)) {
    return `${value}(${alphabetPosition(value)})`;
  }
  return plainTerm(value);
}

function inlineMath(content: string): string {
  return `$${content}$`;
}

function signed(value: number): string {
  return value >= 0 ? `+${value}` : String(value);
}

function numeric(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function choose<T>(values: readonly T[], seed: number): T {
  return values[mod(seed, values.length)]!;
}

function sequenceMath(values: readonly SerV3Term[], alphabetic: boolean): string {
  return inlineMath(values.map((value) => mathTerm(value, alphabetic)).join(" \\rightarrow "));
}

function standardAlphabetShift(from: string, to: string, source: string): number {
  let shift = alphabetPosition(to) - alphabetPosition(from);
  if (/BACKWARD/.test(source)) {
    if (shift > 0) shift -= 26;
  } else if (shift < 0) {
    shift += 26;
  }
  return shift;
}

function subsetForSource(source: string): readonly string[] | undefined {
  if (/VOWEL/.test(source)) return VOWELS;
  if (/CONSONANT/.test(source)) return CONSONANTS;
  return undefined;
}

function letterTransition(from: string, to: string, source: string): string {
  const subset = subsetForSource(source);
  let shift: number;
  if (subset) {
    const fromIndex = subset.indexOf(from);
    const toIndex = subset.indexOf(to);
    shift = mod(toIndex - fromIndex, subset.length);
  } else {
    shift = standardAlphabetShift(from, to, source);
  }
  return inlineMath(`${mathTerm(from, true)} \\xrightarrow{${signed(shift)}} ${mathTerm(to, true)}`);
}

function numericTransition(from: SerV3Term, to: SerV3Term): string {
  return inlineMath(`${mathTerm(from)} \\rightarrow ${mathTerm(to)}`);
}

function transition(from: SerV3Term, to: SerV3Term, question: SerV3CompatibleQuestion): string {
  return isSingleLetter(from) && isSingleLetter(to)
    ? letterTransition(from, to, sourceOf(question))
    : numericTransition(from, to);
}

function corePattern(question: SerV3CompatibleQuestion): string {
  const authority = authorityOf(question);
  const source = sourceOf(question);
  const hidden = question.hiddenState;
  const step = numeric(hidden.step);
  const multiplier = numeric(hidden.multiplier);
  const addition = numeric(hidden.addition);
  const second = numeric(hidden.secondDifference);
  const third = numeric(hidden.thirdDifference);
  const opener = choose([
    "Notice how the terms are connected rather than reading them as separate values.",
    "The useful clue is the operation that repeats from one valid term to the next.",
    "Let us first identify the relationship that stays consistent across the known terms.",
    "A quick comparison of the known terms reveals the governing pattern.",
  ], question.seed + question.checkpointId.length);

  if (question.checkpointId === "SER-CP-001" && step !== undefined) {
    return `${opener} Every term changes by the same common difference ${inlineMath(signed(step))}.`;
  }
  if (question.checkpointId === "SER-CP-002") {
    if (authority === "UNIFORM_MULTIPLICATIVE_RATIO" && multiplier !== undefined) {
      return `${opener} Each term is obtained by multiplying the previous term by the fixed ratio ${inlineMath(multiplier)}.`;
    }
    if (multiplier !== undefined && addition !== undefined) {
      return `${opener} The same multiply-then-adjust rule repeats each time: ${inlineMath(`a_{n+1}=${multiplier}a_n${addition >= 0 ? "+" : ""}${addition}`)}.`;
    }
  }
  if (question.checkpointId === "SER-CP-003") {
    if (authority.includes("SECOND") && second !== undefined) {
      return `${opener} The first differences change, but the second difference remains constant at ${inlineMath(second)}.`;
    }
    if (third !== undefined) {
      return `${opener} The first and second differences change, while the third difference remains constant at ${inlineMath(third)}.`;
    }
  }
  if (question.checkpointId === "SER-CP-004") {
    const descriptions: Record<string, string> = {
      CONSECUTIVE_SQUARES: "The terms are squares of consecutive integers.",
      CONSECUTIVE_CUBES: "The terms are cubes of consecutive integers.",
      FIXED_BASE_CONSECUTIVE_POWERS: "The exponent increases by one while the base remains fixed.",
      CONSECUTIVE_PRIMES: "The series follows consecutive prime numbers.",
      TRIANGULAR_NUMBERS: "The terms are consecutive triangular numbers.",
      FACTORIAL_SEQUENCE: "Each term is the next factorial value.",
      ADD_PREVIOUS_TWO_RECURRENCE: "Every new term is formed by adding the previous two terms.",
    };
    return `${opener} ${descriptions[source] ?? "The terms follow one recognisable special-number or recurrence rule."}`;
  }
  if (question.checkpointId === "SER-CP-005") {
    if (/INTERLEAVED|ALTERNATING_ADDITIVE|ALTERNATING_MULTIPLICATIVE/.test(source + authority)) {
      return `${opener} Read alternate positions as separate lanes; each lane keeps its own consistent rule.`;
    }
    if (/PROGRESSIVE/.test(source + authority)) {
      return `${opener} The operation schedule changes progressively, so track the multiplier or adjustment used at each step.`;
    }
    return `${opener} Two operations alternate in a fixed phase, and the phase must be preserved throughout the series.`;
  }
  if (question.checkpointId === "SER-CP-006") {
    if (/VOWEL/.test(source)) {
      return `${opener} The series moves only through the ordered vowel set ${inlineMath("\\{A,E,I,O,U\\}")}; standard alphabet positions are shown as mental anchors.`;
    }
    if (/CONSONANT/.test(source)) {
      return `${opener} The series moves only through consonants in alphabetical order, skipping ${inlineMath("A,E,I,O,U")}; standard alphabet positions remain the main anchors.`;
    }
    if (/INTERLEAVED|ALTERNATING/.test(source + authority)) {
      return `${opener} Convert letters to ${inlineMath("A=1,B=2,\\ldots,Z=26")} and read alternate positions as separate cyclic lanes.`;
    }
    if (/PROGRESSIVE/.test(source + authority)) {
      return `${opener} Convert letters to ${inlineMath("A=1,B=2,\\ldots,Z=26")} and increase the alphabet jump according to the visible schedule.`;
    }
    return `${opener} Convert letters to ${inlineMath("A=1,B=2,\\ldots,Z=26")} and apply the same cyclic shift each time.`;
  }
  return `${opener} Confirm the complete operation schedule on the known terms before solving the target position.`;
}

function knownForwardEvidence(question: SerV3CompatibleQuestion): string[] {
  const canonical = question.hiddenState.canonicalSequence;
  const target = question.hiddenState.targetIndex;
  const pairs: Array<[SerV3Term, SerV3Term]> = [];
  for (let index = 0; index < canonical.length - 1; index += 1) {
    if (index === target || index + 1 === target) continue;
    pairs.push([canonical[index]!, canonical[index + 1]!]);
    if (pairs.length === 2) break;
  }
  if (pairs.length === 0 && canonical.length >= 2) {
    pairs.push([canonical[0]!, canonical[1]!]);
  }
  return pairs.map(([from, to]) => transition(from, to, question));
}

function previousInverseLine(question: SerV3CompatibleQuestion): string {
  const canonical = question.hiddenState.canonicalSequence;
  const target = question.hiddenState.correctReplacement;
  const firstKnown = canonical[1]!;
  const authority = authorityOf(question);
  const source = sourceOf(question);
  const hidden = question.hiddenState;

  if (question.checkpointId === "SER-CP-001" && numeric(hidden.step) !== undefined) {
    const step = hidden.step!;
    return `The forward change is ${inlineMath(signed(step))}, so the inverse change is ${inlineMath(signed(-step))}: ${inlineMath(`a_0=${plainTerm(firstKnown)}-(${step})=${plainTerm(target)}`)}.`;
  }
  if (question.checkpointId === "SER-CP-002" && numeric(hidden.multiplier) !== undefined) {
    const multiplier = hidden.multiplier!;
    const addition = hidden.addition ?? 0;
    return `Reverse the recurrence ${inlineMath(`a_{n+1}=${multiplier}a_n${addition >= 0 ? "+" : ""}${addition}`)}: ${inlineMath(`a_0=(${plainTerm(firstKnown)}-(${addition}))/${multiplier}=${plainTerm(target)}`)}.`;
  }
  if (question.checkpointId === "SER-CP-003") {
    const values = canonical.map(Number);
    if (authority.includes("SECOND")) {
      const constantSecond = hidden.secondDifference ?? ((values[3]! - values[2]!) - (values[2]! - values[1]!));
      const knownFirst = values[2]! - values[1]!;
      const previousFirst = knownFirst - constantSecond;
      return `Extend the difference row one place backward: ${inlineMath(`d_0=${knownFirst}-(${constantSecond})=${previousFirst}`)}, then ${inlineMath(`a_0=${values[1]}-(${previousFirst})=${values[0]}`)}.`;
    }
    const d12 = values[2]! - values[1]!;
    const d23 = values[3]! - values[2]!;
    const knownSecond = d23 - d12;
    const constantThird = hidden.thirdDifference ?? 0;
    const previousSecond = knownSecond - constantThird;
    const previousFirst = d12 - previousSecond;
    return `Move the difference table backward: ${inlineMath(`\\Delta^2_0=${knownSecond}-(${constantThird})=${previousSecond}`)}, ${inlineMath(`\\Delta_0=${d12}-(${previousSecond})=${previousFirst}`)}, so ${inlineMath(`a_0=${values[1]}-(${previousFirst})=${values[0]}`)}.`;
  }
  if (question.checkpointId === "SER-CP-004") {
    const first = Number(firstKnown);
    const answer = Number(target);
    if (source === "CONSECUTIVE_SQUARES") {
      const root = Math.round(Math.sqrt(first));
      return `The first known term is ${inlineMath(`${root}^2=${first}`)}, so one index earlier is ${inlineMath(`(${root}-1)^2=${answer}`)}.`;
    }
    if (source === "CONSECUTIVE_CUBES") {
      const root = Math.round(Math.cbrt(first));
      return `The first known term is ${inlineMath(`${root}^3=${first}`)}, so one index earlier is ${inlineMath(`(${root}-1)^3=${answer}`)}.`;
    }
    if (source === "FIXED_BASE_CONSECUTIVE_POWERS") {
      const ratio = Number(canonical[2]) / first;
      return `Consecutive powers have the same ratio ${inlineMath(ratio)}, so ${inlineMath(`a_0=${first}/${ratio}=${answer}`)}.`;
    }
    if (source === "CONSECUTIVE_PRIMES") {
      return `Step one prime backward from ${inlineMath(first)}; the immediately preceding prime is ${inlineMath(answer)}.`;
    }
    if (source === "TRIANGULAR_NUMBERS") {
      const n = Math.round((Math.sqrt(8 * first + 1) - 1) / 2);
      return `Since ${inlineMath(`T_${n}=${n}(${n}+1)/2=${first}`)}, the earlier term is ${inlineMath(`T_${n - 1}=(${n - 1})${n}/2=${answer}`)}.`;
    }
    if (source === "FACTORIAL_SEQUENCE") {
      let n = 1;
      let factorial = 1;
      while (factorial < first && n < 12) {
        n += 1;
        factorial *= n;
      }
      return `The first known term is ${inlineMath(`${n}!=${first}`)}, so the previous factorial is ${inlineMath(`${first}/${n}=${answer}`)}.`;
    }
    if (source === "ADD_PREVIOUS_TWO_RECURRENCE") {
      return `Because ${inlineMath("a_2=a_0+a_1")}, recover the earlier term by subtraction: ${inlineMath(`a_0=${plainTerm(canonical[2]!)}-${plainTerm(canonical[1]!)}=${plainTerm(target)}`)}.`;
    }
  }
  if (question.checkpointId === "SER-CP-005") {
    const values = canonical.map(Number);
    if (/INTERLEAVED|ALTERNATING_ADDITIVE|ALTERNATING_MULTIPLICATIVE/.test(source + authority) && values.length >= 5) {
      const sameLaneLater = values[2]!;
      const sameLaneNext = values[4]!;
      const difference = sameLaneNext - sameLaneLater;
      const ratio = sameLaneLater !== 0 ? sameLaneNext / sameLaneLater : Number.NaN;
      if (Number.isInteger(ratio) && Math.abs(ratio) > 1) {
        return `Use the same position lane: ${inlineMath(`${sameLaneLater} \\times ${ratio}=${sameLaneNext}`)}, so one lane-step backward gives ${inlineMath(`${sameLaneLater}/${ratio}=${values[0]}`)}.`;
      }
      return `Use the same position lane: its change is ${inlineMath(signed(difference))}, so ${inlineMath(`a_0=${sameLaneLater}-(${difference})=${values[0]}`)}.`;
    }
    return `After confirming the phase on the known terms, reverse the first scheduled operation from ${inlineMath(plainTerm(firstKnown))}; this gives ${inlineMath(plainTerm(target))}.`;
  }
  if (question.checkpointId === "SER-CP-006" && isSingleLetter(firstKnown) && isSingleLetter(target)) {
    const forwardShift = standardAlphabetShift(target, firstKnown, source);
    const firstPosition = alphabetPosition(firstKnown);
    const targetPosition = alphabetPosition(target);
    const subset = subsetForSource(source);
    const domainNote = subset
      ? ` In the ordered ${/VOWEL/.test(source) ? "vowel" : "consonant"} list, apply the same inverse subset jump.`
      : "";
    return `The forward shift is ${inlineMath(signed(forwardShift))}, so finding the earlier term requires ${inlineMath(signed(-forwardShift))}: ${inlineMath(`${firstKnown}(${firstPosition}) \\xrightarrow{${signed(-forwardShift)}} ${target}(${targetPosition})`)}.${domainNote}`;
  }
  return `Reverse the confirmed operation at the left boundary: the term before ${inlineMath(plainTerm(firstKnown))} is ${inlineMath(plainTerm(target))}.`;
}

function targetComputationLine(question: SerV3CompatibleQuestion): string {
  const canonical = question.hiddenState.canonicalSequence;
  const targetIndex = question.hiddenState.targetIndex;
  const replacement = question.hiddenState.correctReplacement;
  const hidden = question.hiddenState;
  const previous = targetIndex > 0 ? canonical[targetIndex - 1] : undefined;

  if (question.checkpointId === "SER-CP-001" && previous !== undefined && numeric(hidden.step) !== undefined) {
    return `Apply the common difference at the target: ${inlineMath(`${plainTerm(previous)}+(${hidden.step})=${plainTerm(replacement)}`)}.`;
  }
  if (question.checkpointId === "SER-CP-002" && previous !== undefined && numeric(hidden.multiplier) !== undefined) {
    const addition = hidden.addition ?? 0;
    return `Apply the recurrence at the target: ${inlineMath(`${plainTerm(previous)}\\times${hidden.multiplier}${addition >= 0 ? "+" : ""}${addition}=${plainTerm(replacement)}`)}.`;
  }
  if (isAlphabeticQuestion(question) && previous !== undefined && isSingleLetter(previous) && isSingleLetter(replacement)) {
    return `Continue the same letter movement: ${letterTransition(previous, replacement, sourceOf(question))}.`;
  }
  if (previous !== undefined) {
    return `Continuing the confirmed rule from ${inlineMath(plainTerm(previous))} gives ${inlineMath(plainTerm(replacement))} at the target position.`;
  }
  return `The confirmed rule gives ${inlineMath(plainTerm(replacement))} at the target position.`;
}

function derivation(question: SerV3CompatibleQuestion): { lines: string[]; answerRevealStep: number } {
  const evidence = knownForwardEvidence(question);
  const canonical = question.hiddenState.canonicalSequence;
  const targetIndex = question.hiddenState.targetIndex;
  const replacement = question.hiddenState.correctReplacement;
  const alphabetic = isAlphabeticQuestion(question);

  if (question.taskKind === "PREVIOUS_TERM") {
    const firstKnown = canonical[1]!;
    const knownText = evidence.length > 0 ? evidence.join(" and ") : sequenceMath(canonical.slice(1, 4), alphabetic);
    return {
      lines: [
        `Start with the known part of the series. The transitions ${knownText} confirm the forward rule without using the missing first term.`,
        "To recover an earlier term, use the inverse of that forward operation rather than continuing in the same direction.",
        previousInverseLine(question),
        `A forward check now gives ${transition(replacement, firstKnown, question)}, so the recovered term fits the series.`,
      ],
      answerRevealStep: 3,
    };
  }

  if (question.taskKind === "WRONG_TERM") {
    const expected = sequenceMath(canonical, alphabetic);
    const corrupted = question.hiddenState.corruptedValue;
    return {
      lines: [
        `First build the progression that the rule actually requires: ${expected}.`,
        `At position ${inlineMath(String(targetIndex + 1))}, the expected term is ${inlineMath(mathTerm(replacement, alphabetic))}.`,
        `The displayed term there is ${inlineMath(mathTerm(corrupted ?? "?", alphabetic))}, so that is the anomaly and it must be replaced by ${inlineMath(mathTerm(replacement, alphabetic))}.`,
        `After the correction, the neighbouring transitions ${targetIndex > 0 ? transition(canonical[targetIndex - 1]!, replacement, question) : ""}${targetIndex < canonical.length - 1 ? ` and ${transition(replacement, canonical[targetIndex + 1]!, question)}` : ""} both agree with the rule.`,
      ],
      answerRevealStep: 2,
    };
  }

  const evidenceText = evidence.length > 0 ? evidence.join(" and ") : sequenceMath(canonical.slice(0, 3), alphabetic);
  const lines = [
    `Check the rule on known terms first: ${evidenceText}.`,
    targetComputationLine(question),
  ];
  if (question.taskKind === "MISSING_TERM" && targetIndex > 0 && targetIndex < canonical.length - 1) {
    lines.push(`The recovered value also connects correctly on the other side: ${transition(replacement, canonical[targetIndex + 1]!, question)}.`);
  } else {
    lines.push(`Therefore, the required term is ${inlineMath(mathTerm(question.correctAnswer, alphabetic))}.`);
  }
  return { lines, answerRevealStep: 2 };
}

function examShortcut(question: SerV3CompatibleQuestion): string {
  const authority = authorityOf(question);
  const source = sourceOf(question);
  if (question.taskKind === "PREVIOUS_TERM") {
    if (isAlphabeticQuestion(question)) {
      return `Write the first known letter as its alphabet number and reverse the shift. For example, use ${inlineMath("Q=17")} and subtract the forward jump instead of adding it.`;
    }
    return "Confirm the rule using two known transitions, then apply its inverse once at the left edge. Do not rebuild the whole series.";
  }
  if (question.taskKind === "WRONG_TERM") {
    return "Generate the expected value at each position and stop at the first mismatch; compare the expected and displayed terms before checking options.";
  }
  if (question.checkpointId === "SER-CP-001") {
    return "Subtract one known term from the next to get the common difference, then apply that same difference only at the target position.";
  }
  if (question.checkpointId === "SER-CP-002") {
    return authority === "UNIFORM_MULTIPLICATIVE_RATIO"
      ? "Divide two consecutive known terms to spot the fixed ratio, then verify it once more before answering."
      : "Test the same multiply-then-add operation on two consecutive transitions; one successful repeat usually identifies the rule immediately.";
  }
  if (question.checkpointId === "SER-CP-003") {
    return "Write a compact difference row beneath the terms. Stop as soon as one difference level becomes constant."
  }
  if (question.checkpointId === "SER-CP-004") {
    return /PRIME|FACTORIAL|SQUARE|CUBE|TRIANGULAR|POWER/.test(source)
      ? "Compare the terms with familiar prime, factorial, square, cube, triangular and power landmarks before trying complicated arithmetic."
      : "For a two-term recurrence, cover the options and reconstruct the next value directly from the preceding pair.";
  }
  if (question.checkpointId === "SER-CP-005") {
    return "Split odd and even positions into separate rows first. Most alternating series become much simpler once the lanes are visible.";
  }
  if (question.checkpointId === "SER-CP-006") {
    return /VOWEL|CONSONANT/.test(source)
      ? `Write the allowed subset once, then count inside that list while keeping standard positions ${inlineMath("A=1,\\ldots,Z=26")} as a check.`
      : `Convert only the needed letters to ${inlineMath("1")}–${inlineMath("26")}; calculate the shift numerically and convert back.`;
  }
  return "Verify the rule on the smallest useful set of known terms, then apply it only once at the requested position.";
}

function trapCode(question: SerV3CompatibleQuestion): string {
  const authority = authorityOf(question);
  const source = sourceOf(question);
  if (question.taskKind === "PREVIOUS_TERM") return "DIRECTION_REVERSAL_ERROR";
  if (question.taskKind === "WRONG_TERM") return "EXPECTED_SEQUENCE_NOT_BUILT";
  if (/VOWEL|CONSONANT/.test(source)) return "VOWEL_CONSONANT_DOMAIN_CONFUSION";
  if (question.checkpointId === "SER-CP-003") return "DIFFERENCE_ORDER_ERROR";
  if (question.checkpointId === "SER-CP-005" || /INTERLEAVED/.test(authority + source)) return "LANE_MIXING_ERROR";
  if (question.checkpointId === "SER-CP-002") return "OPERATION_ORDER_ERROR";
  return "PATTERN_CONTINUATION_ERROR";
}

function trapWarning(question: SerV3CompatibleQuestion, code: string): string {
  if (code === "DIRECTION_REVERSAL_ERROR") {
    return "A previous-term question reverses the direction of work. Continuing the forward operation from the first known term produces the next term, not the missing earlier term.";
  }
  if (code === "EXPECTED_SEQUENCE_NOT_BUILT") {
    return "Do not choose a term merely because it looks unusual. First calculate what every position should contain, then compare the expected value with the displayed value.";
  }
  if (code === "VOWEL_CONSONANT_DOMAIN_CONFUSION") {
    return "Count within the stated vowel or consonant set, not through every alphabet letter. Keep standard alphabet positions only as a supporting check.";
  }
  if (code === "DIFFERENCE_ORDER_ERROR") {
    return "Do not stop at a non-constant first-difference row. Continue to second or third differences until the correct level becomes constant.";
  }
  if (code === "LANE_MIXING_ERROR") {
    return "Adjacent terms may belong to different lanes. Mixing odd and even positions can create a convincing but false operation.";
  }
  if (code === "OPERATION_ORDER_ERROR") {
    return "Multiplication followed by addition is not the same as addition followed by multiplication. Preserve the exact order on every step.";
  }
  return "A nearby option often comes from applying the right idea in the wrong direction, stopping one step early, or ignoring a wrap or phase change.";
}

function optionWarnings(question: SerV3CompatibleQuestion, code: string): string[] {
  const alphabetic = isAlphabeticQuestion(question);
  return question.options
    .map((option, index) => ({ option, index }))
    .filter(({ index }) => index !== question.correctIndex)
    .map(({ option, index }) => {
      const label = String.fromCharCode(65 + index);
      if (question.taskKind === "PREVIOUS_TERM") {
        return `Option ${label} (${inlineMath(mathTerm(option, alphabetic))}) is a direction or one-step error; the inverse operation must be used.`;
      }
      if (question.taskKind === "WRONG_TERM") {
        return `Option ${label} (${inlineMath(mathTerm(option, alphabetic))}) does not match the first expected-versus-displayed mismatch.`;
      }
      return `Option ${label} (${inlineMath(mathTerm(option, alphabetic))}) is a plausible partial-pattern result, but it fails the complete rule. [${code}]`;
    });
}

export function buildSerV3NaturalExplanation(question: SerV3CompatibleQuestion): SerV3NaturalExplanation {
  const derived = derivation(question);
  const code = trapCode(question);
  return {
    standardId: SER_V3_NATURAL_STANDARD_ID,
    corePattern: corePattern(question),
    derivation: derived.lines,
    examSpeedShortcut: examShortcut(question),
    commonTrap: {
      code,
      warning: trapWarning(question, code),
      optionWarnings: optionWarnings(question, code),
    },
    answerRevealStep: derived.answerRevealStep,
  };
}

export function applySerV3NaturalExplanation<T extends SerV3CompatibleQuestion>(
  question: T,
): SerV3NaturalQuestion<T> {
  return {
    ...question,
    explanationV3: buildSerV3NaturalExplanation(question),
  };
}

function balancedMathJax(text: string): boolean {
  return (text.match(/\$/g)?.length ?? 0) % 2 === 0;
}

export function auditSerV3NaturalExplanation(question: SerV3CompatibleQuestion) {
  const explanation = buildSerV3NaturalExplanation(question);
  const allText = [
    explanation.corePattern,
    ...explanation.derivation,
    explanation.examSpeedShortcut,
    explanation.commonTrap.warning,
    ...explanation.commonTrap.optionWarnings,
  ];
  const firstStep = explanation.derivation[0] ?? "";
  const targetText = plainTerm(question.hiddenState.correctReplacement);
  const alphabetAnchorCount = explanation.derivation.join(" ").match(/[A-Z]\(\d{1,2}\)/g)?.length ?? 0;
  const bannedRobotic = /Move \d+ place(?:s)? at a time through the ordered|Each correct term changes by|At position \d+, the additive rule gives/;

  return [
    {
      name: "series-v3-four-tier",
      passed:
        explanation.corePattern.length > 0
        && explanation.derivation.length >= 2
        && explanation.examSpeedShortcut.length > 0
        && explanation.commonTrap.warning.length > 0,
      message: "Every Series item must contain Core Pattern, Step-by-Step Derivation, Exam Speed Shortcut and Common Student Trap tiers.",
    },
    {
      name: "series-v3-previous-non-spoiling",
      passed:
        question.taskKind !== "PREVIOUS_TERM"
        || (explanation.answerRevealStep >= 3 && !firstStep.includes(`=${targetText}`)),
      message: "Previous-term explanations must establish the rule and inverse direction before revealing the target.",
    },
    {
      name: "series-v3-wrong-expected-first",
      passed:
        question.taskKind !== "WRONG_TERM"
        || (explanation.answerRevealStep >= 2 && firstStep.startsWith("First build the progression")),
      message: "Wrong-term explanations must construct the expected progression before identifying the anomaly.",
    },
    {
      name: "series-v3-mathjax-balanced",
      passed: allText.every(balancedMathJax),
      message: "Every Series V3 explanation must have balanced MathJax delimiters.",
    },
    {
      name: "series-v3-alphabet-position-anchors",
      passed: !isAlphabeticQuestion(question) || alphabetAnchorCount >= 2,
      message: "Alphabetic Series explanations must show standard A=1 through Z=26 position anchors.",
    },
    {
      name: "series-v3-natural-voice",
      passed: !allText.some((text) => bannedRobotic.test(text)),
      message: "Series V3 explanations must not reuse the known robotic canned phrases.",
    },
    {
      name: "series-v3-coded-trap",
      passed: /^[A-Z0-9_]+$/.test(explanation.commonTrap.code),
      message: "Every Series V3 explanation must retain one stable public trap code.",
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
