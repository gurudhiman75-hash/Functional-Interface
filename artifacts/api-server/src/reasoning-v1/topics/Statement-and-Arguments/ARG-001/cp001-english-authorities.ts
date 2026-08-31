import type {
  ArgArgumentAuthority,
  ArgScenarioAuthority,
  ArgStance,
  ArgWeaknessDefect,
} from "./types.ts";

type AuthorityOverrides = Partial<Omit<
  ArgArgumentAuthority,
  "id" | "stance" | "text" | "expectedStrength" | "weaknessDefects"
>>;

function strong(
  id: string,
  stance: ArgStance,
  text: string,
  overrides: AuthorityOverrides = {},
): ArgArgumentAuthority {
  return Object.freeze({
    id,
    stance,
    text,
    expectedStrength: "STRONG" as const,
    relevance: "DIRECT" as const,
    materiality: "MAJOR" as const,
    support: "PLAUSIBLE" as const,
    feasibility: "REALISTIC" as const,
    scope: "CALIBRATED" as const,
    stakeholderLegitimacy: "LEGITIMATE" as const,
    issueMatch: "EXACT" as const,
    weaknessDefects: Object.freeze([]),
    ...overrides,
  });
}

function weak(
  id: string,
  stance: ArgStance,
  text: string,
  defect: ArgWeaknessDefect,
  overrides: AuthorityOverrides = {},
): ArgArgumentAuthority {
  return Object.freeze({
    id,
    stance,
    text,
    expectedStrength: "WEAK" as const,
    relevance: "DIRECT" as const,
    materiality: "MAJOR" as const,
    support: "PLAUSIBLE" as const,
    feasibility: "REALISTIC" as const,
    scope: "CALIBRATED" as const,
    stakeholderLegitimacy: "LEGITIMATE" as const,
    issueMatch: "EXACT" as const,
    weaknessDefects: Object.freeze([defect]),
    ...overrides,
  });
}

