import type {
  IopAdvancedActionTrace,
  IopAdvancedOperation,
  IopAdvancedProgram,
  IopAdvancedSelectionKey,
  IopAdvancedStep,
  IopAdvancedToken,
  IopAdvancedTrace,
  IopAdvancedTransform,
} from "./advanced-types.ts";

function numericValue(value: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error(`Expected numeric value, received ${value}`);
  return parsed;
}

function digitSum(value: string): number {
  return [...String(Math.abs(numericValue(value)))].reduce((sum, digit) => sum + Number(digit), 0);
}

function vowelCount(value: string): number {
  return [...value.toLowerCase()].filter((letter) => "aeiou".includes(letter)).length;
}

function selectionValue(token: IopAdvancedToken, key: IopAdvancedSelectionKey): string | number {
  if (key === "ALPHABETICAL") return token.visibleValue.toLowerCase();
  if (key === "NUMERIC_VALUE") return numericValue(token.visibleValue);
  if (key === "WORD_LENGTH") return token.visibleValue.length;
  if (key === "VOWEL_COUNT") return vowelCount(token.visibleValue);
  if (key === "DIGIT_SUM") return digitSum(token.visibleValue);
  return Math.abs(numericValue(token.visibleValue)) % 10;
}

function compareByKey(
  first: IopAdvancedToken,
  second: IopAdvancedToken,
  key: IopAdvancedSelectionKey,
  direction: "ASC" | "DESC",
): number {
  const a = selectionValue(first, key);
  const b = selectionValue(second, key);
  let result: number;
  if (typeof a === "number" && typeof b === "number") result = a - b;
  else result = String(a).localeCompare(String(b), "en", { sensitivity: "base" });
  if (result === 0) result = first.visibleValue.localeCompare(second.visibleValue, "en", { sensitivity: "base" });
  if (result === 0) result = first.id.localeCompare(second.id);
  return direction === "ASC" ? result : -result;
}

export function advancedStateFingerprint(tokens: readonly IopAdvancedToken[]): string {
  return tokens.map((token) => `${token.id}:${token.visibleValue}`).join("|");
}

function operationFingerprint(operation: IopAdvancedOperation): string {
  if (operation.kind === "ITERATIVE_MOVE") {
    return [operation.kind, operation.eligibleKind, operation.selectionKey, operation.direction, operation.placement].join(":");
  }
  if (operation.kind === "TRANSFORM_ALL") return [operation.kind, operation.eligibleKind, operation.transform].join(":");
  if (operation.kind === "SORT_ALL") {
    return [operation.kind, operation.eligibleKind, operation.selectionKey, operation.direction].join(":");
  }
  if (operation.kind === "PAIR_REWRITE") return [operation.kind, operation.rewrite].join(":");
  return operation.kind;
}

export function advancedProgramFingerprint(program: IopAdvancedProgram): string {
  return [program.layout, ...program.operations.map(operationFingerprint)].join("|");
}

function reverseText(value: string): string {
  return [...value].reverse().join("");
}

function transformValue(value: string, transform: IopAdvancedTransform): string {
  if (transform === "REVERSE_DIGITS") return String(Number(reverseText(value)));
  if (transform === "ADD_DIGIT_SUM") return String(numericValue(value) + digitSum(value));
  if (transform === "REVERSE_WORD" || transform === "REVERSE_ALPHANUMERIC") return reverseText(value);
  if (transform === "SWAP_WORD_ENDS") {
    if (value.length < 2) return value;
    return `${value.at(-1)}${value.slice(1, -1)}${value[0]}`;
  }
  if (transform === "ROTATE_WORD_LEFT" || transform === "ROTATE_ALPHANUMERIC_LEFT") {
    if (value.length < 2) return value;
    return `${value.slice(1)}${value[0]}`;
  }
  const exhaustive: never = transform;
  return exhaustive;
}

function cloneWithValue(token: IopAdvancedToken, visibleValue: string): IopAdvancedToken {
  return { ...token, visibleValue };
}

function appendStep(
  steps: IopAdvancedStep[],
  operation: IopAdvancedOperation,
  tokens: readonly IopAdvancedToken[],
  actions: readonly IopAdvancedActionTrace[],
  priorFingerprint: string,
): string {
  const fingerprint = advancedStateFingerprint(tokens);
  if (fingerprint === priorFingerprint) return priorFingerprint;
  steps.push({
    stepNumber: steps.length + 1,
    operationId: operation.id,
    operationKind: operation.kind,
    tokens: [...tokens],
    actions: [...actions],
    stateFingerprint: fingerprint,
  });
  return fingerprint;
}

