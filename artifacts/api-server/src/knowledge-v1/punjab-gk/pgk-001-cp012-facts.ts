export const PGK_001_CP012_SOURCE_IDS = Object.freeze({
  psebPunjabHistory: "PSEB-PUNJAB-HISTORY-CULTURE-GURUS",
  psebClass12Paper: "PSEB-CLASS12-PHC-GURU-MATCHING",
  sgpcTenGurus: "SGPC-TEN-GURU-SAHIBS",
  sgpcHistoricalGurdwaras: "SGPC-HISTORICAL-GURDWARAS",
} as const);

export const PGK_001_CP012_SOURCE_REGISTRY = Object.freeze({
  [PGK_001_CP012_SOURCE_IDS.psebPunjabHistory]: {
    authority: "Punjab School Education Board",
    title: "Class XII Punjab History & Culture Question Bank — Sikh Gurus",
    url: "https://static.pseb.ac.in/media/1655981990_N_5131_1655355982934.pdf",
    classification: "PRIMARY_EDUCATION_AUTHORITY",
  },
  [PGK_001_CP012_SOURCE_IDS.psebClass12Paper]: {
    authority: "Punjab School Education Board",
    title: "Punjab History & Culture Class XII syllabus",
    url: "https://static.pseb.ac.in/media/1775112498_12thPunjabHistoryandCultureSyllabus2026-27.pdf",
    classification: "SUPPORTING_CURRICULUM",
  },
  [PGK_001_CP012_SOURCE_IDS.sgpcTenGurus]: {
    authority: "Shiromani Gurdwara Parbandhak Committee",
    title: "Ten Guru Sahibs",
    url: "https://sgpc.net/ten-guru-sahibs/",
    classification: "PRIMARY_INSTITUTIONAL",
  },
  [PGK_001_CP012_SOURCE_IDS.sgpcHistoricalGurdwaras]: {
    authority: "Shiromani Gurdwara Parbandhak Committee",
    title: "Historical Gurdwaras of Punjab",
    url: "https://old.sgpc.net/historical-gurdwaras/arjandev.html",
    supportingUrls: Object.freeze(["https://old.sgpc.net/historical-gurdwaras/gobind.asp"]),
    classification: "PRIMARY_INSTITUTIONAL",
  },
} as const);

export const PGK_001_CP012_FACTS = Object.freeze({
  tenGurus: {
    id: "ten-gurus-sequence",
    sequence: Object.freeze([
      "Guru Nanak Dev",
      "Guru Angad Dev",
      "Guru Amar Das",
      "Guru Ram Das",
      "Guru Arjan Dev",
      "Guru Hargobind",
      "Guru Har Rai",
      "Guru Har Krishan",
      "Guru Tegh Bahadur",
      "Guru Gobind Singh",
    ]),
  },
  guruNanakBirth: {
    id: "guru-nanak-talwandi-nankana",
    guru: "Guru Nanak Dev",
    birthplace: "Talwandi",
    presentName: "Nankana Sahib",
    presentCountry: "Pakistan",
  },
  guruNanakKartarpur: {
    id: "guru-nanak-kartarpur",
    guru: "Guru Nanak Dev",
    place: "Kartarpur",
    note: "Major later centre of Guru Nanak's life.",
  },
  guruAngad: {
    id: "guru-angad-khadur-gurmukhi",
    guru: "Guru Angad Dev",
    order: 2,
    centre: "Khadur Sahib",
    contribution: "Development, standardisation and promotion of Gurmukhi in standard Punjab school-history treatment",
  },
  guruAmarDas: {
    id: "guru-amar-das-goindwal-manji-baoli",
    guru: "Guru Amar Das",
    order: 3,
    centre: "Goindwal",
    institutions: Object.freeze(["Manji system", "Baoli at Goindwal"]),
  },
  guruRamDas: {
    id: "guru-ram-das-ramdaspur-masand",
    guru: "Guru Ram Das",
    order: 4,
    town: "Ramdaspur",
    laterName: "Amritsar",
    institution: "Masand system in standard school-history treatment",
  },
  guruArjanAdiGranth: {
    id: "guru-arjan-adi-granth",
    guru: "Guru Arjan Dev",
    order: 5,
    event: "Compilation of the Adi Granth",
    firstGranthi: "Baba Buddha",
  },
  guruArjanHarmandir: {
    id: "guru-arjan-harmandir-sahib",
    guru: "Guru Arjan Dev",
    place: "Amritsar",
    event: "Completion of Harmandir Sahib",
  },
  guruArjanMartyrdom: {
    id: "guru-arjan-martyrdom-1606",
    guru: "Guru Arjan Dev",
    year: 1606,
    mughal: "Jahangir",
    place: "Lahore",
  },
  guruHargobind: {
    id: "guru-hargobind-akal-takht-miri-piri",
    guru: "Guru Hargobind",
    order: 6,
    institution: "Akal Takht",
    concept: "Miri-Piri",
  },
  guruHargobindGwalior: {
    id: "guru-hargobind-gwalior-release",
    guru: "Guru Hargobind",
    place: "Gwalior Fort",
    event: "Imprisonment and release in standard historical treatment",
  },
  guruHarRai: {
    id: "guru-har-rai-kiratpur",
    guru: "Guru Har Rai",
    order: 7,
    centre: "Kiratpur Sahib",
  },
  guruHarKrishan: {
    id: "guru-har-krishan-delhi-1664",
    guru: "Guru Har Krishan",
    order: 8,
    place: "Delhi",
    deathYear: 1664,
    historicalSite: "Bangla Sahib",
  },
  guruTeghBahadur: {
    id: "guru-tegh-bahadur-martyrdom-1675",
    guru: "Guru Tegh Bahadur",
    order: 9,
    martyrdomYear: 1675,
    martyrdomPlace: "Delhi",
  },
  guruTeghBahadurAnandpur: {
    id: "guru-tegh-bahadur-chak-nanki-anandpur",
    guru: "Guru Tegh Bahadur",
    place: "Chak Nanki",
    laterRelation: "Anandpur Sahib historical development",
  },
  guruGobindBirth: {
    id: "guru-gobind-singh-patna-1666",
    guru: "Guru Gobind Singh",
    order: 10,
    birthplace: "Patna Sahib",
    birthYear: 1666,
  },
  khalsa1699: {
    id: "khalsa-anandpur-1699",
    guru: "Guru Gobind Singh",
    year: 1699,
    place: "Anandpur Sahib",
    event: "Creation of the Khalsa",
  },
  panjPyare: {
    id: "panj-pyare-khalsa",
    event: "Creation of the Khalsa",
    group: "Panj Pyare",
    example: "Bhai Daya Singh",
  },
  guruGranth1708: {
    id: "guru-granth-continuing-guru-1708",
    guru: "Guru Gobind Singh",
    year: 1708,
    event: "Guru Granth Sahib recognised as the continuing Guru in standard historical treatment",
  },
} as const);

export const PGK_001_CP012_FACT_IDS = Object.freeze(
  Object.values(PGK_001_CP012_FACTS).map((fact) => fact.id),
);
