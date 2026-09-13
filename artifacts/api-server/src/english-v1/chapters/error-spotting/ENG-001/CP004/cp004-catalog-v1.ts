import type { EnglishDifficulty, PronounRuleId } from "../../../../core/types";

export interface PronounSceneV1 {
  id: string;
  difficulty: EnglishDifficulty;
  ruleId: PronounRuleId;
  domain: string;
  correctSegments: readonly [string, string, string, string];
  errorSegments: readonly [string, string, string, string];
  errorIndex: 0 | 1 | 2 | 3;
  correction: string;
  reason: string;
}

const s = (
  id: string,
  difficulty: EnglishDifficulty,
  ruleId: PronounRuleId,
  domain: string,
  correctSegments: PronounSceneV1["correctSegments"],
  errorSegments: PronounSceneV1["errorSegments"],
  errorIndex: PronounSceneV1["errorIndex"],
  correction: string,
  reason: string,
): PronounSceneV1 => ({ id, difficulty, ruleId, domain, correctSegments, errorSegments, errorIndex, correction, reason });

export const CP004_PRONOUN_SCENES_V1: readonly PronounSceneV1[] = [
  // Easy: direct case, possessive form, person/thing relative form, demonstratives.
  s("PRN-E-001", "easy", "GR-PRN-001", "education", ["She", "submitted the form", "to the teacher", "before class."], ["Her", "submitted the form", "to the teacher", "before class."], 0, "She", "The pronoun is doing the action, so the subject form is needed."),
  s("PRN-E-002", "easy", "GR-PRN-001", "transport", ["He", "checked the tickets", "at the gate", "this morning."], ["Him", "checked the tickets", "at the gate", "this morning."], 0, "He", "The pronoun is the subject of checked, so the subject form is needed."),
  s("PRN-E-003", "easy", "GR-PRN-001", "healthcare", ["They", "prepared the room", "for the patient", "before noon."], ["Them", "prepared the room", "for the patient", "before noon."], 0, "They", "The pronoun is the subject of prepared, so the subject form is needed."),
  s("PRN-E-004", "easy", "GR-PRN-001", "commerce", ["We", "reviewed the order", "with the supplier", "after lunch."], ["Us", "reviewed the order", "with the supplier", "after lunch."], 0, "We", "The pronoun performs the action, so the subject form is needed."),

  s("PRN-E-005", "easy", "GR-PRN-002", "public-service", ["The officer called", "him", "to the counter", "after checking the file."], ["The officer called", "he", "to the counter", "after checking the file."], 1, "him", "The pronoun receives the action of called, so the object form is needed."),
  s("PRN-E-006", "easy", "GR-PRN-002", "sports", ["The coach thanked", "her", "for the report", "after practice."], ["The coach thanked", "she", "for the report", "after practice."], 1, "her", "The pronoun is the object of thanked, so the object form is needed."),
  s("PRN-E-007", "easy", "GR-PRN-002", "banking", ["The clerk spoke to", "us", "about the account", "at the desk."], ["The clerk spoke to", "we", "about the account", "at the desk."], 1, "us", "The pronoun comes after the preposition to, so the object form is needed."),
  s("PRN-E-008", "easy", "GR-PRN-002", "technology", ["The technician helped", "them", "with the update", "in the office."], ["The technician helped", "they", "with the update", "in the office."], 1, "them", "The pronoun is the object of helped, so the object form is needed."),

  s("PRN-E-009", "easy", "GR-PRN-003", "household", ["This is", "my", "notebook", "on the table."], ["This is", "mine", "notebook", "on the table."], 1, "my", "A noun follows, so the possessive determiner my is needed."),
  s("PRN-E-010", "easy", "GR-PRN-003", "science", ["The blue folder is", "hers", "and the green one", "is mine."], ["The blue folder is", "her", "and the green one", "is mine."], 1, "hers", "No noun follows the possessive form, so the independent form hers is needed."),
  s("PRN-E-011", "easy", "GR-PRN-003", "postal", ["They collected", "their", "parcels", "from the counter."], ["They collected", "theirs", "parcels", "from the counter."], 1, "their", "The noun parcels follows, so their is the correct possessive form."),
  s("PRN-E-012", "easy", "GR-PRN-003", "media", ["That camera is", "ours", "but the tripod", "belongs to them."], ["That camera is", "our", "but the tripod", "belongs to them."], 1, "ours", "The possessive form stands alone here, so ours is needed."),

  s("PRN-E-013", "easy", "GR-PRN-008", "manufacturing", ["The supervisor,", "who", "joined last month,", "checked the line."], ["The supervisor,", "which", "joined last month,", "checked the line."], 1, "who", "The relative pronoun refers to a person, so who is needed."),
  s("PRN-E-014", "easy", "GR-PRN-008", "environment", ["The new filter,", "which", "was installed yesterday,", "works well."], ["The new filter,", "who", "was installed yesterday,", "works well."], 1, "which", "The relative pronoun refers to a thing, so which is needed."),
  s("PRN-E-015", "easy", "GR-PRN-008", "culture", ["The guide,", "who", "knows the building well,", "led the group."], ["The guide,", "which", "knows the building well,", "led the group."], 1, "who", "The antecedent guide is a person, so who is needed."),
  s("PRN-E-016", "easy", "GR-PRN-008", "energy", ["The control panel,", "which", "was replaced last week,", "is working normally."], ["The control panel,", "who", "was replaced last week,", "is working normally."], 1, "which", "The antecedent control panel is a thing, so which is needed."),

  s("PRN-E-017", "easy", "GR-PRN-009", "agriculture", ["These", "seed packets", "are ready", "for distribution."], ["This", "seed packets", "are ready", "for distribution."], 0, "These", "Seed packets is plural, so the plural demonstrative these is needed."),
  s("PRN-E-018", "easy", "GR-PRN-009", "hospitality", ["That", "room", "is reserved", "for the guest."], ["Those", "room", "is reserved", "for the guest."], 0, "That", "Room is singular, so the singular demonstrative that is needed."),
  s("PRN-E-019", "easy", "GR-PRN-009", "emergency-service", ["Those", "warning signs", "were placed", "near the entrance."], ["That", "warning signs", "were placed", "near the entrance."], 0, "Those", "Warning signs is plural, so those is needed."),
  s("PRN-E-020", "easy", "GR-PRN-009", "infrastructure", ["This", "bridge", "needs another inspection", "before reopening."], ["These", "bridge", "needs another inspection", "before reopening."], 0, "This", "Bridge is singular, so this is needed."),

  // Medium: all ten rule families with clear grammatical cues.
  s("PRN-M-001", "medium", "GR-PRN-001", "education", ["Rina and I", "prepared the display", "for the school exhibition", "after class."], ["Rina and me", "prepared the display", "for the school exhibition", "after class."], 0, "Rina and I", "The whole phrase is the subject of prepared, so I is needed."),
  s("PRN-M-002", "medium", "GR-PRN-001", "commerce", ["The store manager and she", "checked the stock", "before the doors opened", "in the morning."], ["The store manager and her", "checked the stock", "before the doors opened", "in the morning."], 0, "The store manager and she", "The pronoun is part of the subject, so the subject form she is needed."),

  s("PRN-M-003", "medium", "GR-PRN-002", "banking", ["The branch manager spoke to", "Ravi and me", "about the missing document", "after the meeting."], ["The branch manager spoke to", "Ravi and I", "about the missing document", "after the meeting."], 1, "Ravi and me", "The pronoun follows the preposition to, so the object form me is needed."),
  s("PRN-M-004", "medium", "GR-PRN-002", "public-service", ["The officer asked", "Neha and him", "to wait outside", "until their turn."], ["The officer asked", "Neha and he", "to wait outside", "until their turn."], 1, "Neha and him", "The pronoun is part of the object of asked, so him is needed."),

  s("PRN-M-005", "medium", "GR-PRN-003", "technology", ["The laptop on the left is", "theirs", "while the one near the printer", "is ours."], ["The laptop on the left is", "their", "while the one near the printer", "is ours."], 1, "theirs", "The possessive form stands alone, so theirs is needed."),
  s("PRN-M-006", "medium", "GR-PRN-003", "healthcare", ["The nurse placed", "her", "notes beside the file", "before the doctor arrived."], ["The nurse placed", "hers", "notes beside the file", "before the doctor arrived."], 1, "her", "Notes follows the possessive form, so her is needed before the noun."),

  s("PRN-M-007", "medium", "GR-PRN-004", "sports", ["The player blamed", "himself", "for missing the final shot", "after the match."], ["The player blamed", "him", "for missing the final shot", "after the match."], 1, "himself", "The object refers back to the subject player, so a reflexive pronoun is needed."),
  s("PRN-M-008", "medium", "GR-PRN-004", "media", ["The reporter reminded", "herself", "to verify the figures", "before filing the story."], ["The reporter reminded", "her", "to verify the figures", "before filing the story."], 1, "herself", "The reporter and the object are the same person, so herself is needed."),

  s("PRN-M-009", "medium", "GR-PRN-005", "science", ["The researcher sent", "me", "the revised table", "after checking the results."], ["The researcher sent", "myself", "the revised table", "after checking the results."], 1, "me", "There is no reflexive relationship with researcher, so the ordinary object form me is needed."),
  s("PRN-M-010", "medium", "GR-PRN-005", "transport", ["The supervisor called", "him", "into the office", "after the inspection."], ["The supervisor called", "himself", "into the office", "after the inspection."], 1, "him", "The object refers to another person, not the supervisor, so him is needed."),

  s("PRN-M-011", "medium", "GR-PRN-006", "manufacturing", ["The machines", "need their", "safety covers", "before operation."], ["The machines", "need its", "safety covers", "before operation."], 1, "need their", "Machines is plural, so the pronoun referring to them must also be plural."),
  s("PRN-M-012", "medium", "GR-PRN-006", "energy", ["The generator", "lost its", "protective cover", "during transport."], ["The generator", "lost their", "protective cover", "during transport."], 1, "lost its", "Generator is singular, so its is the matching possessive pronoun form."),

  s("PRN-M-013", "medium", "GR-PRN-007", "culture", ["The guide asked", "whom", "the visitors had contacted", "before entering the hall."], ["The guide asked", "who", "the visitors had contacted", "before entering the hall."], 1, "whom", "The visitors contacted the person, so the pronoun is the object and whom is needed."),
  s("PRN-M-014", "medium", "GR-PRN-007", "emergency-service", ["The officer asked", "who", "had reported the fire", "before the team arrived."], ["The officer asked", "whom", "had reported the fire", "before the team arrived."], 1, "who", "The pronoun is the subject of had reported, so who is needed."),

  s("PRN-M-015", "medium", "GR-PRN-008", "environment", ["The field officer,", "who", "had inspected the site earlier,", "returned in the afternoon."], ["The field officer,", "which", "had inspected the site earlier,", "returned in the afternoon."], 1, "who", "Field officer refers to a person, so who is needed."),
  s("PRN-M-016", "medium", "GR-PRN-008", "infrastructure", ["The old bridge,", "which", "had been closed for repairs,", "reopened on Monday."], ["The old bridge,", "who", "had been closed for repairs,", "reopened on Monday."], 1, "which", "Bridge refers to a thing, so which is needed."),

  s("PRN-M-017", "medium", "GR-PRN-009", "postal", ["Those", "parcels near the door", "belong to the morning route", "not the evening route."], ["That", "parcels near the door", "belong to the morning route", "not the evening route."], 0, "Those", "Parcels is plural, so the plural demonstrative those is needed."),
  s("PRN-M-018", "medium", "GR-PRN-009", "household", ["This", "set of keys", "belongs in the drawer", "beside the desk."], ["These", "set of keys", "belongs in the drawer", "beside the desk."], 0, "This", "Set is the singular head noun, so this is needed."),

  s("PRN-M-019", "medium", "GR-PRN-010", "agriculture", ["The farmer", "whose tractor was repaired", "returned to the field", "before noon."], ["The farmer", "who's tractor was repaired", "returned to the field", "before noon."], 1, "whose tractor was repaired", "The phrase shows possession of the tractor, so whose is needed."),
  s("PRN-M-020", "medium", "GR-PRN-010", "hospitality", ["The guest", "who's waiting in the lobby", "has already completed", "the check-in form."], ["The guest", "whose waiting in the lobby", "has already completed", "the check-in form."], 1, "who's waiting in the lobby", "Who is waiting is intended, so the contraction who's is needed."),

  // Hard: longer dependencies and plausible distractors, but still plain vocabulary.
  s("PRN-H-001", "hard", "GR-PRN-002", "banking", ["After the documents were checked,", "the branch manager spoke to", "the customer and me", "about the final signature."], ["After the documents were checked,", "the branch manager spoke to", "the customer and I", "about the final signature."], 2, "the customer and me", "The pronoun is still the object of the preposition to, even inside a compound phrase."),
  s("PRN-H-002", "hard", "GR-PRN-002", "education", ["Although the schedule had changed,", "the coordinator sent", "Rita and him", "the revised timetable before noon."], ["Although the schedule had changed,", "the coordinator sent", "Rita and he", "the revised timetable before noon."], 2, "Rita and him", "The compound phrase receives the action of sent, so him is the correct object form."),
  s("PRN-H-003", "hard", "GR-PRN-002", "public-service", ["Before the hearing began,", "the clerk handed the file to", "the officer and us", "for a final check."], ["Before the hearing began,", "the clerk handed the file to", "the officer and we", "for a final check."], 2, "the officer and us", "The pronoun follows to and therefore needs the object form us."),

  s("PRN-H-004", "hard", "GR-PRN-004", "sports", ["After reviewing the recording,", "the captain blamed", "herself", "for making the final mistake."], ["After reviewing the recording,", "the captain blamed", "her", "for making the final mistake."], 2, "herself", "The person blamed is the same person as the subject captain, so the reflexive form is required."),
  s("PRN-H-005", "hard", "GR-PRN-004", "technology", ["While preparing the report,", "the technician reminded", "himself", "to include the backup results."], ["While preparing the report,", "the technician reminded", "him", "to include the backup results."], 2, "himself", "The technician is reminding the same person, so himself is required."),
  s("PRN-H-006", "hard", "GR-PRN-004", "healthcare", ["Before speaking to the family,", "the doctor allowed", "herself", "a few minutes to review the notes."], ["Before speaking to the family,", "the doctor allowed", "her", "a few minutes to review the notes."], 2, "herself", "The doctor gives the time to the same person, so the reflexive form is needed."),

  s("PRN-H-007", "hard", "GR-PRN-005", "science", ["After the meeting ended,", "the project leader asked", "me", "to send the final readings."], ["After the meeting ended,", "the project leader asked", "myself", "to send the final readings."], 2, "me", "The object is a different person from the project leader, so the ordinary object pronoun me is needed."),
  s("PRN-H-008", "hard", "GR-PRN-005", "commerce", ["Once the delivery was confirmed,", "the supplier contacted", "us", "about the remaining boxes."], ["Once the delivery was confirmed,", "the supplier contacted", "ourselves", "about the remaining boxes."], 2, "us", "There is no reflexive link with supplier, so us is the correct object pronoun."),
  s("PRN-H-009", "hard", "GR-PRN-005", "media", ["Before the programme started,", "the editor introduced", "him", "to the production team."], ["Before the programme started,", "the editor introduced", "himself", "to the production team."], 2, "him", "The sentence refers to another man, not the editor, so the ordinary object pronoun is required."),

  s("PRN-H-010", "hard", "GR-PRN-006", "manufacturing", ["Although both machines look similar,", "the older units still need", "their", "original safety guards."], ["Although both machines look similar,", "the older units still need", "its", "original safety guards."], 2, "their", "Units is plural, so the pronoun referring back to them must be plural."),
  s("PRN-H-011", "hard", "GR-PRN-006", "infrastructure", ["After the inspection was completed,", "the bridge reopened with", "its", "new warning signs in place."], ["After the inspection was completed,", "the bridge reopened with", "their", "new warning signs in place."], 2, "its", "Bridge is singular, so its is the matching possessive form."),
  s("PRN-H-012", "hard", "GR-PRN-006", "energy", ["Because the two generators serve separate buildings,", "they each retain", "their", "own control panels."], ["Because the two generators serve separate buildings,", "they each retain", "its", "own control panels."], 2, "their", "The antecedent they is plural, so their must be plural too."),

  s("PRN-H-013", "hard", "GR-PRN-007", "culture", ["The curator wanted to know", "whom", "the visiting group had invited", "to speak at the event."], ["The curator wanted to know", "who", "the visiting group had invited", "to speak at the event."], 1, "whom", "The visiting group invited the person, so the pronoun is an object and whom is required."),
  s("PRN-H-014", "hard", "GR-PRN-007", "emergency-service", ["Before the report was filed,", "the officer asked", "who", "had first noticed the smoke."], ["Before the report was filed,", "the officer asked", "whom", "had first noticed the smoke."], 2, "who", "The pronoun performs the action had noticed, so it is the subject and who is required."),
  s("PRN-H-015", "hard", "GR-PRN-007", "transport", ["The supervisor could not remember", "whom", "the driver had called", "after the delay was announced."], ["The supervisor could not remember", "who", "the driver had called", "after the delay was announced."], 1, "whom", "The driver called the person, so the pronoun functions as the object."),

  s("PRN-H-016", "hard", "GR-PRN-008", "environment", ["The senior field officer,", "who", "had reviewed the earlier survey,", "recommended another inspection."], ["The senior field officer,", "which", "had reviewed the earlier survey,", "recommended another inspection."], 1, "who", "The antecedent is a person, so who is required in this non-restrictive clause."),
  s("PRN-H-017", "hard", "GR-PRN-008", "postal", ["The sorting machine,", "which", "had stopped twice that morning,", "was checked again before noon."], ["The sorting machine,", "who", "had stopped twice that morning,", "was checked again before noon."], 1, "which", "The antecedent is a machine, so which is required."),

  s("PRN-H-018", "hard", "GR-PRN-010", "agriculture", ["The farm worker", "whose tools had been moved", "checked the storage shed", "before starting work."], ["The farm worker", "who's tools had been moved", "checked the storage shed", "before starting work."], 1, "whose tools had been moved", "The tools belong to the worker, so the possessive relative pronoun whose is required."),
  s("PRN-H-019", "hard", "GR-PRN-010", "hospitality", ["The receptionist asked for the guest", "who's staying in room twelve", "because a parcel had arrived", "at the front desk."], ["The receptionist asked for the guest", "whose staying in room twelve", "because a parcel had arrived", "at the front desk."], 1, "who's staying in room twelve", "The meaning is who is staying, so who's is the correct contraction."),
  s("PRN-H-020", "hard", "GR-PRN-010", "household", ["The neighbour", "whose keys were found near the gate", "collected them", "later that evening."], ["The neighbour", "who's keys were found near the gate", "collected them", "later that evening."], 1, "whose keys were found near the gate", "The keys belong to the neighbour, so whose is required."),
] as const;

export const CP004_SCENES_BY_DIFFICULTY_V1: Readonly<Record<EnglishDifficulty, readonly PronounSceneV1[]>> = Object.freeze({
  easy: CP004_PRONOUN_SCENES_V1.filter((scene) => scene.difficulty === "easy"),
  medium: CP004_PRONOUN_SCENES_V1.filter((scene) => scene.difficulty === "medium"),
  hard: CP004_PRONOUN_SCENES_V1.filter((scene) => scene.difficulty === "hard"),
});
