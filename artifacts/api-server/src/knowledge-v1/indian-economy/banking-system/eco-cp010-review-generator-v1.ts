import type { KnowledgeV1Difficulty } from "../../types";
import { ecoCp010Fact } from "./eco-cp010-facts";
import type { EcoCp010ReviewQuestion } from "./eco-cp010-review-types";

const qlNames: Record<number, string> = {
  1: "Scheduled-bank meaning and classification",
  2: "Core banking and financial intermediation",
  3: "Deposit-product distinctions",
  4: "Regional Rural Banks",
  5: "Cooperative credit structure",
  6: "Small Finance Bank vs Payments Bank",
  7: "Secured and unsecured lending",
  8: "Basic bank credit creation",
  9: "NPA concept and 90-day rule",
  10: "Priority Sector Lending",
  11: "DICGC deposit insurance",
  12: "Statements and mixed banking distinctions",
};

function difficultyForVariant(ql: number, row: number): KnowledgeV1Difficulty {
  if ([1, 2, 3, 4].includes(ql)) return row < 2 ? "Easy" : "Medium";
  if (ql === 5 || ql === 6) return row === 0 ? "Easy" : row < 3 ? "Medium" : "Hard";
  if (ql === 7) return row < 2 ? "Medium" : "Hard";
  if (ql === 8) return row < 3 ? "Medium" : "Hard";
  if (ql === 9) return row < 2 ? "Easy" : row === 2 ? "Medium" : "Hard";
  if (ql === 10 || ql === 11) return row === 0 ? "Easy" : "Medium";
  return row === 0 ? "Medium" : "Hard";
}

function moveCorrect(options: string[], correct: string, target: number) {
  const index = options.indexOf(correct);
  if (index < 0) throw new Error(`Correct option missing: ${correct}`);
  [options[index], options[target]] = [options[target], options[index]];
  return options;
}

