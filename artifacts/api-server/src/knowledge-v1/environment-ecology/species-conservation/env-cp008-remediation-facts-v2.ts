export type EnvCp008RemediationFactV2 = {
  id: string;
  statement: string;
  sourceIds: readonly string[];
};

const MOEF_PROJECT_ELEPHANT = "MOEFCC-PROJECT-ELEPHANT";

export const ENV_CP008_REMEDIATION_FACTS_V2: readonly EnvCp008RemediationFactV2[] = Object.freeze([
  { id:"env-cp008-v2-elephant-launch", statement:"Project Elephant was launched by the Government of India in 1991-92 as a Centrally Sponsored Scheme.", sourceIds:[MOEF_PROJECT_ELEPHANT] },
  { id:"env-cp008-v2-elephant-protection", statement:"Project Elephant supports protection of elephants, their habitats and corridors.", sourceIds:[MOEF_PROJECT_ELEPHANT] },
  { id:"env-cp008-v2-elephant-conflict", statement:"Addressing human-elephant conflict is an explicit objective of Project Elephant.", sourceIds:[MOEF_PROJECT_ELEPHANT] },
  { id:"env-cp008-v2-elephant-captive", statement:"Project Elephant also includes welfare of captive elephants among its objectives.", sourceIds:[MOEF_PROJECT_ELEPHANT] },
  { id:"env-cp008-v2-elephant-corridor", statement:"Elephant corridors help maintain movement and habitat connectivity across elephant landscapes.", sourceIds:[MOEF_PROJECT_ELEPHANT] },
]);

export const ENV_CP008_REMEDIATION_FACT_BY_ID_V2 = new Map(
  ENV_CP008_REMEDIATION_FACTS_V2.map((row) => [row.id, row] as const),
);
