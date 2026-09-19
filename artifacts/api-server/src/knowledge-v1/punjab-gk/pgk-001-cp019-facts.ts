export const PGK_001_CP019_SOURCE_IDS = Object.freeze({
  constitutionIndia: "india-code-constitution-part-vi-ix-ixa",
  assemblyPunjab: "punjab-vidhan-sabha-official",
  councilAbolition: "india-code-punjab-legislative-council-abolition-1969",
  eciDelimitation: "eci-delimitation-punjab-2008",
  rajyaSabha: "rajya-sabha-seat-allocation",
  highCourt: "punjab-haryana-high-court-official",
  ruralPunjab: "punjab-rural-development-panchayats",
  localPunjab: "punjab-local-government",
} as const);

export const PGK_001_CP019_FACTS = Object.freeze([
  { id: "assembly-unicameral", statement: "Punjab has a unicameral State Legislature.", sourceKeys: ["constitutionIndia", "councilAbolition"] },
  { id: "council-abolished-1970", statement: "The Punjab Legislative Council was abolished with effect from 7 January 1970.", sourceKeys: ["councilAbolition"] },
  { id: "assembly-117", statement: "Punjab has 117 Assembly constituencies under the Delimitation of Parliamentary and Assembly Constituencies Order, 2008.", sourceKeys: ["eciDelimitation", "assemblyPunjab"] },
  { id: "assembly-sc-34", statement: "Under the Delimitation Order, 2008, 34 of Punjab's 117 Assembly constituencies are reserved for Scheduled Castes and none for Scheduled Tribes.", sourceKeys: ["eciDelimitation"] },
  { id: "legislature-governor-assembly", statement: "Punjab's Legislature consists of the Governor and the Legislative Assembly.", sourceKeys: ["constitutionIndia"] },
  { id: "assembly-term", statement: "A State Legislative Assembly normally continues for five years unless sooner dissolved.", sourceKeys: ["constitutionIndia"] },
  { id: "speaker-deputy", statement: "The Legislative Assembly chooses a Speaker and Deputy Speaker from among its members.", sourceKeys: ["constitutionIndia"] },

  { id: "executive-governor", statement: "The executive power of a State is vested in the Governor under the Constitution.", sourceKeys: ["constitutionIndia"] },
  { id: "cm-appointed-governor", statement: "The Chief Minister is appointed by the Governor.", sourceKeys: ["constitutionIndia"] },
  { id: "ministers-on-cm-advice", statement: "Other Ministers are appointed by the Governor on the advice of the Chief Minister.", sourceKeys: ["constitutionIndia"] },
  { id: "council-aid-advice", statement: "A Council of Ministers with the Chief Minister at its head aids and advises the Governor, except where the Constitution requires discretion.", sourceKeys: ["constitutionIndia"] },
  { id: "collective-responsibility", statement: "The Council of Ministers is collectively responsible to the Legislative Assembly of the State.", sourceKeys: ["constitutionIndia"] },
  { id: "advocate-general", statement: "The Governor appoints the Advocate-General for the State under Article 165.", sourceKeys: ["constitutionIndia"] },

  { id: "lok-sabha-13", statement: "Punjab has 13 Lok Sabha constituencies under the Delimitation Order, 2008.", sourceKeys: ["eciDelimitation"] },
  { id: "lok-sabha-sc-4", statement: "Under the Delimitation Order, 2008, four of Punjab's 13 Lok Sabha constituencies are reserved for Scheduled Castes.", sourceKeys: ["eciDelimitation"] },
  { id: "rajya-sabha-7", statement: "Punjab is allocated seven seats in the Rajya Sabha.", sourceKeys: ["rajyaSabha"] },

  { id: "hc-name", statement: "The common High Court is the High Court of Punjab and Haryana.", sourceKeys: ["highCourt", "constitutionIndia"] },
  { id: "hc-seat", statement: "The High Court of Punjab and Haryana is located at Chandigarh.", sourceKeys: ["highCourt"] },
  { id: "hc-jurisdiction", statement: "The High Court exercises jurisdiction over Punjab, Haryana and the Union Territory of Chandigarh.", sourceKeys: ["highCourt"] },
  { id: "hc-court-record", statement: "Every High Court is a court of record under Article 215 of the Constitution.", sourceKeys: ["constitutionIndia"] },
  { id: "hc-judges", statement: "A High Court consists of a Chief Justice and other Judges appointed under the constitutional framework.", sourceKeys: ["constitutionIndia"] },

  { id: "panchayat-three-tier", statement: "Punjab's rural Panchayati Raj structure uses Gram Panchayat, Panchayat Samiti and Zila Parishad levels.", sourceKeys: ["ruralPunjab"] },
  { id: "panchayat-act-1994", statement: "The Punjab Panchayati Raj Act, 1994 is a core law governing Panchayati Raj institutions in the State.", sourceKeys: ["ruralPunjab"] },
  { id: "gram-village", statement: "Gram Panchayat is the village-level rural local-government institution.", sourceKeys: ["ruralPunjab", "constitutionIndia"] },
  { id: "samiti-intermediate", statement: "Panchayat Samiti functions at the intermediate or block level in Punjab's rural local-government structure.", sourceKeys: ["ruralPunjab"] },
  { id: "zila-district", statement: "Zila Parishad is the district-level rural local-government institution.", sourceKeys: ["ruralPunjab"] },

  { id: "urban-types", statement: "Punjab's urban local bodies include Municipal Corporations, Municipal Councils and Nagar Panchayats.", sourceKeys: ["localPunjab", "constitutionIndia"] },
  { id: "sec-local", statement: "The State Election Commission supervises elections to Panchayats and Municipalities under the constitutional local-government framework.", sourceKeys: ["constitutionIndia", "ruralPunjab"] },
  { id: "eci-assembly-parliament", statement: "The Election Commission of India conducts elections to Parliament and State Legislative Assemblies.", sourceKeys: ["eciDelimitation"] },
  { id: "part-ix", statement: "Part IX of the Constitution contains provisions relating to Panchayats.", sourceKeys: ["constitutionIndia"] },
  { id: "part-ixa", statement: "Part IXA of the Constitution contains provisions relating to Municipalities.", sourceKeys: ["constitutionIndia"] },
] as const);

export const PGK_001_CP019_FACT_IDS = Object.freeze(PGK_001_CP019_FACTS.map((fact) => fact.id));