function executeIterativeMove(
  operation: Extract<IopAdvancedOperation, { readonly kind: "ITERATIVE_MOVE" }>,
  mutable: IopAdvancedToken[],
  steps: IopAdvancedStep[],
  startingFingerprint: string,
): string {
  const fixed = new Set<string>();
  let leftFixed = 0;
  let rightFixed = 0;
  let fingerprint = startingFingerprint;
  const eligibleCount = mutable.filter((token) => token.kind === operation.eligibleKind).length;

  while (fixed.size < Math.max(0, eligibleCount - 1)) {
    const selected = mutable
      .filter((token) => token.kind === operation.eligibleKind && !fixed.has(token.id))
      .sort((a, b) => compareByKey(a, b, operation.selectionKey, operation.direction))[0];
    if (!selected) break;
    const fromIndex = mutable.findIndex((token) => token.id === selected.id);
    mutable.splice(fromIndex, 1);
    const toIndex = operation.placement === "LEFT_FIXED" ? leftFixed : mutable.length - rightFixed;
    mutable.splice(toIndex, 0, selected);
    if (operation.placement === "LEFT_FIXED") leftFixed += 1;
    else rightFixed += 1;
    fixed.add(selected.id);
    const action: IopAdvancedActionTrace = {
      operationId: operation.id,
      operationKind: operation.kind,
      tokenIds: [selected.id],
      beforeValues: [selected.visibleValue],
      afterValues: [selected.visibleValue],
    };
    fingerprint = appendStep(steps, operation, mutable, [action], fingerprint);
  }
  return fingerprint;
}

function executeTransformAll(
  operation: Extract<IopAdvancedOperation, { readonly kind: "TRANSFORM_ALL" }>,
  mutable: IopAdvancedToken[],
  steps: IopAdvancedStep[],
  startingFingerprint: string,
): string {
  const ids: string[] = [];
  const before: string[] = [];
  const after: string[] = [];
  for (let index = 0; index < mutable.length; index += 1) {
    const token = mutable[index]!;
    if (token.kind !== operation.eligibleKind) continue;
    const transformed = transformValue(token.visibleValue, operation.transform);
    ids.push(token.id);
    before.push(token.visibleValue);
    after.push(transformed);
    mutable[index] = cloneWithValue(token, transformed);
  }
  const action: IopAdvancedActionTrace = {
    operationId: operation.id,
    operationKind: operation.kind,
    tokenIds: ids,
    beforeValues: before,
    afterValues: after,
  };
  return appendStep(steps, operation, mutable, [action], startingFingerprint);
}

function executeSortAll(
  operation: Extract<IopAdvancedOperation, { readonly kind: "SORT_ALL" }>,
  mutable: IopAdvancedToken[],
  steps: IopAdvancedStep[],
  startingFingerprint: string,
): string {
  const indexes = mutable.flatMap((token, index) => token.kind === operation.eligibleKind ? [index] : []);
  const sorted = indexes.map((index) => mutable[index]!).sort((a, b) => compareByKey(a, b, operation.selectionKey, operation.direction));
  for (let offset = 0; offset < indexes.length; offset += 1) mutable[indexes[offset]!] = sorted[offset]!;
  const action: IopAdvancedActionTrace = {
    operationId: operation.id,
    operationKind: operation.kind,
    tokenIds: sorted.map((token) => token.id),
    beforeValues: [],
    afterValues: sorted.map((token) => token.visibleValue),
  };
  return appendStep(steps, operation, mutable, [action], startingFingerprint);
}

