import { executeMachine, renderTokenRow, ruleFingerprint, tokenStateFingerprint } from "./engine.ts";
import { evaluateRuleIdentifiability } from "./identifiability.ts";
import { IOP_001_LIFECYCLE } from "./lifecycle.ts";
import { assertOracleParity, reconstructTraceOracle } from "./oracle.ts";
import { IOP_FOUNDATION_PROTOTYPES } from "./prototypes.ts";
import type {
  IopCaselet,
  IopChildQuestion,
  IopDifficulty,
  IopMachineRule,
  IopMachineTrace,
  IopMisconceptionId,
  IopOption,
  IopPrototypeAuthority,
  IopPrototypeId,
  IopToken,
} from "./types.ts";

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

function pickDistinct<T>(pool: readonly T[], count: number, rng: () => number): T[] {
  if (count > pool.length) throw new Error(`Cannot select ${count} values from pool of ${pool.length}`);
  const copy = [...pool];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const other = Math.floor(rng() * (index + 1));
    [copy[index], copy[other]] = [copy[other]!, copy[index]!];
  }
  return copy.slice(0, count);
}

function shuffle<T>(values: readonly T[], rng: () => number): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(rng() * (index + 1));
    [result[index], result[other]] = [result[other]!, result[index]!];
  }
  return result;
}

function createInput(authority: IopPrototypeAuthority, seed: string): readonly IopToken[] {
  const rng = makeRng(seed);
  const words = pickDistinct(WORD_POOL, authority.wordCount, rng).map((value, index) => ({
    id: `W${index + 1}`,
    kind: "WORD" as const,
    visibleValue: value,
    originalPosition: -1,
  }));
  const numbers = pickDistinct(NUMBER_POOL, authority.numberCount, rng).map((value, index) => ({
    id: `N${index + 1}`,
    kind: "NUMBER" as const,
    visibleValue: String(value),
    originalPosition: -1,
  }));
  return shuffle([...words, ...numbers], rng).map((token, originalPosition) => ({ ...token, originalPosition }));
}

function generateTrace(
  authority: IopPrototypeAuthority,
  seed: string,
  requireIdentifiable: boolean,
): { readonly trace: IopMachineTrace; readonly identifiability?: ReturnType<typeof evaluateRuleIdentifiability> } {
  for (let attempt = 0; attempt < 160; attempt += 1) {
    const input = createInput(authority, `${seed}|${attempt}`);
    const trace = executeMachine(authority.rule, input);
    if (trace.steps.length < 4) continue;
    if (trace.steps.some((step) => step.actions.length === 0)) continue;
    const oracle = reconstructTraceOracle(authority.rule, input);
    try {
      assertOracleParity(trace, oracle);
    } catch {
      continue;
    }
    if (!requireIdentifiable) return { trace };
    const identifiability = evaluateRuleIdentifiability(authority.rule, trace);
    if (identifiability.passed) return { trace, identifiability };
  }
  throw new Error(`Unable to produce a safe ${requireIdentifiable ? "identifiable " : ""}trace for ${authority.prototypeId}/${seed}`);
}

function phasePhrase(rule: IopMachineRule, phaseIndex: number): string {
  const phase = rule.phases[phaseIndex]!;
  const selected = phase.eligibleKind === "NUMBER"
    ? `${phase.direction === "ASC" ? "smallest" : "largest"} remaining number`
    : `${phase.direction === "ASC" ? "alphabetically first" : "alphabetically last"} remaining word`;
  const placement = phase.placement === "LEFT_FIXED" ? "leftmost open position" : "rightmost open position";
  return `the ${selected} is placed in the ${placement}`;
}

export function explainMachineRule(rule: IopMachineRule): string {
  if (rule.schedule === "SINGLE_PHASE") return `In each step, ${phasePhrase(rule, 0)}.`;
  if (rule.schedule === "BLOCKED_PHASES") {
    return `First, ${phasePhrase(rule, 0)} in successive steps until that category is arranged. Then ${phasePhrase(rule, 1)} in successive steps.`;
  }
  if (rule.schedule === "SIMULTANEOUS_PHASES") {
    return `In each step, two placements are made together: ${phasePhrase(rule, 0)}, and ${phasePhrase(rule, 1)}.`;
  }
  return `The machine alternates between two actions: first ${phasePhrase(rule, 0)}; in the next step ${phasePhrase(rule, 1)}; the same cycle then repeats.`;
}

