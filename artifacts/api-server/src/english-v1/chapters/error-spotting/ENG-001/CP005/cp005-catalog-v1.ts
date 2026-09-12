import type { EnglishDifficulty, PrepositionRuleId } from "../../../../core/types";

export interface PrepositionSceneV1 {
  id: string;
  domain: string;
  ruleId: PrepositionRuleId;
  difficulty: EnglishDifficulty;
  correctSegments: readonly [string, string, string, string];
  errorSegments: readonly [string, string, string, string];
  errorIndex: 0 | 1 | 2 | 3;
  correction: string;
  reason: string;
}

const scene = (
  id: string,
  domain: string,
  ruleId: PrepositionRuleId,
  difficulty: EnglishDifficulty,
  correctSegments: readonly [string, string, string, string],
  errorSegments: readonly [string, string, string, string],
  errorIndex: 0 | 1 | 2 | 3,
  correction: string,
  reason: string,
): PrepositionSceneV1 => ({ id, domain, ruleId, difficulty, correctSegments, errorSegments, errorIndex, correction, reason });

const EASY: readonly PrepositionSceneV1[] = [
  scene("PRP-E01", "education", "GR-PRP-001", "easy", ["The class begins", "at nine", "in the morning", "every Monday."], ["The class begins", "on nine", "in the morning", "every Monday."], 1, "at nine", "Use at with a clock time."),
  scene("PRP-E02", "banking", "GR-PRP-001", "easy", ["The branch remains closed", "on Sunday", "for routine work", "each week."], ["The branch remains closed", "at Sunday", "for routine work", "each week."], 1, "on Sunday", "Use on with a day of the week."),
  scene("PRP-E03", "agriculture", "GR-PRP-001", "easy", ["The crop was planted", "in June", "after the first rain", "that year."], ["The crop was planted", "on June", "after the first rain", "that year."], 1, "in June", "Use in with a month."),
  scene("PRP-E04", "history", "GR-PRP-001", "easy", ["The museum opened", "in 1998", "after restoration", "of the old building."], ["The museum opened", "on 1998", "after restoration", "of the old building."], 1, "in 1998", "Use in with a year."),

  scene("PRP-E05", "office", "GR-PRP-002", "easy", ["The notice is", "on the wall", "near the main desk", "for everyone to read."], ["The notice is", "in the wall", "near the main desk", "for everyone to read."], 1, "on the wall", "Use on for a surface."),
  scene("PRP-E06", "transport", "GR-PRP-002", "easy", ["The passengers waited", "at the gate", "before boarding", "the bus."], ["The passengers waited", "on the gate", "before boarding", "the bus."], 1, "at the gate", "Use at for a specific point."),
  scene("PRP-E07", "library", "GR-PRP-002", "easy", ["The old records are", "in the cabinet", "beside the counter", "for safe keeping."], ["The old records are", "on the cabinet", "beside the counter", "for safe keeping."], 1, "in the cabinet", "Use in for something enclosed inside a container."),
  scene("PRP-E08", "household", "GR-PRP-002", "easy", ["The keys are", "on the table", "next to the lamp", "in the hall."], ["The keys are", "at the table", "next to the lamp", "in the hall."], 1, "on the table", "Use on when something rests on a surface."),

  scene("PRP-E09", "employment", "GR-PRP-003", "easy", ["She has worked here", "since 2021", "without changing", "her department."], ["She has worked here", "for 2021", "without changing", "her department."], 1, "since 2021", "Use since with a starting point."),
  scene("PRP-E10", "healthcare", "GR-PRP-003", "easy", ["The clinic has served", "this area", "for ten years", "without interruption."], ["The clinic has served", "this area", "since ten years", "without interruption."], 2, "for ten years", "Use for with a period of time."),
  scene("PRP-E11", "technology", "GR-PRP-003", "easy", ["The server has been offline", "since noon", "because of maintenance", "in the building."], ["The server has been offline", "for noon", "because of maintenance", "in the building."], 1, "since noon", "Use since with a point in time."),
  scene("PRP-E12", "sports", "GR-PRP-003", "easy", ["The team has trained", "for three weeks", "before the final", "at the stadium."], ["The team has trained", "since three weeks", "before the final", "at the stadium."], 1, "for three weeks", "Use for with a duration."),

  scene("PRP-E13", "school", "GR-PRP-006", "easy", ["The children ran", "into the classroom", "when the bell rang", "after lunch."], ["The children ran", "in the classroom", "when the bell rang", "after lunch."], 1, "into the classroom", "Use into for movement from outside to inside."),
  scene("PRP-E14", "warehouse", "GR-PRP-006", "easy", ["The boxes are", "in the store room", "behind the office", "for later use."], ["The boxes are", "into the store room", "behind the office", "for later use."], 1, "in the store room", "Use in for a static position inside a place."),
  scene("PRP-E15", "weather", "GR-PRP-006", "easy", ["Rainwater flowed", "into the tank", "through a narrow pipe", "during the storm."], ["Rainwater flowed", "in the tank", "through a narrow pipe", "during the storm."], 1, "into the tank", "Use into for inward movement."),
  scene("PRP-E16", "science", "GR-PRP-006", "easy", ["The sample remained", "in the container", "throughout the test", "in the laboratory."], ["The sample remained", "into the container", "throughout the test", "in the laboratory."], 1, "in the container", "Use in for position, not movement."),

  scene("PRP-E17", "office", "GR-PRP-007", "easy", ["The printer stands", "beside the cabinet", "near the window", "in the office."], ["The printer stands", "besides the cabinet", "near the window", "in the office."], 1, "beside the cabinet", "Beside means next to."),
  scene("PRP-E18", "education", "GR-PRP-007", "easy", ["Besides English,", "she studies mathematics", "and general science", "for the exam."], ["Beside English,", "she studies mathematics", "and general science", "for the exam."], 0, "Besides English,", "Besides means in addition to."),
  scene("PRP-E19", "transport", "GR-PRP-007", "easy", ["A guard stood", "beside the entrance", "while passengers", "entered the hall."], ["A guard stood", "besides the entrance", "while passengers", "entered the hall."], 1, "beside the entrance", "Beside means next to a place or object."),
  scene("PRP-E20", "commerce", "GR-PRP-007", "easy", ["Besides the fee,", "the customer paid", "a small service charge", "at the counter."], ["Beside the fee,", "the customer paid", "a small service charge", "at the counter."], 0, "Besides the fee,", "Besides means in addition to something."),
];

