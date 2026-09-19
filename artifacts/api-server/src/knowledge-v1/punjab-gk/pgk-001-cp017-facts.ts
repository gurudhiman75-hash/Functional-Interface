export const PGK_001_CP017_SOURCE_IDS = Object.freeze({
  ministryCultureKuka: "ministry-culture-kuka-movement",
  ministryCultureRamSingh: "ministry-culture-baba-ram-singh",
  singhSabhaHistory: "PUNJABI-UNIVERSITY-PUNJABIPEDIA-SINGH-SABHA",
  ministryCultureAjitSingh: "ministry-culture-ajit-singh",
  ministryCultureGhadar: "ministry-culture-ghadar-movement",
  ministryCultureKartar: "ministry-culture-kartar-singh-sarabha",
  jallianwalaMemorial: "jallianwala-bagh-national-memorial",
  ministryCultureJallianwala: "ministry-culture-jallianwala-bagh",
  ministryCultureGurdwaraReform: "ministry-culture-gurdwara-reform",
  ministryCultureBabbar: "ministry-culture-babbar-akali",
} as const);

export const PGK_001_CP017_FACTS = Object.freeze([
  { id: "kuka-ram-singh", statement: "Baba Ram Singh led the Namdhari or Kuka movement in Punjab.", sourceKeys: ["ministryCultureKuka", "ministryCultureRamSingh"] },
  { id: "kuka-bhaini-sahib", statement: "Bhaini Sahib in the Ludhiana area became an important centre of the Namdhari movement.", sourceKeys: ["ministryCultureKuka"] },
  { id: "kuka-boycott", statement: "The Namdhari movement used boycott and non-cooperation against British institutions and goods.", sourceKeys: ["ministryCultureKuka", "ministryCultureRamSingh"] },
  { id: "kuka-malerkotla-1872", statement: "The Kuka outbreak at Malerkotla took place in January 1872.", sourceKeys: ["ministryCultureKuka"] },
  { id: "kuka-rangoon", statement: "Baba Ram Singh was deported to Rangoon after the 1872 outbreak.", sourceKeys: ["ministryCultureKuka", "ministryCultureRamSingh"] },

  { id: "singh-sabha-amritsar-1873", statement: "The first Singh Sabha was founded at Amritsar in 1873.", sourceKeys: ["singhSabhaHistory"] },
  { id: "singh-sabha-lahore-1879", statement: "A major Singh Sabha was founded at Lahore in 1879.", sourceKeys: ["singhSabhaHistory"] },
  { id: "singh-sabha-reform", statement: "The Singh Sabha movement focused on Sikh religious, educational and social reform.", sourceKeys: ["singhSabhaHistory"] },

  { id: "pagri-1907", statement: "Pagri Sambhal Jatta was a Punjab peasant agitation of 1907.", sourceKeys: ["ministryCultureAjitSingh"] },
  { id: "pagri-ajit-singh", statement: "Ajit Singh was a leading figure of the 1907 Pagri Sambhal Jatta agitation.", sourceKeys: ["ministryCultureAjitSingh"] },
  { id: "pagri-laws", statement: "The agitation opposed colonial agrarian measures including the Colonisation Bill and related canal-colony legislation.", sourceKeys: ["ministryCultureAjitSingh"] },
  { id: "pagri-mandalay", statement: "Ajit Singh and Lala Lajpat Rai were deported to Mandalay in 1907.", sourceKeys: ["ministryCultureAjitSingh"] },

  { id: "ghadar-1913", statement: "The Ghadar movement emerged among Indian emigrants in North America in 1913.", sourceKeys: ["ministryCultureGhadar"] },
  { id: "ghadar-sohan-singh-bhakna", statement: "Sohan Singh Bhakna served as president of the Hindustani Association of the Pacific Coast, later popularly called the Ghadar Party.", sourceKeys: ["ministryCultureGhadar"] },
  { id: "ghadar-yugantar-ashram", statement: "Yugantar Ashram in San Francisco served as the headquarters of the Ghadar organisation.", sourceKeys: ["ministryCultureGhadar"] },
  { id: "ghadar-paper-1913", statement: "The Ghadar newspaper began publication in 1913.", sourceKeys: ["ministryCultureGhadar"] },
  { id: "ghadar-kartar-sarabha", statement: "Kartar Singh Sarabha became a prominent young revolutionary of the Ghadar movement.", sourceKeys: ["ministryCultureKartar"] },
  { id: "ghadar-1915-uprising", statement: "A planned uprising in February 1915 was disrupted before it could be carried out as intended.", sourceKeys: ["ministryCultureGhadar", "ministryCultureKartar"] },
  { id: "ghadar-lahore-cases", statement: "Many Ghadar activists were prosecuted in the Lahore Conspiracy Cases.", sourceKeys: ["ministryCultureGhadar"] },

  { id: "jallianwala-date", statement: "The Jallianwala Bagh massacre occurred at Amritsar on 13 April 1919.", sourceKeys: ["jallianwalaMemorial", "ministryCultureJallianwala"] },
  { id: "jallianwala-rowlatt", statement: "The 1919 Punjab unrest was connected with protests against the Rowlatt Act.", sourceKeys: ["ministryCultureJallianwala"] },
  { id: "jallianwala-kitchlew-satyapal", statement: "Saifuddin Kitchlew and Dr Satyapal were detained and removed from Amritsar on 10 April 1919.", sourceKeys: ["ministryCultureJallianwala"] },
  { id: "jallianwala-dyer", statement: "Brigadier-General Reginald Dyer ordered troops to fire at Jallianwala Bagh.", sourceKeys: ["ministryCultureJallianwala"] },
  { id: "jallianwala-tagore", statement: "Rabindranath Tagore renounced his knighthood after the Jallianwala Bagh massacre.", sourceKeys: ["ministryCultureJallianwala"] },
  { id: "jallianwala-udham", statement: "Udham Singh assassinated former Punjab Lieutenant-Governor Michael O'Dwyer in London in 1940.", sourceKeys: ["ministryCultureJallianwala"] },

  { id: "gurdwara-reform-1920s", statement: "The Gurdwara Reform Movement developed in Punjab in the early 1920s.", sourceKeys: ["ministryCultureGurdwaraReform"] },
  { id: "gurdwara-act-1925", statement: "The Sikh Gurdwaras Act was passed in 1925 and created a statutory framework for management of major Sikh shrines.", sourceKeys: ["ministryCultureGurdwaraReform"] },
  { id: "babbar-early-1920s", statement: "The Babbar Akali movement arose in the early 1920s.", sourceKeys: ["ministryCultureBabbar"] },
  { id: "babbar-kishan-singh", statement: "Kishan Singh Gargaj was a major leader of the Babbar Akali movement.", sourceKeys: ["ministryCultureBabbar"] },
  { id: "babbar-karam-singh", statement: "Karam Singh was another important Babbar Akali figure and helped publish Babbar Akali material through a mobile press.", sourceKeys: ["ministryCultureBabbar"] },
] as const);

export const PGK_001_CP017_FACT_IDS = Object.freeze(PGK_001_CP017_FACTS.map((fact) => fact.id));


export const PGK_001_CP017_SOURCE_NOTES = Object.freeze({
  "PUNJABI-UNIVERSITY-PUNJABIPEDIA-SINGH-SABHA": {
    authority: "Punjabi University, Patiala — Punjabipedia / Encyclopaedia of Sikhism",
    title: "Singh Sabha Movement / Khalsa Diwan Amritsar",
    url: "https://punjabipedia.org/topic.aspx?txt=%E0%A8%B8%E0%A8%BF%E0%A9%B0%E0%A8%98+%E0%A8%B8%E0%A8%AD%E0%A8%BE+%E0%A8%B2%E0%A8%B9%E0%A8%BF%E0%A8%B0",
    supports: Object.freeze(["Amritsar Singh Sabha — 1873", "Lahore Singh Sabha — 1879", "religious, educational and social reform aims"]),
  },
} as const);
