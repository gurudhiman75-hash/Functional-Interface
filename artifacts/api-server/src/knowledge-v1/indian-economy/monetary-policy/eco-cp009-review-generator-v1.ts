import type { KnowledgeV1Difficulty } from "../../types";
import { ecoCp009Fact } from "./eco-cp009-facts";
import type { EcoCp009ReviewQuestion } from "./eco-cp009-review-types";

const qlNames: Record<number, string> = {
  1: "Monetary-policy objective",
  2: "MPC structure and voting",
  3: "Repo-rate concept and application",
  4: "SDF and liquidity absorption",
  5: "MSF and overnight liquidity support",
  6: "LAF corridor relationship",
  7: "CRR concept and direction",
  8: "Open market operations",
  9: "Bank Rate and instrument distinction",
  10: "Expansionary versus contractionary policy",
  11: "Statement evaluation",
  12: "Mixed transmission and close distinctions",
};

function difficultyForVariant(ql: number, row: number): KnowledgeV1Difficulty {
  if (ql === 1) return row < 2 ? "Easy" : "Medium";
  if (ql === 2) return row === 0 ? "Easy" : row < 3 ? "Medium" : "Hard";
  if (ql === 3 || ql === 4 || ql === 7) return row < 2 ? "Easy" : "Medium";
  if (ql === 5 || ql === 6 || ql === 8) return row === 0 ? "Medium" : row < 3 ? "Medium" : "Hard";
  if (ql === 9 || ql === 10 || ql === 11) return row === 0 ? "Medium" : "Hard";
  return row === 0 ? "Medium" : "Hard";
}

function moveCorrect(options: string[], correct: string, target: number) {
  const index = options.indexOf(correct);
  if (index < 0) throw new Error(`Correct option missing: ${correct}`);
  [options[index], options[target]] = [options[target], options[index]];
  return options;
}

