import { generatePolCp008ReviewBatchV5 } from "./pol-cp008-review-generator-v5";

const EXPLANATIONS: Record<string, string> = {
  "POL-CP008-V5-001": "Article 63 creates the office of the Vice-President of India. It is the basic provision establishing the post.",
  "POL-CP008-V5-002": "Article 64 makes the Vice-President ex officio Chairman of Rajya Sabha. The chairmanship comes automatically with the office.",
  "POL-CP008-V5-003": "Article 66 qualifications:\n• Citizen of India\n• At least 35 years old\n• Qualified for election to Rajya Sabha\n• Must not hold a disqualifying office of profit.",
  "POL-CP008-V5-004": "Article 67 covers the Vice-President's term, resignation and removal from office.",
  "POL-CP008-V5-005": "Article 65 deals with the Vice-President acting as President when the President's office is vacant or the President is unable to work.",
  "POL-CP008-V5-006": "Article 68 covers elections to fill a vacancy in the Vice-President's office, including normal expiry and casual vacancy.",
  "POL-CP008-V5-007": "Article 69 contains the Vice-President's oath or affirmation and states who administers it.",
  "POL-CP008-V5-008": "Article 71 deals with disputes relating to President and Vice-President elections, which are decided by the Supreme Court.",
  "POL-CP008-V5-009": "The Vice-President is ex officio Chairman of Rajya Sabha. This role comes automatically with the Vice-Presidential office.",
  "POL-CP008-V5-010": "Article 64 gives the Vice-President the Rajya Sabha Chairmanship. No separate election is held for this role.",
  "POL-CP008-V5-011": "The Vice-President becomes Chairman of Rajya Sabha simply by holding the Vice-Presidential office.",
  "POL-CP008-V5-012": "The Vice-President's regular parliamentary role is ex officio Chairman of the Council of States, which is Rajya Sabha.",
  "POL-CP008-V5-013": "When the President's office becomes vacant, the Vice-President acts as President until the new President enters office.",
  "POL-CP008-V5-014": "Article 65 allows the Vice-President to act as President when the presidential office becomes vacant.",
  "POL-CP008-V5-015": "While acting as President, the Vice-President receives the President's powers and immunities for that period.",
  "POL-CP008-V5-016": "If the President's office is vacant, the Vice-President acts as President only until the newly elected President enters office.",
  "POL-CP008-V5-017": "If the President is temporarily unable to work, the Vice-President performs the President's functions until the President resumes duties.",
  "POL-CP008-V5-018": "During the President's illness, the Vice-President performs the functions only until the President is able to resume them.",
  "POL-CP008-V5-019": "Article 65 covers both a vacancy in the President's office and temporary inability to perform presidential functions.",
  "POL-CP008-V5-020": "Article 65 also covers temporary inability caused by absence, illness or another reason.",
  "POL-CP008-V5-021": "While acting as President, the Vice-President does not perform Rajya Sabha Chairman duties. The two roles are kept separate.",
  "POL-CP008-V5-022": "While acting as President, the Vice-President does not receive the salary attached to the Rajya Sabha Chairmanship.",
  "POL-CP008-V5-023": "The Vice-President's Rajya Sabha Chairman role is not performed while the Vice-President is acting as President.",
  "POL-CP008-V5-024": "The Vice-President cannot perform presidential functions and Rajya Sabha Chairman duties at the same time.",
  "POL-CP008-V5-025": "Members of both Houses of Parliament elect the Vice-President. State Legislatures do not take part.",
  "POL-CP008-V5-026": "Nominated MPs also vote in the Vice-Presidential election because Article 66 includes all members of both Houses.",
  "POL-CP008-V5-027": "State MLAs do not vote for the Vice-President. The electoral college is limited to members of Parliament.",
  "POL-CP008-V5-028": "The Vice-Presidential electoral college includes both elected and nominated members of Lok Sabha and Rajya Sabha.",
  "POL-CP008-V5-029": "The Vice-President is elected by proportional representation through the single transferable vote. It is an indirect election.",
  "POL-CP008-V5-030": "Voting in the Vice-Presidential election is by secret ballot. Members do not use an open ballot.",
  "POL-CP008-V5-031": "The Vice-Presidential election uses the single transferable vote, under which members rank candidates by preference.",
  "POL-CP008-V5-032": "The Vice-Presidential election is indirect because members of Parliament elect the Vice-President, not the general public.",
  "POL-CP008-V5-033": "Age is one part of Article 66.\nQualifications:\n• Citizen of India\n• At least 35 years old\n• Qualified for Rajya Sabha election\n• No disqualifying office of profit.",
  "POL-CP008-V5-034": "Rajya Sabha eligibility is required, not existing membership.\nQualifications:\n• Citizen of India\n• At least 35 years old\n• Qualified for Rajya Sabha election\n• No disqualifying office of profit.",
  "POL-CP008-V5-035": "Citizenship is compulsory under Article 66.\nQualifications:\n• Citizen of India\n• At least 35 years old\n• Qualified for Rajya Sabha election\n• No disqualifying office of profit.",
  "POL-CP008-V5-036": "Office of profit is part of the Article 66 test.\nQualifications:\n• Citizen of India\n• At least 35 years old\n• Qualified for Rajya Sabha election\n• No disqualifying office of profit.",
  "POL-CP008-V5-037": "If an MP is elected Vice-President, the parliamentary seat becomes vacant when the person enters office. Both positions cannot be held together.",
  "POL-CP008-V5-038": "The Vice-President cannot remain a State legislator after entering office. The legislative seat is vacated on taking office.",
  "POL-CP008-V5-039": "Article 66 bars a disqualifying office of profit.\nQualifications:\n• Citizen of India\n• At least 35 years old\n• Qualified for Rajya Sabha election\n• No disqualifying office of profit.",
  "POL-CP008-V5-040": "The Vice-President's normal term is five years from the date of entering office.",
  "POL-CP008-V5-041": "The Vice-President resigns by writing to the President. This is different from the President, who resigns to the Vice-President.",
  "POL-CP008-V5-042": "After the five-year term ends, the Vice-President continues until the successor enters office, preventing a gap in the post.",
  "POL-CP008-V5-043": "A resolution to remove the Vice-President must start in Rajya Sabha. Lok Sabha cannot initiate it.",
  "POL-CP008-V5-044": "Rajya Sabha must pass the removal resolution by a majority of all its then members.",
  "POL-CP008-V5-045": "At least 14 days' notice is required before moving a resolution to remove the Vice-President.",
  "POL-CP008-V5-046": "The Vice-President is removed by a Rajya Sabha resolution that Lok Sabha agrees to. This is not presidential impeachment.",
  "POL-CP008-V5-047": "The Vice-President is not impeached like the President. Removal follows Article 67 and starts only in Rajya Sabha.",
  "POL-CP008-V5-048": "Article 67 does not state a specific ground for removing the Vice-President, unlike presidential impeachment.",
  "POL-CP008-V5-049": "A casual vacancy in the Vice-President's office must be filled as soon as possible. Article 68 sets no six-month limit.",
  "POL-CP008-V5-050": "A Vice-President elected after a casual vacancy gets a fresh five-year term, not merely the remaining part of the earlier term.",
  "POL-CP008-V5-051": "When the normal Vice-Presidential term is ending, the election of the successor must be completed before the term expires.",
  "POL-CP008-V5-052": "The Vice-President takes the oath before the President or a person appointed by the President.",
  "POL-CP008-V5-053": "Article 69 contains the Vice-President's oath and states the authority before whom it is taken.",
  "POL-CP008-V5-054": "The Vice-Presidential oath requires true faith and allegiance to the Constitution of India and faithful discharge of duty.",
  "POL-CP008-V5-055": "The Supreme Court decides disputes relating to the Vice-Presidential election under Article 71.",
  "POL-CP008-V5-056": "The Supreme Court's decision in a Vice-Presidential election dispute is final under Article 71.",
  "POL-CP008-V5-057": "A vacant seat in the electoral college does not by itself invalidate the Vice-Presidential election.",
  "POL-CP008-V5-058": "All three statements are correct: State MLAs vote for President but not Vice-President, while nominated MPs vote for Vice-President.",
  "POL-CP008-V5-059": "All three statements are correct: President requires Lok Sabha qualification, Vice-President Rajya Sabha qualification, and both require a minimum age of 35.",
  "POL-CP008-V5-060": "Only two statements are correct. The President and Vice-President resign to each other, but their removal procedures are different.",
};

