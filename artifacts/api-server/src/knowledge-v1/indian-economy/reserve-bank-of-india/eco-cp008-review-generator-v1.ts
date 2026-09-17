import type { KnowledgeV1Difficulty } from "../../types";
import { ecoCp008Fact } from "./eco-cp008-facts";
import type { EcoCp008ReviewQuestion } from "./eco-cp008-review-types";

const qlNames: Record<number, string> = {
  1: "RBI history milestones",
  2: "Act, ownership and Central Office history",
  3: "Currency issue, one-rupee note and coins",
  4: "Banker to Government and debt manager",
  5: "Banker to banks and settlement role",
  6: "Lender of last resort",
  7: "Regulation and supervision",
  8: "Foreign exchange, payment systems and developmental role",
  9: "Monetary authority concept",
  10: "Correctly matched RBI function",
  11: "Statement evaluation",
  12: "Close institutional distinctions",
};

function difficultyForVariant(ql: number, row: number): KnowledgeV1Difficulty {
  if (ql === 1 || ql === 2) return row < 2 ? "Easy" : "Medium";
  if (ql === 3 || ql === 4 || ql === 5 || ql === 7 || ql === 8) {
    return row === 0 ? "Easy" : row < 3 ? "Medium" : "Hard";
  }
  if (ql === 6) return row < 2 ? "Medium" : "Hard";
  if (ql === 9) return row === 0 ? "Easy" : "Medium";
  if (ql === 10) return row < 2 ? "Medium" : "Hard";
  if (ql === 11) return row === 0 ? "Medium" : "Hard";
  return row === 0 ? "Medium" : "Hard";
}

function moveCorrect(options: string[], correct: string, target: number) {
  const index = options.indexOf(correct);
  if (index < 0) throw new Error(`Correct option missing: ${correct}`);
  [options[index], options[target]] = [options[target], options[index]];
  return options;
}

