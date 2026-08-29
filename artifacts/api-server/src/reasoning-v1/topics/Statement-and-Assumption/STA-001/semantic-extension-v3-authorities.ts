import type {
  StaCandidateAuthority,
  StaDependency,
  StaDependencyRelation,
  StaDenialEffect,
  StaDifficulty,
  StaDiscourseAct,
  StaMisconceptionClass,
  StaProposition,
} from "./types.ts";
import type {
  StaExtensionEvidenceClass,
  StaExtensionQlId,
  StaExtensionScenarioAuthority,
  StaExtensionSourceAuthority,
  StaExtensionSourceProfile,
} from "./semantic-extension-v3-types.ts";

interface CandidateSpec {
  readonly key: string;
  readonly text: string;
  readonly expected: "IMPLICIT" | "NOT_IMPLICIT";
  readonly relation?: StaDependencyRelation;
  readonly denialEffect?: StaDenialEffect;
  readonly misconception?: StaMisconceptionClass;
  readonly rationale: string;
  readonly explicit?: boolean;
}

interface ScenarioSpec {
  readonly scenarioId: string;
  readonly qlId: StaExtensionQlId;
  readonly sourceProfile: StaExtensionSourceProfile;
  readonly sourceAuthorityId: string;
  readonly discourseAct: StaDiscourseAct;
  readonly difficulty: StaDifficulty;
  readonly statements: readonly [string, string];
  readonly candidates: readonly [CandidateSpec, CandidateSpec, CandidateSpec, CandidateSpec];
  readonly allowedCandidateCounts?: readonly (2 | 3)[];
}

const SOURCES: readonly StaExtensionSourceAuthority[] = [
  {
    evidenceId: "STA-EXT-SRC-001",
    evidenceClass: "DIRECT_PYQ",
    examFamily: "SSC",
    examLabel: "SSC CHSL 6 Dec 2015",
    year: 2015,
    patternSummary: "Newspaper advertisement followed by assumptions about the audience/value proposition.",
    sourceUrl: "https://cracku.in/ssc-chsl-6-december-2015-morning-shift-question-paper-solved",
    officialVerbatim: false,
  },
  {
    evidenceId: "STA-EXT-SRC-002",
    evidenceClass: "DIRECT_PYQ",
    examFamily: "BANKING",
    examLabel: "IBPS RRB Scale I Officer 2021 Mains",
    year: 2021,
    patternSummary: "Commercial advertisement followed by three assumptions.",
    sourceUrl: "https://static.ixambee.com/miscellaneous-pdf/IBPS-RRB-Scale-I-Officer-2021-Mains-Previous-Year-Paper.pdf",
    officialVerbatim: false,
  },
  {
    evidenceId: "STA-EXT-SRC-003",
    evidenceClass: "MEMORY_BASED_PYQ",
    examFamily: "BANKING",
    examLabel: "IBPS Clerk Mains 2021 memory paper",
    year: 2021,
    patternSummary: "Recruitment advertisement followed by implicit-assumption choices.",
    sourceUrl: "https://static.ixambee.com/miscellaneous-pdf/1657188472IBPS-Clerk-Mains-2021-MBP-%281%29.pdf",
    officialVerbatim: false,
  },
  {
    evidenceId: "STA-EXT-SRC-004",
    evidenceClass: "DIRECT_PYQ",
    examFamily: "BANKING",
    examLabel: "SBI PO 2010",
    year: 2010,
    patternSummary: "Government appeal where capability/access and audience response are tested as assumptions.",
    sourceUrl: "https://cracku.in/sbi-po-exam-2010-question-paper-solved",
    officialVerbatim: false,
  },
  {
    evidenceId: "STA-EXT-SRC-005",
    evidenceClass: "DIRECT_PYQ",
    examFamily: "BANKING",
    examLabel: "IBPS PO 2011",
    year: 2011,
    patternSummary: "Public conservation appeal followed by response-oriented assumptions.",
    sourceUrl: "https://bankexamportal.com/sites/default/files/ibps-po-papers-solved-paper-2011-reasoning-ability-held-on-18-sep.pdf",
    officialVerbatim: false,
  },
  {
    evidenceId: "STA-EXT-SRC-006",
    evidenceClass: "DIRECT_PYQ",
    examFamily: "SSC",
    examLabel: "SSC CHSL 2015",
    year: 2015,
    patternSummary: "Comparative claim about metro convenience/economy followed by assumptions.",
    sourceUrl: "https://jkchrome.com/wp-content/uploads/2025/01/Proposition-jkchrome.pdf",
    officialVerbatim: false,
  },
  {
    evidenceId: "STA-EXT-SRC-007",
    evidenceClass: "DIRECT_PYQ",
    examFamily: "BANKING",
    examLabel: "IBPS PO Mains 2018",
    year: 2018,
    patternSummary: "Survey/evidence statement where the implicit premise is the validity of a learning-measure criterion.",
    sourceUrl: "https://www.ixambee.com/download-mocktest-pdf-eng/4da04049a062f5adfe81b67dd755cecc?download=",
    officialVerbatim: false,
  },
  {
    evidenceId: "STA-EXT-SRC-008",
    evidenceClass: "TARGET_EXAM_PREP_PATTERN",
    examFamily: "BANKING",
    examLabel: "Banking Statement-Assumption comparison pattern",
    patternSummary: "Advertisement compares education-loan rates across banks; assumptions concern comparable offerings/rates.",
    officialVerbatim: false,
  },
  {
    evidenceId: "STA-EXT-SRC-009",
    evidenceClass: "CONTROLLED_SYNTHESIS",
    examFamily: "PUNJAB_STATE",
    examLabel: "Punjab-neutral controlled synthesis",
    patternSummary: "State-exam-neutral communication/comparison scenario derived from source-supported semantic families; no direct Punjab-PYQ claim.",
    officialVerbatim: false,
  },
  {
    evidenceId: "STA-EXT-SRC-010",
    evidenceClass: "CONTROLLED_SYNTHESIS",
    examFamily: "CROSS_EXAM",
    examLabel: "Cross-exam controlled synthesis",
    patternSummary: "Fact-light controlled scenario used to saturate a source-supported semantic family without claiming direct PYQ wording.",
    officialVerbatim: false,
  },
] as const;

export const STA_SEMANTIC_EXTENSION_V3_SOURCES = SOURCES;

function sourceById(id: string): StaExtensionSourceAuthority {
  const source = SOURCES.find((item) => item.evidenceId === id);
  if (!source) throw new Error(`Missing STA extension source ${id}`);
  return source;
}

function makeScenario(spec: ScenarioSpec): StaExtensionScenarioAuthority {
  sourceById(spec.sourceAuthorityId);
  const objectiveId = `${spec.scenarioId}-OBJ`;
  const propositions: StaProposition[] = spec.candidates.map((candidate, index) => ({
    propositionId: `${spec.scenarioId}-P${index}`,
    semanticKey: `${spec.scenarioId}_${candidate.key}`,
    oppositeSemanticKey: `NOT_${spec.scenarioId}_${candidate.key}`,
    polarity: "POSITIVE",
    entities: [spec.scenarioId],
  }));
  const explicitPropositionIds = spec.candidates.flatMap((candidate, index) => candidate.explicit ? [propositions[index]!.propositionId] : []);
  const dependencies: StaDependency[] = spec.candidates.flatMap((candidate, index) => {
    if (candidate.expected !== "IMPLICIT") return [];
    if (!candidate.relation || !candidate.denialEffect) throw new Error(`${spec.scenarioId}/${candidate.key}: implicit candidate lacks dependency metadata`);
    return [{
      dependencyId: `${spec.scenarioId}-D${index}`,
      propositionId: propositions[index]!.propositionId,
      relation: candidate.relation,
      requiredFor: [objectiveId],
      denialEffect: candidate.denialEffect,
    }];
  });
  const candidates: StaCandidateAuthority[] = spec.candidates.map((candidate, index) => ({
    candidateId: `${spec.scenarioId}-C${index}`,
    propositionId: propositions[index]!.propositionId,
    textVariants: [candidate.text],
    expectedClassification: candidate.expected,
    ...(candidate.misconception ? { misconceptionClass: candidate.misconception } : {}),
    rationale: candidate.rationale,
  }));
  return {
    scenarioId: spec.scenarioId,
    extensionQlId: spec.qlId,
    checkpointId: spec.qlId === "STA-QL-005" ? "STA-CP-003" : "STA-CP-005",
    sourceProfile: spec.sourceProfile,
    discourseAct: spec.discourseAct,
    objectiveIds: [objectiveId],
    statementVariants: spec.statements,
    propositions,
    explicitPropositionIds,
    hiddenDependencies: dependencies,
    candidates: candidates as unknown as StaExtensionScenarioAuthority["candidates"],
    allowedCandidateCounts: spec.allowedCandidateCounts ?? [2, 3],
    difficulty: spec.difficulty,
    sourceAuthorityId: spec.sourceAuthorityId,
    sourceStatus: "SOURCE_SUPPORTED_SEMANTIC_EXTENSION_V3",
  };
}

