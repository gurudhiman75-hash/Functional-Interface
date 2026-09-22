export const PGK_001_CP011_SOURCE_IDS = Object.freeze({
  psebClass11Turks: "PSEB-CLASS11-TURKS-PUNJAB",
  psebClass12Mughals: "PSEB-CLASS12-GREAT-MUGHALS-PUNJAB",
  govtPunjabHistory: "GOV-PUNJAB-HISTORY",
  lahoreGovHistory: "LAHORE-GOV-HISTORY",
  igncaLahore: "IGNCA-LAHORE-HISTORY",
  lbsnaaMedievalIndia: "NIOS-HISTORY-GHORI-PUNJAB-1186",
} as const);

export const PGK_001_CP011_SOURCE_REGISTRY = Object.freeze({
  [PGK_001_CP011_SOURCE_IDS.psebClass11Turks]: {
    authority: "Punjab School Education Board",
    title: "Punjab History and Culture Class XI syllabus — The Turks in the Punjab",
    url: "https://static.pseb.ac.in/media/1775037521_11thPunjabHistoryandCultureSyllabus2026-27.pdf",
    classification: "SUPPORTING_CURRICULUM",
  },
  [PGK_001_CP011_SOURCE_IDS.psebClass12Mughals]: {
    authority: "Punjab School Education Board",
    title: "Class XII Punjab History & Culture Question Bank — Great Mughals and Punjab",
    url: "https://static.pseb.ac.in/media/1655981990_N_5131_1655355982934.pdf",
    classification: "PRIMARY_EDUCATION_AUTHORITY",
  },
  [PGK_001_CP011_SOURCE_IDS.govtPunjabHistory]: {
    authority: "Government of Punjab",
    title: "History of Punjab",
    url: "https://punjab.gov.in/know-punjab/history/",
    classification: "PRIMARY_GOVERNMENT",
  },
  [PGK_001_CP011_SOURCE_IDS.lahoreGovHistory]: {
    authority: "District Lahore, Government of Punjab, Pakistan",
    title: "Our History / District Profile",
    url: "https://lahore.punjab.gov.pk/our_history",
    supportingUrls: Object.freeze(["https://lahore.punjab.gov.pk/district_profile"]),
    classification: "PRIMARY_GOVERNMENT",
  },
  [PGK_001_CP011_SOURCE_IDS.igncaLahore]: {
    authority: "Indira Gandhi National Centre for the Arts — ASI digital archive",
    title: "Five Thousand Years of Pakistan — Lahore monuments and Mughal architecture",
    url: "https://ignca.gov.in/Asi_data/17045.pdf",
    classification: "PRIMARY_ARCHIVAL_COPY",
  },
  [PGK_001_CP011_SOURCE_IDS.lbsnaaMedievalIndia]: {
    authority: "National Institute of Open Schooling",
    title: "History Lesson 9 — Establishment and Expansion of the Delhi Sultanate",
    url: "https://digital.nios.ac.in/content/315en/315_History_Eng_Lesson9.pdf",
    classification: "PRIMARY_EDUCATION_AUTHORITY",
  },
} as const);

export const PGK_001_CP011_FACTS = Object.freeze({
  ghaznavidPunjab: {
    id: "ghaznavid-punjab-lahore",
    ruler: "Mahmud of Ghazni",
    centre: "Lahore",
    note: "Northern Punjab came under Ghaznavid power and Lahore became a major Ghaznavid centre.",
  },
  ghoriLahore1186: {
    id: "ghori-captured-lahore-1186",
    ruler: "Muhammad Ghori",
    year: 1186,
    defeatedRuler: "Khusrau Malik",
    result: "End of Ghaznavid rule at Lahore",
  },
  aibakLahore: {
    id: "aibak-lahore-1206-1210",
    ruler: "Qutb-ud-din Aibak",
    independentRule: 1206,
    deathPlace: "Lahore",
    deathYear: 1210,
    deathCause: "Injuries from a polo/chaugan accident",
  },
  mongolLahore1241: {
    id: "mongol-sack-lahore-1241",
    year: 1241,
    place: "Lahore",
    event: "Mongol sack of Lahore",
  },
  lodiFounder: {
    id: "bahlul-lodi-founder",
    ruler: "Bahlul Lodi",
    dynasty: "Lodi dynasty",
  },
  ibrahimLodi: {
    id: "ibrahim-lodi-panipat-1526",
    ruler: "Ibrahim Lodi",
    event: "Defeated by Babur at the First Battle of Panipat",
    year: 1526,
  },
  daulatKhan: {
    id: "daulat-khan-lodi-punjab",
    ruler: "Daulat Khan Lodi",
    role: "Governor of Punjab during the final Lodi phase",
  },
  baburLahore: {
    id: "babur-lahore-before-panipat",
    ruler: "Babur",
    place: "Lahore",
    note: "Babur captured Lahore during campaigns preceding his victory at Panipat.",
  },
  firstPanipat: {
    id: "first-panipat-1526",
    year: 1526,
    victor: "Babur",
    defeated: "Ibrahim Lodi",
  },
  akbarLahore: {
    id: "akbar-lahore-1584-1598",
    ruler: "Akbar",
    from: 1584,
    to: 1598,
    note: "Akbar held his court at Lahore and strengthened Lahore Fort and city defences.",
  },
  lahoreTradeEducation: {
    id: "lahore-sixteenth-century-centre",
    century: "16th century",
    roles: Object.freeze(["Major trade centre", "Major Islamic education centre"]),
  },
  jahangirTomb: {
    id: "jahangir-tomb-shahdara",
    ruler: "Jahangir",
    place: "Shahdara, Lahore",
  },
  nurJahanTomb: {
    id: "nur-jahan-tomb-shahdara",
    person: "Nur Jahan",
    place: "Shahdara, Lahore",
  },
  shalimarLahore: {
    id: "shalimar-gardens-shah-jahan",
    monument: "Shalimar Gardens, Lahore",
    ruler: "Shah Jahan",
  },
  badshahiMosque: {
    id: "badshahi-mosque-aurangzeb",
    monument: "Badshahi Mosque, Lahore",
    ruler: "Aurangzeb",
  },
  ibnBattutaPunjab: {
    id: "ibn-battuta-punjab-term",
    person: "Ibn Battuta",
    period: "14th century",
    note: "One of the earliest known documentary uses of the word Punjab.",
  },
  tarikhSherShah: {
    id: "tarikh-sher-shah-punjab-term",
    work: "Tarikh-e-Sher Shah Suri",
    year: 1580,
    note: "Contains use of the name Punjab.",
  },
  ainAkbariPunjab: {
    id: "ain-akbari-punjab-term",
    work: "Ain-i-Akbari",
    author: "Abul Fazl",
    note: "Uses Punjab in describing the Lahore and Multan region and also uses Panjnad.",
  },
} as const);

export const PGK_001_CP011_FACT_IDS = Object.freeze(
  Object.values(PGK_001_CP011_FACTS).map((fact) => fact.id),
);
