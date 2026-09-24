export const ECO_CP025_SOURCES_V1 = {
  "RBI-BASEL-III": { title: "Master Circular – Basel III Capital Regulations", publisher: "Reserve Bank of India", url: "https://www.rbi.org.in/Scripts/BS_ViewMasterCirculars.aspx?Id=12815" },
  "PMJDY-ABOUT": { title: "Pradhan Mantri Jan-Dhan Yojana", publisher: "Department of Financial Services, Ministry of Finance", url: "https://pmjdy.gov.in/about" },
  "DFS-PMMY": { title: "Pradhan Mantri MUDRA Yojana", publisher: "Department of Financial Services, Ministry of Finance", url: "https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy" },
  "NABARD-SHG": { title: "SHG-Bank Linkage Programme", publisher: "NABARD", url: "https://www.nabard.org/contentsearch.aspx?AID=103&Key=microfinance+sector" },
  "NPCI-UPI": { title: "UPI Frequently Asked Questions", publisher: "National Payments Corporation of India", url: "https://www.npci.org.in/what-we-do/upi/faqs" },
  "RBI-CPS": { title: "Access for Non-banks to Centralised Payment Systems", publisher: "Reserve Bank of India", url: "https://www.rbi.org.in/scripts/faqview.aspx/upload/FAQView.aspx?Id=144" },
  "RBI-RTGS": { title: "Real Time Gross Settlement System FAQs", publisher: "Reserve Bank of India", url: "https://www.rbi.org.in/scripts/FS_FAQs.aspx?Id=65" },
  "RBI-PSS-ACT": { title: "Payment and Settlement Systems Act, 2007 FAQs", publisher: "Reserve Bank of India", url: "https://www.rbi.org.in/CommonPerson/english/scripts/FAQs.aspx?Id=420" },
} as const;

export type EcoCp025SourceId = keyof typeof ECO_CP025_SOURCES_V1;
export const ECO_CP025_SOURCE_IDS_V1 = Object.keys(ECO_CP025_SOURCES_V1) as EcoCp025SourceId[];
