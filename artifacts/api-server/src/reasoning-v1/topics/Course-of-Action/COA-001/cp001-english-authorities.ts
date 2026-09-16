import type {
  CoaActionAuthority,
  CoaReasonCode,
  CoaScenarioAuthority,
} from "./types.ts";

type ActionOverrides = Partial<Omit<
  CoaActionAuthority,
  "id" | "text" | "explanation" | "expectedVerdict" | "reasonCodes"
>>;

function follows(
  id: string,
  text: string,
  explanation: string,
  reasonCodes: readonly CoaReasonCode[],
  overrides: ActionOverrides = {},
): CoaActionAuthority {
  return Object.freeze({
    id,
    text,
    explanation,
    relevance: "DIRECT" as const,
    actionability: "ACTIONABLE" as const,
    authorityFit: "WITHIN_SCOPE" as const,
    feasibility: "FEASIBLE" as const,
    proportionality: "PROPORTIONATE" as const,
    evidenceFit: "SUPPORTED" as const,
    expectedUtility: "HIGH" as const,
    urgencyFit: "IMMEDIATE" as const,
    constraintFit: "NOT_APPLICABLE" as const,
    sequenceFit: "NOT_APPLICABLE" as const,
    expectedVerdict: "FOLLOWS" as const,
    reasonCodes: Object.freeze([...reasonCodes]),
    ...overrides,
  });
}

function rejects(
  id: string,
  text: string,
  explanation: string,
  reasonCode: CoaReasonCode,
  overrides: ActionOverrides,
): CoaActionAuthority {
  return Object.freeze({
    id,
    text,
    explanation,
    relevance: "DIRECT" as const,
    actionability: "ACTIONABLE" as const,
    authorityFit: "WITHIN_SCOPE" as const,
    feasibility: "FEASIBLE" as const,
    proportionality: "PROPORTIONATE" as const,
    evidenceFit: "SUPPORTED" as const,
    expectedUtility: "HIGH" as const,
    urgencyFit: "IMMEDIATE" as const,
    constraintFit: "NOT_APPLICABLE" as const,
    sequenceFit: "NOT_APPLICABLE" as const,
    expectedVerdict: "DOES_NOT_FOLLOW" as const,
    reasonCodes: Object.freeze([reasonCode]),
    ...overrides,
  });
}

