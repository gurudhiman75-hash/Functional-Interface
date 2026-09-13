import type { KnowledgeFactSource } from "../../types";

export const POL_CP001_SOURCES_V1: readonly KnowledgeFactSource[] = Object.freeze([
  { sourceId: "STATUTE-REGULATING-ACT-1773", sourceType: "statute", title: "Regulating Act, 1773", locator: "Historical statute: East India Company administration" },
  { sourceId: "STATUTE-PITTS-INDIA-ACT-1784", sourceType: "statute", title: "Pitt's India Act, 1784", locator: "Historical statute: Board of Control and Company government" },
  { sourceId: "STATUTE-CHARTER-ACT-1793", sourceType: "statute", title: "Charter Act, 1793", locator: "Historical statute: renewal of the East India Company charter" },
  { sourceId: "STATUTE-CHARTER-ACT-1813", sourceType: "statute", title: "Charter Act, 1813", locator: "Historical statute: East India Company trade and charter" },
  { sourceId: "STATUTE-CHARTER-ACT-1833", sourceType: "statute", title: "Charter Act, 1833", locator: "Historical statute: government and legislation in British India" },
  { sourceId: "STATUTE-CHARTER-ACT-1853", sourceType: "statute", title: "Charter Act, 1853", locator: "Historical statute: Governor-General's Council and Company government" },
  { sourceId: "STATUTE-GOVERNMENT-OF-INDIA-ACT-1858", sourceType: "statute", title: "Government of India Act, 1858", locator: "Historical statute: transfer of government from Company to Crown" },
  { sourceId: "STATUTE-INDIAN-COUNCILS-ACT-1861", sourceType: "statute", title: "Indian Councils Act, 1861", locator: "Historical statute: legislative councils" },
  { sourceId: "STATUTE-INDIAN-COUNCILS-ACT-1892", sourceType: "statute", title: "Indian Councils Act, 1892", locator: "Historical statute: legislative councils" },
  { sourceId: "STATUTE-INDIAN-COUNCILS-ACT-1909", sourceType: "statute", title: "Indian Councils Act, 1909", locator: "Historical statute: Morley-Minto constitutional reforms" },
  { sourceId: "STATUTE-GOVERNMENT-OF-INDIA-ACT-1919", sourceType: "statute", title: "Government of India Act, 1919", locator: "Historical statute: Montagu-Chelmsford constitutional reforms" },
  { sourceId: "STATUTE-GOVERNMENT-OF-INDIA-ACT-1935", sourceType: "statute", title: "Government of India Act, 1935", locator: "Historical statute: federation, provincial autonomy and legislative lists", url: "https://www.legislation.gov.uk/ukpga/Geo5and1Edw8/26/2/contents" },
  { sourceId: "STATUTE-INDIAN-INDEPENDENCE-ACT-1947", sourceType: "statute", title: "Indian Independence Act, 1947", locator: "Historical statute: creation of the independent Dominions", url: "https://www.legislation.gov.uk/ukpga/Geo6/10-11/30/contents" },
]);

export const POL_CP001_SOURCE_IDS_V1 = Object.freeze(
  POL_CP001_SOURCES_V1.map((source) => source.sourceId),
);
