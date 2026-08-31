import type { ArgArgumentAuthority, ArgScenarioAuthority, ArgStance, ArgWeaknessDefect } from "./types.ts";

type AuthorityOverrides = Partial<Omit<ArgArgumentAuthority, "id" | "stance" | "text" | "expectedStrength" | "weaknessDefects">>;

function strong(id: string, stance: ArgStance, text: string, overrides: AuthorityOverrides = {}): ArgArgumentAuthority {
  return Object.freeze({
    id, stance, text, expectedStrength: "STRONG" as const,
    relevance: "DIRECT" as const, materiality: "MAJOR" as const,
    support: "PLAUSIBLE" as const, feasibility: "REALISTIC" as const,
    scope: "CALIBRATED" as const, stakeholderLegitimacy: "LEGITIMATE" as const,
    issueMatch: "EXACT" as const, weaknessDefects: Object.freeze([]), ...overrides,
  });
}

function weak(id: string, stance: ArgStance, text: string, defect: ArgWeaknessDefect, overrides: AuthorityOverrides = {}): ArgArgumentAuthority {
  return Object.freeze({
    id, stance, text, expectedStrength: "WEAK" as const,
    relevance: "DIRECT" as const, materiality: "MAJOR" as const,
    support: "PLAUSIBLE" as const, feasibility: "REALISTIC" as const,
    scope: "CALIBRATED" as const, stakeholderLegitimacy: "LEGITIMATE" as const,
    issueMatch: "EXACT" as const, weaknessDefects: Object.freeze([defect]), ...overrides,
  });
}