function executePairRewrite(
  operation: Extract<IopAdvancedOperation, { readonly kind: "PAIR_REWRITE" }>,
  mutable: IopAdvancedToken[],
  steps: IopAdvancedStep[],
  startingFingerprint: string,
): string {
  const actions: IopAdvancedActionTrace[] = [];
  for (let index = 0; index + 1 < mutable.length; index += 2) {
    const first = mutable[index]!;
    const second = mutable[index + 1]!;
    if (first.kind !== "NUMBER" || second.kind !== "NUMBER") throw new Error("PAIR_REWRITE requires numeric cells");
    const a = numericValue(first.visibleValue);
    const b = numericValue(second.visibleValue);
    const nextFirst = String(a + b);
    const nextSecond = String(Math.abs(a - b));
    mutable[index] = cloneWithValue(first, nextFirst);
    mutable[index + 1] = cloneWithValue(second, nextSecond);
    actions.push({
      operationId: operation.id,
      operationKind: operation.kind,
      tokenIds: [first.id, second.id],
      beforeValues: [first.visibleValue, second.visibleValue],
      afterValues: [nextFirst, nextSecond],
    });
  }
  return appendStep(steps, operation, mutable, actions, startingFingerprint);
}

function executeSwapPairs(
  operation: Extract<IopAdvancedOperation, { readonly kind: "SWAP_ADJACENT_PAIRS" }>,
  mutable: IopAdvancedToken[],
  steps: IopAdvancedStep[],
  startingFingerprint: string,
): string {
  const actions: IopAdvancedActionTrace[] = [];
  for (let index = 0; index + 1 < mutable.length; index += 2) {
    const first = mutable[index]!;
    const second = mutable[index + 1]!;
    mutable[index] = second;
    mutable[index + 1] = first;
    actions.push({
      operationId: operation.id,
      operationKind: operation.kind,
      tokenIds: [first.id, second.id],
      beforeValues: [first.visibleValue, second.visibleValue],
      afterValues: [second.visibleValue, first.visibleValue],
    });
  }
  return appendStep(steps, operation, mutable, actions, startingFingerprint);
}

export function executeAdvancedProgram(program: IopAdvancedProgram, input: readonly IopAdvancedToken[]): IopAdvancedTrace {
  if (input.length < 4) throw new Error("Advanced IOP machines require at least four tokens");
  const mutable = [...input];
  const steps: IopAdvancedStep[] = [];
  let fingerprint = advancedStateFingerprint(mutable);

  for (const operation of program.operations) {
    if (operation.kind === "ITERATIVE_MOVE") fingerprint = executeIterativeMove(operation, mutable, steps, fingerprint);
    else if (operation.kind === "TRANSFORM_ALL") fingerprint = executeTransformAll(operation, mutable, steps, fingerprint);
    else if (operation.kind === "SORT_ALL") fingerprint = executeSortAll(operation, mutable, steps, fingerprint);
    else if (operation.kind === "PAIR_REWRITE") fingerprint = executePairRewrite(operation, mutable, steps, fingerprint);
    else if (operation.kind === "SWAP_ADJACENT_PAIRS") fingerprint = executeSwapPairs(operation, mutable, steps, fingerprint);
    else {
      const before = [...mutable];
      mutable.reverse();
      const action: IopAdvancedActionTrace = {
        operationId: operation.id,
        operationKind: operation.kind,
        tokenIds: before.map((token) => token.id),
        beforeValues: before.map((token) => token.visibleValue),
        afterValues: mutable.map((token) => token.visibleValue),
      };
      fingerprint = appendStep(steps, operation, mutable, [action], fingerprint);
    }
  }

  const stateFingerprints = [advancedStateFingerprint(input), ...steps.map((step) => step.stateFingerprint)];
  if (new Set(stateFingerprints).size !== stateFingerprints.length) throw new Error(`Program ${program.id} emitted a duplicate visible state`);
  const final = steps.length ? steps.at(-1)!.tokens : [...input];
  return {
    layout: program.layout,
    input: [...input],
    steps,
    final: [...final],
    finalFingerprint: advancedStateFingerprint(final),
    programFingerprint: advancedProgramFingerprint(program),
  };
}

export function renderAdvancedRow(tokens: readonly IopAdvancedToken[], layout: IopAdvancedProgram["layout"]): string {
  if (layout === "BOX_ROW") return tokens.map((token) => `[ ${token.visibleValue} ]`).join("  ");
  if (layout === "TABLE_2XN") {
    const midpoint = Math.ceil(tokens.length / 2);
    const top = tokens.slice(0, midpoint).map((token) => token.visibleValue).join(" | ");
    const bottom = tokens.slice(midpoint).map((token) => token.visibleValue).join(" | ");
    return `${top} / ${bottom}`;
  }
  return tokens.map((token) => token.visibleValue).join("  ");
}
