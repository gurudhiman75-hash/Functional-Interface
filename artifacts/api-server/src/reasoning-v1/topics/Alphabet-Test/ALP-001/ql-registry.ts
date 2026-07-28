import { ALP_CP001_QLS } from "./ALP-CP-001/question-language.en";
import { ALP_CP002_QLS } from "./ALP-CP-002/question-language.en";
import { ALP_CP003_QLS } from "./ALP-CP-003/question-language.en";
import { ALP_CP004_QLS } from "./ALP-CP-004/question-language.en";
import { ALP_CP005_QLS } from "./ALP-CP-005/question-language.en";
import type { AlpCheckpointId, AlpQuestionLogic } from "./types";

export const ALP_001_QLS: readonly AlpQuestionLogic[] = [
  ...ALP_CP001_QLS,
  ...ALP_CP002_QLS,
  ...ALP_CP003_QLS,
  ...ALP_CP004_QLS,
  ...ALP_CP005_QLS,
];

export const ALP_001_CHECKPOINTS = [
  { checkpointId: "ALP-CP-001" as const, qlRange: ["ALP-QL-001", "ALP-QL-012"] as const, qlCount: 12, title: "Fundamental Alphabet Positions" },
  { checkpointId: "ALP-CP-002" as const, qlRange: ["ALP-QL-013", "ALP-QL-030"] as const, qlCount: 18, title: "Relative Letter Positions" },
  { checkpointId: "ALP-CP-003" as const, qlRange: ["ALP-QL-031", "ALP-QL-046"] as const, qlCount: 16, title: "Gaps, Distance and Middle Positions" },
  { checkpointId: "ALP-CP-004" as const, qlRange: ["ALP-QL-047", "ALP-QL-074"] as const, qlCount: 28, title: "Modified Alphabet Arrangements" },
  { checkpointId: "ALP-CP-005" as const, qlRange: ["ALP-QL-075", "ALP-QL-104"] as const, qlCount: 30, title: "Positions and Rearrangement Within a Word" },
] as const;

export function alp001QlById(qlId: string): AlpQuestionLogic {
  const ql = ALP_001_QLS.find((entry) => entry.qlId === qlId);
  if (!ql) throw new Error(`Unknown ALP-001 QL: ${qlId}`);
  return ql;
}

export function alp001QlsForCheckpoint(checkpointId: AlpCheckpointId): readonly AlpQuestionLogic[] {
  return ALP_001_QLS.filter((entry) => entry.checkpointId === checkpointId);
}
