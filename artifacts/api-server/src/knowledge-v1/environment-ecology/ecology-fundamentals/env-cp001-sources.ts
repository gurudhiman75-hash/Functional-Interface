import type { KnowledgeFactSource } from "../../types";

export const ENV_CP001_SOURCES_V1: readonly KnowledgeFactSource[] = Object.freeze([
  {
    sourceId: "NCERT-BIOLOGY-XII-ORGANISMS-POPULATIONS",
    sourceType: "textbook",
    title: "NCERT Biology, Class XII — Organisms and Populations",
    locator: "Ecology; organism and environment; habitat, population and ecological relationships",
  },
  {
    sourceId: "NCERT-BIOLOGY-XII-ECOSYSTEM",
    sourceType: "textbook",
    title: "NCERT Biology, Class XII — Ecosystem",
    locator: "Ecosystem as a functional ecological unit and levels of ecological organisation",
  },
]);

export const ENV_CP001_SOURCE_IDS_V1 = Object.freeze(
  ENV_CP001_SOURCES_V1.map((source) => source.sourceId),
);
