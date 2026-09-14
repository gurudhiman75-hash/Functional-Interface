import { generatePolCp007ReviewBatchV4 } from "./pol-cp007-review-generator-v4";

const EXPLANATIONS: Record<string, string> = {
  "POL-CP007-V4-001": "Article 52 creates the office of the President.",
  "POL-CP007-V4-002": "Article 54 says who elects the President.",
  "POL-CP007-V4-003": "Article 58 gives the qualifications for President.",
  "POL-CP007-V4-004": "Article 61 explains presidential impeachment.",
  "POL-CP007-V4-005": "Article 53 covers Union executive power.",
  "POL-CP007-V4-006": "Article 56 covers term, resignation and continuation in office.",
  "POL-CP007-V4-007": "Article 60 gives the President's oath.",
  "POL-CP007-V4-008": "Article 62 covers elections for a presidential vacancy.",
  "POL-CP007-V4-009": "Only elected MPs and elected MLAs vote; nominated members do not.",
  "POL-CP007-V4-010": "A nominated Rajya Sabha member cannot vote; only elected MPs can.",
  "POL-CP007-V4-011": "Legislative Council members do not vote; only elected MLAs do.",
  "POL-CP007-V4-012": "Elected MLAs of Delhi and Puducherry vote in the presidential election.",
  "POL-CP007-V4-013": "A nominated Lok Sabha member cannot vote.",
  "POL-CP007-V4-014": "The President is elected by proportional representation using single transferable vote.",
  "POL-CP007-V4-015": "Voting is by secret ballot.",
  "POL-CP007-V4-016": "Electors rank candidates under the single transferable vote system.",
  "POL-CP007-V4-017": "Article 55 balances representation of the States and the Union.",
  "POL-CP007-V4-018": "The President's normal term is five years.",
  "POL-CP007-V4-019": "The President resigns to the Vice-President.",
  "POL-CP007-V4-020": "The President stays in office until the successor takes charge.",
  "POL-CP007-V4-021": "The five-year term starts when the President takes office.",
  "POL-CP007-V4-022": "A former President may contest again if still eligible.",
  "POL-CP007-V4-023": "Article 57 allows re-election as President.",
  "POL-CP007-V4-024": "The Constitution sets no maximum number of presidential terms.",
  "POL-CP007-V4-025": "The minimum age is 35 years.",
  "POL-CP007-V4-026": "The candidate must qualify for Lok Sabha election, but need not be an MP.",
  "POL-CP007-V4-027": "Indian citizenship is required to become President.",
  "POL-CP007-V4-028": "Holding a prohibited office of profit makes the candidate ineligible.",
  "POL-CP007-V4-029": "An MP elected President vacates the seat on taking office.",
  "POL-CP007-V4-030": "The President cannot remain a State MLA.",
  "POL-CP007-V4-031": "The President cannot hold another office of profit.",
  "POL-CP007-V4-032": "The Chief Justice of India normally gives the President's oath.",
  "POL-CP007-V4-033": "If the Chief Justice is unavailable, the senior-most available Supreme Court judge gives the oath.",
  "POL-CP007-V4-034": "The oath includes preserving, protecting and defending the Constitution and the law.",
  "POL-CP007-V4-035": "Violation of the Constitution is the ground for impeachment.",
  "POL-CP007-V4-036": "Either House of Parliament can start impeachment.",
  "POL-CP007-V4-037": "Article 61 gives the impeachment procedure.",
  "POL-CP007-V4-038": "The other House investigates the charge.",
  "POL-CP007-V4-039": "At least 14 days' notice is required before the resolution.",
  "POL-CP007-V4-040": "At least one-fourth of the House must sign the notice.",
  "POL-CP007-V4-041": "The initiating House needs two-thirds of its total membership.",
  "POL-CP007-V4-042": "The other House also needs two-thirds of its total membership.",
  "POL-CP007-V4-043": "A casual vacancy must be filled within six months.",
  "POL-CP007-V4-044": "The new President gets a fresh five-year term.",
  "POL-CP007-V4-045": "For normal expiry, the election must finish before the term ends.",
  "POL-CP007-V4-046": "Article 62 covers elections to fill a presidential vacancy.",
  "POL-CP007-V4-047": "The Supreme Court decides presidential election disputes.",
  "POL-CP007-V4-048": "The Supreme Court's decision is final.",
  "POL-CP007-V4-049": "A vacant electoral-college seat alone does not invalidate the election.",
  "POL-CP007-V4-050": "Article 72 gives the President pardon and other clemency powers.",
  "POL-CP007-V4-051": "Court Martial sentences are covered by Article 72.",
  "POL-CP007-V4-052": "Article 72 covers every death-sentence case.",
  "POL-CP007-V4-053": "The President may grant clemency for offences under Union executive power.",
  "POL-CP007-V4-054": "Pardon removes the punishment and its legal effects.",
  "POL-CP007-V4-055": "Commutation changes the punishment to a lighter form.",
  "POL-CP007-V4-056": "Remission reduces the punishment without changing its type.",
  "POL-CP007-V4-057": "Reprieve delays the carrying out of a sentence.",
  "POL-CP007-V4-058": "The President may send ministerial advice back once.",
  "POL-CP007-V4-059": "If the advice returns unchanged, the President must accept it.",
  "POL-CP007-V4-060": "Article 74 covers ministerial advice to the President.",
  "POL-CP007-V4-061": "Article 85 covers summoning Parliament, prorogation and Lok Sabha dissolution.",
  "POL-CP007-V4-062": "The President prorogues the Houses under Article 85.",
  "POL-CP007-V4-063": "Only Lok Sabha can be dissolved; Rajya Sabha continues.",
  "POL-CP007-V4-064": "A non-Money Bill may be returned once for reconsideration.",
  "POL-CP007-V4-065": "If Parliament passes it again, the President must give assent.",
  "POL-CP007-V4-066": "Article 111 covers the President's assent to Bills.",
  "POL-CP007-V4-067": "A Money Bill cannot be returned for reconsideration.",
  "POL-CP007-V4-068": "Article 123 gives the President Ordinance-making power.",
  "POL-CP007-V4-069": "An Ordinance may be issued when Parliament cannot act normally and urgent action is needed.",
  "POL-CP007-V4-070": "An Ordinance normally ends six weeks after Parliament reassembles.",
  "POL-CP007-V4-071": "A valid Ordinance works like an Act, but only temporarily.",
  "POL-CP007-V4-072": "Article 53 gives Union executive power to the President.",
  "POL-CP007-V4-073": "The President has supreme command of the Defence Forces.",
  "POL-CP007-V4-074": "Article 53 is the main rule on Union executive power.",
  "POL-CP007-V4-075": "All three are correct: indirect election, five-year term and re-election.",
  "POL-CP007-V4-076": "All three are correct: only elected MPs vote; nominated MPs and MLCs do not.",
  "POL-CP007-V4-077": "Only statements 1 and 3 are correct; the other House investigates impeachment.",
  "POL-CP007-V4-078": "Nominated MPs are excluded; only elected MPs vote from Parliament.",
  "POL-CP007-V4-079": "Elected MLAs of Delhi and Puducherry are included.",
  "POL-CP007-V4-080": "The electoral college has elected MPs and elected MLAs, including Delhi and Puducherry MLAs.",
};

export function generatePolCp007ReviewBatchV5() {
  const questions = generatePolCp007ReviewBatchV4().map((q, index) => {
    const explanation = EXPLANATIONS[q.questionId];
    if (!explanation) throw new Error(`Missing V5 explanation for ${q.questionId}`);
    return { ...q, questionId: `POL-CP007-V5-${String(index + 1).padStart(3, "0")}`, explanation };
  });
  if (new Set(questions.map(q => q.explanation)).size !== questions.length) throw new Error("Repeated V5 explanation");
  for (const q of questions) {
    const words = q.explanation.trim().split(/\s+/).length;
    if (words < 5 || words > 18) throw new Error(`V5 explanation length ${q.questionId}: ${words}`);
    if (/Correct answer|exact subject|nearby Articles|match the topic|remember the word|constitutionally vested|to the extent granted/i.test(q.explanation)) {
      throw new Error(`Wordy/generic V5 explanation in ${q.questionId}`);
    }
  }
  return questions;
}
