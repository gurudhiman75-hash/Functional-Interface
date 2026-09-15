export const ECO_CP016_SOURCES_V1 = Object.freeze([
  {
    id: "NCERT-LPG-REFORMS",
    authority: "NCERT",
    title: "Indian Economic Development — Liberalisation, Privatisation and Globalisation: An Appraisal",
    url: "https://www.ncert.nic.in/textbook/pdf/keec103.pdf",
    notes: "Background and main features of the 1991 reforms, including liberalisation, privatisation and globalisation.",
  },
  {
    id: "RBI-1991-CRISIS-REFORMS",
    authority: "Reserve Bank of India",
    title: "RBI historical material on the 1991 balance-of-payments crisis and reforms",
    url: "https://www.rbi.org.in/commonman/Upload/English/PressRelease/PDFs/ENP336BR0813.pdf",
    notes: "Official RBI discussion of the 1991 balance-of-payments crisis and the move to structural, financial and external-sector reforms.",
  },
  {
    id: "RBI-EXTERNAL-SECTOR-OPENNESS",
    authority: "Reserve Bank of India",
    title: "External Sector Openness in India",
    url: "https://www.rbi.org.in/scripts/bs_viewcontent.aspx?Id=2253",
    notes: "Official RBI history of exchange-rate adjustment, LERMS, market-determined exchange rates and current-account convertibility.",
  },
  {
    id: "RBI-FINANCIAL-SECTOR-REFORMS",
    authority: "Reserve Bank of India",
    title: "RBI history of financial-sector liberalisation",
    url: "https://systemhealth.rbi.org.in/Scripts/PublicationsView.aspx_id%3D10487.html",
    notes: "Official RBI material on Narasimham Committee and banking/financial-sector reforms after 1991.",
  },
  {
    id: "DPIIT-INDUSTRIAL-POLICY-1991",
    authority: "Department for Promotion of Industry and Internal Trade",
    title: "Statement on Industrial Policy, 24 July 1991",
    url: "https://www.dpiit.gov.in/static/uploads/2025/07/51cb252d5e39c9c2afd70515623b8ebb.pdf",
    notes: "Official industrial-policy statement covering delicensing, public-sector policy and foreign investment liberalisation.",
  },
] as const);

export const ECO_CP016_SOURCE_IDS_V1 = ECO_CP016_SOURCES_V1.map((source) => source.id);
