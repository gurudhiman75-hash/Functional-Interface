import type { EnglishDifficulty } from "../../../../core/types";
import type { GerundInfinitiveParticipleSceneV1 } from "./cp009-catalog-v1";
import { CP009_SCENES_V2 as CP009_SCENES_V2_BASE } from "./cp009-catalog-v2-base";

function finalRevision(
  id: string,
  correctSegments: readonly [string, string, string, string],
  errorSegments: readonly [string, string, string, string],
  errorIndex: 0 | 1 | 2 | 3,
  correction: string,
): GerundInfinitiveParticipleSceneV1 {
  const base = CP009_SCENES_V2_BASE.find((scene) => scene.id === id);
  if (!base) throw new Error(`Unknown CP009 V2 scene ${id}.`);
  return { ...base, correctSegments, errorSegments, errorIndex, correction };
}

const finalOverrides: Readonly<Record<string, GerundInfinitiveParticipleSceneV1>> = Object.freeze({
  // Surface/segmentation polish while preserving the 5/5/5/5 Easy answer spread.
  "GIP-E01": finalRevision("GIP-E01", ["The children enjoy reading stories", "after lunch", "when the reading period begins", "in the school library."], ["The children enjoy to read stories", "after lunch", "when the reading period begins", "in the school library."], 0, "The children enjoy reading stories"),
  "GIP-E03": finalRevision("GIP-E03", ["As traffic increased", "on the main road,", "we decided to leave early", "after breakfast."], ["As traffic increased", "on the main road,", "we decided leaving early", "after breakfast."], 2, "we decided to leave early"),
  "GIP-E04": finalRevision("GIP-E04", ["After completing his degree,", "he has one clear aim", "and hopes", "to join the course next year."], ["After completing his degree,", "he has one clear aim", "and hopes", "joining the course next year."], 3, "to join the course next year."),
  "GIP-E09": finalRevision("GIP-E09", ["You should check the form", "for missing details", "before signing it", "at the counter."], ["You should to check the form", "for missing details", "before signing it", "at the counter."], 0, "You should check the form"),
  "GIP-E20": finalRevision("GIP-E20", ["After verification,", "the documents", "submitted yesterday", "were sent to accounts."], ["After verification,", "the documents", "submitting yesterday", "were sent to accounts."], 2, "submitted yesterday"),

  // GR-GIP-003: use object + bare verb as the invalid form; object + -ing can otherwise be parsed as a participial modifier.
  "GIP-E05": finalRevision("GIP-E05", ["The doctor advised the patient to rest", "for two days", "after the minor procedure", "at the clinic."], ["The doctor advised the patient rest", "for two days", "after the minor procedure", "at the clinic."], 0, "The doctor advised the patient to rest"),
  "GIP-E06": finalRevision("GIP-E06", ["The teacher asked", "the students to submit", "their notebooks", "before Friday."], ["The teacher asked", "the students submit", "their notebooks", "before Friday."], 1, "the students to submit"),
  "GIP-M05": finalRevision("GIP-M05", ["The supervisor reminded", "the new employees", "before the shift", "to wear their identity cards."], ["The supervisor reminded", "the new employees", "before the shift", "wear their identity cards."], 3, "to wear their identity cards."),
  "GIP-M06": finalRevision("GIP-M06", ["The coach encouraged the players to practise", "with the new equipment", "before the tournament", "began on Saturday."], ["The coach encouraged the players practise", "with the new equipment", "before the tournament", "began on Saturday."], 0, "The coach encouraged the players to practise"),
  "GIP-H05": finalRevision("GIP-H05", ["According to the revised notice,", "the department requires applicants to provide", "two recent photographs", "with the signed declaration."], ["According to the revised notice,", "the department requires applicants provide", "two recent photographs", "with the signed declaration."], 1, "the department requires applicants to provide"),
  "GIP-H06": finalRevision("GIP-H06", ["The officer reminded the trainees to keep their phones switched off", "during the briefing", "before they entered", "the practical laboratory."], ["The officer reminded the trainees keep their phones switched off", "during the briefing", "before they entered", "the practical laboratory."], 0, "The officer reminded the trainees to keep their phones switched off"),

  // GR-GIP-008: keep the infinitival 'to' and mutate the verb to -ing; this cannot masquerade as a valid simultaneous participial clause.
  "GIP-E15": finalRevision("GIP-E15", ["Before lunch,", "the clerk went", "to collect the files", "from the record room."], ["Before lunch,", "the clerk went", "to collecting the files", "from the record room."], 2, "to collect the files"),
  "GIP-E16": finalRevision("GIP-E16", ["Before the interview,", "we phoned the office", "once again", "to confirm the reporting time."], ["Before the interview,", "we phoned the office", "once again", "to confirming the reporting time."], 3, "to confirm the reporting time."),
  "GIP-M15": finalRevision("GIP-M15", ["After the final bell,", "the students stayed back", "in the classroom", "to complete the project."], ["After the final bell,", "the students stayed back", "in the classroom", "to completing the project."], 3, "to complete the project."),
  "GIP-M16": finalRevision("GIP-M16", ["The technician came to inspect", "the control panel", "after the alarm", "sounded for a second time."], ["The technician came to inspecting", "the control panel", "after the alarm", "sounded for a second time."], 0, "The technician came to inspect"),
  "GIP-H15": finalRevision("GIP-H15", ["The inspection team returned", "after the lunch break", "to the storage area", "to verify the remaining stock."], ["The inspection team returned", "after the lunch break", "to the storage area", "to verifying the remaining stock."], 3, "to verify the remaining stock."),
  "GIP-H16": finalRevision("GIP-H16", ["Because the first report was incomplete,", "the officer called the witness", "to clarify two points", "before recording the statement."], ["Because the first report was incomplete,", "the officer called the witness", "to clarifying two points", "before recording the statement."], 2, "to clarify two points"),

  // Final Hard answer-position correction: move one source key from A to D with a natural sentence surface.
  "GIP-H11": finalRevision("GIP-H11", ["The clerk approved the request", "and forwarded it", "to the accounts section", "without checking the supporting documents."], ["The clerk approved the request", "and forwarded it", "to the accounts section", "without to check the supporting documents."], 3, "without checking the supporting documents."),
});

export const CP009_SCENES_V2: readonly GerundInfinitiveParticipleSceneV1[] = CP009_SCENES_V2_BASE.map(
  (scene) => finalOverrides[scene.id] ?? scene,
);

export const CP009_SCENES_BY_DIFFICULTY_V2: Readonly<Record<EnglishDifficulty, readonly GerundInfinitiveParticipleSceneV1[]>> = Object.freeze({
  easy: CP009_SCENES_V2.filter((scene) => scene.difficulty === "easy"),
  medium: CP009_SCENES_V2.filter((scene) => scene.difficulty === "medium"),
  hard: CP009_SCENES_V2.filter((scene) => scene.difficulty === "hard"),
});
