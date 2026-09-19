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

export const COA_CP002_ENGLISH_EXPANSION: readonly CoaScenarioAuthority[] = Object.freeze([
  // ---------------------------------------------------------------------------
  // COA-QL-001 — direct remedial action
  // 12 additional semantic states, exactly balanced across all four answer classes.
  // ---------------------------------------------------------------------------
  {
    id: "COA-SC-025",
    qlId: "COA-QL-001",
    difficulty: "EASY",
    domain: "PUBLIC_UTILITY",
    statement: "Streetlights on one residential lane have stopped working after the local distribution box developed a fault, while lights on nearby lanes are functioning normally.",
    actions: [
      follows(
        "COA-SC-025-I",
        "The maintenance team should inspect and repair the faulty distribution box and check the affected streetlights before restoring the circuit.",
        "The fault has been narrowed to the local distribution box, so inspecting and repairing that equipment directly addresses the stated service failure.",
        ["DIRECT_REMEDY"],
      ),
      rejects(
        "COA-SC-025-II",
        "The municipal office should replace the name boards on the affected lane before taking up the streetlight complaint.",
        "Changing lane name boards does not repair the electrical fault that caused the streetlights to stop working.",
        "WRONG_TARGET",
        { relevance: "UNRELATED", expectedUtility: "LOW" },
      ),
    ],
    expectedAnswerClass: "ONLY_I",
  },
  {
    id: "COA-SC-026",
    qlId: "COA-QL-001",
    difficulty: "MEDIUM",
    domain: "BANKING",
    statement: "One ATM at a bank branch accepts cards but repeatedly fails to dispense cash because its cash-dispensing unit is jamming during transactions.",
    actions: [
      rejects(
        "COA-SC-026-I",
        "The branch should ask customers to change their ATM PINs before using the machine again.",
        "The failed cash dispensing is caused by a mechanical jam, so changing customer PINs does not address the known fault.",
        "WRONG_TARGET",
        { relevance: "INDIRECT", expectedUtility: "LOW" },
      ),
      follows(
        "COA-SC-026-II",
        "The branch should take the faulty ATM out of service, repair the dispensing unit and direct customers to another working machine meanwhile.",
        "Removing the faulty machine from use prevents repeated failed transactions, while repairing its dispensing unit directly addresses the problem.",
        ["DIRECT_REMEDY", "USEFUL_TEMPORARY_SAFEGUARD"],
      ),
    ],
    expectedAnswerClass: "ONLY_II",
  },
  {
    id: "COA-SC-027",
    qlId: "COA-QL-001",
    difficulty: "MEDIUM",
    domain: "DIGITAL_SERVICE",
    statement: "A government portal is accepting applications successfully, but confirmation emails are delayed for several hours because the outgoing notification queue is overloaded.",
    actions: [
      follows(
        "COA-SC-027-I",
        "The portal team should clear the overloaded notification queue and add temporary processing capacity until the backlog returns to normal.",
        "The application system itself is working; the known bottleneck is the notification queue, so clearing and scaling that queue directly addresses the delay.",
        ["DIRECT_REMEDY"],
      ),
      follows(
        "COA-SC-027-II",
        "The portal should show an on-screen acknowledgement number immediately after submission so applicants have proof while email confirmations are delayed.",
        "An immediate acknowledgement does not replace fixing the queue, but it is a useful temporary safeguard for applicants during the known notification delay.",
        ["USEFUL_TEMPORARY_SAFEGUARD", "PROPORTIONATE_RESPONSE"],
      ),
    ],
    expectedAnswerClass: "BOTH",
  },
  {
    id: "COA-SC-028",
    qlId: "COA-QL-001",
    difficulty: "MEDIUM",
    domain: "PUBLIC_ADMIN",
    statement: "The electronic token display in a public service hall has failed, but the counters and token-printing system are otherwise working normally.",
    actions: [
      rejects(
        "COA-SC-028-I",
        "The office should replace every computer used by all departments before resuming the token display.",
        "The problem is limited to the display, so replacing every departmental computer assumes a much wider fault that the statement does not establish.",
        "UNSUPPORTED_ASSUMPTION",
        { evidenceFit: "UNSUPPORTED", proportionality: "EXCESSIVE" },
      ),
      rejects(
        "COA-SC-028-II",
        "The office should add more chairs to the waiting hall and continue without any temporary method of calling token numbers.",
        "More chairs may make waiting easier, but they do not solve the failure to communicate which token should approach a counter.",
        "TOO_WEAK_TO_ADDRESS_PROBLEM",
        { expectedUtility: "LOW", proportionality: "INSUFFICIENT" },
      ),
    ],
    expectedAnswerClass: "NEITHER",
  },
  {
    id: "COA-SC-029",
    qlId: "COA-QL-001",
    difficulty: "EASY",
    domain: "HEALTH_SERVICE",
    statement: "Patients cannot reach a clinic's appointment desk because the published telephone line has stopped working, while the desk itself remains staffed.",
    actions: [
      follows(
        "COA-SC-029-I",
        "The clinic should repair the failed line and publish a temporary working contact number until the normal appointment line is restored.",
        "The appointment desk is available but unreachable, so restoring the line and giving a temporary contact directly fixes the access problem.",
        ["DIRECT_REMEDY", "USEFUL_TEMPORARY_SAFEGUARD"],
      ),
      rejects(
        "COA-SC-029-II",
        "The clinic should begin a general health-awareness campaign before dealing with the failed appointment line.",
        "A health-awareness campaign may be useful separately, but it does not restore access to the appointment desk.",
        "UNRELATED_GOOD_ACTION",
        { relevance: "INDIRECT", expectedUtility: "LOW" },
      ),
    ],
    expectedAnswerClass: "ONLY_I",
  },
  {
    id: "COA-SC-030",
    qlId: "COA-QL-001",
    difficulty: "MEDIUM",
    domain: "LOGISTICS",
    statement: "A warehouse is recording incorrect parcel destinations because one barcode scanner is intermittently reading labels incorrectly during dispatch.",
    actions: [
      rejects(
        "COA-SC-030-I",
        "The warehouse should send all delivery drivers for route-planning training before checking the scanner.",
        "Driver route planning is not the stated cause of the incorrect destination records, so this action targets the wrong stage of the process.",
        "WRONG_TARGET",
        { relevance: "INDIRECT", expectedUtility: "LOW" },
      ),
      follows(
        "COA-SC-030-II",
        "The warehouse should remove the faulty scanner from use, recalibrate or replace it and manually verify parcels processed during the fault period.",
        "The scanner is the identified source of the incorrect readings, and checking affected parcels also corrects errors already created by the fault.",
        ["DIRECT_REMEDY"],
      ),
    ],
    expectedAnswerClass: "ONLY_II",
  },
  {
    id: "COA-SC-031",
    qlId: "COA-QL-001",
    difficulty: "HARD",
    domain: "EDUCATION",
    statement: "A school's online fee system has charged a small group of parents twice after a payment-retry process submitted duplicate transactions.",
    actions: [
      follows(
        "COA-SC-031-I",
        "The school should identify the duplicate transactions, arrange reversal of the extra charges and reconcile the affected fee records.",
        "The double charge has already occurred, so reversing confirmed duplicates and correcting records directly remedies the financial and administrative error.",
        ["DIRECT_REMEDY"],
      ),
      follows(
        "COA-SC-031-II",
        "The school should temporarily disable the faulty retry path until it is corrected so that additional duplicate charges are not created.",
        "The retry process is the known source of the duplicates, so temporarily isolating that path is a proportionate safeguard while the defect is fixed.",
        ["USEFUL_TEMPORARY_SAFEGUARD", "PROPORTIONATE_RESPONSE"],
      ),
    ],
    expectedAnswerClass: "BOTH",
  },
  {
    id: "COA-SC-032",
    qlId: "COA-QL-001",
    difficulty: "MEDIUM",
    domain: "CONSUMER_SERVICE",
    statement: "Customers repeatedly receive parcels with crushed corners because a damaged guide rail is forcing packages against the side of one conveyor.",
    actions: [
      rejects(
        "COA-SC-032-I",
        "The company should send an apology message after every damaged delivery without changing the conveyor process.",
        "An apology responds to complaints but leaves the damaged guide rail in place, so the same parcel damage is likely to continue.",
        "TOO_WEAK_TO_ADDRESS_PROBLEM",
        { expectedUtility: "LOW", proportionality: "INSUFFICIENT" },
      ),
      rejects(
        "COA-SC-032-II",
        "The company should move parcel complaints to a different customer-service team before repairing the guide rail.",
        "Changing which team receives complaints does not correct the physical conveyor defect causing the parcel damage.",
        "WRONG_TARGET",
        { relevance: "INDIRECT", expectedUtility: "LOW" },
      ),
    ],
    expectedAnswerClass: "NEITHER",
  },
  {
    id: "COA-SC-033",
    qlId: "COA-QL-001",
    difficulty: "MEDIUM",
    domain: "TRANSPORT",
    statement: "A ticket machine at a bus terminal is deducting fares from cards but sometimes fails to print tickets because its paper-feed mechanism is slipping.",
    actions: [
      follows(
        "COA-SC-033-I",
        "The terminal should suspend use of the faulty machine, repair the paper-feed mechanism and provide replacement proof for affected transactions where necessary.",
        "The paper-feed fault is known, so removing the machine from service and repairing it directly addresses both further failures and affected transactions.",
        ["DIRECT_REMEDY", "USEFUL_TEMPORARY_SAFEGUARD"],
      ),
      rejects(
        "COA-SC-033-II",
        "The transport operator should redesign the terminal's entire bus timetable before repairing the ticket machine.",
        "The timetable is not linked to the paper-feed fault and changing it would not restore reliable ticket printing.",
        "WRONG_TARGET",
        { relevance: "UNRELATED", expectedUtility: "LOW" },
      ),
    ],
    expectedAnswerClass: "ONLY_I",
  },
  {
    id: "COA-SC-034",
    qlId: "COA-QL-001",
    difficulty: "MEDIUM",
    domain: "WORKPLACE",
    statement: "Employees are unable to enter through one office entrance because its access-card reader has failed, while another controlled entrance is operating normally.",
    actions: [
      rejects(
        "COA-SC-034-I",
        "The office should require every employee to submit a fresh identity-document application before checking the failed reader.",
        "There is no evidence that employee identities or cards are invalid; the known problem is the reader at one entrance.",
        "UNSUPPORTED_ASSUMPTION",
        { evidenceFit: "UNSUPPORTED", expectedUtility: "LOW" },
      ),
      follows(
        "COA-SC-034-II",
        "The office should direct staff through the working controlled entrance and repair or replace the failed card reader.",
        "The alternate entrance keeps access available while repairing the failed reader directly resolves the stated equipment problem.",
        ["DIRECT_REMEDY", "USEFUL_TEMPORARY_SAFEGUARD"],
      ),
    ],
    expectedAnswerClass: "ONLY_II",
  },
  {
    id: "COA-SC-035",
    qlId: "COA-QL-001",
    difficulty: "HARD",
    domain: "CIVIC_SERVICE",
    statement: "A neighbourhood's scheduled waste collection has been missed for two days because the vehicle assigned to that route has broken down unexpectedly.",
    actions: [
      follows(
        "COA-SC-035-I",
        "The civic service should arrange repair of the broken vehicle and confirm when it can safely return to the route.",
        "The broken vehicle is the stated cause of the missed collection, so repairing it is a direct remedy for the service disruption.",
        ["DIRECT_REMEDY"],
      ),
      follows(
        "COA-SC-035-II",
        "The service should temporarily redistribute the missed stops to available nearby collection routes where capacity permits.",
        "Temporary route redistribution can clear the immediate backlog while the assigned vehicle is being repaired, without replacing the permanent remedy.",
        ["USEFUL_TEMPORARY_SAFEGUARD", "PROPORTIONATE_RESPONSE"],
      ),
    ],
    expectedAnswerClass: "BOTH",
  },
  {
    id: "COA-SC-036",
    qlId: "COA-QL-001",
    difficulty: "MEDIUM",
    domain: "EXAM_ADMIN",
    statement: "Some downloaded admit cards contain unreadable venue text because a formatting defect in the current PDF template is corrupting that field.",
    actions: [
      rejects(
        "COA-SC-036-I",
        "The examination body should tell candidates to keep downloading the same defective file until a readable copy appears.",
        "Repeatedly downloading the same defective template does not correct the formatting fault and gives candidates no reliable remedy.",
        "TOO_WEAK_TO_ADDRESS_PROBLEM",
        { expectedUtility: "LOW", proportionality: "INSUFFICIENT" },
      ),
      rejects(
        "COA-SC-036-II",
        "The examination body should postpone every examination nationwide before attempting to correct the admit-card template.",
        "The problem is a specific document-formatting defect, so postponing all examinations before attempting a direct correction is excessive.",
        "EXCESSIVE_RESPONSE",
        { proportionality: "EXCESSIVE", expectedUtility: "HARMFUL" },
      ),
    ],
    expectedAnswerClass: "NEITHER",
  },

  // ---------------------------------------------------------------------------
  // COA-QL-002 — preventive / risk-reduction action
  // 12 additional semantic states, exactly balanced across all four answer classes.
  // ---------------------------------------------------------------------------
  {
    id: "COA-SC-037",
    qlId: "COA-QL-002",
    difficulty: "MEDIUM",
    domain: "WORKPLACE",
    statement: "A warehouse has recorded several near misses while forklifts reverse because warning beepers on some vehicles have become weak or intermittent.",
    actions: [
      follows(
        "COA-SC-037-I",
        "The warehouse should inspect reversing alarms on a fixed schedule and repair or replace any unit that does not meet the required warning level.",
        "The repeated risk is linked to unreliable warning beepers, so scheduled checks and repair directly reduce the chance of the same failure recurring.",
        ["TARGETED_PREVENTION"],
      ),
      rejects(
        "COA-SC-037-II",
        "The warehouse should issue a general notice asking everyone to be more careful without checking the faulty warning systems.",
        "A general warning does not remove the equipment defect that is creating the repeated reversing risk.",
        "TOO_WEAK_TO_ADDRESS_PROBLEM",
        { expectedUtility: "LOW", proportionality: "INSUFFICIENT" },
      ),
    ],
    expectedAnswerClass: "ONLY_I",
  },
  {
    id: "COA-SC-038",
    qlId: "COA-QL-002",
    difficulty: "MEDIUM",
    domain: "PUBLIC_UTILITY",
    statement: "A roadside drain repeatedly overflows after rain because plastic waste collects at the same inlet grates and blocks the water flow.",
    actions: [
      rejects(
        "COA-SC-038-I",
        "The local body should widen the adjoining road before introducing any measure at the repeatedly blocked drain inlets.",
        "Road width is not the stated cause of the overflow, so widening the road does not prevent the recurring blockage at the inlet grates.",
        "WRONG_TARGET",
        { relevance: "INDIRECT", expectedUtility: "LOW" },
      ),
      follows(
        "COA-SC-038-II",
        "The local body should schedule cleaning of the affected grates before heavy rain and use suitable screens where they can reduce repeated plastic blockage.",
        "The overflow repeatedly starts at the same blocked inlets, so targeted cleaning and suitable screening directly reduce that recurring risk.",
        ["TARGETED_PREVENTION"],
      ),
    ],
    expectedAnswerClass: "ONLY_II",
  },
  {
    id: "COA-SC-039",
    qlId: "COA-QL-002",
    difficulty: "HARD",
    domain: "BANKING",
    statement: "Several employees have recently entered credentials into convincing fake login pages after receiving phishing emails that resemble internal bank messages.",
    actions: [
      follows(
        "COA-SC-039-I",
        "The bank should run short phishing-recognition exercises and teach staff how to verify unusual login requests before entering credentials.",
        "The incidents depend partly on employees accepting deceptive login requests, so targeted practice can reduce that specific human risk.",
        ["TARGETED_PREVENTION"],
      ),
      follows(
        "COA-SC-039-II",
        "The bank should strengthen email filtering and warning controls for messages that imitate internal login requests.",
        "Filtering and warning controls address the same phishing route at the technical level, so they can reasonably complement staff training.",
        ["TARGETED_PREVENTION"],
      ),
    ],
    expectedAnswerClass: "BOTH",
  },
  {
    id: "COA-SC-040",
    qlId: "COA-QL-002",
    difficulty: "MEDIUM",
    domain: "DIGITAL_SERVICE",
    statement: "An online service has suffered repeated outages because a required security certificate expired before the operations team noticed its renewal date.",
    actions: [
      rejects(
        "COA-SC-040-I",
        "The provider should require all users to change their passwords every week so that future certificate expiries do not interrupt access.",
        "User passwords are not the cause of the certificate-expiry outages, so frequent password changes would not prevent the same failure.",
        "WRONG_TARGET",
        { relevance: "INDIRECT", expectedUtility: "LOW" },
      ),
      rejects(
        "COA-SC-040-II",
        "The provider should increase help-desk staffing only after each future outage instead of introducing any certificate-renewal control.",
        "More support staff may handle complaints after an outage, but it does not prevent certificates from expiring again.",
        "SHORT_TERM_ONLY_WHEN_ROOT_CAUSE_RESPONSE_REQUIRED",
        { expectedUtility: "LOW", urgencyFit: "FOLLOW_UP" },
      ),
    ],
    expectedAnswerClass: "NEITHER",
  },
  {
    id: "COA-SC-041",
    qlId: "COA-QL-002",
    difficulty: "EASY",
    domain: "TRANSPORT",
    statement: "A bus operator has recorded repeated tyre failures on vehicles whose routine tyre-pressure and tread inspections were missed before service.",
    actions: [
      follows(
        "COA-SC-041-I",
        "The operator should enforce pre-service tyre checks and remove tyres from service when tread or pressure falls outside the required range.",
        "The repeated failures are linked to missed tyre inspections, so consistent checks and timely replacement directly reduce the identified risk.",
        ["TARGETED_PREVENTION"],
      ),
      rejects(
        "COA-SC-041-II",
        "The operator should replace route information boards at bus stops before changing the vehicle-inspection process.",
        "Route information boards are unrelated to tyre condition and cannot prevent failures caused by missed inspections.",
        "UNRELATED_GOOD_ACTION",
        { relevance: "UNRELATED", expectedUtility: "LOW" },
      ),
    ],
    expectedAnswerClass: "ONLY_I",
  },
  {
    id: "COA-SC-042",
    qlId: "COA-QL-002",
    difficulty: "MEDIUM",
    domain: "HEALTH_SERVICE",
    statement: "A diagnostic centre has had several sample-identification errors because containers with similar patient names are being labelled manually at a busy collection desk.",
    actions: [
      rejects(
        "COA-SC-042-I",
        "The centre should recruit additional specialist doctors before changing the sample-identification process.",
        "The stated errors occur during sample labelling, so adding doctors does not address the identification step where the risk arises.",
        "WRONG_TARGET",
        { relevance: "INDIRECT", expectedUtility: "LOW" },
      ),
      follows(
        "COA-SC-042-II",
        "The centre should use two patient identifiers and a scan or second check before each sample leaves the collection desk.",
        "A second identifier and verification step directly reduce the risk of confusing samples with similar patient names.",
        ["TARGETED_PREVENTION"],
      ),
    ],
    expectedAnswerClass: "ONLY_II",
  },
  {
    id: "COA-SC-043",
    qlId: "COA-QL-002",
    difficulty: "HARD",
    domain: "EDUCATION",
    statement: "A school laboratory has had repeated minor chemical-handling incidents because some storage containers are poorly labelled and students begin work without a pre-use check.",
    actions: [
      follows(
        "COA-SC-043-I",
        "The school should standardise clear container labels and remove any container from use when its identity or warning label is unclear.",
        "Poor labelling is one identified source of the incidents, so standardising labels and isolating unclear containers directly reduces that risk.",
        ["TARGETED_PREVENTION"],
      ),
      follows(
        "COA-SC-043-II",
        "The school should require a brief pre-use safety check so students confirm the correct material and instructions before starting laboratory work.",
        "Students are also beginning work without checking materials, so a short pre-use verification addresses the second stated failure mechanism.",
        ["TARGETED_PREVENTION"],
      ),
    ],
    expectedAnswerClass: "BOTH",
  },
  {
    id: "COA-SC-044",
    qlId: "COA-QL-002",
    difficulty: "MEDIUM",
    domain: "CONSUMER_SERVICE",
    statement: "A delivery company repeatedly sends some parcels to the wrong address because staff manually retype address details from customer orders into a second system.",
    actions: [
      rejects(
        "COA-SC-044-I",
        "The company should provide a discount voucher after each wrongly delivered parcel without changing the address-entry process.",
        "Compensation may respond to an individual complaint, but it does not prevent new errors caused by manual retyping.",
        "SHORT_TERM_ONLY_WHEN_ROOT_CAUSE_RESPONSE_REQUIRED",
        { expectedUtility: "LOW", proportionality: "INSUFFICIENT" },
      ),
      rejects(
        "COA-SC-044-II",
        "The company should increase lighting in the warehouse before reviewing how address details are transferred between systems.",
        "The stated error arises from retyping address data, and the statement gives no reason to treat warehouse lighting as the cause.",
        "UNSUPPORTED_ASSUMPTION",
        { evidenceFit: "UNSUPPORTED", expectedUtility: "LOW" },
      ),
    ],
    expectedAnswerClass: "NEITHER",
  },
  {
    id: "COA-SC-045",
    qlId: "COA-QL-002",
    difficulty: "MEDIUM",
    domain: "CIVIC_SERVICE",
    statement: "The same public park becomes waterlogged during heavy rain because leaves and silt repeatedly block its surface drains before the monsoon period.",
    actions: [
      follows(
        "COA-SC-045-I",
        "The park authority should inspect and clear the drains before the monsoon and repeat cleaning when heavy leaf or silt build-up is found.",
        "The recurring waterlogging is linked to blocked drains, so planned cleaning before the high-risk period directly reduces the known cause.",
        ["TARGETED_PREVENTION"],
      ),
      rejects(
        "COA-SC-045-II",
        "The authority should close the entire park throughout every rainy season instead of maintaining the drains.",
        "A full seasonal closure avoids use rather than addressing the preventable drainage blockage and is disproportionate to the stated problem.",
        "EXCESSIVE_RESPONSE",
        { proportionality: "EXCESSIVE", expectedUtility: "LOW" },
      ),
    ],
    expectedAnswerClass: "ONLY_I",
  },
  {
    id: "COA-SC-046",
    qlId: "COA-QL-002",
    difficulty: "MEDIUM",
    domain: "EXAM_ADMIN",
    statement: "Candidates have repeatedly reached the wrong entrance because late venue changes are updated in an internal system but not reflected promptly in candidate notices.",
    actions: [
      rejects(
        "COA-SC-046-I",
        "The examination body should place larger signs only at the old entrance after each venue change.",
        "Improving signs at the old entrance reacts after candidates arrive there and does not prevent outdated venue information from reaching them.",
        "SHORT_TERM_ONLY_WHEN_ROOT_CAUSE_RESPONSE_REQUIRED",
        { expectedUtility: "LOW", proportionality: "INSUFFICIENT" },
      ),
      follows(
        "COA-SC-046-II",
        "The examination body should link venue changes to automatic notice updates and send candidates a fresh alert whenever a verified change is made.",
        "The recurring problem comes from a gap between internal updates and candidate notices, so synchronising those updates directly prevents the same error.",
        ["TARGETED_PREVENTION"],
      ),
    ],
    expectedAnswerClass: "ONLY_II",
  },
  {
    id: "COA-SC-047",
    qlId: "COA-QL-002",
    difficulty: "HARD",
    domain: "LOGISTICS",
    statement: "Temperature-sensitive goods have repeatedly warmed beyond the allowed range while waiting for loading because vehicles arrive irregularly and the transfer area is not temperature controlled.",
    actions: [
      follows(
        "COA-SC-047-I",
        "The depot should use scheduled loading slots so temperature-sensitive consignments are moved to the transfer area close to confirmed vehicle arrival times.",
        "Reducing uncontrolled waiting time addresses one identified part of the repeated temperature excursion risk.",
        ["TARGETED_PREVENTION"],
      ),
      follows(
        "COA-SC-047-II",
        "The depot should provide suitable temperature-controlled temporary holding for consignments that must wait before loading.",
        "Controlled temporary holding addresses the second stated risk: goods warming while they wait in an uncontrolled transfer area.",
        ["TARGETED_PREVENTION"],
      ),
    ],
    expectedAnswerClass: "BOTH",
  },
  {
    id: "COA-SC-048",
    qlId: "COA-QL-002",
    difficulty: "MEDIUM",
    domain: "PUBLIC_ADMIN",
    statement: "A public office repeatedly rejects applications because outdated versions of the same form remain available at several counters and on old download links.",
    actions: [
      rejects(
        "COA-SC-048-I",
        "The office should increase the penalty for submitting an outdated form before removing the obsolete versions from circulation.",
        "Applicants are still being given access to obsolete forms, so increasing penalties does not prevent the administrative source of the repeated error.",
        "WRONG_TARGET",
        { relevance: "INDIRECT", expectedUtility: "LOW" },
      ),
      rejects(
        "COA-SC-048-II",
        "The office should station more staff at counters to explain rejections while continuing to distribute the outdated forms.",
        "Extra explanation reacts after applications fail but leaves the obsolete forms in circulation, so the same avoidable rejection will continue.",
        "SHORT_TERM_ONLY_WHEN_ROOT_CAUSE_RESPONSE_REQUIRED",
        { expectedUtility: "LOW", proportionality: "INSUFFICIENT" },
      ),
    ],
    expectedAnswerClass: "NEITHER",
  },
]);
