export const PGK_001_CP021_SOURCE_IDS = Object.freeze({
  punjabOfficialLanguageAct: "india-code-punjab-official-language-act-1967",
  punjabGovLanguage: "government-punjab-know-punjab-language",
  unicodeGurmukhi: "unicode-gurmukhi-core-spec",
  unicodeNames: "unicode-gurmukhi-names-list",
  guruAngadOfficial: "official-history-guru-angad-gurmukhi",
  punjabiUniversityLanguage: "punjabi-university-language-teaching-material",
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
