export const PGK_001_CP010_SOURCE_IDS = Object.freeze({
  psebClass6: "PSEB-SOCIAL-SCIENCE-6-ANCIENT-INDIA",
  psebClass9Punjab: "PSEB-SOCIAL-SCIENCE-9-PUNJAB-INTRO",
  psebClass11Syllabus: "PSEB-PUNJAB-HISTORY-CULTURE-XI-2026-27",
  asiPunjabSites: "ASI-PUNJAB-PROTECTED-SITES",
  nmaSanghol: "NMA-SANGHOL-HISTORY",
  sangholMuseum: "PUNJAB-SANGHOL-MUSEUM",
  britannicaAlexander: "BRITANNICA-ALEXANDER-PUNJAB",
} as const);

export const PGK_001_CP010_SOURCE_REGISTRY = Object.freeze({
  [PGK_001_CP010_SOURCE_IDS.psebClass6]: { authority: "Punjab School Education Board", title: "Social Science Class VI", url: "https://static.pseb.ac.in/media/1692771547_Scocial%20Science-6%28English%29%28done%29.pdf" },
  [PGK_001_CP010_SOURCE_IDS.psebClass9Punjab]: { authority: "Punjab School Education Board", title: "Social Science IX Part I — Punjab: An Introduction", url: "https://static.pseb.ac.in/media/1670479881_Social%20Science-9%28english%29%20Part-I.pdf" },
  [PGK_001_CP010_SOURCE_IDS.psebClass11Syllabus]: { authority: "Punjab School Education Board", title: "Punjab History and Culture XI 2026-27", url: "https://static.pseb.ac.in/media/1775037521_11thPunjabHistoryandCultureSyllabus2026-27.pdf" },
  [PGK_001_CP010_SOURCE_IDS.asiPunjabSites]: { authority: "Archaeological Survey of India", title: "Centrally Protected Monuments/Sites — Punjab", url: "https://asi.nic.in/admin/whatsnew/download/585" },
  [PGK_001_CP010_SOURCE_IDS.nmaSanghol]: { authority: "National Monuments Authority", title: "Ancient Site and Buddhist Stupa, Sanghol", url: "https://nma.gov.in/showfile.php?lang=1&level=1&lid=1448&ls_id=1177&nma_type=0" },
  [PGK_001_CP010_SOURCE_IDS.sangholMuseum]: { authority: "Government of Punjab", title: "Sanghol Museum", url: "https://fatehgarhsahib.nic.in/tourist-place/sanghol-museum/" },
  [PGK_001_CP010_SOURCE_IDS.britannicaAlexander]: { authority: "Encyclopaedia Britannica", title: "Alexander the Great — Indian Campaign", url: "https://www.britannica.com/biography/Alexander-the-Great" },
} as const);

export const PGK_001_CP010_HARAPPAN_SITES = Object.freeze([
  { id: "harappan-rupnagar", site: "Rupnagar (Ropar)", district: "Rupnagar" },
  { id: "harappan-sanghol", site: "Sanghol", district: "Fatehgarh Sahib" },
  { id: "harappan-rohira", site: "Rohira", district: "Sangrur" },
  { id: "harappan-sunet", site: "Sunet", district: "Ludhiana" },
  { id: "harappan-kotla", site: "Kotla Nihang Khan", district: "Rupnagar" },
]);

export const PGK_001_CP010_ANCIENT_REGION_NAMES = Object.freeze([
  { id: "name-sapta-sindhu", name: "Sapta Sindhu", context: "Vedic" },
  { id: "name-panchnad", name: "Panchnad", context: "Epic/Puranic tradition" },
  { id: "name-pentapotamia", name: "Pentapotamia", context: "Greek" },
]);

export const PGK_001_CP010_RELATIONS = Object.freeze({
  alexanderPunjabYearBce: 326,
  hydaspesModernRiver: "Jhelum",
  hyphasisModernRiver: "Beas",
  porusOpponent: "Alexander",
  taxilaRuler: "Ambhi",
  mauryaFounder: "Chandragupta Maurya",
  mauryaApproxFoundingBce: 321,
  chanakyaOtherName: "Kautilya",
  chanakyaWork: "Arthashastra",
  megasthenesWork: "Indica",
  famousKushanRuler: "Kanishka",
  sangholArtSchool: "Mathura school",
  sangholMajorPeriod: "Kushan period",
});

export const PGK_001_CP010_FACT_IDS = Object.freeze([
  ...PGK_001_CP010_HARAPPAN_SITES.map((x) => x.id),
  ...PGK_001_CP010_ANCIENT_REGION_NAMES.map((x) => x.id),
  "taxila-ancient-city-historical-punjab",
  "taxila-ambhi",
  "alexander-326-bce",
  "porus-hydaspes-jhelum",
  "hyphasis-beas-limit",
  "maurya-chandragupta-321",
  "chanakya-kautilya-taxila",
  "arthashastra-kautilya",
  "indica-megasthenes",
  "kushan-kanishka",
  "sanghol-kushan-buddhist",
  "sanghol-mathura-school",
]);