function sourceBundle(ids: string[]) {
  const facts = ids.map(ecoCp010Fact);
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
      stem: "A scheduled bank is one that is included in:",
      correct: "The Second Schedule of the RBI Act, 1934",
      options: ["The Second Schedule of the RBI Act, 1934", "The Union Budget", "The Companies Act schedule", "The SEBI Act"],
      explanation: "Scheduled-bank status comes from inclusion in the Second Schedule of the RBI Act, 1934. It is a legal classification, not a ranking of bank size.",
      factIds: ["scheduled-bank"],
    },
    {
      stem: "Which statement best describes the word 'scheduled' in scheduled bank?",
      correct: "It refers to inclusion in the Second Schedule of the RBI Act",
      options: ["It refers to inclusion in the Second Schedule of the RBI Act", "It means the bank opens on a fixed weekly schedule", "It means the bank is Government-owned", "It means the bank lends only to agriculture"],
      explanation: "The term 'scheduled' refers to the bank's inclusion in the Second Schedule of the RBI Act. It does not by itself tell us whether the bank is public, private or rural.",
      factIds: ["scheduled-bank"],
    },
    {
      stem: "Which fact alone is enough to identify a bank as scheduled?",
      correct: "Its inclusion in the Second Schedule of the RBI Act",
      options: ["Its inclusion in the Second Schedule of the RBI Act", "Its number of branches", "Its ownership by Government", "Its participation in priority-sector lending"],
      explanation: "Scheduled status is determined by the statutory schedule. Branch count, ownership and lending focus are separate characteristics.",
      factIds: ["scheduled-bank"],
    },
    {
      stem: "A bank changes ownership but remains in the Second Schedule of the RBI Act. Its scheduled-bank status:",
      correct: "Continues unless its scheduled status itself changes",
      options: ["Continues unless its scheduled status itself changes", "Automatically ends because ownership changed", "Becomes an RRB automatically", "Becomes a Payments Bank automatically"],
      explanation: "Scheduled status depends on inclusion in the statutory schedule, not simply on who owns the bank. An ownership change alone does not redefine that classification.",
      factIds: ["scheduled-bank"],
    },
  ],
  2: [
    {
      stem: "A bank accepts deposits from savers and lends part of those funds to borrowers. This is called:",
      correct: "Financial intermediation",
      options: ["Financial intermediation", "Barter exchange", "Tax collection", "Equity underwriting only"],
      explanation: "Banks connect savers who have surplus funds with borrowers who need funds. That linking function is financial intermediation.",
      factIds: ["intermediation"],
    },
    {
      stem: "Which pair shows two core banking activities?",
      correct: "Accepting deposits and extending loans",
      options: ["Accepting deposits and extending loans", "Minting coins and printing stamps", "Collecting GST and customs duty", "Running stock exchanges and mutual funds"],
      explanation: "Deposit-taking and lending are central banking activities. The other pairs belong to government or capital-market functions.",
      factIds: ["intermediation"],
    },
    {
      stem: "Why are banks called financial intermediaries?",
      correct: "They channel funds from savers to borrowers",
      options: ["They channel funds from savers to borrowers", "They set all market prices", "They issue all currency notes", "They prepare the Union Budget"],
      explanation: "Banks mobilise savings and use part of those funds to extend credit. This channels money from surplus units to deficit units.",
      factIds: ["intermediation"],
    },
    {
      stem: "Households place savings in banks, while firms borrow for working capital. What connects these two sides?",
      correct: "Bank financial intermediation",
      options: ["Bank financial intermediation", "Fiscal deficit", "Foreign-exchange intervention", "Barter"],
      explanation: "The bank pools deposits and supplies credit, linking household savings with the financing needs of firms. That is the intermediation process.",
      factIds: ["intermediation"],
    },
  ],
  3: [
    {
      stem: "An account mainly used by a household to keep savings with withdrawal access is a:",
      correct: "Savings deposit",
      options: ["Savings deposit", "Current deposit", "Fixed deposit", "Recurring deposit"],
      explanation: "A savings deposit is primarily a household saving account with withdrawal access subject to account rules. It differs from the more transaction-heavy current account.",
      factIds: ["savings-deposit", "current-deposit"],
    },
    {
      stem: "A business needs an account for frequent receipts and payments. Which deposit type best fits?",
      correct: "Current deposit",
      options: ["Current deposit", "Fixed deposit", "Recurring deposit", "Long-term bond"],
      explanation: "Current deposits are transaction-oriented and suit frequent business payments and receipts. Fixed deposits instead lock funds for a stated period.",
      factIds: ["current-deposit", "fixed-deposit"],
    },
    {
      stem: "A customer places a lump sum with a bank for a stated period. This is most directly a:",
      correct: "Fixed deposit",
      options: ["Fixed deposit", "Current deposit", "Recurring deposit", "Cash credit account"],
      explanation: "A fixed deposit places a lump sum for a stated maturity period. A recurring deposit builds the balance through repeated instalments.",
      factIds: ["fixed-deposit", "recurring-deposit"],
    },
    {
      stem: "A saver deposits the same amount every month for a chosen period. This is a:",
      correct: "Recurring deposit",
      options: ["Recurring deposit", "Current deposit", "Cash-credit limit", "Demand loan"],
      explanation: "A recurring deposit accumulates savings through regular instalments over time. It is different from a one-time fixed deposit.",
      factIds: ["recurring-deposit", "fixed-deposit"],
    },
  ],
  4: [
    {
      stem: "Regional Rural Banks were first established in:",
      correct: "1975",
      options: ["1975", "1949", "1982", "1991"],
      explanation: "RRBs were established in 1975. The Regional Rural Banks Act followed in 1976.",
      factIds: ["rrb-origin"],
    },
    {
      stem: "The Regional Rural Banks Act was enacted in:",
      correct: "1976",
      options: ["1976", "1934", "1949", "1999"],
      explanation: "The RRB Act was enacted in 1976 after the first RRBs were set up in 1975. The two dates mark origin and statutory framework respectively.",
      factIds: ["rrb-origin"],
    },
    {
      stem: "What was the main purpose behind Regional Rural Banks?",
      correct: "Expanding institutional credit in rural and agricultural areas",
      options: ["Expanding institutional credit in rural and agricultural areas", "Regulating stock exchanges", "Managing foreign-exchange reserves", "Issuing banknotes"],
      explanation: "RRBs were designed to strengthen banking and credit access in rural areas, especially for agriculture and other rural priority groups.",
      factIds: ["rrb-purpose"],
    },
    {
      stem: "A bank was created specifically to strengthen formal credit access for rural borrowers. Which category best fits the original policy purpose?",
      correct: "Regional Rural Bank",
      options: ["Regional Rural Bank", "Payments Bank", "Merchant bank", "Stock exchange"],
      explanation: "RRBs were created as a dedicated institutional channel for rural and agricultural credit. Their policy purpose is more specific than general payment services.",
      factIds: ["rrb-purpose"],
    },
  ],
  5: [
    {
      stem: "At the village level of the short-term rural cooperative credit structure is the:",
      correct: "Primary Agricultural Credit Society",
      options: ["Primary Agricultural Credit Society", "District Central Cooperative Bank", "State Cooperative Bank", "Reserve Bank of India"],
      explanation: "PACS forms the village or base tier of the short-term rural cooperative credit structure. The district and State institutions sit above it.",
      factIds: ["pacs-base", "coop-structure"],
    },
    {
      stem: "Which institution forms the district-level middle tier of the short-term rural cooperative credit structure?",
      correct: "District Central Cooperative Bank",
      options: ["District Central Cooperative Bank", "Primary Agricultural Credit Society", "State Cooperative Bank", "Payments Bank"],
      explanation: "District Central Cooperative Banks occupy the middle tier between PACS and State Cooperative Banks.",
      factIds: ["dccb-middle", "coop-structure"],
    },
    {
      stem: "Which institution is the apex State-level tier in the short-term rural cooperative credit structure?",
      correct: "State Cooperative Bank",
      options: ["State Cooperative Bank", "District Central Cooperative Bank", "Primary Agricultural Credit Society", "Regional Rural Bank"],
      explanation: "The State Cooperative Bank sits at the apex of the State-level short-term cooperative structure. DCCBs are the middle tier and PACS the base tier.",
      factIds: ["stcb-apex", "coop-structure"],
    },
    {
      stem: "Which order correctly moves from village level to State apex in the short-term cooperative credit structure?",
      correct: "PACS → District Central Cooperative Bank → State Cooperative Bank",
      options: ["PACS → District Central Cooperative Bank → State Cooperative Bank", "State Cooperative Bank → PACS → District Central Cooperative Bank", "RRB → PACS → RBI", "District Central Cooperative Bank → RBI → PACS"],
      explanation: "The structure moves upward from PACS at village level to the district central bank and then to the State Cooperative Bank at the apex.",
      factIds: ["pacs-base", "dccb-middle", "stcb-apex"],
    },
  ],
  6: [
    {
      stem: "Which differentiated bank is permitted to lend to underserved borrowers such as small businesses and small farmers?",
      correct: "Small Finance Bank",
      options: ["Small Finance Bank", "Payments Bank", "Only a stock exchange", "Only DICGC"],
      explanation: "Small Finance Banks combine deposit services with lending, with a strong financial-inclusion focus on underserved borrowers.",
      factIds: ["sfb-purpose"],
    },
    {
      stem: "Which bank can accept demand deposits and provide payments/remittances but cannot undertake lending?",
      correct: "Payments Bank",
      options: ["Payments Bank", "Small Finance Bank", "Regional Rural Bank", "State Cooperative Bank"],
      explanation: "Payments Banks are designed for deposits, payments and remittances, but their licensing framework does not permit lending.",
      factIds: ["payments-bank"],
    },
    {
      stem: "A customer wants a bank that can both accept deposits and directly lend to a small enterprise. Which differentiated-bank model fits?",
      correct: "Small Finance Bank",
      options: ["Small Finance Bank", "Payments Bank", "DICGC", "PACS only"],
      explanation: "Small Finance Banks can accept deposits and extend credit. Payments Banks cannot undertake lending, which is the deciding difference here.",
      factIds: ["sfb-purpose", "payments-bank"],
    },
    {
      stem: "Which statement correctly distinguishes Small Finance Banks from Payments Banks?",
      correct: "Small Finance Banks can lend; Payments Banks cannot undertake lending",
      options: ["Small Finance Banks can lend; Payments Banks cannot undertake lending", "Payments Banks can lend but Small Finance Banks cannot", "Neither may accept deposits", "Both are only payment-system operators and neither is a bank"],
      explanation: "Both models support financial inclusion, but their credit powers differ sharply. Small Finance Banks lend, while Payments Banks are barred from lending.",
      factIds: ["sfb-purpose", "payments-bank"],
    },
  ],
  7: [
    {
      stem: "A loan backed by pledged property or another specified asset is a:",
      correct: "Secured loan",
      options: ["Secured loan", "Unsecured loan", "Demand deposit", "Recurring deposit"],
      explanation: "A secured loan is supported by specified collateral. The security gives the lender an additional recovery claim if the borrower defaults.",
      factIds: ["secured-loan"],
    },
    {
      stem: "A loan is granted without specific collateral, based mainly on creditworthiness. It is:",
      correct: "Unsecured loan",
      options: ["Unsecured loan", "Secured loan", "Fixed deposit", "Current deposit"],
      explanation: "An unsecured loan is not backed by a specific pledged asset. The lender relies more heavily on the borrower's capacity and willingness to repay.",
      factIds: ["unsecured-loan"],
    },
    {
      stem: "Two borrowers have identical repayment ability, but only one pledges a house to secure the loan. What is the key distinction?",
      correct: "The loan backed by the house is secured because specific collateral is pledged",
      options: ["The loan backed by the house is secured because specific collateral is pledged", "Both loans are unsecured because repayment ability is identical", "The collateral-backed loan becomes a deposit", "The unsecured loan automatically becomes an NPA"],
      explanation: "The presence of specific collateral is what makes one loan secured. Creditworthiness and collateral are related risk factors but are not the same concept.",
      factIds: ["secured-loan", "unsecured-loan"],
    },
  ],
  8: [
    {
      stem: "Why can bank lending lead to creation of additional deposits in the banking system?",
      correct: "Loan proceeds can be redeposited and support further lending after reserves are retained",
      options: ["Loan proceeds can be redeposited and support further lending after reserves are retained", "Every loan is printed as new currency", "Banks can ignore all reserve needs", "Deposits disappear when a loan is made"],
      explanation: "A bank loan can reappear as a deposit when the borrower spends the funds and the recipient deposits them. After reserves are retained, part of that deposit can support another round of lending.",
      factIds: ["credit-creation"],
    },
    {
      stem: "A bank receives a deposit of 1,000 and keeps 20% as reserves. Ignoring other constraints, how much can it lend in the first round?",
      correct: "800",
      options: ["800", "200", "1,000", "1,200"],
      explanation: "Twenty per cent of 1,000 is 200 kept as reserves. The remaining 800 is available for first-round lending in this simplified example.",
      factIds: ["credit-creation"],
    },
    {
      stem: "In a simplified deposit-creation process, what happens after a bank loan is spent and the receiver redeposits the money?",
      correct: "The new deposit can support another round of lending after reserves are retained",
      options: ["The new deposit can support another round of lending after reserves are retained", "The banking system must destroy the deposit", "The deposit automatically becomes Government revenue", "No bank can use any part of it"],
      explanation: "Redeposited loan proceeds create a new deposit balance. Banks can then retain reserves and lend part of the balance again, allowing multiple deposit expansion.",
      factIds: ["credit-creation"],
    },
    {
      stem: "Which condition would reduce the amount of multiple deposit expansion, other things equal?",
      correct: "Banks retain a larger share of deposits as reserves",
      options: ["Banks retain a larger share of deposits as reserves", "Banks retain a smaller share as reserves", "Every loan is fully redeposited and reserves fall", "Borrowers increase redepositing while reserves are unchanged"],
      explanation: "A larger reserve share leaves less of each deposit available for another lending round. The chain of deposit expansion therefore becomes smaller.",
      factIds: ["credit-creation"],
    },
  ],
  9: [
    {
      stem: "A bank asset becomes non-performing when it:",
      correct: "Ceases to generate income for the bank under the applicable norms",
      options: ["Ceases to generate income for the bank under the applicable norms", "Earns more interest than expected", "Is backed by collateral", "Is given to a business borrower"],
      explanation: "The basic NPA concept is that the asset has stopped generating income under the prudential classification rules. Being secured or business-related does not by itself make a loan non-performing.",
      factIds: ["npa-basic"],
    },
    {
      stem: "For an ordinary term loan, the standard NPA trigger is interest or principal overdue for:",
      correct: "More than 90 days",
      options: ["More than 90 days", "More than 7 days", "Exactly one year in every case", "Only after court action"],
      explanation: "For ordinary term loans, interest or principal overdue for more than 90 days meets the standard NPA trigger. Special asset classes can have separate rules.",
      factIds: ["npa-basic"],
    },
    {
      stem: "A normal term-loan instalment remains unpaid for 100 days. Under the standard rule, the account would generally be classified as:",
      correct: "NPA",
      options: ["NPA", "Always a standard asset", "A demand deposit", "A scheduled bank"],
      explanation: "One hundred days is beyond the standard 90-day overdue threshold for an ordinary term loan. The loan therefore meets the basic NPA classification rule.",
      factIds: ["npa-basic"],
    },
    {
      stem: "Which statement is correct about collateral and NPA classification?",
      correct: "A secured loan can still become an NPA if repayment performance meets the NPA rule",
      options: ["A secured loan can still become an NPA if repayment performance meets the NPA rule", "Collateral guarantees that a loan can never become an NPA", "Only unsecured loans can become NPAs", "NPA status depends only on the market value of collateral"],
      explanation: "Asset classification is based on repayment and income-recognition rules, not merely on whether collateral exists. Security affects recovery risk but does not prevent NPA classification.",
      factIds: ["npa-basic", "secured-loan"],
    },
  ],
  10: [
    {
      stem: "Priority Sector Lending is mainly intended to:",
      correct: "Direct bank credit toward sectors important for inclusive development",
      options: ["Direct bank credit toward sectors important for inclusive development", "Fix the exchange rate", "Replace all bank deposits", "Set stock-market prices"],
      explanation: "PSL channels bank credit toward identified sectors that policy treats as important for inclusive development. It is a credit-allocation framework, not a currency or stock-market tool.",
      factIds: ["psl"],
    },
    {
      stem: "Which is a standard priority-sector category?",
      correct: "Agriculture",
      options: ["Agriculture", "Speculative share trading", "Luxury imports only", "Cryptocurrency mining"],
      explanation: "Agriculture is a core priority-sector category. RBI directions also cover categories such as MSMEs, education, housing and certain infrastructure segments.",
      factIds: ["psl"],
    },
    {
      stem: "A bank lends to a qualifying small enterprise under RBI's priority-sector framework. Which broad category is most relevant?",
      correct: "MSME",
      options: ["MSME", "Foreign-exchange reserve", "Currency issue", "Government debt management"],
      explanation: "Micro, Small and Medium Enterprises are a recognised priority-sector category. The question is about credit classification, not central-bank reserve management.",
      factIds: ["psl"],
    },
  ],
  11: [
    {
      stem: "Which institution provides deposit insurance for eligible bank deposits in India?",
      correct: "DICGC",
      options: ["DICGC", "SEBI", "NITI Aayog", "Finance Commission"],
      explanation: "The Deposit Insurance and Credit Guarantee Corporation provides insurance for eligible deposits held with insured banks.",
      factIds: ["dicgc"],
    },
    {
      stem: "Which set contains deposit types covered by DICGC subject to its rules?",
      correct: "Savings, current, fixed and recurring deposits",
      options: ["Savings, current, fixed and recurring deposits", "Only equity shares", "Only mutual-fund units", "Only Government bonds"],
      explanation: "DICGC covers eligible bank deposit accounts such as savings, current, fixed and recurring deposits. Investment securities are not bank deposits simply because a bank may distribute them.",
      factIds: ["dicgc"],
    },
    {
      stem: "A depositor holds several accounts in the same bank in the same right and same capacity. For DICGC insurance, these balances are generally:",
      correct: "Aggregated together",
      options: ["Aggregated together", "Always insured as completely separate banks", "Ignored if one is a fixed deposit", "Converted into shares"],
      explanation: "DICGC aggregates balances held in the same right and same capacity at the same bank for insurance purposes. Separate account numbers alone do not create separate coverage buckets.",
      factIds: ["dicgc"],
    },
  ],
  12: [
    {
      stem: "Consider the statements: I. Payments Banks can accept demand deposits. II. Payments Banks can undertake lending like ordinary commercial banks. Which is correct?",
      correct: "I only",
      options: ["I only", "II only", "Both I and II", "Neither I nor II"],
      explanation: "Statement I is correct because Payments Banks can accept demand deposits. Statement II is false because their licensing framework does not permit lending.",
      factIds: ["payments-bank"],
    },
    {
      stem: "Consider the statements: I. PACS is the village-level base of the short-term rural cooperative credit structure. II. State Cooperative Bank is the State-level apex. Which is correct?",
      correct: "Both I and II",
      options: ["Both I and II", "I only", "II only", "Neither I nor II"],
      explanation: "Both statements are correct. PACS forms the base tier, while the State Cooperative Bank is the apex State-level institution.",
      factIds: ["pacs-base", "stcb-apex", "coop-structure"],
    },
    {
      stem: "Which statement correctly separates credit risk from deposit insurance?",
      correct: "An NPA concerns a bank's problem loan, while DICGC concerns protection of eligible deposits",
      options: ["An NPA concerns a bank's problem loan, while DICGC concerns protection of eligible deposits", "DICGC classifies every overdue loan as NPA", "An NPA is a type of insured savings account", "Deposit insurance prevents every bank loan from defaulting"],
      explanation: "NPA classification relates to the performance of a bank asset or loan. DICGC deposit insurance instead protects eligible depositor balances under its rules.",
      factIds: ["npa-basic", "dicgc"],
    },
  ],
};

export function generateEcoCp010ReviewV1(): EcoCp010ReviewQuestion[] {
  const questions: EcoCp010ReviewQuestion[] = [];
  let serial = 1;

  for (let ql = 1; ql <= 12; ql += 1) {
    qlCases[ql].forEach((row, rowIndex) => {
      const target = (serial - 1) % 4;
      const options = moveCorrect([...row.options], row.correct, target);
      const source = sourceBundle(row.factIds);
      questions.push({
        questionId: `ECO-CP-010-Q${String(serial).padStart(3, "0")}`,
        chapterId: "ECO-001",
        cpId: "ECO-CP-010",
        qlId: `ECO-CP-010-QL-${String(ql).padStart(2, "0")}`,
        qlName: qlNames[ql],
        difficulty: difficultyForVariant(ql, rowIndex),
        stem: row.stem,
        options,
        correctIndex: target,
        canonicalAnswer: row.correct,
        explanation: row.explanation,
        sourceIds: source.sourceIds,
        sourceFactIds: source.sourceFactIds,
        reviewOnly: true,
        runtimeRegistered: false,
      });
      serial += 1;
    });
  }

  return questions;
}

export const ECO_CP010_REVIEW_V1 = Object.freeze(generateEcoCp010ReviewV1());
