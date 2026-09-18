export type EnvCp016RemediationFactV2 = {
  id: string;
  statement: string;
  sourceIds: readonly string[];
};

const NIOS_MOVEMENTS = "NIOS-MAJOR-CITIZEN-LED-ENVIRONMENTAL-MOVEMENTS";

export const ENV_CP016_REMEDIATION_FACTS_V2: readonly EnvCp016RemediationFactV2[] = Object.freeze([
  { id:"env-cp016-v2-chipko", statement:"The Chipko movement became known for villagers embracing trees to resist commercial felling in the Himalayan region during the 1970s.", sourceIds:[NIOS_MOVEMENTS] },
  { id:"env-cp016-v2-appiko", statement:"The Appiko movement began in Karnataka in 1983 and used tree-protection methods inspired by Chipko.", sourceIds:[NIOS_MOVEMENTS] },
  { id:"env-cp016-v2-silent-valley", statement:"The Save Silent Valley movement opposed a hydel project threatening the tropical evergreen forest ecosystem of Silent Valley in Kerala.", sourceIds:[NIOS_MOVEMENTS] },
  { id:"env-cp016-v2-bishnoi", statement:"The Khejarli/Bishnoi tradition in Rajasthan is remembered for people sacrificing their lives to protect khejri trees.", sourceIds:[NIOS_MOVEMENTS] },
]);

export const ENV_CP016_REMEDIATION_FACT_BY_ID_V2 = new Map(
  ENV_CP016_REMEDIATION_FACTS_V2.map((row) => [row.id, row] as const),
);
