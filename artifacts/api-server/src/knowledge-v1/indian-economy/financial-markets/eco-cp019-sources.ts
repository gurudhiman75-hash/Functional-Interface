export type EcoCp019Source = {
  id: string;
  title: string;
  url: string;
  authority: string;
  stableUse: string[];
};

export const ECO_CP019_SOURCES_V1: EcoCp019Source[] = [
  {
    id: "SEBI-SECURITIES-MARKET",
    title: "SEBI Investor — Investment in Securities Market",
    url: "https://investor.sebi.gov.in/securities-stockmarket.html",
    authority: "SEBI",
    stableUse: ["primary-market", "secondary-market", "stock-exchange-role"],
  },
  {
    id: "SEBI-ABOUT",
    title: "About SEBI",
    url: "https://www.sebi.gov.in/about-sebi.html",
    authority: "SEBI",
    stableUse: ["sebi-1988", "sebi-statutory-1992", "investor-protection", "market-regulation"],
  },
  {
    id: "SEBI-TRADING-ACCOUNTS",
    title: "SEBI Investor — What You Need to Start Investing",
    url: "https://investor.sebi.gov.in/securities-trading.html",
    authority: "SEBI",
    stableUse: ["demat-account", "depository-participant", "nsdl-cdsl", "trading-account"],
  },
  {
    id: "SEBI-MUTUAL-FUNDS",
    title: "SEBI Investor — Understanding Mutual Funds",
    url: "https://investor.sebi.gov.in/understanding_mf.html",
    authority: "SEBI",
    stableUse: ["mutual-fund-pooling", "asset-management-company", "professional-management"],
  },
  {
    id: "SEBI-NAV",
    title: "SEBI Investor — Net Asset Value",
    url: "https://investor.sebi.gov.in/securities-mf-investments.html",
    authority: "SEBI",
    stableUse: ["nav-basic", "per-unit-value"],
  },
  {
    id: "RBI-GSEC-FAQ",
    title: "RBI — Government Securities Market FAQs",
    url: "https://m.rbi.org.in/commonman/english/scripts/FAQs.aspx?Id=711",
    authority: "RBI",
    stableUse: ["government-securities", "treasury-bills", "zero-coupon", "discount-face-value", "credit-risk"],
  },
  {
    id: "RBI-RETAIL-DIRECT-FAQ",
    title: "RBI — Retail Direct FAQs",
    url: "https://www.rbi.org.in/scripts/faqview.aspx/faqview.aspx/scripts/FAQView.aspx?Id=145",
    authority: "RBI",
    stableUse: ["t-bills", "dated-gsec", "state-development-loans"],
  },
  {
    id: "RBI-CP-DIRECTIONS",
    title: "RBI — Commercial Paper Directions",
    url: "https://www.rbi.org.in/commonperson/english/scripts/Notification.aspx?Id=2517",
    authority: "RBI",
    stableUse: ["commercial-paper", "money-market-instrument", "unsecured-short-term"],
  },
  {
    id: "RBI-CD-DIRECTIONS",
    title: "RBI — Certificate of Deposit Directions, 2021",
    url: "https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=12108",
    authority: "RBI",
    stableUse: ["certificate-of-deposit", "negotiable-money-market-instrument"],
  },
  {
    id: "RBI-MONEY-MARKET-DIRECTIONS",
    title: "RBI Master Directions — Financial Market",
    url: "https://systemhealth.rbi.org.in/Scripts/BS_ViewMasterDirections.aspx_did%3D336%281%29.html",
    authority: "RBI",
    stableUse: ["call-notice-term-money", "cp", "cd", "money-market"],
  },
  {
    id: "RBI-REPO-GSEC",
    title: "RBI — Ready Forward Contracts in Government Securities",
    url: "https://www.rbi.org.in/Commonperson/english/scripts/Notification.aspx?Id=1460",
    authority: "RBI",
    stableUse: ["repo-secured-funding", "government-securities-collateral"],
  },
];

export const ECO_CP019_SOURCE_IDS_V1 = ECO_CP019_SOURCES_V1.map((source) => source.id);
