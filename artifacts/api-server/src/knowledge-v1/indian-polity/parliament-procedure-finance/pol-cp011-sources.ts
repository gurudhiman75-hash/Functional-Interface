export type PolCp011Source = {
  sourceId: string;
  sourceType: "official";
  title: string;
  url: string;
  notes: string;
};

export const POL_CP011_SOURCES_V1: readonly PolCp011Source[] = Object.freeze([
  {
    sourceId: "LEGISLATIVE-DEPT-CONSTITUTION-2025",
    sourceType: "official",
    title: "The Constitution of India — Legislative Department (as on 11 November 2025)",
    url: "https://www.legislative.gov.in/static/uploads/2025/07/359f70a69695affb9d72f8393102bd2e.pdf",
    notes: "Primary constitutional source for Articles 107–117 and linked Article 368 joint-sitting exclusion.",
  },
  {
    sourceId: "DIGITAL-SANSAD-LEGISLATION-INTRO",
    sourceType: "official",
    title: "Digital Sansad — Legislation: Introduction",
    url: "https://sansad.in/ls/legislation/introduction",
    notes: "Official Lok Sabha source for stages of Bills, Government/Private Member Bills, joint sitting and assent procedure.",
  },
  {
    sourceId: "LOK-SABHA-RULES-2024",
    sourceType: "official",
    title: "Rules of Procedure and Conduct of Business in Lok Sabha — Seventeenth Edition, May 2024",
    url: "https://sansad.in/uploads/Rules_of_Procedures_E_9d8fd0f4c3.pdf?updated_at=2022-",
    notes: "Official Lok Sabha Secretariat rules for demands for grants, cut motions and vote-on-account procedure.",
  },
  {
    sourceId: "DIGITAL-SANSAD-LOK-SABHA-FAQ",
    sourceType: "official",
    title: "Digital Sansad — Lok Sabha FAQ",
    url: "https://sansad.in/ls/faq",
    notes: "Official Lok Sabha source for joint-sitting presiding officer and related parliamentary procedure facts.",
  },
  {
    sourceId: "LOK-SABHA-MANUAL-PROCEDURE",
    sourceType: "official",
    title: "Manual of Parliamentary Procedures in the Government of India",
    url: "https://sansad.in/uploads/English_Manual_GOI_E_ccb7bb7ef7.pdf?updated_at=2022-09-13T06%3A19%3A45.349Z",
    notes: "Official parliamentary manual source for the term and operation of guillotine in demands-for-grants procedure.",
  },
]);