export const ARG_CP001_ENGLISH_AUTHORITIES: readonly ArgScenarioAuthority[] = Object.freeze([
  // ARG-QL-001 — direct relevance and materiality
  {
    id: "ARG-SC-001",
    qlId: "ARG-QL-001",
    difficulty: "EASY",
    domain: "TRANSPORT",
    statement: "Should helmets be made compulsory for riders of electric two-wheelers on public roads?",
    arguments: [
      strong("ARG-SC-001-I", "SUPPORTS", "Yes. Riders of electric two-wheelers face the same risk of serious head injury in a road accident as riders of other two-wheelers."),
      weak("ARG-SC-001-II", "OPPOSES", "No. Many electric two-wheelers are available in attractive colours.", "IRRELEVANT_TANGENT", { relevance: "IRRELEVANT", materiality: "TRIVIAL" }),
    ],
    expectedAnswerClass: "ONLY_I",
  },
  {
    id: "ARG-SC-002",
    qlId: "ARG-QL-001",
    difficulty: "EASY",
    domain: "EDUCATION",
    statement: "Should universities publish model answer outlines after major written examinations?",
    arguments: [
      weak("ARG-SC-002-I", "SUPPORTS", "Yes. Students usually like universities that publish more material on their websites.", "TRIVIAL_CONSIDERATION", { materiality: "MINOR" }),
      strong("ARG-SC-002-II", "SUPPORTS", "Yes. Model outlines can help candidates understand the expected scope of answers and make the evaluation process more transparent."),
    ],
    expectedAnswerClass: "ONLY_II",
  },
  {
    id: "ARG-SC-003",
    qlId: "ARG-QL-001",
    difficulty: "MEDIUM",
    domain: "BANKING",
    statement: "Should banks provide an option to temporarily disable online transactions from the mobile app?",
    arguments: [
      strong("ARG-SC-003-I", "SUPPORTS", "Yes. A customer who notices suspicious activity could immediately reduce the risk of further unauthorised online transactions."),
      strong("ARG-SC-003-II", "OPPOSES", "No. If the control is too easy to trigger accidentally, customers may lock themselves out of urgent payments and increase support requests."),
    ],
    expectedAnswerClass: "BOTH",
  },
  {
    id: "ARG-SC-004",
    qlId: "ARG-QL-001",
    difficulty: "MEDIUM",
    domain: "PUBLIC_ADMIN",
    statement: "Should all government office waiting areas display a digital clock?",
    arguments: [
      weak("ARG-SC-004-I", "SUPPORTS", "Yes. Digital clocks look modern and make offices appear more advanced.", "TRIVIAL_CONSIDERATION", { materiality: "TRIVIAL" }),
      weak("ARG-SC-004-II", "OPPOSES", "No. Some officers prefer traditional wall clocks in their private rooms.", "IRRELEVANT_TANGENT", { relevance: "IRRELEVANT", issueMatch: "PARTIAL", materiality: "TRIVIAL" }),
    ],
    expectedAnswerClass: "NEITHER",
  },

  // ARG-QL-002 — evidence, mechanism and causal support
  {
    id: "ARG-SC-005",
    qlId: "ARG-QL-002",
    difficulty: "MEDIUM",
    domain: "TECHNOLOGY",
    statement: "Should organisations require a second verification step before an employee changes the bank account used for salary credit?",
    arguments: [
      strong("ARG-SC-005-I", "SUPPORTS", "Yes. An independent verification step can make it harder for a compromised email account alone to redirect salary payments."),
      weak("ARG-SC-005-II", "OPPOSES", "No. One employee once forgot a verification code, so such controls always make salary systems unusable.", "ANECDOTE_AS_UNIVERSAL_PROOF", { support: "FALLACIOUS", scope: "ABSOLUTE_UNJUSTIFIED" }),
    ],
    expectedAnswerClass: "ONLY_I",
  },
  {
    id: "ARG-SC-006",
    qlId: "ARG-QL-002",
    difficulty: "MEDIUM",
    domain: "EDUCATION",
    statement: "Should colleges schedule a short orientation on academic integrity for first-year students?",
    arguments: [
      weak("ARG-SC-006-I", "SUPPORTS", "Yes. Once students attend such an orientation, plagiarism will disappear completely from the college.", "UNSUPPORTED_CAUSAL_LEAP", { support: "ASSERTED", scope: "ABSOLUTE_UNJUSTIFIED" }),
      strong("ARG-SC-006-II", "SUPPORTS", "Yes. Explaining citation, collaboration and misconduct rules early can reduce violations caused by students not understanding the standards."),
    ],
    expectedAnswerClass: "ONLY_II",
  },
  {
    id: "ARG-SC-007",
    qlId: "ARG-QL-002",
    difficulty: "HARD",
    domain: "CONSUMER",
    statement: "Should online marketplaces show the total payable price, including mandatory fees, before a customer reaches the final payment screen?",
    arguments: [
      strong("ARG-SC-007-I", "SUPPORTS", "Yes. Showing unavoidable charges earlier lets buyers compare offers using the amount they will actually have to pay."),
      strong("ARG-SC-007-II", "OPPOSES", "No. Some charges depend on delivery location or payment method, so forcing a single total too early could display a misleading figure unless the required inputs are known."),
    ],
    expectedAnswerClass: "BOTH",
  },
  {
    id: "ARG-SC-008",
    qlId: "ARG-QL-002",
    difficulty: "MEDIUM",
    domain: "WORKPLACE",
    statement: "Should offices replace all in-person training with recorded video modules?",
    arguments: [
      weak("ARG-SC-008-I", "SUPPORTS", "Yes. Recorded videos are digital, and anything digital necessarily produces better learning.", "BARE_ASSERTION", { support: "FALLACIOUS" }),
      weak("ARG-SC-008-II", "OPPOSES", "No. Employees who watch training videos will certainly stop discussing work with colleagues.", "UNSUPPORTED_CAUSAL_LEAP", { support: "ASSERTED", scope: "ABSOLUTE_UNJUSTIFIED" }),
    ],
    expectedAnswerClass: "NEITHER",
  },

  // ARG-QL-003 — feasibility and implementation consequences
  {
    id: "ARG-SC-009",
    qlId: "ARG-QL-003",
    difficulty: "MEDIUM",
    domain: "PUBLIC_ADMIN",
    statement: "Should every district office introduce an online appointment system for services that currently require long queues?",
    arguments: [
      strong("ARG-SC-009-I", "SUPPORTS", "Yes. Time slots can spread arrivals across the day and reduce crowding for services with predictable handling time."),
      weak("ARG-SC-009-II", "OPPOSES", "No. An appointment system would require every citizen in the district to own an expensive computer.", "IMPRACTICAL_PREMISE", { support: "FALLACIOUS" }),
    ],
    expectedAnswerClass: "ONLY_I",
  },
  {
    id: "ARG-SC-010",
    qlId: "ARG-QL-003",
    difficulty: "MEDIUM",
    domain: "BANKING",
    statement: "Should a rural bank branch discontinue all cash services and operate only through digital channels?",
    arguments: [
      weak("ARG-SC-010-I", "SUPPORTS", "Yes. Digital service requires no staff, connectivity, devices or customer support once it is launched.", "IMPRACTICAL_PREMISE", { feasibility: "IMPRACTICAL", support: "FALLACIOUS" }),
      strong("ARG-SC-010-II", "OPPOSES", "No. Customers with unreliable connectivity or limited access to digital devices may lose practical access to essential banking services."),
    ],
    expectedAnswerClass: "ONLY_II",
  },
  {
    id: "ARG-SC-011",
    qlId: "ARG-QL-003",
    difficulty: "HARD",
    domain: "TRANSPORT",
    statement: "Should a city reserve one central-market street for pedestrians during peak shopping hours?",
    arguments: [
      strong("ARG-SC-011-I", "SUPPORTS", "Yes. Restricting vehicles during the busiest period can reduce conflict between dense pedestrian movement and through traffic."),
      strong("ARG-SC-011-II", "OPPOSES", "No. The measure could shift vehicles to nearby narrow streets, so traffic diversion and access for deliveries would need to be workable before implementation."),
    ],
    expectedAnswerClass: "BOTH",
  },
  {
    id: "ARG-SC-012",
    qlId: "ARG-QL-003",
    difficulty: "MEDIUM",
    domain: "RECRUITMENT",
    statement: "Should every recruitment examination move to computer-based testing from the next month?",
    arguments: [
      weak("ARG-SC-012-I", "SUPPORTS", "Yes. Once the decision is announced, enough secure computer centres will automatically become available in every district.", "IMPRACTICAL_PREMISE", { feasibility: "IMPRACTICAL", support: "ASSERTED" }),
      weak("ARG-SC-012-II", "OPPOSES", "No. Computer-based tests can never be conducted securely under any circumstances.", "ABSOLUTE_CLAIM", { scope: "ABSOLUTE_UNJUSTIFIED", support: "ASSERTED" }),
    ],
    expectedAnswerClass: "NEITHER",
  },

  // ARG-QL-004 — scope, proportionality and extremity
  {
    id: "ARG-SC-013",
    qlId: "ARG-QL-004",
    difficulty: "MEDIUM",
    domain: "EDUCATION",
    statement: "Should schools provide optional remedial classes for students who need additional help in mathematics?",
    arguments: [
      strong("ARG-SC-013-I", "SUPPORTS", "Yes. Additional guided practice can help students who have specific learning gaps without changing the regular class pace for everyone."),
      weak("ARG-SC-013-II", "OPPOSES", "No. Any student who attends a remedial class will become permanently dependent on extra teaching.", "OVERGENERALIZATION", { scope: "ABSOLUTE_UNJUSTIFIED", support: "ASSERTED" }),
    ],
    expectedAnswerClass: "ONLY_I",
  },
  {
    id: "ARG-SC-014",
    qlId: "ARG-QL-004",
    difficulty: "MEDIUM",
    domain: "ENVIRONMENT",
    statement: "Should large public events be required to provide clearly marked waste-segregation bins?",
    arguments: [
      weak("ARG-SC-014-I", "SUPPORTS", "Yes. Waste-segregation bins alone will solve the entire city's waste-management problem.", "OVERGENERALIZATION", { scope: "ABSOLUTE_UNJUSTIFIED", support: "ASSERTED" }),
      strong("ARG-SC-014-II", "SUPPORTS", "Yes. At venues producing large mixed waste streams, separate bins can make initial sorting easier when collection is also organised accordingly."),
    ],
    expectedAnswerClass: "ONLY_II",
  },
  {
    id: "ARG-SC-015",
    qlId: "ARG-QL-004",
    difficulty: "HARD",
    domain: "WORKPLACE",
    statement: "Should employees be allowed limited flexible starting times where the nature of the job permits it?",
    arguments: [
      strong("ARG-SC-015-I", "SUPPORTS", "Yes. A defined flexibility window can help employees manage commuting constraints while preserving required working hours."),
      strong("ARG-SC-015-II", "OPPOSES", "No. In teams that depend on real-time handovers or common service hours, too much variation in starting times can disrupt coordination unless overlap is protected."),
    ],
    expectedAnswerClass: "BOTH",
  },
  {
    id: "ARG-SC-016",
    qlId: "ARG-QL-004",
    difficulty: "MEDIUM",
    domain: "TECHNOLOGY",
    statement: "Should public libraries offer free basic digital-literacy workshops?",
    arguments: [
      weak("ARG-SC-016-I", "SUPPORTS", "Yes. Anyone who attends one workshop will never face a digital problem again.", "ABSOLUTE_CLAIM", { scope: "ABSOLUTE_UNJUSTIFIED", support: "ASSERTED" }),
      weak("ARG-SC-016-II", "OPPOSES", "No. If libraries teach digital skills, printed books will soon become completely unnecessary.", "SPECULATIVE_SLIPPERY_SLOPE", { support: "FALLACIOUS", scope: "OVERBROAD" }),
    ],
    expectedAnswerClass: "NEITHER",
  },

  // ARG-QL-005 — stakeholder, fairness, rights and public interest
  {
    id: "ARG-SC-017",
    qlId: "ARG-QL-005",
    difficulty: "MEDIUM",
    domain: "PUBLIC_ADMIN",
    statement: "Should government service portals meet accessibility standards for users with visual disabilities?",
    arguments: [
      strong("ARG-SC-017-I", "SUPPORTS", "Yes. Public services should be practically usable by citizens with disabilities, and accessible design reduces avoidable barriers to obtaining those services."),
      weak("ARG-SC-017-II", "OPPOSES", "No. Most website users do not have visual disabilities, so the needs of a smaller group need not be considered.", "PREJUDICIAL_STEREOTYPE", { stakeholderLegitimacy: "PREJUDICIAL", support: "FALLACIOUS" }),
    ],
    expectedAnswerClass: "ONLY_I",
  },
  {
    id: "ARG-SC-018",
    qlId: "ARG-QL-005",
    difficulty: "MEDIUM",
    domain: "TECHNOLOGY",
    statement: "Should an employer inform staff before introducing software that continuously records their screen activity?",
    arguments: [
      weak("ARG-SC-018-I", "OPPOSES", "No. Employees who object to monitoring must be people who have something to hide.", "PREJUDICIAL_STEREOTYPE", { stakeholderLegitimacy: "PREJUDICIAL", support: "FALLACIOUS" }),
      strong("ARG-SC-018-II", "SUPPORTS", "Yes. Continuous monitoring affects employee privacy, so staff should know what is collected, for what purpose and how it will be used."),
    ],
    expectedAnswerClass: "ONLY_II",
  },
  {
    id: "ARG-SC-019",
    qlId: "ARG-QL-005",
    difficulty: "HARD",
    domain: "TRANSPORT",
    statement: "Should a city increase parking charges in its most congested commercial zone?",
    arguments: [
      strong("ARG-SC-019-I", "SUPPORTS", "Yes. Higher charges can discourage long-duration use of scarce central parking and may reduce some unnecessary car trips into the congested area."),
      strong("ARG-SC-019-II", "OPPOSES", "No. If affordable alternatives are inadequate, a sharp increase could disproportionately burden workers and visitors who have no practical transport substitute."),
    ],
    expectedAnswerClass: "BOTH",
  },
  {
    id: "ARG-SC-020",
    qlId: "ARG-QL-005",
    difficulty: "MEDIUM",
    domain: "EDUCATION",
    statement: "Should a college reserve the front row of every lecture hall only for students from one particular hometown?",
    arguments: [
      weak("ARG-SC-020-I", "SUPPORTS", "Yes. Students from that hometown are naturally more deserving of the best seats.", "PREJUDICIAL_STEREOTYPE", { stakeholderLegitimacy: "PREJUDICIAL", support: "FALLACIOUS" }),
      weak("ARG-SC-020-II", "OPPOSES", "No. The college principal's favourite colour is blue.", "IRRELEVANT_TANGENT", { relevance: "IRRELEVANT", materiality: "TRIVIAL", issueMatch: "DIFFERENT_ISSUE" }),
    ],
    expectedAnswerClass: "NEITHER",
  },

  // ARG-QL-006 — counterargument quality, alternatives and second-order effects
  {
    id: "ARG-SC-021",
    qlId: "ARG-QL-006",
    difficulty: "HARD",
    domain: "CONSUMER",
    statement: "Should a city prohibit all street-vending activity around a busy railway station to reduce pedestrian obstruction?",
    arguments: [
      strong("ARG-SC-021-I", "OPPOSES", "No. Designated vending zones and enforceable clear-walkway rules may address obstruction without completely removing a livelihood activity from the area."),
      weak("ARG-SC-021-II", "SUPPORTS", "Yes. If vending is allowed anywhere near the station, the entire transport system will eventually stop functioning.", "SPECULATIVE_SLIPPERY_SLOPE", { support: "FALLACIOUS", scope: "OVERBROAD" }),
    ],
    expectedAnswerClass: "ONLY_I",
  },
  {
    id: "ARG-SC-022",
    qlId: "ARG-QL-006",
    difficulty: "HARD",
    domain: "BANKING",
    statement: "Should a bank block every card transaction made outside the customer's home state unless the customer gives advance notice?",
    arguments: [
      weak("ARG-SC-022-I", "SUPPORTS", "Yes. Any transaction outside a customer's home state must be fraudulent.", "FALSE_DILEMMA", { support: "FALLACIOUS", scope: "ABSOLUTE_UNJUSTIFIED" }),
      strong("ARG-SC-022-II", "OPPOSES", "No. Risk-based verification can target unusual transactions without automatically declining legitimate travel-related purchases."),
    ],
    expectedAnswerClass: "ONLY_II",
  },
  {
    id: "ARG-SC-023",
    qlId: "ARG-QL-006",
    difficulty: "HARD",
    domain: "ENVIRONMENT",
    statement: "Should a municipality charge households separately for collecting unusually large quantities of bulky waste?",
    arguments: [
      strong("ARG-SC-023-I", "SUPPORTS", "Yes. A separate charge can make the additional collection and handling cost visible to the users who generate unusually large loads."),
      strong("ARG-SC-023-II", "OPPOSES", "No. If the fee is set too high without convenient legal disposal options, some residents may dump bulky waste illegally, increasing enforcement and cleanup costs."),
    ],
    expectedAnswerClass: "BOTH",
  },
  {
    id: "ARG-SC-024",
    qlId: "ARG-QL-006",
    difficulty: "HARD",
    domain: "RECRUITMENT",
    statement: "Should an examination authority cancel an entire recruitment test whenever any cheating complaint is received?",
    arguments: [
      weak("ARG-SC-024-I", "SUPPORTS", "Yes. A single complaint proves that every candidate in every centre was involved in cheating.", "OVERGENERALIZATION", { support: "FALLACIOUS", scope: "ABSOLUTE_UNJUSTIFIED" }),
      weak("ARG-SC-024-II", "OPPOSES", "No. The authority must either ignore every complaint or permanently stop conducting examinations.", "FALSE_DILEMMA", { support: "FALLACIOUS", scope: "OVERBROAD" }),
    ],
    expectedAnswerClass: "NEITHER",
  },
]);
