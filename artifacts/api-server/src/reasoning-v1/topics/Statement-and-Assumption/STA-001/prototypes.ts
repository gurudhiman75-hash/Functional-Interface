import type { StaCandidateAuthority, StaDependency, StaProposition, StaScenarioAuthority } from "./types.ts";

const SOURCE = "SOURCE_SUPPORTED_EXECUTABLE_DISCOVERY" as const;

function proposition(
  propositionId: string,
  semanticKey: string,
  oppositeSemanticKey: string,
  entities: readonly string[],
  quantifier?: StaProposition["quantifier"],
): StaProposition {
  return { propositionId, semanticKey, oppositeSemanticKey, polarity: "POSITIVE", entities, ...(quantifier ? { quantifier } : {}) };
}

function dependency(
  dependencyId: string,
  propositionId: string,
  relation: StaDependency["relation"],
  requiredFor: readonly string[],
  denialEffect: StaDependency["denialEffect"],
): StaDependency {
  return { dependencyId, propositionId, relation, requiredFor, denialEffect };
}

function candidate(
  candidateId: string,
  propositionId: string,
  textVariants: readonly [string, ...string[]],
  expectedClassification: StaCandidateAuthority["expectedClassification"],
  rationale: string,
  misconceptionClass?: StaCandidateAuthority["misconceptionClass"],
): StaCandidateAuthority {
  return {
    candidateId,
    propositionId,
    textVariants,
    expectedClassification,
    rationale,
    ...(misconceptionClass ? { misconceptionClass } : {}),
  };
}

