import { generatePolCp007ReviewBatchV2 } from "./pol-cp007-review-generator-v2";
import type { PolCp007ReviewQuestion } from "./pol-cp007-review-types";

function articleFromStem(stem: string) {
  return stem.match(/Article\s+(\d+[A-Z]?)/)?.[1];
}

function subjectFromStem(stem: string) {
  return stem.replace(/\s+is under:$/, "").trim();
}

function explain(q: PolCp007ReviewQuestion): string {
  const a = q.canonicalAnswer;
  const s = q.stem;

  switch (q.qlId) {
    case "POL-007-QL-001": {
      const article = articleFromStem(s);
      return `Article ${article} deals with ${a.toLowerCase()}. This is the exact subject of that Article; nearby Articles 52–62 deal with other parts of the President's office.`;
    }
    case "POL-007-QL-002": {
      const subject = subjectFromStem(s);
      return `${a} is correct because it deals with ${subject.toLowerCase()}. Articles 52–62 divide the President's office into separate rules, so the Article number must match the exact topic.`;
    }
    case "POL-007-QL-003":
      if (a.includes("Elected members of both Houses")) return "The President is elected by elected MPs and elected MLAs. Nominated MPs and members of State Legislative Councils are not part of this electoral college.";
      if (a.includes("nominated member of the Rajya Sabha")) return "A nominated Rajya Sabha member does not vote for President because Article 54 includes elected members of Parliament, not nominated members.";
      if (a.includes("Do not form part")) return "Members of State Legislative Councils do not vote for President. Article 54 includes elected members of State Legislative Assemblies, not members of Legislative Councils.";
      if (a.includes("included in the electoral college")) return "Elected MLAs of Delhi and Puducherry are included in the presidential electoral college. The Constitution treats these elected Assembly members as part of the college for this election.";
      return "A nominated Lok Sabha member does not vote in the presidential election. The parliamentary part of the electoral college contains elected MPs only.";
    case "POL-007-QL-004":
      if (a.includes("Proportional representation")) return "The President is elected by proportional representation through the single transferable vote. This is an indirect election, not a direct popular vote.";
      if (a === "Secret ballot") return "Voting in the presidential election is by secret ballot. Electors do not cast an open ballot for this constitutional election.";
      if (a === "Single transferable vote") return "The voting system is the single transferable vote. Electors rank candidates, and votes can transfer according to preferences during counting.";
      return "Article 55 aims at balance in representation: it seeks uniformity among the States and parity between the States as a whole and the Union.";
    case "POL-007-QL-005":
      if (a === "Five years") return "The President's normal term is five years, counted from the date the President enters office. A successor may still take office earlier if the office becomes vacant.";
      if (a === "Vice-President") return "The President resigns by writing to the Vice-President. This is different from the Vice-President, who resigns to the President.";
      if (a === "The successor enters office") return "Even after the five-year term ends, the President continues until the successor enters office. This prevents the office from becoming vacant merely because the term has expired.";
      return "The presidential term starts on the date the President enters office, not on the date of nomination, polling or declaration of result.";
    case "POL-007-QL-006":
      if (a.includes("May be re-elected")) return "A former President may contest again if the constitutional qualifications are still met. Article 57 permits re-election.";
      if (a === "Article 57") return "Article 57 deals with eligibility for re-election as President. It allows a President to contest the office again.";
      return "The Constitution sets no maximum number of presidential terms. Re-election is allowed under Article 57 if the person remains eligible.";
    case "POL-007-QL-007":
      if (a === "35 years") return "A candidate must have completed 35 years of age to be elected President. This minimum age is fixed by Article 58.";
      if (a === "Lok Sabha") return "A presidential candidate must be qualified for election to Lok Sabha. The person does not need to be a sitting Lok Sabha member.";
      if (a === "Citizen of India") return "Indian citizenship is a basic qualification for election as President, along with the age and Lok Sabha-qualification requirements.";
      return "A person holding a disqualifying office of profit is not eligible to be elected President. Article 58 contains this restriction, subject to the constitutional exceptions.";
    case "POL-007-QL-008":
      if (a.includes("Is vacated")) return "If an MP is elected President, the parliamentary seat becomes vacant when the person enters the presidential office. The two positions cannot be held together.";
      return "The President cannot simultaneously remain a State legislator or hold another office of profit. Article 59 keeps the presidential office separate from these positions.";
    case "POL-007-QL-009":
      if (a === "Chief Justice of India") return "The President normally takes the oath before the Chief Justice of India. This is the first authority named in Article 60 for administering the oath.";
      if (a.includes("senior-most available Judge")) return "If the Chief Justice of India is unavailable, the senior-most available Supreme Court judge administers the presidential oath. This is the backup arrangement in Article 60.";
      return "The presidential oath includes the promise to preserve, protect and defend the Constitution and the law. This is a central part of the oath in Article 60.";
    case "POL-007-QL-010":
      if (a === "Violation of the Constitution") return "The only constitutional ground stated for impeaching the President is violation of the Constitution. Loss of political support by itself is not the impeachment ground.";
      if (a === "Either House of Parliament") return "Either Lok Sabha or Rajya Sabha may start the impeachment charge. The process is not restricted to one House.";
      if (a === "Article 61") return "Article 61 lays down the impeachment procedure for the President, including initiation, notice, investigation and the required majorities.";
      return "After one House starts the charge, the other House investigates it. There is no joint sitting for presidential impeachment.";
    case "POL-007-QL-011":
      if (a.includes("14 days")) return "At least 14 days' written notice is required before the impeachment resolution is moved. This gives formal advance notice of the charge.";
      if (a.includes("One-fourth")) return "The impeachment notice must be signed by at least one-fourth of the total membership of the House that starts the charge.";
      if (a.includes("two-thirds of its total membership")) return "The initiating House must pass the impeachment resolution by at least two-thirds of its total membership. This is stricter than two-thirds of members present and voting.";
      return "The other House sustains the impeachment charge by at least two-thirds of its total membership. If that majority is reached, the President is removed from office.";
    case "POL-007-QL-012":
      if (a === "Six months") return "A casual vacancy in the President's office must be filled within six months. The Constitution fixes this outer time limit for the election.";
      if (a.includes("full five-year term")) return "A President elected after a casual vacancy receives a fresh five-year term from entering office. The person does not merely complete the previous President's remaining term.";
      if (a === "Before the term expires") return "When the normal presidential term is about to end, the election for the successor must be completed before that term expires.";
      return "Article 62 deals with elections to fill a vacancy in the President's office, including both normal expiry and a casual vacancy.";
    case "POL-007-QL-013":
      if (a === "Supreme Court") return "The Supreme Court decides disputes arising from the election of the President or Vice-President. This power comes from Article 71.";
      if (a === "Final") return "The Supreme Court's decision in a presidential election dispute is final under Article 71; the Constitution does not provide a further constitutional appeal.";
      return "No. A vacancy in the electoral college by itself does not invalidate the presidential election. Article 71 expressly protects the election from that objection alone.";
    case "POL-007-QL-014":
      if (a === "Article 72") return "Article 72 gives the President the constitutional power to grant pardon and other forms of clemency in the categories listed there.";
      if (a.includes("Court Martial")) return "A Court Martial sentence falls within the President's clemency power under Article 72. This is one of the categories specifically covered.";
      if (a.includes("death sentence")) return "The President's clemency power extends to every case where the sentence is death, regardless of the usual Union-State division of executive power.";
      return "For offences relating to matters within Union executive power, the President may exercise clemency under Article 72.";
    case "POL-007-QL-015":
      if (s.startsWith("Pardon")) return "Pardon removes the punishment and its penal consequences to the extent of the pardon. It is the broadest form of clemency listed here.";
      if (s.startsWith("Commutation")) return "Commutation replaces the original punishment with a lighter type of punishment. The form of the sentence changes.";
      if (s.startsWith("Remission")) return "Remission reduces the amount or duration of the punishment without changing its basic type. For example, the term may be shortened.";
      return "Reprieve temporarily delays the carrying out of a sentence, especially execution. It gives time before the punishment is carried out rather than cancelling it.";
    case "POL-007-QL-016":
      if (a.includes("reconsider")) return "The President may ask the Council of Ministers to reconsider its advice once. This gives one opportunity for review, not a permanent power to reject the advice.";
      if (a.includes("Must act")) return "If the Council of Ministers sends the advice again after reconsideration, the President must act according to that advice.";
      return "Article 74 deals with the Council of Ministers aiding and advising the President. It is the main constitutional provision for this relationship.";
    case "POL-007-QL-017":
      if (a === "Article 85") return "Article 85 gives the President the formal powers to summon Parliament, prorogue its Houses and dissolve Lok Sabha.";
      if (a === "President") return "The President formally prorogues the Houses under Article 85. In the parliamentary system, this power operates on constitutional advice.";
      return "Dissolution under Article 85 applies to Lok Sabha because Rajya Sabha is a continuing House and is not dissolved.";
    case "POL-007-QL-018":
      if (a.includes("Reconsideration")) return "The President may return a non-Money Bill to Parliament once for reconsideration. A Money Bill cannot be returned in this way.";
      if (a === "Cannot withhold assent") return "If Parliament passes the returned Bill again and sends it back, the President cannot withhold assent under Article 111.";
      if (a === "Article 111") return "Article 111 deals with the President's assent to Bills passed by Parliament, including the power to return a non-Money Bill once.";
      return "A Money Bill cannot be returned by the President for reconsideration under Article 111. That return power applies to a non-Money Bill.";
    case "POL-007-QL-019":
      if (a === "Article 123") return "Article 123 gives the President the power to issue Ordinances when the constitutional conditions are satisfied.";
      if (a.includes("not simultaneously in session")) return "An Ordinance may be issued when both Houses are not simultaneously in session and immediate action is considered necessary. It is not a substitute for ordinary law-making when Parliament can act normally.";
      if (a === "Six weeks") return "An Ordinance normally stops operating six weeks after Parliament reassembles, unless it is withdrawn, rejected or replaced earlier.";
      return "While it is valid, a presidential Ordinance has the same force and effect as an Act of Parliament, but it is temporary and subject to parliamentary control.";
    case "POL-007-QL-020":
      if (a === "Article 53") return "Article 53 vests the executive power of the Union in the President and also places the supreme command of the Defence Forces in the President.";
      if (a === "President") return "The Constitution vests the supreme command of the Defence Forces in the President. Its exercise remains subject to law and the constitutional system.";
      return "Article 53 deals with the executive power of the Union. It vests that power in the President, to be exercised according to the Constitution.";
    case "POL-007-QL-021":
      if (s.includes("elected indirectly")) return "All three statements are correct: the President is elected indirectly, the normal term is five years, and Article 57 allows re-election.";
      if (s.includes("Only elected MPs")) return "All three statements are correct. Only elected MPs take part from Parliament; nominated MPs and members of State Legislative Councils do not vote.";
      return "Only two statements are correct. Either House may start impeachment and the ground is violation of the Constitution, but the other House investigates it; there is no joint sitting.";
    case "POL-007-QL-022":
      if (a === "Nominated members of Parliament") return "Nominated MPs are excluded because Article 54 uses elected members of Parliament for the presidential electoral college.";
      if (a === "Delhi and Puducherry") return "For the presidential electoral college, the constitutional meaning of State includes Delhi and Puducherry, so their elected MLAs take part.";
      return "The correct combination is elected MPs plus elected MLAs, including elected MLAs of Delhi and Puducherry. Nominated MPs and Legislative Council members are excluded.";
    default:
      return q.explanation;
  }
}

export function generatePolCp007ReviewBatchV3() {
  const questions = generatePolCp007ReviewBatchV2().map((q, index) => ({
    ...q,
    questionId: `POL-CP007-V3-${String(index + 1).padStart(3, "0")}`,
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
