export const PGK_001_CP013_SOURCE_IDS = Object.freeze({
  psebBandaLesson: "PSEB-BANDA-SINGH-BAHADUR-LESSON",
  psebClass12Model: "PSEB-CLASS12-PHC-BANDA-SINGH",
  sgpcGuruGobindSingh: "SGPC-GURU-GOBIND-SINGH-NANDED-BANDA",
  sgpcGazetteBanda: "SGPC-GAZETTE-BANDA-SINGH",
  pibBanda: "PIB-MOC-BANDA-SINGH-BAHADUR",
  censusSangrur: "CENSUS-INDIA-SANGRUR-HISTORY-BANDA",
} as const);


export const PGK_001_CP013_SOURCE_REGISTRY = Object.freeze({
  [PGK_001_CP013_SOURCE_IDS.psebBandaLesson]: {
    authority: "Punjab School Education Board",
    title: "Class XII Punjab History & Culture Question Bank — Banda Singh Bahadur",
    url: "https://static.pseb.ac.in/media/1655981990_N_5131_1655355982934.pdf",
    classification: "PRIMARY_EDUCATION_AUTHORITY",
  },
  [PGK_001_CP013_SOURCE_IDS.psebClass12Model]: {
    authority: "Punjab School Education Board",
    title: "Punjab History & Culture Class XII syllabus",
    url: "https://static.pseb.ac.in/media/1775112498_12thPunjabHistoryandCultureSyllabus2026-27.pdf",
    classification: "SUPPORTING_CURRICULUM",
  },
  [PGK_001_CP013_SOURCE_IDS.sgpcGuruGobindSingh]: {
    authority: "Shiromani Gurdwara Parbandhak Committee",
    title: "Sri Guru Gobind Singh Ji — Nanded and Banda Singh",
    url: "https://sgpc.net/ten-guru-sahibs/guru-gobind-singh-sahib/",
    classification: "PRIMARY_INSTITUTIONAL",
  },
  [PGK_001_CP013_SOURCE_IDS.sgpcGazetteBanda]: {
    authority: "Shiromani Gurdwara Parbandhak Committee",
    title: "Gurdwara Gazette — Banda Singh Bahadur historical chronology",
    url: "https://sgpc.net/gazette/2018/May/May-English.pdf",
    supportingUrls: Object.freeze(["https://sgpc.net/gazette/2018/September/September-English.pdf"]),
    classification: "PRIMARY_INSTITUTIONAL_ARCHIVE",
  },
  [PGK_001_CP013_SOURCE_IDS.pibBanda]: {
    authority: "Press Information Bureau, Government of India / Ministry of Culture",
    title: "Baba Banda Singh Bahadur — historical profile and agrarian measures",
    url: "https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1837026",
    supportingUrls: Object.freeze(["https://www.pib.gov.in/newsite/erelcontent.aspx?lang=2&reg=48&relid=149104"]),
    classification: "PRIMARY_GOVERNMENT",
  },
  [PGK_001_CP013_SOURCE_IDS.censusSangrur]: {
    authority: "Directorate of Census Operations, Punjab",
    title: "Census of India 2011 — District Census Handbook, Sangrur, Part XII-A",
    url: "https://censusindia.gov.in/nada/index.php/catalog/1016",
    classification: "PRIMARY_GOVERNMENT",
  },
} as const);

export const PGK_001_CP013_FACTS = Object.freeze({
  earlyNames: {
    id: "banda-early-names",
    childhoodName: "Lachhman Dev",
    asceticName: "Madho Das",
  },
  nanded1708: {
    id: "banda-nanded-1708",
    year: 1708,
    place: "Nanded",
    mentor: "Guru Gobind Singh",
    mission: "Proceed to Punjab and lead the struggle against Mughal provincial power",
  },
  hukamnamaSupport: {
    id: "banda-hukamnama-support",
    instruction: "Punjab Sikhs were asked to accept Banda Singh Bahadur as leader in the struggle against the Mughals",
    earlySuccessFactors: Object.freeze(["Guru Gobind Singh's hukamnamas", "Sikh military support", "Support from sections of the local population"]),
  },
  sonipat1709: {
    id: "banda-sonipat-1709",
    place: "Sonipat",
    year: 1709,
    note: "One of Banda Singh Bahadur's early campaign points.",
  },
  samana1709: {
    id: "banda-samana-1709",
    place: "Samana",
    year: 1709,
    note: "One of Banda Singh Bahadur's earliest important victories in Punjab.",
  },
  kapuri: {
    id: "banda-kapuri-qadam-ud-din",
    place: "Kapuri",
    ruler: "Qadam-ud-Din",
  },
  sadhaura: {
    id: "banda-sadhaura-usman-khan",
    place: "Sadhaura",
    ruler: "Usman Khan",
  },
  sirhindGovernor: {
    id: "sirhind-wazir-khan",
    place: "Sirhind",
    governor: "Wazir Khan",
  },
  chapparChiri1710: {
    id: "chappar-chiri-1710",
    place: "Chappar Chiri",
    year: 1710,
    result: "Wazir Khan's forces were defeated and Wazir Khan was killed",
  },
  sirhind1710: {
    id: "sirhind-captured-1710",
    place: "Sirhind",
    year: 1710,
    result: "Captured by Banda Singh Bahadur's forces after Chappar Chiri",
  },
  lohgarhCapital: {
    id: "lohgarh-capital-banda",
    capital: "Lohgarh",
    note: "Banda Singh Bahadur made Lohgarh his capital.",
  },
  coinage: {
    id: "banda-first-sikh-coinage",
    issuer: "Banda Singh Bahadur",
    issuedInNamesOf: Object.freeze(["Guru Nanak Dev", "Guru Gobind Singh"]),
    note: "Punjab school-history material treats him as the first issuer of coins of the Sikh Panth.",
  },
  agrarianReform: {
    id: "banda-zamindari-tiller-rights",
    reform: "Abolition of zamindari and recognition of proprietary rights of tillers in areas under his control",
  },
  gurdasNangal1715: {
    id: "gurdas-nangal-1715",
    place: "Gurdas Nangal",
    year: 1715,
    commanderWhoCaptured: "Abdus Samad Khan",
    siegeWeakness: "Shortage of food supplies during the long siege",
    note: "Site of Banda Singh Bahadur's final major siege and capture.",
  },
  finalSetbackFactors: {
    id: "banda-final-setback-factors",
    factors: Object.freeze(["Sustained Mughal pressure", "Differences with Baba Binod Singh", "Exhaustion and supply shortage during the Gurdas Nangal siege"]),
  },
  captureToDelhi: {
    id: "banda-captured-taken-delhi",
    route: Object.freeze(["Gurdas Nangal", "Lahore", "Delhi"]),
  },
  execution1716: {
    id: "banda-execution-1716-delhi",
    place: "Delhi",
    year: 1716,
    emperor: "Farrukh Siyar",
  },
  sonAjaySingh: {
    id: "banda-son-ajay-singh",
    son: "Ajay Singh",
  },
} as const);

export const PGK_001_CP013_FACT_IDS = Object.freeze(
  Object.values(PGK_001_CP013_FACTS).map((fact) => fact.id),
);
