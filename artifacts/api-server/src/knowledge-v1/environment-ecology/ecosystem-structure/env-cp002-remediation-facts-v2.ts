export type EnvCp002RemediationFactV2 = {
  id: string;
  statement: string;
  sourceIds: readonly string[];
};

const NIOS_ECOLOGY = "NIOS-PRINCIPLES-OF-ECOLOGY-LESSON-4";

export const ENV_CP002_REMEDIATION_FACTS_V2: readonly EnvCp002RemediationFactV2[] = Object.freeze([
  { id: "env-cp002-v2-succession", statement: "Ecological succession is the sequence of community changes in an area over time.", sourceIds: [NIOS_ECOLOGY] },
  { id: "env-cp002-v2-primary", statement: "Primary succession begins on a surface where a developed soil and established biological community are initially absent.", sourceIds: [NIOS_ECOLOGY] },
  { id: "env-cp002-v2-secondary", statement: "Secondary succession begins after disturbance where a previous community existed and soil is generally already present.", sourceIds: [NIOS_ECOLOGY] },
  { id: "env-cp002-v2-rate", statement: "Primary succession is generally slower than secondary succession because soil formation may first be required.", sourceIds: [NIOS_ECOLOGY] },
  { id: "env-cp002-v2-pioneer", statement: "The first community to colonise a bare or newly available area is the pioneer community.", sourceIds: [NIOS_ECOLOGY] },
  { id: "env-cp002-v2-climax", statement: "In the classical succession model, the terminal relatively stable mature community is called the climax community.", sourceIds: [NIOS_ECOLOGY] },
]);

export const ENV_CP002_REMEDIATION_FACT_BY_ID_V2 = new Map(
  ENV_CP002_REMEDIATION_FACTS_V2.map((row) => [row.id, row] as const),
);
