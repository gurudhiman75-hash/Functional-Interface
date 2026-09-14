import { generatePolCp007ReviewBatchV3 } from "./pol-cp007-review-generator-v3";

const EXPLANATIONS: Record<string, string> = {
  "POL-CP007-V3-001": "Article 52 establishes the office of the President of India.",
  "POL-CP007-V3-002": "Article 54 sets out who elects the President.",
  "POL-CP007-V3-003": "Article 58 lists the qualifications required to contest the presidential election.",
  "POL-CP007-V3-004": "Article 61 lays down the procedure for impeaching the President.",
  "POL-CP007-V3-005": "Article 53 deals with the executive power of the Union.",
  "POL-CP007-V3-006": "Article 56 covers the President's term, resignation and continuance in office.",
  "POL-CP007-V3-007": "Article 60 contains the President's oath or affirmation.",
  "POL-CP007-V3-008": "Article 62 deals with elections held to fill a vacancy in the President's office.",
  "POL-CP007-V3-009": "The electoral college includes elected MPs and elected MLAs; nominated members are excluded.",
  "POL-CP007-V3-010": "A nominated Rajya Sabha member cannot vote because Article 54 includes elected MPs only.",
  "POL-CP007-V3-011": "Members of State Legislative Councils are excluded; only elected members of State Legislative Assemblies take part.",
  "POL-CP007-V3-012": "Elected MLAs of Delhi and Puducherry are included in the presidential electoral college.",
  "POL-CP007-V3-013": "A nominated Lok Sabha member cannot vote in the presidential election.",
  "POL-CP007-V3-014": "The President is elected by proportional representation using the single transferable vote.",
  "POL-CP007-V3-015": "Voting in the presidential election is by secret ballot.",
  "POL-CP007-V3-016": "Electors rank candidates under the single transferable vote system.",
  "POL-CP007-V3-017": "Article 55 seeks balance in representation between the States and the Union.",
  "POL-CP007-V3-018": "The President's normal term is five years from the date of entering office.",
  "POL-CP007-V3-019": "The President sends a resignation to the Vice-President.",
  "POL-CP007-V3-020": "The President continues after the term ends until the successor takes office.",
  "POL-CP007-V3-021": "The five-year term starts on the date the President enters office.",
  "POL-CP007-V3-022": "A former President may contest again if the constitutional qualifications are still met.",
  "POL-CP007-V3-023": "Article 57 expressly allows a President to be elected again.",
  "POL-CP007-V3-024": "The Constitution does not set a maximum number of presidential terms.",
  "POL-CP007-V3-025": "A presidential candidate must be at least 35 years old.",
  "POL-CP007-V3-026": "The candidate must be qualified for election to Lok Sabha, even if not actually an MP.",
  "POL-CP007-V3-027": "Indian citizenship is a basic qualification for election as President.",
  "POL-CP007-V3-028": "A disqualifying office of profit makes the person ineligible to contest for President.",
  "POL-CP007-V3-029": "An MP elected President vacates the parliamentary seat on entering the presidential office.",
  "POL-CP007-V3-030": "The President cannot remain a State MLA after entering office.",
  "POL-CP007-V3-031": "The President cannot hold another office of profit during the term.",
  "POL-CP007-V3-032": "The Chief Justice of India normally administers the President's oath.",
  "POL-CP007-V3-033": "If the Chief Justice is unavailable, the senior-most available Supreme Court judge administers the oath.",
  "POL-CP007-V3-034": "The presidential oath includes a promise to preserve, protect and defend the Constitution and the law.",
  "POL-CP007-V3-035": "Violation of the Constitution is the ground stated for presidential impeachment.",
  "POL-CP007-V3-036": "Lok Sabha or Rajya Sabha may start impeachment proceedings.",
  "POL-CP007-V3-037": "Article 61 contains the impeachment procedure for the President.",
  "POL-CP007-V3-038": "After one House brings the charge, the other House investigates it.",
  "POL-CP007-V3-039": "At least 14 days' notice must be given before the impeachment resolution is moved.",
  "POL-CP007-V3-040": "At least one-fourth of the total membership of the initiating House must sign the notice.",
  "POL-CP007-V3-041": "The initiating House must pass the charge by at least two-thirds of its total membership.",
  "POL-CP007-V3-042": "The investigating House must also sustain the charge by at least two-thirds of its total membership.",
  "POL-CP007-V3-043": "A casual vacancy in the President's office must be filled within six months.",
  "POL-CP007-V3-044": "The person elected after a casual vacancy gets a fresh five-year term.",
  "POL-CP007-V3-045": "For a normal expiry, the successor's election must be completed before the term ends.",
  "POL-CP007-V3-046": "Article 62 governs elections held to fill a vacancy in the President's office.",
  "POL-CP007-V3-047": "The Supreme Court decides disputes relating to the presidential election.",
  "POL-CP007-V3-048": "The Supreme Court's decision in a presidential election dispute is final.",
  "POL-CP007-V3-049": "A vacant seat in the electoral college does not by itself invalidate the election.",
  "POL-CP007-V3-050": "Article 72 gives the President the power to grant pardon and other forms of clemency.",
  "POL-CP007-V3-051": "Court Martial sentences fall within the President's clemency power under Article 72.",
  "POL-CP007-V3-052": "The President's clemency power extends to every case involving a death sentence.",
  "POL-CP007-V3-053": "For offences within Union executive power, clemency may be exercised by the President.",
  "POL-CP007-V3-054": "Pardon removes the punishment and its penal consequences to the extent granted.",
  "POL-CP007-V3-055": "Commutation changes the original punishment into a lighter kind of punishment.",
  "POL-CP007-V3-056": "Remission reduces the length or amount of punishment without changing its type.",
  "POL-CP007-V3-057": "Reprieve temporarily delays the carrying out of a sentence, especially an execution.",
  "POL-CP007-V3-058": "The President may send ministerial advice back once for reconsideration.",
  "POL-CP007-V3-059": "If the advice is sent again after reconsideration, the President must accept it.",
  "POL-CP007-V3-060": "Article 74 governs the Council of Ministers' aid and advice to the President.",
  "POL-CP007-V3-061": "Article 85 covers summoning Parliament, prorogation and dissolution of Lok Sabha.",
  "POL-CP007-V3-062": "The President formally prorogues the Houses of Parliament under Article 85.",
  "POL-CP007-V3-063": "Only Lok Sabha is dissolved; Rajya Sabha is a continuing House.",
  "POL-CP007-V3-064": "A non-Money Bill may be returned once for Parliament to reconsider it.",
  "POL-CP007-V3-065": "If Parliament passes the returned Bill again, the President must give assent.",
  "POL-CP007-V3-066": "Article 111 deals with the President's assent to Bills passed by Parliament.",
  "POL-CP007-V3-067": "A Money Bill cannot be returned by the President for reconsideration.",
  "POL-CP007-V3-068": "Article 123 gives the President the power to promulgate Ordinances.",
  "POL-CP007-V3-069": "An Ordinance may be issued when both Houses are not sitting together and immediate action is needed.",
  "POL-CP007-V3-070": "An Ordinance normally stops operating six weeks after Parliament reassembles.",
  "POL-CP007-V3-071": "A valid Ordinance has the same force as an Act of Parliament, but only temporarily.",
  "POL-CP007-V3-072": "Article 53 vests the executive power of the Union in the President.",
  "POL-CP007-V3-073": "The supreme command of the Defence Forces is constitutionally vested in the President.",
  "POL-CP007-V3-074": "Article 53 is the main provision on the Union's executive power.",
  "POL-CP007-V3-075": "All three are correct: the election is indirect, the normal term is five years and re-election is allowed.",
  "POL-CP007-V3-076": "All three are correct: only elected MPs vote from Parliament, nominated MPs do not, and State Legislative Council members do not.",
  "POL-CP007-V3-077": "Only statements 1 and 3 are correct; impeachment is investigated by the other House, not by a joint sitting.",
  "POL-CP007-V3-078": "Nominated MPs are excluded because only elected MPs form the parliamentary part of the electoral college.",
  "POL-CP007-V3-079": "For this election, elected MLAs of Delhi and Puducherry are included with State Assembly electors.",
  "POL-CP007-V3-080": "The electoral college consists of elected MPs and elected MLAs, including elected MLAs of Delhi and Puducherry.",
};

export function generatePolCp007ReviewBatchV4() {
  const questions = generatePolCp007ReviewBatchV3().map((q, index) => {
    const explanation = EXPLANATIONS[q.questionId];
    if (!explanation) throw new Error(`Missing V4 explanation for ${q.questionId}`);
    return { ...q, questionId: `POL-CP007-V4-${String(index + 1).padStart(3, "0")}`, explanation };
  });
  if (new Set(questions.map(q => q.explanation)).size !== questions.length) throw new Error("Repeated V4 explanation");
  for (const q of questions) {
    const words = q.explanation.trim().split(/\s+/).length;
    if (words < 6 || words > 24) throw new Error(`V4 explanation length ${q.questionId}: ${words}`);
    if (/Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i.test(q.explanation)) throw new Error(`Generic explanation clutter in ${q.questionId}`);
  }
  return questions;
}