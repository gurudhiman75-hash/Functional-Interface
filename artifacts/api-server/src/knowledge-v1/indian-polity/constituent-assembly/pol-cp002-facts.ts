export type PolCp002MilestoneRow = {
  id: string;
  date: string;
  displayDate: string;
  event: string;
  detail: string;
  sequenceRank: number;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export type PolCp002RoleRow = {
  id: string;
  person: string;
  role: string;
  detail: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export type PolCp002CommitteeRow = {
  id: string;
  committee: string;
  chair: string;
  function: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export type PolCp002CompositionRow = {
  id: string;
  label: string;
  value: string;
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export type PolCp002InfluenceRow = {
  id: string;
  feature: string;
  source: string;
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export const POL_CP002_MILESTONES_V1: readonly PolCp002MilestoneRow[] = Object.freeze([
  {
    id: "first-sitting",
    date: "1946-12-09",
    displayDate: "9 December 1946",
    event: "The Constituent Assembly met for the first time",
    detail: "The first sitting was held in Constitution Hall, New Delhi.",
    sequenceRank: 1,
    sourceIds: ["COI-CAD-1946-12-09"],
    sourceFactIds: ["pol-cp002-first-sitting-1946-12-09"],
  },
  {
    id: "rajendra-prasad-president",
    date: "1946-12-11",
    displayDate: "11 December 1946",
    event: "Rajendra Prasad was elected permanent President of the Constituent Assembly",
    detail: "He succeeded the temporary chairmanship used for the opening sitting.",
    sequenceRank: 2,
    sourceIds: ["PARLIAMENT-RAJENDRA-PRASAD-EP"],
    sourceFactIds: ["pol-cp002-rajendra-prasad-elected-president"],
  },
  {
    id: "objectives-moved",
    date: "1946-12-13",
    displayDate: "13 December 1946",
    event: "Jawaharlal Nehru moved the Objectives Resolution",
    detail: "The Resolution set out foundational aims for the future Constitution.",
    sequenceRank: 3,
    sourceIds: ["COI-CAD-1946-12-13", "PARLIAMENT-OBJECTIVES-RESOLUTION"],
    sourceFactIds: ["pol-cp002-objectives-resolution-moved"],
  },
  {
    id: "objectives-adopted",
    date: "1947-01-22",
    displayDate: "22 January 1947",
    event: "The Constituent Assembly adopted the Objectives Resolution",
    detail: "The Resolution was adopted after debate and later informed the constitutional philosophy reflected in the Preamble.",
    sequenceRank: 4,
    sourceIds: ["PARLIAMENT-OBJECTIVES-RESOLUTION"],
    sourceFactIds: ["pol-cp002-objectives-resolution-adopted"],
  },
  {
    id: "drafting-committee-appointed",
    date: "1947-08-29",
    displayDate: "29 August 1947",
    event: "The Constituent Assembly appointed the Drafting Committee",
    detail: "The initial committee consisted of seven members and was tasked with scrutinising and revising the constitutional draft.",
    sequenceRank: 5,
    sourceIds: ["COI-CAD-1947-08-29"],
    sourceFactIds: ["pol-cp002-drafting-committee-appointed"],
  },
  {
    id: "draft-submitted",
    date: "1948-02-21",
    displayDate: "21 February 1948",
    event: "The Drafting Committee submitted the Draft Constitution to the President of the Constituent Assembly",
    detail: "The 1948 Draft contained 315 Articles and 8 Schedules.",
    sequenceRank: 6,
    sourceIds: ["COI-DRAFT-1948-02-21"],
    sourceFactIds: ["pol-cp002-draft-submitted-1948-02-21"],
  },
  {
    id: "constitution-adopted",
    date: "1949-11-26",
    displayDate: "26 November 1949",
    event: "The Constituent Assembly adopted the Constitution of India",
    detail: "The Preamble records that the Constitution was adopted, enacted and given to the people on this date.",
    sequenceRank: 7,
    sourceIds: ["LEGISLATIVE-DEPT-CONSTITUTION", "BOMBAY-HC-CAD-READY-RECKONER"],
    sourceFactIds: ["pol-cp002-constitution-adopted-1949-11-26"],
  },
  {
    id: "constitution-signed",
    date: "1950-01-24",
    displayDate: "24 January 1950",
    event: "Members of the Constituent Assembly signed the Constitution",
    detail: "The official ready reckoner records 284 members as having signed the Constitution.",
    sequenceRank: 8,
    sourceIds: ["BOMBAY-HC-CAD-READY-RECKONER"],
    sourceFactIds: ["pol-cp002-constitution-signed-1950-01-24", "pol-cp002-signatories-284"],
  },
  {
    id: "constitution-commenced",
    date: "1950-01-26",
    displayDate: "26 January 1950",
    event: "The Constitution of India came into force in full",
    detail: "Article 394 fixed 26 January 1950 as the commencement date for the remaining provisions not brought into force earlier.",
    sequenceRank: 9,
    sourceIds: ["LEGISLATIVE-DEPT-CONSTITUTION", "BOMBAY-HC-CAD-READY-RECKONER"],
    sourceFactIds: ["pol-cp002-constitution-commenced-1950-01-26"],
  },
]);

export const POL_CP002_ROLE_ROWS_V1: readonly PolCp002RoleRow[] = Object.freeze([
  {
    id: "sachchidananda-sinha",
    person: "Sachchidananda Sinha",
    role: "Temporary Chairman of the Constituent Assembly at its first sitting",
    detail: "He presided over the opening sitting on 9 December 1946.",
    sourceIds: ["COI-CAD-1946-12-09"],
    sourceFactIds: ["pol-cp002-sinha-temporary-chairman"],
  },
  {
    id: "rajendra-prasad",
    person: "Rajendra Prasad",
    role: "Permanent President of the Constituent Assembly",
    detail: "He was elected to the permanent chair on 11 December 1946.",
    sourceIds: ["PARLIAMENT-RAJENDRA-PRASAD-EP"],
    sourceFactIds: ["pol-cp002-rajendra-prasad-president"],
  },
  {
    id: "bn-rau",
    person: "B. N. Rau",
    role: "Constitutional Adviser to the Constituent Assembly",
    detail: "He prepared a rough draft for consideration by the Drafting Committee.",
    sourceIds: ["PARLIAMENT-BN-RAU-ACKNOWLEDGEMENT"],
    sourceFactIds: ["pol-cp002-bn-rau-constitutional-adviser"],
  },
  {
    id: "br-ambedkar",
    person: "B. R. Ambedkar",
    role: "Chairman of the Drafting Committee",
    detail: "The Drafting Committee gave legal form to the Assembly's decisions and scrutinised the constitutional draft.",
    sourceIds: ["COI-CAD-1947-08-29", "PARLIAMENT-BN-RAU-ACKNOWLEDGEMENT"],
    sourceFactIds: ["pol-cp002-ambedkar-drafting-chair"],
  },
  {
    id: "jawaharlal-nehru-objectives",
    person: "Jawaharlal Nehru",
    role: "Mover of the Objectives Resolution",
    detail: "He moved the Resolution on 13 December 1946.",
    sourceIds: ["COI-CAD-1946-12-13"],
    sourceFactIds: ["pol-cp002-nehru-objectives-resolution"],
  },
]);

export const POL_CP002_COMMITTEE_ROWS_V1: readonly PolCp002CommitteeRow[] = Object.freeze([
  {
    id: "drafting-committee",
    committee: "Drafting Committee",
    chair: "B. R. Ambedkar",
    function: "scrutinising and revising the constitutional draft in light of the Assembly's decisions",
    sourceIds: ["COI-CAD-1947-08-29"],
    sourceFactIds: ["pol-cp002-drafting-committee-chair"],
  },
  {
    id: "union-powers-committee",
    committee: "Union Powers Committee",
    chair: "Jawaharlal Nehru",
    function: "examining the subjects and powers to be assigned to the Union",
    sourceIds: ["COI-COMMITTEE-UNION-POWERS"],
    sourceFactIds: ["pol-cp002-union-powers-committee-chair"],
  },
  {
    id: "union-constitution-committee",
    committee: "Union Constitution Committee",
    chair: "Jawaharlal Nehru",
    function: "reporting on the principles of the Union Constitution",
    sourceIds: ["COI-COMMITTEE-UNION-CONSTITUTION"],
    sourceFactIds: ["pol-cp002-union-constitution-committee-chair"],
  },
  {
    id: "provincial-constitution-committee",
    committee: "Provincial Constitution Committee",
    chair: "Vallabhbhai Patel",
    function: "reporting on the principles of a model provincial constitution",
    sourceIds: ["COI-COMMITTEE-PROVINCIAL-CONSTITUTION"],
    sourceFactIds: ["pol-cp002-provincial-constitution-committee-chair"],
  },
  {
    id: "advisory-committee",
    committee: "Advisory Committee on Fundamental Rights, Minorities and Tribal and Excluded Areas",
    chair: "Vallabhbhai Patel",
    function: "examining fundamental rights, minority safeguards and tribal/excluded-area questions",
    sourceIds: ["CAD-1947-04-29-ADVISORY-COMMITTEE"],
    sourceFactIds: ["pol-cp002-advisory-committee-chair"],
  },
]);

export const POL_CP002_COMPOSITION_ROWS_V1: readonly PolCp002CompositionRow[] = Object.freeze([
  {
    id: "initial-strength",
    label: "Initial total strength under the Cabinet Mission scheme",
    value: "389",
    explanation: "The planned Constituent Assembly was a 389-member body.",
    sourceIds: ["UK-HANSARD-CABINET-MISSION-1946-05-16"],
    sourceFactIds: ["pol-cp002-initial-strength-389"],
  },
  {
    id: "british-india-seats",
    label: "Seats assigned to British India",
    value: "296",
    explanation: "The British Indian component totalled 296 seats under the Cabinet Mission scheme.",
    sourceIds: ["UK-HANSARD-CABINET-MISSION-1946-05-16"],
    sourceFactIds: ["pol-cp002-british-india-seats-296"],
  },
  {
    id: "princely-state-seats",
    label: "Seats allotted to the princely states",
    value: "93",
    explanation: "Ninety-three seats were allotted to the Indian States.",
    sourceIds: ["UK-HANSARD-CABINET-MISSION-1946-05-16"],
    sourceFactIds: ["pol-cp002-princely-state-seats-93"],
  },
  {
    id: "sessions",
    label: "Sessions held by the Constituent Assembly during constitution-making",
    value: "11",
    explanation: "The Assembly held 11 sessions while completing the Constitution-making task.",
    sourceIds: ["BOMBAY-HC-CAD-READY-RECKONER"],
    sourceFactIds: ["pol-cp002-sessions-11"],
  },
  {
    id: "sitting-days",
    label: "Sitting days recorded in the Bombay High Court ready reckoner",
    value: "165",
    explanation: "The ready reckoner records 165 sitting days, of which 114 were spent considering the Draft Constitution.",
    sourceIds: ["BOMBAY-HC-CAD-READY-RECKONER"],
    sourceFactIds: ["pol-cp002-sitting-days-165"],
  },
  {
    id: "draft-days",
    label: "Days spent considering the Draft Constitution",
    value: "114",
    explanation: "Of the 165 sitting days in this count, 114 were devoted to consideration of the Draft Constitution.",
    sourceIds: ["BOMBAY-HC-CAD-READY-RECKONER"],
    sourceFactIds: ["pol-cp002-draft-consideration-days-114"],
  },
  {
    id: "draft-articles",
    label: "Articles in the Draft Constitution submitted on 21 February 1948",
    value: "315",
    explanation: "The 1948 Draft submitted by the Drafting Committee contained 315 Articles and 8 Schedules.",
    sourceIds: ["COI-DRAFT-1948-02-21"],
    sourceFactIds: ["pol-cp002-draft-articles-315"],
  },
  {
    id: "original-articles",
    label: "Articles in the Constitution at commencement",
    value: "395",
    explanation: "The original Constitution contained 395 Articles and 8 Schedules.",
    sourceIds: ["IGNOU-MHI09-BLOCK8"],
    sourceFactIds: ["pol-cp002-original-articles-395"],
  },
  {
    id: "signatories",
    label: "Members who signed the Constitution on 24 January 1950",
    value: "284",
    explanation: "The official ready reckoner records 284 members as having signed the Constitution.",
    sourceIds: ["BOMBAY-HC-CAD-READY-RECKONER"],
    sourceFactIds: ["pol-cp002-signatories-284"],
  },
]);

export const POL_CP002_INFLUENCE_ROWS_V1: readonly PolCp002InfluenceRow[] = Object.freeze([
  {
    id: "uk-parliamentary",
    feature: "Parliamentary system of government",
    source: "British constitutional practice",
    explanation: "India adapted the parliamentary system from the British constitutional model.",
    sourceIds: ["IGNOU-MHI09-BLOCK8"],
    sourceFactIds: ["pol-cp002-influence-uk-parliamentary"],
  },
  {
    id: "us-fundamental-rights",
    feature: "Fundamental Rights",
    source: "United States Constitution",
    explanation: "The chapter on Fundamental Rights drew major inspiration from the United States Constitution.",
    sourceIds: ["IGNOU-MHI09-BLOCK8"],
    sourceFactIds: ["pol-cp002-influence-us-fundamental-rights"],
  },
  {
    id: "ireland-dpsp",
    feature: "Directive Principles of State Policy",
    source: "Irish Constitution",
    explanation: "The Directive Principles were adapted from the Irish constitutional model.",
    sourceIds: ["IGNOU-MHI09-BLOCK8"],
    sourceFactIds: ["pol-cp002-influence-ireland-dpsp"],
  },
  {
    id: "goi1935-federal-admin",
    feature: "Federal and administrative framework",
    source: "Government of India Act, 1935",
    explanation: "The 1935 Act supplied substantial federal and administrative working material for the Constitution.",
    sourceIds: ["IGNOU-MHI09-BLOCK8"],
    sourceFactIds: ["pol-cp002-influence-goi1935-framework"],
  },
]);

export const POL_CP002_ELECTION_METHOD_V1 = Object.freeze({
  id: "provincial-election-method",
  question: "How were provincial representatives to the Constituent Assembly chosen under the Cabinet Mission Plan?",
  answer: "By Provincial Legislative Assemblies using proportional representation by the single transferable vote",
  explanation: "The Cabinet Mission Plan used the existing Provincial Legislative Assemblies as electoral bodies and prescribed proportional representation with the single transferable vote for provincial representatives.",
  sourceIds: ["UK-HANSARD-CABINET-MISSION-1946-05-16"],
  sourceFactIds: ["pol-cp002-provincial-election-pr-stv"],
});
