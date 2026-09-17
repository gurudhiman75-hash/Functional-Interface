import type { KnowledgeV1Difficulty } from "../../types";
import { ecoCp013Fact } from "./eco-cp013-facts";
import type { EcoCp013ReviewQuestion } from "./eco-cp013-review-types";

const qlNames: Record<number, string> = {
  1: "Annual Financial Statement and Article 112",
  2: "Consolidated Fund, Contingency Fund and Public Account",
  3: "Charged versus voted expenditure",
  4: "Demands for Grants and Article 113",
  5: "Appropriation Bill and Article 114",
  6: "Finance Bill and tax proposals",
  7: "Supplementary, additional and excess grants",
  8: "Vote on Account, Vote of Credit and Exceptional Grant",
  9: "Expenditure Budget and Receipt Budget",
  10: "Expenditure Profile and Budget at a Glance",
  11: "Constitutional statement evaluation",
  12: "Mixed Budget-process distinctions",
};

function difficultyForVariant(ql: number, row: number): KnowledgeV1Difficulty {
  if (ql <= 8) return row === 0 ? "Easy" : row === 3 ? "Hard" : "Medium";
  if (ql <= 10) return row === 0 ? "Easy" : row === 1 ? "Medium" : "Hard";
  return row === 0 ? "Medium" : "Hard";
}

function sourceBundle(ids: string[]) {
  const facts = ids.map(ecoCp013Fact);
  return {
    sourceIds: [...new Set(facts.flatMap((fact) => fact.sourceIds))],
    sourceFactIds: [...new Set(facts.flatMap((fact) => fact.sourceFactIds))],
  };
}

type Case = {
  stem: string;
  correct: string;
  options: string[];
  explanation: string;
  factIds: string[];
};

