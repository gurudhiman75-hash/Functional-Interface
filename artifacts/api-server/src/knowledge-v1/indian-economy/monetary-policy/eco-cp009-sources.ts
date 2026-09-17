export const ECO_CP009_SOURCES_V1 = Object.freeze([
  {
    id: "RBI-MONETARY-POLICY-OVERVIEW",
    authority: "Reserve Bank of India",
    title: "Monetary Policy - Framework and Instruments",
    url: "https://systemhealth.rbi.org.in/Scripts/FS_Overview2752.aspx.html",
    notes: "Official RBI overview of the monetary-policy objective, MPC process and instruments including repo, SDF, MSF, LAF and OMOs.",
  },
  {
    id: "RBI-MPC-FRAMEWORK",
    authority: "Reserve Bank of India",
    title: "Monetary Policy Framework in India",
    url: "https://www.rbi.org.in/scripts/PublicationsView.aspx?Id=18086",
    notes: "Explains the amended RBI Act framework, six-member MPC, voting, minimum meeting frequency and failure-to-meet-target procedure.",
  },
  {
    id: "RBI-SDF-SCHEME",
    authority: "Reserve Bank of India",
    title: "Standing Deposit Facility Scheme",
    url: "https://www.rbi.org.in/hindi1/Upload/content/PDFs/PR41_AN.pdf",
    notes: "Official SDF scheme. SDF absorbs liquidity without collateral and replaced the fixed reverse repo as the floor of the LAF corridor from April 2022.",
  },
] as const);

export const ECO_CP009_SOURCE_IDS_V1 = ECO_CP009_SOURCES_V1.map((source) => source.id);