function difficultyFor(authority: IopPrototypeAuthority, target: IopMachineTrace): IopDifficulty {
  if (authority.checkpointId === "IOP-CP-001") return target.steps.length >= 6 ? "Medium" : "Easy";
  if (authority.checkpointId === "IOP-CP-002") return "Medium";
  if (authority.checkpointId === "IOP-CP-003") return target.steps.length >= 4 ? "Medium" : "Easy";
  return "Hard";
}

function option(display: string, fingerprint: string, isCorrect: boolean, misconceptionId?: IopMisconceptionId): IopOption {
  return { display, semanticFingerprint: fingerprint, isCorrect, ...(misconceptionId ? { misconceptionId } : {}) };
}

function shuffledOptions(options: readonly IopOption[], seed: string): readonly [IopOption, IopOption, IopOption, IopOption] {
  if (options.length !== 4) throw new Error("Exactly four options are required");
  if (new Set(options.map((candidate) => candidate.semanticFingerprint)).size !== 4) throw new Error("Semantic option collision");
  const mixed = shuffle(options, makeRng(seed));
  return [mixed[0]!, mixed[1]!, mixed[2]!, mixed[3]!];
}

function makeStepOutputQuestion(trace: IopMachineTrace, seed: string): IopChildQuestion {
  const targetIndex = Math.min(2, trace.steps.length - 2);
  const target = trace.steps[targetIndex]!;
  const states = [
    { tokens: target.tokens, fingerprint: target.stateFingerprint, correct: true, mc: undefined },
    { tokens: targetIndex === 0 ? trace.input : trace.steps[targetIndex - 1]!.tokens, fingerprint: targetIndex === 0 ? tokenStateFingerprint(trace.input) : trace.steps[targetIndex - 1]!.stateFingerprint, correct: false, mc: "IOP-MC-PREVIOUS_STEP" as const },
    { tokens: trace.steps[targetIndex + 1]!.tokens, fingerprint: trace.steps[targetIndex + 1]!.stateFingerprint, correct: false, mc: "IOP-MC-NEXT_STEP" as const },
    { tokens: trace.input, fingerprint: tokenStateFingerprint(trace.input), correct: false, mc: "IOP-MC-INPUT_AS_STEP" as const },
  ];
  const unique = new Map(states.map((state) => [state.fingerprint, state]));
  if (unique.size < 4) throw new Error("Step-output distractors collided");
  const options = shuffledOptions([...unique.values()].slice(0, 4).map((state) => option(renderTokenRow(state.tokens), `ROW:${state.fingerprint}`, state.correct, state.mc)), `${seed}|Q1`);
  const answerIndex = options.findIndex((candidate) => candidate.isCorrect) as 0 | 1 | 2 | 3;
  return {
    questionOrder: 1,
    kind: "STEP_OUTPUT",
    evidence: { kind: "STEP_OUTPUT", stepNumber: target.stepNumber },
    text: `Which of the following is Step ${target.stepNumber} for the new input?`,
    options,
    answerIndex,
    answerDisplay: renderTokenRow(target.tokens),
    explanation: `Apply the machine rule step by step. Step ${target.stepNumber} is ${renderTokenRow(target.tokens)}.`,
  };
}

function makeElementAtPositionQuestion(trace: IopMachineTrace, seed: string): IopChildQuestion {
  const step = trace.steps[Math.min(1, trace.steps.length - 1)]!;
  const rng = makeRng(`${seed}|Q2-POS`);
  const position = 1 + Math.floor(rng() * step.tokens.length);
  const correctToken = step.tokens[position - 1]!;
  const wrong = shuffle(step.tokens.filter((token) => token.id !== correctToken.id), rng).slice(0, 3);
  const options = shuffledOptions([
    option(correctToken.visibleValue, `TOKEN:${correctToken.id}`, true),
    ...wrong.map((token) => option(token.visibleValue, `TOKEN:${token.id}`, false, "IOP-MC-WRONG_ELEMENT")),
  ], `${seed}|Q2`);
  const answerIndex = options.findIndex((candidate) => candidate.isCorrect) as 0 | 1 | 2 | 3;
  return {
    questionOrder: 2,
    kind: "ELEMENT_AT_POSITION",
    evidence: { kind: "ELEMENT_AT_POSITION", stepNumber: step.stepNumber, position },
    text: `Which element is ${ordinal(position)} from the left in Step ${step.stepNumber}?`,
    options,
    answerIndex,
    answerDisplay: correctToken.visibleValue,
    explanation: `Step ${step.stepNumber} is ${renderTokenRow(step.tokens)}. Counting from the left, position ${position} contains ${correctToken.visibleValue}.`,
  };
}

