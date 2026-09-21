export const PGK_001_CP019_SOURCE_IDS = Object.freeze({
  constitutionIndia: "india-code-constitution-part-vi-ix-ixa",
  assemblyPunjab: "punjab-vidhan-sabha-official",
  councilAbolition: "india-code-punjab-legislative-council-abolition-1969",
  eciDelimitation: "eci-delimitation-punjab-2008-current-framework",
  rajyaSabha: "rajya-sabha-seat-allocation",
  highCourt: "punjab-haryana-high-court-official",
  ruralPunjab: "punjab-rural-development-panchayats",
  localPunjab: "punjab-local-government",
} as const);


export const PGK_001_CP019_SOURCE_REGISTRY = Object.freeze({
  [PGK_001_CP019_SOURCE_IDS.constitutionIndia]: {
    authority: "Legislative Department, Ministry of Law and Justice, Government of India",
    title: "The Constitution of India — 2024 English edition",
    url: "https://lddashboard.legislative.gov.in/sites/default/files/coi/COI_2024.pdf",
  },
  [PGK_001_CP019_SOURCE_IDS.assemblyPunjab]: {
    authority: "Punjab Legislative Assembly / National eVidhan Application",
    title: "Punjab Vidhan Sabha official portal",
    url: "https://pvs.neva.gov.in/",
  },
  [PGK_001_CP019_SOURCE_IDS.councilAbolition]: {
    authority: "India Code, Government of India",
    title: "The Punjab Legislative Council (Abolition) Act, 1969",
    url: "https://www.indiacode.nic.in/repealedfileopen?rfilename=A1969-46.pdf",
  },
  [PGK_001_CP019_SOURCE_IDS.eciDelimitation]: {
    authority: "Election Commission of India / Delimitation Commission",
    title: "Delimitation Order No. 22 — Punjab, 19 June 2006",
    url: "https://www.eci.gov.in/eci-backend/public/api/download?url=LMAhAK6sOPBp%2FNFF0iRfXbEB1EVSLT41NNLRjYNJJP1KivrUxbfqkDatmHy12e%2FzVx8fLfn2ReU7TfrqYobgIrJuU8WtqkDIN3tXVcSIGhQDHLeNGKvjJA5iFFtHS48Axmy%2B9NgztC16Meup0w7IydNOZaQW5xIkvZ5NYVR2Fnk%3D",
  },
  [PGK_001_CP019_SOURCE_IDS.rajyaSabha]: {
    authority: "Rajya Sabha Secretariat",
    title: "Sixty Years of Rajya Sabha — allocation of seats",
    url: "https://cms.rajyasabha.nic.in/UploadedFiles/ElectronicPublications/Sixty%20Year%20RS_New.pdf",
  },
  [PGK_001_CP019_SOURCE_IDS.highCourt]: {
    authority: "High Court of Punjab and Haryana",
    title: "Official history and jurisdiction",
    url: "https://www.highcourtchd.gov.in/index.php/left_menu/rti/left_menu/?mod=history",
    supportingUrls: Object.freeze(["https://highcourtchd.gov.in/?mod=jurisdication"]),
  },
  [PGK_001_CP019_SOURCE_IDS.ruralPunjab]: {
    authority: "Department of Rural Development and Panchayats, Government of Punjab",
    title: "RTI manual — laws and institutional framework",
    url: "https://punjab.gov.in/wp-content/uploads/2023/01/rti-chapter5-eng.pdf",
  },
  [PGK_001_CP019_SOURCE_IDS.localPunjab]: {
    authority: "Government of Punjab / Department of Local Government",
    title: "Punjab local-government laws",
    url: "https://punjab.gov.in/wp-content/uploads/2025/11/Rules-Circulars-Notifications-Acts-From-01.07.2025-To-30.09.2025.pdf",
  },
} as const);

export const PGK_001_CP019_FACTS = Object.freeze([
  { id: "assembly-unicameral", statement: "Punjab has a unicameral State Legislature.", sourceKeys: ["constitutionIndia", "councilAbolition"] },
  { id: "council-abolished-1970", statement: "The Punjab Legislative Council was abolished with effect from 7 January 1970.", sourceKeys: ["councilAbolition"] },
  { id: "assembly-117", statement: "Punjab has 117 Assembly constituencies under the current delimitation framework.", sourceKeys: ["eciDelimitation", "assemblyPunjab"] },
  { id: "assembly-sc-34", statement: "Of Punjab's 117 Assembly constituencies, 34 are reserved for Scheduled Castes and none for Scheduled Tribes under the current delimitation framework.", sourceKeys: ["eciDelimitation"] },
  { id: "legislature-governor-assembly", statement: "Punjab's Legislature consists of the Governor and the Legislative Assembly.", sourceKeys: ["constitutionIndia"] },
  { id: "assembly-term", statement: "A State Legislative Assembly normally continues for five years unless sooner dissolved.", sourceKeys: ["constitutionIndia"] },
  { id: "speaker-deputy", statement: "The Legislative Assembly chooses a Speaker and Deputy Speaker from among its members.", sourceKeys: ["constitutionIndia"] },

  { id: "executive-governor", statement: "The executive power of a State is vested in the Governor under the Constitution.", sourceKeys: ["constitutionIndia"] },
  { id: "cm-appointed-governor", statement: "The Chief Minister is appointed by the Governor.", sourceKeys: ["constitutionIndia"] },
  { id: "ministers-on-cm-advice", statement: "Other Ministers are appointed by the Governor on the advice of the Chief Minister.", sourceKeys: ["constitutionIndia"] },
  { id: "council-aid-advice", statement: "A Council of Ministers with the Chief Minister at its head aids and advises the Governor, except where the Constitution requires discretion.", sourceKeys: ["constitutionIndia"] },
  { id: "collective-responsibility", statement: "The Council of Ministers is collectively responsible to the Legislative Assembly of the State.", sourceKeys: ["constitutionIndia"] },
  { id: "advocate-general", statement: "The Governor appoints the Advocate-General for the State under Article 165.", sourceKeys: ["constitutionIndia"] },

  { id: "lok-sabha-13", statement: "Punjab has 13 Lok Sabha constituencies under the current delimitation framework.", sourceKeys: ["eciDelimitation"] },
  { id: "lok-sabha-sc-4", statement: "Four of Punjab's 13 Lok Sabha constituencies are reserved for Scheduled Castes under the current delimitation framework.", sourceKeys: ["eciDelimitation"] },
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
