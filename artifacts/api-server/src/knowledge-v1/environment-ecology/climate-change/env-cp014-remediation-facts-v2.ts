export type EnvCp014RemediationFactV2 = {
  id: string;
  statement: string;
  sourceIds: readonly string[];
};

const MOEF_NAPCC = "MOEFCC-NAPCC-2008";

export const ENV_CP014_REMEDIATION_FACTS_V2: readonly EnvCp014RemediationFactV2[] = Object.freeze([
  { id:"env-cp014-v2-napcc-2008", statement:"India's National Action Plan on Climate Change was released in 2008.", sourceIds:[MOEF_NAPCC] },
  { id:"env-cp014-v2-eight-missions", statement:"The original NAPCC framework was organised around eight core National Missions.", sourceIds:[MOEF_NAPCC] },
  { id:"env-cp014-v2-solar", statement:"The National Solar Mission is one of the original eight core missions under NAPCC.", sourceIds:[MOEF_NAPCC] },
  { id:"env-cp014-v2-energy-efficiency", statement:"The National Mission for Enhanced Energy Efficiency is one of the original eight core NAPCC missions.", sourceIds:[MOEF_NAPCC] },
  { id:"env-cp014-v2-sustainable-habitat", statement:"The National Mission on Sustainable Habitat is one of the original eight core NAPCC missions.", sourceIds:[MOEF_NAPCC] },
  { id:"env-cp014-v2-water", statement:"The National Water Mission is one of the original eight core NAPCC missions.", sourceIds:[MOEF_NAPCC] },
  { id:"env-cp014-v2-himalayan", statement:"The National Mission for Sustaining the Himalayan Ecosystem is one of the original eight core NAPCC missions.", sourceIds:[MOEF_NAPCC] },
  { id:"env-cp014-v2-green-india", statement:"The National Mission for a Green India is one of the original eight core NAPCC missions.", sourceIds:[MOEF_NAPCC] },
  { id:"env-cp014-v2-agriculture", statement:"The National Mission for Sustainable Agriculture is one of the original eight core NAPCC missions.", sourceIds:[MOEF_NAPCC] },
  { id:"env-cp014-v2-knowledge", statement:"The National Mission on Strategic Knowledge for Climate Change is one of the original eight core NAPCC missions.", sourceIds:[MOEF_NAPCC] },
]);

export const ENV_CP014_REMEDIATION_FACT_BY_ID_V2 = new Map(
  ENV_CP014_REMEDIATION_FACTS_V2.map((row) => [row.id, row] as const),
);
