import { advancedProgramFingerprint, executeAdvancedProgram } from "./advanced-engine.ts";
import { IOP_ADVANCED_PROTOTYPES } from "./advanced-prototypes.ts";
import type {
  IopAdvancedIdentifiabilityEvidence,
  IopAdvancedOperation,
  IopAdvancedProgram,
  IopAdvancedSelectionKey,
  IopAdvancedTrace,
  IopAdvancedTransform,
} from "./advanced-types.ts";

function selectionKeysFor(operation: Extract<IopAdvancedOperation, { kind: "ITERATIVE_MOVE" | "SORT_ALL" }>): readonly IopAdvancedSelectionKey[] {
  if (operation.eligibleKind === "NUMBER") return ["NUMERIC_VALUE", "DIGIT_SUM", "LAST_DIGIT"];
  if (operation.eligibleKind === "WORD") return ["ALPHABETICAL", "WORD_LENGTH", "VOWEL_COUNT"];
  return ["ALPHABETICAL"];
}

function transformsFor(operation: Extract<IopAdvancedOperation, { kind: "TRANSFORM_ALL" }>): readonly IopAdvancedTransform[] {
  if (operation.eligibleKind === "NUMBER") return ["REVERSE_DIGITS", "ADD_DIGIT_SUM"];
  if (operation.eligibleKind === "WORD") return ["REVERSE_WORD", "SWAP_WORD_ENDS", "ROTATE_WORD_LEFT"];
  return ["REVERSE_ALPHANUMERIC", "ROTATE_ALPHANUMERIC_LEFT"];
}

function withOperation(program: IopAdvancedProgram, index: number, operation: IopAdvancedOperation, suffix: string): IopAdvancedProgram {
  const operations = [...program.operations];
  operations[index] = operation;
  return { ...program, id: `${program.id}|ALT-${index}-${suffix}`, operations };
}

function localMutations(program: IopAdvancedProgram): IopAdvancedProgram[] {
  const alternatives: IopAdvancedProgram[] = [];
  program.operations.forEach((operation, index) => {
    if (operation.kind === "ITERATIVE_MOVE") {
      alternatives.push(withOperation(program, index, { ...operation, direction: operation.direction === "ASC" ? "DESC" : "ASC" }, "DIR"));
      alternatives.push(withOperation(program, index, { ...operation, placement: operation.placement === "LEFT_FIXED" ? "RIGHT_FIXED" : "LEFT_FIXED" }, "PLACE"));
      for (const key of selectionKeysFor(operation)) {
        if (key !== operation.selectionKey) alternatives.push(withOperation(program, index, { ...operation, selectionKey: key }, `KEY-${key}`));
      }
    } else if (operation.kind === "TRANSFORM_ALL") {
      for (const transform of transformsFor(operation)) {
        if (transform !== operation.transform) alternatives.push(withOperation(program, index, { ...operation, transform }, `TRANSFORM-${transform}`));
      }
    } else if (operation.kind === "SORT_ALL") {
      alternatives.push(withOperation(program, index, { ...operation, direction: operation.direction === "ASC" ? "DESC" : "ASC" }, "DIR"));
      for (const key of selectionKeysFor(operation)) {
        if (key !== operation.selectionKey) alternatives.push(withOperation(program, index, { ...operation, selectionKey: key }, `KEY-${key}`));
      }
    } else if (operation.kind === "SWAP_ADJACENT_PAIRS") {
      alternatives.push(withOperation(program, index, { id: operation.id, kind: "REVERSE_ORDER" }, "SWAP-TO-REVERSE"));
    } else if (operation.kind === "REVERSE_ORDER") {
      alternatives.push(withOperation(program, index, { id: operation.id, kind: "SWAP_ADJACENT_PAIRS" }, "REVERSE-TO-SWAP"));
    }
  });

  if (program.operations.length > 1) {
    const reversed = [...program.operations].reverse().map((operation, index) => ({ ...operation, id: `R${index + 1}` })) as IopAdvancedOperation[];
    alternatives.push({ ...program, id: `${program.id}|ALT-REVERSED-PIPELINE`, operations: reversed });
  }
  return alternatives;
}

export function buildAdvancedCompetingPrograms(intended: IopAdvancedProgram): readonly IopAdvancedProgram[] {
  const candidates = [
    intended,
    ...IOP_ADVANCED_PROTOTYPES.map((authority) => authority.program),
    ...localMutations(intended),
  ];
  const byFingerprint = new Map<string, IopAdvancedProgram>();
  for (const candidate of candidates) byFingerprint.set(advancedProgramFingerprint(candidate), candidate);
  return [...byFingerprint.values()];
}

function sameVisibleTrace(first: IopAdvancedTrace, second: IopAdvancedTrace): boolean {
  if (first.layout !== second.layout || first.steps.length !== second.steps.length) return false;
  if (first.input.map((token) => token.visibleValue).join("|") !== second.input.map((token) => token.visibleValue).join("|")) return false;
  for (let index = 0; index < first.steps.length; index += 1) {
    const a = first.steps[index]!.tokens.map((token) => token.visibleValue).join("|");
    const b = second.steps[index]!.tokens.map((token) => token.visibleValue).join("|");
    if (a !== b) return false;
  }
  return true;
}

export function evaluateAdvancedIdentifiability(
  intended: IopAdvancedProgram,
  visibleTrace: IopAdvancedTrace,
): IopAdvancedIdentifiabilityEvidence {
  const matching = new Set<string>();
  const candidates = buildAdvancedCompetingPrograms(intended);
  for (const candidate of candidates) {
    try {
      const candidateTrace = executeAdvancedProgram(candidate, visibleTrace.input);
      if (sameVisibleTrace(candidateTrace, visibleTrace)) matching.add(advancedProgramFingerprint(candidate));
    } catch {
      // Invalid alternative on this domain cannot explain the illustration.
    }
  }
  const intendedFingerprint = advancedProgramFingerprint(intended);
  const matchingProgramFingerprints = [...matching].sort();
  return {
    candidateProgramsTested: candidates.length,
    matchingProgramFingerprints,
    intendedProgramFingerprint: intendedFingerprint,
    passed: matchingProgramFingerprints.length === 1 && matchingProgramFingerprints[0] === intendedFingerprint,
  };
}
