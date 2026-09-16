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

  // GR-GIP-003: object + bare verb is the invalid form; object + -ing can otherwise be parsed as a participial modifier.
  "GIP-E05": finalRevision("GIP-E05", ["The doctor advised the patient to rest", "for two days", "after the minor procedure", "at the clinic."], ["The doctor advised the patient rest", "for two days", "after the minor procedure", "at the clinic."], 0, "The doctor advised the patient to rest"),
  "GIP-E06": finalRevision("GIP-E06", ["The teacher asked", "the students to submit", "their notebooks", "before Friday."], ["The teacher asked", "the students submit", "their notebooks", "before Friday."], 1, "the students to submit"),
  "GIP-M05": finalRevision("GIP-M05", ["The supervisor reminded", "the new employees", "before the shift", "to wear their identity cards."], ["The supervisor reminded", "the new employees", "before the shift", "wear their identity cards."], 3, "to wear their identity cards."),
  "GIP-M06": finalRevision("GIP-M06", ["The coach encouraged the players to practise", "with the new equipment", "before the tournament", "began on Saturday."], ["The coach encouraged the players practise", "with the new equipment", "before the tournament", "began on Saturday."], 0, "The coach encouraged the players to practise"),

  // GR-GIP-008: keep infinitival 'to' and mutate the following verb to -ing so the error cannot masquerade as a free participial clause.
  "GIP-E15": finalRevision("GIP-E15", ["Before lunch,", "the clerk went", "to collect the files", "from the record room."], ["Before lunch,", "the clerk went", "to collecting the files", "from the record room."], 2, "to collect the files"),
  "GIP-E16": finalRevision("GIP-E16", ["Before the interview,", "we phoned the office", "once again", "to confirm the reporting time."], ["Before the interview,", "we phoned the office", "once again", "to confirming the reporting time."], 3, "to confirm the reporting time."),
  "GIP-M15": finalRevision("GIP-M15", ["After the final bell,", "the students stayed back", "in the classroom", "to complete the project."], ["After the final bell,", "the students stayed back", "in the classroom", "to completing the project."], 3, "to complete the project."),
  "GIP-M16": finalRevision("GIP-M16", ["The technician came to inspect", "the control panel", "after the alarm", "sounded for a second time."], ["The technician came to inspecting", "the control panel", "after the alarm", "sounded for a second time."], 0, "The technician came to inspect"),

  // HARD closure recalibration. Each item contains a nearby, correctly governed
  // non-finite form, so the learner must track the controlling verb/preposition.
  "GIP-H01": finalRevision("GIP-H01", ["After deciding to appeal the decision,", "several applicants admitted", "that they had delayed", "submitting the required certificates."], ["After deciding to appeal the decision,", "several applicants admitted", "that they had delayed", "to submit the required certificates."], 3, "submitting the required certificates."),
  "GIP-H02": finalRevision("GIP-H02", ["Although the branch agreed to meet the auditors again,", "the audit team recommended reviewing", "the disputed entries first", "before the report was sent."], ["Although the branch agreed to meet the auditors again,", "the audit team recommended to review", "the disputed entries first", "before the report was sent."], 1, "the audit team recommended reviewing"),
  "GIP-H03": finalRevision("GIP-H03", ["After avoiding restarting the entire system,", "the engineers finally managed to restore the connection", "before the backup window", "closed for the night."], ["After avoiding restarting the entire system,", "the engineers finally managed restoring the connection", "before the backup window", "closed for the night."], 1, "the engineers finally managed to restore the connection"),
  "GIP-H04": finalRevision("GIP-H04", ["After considering postponing the vote,", "the board eventually agreed to reconsider", "the third proposal", "during its closing session."], ["After considering postponing the vote,", "the board eventually agreed reconsidering", "the third proposal", "during its closing session."], 1, "the board eventually agreed to reconsider"),
  "GIP-H05": finalRevision("GIP-H05", ["Although the notice allows candidates to upload one document later,", "the department requires applicants to provide", "two recent photographs", "with the signed declaration."], ["Although the notice allows candidates to upload one document later,", "the department requires applicants provide", "two recent photographs", "with the signed declaration."], 1, "the department requires applicants to provide"),
  "GIP-H06": finalRevision("GIP-H06", ["After warning the trainees against using their phones during the test,", "the officer reminded them to keep the devices switched off", "until they left", "the practical laboratory."], ["After warning the trainees against using their phones during the test,", "the officer reminded them keep the devices switched off", "until they left", "the practical laboratory."], 1, "the officer reminded them to keep the devices switched off"),
  "GIP-H07": finalRevision("GIP-H07", ["Although the supervisor asked the staff to remain nearby,", "the director would not let them leave", "before the records", "were fully secured."], ["Although the supervisor asked the staff to remain nearby,", "the director would not let them to leave", "before the records", "were fully secured."], 1, "the director would not let them leave"),
  "GIP-H08": finalRevision("GIP-H08", ["Although the inspector required the contractor to update the register,", "the inspection itself made him revise", "the safety plan", "before further work could begin."], ["Although the inspector required the contractor to update the register,", "the inspection itself made him to revise", "the safety plan", "before further work could begin."], 1, "the inspection itself made him revise"),
  "GIP-H09": finalRevision("GIP-H09", ["Candidates who expect to reach the centre early", "should still remember that every person who qualifies", "must report at the main desk", "by eight in the morning."], ["Candidates who expect to reach the centre early", "should still remember that every person who qualifies", "must to report at the main desk", "by eight in the morning."], 2, "must report at the main desk"),
  "GIP-H10": finalRevision("GIP-H10", ["Although the team planned to wait for better visibility,", "the rescue leader said they may resume the search", "once the control room", "gives formal clearance."], ["Although the team planned to wait for better visibility,", "the rescue leader said they may to resume the search", "once the control room", "gives formal clearance."], 1, "the rescue leader said they may resume the search"),
  "GIP-H11": finalRevision("GIP-H11", ["After checking the request once and before sending it onward,", "the clerk approved it", "for payment", "without checking the supporting documents again."], ["After checking the request once and before sending it onward,", "the clerk approved it", "for payment", "without to check the supporting documents again."], 3, "without checking the supporting documents again."),
  "GIP-H12": finalRevision("GIP-H12", ["The committee objected to changing the schedule", "after agreeing to extend the registration period", "at such short notice", "without consulting the candidates."], ["The committee objected to changing the schedule", "after agreeing to extend the registration period", "at such short notice", "without to consult the candidates."], 3, "without consulting the candidates."),
  "GIP-H13": finalRevision("GIP-H13", ["Although she still plans to attend advanced training,", "after several months in the role she has become", "used to handling urgent queries", "without additional supervision."], ["Although she still plans to attend advanced training,", "after several months in the role she has become", "used to handle urgent queries", "without additional supervision."], 2, "used to handling urgent queries"),
  "GIP-H14": finalRevision("GIP-H14", ["Although he is now used to travelling by car,", "before his transfer he used to travel", "nearly two hours each day", "to reach the district office."], ["Although he is now used to travelling by car,", "before his transfer he used to travelling", "nearly two hours each day", "to reach the district office."], 1, "before his transfer he used to travel"),
  "GIP-H15": finalRevision("GIP-H15", ["After checking the issue with the storekeeper,", "the inspection team returned", "to the storage area", "to verify the remaining stock."], ["After checking the issue with the storekeeper,", "the inspection team returned", "to the storage area", "to verifying the remaining stock."], 3, "to verify the remaining stock."),
  "GIP-H16": finalRevision("GIP-H16", ["After recording the first part of the statement,", "the officer called the witness", "to clarify two disputed points", "before continuing the interview."], ["After recording the first part of the statement,", "the officer called the witness", "to clarifying two disputed points", "before continuing the interview."], 2, "to clarify two disputed points"),
  "GIP-H17": finalRevision("GIP-H17", ["The auditor remembered to lock the file cabinet before leaving,", "and later, while checking the dispatch record,", "remembered sending the corrected sheet", "to the branch manager the previous evening."], ["The auditor remembered to lock the file cabinet before leaving,", "and later, while checking the dispatch record,", "remembered to send the corrected sheet", "to the branch manager the previous evening."], 2, "remembered sending the corrected sheet"),
  "GIP-H18": finalRevision("GIP-H18", ["When the alarm sounded,", "the workers stopped drilling", "and stepped away from the machinery", "to listen for further instructions."], ["When the alarm sounded,", "the workers stopped drilling", "and stepped away from the machinery", "listening for further instructions."], 3, "to listen for further instructions."),
  "GIP-H19": finalRevision("GIP-H19", ["While technicians working in each laboratory checked the instruments,", "the final report included", "the results obtained from all three sites", "in a separate appendix."], ["While technicians working in each laboratory checked the instruments,", "the final report included", "the results obtaining from all three sites", "in a separate appendix."], 2, "the results obtained from all three sites"),
  "GIP-H20": finalRevision("GIP-H20", ["After checking the last entry and before returning the originals,", "having completed the verification,", "the officer signed the register", "and closed the counter."], ["After checking the last entry and before returning the originals,", "having complete the verification,", "the officer signed the register", "and closed the counter."], 1, "having completed the verification,"),
});

export const CP009_SCENES_V2: readonly GerundInfinitiveParticipleSceneV1[] = CP009_SCENES_V2_BASE.map(
  (scene) => finalOverrides[scene.id] ?? scene,
);

export const CP009_SCENES_BY_DIFFICULTY_V2: Readonly<Record<EnglishDifficulty, readonly GerundInfinitiveParticipleSceneV1[]>> = Object.freeze({
  easy: CP009_SCENES_V2.filter((scene) => scene.difficulty === "easy"),
  medium: CP009_SCENES_V2.filter((scene) => scene.difficulty === "medium"),
  hard: CP009_SCENES_V2.filter((scene) => scene.difficulty === "hard"),
});