export const STA_EXECUTABLE_SCENARIOS = [
  {
    scenarioId: "STA-DISC-QL001-001",
    proposedQlId: "STA-QL-001",
    checkpointId: "STA-CP-001",
    sourceProfile: "SSC",
    discourseAct: "INSTRUCTION",
    objectiveIds: ["FORM_SUBMISSION_SUCCEEDS"],
    statementVariants: [
      "Submit the application through the online portal before 5 p.m. today.",
      "Use the online portal to submit the application before 5 p.m. today.",
    ],
    propositions: [
      proposition("P1", "APPLICATION_MUST_BE_SUBMITTED_BEFORE_5", "APPLICATION_NEED_NOT_BE_SUBMITTED_BEFORE_5", ["application"]),
      proposition("P2", "APPLICANT_CAN_ACCESS_ONLINE_PORTAL", "APPLICANT_CANNOT_ACCESS_ONLINE_PORTAL", ["applicant", "portal"]),
      proposition("P3", "ALL_APPLICANTS_PREFER_ONLINE_SUBMISSION", "NOT_ALL_APPLICANTS_PREFER_ONLINE_SUBMISSION", ["applicants", "portal"], "ALL"),
      proposition("P4", "ONLINE_PORTAL_IS_FASTEST_SUBMISSION_METHOD", "ONLINE_PORTAL_IS_NOT_FASTEST_SUBMISSION_METHOD", ["portal"]),
    ],
    explicitPropositionIds: ["P1"],
    hiddenDependencies: [dependency("D1", "P2", "CAPABILITY", ["FORM_SUBMISSION_SUCCEEDS"], "BREAKS_FEASIBILITY")],
    candidates: [
      candidate("C1", "P2", ["The applicant can access the online portal.", "The applicant is able to use the online portal."], "IMPLICIT", "Without access to the portal, the stated method of submission would not be workable."),
      candidate("C2", "P3", ["All applicants prefer online submission.", "Every applicant prefers submitting forms online."], "NOT_IMPLICIT", "The instruction can be valid even if some applicants would prefer another method.", "TOO_STRONG_QUANTIFIER"),
      candidate("C3", "P4", ["The online portal is the fastest way to submit the application.", "No other submission method is faster than the portal."], "NOT_IMPLICIT", "The instruction requires the portal to be usable, not to be the fastest possible method.", "SUPPORTIVE_NOT_NECESSARY"),
    ],
    allowedCandidateCounts: [2, 3],
    difficulty: "Easy",
    sourceStatus: SOURCE,
  },
  {
    scenarioId: "STA-DISC-QL001-002",
    proposedQlId: "STA-QL-001",
    checkpointId: "STA-CP-001",
    sourceProfile: "PUNJAB_STATE",
    discourseAct: "INSTRUCTION",
    objectiveIds: ["PRACTICE_SESSION_CAN_OCCUR"],
    statementVariants: [
      "The team should practise in Hall B this evening.",
      "Use Hall B for the team's practice session this evening.",
    ],
    propositions: [
      proposition("P1", "TEAM_PRACTICE_IS_THIS_EVENING", "TEAM_PRACTICE_IS_NOT_THIS_EVENING", ["team", "practice"]),
      proposition("P2", "HALL_B_IS_AVAILABLE_THIS_EVENING", "HALL_B_IS_NOT_AVAILABLE_THIS_EVENING", ["Hall B", "evening"]),
      proposition("P3", "HALL_B_IS_LARGEST_HALL", "HALL_B_IS_NOT_LARGEST_HALL", ["Hall B"]),
      proposition("P4", "EVERY_TEAM_MEMBER_LIKES_HALL_B", "NOT_EVERY_TEAM_MEMBER_LIKES_HALL_B", ["team", "Hall B"], "ALL"),
    ],
    explicitPropositionIds: ["P1"],
    hiddenDependencies: [dependency("D1", "P2", "AVAILABILITY", ["PRACTICE_SESSION_CAN_OCCUR"], "BREAKS_FEASIBILITY")],
    candidates: [
      candidate("C1", "P2", ["Hall B is available this evening.", "Hall B can be used this evening."], "IMPLICIT", "If Hall B were unavailable, directing the team to practise there would not be feasible."),
      candidate("C2", "P3", ["Hall B is the largest hall available to the team.", "Hall B is larger than every other hall."], "NOT_IMPLICIT", "The instruction does not depend on Hall B being the largest hall.", "SUPPORTIVE_NOT_NECESSARY"),
      candidate("C3", "P4", ["Every team member likes Hall B.", "All members of the team prefer Hall B."], "NOT_IMPLICIT", "Personal preference of every member is unnecessary for the instruction to work.", "TOO_STRONG_QUANTIFIER"),
    ],
    allowedCandidateCounts: [2, 3],
    difficulty: "Easy",
    sourceStatus: SOURCE,
  },
  {
    scenarioId: "STA-DISC-QL001-003",
    proposedQlId: "STA-QL-001",
    checkpointId: "STA-CP-001",
    sourceProfile: "BANKING",
    discourseAct: "INSTRUCTION",
    objectiveIds: ["FORMS_CAN_BE_PRINTED_TODAY"],
    statementVariants: [
      "Use the backup printer in Room 4 for today's forms.",
      "Print today's forms on the backup printer kept in Room 4.",
    ],
    propositions: [
      proposition("P1", "FORMS_NEED_PRINTING_TODAY", "FORMS_DO_NOT_NEED_PRINTING_TODAY", ["forms", "today"]),
      proposition("P2", "BACKUP_PRINTER_CAN_PRINT_FORMS", "BACKUP_PRINTER_CANNOT_PRINT_FORMS", ["backup printer", "forms"]),
      proposition("P3", "BACKUP_PRINTER_IS_NEWER_THAN_MAIN_PRINTER", "BACKUP_PRINTER_IS_NOT_NEWER_THAN_MAIN_PRINTER", ["backup printer", "main printer"]),
      proposition("P4", "ROOM_4_IS_CLOSEST_ROOM", "ROOM_4_IS_NOT_CLOSEST_ROOM", ["Room 4"]),
    ],
    explicitPropositionIds: ["P1"],
    hiddenDependencies: [dependency("D1", "P2", "CAPABILITY", ["FORMS_CAN_BE_PRINTED_TODAY"], "BREAKS_FEASIBILITY")],
    candidates: [
      candidate("C1", "P2", ["The backup printer can print the required forms.", "The backup printer is capable of printing today's forms."], "IMPLICIT", "The instruction only makes sense if the backup printer can perform the required printing."),
      candidate("C2", "P3", ["The backup printer is newer than the main printer.", "The main printer is older than the backup printer."], "NOT_IMPLICIT", "Relative age of the printers is irrelevant to whether the backup printer can be used.", "RELATED_BUT_IRRELEVANT"),
      candidate("C3", "P4", ["Room 4 is the closest room to the staff.", "No other room is closer to the staff than Room 4."], "NOT_IMPLICIT", "The instruction names Room 4 but does not require it to be the nearest room.", "SUPPORTIVE_NOT_NECESSARY"),
    ],
    allowedCandidateCounts: [2, 3],
    difficulty: "Easy",
    sourceStatus: SOURCE,
  },
  {
    scenarioId: "STA-DISC-QL002-001",
    proposedQlId: "STA-QL-002",
    checkpointId: "STA-CP-002",
    sourceProfile: "SSC",
    discourseAct: "RECOMMENDATION",
    objectiveIds: ["REDUCE_MORNING_BUS_OVERCROWDING"],
    statementVariants: [
      "The college should add an extra bus at 8 a.m. to reduce overcrowding on the morning route.",
      "To reduce crowding on the morning route, the college should run one additional bus at 8 a.m.",
    ],
    propositions: [
      proposition("P1", "MORNING_ROUTE_IS_OVERCROWDED", "MORNING_ROUTE_IS_NOT_OVERCROWDED", ["morning route"]),
      proposition("P2", "EXTRA_8AM_BUS_CAN_REDUCE_OVERCROWDING", "EXTRA_8AM_BUS_CANNOT_REDUCE_OVERCROWDING", ["extra bus", "morning route"]),
      proposition("P3", "ALL_STUDENTS_TRAVEL_AT_8AM", "NOT_ALL_STUDENTS_TRAVEL_AT_8AM", ["students", "8 a.m."], "ALL"),
    ],
    explicitPropositionIds: [],
    hiddenDependencies: [
      dependency("D1", "P1", "EXISTENCE", ["REDUCE_MORNING_BUS_OVERCROWDING"], "BREAKS_RATIONALE"),
      dependency("D2", "P2", "EFFICACY", ["REDUCE_MORNING_BUS_OVERCROWDING"], "BREAKS_RATIONALE"),
    ],
    candidates: [
      candidate("C1", "P1", ["Overcrowding occurs on the morning route.", "The morning bus route currently faces crowding."], "IMPLICIT", "The recommendation is aimed at reducing an existing crowding problem; without that problem its stated rationale disappears."),
      candidate("C2", "P2", ["An extra 8 a.m. bus can reduce the overcrowding.", "Running another bus at 8 a.m. can ease crowding on that route."], "IMPLICIT", "The recommendation depends on the added bus being capable of easing the stated crowding."),
      candidate("C3", "P3", ["All students travel at exactly 8 a.m.", "Every student uses the bus at 8 a.m."], "NOT_IMPLICIT", "The extra bus can help a crowded period without every student travelling at exactly that time.", "TOO_STRONG_QUANTIFIER"),
    ],
    allowedCandidateCounts: [2, 3],
    difficulty: "Medium",
    sourceStatus: SOURCE,
  },
  {
    scenarioId: "STA-DISC-QL002-002",
    proposedQlId: "STA-QL-002",
    checkpointId: "STA-CP-002",
    sourceProfile: "BANKING",
    discourseAct: "PROPOSAL",
    objectiveIds: ["REDUCE_PEAK_QUEUE_DELAY"],
    statementVariants: [
      "The branch should open an additional service counter during the lunch-hour rush to reduce waiting time.",
      "To cut lunch-hour waiting time, the branch should operate one more service counter during the rush.",
    ],
    propositions: [
      proposition("P1", "LUNCH_HOUR_WAITING_TIME_IS_HIGH", "LUNCH_HOUR_WAITING_TIME_IS_NOT_HIGH", ["branch", "lunch hour"]),
      proposition("P2", "EXTRA_COUNTER_CAN_REDUCE_WAITING_TIME", "EXTRA_COUNTER_CANNOT_REDUCE_WAITING_TIME", ["extra counter", "waiting time"]),
      proposition("P3", "CUSTOMERS_DISLIKE_ALL_QUEUES", "CUSTOMERS_DO_NOT_DISLIKE_ALL_QUEUES", ["customers", "queues"], "ALL"),
    ],
    explicitPropositionIds: [],
    hiddenDependencies: [
      dependency("D1", "P1", "EXISTENCE", ["REDUCE_PEAK_QUEUE_DELAY"], "BREAKS_RATIONALE"),
      dependency("D2", "P2", "EFFICACY", ["REDUCE_PEAK_QUEUE_DELAY"], "BREAKS_RATIONALE"),
    ],
    candidates: [
      candidate("C1", "P1", ["Waiting time is a problem during the lunch-hour rush.", "The branch faces excessive waiting during the lunch-hour peak."], "IMPLICIT", "The proposal is specifically justified as a response to lunch-hour waiting, so that problem must exist."),
      candidate("C2", "P2", ["An additional counter can reduce the waiting time.", "Opening another counter can help shorten the queue delay."], "IMPLICIT", "If another counter could not affect waiting time, the stated proposal would lose its rationale."),
      candidate("C3", "P3", ["Customers dislike every kind of queue.", "All customers dislike all queues."], "NOT_IMPLICIT", "The branch can address a specific delay without assuming a universal attitude toward queues.", "TOO_STRONG_QUANTIFIER"),
    ],
    allowedCandidateCounts: [2, 3],
    difficulty: "Medium",
    sourceStatus: SOURCE,
  },
  {
    scenarioId: "STA-DISC-QL002-003",
    proposedQlId: "STA-QL-002",
    checkpointId: "STA-CP-002",
    sourceProfile: "PUNJAB_STATE",
    discourseAct: "RECOMMENDATION",
    objectiveIds: ["ENABLE_REMOTE_STAFF_ATTENDANCE"],
    statementVariants: [
      "The training session should also be offered online so remote staff can attend.",
      "To let remote staff attend, the department should provide an online option for the training session.",
    ],
    propositions: [
      proposition("P1", "SOME_STAFF_ARE_REMOTE", "NO_STAFF_ARE_REMOTE", ["staff"], "SOME"),
      proposition("P2", "ONLINE_OPTION_CAN_ENABLE_REMOTE_ATTENDANCE", "ONLINE_OPTION_CANNOT_ENABLE_REMOTE_ATTENDANCE", ["online option", "remote staff"]),
      proposition("P3", "ALL_STAFF_PREFER_ONLINE_TRAINING", "NOT_ALL_STAFF_PREFER_ONLINE_TRAINING", ["staff", "online training"], "ALL"),
    ],
    explicitPropositionIds: [],
    hiddenDependencies: [
      dependency("D1", "P1", "EXISTENCE", ["ENABLE_REMOTE_STAFF_ATTENDANCE"], "BREAKS_RELEVANCE"),
      dependency("D2", "P2", "EFFICACY", ["ENABLE_REMOTE_STAFF_ATTENDANCE"], "BREAKS_RATIONALE"),
    ],
    candidates: [
      candidate("C1", "P1", ["Some staff members are remote.", "There are staff members who work remotely."], "IMPLICIT", "The stated purpose of adding an online option is to serve remote staff, so such a group must be relevant to the proposal."),
      candidate("C2", "P2", ["An online option can enable remote staff to attend.", "Remote staff can attend if an online option is provided."], "IMPLICIT", "The recommendation depends on the online format actually helping the target group attend."),
      candidate("C3", "P3", ["All staff prefer online training.", "Every staff member would rather attend online."], "NOT_IMPLICIT", "The proposal only needs online access to help remote staff; universal preference is unnecessary.", "TOO_STRONG_QUANTIFIER"),
    ],
    allowedCandidateCounts: [2, 3],
    difficulty: "Medium",
    sourceStatus: SOURCE,
  },
  {
    scenarioId: "STA-DISC-QL003-001",
    proposedQlId: "STA-QL-003",
    checkpointId: "STA-CP-002",
    sourceProfile: "SSC",
    discourseAct: "NOTICE",
    objectiveIds: ["PROMPT_UNPAID_STUDENTS_BEFORE_DEADLINE"],
    statementVariants: [
      "Reminder: Students who have not paid the examination fee should pay it by Friday to avoid late charges.",
      "Students with unpaid examination fees are reminded to pay by Friday so that late charges can be avoided.",
    ],
    propositions: [
      proposition("P1", "SOME_INTENDED_RECIPIENTS_MAY_HAVE_UNPAID_FEES", "NO_INTENDED_RECIPIENT_HAS_UNPAID_FEES", ["students", "fees"], "SOME"),
      proposition("P2", "RECIPIENTS_CAN_ACT_BEFORE_FRIDAY", "RECIPIENTS_CANNOT_ACT_BEFORE_FRIDAY", ["students", "Friday"]),
      proposition("P3", "EVERY_STUDENT_HAS_UNPAID_FEES", "NOT_EVERY_STUDENT_HAS_UNPAID_FEES", ["students", "fees"], "ALL"),
    ],
    explicitPropositionIds: [],
    hiddenDependencies: [
      dependency("D1", "P1", "RELEVANCE", ["PROMPT_UNPAID_STUDENTS_BEFORE_DEADLINE"], "BREAKS_COMMUNICATIVE_PURPOSE"),
      dependency("D2", "P2", "CAPABILITY", ["PROMPT_UNPAID_STUDENTS_BEFORE_DEADLINE"], "BREAKS_COMMUNICATIVE_PURPOSE"),
    ],
    candidates: [
      candidate("C1", "P1", ["Some intended recipients may still have unpaid examination fees.", "The reminder is relevant to students whose examination fee may still be unpaid."], "IMPLICIT", "If no intended recipient could have an unpaid fee, sending this reminder for that purpose would be pointless."),
      candidate("C2", "P2", ["The intended recipients can still pay before Friday.", "Students addressed by the reminder have an opportunity to act before Friday."], "IMPLICIT", "A deadline reminder assumes the audience can still respond before the deadline."),
      candidate("C3", "P3", ["Every student has an unpaid examination fee.", "All students still need to pay the examination fee."], "NOT_IMPLICIT", "The notice targets a subset; it does not assume every student is unpaid.", "TOO_STRONG_QUANTIFIER"),
    ],
    allowedCandidateCounts: [2, 3],
    difficulty: "Medium",
    sourceStatus: SOURCE,
  },
  {
    scenarioId: "STA-DISC-QL003-002",
    proposedQlId: "STA-QL-003",
    checkpointId: "STA-CP-002",
    sourceProfile: "BANKING",
    discourseAct: "NOTICE",
    objectiveIds: ["PROMPT_CUSTOMER_DETAIL_REVIEW"],
    statementVariants: [
      "The bank texted customers: Review your registered mobile number before Sunday's alert-service migration.",
      "Before Sunday's alert-service migration, customers were texted a reminder to review their registered mobile number.",
    ],
    propositions: [
      proposition("P1", "CUSTOMER_DETAIL_REVIEW_IS_RELEVANT_BEFORE_MIGRATION", "CUSTOMER_DETAIL_REVIEW_IS_NOT_RELEVANT_BEFORE_MIGRATION", ["customers", "mobile number", "migration"]),
      proposition("P2", "CUSTOMERS_CAN_REVIEW_REGISTERED_NUMBER", "CUSTOMERS_CANNOT_REVIEW_REGISTERED_NUMBER", ["customers", "mobile number"]),
      proposition("P3", "ALL_CUSTOMER_NUMBERS_ARE_WRONG", "NOT_ALL_CUSTOMER_NUMBERS_ARE_WRONG", ["customers", "mobile number"], "ALL"),
    ],
    explicitPropositionIds: [],
    hiddenDependencies: [
      dependency("D1", "P1", "RELEVANCE", ["PROMPT_CUSTOMER_DETAIL_REVIEW"], "BREAKS_COMMUNICATIVE_PURPOSE"),
      dependency("D2", "P2", "CAPABILITY", ["PROMPT_CUSTOMER_DETAIL_REVIEW"], "BREAKS_COMMUNICATIVE_PURPOSE"),
    ],
    candidates: [
      candidate("C1", "P1", ["Reviewing the registered mobile number is relevant before the migration.", "Checking the registered number before migration can matter to the alert service."], "IMPLICIT", "The reminder assumes that reviewing this detail has a purpose in the upcoming migration."),
      candidate("C2", "P2", ["Customers can review their registered mobile number.", "The addressed customers have a way to check their registered number."], "IMPLICIT", "A request to review information assumes the audience can perform that review."),
      candidate("C3", "P3", ["Every customer's registered mobile number is wrong.", "All customers have an incorrect registered mobile number."], "NOT_IMPLICIT", "A review reminder does not require every stored number to be incorrect.", "TOO_STRONG_QUANTIFIER"),
    ],
    allowedCandidateCounts: [2, 3],
    difficulty: "Medium",
    sourceStatus: SOURCE,
  },
  {
    scenarioId: "STA-DISC-QL003-003",
    proposedQlId: "STA-QL-003",
    checkpointId: "STA-CP-002",
    sourceProfile: "PUNJAB_STATE",
    discourseAct: "NOTICE",
    objectiveIds: ["DIRECT_AFFECTED_STUDENTS_TO_REPLACEMENT_DESK"],
    statementVariants: [
      "Notice: Students who have lost their ID cards should report to Desk 3 for replacements.",
      "Students needing a replacement for a lost ID card are asked to report to Desk 3.",
    ],
    propositions: [
      proposition("P1", "SOME_STUDENTS_MAY_NEED_ID_REPLACEMENT", "NO_STUDENT_NEEDS_ID_REPLACEMENT", ["students", "ID cards"], "SOME"),
      proposition("P2", "DESK_3_CAN_HANDLE_ID_REPLACEMENT", "DESK_3_CANNOT_HANDLE_ID_REPLACEMENT", ["Desk 3", "ID replacements"]),
      proposition("P3", "EVERY_STUDENT_HAS_LOST_ID_CARD", "NOT_EVERY_STUDENT_HAS_LOST_ID_CARD", ["students", "ID cards"], "ALL"),
    ],
    explicitPropositionIds: [],
    hiddenDependencies: [
      dependency("D1", "P1", "RELEVANCE", ["DIRECT_AFFECTED_STUDENTS_TO_REPLACEMENT_DESK"], "BREAKS_COMMUNICATIVE_PURPOSE"),
      dependency("D2", "P2", "CAPABILITY", ["DIRECT_AFFECTED_STUDENTS_TO_REPLACEMENT_DESK"], "BREAKS_COMMUNICATIVE_PURPOSE"),
    ],
    candidates: [
      candidate("C1", "P1", ["Some students may need replacement ID cards.", "There may be students who have lost their ID cards."], "IMPLICIT", "The notice has a real target only if some students may need the stated replacement service."),
      candidate("C2", "P2", ["Desk 3 can handle ID-card replacements.", "Replacement ID cards can be dealt with at Desk 3."], "IMPLICIT", "Directing affected students to Desk 3 assumes that desk can provide the stated service."),
      candidate("C3", "P3", ["Every student has lost an ID card.", "All students need replacement ID cards."], "NOT_IMPLICIT", "The notice applies only to affected students and does not assume universal loss.", "TOO_STRONG_QUANTIFIER"),
    ],
    allowedCandidateCounts: [2, 3],
    difficulty: "Medium",
    sourceStatus: SOURCE,
  },
  {
    scenarioId: "STA-DISC-QL004-001",
    proposedQlId: "STA-QL-004",
    checkpointId: "STA-CP-002",
    sourceProfile: "BANKING",
    discourseAct: "PREDICTION",
    objectiveIds: ["PREDICT_BILLING_TIME_REDUCTION"],
    statementVariants: [
      "With the new barcode scanners, billing time at the counters will fall.",
      "The new barcode scanners are expected to reduce billing time at the counters.",
    ],
    propositions: [
      proposition("P1", "BARCODE_SCANNERS_CAN_REDUCE_BILLING_TIME", "BARCODE_SCANNERS_CANNOT_REDUCE_BILLING_TIME", ["barcode scanners", "billing time"]),
      proposition("P2", "CUSTOMERS_WILL_BUY_MORE_ITEMS", "CUSTOMERS_WILL_NOT_BUY_MORE_ITEMS", ["customers", "items"]),
      proposition("P3", "SCANNERS_ARE_MOST_EXPENSIVE_EQUIPMENT", "SCANNERS_ARE_NOT_MOST_EXPENSIVE_EQUIPMENT", ["barcode scanners"]),
    ],
    explicitPropositionIds: [],
    hiddenDependencies: [dependency("D1", "P1", "EFFICACY", ["PREDICT_BILLING_TIME_REDUCTION"], "BREAKS_RATIONALE")],
    candidates: [
      candidate("C1", "P1", ["The barcode scanners can reduce billing time.", "Using the new scanners can make billing faster."], "IMPLICIT", "The prediction depends on a causal link from using the scanners to shorter billing time."),
      candidate("C2", "P2", ["Customers will buy more items after the scanners are installed.", "The new scanners will make customers purchase more items."], "NOT_IMPLICIT", "A billing-time prediction does not require any change in how much customers buy.", "CONCLUSION_OR_CONSEQUENCE"),
      candidate("C3", "P3", ["The scanners are the most expensive equipment at the counters.", "No counter equipment costs more than the new scanners."], "NOT_IMPLICIT", "Equipment cost ranking is irrelevant to the stated billing-time effect.", "RELATED_BUT_IRRELEVANT"),
    ],
    allowedCandidateCounts: [2, 3],
    difficulty: "Medium",
    sourceStatus: SOURCE,
  },
  {
    scenarioId: "STA-DISC-QL004-002",
    proposedQlId: "STA-QL-004",
    checkpointId: "STA-CP-002",
    sourceProfile: "SSC",
    discourseAct: "PREDICTION",
    objectiveIds: ["PREDICT_WAITING_COMFORT_IMPROVEMENT"],
    statementVariants: [
      "Adding shade over the outdoor waiting area will make the queue more comfortable on hot afternoons.",
      "A shade cover over the outdoor waiting area should improve comfort in the queue during hot afternoons.",
    ],
    propositions: [
      proposition("P1", "SHADE_CAN_IMPROVE_HOT_WEATHER_WAITING_COMFORT", "SHADE_CANNOT_IMPROVE_HOT_WEATHER_WAITING_COMFORT", ["shade", "waiting area", "comfort"]),
      proposition("P2", "ALL_VISITORS_DISLIKE_SUNLIGHT", "NOT_ALL_VISITORS_DISLIKE_SUNLIGHT", ["visitors", "sunlight"], "ALL"),
      proposition("P3", "SHADE_WILL_ELIMINATE_ALL_WAITING", "SHADE_WILL_NOT_ELIMINATE_ALL_WAITING", ["shade", "waiting"], "ALL"),
    ],
    explicitPropositionIds: [],
    hiddenDependencies: [dependency("D1", "P1", "EFFICACY", ["PREDICT_WAITING_COMFORT_IMPROVEMENT"], "BREAKS_RATIONALE")],
    candidates: [
      candidate("C1", "P1", ["Shade can improve waiting comfort in hot weather.", "Providing shade can make the waiting area more comfortable on hot afternoons."], "IMPLICIT", "Without an effect of shade on hot-weather comfort, the prediction has no causal basis."),
      candidate("C2", "P2", ["All visitors dislike sunlight.", "Every visitor dislikes being in sunlight."], "NOT_IMPLICIT", "The comfort claim does not require a universal personal preference about sunlight.", "TOO_STRONG_QUANTIFIER"),
      candidate("C3", "P3", ["The shade will eliminate all waiting.", "Once shade is added, nobody will need to wait."], "NOT_IMPLICIT", "The claim concerns comfort while waiting, not elimination of the queue itself.", "CAUSE_EFFECT_OVERREACH"),
    ],
    allowedCandidateCounts: [2, 3],
    difficulty: "Medium",
    sourceStatus: SOURCE,
  },
  {
    scenarioId: "STA-DISC-QL004-003",
    proposedQlId: "STA-QL-004",
    checkpointId: "STA-CP-002",
    sourceProfile: "CROSS_EXAM_DISCOVERY",
    discourseAct: "PREDICTION",
    objectiveIds: ["PREDICT_MISSED_APPOINTMENT_REDUCTION"],
    statementVariants: [
      "Automatic reminders will reduce missed appointments at the service centre.",
      "The service centre expects automatic reminders to lower the number of missed appointments.",
    ],
    propositions: [
      proposition("P1", "AUTOMATIC_REMINDERS_CAN_REDUCE_MISSED_APPOINTMENTS", "AUTOMATIC_REMINDERS_CANNOT_REDUCE_MISSED_APPOINTMENTS", ["automatic reminders", "missed appointments"]),
      proposition("P2", "EVERY_MISSED_APPOINTMENT_IS_DUE_TO_FORGETFULNESS", "NOT_EVERY_MISSED_APPOINTMENT_IS_DUE_TO_FORGETFULNESS", ["missed appointments", "forgetfulness"], "ALL"),
      proposition("P3", "REMINDERS_WILL_REMOVE_ALL_CANCELLATIONS", "REMINDERS_WILL_NOT_REMOVE_ALL_CANCELLATIONS", ["reminders", "cancellations"], "ALL"),
    ],
    explicitPropositionIds: [],
    hiddenDependencies: [dependency("D1", "P1", "EFFICACY", ["PREDICT_MISSED_APPOINTMENT_REDUCTION"], "BREAKS_RATIONALE")],
    candidates: [
      candidate("C1", "P1", ["Automatic reminders can reduce missed appointments.", "Sending automatic reminders can lower the number of missed appointments."], "IMPLICIT", "The prediction requires reminders to have at least some effect on missed appointments."),
      candidate("C2", "P2", ["Every missed appointment is caused by forgetfulness.", "Forgetfulness is the reason for all missed appointments."], "NOT_IMPLICIT", "Reminders can reduce some missed appointments without forgetfulness being the only cause of every case.", "TOO_STRONG_QUANTIFIER"),
      candidate("C3", "P3", ["Automatic reminders will eliminate all cancellations.", "No appointment will ever be cancelled after reminders are introduced."], "NOT_IMPLICIT", "The statement predicts fewer missed appointments, not elimination of every cancellation.", "CAUSE_EFFECT_OVERREACH"),
    ],
    allowedCandidateCounts: [2, 3],
    difficulty: "Hard",
    sourceStatus: SOURCE,
  },
] as const satisfies readonly StaScenarioAuthority[];

export const STA_SCENARIOS_BY_QL: Readonly<Record<StaScenarioAuthority["proposedQlId"], readonly StaScenarioAuthority[]>> = {
  "STA-QL-001": STA_EXECUTABLE_SCENARIOS.filter((scenario) => scenario.proposedQlId === "STA-QL-001"),
  "STA-QL-002": STA_EXECUTABLE_SCENARIOS.filter((scenario) => scenario.proposedQlId === "STA-QL-002"),
  "STA-QL-003": STA_EXECUTABLE_SCENARIOS.filter((scenario) => scenario.proposedQlId === "STA-QL-003"),
  "STA-QL-004": STA_EXECUTABLE_SCENARIOS.filter((scenario) => scenario.proposedQlId === "STA-QL-004"),
};
