import type { PolCp011Seed } from "./pol-cp011-review-seed-types";

const C = "LEGISLATIVE-DEPT-CONSTITUTION-2025";
const R = "LOK-SABHA-RULES-2024";
const M = "LOK-SABHA-MANUAL-PROCEDURE";

const q = (ql: number, stem: string, canonicalAnswer: string, distractors: [string, string, string], explanation: string, sourceIds: string[] = [C], fact = "pol-cp011-core"): PolCp011Seed => ({
  qlId: `POL-011-QL-${String(ql).padStart(3, "0")}`,
  difficulty: "Hard",
  stem,
  canonicalAnswer,
  distractors,
  explanation,
  sourceIds,
  sourceFactIds: [fact],
});

export const POL_CP011_SEEDS_D: readonly PolCp011Seed[] = Object.freeze([
  // QL-019 — Vote on account, vote of credit, exceptional grant
  q(19, "An advance grant for part of a financial year pending normal budget procedure is a:", "Vote on account", ["Vote of credit", "Exceptional grant", "Excess grant"], "A vote on account provides money in advance for part of the year until the normal grant process is completed.", [C], "pol-cp011-special-grants"),
  q(19, "An unexpected demand too large or indefinite for normal detailed presentation may use a:", "Vote of credit", ["Vote on account", "Token cut", "Supplementary grant only"], "A vote of credit is designed for an unexpected demand whose magnitude or uncertain character prevents ordinary detail.", [C], "pol-cp011-special-grants"),
  q(19, "A grant for a purpose outside the current service of a financial year is an:", "Exceptional grant", ["Vote on account", "Economy cut", "Excess grant"], "An exceptional grant is for a purpose that does not form part of the current service of the financial year.", [C], "pol-cp011-special-grants"),
  q(19, "Which Article contains vote on account, vote of credit and exceptional grant together?", "Article 116", ["Article 113", "Article 114", "Article 117"], "Article 116 groups these three special grants and links them back to the normal grant and appropriation framework.", [C], "pol-cp011-art116"),

  // QL-020 — Cut motions and guillotine
  q(20, "A Disapproval of Policy Cut reduces a demand for grant to:", "Re. 1", ["Rs. 100", "Half the demand", "Zero automatically"], "Lok Sabha Rule 209 uses reduction to Re. 1 to express disapproval of the policy behind a demand.", [R], "pol-cp011-cut-motions"),
  q(20, "An Economy Cut proposes reduction of a demand by:", "A specified amount", ["Exactly Re. 1", "Exactly Rs. 100", "The entire demand automatically"], "An Economy Cut identifies a specified reduction to show where expenditure can be reduced or avoided.", [R], "pol-cp011-cut-motions"),
  q(20, "A Token Cut reduces a demand by:", "Rs. 100", ["Re. 1", "Rs. 1,000", "A percentage fixed by Rajya Sabha"], "A Token Cut uses a Rs. 100 reduction to raise a specific grievance within Union government responsibility.", [R], "pol-cp011-cut-motions"),
  q(20, "In budget procedure, 'guillotine' means:", "Putting outstanding demands for grants to vote at the fixed time", ["Rejecting every cut motion automatically", "Returning the Budget to the President", "Sending demands for grants to Rajya Sabha"], "The parliamentary manual calls the fixed-time disposal of all outstanding demands for grants the guillotine process.", [M], "pol-cp011-cut-motions"),

  // QL-021 — Article 117 financial Bills
  q(21, "A Bill containing Article 110(1)(a)-(f) financial matters may be introduced in Rajya Sabha under Article 117(1):", "No", ["Yes", "Only after 14 days", "Only if the Speaker certifies it"], "Article 117(1) bars introduction in Rajya Sabha of a Bill containing the specified Article 110 financial matters.", [C], "pol-cp011-financial-bills"),
  q(21, "A Bill covered by Article 117(1) requires whose recommendation for introduction?", "President", ["Speaker of Lok Sabha", "Chairman of Rajya Sabha", "Finance Commission"], "Article 117(1) requires the President's recommendation before introducing a Bill containing the specified financial provisions.", [C], "pol-cp011-financial-bills"),
  q(21, "President's recommendation is required merely to move an amendment reducing or abolishing a tax under Article 117(1):", "No", ["Yes", "Only in Rajya Sabha", "Only for indirect taxes"], "Article 117 expressly creates an exception for an amendment that only reduces or abolishes a tax.", [C], "pol-cp011-financial-bills"),
  q(21, "A Bill involving expenditure from the Consolidated Fund may be passed without presidential recommendation for consideration:", "No", ["Yes", "Only by Lok Sabha", "Only by Rajya Sabha"], "Article 117(3) prevents either House from passing such a Bill unless the President recommended its consideration there.", [C], "pol-cp011-financial-bills"),

  // QL-022 — Integrated traps
  q(22, "Which pair is correctly matched?", "Money Bill — Rajya Sabha may recommend changes", ["Money Bill — joint sitting resolves deadlock", "Charged expenditure — voted by Rajya Sabha", "Vote on account — covers already incurred excess"], "Rajya Sabha may recommend changes to a Money Bill; the other pairs confuse separate constitutional financial procedures.", [C], "pol-cp011-integrated"),
  q(22, "Consider the statements: 1. Prorogation alone lapses a pending Bill. 2. A Money Bill cannot start in Rajya Sabha. Which is correct?", "Statement 2 only", ["Statement 1 only", "Both statements", "Neither statement"], "The second statement is correct; prorogation does not lapse a Bill, while a Money Bill starts only in Lok Sabha.", [C], "pol-cp011-integrated"),
  q(22, "Consider the statements: 1. Charged expenditure can be discussed. 2. Demands for grants are voted by Lok Sabha. Which is correct?", "Both statements", ["Statement 1 only", "Statement 2 only", "Neither statement"], "Both are correct: charged expenditure may be discussed, while the voting on demands for grants belongs to Lok Sabha.", [C], "pol-cp011-integrated"),
  q(22, "Which distinction is correct?", "Vote on account is an advance; excess grant deals with spending already beyond the grant", ["Vote of credit is always a tax Bill", "Token Cut reduces a demand to Re. 1", "Appropriation Bill may freely increase grants"], "A vote on account provides advance funds, whereas an excess grant regularises expenditure already made beyond the authorised amount.", [C], "pol-cp011-integrated"),
]);
