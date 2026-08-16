import { advancedProgramFingerprint, advancedStateFingerprint, executeAdvancedProgram, renderAdvancedRow } from "./advanced-engine.ts";
import { evaluateAdvancedIdentifiability } from "./advanced-identifiability.ts";
import { assertAdvancedOracleParity, reconstructAdvancedTraceOracle } from "./advanced-oracle.ts";
import { IOP_ADVANCED_PROTOTYPES } from "./advanced-prototypes.ts";
import { recomputeAdvancedQueryAnswer } from "./advanced-query-oracle.ts";
import { IOP_001_LIFECYCLE } from "./lifecycle.ts";
import type {
  IopAdvancedCaselet,
  IopAdvancedChildQuestion,
  IopAdvancedOperation,
  IopAdvancedProgram,
  IopAdvancedPrototypeAuthority,
  IopAdvancedPrototypeId,
  IopAdvancedToken,
  IopAdvancedTrace,
} from "./advanced-types.ts";
import type { IopDifficulty, IopOption } from "./types.ts";

const WORD_POOL = [
  "amber", "basket", "cedar", "delta", "ember", "forest", "garden", "harbor", "island", "jungle",
  "kernel", "lantern", "market", "nectar", "orange", "planet", "quartz", "river", "silver", "temple",
  "urban", "valley", "winter", "yellow", "zenith", "anchor", "bridge", "castle", "dragon", "engine",
  "fabric", "globe", "hunter", "ivory", "jacket", "kingdom", "lemon", "magnet", "native", "ocean",
] as const;

const NUMBER_POOL = [
  17, 23, 29, 31, 38, 42, 46, 53, 57, 61, 68, 72, 74, 79, 83, 86, 91, 94, 37, 49,
  58, 63, 71, 76, 82, 89, 93, 27, 34, 44, 51, 56, 64, 69, 73, 78, 84, 87, 92, 96,
] as const;

const ALPHANUMERIC_POOL = [
  "A7M4", "B3K8", "C9R2", "D5T1", "E8H6", "F2N7", "G4P9", "H6S3", "J1V8", "K7C5",
  "L3W9", "M8D2", "N5X7", "P9E4", "Q2Y6", "R6F1", "S4Z8", "T1G5", "V8J3", "W5L2",
] as const;

function hashSeed(seed: string): number {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash || 0x9e3779b9;
}

function makeRng(seed: string): () => number {
  let state = hashSeed(seed);
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 0x100000000;
  };
}

function shuffle<T>(values: readonly T[], rng: () => number): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(rng() * (index + 1));
    [result[index], result[other]] = [result[other]!, result[index]!];
  }
  return result;
}

function pickDistinct<T>(pool: readonly T[], count: number, rng: () => number): T[] {
  if (count > pool.length) throw new Error(`Cannot select ${count} values from a pool of ${pool.length}`);
  return shuffle(pool, rng).slice(0, count);
}

function inputFor(authority: IopAdvancedPrototypeAuthority, seed: string): readonly IopAdvancedToken[] {
  const rng = makeRng(seed);
  const pool = authority.tokenKind === "WORD" ? WORD_POOL : authority.tokenKind === "NUMBER" ? NUMBER_POOL : ALPHANUMERIC_POOL;
  const selected = pickDistinct(pool, authority.tokenCount, rng).map((value) => String(value));
  return shuffle(selected, rng).map((value, originalPosition) => ({
    id: `${authority.tokenKind[0]}${originalPosition + 1}`,
    kind: authority.tokenKind,
    originalValue: value,
    visibleValue: value,
    originalPosition,
  }));
}

function traceHasUniqueVisibleTokens(trace: IopAdvancedTrace): boolean {
  for (const tokens of [trace.input, ...trace.steps.map((step) => step.tokens)]) {
    if (new Set(tokens.map((token) => token.visibleValue)).size !== tokens.length) return false;
  }
  return true;
}

