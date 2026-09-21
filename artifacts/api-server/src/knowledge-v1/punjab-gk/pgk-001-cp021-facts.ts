export const PGK_001_CP021_SOURCE_IDS = Object.freeze({
  punjabOfficialLanguageAct: "india-code-punjab-official-language-act-1967",
  punjabGovLanguage: "government-punjab-know-punjab-language",
  unicodeGurmukhi: "unicode-gurmukhi-core-spec",
  unicodeNames: "unicode-gurmukhi-names-list",
  guruAngadOfficial: "official-history-guru-angad-gurmukhi",
  punjabiUniversityLanguage: "punjabi-university-language-teaching-material",
} as const);


export const PGK_001_CP021_SOURCE_REGISTRY = Object.freeze({
  [PGK_001_CP021_SOURCE_IDS.punjabOfficialLanguageAct]: {
    authority: "India Code / Government of Punjab",
    title: "The Punjab Official Language Act, 1967",
    url: "https://www.indiacode.nic.in/bitstream/123456789/22096/1/the_punjab_official_languages_act.pdf",
  },
  [PGK_001_CP021_SOURCE_IDS.punjabGovLanguage]: {
    authority: "Government of Punjab",
    title: "Know Punjab — Language",
    url: "https://punjab.gov.in/know-punjab/",
  },
  [PGK_001_CP021_SOURCE_IDS.unicodeGurmukhi]: {
    authority: "Unicode Consortium",
    title: "The Unicode Standard — Gurmukhi",
    url: "https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-12/",
  },
  [PGK_001_CP021_SOURCE_IDS.unicodeNames]: {
    authority: "Unicode Consortium",
    title: "Gurmukhi Names List U+0A00–U+0A7F",
    url: "https://www.unicode.org/charts/nameslist/n_0A00.html",
  },
  [PGK_001_CP021_SOURCE_IDS.guruAngadOfficial]: {
    authority: "Shiromani Gurdwara Parbandhak Committee",
    title: "Sri Guru Angad Dev Ji",
    url: "https://sgpc.net/ten-guru-sahibs/guru-angad-sahib/",
  },
  [PGK_001_CP021_SOURCE_IDS.punjabiUniversityLanguage]: {
    authority: "Punjabi University, Patiala — Punjabi Pedia",
    title: "Gurmukhi script",
    url: "https://punjabipedia.org/topic.aspx?txt=%E0%A8%97%E0%A9%81%E0%A8%B0%E0%A8%AE%E0%A9%81%E0%A8%96%E0%A9%80+%E0%A8%B2%E0%A8%BF%E0%A8%AA%E0%A9%80",
  },
} as const);

export const PGK_001_CP021_FACTS = Object.freeze([
  { id: "official-language-punjabi", statement: "Punjabi is the official language of the State of Punjab.", sourceKeys: ["punjabOfficialLanguageAct", "punjabGovLanguage"] },
  { id: "official-language-gurmukhi", statement: "The Punjab Official Language Act, 1967 defines Punjabi as Punjabi in Gurmukhi script.", sourceKeys: ["punjabOfficialLanguageAct"] },
  { id: "gurmukhi-guru-angad", statement: "Guru Angad Dev is credited with developing, standardising and popularising the Gurmukhi script.", sourceKeys: ["guruAngadOfficial"] },
  { id: "gurmukhi-khadur", statement: "Khadur Sahib was an important centre for Guru Angad Dev's work and the teaching of Gurmukhi.", sourceKeys: ["guruAngadOfficial"] },
  { id: "painti-35", statement: "The traditional Painti Akhari contains 35 basic Gurmukhi letters.", sourceKeys: ["punjabiUniversityLanguage"] },
  { id: "vowel-bearers", statement: "The three traditional Gurmukhi vowel bearers are ੳ, ਅ and ੲ.", sourceKeys: ["unicodeGurmukhi", "punjabiUniversityLanguage"] },
  { id: "matra-kanna", statement: "The Gurmukhi vowel sign ਾ is kanna.", sourceKeys: ["unicodeNames"] },
  { id: "matra-sihari", statement: "The Gurmukhi vowel sign ਿ is sihari and is written to the left of its consonant base.", sourceKeys: ["unicodeNames"] },
  { id: "matra-bihari", statement: "The Gurmukhi vowel sign ੀ is bihari.", sourceKeys: ["unicodeNames"] },
  { id: "matra-aunkar", statement: "The Gurmukhi vowel sign ੁ is aunkar.", sourceKeys: ["unicodeNames"] },
  { id: "matra-dulainkar", statement: "The Gurmukhi vowel sign ੂ is dulainkar.", sourceKeys: ["unicodeNames"] },
  { id: "matra-lavan", statement: "The Gurmukhi vowel sign ੇ is lavan.", sourceKeys: ["unicodeNames"] },
  { id: "matra-dulavan", statement: "The Gurmukhi vowel sign ੈ is dulavan.", sourceKeys: ["unicodeNames"] },
  { id: "matra-hora", statement: "The Gurmukhi vowel sign ੋ is hora.", sourceKeys: ["unicodeNames"] },
  { id: "matra-kanaura", statement: "The Gurmukhi vowel sign ੌ is kanaura.", sourceKeys: ["unicodeNames"] },
  { id: "bindi", statement: "Bindi ਂ is a Gurmukhi sign used in nasalisation according to orthographic context.", sourceKeys: ["unicodeNames", "punjabiUniversityLanguage"] },
  { id: "tippi", statement: "Tippi ੰ is a Gurmukhi sign used in nasalisation according to orthographic context.", sourceKeys: ["unicodeNames", "punjabiUniversityLanguage"] },
  { id: "addak", statement: "Addak ੱ marks consonant gemination or doubling in Gurmukhi orthography.", sourceKeys: ["unicodeNames", "punjabiUniversityLanguage"] },
  { id: "nukta", statement: "Pairin bindi or nukta ਼ extends the Gurmukhi alphabet for additional consonant sounds.", sourceKeys: ["unicodeNames"] },
  { id: "additional-consonants", statement: "Common additional dotted Gurmukhi consonants include ਸ਼, ਖ਼, ਗ਼, ਜ਼, ਫ਼ and ਲ਼.", sourceKeys: ["unicodeNames"] },
  { id: "punjabi-tonal", statement: "Punjabi is a tonal language.", sourceKeys: ["punjabGovLanguage", "unicodeGurmukhi"] },
  { id: "gurmukhi-tone", statement: "Modern Gurmukhi normally represents tone without a dedicated set of tone marks; consonantal and phonological patterns carry tonal information.", sourceKeys: ["unicodeGurmukhi"] },
  { id: "gurmukhi-direction", statement: "Gurmukhi is written from left to right.", sourceKeys: ["unicodeGurmukhi"] },
  { id: "gurmukhi-digits", statement: "Gurmukhi has decimal digits from ੦ to ੯.", sourceKeys: ["unicodeNames"] },
] as const);

export const PGK_001_CP021_FACT_IDS = Object.freeze(PGK_001_CP021_FACTS.map((fact) => fact.id));