function makePositionOfElementQuestion(trace: IopMachineTrace, seed: string): IopChildQuestion {
  const step = trace.steps[Math.min(2, trace.steps.length - 1)]!;
  const rng = makeRng(`${seed}|Q3-TOKEN`);
  const position = 1 + Math.floor(rng() * step.tokens.length);
  const token = step.tokens[position - 1]!;
  const positions = shuffle(Array.from({ length: step.tokens.length }, (_, index) => index + 1).filter((value) => value !== position), rng).slice(0, 3);
  const options = shuffledOptions([
    option(String(position), `POS:${position}`, true),
    ...positions.map((value) => option(String(value), `POS:${value}`, false, "IOP-MC-WRONG_POSITION")),
  ], `${seed}|Q3`);
  const answerIndex = options.findIndex((candidate) => candidate.isCorrect) as 0 | 1 | 2 | 3;
  return {
    questionOrder: 3,
    kind: "POSITION_OF_ELEMENT",
    evidence: { kind: "POSITION_OF_ELEMENT", stepNumber: step.stepNumber, tokenId: token.id },
    text: `What is the position of ${token.visibleValue} from the left in Step ${step.stepNumber}?`,
    options,
    answerIndex,
    answerDisplay: String(position),
    explanation: `Step ${step.stepNumber} is ${renderTokenRow(step.tokens)}. ${token.visibleValue} is at position ${position} from the left.`,
  };
}

function makeFinalOutputQuestion(trace: IopMachineTrace, seed: string): IopChildQuestion {
  const finalFingerprint = trace.finalFingerprint;
  const candidates = [
    { tokens: trace.final, fp: finalFingerprint, correct: true },
    { tokens: trace.input, fp: tokenStateFingerprint(trace.input), correct: false },
    ...trace.steps.slice(0, -1).map((step) => ({ tokens: step.tokens, fp: step.stateFingerprint, correct: false })),
  ];
  const unique = [...new Map(candidates.map((candidate) => [candidate.fp, candidate])).values()];
  if (unique.length < 4) throw new Error("Final-output distractor pool too small");
  const distractors = shuffle(unique.filter((candidate) => !candidate.correct), makeRng(`${seed}|Q4-POOL`)).slice(0, 3);
  const options = shuffledOptions([
    option(renderTokenRow(trace.final), `ROW:${finalFingerprint}`, true),
    ...distractors.map((candidate) => option(renderTokenRow(candidate.tokens), `ROW:${candidate.fp}`, false, "IOP-MC-WRONG_FINAL_STATE")),
  ], `${seed}|Q4`);
  const answerIndex = options.findIndex((candidate) => candidate.isCorrect) as 0 | 1 | 2 | 3;
  return {
    questionOrder: 4,
    kind: "FINAL_OUTPUT",
    evidence: { kind: "FINAL_OUTPUT" },
    text: "Which of the following is the final arrangement for the new input?",
    options,
    answerIndex,
    answerDisplay: renderTokenRow(trace.final),
    explanation: `Continue the same rule until no further placement is required. The final arrangement is ${renderTokenRow(trace.final)}.`,
  };
}

function ordinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function childrenFor(trace: IopMachineTrace, seed: string): IopCaselet["children"] {
  return [
    makeStepOutputQuestion(trace, seed),
    makeElementAtPositionQuestion(trace, seed),
    makePositionOfElementQuestion(trace, seed),
    makeFinalOutputQuestion(trace, seed),
  ];
}

