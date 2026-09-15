export const ECO_CP017_SOURCES_V1 = Object.freeze([
  {
    id: "ICAR-GREEN-REVOLUTION",
    authority: "Indian Council of Agricultural Research",
    title: "ICAR agriculture history / Green Revolution references",
    url: "https://icar.gov.in/en/about-us",
    notes: "Stable institutional background on ICAR's role in the Green Revolution and agricultural research; live production figures are excluded.",
  },
  {
    id: "PIB-MSP-CACP",
    authority: "Press Information Bureau, Ministry of Agriculture & Farmers Welfare",
    title: "Minimum Support Price policy and CACP recommendation role",
    url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1657219",
    notes: "Government fixes MSP on CACP recommendations after considering relevant factors; current MSP amounts are excluded.",
  },
  {
    id: "DFPD-PROCUREMENT",
    authority: "Department of Food & Public Distribution, Government of India",
    title: "Procurement Policy",
    url: "https://dfpd.gov.in/procurement-policy/en",
    notes: "Stable wheat/rice procurement framework and Central Pool role; current quantities are excluded.",
  },
  {
    id: "FCI-MANDATE",
    authority: "Food Corporation of India",
    title: "FCI mandate and functions",
    url: "https://fci.gov.in/",
    notes: "Stable functions include procurement, storage, movement, distribution and buffer-stock support; current stock and movement data are excluded.",
  },
  {
    id: "NABARD-FUNCTIONS",
    authority: "National Bank for Agriculture and Rural Development",
    title: "NABARD functions and refinance role",
    url: "https://www.nabard.org/contentsearch.aspx?AID=172&Key=super",
    notes: "Stable credit/refinance, rural-infrastructure and institutional-development roles; current amounts are excluded.",
  },
  {
    id: "PMFBY-FAQ",
    authority: "Ministry of Agriculture & Farmers Welfare",
    title: "Pradhan Mantri Fasal Bima Yojana FAQ",
    url: "https://www.pmfby.gov.in/faq",
    notes: "Crop insurance protects farmers against financial losses from covered crop failures/losses; live premium and claim data are excluded.",
  },
  {
    id: "ENAM-OVERVIEW",
    authority: "National Agriculture Market, Ministry of Agriculture & Farmers Welfare",
    title: "e-NAM Overview",
    url: "https://enam.gov.in/",
    notes: "e-NAM links existing APMC mandis through a common electronic market platform for transparent price discovery and trade; live counts are excluded.",
  },
  {
    id: "NCERT-RURAL-AGRI",
    authority: "NCERT",
    title: "Indian Economic Development — agriculture and rural development concepts",
    url: "https://www.ncert.nic.in/textbook.php",
    notes: "Textbook-level land reform, agricultural credit, marketing and diversification concepts; no changing statistical values are encoded.",
  },
] as const);

export const ECO_CP017_SOURCE_IDS_V1 = ECO_CP017_SOURCES_V1.map((source) => source.id);