export function generatePolCp008ReviewBatchV6() {
  const questions = generatePolCp008ReviewBatchV5().map((q, index) => {
    const explanation = EXPLANATIONS[q.questionId];
    if (!explanation) throw new Error(`Missing V6 explanation for ${q.questionId}`);
    return { ...q, questionId: `POL-CP008-V6-${String(index + 1).padStart(3, "0")}`, explanation };
  });
  if (new Set(questions.map(q => q.explanation)).size !== questions.length) throw new Error("Repeated V6 explanation");
  const qualificationIds = new Set(["POL-CP008-V6-003","POL-CP008-V6-033","POL-CP008-V6-034","POL-CP008-V6-035","POL-CP008-V6-036","POL-CP008-V6-039"]);
  for (const q of questions) {
    const words = q.explanation.trim().split(/\s+/).length;
    const maxWords = qualificationIds.has(q.questionId) ? 55 : 24;
    if (words < 11 || words > maxWords) throw new Error(`V6 explanation length ${q.questionId}: ${words}`);
    if (/Correct answer|exact subject|nearby Articles|match the topic|remember the word|constitutionally vested|to the extent granted/i.test(q.explanation)) {
      throw new Error(`Generic/wordy V6 explanation in ${q.questionId}`);
    }
  }
  return questions;
}
