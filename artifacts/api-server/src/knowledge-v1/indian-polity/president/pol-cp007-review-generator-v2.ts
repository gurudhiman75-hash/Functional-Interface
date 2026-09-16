import { generatePolCp007ReviewBatchV1 } from "./pol-cp007-review-generator-v1";

const SIMPLE_EXPLANATIONS: Record<string, string> = {
  "POL-007-QL-001": "Articles 52 to 62 cover the President. Each Article has a separate topic, such as election, term, qualifications, oath, impeachment or vacancy.",
  "POL-007-QL-002": "Articles 52 to 62 divide the main rules about the President into separate Articles. Match the topic with the Article that directly deals with it.",
  "POL-007-QL-003": "Only elected MPs and elected MLAs vote in the presidential election. Nominated MPs and members of State Legislative Councils do not vote. Elected MLAs of Delhi and Puducherry are included.",
  "POL-007-QL-004": "The President is elected indirectly by proportional representation through the single transferable vote. Voting is by secret ballot, as provided in Article 55.",
  "POL-007-QL-005": "The President normally holds office for five years. The President resigns to the Vice-President and continues in office until the successor takes charge.",
  "POL-007-QL-006": "Article 57 allows a President to be elected again if the person still meets the constitutional qualifications. The Constitution does not set a maximum number of terms.",
  "POL-007-QL-007": "A candidate for President must be an Indian citizen, at least 35 years old, qualified for election to Lok Sabha and free from a disqualifying office of profit.",
  "POL-007-QL-008": "The President cannot remain an MP or State legislator after entering office and cannot hold another office of profit during the presidential term.",
  "POL-007-QL-009": "The President normally takes the oath before the Chief Justice of India. If the Chief Justice is unavailable, the senior-most available Supreme Court judge administers it.",
  "POL-007-QL-010": "The President can be impeached only for violation of the Constitution. Either House of Parliament may start the charge, and the other House investigates it.",
  "POL-007-QL-011": "Presidential impeachment has strict rules: at least 14 days' notice, support of at least one-fourth of the initiating House, and the required two-thirds majority of total membership.",
  "POL-007-QL-012": "A casual vacancy in the President's office must be filled within six months. The person elected gets a fresh five-year term from the date of entering office.",
  "POL-007-QL-013": "The Supreme Court decides disputes about presidential and Vice-Presidential elections. Its decision is final, and a vacancy in the electoral college alone does not cancel the election.",
  "POL-007-QL-014": "Article 72 gives the President clemency powers in specified cases, including Court Martial cases, Union-law offences and all cases involving a death sentence.",
  "POL-007-QL-015": "The clemency terms have different meanings. Pardon removes punishment, commutation changes it to a lighter form, remission reduces it, respite gives a lesser sentence, and reprieve delays execution.",
  "POL-007-QL-016": "The President normally acts on the advice of the Council of Ministers. The President may ask for reconsideration once, but must accept the advice when it is sent again.",
  "POL-007-QL-017": "Article 85 deals with summoning Parliament, proroguing its Houses and dissolving Lok Sabha. These formal powers are exercised within the parliamentary system.",
  "POL-007-QL-018": "Under Article 111, the President may return a non-Money Bill once for reconsideration. If Parliament passes it again, the President must give assent.",
  "POL-007-QL-019": "Article 123 allows the President to issue an Ordinance when both Houses are not sitting together and immediate action is needed. It normally ends six weeks after Parliament reassembles.",
  "POL-007-QL-020": "Article 53 vests the Union's executive power and supreme command of the Defence Forces in the President. These powers operate under the Constitution and the parliamentary system.",
  "POL-007-QL-021": "This question mixes different rules about the President. Check each statement separately against the correct rule on election, term, impeachment or presidential powers.",
  "POL-007-QL-022": "Remember the word elected. Nominated MPs and Legislative Council members do not vote for President, while elected MLAs of Delhi and Puducherry do vote.",
};

const STEM_REPLACEMENTS: Record<string, string> = {
  "Who participates in the election of the President?": "Who votes in the presidential election?",
  "Members of State Legislative Councils in the presidential election:": "Members of State Legislative Councils:",
  "For the presidential election, elected MLAs of Delhi and Puducherry:": "Elected MLAs of Delhi and Puducherry:",
  "A nominated Lok Sabha member in the presidential election:": "A nominated Lok Sabha member:",
  "The voting system used for presidential election is:": "The presidential election uses:",
  "A former President of India:": "A former President:",
  "A presidential candidate must be qualified for election to the:": "A candidate for President must qualify for election to the:",
  "A person holding a disqualifying office of profit is:": "A person holding a disqualifying office of profit:",
  "If the Chief Justice of India is unavailable, the presidential oath is taken before:": "If the Chief Justice of India is unavailable, the President takes the oath before:",
  "A charge for impeachment of the President may be preferred by:": "Who can start impeachment of the President?",
  "The initiating House must pass the impeachment resolution by:": "The initiating House must pass impeachment by:",
  "The investigating House sustains the charge by:": "The other House must sustain the charge by:",
  "A person elected to fill a casual presidential vacancy receives:": "A person elected after a casual presidential vacancy gets:",
  "A presidential election can be challenged merely because a seat in the electoral college is vacant:": "Does a vacant seat in the electoral college by itself invalidate the presidential election?",
  "For offences under Union executive power, clemency may be granted by the:": "For offences under Union executive power, clemency may be granted by:",
  "After receiving ministerial advice, the President may:": "After receiving ministerial advice, the President can:",
  "After advice is reconsidered and returned, the President:": "After reconsidered advice is returned, the President:",
  "Which Bill cannot be returned by the President under Article 111 for reconsideration?": "Which Bill cannot be returned under Article 111?",
  "An Ordinance may be promulgated when:": "An Ordinance may be issued when:",
  "A presidential Ordinance has:": "A valid presidential Ordinance has:",
};

function simplifyStem(stem: string) {
  return STEM_REPLACEMENTS[stem] ?? stem
    .replace("is covered by:", "is under:")
    .replace("is provided in:", "is under:")
    .replace("is provided under:", "is under:");
}

export function generatePolCp007ReviewBatchV2() {
  return generatePolCp007ReviewBatchV1().map((q, index) => {
    const explanation = SIMPLE_EXPLANATIONS[q.qlId] ?? q.explanation;
    if (explanation.trim().split(/\s+/).length < 20) throw new Error(`Short explanation in ${q.questionId}`);
    const stem = simplifyStem(q.stem);
    if (!stem.startsWith("Consider the following statements") && stem.trim().split(/\s+/).length > 28) {
      throw new Error(`Long stem in ${q.questionId}: ${stem}`);
    }
    return { ...q, questionId: `POL-CP007-V2-${String(index + 1).padStart(3, "0")}`, stem, explanation };
  });
}