export const ARG_CP002_ENGLISH_EXPANSION: readonly ArgScenarioAuthority[] = Object.freeze([
  // ARG-QL-001 — direct relevance / materiality
  {
    id: "ARG-SC-025", qlId: "ARG-QL-001", difficulty: "MEDIUM", domain: "CONSUMER",
    statement: "Should packaged food labels display allergen information in a clearly visible section?",
    arguments: [
      strong("ARG-SC-025-I", "SUPPORTS", "Yes. People with food allergies need prominent ingredient warnings to avoid products that may cause them serious harm."),
      weak("ARG-SC-025-II", "OPPOSES", "No. A larger allergen box may leave slightly less space for decorative graphics on the package.", "TRIVIAL_CONSIDERATION", { materiality: "TRIVIAL" }),
    ], expectedAnswerClass: "ONLY_I",
  },
  {
    id: "ARG-SC-026", qlId: "ARG-QL-001", difficulty: "MEDIUM", domain: "RECRUITMENT",
    statement: "Should recruitment boards provide a correction window for limited application-form errors before the final submission lock?",
    arguments: [
      weak("ARG-SC-026-I", "OPPOSES", "No. Some candidates simply prefer forms that cannot be changed after the first submission.", "TRIVIAL_CONSIDERATION", { materiality: "MINOR" }),
      strong("ARG-SC-026-II", "SUPPORTS", "Yes. A limited correction window can prevent otherwise eligible applicants from being excluded for fixable data-entry mistakes while preserving a final deadline."),
    ], expectedAnswerClass: "ONLY_II",
  },
  {
    id: "ARG-SC-027", qlId: "ARG-QL-001", difficulty: "HARD", domain: "PUBLIC_ADMIN",
    statement: "Should municipal grievance portals display an expected response time for each complaint category?",
    arguments: [
      strong("ARG-SC-027-I", "SUPPORTS", "Yes. Stated response windows give citizens a realistic service expectation and make prolonged delays easier to identify."),
      strong("ARG-SC-027-II", "OPPOSES", "No. If one fixed time is shown for complaints with very different complexity, the portal may create expectations that the service cannot reasonably meet."),
    ], expectedAnswerClass: "BOTH",
  },
  {
    id: "ARG-SC-028", qlId: "ARG-QL-001", difficulty: "MEDIUM", domain: "WORKPLACE",
    statement: "Should every office meeting room be named after a fruit?",
    arguments: [
      weak("ARG-SC-028-I", "SUPPORTS", "Yes. Fruit names are pleasant, so meetings held in such rooms will produce better decisions.", "UNSUPPORTED_CAUSAL_LEAP", { support: "ASSERTED" }),
      weak("ARG-SC-028-II", "OPPOSES", "No. Some employees prefer city names for meeting rooms.", "TRIVIAL_CONSIDERATION", { materiality: "TRIVIAL" }),
    ], expectedAnswerClass: "NEITHER",
  },

  // ARG-QL-002 — evidence / mechanism / causal support
  {
    id: "ARG-SC-029", qlId: "ARG-QL-002", difficulty: "HARD", domain: "BANKING",
    statement: "Should banks send an immediate alert when a customer's registered mobile number is changed?",
    arguments: [
      strong("ARG-SC-029-I", "SUPPORTS", "Yes. A prompt alert through an existing verified channel can help a customer notice an unauthorised profile change before it is used for further account takeover."),
      weak("ARG-SC-029-II", "OPPOSES", "No. Fraud has occurred in years when banks sent alerts, so alerts cannot reduce fraud risk.", "CORRELATION_AS_CAUSATION", { support: "FALLACIOUS" }),
    ], expectedAnswerClass: "ONLY_I",
  },
  {
    id: "ARG-SC-030", qlId: "ARG-QL-002", difficulty: "MEDIUM", domain: "TRANSPORT",
    statement: "Should buses announce the next major stop audibly inside the vehicle?",
    arguments: [
      weak("ARG-SC-030-I", "SUPPORTS", "Yes. Once stop announcements are introduced, no passenger will ever miss a stop for any reason.", "OVERGENERALIZATION", { support: "ASSERTED", scope: "ABSOLUTE_UNJUSTIFIED" }),
      strong("ARG-SC-030-II", "SUPPORTS", "Yes. Audible announcements can help passengers who cannot easily see route displays or are unfamiliar with the route identify where to get off."),
    ], expectedAnswerClass: "ONLY_II",
  },
  {
    id: "ARG-SC-031", qlId: "ARG-QL-002", difficulty: "HARD", domain: "EDUCATION",
    statement: "Should schools provide students with periodic low-stakes practice tests before a major examination?",
    arguments: [
      strong("ARG-SC-031-I", "SUPPORTS", "Yes. Practice under exam-like conditions can reveal weak areas early and give students repeated retrieval practice before the high-stakes test."),
      strong("ARG-SC-031-II", "OPPOSES", "No. If practice tests are too frequent or treated as high pressure, they can consume teaching time and encourage narrow test preparation instead of broader learning."),
    ], expectedAnswerClass: "BOTH",
  },
  {
    id: "ARG-SC-032", qlId: "ARG-QL-002", difficulty: "HARD", domain: "TECHNOLOGY",
    statement: "Should every employee be required to change every password once a week?",
    arguments: [
      weak("ARG-SC-032-I", "SUPPORTS", "Yes. A weekly change guarantees that stolen passwords can never be misused.", "BARE_ASSERTION", { support: "ASSERTED", scope: "ABSOLUTE_UNJUSTIFIED" }),
      weak("ARG-SC-032-II", "OPPOSES", "No. Frequent password changes necessarily cause every employee to write passwords on paper and leave them visible.", "UNSUPPORTED_CAUSAL_LEAP", { support: "ASSERTED", scope: "ABSOLUTE_UNJUSTIFIED" }),
    ], expectedAnswerClass: "NEITHER",
  },

  // ARG-QL-003 — feasibility / implementation
  {
    id: "ARG-SC-033", qlId: "ARG-QL-003", difficulty: "MEDIUM", domain: "PUBLIC_ADMIN",
    statement: "Should district hospitals use token displays for non-emergency outpatient queues?",
    arguments: [
      strong("ARG-SC-033-I", "SUPPORTS", "Yes. A token system can organise turn-taking and reduce the need for patients to remain crowded around a service counter while waiting."),
      weak("ARG-SC-033-II", "OPPOSES", "No. Installing a token display would require rebuilding the entire hospital from the ground up.", "IMPRACTICAL_PREMISE", { support: "FALLACIOUS" }),
    ], expectedAnswerClass: "ONLY_I",
  },
  {
    id: "ARG-SC-034", qlId: "ARG-QL-003", difficulty: "HARD", domain: "ENVIRONMENT",
    statement: "Should a municipality require large apartment complexes to separate dry and wet waste before collection from next week?",
    arguments: [
      weak("ARG-SC-034-I", "SUPPORTS", "Yes. No preparation, bins, collection changes or resident communication would be needed before the rule starts.", "IMPRACTICAL_PREMISE", { feasibility: "IMPRACTICAL", support: "FALLACIOUS" }),
      strong("ARG-SC-034-II", "OPPOSES", "No. Starting immediately without separate collection capacity can cause segregated waste to be mixed again, undermining compliance and public trust."),
    ], expectedAnswerClass: "ONLY_II",
  },
  {
    id: "ARG-SC-035", qlId: "ARG-QL-003", difficulty: "HARD", domain: "RECRUITMENT",
    statement: "Should examination centres use biometric attendance for high-stakes recruitment tests?",
    arguments: [
      strong("ARG-SC-035-I", "SUPPORTS", "Yes. Where reliable equipment and procedures are available, biometric matching can add an identity-verification layer against impersonation."),
      strong("ARG-SC-035-II", "OPPOSES", "No. Hardware failure or poor connectivity can delay entry for genuine candidates, so fallback verification and capacity planning are necessary before relying on it."),
    ], expectedAnswerClass: "BOTH",
  },
  {
    id: "ARG-SC-036", qlId: "ARG-QL-003", difficulty: "MEDIUM", domain: "BANKING",
    statement: "Should every bank branch replace all human customer-service desks with self-service kiosks in one day?",
    arguments: [
      weak("ARG-SC-036-I", "SUPPORTS", "Yes. Kiosks can handle every banking problem without maintenance, exceptions or staff assistance.", "IMPRACTICAL_PREMISE", { feasibility: "IMPRACTICAL", support: "FALLACIOUS", scope: "ABSOLUTE_UNJUSTIFIED" }),
      weak("ARG-SC-036-II", "OPPOSES", "No. A branch with kiosks can never provide any useful service to any customer.", "ABSOLUTE_CLAIM", { support: "ASSERTED", scope: "ABSOLUTE_UNJUSTIFIED" }),
    ], expectedAnswerClass: "NEITHER",
  },

  // ARG-QL-004 — scope / proportionality
  {
    id: "ARG-SC-037", qlId: "ARG-QL-004", difficulty: "MEDIUM", domain: "TRANSPORT",
    statement: "Should heavy vehicles be restricted from a narrow market street during the busiest two evening hours?",
    arguments: [
      strong("ARG-SC-037-I", "SUPPORTS", "Yes. A time-limited restriction can reduce conflict between large vehicles and dense pedestrian traffic during the period of greatest congestion."),
      weak("ARG-SC-037-II", "OPPOSES", "No. Any two-hour restriction on heavy vehicles will permanently destroy all trade in the market.", "OVERGENERALIZATION", { support: "ASSERTED", scope: "ABSOLUTE_UNJUSTIFIED" }),
    ], expectedAnswerClass: "ONLY_I",
  },
  {
    id: "ARG-SC-038", qlId: "ARG-QL-004", difficulty: "MEDIUM", domain: "CONSUMER",
    statement: "Should online services be required to show a reminder before a free trial converts into a paid subscription?",
    arguments: [
      weak("ARG-SC-038-I", "OPPOSES", "No. A reminder means no customer will ever willingly continue a paid subscription.", "ABSOLUTE_CLAIM", { support: "ASSERTED", scope: "ABSOLUTE_UNJUSTIFIED" }),
      strong("ARG-SC-038-II", "SUPPORTS", "Yes. A timely reminder can help users make an informed choice before a previously free service begins charging them."),
    ], expectedAnswerClass: "ONLY_II",
  },
  {
    id: "ARG-SC-039", qlId: "ARG-QL-004", difficulty: "HARD", domain: "WORKPLACE",
    statement: "Should offices allow remote work on selected days for roles that can be performed securely off-site?",
    arguments: [
      strong("ARG-SC-039-I", "SUPPORTS", "Yes. A limited role-based policy can reduce commuting burden without assuming that every task can be done remotely."),
      strong("ARG-SC-039-II", "OPPOSES", "No. Teams that rely on physical equipment or frequent face-to-face coordination may need narrower eligibility than desk-based roles."),
    ], expectedAnswerClass: "BOTH",
  },
  {
    id: "ARG-SC-040", qlId: "ARG-QL-004", difficulty: "HARD", domain: "EDUCATION",
    statement: "Should a school ban every mobile phone from its premises under all circumstances?",
    arguments: [
      weak("ARG-SC-040-I", "SUPPORTS", "Yes. Every use of a mobile phone by every student necessarily harms learning.", "OVERGENERALIZATION", { support: "ASSERTED", scope: "ABSOLUTE_UNJUSTIFIED" }),
      weak("ARG-SC-040-II", "OPPOSES", "No. Because phones can be useful in one emergency, schools should never regulate their use at all.", "FALSE_DILEMMA", { support: "FALLACIOUS", scope: "OVERBROAD" }),
    ], expectedAnswerClass: "NEITHER",
  },

  // ARG-QL-005 — stakeholder / fairness / rights
  {
    id: "ARG-SC-041", qlId: "ARG-QL-005", difficulty: "HARD", domain: "RECRUITMENT",
    statement: "Should recruitment boards publish a candidate's individual marks after the final result?",
    arguments: [
      strong("ARG-SC-041-I", "SUPPORTS", "Yes. Giving each candidate their own score improves transparency and lets them understand how they performed without revealing another candidate's private data."),
      weak("ARG-SC-041-II", "OPPOSES", "No. Candidates who ask for their own marks are usually people who cannot accept failure.", "PREJUDICIAL_STEREOTYPE", { stakeholderLegitimacy: "PREJUDICIAL", support: "FALLACIOUS" }),
    ], expectedAnswerClass: "ONLY_I",
  },
  {
    id: "ARG-SC-042", qlId: "ARG-QL-005", difficulty: "MEDIUM", domain: "PUBLIC_ADMIN",
    statement: "Should a public-service office provide a priority queue for citizens with severe mobility limitations?",
    arguments: [
      weak("ARG-SC-042-I", "OPPOSES", "No. Everyone who asks for assistance is simply trying to avoid waiting.", "PREJUDICIAL_STEREOTYPE", { stakeholderLegitimacy: "PREJUDICIAL", support: "FALLACIOUS" }),
      strong("ARG-SC-042-II", "SUPPORTS", "Yes. A limited priority arrangement can reduce a disproportionate physical burden on people for whom prolonged standing or movement is especially difficult."),
    ], expectedAnswerClass: "ONLY_II",
  },
  {
    id: "ARG-SC-043", qlId: "ARG-QL-005", difficulty: "HARD", domain: "TECHNOLOGY",
    statement: "Should schools use facial-recognition cameras to record student attendance automatically?",
    arguments: [
      strong("ARG-SC-043-I", "SUPPORTS", "Yes. If accuracy and governance are adequate, automated attendance can reduce routine manual recording and make proxy attendance harder."),
      strong("ARG-SC-043-II", "OPPOSES", "No. The system would collect biometric data from students, so necessity, retention, security and less intrusive alternatives require serious consideration."),
    ], expectedAnswerClass: "BOTH",
  },
  {
    id: "ARG-SC-044", qlId: "ARG-QL-005", difficulty: "MEDIUM", domain: "WORKPLACE",
    statement: "Should an office give the largest parking spaces only to employees born in January?",
    arguments: [
      weak("ARG-SC-044-I", "SUPPORTS", "Yes. People born in January are naturally better drivers and deserve more space.", "PREJUDICIAL_STEREOTYPE", { stakeholderLegitimacy: "PREJUDICIAL", support: "FALLACIOUS" }),
      weak("ARG-SC-044-II", "OPPOSES", "No. January is usually written near the beginning of a calendar.", "IRRELEVANT_TANGENT", { relevance: "IRRELEVANT", materiality: "TRIVIAL", issueMatch: "DIFFERENT_ISSUE" }),
    ], expectedAnswerClass: "NEITHER",
  },

  // ARG-QL-006 — alternatives / counterarguments / second-order effects
  {
    id: "ARG-SC-045", qlId: "ARG-QL-006", difficulty: "HARD", domain: "TRANSPORT",
    statement: "Should a city ban private cars from one congested central corridor during weekday peak hours?",
    arguments: [
      strong("ARG-SC-045-I", "SUPPORTS", "Yes. Where frequent public transport and alternate routes exist, a peak-hour restriction can reduce the number of cars competing for limited road space on that corridor."),
      weak("ARG-SC-045-II", "OPPOSES", "No. Restricting cars on one corridor will inevitably cause permanent gridlock on every other road in the city.", "SPECULATIVE_SLIPPERY_SLOPE", { support: "FALLACIOUS", scope: "ABSOLUTE_UNJUSTIFIED" }),
    ], expectedAnswerClass: "ONLY_I",
  },
  {
    id: "ARG-SC-046", qlId: "ARG-QL-006", difficulty: "HARD", domain: "CONSUMER",
    statement: "Should a platform permanently ban a seller after the first unverified complaint from a buyer?",
    arguments: [
      weak("ARG-SC-046-I", "SUPPORTS", "Yes. A complaint can only be made when the seller is certainly guilty.", "FALSE_DILEMMA", { support: "FALLACIOUS", scope: "ABSOLUTE_UNJUSTIFIED" }),
      strong("ARG-SC-046-II", "OPPOSES", "No. Temporary safeguards and investigation can protect buyers while avoiding irreversible punishment before the complaint is verified."),
    ], expectedAnswerClass: "ONLY_II",
  },
  {
    id: "ARG-SC-047", qlId: "ARG-QL-006", difficulty: "HARD", domain: "ENVIRONMENT",
    statement: "Should a city charge a fee for single-use shopping bags at large retail stores?",
    arguments: [
      strong("ARG-SC-047-I", "SUPPORTS", "Yes. A visible per-bag charge gives shoppers a direct incentive to reuse bags rather than automatically taking a new one each time."),
      strong("ARG-SC-047-II", "OPPOSES", "No. If durable alternatives are expensive or unavailable, the policy can burden low-income shoppers without reducing bag use much, so access to alternatives matters."),
    ], expectedAnswerClass: "BOTH",
  },
  {
    id: "ARG-SC-048", qlId: "ARG-QL-006", difficulty: "HARD", domain: "BANKING",
    statement: "Should a bank close every account that receives one transaction flagged by an automated fraud model?",
    arguments: [
      weak("ARG-SC-048-I", "SUPPORTS", "Yes. An automated flag is always proof that the account holder committed fraud.", "BARE_ASSERTION", { support: "FALLACIOUS", scope: "ABSOLUTE_UNJUSTIFIED" }),
      weak("ARG-SC-048-II", "OPPOSES", "No. Because automated models can make mistakes, banks should never investigate any flagged transaction.", "FALSE_DILEMMA", { support: "FALLACIOUS", scope: "OVERBROAD" }),
    ], expectedAnswerClass: "NEITHER",
  },
]);
