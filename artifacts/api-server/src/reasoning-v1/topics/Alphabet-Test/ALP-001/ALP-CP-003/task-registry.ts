import { ALP_CP003_QLS } from "./question-language.en";

export const ALP_CP003_TASK_REGISTRY = {
  checkpointId: "ALP-CP-003",
  title: "Gaps, Distance and Middle Positions",
  qlRange: ["ALP-QL-031", "ALP-QL-046"] as const,
  qlCount: 16,
  rendererFamilies: [...new Set(ALP_CP003_QLS.map((ql) => ql.renderer))],
  localeMode: "TRANSLATABLE",
  status: "IMPLEMENTED",
  questionLogics: ALP_CP003_QLS,
} as const;

export function alpCp003QlById(qlId: string) {
  const ql = ALP_CP003_QLS.find((entry) => entry.qlId === qlId);
  if (!ql) throw new Error(`Unknown ALP-CP-003 QL: ${qlId}`);
  return ql;
}