function sourceBundle(ids: string[]) {
  const facts = ids.map(ecoCp009Fact);
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
      stem: "What is the primary objective of monetary policy in India?",
      correct: "Maintain price stability while keeping growth in mind",
      options: ["Maintain price stability while keeping growth in mind", "Maximise tax revenue", "Fix stock-market prices", "Eliminate all business risk"],
      explanation: "The statutory objective gives primacy to price stability while also keeping the objective of growth in mind. Monetary policy is not designed to fix asset prices or remove all economic risk.",
      factIds: ["objective"],
    },
    {
      stem: "Price stability in the monetary-policy framework is pursued while also keeping which objective in mind?",
      correct: "Growth",
      options: ["Growth", "Privatisation", "Export licensing", "Company profits"],
      explanation: "India's monetary-policy objective combines price stability with consideration of growth. The two are part of the same statutory framework.",
      factIds: ["objective"],
    },
    {
      stem: "Inflation pressure is persistent, but RBI also considers the effect of policy on economic activity. This reflects which monetary-policy principle?",
      correct: "Price stability with growth kept in mind",
      options: ["Price stability with growth kept in mind", "Only exchange-rate targeting", "Only stock-price targeting", "Only fiscal-deficit financing"],
      explanation: "The framework does not treat price stability and growth as unrelated. Price stability is primary, while growth is explicitly kept in mind when policy is set.",
      factIds: ["objective"],
    },
    {
      stem: "Which statement best describes monetary policy rather than fiscal policy?",
      correct: "RBI uses monetary instruments to influence liquidity and financial conditions",
      options: ["RBI uses monetary instruments to influence liquidity and financial conditions", "Government changes tax rates and expenditure", "Parliament approves the Union Budget", "Government fixes customs duties"],
      explanation: "Monetary policy works through central-bank instruments and liquidity/interest-rate conditions. Taxation and government expenditure belong to fiscal policy.",
      factIds: ["objective", "laf"],
    },
  ],
  2: [
    {
      stem: "How many members are there in India's Monetary Policy Committee?",
      correct: "Six",
      options: ["Six", "Four", "Five", "Eight"],
      explanation: "The statutory MPC has six members. Three are from RBI and three are external members appointed by the Central Government.",
      factIds: ["mpc-six"],
    },
    {
      stem: "Which composition correctly describes the MPC?",
      correct: "Three RBI members and three external members appointed by the Central Government",
      options: ["Three RBI members and three external members appointed by the Central Government", "Six RBI Governors", "Three Finance Ministry officers and three bank chairpersons", "Four RBI members and two SEBI members"],
      explanation: "The MPC is balanced between three RBI-side members and three external members appointed by the Central Government. This is fixed by the statutory framework.",
      factIds: ["mpc-six"],
    },
    {
      stem: "What happens if MPC votes are equally divided?",
      correct: "The RBI Governor has a second or casting vote",
      options: ["The RBI Governor has a second or casting vote", "The Finance Minister decides", "The oldest member gets two votes", "The meeting is automatically cancelled"],
      explanation: "Each MPC member has one vote. If the votes are tied, the RBI Governor has a second or casting vote to break the tie.",
      factIds: ["mpc-vote"],
    },
    {
      stem: "Which statement about MPC procedure is correct?",
      correct: "It must meet at least four times a year and each member has one vote",
      options: ["It must meet at least four times a year and each member has one vote", "It meets only when inflation is high", "Only the Governor votes", "It has no minimum meeting requirement"],
      explanation: "The amended RBI Act requires at least four MPC meetings each year. Every member has one vote, with the Governor receiving a casting vote only if votes are equally divided.",
      factIds: ["mpc-meetings", "mpc-vote"],
    },
  ],
  3: [
    {
      stem: "The policy repo rate is the rate at which RBI:",
      correct: "Provides liquidity under LAF against eligible collateral",
      options: ["Provides liquidity under LAF against eligible collateral", "Accepts uncollateralised overnight deposits", "Mints coins for banks", "Collects income tax"],
      explanation: "Under repo, RBI supplies liquidity against eligible collateral. This is different from SDF, which absorbs liquidity without collateral.",
      factIds: ["repo", "sdf"],
    },
    {
      stem: "A bank needs short-term liquidity and provides eligible government securities to RBI. Which instrument fits?",
      correct: "Repo",
      options: ["Repo", "SDF", "OMO sale", "CRR"],
      explanation: "Repo is a collateralised liquidity-injection operation. The bank receives funds from RBI against eligible securities.",
      factIds: ["repo"],
    },
    {
      stem: "Other things equal, a reduction in the policy repo rate is generally intended to make short-term funding conditions:",
      correct: "Easier",
      options: ["Easier", "Tighter", "Unaffected by definition", "Equivalent to a tax increase"],
      explanation: "A lower repo rate reduces the policy cost of obtaining RBI liquidity. This is generally an easing signal and can help reduce borrowing costs through transmission.",
      factIds: ["repo", "expansionary"],
    },
    {
      stem: "Other things equal, an increase in the policy repo rate is usually associated with:",
      correct: "Tighter monetary conditions",
      options: ["Tighter monetary conditions", "Automatic increase in fiscal spending", "Higher system liquidity by definition", "A reduction in all taxes"],
      explanation: "A higher policy repo rate makes central-bank liquidity more expensive and signals tighter monetary conditions. The aim is generally to moderate credit and demand pressure.",
      factIds: ["repo", "contractionary"],
    },
  ],
  4: [
    {
      stem: "The Standing Deposit Facility is mainly used by RBI to:",
      correct: "Absorb liquidity without collateral",
      options: ["Absorb liquidity without collateral", "Inject liquidity against securities", "Mint coins", "Manage government tax receipts"],
      explanation: "SDF allows eligible participants to place funds with RBI without RBI providing collateral. It is therefore a liquidity-absorption facility.",
      factIds: ["sdf"],
    },
    {
      stem: "Which facility forms the floor of the current LAF corridor?",
      correct: "Standing Deposit Facility",
      options: ["Standing Deposit Facility", "Marginal Standing Facility", "Bank Rate", "CRR"],
      explanation: "Since the introduction of SDF, it forms the lower bound or floor of the LAF corridor. MSF forms the upper bound.",
      factIds: ["sdf", "corridor"],
    },
    {
      stem: "Banks have excess overnight liquidity and want to place it with RBI without receiving securities in return. Which facility is designed for this?",
      correct: "SDF",
      options: ["SDF", "MSF", "Repo", "OMO purchase"],
      explanation: "SDF is specifically designed to absorb liquidity through uncollateralised deposits with RBI. Repo and MSF work in the opposite direction by supplying liquidity.",
      factIds: ["sdf", "repo", "msf"],
    },
    {
      stem: "Which statement correctly distinguishes SDF from the old fixed reverse-repo floor?",
      correct: "SDF can absorb liquidity without RBI providing collateral",
      options: ["SDF can absorb liquidity without RBI providing collateral", "SDF is an overnight borrowing facility for banks", "SDF is the ceiling of the corridor", "SDF requires RBI to buy government securities outright"],
      explanation: "A key feature of SDF is that RBI can accept deposits without providing collateral. That gives RBI a collateral-free liquidity-absorption instrument.",
      factIds: ["sdf"],
    },
  ],
  5: [
    {
      stem: "MSF is best described as:",
      correct: "An overnight borrowing safety valve for banks facing unexpected liquidity shortage",
      options: ["An overnight borrowing safety valve for banks facing unexpected liquidity shortage", "An uncollateralised deposit facility for surplus funds", "A government tax instrument", "A long-term equity market facility"],
      explanation: "MSF gives eligible banks access to overnight RBI liquidity when they face unexpected shortages. It is a safety valve rather than a normal deposit facility.",
      factIds: ["msf"],
    },
    {
      stem: "A bank faces an unexpected overnight liquidity shortage after normal market options are insufficient. Which RBI facility is most directly relevant?",
      correct: "MSF",
      options: ["MSF", "SDF", "OMO sale", "CRR increase"],
      explanation: "MSF is designed for unexpected overnight liquidity needs of eligible banks. SDF absorbs surplus liquidity instead of supplying funds.",
      factIds: ["msf", "sdf"],
    },
    {
      stem: "Within the LAF corridor, MSF normally acts as the:",
      correct: "Ceiling",
      options: ["Ceiling", "Floor", "Middle policy rate", "Inflation target"],
      explanation: "MSF is the upper bound of the LAF corridor. SDF is the floor and the policy repo rate lies between them.",
      factIds: ["msf", "corridor"],
    },
    {
      stem: "Which distinction between repo and MSF is most accurate?",
      correct: "Repo is the central policy liquidity rate; MSF is a higher-cost overnight safety valve",
      options: ["Repo is the central policy liquidity rate; MSF is a higher-cost overnight safety valve", "MSF absorbs liquidity while repo always drains it", "Repo has no connection with collateral", "MSF is the floor of the corridor"],
      explanation: "Repo is the central policy rate for collateralised RBI liquidity under LAF. MSF is positioned as an emergency overnight borrowing window at the upper edge of the corridor.",
      factIds: ["repo", "msf", "corridor"],
    },
  ],
  6: [
    {
      stem: "Which order correctly represents the LAF corridor from floor to ceiling?",
      correct: "SDF → Repo → MSF",
      options: ["SDF → Repo → MSF", "MSF → Repo → SDF", "Repo → SDF → MSF", "CRR → Repo → OMO"],
      explanation: "SDF is the lower bound, the policy repo rate lies in the middle and MSF is the upper bound. This corridor helps guide short-term money-market rates.",
      factIds: ["corridor", "sdf", "repo", "msf"],
    },
    {
      stem: "In the LAF corridor, the policy repo rate lies:",
      correct: "Between SDF and MSF",
      options: ["Between SDF and MSF", "Below both SDF and MSF", "Above both SDF and MSF", "Outside the liquidity framework"],
      explanation: "The corridor is built around the repo rate. SDF provides the floor and MSF provides the ceiling.",
      factIds: ["corridor"],
    },
    {
      stem: "Which pairing is correct?",
      correct: "SDF — absorbs liquidity; MSF — supplies emergency overnight liquidity",
      options: ["SDF — absorbs liquidity; MSF — supplies emergency overnight liquidity", "SDF — ceiling; MSF — floor", "SDF — tax tool; MSF — fiscal tool", "SDF — OMO purchase; MSF — OMO sale"],
      explanation: "SDF takes surplus funds from the banking system, while MSF provides overnight funds when banks face liquidity shortages. They therefore work on opposite sides of the corridor.",
      factIds: ["sdf", "msf", "corridor"],
    },
    {
      stem: "A bank with surplus overnight funds and another bank with an unexpected shortage approach RBI. Which pairing is most appropriate?",
      correct: "Surplus bank — SDF; shortage bank — MSF",
      options: ["Surplus bank — SDF; shortage bank — MSF", "Surplus bank — MSF; shortage bank — SDF", "Both — CRR", "Both — OMO sale"],
      explanation: "SDF absorbs excess liquidity, whereas MSF supplies overnight liquidity in shortage conditions. The two facilities sit on opposite sides of the LAF corridor.",
      factIds: ["sdf", "msf", "corridor"],
    },
  ],
  7: [
    {
      stem: "CRR requires banks to keep a prescribed share of their liabilities as:",
      correct: "Cash balances with RBI",
      options: ["Cash balances with RBI", "Gold only with the Government", "Equity shares with SEBI", "Foreign currency with customers"],
      explanation: "CRR is maintained as cash balances with RBI. It directly affects how much liquidity remains available in the banking system.",
      factIds: ["crr"],
    },
    {
      stem: "If CRR is raised, other things unchanged, banks generally have:",
      correct: "Less lendable liquidity",
      options: ["Less lendable liquidity", "More lendable liquidity", "No reserve obligation", "Automatic higher tax revenue"],
      explanation: "A higher CRR requires banks to keep more cash with RBI. That leaves a smaller share of funds immediately available for lending.",
      factIds: ["crr", "contractionary"],
    },
    {
      stem: "If CRR is lowered, other things unchanged, the immediate banking-system effect is generally:",
      correct: "More liquidity becomes available to banks",
      options: ["More liquidity becomes available to banks", "All bank deposits disappear", "Liquidity is automatically absorbed", "Government spending falls by definition"],
      explanation: "A lower CRR reduces the mandatory cash balance kept with RBI. This releases funds back into the banking system.",
      factIds: ["crr", "expansionary"],
    },
    {
      stem: "Which action would generally tighten liquidity conditions?",
      correct: "Raising CRR",
      options: ["Raising CRR", "Lowering CRR", "OMO purchase", "Reducing the policy rate"],
      explanation: "Raising CRR locks a larger share of bank liabilities as cash with RBI. That generally reduces lendable liquidity and tightens conditions.",
      factIds: ["crr", "contractionary"],
    },
  ],
  8: [
    {
      stem: "RBI purchases government securities through an open market operation. The immediate liquidity effect is generally:",
      correct: "Liquidity injection",
      options: ["Liquidity injection", "Liquidity absorption", "No payment is made", "CRR automatically rises"],
      explanation: "When RBI buys securities, it pays funds into the financial system. The purchase therefore injects durable liquidity.",
      factIds: ["omo"],
    },
    {
      stem: "RBI sells government securities through an OMO. The immediate liquidity effect is generally:",
      correct: "Liquidity absorption",
      options: ["Liquidity absorption", "Liquidity injection", "Repo borrowing", "SDF creation"],
      explanation: "Market participants pay RBI for the securities. Those payments withdraw funds from the banking system and absorb liquidity.",
      factIds: ["omo"],
    },
    {
      stem: "Which instrument is most directly used for outright purchase or sale of government securities to alter durable liquidity?",
      correct: "Open Market Operations",
      options: ["Open Market Operations", "CRR maintenance", "MPC voting", "Bank licensing"],
      explanation: "OMOs are outright central-bank purchases or sales of government securities. Purchases add durable liquidity; sales remove it.",
      factIds: ["omo"],
    },
    {
      stem: "RBI wants to absorb durable liquidity without changing CRR. Which action fits best?",
      correct: "Sell government securities through OMO",
      options: ["Sell government securities through OMO", "Buy government securities through OMO", "Lower CRR", "Provide repo liquidity"],
      explanation: "An OMO sale takes funds from market participants in exchange for securities. This drains durable liquidity without requiring a CRR change.",
      factIds: ["omo", "crr"],
    },
  ],
  9: [
    {
      stem: "Bank Rate is best described as:",
      correct: "The statutory RBI rate for buying or rediscounting eligible bills and commercial paper",
      options: ["The statutory RBI rate for buying or rediscounting eligible bills and commercial paper", "The rate paid on SDF deposits", "The CRR percentage", "The rate on household savings accounts"],
      explanation: "Bank Rate is defined under the RBI Act in relation to RBI buying or rediscounting eligible bills and commercial paper. It should not be confused with repo or SDF.",
      factIds: ["bank-rate"],
    },
    {
      stem: "Which pair is correctly matched?",
      correct: "Repo — collateralised liquidity injection; SDF — uncollateralised liquidity absorption",
      options: ["Repo — collateralised liquidity injection; SDF — uncollateralised liquidity absorption", "SDF — emergency borrowing; MSF — deposit absorption", "CRR — OMO purchase; Bank Rate — tax rate", "OMO sale — liquidity injection; OMO purchase — liquidity absorption"],
      explanation: "Repo supplies funds against collateral, while SDF absorbs surplus funds without collateral. The directions and mechanics are different.",
      factIds: ["repo", "sdf"],
    },
    {
      stem: "Which distinction is correct?",
      correct: "CRR changes mandatory cash balances; OMO changes liquidity through securities purchases or sales",
      options: ["CRR changes mandatory cash balances; OMO changes liquidity through securities purchases or sales", "CRR and OMO are identical", "OMO fixes the statutory reserve ratio", "CRR means RBI buys government securities"],
      explanation: "CRR works through the cash balance banks must maintain with RBI. OMOs work through outright transactions in government securities.",
      factIds: ["crr", "omo"],
    },
  ],
  10: [
    {
      stem: "Which combination is generally expansionary?",
      correct: "Lower policy rate, lower CRR and OMO purchase",
      options: ["Lower policy rate, lower CRR and OMO purchase", "Higher policy rate, higher CRR and OMO sale", "Higher CRR and OMO sale only", "Higher policy rate and liquidity absorption"],
      explanation: "Lower rates, lower reserve requirements and OMO purchases all tend to make liquidity or credit conditions easier. They therefore point in an expansionary direction.",
      factIds: ["expansionary", "repo", "crr", "omo"],
    },
    {
      stem: "Which combination is generally contractionary?",
      correct: "Higher policy rate, higher CRR and OMO sale",
      options: ["Higher policy rate, higher CRR and OMO sale", "Lower policy rate, lower CRR and OMO purchase", "Lower CRR and OMO purchase", "Repo cut and liquidity injection"],
      explanation: "Higher policy rates, higher reserve requirements and OMO sales all tend to tighten monetary or liquidity conditions. They are therefore contractionary in direction.",
      factIds: ["contractionary", "repo", "crr", "omo"],
    },
    {
      stem: "Inflationary demand pressure is strong. Which policy mix most directly works to restrain credit and demand?",
      correct: "Tighter policy rate and liquidity conditions",
      options: ["Tighter policy rate and liquidity conditions", "Lower rates plus liquidity injection", "Lower CRR plus OMO purchase", "More liquidity with cheaper funding"],
      explanation: "Tighter monetary conditions raise the cost or reduce the ease of credit, which can moderate borrowing and spending. This is the intended contractionary transmission path.",
      factIds: ["contractionary", "objective"],
    },
  ],
  11: [
    {
      stem: "Consider the statements:\nI. SDF absorbs liquidity.\nII. MSF provides overnight liquidity support.\nWhich is correct?",
      correct: "Both I and II",
      options: ["I only", "II only", "Both I and II", "Neither I nor II"],
      explanation: "Statement I is correct because SDF accepts surplus funds with RBI. Statement II is also correct because MSF is an overnight borrowing safety valve for eligible banks.",
      factIds: ["sdf", "msf"],
    },
    {
      stem: "Consider the statements:\nI. An OMO purchase tends to inject liquidity.\nII. An OMO sale tends to absorb liquidity.\nWhich is correct?",
      correct: "Both I and II",
      options: ["I only", "II only", "Both I and II", "Neither I nor II"],
      explanation: "Both statements are correct. RBI pays funds into the system when it buys securities and receives funds from the system when it sells them.",
      factIds: ["omo"],
    },
    {
      stem: "Consider the statements:\nI. Every MPC member has one vote.\nII. In a tie, the RBI Governor has a casting vote.\nWhich is correct?",
      correct: "Both I and II",
      options: ["I only", "II only", "Both I and II", "Neither I nor II"],
      explanation: "Each MPC member has one ordinary vote. If the votes are equally divided, the Governor receives a second or casting vote to resolve the tie.",
      factIds: ["mpc-vote"],
    },
  ],
  12: [
    {
      stem: "RBI wants to absorb surplus overnight liquidity without collateral but does not want an outright securities sale. Which instrument fits best?",
      correct: "SDF",
      options: ["SDF", "OMO sale", "MSF", "Repo"],
      explanation: "SDF absorbs overnight liquidity without collateral. An OMO sale also drains liquidity, but it is an outright securities transaction and is not the facility described here.",
      factIds: ["sdf", "omo"],
    },
    {
      stem: "RBI raises CRR and also sells government securities. What is the common direction of these two actions?",
      correct: "Both tend to reduce banking-system liquidity",
      options: ["Both tend to reduce banking-system liquidity", "Both inject liquidity", "One is fiscal and the other has no monetary effect", "Both lower mandatory reserves"],
      explanation: "A higher CRR locks more cash with RBI, while an OMO sale withdraws funds from the market. Both therefore work in a tightening direction through different mechanisms.",
      factIds: ["crr", "omo", "contractionary"],
    },
    {
      stem: "A policy action first makes RBI funding more expensive, then market borrowing costs rise and credit demand weakens. This is an example of:",
      correct: "Monetary-policy transmission",
      options: ["Monetary-policy transmission", "Barter exchange", "Fiscal federalism", "National-income accounting"],
      explanation: "Monetary-policy transmission is the chain through which a central-bank action affects financial conditions and then spending or demand. The question describes that multi-step process.",
      factIds: ["repo", "contractionary", "objective"],
    },
  ],
};

export function generateEcoCp009ReviewBatchV1() {
  const questions: EcoCp009ReviewQuestion[] = [];
  let globalIndex = 0;

  for (let ql = 1; ql <= 12; ql += 1) {
    const cases = qlCases[ql];
    for (let row = 0; row < cases.length; row += 1) {
      const item = cases[row];
      const target = globalIndex % 4;
      const metadata = sourceBundle(item.factIds);
      questions.push({
        questionId: `ECO-CP009-V1-${String(globalIndex + 1).padStart(3, "0")}`,
        chapterId: "ECO-001",
        cpId: "ECO-CP-009",
        qlId: `ECO-009-QL-${String(ql).padStart(3, "0")}`,
        qlName: qlNames[ql],
        difficulty: difficultyForVariant(ql, row),
        stem: item.stem,
        options: moveCorrect([...item.options], item.correct, target),
        correctIndex: target,
        canonicalAnswer: item.correct,
        explanation: item.explanation,
        ...metadata,
        reviewOnly: true,
        runtimeRegistered: false,
      });
      globalIndex += 1;
    }
  }

  return questions;
}
