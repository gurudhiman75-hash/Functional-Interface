export const ECO_CP008_SOURCES_V1 = Object.freeze([
  {
    id: "RBI-HISTORY-FACTFILE",
    authority: "Reserve Bank of India",
    title: "RBI Fact File / History",
    url: "https://www.rbi.org.in/commonman/Upload/english/Content/PDFs/MoneyKumarComic.pdf",
    notes: "RBI was established under the RBI Act, 1934; commenced operations on 1 April 1935; Central Office moved permanently from Calcutta to Mumbai in 1937; nationalised in 1949.",
  },
  {
    id: "RBI-ANNUAL-REPORT-OWNERSHIP",
    authority: "Reserve Bank of India",
    title: "RBI Annual Report - Capital and Ownership",
    url: "https://www.rbi.org.in/Scripts/AnnualReportPublications.aspx?Id=1354",
    notes: "RBI was originally a private shareholders' bank and was nationalised with effect from 1 January 1949; ownership remains with Government of India.",
  },
  {
    id: "RBI-ABOUT-US-FUNCTIONS",
    authority: "Reserve Bank of India",
    title: "Reserve Bank of India - About Us / Main Functions",
    url: "https://systemhealth.rbi.org.in/Scripts/AboutusDisplay.aspx.html",
    notes: "Lists monetary-authority, regulation/supervision, foreign-exchange, currency, developmental, payment-system and banker functions.",
  },
  {
    id: "RBI-BANKER-GOV-BANKS",
    authority: "Reserve Bank of India",
    title: "Banker to Governments and Banks",
    url: "https://systemhealth.rbi.org.in/Scripts/FS_Overview2758.aspx.html",
    notes: "Explains banker-to-government, banker-to-banks, inter-bank settlement and lender-of-last-resort roles.",
  },
  {
    id: "RBI-CURRENCY-FAQ",
    authority: "Reserve Bank of India",
    title: "Indian Currency - Frequently Asked Questions",
    url: "https://rbi.org.in/scripts/FAQView.aspx?Id=136",
    notes: "Under Section 22 RBI has the sole right to issue banknotes; Government of India mints coins and RBI distributes coins supplied by Government.",
  },
  {
    id: "RBI-ONE-RUPEE-NOTE",
    authority: "Reserve Bank of India / Government of India",
    title: "Issue of One Rupee Currency Notes",
    url: "https://www.rbi.org.in/commonman/Upload/English/PressRelease/PDFs/PR2282290316.PDF",
    notes: "One-rupee currency notes are printed by Government of India and carry the signature of the Finance Secretary rather than the RBI Governor.",
  },
  {
    id: "RBI-PSS-FAQ",
    authority: "Reserve Bank of India",
    title: "Payment and Settlement Systems Act, 2007 - FAQs",
    url: "https://www.rbi.org.in/CommonPerson/english/scripts/FAQs.aspx?Id=420",
    notes: "The PSS Act designates RBI as the authority for regulation and supervision of payment systems in India.",
  },
] as const);

export const ECO_CP008_SOURCE_IDS_V1 = ECO_CP008_SOURCES_V1.map((source) => source.id);
