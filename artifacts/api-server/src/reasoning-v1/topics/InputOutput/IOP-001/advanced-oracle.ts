import type {
  IopAdvancedOperation,
  IopAdvancedProgram,
  IopAdvancedSelectionKey,
  IopAdvancedToken,
  IopAdvancedTrace,
  IopAdvancedTransform,
} from "./advanced-types.ts";

function n(value: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error(`Oracle expected a number, received ${value}`);
  return parsed;
}

function ds(value: string): number {
  return [...String(Math.abs(n(value)))].reduce((sum, digit) => sum + Number(digit), 0);
}

function vc(value: string): number {
  return [...value.toLowerCase()].reduce((count, letter) => count + ("aeiou".includes(letter) ? 1 : 0), 0);
}

function metric(token: IopAdvancedToken, key: IopAdvancedSelectionKey): string | number {
  switch (key) {
    case "ALPHABETICAL": return token.visibleValue.toLowerCase();
    case "NUMERIC_VALUE": return n(token.visibleValue);
    case "WORD_LENGTH": return token.visibleValue.length;
    case "VOWEL_COUNT": return vc(token.visibleValue);
    case "DIGIT_SUM": return ds(token.visibleValue);
    case "LAST_DIGIT": return Math.abs(n(token.visibleValue)) % 10;
  }
}

function cmp(a: IopAdvancedToken, b: IopAdvancedToken, key: IopAdvancedSelectionKey, direction: "ASC" | "DESC"): number {
  const first = metric(a, key);
  const second = metric(b, key);
  let result = typeof first === "number" && typeof second === "number"
    ? first - second
    : String(first).localeCompare(String(second), "en", { sensitivity: "base" });
  if (result === 0) result = a.visibleValue.localeCompare(b.visibleValue, "en", { sensitivity: "base" });
  if (result === 0) result = a.id.localeCompare(b.id);
  return direction === "ASC" ? result : -result;
}

function reverse(value: string): string {
  return Array.from(value).reverse().join("");
}

function mutate(value: string, transform: IopAdvancedTransform): string {
  switch (transform) {
    case "REVERSE_DIGITS": return String(Number(reverse(value)));
    case "ADD_DIGIT_SUM": return String(n(value) + ds(value));
    case "REVERSE_WORD": return reverse(value);
    case "SWAP_WORD_ENDS": return value.length < 2 ? value : `${value[value.length - 1]}${value.slice(1, -1)}${value[0]}`;
    case "ROTATE_WORD_LEFT": return value.length < 2 ? value : `${value.slice(1)}${value[0]}`;
    case "REVERSE_ALPHANUMERIC": return reverse(value);
    case "ROTATE_ALPHANUMERIC_LEFT": return value.length < 2 ? value : `${value.slice(1)}${value[0]}`;
  }
}

function fp(tokens: readonly IopAdvancedToken[]): string {
  return tokens.map((token) => `${token.id}:${token.visibleValue}`).join("|");
}

function opFp(operation: IopAdvancedOperation): string {
  if (operation.kind === "ITERATIVE_MOVE") return [operation.kind, operation.eligibleKind, operation.selectionKey, operation.direction, operation.placement].join(":");
  if (operation.kind === "TRANSFORM_ALL") return [operation.kind, operation.eligibleKind, operation.transform].join(":");
  if (operation.kind === "SORT_ALL") return [operation.kind, operation.eligibleKind, operation.selectionKey, operation.direction].join(":");
  if (operation.kind === "PAIR_REWRITE") return `${operation.kind}:${operation.rewrite}`;
  return operation.kind;
}

function programFp(program: IopAdvancedProgram): string {
  return [program.layout, ...program.operations.map(opFp)].join("|");
}

export interface IopAdvancedOracleTrace {
  readonly stateFingerprints: readonly string[];
  readonly finalFingerprint: string;
  readonly programFingerprint: string;
}

export function reconstructAdvancedTraceOracle(program: IopAdvancedProgram, input: readonly IopAdvancedToken[]): IopAdvancedOracleTrace {
  const row = input.map((token) => ({ ...token }));
  const states: string[] = [];
  let prior = fp(row);

  const emit = (): void => {
    const next = fp(row);
    if (next !== prior) {
      states.push(next);
      prior = next;
    }
  };

  for (const operation of program.operations) {
    if (operation.kind === "ITERATIVE_MOVE") {
      const fixed = new Set<string>();
      let left = 0;
      let right = 0;
      const eligible = row.filter((token) => token.kind === operation.eligibleKind).length;
      while (fixed.size < Math.max(0, eligible - 1)) {
        const selected = row
          .filter((token) => token.kind === operation.eligibleKind && !fixed.has(token.id))
          .sort((a, b) => cmp(a, b, operation.selectionKey, operation.direction))[0];
        if (!selected) break;
        const from = row.findIndex((token) => token.id === selected.id);
        row.splice(from, 1);
        const to = operation.placement === "LEFT_FIXED" ? left : row.length - right;
        row.splice(to, 0, selected);
        if (operation.placement === "LEFT_FIXED") left += 1;
        else right += 1;
        fixed.add(selected.id);
        emit();
      }
      continue;
    }

    if (operation.kind === "TRANSFORM_ALL") {
      for (let index = 0; index < row.length; index += 1) {
        const token = row[index]!;
        if (token.kind === operation.eligibleKind) row[index] = { ...token, visibleValue: mutate(token.visibleValue, operation.transform) };
      }
      emit();
      continue;
    }

    if (operation.kind === "SORT_ALL") {
      const indexes = row.flatMap((token, index) => token.kind === operation.eligibleKind ? [index] : []);
      const ordered = indexes.map((index) => row[index]!).sort((a, b) => cmp(a, b, operation.selectionKey, operation.direction));
      indexes.forEach((index, offset) => { row[index] = ordered[offset]!; });
      emit();
      continue;
    }

    if (operation.kind === "PAIR_REWRITE") {
      for (let index = 0; index + 1 < row.length; index += 2) {
        const first = row[index]!;
        const second = row[index + 1]!;
        const a = n(first.visibleValue);
        const b = n(second.visibleValue);
        row[index] = { ...first, visibleValue: String(a + b) };
        row[index + 1] = { ...second, visibleValue: String(Math.abs(a - b)) };
      }
      emit();
      continue;
    }

    if (operation.kind === "SWAP_ADJACENT_PAIRS") {
      for (let index = 0; index + 1 < row.length; index += 2) {
        const first = row[index]!;
        row[index] = row[index + 1]!;
        row[index + 1] = first;
      }
      emit();
      continue;
    }

    row.reverse();
    emit();
  }

  return { stateFingerprints: states, finalFingerprint: fp(row), programFingerprint: programFp(program) };
}

export function assertAdvancedOracleParity(production: IopAdvancedTrace, oracle: IopAdvancedOracleTrace): void {
  const productionStates = production.steps.map((step) => step.stateFingerprint);
  if (productionStates.length !== oracle.stateFingerprints.length) throw new Error("Advanced oracle step-count mismatch");
  for (let index = 0; index < productionStates.length; index += 1) {
    if (productionStates[index] !== oracle.stateFingerprints[index]) throw new Error(`Advanced oracle mismatch at Step ${index + 1}`);
  }
  if (production.finalFingerprint !== oracle.finalFingerprint) throw new Error("Advanced oracle final-state mismatch");
  if (production.programFingerprint !== oracle.programFingerprint) throw new Error("Advanced oracle program-fingerprint mismatch");
}
