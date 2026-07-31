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

export {
  SIMPLE_NUMBER_SYSTEM_QL_TITLES,
  correctAnswerDisplay,
  studentOptionDisplay,
};

function ensureSimpleDepth(explanation) {
  const mainRule = explanation.mainRule.filter(Boolean).slice(0, 2);
  const steps = explanation.steps.filter(Boolean);
  const speedTrick = explanation.speedTrick.filter(Boolean).slice(0, 2);
  return { mainRule, steps, speedTrick };
}

export function buildNumberSystemTeacherExplanation(row) {
  const base = row.checkpoint === "NUM-CP-003" ? cp003Teacher(row) : cp004Teacher(row);
  const structured = ensureSimpleDepth(base);
  return Object.freeze({
    model: "FOUR_TIER_SIMPLE_TEACHER_VOICE_V2",
    mainRule: structured.mainRule.map(cleanText),
    stepByStepSolution: structured.steps.map(cleanText),
    examSpeedTrick: structured.speedTrick.map(cleanText),
    commonTraps: buildTraps(row),
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