function safeTrace(
  authority: IopAdvancedPrototypeAuthority,
  seed: string,
  requireIdentifiable: boolean,
): { readonly trace: IopAdvancedTrace; readonly identifiability?: ReturnType<typeof evaluateAdvancedIdentifiability> } {
  for (let attempt = 0; attempt < 320; attempt += 1) {
    const input = inputFor(authority, `${seed}|${attempt}`);
    let trace: IopAdvancedTrace;
    try {
      trace = executeAdvancedProgram(authority.program, input);
      if (trace.steps.length < 4) continue;
      if (!traceHasUniqueVisibleTokens(trace)) continue;
      if (trace.finalFingerprint === advancedStateFingerprint(trace.input)) continue;
      assertAdvancedOracleParity(trace, reconstructAdvancedTraceOracle(authority.program, input));
    } catch {
      continue;
    }
    if (!requireIdentifiable) return { trace };
    const identifiability = evaluateAdvancedIdentifiability(authority.program, trace);
    if (identifiability.passed) return { trace, identifiability };
  }
  throw new Error(`Unable to generate a safe advanced trace for ${authority.prototypeId}/${seed}`);
}

function operationPhrase(operation: IopAdvancedOperation): string {
  if (operation.kind === "ITERATIVE_MOVE") {
    const key = operation.selectionKey === "WORD_LENGTH" ? "word length"
      : operation.selectionKey === "VOWEL_COUNT" ? "vowel count"
      : operation.selectionKey === "DIGIT_SUM" ? "digit sum"
      : operation.selectionKey === "LAST_DIGIT" ? "last digit"
      : operation.selectionKey === "ALPHABETICAL" ? "alphabetical order" : "numeric value";
    return `repeatedly selects by ${key} in ${operation.direction === "ASC" ? "ascending" : "descending"} order and fixes each selected item at the ${operation.placement === "LEFT_FIXED" ? "left" : "right"}`;
  }
  if (operation.kind === "TRANSFORM_ALL") {
    const phrase = operation.transform === "REVERSE_DIGITS" ? "reverses the digits of every number"
      : operation.transform === "ADD_DIGIT_SUM" ? "adds each number's digit sum to that number"
      : operation.transform === "REVERSE_WORD" ? "reverses every word"
      : operation.transform === "SWAP_WORD_ENDS" ? "interchanges the first and last letters of every word"
      : operation.transform === "ROTATE_WORD_LEFT" ? "moves the first letter of every word to its end"
      : operation.transform === "REVERSE_ALPHANUMERIC" ? "reverses every alphanumeric group"
      : "moves the first character of every alphanumeric group to its end";
    return phrase;
  }
  if (operation.kind === "SORT_ALL") {
    const key = operation.selectionKey === "DIGIT_SUM" ? "digit sum" : operation.selectionKey === "LAST_DIGIT" ? "last digit"
      : operation.selectionKey === "VOWEL_COUNT" ? "vowel count" : operation.selectionKey === "WORD_LENGTH" ? "word length"
      : operation.selectionKey === "ALPHABETICAL" ? "alphabetical order" : "numeric value";
    return `arranges the row by ${key} in ${operation.direction === "ASC" ? "ascending" : "descending"} order`;
  }
  if (operation.kind === "PAIR_REWRITE") return "replaces each adjacent numeric pair by its sum followed by its absolute difference";
  if (operation.kind === "SWAP_ADJACENT_PAIRS") return "interchanges the two members of each adjacent pair";
  return "reverses the complete order";
}

export function explainAdvancedProgram(program: IopAdvancedProgram): string {
  return program.operations.map((operation, index) => `Stage ${index + 1} ${operationPhrase(operation)}`).join("; ") + ".";
}

function difficultyFor(checkpointId: IopAdvancedPrototypeAuthority["checkpointId"], steps: number): IopDifficulty {
  if (checkpointId === "IOP-CP-005") return steps >= 6 ? "Hard" : "Medium";
  if (checkpointId === "IOP-CP-006" || checkpointId === "IOP-CP-007") return "Medium";
  return "Hard";
}

function makeOption(display: string, fingerprint: string, isCorrect: boolean): IopOption {
  return { display, semanticFingerprint: fingerprint, isCorrect };
}

