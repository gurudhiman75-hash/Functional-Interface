import { ALP_CP002_QLS } from "./question-language.en";

export const ALP_CP002_TASK_REGISTRY = {
  checkpointId: "ALP-CP-002",
  title: "Relative Letter Positions",
  qlRange: ["ALP-QL-013", "ALP-QL-030"] as const,
  qlCount: 18,
  rendererFamilies: [...new Set(ALP_CP002_QLS.map((ql) => ql.renderer))],
  localeMode: "TRANSLATABLE",
  status: "IMPLEMENTED",
  questionLogics: ALP_CP002_QLS,
} as const;

export function alpCp002QlById(qlId: string) {
  const ql = ALP_CP002_QLS.find((entry) => entry.qlId === qlId);
  if (!ql) throw new Error(`Unknown ALP-CP-002 QL: ${qlId}`);
  return ql;
}
