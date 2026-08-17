import { IOP_ENGLISH_SOURCE_MODES } from "./english-production.ts";
import type { IopPermanentSolveMode } from "./permanent-authorities.ts";
import type {
  IopEnglishChildQuestion,
  IopEnglishOption,
  IopEnglishProductionCaselet,
  IopEnglishQueryEvidence,
  IopEnglishTrace,
} from "./english-production-types.ts";

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

function ordinal(value: number): string {
  if (value % 100 >= 11 && value % 100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function rowFingerprint(row: readonly string[]): string {
  return row.join("\u241f");
}

function renderRow(row: readonly string[]): string {
  return row.join("  ");
}

function option(display: string, semanticFingerprint: string, isCorrect: boolean, misconception: string): IopEnglishOption {
  return { display, semanticFingerprint, isCorrect, misconception };
}

function optionTuple(values: readonly IopEnglishOption[]): IopEnglishChildQuestion["options"] {
  if (values.length !== 4) throw new Error("Balanced IOP query needs exactly four options");
  return [values[0]!, values[1]!, values[2]!, values[3]!];
}

function finaliseOptions(correct: IopEnglishOption, wrong: readonly IopEnglishOption[], seed: string): IopEnglishChildQuestion["options"] {
  const unique = new Map<string, IopEnglishOption>([[correct.semanticFingerprint, correct]]);
  for (const candidate of wrong) {
    if (candidate.semanticFingerprint !== correct.semanticFingerprint && !unique.has(candidate.semanticFingerprint)) {
      unique.set(candidate.semanticFingerprint, candidate);
    }
  }
  const distractors = [...unique.values()].filter((entry) => !entry.isCorrect);
  if (distractors.length < 3) throw new Error(`Insufficient balanced distractors for ${seed}`);
  return optionTuple(shuffle([correct, ...distractors.slice(0, 3)], makeRng(seed)));
}

function sameShapeRows(trace: IopEnglishTrace, correct: readonly string[]): readonly (readonly string[])[] {
  return [trace.input, ...trace.steps].filter((row) => row.length === correct.length && rowFingerprint(row) !== rowFingerprint(correct));
}

function mutateRow(row: readonly string[]): readonly (readonly string[])[] {
  if (row.length === 1) {
    const value = Number(row[0]);
    if (!Number.isFinite(value)) return [];
    const decimals = row[0]!.includes(".") ? 2 : 0;
    return [0.1, 0.5, 1, -0.5].map((delta) => [(value + delta).toFixed(decimals)]);
  }

  if (row.length === 2) {
    const first = Number(row[0]);
    const second = Number(row[1]);
    if (Number.isFinite(first) && Number.isFinite(second)) {
      const firstDecimals = row[0]!.includes(".") ? 2 : 0;
      const secondDecimals = row[1]!.includes(".") ? 2 : 0;
      return [
        [row[1]!, row[0]!],
        [(first + 0.1).toFixed(firstDecimals), row[1]!],
        [row[0]!, (second + 0.1).toFixed(secondDecimals)],
        [(first - 0.1).toFixed(firstDecimals), row[1]!],
      ];
    }
  }

  const result: string[][] = [];
  result.push([...row].reverse());
  result.push([...row.slice(1), row[0]!]);
  const adjacent = [...row];
  [adjacent[0], adjacent[1]] = [adjacent[1]!, adjacent[0]!];
  result.push(adjacent);
  const ends = [...row];
  [ends[0], ends[ends.length - 1]] = [ends[ends.length - 1]!, ends[0]!];
  result.push(ends);
  return result;
}

function rowOptions(trace: IopEnglishTrace, correct: readonly string[], seed: string): IopEnglishChildQuestion["options"] {
  const correctFp = rowFingerprint(correct);
  const sameShape = sameShapeRows(trace, correct);
  const wrong = [...sameShape, ...mutateRow(correct)].map((row) => option(
    renderRow(row),
    `ROW:${rowFingerprint(row)}`,
    false,
    sameShape.some((state) => rowFingerprint(state) === rowFingerprint(row)) ? "wrong-machine-state" : "local-state-mutation",
  ));
  return finaliseOptions(option(renderRow(correct), `ROW:${correctFp}`, true, "correct"), wrong, seed);
}

function numberOptions(correct: number, minimum: number, maximum: number, render: (value: number) => string, prefix: string, seed: string): IopEnglishChildQuestion["options"] {
  const candidates = Array.from({ length: maximum - minimum + 1 }, (_, index) => minimum + index).filter((value) => value !== correct);
  const wrong = shuffle(candidates, makeRng(`${seed}|CANDIDATES`)).map((value) => option(render(value), `${prefix}:${value}`, false, "off-by-one"));
  return finaliseOptions(option(render(correct), `${prefix}:${correct}`, true, "correct"), wrong, seed);
}

function child(
  questionOrder: 1 | 2 | 3 | 4,
  kind: IopPermanentSolveMode,
  evidence: IopEnglishQueryEvidence,
  text: string,
  options: IopEnglishChildQuestion["options"],
  answerDisplay: string,
  explanation: string,
): IopEnglishChildQuestion {
  const answerIndex = options.findIndex((entry) => entry.isCorrect) as 0 | 1 | 2 | 3;
  if (answerIndex < 0 || options[answerIndex]?.display !== answerDisplay) throw new Error(`Balanced ${kind} answer/index mismatch`);
  return { questionOrder, kind, evidence, text, options, answerIndex, answerDisplay, explanation };
}

function eligibleElementStep(trace: IopEnglishTrace, seed: string): { readonly row: readonly string[]; readonly stepNumber: number } {
  const eligible = trace.steps
    .map((row, index) => ({ row, stepNumber: index + 1 }))
    .filter(({ row }) => row.length >= 4 && new Set(row).size === row.length);
  if (eligible.length === 0) throw new Error("Balanced IOP query has no element-capable step");
  return eligible[hashSeed(seed) % eligible.length]!;
}

function makeQuestion(
  caselet: IopEnglishProductionCaselet,
  kind: IopPermanentSolveMode,
  questionOrder: 1 | 2 | 3 | 4,
  seed: string,
): IopEnglishChildQuestion {
  const trace = caselet.target;
  const rng = makeRng(`${seed}|${kind}`);

  if (kind === "FINAL_OUTPUT") {
    const correct = trace.steps.at(-1)!;
    const answer = renderRow(correct);
    return child(questionOrder, kind, { kind }, "Which of the following is the final output for the new input?", rowOptions(trace, correct, `${seed}|OPTIONS`), answer, `The machine finishes at ${answer}.`);
  }

  if (kind === "STEP_OUTPUT") {
    const stepNumber = 1 + Math.floor(rng() * trace.steps.length);
    const correct = trace.steps[stepNumber - 1]!;
    const answer = renderRow(correct);
    const stageWord = caselet.sourceModeId.includes("TEXT_RBI") || caselet.sourceModeId.startsWith("QL008_") ? "stage" : "step";
    return child(questionOrder, kind, { kind, stepNumber }, `Which of the following is Step ${stepNumber} for the new input?`, rowOptions(trace, correct, `${seed}|OPTIONS`), answer, `After ${stageWord} ${stepNumber}, the arrangement is ${answer}.`);
  }

  if (kind === "ELEMENT_AT_POSITION") {
    const selected = eligibleElementStep(trace, `${seed}|STEP`);
    const position = 1 + Math.floor(rng() * selected.row.length);
    const answer = selected.row[position - 1]!;
    const wrong = shuffle(selected.row.filter((value) => value !== answer), makeRng(`${seed}|WRONG`)).map((value) => option(value, `ELEMENT:${value}`, false, "nearby-element"));
    return child(questionOrder, kind, { kind, stepNumber: selected.stepNumber, position }, `Which element is at the ${ordinal(position)} position from the left in Step ${selected.stepNumber}?`, finaliseOptions(option(answer, `ELEMENT:${answer}`, true, "correct"), wrong, `${seed}|OPTIONS`), answer, `In Step ${selected.stepNumber}, the ${ordinal(position)} element from the left is ${answer}.`);
  }

  if (kind === "POSITION_OF_ELEMENT") {
    const selected = eligibleElementStep(trace, `${seed}|STEP`);
    const position = 1 + Math.floor(rng() * selected.row.length);
    const element = selected.row[position - 1]!;
    const answer = `${ordinal(position)} from the left`;
    return child(questionOrder, kind, { kind, stepNumber: selected.stepNumber, element }, `What is the position of ${element} from the left in Step ${selected.stepNumber}?`, numberOptions(position, 1, selected.row.length, (value) => `${ordinal(value)} from the left`, "POSITION", `${seed}|OPTIONS`), answer, `In Step ${selected.stepNumber}, ${element} is ${answer}.`);
  }

  if (kind === "STEP_NUMBER") {
    const stepNumber = 1 + Math.floor(rng() * trace.steps.length);
    const state = trace.steps[stepNumber - 1]!;
    const answer = `Step ${stepNumber}`;
    return child(questionOrder, kind, { kind, stateFingerprint: rowFingerprint(state) }, `At which step does the arrangement ${renderRow(state)} occur?`, numberOptions(stepNumber, 1, trace.steps.length, (value) => `Step ${value}`, "STEP", `${seed}|OPTIONS`), answer, `Tracing the new input shows this arrangement first appears at ${answer}.`);
  }

  if (kind === "PREVIOUS_STEP") {
    if (trace.steps.length < 2) throw new Error("Balanced previous-step query needs at least two steps");
    const currentStepNumber = 2 + Math.floor(rng() * (trace.steps.length - 1));
    const current = trace.steps[currentStepNumber - 1]!;
    const previous = trace.steps[currentStepNumber - 2]!;
    const answer = renderRow(previous);
    return child(questionOrder, kind, { kind, currentStepNumber }, `The machine is at ${renderRow(current)} in Step ${currentStepNumber}. Which of the following was Step ${currentStepNumber - 1}?`, rowOptions(trace, previous, `${seed}|OPTIONS`), answer, `One stage earlier, the arrangement was ${answer}.`);
  }

  if (kind === "MISSING_STEP") {
    if (trace.steps.length < 3) throw new Error("Balanced missing-step query needs at least three steps");
    const missingStepNumber = 2 + Math.floor(rng() * (trace.steps.length - 2));
    const before = trace.steps[missingStepNumber - 2]!;
    const missing = trace.steps[missingStepNumber - 1]!;
    const after = trace.steps[missingStepNumber]!;
    const answer = renderRow(missing);
    return child(questionOrder, kind, { kind, missingStepNumber }, `Step ${missingStepNumber - 1} is ${renderRow(before)} and Step ${missingStepNumber + 1} is ${renderRow(after)}. Which arrangement is the missing Step ${missingStepNumber}?`, rowOptions(trace, missing, `${seed}|OPTIONS`), answer, `Applying the next machine stage to Step ${missingStepNumber - 1} gives ${answer}, which then leads to the printed following state.`);
  }

  const stepNumber = 1 + Math.floor(rng() * (trace.steps.length - 1));
  const remaining = trace.steps.length - stepNumber;
  const answer = remaining === 1 ? "1 step" : `${remaining} steps`;
  return child(questionOrder, kind, { kind, stepNumber }, `After Step ${stepNumber}, how many more steps are required to reach the final output?`, numberOptions(remaining, 0, trace.steps.length - 1, (value) => value === 1 ? "1 step" : `${value} steps`, "COUNT", `${seed}|OPTIONS`), answer, `The final state is Step ${trace.steps.length}. After Step ${stepNumber}, ${answer} remain.`);
}

function reviewPairIndex(seed: string): 0 | 1 | null {
  const match = /-(00|01)$/.exec(seed);
  if (!match) return null;
  return match[1] === "00" ? 0 : 1;
}

function queryPlan(caselet: IopEnglishProductionCaselet, seed: string): readonly [IopPermanentSolveMode, IopPermanentSolveMode, IopPermanentSolveMode, IopPermanentSolveMode] {
  const mode = IOP_ENGLISH_SOURCE_MODES.find((candidate) => candidate.sourceModeId === caselet.sourceModeId);
  if (!mode) throw new Error(`No source mode found for ${caselet.sourceModeId}`);
  const supported = mode.supportedSolveModes;
  const pair = reviewPairIndex(seed);

  if (supported.length === 8) {
    const first = ["STEP_OUTPUT", "FINAL_OUTPUT", "ELEMENT_AT_POSITION", "POSITION_OF_ELEMENT"] as const;
    const second = ["STEP_NUMBER", "PREVIOUS_STEP", "MISSING_STEP", "REMAINING_STEP_COUNT"] as const;
    if (pair !== null) return pair === 0 ? first : second;
    return (hashSeed(`${seed}|QUERY-PAIR`) & 1) === 0 ? first : second;
  }

  // QL008 does not own element/position queries. Across its two human-review
  // examples, cover all six supported solve modes and repeat the two most
  // common learner-facing outputs rather than padding with unsupported forms.
  const boxFirst = ["STEP_OUTPUT", "FINAL_OUTPUT", "STEP_NUMBER", "PREVIOUS_STEP"] as const;
  const boxSecond = ["MISSING_STEP", "REMAINING_STEP_COUNT", "STEP_OUTPUT", "FINAL_OUTPUT"] as const;
  if (pair !== null) return pair === 0 ? boxFirst : boxSecond;
  return (hashSeed(`${seed}|QUERY-PAIR`) & 1) === 0 ? boxFirst : boxSecond;
}

export function withBalancedIopEnglishQueries(caselet: IopEnglishProductionCaselet, seed: string): IopEnglishProductionCaselet {
  const plan = queryPlan(caselet, seed);
  const children = plan.map((kind, index) => makeQuestion(caselet, kind, (index + 1) as 1 | 2 | 3 | 4, `${seed}|BALANCED-Q${index + 1}`)) as unknown as IopEnglishProductionCaselet["children"];
  return { ...caselet, children };
}
