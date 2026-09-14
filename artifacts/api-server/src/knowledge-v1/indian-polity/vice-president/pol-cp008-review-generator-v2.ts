import { generatePolCp008ReviewBatchV1 } from "./pol-cp008-review-generator-v1";

const SIMPLE_EXPLANATIONS: Record<string, string> = {
  "POL-008-QL-001": "Articles 63 to 71 cover the Vice-President. Each Article has a separate topic, such as the office, election, term, vacancy, oath or election disputes.",
  "POL-008-QL-002": "Articles 63 to 71 divide the main rules about the Vice-President into separate Articles. Match the topic with the Article that directly deals with it.",
  "POL-008-QL-003": "The Vice-President is automatically the Chairman of Rajya Sabha because of Article 64. Rajya Sabha does not elect the Vice-President separately as its Chairman.",
  "POL-008-QL-004": "If the President's office becomes vacant, the Vice-President acts as President under Article 65. During this period, the Vice-President uses the President's constitutional powers and immunities.",
  "POL-008-QL-005": "Article 65 also applies when the President is temporarily unable to work because of absence, illness or another reason. The Vice-President performs the President's functions until the President returns.",
  "POL-008-QL-006": "While acting as President, the Vice-President does not work as Chairman of Rajya Sabha and does not receive the Chairman's salary or allowance for that period.",
  "POL-008-QL-007": "All members of both Houses of Parliament vote in the Vice-Presidential election, including nominated MPs. State MLAs and MLCs do not vote in this election.",
  "POL-008-QL-008": "The Vice-President is elected indirectly by proportional representation through the single transferable vote. Voting is by secret ballot, but the electoral college differs from the President's.",
  "POL-008-QL-009": "A candidate for Vice-President must be an Indian citizen, at least 35 years old, qualified for election to Rajya Sabha and free from a disqualifying office of profit.",
  "POL-008-QL-010": "A person elected Vice-President cannot continue as an MP or State legislator after entering office. A disqualifying office of profit also makes a candidate ineligible.",
  "POL-008-QL-011": "The Vice-President normally serves for five years, resigns to the President and continues in office until the successor takes charge.",
  "POL-008-QL-012": "Removal starts in Rajya Sabha. The resolution needs a majority of all the then members of Rajya Sabha, must be agreed to by Lok Sabha and requires at least 14 days' notice.",
  "POL-008-QL-013": "The Vice-President is not impeached like the President. Removal is under Article 67, starts in Rajya Sabha, and the Constitution does not list a specific ground for removal.",
  "POL-008-QL-014": "A normal Vice-Presidential election must be completed before the term ends. A casual vacancy is filled as soon as possible, and the new Vice-President gets a fresh five-year term.",
  "POL-008-QL-015": "The Vice-President takes the oath before the President, or a person appointed by the President. The oath includes loyalty to the Constitution and faithful performance of duty.",
  "POL-008-QL-016": "The Supreme Court decides disputes about President and Vice-President elections. Its decision is final, and a vacancy in the electoral college alone does not invalidate the election.",
  "POL-008-QL-017": "President and Vice-President rules differ in important places. Compare their electoral colleges, qualifications, resignation recipients, removal methods and parliamentary roles carefully.",
};

const STEM_REPLACEMENTS: Record<string, string> = {
  "The constitutional Article making the Vice-President Chairman of Rajya Sabha is:": "The Vice-President is Chairman of Rajya Sabha under:",
  "The Vice-President becomes Rajya Sabha Chairman:": "The Vice-President becomes Chairman of Rajya Sabha:",
  "The Vice-President's parliamentary role is:": "The Vice-President serves in Parliament as:",
  "While acting as President, the Vice-President has:": "While acting as President, the Vice-President gets:",
  "A presidential vacancy makes the Vice-President:": "If the President's office is vacant, the Vice-President:",
  "If the President is temporarily unable to discharge functions, the functions are discharged by the:": "If the President is temporarily unable to work, the functions are performed by the:",
  "During the President's illness, the Vice-President discharges functions until:": "During the President's illness, the Vice-President acts until:",
  "Which situation is covered by Article 65 besides a presidential vacancy?": "Besides a vacancy, Article 65 also covers:",
  "During a period of acting as President, the Vice-President's Chairman role is:": "While acting as President, the Vice-President's Rajya Sabha Chairman role is:",
  "Article 64 prevents simultaneous performance of:": "The Vice-President cannot perform both:",
  "The Vice-Presidential electoral college includes:": "Who is included in the Vice-Presidential electoral college?",
  "The voting system used for Vice-President is:": "The Vice-Presidential election uses:",
  "A Vice-Presidential candidate must be qualified for election to the:": "A candidate for Vice-President must qualify for election to the:",
  "A person holding a disqualifying office of profit is:": "A person holding a disqualifying office of profit:",
  "A disqualifying office of profit for a Vice-Presidential candidate:": "A disqualifying office of profit:",
  "The Rajya Sabha removal resolution requires:": "Rajya Sabha must pass the removal resolution by:",
  "Article 67 states which specific ground for removal of the Vice-President?": "What specific ground does Article 67 give for removing the Vice-President?",
  "A person elected to fill a casual Vice-Presidential vacancy receives:": "A person elected after a casual Vice-Presidential vacancy gets:",
  "The oath requires the Vice-President to bear true faith and allegiance to the:": "The Vice-President's oath requires loyalty to the:",
  "A vacancy in the electoral college by itself invalidates the Vice-Presidential election:": "Does a vacant seat in the electoral college by itself invalidate the Vice-Presidential election?",
};

function simplifyStem(stem: string) {
  return STEM_REPLACEMENTS[stem] ?? stem
    .replace("is covered by:", "is under:")
    .replace("is provided in:", "is under:")
    .replace("is provided under:", "is under:");
}

export function generatePolCp008ReviewBatchV2() {
  return generatePolCp008ReviewBatchV1().map((q, index) => {
    const explanation = SIMPLE_EXPLANATIONS[q.qlId] ?? q.explanation;
    if (explanation.trim().split(/\s+/).length < 20) throw new Error(`Short explanation in ${q.questionId}`);
    const stem = simplifyStem(q.stem);
    if (!stem.startsWith("Consider the following statements") && stem.trim().split(/\s+/).length > 28) {
      throw new Error(`Long stem in ${q.questionId}: ${stem}`);
    }
    return { ...q, questionId: `POL-CP008-V2-${String(index + 1).padStart(3, "0")}`, stem, explanation };
  });
}
