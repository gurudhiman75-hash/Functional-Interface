export const ECO_CP020_SOURCES_V1 = {
  "RBI-BOP-STRUCTURE": {
    title: "RBI — Balance of Payments structure and components",
    url: "https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=9479",
  },
  "RBI-BOP-INVISIBLES": {
    title: "RBI — Invisibles: services, income and transfers",
    url: "https://www.rbi.org.in/scripts/BS_ViewBulletin.aspx?Id=10922",
  },
  "RBI-EXCHANGE-REFORM": {
    title: "RBI — Exchange-rate reform, LERMS and current-account convertibility",
    url: "https://www.rbi.org.in/scripts/bs_viewcontent.aspx?Id=2253",
  },
  "RBI-FOREX-HISTORY": {
    title: "RBI — Evolution of India's foreign-exchange market",
    url: "https://www.rbi.org.in/scripts/BS_ViewBulletin.aspx/BS_ViewBulletin.aspx?Id=23129",
  },
  "RBI-FDI-FPI": {
    title: "RBI — Foreign investment definitions",
    url: "https://www.rbi.org.in/scripts/FS_Notification.aspx?Id=11200",
  },
} as const;

export type EcoCp020SourceId = keyof typeof ECO_CP020_SOURCES_V1;
export const ECO_CP020_SOURCE_IDS_V1 = Object.keys(ECO_CP020_SOURCES_V1) as EcoCp020SourceId[];
