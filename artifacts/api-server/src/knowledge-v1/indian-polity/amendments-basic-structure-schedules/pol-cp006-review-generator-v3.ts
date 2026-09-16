import {
  POL_CP006_HIGH_YIELD_AMENDMENTS_V1,
  POL_CP006_SCHEDULES_V1,
} from "./pol-cp006-facts";
import type { PolCp006ReviewQuestion } from "./pol-cp006-review-types";
import { generatePolCp006ReviewBatchV2 } from "./pol-cp006-review-generator-v2";

const scheduleByName = (name: string) => POL_CP006_SCHEDULES_V1.find((row) => row.schedule === name);
const scheduleBySubject = (subject: string) => POL_CP006_SCHEDULES_V1.find((row) => row.subject === subject);
const amendmentByName = (name: string) => POL_CP006_HIGH_YIELD_AMENDMENTS_V1.find((row) => row.amendment === name);
const amendmentByChange = (change: string) => POL_CP006_HIGH_YIELD_AMENDMENTS_V1.find((row) => row.change === change);

function teachingExplanation(question: PolCp006ReviewQuestion): string {
  const ql = Number(question.qlId.slice(-3));

  if (ql === 1) {
    return "Article 368 is the Constitution's main amendment provision. It gives Parliament constituent power to amend the Constitution and lays down the special procedure for passing a Constitution Amendment Bill.";
  }

  if (ql === 2) {
    if (question.canonicalAnswer === "A minister or a private member") {
      return "A Constitution Amendment Bill is not restricted to government business. It may be introduced by a minister or by a private member, and it may begin in either House of Parliament.";
    }
    return "Unlike a Money Bill, a Constitution Amendment Bill may start in either Lok Sabha or Rajya Sabha. It does not have to originate in one particular House.";
  }

  if (ql === 3) {
    return "The Article 368 special majority has two parts in each House: a majority of the total membership and at least two-thirds of the members present and voting. Both conditions must be satisfied.";
  }

  if (ql === 4) {
    return `State ratification is required only for specified federal provisions, not for every constitutional amendment. A change involving ${question.canonicalAnswer.toLowerCase()} affects the federal arrangement, so at least half of the State Legislatures must ratify it.`;
  }

  if (ql === 5) {
    if (question.canonicalAnswer === "Shall give assent") {
      return "Once an Amendment Bill has been passed in the constitutionally required manner, it is presented to the President. Article 368 requires the President to give assent; the Bill is not returned for reconsideration like an ordinary Bill.";
    }
    return "Each House must pass a Constitution Amendment Bill separately by the required majority. Article 368 provides no joint sitting to break a deadlock between Lok Sabha and Rajya Sabha.";
  }

  if (ql === 6) {
    return "Not every constitutional change uses Article 368. The Constitution expressly allows some matters, such as State reorganisation under Articles 2 to 4 or Legislative Council changes under Article 169, to be made through ordinary parliamentary law after the stated conditions are met.";
  }

  if (ql === 7) {
    if (question.stem.startsWith("Kesavananda Bharati")) {
      return "Kesavananda Bharati (1973) created the basic-structure limitation: Parliament has a wide power to amend the Constitution, but it cannot use that power to destroy its basic structure.";
    }
    if (question.stem.startsWith("Minerva Mills")) {
      return "Minerva Mills (1980) reaffirmed that Parliament's amending power is itself limited. It also stressed harmony between Fundamental Rights and Directive Principles as part of the constitutional balance.";
    }
    if (question.stem.startsWith("S. R. Bommai")) {
      return "S. R. Bommai (1994) is important here because the Supreme Court treated secularism as a basic feature of the Constitution. An amendment cannot destroy that basic constitutional character.";
    }
    return "I. R. Coelho (2007) clarified that laws placed in the Ninth Schedule after 24 April 1973 are not automatically beyond judicial review. They can still be tested against the basic-structure doctrine where protected constitutional rights are seriously damaged.";
  }

  if (ql === 8) {
    return "The basic-structure doctrine does not stop Parliament from amending the Constitution. It stops Parliament from using the amending power to destroy the Constitution's essential identity. Kesavananda Bharati is the landmark case for this rule.";
  }

  if (ql === 9) {
    return `${question.canonicalAnswer} has been recognised in basic-structure jurisprudence. The important point is that the Constitution contains no single exhaustive list; the Supreme Court has identified basic features through different cases.`;
  }

  if (ql === 10) {
    return "Minerva Mills held that the amending power cannot become unlimited, because limited amending power is itself part of the basic structure. It also emphasised harmony and balance between Fundamental Rights in Part III and Directive Principles in Part IV.";
  }

  if (ql === 11) {
    return `${question.canonicalAnswer} is treated as part of the Constitution's basic structure. Basic-structure protection means Parliament may modify constitutional provisions, but it cannot abolish the essential constitutional feature itself.`;
  }

  if (ql === 12) {
    return "The Ninth Schedule does not give complete immunity from judicial review. Under I. R. Coelho, laws inserted after 24 April 1973 can be examined if their effect damages rights and principles that form part of the basic structure.";
  }

  if (ql === 13) {
    const row = scheduleBySubject(question.canonicalAnswer);
    return row
      ? `${row.schedule} deals with ${row.subject.toLowerCase()}. In practical terms, it covers ${row.detail.toLowerCase()}. This schedule mapping is different from nearby schedules that deal with separate constitutional subjects.`
      : question.explanation;
  }

  if (ql === 14) {
    const row = scheduleByName(question.canonicalAnswer);
    return row
      ? `${row.subject} is placed in the ${row.schedule}. Its focus is ${row.detail.toLowerCase()}, so the correct schedule is identified by the subject rather than by its numerical position.`
      : question.explanation;
  }

  if (ql === 15) {
    const row = scheduleByName(question.canonicalAnswer);
    return row
      ? `${row.schedule} is the correct match because it covers ${row.subject.toLowerCase()}. Remember the three-way distinction: First Schedule—States and Union territories; Fourth Schedule—Rajya Sabha seat allocation; Seventh Schedule—Union, State and Concurrent Lists.`
      : question.explanation;
  }

  if (ql === 16) {
    return "The Fifth and Sixth Schedules both concern tribal or Scheduled Area administration, but they are not the same. The Fifth Schedule broadly covers Scheduled Areas and Scheduled Tribes, while the Sixth Schedule creates autonomous district and regional council arrangements for specified areas in Assam, Meghalaya, Tripura and Mizoram.";
  }

  if (ql === 17) {
    return "The Eighth Schedule contains the Constitution's recognised languages. It currently lists 22 languages; it should not be confused with the Seventh Schedule, which contains legislative Lists, or the Tenth Schedule, which deals with defection.";
  }

  if (ql === 18) {
    return "The Tenth Schedule contains the anti-defection provisions. It was added by the Fifty-second Amendment in 1985 and deals with disqualification of legislators on grounds of defection.";
  }

  if (ql === 19) {
    return "The Eleventh Schedule is linked with Panchayats. It was added by the Seventy-third Amendment and contains 29 subjects that may be entrusted to Panchayati Raj institutions.";
  }

  if (ql === 20) {
    return "The Twelfth Schedule is linked with Municipalities. It was added by the Seventy-fourth Amendment and contains 18 municipal subjects; the 29-subject list belongs to the Eleventh Schedule for Panchayats.";
  }

  if (ql === 21) {
    const row = amendmentByChange(question.canonicalAnswer);
    return row
      ? `${row.amendment} was enacted in ${row.year}. Its high-yield constitutional change here is: ${row.change}. Linking the amendment number, year and change helps distinguish it from nearby amendments.`
      : question.explanation;
  }

  if (ql === 22) {
    const row = amendmentByName(question.canonicalAnswer);
    return row
      ? `${row.amendment} (${row.year}) is the correct match because it ${row.change.charAt(0).toLowerCase()}${row.change.slice(1)}. The amendment should be identified from the constitutional change, not merely from its chronology.`
      : question.explanation;
  }

  if (ql === 23) {
    return `${question.explanation} Chronology questions are best solved by anchoring the major years first—for example, 42nd in 1976, 44th in 1978, 73rd/74th in 1992, 101st in 2016 and 106th in 2023.`;
  }

  if (ql === 24) {
    return "The Forty-second Amendment (1976) made wide-ranging changes, including Fundamental Duties and the words Socialist and Secular in the Preamble. The Forty-fourth Amendment (1978) later reversed or modified several changes and removed the right to property from the Fundamental Rights chapter.";
  }

  if (ql === 25) {
    const row = amendmentByChange(question.canonicalAnswer);
    return row
      ? `${row.amendment} (${row.year}) is the correct match: ${row.change}. Keep the recent amendments separate—101st is GST, 103rd is EWS reservation and 106th provides the constitutional framework for women's reservation in legislatures.`
      : question.explanation;
  }

  if (ql === 26) {
    if (question.canonicalAnswer === "All three") {
      return "All three statements are correct. Article 368 is the main amendment provision, the basic-structure doctrine limits that amending power, and the Seventh Schedule contains the Union, State and Concurrent Lists.";
    }
    if (question.stem.includes("Twelfth Schedule")) {
      return "Statements 1 and 2 are correct. The Tenth Schedule deals with anti-defection and the Eleventh Schedule with Panchayats. Statement 3 is wrong because the Twelfth Schedule covers Municipalities and contains 18 subjects; the Eleventh Schedule has 29 subjects.";
    }
    return "Statements 1 and 2 are correct. Kesavananda Bharati is the landmark basic-structure case and Minerva Mills reaffirmed limited amending power. Statement 3 is wrong because Article 368 provides no joint sitting for disagreement on a Constitution Amendment Bill.";
  }

  return question.explanation;
}

export function generatePolCp006ReviewBatchV3() {
  return generatePolCp006ReviewBatchV2().map((question) => ({
    ...question,
    questionId: question.questionId.replace("POL-CP006-V1-", "POL-CP006-V3-"),
    explanation: teachingExplanation(question),
  }));
}