const MEDIUM: readonly PrepositionSceneV1[] = [
  scene("PRP-M01", "administration", "GR-PRP-001", "medium", ["The committee will meet", "on 14 September", "at the district office", "to review the report."], ["The committee will meet", "in 14 September", "at the district office", "to review the report."], 1, "on 14 September", "Use on with a specific date."),
  scene("PRP-M02", "travel", "GR-PRP-001", "medium", ["The train is expected", "at midnight", "after a long delay", "caused by heavy rain."], ["The train is expected", "in midnight", "after a long delay", "caused by heavy rain."], 1, "at midnight", "Use at with the precise time expression midnight."),

  scene("PRP-M03", "manufacturing", "GR-PRP-002", "medium", ["The safety chart is displayed", "on the notice board", "outside the workshop", "for all workers."], ["The safety chart is displayed", "in the notice board", "outside the workshop", "for all workers."], 1, "on the notice board", "Use on for something attached to a surface."),
  scene("PRP-M04", "research", "GR-PRP-002", "medium", ["The researchers are working", "in the laboratory", "at the rear of the building", "throughout the week."], ["The researchers are working", "on the laboratory", "at the rear of the building", "throughout the week."], 1, "in the laboratory", "Use in for an enclosed working space."),

  scene("PRP-M05", "public-service", "GR-PRP-003", "medium", ["The help desk has operated", "since last Monday", "with extended hours", "for public enquiries."], ["The help desk has operated", "for last Monday", "with extended hours", "for public enquiries."], 1, "since last Monday", "Use since with the point when an action began."),
  scene("PRP-M06", "environment", "GR-PRP-003", "medium", ["The water level has remained low", "for several months", "despite recent showers", "in the region."], ["The water level has remained low", "since several months", "despite recent showers", "in the region."], 1, "for several months", "Use for with a length of time."),

  scene("PRP-M07", "recruitment", "GR-PRP-004", "medium", ["Applicants must submit", "the signed form", "by Friday", "to remain eligible."], ["Applicants must submit", "the signed form", "until Friday", "to remain eligible."], 2, "by Friday", "Use by for a deadline for completion."),
  scene("PRP-M08", "retail", "GR-PRP-004", "medium", ["The store will remain open", "until ten o'clock", "during the festival", "this week."], ["The store will remain open", "by ten o'clock", "during the festival", "this week."], 1, "until ten o'clock", "Use until when a state continues up to a time."),

  scene("PRP-M09", "diplomacy", "GR-PRP-005", "medium", ["The agreement was signed", "between the two agencies", "after several meetings", "during the year."], ["The agreement was signed", "among the two agencies", "after several meetings", "during the year."], 1, "between the two agencies", "Use between for two distinct parties."),
  scene("PRP-M10", "community", "GR-PRP-005", "medium", ["The relief material was distributed", "among the affected families", "after registration", "at the camp."], ["The relief material was distributed", "between the affected families", "after registration", "at the camp."], 1, "among the affected families", "Use among for members of a group considered collectively."),

  scene("PRP-M11", "security", "GR-PRP-006", "medium", ["The officer stepped", "into the control room", "after receiving", "the emergency call."], ["The officer stepped", "in the control room", "after receiving", "the emergency call."], 1, "into the control room", "Use into for movement to the inside of a place."),
  scene("PRP-M12", "logistics", "GR-PRP-006", "medium", ["The documents remained", "in the sealed packet", "until the courier", "reached the office."], ["The documents remained", "into the sealed packet", "until the courier", "reached the office."], 1, "in the sealed packet", "Use in for a continuing position inside something."),

  scene("PRP-M13", "hospitality", "GR-PRP-007", "medium", ["The reception desk is", "beside the main staircase", "near the entrance", "to the hotel."], ["The reception desk is", "besides the main staircase", "near the entrance", "to the hotel."], 1, "beside the main staircase", "Beside means next to."),
  scene("PRP-M14", "finance", "GR-PRP-007", "medium", ["Besides the basic salary,", "employees receive", "a travel allowance", "under the scheme."], ["Beside the basic salary,", "employees receive", "a travel allowance", "under the scheme."], 0, "Besides the basic salary,", "Besides means in addition to."),

  scene("PRP-M15", "technology", "GR-PRP-008", "medium", ["The new staff are", "familiar with the software", "used for billing", "in the department."], ["The new staff are", "familiar to the software", "used for billing", "in the department."], 1, "familiar with the software", "The standard adjective complement is familiar with."),
  scene("PRP-M16", "governance", "GR-PRP-008", "medium", ["The officer is", "responsible for checking", "all supporting documents", "before approval."], ["The officer is", "responsible to checking", "all supporting documents", "before approval."], 1, "responsible for checking", "Use responsible for before an activity or duty."),

  scene("PRP-M17", "business", "GR-PRP-009", "medium", ["Small firms often depend", "on regular cash flow", "to meet wages", "and routine expenses."], ["Small firms often depend", "of regular cash flow", "to meet wages", "and routine expenses."], 1, "on regular cash flow", "The verb depend takes on in this meaning."),
  scene("PRP-M18", "regulation", "GR-PRP-009", "medium", ["All contractors must comply", "with the safety rules", "before entering", "the work site."], ["All contractors must comply", "to the safety rules", "before entering", "the work site."], 1, "with the safety rules", "The standard combination is comply with."),

  scene("PRP-M19", "economy", "GR-PRP-010", "medium", ["There has been", "an increase in demand", "for skilled workers", "during the season."], ["There has been", "an increase on demand", "for skilled workers", "during the season."], 1, "an increase in demand", "Use increase in when naming what has increased."),
  scene("PRP-M20", "engineering", "GR-PRP-010", "medium", ["The team found", "a solution to the problem", "after testing", "several alternatives."], ["The team found", "a solution for the problem", "after testing", "several alternatives."], 1, "a solution to the problem", "The standard noun complement is solution to a problem."),
];

