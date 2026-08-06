import {
  addRational,
  compareRational,
  divideRational,
  formatRational,
  multiplyRational,
  rational,
  rationalKey,
  reduceRationalRatio,
  subtractRational,
} from "./rational";
import type { MalReasoningGraph, Rational } from "./types";
import type { MalCp002Context } from "./cp002-context-library";
import type {
  MalCp002ComponentId,
  MalCp002Ratio,
  MalCp002SolveRequest,
  MalCp002SolveResult,
  MalCp002State,
} from "./cp002-types";
import type {
  MalCp002Explanation,
  MalCp002MisconceptionId,
  MalCp002OptionAudit,
  MalCp002RatioAdjustmentDiagram,
} from "./cp002-authoring-types";

function hash(value: string): number {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.codePointAt(0) ?? 0;
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function componentLabel(
  context: MalCp002Context,
  component: MalCp002ComponentId,
): string {
  return component === "A"
    ? context.componentALabel
    : context.componentBLabel;
}

function counterpart(component: MalCp002ComponentId): MalCp002ComponentId {
  return component === "A" ? "B" : "A";
}

function stateQuantity(
  state: MalCp002State,
  component: MalCp002ComponentId,
): Rational {
  return component === "A" ? state.componentA : state.componentB;
}

function pluralUnit(unit: string, value: Rational): string {
  if (unit !== "litres") return unit;
  return value.numerator === value.denominator ? "litre" : "litres";
}

function quantityText(value: Rational, context: MalCp002Context): string {
  return `${formatRational(value)} ${pluralUnit(context.quantityUnit, value)}`;
}

function ratioText(ratio: MalCp002Ratio): string {
  const [first, second] = reduceRationalRatio(
    ratio.componentAPart,
    ratio.componentBPart,
  );
  return `${formatRational(first)} : ${formatRational(second)}`;
}

function stateRatio(state: MalCp002State): MalCp002Ratio {
  const [componentAPart, componentBPart] = reduceRationalRatio(
    state.componentA,
    state.componentB,
  );
  return { componentAPart, componentBPart };
}

function stateText(state: MalCp002State, context: MalCp002Context): string {
  return `${context.componentALabel} = ${quantityText(
    state.componentA,
    context,
  )}, ${context.componentBLabel} = ${quantityText(
    state.componentB,
    context,
  )}`;
}

function articleFor(value: string): string {
  return /^[aeiou]/iu.test(value.trim()) ? "an" : "a";
}

export function buildMalCp002Stem(
  request: MalCp002SolveRequest,
  context: MalCp002Context,
): string {
  switch (request.mode) {
    case "UNKNOWN_PURE_ADJUSTMENT_TO_TARGET": {
      const changed = componentLabel(context, request.changedComponent);
      const operation = request.adjustmentKind === "ADD" ? "added" : "removed";
      const sourcePhrase =
        request.adjustmentKind === "REMOVE"
          ? `pure ${changed}`
          : changed;
      return `${context.actor} has ${articleFor(context.container)} ${context.container} containing ${quantityText(
        request.initialState.componentA,
        context,
      )} of ${context.componentALabel} and ${quantityText(
        request.initialState.componentB,
        context,
      )} of ${context.componentBLabel}. How much ${sourcePhrase} must be ${operation} so that the ratio of ${context.componentALabel} to ${context.componentBLabel} becomes ${ratioText(
        request.targetRatio,
      )}?`;
    }

    case "RESULTING_RATIO_AFTER_PURE_ADJUSTMENT": {
      const changed = componentLabel(context, request.changedComponent);
      const operation = request.adjustmentKind === "ADD" ? "added" : "removed";
      const sourcePhrase =
        request.adjustmentKind === "REMOVE"
          ? `pure ${changed}`
          : changed;
      return `${context.actor} starts with ${quantityText(
        request.initialState.componentA,
        context,
      )} of ${context.componentALabel} and ${quantityText(
        request.initialState.componentB,
        context,
      )} of ${context.componentBLabel}. If ${quantityText(
        request.adjustmentQuantity,
        context,
      )} of ${sourcePhrase} is ${operation}, what is the resulting ratio of ${context.componentALabel} to ${context.componentBLabel}?`;
    }

    case "ORIGINAL_RATIO_FROM_FINAL_PURE_ADJUSTMENT": {
      const changed = componentLabel(context, request.changedComponent);
      const operation = request.adjustmentKind === "ADD" ? "adding" : "removing";
      const sourcePhrase =
        request.adjustmentKind === "REMOVE"
          ? `pure ${changed}`
          : changed;
      return `After ${operation} ${quantityText(
        request.adjustmentQuantity,
        context,
      )} of ${sourcePhrase}, ${context.actor.toLowerCase()} has ${quantityText(
        request.finalState.componentA,
        context,
      )} of ${context.componentALabel} and ${quantityText(
        request.finalState.componentB,
        context,
      )} of ${context.componentBLabel}. What was the original ratio of ${context.componentALabel} to ${context.componentBLabel}?`;
    }

    case "COMPONENT_QUANTITIES_FROM_TOTAL_AND_RATIO":
      return `${context.actor} has ${quantityText(
        request.totalQuantity,
        context,
      )} of a mixture in which ${context.componentALabel} and ${context.componentBLabel} are in the ratio ${ratioText(
        request.ratio,
      )}. Find the quantities of ${context.componentALabel} and ${context.componentBLabel}, in that order.`;

    case "UNKNOWN_SINGLE_REPLACEMENT_TO_TARGET": {
      const replacement = componentLabel(
        context,
        request.replacementComponent,
      );
      return `${context.actor} has ${articleFor(context.container)} ${context.container} containing ${quantityText(
        request.initialState.componentA,
        context,
      )} of ${context.componentALabel} and ${quantityText(
        request.initialState.componentB,
        context,
      )} of ${context.componentBLabel}. A quantity of the well-mixed contents is removed once and replaced with the same quantity of pure ${replacement}. How much must be replaced so that the final ratio of ${context.componentALabel} to ${context.componentBLabel} is ${ratioText(
        request.targetRatio,
      )}?`;
    }
  }
}

export function formatMalCp002Answer(
  result: MalCp002SolveResult,
  context: MalCp002Context,
): string {
  switch (result.kind) {
    case "ADJUSTMENT_QUANTITY":
    case "SINGLE_REPLACEMENT_QUANTITY":
      return quantityText(result.quantity, context);
    case "COMPONENT_RATIO":
    case "ORIGINAL_RATIO":
      return ratioText(result.ratio);
    case "COMPONENT_QUANTITY_PAIR":
      return `${quantityText(
        result.componentAQuantity,
        context,
      )} and ${quantityText(result.componentBQuantity, context)}`;
  }
}

type OptionCandidate = Omit<MalCp002OptionAudit, "isCorrect">;

function quantityKey(value: Rational): string {
  return `Q:${rationalKey(value)}`;
}

function ratioKey(ratio: MalCp002Ratio): string {
  const [first, second] = reduceRationalRatio(
    ratio.componentAPart,
    ratio.componentBPart,
  );
  return `R:${rationalKey(first)}:${rationalKey(second)}`;
}

function pairKey(first: Rational, second: Rational): string {
  return `P:${rationalKey(first)}:${rationalKey(second)}`;
}

function positiveDifferenceCandidate(value: Rational, offset: number): Rational {
  const candidate = subtractRational(value, rational(offset));
  return compareRational(candidate, rational(0)) > 0
    ? candidate
    : addRational(value, rational(offset));
}

function pushUniqueCandidate(
  candidates: OptionCandidate[],
  candidate: OptionCandidate,
): void {
  if (!candidates.some((item) => item.canonicalKey === candidate.canonicalKey)) {
    candidates.push(candidate);
  }
}

function quantityCandidate(
  value: Rational,
  context: MalCp002Context,
  misconceptionId: MalCp002MisconceptionId,
): OptionCandidate {
  return {
    text: quantityText(value, context),
    canonicalKey: quantityKey(value),
    misconceptionId,
  };
}

function ratioCandidate(
  ratio: MalCp002Ratio,
  misconceptionId: MalCp002MisconceptionId,
): OptionCandidate {
  return {
    text: ratioText(ratio),
    canonicalKey: ratioKey(ratio),
    misconceptionId,
  };
}

function pairCandidate(
  first: Rational,
  second: Rational,
  context: MalCp002Context,
  misconceptionId: MalCp002MisconceptionId,
): OptionCandidate {
  return {
    text: `${quantityText(first, context)} and ${quantityText(second, context)}`,
    canonicalKey: pairKey(first, second),
    misconceptionId,
  };
}

function buildQuantityOptions(
  request: MalCp002SolveRequest,
  result: Extract<
    MalCp002SolveResult,
    { kind: "ADJUSTMENT_QUANTITY" | "SINGLE_REPLACEMENT_QUANTITY" }
  >,
  context: MalCp002Context,
): OptionCandidate[] {
  const candidates: OptionCandidate[] = [];
  pushUniqueCandidate(
    candidates,
    quantityCandidate(result.quantity, context, "CORRECT"),
  );

  if (request.mode === "UNKNOWN_PURE_ADJUSTMENT_TO_TARGET") {
    const initialChanged = stateQuantity(
      request.initialState,
      request.changedComponent,
    );
    const finalChanged = stateQuantity(
      result.finalState,
      request.changedComponent,
    );
    const fixed = stateQuantity(
      request.initialState,
      counterpart(request.changedComponent),
    );
    pushUniqueCandidate(
      candidates,
      quantityCandidate(
        finalChanged,
        context,
        "TARGET_QUANTITY_REPORTED",
      ),
    );
    pushUniqueCandidate(
      candidates,
      quantityCandidate(
        initialChanged,
        context,
        "INITIAL_CHANGED_QUANTITY_REPORTED",
      ),
    );
    pushUniqueCandidate(
      candidates,
      quantityCandidate(fixed, context, "UNCHANGED_COMPONENT_ALTERED"),
    );
  } else if (request.mode === "UNKNOWN_SINGLE_REPLACEMENT_TO_TARGET") {
    const total = addRational(
      request.initialState.componentA,
      request.initialState.componentB,
    );
    const replacementInitial = stateQuantity(
      request.initialState,
      request.replacementComponent,
    );
    const nonReplacementInitial = stateQuantity(
      request.initialState,
      counterpart(request.replacementComponent),
    );
    pushUniqueCandidate(
      candidates,
      quantityCandidate(
        subtractRational(total, result.quantity),
        context,
        "RETENTION_FACTOR_REVERSED",
      ),
    );
    pushUniqueCandidate(
      candidates,
      quantityCandidate(
        replacementInitial,
        context,
        "PURE_REMOVAL_ASSUMED",
      ),
    );
    pushUniqueCandidate(
      candidates,
      quantityCandidate(
        nonReplacementInitial,
        context,
        "REMOVED_SAMPLE_TREATED_AS_REPLACEMENT_COMPONENT",
      ),
    );
  }

  for (const [offset, misconceptionId] of [
    [1, "PLAUSIBLE_ARITHMETIC_SLIP"],
    [2, "ADJUSTMENT_DIRECTION_REVERSED"],
    [3, "PLAUSIBLE_ARITHMETIC_SLIP"],
    [5, "PLAUSIBLE_ARITHMETIC_SLIP"],
  ] as const) {
    pushUniqueCandidate(
      candidates,
      quantityCandidate(
        addRational(result.quantity, rational(offset)),
        context,
        misconceptionId,
      ),
    );
    pushUniqueCandidate(
      candidates,
      quantityCandidate(
        positiveDifferenceCandidate(result.quantity, offset),
        context,
        misconceptionId,
      ),
    );
  }

  return candidates.slice(0, 4);
}

function ratioFromRelevantState(request: MalCp002SolveRequest): MalCp002Ratio | null {
  switch (request.mode) {
    case "RESULTING_RATIO_AFTER_PURE_ADJUSTMENT":
      return stateRatio(request.initialState);
    case "ORIGINAL_RATIO_FROM_FINAL_PURE_ADJUSTMENT":
      return stateRatio(request.finalState);
    default:
      return null;
  }
}

function buildRatioOptions(
  request: MalCp002SolveRequest,
  result: Extract<
    MalCp002SolveResult,
    { kind: "COMPONENT_RATIO" | "ORIGINAL_RATIO" }
  >,
): OptionCandidate[] {
  const correctRatio = result.ratio;
  const candidates: OptionCandidate[] = [];
  pushUniqueCandidate(candidates, ratioCandidate(correctRatio, "CORRECT"));
  pushUniqueCandidate(
    candidates,
    ratioCandidate(
      {
        componentAPart: correctRatio.componentBPart,
        componentBPart: correctRatio.componentAPart,
      },
      "RATIO_REVERSED",
    ),
  );

  const unchangedRatio = ratioFromRelevantState(request);
  if (unchangedRatio) {
    pushUniqueCandidate(
      candidates,
      ratioCandidate(
        unchangedRatio,
        request.mode === "ORIGINAL_RATIO_FROM_FINAL_PURE_ADJUSTMENT"
          ? "OPERATION_NOT_UNDONE"
          : "RATIO_NOT_UPDATED",
      ),
    );
  }

  pushUniqueCandidate(
    candidates,
    ratioCandidate(
      {
        componentAPart: addRational(correctRatio.componentAPart, rational(1)),
        componentBPart: correctRatio.componentBPart,
      },
      "PLAUSIBLE_ARITHMETIC_SLIP",
    ),
  );
  pushUniqueCandidate(
    candidates,
    ratioCandidate(
      {
        componentAPart: correctRatio.componentAPart,
        componentBPart: addRational(correctRatio.componentBPart, rational(1)),
      },
      "PLAUSIBLE_ARITHMETIC_SLIP",
    ),
  );
  pushUniqueCandidate(
    candidates,
    ratioCandidate(
      {
        componentAPart: addRational(correctRatio.componentAPart, rational(2)),
        componentBPart: addRational(correctRatio.componentBPart, rational(1)),
      },
      "PLAUSIBLE_ARITHMETIC_SLIP",
    ),
  );

  return candidates.slice(0, 4);
}

function buildPairOptions(
  request: Extract<
    MalCp002SolveRequest,
    { mode: "COMPONENT_QUANTITIES_FROM_TOTAL_AND_RATIO" }
  >,
  result: Extract<
    MalCp002SolveResult,
    { kind: "COMPONENT_QUANTITY_PAIR" }
  >,
  context: MalCp002Context,
): OptionCandidate[] {
  const candidates: OptionCandidate[] = [];
  pushUniqueCandidate(
    candidates,
    pairCandidate(
      result.componentAQuantity,
      result.componentBQuantity,
      context,
      "CORRECT",
    ),
  );
  pushUniqueCandidate(
    candidates,
    pairCandidate(
      result.componentBQuantity,
      result.componentAQuantity,
      context,
      "COMPONENTS_SWAPPED",
    ),
  );

  const half = divideRational(request.totalQuantity, rational(2));
  pushUniqueCandidate(
    candidates,
    pairCandidate(half, half, context, "EQUAL_SPLIT_ASSUMED"),
  );
  pushUniqueCandidate(
    candidates,
    pairCandidate(
      request.ratio.componentAPart,
      request.ratio.componentBPart,
      context,
      "TOTAL_USED_AS_ONE_PART",
    ),
  );

  const shiftedA = addRational(result.componentAQuantity, rational(1));
  const shiftedB = positiveDifferenceCandidate(result.componentBQuantity, 1);
  pushUniqueCandidate(
    candidates,
    pairCandidate(
      shiftedA,
      shiftedB,
      context,
      "PLAUSIBLE_ARITHMETIC_SLIP",
    ),
  );

  return candidates.slice(0, 4);
}

export function buildMalCp002Options(
  request: MalCp002SolveRequest,
  result: MalCp002SolveResult,
  context: MalCp002Context,
  seed: string,
): {
  options: string[];
  optionAudit: MalCp002OptionAudit[];
  correctIndex: number;
  errors: string[];
} {
  let candidates: OptionCandidate[];
  switch (result.kind) {
    case "ADJUSTMENT_QUANTITY":
    case "SINGLE_REPLACEMENT_QUANTITY":
      candidates = buildQuantityOptions(request, result, context);
      break;
    case "COMPONENT_RATIO":
    case "ORIGINAL_RATIO":
      candidates = buildRatioOptions(request, result);
      break;
    case "COMPONENT_QUANTITY_PAIR":
      if (request.mode !== "COMPONENT_QUANTITIES_FROM_TOTAL_AND_RATIO") {
        throw new Error("Quantity-pair result does not match the request mode.");
      }
      candidates = buildPairOptions(request, result, context);
      break;
  }

  const errors: string[] = [];
  if (candidates.length !== 4) {
    errors.push(`Option engine produced ${candidates.length} candidates.`);
  }
  if (new Set(candidates.map((item) => item.canonicalKey)).size !== 4) {
    errors.push("Option engine produced duplicate canonical answers.");
  }
  if (candidates.filter((item) => item.misconceptionId === "CORRECT").length !== 1) {
    errors.push("Option engine did not produce exactly one correct candidate.");
  }

  const rotation = candidates.length > 0 ? hash(seed) % candidates.length : 0;
  const rotated = [
    ...candidates.slice(rotation),
    ...candidates.slice(0, rotation),
  ];
  const optionAudit = rotated.map((item) => ({
    ...item,
    isCorrect: item.misconceptionId === "CORRECT",
  }));
  const correctIndex = optionAudit.findIndex((item) => item.isCorrect);
  if (correctIndex < 0) errors.push("Correct option is missing after rotation.");

  return {
    options: optionAudit.map((item) => item.text),
    optionAudit,
    correctIndex,
    errors,
  };
}

function explanationShell(
  values: Omit<MalCp002Explanation, "layoutId" | "sectionTitles">,
): MalCp002Explanation {
  return {
    layoutId: "MAL-CP002-EN-FORMULA-FIRST-DISCOVERY-V1",
    sectionTitles: {
      coreConcept: "📌 Core Concept & Formula",
      steps: "📝 Step-by-Step Solution",
      shortcut: "⚡ 10-Second Exam Shortcut",
      trap: "⚠️ Common Trap & Mistake Warning",
    },
    ...values,
  };
}

function buildTargetAdjustmentExplanation(
  request: Extract<
    MalCp002SolveRequest,
    { mode: "UNKNOWN_PURE_ADJUSTMENT_TO_TARGET" }
  >,
  result: Extract<MalCp002SolveResult, { kind: "ADJUSTMENT_QUANTITY" }>,
  context: MalCp002Context,
): MalCp002Explanation {
  const changed = request.changedComponent;
  const fixed = counterpart(changed);
  const changedLabel = componentLabel(context, changed);
  const fixedLabel = componentLabel(context, fixed);
  const fixedQuantity = stateQuantity(request.initialState, fixed);
  const changedInitial = stateQuantity(request.initialState, changed);
  const changedFinal = stateQuantity(result.finalState, changed);
  const changedPart =
    changed === "A"
      ? request.targetRatio.componentAPart
      : request.targetRatio.componentBPart;
  const fixedPart =
    fixed === "A"
      ? request.targetRatio.componentAPart
      : request.targetRatio.componentBPart;
  const onePart = divideRational(fixedQuantity, fixedPart);
  const verb = request.adjustmentKind === "ADD" ? "added" : "removed";

  return explanationShell({
    coreConcept: `Only ${changedLabel} changes. The quantity of ${fixedLabel} stays fixed, so use it to find the value of one ratio part.`,
    formula: `Required ${changedLabel} = fixed ${fixedLabel} × (${formatRational(
      changedPart,
    )}/${formatRational(fixedPart)}); amount ${verb} = difference between required and initial ${changedLabel}.`,
    steps: [
      `Step 1: The unchanged component is ${fixedLabel} = ${quantityText(
        fixedQuantity,
        context,
      )}.`,
      `Step 2: In the target ratio ${ratioText(
        request.targetRatio,
      )}, ${fixedLabel} represents ${formatRational(fixedPart)} parts.`,
      `Step 3: One part = ${formatRational(
        fixedQuantity,
      )} ÷ ${formatRational(fixedPart)} = ${quantityText(
        onePart,
        context,
      )}.`,
      `Step 4: Required ${changedLabel} = ${formatRational(
        changedPart,
      )} × ${formatRational(onePart)} = ${quantityText(
        changedFinal,
        context,
      )}.`,
      `Step 5: Amount ${verb} = |${formatRational(
        changedFinal,
      )} − ${formatRational(changedInitial)}| = ${quantityText(
        result.quantity,
        context,
      )}.`,
    ],
    verification: `After the change, ${stateText(
      result.finalState,
      context,
    )}; their ratio is ${ratioText(result.finalRatio)}, exactly the target.`,
    conclusion: `${quantityText(result.quantity, context)} of ${changedLabel} must be ${verb}.`,
    examShortcut: `Keep ${fixedLabel} fixed. Divide ${quantityText(
      fixedQuantity,
      context,
    )} by its ${formatRational(fixedPart)} ratio parts, multiply by the ${formatRational(
      changedPart,
    )} parts of ${changedLabel}, and take the difference from the starting amount.`,
    commonTrap: `Do not apply the target ratio to the original total. The total changes when ${changedLabel} is ${verb}, but ${fixedLabel} does not change.`,
  });
}

function buildForwardRatioExplanation(
  request: Extract<
    MalCp002SolveRequest,
    { mode: "RESULTING_RATIO_AFTER_PURE_ADJUSTMENT" }
  >,
  result: Extract<MalCp002SolveResult, { kind: "COMPONENT_RATIO" }>,
  context: MalCp002Context,
): MalCp002Explanation {
  const changedLabel = componentLabel(context, request.changedComponent);
  const fixedLabel = componentLabel(
    context,
    counterpart(request.changedComponent),
  );
  const initialChanged = stateQuantity(
    request.initialState,
    request.changedComponent,
  );
  const finalChanged = stateQuantity(result.finalState, request.changedComponent);
  const operationSymbol = request.adjustmentKind === "ADD" ? "+" : "−";
  const operationWord = request.adjustmentKind === "ADD" ? "added" : "removed";

  return explanationShell({
    coreConcept: `Change only ${changedLabel}; ${fixedLabel} keeps its original quantity. Then reduce the two final quantities to the simplest ratio.`,
    formula: `Final changed component = initial amount ${operationSymbol} stated amount; final ratio = final A : final B.`,
    steps: [
      `Step 1: Initial state: ${stateText(request.initialState, context)}.`,
      `Step 2: ${changedLabel} after the change = ${formatRational(
        initialChanged,
      )} ${operationSymbol} ${formatRational(
        request.adjustmentQuantity,
      )} = ${quantityText(finalChanged, context)}.`,
      `Step 3: ${fixedLabel} remains ${quantityText(
        stateQuantity(result.finalState, counterpart(request.changedComponent)),
        context,
      )}.`,
      `Step 4: Final ratio ${context.componentALabel} : ${context.componentBLabel} = ${formatRational(
        result.finalState.componentA,
      )} : ${formatRational(result.finalState.componentB)} = ${ratioText(
        result.ratio,
      )}.`,
    ],
    verification: `The stated ${quantityText(
      request.adjustmentQuantity,
      context,
    )} is ${operationWord} from ${changedLabel} only, and the final quantities reduce to ${ratioText(
      result.ratio,
    )}.`,
    conclusion: `The resulting ratio is ${ratioText(result.ratio)}.`,
    examShortcut: `Update the ${changedLabel} side only, keep ${fixedLabel} unchanged, and reduce the two numbers immediately.`,
    commonTrap: `Do not add or subtract the stated quantity from both components. It is pure ${changedLabel}, not a sample of the whole mixture.`,
  });
}

function buildOriginalRatioExplanation(
  request: Extract<
    MalCp002SolveRequest,
    { mode: "ORIGINAL_RATIO_FROM_FINAL_PURE_ADJUSTMENT" }
  >,
  result: Extract<MalCp002SolveResult, { kind: "ORIGINAL_RATIO" }>,
  context: MalCp002Context,
): MalCp002Explanation {
  const changedLabel = componentLabel(context, request.changedComponent);
  const fixedLabel = componentLabel(
    context,
    counterpart(request.changedComponent),
  );
  const finalChanged = stateQuantity(request.finalState, request.changedComponent);
  const originalChanged = stateQuantity(
    result.originalState,
    request.changedComponent,
  );
  const undoSymbol = request.adjustmentKind === "ADD" ? "−" : "+";
  const priorOperation = request.adjustmentKind === "ADD" ? "addition" : "removal";

  return explanationShell({
    coreConcept: `Undo the stated ${priorOperation} on ${changedLabel}. The quantity of ${fixedLabel} was unchanged, so it is already the original amount.`,
    formula: `Original changed component = final changed component ${undoSymbol} stated adjustment; original ratio = original A : original B.`,
    steps: [
      `Step 1: Final state: ${stateText(request.finalState, context)}.`,
      `Step 2: Undo the ${priorOperation}: original ${changedLabel} = ${formatRational(
        finalChanged,
      )} ${undoSymbol} ${formatRational(
        request.adjustmentQuantity,
      )} = ${quantityText(originalChanged, context)}.`,
      `Step 3: Original ${fixedLabel} = ${quantityText(
        stateQuantity(result.originalState, counterpart(request.changedComponent)),
        context,
      )}, because it did not change.`,
      `Step 4: Original ratio = ${formatRational(
        result.originalState.componentA,
      )} : ${formatRational(result.originalState.componentB)} = ${ratioText(
        result.ratio,
      )}.`,
    ],
    verification: `Applying the stated ${priorOperation} again to ${stateText(
      result.originalState,
      context,
    )} reproduces the given final state.`,
    conclusion: `The original ratio was ${ratioText(result.ratio)}.`,
    examShortcut: `Reverse the operation on ${changedLabel} only; then reduce the reconstructed pair.`,
    commonTrap: `Do not use the final ratio as the original ratio. First undo the change made to ${changedLabel}.`,
  });
}

function buildComponentPairExplanation(
  request: Extract<
    MalCp002SolveRequest,
    { mode: "COMPONENT_QUANTITIES_FROM_TOTAL_AND_RATIO" }
  >,
  result: Extract<MalCp002SolveResult, { kind: "COMPONENT_QUANTITY_PAIR" }>,
  context: MalCp002Context,
): MalCp002Explanation {
  const totalParts = addRational(
    request.ratio.componentAPart,
    request.ratio.componentBPart,
  );
  const onePart = divideRational(request.totalQuantity, totalParts);

  return explanationShell({
    coreConcept: `The total mixture is divided into ${formatRational(
      totalParts,
    )} equal ratio parts. Find one part first, then allocate the required parts to each component.`,
    formula: `One part = total quantity ÷ sum of ratio parts; component quantity = its ratio part × one part.`,
    steps: [
      `Step 1: Total ratio parts = ${formatRational(
        request.ratio.componentAPart,
      )} + ${formatRational(request.ratio.componentBPart)} = ${formatRational(
        totalParts,
      )}.`,
      `Step 2: One part = ${formatRational(
        request.totalQuantity,
      )} ÷ ${formatRational(totalParts)} = ${quantityText(
        onePart,
        context,
      )}.`,
      `Step 3: ${context.componentALabel} = ${formatRational(
        request.ratio.componentAPart,
      )} × ${formatRational(onePart)} = ${quantityText(
        result.componentAQuantity,
        context,
      )}.`,
      `Step 4: ${context.componentBLabel} = ${formatRational(
        request.ratio.componentBPart,
      )} × ${formatRational(onePart)} = ${quantityText(
        result.componentBQuantity,
        context,
      )}.`,
    ],
    verification: `${formatRational(
      result.componentAQuantity,
    )} + ${formatRational(result.componentBQuantity)} = ${formatRational(
      request.totalQuantity,
    )}, and the two quantities reduce to ${ratioText(request.ratio)}.`,
    conclusion: `${context.componentALabel} = ${quantityText(
      result.componentAQuantity,
      context,
    )} and ${context.componentBLabel} = ${quantityText(
      result.componentBQuantity,
      context,
    )}.`,
    examShortcut: `Add the ratio parts, divide the total once, and multiply that one-part value by each ratio part.`,
    commonTrap: `The ratio numbers are parts, not the actual quantities. Do not report them without scaling them to the given total.`,
  });
}

function buildReplacementExplanation(
  request: Extract<
    MalCp002SolveRequest,
    { mode: "UNKNOWN_SINGLE_REPLACEMENT_TO_TARGET" }
  >,
  result: Extract<
    MalCp002SolveResult,
    { kind: "SINGLE_REPLACEMENT_QUANTITY" }
  >,
  context: MalCp002Context,
): MalCp002Explanation {
  const total = addRational(
    request.initialState.componentA,
    request.initialState.componentB,
  );
  const replacement = request.replacementComponent;
  const nonReplacement = counterpart(replacement);
  const replacementLabel = componentLabel(context, replacement);
  const nonReplacementLabel = componentLabel(context, nonReplacement);
  const retainedFraction = divideRational(
    subtractRational(total, result.quantity),
    total,
  );
  const retainedA = multiplyRational(
    request.initialState.componentA,
    retainedFraction,
  );
  const retainedB = multiplyRational(
    request.initialState.componentB,
    retainedFraction,
  );
  const targetNonReplacementPart =
    nonReplacement === "A"
      ? request.targetRatio.componentAPart
      : request.targetRatio.componentBPart;
  const totalTargetParts = addRational(
    request.targetRatio.componentAPart,
    request.targetRatio.componentBPart,
  );
  const targetNonReplacementQuantity = multiplyRational(
    total,
    divideRational(targetNonReplacementPart, totalTargetParts),
  );
  const initialNonReplacementQuantity = stateQuantity(
    request.initialState,
    nonReplacement,
  );

  return explanationShell({
    coreConcept: `The removed material is a homogeneous sample, so both original components are reduced in the same fraction. Only after removal is pure ${replacementLabel} added back.`,
    formula: `Remaining original component = initial component × (V − x)/V. Then add x to the replacement component and impose the target ratio.`,
    steps: [
      `Step 1: Total volume V = ${formatRational(
        request.initialState.componentA,
      )} + ${formatRational(request.initialState.componentB)} = ${quantityText(
        total,
        context,
      )}. Let the replaced quantity be x.`,
      `Step 2: After removing x from the well-mixed contents, the retained fraction is (V − x)/V.`,
      `Step 3: The target ratio gives ${nonReplacementLabel} = ${formatRational(
        total,
      )} × ${formatRational(targetNonReplacementPart)}/${formatRational(
        totalTargetParts,
      )} = ${quantityText(targetNonReplacementQuantity, context)}.`,
      `Step 4: ${formatRational(
        initialNonReplacementQuantity,
      )} × (V − x)/V = ${formatRational(
        targetNonReplacementQuantity,
      )}. Solving gives x = ${quantityText(result.quantity, context)}.`,
      `Step 5: After removal, ${context.componentALabel} = ${formatRational(
        retainedA,
      )} and ${context.componentBLabel} = ${formatRational(
        retainedB,
      )}; adding back x of pure ${replacementLabel} gives ${stateText(
        result.finalState,
        context,
      )}.`,
    ],
    verification: `The final total remains ${quantityText(
      total,
      context,
    )}, and ${formatRational(result.finalState.componentA)} : ${formatRational(
      result.finalState.componentB,
    )} reduces to ${ratioText(result.finalRatio)}.`,
    conclusion: `${quantityText(
      result.quantity,
      context,
    )} of the mixture must be removed and replaced with pure ${replacementLabel}.`,
    examShortcut: `The final total is unchanged. First find the target amount of ${nonReplacementLabel}. Its retained fraction is target amount ÷ initial amount. Therefore, replaced fraction = 1 − retained fraction, and replaced quantity = total × replaced fraction.`,
    commonTrap: `Do not subtract x directly from ${replacementLabel}. The removed x is mixed material containing both components in the original proportion.`,
  });
}

export function buildMalCp002Explanation(
  request: MalCp002SolveRequest,
  result: MalCp002SolveResult,
  context: MalCp002Context,
): MalCp002Explanation {
  if (
    request.mode === "UNKNOWN_PURE_ADJUSTMENT_TO_TARGET" &&
    result.kind === "ADJUSTMENT_QUANTITY"
  ) {
    return buildTargetAdjustmentExplanation(request, result, context);
  }
  if (
    request.mode === "RESULTING_RATIO_AFTER_PURE_ADJUSTMENT" &&
    result.kind === "COMPONENT_RATIO"
  ) {
    return buildForwardRatioExplanation(request, result, context);
  }
  if (
    request.mode === "ORIGINAL_RATIO_FROM_FINAL_PURE_ADJUSTMENT" &&
    result.kind === "ORIGINAL_RATIO"
  ) {
    return buildOriginalRatioExplanation(request, result, context);
  }
  if (
    request.mode === "COMPONENT_QUANTITIES_FROM_TOTAL_AND_RATIO" &&
    result.kind === "COMPONENT_QUANTITY_PAIR"
  ) {
    return buildComponentPairExplanation(request, result, context);
  }
  if (
    request.mode === "UNKNOWN_SINGLE_REPLACEMENT_TO_TARGET" &&
    result.kind === "SINGLE_REPLACEMENT_QUANTITY"
  ) {
    return buildReplacementExplanation(request, result, context);
  }
  throw new Error(`Unsupported CP-002 explanation pairing: ${request.mode}/${result.kind}.`);
}

function diagramState(
  state: MalCp002State,
  context: MalCp002Context,
): MalCp002RatioAdjustmentDiagram["before"] {
  return {
    componentA: quantityText(state.componentA, context),
    componentB: quantityText(state.componentB, context),
    ratio: ratioText(stateRatio(state)),
  };
}

export function buildMalCp002Diagram(
  request: MalCp002SolveRequest,
  result: MalCp002SolveResult,
  context: MalCp002Context,
): MalCp002RatioAdjustmentDiagram {
  const base = {
    type: "RATIO_ADJUSTMENT" as const,
    title: `${context.componentALabel}–${context.componentBLabel} composition`,
    componentALabel: context.componentALabel,
    componentBLabel: context.componentBLabel,
    quantityUnit: context.quantityUnit,
  };

  switch (request.mode) {
    case "UNKNOWN_PURE_ADJUSTMENT_TO_TARGET": {
      if (result.kind !== "ADJUSTMENT_QUANTITY") throw new Error("Diagram result mismatch.");
      const changedLabel = componentLabel(context, request.changedComponent);
      const operationWord = request.adjustmentKind === "ADD" ? "Add" : "Remove";
      return {
        ...base,
        before: diagramState(request.initialState, context),
        operation: {
          stage: "PURE_COMPONENT_CHANGE",
          label: `${operationWord} pure ${changedLabel}`,
          changedComponentLabel: changedLabel,
          quantity: quantityText(result.quantity, context),
        },
        after: diagramState(result.finalState, context),
        targetRatio: ratioText(request.targetRatio),
      };
    }

    case "RESULTING_RATIO_AFTER_PURE_ADJUSTMENT": {
      if (result.kind !== "COMPONENT_RATIO") throw new Error("Diagram result mismatch.");
      const changedLabel = componentLabel(context, request.changedComponent);
      return {
        ...base,
        before: diagramState(request.initialState, context),
        operation: {
          stage: "PURE_COMPONENT_CHANGE",
          label: `${request.adjustmentKind === "ADD" ? "Add" : "Remove"} pure ${changedLabel}`,
          changedComponentLabel: changedLabel,
          quantity: quantityText(request.adjustmentQuantity, context),
        },
        after: diagramState(result.finalState, context),
      };
    }

    case "ORIGINAL_RATIO_FROM_FINAL_PURE_ADJUSTMENT": {
      if (result.kind !== "ORIGINAL_RATIO") throw new Error("Diagram result mismatch.");
      const changedLabel = componentLabel(context, request.changedComponent);
      return {
        ...base,
        before: diagramState(result.originalState, context),
        operation: {
          stage: "PURE_COMPONENT_CHANGE",
          label: `${request.adjustmentKind === "ADD" ? "Add" : "Remove"} pure ${changedLabel}`,
          changedComponentLabel: changedLabel,
          quantity: quantityText(request.adjustmentQuantity, context),
        },
        after: diagramState(request.finalState, context),
      };
    }

    case "COMPONENT_QUANTITIES_FROM_TOTAL_AND_RATIO": {
      if (result.kind !== "COMPONENT_QUANTITY_PAIR") throw new Error("Diagram result mismatch.");
      const reconstructed = {
        componentA: result.componentAQuantity,
        componentB: result.componentBQuantity,
      };
      return {
        ...base,
        before: {
          componentA: `${formatRational(request.ratio.componentAPart)} ratio parts`,
          componentB: `${formatRational(request.ratio.componentBPart)} ratio parts`,
          ratio: ratioText(request.ratio),
        },
        operation: {
          stage: "PARTITION",
          label: `Partition ${quantityText(request.totalQuantity, context)} by ratio parts`,
        },
        after: diagramState(reconstructed, context),
        targetRatio: ratioText(request.ratio),
      };
    }

    case "UNKNOWN_SINGLE_REPLACEMENT_TO_TARGET": {
      if (result.kind !== "SINGLE_REPLACEMENT_QUANTITY") throw new Error("Diagram result mismatch.");
      const replacementLabel = componentLabel(
        context,
        request.replacementComponent,
      );
      return {
        ...base,
        before: diagramState(request.initialState, context),
        operation: {
          stage: "HOMOGENEOUS_REMOVE_REFILL",
          label: `Remove mixed sample; refill with pure ${replacementLabel}`,
          changedComponentLabel: replacementLabel,
          quantity: quantityText(result.quantity, context),
        },
        after: diagramState(result.finalState, context),
        targetRatio: ratioText(request.targetRatio),
      };
    }
  }
}

export function buildMalCp002ReasoningGraph(
  request: MalCp002SolveRequest,
  result: MalCp002SolveResult,
  context: MalCp002Context,
): MalReasoningGraph {
  const answer = formatMalCp002Answer(result, context);
  const givenText =
    request.mode === "COMPONENT_QUANTITIES_FROM_TOTAL_AND_RATIO"
      ? `Total ${quantityText(request.totalQuantity, context)} with ratio ${ratioText(
          request.ratio,
        )}.`
      : request.mode === "ORIGINAL_RATIO_FROM_FINAL_PURE_ADJUSTMENT"
        ? `Given final state: ${stateText(request.finalState, context)}.`
        : `Given initial state: ${stateText(request.initialState, context)}.`;

  const invariantText =
    request.mode === "UNKNOWN_SINGLE_REPLACEMENT_TO_TARGET"
      ? "A homogeneous removal retains both original components in the same fraction before pure refill."
      : request.mode === "COMPONENT_QUANTITIES_FROM_TOTAL_AND_RATIO"
        ? "The total is partitioned in proportion to the stated ratio parts."
        : `Only ${componentLabel(
            context,
            request.changedComponent,
          )} changes; the counterpart component is conserved.`;

  return {
    nodes: [
      {
        id: "given-state",
        kind: "GIVEN",
        text: givenText,
        dependsOn: [],
      },
      {
        id: "decisive-invariant",
        kind: "RELATION",
        text: invariantText,
        dependsOn: ["given-state"],
      },
      {
        id: "solve-request",
        kind: "DERIVATION",
        text: `Solve the exact ${request.mode.toLowerCase().replaceAll("_", " ")} relation.`,
        dependsOn: ["decisive-invariant"],
      },
      {
        id: "verify-state",
        kind: "VERIFICATION",
        text:
          result.kind === "COMPONENT_QUANTITY_PAIR"
            ? "Check that the two quantities sum to the stated total and reduce to the stated ratio."
            : result.kind === "ORIGINAL_RATIO"
              ? "Replay the stated operation and confirm that it reproduces the given final state."
              : "Reconstruct the resulting component state and confirm the requested ratio.",
        dependsOn: ["solve-request"],
      },
      {
        id: "conclusion",
        kind: "CONCLUSION",
        text: `The required answer is ${answer}.`,
        dependsOn: ["verify-state"],
      },
    ],
  };
}
