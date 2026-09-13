import type { EnglishDifficulty } from "../../../../core/types";
import { CP009_SCENES_V1 } from "./cp009-catalog-v1";
import type { GerundInfinitiveParticipleSceneV1 } from "./cp009-catalog-v1";

const baseById = new Map(CP009_SCENES_V1.map((scene) => [scene.id, scene]));

function revised(
  id: string,
  correctSegments: readonly [string, string, string, string],
  errorSegments: readonly [string, string, string, string],
  errorIndex: 0 | 1 | 2 | 3,
  correction: string,
): GerundInfinitiveParticipleSceneV1 {
  const base = baseById.get(id);
  if (!base) throw new Error(`Unknown CP009 V1 scene ${id}.`);
  return { ...base, correctSegments, errorSegments, errorIndex, correction };
}

const overrides: Readonly<Record<string, GerundInfinitiveParticipleSceneV1>> = Object.freeze({
  // EASY: exact authored answer spread A=5, B=5, C=5, D=5.
  "GIP-E01": revised("GIP-E01", ["The children enjoy reading stories", "after lunch", "in the school", "library."], ["The children enjoy to read stories", "after lunch", "in the school", "library."], 0, "The children enjoy reading stories"),
  "GIP-E03": revised("GIP-E03", ["Because the road", "was becoming crowded,", "we decided to leave early", "after breakfast."], ["Because the road", "was becoming crowded,", "we decided leaving early", "after breakfast."], 2, "we decided to leave early"),
  "GIP-E04": revised("GIP-E04", ["After graduation,", "he sincerely", "hopes", "to join the course next year."], ["After graduation,", "he sincerely", "hopes", "joining the course next year."], 3, "to join the course next year."),
  "GIP-E05": revised("GIP-E05", ["The doctor advised the patient to rest", "for two days", "after the treatment", "ended."], ["The doctor advised the patient resting", "for two days", "after the treatment", "ended."], 0, "The doctor advised the patient to rest"),
  "GIP-E07": revised("GIP-E07", ["For security reasons,", "the guard made", "the visitors wait", "outside the hall."], ["For security reasons,", "the guard made", "the visitors to wait", "outside the hall."], 2, "the visitors wait"),
  "GIP-E08": revised("GIP-E08", ["At the dining table,", "the parents", "finally let", "the child finish his meal."], ["At the dining table,", "the parents", "finally let", "the child to finish his meal."], 3, "the child finish his meal."),
  "GIP-E09": revised("GIP-E09", ["You should check the form", "carefully", "before you", "sign it."], ["You should to check the form", "carefully", "before you", "sign it."], 0, "You should check the form"),
  "GIP-E11": revised("GIP-E11", ["Before her next assignment,", "she became interested", "in learning French", "through an evening course."], ["Before her next assignment,", "she became interested", "in learn French", "through an evening course."], 2, "in learning French"),
  "GIP-E12": revised("GIP-E12", ["Before leaving the office,", "he closed the windows", "and went out", "without checking whether the lights were off."], ["Before leaving the office,", "he closed the windows", "and went out", "without check whether the lights were off."], 3, "without checking whether the lights were off."),
  "GIP-E13": revised("GIP-E13", ["My grandfather used to walk", "five kilometres", "along the canal", "every morning."], ["My grandfather used to walking", "five kilometres", "along the canal", "every morning."], 0, "My grandfather used to walk"),
  "GIP-E15": revised("GIP-E15", ["Before lunch,", "the clerk went", "to collect the files", "from the record room."], ["Before lunch,", "the clerk went", "collecting the files", "from the record room."], 2, "to collect the files"),
  "GIP-E16": revised("GIP-E16", ["Before the interview,", "we phoned the office", "once again", "to confirm the reporting time."], ["Before the interview,", "we phoned the office", "once again", "confirming the reporting time."], 3, "to confirm the reporting time."),
  "GIP-E17": revised("GIP-E17", ["Before leaving tonight,", "please make sure", "that you remember", "to lock the office door."], ["Before leaving tonight,", "please make sure", "that you remember", "locking the office door."], 3, "to lock the office door."),

  // MEDIUM: move five scenes to Part B; the remaining authored positions give 5/5/5/5.
  "GIP-M01": revised("GIP-M01", ["When enough information is available,", "the manager avoids delaying decisions", "during the weekly review", "with the committee."], ["When enough information is available,", "the manager avoids to delay decisions", "during the weekly review", "with the committee."], 1, "the manager avoids delaying decisions"),
  "GIP-M02": revised("GIP-M02", ["Although the route was longer,", "the driver considered taking the bypass", "after checking traffic", "on the main road."], ["Although the route was longer,", "the driver considered to take the bypass", "after checking traffic", "on the main road."], 1, "the driver considered taking the bypass"),
  "GIP-M03": revised("GIP-M03", ["After a lengthy discussion,", "the committee agreed to review", "the revised proposal", "at its next meeting."], ["After a lengthy discussion,", "the committee agreed reviewing", "the revised proposal", "at its next meeting."], 1, "the committee agreed to review"),
  "GIP-M04": revised("GIP-M04", ["After discussing the budget,", "the officers decided to postpone the purchase", "until the next quarter", "to protect essential spending."], ["After discussing the budget,", "the officers decided postponing the purchase", "until the next quarter", "to protect essential spending."], 1, "the officers decided to postpone the purchase"),
  "GIP-M07": revised("GIP-M07", ["Because the queue was growing,", "the officer made the applicants wait", "in a separate room", "until another counter opened."], ["Because the queue was growing,", "the officer made the applicants to wait", "in a separate room", "until another counter opened."], 1, "the officer made the applicants wait"),

  // HARD: rebalance while keeping longer dependency and clause structure.
  "GIP-H02": revised("GIP-H02", ["Before the report was sent,", "the audit team recommended reviewing", "the disputed entries again", "with the branch staff."], ["Before the report was sent,", "the audit team recommended to review", "the disputed entries again", "with the branch staff."], 1, "the audit team recommended reviewing"),
  "GIP-H03": revised("GIP-H03", ["Although the first attempt failed,", "the engineers finally managed to restore the connection", "before the backup window", "closed for the night."], ["Although the first attempt failed,", "the engineers finally managed restoring the connection", "before the backup window", "closed for the night."], 1, "the engineers finally managed to restore the connection"),
  "GIP-H04": revised("GIP-H04", ["After rejecting two earlier options,", "the board eventually agreed to reconsider", "the third proposal", "during its closing session."], ["After rejecting two earlier options,", "the board eventually agreed reconsidering", "the third proposal", "during its closing session."], 1, "the board eventually agreed to reconsider"),
  "GIP-H05": revised("GIP-H05", ["According to the revised notice,", "the department requires applicants to provide", "two recent photographs", "with the signed declaration."], ["According to the revised notice,", "the department requires applicants providing", "two recent photographs", "with the signed declaration."], 1, "the department requires applicants to provide"),
  "GIP-H06": revised("GIP-H06", ["The officer reminded the trainees to keep their phones switched off", "during the briefing", "before the practical session", "began."], ["The officer reminded the trainees keeping their phones switched off", "during the briefing", "before the practical session", "began."], 0, "The officer reminded the trainees to keep their phones switched off"),
  "GIP-H07": revised("GIP-H07", ["Although the request was unusual,", "the director would not let the staff leave", "before the records", "were fully secured."], ["Although the request was unusual,", "the director would not let the staff to leave", "before the records", "were fully secured."], 1, "the director would not let the staff leave"),
  "GIP-H09": revised("GIP-H09", ["According to the instructions,", "every candidate who qualifies", "must report at the centre", "by eight in the morning."], ["According to the instructions,", "every candidate who qualifies", "must to report at the centre", "by eight in the morning."], 2, "must report at the centre"),
});

export const CP009_SCENES_V2: readonly GerundInfinitiveParticipleSceneV1[] = CP009_SCENES_V1.map(
  (scene) => overrides[scene.id] ?? scene,
);

export const CP009_SCENES_BY_DIFFICULTY_V2: Readonly<Record<EnglishDifficulty, readonly GerundInfinitiveParticipleSceneV1[]>> = Object.freeze({
  easy: CP009_SCENES_V2.filter((scene) => scene.difficulty === "easy"),
  medium: CP009_SCENES_V2.filter((scene) => scene.difficulty === "medium"),
  hard: CP009_SCENES_V2.filter((scene) => scene.difficulty === "hard"),
});
