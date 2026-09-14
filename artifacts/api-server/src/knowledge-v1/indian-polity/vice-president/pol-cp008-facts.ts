export type PolCp008Sourced = { sourceIds: readonly string[]; sourceFactIds: readonly string[] };
export type PolCp008ArticleRow = PolCp008Sourced & { article: string; subject: string; rule: string };

const C = "LEGISLATIVE-DEPT-CONSTITUTION-2025";
const src = (id: string) => ({ sourceIds: [C] as const, sourceFactIds: [id] as const });

export const POL_CP008_ARTICLES_V1: readonly PolCp008ArticleRow[] = Object.freeze([
  { article: "63", subject: "Vice-President of India", rule: "Article 63 provides that there shall be a Vice-President of India.", ...src("pol-cp008-a63") },
  { article: "64", subject: "Vice-President as ex officio Chairman of the Council of States", rule: "The Vice-President is ex officio Chairman of the Rajya Sabha. While acting as President or discharging presidential functions, the Vice-President does not perform the Chairman's duties or receive the Chairman's salary or allowance.", ...src("pol-cp008-a64") },
  { article: "65", subject: "Vice-President acting as President", rule: "The Vice-President acts as President when the office of President is vacant and discharges presidential functions when the President is unable to do so because of absence, illness or another cause. During that period the Vice-President has the President's powers and immunities.", ...src("pol-cp008-a65") },
  { article: "66", subject: "Election of Vice-President", rule: "The Vice-President is elected by an electoral college consisting of members of both Houses of Parliament using proportional representation by the single transferable vote and secret ballot. State Legislatures do not participate.", ...src("pol-cp008-a66") },
  { article: "67", subject: "Term, resignation and removal of Vice-President", rule: "The Vice-President normally serves five years, resigns to the President and may be removed by a Rajya Sabha resolution passed by a majority of all the then members and agreed to by Lok Sabha, after at least fourteen days' notice.", ...src("pol-cp008-a67") },
  { article: "68", subject: "Election to fill a vacancy in the office of Vice-President", rule: "An election before normal expiry must be completed before the term ends. A casual vacancy must be filled as soon as possible, and the person elected gets a full five-year term from entering office.", ...src("pol-cp008-a68") },
  { article: "69", subject: "Oath or affirmation by the Vice-President", rule: "The Vice-President takes the oath before the President or a person appointed by the President for that purpose.", ...src("pol-cp008-a69") },
  { article: "70", subject: "Discharge of President's functions in other contingencies", rule: "Parliament may provide by law for discharge of the President's functions in a contingency not otherwise provided for in the constitutional chapter.", ...src("pol-cp008-a70") },
  { article: "71", subject: "Disputes relating to President or Vice-President elections", rule: "All doubts and disputes connected with the election of the President or Vice-President are decided by the Supreme Court, whose decision is final.", ...src("pol-cp008-a71") },
]);

export const POL_CP008_ELECTORAL_COLLEGE_V1 = Object.freeze({
  included: ["Elected members of Lok Sabha","Nominated members of Lok Sabha","Elected members of Rajya Sabha","Nominated members of Rajya Sabha"],
  excluded: ["Members of State Legislative Assemblies","Members of State Legislative Councils"],
  sourceIds: [C] as const,
  sourceFactIds: ["pol-cp008-electoral-college"] as const,
});

export const POL_CP008_ELECTION_METHOD_V1 = Object.freeze({
  method: "Proportional representation by means of the single transferable vote",
  ballot: "Secret ballot",
  sourceIds: [C] as const,
  sourceFactIds: ["pol-cp008-election-method"] as const,
});

export const POL_CP008_QUALIFICATIONS_V1 = Object.freeze([
  "Citizen of India",
  "At least 35 years of age",
  "Qualified for election as a member of the Rajya Sabha",
  "Must not hold a disqualifying office of profit",
]);

export const POL_CP008_REMOVAL_V1 = Object.freeze({
  initiatingHouse: "Rajya Sabha",
  initiatingMajority: "Majority of all the then members of the Rajya Sabha",
  secondHouseRole: "Lok Sabha must agree to the resolution",
  notice: "At least 14 days",
  ground: "No specific removal ground is stated in Article 67",
  sourceIds: [C] as const,
  sourceFactIds: ["pol-cp008-removal"] as const,
});