function optionSet(correct: IopOption, wrong: readonly IopOption[], seed: string): readonly [IopOption, IopOption, IopOption, IopOption] {
  const unique = new Map<string, IopOption>();
  unique.set(correct.semanticFingerprint, correct);
  for (const candidate of wrong) if (!unique.has(candidate.semanticFingerprint)) unique.set(candidate.semanticFingerprint, candidate);
  const choices = [...unique.values()];
  if (choices.length < 4) throw new Error("Advanced distractor pool has fewer than four semantic choices");
  const mixed = shuffle([correct, ...choices.filter((choice) => !choice.isCorrect).slice(0, 3)], makeRng(seed));
  return [mixed[0]!, mixed[1]!, mixed[2]!, mixed[3]!];
}

function rowOption(trace: IopAdvancedTrace, tokens: readonly IopAdvancedToken[], fingerprint: string, correct: boolean): IopOption {
  return makeOption(renderAdvancedRow(tokens, trace.layout), `ROW:${fingerprint}`, correct);
}

function allStates(trace: IopAdvancedTrace) {
  return [
    { number: 0, tokens: trace.input, fingerprint: advancedStateFingerprint(trace.input) },
    ...trace.steps.map((step) => ({ number: step.stepNumber, tokens: step.tokens, fingerprint: step.stateFingerprint })),
  ];
}

function stepOutputQuestion(trace: IopAdvancedTrace, seed: string, order: 1 | 2 | 3 | 4 = 1): IopAdvancedChildQuestion {
  const index = Math.min(2, trace.steps.length - 1);
  const step = trace.steps[index]!;
  const wrong = shuffle(allStates(trace).filter((state) => state.fingerprint !== step.stateFingerprint), makeRng(`${seed}|STEP-WRONG`))
    .map((state) => rowOption(trace, state.tokens, state.fingerprint, false));
  const options = optionSet(rowOption(trace, step.tokens, step.stateFingerprint, true), wrong, `${seed}|STEP-OPTIONS`);
  const answerIndex = options.findIndex((candidate) => candidate.isCorrect) as 0 | 1 | 2 | 3;
  return {
    questionOrder: order,
    kind: "STEP_OUTPUT",
    evidence: { kind: "STEP_OUTPUT", stepNumber: step.stepNumber },
    text: `Which of the following is Step ${step.stepNumber} for the new input?`,
    options, answerIndex,
    answerDisplay: renderAdvancedRow(step.tokens, trace.layout),
    explanation: `Apply the stages in the demonstrated order. Step ${step.stepNumber} is ${renderAdvancedRow(step.tokens, trace.layout)}.`,
  };
}

function elementQuestion(trace: IopAdvancedTrace, seed: string): IopAdvancedChildQuestion {
  const step = trace.steps[Math.min(1, trace.steps.length - 1)]!;
  const rng = makeRng(`${seed}|ELEMENT`);
  const position = 1 + Math.floor(rng() * step.tokens.length);
  const correct = step.tokens[position - 1]!;
  const wrong = shuffle(step.tokens.filter((token) => token.id !== correct.id), rng).slice(0, 3)
    .map((token) => makeOption(token.visibleValue, `TOKEN:${token.id}:${token.visibleValue}`, false));
  const options = optionSet(makeOption(correct.visibleValue, `TOKEN:${correct.id}:${correct.visibleValue}`, true), wrong, `${seed}|ELEMENT-OPTIONS`);
  const answerIndex = options.findIndex((candidate) => candidate.isCorrect) as 0 | 1 | 2 | 3;
  return {
    questionOrder: 2,
    kind: "ELEMENT_AT_POSITION",
    evidence: { kind: "ELEMENT_AT_POSITION", stepNumber: step.stepNumber, position },
    text: `Which element is at position ${position} from the left in Step ${step.stepNumber}?`,
    options, answerIndex, answerDisplay: correct.visibleValue,
    explanation: `Step ${step.stepNumber} is ${renderAdvancedRow(step.tokens, trace.layout)}. Position ${position} contains ${correct.visibleValue}.`,
  };
}

