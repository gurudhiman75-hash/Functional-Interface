import { ALP_CP004_QLS } from "./question-language.en";

export const ALP_CP004_TASK_REGISTRY = {
  checkpointId: "ALP-CP-004",
  title: "Modified Alphabet Arrangements",
  qlRange: ["ALP-QL-047", "ALP-QL-074"] as const,
  qlCount: 28,
  rendererFamilies: [...new Set(ALP_CP004_QLS.map((ql) => ql.renderer))],
  localeMode: "TRANSLATABLE",
  status: "IMPLEMENTED",
  questionLogics: ALP_CP004_QLS,
} as const;

export function alpCp004QlById(qlId: string) {
  const ql = ALP_CP004_QLS.find((entry) => entry.qlId === qlId);
  if (!ql) throw new Error(`Unknown ALP-CP-004 QL: ${qlId}`);
  return ql;
}