const QL005_SPECS: readonly ScenarioSpec[] = [
  {
    scenarioId: "STA-EXT5-SSC-ORGANIC-HONEY", qlId: "STA-QL-005", sourceProfile: "SSC", sourceAuthorityId: "STA-EXT-SRC-001", discourseAct: "ADVERTISEMENT", difficulty: "Easy",
    statements: ["Choose MeadowPure organic honey for a naturally pure breakfast.", "MeadowPure advertises its honey as an organic choice for buyers who prefer purity."],
    candidates: [
      { key: "AUDIENCE_VALUES_PURITY", text: "At least some intended buyers value purity in the honey they purchase.", expected: "IMPLICIT", relation: "VALUE", denialEffect: "BREAKS_COMMUNICATIVE_PURPOSE", rationale: "Highlighting purity is persuasive only if that feature matters to at least some intended buyers." },
      { key: "AUDIENCE_CAN_RESPOND", text: "At least some people who notice the advertisement can choose the advertised product.", expected: "IMPLICIT", relation: "BEHAVIOUR", denialEffect: "BREAKS_COMMUNICATIVE_PURPOSE", rationale: "An advertisement presupposes some realistic possibility of audience response." },
      { key: "AD_SAYS_ORGANIC", text: "The advertisement describes the honey as organic.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "This is stated in the advertisement rather than left implicit." },
      { key: "ALL_OTHER_HONEY_IMPURE", text: "Every competing brand of honey is impure.", expected: "NOT_IMPLICIT", misconception: "TOO_STRONG_QUANTIFIER", rationale: "The advertisement need not condemn every competing brand." },
    ],
  },
  {
    scenarioId: "STA-EXT5-SSC-TRIAL-PRODUCT", qlId: "STA-QL-005", sourceProfile: "SSC", sourceAuthorityId: "STA-EXT-SRC-001", discourseAct: "ADVERTISEMENT", difficulty: "Medium",
    statements: ["Try our demo handset once and judge its call clarity yourself.", "The handset maker invites buyers to test a demo unit before deciding whether to purchase."],
    candidates: [
      { key: "AUDIENCE_VALUES_CALL_CLARITY", text: "Call clarity matters to at least some prospective handset buyers.", expected: "IMPLICIT", relation: "VALUE", denialEffect: "BREAKS_RELEVANCE", rationale: "The highlighted feature must matter to some target buyers for the appeal to test it to be relevant." },
      { key: "TRIAL_CAN_INFLUENCE_DECISION", text: "Trying the demo can influence at least some buyers' purchase decisions.", expected: "IMPLICIT", relation: "BEHAVIOUR", denialEffect: "BREAKS_COMMUNICATIVE_PURPOSE", rationale: "Inviting a trial assumes that a trial can affect some audience decisions." },
      { key: "TRIAL_IS_OFFERED", text: "A demo trial is being offered before purchase.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "The trial offer is explicit." },
      { key: "COMPETITORS_HAVE_BAD_AUDIO", text: "Competing handsets have poor call quality.", expected: "NOT_IMPLICIT", misconception: "RELATED_BUT_IRRELEVANT", rationale: "The advertisement can promote its own feature without assuming competitors are poor." },
    ],
  },
  {
    scenarioId: "STA-EXT5-BANK-DOORSTEP-ACCOUNT", qlId: "STA-QL-005", sourceProfile: "BANKING", sourceAuthorityId: "STA-EXT-SRC-002", discourseAct: "ADVERTISEMENT", difficulty: "Easy",
    statements: ["Want to open an account without visiting the branch? Call our doorstep banking team.", "The bank advertises doorstep assistance for customers who want to open an account from home."],
    candidates: [
      { key: "SOME_CUSTOMERS_VALUE_HOME_SERVICE", text: "Some prospective customers value account-opening assistance at home.", expected: "IMPLICIT", relation: "VALUE", denialEffect: "BREAKS_RELEVANCE", rationale: "The doorstep feature is worth advertising only if it is relevant to some prospective customers." },
      { key: "CUSTOMERS_CAN_CONTACT_TEAM", text: "At least some intended customers can contact the doorstep banking team.", expected: "IMPLICIT", relation: "CAPABILITY", denialEffect: "BREAKS_COMMUNICATIVE_PURPOSE", rationale: "The response channel must be usable by at least part of the target audience." },
      { key: "DOORSTEP_SERVICE_ADVERTISED", text: "The bank is offering doorstep assistance for account opening.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "That offer is stated directly." },
      { key: "BRANCH_VISITS_IMPOSSIBLE", text: "Prospective customers are unable to visit any bank branch.", expected: "NOT_IMPLICIT", misconception: "TOO_STRONG_QUANTIFIER", rationale: "Home service may be convenient without branch visits being impossible." },
    ],
  },
  {
    scenarioId: "STA-EXT5-BANK-FAIRNESS-CREAM", qlId: "STA-QL-005", sourceProfile: "BANKING", sourceAuthorityId: "STA-EXT-SRC-002", discourseAct: "ADVERTISEMENT", difficulty: "Medium",
    statements: ["GlowCare cream is advertised to buyers seeking a brighter-looking complexion.", "An advertisement presents GlowCare as a complexion-care cream for interested consumers."],
    candidates: [
      { key: "TARGET_AUDIENCE_VALUES_CLAIMED_BENEFIT", text: "At least some intended consumers care about the advertised complexion-related benefit.", expected: "IMPLICIT", relation: "VALUE", denialEffect: "BREAKS_RELEVANCE", rationale: "The benefit must matter to some intended consumers for highlighting it to be relevant." },
      { key: "SOME_AUDIENCE_MAY_RESPOND", text: "At least some people may respond to the advertisement.", expected: "IMPLICIT", relation: "BEHAVIOUR", denialEffect: "BREAKS_COMMUNICATIVE_PURPOSE", rationale: "Advertising presupposes a possible audience response, not guaranteed universal purchase." },
      { key: "CREAM_IS_ADVERTISED", text: "GlowCare is being promoted through an advertisement.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "The advertising act is explicit." },
      { key: "PEOPLE_EASILY_FOOLED", text: "People are generally easy to deceive through advertisements.", expected: "NOT_IMPLICIT", misconception: "VALUE_JUDGEMENT_NOT_REQUIRED", rationale: "The advertisement does not require a negative judgement about consumers." },
    ],
  },
  {
    scenarioId: "STA-EXT5-BANK-IT-RECRUITMENT", qlId: "STA-QL-005", sourceProfile: "BANKING", sourceAuthorityId: "STA-EXT-SRC-003", discourseAct: "ADVERTISEMENT", difficulty: "Medium",
    statements: ["If you have web-development skills, apply to our technology team.", "A company recruitment advertisement invites candidates with web-development skills to apply."],
    candidates: [
      { key: "COMPANY_NEEDS_RELEVANT_SKILL", text: "The company has a role for which web-development skill is relevant.", expected: "IMPLICIT", relation: "RELEVANCE", denialEffect: "BREAKS_COMMUNICATIVE_PURPOSE", rationale: "Targeting that skill presupposes that it is relevant to the vacancy." },
      { key: "SOME_QUALIFIED_PEOPLE_MAY_APPLY", text: "The advertiser expects that at least some suitably skilled people may respond.", expected: "IMPLICIT", relation: "BEHAVIOUR", denialEffect: "BREAKS_COMMUNICATIVE_PURPOSE", rationale: "A recruitment advertisement presupposes a possible response from its target pool." },
      { key: "AD_INVITES_WEB_SKILLS", text: "The advertisement invites people with web-development skills.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "This is stated." },
      { key: "ALL_WEB_DEVS_BETTER", text: "Every web developer performs better than every other employee.", expected: "NOT_IMPLICIT", misconception: "TOO_STRONG_QUANTIFIER", rationale: "The recruitment need does not require a universal performance ranking." },
    ],
  },
  {
    scenarioId: "STA-EXT5-BANK-E-MEDIA-APPEAL", qlId: "STA-QL-005", sourceProfile: "BANKING", sourceAuthorityId: "STA-EXT-SRC-004", discourseAct: "APPEAL", difficulty: "Hard",
    statements: ["Citizens are urged to use electronic records where practical so that unnecessary paper use can be reduced.", "A public appeal asks people to choose electronic records whenever feasible instead of printing routine documents."],
    candidates: [
      { key: "SOME_CITIZENS_CAN_USE_ELECTRONIC", text: "At least some people addressed by the appeal are capable of using electronic records.", expected: "IMPLICIT", relation: "CAPABILITY", denialEffect: "BREAKS_FEASIBILITY", rationale: "The requested behaviour must be feasible for at least some of the audience." },
      { key: "SOME_RESPONSE_CAN_REDUCE_PAPER", text: "If some people follow the appeal, their paper use can be reduced.", expected: "IMPLICIT", relation: "EFFICACY", denialEffect: "BREAKS_RATIONALE", rationale: "The appeal's stated purpose depends on the requested response being able to reduce some paper use." },
      { key: "APPEAL_REQUESTS_E_RECORDS", text: "The appeal asks people to prefer electronic records where practical.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "The request is explicit." },
      { key: "EVERYONE_HAS_INTERNET", text: "Every citizen has uninterrupted internet access.", expected: "NOT_IMPLICIT", misconception: "TOO_STRONG_QUANTIFIER", rationale: "The qualified appeal does not require universal connectivity." },
    ],
  },
  {
    scenarioId: "STA-EXT5-BANK-WATER-APPEAL", qlId: "STA-QL-005", sourceProfile: "BANKING", sourceAuthorityId: "STA-EXT-SRC-005", discourseAct: "APPEAL", difficulty: "Medium",
    statements: ["Residents are appealed to use supplied water carefully during the current shortage.", "The civic body asks residents to avoid unnecessary water use while supply is constrained."],
    candidates: [
      { key: "SOME_RESIDENTS_CAN_REDUCE_USE", text: "At least some residents can reduce avoidable water use in response to the appeal.", expected: "IMPLICIT", relation: "BEHAVIOUR", denialEffect: "BREAKS_COMMUNICATIVE_PURPOSE", rationale: "An appeal seeking conservation presupposes that some audience behaviour can change." },
      { key: "POSITIVE_RESPONSE_HELPS_SHORTAGE", text: "A positive response from enough residents can help manage the shortage.", expected: "IMPLICIT", relation: "EFFICACY", denialEffect: "BREAKS_RATIONALE", rationale: "Otherwise the appeal would not serve its stated conservation purpose." },
      { key: "CURRENT_SHORTAGE_STATED", text: "Water supply is currently constrained.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "The shortage is stated." },
      { key: "ONLY_POOR_AFFECTED", text: "Only low-income residents are affected by the shortage.", expected: "NOT_IMPLICIT", misconception: "WRONG_SCOPE", rationale: "The appeal is not limited to that group." },
    ],
  },
  {
    scenarioId: "STA-EXT5-BANK-TAX-APPEAL", qlId: "STA-QL-005", sourceProfile: "BANKING", sourceAuthorityId: "STA-EXT-SRC-005", discourseAct: "APPEAL", difficulty: "Hard",
    statements: ["Taxpayers are appealed to report income honestly so that public development funds are not unnecessarily constrained.", "A public appeal asks eligible taxpayers to file accurate returns in support of development funding."],
    candidates: [
      { key: "SOME_TAXPAYERS_MAY_RESPOND", text: "At least some taxpayers may respond positively to the appeal.", expected: "IMPLICIT", relation: "BEHAVIOUR", denialEffect: "BREAKS_COMMUNICATIVE_PURPOSE", rationale: "The appeal presupposes some realistic prospect of compliance improving." },
      { key: "ACCURATE_COMPLIANCE_CAN_HELP_COLLECTION", text: "More accurate compliance by some taxpayers can support public revenue collection.", expected: "IMPLICIT", relation: "EFFICACY", denialEffect: "BREAKS_RATIONALE", rationale: "The stated development-funding purpose depends on accurate compliance being relevant to collections." },
      { key: "ACCURATE_RETURNS_REQUESTED", text: "The appeal asks taxpayers to file accurate returns.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "That request is explicit." },
      { key: "EVERY_TAXPAYER_CURRENTLY_DISHONEST", text: "Every taxpayer currently reports income dishonestly.", expected: "NOT_IMPLICIT", misconception: "TOO_STRONG_QUANTIFIER", rationale: "The appeal does not require universal existing dishonesty." },
    ],
  },
  {
    scenarioId: "STA-EXT5-PB-BUS-PASS-AD", qlId: "STA-QL-005", sourceProfile: "PUNJAB_STATE", sourceAuthorityId: "STA-EXT-SRC-009", discourseAct: "ADVERTISEMENT", difficulty: "Easy",
    statements: ["Frequent bus travellers can buy a monthly pass to avoid purchasing a ticket on every trip.", "A transport service advertises a monthly pass for passengers who travel often."],
    candidates: [
      { key: "SOME_TRAVELLERS_TRAVEL_OFTEN", text: "Some intended passengers travel often enough for a monthly pass to be relevant.", expected: "IMPLICIT", relation: "RELEVANCE", denialEffect: "BREAKS_RELEVANCE", rationale: "The pass is targeted at frequent travellers, so such a relevant audience must exist." },
      { key: "SOME_VALUE_CONVENIENCE", text: "At least some frequent travellers value avoiding repeated ticket purchases.", expected: "IMPLICIT", relation: "VALUE", denialEffect: "BREAKS_COMMUNICATIVE_PURPOSE", rationale: "The advertised convenience must matter to some target passengers." },
      { key: "MONTHLY_PASS_ADVERTISED", text: "A monthly pass is being offered to frequent travellers.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "This is stated." },
      { key: "ALL_TRIPS_SAME_ROUTE", text: "Every pass holder makes every trip on the same route.", expected: "NOT_IMPLICIT", misconception: "RELATED_BUT_IRRELEVANT", rationale: "The message does not require that universal route pattern." },
    ],
  },
  {
    scenarioId: "STA-EXT5-PB-SERVICE-CAMP-APPEAL", qlId: "STA-QL-005", sourceProfile: "PUNJAB_STATE", sourceAuthorityId: "STA-EXT-SRC-009", discourseAct: "APPEAL", difficulty: "Medium",
    statements: ["Residents with pending certificate corrections are asked to use Saturday's service camp.", "A district service camp appeals to residents with pending certificate corrections to attend on Saturday."],
    candidates: [
      { key: "RELEVANT_RESIDENTS_EXIST", text: "There are residents with pending certificate corrections for whom the camp is relevant.", expected: "IMPLICIT", relation: "RELEVANCE", denialEffect: "BREAKS_COMMUNICATIVE_PURPOSE", rationale: "The targeted appeal presupposes an audience needing that service." },
      { key: "SOME_CAN_ATTEND", text: "At least some of the targeted residents can attend the Saturday camp.", expected: "IMPLICIT", relation: "FEASIBILITY", denialEffect: "BREAKS_FEASIBILITY", rationale: "The appeal presupposes a realistic response channel for at least part of its audience." },
      { key: "SATURDAY_CAMP_STATED", text: "The service camp is scheduled for Saturday.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "The timing is stated." },
      { key: "ALL_CERTIFICATES_WRONG", text: "Every certificate issued in the district contains an error.", expected: "NOT_IMPLICIT", misconception: "TOO_STRONG_QUANTIFIER", rationale: "Only the targeted pending cases matter." },
    ],
  },
  {
    scenarioId: "STA-EXT5-CROSS-TRAINING-AD", qlId: "STA-QL-005", sourceProfile: "CROSS_EXAM_DISCOVERY", sourceAuthorityId: "STA-EXT-SRC-010", discourseAct: "ADVERTISEMENT", difficulty: "Medium",
    statements: ["Improve your spreadsheet skills with our weekend practice course.", "A weekend course advertisement targets learners who want stronger spreadsheet skills."],
    candidates: [
      { key: "SOME_LEARNERS_VALUE_SKILL", text: "Some intended learners want to improve their spreadsheet skills.", expected: "IMPLICIT", relation: "VALUE", denialEffect: "BREAKS_RELEVANCE", rationale: "The advertised outcome must matter to some target learners." },
      { key: "COURSE_CAN_HELP_SOME", text: "The course can help at least some suitable learners practise the advertised skill.", expected: "IMPLICIT", relation: "EFFICACY", denialEffect: "BREAKS_RATIONALE", rationale: "A training advertisement presupposes some ability to contribute to the claimed improvement." },
      { key: "WEEKEND_COURSE_STATED", text: "The advertised course is held on weekends.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "That is explicit." },
      { key: "ONLY_COURSE_CAN_TEACH", text: "No other method can improve spreadsheet skills.", expected: "NOT_IMPLICIT", misconception: "TOO_STRONG_QUANTIFIER", rationale: "The advertisement need not claim exclusivity." },
    ],
  },
  {
    scenarioId: "STA-EXT5-CROSS-DISCOUNT-AD", qlId: "STA-QL-005", sourceProfile: "CROSS_EXAM_DISCOVERY", sourceAuthorityId: "STA-EXT-SRC-010", discourseAct: "ADVERTISEMENT", difficulty: "Easy",
    statements: ["Weekend offer: selected backpacks are available at a reduced price.", "A store advertises a weekend price reduction on selected backpacks."],
    candidates: [
      { key: "SOME_BUYERS_VALUE_LOWER_PRICE", text: "A lower price matters to at least some potential backpack buyers.", expected: "IMPLICIT", relation: "VALUE", denialEffect: "BREAKS_RELEVANCE", rationale: "Discounting is a persuasive feature only if price matters to some target buyers." },
      { key: "AD_CAN_PROMPT_VISIT", text: "The store expects the offer may prompt at least some customers to consider buying.", expected: "IMPLICIT", relation: "BEHAVIOUR", denialEffect: "BREAKS_COMMUNICATIVE_PURPOSE", rationale: "The commercial message assumes some possible response." },
      { key: "WEEKEND_REDUCTION_STATED", text: "Selected backpacks have a weekend price reduction.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "This is explicit." },
      { key: "ALL_BACKPACKS_OVERPRICED", text: "All backpacks were overpriced before the offer.", expected: "NOT_IMPLICIT", misconception: "VALUE_JUDGEMENT_NOT_REQUIRED", rationale: "A discount does not require that judgement." },
    ],
  },
  {
    scenarioId: "STA-EXT5-SSC-SAFETY-APPEAL", qlId: "STA-QL-005", sourceProfile: "SSC", sourceAuthorityId: "STA-EXT-SRC-001", discourseAct: "APPEAL", difficulty: "Medium",
    statements: ["Passengers are requested to keep the station walkway clear during peak arrival time.", "A station appeal asks passengers not to block the main walkway when trains arrive."],
    candidates: [
      { key: "SOME_PASSENGERS_CAN_CHANGE", text: "At least some passengers can change where they wait in response to the appeal.", expected: "IMPLICIT", relation: "BEHAVIOUR", denialEffect: "BREAKS_COMMUNICATIVE_PURPOSE", rationale: "The appeal presupposes some possible audience response." },
      { key: "CLEAR_WALKWAY_SERVES_PURPOSE", text: "Keeping the walkway clear is relevant to the station's stated crowd-management purpose.", expected: "IMPLICIT", relation: "EFFICACY", denialEffect: "BREAKS_RATIONALE", rationale: "The requested behaviour must be relevant to why the appeal is issued." },
      { key: "KEEP_CLEAR_REQUEST_STATED", text: "Passengers are being asked to keep the walkway clear.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "The request is explicit." },
      { key: "EVERY_PASSENGER_BLOCKS", text: "Every passenger currently blocks the walkway.", expected: "NOT_IMPLICIT", misconception: "TOO_STRONG_QUANTIFIER", rationale: "The appeal does not require universal misconduct." },
    ],
  },
  {
    scenarioId: "STA-EXT5-BANK-DIGITAL-AD", qlId: "STA-QL-005", sourceProfile: "BANKING", sourceAuthorityId: "STA-EXT-SRC-003", discourseAct: "ADVERTISEMENT", difficulty: "Medium",
    statements: ["The bank advertises instant balance alerts for customers who want quicker account updates.", "Customers seeking prompt account updates are invited to activate instant balance alerts."],
    candidates: [
      { key: "SOME_CUSTOMERS_VALUE_PROMPT_UPDATE", text: "Some customers value receiving account updates promptly.", expected: "IMPLICIT", relation: "VALUE", denialEffect: "BREAKS_RELEVANCE", rationale: "Promptness is highlighted because it matters to some target customers." },
      { key: "SOME_CAN_ACTIVATE", text: "At least some intended customers can activate the alert service.", expected: "IMPLICIT", relation: "CAPABILITY", denialEffect: "BREAKS_FEASIBILITY", rationale: "The advertised response must be feasible for some of the audience." },
      { key: "ALERT_SERVICE_ADVERTISED", text: "The bank is advertising instant balance alerts.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "This is explicit." },
      { key: "ALL_CUSTOMERS_CHECK_HOURLY", text: "Every customer checks the account balance every hour.", expected: "NOT_IMPLICIT", misconception: "RELATED_BUT_IRRELEVANT", rationale: "The service does not depend on that behaviour." },
    ],
  },
  {
    scenarioId: "STA-EXT5-PB-LIBRARY-AD", qlId: "STA-QL-005", sourceProfile: "PUNJAB_STATE", sourceAuthorityId: "STA-EXT-SRC-009", discourseAct: "ADVERTISEMENT", difficulty: "Easy",
    statements: ["The district library advertises evening membership for readers who cannot visit during office hours.", "Readers needing later access are invited to join the library's evening membership plan."],
    candidates: [
      { key: "SOME_READERS_NEED_LATER_ACCESS", text: "Some prospective members find evening access useful.", expected: "IMPLICIT", relation: "RELEVANCE", denialEffect: "BREAKS_RELEVANCE", rationale: "The evening feature presupposes a relevant audience." },
      { key: "SOME_MAY_JOIN", text: "The library expects at least some suitable readers may respond to the membership offer.", expected: "IMPLICIT", relation: "BEHAVIOUR", denialEffect: "BREAKS_COMMUNICATIVE_PURPOSE", rationale: "A membership advertisement presupposes some prospect of response." },
      { key: "EVENING_MEMBERSHIP_STATED", text: "An evening membership plan is being advertised.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "The plan is stated." },
      { key: "DAYTIME_LIBRARY_CLOSED", text: "The library is closed throughout the daytime.", expected: "NOT_IMPLICIT", misconception: "OPPOSITE_OF_REQUIRED_ASSUMPTION", rationale: "The offer is for people who cannot visit then; it does not say the library itself is closed." },
    ],
  },
  {
    scenarioId: "STA-EXT5-CROSS-TREE-APPEAL", qlId: "STA-QL-005", sourceProfile: "CROSS_EXAM_DISCOVERY", sourceAuthorityId: "STA-EXT-SRC-010", discourseAct: "APPEAL", difficulty: "Hard",
    statements: ["Residents are appealed to volunteer for the neighbourhood tree-care drive this Sunday.", "A community appeal asks residents to join Sunday's tree-care drive."],
    candidates: [
      { key: "SOME_RESIDENTS_CAN_VOLUNTEER", text: "At least some residents are able to volunteer for the drive.", expected: "IMPLICIT", relation: "CAPABILITY", denialEffect: "BREAKS_FEASIBILITY", rationale: "The requested response must be feasible for some intended participants." },
      { key: "VOLUNTEER_RESPONSE_HELPS_DRIVE", text: "Additional resident participation can help the tree-care drive carry out its work.", expected: "IMPLICIT", relation: "EFFICACY", denialEffect: "BREAKS_RATIONALE", rationale: "The appeal assumes the requested participation contributes to its purpose." },
      { key: "SUNDAY_DRIVE_STATED", text: "The tree-care drive is scheduled for Sunday.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "The timing is explicit." },
      { key: "EVERY_RESIDENT_INTERESTED", text: "Every resident is interested in tree care.", expected: "NOT_IMPLICIT", misconception: "TOO_STRONG_QUANTIFIER", rationale: "The appeal only requires a possible relevant response, not universal interest." },
    ],
  },
];

const QL006_SPECS: readonly ScenarioSpec[] = [
  {
    scenarioId: "STA-EXT6-SSC-METRO-COMPARISON", qlId: "STA-QL-006", sourceProfile: "SSC", sourceAuthorityId: "STA-EXT-SRC-006", discourseAct: "ASSERTION", difficulty: "Easy",
    statements: ["For this city trip, metro travel is more convenient and economical than the usual alternatives.", "The statement rates the metro as the more convenient and economical option for the trip."],
    candidates: [
      { key: "CRITERIA_RELEVANT_TO_TRAVEL_CHOICE", text: "Convenience and cost are relevant criteria for the travel comparison being made.", expected: "IMPLICIT", relation: "MEASUREMENT", denialEffect: "BREAKS_INTENDED_MEANING", rationale: "Calling one option more convenient and economical treats those criteria as meaningful to the evaluation." },
      { key: "METRO_SERVICE_USABLE", text: "The metro service is usable enough for the stated trip to be meaningfully compared with alternatives.", expected: "IMPLICIT", relation: "COMPARABILITY", denialEffect: "BREAKS_RATIONALE", rationale: "A practical comparison presupposes that the metro is a genuine option for the trip." },
      { key: "METRO_RATED_BETTER", text: "The statement rates metro travel as more convenient and economical.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "That comparative claim is explicit." },
      { key: "NO_OTHER_TRANSPORT_EXISTS", text: "No other mode of transport is available in the city.", expected: "NOT_IMPLICIT", misconception: "OPPOSITE_OF_REQUIRED_ASSUMPTION", rationale: "A comparison normally presupposes alternatives rather than their absence." },
    ],
  },
  {
    scenarioId: "STA-EXT6-BANK-ASER-MEASURE", qlId: "STA-QL-006", sourceProfile: "BANKING", sourceAuthorityId: "STA-EXT-SRC-007", discourseAct: "ASSERTION", difficulty: "Hard",
    statements: ["A learning survey treats inability to recognise class-appropriate letters as evidence of a serious foundational learning gap.", "The report uses recognition of class-appropriate letters as one indicator when judging foundational learning."],
    candidates: [
      { key: "LETTER_RECOGNITION_RELEVANT_MEASURE", text: "Recognising class-appropriate letters is a relevant indicator of foundational learning for the claim being made.", expected: "IMPLICIT", relation: "MEASUREMENT", denialEffect: "BREAKS_RATIONALE", rationale: "The report cannot use that observation as evidence of a learning gap unless the measure is relevant to foundational learning." },
      { key: "CLASS_LEVEL_SCOPE_ALIGNED", text: "The class level used to judge letter recognition is relevant to the students being assessed.", expected: "IMPLICIT", relation: "SCOPE", denialEffect: "BREAKS_INTENDED_MEANING", rationale: "The evidential meaning depends on the criterion matching the assessed students' level." },
      { key: "REPORT_USES_LETTER_RECOGNITION", text: "The report uses letter recognition as an indicator in its discussion.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "That use is stated." },
      { key: "LETTER_RECOGNITION_ONLY_MEASURE", text: "Letter recognition is the only valid measure of learning.", expected: "NOT_IMPLICIT", misconception: "TOO_STRONG_QUANTIFIER", rationale: "Using one indicator does not make it the only valid measure." },
    ],
  },
  {
    scenarioId: "STA-EXT6-BANK-LOAN-RATE-COMPARISON", qlId: "STA-QL-006", sourceProfile: "BANKING", sourceAuthorityId: "STA-EXT-SRC-008", discourseAct: "ADVERTISEMENT", difficulty: "Medium",
    statements: ["Bank N advertises that its education-loan interest rate is lower than the rates offered by other major banks.", "An education-loan advertisement presents Bank N's rate as lower than comparable rates at other banks."],
    candidates: [
      { key: "OTHER_BANKS_HAVE_COMPARABLE_LOANS", text: "Other banks offer education loans that can meaningfully be compared with Bank N's offer.", expected: "IMPLICIT", relation: "COMPARABILITY", denialEffect: "BREAKS_RATIONALE", rationale: "A lower-than-other-banks claim presupposes comparable offerings." },
      { key: "RATE_MEASURE_COMPARABLE", text: "The interest-rate figures being compared refer to a sufficiently similar basis for the advertised comparison.", expected: "IMPLICIT", relation: "MEASUREMENT", denialEffect: "BREAKS_INTENDED_MEANING", rationale: "The comparison needs rates measured on a sufficiently aligned basis." },
      { key: "BANK_N_CLAIMS_LOWER_RATE", text: "Bank N claims that its education-loan rate is lower.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "This is the explicit claim." },
      { key: "BANK_N_BEST_IN_EVERY_SERVICE", text: "Bank N is better than every other bank in all services.", expected: "NOT_IMPLICIT", misconception: "WRONG_SCOPE", rationale: "A loan-rate comparison does not support an all-services ranking." },
    ],
  },
  {
    scenarioId: "STA-EXT6-BANK-SATISFACTION-PERIOD", qlId: "STA-QL-006", sourceProfile: "BANKING", sourceAuthorityId: "STA-EXT-SRC-007", discourseAct: "ASSERTION", difficulty: "Hard",
    statements: ["The branch says customer satisfaction improved this quarter because its survey score rose from 72 to 81.", "A branch compares this quarter's satisfaction score with the previous quarter and reports an improvement."],
    candidates: [
      { key: "SURVEY_SCALE_STABLE", text: "The satisfaction scores for the two quarters are measured on a sufficiently comparable scale.", expected: "IMPLICIT", relation: "MEASUREMENT", denialEffect: "BREAKS_RATIONALE", rationale: "A change in score can evidence improvement only if the measurement meaning is sufficiently stable." },
      { key: "RESPONDENT_GROUPS_RELEVANT", text: "The surveyed customer groups in the two quarters are sufficiently relevant to the branch-level comparison.", expected: "IMPLICIT", relation: "COMPARABILITY", denialEffect: "BREAKS_RATIONALE", rationale: "The comparison presupposes that the groups are not so different that the scores become meaningless." },
      { key: "SCORE_ROSE", text: "The reported satisfaction score rose from 72 to 81.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "The score change is stated." },
      { key: "EVERY_CUSTOMER_HAPPIER", text: "Every individual customer is more satisfied than before.", expected: "NOT_IMPLICIT", misconception: "TOO_STRONG_QUANTIFIER", rationale: "An aggregate score increase does not require universal individual improvement." },
    ],
  },
  {
    scenarioId: "STA-EXT6-BANK-WAIT-TIME-BRANCHES", qlId: "STA-QL-006", sourceProfile: "BANKING", sourceAuthorityId: "STA-EXT-SRC-008", discourseAct: "ASSERTION", difficulty: "Medium",
    statements: ["Using average queue time, the service review rates Branch A faster than Branch B for counter service.", "The review compares the branches by average customer waiting time and labels Branch A the faster counter-service branch."],
    candidates: [
      { key: "WAIT_TIME_RELEVANT_SPEED_MEASURE", text: "Average waiting time is a relevant measure for the counter-service speed claim.", expected: "IMPLICIT", relation: "MEASUREMENT", denialEffect: "BREAKS_RATIONALE", rationale: "The ranking relies on waiting time representing the aspect of service speed being judged." },
      { key: "BRANCH_WINDOWS_COMPARABLE", text: "The waiting-time figures come from sufficiently comparable service conditions or periods.", expected: "IMPLICIT", relation: "COMPARABILITY", denialEffect: "BREAKS_RATIONALE", rationale: "The branch ranking requires a meaningful comparison basis." },
      { key: "A_RATED_FASTER", text: "The review rates Branch A faster than Branch B.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "That ranking is explicit." },
      { key: "A_BETTER_IN_ALL_WAYS", text: "Branch A is superior to Branch B in every aspect of banking service.", expected: "NOT_IMPLICIT", misconception: "WRONG_SCOPE", rationale: "The claim is limited to counter-service speed." },
    ],
  },
  {
    scenarioId: "STA-EXT6-CROSS-TRAINING-SCORES", qlId: "STA-QL-006", sourceProfile: "CROSS_EXAM_DISCOVERY", sourceAuthorityId: "STA-EXT-SRC-010", discourseAct: "ASSERTION", difficulty: "Hard",
    statements: ["A workplace review says the trained group improved more because its score gain exceeded that of the comparison group on the same skills test.", "The report compares score gains on one skills test and concludes that the trained group improved more."],
    candidates: [
      { key: "TEST_MEASURES_TARGET_SKILL", text: "The test score is a relevant measure of the skill improvement being claimed.", expected: "IMPLICIT", relation: "MEASUREMENT", denialEffect: "BREAKS_RATIONALE", rationale: "The score difference supports the claim only if the test measures the target skill." },
      { key: "GROUPS_COMPARABLE_FOR_GAIN", text: "The two groups are sufficiently comparable for their score gains to be used in this conclusion.", expected: "IMPLICIT", relation: "COMPARABILITY", denialEffect: "BREAKS_RATIONALE", rationale: "Otherwise the difference in gains may not support the group comparison." },
      { key: "TRAINED_GAIN_HIGHER", text: "The trained group's reported score gain is higher.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "The observed difference is stated." },
      { key: "TRAINING_ONLY_CAUSE", text: "Training is the only possible cause of every score difference between the groups.", expected: "NOT_IMPLICIT", misconception: "CAUSE_EFFECT_OVERREACH", rationale: "The comparison does not require an exclusive-cause claim." },
    ],
  },
  {
    scenarioId: "STA-EXT6-CROSS-DIGITAL-SURVEY", qlId: "STA-QL-006", sourceProfile: "CROSS_EXAM_DISCOVERY", sourceAuthorityId: "STA-EXT-SRC-010", discourseAct: "ASSERTION", difficulty: "Hard",
    statements: ["A customer survey is used to claim that most regular users prefer digital receipts to printed receipts.", "The report generalises from its customer survey that digital receipts are preferred by most regular users."],
    candidates: [
      { key: "SURVEY_SAMPLE_RELEVANT", text: "The surveyed customers are sufficiently representative of the regular users covered by the claim.", expected: "IMPLICIT", relation: "REPRESENTATIVENESS", denialEffect: "BREAKS_RATIONALE", rationale: "Generalising from the sample to regular users requires a relevant sample-to-population bridge." },
      { key: "QUESTION_MEASURES_PREFERENCE", text: "The survey question or response used is a valid indicator of receipt preference.", expected: "IMPLICIT", relation: "MEASUREMENT", denialEffect: "BREAKS_RATIONALE", rationale: "The evidence must measure the preference the report claims." },
      { key: "REPORT_GENERALISES", text: "The report says most regular users prefer digital receipts.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "The generalised claim is explicit." },
      { key: "EVERY_USER_PREFERS_DIGITAL", text: "Every regular user prefers digital receipts.", expected: "NOT_IMPLICIT", misconception: "TOO_STRONG_QUANTIFIER", rationale: "A 'most' claim does not require a universal preference." },
    ],
  },
  {
    scenarioId: "STA-EXT6-PB-DEFECT-RATE-PERIOD", qlId: "STA-QL-006", sourceProfile: "PUNJAB_STATE", sourceAuthorityId: "STA-EXT-SRC-009", discourseAct: "ASSERTION", difficulty: "Medium",
    statements: ["A workshop reports fewer assembly defects this month because the measured defect rate fell from 4.8% to 3.1%.", "The workshop compares monthly defect rates and reports an improvement in assembly quality."],
    candidates: [
      { key: "DEFECT_DEFINITION_STABLE", text: "A defect is defined and counted on a sufficiently consistent basis in the two months.", expected: "IMPLICIT", relation: "MEASUREMENT", denialEffect: "BREAKS_RATIONALE", rationale: "A rate change supports improvement only if the measured event means roughly the same thing across periods." },
      { key: "PRODUCTION_SCOPE_COMPARABLE", text: "The production covered by the two rates is sufficiently comparable for the month-to-month claim.", expected: "IMPLICIT", relation: "COMPARABILITY", denialEffect: "BREAKS_RATIONALE", rationale: "The comparison presupposes aligned enough scope to interpret the rate change." },
      { key: "DEFECT_RATE_FELL", text: "The measured defect rate fell from 4.8% to 3.1%.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "The figures are explicit." },
      { key: "NO_DEFECTS_NEXT_MONTH", text: "There will be no assembly defects next month.", expected: "NOT_IMPLICIT", misconception: "CONCLUSION_OR_CONSEQUENCE", rationale: "The current comparison does not imply a zero future defect rate." },
    ],
  },
  {
    scenarioId: "STA-EXT6-PB-ATTENDANCE-PERIOD", qlId: "STA-QL-006", sourceProfile: "PUNJAB_STATE", sourceAuthorityId: "STA-EXT-SRC-009", discourseAct: "ASSERTION", difficulty: "Medium",
    statements: ["The school reports better attendance this term because the recorded attendance rate is higher than last term's rate.", "This term is rated better for attendance after comparing the school's term-wise attendance rates."],
    candidates: [
      { key: "ATTENDANCE_RECORDING_STABLE", text: "Attendance is recorded on a sufficiently consistent basis in the two terms.", expected: "IMPLICIT", relation: "MEASUREMENT", denialEffect: "BREAKS_RATIONALE", rationale: "The rates are comparable evidence only if attendance is counted consistently enough." },
      { key: "TERM_SCOPE_COMPARABLE", text: "The term-wise rates cover sufficiently comparable student/school scope for the claim.", expected: "IMPLICIT", relation: "COMPARABILITY", denialEffect: "BREAKS_RATIONALE", rationale: "The improvement claim relies on comparable scope." },
      { key: "THIS_TERM_RATE_HIGHER", text: "This term's recorded attendance rate is higher.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "That observation is stated." },
      { key: "EVERY_STUDENT_ATTENDS_MORE", text: "Every student attends more days this term.", expected: "NOT_IMPLICIT", misconception: "TOO_STRONG_QUANTIFIER", rationale: "An aggregate rate can rise without every individual increasing attendance." },
    ],
  },
  {
    scenarioId: "STA-EXT6-PB-BUS-PUNCTUALITY", qlId: "STA-QL-006", sourceProfile: "PUNJAB_STATE", sourceAuthorityId: "STA-EXT-SRC-009", discourseAct: "ASSERTION", difficulty: "Hard",
    statements: ["Using the share of trips arriving within five minutes of schedule, the review rates Route 12 more punctual than Route 18.", "A transport review compares on-time arrival percentages and calls Route 12 the more punctual service."],
    candidates: [
      { key: "ON_TIME_THRESHOLD_RELEVANT", text: "Arrival within the stated time window is a relevant measure of punctuality for this review.", expected: "IMPLICIT", relation: "MEASUREMENT", denialEffect: "BREAKS_RATIONALE", rationale: "The route ranking depends on the chosen threshold measuring punctuality meaningfully." },
      { key: "ROUTE_PERIODS_COMPARABLE", text: "The compared route data cover sufficiently comparable operating periods or conditions.", expected: "IMPLICIT", relation: "COMPARABILITY", denialEffect: "BREAKS_RATIONALE", rationale: "The ranking assumes the percentages are comparable enough to support it." },
      { key: "ROUTE12_RATED_MORE_PUNCTUAL", text: "Route 12 is rated more punctual than Route 18.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "The ranking is explicit." },
      { key: "ROUTE18_ALWAYS_LATE", text: "Route 18 is late on every trip.", expected: "NOT_IMPLICIT", misconception: "TOO_STRONG_QUANTIFIER", rationale: "A lower punctuality percentage does not mean every trip is late." },
    ],
  },
  {
    scenarioId: "STA-EXT6-CROSS-DELIVERY-TIME", qlId: "STA-QL-006", sourceProfile: "CROSS_EXAM_DISCOVERY", sourceAuthorityId: "STA-EXT-SRC-010", discourseAct: "ASSERTION", difficulty: "Medium",
    statements: ["A service report calls Team East faster because its median delivery time is lower than Team West's for the same order category.", "Median delivery time for the same order category is used to rank Team East faster than Team West."],
    candidates: [
      { key: "DELIVERY_TIME_RELEVANT", text: "Delivery time is a relevant measure of the service speed being compared.", expected: "IMPLICIT", relation: "MEASUREMENT", denialEffect: "BREAKS_RATIONALE", rationale: "The ranking relies on delivery time representing speed." },
      { key: "ORDER_CATEGORY_SCOPE_ALIGNED", text: "The compared deliveries belong to sufficiently similar order scope for the ranking.", expected: "IMPLICIT", relation: "COMPARABILITY", denialEffect: "BREAKS_RATIONALE", rationale: "The statement explicitly narrows to the same category, which must make the comparison meaningful." },
      { key: "EAST_MEDIAN_LOWER", text: "Team East's median delivery time is lower.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "The measured difference is explicit." },
      { key: "EAST_EVERY_ORDER_FASTER", text: "Every Team East delivery is faster than every Team West delivery.", expected: "NOT_IMPLICIT", misconception: "TOO_STRONG_QUANTIFIER", rationale: "A lower median does not require universal pairwise superiority." },
    ],
  },
  {
    scenarioId: "STA-EXT6-CROSS-APPLICATION-ERRORS", qlId: "STA-QL-006", sourceProfile: "CROSS_EXAM_DISCOVERY", sourceAuthorityId: "STA-EXT-SRC-010", discourseAct: "ASSERTION", difficulty: "Hard",
    statements: ["The portal reports fewer form errors after redesign because its error rate is lower than in the pre-redesign period.", "A before-and-after error-rate comparison is used to report improved form completion after the redesign."],
    candidates: [
      { key: "ERROR_DEFINITION_STABLE", text: "The error counted before and after redesign has a sufficiently consistent definition.", expected: "IMPLICIT", relation: "MEASUREMENT", denialEffect: "BREAKS_RATIONALE", rationale: "The rate change supports improvement only if the measured error remains comparable." },
      { key: "PERIOD_SCOPE_RELEVANT", text: "The compared periods cover sufficiently relevant application traffic for the before-and-after claim.", expected: "IMPLICIT", relation: "COMPARABILITY", denialEffect: "BREAKS_RATIONALE", rationale: "Otherwise the change in rate may not represent an improvement in the same process." },
      { key: "POST_RATE_LOWER", text: "The reported post-redesign error rate is lower.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "That observation is stated." },
      { key: "REDESIGN_ONLY_CAUSE", text: "The redesign is the only possible cause of every change in the error rate.", expected: "NOT_IMPLICIT", misconception: "CAUSE_EFFECT_OVERREACH", rationale: "The comparison does not require an exclusive-cause claim." },
    ],
  },
  {
    scenarioId: "STA-EXT6-PB-LIBRARY-SURVEY", qlId: "STA-QL-006", sourceProfile: "PUNJAB_STATE", sourceAuthorityId: "STA-EXT-SRC-009", discourseAct: "ASSERTION", difficulty: "Hard",
    statements: ["A member survey is used to claim that most regular library users prefer longer evening hours.", "The library generalises from a member survey that extended evening hours are preferred by most regular users."],
    candidates: [
      { key: "SAMPLE_REPRESENTS_REGULAR_USERS", text: "The surveyed members are sufficiently representative of the regular users named in the claim.", expected: "IMPLICIT", relation: "REPRESENTATIVENESS", denialEffect: "BREAKS_RATIONALE", rationale: "The generalisation needs a sample-to-population bridge." },
      { key: "QUESTION_MEASURES_HOUR_PREFERENCE", text: "The survey response used is a meaningful measure of preference for evening hours.", expected: "IMPLICIT", relation: "MEASUREMENT", denialEffect: "BREAKS_RATIONALE", rationale: "The evidence must measure the preference being claimed." },
      { key: "MOST_PREFER_LONGER_HOURS", text: "The library claims that most regular users prefer longer evening hours.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "The claim itself is explicit." },
      { key: "ALL_MEMBERS_RESPONDED", text: "Every library member responded to the survey.", expected: "NOT_IMPLICIT", misconception: "TOO_STRONG_QUANTIFIER", rationale: "Representative evidence does not require a census." },
    ],
  },
  {
    scenarioId: "STA-EXT6-CROSS-POWER-COMPARISON", qlId: "STA-QL-006", sourceProfile: "CROSS_EXAM_DISCOVERY", sourceAuthorityId: "STA-EXT-SRC-010", discourseAct: "ASSERTION", difficulty: "Medium",
    statements: ["The facility calls the new lighting setup more energy-efficient because monthly electricity use is lower for comparable operating hours.", "Electricity use over comparable operating hours is used to rate the new lighting setup more efficient."],
    candidates: [
      { key: "ELECTRICITY_USE_RELEVANT", text: "Electricity use is a relevant measure of the energy-efficiency claim.", expected: "IMPLICIT", relation: "MEASUREMENT", denialEffect: "BREAKS_RATIONALE", rationale: "The efficiency conclusion relies on electricity use measuring the property being compared." },
      { key: "OPERATING_SCOPE_COMPARABLE", text: "The old and new usage figures cover sufficiently comparable operating conditions.", expected: "IMPLICIT", relation: "COMPARABILITY", denialEffect: "BREAKS_RATIONALE", rationale: "A lower total supports efficiency only under a meaningful comparison basis." },
      { key: "NEW_USE_LOWER", text: "The new setup has lower measured electricity use for the compared hours.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "That observation is explicit." },
      { key: "NEW_LIGHTS_CHEAPEST", text: "The new lights are the cheapest lights available in the market.", expected: "NOT_IMPLICIT", misconception: "RELATED_BUT_IRRELEVANT", rationale: "Purchase price is not required by the stated energy-efficiency comparison." },
    ],
  },
  {
    scenarioId: "STA-EXT6-SSC-PRACTICE-TEST", qlId: "STA-QL-006", sourceProfile: "SSC", sourceAuthorityId: "STA-EXT-SRC-006", discourseAct: "ASSERTION", difficulty: "Hard",
    statements: ["A coaching review says the second practice round shows improvement because average scores rose on tests designed to the same difficulty standard.", "Average scores on equally standardised practice tests are compared to report improvement in the second round."],
    candidates: [
      { key: "TESTS_COMPARABLE_DIFFICULTY", text: "The two practice tests are sufficiently comparable in difficulty for the score comparison.", expected: "IMPLICIT", relation: "COMPARABILITY", denialEffect: "BREAKS_RATIONALE", rationale: "A score rise supports improvement only if test difficulty is sufficiently aligned." },
      { key: "SCORE_MEASURES_TARGET_PERFORMANCE", text: "The score is a relevant measure of the performance improvement being claimed.", expected: "IMPLICIT", relation: "MEASUREMENT", denialEffect: "BREAKS_RATIONALE", rationale: "The conclusion depends on the chosen score measuring the target performance." },
      { key: "AVERAGE_SCORE_ROSE", text: "The average score rose in the second practice round.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "The score rise is stated." },
      { key: "EVERY_STUDENT_IMPROVED", text: "Every student scored higher in the second round.", expected: "NOT_IMPLICIT", misconception: "TOO_STRONG_QUANTIFIER", rationale: "An average can rise without universal individual improvement." },
    ],
  },
  {
    scenarioId: "STA-EXT6-BANK-COMPLAINT-RATE", qlId: "STA-QL-006", sourceProfile: "BANKING", sourceAuthorityId: "STA-EXT-SRC-007", discourseAct: "ASSERTION", difficulty: "Hard",
    statements: ["The bank says service complaints fell because complaints per 1,000 transactions are lower this quarter than last quarter.", "Quarterly complaints per 1,000 transactions are compared and the bank reports an improvement."],
    candidates: [
      { key: "COMPLAINT_DEFINITION_STABLE", text: "Complaints are classified on a sufficiently consistent basis in both quarters.", expected: "IMPLICIT", relation: "MEASUREMENT", denialEffect: "BREAKS_RATIONALE", rationale: "A rate comparison requires the counted event to retain a comparable meaning." },
      { key: "TRANSACTION_NORMALIZATION_RELEVANT", text: "Complaints per 1,000 transactions is a relevant way to compare complaint incidence across the two quarters.", expected: "IMPLICIT", relation: "MEASUREMENT", denialEffect: "BREAKS_RATIONALE", rationale: "The conclusion relies on the normalised rate being an appropriate comparison measure." },
      { key: "RATE_LOWER_THIS_QUARTER", text: "The complaints-per-transaction rate is lower this quarter.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "That measured difference is explicit." },
      { key: "TOTAL_TRANSACTIONS_EQUAL", text: "The bank processed exactly the same number of transactions in both quarters.", expected: "NOT_IMPLICIT", misconception: "SUPPORTIVE_NOT_NECESSARY", rationale: "Rate normalisation does not require equal transaction totals." },
    ],
  },
  {
    scenarioId: "STA-EXT6-SSC-SERVICE-RATING", qlId: "STA-QL-006", sourceProfile: "SSC", sourceAuthorityId: "STA-EXT-SRC-006", discourseAct: "ASSERTION", difficulty: "Medium",
    statements: ["The public counter is rated easier to use after its task-completion time fell on the same set of routine service tasks.", "Completion time on the same routine tasks is used to report that the redesigned counter is easier to use."],
    candidates: [
      { key: "COMPLETION_TIME_RELEVANT_USABILITY", text: "Task-completion time is a relevant indicator of ease of use for the limited claim being made.", expected: "IMPLICIT", relation: "MEASUREMENT", denialEffect: "BREAKS_RATIONALE", rationale: "The usability claim relies on completion time carrying relevant evidential meaning." },
      { key: "TASK_SET_COMPARABLE", text: "The task set is sufficiently comparable before and after the redesign.", expected: "IMPLICIT", relation: "COMPARABILITY", denialEffect: "BREAKS_RATIONALE", rationale: "The before-and-after result needs aligned task scope." },
      { key: "TIME_FELL", text: "Task-completion time fell after the redesign.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "The measured change is stated." },
      { key: "EVERY_USER_PREFERS_NEW", text: "Every user prefers the redesigned counter.", expected: "NOT_IMPLICIT", misconception: "TOO_STRONG_QUANTIFIER", rationale: "The limited usability rating does not require universal preference." },
    ],
  },
  {
    scenarioId: "STA-EXT6-BANK-SAMPLE-QUEUE", qlId: "STA-QL-006", sourceProfile: "BANKING", sourceAuthorityId: "STA-EXT-SRC-007", discourseAct: "ASSERTION", difficulty: "Hard",
    statements: ["From observations on sampled weekdays, the review concludes that the branch's typical lunchtime queue is shorter after the staffing change.", "A sample of weekday lunchtime observations is used to generalise that typical queues have shortened."],
    candidates: [
      { key: "SAMPLED_DAYS_REPRESENT_TYPICAL", text: "The sampled weekdays are sufficiently representative of the typical lunchtime conditions covered by the claim.", expected: "IMPLICIT", relation: "REPRESENTATIVENESS", denialEffect: "BREAKS_RATIONALE", rationale: "The generalisation needs the observed days to represent the stated typical period." },
      { key: "QUEUE_LENGTH_MEASURE_STABLE", text: "Queue length is observed on a sufficiently consistent basis before and after the staffing change.", expected: "IMPLICIT", relation: "MEASUREMENT", denialEffect: "BREAKS_RATIONALE", rationale: "The comparison depends on consistent measurement of queue length." },
      { key: "REVIEW_CONCLUDES_SHORTER", text: "The review concludes that typical lunchtime queues are shorter.", expected: "NOT_IMPLICIT", explicit: true, misconception: "EXPLICIT_RESTATEMENT", rationale: "The conclusion is explicit." },
      { key: "EVERY_DAY_OBSERVED", text: "Every working day was observed in the review.", expected: "NOT_IMPLICIT", misconception: "TOO_STRONG_QUANTIFIER", rationale: "A representative sample need not include every day." },
    ],
  },
];

export const STA_SEMANTIC_EXTENSION_V3_QL005 = QL005_SPECS.map(makeScenario);
export const STA_SEMANTIC_EXTENSION_V3_QL006 = QL006_SPECS.map(makeScenario);

export const STA_SEMANTIC_EXTENSION_V3_AUTHORITIES: readonly StaExtensionScenarioAuthority[] = [
  ...STA_SEMANTIC_EXTENSION_V3_QL005,
  ...STA_SEMANTIC_EXTENSION_V3_QL006,
];

export const STA_SEMANTIC_EXTENSION_V3_BY_QL: Readonly<Record<StaExtensionQlId, readonly StaExtensionScenarioAuthority[]>> = {
  "STA-QL-005": STA_SEMANTIC_EXTENSION_V3_QL005,
  "STA-QL-006": STA_SEMANTIC_EXTENSION_V3_QL006,
};

export const STA_SEMANTIC_EXTENSION_V3_SOURCE_EVIDENCE_COUNTS = Object.freeze(
  STA_SEMANTIC_EXTENSION_V3_AUTHORITIES.reduce<Record<StaExtensionEvidenceClass, number>>((counts, scenario) => {
    const evidenceClass = sourceById(scenario.sourceAuthorityId).evidenceClass;
    counts[evidenceClass] += 1;
    return counts;
  }, {
    DIRECT_PYQ: 0,
    MEMORY_BASED_PYQ: 0,
    TARGET_EXAM_PREP_PATTERN: 0,
    CONTROLLED_SYNTHESIS: 0,
  }),
);
