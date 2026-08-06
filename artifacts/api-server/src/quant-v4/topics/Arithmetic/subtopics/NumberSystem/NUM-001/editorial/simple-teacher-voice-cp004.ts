// @ts-nocheck
import { cp004TeacherFoundation } from "./simple-teacher-voice-cp004-foundation";
import { cp004TeacherAdvanced } from "./simple-teacher-voice-cp004-advanced";
import { cleanText } from "./simple-teacher-voice-core";

export function cp004Teacher(row) {
  const matched = cp004TeacherFoundation(row) ?? cp004TeacherAdvanced(row);
  if (matched) return matched;
  const explanation = row.question.explanation;
  return {
    mainRule: (explanation.coreConcept ?? []).map(cleanText),
    steps: (explanation.stepByStep ?? []).map(cleanText),
    speedTrick: (explanation.examSpeedMethod ?? []).map(cleanText),
  };
}
