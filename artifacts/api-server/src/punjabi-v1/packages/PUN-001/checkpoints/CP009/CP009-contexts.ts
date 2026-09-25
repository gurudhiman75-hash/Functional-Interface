import { CP009_CONTEXT_AUTHORITIES } from "./CP009-authorities";
import { CP009_CONTEXT_EXPANSION_A } from "./CP009-context-expansion-a";
import { CP009_CONTEXT_EXPANSION_B } from "./CP009-context-expansion-b";

export const CP009_ALL_CONTEXT_AUTHORITIES = Object.freeze([
  ...CP009_CONTEXT_AUTHORITIES,
  ...CP009_CONTEXT_EXPANSION_A,
  ...CP009_CONTEXT_EXPANSION_B,
]);
