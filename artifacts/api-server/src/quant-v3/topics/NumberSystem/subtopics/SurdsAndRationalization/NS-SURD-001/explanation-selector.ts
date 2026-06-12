import { readNsSurd001LibraryJson } from "./package-registry";
import type {
  ExplanationItem,
  ExplanationLibrary,
  SurdCpId,
  SurdExplanationId,
} from "./types";

const EXPLANATION_LIBRARY = readNsSurd001LibraryJson<ExplanationLibrary>(
  "explanation.library.json",
);

export function selectExplanationByEsId(
  esId: SurdExplanationId,
): ExplanationItem {
  const item = EXPLANATION_LIBRARY.items.find((entry) => entry.id === esId);
  if (!item) {
    throw new Error(`Unknown NS-SURD-001 explanation id: ${esId}`);
  }
  return item;
}

export function selectExplanationByCp(cpId: SurdCpId): ExplanationItem {
  const item = EXPLANATION_LIBRARY.items.find((entry) => entry.cpId === cpId);
  if (!item) {
    throw new Error(`No NS-SURD-001 explanation is linked to CP id: ${cpId}`);
  }
  return item;
}

export function selectExplanationTextByEsId(esId: SurdExplanationId): string {
  return selectExplanationByEsId(esId).explanation;
}
