import { generatePolCp007ReviewBatchV5 } from "./pol-cp007-review-generator-v5";

const EXPLANATIONS: Record<string, string> = {
  "POL-CP007-V5-001": "Article 52 creates the office of the President of India. It is the basic provision establishing the post.",
  "POL-CP007-V5-002": "Article 54 deals with the election of the President. It defines who forms the presidential electoral college.",
  "POL-CP007-V5-003": "Article 58 gives the qualifications for election as President. It sets the main conditions a candidate must meet.",
  "POL-CP007-V5-004": "Article 61 deals with impeachment of the President. It lays down the special process for removal from office.",
  "POL-CP007-V5-005": "Article 53 covers the executive power of the Union. It vests that power in the President.",
  "POL-CP007-V5-006": "Article 56 covers the President's term of office. It also deals with resignation and continuation until a successor takes charge.",
  "POL-CP007-V5-007": "Article 60 contains the President's oath or affirmation. It also states who normally administers the oath.",
  "POL-CP007-V5-008": "Article 62 covers elections to fill a vacancy in the President's office, whether caused by normal expiry or a casual vacancy.",
  "POL-CP007-V5-009": "Only elected MPs and elected MLAs vote for President. Nominated MPs and members of State Legislative Councils are excluded.",
  "POL-CP007-V5-010": "A nominated Rajya Sabha member does not vote for President because Article 54 includes only elected members of Parliament.",
  "POL-CP007-V5-011": "Members of State Legislative Councils do not vote. From the States, only elected members of Legislative Assemblies are included.",
  "POL-CP007-V5-012": "Elected MLAs of Delhi and Puducherry vote in the presidential election. They are included in the electoral college.",
  "POL-CP007-V5-013": "A nominated Lok Sabha member does not vote for President because the parliamentary part of the electoral college includes elected MPs only.",
  "POL-CP007-V5-014": "The President is elected by proportional representation through the single transferable vote. It is an indirect election, not a direct public vote.",
  "POL-CP007-V5-015": "Voting in the presidential election is by secret ballot. Electors do not cast their vote openly.",
  "POL-CP007-V5-016": "The presidential election uses the single transferable vote. Electors rank candidates in order of preference.",
  "POL-CP007-V5-017": "Article 55 seeks uniformity among the States and parity between the States as a whole and the Union.",
  "POL-CP007-V5-018": "The President's normal term is five years from the date of entering office.",
  "POL-CP007-V5-019": "The President resigns by writing to the Vice-President. This is the constitutionally specified recipient of the resignation.",
  "POL-CP007-V5-020": "After the five-year term ends, the President continues until the successor enters office, preventing a gap in the post.",
  "POL-CP007-V5-021": "The presidential term begins on the date the President enters office, not on the election or result date.",
  "POL-CP007-V5-022": "A former President may contest again if the constitutional qualifications are still met. The Constitution allows re-election.",
  "POL-CP007-V5-023": "Article 57 deals with eligibility for re-election as President and allows a President to contest again.",
  "POL-CP007-V5-024": "The Constitution sets no maximum number of presidential terms. A person may be re-elected if still eligible.",
  "POL-CP007-V5-025": "A candidate for President must be at least 35 years old. This minimum age is fixed by Article 58.",
  "POL-CP007-V5-026": "A presidential candidate must be qualified for election to Lok Sabha, but need not already be a Lok Sabha member.",
  "POL-CP007-V5-027": "Indian citizenship is a basic qualification for election as President under Article 58.",
  "POL-CP007-V5-028": "A person holding a disqualifying office of profit is not eligible to be elected President, subject to constitutional exceptions.",
  "POL-CP007-V5-029": "If an MP is elected President, the parliamentary seat becomes vacant when the person enters office. Both positions cannot be held together.",
  "POL-CP007-V5-030": "The President cannot remain a State MLA after entering office. The legislative seat is vacated on taking the presidential office.",
  "POL-CP007-V5-031": "The President cannot hold another office of profit during the term. Article 59 keeps the presidential office separate from such posts.",
  "POL-CP007-V5-032": "The Chief Justice of India normally administers the President's oath under Article 60.",
  "POL-CP007-V5-033": "If the Chief Justice of India is unavailable, the senior-most available Supreme Court judge administers the presidential oath.",
  "POL-CP007-V5-034": "The presidential oath includes a promise to preserve, protect and defend the Constitution and the law.",
  "POL-CP007-V5-035": "Violation of the Constitution is the stated ground for impeaching the President. Loss of political support alone is not enough.",
  "POL-CP007-V5-036": "Either House of Parliament may start impeachment proceedings against the President. The process is not restricted to one House.",
  "POL-CP007-V5-037": "Article 61 contains the procedure for presidential impeachment, including notice, investigation and the required majorities.",
  "POL-CP007-V5-038": "After one House brings the impeachment charge, the other House investigates it. There is no joint sitting for this stage.",
  "POL-CP007-V5-039": "At least 14 days' notice is required before a presidential impeachment resolution is moved.",
  "POL-CP007-V5-040": "The impeachment notice must be signed by at least one-fourth of the total membership of the House starting the charge.",
  "POL-CP007-V5-041": "The House starting impeachment must pass the resolution by at least two-thirds of its total membership.",
  "POL-CP007-V5-042": "After investigation, the other House must also sustain the charge by at least two-thirds of its total membership.",
  "POL-CP007-V5-043": "A casual vacancy in the President's office must be filled within six months. This is the maximum time allowed.",
  "POL-CP007-V5-044": "A President elected after a casual vacancy gets a fresh five-year term, not merely the remaining part of the earlier term.",
  "POL-CP007-V5-045": "When the normal presidential term is ending, the election of the successor must be completed before the term expires.",
  "POL-CP007-V5-046": "Article 62 deals with elections to fill a presidential vacancy, including normal expiry and casual vacancy.",
  "POL-CP007-V5-047": "The Supreme Court decides disputes relating to the presidential election under Article 71.",
  "POL-CP007-V5-048": "The Supreme Court's decision in a presidential election dispute is final under Article 71.",
  "POL-CP007-V5-049": "A vacant seat in the electoral college does not by itself invalidate the presidential election.",
  "POL-CP007-V5-050": "Article 72 gives the President the power to grant pardon and other forms of clemency in specified cases.",
  "POL-CP007-V5-051": "A sentence awarded by a Court Martial falls within the President's clemency power under Article 72.",
  "POL-CP007-V5-052": "The President's clemency power extends to every case involving a death sentence.",
  "POL-CP007-V5-053": "For offences within Union executive power, the President may exercise clemency under Article 72.",
  "POL-CP007-V5-054": "Pardon can remove the punishment and its legal consequences. It is the broadest form of clemency among these constitutional remedies.",
  "POL-CP007-V5-055": "Commutation changes the original punishment into a lighter type of punishment, such as changing one form of sentence to another.",
  "POL-CP007-V5-056": "Remission reduces the length or amount of punishment without changing the basic type of punishment.",
  "POL-CP007-V5-057": "Reprieve temporarily delays the carrying out of a sentence, especially when execution is involved.",
  "POL-CP007-V5-058": "The President may ask the Council of Ministers to reconsider its advice once. This is not a permanent power to reject it.",
  "POL-CP007-V5-059": "If the Council of Ministers sends the advice again after reconsideration, the President must act according to that advice.",
  "POL-CP007-V5-060": "Article 74 deals with the Council of Ministers aiding and advising the President.",
  "POL-CP007-V5-061": "Article 85 covers summoning Parliament, proroguing its Houses and dissolving Lok Sabha.",
  "POL-CP007-V5-062": "The President formally prorogues the Houses of Parliament under Article 85, acting within the parliamentary system.",
  "POL-CP007-V5-063": "Dissolution under Article 85 applies only to Lok Sabha. Rajya Sabha is a continuing House and is not dissolved.",
  "POL-CP007-V5-064": "A non-Money Bill may be returned once for reconsideration by Parliament. A Money Bill cannot be returned this way.",
  "POL-CP007-V5-065": "If Parliament passes a returned non-Money Bill again, the President cannot withhold assent.",
  "POL-CP007-V5-066": "Article 111 deals with the President's assent to Bills passed by Parliament, including return of a non-Money Bill.",
  "POL-CP007-V5-067": "A Money Bill cannot be returned by the President for reconsideration under Article 111.",
  "POL-CP007-V5-068": "Article 123 gives the President the power to issue Ordinances when the constitutional conditions are met.",
  "POL-CP007-V5-069": "An Ordinance may be issued when both Houses are not simultaneously in session and immediate action is considered necessary.",
  "POL-CP007-V5-070": "An Ordinance normally stops operating six weeks after Parliament reassembles, unless it ends earlier.",
  "POL-CP007-V5-071": "While valid, a presidential Ordinance has the same force as an Act of Parliament, but it is temporary.",
  "POL-CP007-V5-072": "Article 53 vests the executive power of the Union in the President.",
  "POL-CP007-V5-073": "The supreme command of the Defence Forces is vested in the President under Article 53.",
  "POL-CP007-V5-074": "Article 53 mainly concerns the executive power of the Union and its vesting in the President.",
  "POL-CP007-V5-075": "All three statements are correct: the President is elected indirectly, serves a normal five-year term and may be re-elected.",
  "POL-CP007-V5-076": "All three statements are correct: only elected MPs vote from Parliament, while nominated MPs and State Legislative Council members do not.",
  "POL-CP007-V5-077": "Only two statements are correct. Either House may start impeachment, but the other House investigates it; there is no joint sitting.",
  "POL-CP007-V5-078": "Nominated members of Parliament are excluded because Article 54 includes elected MPs in the presidential electoral college.",
  "POL-CP007-V5-079": "For presidential elections, the constitutional meaning of State includes Delhi and Puducherry, so their elected MLAs participate.",
  "POL-CP007-V5-080": "The presidential electoral college includes elected MPs and elected MLAs, including the elected MLAs of Delhi and Puducherry.",
};

export function generatePolCp007ReviewBatchV6() {
  const questions = generatePolCp007ReviewBatchV5().map((q, index) => {
    const explanation = EXPLANATIONS[q.questionId];
    if (!explanation) throw new Error(`Missing V6 explanation for ${q.questionId}`);
    return { ...q, questionId: `POL-CP007-V6-${String(index + 1).padStart(3, "0")}`, explanation };
  });
  if (new Set(questions.map(q => q.explanation)).size !== questions.length) throw new Error("Repeated V6 explanation");
  for (const q of questions) {
    const words = q.explanation.trim().split(/\s+/).length;
    if (words < 11 || words > 24) throw new Error(`V6 explanation length ${q.questionId}: ${words}`);
    if (/Correct answer|exact subject|nearby Articles|match the topic|remember the word|constitutionally vested|to the extent granted/i.test(q.explanation)) {
      throw new Error(`Generic/wordy V6 explanation in ${q.questionId}`);
    }
  }
  return questions;
}
