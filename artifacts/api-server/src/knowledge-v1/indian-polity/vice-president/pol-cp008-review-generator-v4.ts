import { generatePolCp008ReviewBatchV3 } from "./pol-cp008-review-generator-v3";

const EXPLANATIONS: Record<string, string> = {
  "POL-CP008-V3-001": "Article 63 creates the office of the Vice-President of India.",
  "POL-CP008-V3-002": "Article 64 makes the Vice-President ex officio Chairman of Rajya Sabha.",
  "POL-CP008-V3-003": "Article 66 deals with the election of the Vice-President.",
  "POL-CP008-V3-004": "Article 67 covers the Vice-President's term, resignation and removal.",
  "POL-CP008-V3-005": "Article 65 covers the Vice-President acting as President.",
  "POL-CP008-V3-006": "Article 68 deals with elections to fill a vacancy in the Vice-President's office.",
  "POL-CP008-V3-007": "Article 69 contains the Vice-President's oath or affirmation.",
  "POL-CP008-V3-008": "Article 71 deals with disputes over President and Vice-President elections.",
  "POL-CP008-V3-009": "The Vice-President is ex officio Chairman of Rajya Sabha.",
  "POL-CP008-V3-010": "Article 64 gives the Vice-President the Rajya Sabha Chairmanship.",
  "POL-CP008-V3-011": "The Rajya Sabha Chairmanship comes automatically with the office of Vice-President.",
  "POL-CP008-V3-012": "The Vice-President's regular parliamentary role is Chairman of the Council of States, or Rajya Sabha.",
  "POL-CP008-V3-013": "When the President's office becomes vacant, the Vice-President acts as President.",
  "POL-CP008-V3-014": "Article 65 authorises the Vice-President to act as President in a vacancy.",
  "POL-CP008-V3-015": "While acting as President, the Vice-President receives the President's powers and immunities.",
  "POL-CP008-V3-016": "The Vice-President acts as President only until the newly elected President takes office.",
  "POL-CP008-V3-017": "During the President's temporary inability, the Vice-President performs the President's functions.",
  "POL-CP008-V3-018": "The Vice-President's temporary role ends when the President resumes duties.",
  "POL-CP008-V3-019": "Article 65 also covers temporary inability of the President.",
  "POL-CP008-V3-020": "Article 65 applies to temporary inability caused by absence, illness or another reason.",
  "POL-CP008-V3-021": "No. While acting as President, the Vice-President does not perform Rajya Sabha Chairman duties.",
  "POL-CP008-V3-022": "No. While acting as President, the Vice-President does not receive the salary attached to the Rajya Sabha Chairmanship.",
  "POL-CP008-V3-023": "The Rajya Sabha Chairman role is not performed while the Vice-President is acting as President.",
  "POL-CP008-V3-024": "The Vice-President cannot perform presidential functions and Rajya Sabha Chairman duties at the same time.",
  "POL-CP008-V3-025": "Members of Lok Sabha and Rajya Sabha elect the Vice-President.",
  "POL-CP008-V3-026": "Nominated MPs vote in the Vice-Presidential election because Article 66 includes all members of both Houses.",
  "POL-CP008-V3-027": "State MLAs do not vote; the Vice-Presidential electoral college is limited to Parliament.",
  "POL-CP008-V3-028": "Both elected and nominated MPs take part in the Vice-Presidential election.",
  "POL-CP008-V3-029": "The Vice-President is elected by proportional representation using the single transferable vote.",
  "POL-CP008-V3-030": "Voting in the Vice-Presidential election is by secret ballot.",
  "POL-CP008-V3-031": "The Vice-Presidential election uses the single transferable vote system.",
  "POL-CP008-V3-032": "The public does not vote directly; members of Parliament elect the Vice-President.",
  "POL-CP008-V3-033": "A Vice-Presidential candidate must be at least 35 years old.",
  "POL-CP008-V3-034": "The candidate must be qualified for election to Rajya Sabha.",
  "POL-CP008-V3-035": "Indian citizenship is required to contest the Vice-Presidential election.",
  "POL-CP008-V3-036": "A disqualifying office of profit makes a person ineligible to contest for Vice-President.",
  "POL-CP008-V3-037": "An MP elected Vice-President vacates the parliamentary seat on entering office.",
  "POL-CP008-V3-038": "The Vice-President cannot remain a State legislator after taking office.",
  "POL-CP008-V3-039": "A disqualifying office of profit makes the candidate ineligible.",
  "POL-CP008-V3-040": "The Vice-President's normal term is five years.",
  "POL-CP008-V3-041": "The Vice-President sends a resignation to the President.",
  "POL-CP008-V3-042": "After the term ends, the Vice-President continues until the successor takes office.",
  "POL-CP008-V3-043": "A removal resolution against the Vice-President must start in Rajya Sabha.",
  "POL-CP008-V3-044": "Rajya Sabha must pass the removal resolution by a majority of all its then members.",
  "POL-CP008-V3-045": "At least 14 days' notice is required before moving the removal resolution.",
  "POL-CP008-V3-046": "Removal requires a Rajya Sabha resolution that is agreed to by Lok Sabha.",
  "POL-CP008-V3-047": "The Vice-President is removed under Article 67, not impeached like the President.",
  "POL-CP008-V3-048": "Article 67 does not state a specific ground for removing the Vice-President.",
  "POL-CP008-V3-049": "A casual vacancy in the Vice-President's office must be filled as soon as possible.",
  "POL-CP008-V3-050": "A Vice-President elected after a casual vacancy receives a fresh five-year term.",
  "POL-CP008-V3-051": "For normal expiry, the next Vice-Presidential election must be completed before the term ends.",
  "POL-CP008-V3-052": "The Vice-President takes the oath before the President or a person appointed by the President.",
  "POL-CP008-V3-053": "Article 69 contains the Vice-President's oath.",
  "POL-CP008-V3-054": "The oath requires true faith and allegiance to the Constitution of India.",
  "POL-CP008-V3-055": "The Supreme Court decides disputes relating to the Vice-Presidential election.",
  "POL-CP008-V3-056": "The Supreme Court's decision in a Vice-Presidential election dispute is final.",
  "POL-CP008-V3-057": "A vacant seat in the electoral college does not by itself invalidate the election.",
  "POL-CP008-V3-058": "All three are correct: State MLAs vote for President, not Vice-President, and nominated MPs vote for Vice-President.",
  "POL-CP008-V3-059": "All three are correct: President requires Lok Sabha qualification, Vice-President Rajya Sabha qualification, and both require age 35.",
  "POL-CP008-V3-060": "Only statements 1 and 2 are correct; the President and Vice-President have different removal procedures.",
};

export function generatePolCp008ReviewBatchV4() {
  const questions = generatePolCp008ReviewBatchV3().map((q, index) => {
    const explanation = EXPLANATIONS[q.questionId];
    if (!explanation) throw new Error(`Missing V4 explanation for ${q.questionId}`);
    return { ...q, questionId: `POL-CP008-V4-${String(index + 1).padStart(3, "0")}`, explanation };
  });
  if (new Set(questions.map(q => q.explanation)).size !== questions.length) throw new Error("Repeated V4 explanation");
  for (const q of questions) {
    const words = q.explanation.trim().split(/\s+/).length;
    if (words < 6 || words > 24) throw new Error(`V4 explanation length ${q.questionId}: ${words}`);
    if (/Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i.test(q.explanation)) throw new Error(`Generic explanation clutter in ${q.questionId}`);
  }
  return questions;
}