function stepNumberQuestion(trace: IopAdvancedTrace, seed: string, order: 1 | 2 | 3 | 4 = 3): IopAdvancedChildQuestion {
  const step = trace.steps[Math.min(2, trace.steps.length - 1)]!;
  const numbers = Array.from({ length: trace.steps.length }, (_, index) => index + 1).filter((value) => value !== step.stepNumber);
  const wrong = shuffle(numbers, makeRng(`${seed}|STEPNUM`)).slice(0, 3).map((value) => makeOption(`Step ${value}`, `STEP:${value}`, false));
  const options = optionSet(makeOption(`Step ${step.stepNumber}`, `STEP:${step.stepNumber}`, true), wrong, `${seed}|STEPNUM-OPTIONS`);
  const answerIndex = options.findIndex((candidate) => candidate.isCorrect) as 0 | 1 | 2 | 3;
  return {
    questionOrder: order,
    kind: "STEP_NUMBER",
    evidence: { kind: "STEP_NUMBER", stateFingerprint: step.stateFingerprint },
    text: `At which step does the arrangement ${renderAdvancedRow(step.tokens, trace.layout)} occur?`,
    options, answerIndex, answerDisplay: `Step ${step.stepNumber}`,
    explanation: `Tracing the machine shows that this exact state first appears at Step ${step.stepNumber}.`,
  };
}

function finalQuestion(trace: IopAdvancedTrace, seed: string): IopAdvancedChildQuestion {
  const wrong = shuffle(allStates(trace).filter((state) => state.fingerprint !== trace.finalFingerprint), makeRng(`${seed}|FINAL`))
    .map((state) => rowOption(trace, state.tokens, state.fingerprint, false));
  const options = optionSet(rowOption(trace, trace.final, trace.finalFingerprint, true), wrong, `${seed}|FINAL-OPTIONS`);
  const answerIndex = options.findIndex((candidate) => candidate.isCorrect) as 0 | 1 | 2 | 3;
  return {
    questionOrder: 4,
    kind: "FINAL_OUTPUT",
    evidence: { kind: "FINAL_OUTPUT" },
    text: "Which of the following is the final output of the machine?",
    options, answerIndex, answerDisplay: renderAdvancedRow(trace.final, trace.layout),
    explanation: `After all stages are completed, the final output is ${renderAdvancedRow(trace.final, trace.layout)}.`,
  };
}

function previousStepQuestion(trace: IopAdvancedTrace, seed: string): IopAdvancedChildQuestion {
  const stepNumber = Math.min(3, trace.steps.length);
  const previous = stepNumber === 1 ? { tokens: trace.input, fingerprint: advancedStateFingerprint(trace.input) } : trace.steps[stepNumber - 2]!;
  const wrong = shuffle(allStates(trace).filter((state) => state.fingerprint !== previous.fingerprint), makeRng(`${seed}|PREV`))
    .map((state) => rowOption(trace, state.tokens, state.fingerprint, false));
  const options = optionSet(rowOption(trace, previous.tokens, previous.fingerprint, true), wrong, `${seed}|PREV-OPTIONS`);
  const answerIndex = options.findIndex((candidate) => candidate.isCorrect) as 0 | 1 | 2 | 3;
  return {
    questionOrder: 1,
    kind: "PREVIOUS_STEP",
    evidence: { kind: "PREVIOUS_STEP", stepNumber },
    text: `The arrangement at Step ${stepNumber} is ${renderAdvancedRow(trace.steps[stepNumber - 1]!.tokens, trace.layout)}. Which arrangement occurred immediately before it?`,
    options, answerIndex, answerDisplay: renderAdvancedRow(previous.tokens, trace.layout),
    explanation: `The immediately preceding state is Step ${stepNumber - 1}, namely ${renderAdvancedRow(previous.tokens, trace.layout)}.`,
  };
}

