export type PolCp006Sourced = { sourceIds: readonly string[]; sourceFactIds: readonly string[] };
const C = "LEGISLATIVE-DEPT-CONSTITUTION-2025";
const K = "SCI-KESAVANANDA-1973";
const B = "SCI-BASIC-STRUCTURE-2022";
const J24 = "SCI-ARTICLE31C-2024";
const A106 = "CONSTITUTION-106TH-AMENDMENT-2023";
const src = (id: string, sourceIds: readonly string[] = [C]) => ({ sourceIds, sourceFactIds: [id] as const });

export const POL_CP006_ARTICLE368_V1 = Object.freeze({
  article: "368",
  subject: "Power of Parliament to amend the Constitution and procedure therefor",
  initiation: "A Constitution Amendment Bill may be introduced in either House of Parliament.",
  specialMajority: "Each House must pass the Bill by a majority of its total membership and by at least two-thirds of the members present and voting.",
  stateRatification: "For specified federal provisions, ratification by the legislatures of not less than one-half of the States is also required.",
  jointSitting: "There is no provision for a joint sitting to pass a Constitution Amendment Bill.",
  presidentialAssent: "After a Constitution Amendment Bill is duly passed, it is presented to the President, who shall give assent.",
  sourceIds: [C] as const,
  sourceFactIds: ["pol-cp006-article368-procedure"] as const,
});

export const POL_CP006_RATIFICATION_AREAS_V1 = Object.freeze([
  "Election of the President under Articles 54 and 55",
  "Extent of executive power of the Union and the States under Articles 73 and 162",
  "Specified Supreme Court and High Court provisions",
  "Distribution of legislative powers between the Union and the States",
  "Any of the Lists in the Seventh Schedule",
  "Representation of States in Parliament",
  "Article 368 itself",
]);

export const POL_CP006_BASIC_STRUCTURE_FEATURES_V1 = Object.freeze([
  "Supremacy of the Constitution",
  "Republican and democratic form of government",
  "Secular character of the Constitution",
  "Separation of powers",
  "Federal character of the Constitution",
  "Judicial review",
  "Limited amending power of Parliament",
  "Harmony and balance between Fundamental Rights and Directive Principles",
]);

export const POL_CP006_BASIC_STRUCTURE_CASES_V1 = Object.freeze([
  { caseName: "Kesavananda Bharati v. State of Kerala", year: 1973, principle: "Parliament may amend the Constitution, but it cannot destroy or damage its basic structure.", ...src("pol-cp006-case-kesavananda", [K]) },
  { caseName: "Minerva Mills v. Union of India", year: 1980, principle: "Limited amending power and harmony between Fundamental Rights and Directive Principles are part of the basic structure.", ...src("pol-cp006-case-minerva", [B, J24]) },
  { caseName: "S. R. Bommai v. Union of India", year: 1994, principle: "Secularism is part of the basic structure of the Constitution.", ...src("pol-cp006-case-bommai", [B]) },
  { caseName: "I. R. Coelho v. State of Tamil Nadu", year: 2007, principle: "Post-24 April 1973 Ninth Schedule insertions remain open to basic-structure review where constitutionally relevant rights are damaged.", ...src("pol-cp006-case-coelho", [B]) },
]);