function sourceBundle(ids: string[]) {
  const facts = ids.map(ecoCp008Fact);
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
      stem: "RBI was established under which law?",
      correct: "Reserve Bank of India Act, 1934",
      options: ["Reserve Bank of India Act, 1934", "Banking Regulation Act, 1949", "FEMA, 1999", "PSS Act, 2007"],
      explanation: "RBI was established under the Reserve Bank of India Act, 1934. The Bank began operations the following year.",
      factIds: ["rbi-act"],
    },
    {
      stem: "RBI commenced operations on:",
      correct: "1 April 1935",
      options: ["1 April 1935", "1 January 1949", "15 August 1947", "1 April 1937"],
      explanation: "RBI began operations on 1 April 1935. The governing Act had been enacted in 1934.",
      factIds: ["operations-1935", "rbi-act"],
    },
    {
      stem: "RBI's Central Office was initially in Calcutta. It moved permanently to Mumbai in:",
      correct: "1937",
      options: ["1935", "1937", "1947", "1949"],
      explanation: "The Central Office started in Calcutta and was permanently moved to Mumbai in 1937. Mumbai has since remained the Central Office location.",
      factIds: ["office-move-1937"],
    },
    {
      stem: "RBI was nationalised with effect from:",
      correct: "1 January 1949",
      options: ["1 April 1935", "15 August 1947", "1 January 1949", "26 January 1950"],
      explanation: "RBI was originally privately owned and was nationalised with effect from 1 January 1949. Its ownership then vested in the Government of India.",
      factIds: ["nationalisation-1949", "government-ownership"],
    },
  ],
  2: [
    {
      stem: "Before nationalisation, RBI was originally:",
      correct: "A privately owned shareholders' bank",
      options: ["A privately owned shareholders' bank", "A department of Parliament", "A State Government bank", "A cooperative bank"],
      explanation: "RBI began as a privately owned shareholders' institution. Nationalisation later transferred ownership to the Government of India.",
      factIds: ["government-ownership", "nationalisation-1949"],
    },
    {
      stem: "After nationalisation, ownership of RBI vested in:",
      correct: "Government of India",
      options: ["Government of India", "State Governments jointly", "Scheduled commercial banks", "Public shareholders"],
      explanation: "Nationalisation transferred RBI's ownership to the Government of India. It is therefore not owned by commercial banks or private shareholders.",
      factIds: ["government-ownership"],
    },
    {
      stem: "Which city became the permanent location of RBI's Central Office in 1937?",
      correct: "Mumbai",
      options: ["Mumbai", "Calcutta", "Delhi", "Chennai"],
      explanation: "RBI's Central Office was initially in Calcutta. It was permanently moved to Mumbai in 1937.",
      factIds: ["office-move-1937"],
    },
    {
      stem: "Which sequence is correct?",
      correct: "RBI Act 1934 → operations 1935 → Central Office move 1937 → nationalisation 1949",
      options: [
        "RBI Act 1934 → operations 1935 → Central Office move 1937 → nationalisation 1949",
        "Operations 1934 → RBI Act 1935 → nationalisation 1937 → office move 1949",
        "Nationalisation 1934 → operations 1935 → RBI Act 1937 → office move 1949",
        "RBI Act 1934 → nationalisation 1935 → operations 1937 → office move 1949",
      ],
      explanation: "The statutory and institutional sequence is 1934 Act, 1935 commencement, 1937 permanent move to Mumbai and 1949 nationalisation. Keeping these milestones separate avoids confusing establishment with nationalisation.",
      factIds: ["rbi-act", "operations-1935", "office-move-1937", "nationalisation-1949"],
    },
  ],
  3: [
    {
      stem: "Which institution has the statutory right to issue banknotes in India?",
      correct: "Reserve Bank of India",
      options: ["Reserve Bank of India", "SEBI", "NABARD", "State Bank of India"],
      explanation: "Section 22 of the RBI Act gives RBI the sole right to issue banknotes. The one-rupee currency note is a special Government of India issue.",
      factIds: ["banknote-issue", "one-rupee-note"],
    },
    {
      stem: "Who is responsible for minting coins in India?",
      correct: "Government of India",
      options: ["Government of India", "Reserve Bank of India", "Commercial banks", "SEBI"],
      explanation: "Coins are minted by the Government of India. RBI's role is mainly to put supplied coins into circulation and distribute them.",
      factIds: ["coin-minting", "coin-distribution"],
    },
    {
      stem: "What is RBI's main role regarding coins?",
      correct: "Distribution of coins supplied by Government of India",
      options: ["Distribution of coins supplied by Government of India", "Minting all coins", "Fixing metal prices", "Printing one-rupee notes"],
      explanation: "The Government of India mints coins, while RBI distributes the coins supplied to it. Minting and distribution are therefore different responsibilities.",
      factIds: ["coin-minting", "coin-distribution"],
    },
    {
      stem: "Which statement about the one-rupee currency note is correct?",
      correct: "It is a Government of India issue and carries the Finance Secretary's signature",
      options: [
        "It is a Government of India issue and carries the Finance Secretary's signature",
        "It is issued exactly like other RBI banknotes and carries the RBI Governor's signature",
        "It is minted by RBI as a coin",
        "It is issued by commercial banks",
      ],
      explanation: "The one-rupee currency note is a special Government of India issue. Unlike ordinary RBI banknotes, it carries the Finance Secretary's signature.",
      factIds: ["one-rupee-note", "banknote-issue"],
    },
  ],
  4: [
    {
      stem: "RBI acting as banker for the Central Government is known as its:",
      correct: "Banker to Government role",
      options: ["Banker to Government role", "Lender-of-last-resort role", "Foreign-exchange role", "Developmental role"],
      explanation: "RBI carries out banking transactions for the Central Government. This is its banker-to-government function.",
      factIds: ["banker-government"],
    },
    {
      stem: "RBI may act as banker to a State Government when:",
      correct: "An agreement exists with that State Government",
      options: ["An agreement exists with that State Government", "Every district bank requests it", "SEBI authorises it", "The State has no treasury"],
      explanation: "RBI may undertake State Government banking business by agreement. This differs from its statutory relationship with the Central Government.",
      factIds: ["banker-government"],
    },
    {
      stem: "Management of government borrowing and public debt is part of RBI's role as:",
      correct: "Government debt manager",
      options: ["Government debt manager", "Issuer of company shares", "Tax collector", "Stock exchange"],
      explanation: "RBI manages public-debt and government-security operations assigned to it under law. This is related to, but distinct from, ordinary government banking transactions.",
      factIds: ["debt-manager", "banker-government"],
    },
    {
      stem: "The Government plans an issue of government securities and needs the institution that manages the borrowing operation. Which RBI role applies?",
      correct: "Government debt manager",
      options: ["Government debt manager", "Banker to banks", "Payment-system regulator", "Foreign-exchange manager"],
      explanation: "Government securities are used for public borrowing, so the debt-management role applies. Banker-to-banks instead concerns banking accounts and inter-bank settlement.",
      factIds: ["debt-manager", "banker-banks"],
    },
  ],
  5: [
    {
      stem: "RBI maintains banking accounts used by banks for reserves and settlements. This is its role as:",
      correct: "Banker to banks",
      options: ["Banker to banks", "Banker to Government", "Foreign-exchange manager", "Currency printer"],
      explanation: "Banks maintain accounts with RBI for reserve and settlement purposes. This makes RBI the common banker to the banking system.",
      factIds: ["banker-banks"],
    },
    {
      stem: "Inter-bank obligations are settled through accounts maintained with RBI. Which function is being used?",
      correct: "Banker to banks",
      options: ["Banker to banks", "Government debt manager", "Developmental role", "Currency issue"],
      explanation: "Settlement between banks uses their accounts with RBI. That activity belongs to RBI's banker-to-banks function.",
      factIds: ["banker-banks"],
    },
    {
      stem: "Why do banks maintain accounts with RBI?",
      correct: "For reserve requirements and inter-bank settlement",
      options: ["For reserve requirements and inter-bank settlement", "Only to buy company shares", "Only to pay household taxes", "To mint coins"],
      explanation: "RBI accounts support required reserve balances and settlement of obligations between banks. They are part of the infrastructure of the banking system.",
      factIds: ["banker-banks"],
    },
    {
      stem: "Which pair correctly distinguishes two RBI banking roles?",
      correct: "Government accounts — banker to Government; inter-bank settlement — banker to banks",
      options: [
        "Government accounts — banker to Government; inter-bank settlement — banker to banks",
        "Government accounts — banker to banks; inter-bank settlement — debt manager",
        "Government accounts — payment regulator; inter-bank settlement — forex manager",
        "Government accounts — currency issuer; inter-bank settlement — developmental role",
      ],
      explanation: "Government banking transactions belong to the banker-to-government role. Accounts and settlement between banks belong to the banker-to-banks role.",
      factIds: ["banker-government", "banker-banks"],
    },
  ],
  6: [
    {
      stem: "A solvent bank faces temporary liquidity stress and cannot obtain funds elsewhere. RBI assistance in this case is called:",
      correct: "Lender of last resort",
      options: ["Lender of last resort", "Government debt management", "Currency minting", "Foreign-exchange management"],
      explanation: "The lender-of-last-resort function provides emergency liquidity when an otherwise viable bank faces temporary funding stress. It is part of RBI's banker-to-banks role.",
      factIds: ["lender-last-resort", "banker-banks"],
    },
    {
      stem: "The lender-of-last-resort function mainly helps prevent:",
      correct: "A temporary liquidity problem from causing wider financial instability",
      options: ["A temporary liquidity problem from causing wider financial instability", "All business losses in the economy", "Every fall in share prices", "All government borrowing"],
      explanation: "Temporary bank liquidity stress can threaten depositors and spread to other institutions. Emergency central-bank liquidity can reduce that financial-stability risk.",
      factIds: ["lender-last-resort"],
    },
    {
      stem: "Which situation best fits lender-of-last-resort support?",
      correct: "A solvent bank needs temporary liquidity when normal funding is unavailable",
      options: ["A solvent bank needs temporary liquidity when normal funding is unavailable", "A company wants equity capital", "A State Government wants tax revenue", "A household wants a home loan"],
      explanation: "The key conditions are banking-sector liquidity stress and the absence of normal funding. The function is not a general financing facility for firms, governments or households.",
      factIds: ["lender-last-resort"],
    },
    {
      stem: "Which statement is most accurate about RBI as lender of last resort?",
      correct: "It is an emergency liquidity role, not an automatic guarantee against every bank loss",
      options: ["It is an emergency liquidity role, not an automatic guarantee against every bank loss", "It guarantees profits to every bank", "It applies only to Government borrowing", "It means RBI mints coins for banks"],
      explanation: "Lender-of-last-resort support addresses liquidity stress in the banking system. It should not be confused with an unlimited guarantee that removes all bank losses or insolvency risk.",
      factIds: ["lender-last-resort", "banker-banks"],
    },
  ],
  7: [
    {
      stem: "Prescribing and supervising broad banking-system rules is part of RBI's role as:",
      correct: "Regulator and supervisor of the financial system",
      options: ["Regulator and supervisor of the financial system", "Government tax authority", "Stock exchange", "Coin mint"],
      explanation: "RBI regulates and supervises banking and financial activities within its legal remit. The aim includes confidence in the system and protection of depositors' interests.",
      factIds: ["financial-regulator"],
    },
    {
      stem: "Which RBI role is most directly concerned with safe banking operations and depositor confidence?",
      correct: "Regulation and supervision",
      options: ["Regulation and supervision", "Government debt issue only", "Currency printing only", "Foreign trade promotion only"],
      explanation: "Regulation and supervision set and enforce broad banking standards. This supports sound banking operations and public confidence.",
      factIds: ["financial-regulator"],
    },
    {
      stem: "RBI examines whether banks operate within prescribed banking parameters. This is an example of:",
      correct: "Supervision of the financial system",
      options: ["Supervision of the financial system", "Barter regulation", "Coin minting", "Government budgeting"],
      explanation: "Checking compliance with banking rules is a supervisory function. It is different from RBI's currency or government-banking roles.",
      factIds: ["financial-regulator"],
    },
    {
      stem: "Which distinction is correct?",
      correct: "Bank supervision concerns regulated institutions; lender of last resort concerns emergency liquidity stress",
      options: [
        "Bank supervision concerns regulated institutions; lender of last resort concerns emergency liquidity stress",
        "Bank supervision means minting coins; lender of last resort means issuing Government debt",
        "Both terms mean exactly the same function",
        "Bank supervision is done only during a liquidity crisis",
      ],
      explanation: "Supervision is an ongoing oversight function over regulated institutions. Lender-of-last-resort support is a specific emergency liquidity function.",
      factIds: ["financial-regulator", "lender-last-resort"],
    },
  ],
  8: [
    {
      stem: "Management of the FEMA, 1999 framework is part of RBI's role as:",
      correct: "Manager of foreign exchange",
      options: ["Manager of foreign exchange", "Banker to banks", "Coin mint", "Tax authority"],
      explanation: "RBI manages the foreign-exchange framework under FEMA, 1999. The role supports orderly development and maintenance of India's foreign-exchange market.",
      factIds: ["forex-manager"],
    },
    {
      stem: "Under the Payment and Settlement Systems Act, 2007, which institution is the designated payment-system authority?",
      correct: "Reserve Bank of India",
      options: ["Reserve Bank of India", "SEBI", "NITI Aayog", "Finance Commission"],
      explanation: "The PSS Act designates RBI as the authority for regulation and supervision of payment systems in India. This is separate from its monetary-policy function.",
      factIds: ["payment-regulator"],
    },
    {
      stem: "Promotional functions that support wider national financial objectives form RBI's:",
      correct: "Developmental role",
      options: ["Developmental role", "Lender-of-last-resort role", "Debt-management role", "Currency-destruction role"],
      explanation: "RBI also performs developmental and promotional functions in support of broader financial objectives. This role goes beyond day-to-day banking transactions.",
      factIds: ["developmental-role"],
    },
    {
      stem: "A question concerns authorisation and supervision of payment-system operators, not foreign-currency transactions. Which RBI role applies?",
      correct: "Payment-system regulator and supervisor",
      options: ["Payment-system regulator and supervisor", "Foreign-exchange manager", "Banker to Government", "Government debt manager"],
      explanation: "Payment-system authorisation and oversight fall under RBI's payment-system role. Foreign-exchange management instead concerns the FEMA framework and forex market.",
      factIds: ["payment-regulator", "forex-manager"],
    },
  ],
  9: [
    {
      stem: "RBI's role in formulating, implementing and monitoring monetary policy is its role as:",
      correct: "Monetary authority",
      options: ["Monetary authority", "Coin mint", "Tax authority", "Stock exchange"],
      explanation: "RBI is India's monetary authority. It formulates, implements and monitors monetary policy, while specific instruments belong to the Monetary Policy CP.",
      factIds: ["monetary-authority", "central-bank"],
    },
    {
      stem: "Which statement best describes RBI's institutional position?",
      correct: "It is India's central bank and apex monetary authority",
      options: ["It is India's central bank and apex monetary authority", "It is a commercial bank for households", "It is a stock exchange", "It is a tax tribunal"],
      explanation: "RBI occupies the central-bank role in India's monetary and banking system. It is not a retail commercial bank or securities exchange.",
      factIds: ["central-bank", "monetary-authority"],
    },
    {
      stem: "A question asks who is responsible for India's monetary-policy function but gives no current policy rate. The answer is:",
      correct: "Reserve Bank of India",
      options: ["Reserve Bank of India", "SEBI", "NABARD alone", "Commercial banks collectively"],
      explanation: "RBI is the monetary authority responsible for the monetary-policy function. Current rates can change, but the institutional responsibility is a stable fact.",
      factIds: ["monetary-authority"],
    },
  ],
  10: [
    {
      stem: "Which pair is correctly matched?",
      correct: "Banker to banks — inter-bank settlement",
      options: ["Banker to banks — inter-bank settlement", "Foreign-exchange manager — coin minting", "Debt manager — household lending", "Payment regulator — tax collection"],
      explanation: "RBI's banker-to-banks role includes settlement of obligations between banks. The other pairs mix unrelated institutional functions.",
      factIds: ["banker-banks"],
    },
    {
      stem: "Which pair is correctly matched?",
      correct: "Manager of foreign exchange — FEMA, 1999",
      options: ["Manager of foreign exchange — FEMA, 1999", "Currency issuer — company shares", "Banker to Government — household deposits", "Lender of last resort — coin design"],
      explanation: "RBI's foreign-exchange role operates under the FEMA framework. The other pairs connect RBI functions with unrelated activities.",
      factIds: ["forex-manager"],
    },
    {
      stem: "Which pair is correctly matched?",
      correct: "Payment-system regulator — authorisation and supervision of payment systems",
      options: ["Payment-system regulator — authorisation and supervision of payment systems", "Banker to banks — minting coins", "Debt manager — setting company dividends", "Developmental role — issuing one-rupee notes"],
      explanation: "RBI regulates and supervises payment systems under the PSS framework. That role should not be confused with currency, banking-account or debt-management functions.",
      factIds: ["payment-regulator", "coin-minting", "debt-manager"],
    },
  ],
  11: [
    {
      stem: "Consider the statements:\nI. RBI issues banknotes in India.\nII. Government of India is responsible for minting coins.\nWhich is correct?",
      correct: "Both I and II",
      options: ["I only", "II only", "Both I and II", "Neither I nor II"],
      explanation: "Statement I is correct because RBI has the statutory banknote-issue role. Statement II is also correct because coins are minted by Government of India and distributed through RBI arrangements.",
      factIds: ["banknote-issue", "coin-minting", "coin-distribution"],
    },
    {
      stem: "Consider the statements:\nI. RBI's lender-of-last-resort role can address temporary liquidity stress in a solvent bank.\nII. It guarantees that no bank can ever suffer losses.\nWhich is correct?",
      correct: "I only",
      options: ["I only", "II only", "Both I and II", "Neither I nor II"],
      explanation: "Statement I is correct because emergency liquidity is the core lender-of-last-resort idea. Statement II is false because the role is not an unlimited guarantee against every loss or insolvency problem.",
      factIds: ["lender-last-resort"],
    },
    {
      stem: "Consider the statements:\nI. RBI manages the foreign-exchange framework under FEMA, 1999.\nII. RBI is the designated authority for payment-system regulation under the PSS Act.\nWhich is correct?",
      correct: "Both I and II",
      options: ["I only", "II only", "Both I and II", "Neither I nor II"],
      explanation: "Statement I describes RBI's foreign-exchange-management role. Statement II describes its separate statutory payment-system regulation and supervision role.",
      factIds: ["forex-manager", "payment-regulator"],
    },
  ],
  12: [
    {
      stem: "Which statement best distinguishes the one-rupee note from ordinary RBI banknotes?",
      correct: "The one-rupee note is a Government of India issue, while ordinary banknotes are issued by RBI",
      options: ["The one-rupee note is a Government of India issue, while ordinary banknotes are issued by RBI", "All notes are minted as coins by RBI", "The one-rupee note is issued by commercial banks", "Ordinary banknotes are issued by State Governments"],
      explanation: "The one-rupee currency note is the special Government of India issue. Ordinary banknotes fall under RBI's statutory banknote-issue role.",
      factIds: ["one-rupee-note", "banknote-issue"],
    },
    {
      stem: "Which statement best distinguishes banker to Government from banker to banks?",
      correct: "Government banking transactions belong to the first role; bank accounts and inter-bank settlement belong to the second",
      options: ["Government banking transactions belong to the first role; bank accounts and inter-bank settlement belong to the second", "Both roles mean only currency printing", "The first regulates payments and the second manages FEMA", "There is no functional difference"],
      explanation: "Banker to Government concerns Government banking business and related services. Banker to banks concerns bank accounts, reserves and settlement between banking institutions.",
      factIds: ["banker-government", "banker-banks"],
    },
    {
      stem: "Which statement correctly separates payment-system regulation from monetary policy?",
      correct: "Payment regulation oversees payment systems; monetary policy manages monetary conditions",
      options: ["Payment regulation oversees payment systems; monetary policy manages monetary conditions", "Both mean minting coins", "Payment regulation deals only with Government debt", "Monetary policy means maintaining bank current accounts only"],
      explanation: "Payment-system regulation focuses on safe and authorised payment infrastructure. Monetary policy is the separate central-bank function concerned with monetary conditions in the economy.",
      factIds: ["payment-regulator", "monetary-authority"],
    },
  ],
};

export function generateEcoCp008ReviewBatchV1(): EcoCp008ReviewQuestion[] {
  const questions: EcoCp008ReviewQuestion[] = [];
  let globalIndex = 0;
  for (let ql = 1; ql <= 12; ql += 1) {
    for (let row = 0; row < qlCases[ql].length; row += 1) {
      const item = qlCases[ql][row];
      const target = globalIndex % 4;
      const options = moveCorrect([...item.options], item.correct, target);
      questions.push({
        questionId: `ECO-CP008-V1-${String(globalIndex + 1).padStart(3, "0")}`,
        chapterId: "ECO-001",
        cpId: "ECO-CP-008",
        qlId: `ECO-008-QL-${String(ql).padStart(3, "0")}`,
        qlName: qlNames[ql],
        difficulty: difficultyForVariant(ql, row),
        stem: item.stem,
        options,
        correctIndex: target,
        canonicalAnswer: item.correct,
        explanation: item.explanation,
        ...sourceBundle(item.factIds),
        reviewOnly: true,
        runtimeRegistered: false,
      });
      globalIndex += 1;
    }
  }
  return questions;
}
