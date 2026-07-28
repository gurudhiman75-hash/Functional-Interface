import { getCp008SemanticFact } from "./cp008-curated-facts";
import type { Cp008RenamingPair, Cp008StructuredPrompt } from "./cp008-prototype-types";

export interface Cp008MappingAudit {
  accepted: boolean;
  mappingInjective: boolean;
  identityEdges: number;
  duplicateSources: readonly string[];
  duplicateLabels: readonly string[];
  reason?: string;
}

function duplicates(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return [...repeated];
}

export function auditCp008Mapping(mapping: readonly Cp008RenamingPair[]): Cp008MappingAudit {
  const duplicateSources = duplicates(mapping.map((pair) => pair.actual));
  const duplicateLabels = duplicates(mapping.map((pair) => pair.called));
  const identityEdges = mapping.filter((pair) => pair.actual === pair.called).length;
  const mappingInjective = duplicateSources.length === 0 && duplicateLabels.length === 0;
  if (mapping.length < 4) {
    return { accepted: false, mappingInjective, identityEdges, duplicateSources, duplicateLabels, reason: "Mapping is too small" };
  }
  if (!mappingInjective) {
    return { accepted: false, mappingInjective, identityEdges, duplicateSources, duplicateLabels, reason: "Mapping must be one-to-one" };
  }
  if (identityEdges > 0) {
    return { accepted: false, mappingInjective, identityEdges, duplicateSources, duplicateLabels, reason: "Identity renaming is not allowed" };
  }
  return { accepted: true, mappingInjective: true, identityEdges: 0, duplicateSources, duplicateLabels };
}

export function renamedLabel(mapping: readonly Cp008RenamingPair[], actual: string): string {
  const pair = mapping.find((entry) => entry.actual === actual);
  if (!pair) throw new Error(`No renamed label is defined for '${actual}'`);
  return pair.called;
}

export function inverseRenamingSource(mapping: readonly Cp008RenamingPair[], called: string): string | null {
  return mapping.find((entry) => entry.called === called)?.actual ?? null;
}

export function solveCp008Prompt(prompt: Cp008StructuredPrompt): string {
  const audit = auditCp008Mapping(prompt.mapping);
  if (!audit.accepted) throw new Error(audit.reason ?? "Invalid CP-008 mapping");

  if (prompt.taskKind === "DIRECT_LABEL_QUERY") {
    if (!prompt.directTarget) throw new Error("Direct CP-008 prompt is missing its target");
    if (prompt.ordinaryAnswer !== prompt.directTarget) {
      throw new Error("Direct prompt ordinary answer must equal the stated target");
    }
    return renamedLabel(prompt.mapping, prompt.directTarget);
  }

  if (!prompt.semanticFactId) throw new Error("Semantic CP-008 prompt is missing its fact ID");
  const fact = getCp008SemanticFact(prompt.semanticFactId);
  if (fact.ordinaryAnswer !== prompt.ordinaryAnswer) {
    throw new Error(`Semantic fact answer mismatch for '${fact.factId}'`);
  }
  return renamedLabel(prompt.mapping, fact.ordinaryAnswer);
}
