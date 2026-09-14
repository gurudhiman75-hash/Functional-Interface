export const ECO_CP010_SOURCES_V1 = Object.freeze([
  {
    id: "RBI-SCHEDULED-BANK",
    authority: "Reserve Bank of India",
    title: "Scheduled bank definition under RBI Act",
    url: "https://www.rbi.org.in/Commonman/English/Scripts/Notification.aspx?Id=935",
    notes: "A scheduled bank is a bank included in the Second Schedule of the Reserve Bank of India Act, 1934.",
  },
  {
    id: "RBI-SFB-GUIDELINES",
    authority: "Reserve Bank of India",
    title: "Guidelines for Licensing of Small Finance Banks in the Private Sector",
    url: "https://systemhealth.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx_prid%3D32614%281%29.html",
    notes: "Small Finance Banks further financial inclusion through savings vehicles and credit to underserved segments such as small businesses and small/marginal farmers.",
  },
  {
    id: "RBI-PB-GUIDELINES",
    authority: "Reserve Bank of India",
    title: "Guidelines for Licensing of Payments Banks",
    url: "https://systemhealth.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx_prid%3D32615%281%29.html",
    notes: "Payments Banks accept demand deposits and provide payment/remittance services but cannot undertake lending activities.",
  },
  {
    id: "NABARD-RRB",
    authority: "National Bank for Agriculture and Rural Development",
    title: "Regional Rural Banks overview",
    url: "https://www.nabard.org/auth/writereaddata/File/regional-rural-bank-1.pdf",
    notes: "RRBs began in 1975, were followed by the RRB Act, 1976, and were created to expand institutional credit for rural and agricultural sectors.",
  },
  {
    id: "NABARD-COOP-STRUCTURE",
    authority: "National Bank for Agriculture and Rural Development",
    title: "Cooperative credit structure background",
    url: "https://www.nabard.org/auth/writereaddata/tender/1707202436NB%20Foundation%20Day%20Lectures%202020.pdf",
    notes: "The short-term cooperative credit structure has PACS at village level, District Central Cooperative Banks at middle level and State Cooperative Banks at apex level.",
  },
  {
    id: "RBI-NPA-IRAC",
    authority: "Reserve Bank of India",
    title: "Prudential Norms on Income Recognition, Asset Classification and Provisioning",
    url: "https://rbi.org.in/scripts/NotificationUser.aspx?Id=12822",
    notes: "An asset becomes non-performing when it ceases to generate income; ordinary term-loan interest/principal overdue for more than 90 days is an NPA under the standard rule.",
  },
  {
    id: "RBI-PSL",
    authority: "Reserve Bank of India",
    title: "Priority Sector Lending directions",
    url: "https://www.rbi.org.in/Scripts/BS_CircularIndexDisplay.aspx?Id=12799",
    notes: "Priority sector directions classify lending to sectors such as agriculture, MSMEs, education, housing, social infrastructure and renewable energy; current percentage targets are intentionally not encoded in this CP.",
  },
  {
    id: "DICGC-FAQ",
    authority: "Deposit Insurance and Credit Guarantee Corporation",
    title: "Deposit Insurance FAQ",
    url: "https://www.dicgc.org.in/FAQs",
    notes: "DICGC insures eligible savings, fixed, current and recurring deposits; deposits in the same right and same capacity at one bank are aggregated for insurance purposes.",
  },
] as const);

export const ECO_CP010_SOURCE_IDS_V1 = ECO_CP010_SOURCES_V1.map((source) => source.id);