function missingStepQuestion(trace: IopAdvancedTrace, seed: string): IopAdvancedChildQuestion {
  const stepNumber = Math.min(2, trace.steps.length - 1);
  const step = trace.steps[stepNumber - 1]!;
  const wrong = shuffle(allStates(trace).filter((state) => state.fingerprint !== step.stateFingerprint), makeRng(`${seed}|MISS`))
    .map((state) => rowOption(trace, state.tokens, state.fingerprint, false));
  const options = optionSet(rowOption(trace, step.tokens, step.stateFingerprint, true), wrong, `${seed}|MISS-OPTIONS`);
  const answerIndex = options.findIndex((candidate) => candidate.isCorrect) as 0 | 1 | 2 | 3;
  return {
    questionOrder: 2,
    kind: "MISSING_STEP",
    evidence: { kind: "MISSING_STEP", stepNumber },
    text: `If Step ${stepNumber} is omitted between the displayed neighbouring states, which arrangement correctly fills the gap?`,
    options, answerIndex, answerDisplay: renderAdvancedRow(step.tokens, trace.layout),
    explanation: `Applying the next machine stage gives Step ${stepNumber}: ${renderAdvancedRow(step.tokens, trace.layout)}.`,
  };
}

function remainingStepsQuestion(trace: IopAdvancedTrace, seed: string): IopAdvancedChildQuestion {
  const stepNumber = Math.min(2, trace.steps.length - 1);
  const correct = trace.steps.length - stepNumber;
  const candidates = [correct + 1, Math.max(0, correct - 1), correct + 2, Math.max(0, correct - 2), trace.steps.length]
    .filter((value, index, values) => value !== correct && values.indexOf(value) === index)
    .slice(0, 3);
  while (candidates.length < 3) {
    const value = correct + candidates.length + 3;
    if (!candidates.includes(value)) candidates.push(value);
  }
  const wrong = candidates.map((value) => makeOption(String(value), `COUNT:${value}`, false));
  const options = optionSet(makeOption(String(correct), `COUNT:${correct}`, true), wrong, `${seed}|REMAIN-OPTIONS`);
  const answerIndex = options.findIndex((candidate) => candidate.isCorrect) as 0 | 1 | 2 | 3;
  return {
    questionOrder: 3,
    kind: "REMAINING_STEP_COUNT",
    evidence: { kind: "REMAINING_STEP_COUNT", stepNumber },
    text: `How many further steps are required after Step ${stepNumber} to reach the final output?`,
    options, answerIndex, answerDisplay: String(correct),
    explanation: `The final output occurs at Step ${trace.steps.length}. After Step ${stepNumber}, ${correct} further steps remain.`,
  };
}

function childrenFor(authority: IopAdvancedPrototypeAuthority, trace: IopAdvancedTrace, seed: string): IopAdvancedCaselet["children"] {
  if (authority.checkpointId === "IOP-CP-010") {
    return [previousStepQuestion(trace, seed), missingStepQuestion(trace, seed), remainingStepsQuestion(trace, seed), stepNumberQuestion(trace, seed, 4)];
  }
  return [stepOutputQuestion(trace, seed), elementQuestion(trace, seed), stepNumberQuestion(trace, seed), finalQuestion(trace, seed)];
}

export function generateIopAdvancedCaselet(seed: string, prototypeId: IopAdvancedPrototypeId): IopAdvancedCaselet {
  const authority = IOP_ADVANCED_PROTOTYPES.find((candidate) => candidate.prototypeId === prototypeId);
  if (!authority) throw new Error(`Unknown advanced IOP prototype ${prototypeId}`);
  const demonstrationResult = safeTrace(authority, `${seed}|DEMO`, true);
  const targetResult = safeTrace(authority, `${seed}|TARGET`, false);
  const identifiability = demonstrationResult.identifiability;
  if (!identifiability?.passed) throw new Error(`Advanced IOP demonstration is ambiguous for ${prototypeId}/${seed}`);
  assertAdvancedOracleParity(demonstrationResult.trace, reconstructAdvancedTraceOracle(authority.program, demonstrationResult.trace.input));
  assertAdvancedOracleParity(targetResult.trace, reconstructAdvancedTraceOracle(authority.program, targetResult.trace.input));

  const layoutWord = authority.program.layout === "BOX_ROW" ? "box" : authority.program.layout === "TABLE_2XN" ? "table" : "input-output";
  const caselet: IopAdvancedCaselet = {
    caseletId: `IOP-001-${prototypeId}-${hashSeed(seed).toString(16).padStart(8, "0")}`,
    packageId: "IOP-001",
    chapterId: "REAS-INP",
    checkpointId: authority.checkpointId,
    prototypeId,
    seed,
    locale: "en-IN",
    difficulty: difficultyFor(authority.checkpointId, targetResult.trace.steps.length),
    directions: `A ${layoutWord} machine changes an input by a fixed rule in successive steps. Study the illustration and apply exactly the same rule to the new input.`,
    demonstration: demonstrationResult.trace,
    target: targetResult.trace,
    ruleExplanation: explainAdvancedProgram(authority.program),
    identifiability,
    oracleParity: true,
    children: childrenFor(authority, targetResult.trace, seed),
    lifecycle: IOP_001_LIFECYCLE,
  };
  assertIopAdvancedCaseletIntegrity(caselet);
  return caselet;
}

