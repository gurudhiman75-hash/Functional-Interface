import type { KnowledgeFactSource } from "../../types";

export type GeoPhy001SourceAuthority = {
  sourceId: string;
  title: string;
  url: string;
  sourceType: KnowledgeFactSource["sourceType"];
  supports: string[];
  verifiedOn: string;
};

export const GEO_PHY_001_SOURCE_AUTHORITIES: readonly GeoPhy001SourceAuthority[] = Object.freeze([
  {
    sourceId: "NCERT-CONTEMPORARY-INDIA-I-PHYSICAL-FEATURES",
    title: "NCERT — Contemporary India-I, Chapter 2: Physical Features of India",
    url: "https://ncert.nic.in/textbook.php",
    sourceType: "textbook",
    supports: [
      "six-major-physiographic-divisions",
      "himalayan-young-fold-mountains",
      "northern-plains-alluvial-formation",
      "peninsular-plateau-old-crystalline-tableland",
      "indian-desert-arid-sandy-plain",
      "coastal-plains-coastal-strips",
      "island-groups-arabian-sea-bay-of-bengal",
    ],
    verifiedOn: "2026-09-12",
  },
]);

export function toGeoPhy001FactSource(sourceId: string, locator: string): KnowledgeFactSource {
  const source = GEO_PHY_001_SOURCE_AUTHORITIES.find((entry) => entry.sourceId === sourceId);
  if (!source) throw new Error(`Unknown GEO-PHY-001 source authority ${sourceId}`);
  return {
    sourceId: source.sourceId,
    sourceType: source.sourceType,
    title: source.title,
    url: source.url,
    locator,
  };
}