export function generateIopFoundationCaselet(seed: string, prototypeId: IopPrototypeId): IopCaselet {
  const authority = IOP_FOUNDATION_PROTOTYPES.find((candidate) => candidate.prototypeId === prototypeId);
  if (!authority) throw new Error(`Unknown IOP prototype ${prototypeId}`);

  const demonstrationResult = generateTrace(authority, `${seed}|DEMO`, true);
  const targetResult = generateTrace(authority, `${seed}|TARGET`, false);
  const identifiability = demonstrationResult.identifiability;
  if (!identifiability?.passed) throw new Error(`Demonstration rule is ambiguous for ${prototypeId}/${seed}`);

  const demonstrationOracle = reconstructTraceOracle(authority.rule, demonstrationResult.trace.input);
  const targetOracle = reconstructTraceOracle(authority.rule, targetResult.trace.input);
  assertOracleParity(demonstrationResult.trace, demonstrationOracle);
  assertOracleParity(targetResult.trace, targetOracle);

  return {
    caseletId: `IOP-001-${prototypeId}-${hashSeed(seed).toString(16).padStart(8, "0")}`,
    packageId: "IOP-001",
    chapterId: "REAS-INP",
    checkpointId: authority.checkpointId,
    prototypeId,
    seed,
    locale: "en-IN",
    difficulty: difficultyFor(authority, targetResult.trace),
    directions: "A word and number arrangement machine rearranges an input by a particular rule in each step. Study the illustration and apply the same rule to the new input.",
    demonstration: demonstrationResult.trace,
    target: targetResult.trace,
    ruleExplanation: explainMachineRule(authority.rule),
    identifiability,
    oracleParity: true,
    children: childrenFor(targetResult.trace, seed),
    lifecycle: IOP_001_LIFECYCLE,
  };
}

export function assertIopFoundationCaseletIntegrity(caselet: IopCaselet): void {
  if (!caselet.identifiability.passed || caselet.identifiability.matchingRuleFingerprints.length !== 1) throw new Error("Rule identifiability failed");
  if (caselet.identifiability.matchingRuleFingerprints[0] !== caselet.identifiability.intendedRuleFingerprint) throw new Error("Wrong rule won identifiability audit");
  if (!caselet.oracleParity) throw new Error("Oracle parity missing");
  if (caselet.demonstration.ruleFingerprint !== caselet.target.ruleFingerprint) throw new Error("Demonstration and target use different machine rules");
  if (caselet.demonstration.ruleFingerprint !== caselet.identifiability.intendedRuleFingerprint) throw new Error("Rule fingerprint drift");
  for (const trace of [caselet.demonstration, caselet.target]) {
    const inputIds = [...trace.input.map((token) => token.id)].sort();
    for (const step of trace.steps) {
      const stepIds = [...step.tokens.map((token) => token.id)].sort();
      if (stepIds.join("|") !== inputIds.join("|")) throw new Error("Token conservation failed");
      if (step.actions.length === 0) throw new Error("Empty visible machine step");
    }
    const fingerprints = [tokenStateFingerprint(trace.input), ...trace.steps.map((step) => step.stateFingerprint)];
    if (new Set(fingerprints).size !== fingerprints.length) throw new Error("Duplicate trace state");
    if (trace.steps.length < 4) throw new Error("Trace too shallow for foundation caselet");
  }
  if (caselet.children.length !== 4) throw new Error("Foundation caselet must have four child questions");
  for (const child of caselet.children) {
    if (child.options.length !== 4) throw new Error("Child question must have four options");
    if (new Set(child.options.map((candidate) => candidate.semanticFingerprint)).size !== 4) throw new Error("Duplicate semantic option");
    if (child.options.filter((candidate) => candidate.isCorrect).length !== 1) throw new Error("Question must have exactly one correct option");
    if (!child.options[child.answerIndex]?.isCorrect) throw new Error("Answer index mismatch");
    if (child.options[child.answerIndex]?.display !== child.answerDisplay) throw new Error("Answer display mismatch");
  }
  if (caselet.lifecycle.permanentQlCount !== 0 || caselet.lifecycle.questionStudioDiscoverable || caselet.lifecycle.questionBankWritable || caselet.lifecycle.testEligible || caselet.lifecycle.publiclyPublishable) {
    throw new Error("Discovery lifecycle leaked into delivery");
  }
}

export function getIopFoundationAuthority(prototypeId: IopPrototypeId): IopPrototypeAuthority {
  const authority = IOP_FOUNDATION_PROTOTYPES.find((candidate) => candidate.prototypeId === prototypeId);
  if (!authority) throw new Error(`Unknown IOP prototype ${prototypeId}`);
  return authority;
}

export function getIopRuleFingerprint(prototypeId: IopPrototypeId): string {
  return ruleFingerprint(getIopFoundationAuthority(prototypeId).rule);
}
