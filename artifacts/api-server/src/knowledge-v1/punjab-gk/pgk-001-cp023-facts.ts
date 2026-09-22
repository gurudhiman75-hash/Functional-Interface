export const PGK_001_CP023_SOURCE_IDS = Object.freeze({
  punjabCulture: "GOV-PUNJAB-CULTURE",
  psebCulture: "PSEB-PUNJAB-CULTURE-MUSIC-DANCE",
  punjabiUniversityFolkInstruments: "PUNJABI-UNIVERSITY-FOLK-INSTRUMENTS",
  indiaCultureTappa: "MOC-INDIA-CULTURE-TAPPA",
  snaSammi: "SNA-ICH-SAMMI-PUNJAB",
  incredibleIndiaPhulkari: "MOT-INCREDIBLE-INDIA-PHULKARI",
} as const);

export const PGK_001_CP023_SOURCE_REGISTRY = Object.freeze({
  [PGK_001_CP023_SOURCE_IDS.punjabCulture]: {
    authority: "Government of Punjab",
    title: "Culture",
    url: "https://punjab.gov.in/culture",
    classification: "PRIMARY_GOVERNMENT",
  },
  [PGK_001_CP023_SOURCE_IDS.psebCulture]: {
    authority: "Punjab School Education Board",
    title: "Punjab History and Culture — Music, dances and games of Punjab",
    url: "https://static.pseb.ac.in/sites/default/files/N_5131_1639112186942.pdf",
    classification: "PRIMARY_EDUCATION_AUTHORITY",
  },
  [PGK_001_CP023_SOURCE_IDS.punjabiUniversityFolkInstruments]: {
    authority: "Punjabi University, Patiala — Department of Music",
    title: "Punjabi Folk Instruments",
    url: "https://punjabiuniversity.ac.in/Pages/Page.aspx?dsenc=lok_saaz",
    classification: "PRIMARY_ACADEMIC_INSTITUTION",
  },
  [PGK_001_CP023_SOURCE_IDS.indiaCultureTappa]: {
    authority: "Ministry of Culture, Government of India",
    title: "Annual Report — Tappa Gayan",
    url: "https://www.indiaculture.gov.in/sites/default/files/Annual_Reports_Organizations/Annual_Report_20-21_06042022.pdf",
    classification: "PRIMARY_GOVERNMENT",
  },
  [PGK_001_CP023_SOURCE_IDS.snaSammi]: {
    authority: "Sangeet Natak Akademi, Ministry of Culture, Government of India",
    title: "Intangible Cultural Heritage — Sammi",
    url: "https://sangeetnatak.gov.in/sections/ICH",
    classification: "PRIMARY_CULTURAL_INSTITUTION",
  },
  [PGK_001_CP023_SOURCE_IDS.incredibleIndiaPhulkari]: {
    authority: "Ministry of Tourism, Government of India — Incredible India",
    title: "Phulkari — Embroidery of Punjab",
    url: "https://www.incredibleindia.gov.in/en/punjab/phulkari",
    classification: "PRIMARY_GOVERNMENT_TOURISM",
  },
} as const);

const S = PGK_001_CP023_SOURCE_IDS;

export const PGK_001_CP023_FACTS = Object.freeze([
  { id: "bhangra-harvest-dhol", sourceIds: [S.psebCulture], dance: "Bhangra", type: "folk dance", setting: "agrarian and harvest celebration", centralInstrument: "dhol", traditionalPerformance: "primarily male groups" },
  { id: "bhangra-baisakhi", sourceIds: [S.psebCulture], dance: "Bhangra", setting: "Baisakhi and harvest-season celebration" },
  { id: "giddha-women-boliyan", sourceIds: [S.punjabCulture, S.psebCulture], dance: "Giddha", type: "song-and-dance", traditionalPerformance: "women", songElement: "boliyan" },
  { id: "kikli-paired-spin", sourceIds: [S.psebCulture], dance: "Kikli", performers: "girls", movement: "pairs hold hands and spin" },
  { id: "jhumar-style", sourceIds: [S.punjabCulture, S.psebCulture], dance: "Jhumar", type: "Punjabi folk dance", style: "slower and more graceful than energetic Bhangra" },
  { id: "sammi-style", sourceIds: [S.punjabCulture, S.snaSammi], dance: "Sammi", type: "Punjabi folk dance", traditionalPerformance: "women" },
  { id: "luddi-style", sourceIds: [S.psebCulture], dance: "Luddi", type: "Punjabi folk dance", setting: "celebratory performance" },

  { id: "dhol-instrument", sourceIds: [S.punjabiUniversityFolkInstruments, S.psebCulture], instrument: "Dhol", family: "percussion", construction: "double-headed drum", use: "Bhangra and Punjabi folk performance" },
  { id: "dholak-instrument", sourceIds: [S.punjabiUniversityFolkInstruments], instrument: "Dholak", family: "percussion", construction: "smaller hand-played drum", use: "folk singing and domestic celebrations" },
  { id: "algoza-instrument", sourceIds: [S.punjabiUniversityFolkInstruments], instrument: "Algoza", family: "wind", construction: "paired flutes", use: "Punjabi folk music" },
  { id: "tumbi-instrument", sourceIds: [S.punjabiUniversityFolkInstruments, S.psebCulture], instrument: "Tumbi", aliases: ["Tumba"], family: "string", construction: "single-string plucked folk instrument" },
  { id: "chimta-instrument", sourceIds: [S.psebCulture], instrument: "Chimta", family: "percussion", construction: "metal tong-like instrument with jingles", use: "Punjabi folk performance including Bhangra" },
  { id: "sarangi-instrument", sourceIds: [S.punjabiUniversityFolkInstruments, S.psebCulture], instrument: "Sarangi", family: "bowed string", use: "folk and classical performance" },

  { id: "boliyan-form", sourceIds: [S.psebCulture], form: "Boliyan", type: "short folk verses/couplets", use: "sung in Giddha" },
  { id: "tappa-form", sourceIds: [S.indiaCultureTappa], form: "Tappa", type: "semi-classical vocal form", style: "fast and ornamented", roots: "folk music of Punjab and Sindh" },

  { id: "phulkari-craft", sourceIds: [S.incredibleIndiaPhulkari, S.psebCulture], item: "Phulkari", type: "traditional embroidery", region: "Punjab" },
  { id: "punjabi-jutti", sourceIds: [S.psebCulture], item: "Punjabi jutti", type: "traditional footwear" },
  { id: "men-dress", sourceIds: [S.punjabCulture], item: "Punjabi kurta and tehmat", type: "traditional men's dress" },
  { id: "women-dress", sourceIds: [S.punjabCulture], item: "Punjabi salwar suit", type: "traditional women's dress" },
] as const);
