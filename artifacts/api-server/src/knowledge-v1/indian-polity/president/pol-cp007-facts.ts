export type PolCp007Sourced = { sourceIds: readonly string[]; sourceFactIds: readonly string[] };
export type PolCp007ArticleRow = PolCp007Sourced & { article: string; subject: string; rule: string };

const C = "LEGISLATIVE-DEPT-CONSTITUTION-2025";
const src = (id: string) => ({ sourceIds: [C] as const, sourceFactIds: [id] as const });

export const POL_CP007_ARTICLES_V1: readonly PolCp007ArticleRow[] = Object.freeze([
  { article: "52", subject: "President of India", rule: "Article 52 provides that there shall be a President of India.", ...src("pol-cp007-a52") },
  { article: "53", subject: "Executive power of the Union", rule: "Article 53 vests the executive power of the Union in the President and also vests the supreme command of the Defence Forces in the President, subject to the Constitution and law.", ...src("pol-cp007-a53") },
  { article: "54", subject: "Election of the President", rule: "Article 54 creates the presidential electoral college: elected members of both Houses of Parliament and elected members of the Legislative Assemblies of the States. For Articles 54 and 55, State includes Delhi and Puducherry.", ...src("pol-cp007-a54") },
  { article: "55", subject: "Manner of election of the President", rule: "Article 55 provides proportional representation by means of the single transferable vote and secret ballot, while seeking uniformity among States and parity between States as a whole and the Union.", ...src("pol-cp007-a55") },
  { article: "56", subject: "Term of office of President", rule: "The President normally holds office for five years, may resign by writing to the Vice-President, and continues until the successor enters office.", ...src("pol-cp007-a56") },
  { article: "57", subject: "Eligibility for re-election", rule: "A person who holds or has held office as President is eligible for re-election, subject to the Constitution.", ...src("pol-cp007-a57") },
  { article: "58", subject: "Qualifications for election as President", rule: "A candidate must be an Indian citizen, at least 35 years old, qualified for election to the House of the People, and must not hold a disqualifying office of profit.", ...src("pol-cp007-a58") },
  { article: "59", subject: "Conditions of President's office", rule: "The President cannot remain a member of Parliament or a State Legislature and cannot hold another office of profit. A legislator elected President vacates that seat on entering office.", ...src("pol-cp007-a59") },
  { article: "60", subject: "Oath or affirmation by the President", rule: "The President takes the oath before the Chief Justice of India or, in the Chief Justice's absence, the senior-most available Supreme Court judge.", ...src("pol-cp007-a60") },
  { article: "61", subject: "Impeachment of the President", rule: "Either House may prefer a charge of violation of the Constitution. The initiating resolution requires at least 14 days' written notice signed by at least one-fourth of the total members and must pass by at least two-thirds of the total membership. The other House investigates and also needs at least two-thirds of its total membership to sustain the charge and remove the President.", ...src("pol-cp007-a61") },
  { article: "62", subject: "Election to fill a vacancy in the office of President", rule: "A casual vacancy must be filled as soon as possible and no later than six months. The person elected to a casual vacancy gets a full five-year term from entering office.", ...src("pol-cp007-a62") },
  { article: "71", subject: "Disputes relating to President or Vice-President elections", rule: "All doubts and disputes connected with the election of the President or Vice-President are decided by the Supreme Court, whose decision is final.", ...src("pol-cp007-a71") },
  { article: "72", subject: "President's clemency powers", rule: "Article 72 allows pardons, reprieves, respites, remissions, suspension, remission or commutation in specified cases, including Court Martial cases, Union-law offences and death sentences.", ...src("pol-cp007-a72") },
  { article: "74", subject: "Council of Ministers to aid and advise the President", rule: "The President acts on the aid and advice of the Council of Ministers. The President may once require reconsideration, but must act according to the advice given after reconsideration.", ...src("pol-cp007-a74") },
  { article: "85", subject: "Sessions of Parliament, prorogation and dissolution", rule: "Article 85 empowers the President to summon each House, prorogue the Houses and dissolve the House of the People, subject to the constitutional system of responsible government.", ...src("pol-cp007-a85") },
  { article: "111", subject: "President's assent to Bills", rule: "When a Bill is presented, the President may assent or withhold assent. A non-Money Bill may be returned for reconsideration; if Parliament passes it again and presents it, the President cannot withhold assent.", ...src("pol-cp007-a111") },
  { article: "123", subject: "President's Ordinance-making power", rule: "When both Houses of Parliament are not in session at the same time and immediate action is considered necessary, the President may promulgate an Ordinance. It has the force of an Act but must be laid before Parliament and normally ceases six weeks after Parliament reassembles unless ended earlier.", ...src("pol-cp007-a123") },
]);

export const POL_CP007_ELECTORAL_COLLEGE_V1 = Object.freeze({
  included: [
    "Elected members of the Lok Sabha",
    "Elected members of the Rajya Sabha",
    "Elected members of State Legislative Assemblies",
    "Elected members of the Legislative Assemblies of Delhi and Puducherry",
  ],
  excluded: [
    "Nominated members of Parliament",
    "Members of State Legislative Councils",
    "Nominated members of State Legislative Assemblies",
  ],
  sourceIds: [C] as const,
  sourceFactIds: ["pol-cp007-electoral-college"] as const,
});

export const POL_CP007_ELECTION_METHOD_V1 = Object.freeze({
  method: "Proportional representation by means of the single transferable vote",
  ballot: "Secret ballot",
  principle: "Uniformity among States and parity between the States as a whole and the Union",
  sourceIds: [C] as const,
  sourceFactIds: ["pol-cp007-election-method"] as const,
});

export const POL_CP007_QUALIFICATIONS_V1 = Object.freeze([
  "Citizen of India",
  "At least 35 years of age",
  "Qualified for election as a member of the Lok Sabha",
  "Must not hold a disqualifying office of profit",
]);

export const POL_CP007_IMPEACHMENT_V1 = Object.freeze({
  ground: "Violation of the Constitution",
  initiatingHouse: "Either House of Parliament",
  notice: "At least 14 days",
  noticeSupport: "At least one-fourth of the total membership of the initiating House",
  initiatingMajority: "At least two-thirds of the total membership of the initiating House",
  investigatingHouse: "The other House",
  finalMajority: "At least two-thirds of the total membership of the investigating House",
  sourceIds: [C] as const,
  sourceFactIds: ["pol-cp007-impeachment"] as const,
});

export const POL_CP007_CLEMENCY_CASES_V1 = Object.freeze([
  "Cases where the punishment or sentence is by a Court Martial",
  "Offences against laws relating to matters within the Union's executive power",
  "All cases of death sentence",
]);

export const POL_CP007_CLEMENCY_TERMS_V1 = Object.freeze([
  { term: "Pardon", meaning: "Removes the sentence and its legal consequences to the extent of the pardon" },
  { term: "Commutation", meaning: "Substitutes a lighter form of punishment for the original punishment" },
  { term: "Remission", meaning: "Reduces the period or amount of punishment without changing its character" },
  { term: "Respite", meaning: "Awards a lesser sentence because of a special circumstance" },
  { term: "Reprieve", meaning: "Temporarily postpones the execution of a sentence, especially a death sentence" },
]);
