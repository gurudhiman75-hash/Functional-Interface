import { generatePolCp008ReviewBatchV4 } from "./pol-cp008-review-generator-v4";

const EXPLANATIONS: Record<string, string> = {
  "POL-CP008-V4-001": "Article 63 creates the office of the Vice-President.",
  "POL-CP008-V4-002": "Article 64 makes the Vice-President Chairman of Rajya Sabha.",
  "POL-CP008-V4-003": "Article 66 covers the Vice-President's election.",
  "POL-CP008-V4-004": "Article 67 covers term, resignation and removal.",
  "POL-CP008-V4-005": "Article 65 covers acting as President.",
  "POL-CP008-V4-006": "Article 68 covers elections for a Vice-Presidential vacancy.",
  "POL-CP008-V4-007": "Article 69 gives the Vice-President's oath.",
  "POL-CP008-V4-008": "Article 71 covers election disputes.",
  "POL-CP008-V4-009": "The Vice-President is Chairman of Rajya Sabha by office.",
  "POL-CP008-V4-010": "Article 64 gives the Vice-President the Rajya Sabha Chairmanship.",
  "POL-CP008-V4-011": "The Chairmanship comes automatically with the Vice-President's office.",
  "POL-CP008-V4-012": "The Vice-President's parliamentary role is Chairman of Rajya Sabha.",
  "POL-CP008-V4-013": "If the President's office is vacant, the Vice-President acts as President.",
  "POL-CP008-V4-014": "Article 65 allows the Vice-President to act as President.",
  "POL-CP008-V4-015": "While acting as President, the Vice-President gets the President's powers and immunities.",
  "POL-CP008-V4-016": "The Vice-President acts until the new President takes office.",
  "POL-CP008-V4-017": "During temporary inability, the Vice-President performs the President's functions.",
  "POL-CP008-V4-018": "This temporary role ends when the President resumes duties.",
  "POL-CP008-V4-019": "Article 65 also covers temporary inability of the President.",
  "POL-CP008-V4-020": "Absence or illness can trigger this temporary arrangement.",
  "POL-CP008-V4-021": "While acting as President, the Vice-President does not chair Rajya Sabha.",
  "POL-CP008-V4-022": "While acting as President, the Vice-President does not get the Chairman's salary.",
  "POL-CP008-V4-023": "The Rajya Sabha Chairman role stops during the acting-President period.",
  "POL-CP008-V4-024": "The Vice-President cannot perform both roles at the same time.",
  "POL-CP008-V4-025": "Members of both Houses of Parliament elect the Vice-President.",
  "POL-CP008-V4-026": "Nominated MPs also vote in the Vice-Presidential election.",
  "POL-CP008-V4-027": "State MLAs do not vote; only Parliament elects the Vice-President.",
  "POL-CP008-V4-028": "Both elected and nominated MPs take part.",
  "POL-CP008-V4-029": "The election uses proportional representation and single transferable vote.",
  "POL-CP008-V4-030": "Voting is by secret ballot.",
  "POL-CP008-V4-031": "The election uses the single transferable vote system.",
  "POL-CP008-V4-032": "The public does not vote directly; MPs elect the Vice-President.",
  "POL-CP008-V4-033": "The minimum age is 35 years.",
  "POL-CP008-V4-034": "The candidate must qualify for Rajya Sabha election.",
  "POL-CP008-V4-035": "Indian citizenship is required.",
  "POL-CP008-V4-036": "Holding a prohibited office of profit makes the candidate ineligible.",
  "POL-CP008-V4-037": "An MP elected Vice-President vacates the seat on taking office.",
  "POL-CP008-V4-038": "The Vice-President cannot remain a State legislator.",
  "POL-CP008-V4-039": "A prohibited office of profit makes the candidate ineligible.",
  "POL-CP008-V4-040": "The Vice-President's normal term is five years.",
  "POL-CP008-V4-041": "The Vice-President resigns to the President.",
  "POL-CP008-V4-042": "The Vice-President stays until the successor takes office.",
  "POL-CP008-V4-043": "The removal resolution must start in Rajya Sabha.",
  "POL-CP008-V4-044": "Rajya Sabha needs a majority of all its then members.",
  "POL-CP008-V4-045": "At least 14 days' notice is required.",
  "POL-CP008-V4-046": "Lok Sabha must agree to the Rajya Sabha removal resolution.",
  "POL-CP008-V4-047": "The Vice-President is removed under Article 67, not impeached.",
  "POL-CP008-V4-048": "Article 67 gives no specific ground for removal.",
  "POL-CP008-V4-049": "A casual vacancy must be filled as soon as possible.",
  "POL-CP008-V4-050": "The new Vice-President gets a fresh five-year term.",
  "POL-CP008-V4-051": "For normal expiry, the election must finish before the term ends.",
  "POL-CP008-V4-052": "The oath is taken before the President or the President's nominee.",
  "POL-CP008-V4-053": "Article 69 gives the Vice-President's oath.",
  "POL-CP008-V4-054": "The oath requires loyalty to the Constitution of India.",
  "POL-CP008-V4-055": "The Supreme Court decides Vice-Presidential election disputes.",
  "POL-CP008-V4-056": "The Supreme Court's decision is final.",
  "POL-CP008-V4-057": "A vacant electoral-college seat alone does not invalidate the election.",
  "POL-CP008-V4-058": "All three are correct: State MLAs do not vote, but nominated MPs do.",
  "POL-CP008-V4-059": "All three are correct: Lok Sabha for President, Rajya Sabha for Vice-President, age 35 for both.",
  "POL-CP008-V4-060": "Only statements 1 and 2 are correct; their removal methods differ.",
};

export function generatePolCp008ReviewBatchV5() {
  const questions = generatePolCp008ReviewBatchV4().map((q, index) => {
    const explanation = EXPLANATIONS[q.questionId];
    if (!explanation) throw new Error(`Missing V5 explanation for ${q.questionId}`);
    return { ...q, questionId: `POL-CP008-V5-${String(index + 1).padStart(3, "0")}`, explanation };
  });
  if (new Set(questions.map(q => q.explanation)).size !== questions.length) throw new Error("Repeated V5 explanation");
  for (const q of questions) {
    const words = q.explanation.trim().split(/\s+/).length;
    if (words < 4 || words > 18) throw new Error(`V5 explanation length ${q.questionId}: ${words}`);
    if (/Correct answer|exact subject|nearby Articles|match the topic|remember the word|constitutionally vested|to the extent granted/i.test(q.explanation)) {
      throw new Error(`Wordy/generic V5 explanation in ${q.questionId}`);
    }
  }
  return questions;
}
