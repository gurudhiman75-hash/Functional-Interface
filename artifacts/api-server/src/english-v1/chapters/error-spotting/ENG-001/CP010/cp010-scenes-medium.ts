import { modifierScene, type ModifierSceneV1 } from "./cp010-scene-types";

export const CP010_MEDIUM_SCENES_V1: readonly ModifierSceneV1[] = [
  modifierScene({
    id: "MOD-M01", difficulty: "medium", ruleId: "GR-MOD-001", domain: "inspection", errorIndex: 0,
    correctSegments: ["Reviewing the damaged section from the platform, the engineer identified two loose panels", "on the eastern side", "during the afternoon inspection", "before the area was reopened."],
    errorSegments: ["Reviewing the damaged section from the platform, two loose panels were identified by the engineer", "on the eastern side", "during the afternoon inspection", "before the area was reopened."],
    reason: "The engineer performed the review, so the opening participial phrase must attach to the engineer rather than to 'two loose panels'.",
  }),
  modifierScene({
    id: "MOD-M02", difficulty: "medium", ruleId: "GR-MOD-001", domain: "finance", errorIndex: 1,
    correctSegments: ["Comparing the monthly statements,", "the accountant noticed a repeated charge", "in the supplier account", "during the reconciliation review."],
    errorSegments: ["Comparing the monthly statements,", "a repeated charge was noticed by the accountant", "in the supplier account", "during the reconciliation review."],
    reason: "The accountant compared the statements, so the main-clause subject immediately after the modifier must be 'the accountant'.",
  }),
  modifierScene({
    id: "MOD-M03", difficulty: "medium", ruleId: "GR-MOD-002", domain: "research", errorIndex: 2,
    correctSegments: ["Having completed the field survey,", "by the end of June,", "the research team began analysing the responses", "at the central office."],
    errorSegments: ["Having completed the field survey,", "by the end of June,", "the responses began being analysed by the research team", "at the central office."],
    reason: "The research team completed the survey, so it must be the subject controlled by the opening perfect-participle phrase.",
  }),
  modifierScene({
    id: "MOD-M04", difficulty: "medium", ruleId: "GR-MOD-002", domain: "procurement", errorIndex: 3,
    correctSegments: ["Having been approved by the board,", "after two rounds of review,", "with only minor changes,", "the revised procurement plan was issued to all departments."],
    errorSegments: ["Having been approved by the board,", "after two rounds of review,", "with only minor changes,", "all departments received the revised procurement plan."],
    reason: "The opening passive participial phrase describes the revised plan, so the main clause must keep that plan as the grammatical subject.",
  }),
  modifierScene({
    id: "MOD-M05", difficulty: "medium", ruleId: "GR-MOD-003", domain: "conference", errorIndex: 0,
    correctSegments: ["Eager to begin the presentation, Meera checked the projector once more", "while the audience settled", "into their seats", "before the session."],
    errorSegments: ["Eager to begin the presentation, the projector received one more check from Meera", "while the audience settled", "into their seats", "before the session."],
    reason: "'Eager to begin the presentation' describes Meera, so Meera must be the subject that follows the opening phrase.",
  }),
  modifierScene({
    id: "MOD-M06", difficulty: "medium", ruleId: "GR-MOD-003", domain: "audit", errorIndex: 1,
    correctSegments: ["Uncertain about the final total,", "the auditor recalculated the entries", "during the second review", "before the file was closed."],
    errorSegments: ["Uncertain about the final total,", "the reconciliation sheet was recalculated by the auditor", "during the second review", "before the file was closed."],
    reason: "The uncertainty belongs to the auditor, not to the reconciliation sheet, so the auditor must be the main-clause subject.",
  }),
  modifierScene({
    id: "MOD-M07", difficulty: "medium", ruleId: "GR-MOD-004", domain: "housing", errorIndex: 2,
    correctSegments: ["The officer approved", "the application", "that included the ownership certificate for the applicant", "waiting outside."],
    errorSegments: ["The officer approved", "the application", "for the applicant that included the ownership certificate", "waiting outside."],
    reason: "The relative clause describes the application, so it must follow 'application' rather than 'applicant'.",
  }),
  modifierScene({
    id: "MOD-M08", difficulty: "medium", ruleId: "GR-MOD-004", domain: "medical-records", errorIndex: 3,
    correctSegments: ["The nurse handed", "the doctor", "the patient's file", "which contained the latest test reports, before the consultation."],
    errorSegments: ["The nurse handed", "the doctor", "the patient's file", "before the consultation, which contained the latest test reports."],
    reason: "The relative clause describes the patient's file; placing 'which' after 'the consultation' wrongly makes the consultation its antecedent.",
  }),
  modifierScene({
    id: "MOD-M09", difficulty: "medium", ruleId: "GR-MOD-005", domain: "interview", errorIndex: 0,
    correctSegments: ["The panel asked only the shortlisted candidates, not the entire group, to remain", "after the first round", "for document verification", "in the next room."],
    errorSegments: ["Only the panel asked the shortlisted candidates, not the entire group, to remain", "after the first round", "for document verification", "in the next room."],
    reason: "The contrast limits which candidates were asked to remain, so 'only' belongs with 'the shortlisted candidates', not with 'the panel'.",
  }),
  modifierScene({
    id: "MOD-M10", difficulty: "medium", ruleId: "GR-MOD-005", domain: "inventory", errorIndex: 1,
    correctSegments: ["During the stock check,", "the supervisor counted only the sealed cartons, not the open boxes", "in the rear store", "before recording the total."],
    errorSegments: ["During the stock check,", "only the supervisor counted the sealed cartons, not the open boxes", "in the rear store", "before recording the total."],
    reason: "The contrast 'not the open boxes' shows that 'only' limits the objects counted, not the person doing the counting.",
  }),
  modifierScene({
    id: "MOD-M11", difficulty: "medium", ruleId: "GR-MOD-006", domain: "budget", errorIndex: 2,
    correctSegments: ["The revised estimate", "was lower than the first one", "by nearly ten per cent", "after the material rates were updated."],
    errorSegments: ["The revised estimate", "was lower than the first one", "nearly by ten per cent", "after the material rates were updated."],
    reason: "'Nearly' modifies the amount 'ten per cent' and should be placed immediately before that amount.",
  }),
  modifierScene({
    id: "MOD-M12", difficulty: "medium", ruleId: "GR-MOD-006", domain: "attendance", errorIndex: 3,
    correctSegments: ["The hall was filled", "to almost its full capacity", "by the opening hour,", "with only six seats remaining vacant."],
    errorSegments: ["The hall was filled", "to almost its full capacity", "by the opening hour,", "with six seats almost remaining vacant."],
    reason: "'Almost' should modify the degree or quantity approached, not be inserted between 'seats' and the participle 'remaining'.",
  }),
  modifierScene({
    id: "MOD-M13", difficulty: "medium", ruleId: "GR-MOD-007", domain: "compliance", errorIndex: 0,
    correctSegments: ["The contractor had not even submitted the mandatory insurance copy", "when the inspection team arrived", "for the scheduled visit", "on Monday morning."],
    errorSegments: ["The contractor had even not submitted the mandatory insurance copy", "when the inspection team arrived", "for the scheduled visit", "on Monday morning."],
    reason: "In this negative perfect clause, 'even' should follow 'not' and precede the focused verb phrase 'submitted the mandatory insurance copy'.",
  }),
  modifierScene({
    id: "MOD-M14", difficulty: "medium", ruleId: "GR-MOD-007", domain: "results", errorIndex: 1,
    correctSegments: ["By the closing date,", "several candidates had not even uploaded their final certificates", "although reminders", "had been sent twice."],
    errorSegments: ["By the closing date,", "several candidates had even not uploaded their final certificates", "although reminders", "had been sent twice."],
    reason: "The standard focus position is 'had not even uploaded'; placing 'even' before 'not' produces an unnatural exam-standard order.",
  }),
  modifierScene({
    id: "MOD-M15", difficulty: "medium", ruleId: "GR-MOD-008", domain: "maintenance", errorIndex: 2,
    correctSegments: ["During the weekly check,", "the technician", "normally tests the backup generator", "before the building opens."],
    errorSegments: ["During the weekly check,", "the technician", "tests normally the backup generator", "before the building opens."],
    reason: "The frequency adverb 'normally' should come before the main verb 'tests', not between the verb and its object.",
  }),
  modifierScene({
    id: "MOD-M16", difficulty: "medium", ruleId: "GR-MOD-008", domain: "customer-service", errorIndex: 3,
    correctSegments: ["The helpline staff", "rarely keep callers waiting", "for more than a minute", "during normal working hours."],
    errorSegments: ["The helpline staff", "rarely keep callers waiting", "for more than a minute", "during rarely normal working hours."],
    reason: "'Rarely' modifies how often the staff keep callers waiting; it should not be placed inside the time expression.",
  }),
  modifierScene({
    id: "MOD-M17", difficulty: "medium", ruleId: "GR-MOD-009", domain: "briefing", errorIndex: 0,
    correctSegments: ["The officer described the revised procedure carefully", "so that the new staff", "could follow each step", "without confusion."],
    errorSegments: ["The officer described carefully the revised procedure", "so that the new staff", "could follow each step", "without confusion."],
    reason: "The manner adverb should not separate the transitive verb from its object here; 'described the revised procedure carefully' is the natural order.",
  }),
  modifierScene({
    id: "MOD-M18", difficulty: "medium", ruleId: "GR-MOD-009", domain: "filing", errorIndex: 1,
    correctSegments: ["After verification,", "the assistant arranged the documents neatly", "in separate folders", "for each department."],
    errorSegments: ["After verification,", "the assistant arranged neatly the documents", "in separate folders", "for each department."],
    reason: "The object 'the documents' should stay with 'arranged'; the manner adverb is naturally placed after the object.",
  }),
  modifierScene({
    id: "MOD-M19", difficulty: "medium", ruleId: "GR-MOD-010", domain: "shipment", errorIndex: 2,
    correctSegments: ["Before the rain began,", "the warehouse team moved", "the crates marked for export to the covered bay", "under the loading shed."],
    errorSegments: ["Before the rain began,", "the warehouse team moved", "the crates to the covered bay marked for export", "under the loading shed."],
    reason: "The participial phrase 'marked for export' describes the crates and must stay next to 'crates', not next to 'covered bay'.",
  }),
  modifierScene({
    id: "MOD-M20", difficulty: "medium", ruleId: "GR-MOD-010", domain: "healthcare", errorIndex: 3,
    correctSegments: ["Before the shift changed,", "after the request from Ward 3,", "at the emergency desk,", "the attendant delivered the oxygen cylinder reserved for Ward 3 to the duty nurse."],
    errorSegments: ["Before the shift changed,", "after the request from Ward 3,", "at the emergency desk,", "the attendant delivered the oxygen cylinder to the duty nurse reserved for Ward 3."],
    reason: "'Reserved for Ward 3' modifies the oxygen cylinder; placing it next to 'duty nurse' creates the wrong attachment.",
  }),
];