export const COA_CP001_ENGLISH_AUTHORITIES: readonly CoaScenarioAuthority[] = Object.freeze([
  // COA-QL-001 — direct remedial action
  {
    id: "COA-SC-001",
    qlId: "COA-QL-001",
    difficulty: "EASY",
    domain: "PUBLIC_UTILITY",
    statement: "Residents of a housing area have not received piped water since the main pumping motor failed this morning.",
    actions: [
      follows(
        "COA-SC-001-I",
        "The water-supply department should send a repair team to restore the motor and arrange temporary supply until normal service resumes.",
        "The motor failure is the stated reason for the disruption. Repairing it directly addresses the problem, while temporary supply reduces hardship during the repair.",
        ["DIRECT_REMEDY", "USEFUL_TEMPORARY_SAFEGUARD"],
      ),
      rejects(
        "COA-SC-001-II",
        "The department should conduct a survey of household electricity use in the same area.",
        "Electricity use is not connected to the failed water pump, so this does not address the stated problem.",
        "UNRELATED_GOOD_ACTION",
        { relevance: "UNRELATED", expectedUtility: "LOW" },
      ),
    ],
    expectedAnswerClass: "ONLY_I",
  },
  {
    id: "COA-SC-002",
    qlId: "COA-QL-001",
    difficulty: "EASY",
    domain: "BANKING",
    statement: "Customers at a bank branch are receiving unreadable deposit receipts because the receipt printer has developed a mechanical fault.",
    actions: [
      rejects(
        "COA-SC-002-I",
        "The branch should stop all customer services for one month until every office machine has been inspected.",
        "The problem is limited to one faulty printer. Closing all services for a month is far more disruptive than the issue requires.",
        "EXCESSIVE_RESPONSE",
        { proportionality: "EXCESSIVE", expectedUtility: "HARMFUL" },
      ),
      follows(
        "COA-SC-002-II",
        "The branch should repair or replace the faulty printer and provide clear replacement receipts where required.",
        "This action directly corrects the identified equipment fault and deals with receipts affected by it.",
        ["DIRECT_REMEDY", "PROPORTIONATE_RESPONSE"],
      ),
    ],
    expectedAnswerClass: "ONLY_II",
  },
  {
    id: "COA-SC-003",
    qlId: "COA-QL-001",
    difficulty: "MEDIUM",
    domain: "EXAM_ADMIN",
    statement: "An examination registration portal repeatedly times out during the final two days of application because the current server capacity is insufficient for the traffic.",
    actions: [
      follows(
        "COA-SC-003-I",
        "The examination body should add temporary server capacity and correct the bottleneck before the deadline.",
        "The capacity shortage is known, so increasing capacity directly addresses the cause of the failed registrations.",
        ["DIRECT_REMEDY"],
      ),
      follows(
        "COA-SC-003-II",
        "The examination body should provide a short deadline extension for applicants affected by the repeated portal failures.",
        "The portal failure occurred close to the deadline. A limited extension is a practical temporary remedy for candidates who could not submit on time.",
        ["USEFUL_TEMPORARY_SAFEGUARD", "PROPORTIONATE_RESPONSE"],
      ),
    ],
    expectedAnswerClass: "BOTH",
  },

  // COA-QL-002 — preventive / risk-reduction action
  {
    id: "COA-SC-004",
    qlId: "COA-QL-002",
    difficulty: "EASY",
    domain: "TRANSPORT",
    statement: "Several minor reversing incidents have occurred inside a bus depot because warning alarms on some buses are not working.",
    actions: [
      rejects(
        "COA-SC-004-I",
        "The depot should repaint the administrative office so that staff take safety more seriously.",
        "Repainting the office does not reduce the reversing risk created by defective warning alarms.",
        "SYMBOLIC_BUT_INEFFECTIVE",
        { relevance: "INDIRECT", expectedUtility: "LOW" },
      ),
      rejects(
        "COA-SC-004-II",
        "The depot should permanently withdraw every bus from service because some warning alarms have failed.",
        "The risk is real, but permanently withdrawing the whole fleet is excessive when the faulty alarms can be identified and repaired.",
        "EXCESSIVE_RESPONSE",
        { proportionality: "EXCESSIVE", expectedUtility: "HARMFUL" },
      ),
    ],
    expectedAnswerClass: "NEITHER",
  },
  {
    id: "COA-SC-005",
    qlId: "COA-QL-002",
    difficulty: "MEDIUM",
    domain: "LOGISTICS",
    statement: "Packages waiting in an open loading area are repeatedly being damaged when sudden rain begins before they can be moved indoors.",
    actions: [
      follows(
        "COA-SC-005-I",
        "The depot should create a covered holding area or use weatherproof covers for packages waiting to be loaded.",
        "The damage occurs because packages remain exposed to rain. Covering that stage of the process directly reduces the repeated risk.",
        ["TARGETED_PREVENTION"],
      ),
      rejects(
        "COA-SC-005-II",
        "The depot should organise a general motivational programme for all employees once every month.",
        "A general motivational programme does not address the specific exposure to rain that is damaging packages.",
        "WRONG_TARGET",
        { relevance: "INDIRECT", expectedUtility: "LOW" },
      ),
    ],
    expectedAnswerClass: "ONLY_I",
  },
  {
    id: "COA-SC-006",
    qlId: "COA-QL-002",
    difficulty: "MEDIUM",
    domain: "EDUCATION",
    statement: "Students entering a school laboratory without understanding basic safety rules have caused repeated avoidable equipment incidents.",
    actions: [
      rejects(
        "COA-SC-006-I",
        "The school should stop all laboratory classes for the entire academic year.",
        "The problem requires better safety practice, not the loss of laboratory teaching for every student for a full year.",
        "EXCESSIVE_RESPONSE",
        { proportionality: "EXCESSIVE", expectedUtility: "HARMFUL" },
      ),
      follows(
        "COA-SC-006-II",
        "The school should require a short safety briefing and appropriate supervision before students use the laboratory.",
        "The incidents are linked to students not understanding the rules. A briefing and supervision directly reduce that risk.",
        ["TARGETED_PREVENTION", "PROPORTIONATE_RESPONSE"],
      ),
    ],
    expectedAnswerClass: "ONLY_II",
  },

  // COA-QL-003 — investigation / verification before irreversible action
  {
    id: "COA-SC-007",
    qlId: "COA-QL-003",
    difficulty: "MEDIUM",
    domain: "BANKING",
    statement: "A customer reports that contact details on an account were changed without permission, but the branch has not yet established how the change occurred.",
    actions: [
      follows(
        "COA-SC-007-I",
        "The bank should temporarily block further sensitive profile changes on the account until the customer's identity and request history are verified.",
        "A temporary safeguard limits further risk without deciding who is responsible before the facts are known.",
        ["VERIFY_BEFORE_IRREVERSIBLE_ACTION", "USEFUL_TEMPORARY_SAFEGUARD"],
      ),
      follows(
        "COA-SC-007-II",
        "The branch should examine the relevant audit trail and authorised request records before fixing responsibility for the change.",
        "The cause is still uncertain. Checking the available records is the proper way to establish what happened before assigning responsibility.",
        ["VERIFY_BEFORE_IRREVERSIBLE_ACTION"],
      ),
    ],
    expectedAnswerClass: "BOTH",
  },
  {
    id: "COA-SC-008",
    qlId: "COA-QL-003",
    difficulty: "MEDIUM",
    domain: "EXAM_ADMIN",
    statement: "An examination body detects an unusual similarity pattern in one centre's answer data, but the initial alert does not by itself prove misconduct.",
    actions: [
      rejects(
        "COA-SC-008-I",
        "The examination body should immediately cancel every candidate's result from the centre without further verification.",
        "The alert is not proof of misconduct. Cancelling all results before verification is an irreversible response based on incomplete evidence.",
        "PREMATURE_PUNITIVE_ACTION",
        { evidenceFit: "UNSUPPORTED", proportionality: "EXCESSIVE" },
      ),
      rejects(
        "COA-SC-008-II",
        "The examination body should ignore the alert completely because misconduct has not yet been proved.",
        "Lack of proof does not make a material warning sign irrelevant. The anomaly should be checked rather than ignored.",
        "TOO_WEAK_TO_ADDRESS_PROBLEM",
        { expectedUtility: "LOW", proportionality: "INSUFFICIENT" },
      ),
    ],
    expectedAnswerClass: "NEITHER",
  },
  {
    id: "COA-SC-009",
    qlId: "COA-QL-003",
    difficulty: "HARD",
    domain: "WORKPLACE",
    statement: "Several expensive tools are missing from a workshop, while the available access records are incomplete and do not identify who removed them.",
    actions: [
      follows(
        "COA-SC-009-I",
        "The organisation should reconcile the tool inventory and review available access or issue records before taking disciplinary action against any individual.",
        "The loss is real but responsibility is uncertain. Verification can narrow what happened without punishing someone on incomplete evidence.",
        ["VERIFY_BEFORE_IRREVERSIBLE_ACTION"],
      ),
      rejects(
        "COA-SC-009-II",
        "The organisation should suspend every employee who had access to the workshop until one of them accepts responsibility.",
        "The records do not identify the responsible person. Suspending everyone is both unsupported and disproportionate.",
        "PREMATURE_PUNITIVE_ACTION",
        { evidenceFit: "UNSUPPORTED", proportionality: "EXCESSIVE" },
      ),
    ],
    expectedAnswerClass: "ONLY_I",
  },

  // COA-QL-004 — administrative / institutional response
  {
    id: "COA-SC-010",
    qlId: "COA-QL-004",
    difficulty: "EASY",
    domain: "TRANSPORT",
    statement: "Passenger queues at a railway station have become unusually long because one staffed ticket counter is closed during the evening rush.",
    actions: [
      rejects(
        "COA-SC-010-I",
        "The station manager should ask the foreign affairs department to investigate the ticket-counter staffing problem.",
        "The proposed body has no operational role in running the station's ticket counters.",
        "OUTSIDE_AUTHORITY",
        { authorityFit: "OUTSIDE_SCOPE", expectedUtility: "LOW" },
      ),
      follows(
        "COA-SC-010-II",
        "The station administration should, where trained staff are available, reassign staff temporarily to reopen the counter during the evening rush.",
        "Reassigning available trained staff is within station administration and directly addresses the queue caused by the closed counter.",
        ["WITHIN_OPERATIONAL_AUTHORITY", "DIRECT_REMEDY"],
      ),
    ],
    expectedAnswerClass: "ONLY_II",
  },
  {
    id: "COA-SC-011",
    qlId: "COA-QL-004",
    difficulty: "MEDIUM",
    domain: "EDUCATION",
    statement: "A school's online fee portal has accepted payments but is not issuing confirmations, causing some students to appear unpaid in the school system.",
    actions: [
      follows(
        "COA-SC-011-I",
        "The school administration should reconcile the received payments with the payment provider and correct the affected student records.",
        "This is a direct administrative correction of the mismatch between received payments and school records.",
        ["WITHIN_OPERATIONAL_AUTHORITY", "DIRECT_REMEDY"],
      ),
      follows(
        "COA-SC-011-II",
        "The school should give affected students a temporary acknowledgement so that they are not penalised while the records are being corrected.",
        "A temporary acknowledgement protects students from an error they did not cause while the main reconciliation is completed.",
        ["USEFUL_TEMPORARY_SAFEGUARD", "PROPORTIONATE_RESPONSE"],
      ),
    ],
    expectedAnswerClass: "BOTH",
  },
  {
    id: "COA-SC-012",
    qlId: "COA-QL-004",
    difficulty: "MEDIUM",
    domain: "PUBLIC_ADMIN",
    statement: "Visitors to a government office are repeatedly going to the wrong rooms after several departments were moved to different floors.",
    actions: [
      rejects(
        "COA-SC-012-I",
        "The office should close all public services for a week so that visitors cannot go to the wrong rooms.",
        "Closing all services would remove access to the service instead of solving a simple navigation problem.",
        "EXCESSIVE_RESPONSE",
        { proportionality: "EXCESSIVE", expectedUtility: "HARMFUL" },
      ),
      rejects(
        "COA-SC-012-II",
        "The office should transfer responsibility for directing visitors to a nearby private sports club.",
        "Directing visitors inside the office is an administrative responsibility and cannot reasonably be transferred to an unrelated outside organisation.",
        "OUTSIDE_AUTHORITY",
        { authorityFit: "OUTSIDE_SCOPE", relevance: "INDIRECT", expectedUtility: "LOW" },
      ),
    ],
    expectedAnswerClass: "NEITHER",
  },

  // COA-QL-005 — constraint-aware action
  {
    id: "COA-SC-013",
    qlId: "COA-QL-005",
    difficulty: "MEDIUM",
    domain: "PUBLIC_ADMIN",
    statement: "A service centre has one spare biometric device, one active device has failed, and no funds for new equipment are available until next month. The centre must remain open.",
    actions: [
      follows(
        "COA-SC-013-I",
        "The centre should move the spare device to the failed counter and adjust appointments while the faulty unit is repaired.",
        "This uses the available spare, keeps the centre operating and stays within the stated resource limit.",
        ["CONSTRAINT_COMPATIBLE", "DIRECT_REMEDY"],
        { constraintFit: "COMPATIBLE", feasibility: "CONSTRAINED" },
      ),
      rejects(
        "COA-SC-013-II",
        "The centre should immediately purchase new biometric devices for every counter before reopening.",
        "The statement explicitly says funds for new equipment are unavailable and the centre must remain open, so this action violates both constraints.",
        "CONSTRAINT_VIOLATION",
        { feasibility: "IMPOSSIBLE", constraintFit: "VIOLATES" },
      ),
    ],
    expectedAnswerClass: "ONLY_I",
  },
  {
    id: "COA-SC-014",
    qlId: "COA-QL-005",
    difficulty: "MEDIUM",
    domain: "BANKING",
    statement: "A small bank branch has only two trained counter employees today and must keep at least one cash counter open throughout business hours.",
    actions: [
      rejects(
        "COA-SC-014-I",
        "The branch should assign both trained employees to a telephone-help desk until the queue at the branch disappears.",
        "Using both employees elsewhere would directly break the requirement to keep one cash counter open.",
        "CONSTRAINT_VIOLATION",
        { constraintFit: "VIOLATES", feasibility: "IMPOSSIBLE" },
      ),
      follows(
        "COA-SC-014-II",
        "The branch should keep one employee at the cash counter and use the other to organise tokens and handle non-cash queries when possible.",
        "This keeps the required counter open while using the second employee to reduce avoidable pressure on it.",
        ["CONSTRAINT_COMPATIBLE", "WITHIN_OPERATIONAL_AUTHORITY"],
        { constraintFit: "COMPATIBLE", feasibility: "CONSTRAINED", expectedUtility: "MODERATE" },
      ),
    ],
    expectedAnswerClass: "ONLY_II",
  },
  {
    id: "COA-SC-015",
    qlId: "COA-QL-005",
    difficulty: "HARD",
    domain: "EXAM_ADMIN",
    statement: "One examination room becomes unusable shortly before a test. Two spare rooms are available, and the rule of no more than thirty candidates in any room must still be followed.",
    actions: [
      follows(
        "COA-SC-015-I",
        "The centre should redistribute the affected candidates between the two spare rooms without exceeding the thirty-candidate limit.",
        "The spare rooms provide enough capacity while preserving the stated room limit.",
        ["CONSTRAINT_COMPATIBLE", "DIRECT_REMEDY"],
        { constraintFit: "COMPATIBLE" },
      ),
      follows(
        "COA-SC-015-II",
        "If seating preparation is not complete, the centre should briefly hold the affected group and start them after the spare rooms are ready while keeping the same allotted test duration.",
        "A short controlled delay can preserve both the room-capacity rule and the candidates' full test time.",
        ["CONSTRAINT_COMPATIBLE", "PROPORTIONATE_RESPONSE"],
        { constraintFit: "COMPATIBLE", expectedUtility: "MODERATE" },
      ),
    ],
    expectedAnswerClass: "BOTH",
  },

  // COA-QL-006 — proportionality and overreaction
  {
    id: "COA-SC-016",
    qlId: "COA-QL-006",
    difficulty: "EASY",
    domain: "EDUCATION",
    statement: "A few users repeatedly create noise in one reading room of a public library despite requests to remain quiet.",
    actions: [
      rejects(
        "COA-SC-016-I",
        "The library should ban every visitor from entering the building for one month.",
        "The problem involves a few users in one room. A month-long ban on everyone is far beyond what the situation requires.",
        "EXCESSIVE_RESPONSE",
        { proportionality: "EXCESSIVE", expectedUtility: "HARMFUL" },
      ),
      rejects(
        "COA-SC-016-II",
        "The library should permanently remove all chairs from the reading room so that nobody can stay there long enough to make noise.",
        "Removing the room's basic facility harms its normal purpose and is disproportionate to misconduct by a few users.",
        "EXCESSIVE_RESPONSE",
        { proportionality: "EXCESSIVE", expectedUtility: "HARMFUL" },
      ),
    ],
    expectedAnswerClass: "NEITHER",
  },
  {
    id: "COA-SC-017",
    qlId: "COA-QL-006",
    difficulty: "MEDIUM",
    domain: "WORKPLACE",
    statement: "One office floor is using unusually large amounts of paper because many routine documents are being printed unnecessarily.",
    actions: [
      follows(
        "COA-SC-017-I",
        "The office should introduce sensible print controls such as duplex defaults, user-level monitoring and limits where repeated misuse is found.",
        "The response is targeted at unnecessary printing and can reduce waste without stopping legitimate work.",
        ["PROPORTIONATE_RESPONSE", "TARGETED_PREVENTION"],
      ),
      rejects(
        "COA-SC-017-II",
        "The organisation should immediately prohibit all printing in every office, including documents that must be issued on paper.",
        "The problem is localised and does not justify stopping necessary printing across the organisation.",
        "EXCESSIVE_RESPONSE",
        { proportionality: "EXCESSIVE", expectedUtility: "HARMFUL" },
      ),
    ],
    expectedAnswerClass: "ONLY_I",
  },
  {
    id: "COA-SC-018",
    qlId: "COA-QL-006",
    difficulty: "MEDIUM",
    domain: "TRANSPORT",
    statement: "Passengers have made several complaints that the sign for one bus stop is difficult to see from the road.",
    actions: [
      rejects(
        "COA-SC-018-I",
        "The transport authority should cancel the entire bus route permanently.",
        "A visibility problem at one stop does not justify removing the whole route.",
        "EXCESSIVE_RESPONSE",
        { proportionality: "EXCESSIVE", expectedUtility: "HARMFUL" },
      ),
      follows(
        "COA-SC-018-II",
        "The authority should replace or reposition the unclear sign and check nearby route signs for the same visibility problem.",
        "Correcting the sign directly addresses the complaint, and a limited nearby check is a proportionate preventive step.",
        ["PROPORTIONATE_RESPONSE", "TARGETED_PREVENTION"],
      ),
    ],
    expectedAnswerClass: "ONLY_II",
  },

  // COA-QL-007 — paired courses
  {
    id: "COA-SC-019",
    qlId: "COA-QL-007",
    difficulty: "MEDIUM",
    domain: "CONSUMER_SERVICE",
    statement: "A service company has a growing backlog of approved customer refunds because requests remain waiting in one final processing queue for many days.",
    actions: [
      follows(
        "COA-SC-019-I",
        "The company should review the refund backlog daily and temporarily add trained processing support until the queue returns to a normal level.",
        "This directly addresses the processing bottleneck that is delaying already approved refunds.",
        ["DIRECT_REMEDY", "WITHIN_OPERATIONAL_AUTHORITY"],
      ),
      follows(
        "COA-SC-019-II",
        "The company should give customers a clear refund status and an escalation route for cases that remain overdue.",
        "This does not replace processing, but it is a useful parallel response for customers already affected by the delay.",
        ["USEFUL_TEMPORARY_SAFEGUARD"],
        { relevance: "INDIRECT", expectedUtility: "MODERATE" },
      ),
    ],
    expectedAnswerClass: "BOTH",
  },
  {
    id: "COA-SC-020",
    qlId: "COA-QL-007",
    difficulty: "MEDIUM",
    domain: "DIGITAL_SERVICE",
    statement: "Users of an online service are unable to sign in because a system certificate expired overnight.",
    actions: [
      rejects(
        "COA-SC-020-I",
        "The service provider should launch a general advertising campaign about the benefits of using the platform.",
        "Advertising does not restore access caused by the expired system certificate.",
        "UNRELATED_GOOD_ACTION",
        { relevance: "UNRELATED", expectedUtility: "LOW" },
      ),
      rejects(
        "COA-SC-020-II",
        "The service provider should permanently delete every user account that fails to sign in today.",
        "The login failure is caused by the service's certificate, not the user accounts. Deleting accounts targets the wrong thing and causes further harm.",
        "WRONG_TARGET",
        { evidenceFit: "CONTRADICTED", expectedUtility: "HARMFUL", proportionality: "EXCESSIVE" },
      ),
    ],
    expectedAnswerClass: "NEITHER",
  },

  // COA-QL-008 — multi-step / ordered response
  {
    id: "COA-SC-021",
    qlId: "COA-QL-008",
    difficulty: "HARD",
    domain: "EXAM_ADMIN",
    statement: "An online examination system flags possible duplicate registrations, but some matches may belong to different candidates with similar names and details.",
    actions: [
      follows(
        "COA-SC-021-I",
        "The examination body should first verify the flagged records and then merge or cancel only registrations confirmed to be duplicates.",
        "Verification is required before an irreversible record change, and the proposed order preserves that requirement.",
        ["VERIFY_BEFORE_IRREVERSIBLE_ACTION", "ORDERED_RESPONSE"],
        { sequenceFit: "VALID_STEP" },
      ),
      rejects(
        "COA-SC-021-II",
        "The examination body should first cancel all flagged registrations and check later whether any belonged to different candidates.",
        "Cancellation comes before the required verification, so a potentially correct action is placed in a harmful order.",
        "CORRECT_ACTION_WRONG_SEQUENCE",
        { evidenceFit: "UNSUPPORTED", sequenceFit: "WRONG_ORDER" },
      ),
    ],
    expectedAnswerClass: "ONLY_I",
  },
  {
    id: "COA-SC-022",
    qlId: "COA-QL-008",
    difficulty: "MEDIUM",
    domain: "TRANSPORT",
    statement: "A school bus develops a brake-system warning during its route, and another roadworthy bus is available nearby.",
    actions: [
      rejects(
        "COA-SC-022-I",
        "The operator should keep the bus in service and wait for its scheduled monthly inspection before checking the warning.",
        "A current brake warning requires an immediate safety response. Waiting for a later routine inspection is the wrong timing.",
        "WRONG_TIMING",
        { urgencyFit: "MISMATCHED", expectedUtility: "HARMFUL" },
      ),
      follows(
        "COA-SC-022-II",
        "The operator should stop the affected bus, transfer passengers safely to the available bus and inspect the warned vehicle before returning it to service.",
        "The sequence first removes the immediate risk, maintains the service with the available bus, and then addresses the vehicle fault.",
        ["ORDERED_RESPONSE", "USEFUL_TEMPORARY_SAFEGUARD", "DIRECT_REMEDY"],
        { sequenceFit: "VALID_STEP" },
      ),
    ],
    expectedAnswerClass: "ONLY_II",
  },

  // COA-QL-009 — integrated exam-grade discrimination
  {
    id: "COA-SC-023",
    qlId: "COA-QL-009",
    difficulty: "HARD",
    domain: "BANKING",
    statement: "A bank identifies duplicate service fees in one batch of transactions during month-end processing. Other branch services are working and must continue.",
    actions: [
      follows(
        "COA-SC-023-I",
        "The bank should stop the affected batch, reverse confirmed duplicate fees and test the correction before processing that batch again.",
        "This isolates the faulty process, corrects confirmed customer impact and checks the fix before the same batch is rerun.",
        ["DIRECT_REMEDY", "ORDERED_RESPONSE", "CONSTRAINT_COMPATIBLE"],
        { constraintFit: "COMPATIBLE", sequenceFit: "VALID_STEP" },
      ),
      follows(
        "COA-SC-023-II",
        "The branch should keep unaffected services open and provide a clear correction status to customers whose transactions are under review.",
        "The statement says other services must continue, and targeted communication is a proportionate response for affected customers while corrections are completed.",
        ["CONSTRAINT_COMPATIBLE", "USEFUL_TEMPORARY_SAFEGUARD"],
        { constraintFit: "COMPATIBLE", expectedUtility: "MODERATE" },
      ),
    ],
    expectedAnswerClass: "BOTH",
  },
  {
    id: "COA-SC-024",
    qlId: "COA-QL-009",
    difficulty: "HARD",
    domain: "PUBLIC_ADMIN",
    statement: "A public office receives repeated complaints that service has become slower, but it has not yet established whether the cause is staffing, process delay or a technical problem.",
    actions: [
      rejects(
        "COA-SC-024-I",
        "The office should immediately dismiss all counter staff because the slower service must have been caused by them.",
        "The cause has not been established, so blaming and dismissing all counter staff is unsupported and disproportionate.",
        "PREMATURE_PUNITIVE_ACTION",
        { evidenceFit: "UNSUPPORTED", proportionality: "EXCESSIVE" },
      ),
      rejects(
        "COA-SC-024-II",
        "The office should immediately construct a new building because more floor space must be the reason for the delay.",
        "The statement gives no evidence that floor space is causing the slowdown, and a new building is an unsupported overreaction.",
        "UNSUPPORTED_ASSUMPTION",
        { evidenceFit: "UNSUPPORTED", proportionality: "EXCESSIVE", feasibility: "CONSTRAINED" },
      ),
    ],
    expectedAnswerClass: "NEITHER",
  },
]);
