import { MEN_CP_012_PERMANENT_ALLOCATION } from "./allocation";

export const MEN_CP_012_PERMANENT_METADATA_V2_AUTHORITY =
  "MEN-CP012-PERMANENT-METADATA-V2" as const;

export type MenCp012EffectiveAnswerSemantic =
  | "COUNT"
  | "LENGTH"
  | "LENGTH_OR_RATIO"
  | "COUNT_OR_LENGTH"
  | "PERCENT"
  | "SECONDARY_PERCENT";

/**
 * Identity allocation remains unchanged. This metadata correction records that
 * QL-157 (stated loss) and QL-159 (hollow-source recast) legitimately support
 * both count and length targets across their already-frozen source pools.
 */
export const MEN_CP_012_EFFECTIVE_PERMANENT_METADATA = MEN_CP_012_PERMANENT_ALLOCATION.map((row) => ({
  ...row,
  metadataAuthority: MEN_CP_012_PERMANENT_METADATA_V2_AUTHORITY,
  answerSemantic: (
    row.qlId === "MEN-002-QL-157" || row.qlId === "MEN-002-QL-159"
      ? "COUNT_OR_LENGTH"
      : row.answerSemantic
  ) as MenCp012EffectiveAnswerSemantic,
}));

export function auditMenCp012PermanentMetadataV2() {
  const byQl = new Map(MEN_CP_012_EFFECTIVE_PERMANENT_METADATA.map((row) => [row.qlId, row]));
  return {
    authority: MEN_CP_012_PERMANENT_METADATA_V2_AUTHORITY,
    permanentQlCount: MEN_CP_012_EFFECTIVE_PERMANENT_METADATA.length,
    ql157Semantic: byQl.get("MEN-002-QL-157")?.answerSemantic,
    ql159Semantic: byQl.get("MEN-002-QL-159")?.answerSemantic,
    identityUnchanged: MEN_CP_012_EFFECTIVE_PERMANENT_METADATA.every(
      (row, index) =>
        row.qlId === MEN_CP_012_PERMANENT_ALLOCATION[index]?.qlId &&
        row.clusterId === MEN_CP_012_PERMANENT_ALLOCATION[index]?.clusterId &&
        row.templateId === MEN_CP_012_PERMANENT_ALLOCATION[index]?.templateId &&
        row.solveModeId === MEN_CP_012_PERMANENT_ALLOCATION[index]?.solveModeId,
    ),
  } as const;
}
