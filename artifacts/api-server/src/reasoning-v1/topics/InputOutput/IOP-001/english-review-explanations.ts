import type { IopEnglishChildQuestion, IopEnglishProductionCaselet, IopEnglishTrace } from "./english-production-types.ts";

function renderRow(row: readonly string[]): string {
  return row.join("  ");
}

function traceLines(trace: IopEnglishTrace, throughStep: number): string {
  const end = Math.min(Math.max(throughStep, 0), trace.steps.length);
  const lines = [`Input: ${renderRow(trace.input)}`];
  for (let index = 0; index < end; index += 1) {
    lines.push(`Step ${index + 1}: ${renderRow(trace.steps[index]!)}`);
  }
  return lines.join("\n");
}

function ruleParagraph(caselet: IopEnglishProductionCaselet): string {
  return `From the worked illustration, the machine rule is: ${caselet.ruleExplanation}`;
}

function finalAnswer(answerDisplay: string): string {
  return `Therefore, the correct answer is ${answerDisplay}.`;
}

function explainChild(caselet: IopEnglishProductionCaselet, child: IopEnglishChildQuestion): string {
  const trace = caselet.target;
  const evidence = child.evidence;

  if (evidence.kind === "STEP_OUTPUT") {
    return [
      `We need to find Step ${evidence.stepNumber} for the new input.`,
      ruleParagraph(caselet),
      `Applying that rule step by step to the new input gives:\n${traceLines(trace, evidence.stepNumber)}`,
      `The required Step ${evidence.stepNumber} is ${child.answerDisplay}.`,
      finalAnswer(child.answerDisplay),
    ].join("\n\n");
  }

  if (evidence.kind === "FINAL_OUTPUT") {
    return [
      "We need the final output for the new input.",
      ruleParagraph(caselet),
      `Applying the same rule until the machine is complete gives:\n${traceLines(trace, trace.steps.length)}`,
      `The last generated step is the final output: ${child.answerDisplay}.`,
      finalAnswer(child.answerDisplay),
    ].join("\n\n");
  }

  if (evidence.kind === "ELEMENT_AT_POSITION") {
    const row = trace.steps[evidence.stepNumber - 1]!;
    return [
      `We are asked for the element at position ${evidence.position} from the left in Step ${evidence.stepNumber}.`,
      ruleParagraph(caselet),
      `First form the required step from the new input:\n${traceLines(trace, evidence.stepNumber)}`,
      `Step ${evidence.stepNumber} is ${renderRow(row)}. Counting from the left, position ${evidence.position} contains ${child.answerDisplay}.`,
      finalAnswer(child.answerDisplay),
    ].join("\n\n");
  }

  if (evidence.kind === "POSITION_OF_ELEMENT") {
    const row = trace.steps[evidence.stepNumber - 1]!;
    return [
      `We need the position of ${evidence.element} from the left in Step ${evidence.stepNumber}.`,
      ruleParagraph(caselet),
      `First form Step ${evidence.stepNumber} for the new input:\n${traceLines(trace, evidence.stepNumber)}`,
      `Step ${evidence.stepNumber} is ${renderRow(row)}. Reading from left to right, ${evidence.element} is ${child.answerDisplay}.`,
      finalAnswer(child.answerDisplay),
    ].join("\n\n");
  }

  if (evidence.kind === "STEP_NUMBER") {
    const stepIndex = trace.steps.findIndex((row) => row.join("\u241f") === evidence.stateFingerprint);
    if (stepIndex < 0) throw new Error("Review explanation could not locate the requested machine state");
    const stepNumber = stepIndex + 1;
    return [
      "We are given an arrangement and have to identify at which step it appears.",
      ruleParagraph(caselet),
      `Tracing the new input in order gives:\n${traceLines(trace, stepNumber)}`,
      `The stated arrangement first matches the machine at Step ${stepNumber}.`,
      finalAnswer(child.answerDisplay),
    ].join("\n\n");
  }

  if (evidence.kind === "PREVIOUS_STEP") {
    const previousStepNumber = evidence.currentStepNumber - 1;
    const previous = previousStepNumber === 0 ? trace.input : trace.steps[previousStepNumber - 1]!;
    const current = trace.steps[evidence.currentStepNumber - 1]!;
    return [
      `We are given Step ${evidence.currentStepNumber} and have to find the arrangement immediately before it.`,
      ruleParagraph(caselet),
      `For the new input, the two relevant consecutive states are:\nStep ${previousStepNumber}: ${renderRow(previous)}\nStep ${evidence.currentStepNumber}: ${renderRow(current)}`,
      `So the arrangement immediately before Step ${evidence.currentStepNumber} is ${child.answerDisplay}.`,
      finalAnswer(child.answerDisplay),
    ].join("\n\n");
  }

  if (evidence.kind === "MISSING_STEP") {
    const before = evidence.missingStepNumber === 1 ? trace.input : trace.steps[evidence.missingStepNumber - 2]!;
    const missing = trace.steps[evidence.missingStepNumber - 1]!;
    const after = trace.steps[evidence.missingStepNumber]!;
    return [
      `We have to fill the missing Step ${evidence.missingStepNumber}.`,
      ruleParagraph(caselet),
      `The relevant part of the new-input trace is:\nStep ${evidence.missingStepNumber - 1}: ${renderRow(before)}\nStep ${evidence.missingStepNumber}: ${renderRow(missing)}\nStep ${evidence.missingStepNumber + 1}: ${renderRow(after)}`,
      `Applying one machine step to the printed previous state gives ${child.answerDisplay}; applying the rule once more reaches the printed following state.`,
      finalAnswer(child.answerDisplay),
    ].join("\n\n");
  }

  const totalSteps = trace.steps.length;
  const remaining = totalSteps - evidence.stepNumber;
  return [
    `We are asked how many steps remain after Step ${evidence.stepNumber}.`,
    `For this new input, the machine finishes at Step ${totalSteps}.`,
    `So the number of steps still required is ${totalSteps} - ${evidence.stepNumber} = ${remaining}.`,
    finalAnswer(child.answerDisplay),
  ].join("\n\n");
}

export function withFullIopEnglishExplanations(caselet: IopEnglishProductionCaselet): IopEnglishProductionCaselet {
  const children = caselet.children.map((child) => ({
    ...child,
    explanation: explainChild(caselet, child),
  })) as unknown as IopEnglishProductionCaselet["children"];
  return { ...caselet, children };
}

export function assertIopEnglishExplanationQuality(caselet: IopEnglishProductionCaselet): void {
  for (const child of caselet.children) {
    const minimumLength = child.kind === "REMAINING_STEP_COUNT" ? 140 : 220;
    if (child.explanation.length < minimumLength) {
      throw new Error(`${caselet.sourceModeId}/${child.kind} explanation is too thin (${child.explanation.length} chars)`);
    }
    if (!child.explanation.includes(child.answerDisplay)) {
      throw new Error(`${caselet.sourceModeId}/${child.kind} explanation does not state the exact answer`);
    }
    if (!child.explanation.toLowerCase().includes("we ")) {
      throw new Error(`${caselet.sourceModeId}/${child.kind} explanation does not state what is being solved`);
    }
    if (child.kind !== "REMAINING_STEP_COUNT" && !child.explanation.includes(caselet.ruleExplanation)) {
      throw new Error(`${caselet.sourceModeId}/${child.kind} explanation does not explain the inferred machine rule`);
    }
    if (child.kind !== "REMAINING_STEP_COUNT" && !child.explanation.includes("new input")) {
      throw new Error(`${caselet.sourceModeId}/${child.kind} explanation does not apply the rule to the new input`);
    }
  }
}
