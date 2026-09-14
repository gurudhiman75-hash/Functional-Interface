export const ECO_CP007_SOURCES_V1 = Object.freeze([
  {
    id: "NCERT-MACRO-MONEY-BANKING",
    authority: "NCERT",
    title: "Introductory Macroeconomics — Money and Banking",
    url: "https://www.ncert.nic.in/textbook/pdf/leec103.pdf",
    notes: "Barter, functions of money, demand/time deposits, fiat money, legal tender, M1-M4, narrow/broad money, high-powered money and money multiplier.",
  },
  {
    id: "RBI-MONETARY-AGGREGATES",
    authority: "Reserve Bank of India",
    title: "Measures of Monetary and Liquidity Aggregates",
    url: "https://www.rbi.org.in/scripts/PublicationsView.aspx?Id=22715",
    notes: "Official definitions of reserve money and Indian monetary aggregates M1, M2, M3 and M4.",
  },
  {
    id: "RBI-MONEY-STOCK-MEASURES",
    authority: "Reserve Bank of India",
    title: "Money Stock Measures",
    url: "https://www.rbi.org.in/scripts/bs_viewbulletin.aspx/BS_ViewBulletin.aspx?Id=23140",
    notes: "Official RBI table for currency with public, demand deposits, time deposits and M1-M4 components.",
  },
] as const);

export const ECO_CP007_SOURCE_IDS_V1 = ECO_CP007_SOURCES_V1.map((source) => source.id);
