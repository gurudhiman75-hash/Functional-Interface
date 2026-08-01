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
  formatStudentOptionValue,
  normaliseStudentLine,
} from "./number-system-generator-contract";

export {
  SIMPLE_NUMBER_SYSTEM_QL_TITLES,
  correctAnswerDisplay,
  studentOptionDisplay,
  NUMBER_SYSTEM_GENERATOR_MODEL,
  formatStudentOptionValue,
};

export function buildNumberSystemTeacherExplanation(row) {
  const base = row.checkpoint === "NUM-CP-003" ? cp003Teacher(row) : cp004Teacher(row);
  const structured = applyNumberSystemGeneratorContract(row, base);
  const commonTraps = buildTraps(row).map((trap) => Object.freeze({
    ...trap,
    optionValue: formatStudentOptionValue(trap.optionValue),
    message: normaliseStudentLine(trap.message),
  }));

  return Object.freeze({
    model: NUMBER_SYSTEM_GENERATOR_MODEL,
    mainRule: structured.mainRule.map(normaliseStudentLine),
    stepByStepSolution: structured.steps.map(normaliseStudentLine),
    examSpeedTrick: structured.speedTrick.map(normaliseStudentLine),
    commonTraps: Object.freeze(commonTraps),
  });
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
