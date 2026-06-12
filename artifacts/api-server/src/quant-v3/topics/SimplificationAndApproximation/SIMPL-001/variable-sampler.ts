import { readSimpl001LibraryJson } from "./package-registry";
import type { VariableRangesLibrary } from "./types";

const VARIABLE_RANGES_LIBRARY = readSimpl001LibraryJson<VariableRangesLibrary>(
  "variable-ranges.library.json",
);

export function getVariableRangesLibrary(): VariableRangesLibrary {
  return VARIABLE_RANGES_LIBRARY;
}

export function selectVariableRangeDefinition(variableName: string): unknown {
  const definition = VARIABLE_RANGES_LIBRARY.variables[variableName];
  if (definition === undefined) {
    throw new Error(`Unknown SIMPL-001 variable range: ${variableName}`);
  }
  return definition;
}

export function listVariableRangeNames(): string[] {
  return Object.keys(VARIABLE_RANGES_LIBRARY.variables);
}
