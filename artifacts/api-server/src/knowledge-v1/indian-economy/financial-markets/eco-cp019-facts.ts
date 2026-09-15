export type EcoCp019Fact = {
  id: string;
  label: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
};

export const ECO_CP019_FACTS_V1: EcoCp019Fact[] = [
  {
    id: "money-vs-capital",
    label: "Money market and capital market",
    explanation: "The money market deals mainly in short-term funds and instruments, while the capital market deals mainly in medium- and long-term securities such as shares and bonds.",
    sourceIds: ["RBI-MONEY-MARKET-DIRECTIONS", "SEBI-SECURITIES-MARKET"],
    sourceFactIds: ["short-term-money-market", "capital-market-securities"],
  },
  {
    id: "primary-market",
    label: "Primary market",
    explanation: "In the primary market, new securities are issued by the issuer to investors to raise funds.",
    sourceIds: ["SEBI-SECURITIES-MARKET"],
    sourceFactIds: ["new-issue-market"],
  },
  {
    id: "secondary-market",
    label: "Secondary market",
    explanation: "In the secondary market, investors trade already-issued securities with one another rather than buying them directly from the issuer.",
    sourceIds: ["SEBI-SECURITIES-MARKET"],
    sourceFactIds: ["investor-to-investor-trading"],
  },
  {
    id: "equity-share",
    label: "Equity share",
    explanation: "An equity share represents ownership interest in a company and does not promise a fixed repayment like a debt instrument.",
    sourceIds: ["SEBI-SECURITIES-MARKET"],
    sourceFactIds: ["share-ownership"],
  },
  {
    id: "debt-security",
    label: "Debt security",
    explanation: "A debt security represents borrowing by the issuer and creates a contractual repayment obligation.",
    sourceIds: ["SEBI-SECURITIES-MARKET", "RBI-GSEC-FAQ"],
    sourceFactIds: ["bond-debt", "government-debt-security"],
  },
  {
    id: "sebi-role",
    label: "SEBI role",
    explanation: "SEBI protects investors, promotes development of the securities market and regulates the securities market.",
    sourceIds: ["SEBI-ABOUT"],
    sourceFactIds: ["investor-protection", "market-development", "market-regulation"],
  },
  {
    id: "sebi-status",
    label: "SEBI establishment",
    explanation: "SEBI was constituted as a non-statutory body in 1988 and became a statutory body under the SEBI Act, 1992.",
    sourceIds: ["SEBI-ABOUT"],
    sourceFactIds: ["sebi-1988", "sebi-statutory-1992"],
  },
  {
    id: "demat-account",
    label: "Demat account",
    explanation: "A demat account holds securities in electronic form through a Depository Participant linked to a recognised depository.",
    sourceIds: ["SEBI-TRADING-ACCOUNTS"],
    sourceFactIds: ["demat-electronic-holding", "dp-agent-of-depository"],
  },
  {
    id: "depositories",
    label: "NSDL and CDSL",
    explanation: "NSDL and CDSL are the two depositories named by SEBI Investor for holding securities in electronic form through Depository Participants.",
    sourceIds: ["SEBI-TRADING-ACCOUNTS"],
    sourceFactIds: ["nsdl-cdsl"],
  },
  {
    id: "mutual-fund",
    label: "Mutual fund",
    explanation: "A mutual fund pools money from many investors and invests it in securities according to the scheme objective through professional fund management.",
    sourceIds: ["SEBI-MUTUAL-FUNDS"],
    sourceFactIds: ["pooling", "professional-management"],
  },
  {
    id: "nav",
    label: "Net Asset Value",
    explanation: "NAV represents the per-unit value of a mutual-fund scheme after accounting for the value of portfolio assets and liabilities.",
    sourceIds: ["SEBI-NAV"],
    sourceFactIds: ["nav-per-unit"],
  },
  {
    id: "gsec",
    label: "Government securities",
    explanation: "Government securities are debt instruments issued by the Central or State Governments; in domestic currency they carry very low default risk, though market prices can change before maturity.",
    sourceIds: ["RBI-GSEC-FAQ", "RBI-RETAIL-DIRECT-FAQ"],
    sourceFactIds: ["government-debt", "market-risk-before-maturity"],
  },
  {
    id: "tbill",
    label: "Treasury Bills",
    explanation: "Treasury Bills are short-term Government of India money-market instruments issued at a discount and redeemed at face value without coupon interest.",
    sourceIds: ["RBI-GSEC-FAQ"],
    sourceFactIds: ["tbill-short-term", "zero-coupon", "discount-face-value"],
  },
  {
    id: "commercial-paper",
    label: "Commercial Paper",
    explanation: "Commercial Paper is an unsecured money-market instrument used for short-term borrowing by eligible issuers.",
    sourceIds: ["RBI-CP-DIRECTIONS"],
    sourceFactIds: ["cp-unsecured", "cp-money-market"],
  },
  {
    id: "certificate-deposit",
    label: "Certificate of Deposit",
    explanation: "A Certificate of Deposit is a negotiable money-market instrument issued by eligible banks and financial institutions under RBI rules.",
    sourceIds: ["RBI-CD-DIRECTIONS"],
    sourceFactIds: ["cd-negotiable", "cd-money-market"],
  },
  {
    id: "call-money",
    label: "Call money",
    explanation: "Call money is an unsecured very-short-term segment of the money market used mainly by eligible financial-market participants for liquidity management.",
    sourceIds: ["RBI-MONEY-MARKET-DIRECTIONS"],
    sourceFactIds: ["call-money-short-term"],
  },
  {
    id: "repo-market",
    label: "Repo market",
    explanation: "A repo is a secured short-term funding transaction in which securities are sold with an agreement to repurchase them later.",
    sourceIds: ["RBI-REPO-GSEC"],
    sourceFactIds: ["ready-forward", "secured-funding"],
  },
  {
    id: "ipo",
    label: "Initial Public Offer",
    explanation: "An IPO is a primary-market issue through which a company offers shares to the public for the first time.",
    sourceIds: ["SEBI-SECURITIES-MARKET"],
    sourceFactIds: ["ipo-primary-market"],
  },
  {
    id: "diversification",
    label: "Diversification",
    explanation: "Diversification spreads investment across different securities or asset classes so that risk is not concentrated in a single exposure.",
    sourceIds: ["SEBI-MUTUAL-FUNDS"],
    sourceFactIds: ["portfolio-spread"],
  },
];

export function ecoCp019Fact(id: string): EcoCp019Fact {
  const fact = ECO_CP019_FACTS_V1.find((row) => row.id === id);
  if (!fact) throw new Error(`Unknown ECO-CP-019 fact: ${id}`);
  return fact;
}
