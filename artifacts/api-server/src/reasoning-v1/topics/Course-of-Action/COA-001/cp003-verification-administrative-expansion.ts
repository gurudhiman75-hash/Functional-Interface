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

export const COA_CP003_ENGLISH_EXPANSION: readonly CoaScenarioAuthority[] = Object.freeze([
  // COA-QL-003 — investigation / verification before irreversible action
  {
    id: "COA-SC-049", qlId: "COA-QL-003", difficulty: "MEDIUM", domain: "BANKING",
    statement: "A bank's fraud system flags an unusually large transfer from a customer's account, but the available information does not yet show whether the customer authorised it.",
    actions: [
      follows("COA-SC-049-I", "The bank should place a temporary hold on the flagged transfer and verify the customer's authorisation through an approved contact channel.", "A temporary hold limits possible loss while the bank checks the fact that is still uncertain: whether the customer authorised the transfer.", ["VERIFY_BEFORE_IRREVERSIBLE_ACTION", "USEFUL_TEMPORARY_SAFEGUARD"]),
      rejects("COA-SC-049-II", "The bank should permanently close the customer's account immediately because the fraud alert proves that the customer has misused the account.", "The alert establishes suspicion, not customer misconduct. Permanent closure before verification assumes a fact that the statement has not established.", "PREMATURE_PUNITIVE_ACTION", { evidenceFit: "UNSUPPORTED", proportionality: "EXCESSIVE" }),
    ], expectedAnswerClass: "ONLY_I",
  },
  {
    id: "COA-SC-050", qlId: "COA-QL-003", difficulty: "MEDIUM", domain: "EXAM_ADMIN",
    statement: "Several candidates report that their attendance is missing from the examination system, but the centre still has signed attendance sheets and entry records that have not been checked.",
    actions: [
      rejects("COA-SC-050-I", "The examination body should cancel the affected candidates' results at once because a missing electronic attendance entry means they were absent.", "The electronic record is disputed and independent attendance evidence is available. Cancelling results before checking it would be premature.", "PREMATURE_PUNITIVE_ACTION", { evidenceFit: "UNSUPPORTED", proportionality: "EXCESSIVE" }),
      follows("COA-SC-050-II", "The examination body should compare the signed attendance sheets and entry records with the electronic data before changing any candidate's result status.", "The available records can establish whether the missing electronic attendance is an administrative error, so they should be checked before an irreversible result decision.", ["VERIFY_BEFORE_IRREVERSIBLE_ACTION"]),
    ], expectedAnswerClass: "ONLY_II",
  },
  {
    id: "COA-SC-051", qlId: "COA-QL-003", difficulty: "HARD", domain: "WORKPLACE",
    statement: "A company's expense system shows repeated claims from one employee for the same travel date, but some claims may be corrected resubmissions after earlier entries were rejected.",
    actions: [
      follows("COA-SC-051-I", "The company should compare the claim versions, receipts and approval history before deciding whether duplicate reimbursement was actually attempted.", "The repeated entries can have more than one explanation. Checking the versions and supporting records distinguishes corrected submissions from improper duplicates.", ["VERIFY_BEFORE_IRREVERSIBLE_ACTION"]),
      follows("COA-SC-051-II", "Until the review is complete, the company should pause payment only on the disputed claims rather than block all of the employee's unrelated approved reimbursements.", "A narrow temporary hold protects against duplicate payment while avoiding unnecessary action against claims that are not under dispute.", ["USEFUL_TEMPORARY_SAFEGUARD", "PROPORTIONATE_RESPONSE"]),
    ], expectedAnswerClass: "BOTH",
  },
  {
    id: "COA-SC-052", qlId: "COA-QL-003", difficulty: "MEDIUM", domain: "DIGITAL_SERVICE",
    statement: "A website receives complaints that some accounts were accessed from unfamiliar devices, but the logs have not yet been checked to distinguish genuine compromise from normal device changes.",
    actions: [
      rejects("COA-SC-052-I", "The service should permanently delete every reported account immediately so that no unauthorised person can continue using it.", "Deleting accounts is irreversible and excessive when the service has not yet established whether the unfamiliar access was unauthorised.", "PREMATURE_PUNITIVE_ACTION", { evidenceFit: "UNSUPPORTED", proportionality: "EXCESSIVE" }),
      rejects("COA-SC-052-II", "The service should take no action because an unfamiliar device can sometimes belong to the genuine account holder.", "A possible innocent explanation does not justify ignoring a credible security report. The access records should still be checked and temporary safeguards used where needed.", "TOO_WEAK_TO_ADDRESS_PROBLEM", { proportionality: "INSUFFICIENT", expectedUtility: "LOW" }),
    ], expectedAnswerClass: "NEITHER",
  },
  {
    id: "COA-SC-053", qlId: "COA-QL-003", difficulty: "EASY", domain: "CONSUMER_SERVICE",
    statement: "A customer says a delivered appliance was already damaged on arrival, while the seller has dispatch photographs and delivery-condition records that have not yet been reviewed.",
    actions: [
      follows("COA-SC-053-I", "The seller should review the dispatch and delivery-condition records promptly and then process the claim according to what the records and inspection establish.", "The available evidence can help establish when the damage occurred, so checking it is a direct and fair step before deciding the claim.", ["VERIFY_BEFORE_IRREVERSIBLE_ACTION"]),
      rejects("COA-SC-053-II", "The seller should reject the complaint immediately because accepting delivery proves that the appliance could not have arrived damaged.", "Accepting delivery does not establish the condition of the appliance by itself. The proposed rejection assumes a fact that the available evidence has not yet confirmed.", "UNSUPPORTED_ASSUMPTION", { evidenceFit: "UNSUPPORTED", expectedUtility: "LOW" }),
    ], expectedAnswerClass: "ONLY_I",
  },
  {
    id: "COA-SC-054", qlId: "COA-QL-003", difficulty: "MEDIUM", domain: "HEALTH_SERVICE",
    statement: "A clinic notices that several appointment records show the same patient identifier, but it is not yet clear whether this is a duplicate-entry error or whether records were linked incorrectly.",
    actions: [
      rejects("COA-SC-054-I", "The clinic should merge all matching records immediately so that only one patient file remains before the records are checked further.", "The records may not belong together. Merging them before verification can create a new record error and is the wrong order of action.", "CORRECT_ACTION_WRONG_SEQUENCE", { evidenceFit: "UNSUPPORTED", sequenceFit: "WRONG_ORDER" }),
      follows("COA-SC-054-II", "The clinic should verify the identifiers and source records first, then correct only the entries confirmed to be duplicates or wrongly linked.", "Verification separates genuine duplicate entries from incorrectly linked records and prevents an irreversible record change from being made on an assumption.", ["VERIFY_BEFORE_IRREVERSIBLE_ACTION", "ORDERED_RESPONSE"]),
    ], expectedAnswerClass: "ONLY_II",
  },
  {
    id: "COA-SC-055", qlId: "COA-QL-003", difficulty: "HARD", domain: "LOGISTICS",
    statement: "A warehouse finds a mismatch between recorded and physical stock after a system migration, but both migration errors and unauthorised removals remain possible explanations.",
    actions: [
      follows("COA-SC-055-I", "The warehouse should reconcile pre-migration records, transaction logs and a fresh physical count before assigning responsibility for the shortage.", "The shortage is real, but its cause is uncertain. Reconciliation can distinguish a data-conversion error from an actual stock loss before blame is assigned.", ["VERIFY_BEFORE_IRREVERSIBLE_ACTION"]),
      follows("COA-SC-055-II", "The warehouse should temporarily tighten issue controls on the affected stock category while the mismatch is investigated, without accusing individual staff in advance.", "A temporary control reduces the risk of further unexplained movement while keeping the investigation neutral until the cause is established.", ["USEFUL_TEMPORARY_SAFEGUARD", "PROPORTIONATE_RESPONSE"]),
    ], expectedAnswerClass: "BOTH",
  },
  {
    id: "COA-SC-056", qlId: "COA-QL-003", difficulty: "MEDIUM", domain: "EDUCATION",
    statement: "A school receives an anonymous message alleging that examination papers were shared before a test, but the message gives no document or source that confirms the allegation.",
    actions: [
      rejects("COA-SC-056-I", "The school should cancel the examination results and suspend the named staff members solely on the basis of the anonymous allegation.", "The allegation may require checking, but it is not verified evidence. Cancellation and suspension before verification would be premature and disproportionate.", "PREMATURE_PUNITIVE_ACTION", { evidenceFit: "UNSUPPORTED", proportionality: "EXCESSIVE" }),
      rejects("COA-SC-056-II", "The school should ignore the message completely because an anonymous complaint can never contain useful information.", "Anonymous information is not proof, but it can still point to a matter that should be checked discreetly when the alleged breach is serious.", "TOO_WEAK_TO_ADDRESS_PROBLEM", { proportionality: "INSUFFICIENT", expectedUtility: "LOW" }),
    ], expectedAnswerClass: "NEITHER",
  },
  {
    id: "COA-SC-057", qlId: "COA-QL-003", difficulty: "MEDIUM", domain: "TRANSPORT",
    statement: "A bus depot receives repeated complaints that one driver skips a scheduled stop, but route-tracking data and duty records for the complained-of trips are available and have not been reviewed.",
    actions: [
      follows("COA-SC-057-I", "The depot should compare the complaints with route-tracking and duty records before deciding whether the driver failed to serve the stop.", "The records can directly test the allegation for the relevant trips, so reviewing them is the proper step before disciplinary action.", ["VERIFY_BEFORE_IRREVERSIBLE_ACTION"]),
      rejects("COA-SC-057-II", "The depot should remove the driver permanently from service before checking the trip records because repeated complaints are sufficient proof of misconduct.", "Repeated complaints justify investigation but do not replace the available trip evidence. Permanent removal before checking the records is premature.", "PREMATURE_PUNITIVE_ACTION", { evidenceFit: "UNSUPPORTED", proportionality: "EXCESSIVE" }),
    ], expectedAnswerClass: "ONLY_I",
  },
  {
    id: "COA-SC-058", qlId: "COA-QL-003", difficulty: "MEDIUM", domain: "PUBLIC_ADMIN",
    statement: "A public office finds several applications marked as approved by an account at an unusual hour, but it has not established whether an authorised officer used remote access or the account was misused.",
    actions: [
      rejects("COA-SC-058-I", "The office should dismiss the account holder immediately because approvals made at an unusual hour necessarily prove deliberate misuse.", "The time is unusual but does not establish who used the account or whether the access was authorised. Dismissal would assume guilt before verification.", "PREMATURE_PUNITIVE_ACTION", { evidenceFit: "UNSUPPORTED", proportionality: "EXCESSIVE" }),
      follows("COA-SC-058-II", "The office should preserve the access logs, verify the login source and approval records, and then decide what corrective or disciplinary action is justified.", "The access data can establish whether the approvals were authorised or whether the account was misused, so it should be checked before assigning responsibility.", ["VERIFY_BEFORE_IRREVERSIBLE_ACTION"]),
    ], expectedAnswerClass: "ONLY_II",
  },
  {
    id: "COA-SC-059", qlId: "COA-QL-003", difficulty: "HARD", domain: "CIVIC_SERVICE",
    statement: "A municipal contractor is accused of reporting more completed repair work than residents can see on site, while work orders, inspection records and payment measurements are available for comparison.",
    actions: [
      follows("COA-SC-059-I", "The municipal office should compare the work orders, site measurements and inspection records before deciding whether the contractor overstated completed work.", "The allegation can be tested against records and physical measurements, so verification should come before a contractual or punitive decision.", ["VERIFY_BEFORE_IRREVERSIBLE_ACTION"]),
      follows("COA-SC-059-II", "The office should hold payment only for the disputed portion until verification is completed rather than stop unrelated verified payments automatically.", "A limited hold protects public funds while keeping the response tied to the part of the work that is actually under dispute.", ["USEFUL_TEMPORARY_SAFEGUARD", "PROPORTIONATE_RESPONSE"]),
    ], expectedAnswerClass: "BOTH",
  },
  {
    id: "COA-SC-060", qlId: "COA-QL-003", difficulty: "MEDIUM", domain: "PUBLIC_UTILITY",
    statement: "A utility receives complaints that some meters are recording unusually high use after maintenance, but no comparison with earlier readings or meter tests has yet been made.",
    actions: [
      rejects("COA-SC-060-I", "The utility should replace every meter in the service area immediately on the assumption that the maintenance made all of them inaccurate.", "The complaint concerns some meters and the cause has not been established. Replacing every meter assumes a system-wide fault without evidence.", "UNSUPPORTED_ASSUMPTION", { evidenceFit: "UNSUPPORTED", expectedUtility: "LOW" }),
      rejects("COA-SC-060-II", "The utility should continue issuing disputed high bills without any review because a meter reading must always be correct once it appears in the system.", "A system reading can still be wrong. Refusing to review a credible anomaly leaves the actual uncertainty unresolved and offers no corrective path.", "TOO_WEAK_TO_ADDRESS_PROBLEM", { proportionality: "INSUFFICIENT", expectedUtility: "LOW" }),
    ], expectedAnswerClass: "NEITHER",
  },

  // COA-QL-004 — administrative / institutional response
  {
    id: "COA-SC-061", qlId: "COA-QL-004", difficulty: "EASY", domain: "PUBLIC_ADMIN",
    statement: "Visitors are missing their scheduled appointments because a government office changed room numbers but the reception desk is still using the old floor directory.",
    actions: [
      follows("COA-SC-061-I", "The office administration should update the reception directory and place clear temporary signs showing the new room numbers until permanent signs are installed.", "Updating the information is within the office's control and directly corrects the administrative cause of visitors going to the wrong rooms.", ["WITHIN_OPERATIONAL_AUTHORITY", "DIRECT_REMEDY"]),
      rejects("COA-SC-061-II", "The office should tell visitors to arrive one hour earlier so they have enough time to search for the correct rooms themselves.", "Earlier arrival shifts the burden to visitors while leaving the inaccurate directory unchanged, so it does not correct the administrative failure.", "TOO_WEAK_TO_ADDRESS_PROBLEM", { proportionality: "INSUFFICIENT", expectedUtility: "LOW" }),
    ], expectedAnswerClass: "ONLY_I",
  },
  {
    id: "COA-SC-062", qlId: "COA-QL-004", difficulty: "MEDIUM", domain: "BANKING",
    statement: "A bank branch has long queues for simple account statements because the same counter is handling both complex service requests and quick document requests during peak hours.",
    actions: [
      rejects("COA-SC-062-I", "The branch should wait for approval to open a new permanent branch before making any local change to the current counter arrangement.", "A permanent expansion may take time and is not necessary to test a local queue-management fix for the current service mix.", "LONG_TERM_ONLY_WHEN_IMMEDIATE_ACTION_REQUIRED", { urgencyFit: "MISMATCHED", expectedUtility: "LOW" }),
      follows("COA-SC-062-II", "The branch manager should use a separate quick-service queue or designated window for simple document requests during peak periods where staffing permits.", "Separating short transactions is a practical branch-level administrative response that can reduce unnecessary waiting without stopping complex services.", ["WITHIN_OPERATIONAL_AUTHORITY", "PROPORTIONATE_RESPONSE"]),
    ], expectedAnswerClass: "ONLY_II",
  },
  {
    id: "COA-SC-063", qlId: "COA-QL-004", difficulty: "HARD", domain: "EDUCATION",
    statement: "A college timetable places two compulsory classes for the same student group at the same hour because separate departments submitted schedules without a final conflict check.",
    actions: [
      follows("COA-SC-063-I", "The academic office should run a conflict check across departmental timetables and revise one of the overlapping compulsory class slots.", "The conflict was created by uncoordinated scheduling, so a central check and timetable correction directly address the administrative cause.", ["WITHIN_OPERATIONAL_AUTHORITY", "DIRECT_REMEDY"]),
      follows("COA-SC-063-II", "The college should require a central timetable validation step before future compulsory schedules are released to students.", "A central validation step is a practical preventive administrative control against the same cross-department scheduling conflict recurring.", ["WITHIN_OPERATIONAL_AUTHORITY", "TARGETED_PREVENTION"]),
    ], expectedAnswerClass: "BOTH",
  },
  {
    id: "COA-SC-064", qlId: "COA-QL-004", difficulty: "MEDIUM", domain: "TRANSPORT",
    statement: "Passengers cannot tell which platform a delayed train will use because station announcements and display boards are showing different platform information.",
    actions: [
      rejects("COA-SC-064-I", "The station should ask passengers to follow whichever source they personally trust more until the train arrives.", "Letting passengers choose between conflicting sources leaves the information problem unresolved and can send them to different platforms.", "TOO_WEAK_TO_ADDRESS_PROBLEM", { proportionality: "INSUFFICIENT", expectedUtility: "LOW" }),
      rejects("COA-SC-064-II", "The station should suspend all train services for the rest of the day until a new passenger-information system can be purchased.", "The problem is inconsistent platform information. Stopping all services for a system replacement is far more disruptive than the administrative correction required.", "EXCESSIVE_RESPONSE", { proportionality: "EXCESSIVE", expectedUtility: "HARMFUL" }),
    ], expectedAnswerClass: "NEITHER",
  },
  {
    id: "COA-SC-065", qlId: "COA-QL-004", difficulty: "EASY", domain: "HEALTH_SERVICE",
    statement: "Patients are repeatedly sent to the wrong clinic room because appointment slips still show department locations from before a recent internal relocation.",
    actions: [
      follows("COA-SC-065-I", "The clinic administration should update the appointment-slip template and provide temporary directions at reception until all new room information is reflected.", "The wrong room information is an administrative source error. Updating the template and giving temporary directions directly correct it.", ["WITHIN_OPERATIONAL_AUTHORITY", "DIRECT_REMEDY"]),
      rejects("COA-SC-065-II", "The clinic should ask each department to handle only patients who find the new room without assistance until people become familiar with the layout.", "This leaves the incorrect appointment information unchanged and makes patients absorb the cost of an avoidable administrative error.", "TOO_WEAK_TO_ADDRESS_PROBLEM", { proportionality: "INSUFFICIENT", expectedUtility: "LOW" }),
    ], expectedAnswerClass: "ONLY_I",
  },
  {
    id: "COA-SC-066", qlId: "COA-QL-004", difficulty: "MEDIUM", domain: "DIGITAL_SERVICE",
    statement: "A public service portal keeps sending duplicate status messages because two internal notification jobs are both triggered by the same application update.",
    actions: [
      rejects("COA-SC-066-I", "The portal team should disable all status notifications permanently so that users can no longer receive duplicate messages.", "Removing all notifications eliminates a useful service rather than correcting the duplicate trigger, so the response is broader than necessary.", "EXCESSIVE_RESPONSE", { proportionality: "EXCESSIVE", expectedUtility: "HARMFUL" }),
      follows("COA-SC-066-II", "The portal team should identify the duplicate trigger, keep one correct notification path active and remove or suppress the redundant job.", "The duplicate message comes from two jobs responding to the same update. Removing the redundant trigger directly fixes the administrative process fault.", ["WITHIN_OPERATIONAL_AUTHORITY", "DIRECT_REMEDY"]),
    ], expectedAnswerClass: "ONLY_II",
  },
  {
    id: "COA-SC-067", qlId: "COA-QL-004", difficulty: "HARD", domain: "EXAM_ADMIN",
    statement: "An examination centre has two candidate queues entering through the same gate, causing identity checks to mix and slow down even though a second staffed gate is available nearby.",
    actions: [
      follows("COA-SC-067-I", "The centre superintendent should separate the candidate queues and assign one verified group to each staffed gate with clear signs before entry begins.", "Using the available staffed gates and clear queue separation is within centre control and directly reduces mixing at identity checks.", ["WITHIN_OPERATIONAL_AUTHORITY", "DIRECT_REMEDY"]),
      follows("COA-SC-067-II", "The centre should brief entry staff on the revised queue allocation and designate one person to resolve candidates who reach the wrong line.", "A short staff briefing and exception point support the new arrangement and reduce confusion without changing the examination rules.", ["WITHIN_OPERATIONAL_AUTHORITY", "PROPORTIONATE_RESPONSE"]),
    ], expectedAnswerClass: "BOTH",
  },
  {
    id: "COA-SC-068", qlId: "COA-QL-004", difficulty: "MEDIUM", domain: "WORKPLACE",
    statement: "Employees submit leave requests by email to several supervisors, and some requests are approved twice while others are missed because there is no single tracking point.",
    actions: [
      rejects("COA-SC-068-I", "The organisation should ask employees to send the same leave request to even more supervisors so that someone is more likely to notice it.", "Sending the same request to more people increases duplication and does not create a single reliable tracking point.", "WRONG_TARGET", { expectedUtility: "LOW", evidenceFit: "CONTRADICTED" }),
      rejects("COA-SC-068-II", "The organisation should stop allowing leave requests for the next three months until a completely new human-resources system is purchased.", "A temporary administrative tracking process can address the problem. Suspending leave requests for months is excessive and unnecessary.", "EXCESSIVE_RESPONSE", { proportionality: "EXCESSIVE", expectedUtility: "HARMFUL" }),
    ], expectedAnswerClass: "NEITHER",
  },
  {
    id: "COA-SC-069", qlId: "COA-QL-004", difficulty: "MEDIUM", domain: "LOGISTICS",
    statement: "Delivery vehicles are waiting at a depot because loading bays are assigned verbally and two vehicles are sometimes directed to the same bay at the same time.",
    actions: [
      follows("COA-SC-069-I", "The depot should use a visible bay-allocation register or digital queue so each arriving vehicle receives one confirmed loading slot.", "A single visible allocation record directly addresses the double-booking created by separate verbal instructions.", ["WITHIN_OPERATIONAL_AUTHORITY", "DIRECT_REMEDY"]),
      rejects("COA-SC-069-II", "The depot should increase the number of delivery vehicles before changing the way existing loading bays are assigned.", "More vehicles would add demand to the same flawed allocation process and does not correct the double-booking of bays.", "WRONG_TARGET", { relevance: "INDIRECT", expectedUtility: "LOW" }),
    ], expectedAnswerClass: "ONLY_I",
  },
  {
    id: "COA-SC-070", qlId: "COA-QL-004", difficulty: "MEDIUM", domain: "CONSUMER_SERVICE",
    statement: "A service company is closing complaints as resolved when field work is only scheduled, because the internal status code for 'scheduled' is mapped incorrectly to the customer-facing system.",
    actions: [
      rejects("COA-SC-070-I", "The company should instruct customers to reopen every complaint themselves whenever the resolved message appears, without correcting the status mapping.", "This shifts repeated correction to customers while leaving the known administrative mapping error in place.", "TOO_WEAK_TO_ADDRESS_PROBLEM", { proportionality: "INSUFFICIENT", expectedUtility: "LOW" }),
      follows("COA-SC-070-II", "The company should correct the status mapping and review recently affected complaints so scheduled work is not shown as completed prematurely.", "Correcting the mapping fixes the source of the wrong status, and reviewing affected cases repairs records already changed by the error.", ["WITHIN_OPERATIONAL_AUTHORITY", "DIRECT_REMEDY"]),
    ], expectedAnswerClass: "ONLY_II",
  },
  {
    id: "COA-SC-071", qlId: "COA-QL-004", difficulty: "HARD", domain: "CIVIC_SERVICE",
    statement: "Residents report missed waste pickups because route changes were approved internally but the revised route sheets were not issued to collection crews before the new schedule began.",
    actions: [
      follows("COA-SC-071-I", "The civic service should issue corrected route sheets immediately and brief the affected crews on the revised stops before the next collection round.", "The crews lacked the approved route information, so issuing and briefing the correct schedule directly fixes the operational communication failure.", ["WITHIN_OPERATIONAL_AUTHORITY", "DIRECT_REMEDY"]),
      follows("COA-SC-071-II", "The service should add a confirmation step requiring supervisors to verify that future approved route changes reach each affected crew before implementation.", "A confirmation step addresses the process gap that allowed an approved change to exist without reaching the people who had to carry it out.", ["WITHIN_OPERATIONAL_AUTHORITY", "TARGETED_PREVENTION"]),
    ], expectedAnswerClass: "BOTH",
  },
  {
    id: "COA-SC-072", qlId: "COA-QL-004", difficulty: "MEDIUM", domain: "PUBLIC_UTILITY",
    statement: "A utility help desk is giving customers different outage-restoration times because agents are reading estimates from separate spreadsheets that are not updated together.",
    actions: [
      rejects("COA-SC-072-I", "The utility should allow each agent to continue giving the estimate in their own spreadsheet as long as they tell customers that times may differ.", "Warning customers about inconsistency does not correct the multiple unsynchronised sources that are creating conflicting information.", "TOO_WEAK_TO_ADDRESS_PROBLEM", { proportionality: "INSUFFICIENT", expectedUtility: "LOW" }),
      rejects("COA-SC-072-II", "The utility should stop answering all outage-status enquiries until it develops an entirely new customer-service platform.", "The problem can be addressed by establishing one current source of restoration estimates. Stopping all status service until a new platform exists is excessive.", "EXCESSIVE_RESPONSE", { proportionality: "EXCESSIVE", expectedUtility: "HARMFUL" }),
    ], expectedAnswerClass: "NEITHER",
  },
]);
