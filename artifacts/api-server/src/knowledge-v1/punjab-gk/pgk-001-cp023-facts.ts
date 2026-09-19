export const PGK_001_CP023_SOURCE_IDS = Object.freeze({
  folkDance: "GOV-PUNJAB-CULTURE-FOLK-DANCE",
  folkMusic: "GOV-PUNJAB-CULTURE-FOLK-MUSIC",
  ruralHeritage: "PAU-RURAL-HERITAGE-MUSEUM",
  folkCraft: "GOV-PUNJAB-CULTURE-FOLK-CRAFT",
  tourismCulture: "INCREDIBLE-INDIA-PUNJAB-CULTURE",
} as const);

export const PGK_001_CP023_SOURCE_REGISTRY = Object.freeze({
  [PGK_001_CP023_SOURCE_IDS.folkDance]: {
    authority: "Government of Punjab",
    title: "Culture — folk dance traditions of Punjab",
    url: "https://punjab.gov.in/culture",
    classification: "PRIMARY_GOVERNMENT",
  },
  [PGK_001_CP023_SOURCE_IDS.folkMusic]: {
    authority: "Government of Punjab / Ministry of Tourism, Government of India",
    title: "Culture of Punjab; Rural Tourism Strategy Assessment — Punjab",
    url: "https://punjab.gov.in/culture",
    supportingUrls: Object.freeze(["https://tourism.gov.in/sites/default/files/2020-08/RTSA%20Punjab%202015-16.pdf"]),
    classification: "PRIMARY_GOVERNMENT",
  },
  [PGK_001_CP023_SOURCE_IDS.ruralHeritage]: {
    authority: "Punjab Agricultural University",
    title: "Museum of Social History and Rural Life of Punjab",
    url: "https://pau.edu/index.php?DO=viewEventDetail&_act=manageEvent&intID=8601",
    supportingUrls: Object.freeze(["https://pau.edu/content/registrar/ssra_2024.pdf","https://www.incredibleindia.gov.in/en/punjab/ludhiana/rural-museum"]),
    classification: "PRIMARY_ACADEMIC_INSTITUTION",
  },
  [PGK_001_CP023_SOURCE_IDS.folkCraft]: {
    authority: "Ministry of Tourism, Government of India — Incredible India",
    title: "Phulkari — Embroidery of Punjab",
    url: "https://www.incredibleindia.gov.in/en/punjab/phulkari",
    supportingUrls: Object.freeze(["https://www.incredibleindia.gov.in/en/punjab/ludhiana/punjab-agricultural-university-museum"]),
    classification: "PRIMARY_GOVERNMENT_TOURISM",
  },
  [PGK_001_CP023_SOURCE_IDS.tourismCulture]: {
    authority: "Ministry of Tourism, Government of India — Incredible India",
    title: "Punjab cultural heritage and Rural Museum, Ludhiana",
    url: "https://www.incredibleindia.gov.in/en/punjab/ludhiana/rural-museum",
    supportingUrls: Object.freeze(["https://www.incredibleindia.gov.in/en/punjab/phulkari","https://punjab.gov.in/culture"]),
    classification: "PRIMARY_GOVERNMENT_TOURISM",
  },
} as const);

