import type { KnowledgeV1Difficulty } from "../../types";
import { ecoCp019Fact } from "./eco-cp019-facts";
import type { EcoCp019ReviewQuestion } from "./eco-cp019-review-types";

const qlNames: Record<number, string> = {
  1: "Money market and capital market",
  2: "Primary and secondary market",
  3: "Equity and debt securities",
  4: "SEBI and stock exchanges",
  5: "Demat, depositories and Depository Participants",
  6: "Mutual funds and NAV",
  7: "Government securities and Treasury Bills",
  8: "Commercial Paper, Certificate of Deposit and call money",
  9: "Repo-market basics",
  10: "IPO and public-issue basics",
  11: "Risk, liquidity and diversification",
  12: "Mixed financial-market distinctions",
};

function difficultyForVariant(ql: number, row: number): KnowledgeV1Difficulty {
  if ([5, 9, 10, 11].includes(ql)) return row === 0 ? "Easy" : row === 1 ? "Medium" : "Hard";
  if (ql === 12) return row < 2 ? "Medium" : "Hard";
  return row === 0 ? "Easy" : row < 3 ? "Medium" : "Hard";
}

function sourceBundle(ids: string[]) {
  const facts = ids.map(ecoCp019Fact);
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
      stem: "Which market mainly deals in short-term funds and instruments?",
      correct: "Money market",
      options: ["Money market", "Capital market", "Commodity spot market", "Real-estate market"],
      explanation: "The money market mainly deals in short-term funds and instruments.",
      factIds: ["money-vs-capital"],
    },
    {
      stem: "Which market is mainly used for raising medium- and long-term funds through shares and bonds?",
      correct: "Capital market",
      options: ["Capital market", "Call-money market", "Foreign-exchange spot market", "Commodity market"],
      explanation: "The capital market channels medium- and long-term funds through securities such as shares and bonds.",
      factIds: ["money-vs-capital"],
    },
    {
      stem: "Which pair is correctly matched?",
      correct: "Treasury Bill—money market; Equity share—capital market",
      options: ["Treasury Bill—money market; Equity share—capital market", "Equity share—money market; Treasury Bill—capital market", "Commercial Paper—capital market; Equity share—call market", "Certificate of Deposit—capital market; Bond—call market"],
      explanation: "Treasury Bills are short-term money-market instruments, while equity shares belong to the capital market.",
      factIds: ["money-vs-capital", "tbill", "equity-share"],
    },
    {
      stem: "A company needs long-term ownership capital, while a bank needs overnight liquidity. Which markets fit these needs?",
      correct: "Capital market for the company; money market for the bank",
      options: ["Capital market for the company; money market for the bank", "Money market for both", "Capital market for both", "Money market for the company; capital market for the bank"],
      explanation: "Long-term ownership funds come from the capital market. Overnight liquidity belongs to the money market.",
      factIds: ["money-vs-capital", "call-money"],
    },
  ],
  2: [
    {
      stem: "Where are new securities first issued to investors?",
      correct: "Primary market",
      options: ["Primary market", "Secondary market", "Call-money market", "Repo market"],
      explanation: "New securities are issued by the issuer in the primary market.",
      factIds: ["primary-market"],
    },
    {
      stem: "Where do investors normally trade already-issued listed shares with one another?",
      correct: "Secondary market",
      options: ["Secondary market", "Primary market", "Money-creation market", "Treasury account"],
      explanation: "The secondary market allows investors to buy and sell existing securities from one another.",
      factIds: ["secondary-market"],
    },
    {
      stem: "Which transaction directly raises fresh funds for the issuing company?",
      correct: "Issue of new shares in the primary market",
      options: ["Issue of new shares in the primary market", "Sale of an existing share by one investor to another", "Transfer of shares between two demat accounts", "Purchase of an old listed bond from another investor"],
      explanation: "Fresh funds reach the issuer when new securities are sold in the primary market.",
      factIds: ["primary-market", "secondary-market"],
    },
    {
      stem: "Which statement correctly distinguishes the primary and secondary markets?",
      correct: "The primary market raises new funds for issuers, while the secondary market provides trading in existing securities",
      options: ["The primary market raises new funds for issuers, while the secondary market provides trading in existing securities", "Both markets only trade existing securities", "The secondary market alone creates new company shares", "The primary market is only for government taxes"],
      explanation: "The primary market is for new issues. The secondary market provides liquidity and trading after issue.",
      factIds: ["primary-market", "secondary-market"],
    },
  ],
  3: [
    {
      stem: "What does an equity share represent?",
      correct: "Ownership in a company",
      options: ["Ownership in a company", "A fixed bank deposit", "A government tax claim", "A short-term interbank loan"],
      explanation: "An equity share represents an ownership interest in the issuing company.",
      factIds: ["equity-share"],
    },
    {
      stem: "What does a bond or similar debt security mainly represent?",
      correct: "Borrowing by the issuer",
      options: ["Borrowing by the issuer", "Ownership without repayment obligation", "A tax payment", "A depository account"],
      explanation: "A debt security represents funds borrowed by the issuer with a repayment obligation.",
      factIds: ["debt-security"],
    },
    {
      stem: "Which statement correctly compares equity and debt securities?",
      correct: "Equity represents ownership, while debt represents a repayment obligation",
      options: ["Equity represents ownership, while debt represents a repayment obligation", "Both always provide fixed returns", "Debt gives ownership voting rights by definition", "Equity must be repaid at a fixed maturity"],
      explanation: "Equity is ownership capital. Debt creates a contractual claim for repayment.",
      factIds: ["equity-share", "debt-security"],
    },
    {
      stem: "An investor wants ownership participation rather than a creditor claim. Which instrument best fits that objective?",
      correct: "Equity share",
      options: ["Equity share", "Treasury Bill", "Certificate of Deposit", "Commercial Paper"],
      explanation: "Equity gives an ownership interest. The other options are debt or money-market instruments.",
      factIds: ["equity-share", "tbill", "certificate-deposit", "commercial-paper"],
    },
  ],
  4: [
    {
      stem: "Which body regulates India's securities market?",
      correct: "SEBI",
      options: ["SEBI", "NABARD", "FCI", "CACP"],
      explanation: "SEBI regulates the securities market and protects investor interests.",
      factIds: ["sebi-role"],
    },
    {
      stem: "In which year did SEBI become a statutory body?",
      correct: "1992",
      options: ["1988", "1991", "1992", "2000"],
      explanation: "SEBI became a statutory body under the SEBI Act, 1992.",
      factIds: ["sebi-status"],
    },
    {
      stem: "Which is a core function of SEBI?",
      correct: "Protecting investors and regulating the securities market",
      options: ["Protecting investors and regulating the securities market", "Issuing currency notes", "Fixing agricultural MSP", "Managing foodgrain procurement"],
      explanation: "SEBI protects investors and regulates and develops the securities market.",
      factIds: ["sebi-role"],
    },
    {
      stem: "Which statement correctly distinguishes SEBI from a stock exchange?",
      correct: "SEBI is the market regulator, while a stock exchange provides a platform for trading securities",
      options: ["SEBI is the market regulator, while a stock exchange provides a platform for trading securities", "A stock exchange regulates SEBI", "SEBI is only a depository, while exchanges issue currency", "Both perform exactly the same function"],
      explanation: "SEBI is the regulator. Stock exchanges provide organised markets where securities are traded.",
      factIds: ["sebi-role", "secondary-market"],
    },
  ],
  5: [
    {
      stem: "What is the main purpose of a demat account?",
      correct: "Holding securities in electronic form",
      options: ["Holding securities in electronic form", "Borrowing overnight funds", "Fixing stock prices", "Issuing company shares"],
      explanation: "A demat account holds securities electronically.",
      factIds: ["demat-account"],
    },
    {
      stem: "What is a Depository Participant?",
      correct: "An agent through which investors access depository services",
      options: ["An agent through which investors access depository services", "A company that fixes bond yields", "A government department issuing T-bills", "A mutual-fund scheme"],
      explanation: "A Depository Participant acts as an intermediary between investors and a depository.",
      factIds: ["demat-account"],
    },
    {
      stem: "Which statement correctly distinguishes a demat account from a trading account?",
      correct: "A demat account holds securities, while a trading account is used to place buy and sell orders",
      options: ["A demat account holds securities, while a trading account is used to place buy and sell orders", "Both accounts only hold cash", "A trading account is a government security", "A demat account is used only for bank deposits"],
      explanation: "The demat account stores securities electronically. The trading account is used for market transactions.",
      factIds: ["demat-account", "depositories"],
    },
  ],
  6: [
    {
      stem: "What does a mutual fund do?",
      correct: "Pools money from investors and invests it in securities",
      options: ["Pools money from investors and invests it in securities", "Issues currency to investors", "Fixes government bond yields", "Provides crop insurance"],
      explanation: "A mutual fund pools investor money and invests it according to the scheme objective.",
      factIds: ["mutual-fund"],
    },
    {
      stem: "What does NAV represent in a mutual fund?",
      correct: "The per-unit value of the scheme",
      options: ["The per-unit value of the scheme", "The stock exchange index level", "The repo rate", "The face value of every bond"],
      explanation: "NAV is the per-unit value of a mutual-fund scheme after accounting for assets and liabilities.",
      factIds: ["nav"],
    },
    {
      stem: "Why can a mutual fund help an investor diversify?",
      correct: "It can spread money across several securities or asset classes",
      options: ["It can spread money across several securities or asset classes", "It guarantees that no investment can lose value", "It fixes all market prices", "It removes every type of risk"],
      explanation: "Mutual funds can spread investments across many holdings. This reduces concentration in a single security.",
      factIds: ["mutual-fund", "diversification"],
    },
    {
      stem: "Which statement correctly distinguishes NAV from market return?",
      correct: "NAV is the per-unit value of a fund, while return measures the change in investment value over time",
      options: ["NAV is the per-unit value of a fund, while return measures the change in investment value over time", "NAV and return always mean the same percentage", "NAV is fixed permanently at issue", "Return is the number of units held"],
      explanation: "NAV is a valuation per unit. Return measures gain or loss over a period.",
      factIds: ["nav", "mutual-fund"],
    },
  ],
  7: [
    {
      stem: "Who issues Treasury Bills in India?",
      correct: "Government of India",
      options: ["Government of India", "Private companies", "Mutual funds", "Stock exchanges"],
      explanation: "Treasury Bills are short-term debt instruments issued by the Government of India.",
      factIds: ["tbill"],
    },
    {
      stem: "How do Treasury Bills normally provide a return to investors?",
      correct: "They are issued at a discount and redeemed at face value",
      options: ["They are issued at a discount and redeemed at face value", "They pay equity dividends", "They provide voting rights", "They are redeemed below their issue price by design"],
      explanation: "T-bills are zero-coupon securities. The return comes from the difference between issue price and face value.",
      factIds: ["tbill"],
    },
    {
      stem: "Which statement correctly distinguishes a Treasury Bill from a dated Government security?",
      correct: "A Treasury Bill is short-term and zero-coupon, while a dated G-Sec has a longer maturity",
      options: ["A Treasury Bill is short-term and zero-coupon, while a dated G-Sec has a longer maturity", "Both are equity shares", "Dated G-Secs are issued only by private firms", "Treasury Bills give company ownership"],
      explanation: "T-bills are short-term zero-coupon Government instruments. Dated G-Secs are longer-term Government debt securities.",
      factIds: ["tbill", "gsec"],
    },
    {
      stem: "A Government security has very low default risk but its price may fall before maturity. Which risk remains relevant?",
      correct: "Market risk",
      options: ["Market risk", "Ownership dilution risk", "Crop-yield risk", "Industrial-licensing risk"],
      explanation: "Government securities can still face price changes before maturity even when default risk is very low.",
      factIds: ["gsec"],
    },
  ],
  8: [
    {
      stem: "Which money-market instrument is an unsecured short-term borrowing instrument for eligible issuers?",
      correct: "Commercial Paper",
      options: ["Commercial Paper", "Equity share", "Dated Government security", "Preference share"],
      explanation: "Commercial Paper is an unsecured money-market borrowing instrument.",
      factIds: ["commercial-paper"],
    },
    {
      stem: "Which instrument is a negotiable money-market instrument issued by eligible banks and financial institutions?",
      correct: "Certificate of Deposit",
      options: ["Certificate of Deposit", "Equity share", "Treasury stock", "Mutual-fund unit"],
      explanation: "A Certificate of Deposit is a negotiable money-market instrument issued by eligible institutions.",
      factIds: ["certificate-deposit"],
    },
    {
      stem: "Which market is mainly used for very short-term unsecured liquidity between eligible financial participants?",
      correct: "Call-money market",
      options: ["Call-money market", "Equity market", "Primary share market", "Commodity futures market"],
      explanation: "Call money is a very-short-term unsecured segment of the money market.",
      factIds: ["call-money"],
    },
    {
      stem: "Which comparison is correct?",
      correct: "Commercial Paper is unsecured corporate short-term borrowing, while a Certificate of Deposit is issued by eligible banks or financial institutions",
      options: ["Commercial Paper is unsecured corporate short-term borrowing, while a Certificate of Deposit is issued by eligible banks or financial institutions", "Commercial Paper gives company ownership, while a Certificate of Deposit gives voting rights", "Both are long-term equity instruments", "Certificates of Deposit are issued only by stock exchanges"],
      explanation: "CP is an unsecured short-term borrowing instrument. CDs are negotiable money-market instruments issued by eligible deposit-taking institutions.",
      factIds: ["commercial-paper", "certificate-deposit"],
    },
  ],
  9: [
    {
      stem: "What is the basic feature of a repo transaction?",
      correct: "Sale of securities with an agreement to repurchase them later",
      options: ["Sale of securities with an agreement to repurchase them later", "Issue of new equity shares", "Purchase of a mutual-fund unit", "Permanent sale of a company"],
      explanation: "A repo is a sale of securities combined with an agreement to repurchase them later.",
      factIds: ["repo-market"],
    },
    {
      stem: "Why is a repo considered secured funding?",
      correct: "Securities support the borrowing transaction",
      options: ["Securities support the borrowing transaction", "The borrower issues equity ownership", "No asset is involved", "The transaction is a tax payment"],
      explanation: "Repo funding is secured because eligible securities back the transaction.",
      factIds: ["repo-market"],
    },
    {
      stem: "Which statement correctly distinguishes repo from call money?",
      correct: "Repo is secured by securities, while call money is unsecured",
      options: ["Repo is secured by securities, while call money is unsecured", "Call money is secured by equity shares, while repo is always unsecured", "Both are long-term capital-market instruments", "Repo creates company ownership, while call money creates voting rights"],
      explanation: "Repo uses securities as collateral support. Call money is an unsecured short-term market.",
      factIds: ["repo-market", "call-money"],
    },
  ],
  10: [
    {
      stem: "What is an Initial Public Offer?",
      correct: "A company's first public issue of shares",
      options: ["A company's first public issue of shares", "Trading of old shares between investors", "An overnight bank loan", "A Treasury Bill auction"],
      explanation: "An IPO is the first public issue of a company's shares in the primary market.",
      factIds: ["ipo", "primary-market"],
    },
    {
      stem: "In which market does an IPO take place?",
      correct: "Primary market",
      options: ["Primary market", "Secondary market", "Call-money market", "Repo market"],
      explanation: "An IPO is a new issue, so it belongs to the primary market.",
      factIds: ["ipo", "primary-market"],
    },
    {
      stem: "A company raises money through an IPO, and its shares later trade on an exchange. Which sequence is correct?",
      correct: "Primary market first, secondary market later",
      options: ["Primary market first, secondary market later", "Secondary market first, primary market later", "Money market first, repo market later", "Call market first, primary market later"],
      explanation: "The IPO raises funds in the primary market. Later trading takes place in the secondary market.",
      factIds: ["ipo", "primary-market", "secondary-market"],
    },
  ],
  11: [
    {
      stem: "What is diversification meant to reduce?",
      correct: "Concentration of investment risk",
      options: ["Concentration of investment risk", "All possible market losses", "Every change in interest rates", "All issuer defaults by guarantee"],
      explanation: "Diversification spreads exposure so that one investment does not dominate the portfolio's risk.",
      factIds: ["diversification"],
    },
    {
      stem: "Which asset is generally more liquid: a frequently traded listed share or an illiquid unlisted asset?",
      correct: "The frequently traded listed share",
      options: ["The frequently traded listed share", "The illiquid unlisted asset", "Both must always be equally liquid", "Liquidity cannot differ across assets"],
      explanation: "Liquidity refers to how easily an asset can be bought or sold without major difficulty or price impact.",
      factIds: ["secondary-market"],
    },
    {
      stem: "Why does diversification not eliminate all investment risk?",
      correct: "Market-wide risks can affect many investments at the same time",
      options: ["Market-wide risks can affect many investments at the same time", "Diversification guarantees a fixed return", "All securities always move independently", "Diversification removes every price change"],
      explanation: "Diversification reduces concentration risk, but broad market risks can still affect many holdings together.",
      factIds: ["diversification"],
    },
  ],
  12: [
    {
      stem: "Which pair is correctly matched?",
      correct: "Demat account—electronic holding; Trading account—buy and sell orders",
      options: ["Demat account—electronic holding; Trading account—buy and sell orders", "Demat account—overnight lending; Trading account—Government borrowing", "Demat account—MSP payment; Trading account—crop insurance", "Demat account—currency issue; Trading account—bank regulation"],
      explanation: "A demat account holds securities electronically. A trading account is used for market transactions.",
      factIds: ["demat-account"],
    },
    {
      stem: "Which pair is correctly matched?",
      correct: "Treasury Bill—Government short-term debt; Commercial Paper—unsecured short-term borrowing",
      options: ["Treasury Bill—Government short-term debt; Commercial Paper—unsecured short-term borrowing", "Treasury Bill—company ownership; Commercial Paper—equity voting right", "Treasury Bill—mutual fund unit; Commercial Paper—demat account", "Treasury Bill—bank deposit; Commercial Paper—stock exchange"],
      explanation: "T-bills are short-term Government debt. Commercial Paper is unsecured short-term borrowing by eligible issuers.",
      factIds: ["tbill", "commercial-paper"],
    },
    {
      stem: "Consider the statements. I. New securities are sold in the primary market. II. Existing securities are traded in the secondary market. Which option is correct?",
      correct: "Both I and II",
      options: ["I only", "II only", "Both I and II", "Neither I nor II"],
      explanation: "Both statements are correct. The primary market handles new issues, while the secondary market handles later trading.",
      factIds: ["primary-market", "secondary-market"],
    },
    {
      stem: "Which combination correctly matches the instrument with its main market feature?",
      correct: "Equity—ownership; T-bill—short-term Government debt; CP—unsecured short-term borrowing; repo—secured short-term funding",
      options: ["Equity—ownership; T-bill—short-term Government debt; CP—unsecured short-term borrowing; repo—secured short-term funding", "Equity—Government debt; T-bill—company ownership; CP—secured long-term bond; repo—mutual fund", "Equity—bank deposit; T-bill—equity share; CP—government tax; repo—depository", "Equity—call loan; T-bill—mutual fund unit; CP—stock index; repo—IPO"],
      explanation: "The four instruments serve different roles: ownership, Government short-term debt, unsecured borrowing and secured funding.",
      factIds: ["equity-share", "tbill", "commercial-paper", "repo-market"],
    },
  ],
};

export const ECO_CP019_REVIEW_V1: EcoCp019ReviewQuestion[] = Object.entries(qlCases).flatMap(([qlKey, cases]) => {
  const ql = Number(qlKey);
  return cases.map((row, index) => {
    const correctIndex = row.options.indexOf(row.correct);
    if (correctIndex < 0) throw new Error(`Correct answer missing from ECO-CP-019 QL ${ql}`);
    const sources = sourceBundle(row.factIds);
    return {
      questionId: `ECO-CP-019-QL${String(ql).padStart(2, "0")}-Q${String(index + 1).padStart(2, "0")}`,
      chapterId: "ECO-001" as const,
      cpId: "ECO-CP-019" as const,
      qlId: `ECO-CP-019-QL${String(ql).padStart(2, "0")}`,
      qlName: qlNames[ql],
      difficulty: difficultyForVariant(ql, index),
      stem: row.stem,
      options: row.options,
      correctIndex,
      canonicalAnswer: row.correct,
      explanation: row.explanation,
      sourceIds: sources.sourceIds,
      sourceFactIds: sources.sourceFactIds,
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    };
  });
});
