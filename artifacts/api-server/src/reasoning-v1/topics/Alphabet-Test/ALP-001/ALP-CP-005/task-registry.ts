import { ALP_CP005_QLS } from "./question-language.en";

export const ALP_CP005_TASK_REGISTRY = {
  checkpointId: "ALP-CP-005",
  title: "Positions and Rearrangement Within a Word",
  qlRange: ["ALP-QL-075", "ALP-QL-104"] as const,
  qlCount: 30,
  rendererFamilies: [...new Set(ALP_CP005_QLS.map((ql) => ql.renderer))],
  localeMode: "TRANSLATABLE",
  status: "IMPLEMENTED",
  questionLogics: ALP_CP005_QLS,
} as const;

export function alpCp005QlById(qlId: string) {
  const ql = ALP_CP005_QLS.find((entry) => entry.qlId === qlId);
  if (!ql) throw new Error(`Unknown ALP-CP-005 QL: ${qlId}`);
  return ql;
}