export const PGK_001_CP023_FACTS = Object.freeze([
  { id: "bhangra-harvest-dhol", sourceIds: [PGK_001_CP023_SOURCE_IDS.folkDance, PGK_001_CP023_SOURCE_IDS.folkMusic], dance: "Bhangra", type: "folk dance", setting: "agrarian and harvest celebration", centralInstrument: "dhol", traditionalPerformance: "primarily male groups" },
  { id: "bhangra-baisakhi", sourceIds: [PGK_001_CP023_SOURCE_IDS.folkDance, PGK_001_CP023_SOURCE_IDS.tourismCulture], dance: "Bhangra", setting: "Baisakhi and harvest-season celebration" },
  { id: "giddha-women-boliyan", sourceIds: [PGK_001_CP023_SOURCE_IDS.folkDance, PGK_001_CP023_SOURCE_IDS.folkMusic], dance: "Giddha", type: "song-and-dance", traditionalPerformance: "women", songElement: "boliyan" },
  { id: "kikli-paired-spin", sourceIds: [PGK_001_CP023_SOURCE_IDS.folkDance], dance: "Kikli", performers: "girls", movement: "pairs hold hands and spin" },
  { id: "jhumar-style", sourceIds: [PGK_001_CP023_SOURCE_IDS.folkDance], dance: "Jhumar", type: "Punjabi folk dance", style: "slower and more graceful than energetic Bhangra" },
  { id: "sammi-style", sourceIds: [PGK_001_CP023_SOURCE_IDS.folkDance], dance: "Sammi", type: "Punjabi folk dance", traditionalPerformance: "women" },
  { id: "luddi-style", sourceIds: [PGK_001_CP023_SOURCE_IDS.folkDance], dance: "Luddi", type: "Punjabi folk dance", setting: "celebratory performance" },
  { id: "dhol-instrument", sourceIds: [PGK_001_CP023_SOURCE_IDS.folkMusic, PGK_001_CP023_SOURCE_IDS.ruralHeritage], instrument: "Dhol", family: "percussion", construction: "double-headed drum", use: "Bhangra and Punjabi folk performance" },
  { id: "dholak-instrument", sourceIds: [PGK_001_CP023_SOURCE_IDS.folkMusic, PGK_001_CP023_SOURCE_IDS.ruralHeritage], instrument: "Dholak", family: "percussion", construction: "smaller hand-played drum", use: "folk singing and domestic celebrations" },
  { id: "algoza-instrument", sourceIds: [PGK_001_CP023_SOURCE_IDS.folkMusic, PGK_001_CP023_SOURCE_IDS.ruralHeritage], instrument: "Algoza", family: "wind", construction: "paired flutes", use: "Punjabi folk music" },
  { id: "tumbi-instrument", sourceIds: [PGK_001_CP023_SOURCE_IDS.folkMusic, PGK_001_CP023_SOURCE_IDS.ruralHeritage], instrument: "Tumbi", aliases: ["Tumba"], family: "string", construction: "single-string plucked folk instrument" },
  { id: "chimta-instrument", sourceIds: [PGK_001_CP023_SOURCE_IDS.folkMusic], instrument: "Chimta", family: "percussion", construction: "metal tong-like instrument with jingles", use: "Punjabi folk performance including Bhangra" },
  { id: "sarangi-instrument", sourceIds: [PGK_001_CP023_SOURCE_IDS.folkMusic, PGK_001_CP023_SOURCE_IDS.ruralHeritage], instrument: "Sarangi", family: "bowed string", use: "folk and classical performance" },
  { id: "ghara-instrument", sourceIds: [PGK_001_CP023_SOURCE_IDS.folkMusic], instrument: "Ghara", family: "percussion", construction: "earthen pot", use: "rhythm in Punjabi folk music" },
  { id: "boliyan-form", sourceIds: [PGK_001_CP023_SOURCE_IDS.folkMusic, PGK_001_CP023_SOURCE_IDS.folkDance], form: "Boliyan", type: "short folk verses/couplets", use: "commonly sung in Giddha" },
  { id: "tappa-form", sourceIds: [PGK_001_CP023_SOURCE_IDS.folkMusic], form: "Tappa", type: "semi-classical vocal form", style: "fast and ornamented", roots: "folk music of Punjab and Sindh" },
  { id: "phulkari-craft", sourceIds: [PGK_001_CP023_SOURCE_IDS.folkCraft, PGK_001_CP023_SOURCE_IDS.tourismCulture], item: "Phulkari", type: "traditional embroidery", region: "Punjab" },
  { id: "punjabi-jutti", sourceIds: [PGK_001_CP023_SOURCE_IDS.folkCraft, PGK_001_CP023_SOURCE_IDS.tourismCulture], item: "Punjabi jutti", type: "traditional footwear" },
  { id: "men-dress", sourceIds: [PGK_001_CP023_SOURCE_IDS.folkCraft, PGK_001_CP023_SOURCE_IDS.tourismCulture], item: "Punjabi kurta and tehmat", type: "traditional men's dress" },
  { id: "women-dress", sourceIds: [PGK_001_CP023_SOURCE_IDS.folkCraft, PGK_001_CP023_SOURCE_IDS.tourismCulture], item: "Punjabi salwar suit", type: "traditional women's dress" },
  { id: "rural-museum-instruments", sourceIds: [PGK_001_CP023_SOURCE_IDS.ruralHeritage], instruments: ["Dholak", "Sarangi", "Algoza", "Tumba", "Sitar"], context: "Punjab rural heritage collections" },
] as const);
