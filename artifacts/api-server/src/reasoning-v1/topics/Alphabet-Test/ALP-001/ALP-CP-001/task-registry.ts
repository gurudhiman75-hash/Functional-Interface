import { ALP_CP001_QLS } from "./question-language.en";

export const ALP_CP001_TASK_REGISTRY = {
  checkpointId: "ALP-CP-001",
  title: "Fundamental Alphabet Positions",
  qlRange: ["ALP-QL-001", "ALP-QL-012"] as const,
  qlCount: 12,
  rendererFamilies: [...new Set(ALP_CP001_QLS.map((ql) => ql.renderer))],
  localeMode: "TRANSLATABLE",
  status: "IMPLEMENTED",
  questionLogics: ALP_CP001_QLS,
} as const;

export function alpCp001QlById(qlId: string) {
  const ql = ALP_CP001_QLS.find((entry) => entry.qlId === qlId);
  if (!ql) throw new Error(`Unknown ALP-CP-001 QL: ${qlId}`);
  return ql;
}