const qlCases: Record<number, Case[]> = {
  1: [
    { stem: "Which constitutional Article provides for the Annual Financial Statement of the Union Government?", correct: "Article 112", options: ["Article 112", "Article 113", "Article 114", "Article 116"], explanation: "Article 112 provides for the Annual Financial Statement. It contains the estimated receipts and expenditure of the Government of India for the financial year.", factIds: ["afs-article-112"] },
    { stem: "Who causes the Annual Financial Statement to be laid before both Houses of Parliament?", correct: "The President", options: ["The President", "The Finance Commission", "The RBI Governor", "The Comptroller and Auditor General"], explanation: "Article 112 places this constitutional duty on the President. The statement is laid before both Houses for each financial year.", factIds: ["afs-article-112"] },
    { stem: "What does the Annual Financial Statement primarily show?", correct: "Estimated Government receipts and expenditure for the financial year", options: ["Estimated Government receipts and expenditure for the financial year", "Only tax proposals", "Only ministry-wise salaries", "Only public debt repayments"], explanation: "The AFS is the constitutional statement of estimated receipts and expenditure. Tax proposals are dealt with separately through the Finance Bill.", factIds: ["afs-article-112"] },
    { stem: "Which statement correctly distinguishes the Annual Financial Statement from the Finance Bill?", correct: "The AFS presents estimated receipts and expenditure, while the Finance Bill contains tax proposals", options: ["The AFS presents estimated receipts and expenditure, while the Finance Bill contains tax proposals", "The AFS contains only tax proposals, while the Finance Bill contains only expenditure", "Both documents serve exactly the same constitutional purpose", "The Finance Bill authorises all withdrawals from the Consolidated Fund"], explanation: "The AFS is the annual statement of receipts and expenditure under Article 112. The Finance Bill deals with taxation proposals under the Money Bill framework.", factIds: ["afs-article-112", "finance-bill"] },
  ],
  2: [
    { stem: "Which fund receives the revenues of the Government of India and loans raised by it?", correct: "Consolidated Fund of India", options: ["Consolidated Fund of India", "Contingency Fund of India", "Public Account of India", "National Investment Fund"], explanation: "Government revenues, loans raised and recoveries of loans form the Consolidated Fund of India under Article 266.", factIds: ["cfi"] },
    { stem: "Which fund is used for urgent unforeseen expenditure pending parliamentary authorisation?", correct: "Contingency Fund of India", options: ["Contingency Fund of India", "Consolidated Fund of India", "Public Account of India", "Finance Commission Fund"], explanation: "The Contingency Fund is an imprest placed at the disposal of the President for urgent unforeseen expenditure pending parliamentary approval.", factIds: ["contingency-fund"] },
    { stem: "Where are moneys such as provident funds and small savings held by the Government in trust kept?", correct: "Public Account of India", options: ["Public Account of India", "Consolidated Fund of India", "Contingency Fund of India", "Appropriation Account"], explanation: "Money held by Government in trust is kept in the Public Account. Such money does not belong to Government in the same way as Consolidated Fund receipts.", factIds: ["public-account"] },
    { stem: "Which distinction among the three principal Government accounts is correct?", correct: "The Consolidated Fund holds Government revenues and borrowings, the Contingency Fund meets urgent unforeseen needs, and the Public Account holds trust money", options: ["The Consolidated Fund holds Government revenues and borrowings, the Contingency Fund meets urgent unforeseen needs, and the Public Account holds trust money", "The Public Account contains only tax revenue, while the Consolidated Fund contains only provident funds", "The Contingency Fund is used only for routine salaries", "All three accounts require identical withdrawal procedures"], explanation: "Each account has a distinct constitutional role. The Consolidated Fund is the main Government fund, the Contingency Fund handles urgent unforeseen needs, and the Public Account holds trust-type money.", factIds: ["cfi", "contingency-fund", "public-account"] },
  ],
  3: [
    { stem: "Is expenditure charged on the Consolidated Fund of India submitted to a vote of Parliament?", correct: "No, but it may be discussed", options: ["No, but it may be discussed", "Yes, it must be voted by both Houses", "Yes, but only by Rajya Sabha", "No, and it cannot be discussed"], explanation: "Charged expenditure is not submitted to vote under Article 113. Parliament may still discuss it.", factIds: ["charged-expenditure"] },
    { stem: "How is expenditure other than charged expenditure generally authorised through Parliament?", correct: "It is submitted to the Lok Sabha as Demands for Grants", options: ["It is submitted to the Lok Sabha as Demands for Grants", "It is automatically withdrawn from the Public Account", "It is approved only by the Rajya Sabha", "It is authorised by RBI circular"], explanation: "Expenditure requiring a vote is placed before the Lok Sabha through Demands for Grants.", factIds: ["voted-expenditure", "demands-for-grants"] },
    { stem: "Which type of expenditure is separated from voted expenditure in the Annual Financial Statement?", correct: "Charged expenditure", options: ["Charged expenditure", "Private expenditure", "Foreign expenditure", "Corporate expenditure"], explanation: "The Constitution requires the AFS to show charged expenditure separately from other expenditure proposed from the Consolidated Fund.", factIds: ["charged-expenditure", "afs-article-112"] },
    { stem: "Which statement best explains the difference between charged and voted expenditure?", correct: "Charged expenditure is not voted, while voted expenditure is submitted to the Lok Sabha through Demands for Grants", options: ["Charged expenditure is not voted, while voted expenditure is submitted to the Lok Sabha through Demands for Grants", "Charged expenditure is voted only by Rajya Sabha", "Voted expenditure can be withdrawn without parliamentary authority", "Both categories are outside the Consolidated Fund"], explanation: "The key distinction is voting. Charged expenditure may be discussed but is not put to vote, whereas other expenditure is voted by the Lok Sabha through Demands for Grants.", factIds: ["charged-expenditure", "voted-expenditure"] },
  ],
  4: [
    { stem: "Under which Article are Demands for Grants dealt with at the Union level?", correct: "Article 113", options: ["Article 113", "Article 112", "Article 114", "Article 116"], explanation: "Article 113 governs the parliamentary procedure for estimates and Demands for Grants.", factIds: ["demands-for-grants"] },
    { stem: "Which House votes on Demands for Grants?", correct: "Lok Sabha", options: ["Lok Sabha", "Rajya Sabha", "Both Houses sitting jointly", "Neither House"], explanation: "Demands for Grants are submitted to the House of the People, or Lok Sabha, which may assent, refuse or reduce a demand.", factIds: ["demands-for-grants"] },
    { stem: "Whose recommendation is required before a Demand for Grant can be made?", correct: "The President", options: ["The President", "The Chief Justice of India", "The RBI Governor", "The Speaker alone"], explanation: "Article 113 states that no Demand for Grant may be made except on the recommendation of the President.", factIds: ["demands-for-grants"] },
    { stem: "What power does the Lok Sabha have over a Demand for Grant?", correct: "It may assent, refuse to assent, or assent subject to a reduction", options: ["It may assent, refuse to assent, or assent subject to a reduction", "It may only approve the full amount", "It may increase the amount without restriction", "It may refer the demand directly to RBI"], explanation: "Article 113 permits the Lok Sabha to approve a demand, reject it, or approve it with a reduced amount.", factIds: ["demands-for-grants"] },
  ],
  5: [
    { stem: "Which Bill authorises withdrawal of money from the Consolidated Fund of India after grants are voted?", correct: "Appropriation Bill", options: ["Appropriation Bill", "Finance Bill", "Money Resolution", "Fiscal Responsibility Statement"], explanation: "The Appropriation Bill under Article 114 authorises withdrawal from the Consolidated Fund for voted grants and charged expenditure.", factIds: ["appropriation-bill"] },
    { stem: "Under which Article is the Appropriation Bill provided for?", correct: "Article 114", options: ["Article 114", "Article 112", "Article 113", "Article 116"], explanation: "Article 114 deals with Appropriation Bills after the grants under Article 113 have been made.", factIds: ["appropriation-bill"] },
    { stem: "What does an Appropriation Bill cover in addition to grants voted by the Lok Sabha?", correct: "Expenditure charged on the Consolidated Fund of India", options: ["Expenditure charged on the Consolidated Fund of India", "Only private-sector borrowing", "Only tax proposals", "Only Public Account withdrawals"], explanation: "The Appropriation Bill covers both voted grants and charged expenditure shown in the Annual Financial Statement.", factIds: ["appropriation-bill", "charged-expenditure"] },
    { stem: "Which statement correctly separates an Appropriation Bill from a Finance Bill?", correct: "The Appropriation Bill authorises expenditure from the Consolidated Fund, while the Finance Bill gives effect to tax proposals", options: ["The Appropriation Bill authorises expenditure from the Consolidated Fund, while the Finance Bill gives effect to tax proposals", "The Appropriation Bill changes taxes, while the Finance Bill votes Demands for Grants", "Both Bills are only explanatory documents", "The Finance Bill authorises all charged expenditure without appropriation"], explanation: "Appropriation concerns authority to spend from the Consolidated Fund. The Finance Bill concerns taxation proposals.", factIds: ["appropriation-bill", "finance-bill"] },
  ],
  6: [
    { stem: "Which Budget Bill contains proposals to impose, abolish, alter or regulate taxes?", correct: "Finance Bill", options: ["Finance Bill", "Appropriation Bill", "Vote on Account Bill", "Expenditure Profile"], explanation: "The Finance Bill contains the taxation proposals accompanying the Budget.", factIds: ["finance-bill"] },
    { stem: "How is the Finance Bill classified under Article 110 when it contains the Budget's taxation provisions?", correct: "Money Bill", options: ["Money Bill", "Constitution Amendment Bill", "Ordinary Resolution", "Appropriation Account"], explanation: "The Finance Bill containing taxation provisions is a Money Bill under Article 110.", factIds: ["finance-bill"] },
    { stem: "Which document should be examined for the legal tax changes proposed with the Union Budget?", correct: "Finance Bill", options: ["Finance Bill", "Budget at a Glance", "Expenditure Profile", "Demands for Grants"], explanation: "Tax changes proposed with the Budget are set out in the Finance Bill. Summary documents may explain them but do not replace the Bill.", factIds: ["finance-bill"] },
    { stem: "Which distinction between the Finance Bill and Demands for Grants is correct?", correct: "The Finance Bill concerns taxation, while Demands for Grants concern expenditure requiring Lok Sabha approval", options: ["The Finance Bill concerns taxation, while Demands for Grants concern expenditure requiring Lok Sabha approval", "The Finance Bill concerns only charged expenditure", "Demands for Grants set tax rates", "Both are merely explanatory documents with no constitutional role"], explanation: "The Finance Bill is the taxation measure, while Demands for Grants are the voting mechanism for expenditure requiring Lok Sabha approval.", factIds: ["finance-bill", "demands-for-grants"] },
  ],
  7: [
    { stem: "Which grant is sought when the amount already authorised for a service becomes insufficient during the financial year?", correct: "Supplementary grant", options: ["Supplementary grant", "Excess grant", "Vote on Account", "Exceptional Grant"], explanation: "A supplementary grant is used when the authorised amount proves insufficient during the year.", factIds: ["supplementary-grant"] },
    { stem: "Which grant is required when money has already been spent beyond the amount granted for a service?", correct: "Excess grant", options: ["Excess grant", "Supplementary grant", "Vote of Credit", "Vote on Account"], explanation: "An excess grant regularises expenditure already incurred beyond the amount granted for that service and year.", factIds: ["excess-grant"] },
    { stem: "Under which Article are supplementary, additional and excess grants provided for?", correct: "Article 115", options: ["Article 115", "Article 112", "Article 114", "Article 116"], explanation: "Article 115 covers supplementary, additional and excess grants.", factIds: ["supplementary-grant", "excess-grant"] },
    { stem: "Which statement correctly distinguishes a supplementary grant from an excess grant?", correct: "A supplementary grant addresses an insufficiency or new need during the year, while an excess grant regularises spending already made beyond the grant", options: ["A supplementary grant addresses an insufficiency or new need during the year, while an excess grant regularises spending already made beyond the grant", "An excess grant is always obtained before any spending", "A supplementary grant is used only for tax changes", "Both terms mean Vote on Account"], explanation: "The timing is the key distinction. Supplementary or additional provision responds to a need during the year, while an excess grant deals with overspending already incurred.", factIds: ["supplementary-grant", "excess-grant"] },
  ],
  8: [
    { stem: "Which grant provides money in advance for part of a financial year while the full Budget procedure is pending?", correct: "Vote on Account", options: ["Vote on Account", "Vote of Credit", "Exceptional Grant", "Excess Grant"], explanation: "A Vote on Account provides an advance grant for part of the year until the normal voting and appropriation process is completed.", factIds: ["vote-on-account"] },
    { stem: "Which grant is designed for an unexpected demand whose magnitude or indefinite character prevents normal detailed estimation?", correct: "Vote of Credit", options: ["Vote of Credit", "Vote on Account", "Supplementary Grant", "Revenue Grant"], explanation: "A Vote of Credit is used for an unexpected demand that cannot be stated with the usual detailed estimates.", factIds: ["vote-of-credit"] },
    { stem: "Which grant is for a purpose that forms no part of the current service of any financial year?", correct: "Exceptional Grant", options: ["Exceptional Grant", "Vote on Account", "Excess Grant", "Supplementary Grant"], explanation: "Article 116 defines an Exceptional Grant as one outside the current service of any financial year.", factIds: ["exceptional-grant"] },
    { stem: "Which pairing under Article 116 is correct?", correct: "Vote on Account—advance for part of the year; Vote of Credit—unexpected indefinite demand; Exceptional Grant—outside current service", options: ["Vote on Account—advance for part of the year; Vote of Credit—unexpected indefinite demand; Exceptional Grant—outside current service", "Vote on Account—past overspending; Vote of Credit—tax proposal; Exceptional Grant—routine salary expenditure", "Vote on Account—charged expenditure; Vote of Credit—loan recovery; Exceptional Grant—tax receipt", "All three grants have exactly the same purpose"], explanation: "Article 116 assigns a distinct purpose to each grant. The three mechanisms are not interchangeable.", factIds: ["vote-on-account", "vote-of-credit", "exceptional-grant"] },
  ],
  9: [
    { stem: "Which Budget document gives detailed estimates of tax, non-tax and capital receipts?", correct: "Receipt Budget", options: ["Receipt Budget", "Expenditure Budget", "Expenditure Profile", "Appropriation Bill"], explanation: "The Receipt Budget provides detailed estimates of the receipts included in the Annual Financial Statement.", factIds: ["receipt-budget"] },
    { stem: "Which Budget document brings together scheme and programme expenditure estimates under revenue and capital heads?", correct: "Expenditure Budget", options: ["Expenditure Budget", "Receipt Budget", "Finance Bill", "Public Account"], explanation: "The Expenditure Budget consolidates expenditure estimates for schemes and programmes and presents them with explanatory material.", factIds: ["expenditure-budget"] },
    { stem: "Which distinction between the Receipt Budget and Expenditure Budget is correct?", correct: "The Receipt Budget details Government receipts, while the Expenditure Budget organises programme and scheme expenditure", options: ["The Receipt Budget details Government receipts, while the Expenditure Budget organises programme and scheme expenditure", "The Receipt Budget authorises withdrawals from the Consolidated Fund", "The Expenditure Budget contains only tax proposals", "Both documents are Demands for Grants"], explanation: "The documents serve different explanatory roles: one focuses on receipts, the other on expenditure.", factIds: ["receipt-budget", "expenditure-budget"] },
  ],
  10: [
    { stem: "Which document provides a concise overview of receipts, disbursements and major deficit indicators?", correct: "Budget at a Glance", options: ["Budget at a Glance", "Expenditure Profile", "Appropriation Bill", "Demands for Grants"], explanation: "Budget at a Glance is designed as a compact summary of major receipts, spending and deficit information.", factIds: ["budget-at-glance"] },
    { stem: "Which document aggregates different types of expenditure across Demands for Grants and includes cross-cutting expenditure statements?", correct: "Expenditure Profile", options: ["Expenditure Profile", "Receipt Budget", "Finance Bill", "Annual Financial Statement only"], explanation: "The Expenditure Profile analyses and aggregates expenditure across Demands for Grants and includes several cross-cutting statements.", factIds: ["expenditure-profile"] },
    { stem: "Which statement best separates Budget at a Glance from the Expenditure Profile?", correct: "Budget at a Glance is a concise overall summary, while the Expenditure Profile provides broader analytical aggregation of expenditure", options: ["Budget at a Glance is a concise overall summary, while the Expenditure Profile provides broader analytical aggregation of expenditure", "Budget at a Glance is the tax law, while Expenditure Profile is the Appropriation Act", "Both are constitutional Money Bills", "Expenditure Profile contains only receipts"], explanation: "Budget at a Glance is the compact overview. The Expenditure Profile provides more detailed analytical views of expenditure.", factIds: ["budget-at-glance", "expenditure-profile"] },
  ],
  11: [
    { stem: "Consider the statements. I. Charged expenditure is not submitted to vote. II. Demands for Grants are voted by the Lok Sabha. Which option is correct?", correct: "Both I and II", options: ["Both I and II", "I only", "II only", "Neither I nor II"], explanation: "Statement I is correct because charged expenditure is not voted. Statement II is also correct because Demands for Grants are submitted to the Lok Sabha.", factIds: ["charged-expenditure", "demands-for-grants"] },
    { stem: "Consider the statements. I. The Appropriation Bill authorises withdrawal from the Consolidated Fund. II. The Finance Bill contains taxation proposals. Which option is correct?", correct: "Both I and II", options: ["Both I and II", "I only", "II only", "Neither I nor II"], explanation: "Both statements are correct. The two Bills perform different but complementary Budget functions.", factIds: ["appropriation-bill", "finance-bill"] },
    { stem: "Consider the statements. I. Public Account money is held by Government in trust. II. The Contingency Fund is meant for routine annual expenditure already fully authorised. Which option is correct?", correct: "I only", options: ["I only", "II only", "Both I and II", "Neither I nor II"], explanation: "Statement I is correct. Statement II is false because the Contingency Fund is for urgent unforeseen expenditure pending parliamentary authorisation.", factIds: ["public-account", "contingency-fund"] },
  ],
  12: [
    { stem: "Which sequence best represents the normal parliamentary expenditure process?", correct: "Annual Financial Statement → Demands for Grants → Appropriation Bill", options: ["Annual Financial Statement → Demands for Grants → Appropriation Bill", "Appropriation Bill → Annual Financial Statement → Finance Bill", "Finance Bill → Vote of Credit → Annual Financial Statement", "Demands for Grants → Annual Financial Statement → Public Account"], explanation: "The AFS presents the estimates, voted expenditure is then considered through Demands for Grants, and the Appropriation Bill authorises withdrawal from the Consolidated Fund.", factIds: ["afs-article-112", "demands-for-grants", "appropriation-bill"] },
    { stem: "A new expenditure need arises during the year before any excess spending occurs. Which mechanism is more appropriate than an excess grant?", correct: "Supplementary or additional grant", options: ["Supplementary or additional grant", "Excess grant", "Finance Bill", "Budget at a Glance"], explanation: "Supplementary or additional provision is used when a need emerges during the year. An excess grant is for spending that has already exceeded the authorised amount.", factIds: ["supplementary-grant", "excess-grant"] },
    { stem: "Which combination correctly matches the Budget mechanism with its purpose?", correct: "Finance Bill—tax proposals; Appropriation Bill—authority to spend; Vote on Account—temporary advance grant", options: ["Finance Bill—tax proposals; Appropriation Bill—authority to spend; Vote on Account—temporary advance grant", "Finance Bill—temporary advance; Appropriation Bill—tax proposals; Vote on Account—past overspending", "Finance Bill—Demands for Grants; Appropriation Bill—Public Account deposits; Vote on Account—tax collection", "All three mechanisms perform the same function"], explanation: "These mechanisms address three separate needs: taxation, legal authority to withdraw from the Consolidated Fund, and temporary advance spending authority.", factIds: ["finance-bill", "appropriation-bill", "vote-on-account"] },
  ],
};

export const ECO_CP013_REVIEW_V1: EcoCp013ReviewQuestion[] = Object.entries(qlCases).flatMap(([qlKey, rows]) => {
  const ql = Number(qlKey);
  return rows.map((row, index) => {
    const bundle = sourceBundle(row.factIds);
    const target = (ql + index) % 4;
    const options = [...row.options];
    const current = options.indexOf(row.correct);
    [options[current], options[target]] = [options[target], options[current]];
    return {
      questionId: `ECO-CP-013-Q${String(ql).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`,
      chapterId: "ECO-001",
      cpId: "ECO-CP-013",
      qlId: `ECO-013-QL-${String(ql).padStart(3, "0")}`,
      qlName: qlNames[ql],
      difficulty: difficultyForVariant(ql, index),
      stem: row.stem,
      options,
      correctIndex: target,
      canonicalAnswer: row.correct,
      explanation: row.explanation,
      ...bundle,
      reviewOnly: true,
      runtimeRegistered: false,
    };
  });
});