const HARD: readonly PrepositionSceneV1[] = [
  scene("PRP-H01", "audit", "GR-PRP-001", "hard", ["The final accounts will be placed", "before the board on 30 September", "after the internal review is completed", "by the finance division."], ["The final accounts will be placed", "before the board in 30 September", "after the internal review is completed", "by the finance division."], 1, "before the board on 30 September", "Use on with a specific calendar date."),
  scene("PRP-H02", "astronomy", "GR-PRP-001", "hard", ["The observation window opens", "at 3:30 a.m.", "when the sky is expected to be clear", "according to the schedule."], ["The observation window opens", "on 3:30 a.m.", "when the sky is expected to be clear", "according to the schedule."], 1, "at 3:30 a.m.", "Use at with an exact clock time."),

  scene("PRP-H03", "infrastructure", "GR-PRP-002", "hard", ["A warning sign has been fixed", "on the outer gate", "so that drivers approaching the depot", "can see it from a distance."], ["A warning sign has been fixed", "in the outer gate", "so that drivers approaching the depot", "can see it from a distance."], 1, "on the outer gate", "Use on for something fixed to a surface."),
  scene("PRP-H04", "records", "GR-PRP-002", "hard", ["The original certificates are kept", "in a locked cabinet", "whose key remains with the registrar", "during office hours."], ["The original certificates are kept", "on a locked cabinet", "whose key remains with the registrar", "during office hours."], 1, "in a locked cabinet", "Use in for objects stored inside an enclosed container."),

  scene("PRP-H05", "education", "GR-PRP-003", "hard", ["The scholarship portal has remained active", "since the first week of August", "so that eligible students can upload", "their pending documents."], ["The scholarship portal has remained active", "for the first week of August", "so that eligible students can upload", "their pending documents."], 1, "since the first week of August", "Use since with the stated starting point."),
  scene("PRP-H06", "utilities", "GR-PRP-003", "hard", ["The repair crew has been working", "for more than six hours", "because the damaged line supplies power", "to several public buildings."], ["The repair crew has been working", "since more than six hours", "because the damaged line supplies power", "to several public buildings."], 1, "for more than six hours", "Use for with a duration, even when it is modified by more than."),

  scene("PRP-H07", "procurement", "GR-PRP-004", "hard", ["The selected supplier must deliver", "all listed equipment by 5 p.m.", "if the installation is to begin", "on the following morning."], ["The selected supplier must deliver", "all listed equipment until 5 p.m.", "if the installation is to begin", "on the following morning."], 1, "all listed equipment by 5 p.m.", "Use by for the latest time at which delivery must be completed."),
  scene("PRP-H08", "healthcare", "GR-PRP-004", "hard", ["The emergency counter will remain staffed", "until the replacement team arrives", "so that patients are not left", "without assistance."], ["The emergency counter will remain staffed", "by the replacement team arrives", "so that patients are not left", "without assistance."], 1, "until the replacement team arrives", "Use until for a state that continues up to an event."),

  scene("PRP-H09", "law", "GR-PRP-005", "hard", ["The dispute was settled", "between the company and the insurer", "after both sides accepted", "the revised terms."], ["The dispute was settled", "among the company and the insurer", "after both sides accepted", "the revised terms."], 1, "between the company and the insurer", "Use between for two separately identified parties."),
  scene("PRP-H10", "relief", "GR-PRP-005", "hard", ["The additional blankets were shared", "among the families waiting outside", "because the night temperature had fallen", "well below normal."], ["The additional blankets were shared", "between the families waiting outside", "because the night temperature had fallen", "well below normal."], 1, "among the families waiting outside", "Use among for distribution within a group."),

  scene("PRP-H11", "emergency-service", "GR-PRP-006", "hard", ["Smoke entered the corridor", "when air was drawn into the building", "through an open service door", "during the evacuation."], ["Smoke entered the corridor", "when air was drawn in the building", "through an open service door", "during the evacuation."], 1, "when air was drawn into the building", "Use into when movement is from outside to inside."),
  scene("PRP-H12", "laboratory", "GR-PRP-006", "hard", ["The measuring probe remained", "in the solution throughout the trial", "while the temperature was recorded", "at regular intervals."], ["The measuring probe remained", "into the solution throughout the trial", "while the temperature was recorded", "at regular intervals."], 1, "in the solution throughout the trial", "Use in for a continuing position inside something."),

  scene("PRP-H13", "project-management", "GR-PRP-008", "hard", ["The senior engineer is", "responsible for ensuring that each unit", "meets the prescribed load standard", "before it is dispatched."], ["The senior engineer is", "responsible to ensuring that each unit", "meets the prescribed load standard", "before it is dispatched."], 1, "responsible for ensuring that each unit", "Use responsible for before the duty or activity."),
  scene("PRP-H14", "training", "GR-PRP-008", "hard", ["Although newly appointed, the officer is", "already familiar with the procedure", "used to verify applications", "that require manual review."], ["Although newly appointed, the officer is", "already familiar to the procedure", "used to verify applications", "that require manual review."], 1, "already familiar with the procedure", "The standard adjective complement is familiar with."),

  scene("PRP-H15", "policy", "GR-PRP-009", "hard", ["The revised guidelines insist", "on recording every exception", "so that later decisions can be checked", "against the same standard."], ["The revised guidelines insist", "for recording every exception", "so that later decisions can be checked", "against the same standard."], 1, "on recording every exception", "The verb insist takes on before the required action."),
  scene("PRP-H16", "safety", "GR-PRP-009", "hard", ["The barrier prevents visitors", "from entering the restricted area", "while repair work is being carried out", "near the main passage."], ["The barrier prevents visitors", "to entering the restricted area", "while repair work is being carried out", "near the main passage."], 1, "from entering the restricted area", "Use prevent someone from doing something."),
  scene("PRP-H17", "compliance", "GR-PRP-009", "hard", ["Every licensed operator must comply", "with the conditions stated in the permit", "even when work is carried out", "through a subcontractor."], ["Every licensed operator must comply", "to the conditions stated in the permit", "even when work is carried out", "through a subcontractor."], 1, "with the conditions stated in the permit", "The standard verb complement is comply with."),

  scene("PRP-H18", "economics", "GR-PRP-010", "hard", ["The sudden increase in fuel costs", "was one reason for the revision", "of the transport allowance", "during the financial year."], ["The sudden increase in fuel costs", "was one reason of the revision", "of the transport allowance", "during the financial year."], 1, "was one reason for the revision", "The standard noun complement is reason for."),
  scene("PRP-H19", "planning", "GR-PRP-010", "hard", ["The committee proposed", "a practical solution to the shortage", "without reducing the number of services", "available to the public."], ["The committee proposed", "a practical solution of the shortage", "without reducing the number of services", "available to the public."], 1, "a practical solution to the shortage", "The standard noun complement is solution to."),
  scene("PRP-H20", "labour", "GR-PRP-010", "hard", ["A sharp rise in demand", "for trained technicians has created", "new vacancies across several units", "during the expansion phase."], ["A sharp rise on demand", "for trained technicians has created", "new vacancies across several units", "during the expansion phase."], 0, "A sharp rise in demand", "Use rise in when naming what has risen."),
];

export const CP005_SCENES_BY_DIFFICULTY_V1: Readonly<Record<EnglishDifficulty, readonly PrepositionSceneV1[]>> = Object.freeze({
  easy: EASY,
  medium: MEDIUM,
  hard: HARD,
});

export const CP005_ALL_SCENES_V1: readonly PrepositionSceneV1[] = Object.freeze([...EASY, ...MEDIUM, ...HARD]);
