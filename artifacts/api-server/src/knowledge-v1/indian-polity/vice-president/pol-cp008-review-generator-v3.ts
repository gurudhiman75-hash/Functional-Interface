import { generatePolCp008ReviewBatchV2 } from "./pol-cp008-review-generator-v2";
import type { PolCp008ReviewQuestion } from "./pol-cp008-review-types";

function articleFromStem(stem: string) {
  return stem.match(/Article\s+(\d+[A-Z]?)/)?.[1];
}

function subjectFromStem(stem: string) {
  return stem.replace(/\s+is under:$/, "").trim();
}

function explain(q: PolCp008ReviewQuestion): string {
  const a = q.canonicalAnswer;
  const s = q.stem;

  switch (q.qlId) {
    case "POL-008-QL-001": {
      const article = articleFromStem(s);
      return `Article ${article} deals with ${a.toLowerCase()}. Articles 63–71 divide the Vice-President's office into separate rules, so this Article should be matched with this exact topic.`;
    }
    case "POL-008-QL-002": {
      const subject = subjectFromStem(s);
      return `${a} is correct because it deals with ${subject.toLowerCase()}. The neighbouring Articles cover different Vice-Presidential rules such as election, term, oath and disputes.`;
    }
    case "POL-008-QL-003":
      if (a === "Rajya Sabha") return "The Vice-President is ex officio Chairman of Rajya Sabha. This role comes automatically with the Vice-Presidential office under Article 64.";
      if (a === "Article 64") return "Article 64 makes the Vice-President ex officio Chairman of Rajya Sabha. No separate election by Rajya Sabha is needed for this chairmanship.";
      if (a.includes("By virtue")) return "The Vice-President becomes Chairman of Rajya Sabha simply by holding the Vice-Presidential office. It is an ex officio role, not a separate post won by another election.";
      return "The Vice-President serves as ex officio Chairman of the Council of States, which is Rajya Sabha. This is the Vice-President's regular parliamentary role.";
    case "POL-008-QL-004":
      if (a === "Vice-President") return "When the President's office becomes vacant, the Vice-President acts as President. This temporary arrangement is provided by Article 65.";
      if (a === "Article 65") return "Article 65 deals with the Vice-President acting as President when the presidential office is vacant and also with temporary inability of the President.";
      if (a.includes("powers and immunities")) return "While acting as President, the Vice-President receives the powers and immunities of the President for that period, not merely the powers of Rajya Sabha Chairman.";
      return "If the President's office is vacant, the Vice-President acts as President until the newly elected President enters office. The Vice-President does not automatically become President for a fresh term.";
    case "POL-008-QL-005":
      if (a === "Vice-President") return "If the President is temporarily unable to work, the Vice-President performs the President's functions. This is different from a permanent vacancy in the office.";
      if (a === "The President resumes duties") return "During temporary illness or absence of the President, the Vice-President performs the functions only until the President is able to resume them.";
      if (a === "Article 65") return "Article 65 covers both a vacancy in the President's office and temporary inability of the President to discharge the functions of office.";
      return "Article 65 also covers temporary inability caused by absence, illness or another reason. The Vice-President then performs the President's functions for the limited period.";
    case "POL-008-QL-006":
      if (a === "No") return "While acting as President, the Vice-President does not perform the duties of Rajya Sabha Chairman. The two roles are not exercised together during that period.";
      if (a === "Not performed") return "The Rajya Sabha Chairman role is not performed by the Vice-President while the Vice-President is acting as President or discharging presidential functions.";
      return "Article 64 keeps the two roles separate: while performing presidential functions, the Vice-President does not simultaneously perform Rajya Sabha Chairman duties.";
    case "POL-008-QL-007":
      if (a === "Members of both Houses of Parliament") return "The Vice-President is elected by members of Lok Sabha and Rajya Sabha. Unlike the presidential election, State legislators do not take part.";
      if (a === "Yes") return "Yes. Nominated MPs vote in the Vice-Presidential election because Article 66 includes members of both Houses, not only elected members.";
      if (a === "No") return "No. State MLAs do not vote for the Vice-President. The electoral college is limited to members of both Houses of Parliament.";
      return "The Vice-Presidential electoral college includes both elected and nominated members of Lok Sabha and Rajya Sabha. State Legislatures are excluded.";
    case "POL-008-QL-008":
      if (a.includes("Proportional representation")) return "The Vice-President is elected by proportional representation through the single transferable vote. It is not a direct popular election.";
      if (a === "Secret ballot") return "Voting for the Vice-President is by secret ballot. Members do not use an open ballot for this election.";
      if (a === "Single transferable vote") return "The election uses the single transferable vote. Voters rank candidates, allowing preferences to transfer during counting.";
      return "The Vice-Presidential election is indirect because members of Parliament elect the Vice-President; the general public does not vote directly for the office.";
    case "POL-008-QL-009":
      if (a === "35 years") return "A candidate for Vice-President must have completed 35 years of age. This age requirement is part of Article 66.";
      if (a === "Rajya Sabha") return "A Vice-Presidential candidate must be qualified for election to Rajya Sabha. This is a key difference from the President, who must qualify for Lok Sabha.";
      if (a === "Citizen of India") return "Indian citizenship is one of the constitutional qualifications for election as Vice-President, along with age and Rajya Sabha eligibility.";
      return "A person holding a disqualifying office of profit is not eligible to be elected Vice-President, subject to the constitutional exceptions.";
    case "POL-008-QL-010":
      if (a.includes("Is vacated")) return "If an MP is elected Vice-President, the parliamentary seat becomes vacant when the person enters office. The two positions cannot be held together.";
      if (a === "No") return "The Vice-President cannot continue as a State legislator after entering office. The legislative seat is vacated when the Vice-President takes office.";
      return "A disqualifying office of profit makes a person ineligible to be elected Vice-President. This condition is part of Article 66.";
    case "POL-008-QL-011":
      if (a === "Five years") return "The Vice-President's normal term is five years from entering office. The office may end earlier by resignation, removal or another vacancy.";
      if (a === "President") return "The Vice-President resigns by writing to the President. This is the reverse of the President, who resigns to the Vice-President.";
      return "After the five-year term ends, the Vice-President continues until the successor enters office. This avoids a gap in the office at normal expiry.";
    case "POL-008-QL-012":
      if (a === "Rajya Sabha") return "A resolution to remove the Vice-President must start in Rajya Sabha. Lok Sabha cannot initiate this removal resolution.";
      if (a.includes("majority of all the then members")) return "Rajya Sabha must pass the removal resolution by a majority of all the then members. This is different from the President's two-thirds-total-membership impeachment majority.";
      return "At least 14 days' notice is required before moving the resolution to remove the Vice-President. The process cannot be started without this notice period.";
    case "POL-008-QL-013":
      if (a.includes("Rajya Sabha resolution")) return "The Vice-President is removed by a Rajya Sabha resolution that Lok Sabha agrees to. This is not the impeachment process used for the President.";
      if (a === "No") return "No. The Vice-President is not impeached like the President. Removal follows Article 67 and begins only in Rajya Sabha.";
      return "Article 67 does not state a specific ground such as 'violation of the Constitution' for removing the Vice-President. That ground belongs to presidential impeachment.";
    case "POL-008-QL-014":
      if (a === "As soon as possible") return "A casual vacancy in the Vice-President's office must be filled as soon as possible. Article 68 does not set the same six-month limit used for a presidential casual vacancy.";
      if (a.includes("full five-year term")) return "A Vice-President elected after a casual vacancy gets a fresh five-year term from entering office, not merely the remaining part of the previous term.";
      return "When the normal Vice-Presidential term is ending, the election for the successor must be completed before that term expires.";
    case "POL-008-QL-015":
      if (a.includes("President or a person appointed")) return "The Vice-President takes the oath before the President, or before a person appointed by the President. The Chief Justice of India is not the normal oath authority here.";
      if (a === "Article 69") return "Article 69 contains the oath or affirmation for the Vice-President. It states both the oath and the authority before whom it is taken.";
      return "The Vice-Presidential oath includes true faith and allegiance to the Constitution of India and faithful discharge of the duties of office.";
    case "POL-008-QL-016":
      if (a === "Supreme Court") return "The Supreme Court decides disputes connected with the election of the President and Vice-President under Article 71.";
      if (a === "Final") return "The Supreme Court's decision in a Vice-Presidential election dispute is final under Article 71.";
      return "No. A vacancy in the electoral college by itself does not invalidate the Vice-Presidential election. Article 71 expressly prevents that objection alone from defeating the election.";
    case "POL-008-QL-017":
      if (s.includes("elected State MLAs")) return "All three statements are correct. State MLAs vote for President but not Vice-President, and nominated MPs do vote in the Vice-Presidential election.";
      if (s.includes("qualify for Lok Sabha")) return "All three statements are correct: a President candidate must qualify for Lok Sabha, a Vice-President candidate for Rajya Sabha, and both must be at least 35 years old.";
      return "Only two statements are correct. The President resigns to the Vice-President and the Vice-President to the President, but their removal procedures are different.";
    default:
      return q.explanation;
  }
}

export function generatePolCp008ReviewBatchV3() {
  const questions = generatePolCp008ReviewBatchV2().map((q, index) => ({
    ...q,
    questionId: `POL-CP008-V3-${String(index + 1).padStart(3, "0")}`,
    explanation: explain(q),
  }));

  for (const q of questions) {
    if (q.explanation.trim().split(/\s+/).length < 18) throw new Error(`Weak explanation in ${q.questionId}`);
    if (q.explanation.trim().toLowerCase() === q.canonicalAnswer.trim().toLowerCase()) throw new Error(`Answer-only explanation in ${q.questionId}`);
  }

  for (const qlId of new Set(questions.map(q => q.qlId))) {
    const group = questions.filter(q => q.qlId === qlId);
    if (new Set(group.map(q => q.explanation)).size !== group.length) throw new Error(`Repeated explanation in ${qlId}`);
  }

  return questions;
}
