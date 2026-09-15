import type { PolCp011Seed } from "./pol-cp011-review-seed-types";

const C = "LEGISLATIVE-DEPT-CONSTITUTION-2025";
const S = "DIGITAL-SANSAD-LEGISLATION-INTRO";

const q = (ql: number, stem: string, canonicalAnswer: string, distractors: [string, string, string], explanation: string, sourceIds: string[] = [C], fact = "pol-cp011-core"): PolCp011Seed => ({
  qlId: `POL-011-QL-${String(ql).padStart(3, "0")}`,
  difficulty: "Medium",
  stem,
  canonicalAnswer,
  distractors,
  explanation,
  sourceIds,
  sourceFactIds: [fact],
});

export const POL_CP011_SEEDS_C: readonly PolCp011Seed[] = Object.freeze([
  // QL-013 — Readings and stages of Bills
  q(13, "A Bill ordinarily undergoes how many readings in each House?", "Three", ["Two", "Four", "Five"], "Digital Sansad describes the normal parliamentary law-making process as three readings in each House.", [S], "pol-cp011-bill-stages"),
  q(13, "The introduction of a Bill is generally associated with its:", "First Reading", ["Second Reading", "Third Reading", "Assent stage"], "The First Reading covers introduction of a Bill or laying a Bill already passed by the other House.", [S], "pol-cp011-bill-stages"),
  q(13, "Detailed clause-by-clause consideration mainly occurs during the:", "Second Reading", ["First Reading", "Third Reading", "Presidential assent"], "The Second Reading moves from general consideration into detailed examination of clauses and proposed amendments.", [S], "pol-cp011-bill-stages"),
  q(13, "The motion that a Bill be passed belongs to the:", "Third Reading", ["First Reading", "Committee reference only", "Presidential message stage"], "The Third Reading is the final House stage where the motion for passing the Bill is considered.", [S], "pol-cp011-bill-stages"),

  // QL-014 — Annual Financial Statement
  q(14, "Who causes the Annual Financial Statement to be laid before Parliament?", "President", ["Prime Minister", "Finance Commission", "Speaker of Lok Sabha"], "Article 112 makes the President responsible for causing the Annual Financial Statement to be laid before both Houses.", [C], "pol-cp011-annual-financial-statement"),
  q(14, "The Annual Financial Statement is laid before:", "Both Houses of Parliament", ["Lok Sabha only", "Rajya Sabha only", "A joint sitting only"], "Article 112 requires the statement of estimated receipts and expenditure to be laid before both Houses.", [C], "pol-cp011-annual-financial-statement"),
  q(14, "The Annual Financial Statement contains estimated receipts and expenditure for:", "A financial year", ["Five financial years", "A calendar decade", "Only the first six months"], "The statement presents the Government of India's estimated receipts and expenditure for the relevant financial year.", [C], "pol-cp011-annual-financial-statement"),
  q(14, "Article 112 requires expenditure estimates to distinguish revenue expenditure from:", "Other expenditure", ["State expenditure only", "Private expenditure", "Election expenditure only"], "The Annual Financial Statement separately distinguishes revenue-account expenditure from other expenditure in the estimates.", [C], "pol-cp011-annual-financial-statement"),

  // QL-015 — Charged and voted expenditure
  q(15, "Expenditure charged on the Consolidated Fund of India is submitted to a vote of Parliament:", "No", ["Yes", "Only in Rajya Sabha", "Only during an Emergency"], "Charged expenditure is not voted, although either House may discuss the estimates relating to it.", [C], "pol-cp011-demands-grants"),
  q(15, "Charged expenditure may be discussed in Parliament:", "Yes", ["No", "Only by Lok Sabha", "Only by Rajya Sabha"], "Article 113 bars voting on charged expenditure but does not prevent discussion in either House.", [C], "pol-cp011-demands-grants"),
  q(15, "Which is an example of expenditure charged on the Consolidated Fund of India?", "Union debt charges", ["Every ministry programme automatically", "All grants to private bodies", "Every State government salary"], "Article 112 specifically includes Union debt charges among expenditure charged on the Consolidated Fund of India.", [C], "pol-cp011-annual-financial-statement"),
  q(15, "Salaries and allowances of Lok Sabha Speaker and Deputy Speaker are:", "Charged expenditure", ["Voted demands only", "Paid from State funds", "Outside the Annual Financial Statement"], "Article 112 lists salaries and allowances of parliamentary presiding officers as charged expenditure.", [C], "pol-cp011-annual-financial-statement"),

  // QL-016 — Demands for grants
  q(16, "Demands for grants are submitted to:", "Lok Sabha", ["Rajya Sabha", "Both Houses separately", "Supreme Court"], "Article 113 sends the estimates of other expenditure to Lok Sabha in the form of demands for grants.", [C], "pol-cp011-demands-grants"),
  q(16, "Lok Sabha may reduce the amount of a demand for grant:", "Yes", ["No", "Only with Rajya Sabha approval", "Only after presidential assent"], "Lok Sabha may assent, refuse to assent, or assent subject to a reduction in the amount demanded.", [C], "pol-cp011-demands-grants"),
  q(16, "A demand for grant may be made only on the recommendation of the:", "President", ["Speaker of Lok Sabha", "Chairman of Rajya Sabha", "Finance Commission"], "Article 113 requires the President's recommendation before a demand for grant can be made.", [C], "pol-cp011-demands-grants"),
  q(16, "Rajya Sabha votes on demands for grants under Article 113:", "No", ["Yes", "Only on charged expenditure", "Only when Lok Sabha is dissolved"], "Demands for grants are submitted to Lok Sabha, while Rajya Sabha does not have the constitutional voting role on them.", [C], "pol-cp011-demands-grants"),

  // QL-017 — Appropriation Bill
  q(17, "An Appropriation Bill is introduced after Lok Sabha has dealt with:", "Demands for grants", ["Presidential impeachment", "Rajya Sabha elections", "A constitutional amendment"], "Article 114 follows the grant stage and authorises withdrawal for voted grants and charged expenditure.", [C], "pol-cp011-appropriation"),
  q(17, "The Appropriation Bill authorises withdrawal from the:", "Consolidated Fund of India", ["Public Account only", "Contingency Fund only", "State Consolidated Funds"], "The Appropriation Act provides legal authority for the required withdrawals from the Consolidated Fund of India.", [C], "pol-cp011-appropriation"),
  q(17, "An amendment to an Appropriation Bill may freely increase a voted grant:", "No", ["Yes", "Only in Rajya Sabha", "Only by a private member"], "Article 114 bars amendments that vary the amount or destination of a grant already made.", [C], "pol-cp011-appropriation"),
  q(17, "Subject to Articles 115 and 116, money may be withdrawn from the Consolidated Fund only under:", "Appropriation made by law", ["A ministerial order alone", "A Rajya Sabha resolution alone", "A Finance Commission report"], "Article 114 requires appropriation made by law before money is withdrawn from the Consolidated Fund of India.", [C], "pol-cp011-appropriation"),

  // QL-018 — Supplementary, additional and excess grants
  q(18, "If an authorised amount for a service proves insufficient during the year, the relevant grant is:", "Supplementary", ["Exceptional", "Vote of credit", "Token"], "A supplementary grant addresses a shortfall in the amount already authorised for a service during that financial year.", [C], "pol-cp011-extra-grants"),
  q(18, "Expenditure for a new service not contemplated in the Annual Financial Statement may require an:", "Additional grant", ["Policy cut", "Vote on account only", "Money Bill certificate"], "An additional grant addresses expenditure on a new service that was not included in the original annual statement.", [C], "pol-cp011-extra-grants"),
  q(18, "Money already spent beyond the amount granted for a service is dealt with through an:", "Excess grant", ["Additional grant", "Vote on account", "Exceptional grant"], "An excess grant deals with expenditure already incurred beyond the amount granted for that service and year.", [C], "pol-cp011-extra-grants"),
  q(18, "Article 115 mainly covers:", "Supplementary, additional and excess grants", ["Money Bill certification", "Joint sittings", "Cut motions"], "Article 115 provides the constitutional mechanism for supplementary, additional and excess expenditure requirements.", [C], "pol-cp011-art115"),
]);
