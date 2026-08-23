import { SOURCE_SUPPORTED, c, d, p } from "./english-corpus/helpers.ts";
import { generateStaQuestionFromPool, type StaScenarioPoolByQl } from "./generator.ts";
import type { StaQuestion, StaScenarioAuthority } from "./types.ts";

/**
 * Supplemental QL004 authorities discovered during the pre-freeze exam-realness audit.
 *
 * These scenarios deliberately live outside the immutable English V2 corpus. They add
 * answer-set shapes that the original 16-authority QL004 slice cannot produce because
 * every frozen QL004 authority contains exactly one implicit bridge candidate.
 *
 * The extension therefore preserves all existing freeze blobs while broadening the
 * production-ready surface to include two- and three-implicit assumption patterns.
 */
export const STA_QL004_EXAM_REALNESS_EXTENSION: readonly StaScenarioAuthority[] = [
  {
    scenarioId: "STA-ER-QL004-BANK-FRAUD-BLOCK",
    proposedQlId: "STA-QL-004",
    checkpointId: "STA-CP-002",
    sourceProfile: "BANKING",
    discourseAct: "PREDICTION",
    objectiveIds: ["PREDICT_LOWER_POST_ALERT_FRAUD_LOSS"],
    statementVariants: [
      "A suspicious-transaction alert now includes a one-tap card-block link. The bank says this should reduce losses from later unauthorised transactions.",
      "Customers can now block a card directly from the instant fraud alert; the bank expects fewer losses from transactions attempted afterwards.",
      "With a block-card link built into each suspicious-transaction alert, subsequent fraud losses are likely to fall.",
    ],
    propositions: [
      p("P0", "FRAUD_ALERT_INCLUDES_BLOCK_LINK", "FRAUD_ALERT_DOES_NOT_INCLUDE_BLOCK_LINK", ["fraud alert", "block link"]),
      p("P1", "CUSTOMERS_CAN_NOTICE_ALERT_IN_TIME", "CUSTOMERS_CANNOT_NOTICE_ALERT_IN_TIME", ["customers", "alert"]),
      p("P2", "PROMPT_CARD_BLOCK_CAN_PREVENT_SOME_LATER_UNAUTHORISED_TRANSACTIONS", "PROMPT_CARD_BLOCK_CANNOT_PREVENT_ANY_LATER_UNAUTHORISED_TRANSACTION", ["card block", "later transactions"], "SOME"),
      p("P3", "ALL_BANK_FRAUD_USES_STOLEN_CARDS", "NOT_ALL_BANK_FRAUD_USES_STOLEN_CARDS", ["bank fraud", "stolen cards"], "ALL"),
      p("P4", "ALERT_GUARANTEES_FULL_REFUND", "ALERT_DOES_NOT_GUARANTEE_FULL_REFUND", ["alert", "refund"], "ALL"),
    ],
    explicitPropositionIds: ["P0"],
    hiddenDependencies: [
      d("D1", "P1", "AWARENESS", ["PREDICT_LOWER_POST_ALERT_FRAUD_LOSS"], "BREAKS_RATIONALE"),
      d("D2", "P2", "EFFICACY", ["PREDICT_LOWER_POST_ALERT_FRAUD_LOSS"], "BREAKS_RATIONALE"),
    ],
    candidates: [
      c("C1", "P1", ["At least some customers can notice the fraud alert in time to act on it.", "The alert can reach the customer's attention before all later misuse has already occurred."], "IMPLICIT", "A block link can reduce later losses only if at least some customers become aware of the alert while action can still matter."),
      c("C2", "P2", ["Blocking a card promptly can prevent at least some later unauthorised transactions.", "A timely card block can stop some attempted misuse that would otherwise follow."], "IMPLICIT", "The predicted fall in later losses requires prompt blocking to be capable of preventing at least some subsequent misuse."),
      c("C3", "P3", ["Every case of bank fraud involves a stolen physical card.", "All banking fraud is carried out with stolen cards."], "NOT_IMPLICIT", "The claim concerns losses after an alert and does not require one universal method for all bank fraud.", "TOO_STRONG_QUANTIFIER"),
      c("C4", "P4", ["Receiving the alert guarantees that the customer will receive a full refund.", "The bank will refund every loss whenever such an alert is sent."], "NOT_IMPLICIT", "The predicted reduction in later loss does not depend on any guarantee of reimbursement.", "RELATED_BUT_IRRELEVANT"),
    ],
    allowedCandidateCounts: [2, 3],
    difficulty: "Hard",
    sourceStatus: SOURCE_SUPPORTED,
  },
  {
    scenarioId: "STA-ER-QL004-SSC-HEAT-WAITING",
    proposedQlId: "STA-QL-004",
    checkpointId: "STA-CP-002",
    sourceProfile: "SSC",
    discourseAct: "PREDICTION",
    objectiveIds: ["PREDICT_FEWER_HEAT_WAITING_COMPLAINTS"],
    statementVariants: [
      "The exam centre has added a shaded waiting area and drinking-water points outside the gates. Heat-related complaints from waiting candidates should now decrease.",
      "Candidates waiting outside the centre now have shade and drinking water; officials believe complaints about heat will fall.",
      "After shade and water points were arranged for candidates waiting at the gate, fewer heat-related complaints are likely.",
    ],
    propositions: [
      p("P0", "CENTRE_PROVIDES_SHADE_AND_WATER", "CENTRE_DOES_NOT_PROVIDE_SHADE_AND_WATER", ["exam centre", "shade", "water"]),
      p("P1", "WAITING_CANDIDATES_CAN_USE_FACILITIES", "WAITING_CANDIDATES_CANNOT_USE_FACILITIES", ["candidates", "facilities"]),
      p("P2", "SHADE_OR_WATER_CAN_REDUCE_HEAT_DISCOMFORT", "SHADE_AND_WATER_CANNOT_REDUCE_HEAT_DISCOMFORT", ["shade", "water", "heat discomfort"]),
      p("P3", "ALL_CANDIDATE_COMPLAINTS_ARE_HEAT_RELATED", "NOT_ALL_CANDIDATE_COMPLAINTS_ARE_HEAT_RELATED", ["candidate complaints", "heat"], "ALL"),
      p("P4", "EVERY_CANDIDATE_ARRIVES_ONE_HOUR_EARLY", "NOT_EVERY_CANDIDATE_ARRIVES_ONE_HOUR_EARLY", ["candidates", "arrival"], "ALL"),
    ],
    explicitPropositionIds: ["P0"],
    hiddenDependencies: [
      d("D1", "P1", "AVAILABILITY", ["PREDICT_FEWER_HEAT_WAITING_COMPLAINTS"], "BREAKS_RATIONALE"),
      d("D2", "P2", "EFFICACY", ["PREDICT_FEWER_HEAT_WAITING_COMPLAINTS"], "BREAKS_RATIONALE"),
    ],
    candidates: [
      c("C1", "P1", ["Candidates who wait outside can actually use the shade or drinking-water facilities.", "The new facilities are accessible to at least some of the candidates who wait at the gate."], "IMPLICIT", "The facilities cannot reduce complaints from waiting candidates if those candidates cannot use them."),
      c("C2", "P2", ["Shade or drinking water can reduce at least some heat-related discomfort while waiting.", "Providing shade or water can make heat exposure less troublesome for some waiting candidates."], "IMPLICIT", "The expected reduction in heat complaints requires the facilities to be capable of easing the relevant discomfort."),
      c("C3", "P3", ["Every complaint made by a candidate is related to heat.", "Candidates never complain about anything except heat."], "NOT_IMPLICIT", "Only heat-related complaints are predicted to fall; other kinds of complaints may still exist.", "TOO_STRONG_QUANTIFIER"),
      c("C4", "P4", ["Every candidate reaches the centre exactly one hour early.", "All candidates wait outside for at least one hour before entry."], "NOT_IMPLICIT", "The prediction does not require one fixed arrival time or waiting duration for every candidate.", "TOO_STRONG_QUANTIFIER"),
    ],
    allowedCandidateCounts: [2, 3],
    difficulty: "Medium",
    sourceStatus: SOURCE_SUPPORTED,
  },
  {
    scenarioId: "STA-ER-QL004-PB-BUS-BAY-CHANGE",
    proposedQlId: "STA-QL-004",
    checkpointId: "STA-CP-002",
    sourceProfile: "PUNJAB_STATE",
    discourseAct: "PREDICTION",
    objectiveIds: ["PREDICT_FEWER_WRONG_BAY_BOARDINGS"],
    statementVariants: [
      "When a bus bay changes, the terminal now shows the new bay on electronic boards and announces it over the public-address system. Fewer passengers should go to the wrong bay.",
      "Bay changes are now displayed and announced at the terminal, so passengers are less likely to wait at the wrong bay.",
      "The terminal has begun using both display boards and announcements for changed bays; wrong-bay waiting should decrease.",
    ],
    propositions: [
      p("P0", "TERMINAL_DISPLAYS_AND_ANNOUNCES_BAY_CHANGES", "TERMINAL_DOES_NOT_DISPLAY_OR_ANNOUNCE_BAY_CHANGES", ["terminal", "bay changes"]),
      p("P1", "PASSENGERS_CAN_NOTICE_AT_LEAST_ONE_BAY_CHANGE_CHANNEL", "PASSENGERS_CANNOT_NOTICE_ANY_BAY_CHANGE_CHANNEL", ["passengers", "display", "announcement"]),
      p("P2", "ACCURATE_BAY_INFORMATION_CAN_CHANGE_WHERE_PASSENGERS_WAIT", "ACCURATE_BAY_INFORMATION_CANNOT_CHANGE_WHERE_PASSENGERS_WAIT", ["bay information", "passengers"]),
      p("P3", "ALL_BUS_BAYS_CHANGE_DAILY", "NOT_ALL_BUS_BAYS_CHANGE_DAILY", ["bus bays", "changes"], "ALL"),
      p("P4", "EVERY_PASSENGER_CAN_READ_ELECTRONIC_BOARDS", "NOT_EVERY_PASSENGER_CAN_READ_ELECTRONIC_BOARDS", ["passengers", "boards"], "ALL"),
    ],
    explicitPropositionIds: ["P0"],
    hiddenDependencies: [
      d("D1", "P1", "AWARENESS", ["PREDICT_FEWER_WRONG_BAY_BOARDINGS"], "BREAKS_RATIONALE"),
      d("D2", "P2", "EFFICACY", ["PREDICT_FEWER_WRONG_BAY_BOARDINGS"], "BREAKS_RATIONALE"),
    ],
    candidates: [
      c("C1", "P1", ["At least some affected passengers can notice either the display or the announcement about the changed bay.", "The changed-bay message can reach the attention of at least some passengers who need it."], "IMPLICIT", "The added information channels can reduce wrong-bay waiting only if affected passengers can notice at least one of them."),
      c("C2", "P2", ["Correct bay information can influence where at least some passengers choose to wait.", "Knowing the changed bay can help passengers move to the correct waiting point."], "IMPLICIT", "The prediction requires the information to be capable of changing passengers' bay choice."),
      c("C3", "P3", ["Every bus bay at the terminal changes every day.", "All buses are assigned a different bay each day."], "NOT_IMPLICIT", "The arrangement can help when changes occur without changes happening to every bay every day.", "TOO_STRONG_QUANTIFIER"),
      c("C4", "P4", ["Every passenger is able to read the electronic display boards.", "All passengers rely on the electronic boards rather than announcements."], "NOT_IMPLICIT", "The terminal uses both visual and audio channels, so universal ability to read the boards is unnecessary.", "TOO_STRONG_QUANTIFIER"),
    ],
    allowedCandidateCounts: [2, 3],
    difficulty: "Medium",
    sourceStatus: SOURCE_SUPPORTED,
  },
  {
    scenarioId: "STA-ER-QL004-SSC-UPLOAD-GATE",
    proposedQlId: "STA-QL-004",
    checkpointId: "STA-CP-002",
    sourceProfile: "SSC",
    discourseAct: "PREDICTION",
    objectiveIds: ["PREDICT_FEWER_INCOMPLETE_APPLICATIONS"],
    statementVariants: [
      "The recruitment portal now shows a required-document checklist and stops final submission while a mandatory upload is missing. Incomplete applications should decline.",
      "Applicants can no longer submit the form while a required document is missing, and the portal shows what is still needed; fewer incomplete applications are likely.",
      "A missing mandatory upload is now flagged before final submission. The recruitment portal expects fewer incomplete applications.",
    ],
    propositions: [
      p("P0", "PORTAL_FLAGS_AND_BLOCKS_MISSING_REQUIRED_UPLOAD", "PORTAL_DOES_NOT_FLAG_OR_BLOCK_MISSING_REQUIRED_UPLOAD", ["portal", "required upload"]),
      p("P1", "PORTAL_CAN_IDENTIFY_REQUIRED_UPLOAD_AS_MISSING", "PORTAL_CANNOT_IDENTIFY_REQUIRED_UPLOAD_AS_MISSING", ["portal", "missing upload"]),
      p("P2", "APPLICANTS_CAN_ADD_MISSING_DOCUMENT_AFTER_PROMPT", "APPLICANTS_CANNOT_ADD_MISSING_DOCUMENT_AFTER_PROMPT", ["applicants", "missing document"]),
      p("P3", "ALL_APPLICATION_ERRORS_ARE_MISSING_DOCUMENTS", "NOT_ALL_APPLICATION_ERRORS_ARE_MISSING_DOCUMENTS", ["application errors", "documents"], "ALL"),
      p("P4", "EVERY_APPLICANT_HAS_IDENTICAL_DOCUMENT_REQUIREMENTS", "NOT_EVERY_APPLICANT_HAS_IDENTICAL_DOCUMENT_REQUIREMENTS", ["applicants", "document requirements"], "ALL"),
    ],
    explicitPropositionIds: ["P0"],
    hiddenDependencies: [
      d("D1", "P1", "CAPABILITY", ["PREDICT_FEWER_INCOMPLETE_APPLICATIONS"], "BREAKS_RATIONALE"),
      d("D2", "P2", "FEASIBILITY", ["PREDICT_FEWER_INCOMPLETE_APPLICATIONS"], "BREAKS_RATIONALE"),
    ],
    candidates: [
      c("C1", "P1", ["The portal can correctly detect when a required upload is still missing.", "A mandatory document that has not been uploaded can be identified by the portal before submission."], "IMPLICIT", "The gate cannot prevent incomplete submission if it cannot recognise that a required upload is missing."),
      c("C2", "P2", ["At least some applicants who are warned can still add the missing required document before submitting.", "The prompt can be acted on by applicants who need to complete a missing upload."], "IMPLICIT", "The warning can reduce incomplete applications only if applicants can correct the omission before final submission."),
      c("C3", "P3", ["Every possible application error is caused by a missing document.", "Applications can be defective only because documents are missing."], "NOT_IMPLICIT", "The claim is limited to incomplete applications and does not rule out other kinds of errors.", "TOO_STRONG_QUANTIFIER"),
      c("C4", "P4", ["Every applicant is required to upload exactly the same documents.", "The document checklist is identical for all applicants in every category."], "NOT_IMPLICIT", "The portal can validate the documents required for each applicant without every applicant sharing one identical checklist.", "TOO_STRONG_QUANTIFIER"),
    ],
    allowedCandidateCounts: [2, 3],
    difficulty: "Hard",
    sourceStatus: SOURCE_SUPPORTED,
  },
  {
    scenarioId: "STA-ER-QL004-PB-DEFICIENCY-SMS",
    proposedQlId: "STA-QL-004",
    checkpointId: "STA-CP-002",
    sourceProfile: "PUNJAB_STATE",
    discourseAct: "PREDICTION",
    objectiveIds: ["PREDICT_FEWER_DOCUMENT_DEFICIENCY_REJECTIONS"],
    statementVariants: [
      "Applicants with a missing document will now receive an SMS naming the deficiency and linking to the correction page. Rejections for missing documents should fall.",
      "The department has started sending a correction link whenever an application lacks a required document; fewer applications should be rejected for that deficiency.",
      "A document-deficiency SMS now tells applicants what is missing and where to correct it. The department expects fewer rejection cases for missing documents.",
    ],
    propositions: [
      p("P0", "DEPARTMENT_SENDS_DEFICIENCY_SMS_WITH_CORRECTION_LINK", "DEPARTMENT_DOES_NOT_SEND_DEFICIENCY_SMS_WITH_CORRECTION_LINK", ["department", "deficiency SMS", "correction link"]),
      p("P1", "DEFICIENCY_SMS_CAN_REACH_AFFECTED_APPLICANTS_IN_TIME", "DEFICIENCY_SMS_CANNOT_REACH_AFFECTED_APPLICANTS_IN_TIME", ["SMS", "applicants"]),
      p("P2", "CORRECTION_PAGE_CAN_ACCEPT_REQUIRED_DOCUMENT_BEFORE_DECISION", "CORRECTION_PAGE_CANNOT_ACCEPT_REQUIRED_DOCUMENT_BEFORE_DECISION", ["correction page", "document"]),
      p("P3", "ALL_APPLICATION_REJECTIONS_ARE_FOR_MISSING_DOCUMENTS", "NOT_ALL_APPLICATION_REJECTIONS_ARE_FOR_MISSING_DOCUMENTS", ["rejections", "missing documents"], "ALL"),
      p("P4", "EVERY_APPLICANT_PREFERS_SMS_TO_ALL_OTHER_CHANNELS", "NOT_EVERY_APPLICANT_PREFERS_SMS_TO_ALL_OTHER_CHANNELS", ["applicants", "SMS"], "ALL"),
    ],
    explicitPropositionIds: ["P0"],
    hiddenDependencies: [
      d("D1", "P1", "AVAILABILITY", ["PREDICT_FEWER_DOCUMENT_DEFICIENCY_REJECTIONS"], "BREAKS_RATIONALE"),
      d("D2", "P2", "CAPABILITY", ["PREDICT_FEWER_DOCUMENT_DEFICIENCY_REJECTIONS"], "BREAKS_RATIONALE"),
    ],
    candidates: [
      c("C1", "P1", ["The deficiency message can reach at least some affected applicants while there is still time to correct the application.", "At least some applicants can receive the missing-document SMS before the correction opportunity has ended."], "IMPLICIT", "The message cannot reduce document-deficiency rejections if affected applicants receive it only after correction is no longer possible."),
      c("C2", "P2", ["The linked correction page can accept the required missing document before the application is finally decided.", "Applicants can use the correction page to supply a required document while correction is still allowed."], "IMPLICIT", "A correction link can reduce rejection for missing documents only if the page can actually accept the correction in time."),
      c("C3", "P3", ["Every rejected application is rejected because a document is missing.", "Missing documents are the only reason any application is rejected."], "NOT_IMPLICIT", "The prediction concerns one rejection reason and does not exclude other reasons for rejection.", "TOO_STRONG_QUANTIFIER"),
      c("C4", "P4", ["Every applicant prefers SMS to every other communication channel.", "All applicants consider SMS the best possible way to receive official messages."], "NOT_IMPLICIT", "The message only needs to reach and help some affected applicants; universal channel preference is unnecessary.", "VALUE_JUDGEMENT_NOT_REQUIRED"),
    ],
    allowedCandidateCounts: [2, 3],
    difficulty: "Medium",
    sourceStatus: SOURCE_SUPPORTED,
  },
  {
    scenarioId: "STA-ER-QL004-APPOINTMENT-REMINDER",
    proposedQlId: "STA-QL-004",
    checkpointId: "STA-CP-002",
    sourceProfile: "CROSS_EXAM_DISCOVERY",
    discourseAct: "PREDICTION",
    objectiveIds: ["PREDICT_FEWER_MISSED_APPOINTMENTS"],
    statementVariants: [
      "The clinic now sends an SMS 24 hours before an appointment with a one-tap reschedule link. Missed appointments should decrease.",
      "Patients receive a reminder a day before their appointment and can reschedule from the same message; the clinic expects fewer missed appointments.",
      "A 24-hour reminder with an immediate reschedule option has been introduced. The clinic says fewer appointment slots should go unused because patients fail to attend.",
    ],
    propositions: [
      p("P0", "CLINIC_SENDS_REMINDER_WITH_RESCHEDULE_LINK", "CLINIC_DOES_NOT_SEND_REMINDER_WITH_RESCHEDULE_LINK", ["clinic", "reminder", "reschedule link"]),
      p("P1", "REMINDER_CAN_REACH_PATIENT_BEFORE_APPOINTMENT", "REMINDER_CANNOT_REACH_PATIENT_BEFORE_APPOINTMENT", ["reminder", "patient"]),
      p("P2", "AT_LEAST_SOME_PATIENTS_NOTICE_REMINDER", "NO_PATIENT_NOTICES_REMINDER", ["patients", "reminder"], "SOME"),
      p("P3", "REMINDER_OR_RESCHEDULE_LINK_CAN_PREVENT_SOME_MISSED_APPOINTMENTS", "REMINDER_AND_RESCHEDULE_LINK_CANNOT_PREVENT_ANY_MISSED_APPOINTMENT", ["reminder", "reschedule link", "missed appointments"], "SOME"),
      p("P4", "ALL_MISSED_APPOINTMENTS_ARE_DUE_TO_FORGETTING", "NOT_ALL_MISSED_APPOINTMENTS_ARE_DUE_TO_FORGETTING", ["missed appointments", "forgetting"], "ALL"),
      p("P5", "EVERY_PATIENT_OWNS_LATEST_SMARTPHONE", "NOT_EVERY_PATIENT_OWNS_LATEST_SMARTPHONE", ["patients", "smartphone"], "ALL"),
    ],
    explicitPropositionIds: ["P0"],
    hiddenDependencies: [
      d("D1", "P1", "AVAILABILITY", ["PREDICT_FEWER_MISSED_APPOINTMENTS"], "BREAKS_RATIONALE"),
      d("D2", "P2", "AWARENESS", ["PREDICT_FEWER_MISSED_APPOINTMENTS"], "BREAKS_RATIONALE"),
      d("D3", "P3", "EFFICACY", ["PREDICT_FEWER_MISSED_APPOINTMENTS"], "BREAKS_RATIONALE"),
    ],
    candidates: [
      c("C1", "P1", ["The reminder can reach at least some patients before their appointment time.", "At least some intended patients can receive the reminder while it is still useful."], "IMPLICIT", "A pre-appointment reminder cannot reduce missed appointments if it cannot reach patients until after the appointment."),
      c("C2", "P2", ["At least some patients will notice the reminder they receive.", "The reminder can attract the attention of at least some patients who receive it."], "IMPLICIT", "A reminder that nobody notices cannot influence attendance or rescheduling."),
      c("C3", "P3", ["A timely reminder or easy rescheduling option can prevent at least some appointments from being missed.", "The reminder-and-reschedule arrangement can help at least some patients avoid leaving an appointment unused."], "IMPLICIT", "The prediction requires the new arrangement to be capable of changing at least some missed-appointment outcomes."),
      c("C4", "P4", ["Every missed appointment happens because the patient forgot it.", "Forgetfulness is the only possible cause of a missed appointment."], "NOT_IMPLICIT", "The arrangement can reduce some missed appointments without forgetfulness explaining every missed appointment.", "TOO_STRONG_QUANTIFIER"),
      c("C5", "P5", ["Every patient owns the latest model of smartphone.", "All patients use a modern smartphone with the newest software."], "NOT_IMPLICIT", "Receiving an SMS does not require every patient to own the latest smartphone model.", "RELATED_BUT_IRRELEVANT"),
    ],
    allowedCandidateCounts: [2, 3],
    difficulty: "Hard",
    sourceStatus: SOURCE_SUPPORTED,
  },
] as const;

export const STA_QL004_EXAM_REALNESS_POOL: StaScenarioPoolByQl = {
  "STA-QL-001": [],
  "STA-QL-002": [],
  "STA-QL-003": [],
  "STA-QL-004": STA_QL004_EXAM_REALNESS_EXTENSION,
};

export function generateStaQl004ExamRealnessEnglishQuestion(seed: string): StaQuestion {
  return generateStaQuestionFromPool(seed, "STA-QL-004", STA_QL004_EXAM_REALNESS_POOL);
}
