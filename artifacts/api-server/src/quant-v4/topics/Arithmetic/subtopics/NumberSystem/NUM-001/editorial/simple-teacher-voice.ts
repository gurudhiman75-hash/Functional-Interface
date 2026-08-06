// @ts-nocheck
import {
  SIMPLE_NUMBER_SYSTEM_QL_TITLES,
  cleanText,
  correctAnswerDisplay,
  studentOptionDisplay,
} from "./simple-teacher-voice-core";
import { buildTraps } from "./simple-teacher-voice-traps";
import { cp003Teacher } from "./simple-teacher-voice-cp003";
import { cp004Teacher } from "./simple-teacher-voice-cp004";
import {
  NUMBER_SYSTEM_GENERATOR_MODEL,
  applyNumberSystemGeneratorContract,
} from "./number-system-generator-contract";
import {
  patchNumberSystemV3Teacher,
  renderNumberSystemV3Option,
} from "./number-system-v3-editorial-patch";

export {
  SIMPLE_NUMBER_SYSTEM_QL_TITLES,
  correctAnswerDisplay,
  studentOptionDisplay,
  renderNumberSystemV3Option,
  NUMBER_SYSTEM_GENERATOR_MODEL,
};

export function buildNumberSystemTeacherExplanation(row) {
  const base = row.checkpoint === "NUM-CP-003" ? cp003Teacher(row) : cp004Teacher(row);
  const structured = applyNumberSystemGeneratorContract(row, base);
  return patchNumberSystemV3Teacher(Object.freeze({
    model: NUMBER_SYSTEM_GENERATOR_MODEL,
    mainRule: structured.mainRule.map(cleanText),
    stepByStepSolution: structured.steps.map(cleanText),
    examSpeedTrick: structured.speedTrick.map(cleanText),
    commonTraps: buildTraps(row),
  }));
}

export function renderTeacherExplanationMarkdown(teacher) {
  return [
    "### 📌 Main Rule",
    "",
    ...teacher.mainRule,
    "",
    "### 📝 Step-by-Step Solution",
    "",
    ...teacher.stepByStepSolution.flatMap((step, index) => {
      const [first, ...rest] = String(step).split("\n");
      return [`${index + 1}. ${first}`, ...rest.map((line) => line ? `   ${line}` : "")];
    }),
    "",
    "### ⚡ Exam Speed Trick",
    "",
    ...teacher.examSpeedTrick,
    "",
    "### ⚠️ Common Traps",
    "",
    ...teacher.commonTraps.map((trap) =>
      `- ⚠️ **Option ${trap.optionLabel} (${trap.optionValue}):** ${trap.message} [${trap.misconceptionTag}]`),
  ];
}
