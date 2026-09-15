import type { KnowledgeV1Difficulty } from "../../types";
import { ecoCp016Fact } from "./eco-cp016-facts";
import type { EcoCp016ReviewQuestion } from "./eco-cp016-review-types";

const qlNames: Record<number, string> = {
  1: "1991 crisis and reform background",
  2: "LPG reform framework",
  3: "Industrial delicensing and New Industrial Policy",
  4: "Privatisation, disinvestment and public-sector role",
  5: "Globalisation, trade and foreign investment",
  6: "External-sector and exchange-rate reforms",
  7: "Financial-sector reforms and Narasimham Committee",
  8: "Reform chronology and institutional change",
  9: "Stabilisation versus structural reform",
  10: "Trade and foreign-exchange liberalisation",
  11: "Statements and matching",
  12: "Mixed close distinctions",
};

function difficultyForVariant(ql: number, row: number): KnowledgeV1Difficulty {
  if ([1, 2, 3, 4, 5, 6, 7, 8].includes(ql)) return row === 0 ? "Easy" : row < 3 ? "Medium" : "Hard";
  return row === 0 ? "Medium" : "Hard";
}

function sourceBundle(ids: string[]) {
  const facts = ids.map(ecoCp016Fact);
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
    {
      stem: "Which crisis directly triggered India's major economic reforms in 1991?",
      correct: "Balance-of-payments crisis",
      options: ["Balance-of-payments crisis", "Agricultural surplus crisis", "Stock-market boom", "Bank nationalisation crisis"],
      explanation: "India faced a severe balance-of-payments crisis in 1991. It became the immediate trigger for major reforms.",
      factIds: ["bop-crisis-1991"],
    },
    {
      stem: "Which problem had weakened India's external position before the 1991 reforms?",
      correct: "Large fiscal and external imbalances",
      options: ["Large fiscal and external imbalances", "Persistent trade surplus", "Excess foreign-exchange reserves", "Very low public expenditure"],
      explanation: "Fiscal and external imbalances had built up before 1991. Adverse external shocks made the situation worse.",
      factIds: ["macroeconomic-imbalances"],
    },
    {
      stem: "Why did India need urgent stabilisation measures in 1991?",
      correct: "To address the immediate external and macroeconomic crisis",
      options: ["To address the immediate external and macroeconomic crisis", "To introduce Five-Year Plans", "To nationalise all private firms", "To end foreign trade"],
      explanation: "Stabilisation was needed to handle the immediate macroeconomic and external crisis. Structural reforms addressed deeper long-term problems.",
      factIds: ["bop-crisis-1991", "stabilisation-vs-structural"],
    },
    {
      stem: "Which sequence best describes the 1991 reform context?",
      correct: "Macroeconomic imbalance → balance-of-payments crisis → major reforms",
      options: ["Macroeconomic imbalance → balance-of-payments crisis → major reforms", "Major reforms → Planning Commission → balance-of-payments crisis", "GST → balance-of-payments crisis → Five-Year Plans", "Disinvestment → bank nationalisation → import controls"],
      explanation: "Macroeconomic and external imbalances led to the 1991 crisis. The crisis then accelerated wide-ranging reforms.",
      factIds: ["macroeconomic-imbalances", "bop-crisis-1991"],
    },
  ],
  2: [
    {
      stem: "What does LPG stand for in the context of the 1991 reforms?",
      correct: "Liberalisation, Privatisation and Globalisation",
      options: ["Liberalisation, Privatisation and Globalisation", "Licensing, Planning and Government", "Labour, Production and Growth", "Loans, Prices and Governance"],
      explanation: "LPG stands for Liberalisation, Privatisation and Globalisation. These three ideas summarise the reform direction.",
      factIds: ["lpg-framework"],
    },
    {
      stem: "Which reform mainly reduces unnecessary government controls on economic activity?",
      correct: "Liberalisation",
      options: ["Liberalisation", "Privatisation", "Globalisation", "Nationalisation"],
      explanation: "Liberalisation reduces unnecessary controls and restrictions. It gives firms more freedom to take economic decisions.",
      factIds: ["liberalisation"],
    },
    {
      stem: "Which reform increases the role of private ownership or management?",
      correct: "Privatisation",
      options: ["Privatisation", "Liberalisation", "Globalisation", "Devaluation"],
      explanation: "Privatisation increases the role of private ownership or management. It reduces exclusive public-sector dominance.",
      factIds: ["privatisation"],
    },
    {
      stem: "Which statement correctly distinguishes liberalisation from globalisation?",
      correct: "Liberalisation reduces domestic controls, while globalisation increases integration with the world economy",
      options: ["Liberalisation reduces domestic controls, while globalisation increases integration with the world economy", "Both mean only sale of public-sector shares", "Globalisation means more domestic licensing", "Liberalisation means closing the economy to trade"],
      explanation: "Liberalisation mainly reduces internal controls. Globalisation links the economy more closely with world trade and investment.",
      factIds: ["liberalisation", "globalisation"],
    },
  ],
  3: [
    {
      stem: "What was a major feature of the New Industrial Policy of 1991?",
      correct: "Industrial licensing was abolished for most industries",
      options: ["Industrial licensing was abolished for most industries", "Industrial licensing was extended to every industry", "Private industry was banned", "Foreign investment was completely prohibited"],
      explanation: "The 1991 policy removed industrial licensing for most industries. Only a limited set remained under compulsory licensing.",
      factIds: ["new-industrial-policy-1991", "industrial-delicensing"],
    },
    {
      stem: "What is meant by industrial delicensing?",
      correct: "Removing the need for government licences for most industries",
      options: ["Removing the need for government licences for most industries", "Closing all public-sector firms", "Banning imports", "Fixing all industrial prices by law"],
      explanation: "Delicensing removed compulsory licences from most industries. It reduced administrative control over industrial decisions.",
      factIds: ["industrial-delicensing"],
    },
    {
      stem: "Why did some industries remain under compulsory licensing after 1991?",
      correct: "Because of concerns such as security, safety or hazardous production",
      options: ["Because of concerns such as security, safety or hazardous production", "Because every industry had to remain licensed", "Because private firms were not allowed", "Because foreign trade had ended"],
      explanation: "A limited set remained licensed for reasons such as security, safety and hazardous production. Delicensing was not absolute.",
      factIds: ["industrial-delicensing"],
    },
    {
      stem: "Which change best shows the shift away from the Licence Raj in 1991?",
      correct: "Abolition of industrial licensing for most industries",
      options: ["Abolition of industrial licensing for most industries", "Expansion of compulsory licensing to all firms", "Ban on foreign technology", "Reservation of all industries for the public sector"],
      explanation: "Removing industrial licences from most sectors reduced the old approval system. This was a major liberalisation measure.",
      factIds: ["industrial-delicensing", "liberalisation"],
    },
  ],
  4: [
    {
      stem: "What does disinvestment mean?",
      correct: "Sale of part of the government's equity in a public-sector enterprise",
      options: ["Sale of part of the government's equity in a public-sector enterprise", "Nationalisation of a private company", "Increase in industrial licensing", "Ban on foreign investment"],
      explanation: "Disinvestment means selling part of the government's ownership in a public-sector enterprise.",
      factIds: ["disinvestment"],
    },
    {
      stem: "How did the 1991 reforms change the role of the public sector?",
      correct: "They reduced exclusive public-sector reservation and expanded space for private enterprise",
      options: ["They reduced exclusive public-sector reservation and expanded space for private enterprise", "They reserved all industries for the public sector", "They abolished private enterprise", "They ended all public-sector activity"],
      explanation: "The reforms reduced areas reserved only for the public sector. Private firms received a larger role.",
      factIds: ["public-sector-role"],
    },
    {
      stem: "Which reform is most directly linked with selling government shares in a public enterprise?",
      correct: "Disinvestment",
      options: ["Disinvestment", "Delicensing", "Devaluation", "Current-account convertibility"],
      explanation: "Disinvestment involves sale of government equity in a public enterprise. It is one route toward a larger private role.",
      factIds: ["disinvestment", "privatisation"],
    },
    {
      stem: "Which statement correctly distinguishes disinvestment from delicensing?",
      correct: "Disinvestment changes government ownership, while delicensing removes industrial approval requirements",
      options: ["Disinvestment changes government ownership, while delicensing removes industrial approval requirements", "Both mean devaluation of the rupee", "Delicensing sells public-sector shares", "Disinvestment increases compulsory licensing"],
      explanation: "Disinvestment concerns ownership. Delicensing concerns removal of industrial licensing requirements.",
      factIds: ["disinvestment", "industrial-delicensing"],
    },
  ],
  5: [
    {
      stem: "What is meant by globalisation in the 1991 reform context?",
      correct: "Greater integration of India with the world economy",
      options: ["Greater integration of India with the world economy", "Complete closure of foreign trade", "Expansion of industrial licensing", "Replacement of markets by central planning"],
      explanation: "Globalisation means closer integration with the world through trade, investment and technology flows.",
      factIds: ["globalisation"],
    },
    {
      stem: "Why was foreign investment liberalised after 1991?",
      correct: "To attract capital, technology and management expertise",
      options: ["To attract capital, technology and management expertise", "To prevent all technology transfer", "To eliminate exports", "To increase industrial licensing"],
      explanation: "Foreign investment could bring capital, technology and management skills. The 1991 policy therefore eased approval in selected areas.",
      factIds: ["foreign-investment-liberalisation"],
    },
    {
      stem: "Which change is most closely linked with trade liberalisation?",
      correct: "Reduction of quantitative restrictions and rationalisation of tariffs",
      options: ["Reduction of quantitative restrictions and rationalisation of tariffs", "Increase in import licensing for all goods", "Ban on foreign investment", "Expansion of public-sector reservation"],
      explanation: "Trade reform reduced quantitative restrictions and rationalised tariffs. The aim was greater competition and external integration.",
      factIds: ["trade-liberalisation"],
    },
    {
      stem: "Which pair correctly matches two reform measures with their purpose?",
      correct: "Foreign-investment liberalisation—capital and technology; trade liberalisation—greater external competition",
      options: ["Foreign-investment liberalisation—capital and technology; trade liberalisation—greater external competition", "Foreign-investment liberalisation—more licensing; trade liberalisation—import ban", "Disinvestment—currency devaluation; globalisation—public-sector monopoly", "Delicensing—trade closure; privatisation—higher import quotas"],
      explanation: "Foreign-investment reform opened access to capital and technology. Trade reform reduced barriers and increased external competition.",
      factIds: ["foreign-investment-liberalisation", "trade-liberalisation"],
    },
  ],
  6: [
    {
      stem: "What happened to the rupee in July 1991 as part of the crisis response?",
      correct: "It underwent a two-step downward adjustment",
      options: ["It underwent a two-step downward adjustment", "It was permanently fixed to gold", "It became fully capital-account convertible", "It was replaced by a new currency"],
      explanation: "The rupee was adjusted downward in two steps in July 1991. This formed part of the external-sector response.",
      factIds: ["rupee-adjustment-1991"],
    },
    {
      stem: "What was LERMS introduced for in 1992?",
      correct: "To operate a dual exchange-rate system during the transition to market determination",
      options: ["To operate a dual exchange-rate system during the transition to market determination", "To fix every import price", "To nationalise foreign banks", "To replace the rupee"],
      explanation: "LERMS used a dual exchange-rate system in 1992. It was a transitional step toward a market-determined rate.",
      factIds: ["lerms-1992"],
    },
    {
      stem: "When was the dual exchange-rate system unified into a market-determined rate?",
      correct: "1993",
      options: ["1991", "1992", "1993", "1999"],
      explanation: "The dual system was unified in 1993. The exchange rate then moved to a market-determined framework.",
      factIds: ["market-exchange-rate-1993"],
    },
    {
      stem: "Which sequence of external-sector reforms is correct?",
      correct: "1991 rupee adjustment → 1992 LERMS → 1993 unified market rate → 1994 current-account convertibility",
      options: ["1991 rupee adjustment → 1992 LERMS → 1993 unified market rate → 1994 current-account convertibility", "1992 LERMS → 1991 rupee adjustment → 1994 market rate → 1993 convertibility", "1991 current-account convertibility → 1992 rupee adjustment → 1993 LERMS → 1994 fixed rate", "1991 LERMS → 1992 FEMA → 1993 FERA → 1994 fixed exchange rate"],
      explanation: "The reforms moved step by step toward a more market-based foreign-exchange system. Current-account convertibility followed in 1994.",
      factIds: ["rupee-adjustment-1991", "lerms-1992", "market-exchange-rate-1993", "current-account-convertibility-1994"],
    },
  ],
  7: [
    {
      stem: "Which committee is closely linked with India's financial-sector reforms of 1991?",
      correct: "Narasimham Committee",
      options: ["Narasimham Committee", "Sarkaria Commission", "Kelkar Committee", "Balwant Rai Mehta Committee"],
      explanation: "The Narasimham Committee examined the financial system in 1991. Its recommendations shaped later banking reforms.",
      factIds: ["narasimham-committee-1991"],
    },
    {
      stem: "What was a broad aim of financial-sector reforms after 1991?",
      correct: "To make banking and finance more efficient and competitive",
      options: ["To make banking and finance more efficient and competitive", "To end all bank regulation", "To abolish commercial banks", "To replace banking with barter"],
      explanation: "Financial reforms aimed at a more efficient and competitive system. They reduced excessive direct controls while strengthening the framework.",
      factIds: ["financial-sector-liberalisation"],
    },
    {
      stem: "Which sector was the Narasimham Committee mainly concerned with?",
      correct: "Banking and the financial system",
      options: ["Banking and the financial system", "Agricultural land reform", "Industrial licensing only", "Local government elections"],
      explanation: "The committee examined the structure and working of the financial system. Its recommendations became important for banking reform.",
      factIds: ["narasimham-committee-1991"],
    },
    {
      stem: "Which statement best reflects the post-1991 financial reform direction?",
      correct: "Less direct administrative control with greater competition and prudential reform",
      options: ["Less direct administrative control with greater competition and prudential reform", "More compulsory credit control in every activity", "Abolition of banking supervision", "Complete ban on private-sector banking activity"],
      explanation: "Reforms reduced rigid administrative controls and encouraged efficiency. Regulation increasingly focused on prudential strength and competition.",
      factIds: ["financial-sector-liberalisation", "narasimham-committee-1991"],
    },
  ],
  8: [
    {
      stem: "Which policy statement introduced major industrial reforms on 24 July 1991?",
      correct: "New Industrial Policy",
      options: ["New Industrial Policy", "First Five-Year Plan", "FRBM framework", "GST policy"],
      explanation: "The New Industrial Policy was announced on 24 July 1991. It changed licensing, public-sector policy and foreign-investment rules.",
      factIds: ["new-industrial-policy-1991"],
    },
    {
      stem: "Which came first in India's external-sector reform sequence?",
      correct: "Two-step rupee adjustment in 1991",
      options: ["Two-step rupee adjustment in 1991", "LERMS in 1992", "Unified market exchange rate in 1993", "Current-account convertibility in 1994"],
      explanation: "The rupee adjustment came in July 1991. LERMS, unification and current-account convertibility followed later.",
      factIds: ["rupee-adjustment-1991", "lerms-1992", "market-exchange-rate-1993", "current-account-convertibility-1994"],
    },
    {
      stem: "Which law later replaced the control-oriented FERA framework?",
      correct: "FEMA",
      options: ["FEMA", "FRBM Act", "RBI Act", "Companies Act"],
      explanation: "FEMA replaced FERA and reflected a more management-oriented foreign-exchange framework. FEMA was enacted in 1999.",
      factIds: ["fera-fema-direction"],
    },
    {
      stem: "Which chronology is correct?",
      correct: "1991 reforms → 1992 LERMS → 1993 market exchange rate → 1994 current-account convertibility",
      options: ["1991 reforms → 1992 LERMS → 1993 market exchange rate → 1994 current-account convertibility", "1994 convertibility → 1991 reforms → 1993 LERMS → 1992 market rate", "1992 market rate → 1991 LERMS → 1994 reforms → 1993 convertibility", "1991 FEMA → 1992 FERA → 1993 fixed rate → 1994 licensing expansion"],
      explanation: "The sequence shows the gradual opening of the external sector. Each step moved the system toward greater market determination.",
      factIds: ["lerms-1992", "market-exchange-rate-1993", "current-account-convertibility-1994"],
    },
  ],
  9: [
    {
      stem: "Which measure is mainly a stabilisation measure rather than a structural reform?",
      correct: "A short-term step to correct an immediate balance-of-payments imbalance",
      options: ["A short-term step to correct an immediate balance-of-payments imbalance", "Permanent industrial delicensing", "Long-term trade liberalisation", "Reform of public-sector ownership"],
      explanation: "Stabilisation handles immediate macroeconomic imbalance. Structural reform changes longer-term rules and institutions.",
      factIds: ["stabilisation-vs-structural"],
    },
    {
      stem: "Which measure is clearly a structural reform?",
      correct: "Abolition of industrial licensing for most industries",
      options: ["Abolition of industrial licensing for most industries", "Emergency foreign-exchange financing", "Temporary import compression during a crisis", "Short-term demand restraint"],
      explanation: "Industrial delicensing permanently changed the rules for firms. It is therefore a structural reform.",
      factIds: ["industrial-delicensing", "stabilisation-vs-structural"],
    },
    {
      stem: "Which statement correctly separates stabilisation from structural reform?",
      correct: "Stabilisation addresses immediate imbalance, while structural reform changes the economy's long-term framework",
      options: ["Stabilisation addresses immediate imbalance, while structural reform changes the economy's long-term framework", "Both mean only privatisation", "Structural reform is always temporary", "Stabilisation means industrial licensing"],
      explanation: "The difference is mainly time horizon and purpose. Stabilisation is immediate; structural reform changes underlying rules.",
      factIds: ["stabilisation-vs-structural"],
    },
  ],
  10: [
    {
      stem: "Which reform reduced the use of import quotas and quantitative restrictions?",
      correct: "Trade liberalisation",
      options: ["Trade liberalisation", "Bank nationalisation", "Industrial reservation", "Fiscal federalism"],
      explanation: "Trade liberalisation reduced quantitative restrictions and rationalised tariffs. It opened the economy to more external competition.",
      factIds: ["trade-liberalisation"],
    },
    {
      stem: "What did current-account convertibility mainly allow?",
      correct: "Greater freedom for foreign-exchange transactions related to trade and other current payments",
      options: ["Greater freedom for foreign-exchange transactions related to trade and other current payments", "Unlimited capital transfers of every kind", "A fixed gold value for the rupee", "A ban on foreign-exchange transactions"],
      explanation: "Current-account convertibility eased foreign-exchange use for current transactions such as trade payments. It is different from full capital-account convertibility.",
      factIds: ["current-account-convertibility-1994"],
    },
    {
      stem: "Which statement correctly distinguishes LERMS from current-account convertibility?",
      correct: "LERMS was a dual exchange-rate system, while current-account convertibility eased current foreign-exchange transactions",
      options: ["LERMS was a dual exchange-rate system, while current-account convertibility eased current foreign-exchange transactions", "Both were industrial licensing systems", "LERMS was a disinvestment programme", "Current-account convertibility meant public-sector reservation"],
      explanation: "LERMS dealt with exchange-rate determination. Current-account convertibility dealt with freedom for current foreign-exchange transactions.",
      factIds: ["lerms-1992", "current-account-convertibility-1994"],
    },
  ],
  11: [
    {
      stem: "Consider the statements. I. Delicensing reduced industrial approvals. II. Disinvestment means sale of government equity. Which option is correct?",
      correct: "Both I and II",
      options: ["I only", "II only", "Both I and II", "Neither I nor II"],
      explanation: "Statement I is correct because delicensing removed many licence requirements. Statement II correctly defines disinvestment.",
      factIds: ["industrial-delicensing", "disinvestment"],
    },
    {
      stem: "Consider the statements. I. Globalisation increases world-economy integration. II. Liberalisation increases domestic controls. Which option is correct?",
      correct: "I only",
      options: ["I only", "II only", "Both I and II", "Neither I nor II"],
      explanation: "Statement I is correct. Statement II is false because liberalisation reduces unnecessary domestic controls.",
      factIds: ["globalisation", "liberalisation"],
    },
    {
      stem: "Which pair is correctly matched?",
      correct: "Narasimham Committee—financial-sector reform",
      options: ["Narasimham Committee—financial-sector reform", "LERMS—public-sector disinvestment", "Delicensing—current-account convertibility", "FEMA—Five-Year Plan formulation"],
      explanation: "The Narasimham Committee is closely linked with banking and financial-sector reform after 1991.",
      factIds: ["narasimham-committee-1991"],
    },
  ],
  12: [
    {
      stem: "Which combination correctly matches the reform with its main effect?",
      correct: "Delicensing—fewer industrial approvals; disinvestment—lower government equity; globalisation—greater world integration",
      options: ["Delicensing—fewer industrial approvals; disinvestment—lower government equity; globalisation—greater world integration", "Delicensing—higher public ownership; disinvestment—more licences; globalisation—trade closure", "Privatisation—fixed exchange rate; liberalisation—import ban; globalisation—public monopoly", "LERMS—industrial licensing; FEMA—public ownership; disinvestment—trade quota"],
      explanation: "The three reforms affect different areas: regulation, ownership and external integration.",
      factIds: ["industrial-delicensing", "disinvestment", "globalisation"],
    },
    {
      stem: "Which reform pair deals mainly with different areas of the economy?",
      correct: "Delicensing changes industrial regulation, while LERMS changes exchange-rate management",
      options: ["Delicensing changes industrial regulation, while LERMS changes exchange-rate management", "Both are forms of public-sector disinvestment", "Both only change income-tax rates", "Both are Five-Year Plan institutions"],
      explanation: "Delicensing concerns industrial approvals. LERMS concerns the foreign-exchange system.",
      factIds: ["industrial-delicensing", "lerms-1992"],
    },
    {
      stem: "Which statement best summarises the direction of the 1991 reforms?",
      correct: "Less direct control, a larger private role and greater integration with the world economy",
      options: ["Less direct control, a larger private role and greater integration with the world economy", "More licensing, more public monopoly and less trade", "Complete withdrawal of government from the economy", "Replacement of markets by central allocation"],
      explanation: "The reforms reduced many direct controls, expanded the private role and opened the economy further. Government regulation did not disappear completely.",
      factIds: ["liberalisation", "privatisation", "globalisation"],
    },
  ],
};

export const ECO_CP016_REVIEW_V1: EcoCp016ReviewQuestion[] = Object.entries(qlCases).flatMap(([qlKey, rows]) => {
  const ql = Number(qlKey);
  return rows.map((row, index) => {
    const bundle = sourceBundle(row.factIds);
    const target = (ql + index) % 4;
    const options = [...row.options];
    const current = options.indexOf(row.correct);
    [options[current], options[target]] = [options[target], options[current]];
    return {
      questionId: `ECO-CP-016-Q${String(ql).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`,
      chapterId: "ECO-001",
      cpId: "ECO-CP-016",
      qlId: `ECO-QL-${String(ql).padStart(2, "0")}`,
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
