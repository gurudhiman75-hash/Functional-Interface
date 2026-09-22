export const PGK_001_CP018_SOURCE_IDS = Object.freeze({
  punjabHistory: "punjab-government-history",
  chandigarhHistory: "chandigarh-administration-history",
  rajBhavanPepsu: "punjab-raj-bhavan-pepsu-history",
  statesReorganisation1956: "india-code-states-reorganisation-1956",
  punjabReorganisation1966: "india-code-punjab-reorganisation-1966",
  highCourtHistory: "punjab-haryana-high-court-history",
} as const);

export const PGK_001_CP018_SOURCE_REGISTRY = Object.freeze({
  [PGK_001_CP018_SOURCE_IDS.punjabHistory]: {
    authority: "Government of Punjab",
    title: "History of Punjab",
    url: "https://punjab.gov.in/know-punjab/history/",
  },
  [PGK_001_CP018_SOURCE_IDS.chandigarhHistory]: {
    authority: "Chandigarh Administration",
    title: "General Information — Chandigarh history and capital",
    url: "https://chandigarh.gov.in/general-information",
  },
  [PGK_001_CP018_SOURCE_IDS.rajBhavanPepsu]: {
    authority: "Punjab Raj Bhavan",
    title: "Historical note on PEPSU formation",
    url: "https://punjabrajbhavan.gov.in/home/speechesDetails/NjA2",
  },
  [PGK_001_CP018_SOURCE_IDS.statesReorganisation1956]: {
    authority: "India Code, Government of India",
    title: "The States Reorganisation Act, 1956",
    url: "https://www.indiacode.nic.in/bitstream/123456789/1680/1/a1956-37.pdf",
  },
  [PGK_001_CP018_SOURCE_IDS.punjabReorganisation1966]: {
    authority: "India Code, Government of India",
    title: "The Punjab Reorganisation Act, 1966",
    url: "https://www.indiacode.nic.in/bitstream/123456789/1645/1/196631.pdf",
  },
  [PGK_001_CP018_SOURCE_IDS.highCourtHistory]: {
    authority: "High Court of Punjab and Haryana",
    title: "Historical Background",
    url: "https://www.highcourtchd.gov.in/index.php/left_menu/rti/left_menu/?mod=history",
  },
} as const);

export const PGK_001_CP018_FACTS = Object.freeze([
  { id: "partition-1947", statement: "The former Punjab province was divided between India and Pakistan in 1947.", sourceKeys: ["punjabHistory"] },
  { id: "east-punjab-india", statement: "East Punjab became part of India after the 1947 Partition.", sourceKeys: ["punjabHistory"] },
  { id: "west-punjab-pakistan", statement: "West Punjab became part of Pakistan after the 1947 Partition.", sourceKeys: ["punjabHistory"] },
  { id: "lahore-pakistan", statement: "Lahore became part of Pakistan in 1947, leaving Indian Punjab without its former provincial capital.", sourceKeys: ["punjabHistory", "chandigarhHistory"] },
  { id: "partition-displacement", statement: "Partition caused large-scale population displacement across Punjab.", sourceKeys: ["punjabHistory"] },

  { id: "chandigarh-site-1948", statement: "The site for Chandigarh near the Shivalik foothills was approved in March 1948 as the new capital area for Punjab.", sourceKeys: ["chandigarhHistory"] },
  { id: "chandigarh-foundation-1952", statement: "The foundation stone of Chandigarh was laid in 1952.", sourceKeys: ["chandigarhHistory"] },
  { id: "chandigarh-capital-pre1966", statement: "Chandigarh served as the capital of Punjab before the 1966 reorganisation.", sourceKeys: ["chandigarhHistory"] },

  { id: "pepsu-full-form", statement: "PEPSU stands for Patiala and East Punjab States Union.", sourceKeys: ["rajBhavanPepsu", "punjabHistory"] },
  { id: "pepsu-inaugurated-1948", statement: "PEPSU was inaugurated on 15 July 1948.", sourceKeys: ["rajBhavanPepsu"] },
  { id: "pepsu-eight-states", statement: "PEPSU was formed from eight princely states: Patiala, Kapurthala, Jind, Nabha, Faridkot, Malerkotla, Nalagarh and Kalsia.", sourceKeys: ["rajBhavanPepsu"] },
  { id: "pepsu-patiala-member", statement: "Patiala was one of the constituent princely states of PEPSU.", sourceKeys: ["rajBhavanPepsu"] },

  { id: "pepsu-merged-1956", statement: "PEPSU was merged with Punjab during the States Reorganisation of 1956.", sourceKeys: ["statesReorganisation1956", "punjabHistory", "highCourtHistory"] },
  { id: "pepsu-merger-date", statement: "The merger of PEPSU with Punjab took effect on 1 November 1956.", sourceKeys: ["statesReorganisation1956", "highCourtHistory"] },
  { id: "pepsu-high-court-merged", statement: "The PEPSU High Court was merged into the Punjab High Court after the 1956 reorganisation.", sourceKeys: ["highCourtHistory"] },

  { id: "punjab-reorganisation-act-1966", statement: "The Punjab Reorganisation Act, 1966 was enacted on 18 September 1966.", sourceKeys: ["punjabReorganisation1966"] },
  { id: "appointed-day-1966", statement: "The appointed day under the Punjab Reorganisation Act, 1966 was 1 November 1966.", sourceKeys: ["punjabReorganisation1966"] },
  { id: "haryana-formed-1966", statement: "Haryana was formed from specified territories of the existing Punjab on 1 November 1966.", sourceKeys: ["punjabReorganisation1966"] },
  { id: "chandigarh-ut-1966", statement: "Chandigarh became a Union Territory on 1 November 1966.", sourceKeys: ["punjabReorganisation1966", "chandigarhHistory"] },
  { id: "chandigarh-shared-capital", statement: "After the 1966 reorganisation Chandigarh served as the capital of both Punjab and Haryana.", sourceKeys: ["chandigarhHistory"] },
  { id: "hill-territories-himachal", statement: "Specified hill territories of Punjab were transferred to Himachal Pradesh under the 1966 reorganisation.", sourceKeys: ["punjabReorganisation1966"] },
] as const);

export const PGK_001_CP018_FACT_IDS = Object.freeze(PGK_001_CP018_FACTS.map((fact) => fact.id));
