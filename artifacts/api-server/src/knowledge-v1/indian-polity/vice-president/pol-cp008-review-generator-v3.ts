import { generatePolCp008ReviewBatchV2 } from "./pol-cp008-review-generator-v2";
import type { PolCp008ReviewQuestion } from "./pol-cp008-review-types";

const NOTES: Record<string, string> = {
  "POL-008-QL-001": "Articles 63–71 divide the main rules about the Vice-President into separate Articles. The Article in the question must match its exact constitutional subject.",
  "POL-008-QL-002": "Articles 63–71 separately cover the Vice-President's office, election, term, vacancy, oath and election disputes. Match the topic with the exact Article.",
  "POL-008-QL-003": "Article 64 makes the Vice-President ex officio Chairman of Rajya Sabha. This role comes automatically with the office; Rajya Sabha does not elect the Vice-President separately as Chairman.",
  "POL-008-QL-004": "Article 65 makes the Vice-President act as President when the presidential office is vacant. During that period the Vice-President gets the President's constitutional powers and immunities.",
  "POL-008-QL-005": "Article 65 also covers temporary inability of the President because of absence, illness or another cause. The Vice-President performs presidential functions only until the President resumes them.",
  "POL-008-QL-006": "While acting as President or performing presidential functions, the Vice-President does not perform Rajya Sabha Chairman duties and does not receive the Chairman's salary for that period.",
  "POL-008-QL-007": "Article 66 includes all members of both Houses of Parliament, so nominated MPs vote. State MLAs and MLCs do not vote in the Vice-Presidential election.",
  "POL-008-QL-008": "The Vice-President is elected indirectly by proportional representation through single transferable vote and secret ballot. The method resembles the President's election, but the electoral college is different.",
  "POL-008-QL-009": "Article 66 requires Indian citizenship, age 35, qualification for election to Rajya Sabha and freedom from a disqualifying office of profit.",
  "POL-008-QL-010": "A person elected Vice-President cannot continue as an MP or State legislator after entering office. A disqualifying office of profit also makes a candidate ineligible.",
  "POL-008-QL-011": "Article 67 gives a five-year term, resignation to the President and continuance until the successor enters office, so normal expiry does not immediately empty the office.",
  "POL-008-QL-012": "Removal starts only in Rajya Sabha. The resolution needs a majority of all the then members, Lok Sabha must agree, and at least 14 days' notice is required.",
  "POL-008-QL-013": "The Vice-President is removed under Article 67, not impeached under Article 61. No specific removal ground is stated, and the procedure differs from presidential impeachment.",
  "POL-008-QL-014": "Article 68 requires a normal-expiry election before the term ends and a casual-vacancy election as soon as possible. A casual-vacancy successor gets a fresh five-year term.",
  "POL-008-QL-015": "Article 69 requires the oath before the President or a person appointed by the President. The oath includes allegiance to the Constitution and faithful discharge of duty.",
  "POL-008-QL-016": "Article 71 gives the Supreme Court final authority over President and Vice-President election disputes. A vacancy in the electoral college alone does not invalidate the election.",
  "POL-008-QL-017": "President and Vice-President rules differ in electoral college, qualifications, resignation recipient, removal process and parliamentary role. These differences must be checked statement by statement.",
};

function questionSpecificNote(q: PolCp008ReviewQuestion) {
  if (q.qlId === "POL-008-QL-006" && q.canonicalAnswer === "No") {
    return q.stem.includes("salary")
      ? "No. While acting as President, the Vice-President does not receive the salary or allowance attached to the Rajya Sabha Chairmanship for that period."
      : "No. While acting as President, the Vice-President does not perform Rajya Sabha Chairman duties because the two roles are kept separate during that period.";
  }
  if (q.qlId === "POL-008-QL-017") {
    if (q.stem.includes("elected State MLAs")) return "All three statements are correct: State MLAs vote for President but not Vice-President, and nominated MPs do vote in the Vice-Presidential election.";
    if (q.stem.includes("qualify for Lok Sabha")) return "All three statements are correct: a President candidate must qualify for Lok Sabha, a Vice-President candidate for Rajya Sabha, and both must be at least 35 years old.";
    return "Only two statements are correct: the President resigns to the Vice-President and the Vice-President to the President, but their removal procedures are not the same.";
  }
  return NOTES[q.qlId] ?? q.explanation;
}

function explain(q: PolCp008ReviewQuestion) {
  const note = questionSpecificNote(q);
  return `Correct answer: ${q.canonicalAnswer}. ${note}`;
}

export function generatePolCp008ReviewBatchV3() {
  const questions = generatePolCp008ReviewBatchV2().map((q, index) => ({
    ...q,
    questionId: `POL-CP008-V3-${String(index + 1).padStart(3, "0")}`,
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