export const POL_CP006_SCHEDULES_V1 = Object.freeze([
  { schedule: "First Schedule", subject: "States and Union territories", detail: "Names and territorial extent of States and Union territories", ...src("pol-cp006-schedule-1") },
  { schedule: "Second Schedule", subject: "Emoluments, allowances and privileges of specified constitutional offices", detail: "Includes provisions relating to offices such as the President, Governors, presiding officers, judges and the CAG", ...src("pol-cp006-schedule-2") },
  { schedule: "Third Schedule", subject: "Forms of oaths and affirmations", detail: "Oaths and affirmations for ministers, legislators, judges and other constitutional offices", ...src("pol-cp006-schedule-3") },
  { schedule: "Fourth Schedule", subject: "Allocation of seats in the Council of States", detail: "Allocation of Rajya Sabha seats to States and Union territories", ...src("pol-cp006-schedule-4") },
  { schedule: "Fifth Schedule", subject: "Administration and control of Scheduled Areas and Scheduled Tribes", detail: "Scheduled Areas and Scheduled Tribes outside the Sixth Schedule tribal-area framework", ...src("pol-cp006-schedule-5") },
  { schedule: "Sixth Schedule", subject: "Administration of tribal areas in Assam, Meghalaya, Tripura and Mizoram", detail: "Autonomous district and regional council framework for specified tribal areas", ...src("pol-cp006-schedule-6") },
  { schedule: "Seventh Schedule", subject: "Union, State and Concurrent Lists", detail: "Distribution of legislative subjects through the three legislative Lists", ...src("pol-cp006-schedule-7") },
  { schedule: "Eighth Schedule", subject: "Recognised languages", detail: "Contains 22 languages", ...src("pol-cp006-schedule-8") },
  { schedule: "Ninth Schedule", subject: "Acts and Regulations placed in a special constitutional schedule", detail: "Originally associated with protecting specified laws; post-Kesavananda insertions are subject to basic-structure review under Supreme Court doctrine", ...src("pol-cp006-schedule-9", [C, B]) },
  { schedule: "Tenth Schedule", subject: "Anti-defection provisions", detail: "Disqualification on grounds of defection", ...src("pol-cp006-schedule-10") },
  { schedule: "Eleventh Schedule", subject: "Panchayats", detail: "Contains 29 subjects connected with Panchayats", ...src("pol-cp006-schedule-11") },
  { schedule: "Twelfth Schedule", subject: "Municipalities", detail: "Contains 18 subjects connected with Municipalities", ...src("pol-cp006-schedule-12") },
]);

export const POL_CP006_HIGH_YIELD_AMENDMENTS_V1 = Object.freeze([
  { amendment: "First Amendment", year: 1951, change: "Inserted Articles 31A and 31B and added the Ninth Schedule among other changes", ...src("pol-cp006-amendment-1") },
  { amendment: "Seventh Amendment", year: 1956, change: "Major constitutional changes connected with reorganisation of States", ...src("pol-cp006-amendment-7") },
  { amendment: "Twenty-fourth Amendment", year: 1971, change: "Affirmed Parliament's constituent power to amend the Constitution and made presidential assent to a duly passed amendment Bill mandatory", ...src("pol-cp006-amendment-24") },
  { amendment: "Forty-second Amendment", year: 1976, change: "Wide-ranging amendment; added Socialist, Secular and Integrity to the Preamble, Fundamental Duties and several Directive Principle changes", ...src("pol-cp006-amendment-42") },
  { amendment: "Forty-fourth Amendment", year: 1978, change: "Reversed or modified several Forty-second Amendment-era changes and shifted the right to property out of Fundamental Rights", ...src("pol-cp006-amendment-44") },
  { amendment: "Fifty-second Amendment", year: 1985, change: "Added the Tenth Schedule on anti-defection", ...src("pol-cp006-amendment-52") },
  { amendment: "Sixty-first Amendment", year: 1989, change: "Reduced the voting age for Lok Sabha and State Assembly elections from 21 to 18 years", ...src("pol-cp006-amendment-61") },
  { amendment: "Seventy-third Amendment", year: 1992, change: "Added Part IX and the Eleventh Schedule for Panchayats", ...src("pol-cp006-amendment-73") },
  { amendment: "Seventy-fourth Amendment", year: 1992, change: "Added Part IXA and the Twelfth Schedule for Municipalities", ...src("pol-cp006-amendment-74") },
  { amendment: "Eighty-sixth Amendment", year: 2002, change: "Inserted Article 21A, changed Article 45 and added Fundamental Duty 51A(k)", ...src("pol-cp006-amendment-86") },
  { amendment: "Ninety-first Amendment", year: 2003, change: "Limited the size of Councils of Ministers and strengthened anti-defection-related provisions", ...src("pol-cp006-amendment-91") },
  { amendment: "One Hundred and First Amendment", year: 2016, change: "Introduced the constitutional framework for the Goods and Services Tax", ...src("pol-cp006-amendment-101") },
  { amendment: "One Hundred and Third Amendment", year: 2019, change: "Provided for reservation for economically weaker sections under the constitutional framework", ...src("pol-cp006-amendment-103") },
  { amendment: "One Hundred and Sixth Amendment", year: 2023, change: "Provides for reservation of one-third of seats for women in the Lok Sabha, State Legislative Assemblies and the Legislative Assembly of the National Capital Territory of Delhi, subject to its constitutional commencement and delimitation framework", ...src("pol-cp006-amendment-106", [C, A106]) },
]);
