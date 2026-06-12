import { readSimpl001LibraryJson } from "./package-registry";
import type {
  ExplanationLibrary,
  FlattenedExplanationEntry,
  RenderParameters,
  SimplCpId,
  SimplExplanationId,
} from "./types";

const EXPLANATION_LIBRARY = readSimpl001LibraryJson<ExplanationLibrary>(
  "explanation.library.json",
);

function flattenExplanations(): FlattenedExplanationEntry[] {
  return EXPLANATION_LIBRARY.families.flatMap((family) =>
    family.entries.flatMap((entry) =>
      family.appliesTo.map((cpId) => ({
        ...entry,
        cpId,
        familyId: family.familyId,
        familyName: family.name,
        ownership: EXPLANATION_LIBRARY.ownership,
        sourceAuthority: EXPLANATION_LIBRARY.sourceAuthority,
      })),
    ),
  );
}

export const EXPLANATION_ENTRIES = flattenExplanations();

export function selectExplanationByEsId(
  esId: SimplExplanationId,
): FlattenedExplanationEntry {
  const item = EXPLANATION_ENTRIES.find((entry) => entry.id === esId);
  if (!item) {
    throw new Error(`Unknown SIMPL-001 explanation id: ${esId}`);
  }
  return item;
}

export function selectExplanationByCp(
  cpId: SimplCpId,
): FlattenedExplanationEntry {
  const item = EXPLANATION_ENTRIES.find((entry) => entry.cpId === cpId);
  if (!item) {
    throw new Error(`No SIMPL-001 explanation is linked to CP id: ${cpId}`);
  }
  return item;
}

export function selectExplanationTextByEsId(esId: SimplExplanationId): string {
  return selectExplanationByEsId(esId).text;
}

export function renderApprovedExplanation(
  esId: SimplExplanationId,
  parameters: RenderParameters,
): string {
  const explanation = selectExplanationTextByEsId(esId);
  return substituteApprovedParameters(explanation, parameters);
}

function substituteApprovedParameters(
  template: string,
  parameters: RenderParameters,
): string {
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key: string) => {
    const value = parameters[key];
    if (value === undefined) {
      throw new Error(`Missing SIMPL-001 explanation render parameter: ${key}`);
    }
    return String(value);
  });
}
