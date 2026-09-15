export type PolCp009Sourced = { sourceIds: readonly string[]; sourceFactIds: readonly string[] };
const C = "LEGISLATIVE-DEPT-CONSTITUTION-2025";
const src = (id: string): PolCp009Sourced => ({ sourceIds: [C], sourceFactIds: [id] });

export const POL_CP009_ARTICLES_V1 = Object.freeze([
  { article: "74", subject: "Council of Ministers to aid and advise the President", rule: "There shall be a Council of Ministers with the Prime Minister at the head to aid and advise the President. The President may ask once for reconsideration and must act on the advice returned after reconsideration.", ...src("pol-cp009-art74") },
  { article: "75", subject: "Appointment, responsibility and other rules for Union Ministers", rule: "The President appoints the Prime Minister and appoints the other Ministers on the Prime Minister's advice. Article 75 also covers size, responsibility, oath, six-month membership rule and salaries.", ...src("pol-cp009-art75") },
  { article: "77", subject: "Conduct of business of the Government of India", rule: "All executive action of the Government of India is expressed to be taken in the name of the President. Rules may be made for transaction and allocation of government business.", ...src("pol-cp009-art77") },
  { article: "78", subject: "Duties of the Prime Minister towards the President", rule: "The Prime Minister communicates Council decisions, provides information sought by the President and may be required to place an individual Minister's decision before the Council.", ...src("pol-cp009-art78") },
  { article: "88", subject: "Rights of Ministers in Parliament", rule: "Every Minister may speak and take part in either House, a joint sitting and a committee of which the Minister is a member, but Article 88 by itself does not give a right to vote.", ...src("pol-cp009-art88") },
  { article: "352(3)", subject: "Constitutional meaning of Union Cabinet", rule: "For Article 352, Union Cabinet means the Council consisting of the Prime Minister and other Ministers of Cabinet rank appointed under Article 75.", ...src("pol-cp009-art352-cabinet") },
]);

export const POL_CP009_APPOINTMENT_V1 = Object.freeze({
  primeMinister: "The President appoints the Prime Minister",
  otherMinisters: "The President appoints other Ministers on the advice of the Prime Minister",
  sourceIds: [C] as const,
  sourceFactIds: ["pol-cp009-appointment"] as const,
});

export const POL_CP009_ARTICLE75_V1 = Object.freeze({
  sizeCap: "The total number of Ministers, including the Prime Minister, cannot exceed 15% of the total membership of Lok Sabha",
  sizeAmendment: "Ninety-first Amendment",
  collectiveResponsibility: "The Council of Ministers is collectively responsible to Lok Sabha",
  pleasure: "Ministers hold office during the pleasure of the President",
  oathAuthority: "President",
  oathTypes: "Oaths of office and secrecy",
  oathSchedule: "Third Schedule",
  sixMonthRule: "A Minister who is not a member of either House of Parliament for six consecutive months ceases to be a Minister",
  salaries: "Parliament may determine Ministers' salaries and allowances by law; until then the Second Schedule applies",
  sourceIds: [C] as const,
  sourceFactIds: ["pol-cp009-art75-details"] as const,
});

export const POL_CP009_ANTI_DEFECTION_V1 = Object.freeze({
  rule: "A member disqualified under paragraph 2 of the Tenth Schedule is also disqualified from being appointed a Minister for the constitutional period stated in Article 75(1B)",
  amendment: "Ninety-first Amendment",
  sourceIds: [C] as const,
  sourceFactIds: ["pol-cp009-art75-1b"] as const,
});

export const POL_CP009_ARTICLE77_V1 = Object.freeze({
  executiveAction: "All executive action of the Government of India is expressed to be taken in the name of the President",
  authentication: "Orders and instruments made in the President's name are authenticated in the manner specified by rules",
  rules: "The President makes rules for the more convenient transaction of Government of India business and for allocation of that business among Ministers",
  sourceIds: [C] as const,
  sourceFactIds: ["pol-cp009-art77-details"] as const,
});

export const POL_CP009_ARTICLE78_DUTIES_V1 = Object.freeze([
  "Communicate to the President all Council of Ministers decisions relating to Union administration and proposals for legislation",
  "Furnish information about Union administration and legislative proposals when the President asks for it",
  "If the President requires, place before the Council of Ministers a matter decided by a Minister but not considered by the Council",
]);

export const POL_CP009_ARTICLE88_V1 = Object.freeze({
  participation: "A Minister may speak and take part in either House, a joint sitting and a parliamentary committee of which the Minister is named a member",
  votingLimit: "Article 88 does not by itself give the Minister a right to vote",
  sourceIds: [C] as const,
  sourceFactIds: ["pol-cp009-art88-details"] as const,
});

export const POL_CP009_CABINET_V1 = Object.freeze({
  definition: "The Union Cabinet consists of the Prime Minister and other Ministers of Cabinet rank appointed under Article 75",
  distinction: "The Cabinet is the Cabinet-rank group within the wider Council of Ministers",
  sourceIds: [C] as const,
  sourceFactIds: ["pol-cp009-cabinet-definition"] as const,
});
