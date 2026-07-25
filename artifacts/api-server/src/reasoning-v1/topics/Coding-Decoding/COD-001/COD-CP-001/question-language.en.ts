import type { CodCp001QuestionLogic, CodCp001RuleId, CodCp001TaskKind } from "./types";
import type { CodAnswerType, CodRenderer, CodTokenKind } from "../foundation/types";

const taskCycle: readonly CodCp001TaskKind[] = [
  "ENCODE_TARGET",
  "DECODE_TARGET",
  "RECOVER_MISSING_CODE",
  "ENCODE_TARGET",
  "DECODE_TARGET",
  "INFER_FROM_OVERLAP",
];

const difficultyProfiles = [
  ["EASY", "MEDIUM"], ["EASY", "MEDIUM"], ["EASY", "MEDIUM"],
  ["EASY", "MEDIUM"], ["MEDIUM", "EASY", "HARD"], ["MEDIUM", "HARD"],
] as const;

function answerType(outputKind: CodTokenKind, taskKind: CodCp001TaskKind): CodAnswerType {
  if (taskKind === "RECOVER_MISSING_CODE") return "SINGLE_CODE_TOKEN";
  if (taskKind === "DECODE_TARGET") return "LETTER_CLUSTER";
  if (outputKind === "DIGIT") return "DIGIT_SEQUENCE";
  if (outputKind === "SYMBOL") return "SYMBOL_SEQUENCE";
  return "LETTER_CLUSTER";
}

function renderer(taskKind: CodCp001TaskKind, overlap: boolean): CodRenderer {
  if (taskKind === "RECOVER_MISSING_CODE") return "MAPPING_TABLE";
  return overlap ? "EXAMPLE_TARGET_BLOCK" : "INLINE_CODE_PAIR";
}

function block(start: number, ruleId: CodCp001RuleId, outputKind: CodTokenKind, overlap = false): CodCp001QuestionLogic[] {
  return Array.from({ length: 6 }, (_, offset) => {
    const taskKind = overlap ? (offset % 2 === 0 ? "INFER_FROM_OVERLAP" : taskCycle[offset]!) : taskCycle[offset]!;
    const overlapTask = overlap || taskKind === "INFER_FROM_OVERLAP";
    const qlNumber = String(start + offset).padStart(3, "0");
    return {
      qlId: `COD-QL-${qlNumber}`,
      checkpointId: "COD-CP-001",
      ruleId,
      taskKind,
      outputKind,
      answerType: answerType(outputKind, taskKind),
      renderer: renderer(taskKind, overlapTask),
      evidenceMode: overlapTask ? "OVERLAPPING_EXAMPLES" : taskKind === "RECOVER_MISSING_CODE" ? "EXPLICIT_TABLE" : "WORD_EXAMPLES",
      allowedDifficulties: difficultyProfiles[offset]!,
      targetLength: offset < 3 ? [3, 4] : [4, 6],
      exampleCount: overlap ? [2, 4] : [1, 3],
      status: "IMPLEMENTED",
    } satisfies CodCp001QuestionLogic;
  });
}

export const COD_CP001_QUESTION_LOGICS: readonly CodCp001QuestionLogic[] = [
  ...block(1, "DIRECT_LETTER_TO_LETTER_MAP", "LETTER"),
  ...block(7, "DIRECT_LETTER_TO_DIGIT_MAP", "DIGIT"),
  ...block(13, "DIRECT_LETTER_TO_SYMBOL_MAP", "SYMBOL"),
  ...block(19, "DIRECT_PARTIAL_MAPPING_INFERENCE", "LETTER", true),
];

export function getCodCp001QuestionLogic(qlId: string): CodCp001QuestionLogic {
  const found = COD_CP001_QUESTION_LOGICS.find((entry) => entry.qlId === qlId);
  if (!found) throw new Error(`Unknown COD-CP-001 QL '${qlId}'`);
  return found;
}
