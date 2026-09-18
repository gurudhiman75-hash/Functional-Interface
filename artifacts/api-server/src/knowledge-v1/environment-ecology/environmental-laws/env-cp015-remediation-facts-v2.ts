export type EnvCp015RemediationFactV2 = {
  id: string;
  statement: string;
  sourceIds: readonly string[];
};

const PARIVESH_EIA = "PARIVESH-EIA-NOTIFICATION-2006";

export const ENV_CP015_REMEDIATION_FACTS_V2: readonly EnvCp015RemediationFactV2[] = Object.freeze([
  { id:"env-cp015-v2-eia-purpose", statement:"Environmental Impact Assessment evaluates likely environmental effects of a proposed project before the relevant approval decision.", sourceIds:[PARIVESH_EIA] },
  { id:"env-cp015-v2-eia-2006", statement:"India's Environmental Impact Assessment Notification, 2006 was issued on 14 September 2006.", sourceIds:[PARIVESH_EIA] },
  { id:"env-cp015-v2-prior-clearance", statement:"The EIA Notification framework requires specified projects and activities to obtain prior environmental clearance.", sourceIds:[PARIVESH_EIA] },
  { id:"env-cp015-v2-eia-monitoring", statement:"EIA is an assessment and clearance-stage process and is distinct from routine pollution monitoring during operation.", sourceIds:[PARIVESH_EIA] },
]);

export const ENV_CP015_REMEDIATION_FACT_BY_ID_V2 = new Map(
  ENV_CP015_REMEDIATION_FACTS_V2.map((row) => [row.id, row] as const),
);
