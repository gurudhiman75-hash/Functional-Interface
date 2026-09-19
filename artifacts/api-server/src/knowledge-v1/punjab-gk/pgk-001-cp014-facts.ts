export const PGK_001_CP014_SOURCE_IDS = Object.freeze({
  psebDalKhalsaLesson: "PSEB-DAL-KHALSA-MISL-LESSON",
  psebClass12Material: "PSEB-CLASS12-DAL-KHALSA-MISLS",
  ministryTourismDeepSingh: "MOT-BABA-DEEP-SINGH-DAL-KHALSA",
  districtAmritsarHistory: "DISTRICT-AMRITSAR-MISL-HISTORY",
  districtKapurthalaHistory: "DISTRICT-KAPURTHALA-AHLUWALIA-HISTORY",
} as const);

export const PGK_001_CP014_FACTS = Object.freeze({
  dalKhalsa1748: {
    id: "dal-khalsa-amritsar-1748",
    year: 1748,
    place: "Amritsar",
    organiser: "Nawab Kapur Singh",
    chiefCommander: "Jassa Singh Ahluwalia",
  },
  twelveMisls: {
    id: "dal-khalsa-twelve-misls",
    count: 12,
    note: "Standard PSEB treatment counts twelve major Sikh misls in the confederacy. This must not be phrased as twelve misls under Dal Khalsa command, because other Sikh reference works distinguish eleven Dal Khalsa misls plus the Phulkian misl outside that command.",
  },
  budhaTaruna: {
    id: "budha-taruna-dal-kapur-singh",
    organiser: "Nawab Kapur Singh",
    divisions: Object.freeze(["Budha Dal", "Taruna Dal"]),
    budhaDal: "Older veterans",
    tarunaDal: "Younger fighters",
  },
  tarunaFiveJathas: {
    id: "taruna-dal-five-jathas",
    count: 5,
  },
  sarbatKhalsa: {
    id: "sarbat-khalsa-amritsar-akal-takht",
    place: "Amritsar / Akal Takht",
    meaning: "Collective assembly of the Sikh community",
  },
  gurmata: {
    id: "gurmata-sarbat-khalsa-decisions",
    meaning: "Collective decisions taken by the Sarbat Khalsa",
  },
  rakhi: {
    id: "rakhi-protection-system-one-fifth",
    purpose: "Protection of villages from raids, theft and outside attack",
    payment: "One-fifth of estimated village revenue",
  },
  mislWord: {
    id: "misl-word-arabic",
    language: "Arabic",
  },
  faizalpuria: {
    id: "faizalpuria-nawab-kapur-singh",
    misl: "Faizalpuria Misl",
    alternateName: "Singhpuria Misl",
    founder: "Nawab Kapur Singh",
  },
  ahluwalia: {
    id: "ahluwalia-jassa-singh",
    misl: "Ahluwalia Misl",
    founder: "Jassa Singh Ahluwalia",
  },
  sultanUlQaum: {
    id: "jassa-singh-sultan-ul-qaum",
    person: "Jassa Singh Ahluwalia",
    title: "Sultan-ul-Qaum",
  },
  ramgarhia: {
    id: "ramgarhia-jassa-singh-ramgarhia",
    misl: "Ramgarhia Misl",
    founder: "Jassa Singh Ramgarhia",
  },
  sukerchakia: {
    id: "sukerchakia-charat-singh",
    misl: "Sukerchakia Misl",
    founder: "Charat Singh",
  },
  kanhaiya: {
    id: "kanhaiya-jai-singh",
    misl: "Kanhaiya Misl",
    founder: "Jai Singh Kanhaiya",
  },
  bhangi: {
    id: "bhangi-chhajja-singh",
    misl: "Bhangi Misl",
    founder: "Chhajja Singh",
  },
  dallewalia: {
    id: "dallewalia-tara-singh-gheba",
    misl: "Dallewalia Misl",
    prominentLeader: "Tara Singh Gheba",
  },
  shahid: {
    id: "shahid-baba-deep-singh-nihang",
    misl: "Shahid Misl",
    alternateName: "Nihang Misl",
    prominentLeader: "Baba Deep Singh",
  },
  karorsinghia: {
    id: "karorsinghia-panjgarhia",
    misl: "Karorsinghia Misl",
    alternateName: "Panjgarhia Misl",
  },
  amritsarFourMisls: {
    id: "amritsar-four-misls",
    misls: Object.freeze(["Ahluwalia Misl", "Ramgarhia Misl", "Kanhaiya Misl", "Bhangi Misl"]),
    note: "These four misls controlled different parts of Amritsar during the misl period.",
  },
  ramgarhAmritsar: {
    id: "ramgarhia-ramgarh-amritsar",
    leader: "Jassa Singh Ramgarhia",
    place: "Amritsar",
    note: "Ram Rauni was rebuilt and renamed Ramgarh, from which the Ramgarhia name developed.",
  },
} as const);

export const PGK_001_CP014_FACT_IDS = Object.freeze(
  Object.values(PGK_001_CP014_FACTS).map((fact) => fact.id),
);
