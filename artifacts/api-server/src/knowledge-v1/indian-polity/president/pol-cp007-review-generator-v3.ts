import { generatePolCp007ReviewBatchV2 } from "./pol-cp007-review-generator-v2";
import type { PolCp007ReviewQuestion } from "./pol-cp007-review-types";

const NOTES: Record<string, string> = {
  "POL-007-QL-001": "Articles 52–62 divide the main rules about the President into separate Articles. The Article in the question must match its exact constitutional subject.",
  "POL-007-QL-002": "Articles 52–62 separately cover the President's office, election, term, qualifications, oath, impeachment and vacancy. Match the topic, not just a nearby Article number.",
  "POL-007-QL-003": "Article 54 includes elected MPs and elected MLAs. Nominated MPs and members of State Legislative Councils are excluded, while elected MLAs of Delhi and Puducherry are included.",
  "POL-007-QL-004": "Article 55 provides proportional representation by single transferable vote and secret ballot. The President is elected indirectly, not by direct popular vote.",
  "POL-007-QL-005": "Article 56 gives a five-year term, resignation to the Vice-President and continuance until the successor enters office, so normal expiry does not create an immediate vacancy.",
  "POL-007-QL-006": "Article 57 allows re-election. The Constitution does not impose a two-term limit on the President if the candidate still meets the qualifications.",
  "POL-007-QL-007": "Article 58 requires Indian citizenship, age 35, qualification for election to Lok Sabha and freedom from a disqualifying office of profit.",
  "POL-007-QL-008": "Article 59 keeps the presidential office separate from Parliament, State Legislatures and other offices of profit. A legislative seat is vacated when the person enters office as President.",
  "POL-007-QL-009": "Article 60 places the oath before the Chief Justice of India, or the senior-most available Supreme Court judge if the Chief Justice is unavailable. The oath includes preserving, protecting and defending the Constitution.",
  "POL-007-QL-010": "Article 61 allows impeachment only for violation of the Constitution. Either House may start the charge and the other House investigates it; there is no joint sitting.",
  "POL-007-QL-011": "Impeachment requires at least 14 days' notice, signatures of at least one-fourth of the initiating House, and at least two-thirds of its total membership at the required stages.",
  "POL-007-QL-012": "Article 62 requires a casual presidential vacancy to be filled within six months. The newly elected President receives a fresh five-year term, not merely the previous term's remainder.",
  "POL-007-QL-013": "Article 71 gives the Supreme Court final authority over President and Vice-President election disputes. A vacancy in the electoral college alone does not invalidate the election.",
  "POL-007-QL-014": "Article 72 covers Court Martial sentences, offences within Union executive power and every death-sentence case. These are the key constitutional categories for presidential clemency.",
  "POL-007-QL-015": "Clemency terms differ: pardon removes punishment, commutation changes it to a lighter type, remission reduces it, respite gives a lesser sentence for special reasons, and reprieve delays execution.",
  "POL-007-QL-016": "Article 74 lets the President ask for reconsideration once. If the Council of Ministers sends the advice again, the President must act according to it.",
  "POL-007-QL-017": "Article 85 covers summoning Parliament, proroguing its Houses and dissolving Lok Sabha. Rajya Sabha is a continuing House and is not dissolved.",
  "POL-007-QL-018": "Article 111 allows a non-Money Bill to be returned once for reconsideration. A Money Bill cannot be returned, and a re-passed returned Bill must receive assent.",
  "POL-007-QL-019": "Article 123 allows an Ordinance when both Houses are not simultaneously in session and immediate action is needed. It normally ends six weeks after Parliament reassembles.",
  "POL-007-QL-020": "Article 53 vests Union executive power and the supreme command of the Defence Forces in the President, subject to the Constitution and the parliamentary system.",
  "POL-007-QL-021": "This family mixes election, tenure, impeachment and presidential powers. Each statement must be checked against its own constitutional rule before counting the correct ones.",
  "POL-007-QL-022": "The key electoral-college word is elected: nominated MPs and Legislative Council members are excluded, while elected MLAs of Delhi and Puducherry are included.",
};

function questionSpecificNote(q: PolCp007ReviewQuestion) {
  if (q.qlId === "POL-007-QL-008" && q.canonicalAnswer === "No") {
    return q.stem.includes("State MLA")
      ? "A President cannot simultaneously remain a State MLA; the legislative seat is vacated on entering the presidential office."
      : "A President cannot hold another office of profit during the term because Article 59 keeps the office constitutionally separate.";
  }
  if (q.qlId === "POL-007-QL-021") {
    if (q.stem.includes("elected indirectly")) return "All three statements are correct: the election is indirect, the normal term is five years and re-election is allowed.";
    if (q.stem.includes("Only elected MPs")) return "All three statements are correct: only elected MPs vote from Parliament, nominated MPs do not vote and State Legislative Council members do not vote.";
    return "Only two statements are correct: either House may start impeachment and the ground is violation of the Constitution, but the other House investigates the charge instead of a joint sitting.";
  }
  return NOTES[q.qlId] ?? q.explanation;
}

function explain(q: PolCp007ReviewQuestion) {
  const note = questionSpecificNote(q);
  return `Correct answer: ${q.canonicalAnswer}. ${note}`;
}

export function generatePolCp007ReviewBatchV3() {
  const questions = generatePolCp007ReviewBatchV2().map((q, index) => ({
    ...q,
    questionId: `POL-CP007-V3-${String(index + 1).padStart(3, "0")}`,
    explanation: explain(q),
  }));

  for (const q of questions) {
    if (q.explanation.trim().split(/\s+/).length < 18) throw new Error(`Weak explanation in ${q.questionId}`);
    if (!q.explanation.includes(q.canonicalAnswer)) throw new Error(`Explanation does not identify answer in ${q.questionId}`);
  }

  for (const qlId of new Set(questions.map(q => q.qlId))) {
    const group = questions.filter(q => q.qlId === qlId);
    if (new Set(group.map(q => q.explanation)).size !== group.length) throw new Error(`Repeated explanation in ${qlId}`);
  }

  return questions;
}
