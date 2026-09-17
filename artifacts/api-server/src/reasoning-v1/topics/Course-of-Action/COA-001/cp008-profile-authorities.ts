import type { CoaActionAuthority, CoaDifficulty, CoaDomain, CoaReasonCode } from "./types.ts";

type ActionOverrides = Partial<Omit<CoaActionAuthority, "id" | "text" | "explanation" | "expectedVerdict" | "reasonCodes">>;

function follows(id: string, text: string, explanation: string, reasonCodes: readonly CoaReasonCode[], overrides: ActionOverrides = {}): CoaActionAuthority {
  return Object.freeze({
    id, text, explanation,
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

function rejects(id: string, text: string, explanation: string, reasonCode: CoaReasonCode, overrides: ActionOverrides): CoaActionAuthority {
  return Object.freeze({
    id, text, explanation,
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

export type CoaThreeActionAuthority = Readonly<{
  id: string;
  difficulty: CoaDifficulty;
  domain: CoaDomain;
  statement: string;
  actions: readonly [CoaActionAuthority, CoaActionAuthority, CoaActionAuthority];
  correctMask: number;
  optionMasks: readonly [number, number, number, number];
}>;

export const COA_CP008_THREE_ACTION_AUTHORITIES: readonly CoaThreeActionAuthority[] = Object.freeze([
  {
    id: "COA-3A-001", difficulty: "MEDIUM", domain: "CIVIC_SERVICE",
    statement: "A large public drain is repeatedly blocked because residents dump household waste into it. The drain is already partly clogged, the civic body can clear it, and waste collection points can be provided nearby.",
    actions: [
      rejects("COA-3A-001-I", "The civic body should post guards along the entire drain permanently so that no resident can approach it with waste.", "Permanent guarding of the whole drain is a broad and resource-heavy response when the blockage and disposal problem can be addressed directly.", "EXCESSIVE_RESPONSE", { proportionality: "EXCESSIVE", expectedUtility: "LOW" }),
      follows("COA-3A-001-II", "The civic body should clear the blocked drain and provide clearly marked waste-collection points so residents have a practical alternative to dumping into the drain.", "This removes the existing blockage and addresses the disposal problem that is causing repeated dumping.", ["DIRECT_REMEDY", "TARGETED_PREVENTION"]),
      follows("COA-3A-001-III", "The civic body should enforce the existing anti-dumping rules against repeated violations after providing the proper disposal arrangement.", "Targeted enforcement after a usable disposal option is available can reduce repeat dumping without penalising unrelated residents.", ["TARGETED_PREVENTION", "PROPORTIONATE_RESPONSE"]),
    ],
    correctMask: 0b110,
    optionMasks: [0b010, 0b011, 0b110, 0b111],
  },
  {
    id: "COA-3A-002", difficulty: "MEDIUM", domain: "HEALTH_SERVICE",
    statement: "A district reports a sharp seasonal rise in mosquito-borne fever. Hospitals expect more patients over the next month, and local health teams can issue prevention guidance and intensify mosquito-control work.",
    actions: [
      rejects("COA-3A-002-I", "The administration should treat a political debate about responsibility as the main immediate response before health-control work begins.", "Debate about responsibility does not reduce the immediate health risk and delays direct preventive and treatment preparation.", "WRONG_TIMING", { urgencyFit: "MISMATCHED", expectedUtility: "LOW" }),
      follows("COA-3A-002-II", "Health teams should intensify local mosquito-control measures and issue clear guidance on reducing mosquito exposure during the high-risk period.", "This directly reduces the source of transmission and helps residents lower exposure.", ["TARGETED_PREVENTION", "PROPORTIONATE_RESPONSE"]),
      follows("COA-3A-002-III", "Hospitals in the affected district should check essential supplies and staffing plans so the expected increase in patients can be handled safely.", "Preparing treatment capacity is a practical response to the expected seasonal rise and complements prevention.", ["WITHIN_OPERATIONAL_AUTHORITY", "TARGETED_PREVENTION"]),
    ],
    correctMask: 0b110,
    optionMasks: [0b111, 0b011, 0b110, 0b101],
  },
  {
    id: "COA-3A-003", difficulty: "HARD", domain: "EXAM_ADMIN",
    statement: "Candidates complain that several questions in an examination may be outside the notified syllabus. The question paper, syllabus and expert panel are available, but the claim has not yet been verified.",
    actions: [
      follows("COA-3A-003-I", "The examination body should appoint a subject panel to compare the disputed questions with the notified syllabus and submit a time-bound finding.", "The complaint can be checked against available evidence before any irreversible examination decision is made.", ["VERIFY_BEFORE_IRREVERSIBLE_ACTION", "WITHIN_OPERATIONAL_AUTHORITY"]),
      rejects("COA-3A-003-II", "The examination body should cancel the examination immediately before the disputed questions are checked by the available subject panel.", "Immediate cancellation assumes the complaint is correct before verification and is disproportionate at this stage.", "PREMATURE_PUNITIVE_ACTION", { evidenceFit: "UNSUPPORTED", proportionality: "EXCESSIVE" }),
      follows("COA-3A-003-III", "If the panel confirms a material syllabus error that affected fairness, the examination body should apply the approved corrective remedy, including a re-examination if that is necessary.", "A corrective step is reasonable after the evidence establishes a material problem and the remedy is tied to that finding.", ["VERIFY_BEFORE_IRREVERSIBLE_ACTION", "ORDERED_RESPONSE"], { urgencyFit: "FOLLOW_UP", sequenceFit: "VALID_STEP" }),
    ],
    correctMask: 0b101,
    optionMasks: [0b001, 0b101, 0b110, 0b111],
  },
  {
    id: "COA-3A-004", difficulty: "HARD", domain: "PUBLIC_ADMIN",
    statement: "A recruitment drive experienced dangerous crowding and one serious injury at the entry gate. The cause has not yet been established, and the remaining candidates are scheduled to report over the next two days.",
    actions: [
      rejects("COA-3A-004-I", "All officials assigned to the drive should be suspended immediately before the crowd-control records and gate arrangements are reviewed.", "The incident requires investigation, but suspending everyone first assumes responsibility without evidence and may disrupt the remaining process.", "PREMATURE_PUNITIVE_ACTION", { evidenceFit: "UNSUPPORTED", proportionality: "EXCESSIVE" }),
      follows("COA-3A-004-II", "A team should examine the crowd-control arrangements, entry records and sequence of events promptly so the cause of the dangerous crowding is established.", "A focused investigation is needed before responsibility is fixed and can identify immediate operational corrections.", ["VERIFY_BEFORE_IRREVERSIBLE_ACTION", "DIRECT_REMEDY"]),
      follows("COA-3A-004-III", "The remaining reporting schedule should be staggered into smaller groups and the entry layout adjusted before the next candidates arrive.", "This is an immediate preventive step tied to the known crowding risk while the detailed investigation continues.", ["TARGETED_PREVENTION", "USEFUL_TEMPORARY_SAFEGUARD"]),
    ],
    correctMask: 0b110,
    optionMasks: [0b001, 0b010, 0b100, 0b110],
  },
  {
    id: "COA-3A-005", difficulty: "MEDIUM", domain: "PUBLIC_ADMIN",
    statement: "A city expects an unusually large festival crowd in a compact market area. Entry routes are limited, police and medical teams are available, and crowd numbers can be monitored at the main access points.",
    actions: [
      follows("COA-3A-005-I", "The civic authority should monitor entry and temporarily slow or redirect arrivals when the safe capacity of the market area is reached.", "Capacity monitoring and controlled entry directly reduce dangerous overcrowding.", ["TARGETED_PREVENTION", "CONSTRAINT_COMPATIBLE"]),
      follows("COA-3A-005-II", "Police should strengthen crowd and traffic management at the main access points during the expected peak period.", "Focused police deployment is within authority and addresses the predictable crowd-control need.", ["WITHIN_OPERATIONAL_AUTHORITY", "TARGETED_PREVENTION"]),
      follows("COA-3A-005-III", "Nearby emergency medical teams should be alerted and access lanes kept clear so they can respond quickly if an incident occurs.", "A limited readiness measure is proportionate to a forecast large crowd and preserves emergency access.", ["USEFUL_TEMPORARY_SAFEGUARD", "PROPORTIONATE_RESPONSE"]),
    ],
    correctMask: 0b111,
    optionMasks: [0b011, 0b101, 0b110, 0b111],
  },
  {
    id: "COA-3A-006", difficulty: "MEDIUM", domain: "TRANSPORT",
    statement: "Dense fog is causing repeated delays in air and rail services across a region. Operators can issue live travel updates, but there is no basis for assuming that every service must be stopped for the entire day.",
    actions: [
      rejects("COA-3A-006-I", "All air and rail services in the region should be suspended for the whole day regardless of route visibility or later improvement.", "A blanket day-long suspension is broader than the information supports because conditions and individual services can differ.", "EXCESSIVE_RESPONSE", { proportionality: "EXCESSIVE", expectedUtility: "LOW" }),
      follows("COA-3A-006-II", "Passengers should receive timely warnings about likely delays or cancellations and should be advised to check service status before travelling.", "Current information helps passengers plan around a disruption that is already affecting transport.", ["DIRECT_REMEDY", "PROPORTIONATE_RESPONSE"]),
      rejects("COA-3A-006-III", "The government should treat immediate installation of new navigation equipment across every airport and rail route as the first response to the current fog disruption.", "Long-term technology upgrades may merit separate study, but they cannot be the first practical response to today's service disruption.", "LONG_TERM_ONLY_WHEN_IMMEDIATE_ACTION_REQUIRED", { urgencyFit: "MISMATCHED", expectedUtility: "LOW" }),
    ],
    correctMask: 0b010,
    optionMasks: [0b001, 0b010, 0b110, 0b111],
  },
]);

export type CoaEitherAuthority = Readonly<{
  id: string;
  difficulty: CoaDifficulty;
  domain: CoaDomain;
  statement: string;
  actions: readonly [CoaActionAuthority, CoaActionAuthority];
  exclusiveRelationReason: string;
}>;

export const COA_CP008_EITHER_AUTHORITIES: readonly CoaEitherAuthority[] = Object.freeze([
  {
    id: "COA-EITHER-001", difficulty: "HARD", domain: "WORKPLACE",
    statement: "A small company has exhausted its operating funds and cannot continue business in its present form. Its owners can either complete an orderly closure and settle liabilities from available assets, or accept a credible acquisition offer that would take over the business and liabilities.",
    actions: [
      follows("COA-EITHER-001-I", "The owners should proceed with an orderly closure under the applicable process and use the available assets to settle liabilities as far as possible.", "If the business is not transferred, an orderly closure is a practical way to end operations and address outstanding liabilities.", ["DIRECT_REMEDY", "WITHIN_OPERATIONAL_AUTHORITY"]),
      follows("COA-EITHER-001-II", "The owners should accept the credible acquisition route if its terms lawfully transfer the business and provide for the outstanding liabilities.", "A valid acquisition is an alternative route that can resolve the inability to continue independently while addressing liabilities.", ["DIRECT_REMEDY", "WITHIN_OPERATIONAL_AUTHORITY"]),
    ],
    exclusiveRelationReason: "The same business cannot simultaneously be completed as an independent wind-down and transferred as a going concern; one resolution route is selected.",
  },
  {
    id: "COA-EITHER-002", difficulty: "MEDIUM", domain: "EXAM_ADMIN",
    statement: "An examination venue becomes unavailable on the morning before a scheduled session. A prepared backup venue of sufficient capacity is available, and the examination body also has authority to reschedule the session if the backup cannot be used.",
    actions: [
      follows("COA-EITHER-002-I", "The examination body should shift the affected session to the prepared backup venue after notifying candidates and confirming the required arrangements.", "Using a ready backup venue preserves the session when it can be operated safely and candidates can be informed.", ["USEFUL_TEMPORARY_SAFEGUARD", "WITHIN_OPERATIONAL_AUTHORITY"]),
      follows("COA-EITHER-002-II", "If the backup venue cannot be activated in time, the examination body should reschedule the affected session and issue a clear revised notice to candidates.", "Rescheduling is a valid alternative when the backup route cannot be used in time.", ["WITHIN_OPERATIONAL_AUTHORITY", "PROPORTIONATE_RESPONSE"]),
    ],
    exclusiveRelationReason: "For the same candidates and session, the body either conducts it at the backup venue or reschedules it; both outcomes are not carried out together.",
  },
  {
    id: "COA-EITHER-003", difficulty: "HARD", domain: "DIGITAL_SERVICE",
    statement: "A critical internal application runs on an obsolete server that must be retired this month. The organisation has approved two fully funded replacement paths: migrate the application to its managed cloud platform or replace the server with a supported on-premise system. Only one production platform is required.",
    actions: [
      follows("COA-EITHER-003-I", "The organisation should migrate the application to the approved managed cloud platform, test the migration and retire the obsolete server after successful cutover.", "The approved cloud path replaces the unsupported server and provides a complete production route.", ["DIRECT_REMEDY", "ORDERED_RESPONSE"], { sequenceFit: "VALID_STEP" }),
      follows("COA-EITHER-003-II", "The organisation should install the approved supported on-premise replacement, test the application on it and retire the obsolete server after successful cutover.", "The approved on-premise path also replaces the unsupported server and provides a complete production route.", ["DIRECT_REMEDY", "ORDERED_RESPONSE"], { sequenceFit: "VALID_STEP" }),
    ],
    exclusiveRelationReason: "The requirement is to choose one replacement production platform; implementing both complete platforms would duplicate the same replacement rather than form complementary actions.",
  },
  {
    id: "COA-EITHER-004", difficulty: "MEDIUM", domain: "TRANSPORT",
    statement: "A bridge on a local route is closed for urgent repair. Two separately approved temporary diversion routes can each carry the normal traffic, but traffic control requires selecting one signed diversion so drivers receive a single clear route.",
    actions: [
      follows("COA-EITHER-004-I", "The authority should open and clearly sign the first approved diversion route for the repair period.", "The first approved route can carry the traffic and provides a workable temporary alternative.", ["USEFUL_TEMPORARY_SAFEGUARD", "CONSTRAINT_COMPATIBLE"]),
      follows("COA-EITHER-004-II", "The authority should open and clearly sign the second approved diversion route for the repair period.", "The second approved route can also carry the traffic and provides a workable temporary alternative.", ["USEFUL_TEMPORARY_SAFEGUARD", "CONSTRAINT_COMPATIBLE"]),
    ],
    exclusiveRelationReason: "Traffic control requires one signed diversion for this closure; either approved route works, but using both as simultaneous official diversions would defeat the stated single-route constraint.",
  },
]);