export function assertIopAdvancedCaseletIntegrity(caselet: IopAdvancedCaselet): void {
  if (!caselet.identifiability.passed || caselet.identifiability.matchingProgramFingerprints.length !== 1) throw new Error("Advanced rule identifiability failed");
  if (caselet.identifiability.matchingProgramFingerprints[0] !== caselet.identifiability.intendedProgramFingerprint) throw new Error("Wrong advanced rule survived ambiguity audit");
  if (caselet.demonstration.programFingerprint !== caselet.target.programFingerprint) throw new Error("Demonstration/target program drift");
  if (caselet.demonstration.programFingerprint !== caselet.identifiability.intendedProgramFingerprint) throw new Error("Advanced fingerprint drift");
  for (const trace of [caselet.demonstration, caselet.target]) {
    if (trace.steps.length < 4) throw new Error("Advanced trace is too shallow");
    const inputIds = trace.input.map((token) => token.id).sort().join("|");
    const originalById = new Map(trace.input.map((token) => [token.id, token.originalValue]));
    for (const step of trace.steps) {
      if (step.actions.length === 0) throw new Error("Advanced step has no provenance");
      if (step.tokens.map((token) => token.id).sort().join("|") !== inputIds) throw new Error("Advanced token conservation failed");
      for (const token of step.tokens) if (token.originalValue !== originalById.get(token.id)) throw new Error("Original token provenance changed");
    }
    const states = [advancedStateFingerprint(trace.input), ...trace.steps.map((step) => step.stateFingerprint)];
    if (new Set(states).size !== states.length) throw new Error("Advanced trace contains duplicate states");
  }
  for (const child of caselet.children) {
    if (child.options.length !== 4 || new Set(child.options.map((candidate) => candidate.semanticFingerprint)).size !== 4) throw new Error("Advanced option uniqueness failed");
    if (child.options.filter((candidate) => candidate.isCorrect).length !== 1) throw new Error("Advanced child must have one correct option");
    if (!child.options[child.answerIndex]?.isCorrect || child.options[child.answerIndex]?.display !== child.answerDisplay) throw new Error("Advanced answer-index mismatch");
    if (recomputeAdvancedQueryAnswer(caselet.target, child.evidence) !== child.answerDisplay) throw new Error(`Advanced query oracle mismatch for ${child.kind}`);
  }
  if (caselet.lifecycle.permanentQlCount !== 0 || caselet.lifecycle.questionStudioDiscoverable || caselet.lifecycle.questionBankWritable || caselet.lifecycle.testEligible || caselet.lifecycle.publiclyPublishable) {
    throw new Error("Advanced discovery leaked into delivery lifecycle");
  }
}

export function getIopAdvancedAuthority(prototypeId: IopAdvancedPrototypeId): IopAdvancedPrototypeAuthority {
  const authority = IOP_ADVANCED_PROTOTYPES.find((candidate) => candidate.prototypeId === prototypeId);
  if (!authority) throw new Error(`Unknown advanced IOP prototype ${prototypeId}`);
  return authority;
}

export function getIopAdvancedProgramFingerprint(prototypeId: IopAdvancedPrototypeId): string {
  return advancedProgramFingerprint(getIopAdvancedAuthority(prototypeId).program);
}
